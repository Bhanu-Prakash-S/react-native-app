// // // // // app/lesson/[id].tsx

import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import { VideoView, useVideoPlayer } from "expo-video";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  PanResponder,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  Colors,
  FontFamily,
  FontSize,
  Layout,
  Radii,
  Shadows,
  Spacing,
} from "../../constants/theme";
import { useAuthStore, useProgressStore } from "../../lib/store";
import {
  Lesson,
  LessonWithContext,
  getLessonWithContext,
  getLessons,
  upsertProgress,
} from "../../lib/supabase";
import { formatDuration } from "../../lib/utils";

const SAVE_INTERVAL_MS = 10_000;
const CONTROLS_HIDE_MS = 3_500;

export default function LessonScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, profile } = useAuthStore();
  const { setProgress } = useProgressStore();

  // ── Lesson data ──────────────────────────────────────────────────────────
  const [lesson, setLesson] = useState<LessonWithContext | null>(null);
  const [chapterLessons, setChapterLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Player UI state ──────────────────────────────────────────────────────
  const videoViewRef = useRef<VideoView>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playerStatus, setPlayerStatus] = useState<string>("idle");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [currentSecs, setCurrentSecs] = useState(0);
  const [durationSecs, setDurationSecs] = useState(0);

  // Screen width for 16:9 box — updated on rotation
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width,
  );
  useEffect(() => {
    const sub = Dimensions.addEventListener("change", ({ window }) => {
      setScreenWidth(window.width);
    });
    return () => sub.remove();
  }, []);
  const videoH = (screenWidth * 9) / 16;

  // ── Stable refs (safe to read inside PanResponder / intervals) ───────────
  const currentSecsRef = useRef(0);
  const durationSecsRef = useRef(0);
  const lastSavedRef = useRef(0);
  const saveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lessonRef = useRef<LessonWithContext | null>(null);
  // Guard: resume seek must fire ONCE only. Every seek triggers a new
  // readyToPlay event (player re-buffers after seek), which would
  // re-trigger the seek → infinite loop + play/pause flicker.
  const hasResumed = useRef(false);

  // ── Keep durationSecsRef in sync ─────────────────────────────────────────
  useEffect(() => {
    durationSecsRef.current = durationSecs;
  }, [durationSecs]);

  // ─────────────────────────────────────────────────────────────────────────
  // KEY FIX #1:
  // Always initialise useVideoPlayer with null so the player instance is
  // STABLE for the entire lifetime of this screen.
  // We call player.replace(source) once the lesson URL is ready.
  // This prevents "shared object already released" because the PanResponder
  // (frozen in useRef) always talks to the same player object.
  // ─────────────────────────────────────────────────────────────────────────
  const player = useVideoPlayer(null, (p) => {
    p.timeUpdateEventInterval = 0.5;
  });

  // ── Load lesson then replace source ─────────────────────────────────────
  useEffect(() => {
    if (!id) return;
    getLessonWithContext(id).then(async (data) => {
      setLesson(data);
      lessonRef.current = data;

      if (data?.mux_playback_id) {
        const url = `https://stream.mux.com/${data.mux_playback_id}.m3u8`;
        // Reset resume guard so the new lesson seeks to its own saved position
        hasResumed.current = false;
        // replace() keeps the same player instance — no release/recreate

        try {
          await player.replaceAsync({ uri: url });
        } catch (_) {}
      }

      if (data?.chapter_id) {
        const lessons = await getLessons(data.chapter_id);
        setChapterLessons(lessons);
      }
      setLoading(false);
    });

    return () => {
      // Pause on unmount so audio doesn't ghost after navigation
      try {
        player.pause();
      } catch (_) {}
    };
  }, [id]);

  // ── Subscribe to player events ───────────────────────────────────────────
  useEffect(() => {
    const subs = [
      player.addListener("playingChange", ({ isPlaying: p }) => {
        setIsPlaying(p);
      }),

      player.addListener("mutedChange", ({ muted }) => {
        setIsMuted(muted);
      }),

      player.addListener("statusChange", ({ status }) => {
        setPlayerStatus(status);
        if (status === "readyToPlay") {
          const dur = player.duration;
          setDurationSecs(dur);
          durationSecsRef.current = dur;

          // Resume seek — only ever runs ONCE per screen mount.
          // Seeking triggers a new readyToPlay after buffering; without
          // this guard that fires another seek → infinite loop.
          if (!hasResumed.current) {
            hasResumed.current = true;
            const saved =
              useProgressStore.getState().progressMap[
                lessonRef.current?.id ?? ""
              ];
            if (saved?.watched_seconds > 5) {
              setTimeout(() => {
                try {
                  player.currentTime = saved.watched_seconds;
                  setCurrentSecs(saved.watched_seconds);
                  currentSecsRef.current = saved.watched_seconds;
                } catch (_) {}
              }, 300);
            }
          }
        }
      }),

      player.addListener("timeUpdate", ({ currentTime }) => {
        // Only update from events when NOT scrubbing — scrubber drives display
        if (!isScrubbing.current) {
          setCurrentSecs(currentTime);
          currentSecsRef.current = currentTime;
        }
      }),

      player.addListener("playToEnd", () => {
        saveProgress(true);
        setIsPlaying(false);
        setShowControls(true);
      }),
    ];

    return () => subs.forEach((s) => s.remove());
  }, [player]);

  // ── Progress saving ──────────────────────────────────────────────────────
  const saveProgress = useCallback(
    async (forceSave = false) => {
      if (!user || !lessonRef.current) return;
      const secs = currentSecsRef.current;
      const dur = durationSecsRef.current;
      if (!forceSave && Math.abs(secs - lastSavedRef.current) < 5) return;
      const isCompleted = dur > 0 && secs / dur > 0.9;
      const result = await upsertProgress(
        user.id,
        lessonRef.current.id,
        secs,
        isCompleted,
      );
      if (result) {
        setProgress(lessonRef.current.id, result);
        lastSavedRef.current = secs;
      }
    },
    [user],
  );

  useEffect(() => {
    if (isPlaying) {
      saveTimerRef.current = setInterval(
        () => saveProgress(),
        SAVE_INTERVAL_MS,
      );
    } else {
      if (saveTimerRef.current) clearInterval(saveTimerRef.current);
    }
    return () => {
      if (saveTimerRef.current) clearInterval(saveTimerRef.current);
    };
  }, [isPlaying, saveProgress]);

  // Save + restore portrait on unmount
  useEffect(() => {
    return () => {
      saveProgress(true);
      if (saveTimerRef.current) clearInterval(saveTimerRef.current);
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
      ScreenOrientation.lockAsync(
        ScreenOrientation.OrientationLock.PORTRAIT_UP,
      ).catch(() => {});
    };
  }, [saveProgress]);

  // ── Controls auto-hide ───────────────────────────────────────────────────
  const resetControlsTimer = useCallback(() => {
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(
      () => setShowControls(false),
      CONTROLS_HIDE_MS,
    );
  }, []);

  const handleVideoTap = () => {
    setShowControls((v) => {
      if (!v) resetControlsTimer();
      return !v;
    });
  };

  // ── Playback controls ────────────────────────────────────────────────────
  const togglePlayPause = () => {
    try {
      if (player.playing) {
        player.pause();
      } else {
        player.play();
        resetControlsTimer();
      }
    } catch (_) {}
  };

  const skip = (deltaSecs: number) => {
    try {
      const newSecs = Math.max(
        0,
        Math.min(durationSecsRef.current, currentSecsRef.current + deltaSecs),
      );
      player.currentTime = newSecs;
      setCurrentSecs(newSecs);
      currentSecsRef.current = newSecs;
      resetControlsTimer();
    } catch (_) {}
  };

  const toggleMute = () => {
    try {
      player.muted = !player.muted;
    } catch (_) {}
  };

  // ── Fullscreen ───────────────────────────────────────────────────────────
  const toggleFullscreen = async () => {
    try {
      if (isFullscreen) {
        await videoViewRef.current?.exitFullscreen();
      } else {
        await videoViewRef.current?.enterFullscreen();
      }
    } catch (_) {}
  };

  // ─────────────────────────────────────────────────────────────────────────
  // KEY FIX #2:
  // Track scrubbing with a REF (not state) so the PanResponder callbacks
  // always see the latest value without stale closures.
  // Derive a single displaySecs value:
  //   - While dragging → scrubPct * duration  (shows WHERE you're seeking to)
  //   - Otherwise      → currentSecs          (shows live playback position)
  // This way the left timestamp always matches the scrubber thumb.
  // ─────────────────────────────────────────────────────────────────────────
  const isScrubbing = useRef(false);
  const [scrubPct, setScrubPct] = useState(0);
  const scrubBarWidth = useRef(screenWidth - Layout.screenPaddingH * 2 - 64);

  // What the scrubber thumb + left timestamp should show
  const scrubProgress = isScrubbing.current
    ? scrubPct
    : durationSecs > 0
      ? currentSecs / durationSecs
      : 0;

  const displaySecs = isScrubbing.current
    ? scrubPct * durationSecs
    : currentSecs;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (e) => {
        isScrubbing.current = true;
        const pct = Math.max(
          0,
          Math.min(1, e.nativeEvent.locationX / scrubBarWidth.current),
        );
        setScrubPct(pct);
      },

      onPanResponderMove: (e) => {
        const pct = Math.max(
          0,
          Math.min(1, e.nativeEvent.locationX / scrubBarWidth.current),
        );
        setScrubPct(pct);
      },

      onPanResponderRelease: (e) => {
        const pct = Math.max(
          0,
          Math.min(1, e.nativeEvent.locationX / scrubBarWidth.current),
        );
        const newSecs = pct * durationSecsRef.current;

        // Update display state immediately — before the seek event fires
        setScrubPct(pct);
        setCurrentSecs(newSecs);
        currentSecsRef.current = newSecs;

        // Seek the player
        try {
          player.currentTime = newSecs;
        } catch (_) {}

        // Release scrub mode AFTER state is set so display doesn't flicker
        setTimeout(() => {
          isScrubbing.current = false;
          setScrubPct(0);
        }, 80);

        resetControlsTimer();
      },

      onPanResponderTerminate: () => {
        isScrubbing.current = false;
        setScrubPct(0);
      },
    }),
  ).current;

  // ── Derived display values ────────────────────────────────────────────────
  const progressPct =
    durationSecs > 0 ? Math.round((currentSecs / durationSecs) * 100) : 0;
  const isBuffering = playerStatus === "loading";
  const hasMuxUrl = !!lesson?.mux_playback_id;

  // ── Render ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  if (!lesson) {
    return (
      <View style={styles.loadingScreen}>
        <Text style={styles.errorText}>Lesson not found.</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.errorLink}>← Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0B09" />

      {/* ── Video container ── */}
      <View
        style={[styles.videoWrapper, { height: videoH, marginTop: insets.top }]}
      >
        {hasMuxUrl ? (
          <>
            <VideoView
              ref={videoViewRef}
              player={player}
              style={styles.video}
              contentFit="contain"
              nativeControls={false}
              fullscreenOptions={{ enable: false, orientation: "landscape" }}
              onFullscreenEnter={() => setIsFullscreen(true)}
              onFullscreenExit={() => setIsFullscreen(false)}
            />

            {/* Buffering overlay */}
            {isBuffering && (
              <View style={styles.bufferingOverlay}>
                <ActivityIndicator color={Colors.white} size="large" />
              </View>
            )}

            {/* Tap area + custom controls */}
            <TouchableWithoutFeedback onPress={handleVideoTap}>
              <View style={StyleSheet.absoluteFill}>
                {showControls && (
                  <LinearGradient
                    colors={[
                      "rgba(0,0,0,0.72)",
                      "transparent",
                      "transparent",
                      "rgba(0,0,0,0.82)",
                    ]}
                    locations={[0, 0.28, 0.65, 1]}
                    style={StyleSheet.absoluteFill}
                    pointerEvents="box-none"
                  >
                    {/* Top bar */}
                    <View style={styles.topBar}>
                      <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.iconBtn}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      >
                        <Text style={styles.iconText}>✕</Text>
                      </TouchableOpacity>
                      <Text style={styles.videoTitle} numberOfLines={1}>
                        {lesson.title}
                      </Text>
                      <TouchableOpacity
                        onPress={toggleMute}
                        style={styles.iconBtn}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      >
                        <Text style={styles.iconText}>
                          {isMuted ? "🔇" : "🔊"}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Centre controls */}
                    <View style={styles.centerRow} pointerEvents="box-none">
                      <TouchableOpacity
                        onPress={() => skip(-10)}
                        style={styles.skipBtn}
                        hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                      >
                        <Text style={styles.skipEmoji}>⏪</Text>
                        <Text style={styles.skipLabel}>10</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={togglePlayPause}
                        style={styles.playBtn}
                      >
                        <Text style={styles.playIcon}>
                          {isPlaying ? "⏸" : "▶"}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => skip(10)}
                        style={styles.skipBtn}
                        hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
                      >
                        <Text style={styles.skipEmoji}>⏩</Text>
                        <Text style={styles.skipLabel}>10</Text>
                      </TouchableOpacity>
                    </View>

                    {/* Bottom bar — timestamp uses displaySecs for sync */}
                    <View style={styles.bottomBar}>
                      <Text style={styles.timeLabel}>
                        {formatDuration(displaySecs)}
                      </Text>

                      {/* Scrubber */}
                      <View
                        style={styles.scrubberTrack}
                        {...panResponder.panHandlers}
                        onLayout={(e) => {
                          scrubBarWidth.current = e.nativeEvent.layout.width;
                        }}
                      >
                        <View style={styles.trackBg} />
                        <View
                          style={[
                            styles.trackFill,
                            { width: `${scrubProgress * 100}%` },
                          ]}
                        />
                        <View
                          style={[
                            styles.thumb,
                            { left: `${Math.min(scrubProgress * 100, 98)}%` },
                          ]}
                        />
                      </View>

                      <Text style={styles.timeLabel}>
                        {formatDuration(durationSecs)}
                      </Text>

                      <TouchableOpacity
                        onPress={toggleFullscreen}
                        style={styles.iconBtn}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                      >
                        <Text style={styles.iconText}>
                          {isFullscreen ? "⊡" : "⊞"}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                )}
              </View>
            </TouchableWithoutFeedback>
          </>
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderEmoji}>🎬</Text>
            <Text style={styles.placeholderTitle}>Video Coming Soon</Text>
            <Text style={styles.placeholderSub}>
              This lesson hasn't been uploaded yet.{"\n"}Check back later.
            </Text>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginTop: Spacing[3] }}
            >
              <Text style={styles.errorLink}>← Go back</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* ── Info panel ── */}
      <ScrollView
        style={styles.infoPanel}
        contentContainerStyle={[
          styles.infoPanelContent,
          { paddingBottom: insets.bottom + Spacing[8] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.breadcrumb}>
          {lesson.subject_title} › {lesson.chapter_title}
        </Text>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>

        {/* Meta pills */}
        <View style={styles.metaRow}>
          <View style={styles.metaPill}>
            <Text style={styles.metaText}>
              ⏱️ {formatDuration(lesson.duration_seconds)}
            </Text>
          </View>
          {progressPct > 0 && (
            <View style={[styles.metaPill, styles.metaPillPrimary]}>
              <Text style={[styles.metaText, { color: Colors.primary }]}>
                {progressPct >= 90
                  ? "✅  Completed"
                  : `▶  ${progressPct}% watched`}
              </Text>
            </View>
          )}
          {lesson.is_free && (
            <View style={[styles.metaPill, styles.metaPillFree]}>
              <Text style={[styles.metaText, { color: Colors.success }]}>
                🆓 Free
              </Text>
            </View>
          )}
        </View>

        {/* Progress bar */}
        {durationSecs > 0 && progressPct > 0 && (
          <View style={styles.progressBarBg}>
            <View
              style={[styles.progressBarFill, { width: `${progressPct}%` }]}
            />
          </View>
        )}

        {/* Description */}
        {!!lesson.description && (
          <View style={styles.descCard}>
            <Text style={styles.descLabel}>ABOUT THIS LESSON</Text>
            <Text style={styles.descText}>{lesson.description}</Text>
          </View>
        )}

        {/* More in chapter */}
        {chapterLessons.length > 1 && (
          <View style={styles.moreCard}>
            <Text style={styles.moreSectionTitle}>More in this chapter</Text>
            {chapterLessons.slice(0, 5).map((l) => {
              const isCurrent = l.id === lesson.id;
              const isLocked = !l.is_free && !profile?.is_paid;
              const prog = useProgressStore.getState().progressMap[l.id];
              const pct =
                l.duration_seconds > 0 && prog
                  ? Math.round(
                      (prog.watched_seconds / l.duration_seconds) * 100,
                    )
                  : 0;

              return (
                <TouchableOpacity
                  key={l.id}
                  style={[styles.moreRow, isCurrent && styles.moreRowCurrent]}
                  onPress={() => {
                    if (isLocked) {
                      router.push("/course-info");
                      return;
                    }
                    if (!isCurrent) router.replace(`/lesson/${l.id}`);
                  }}
                  activeOpacity={isCurrent ? 1 : 0.8}
                  disabled={isCurrent}
                >
                  <View
                    style={[
                      styles.moreIcon,
                      isCurrent && styles.moreIconCurrent,
                    ]}
                  >
                    <Text style={styles.moreIconText}>
                      {isLocked ? "🔒" : isCurrent ? "▶" : "○"}
                    </Text>
                  </View>
                  <View style={styles.moreInfo}>
                    <Text
                      style={[
                        styles.moreTitle,
                        isCurrent && { color: Colors.primary },
                        isLocked && { color: Colors.muted },
                      ]}
                      numberOfLines={1}
                    >
                      {l.title}
                    </Text>
                    <Text style={styles.moreMeta}>
                      {formatDuration(l.duration_seconds)}
                      {pct > 0 ? `  ·  ${pct}%` : ""}
                      {l.is_free ? "  ·  Free" : ""}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0D0B09" },
  loadingScreen: {
    flex: 1,
    backgroundColor: "#0D0B09",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[4],
  },
  errorText: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.base,
    color: Colors.white,
  },
  errorLink: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.base,
    color: Colors.primary,
  },

  videoWrapper: {
    width: "100%",
    backgroundColor: "#0D0B09",
    overflow: "hidden",
  },
  video: { width: "100%", height: "100%" },

  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[4],
  },
  placeholderEmoji: { fontSize: 52 },
  placeholderTitle: {
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize.xl,
    color: Colors.white,
  },
  placeholderSub: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.base,
    color: Colors.white + "66",
    textAlign: "center",
    lineHeight: FontSize.base * 1.6,
  },

  bufferingOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing[4],
    paddingTop: Spacing[3],
    paddingBottom: Spacing[2],
    gap: Spacing[3],
  },
  videoTitle: {
    flex: 1,
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.base,
    color: Colors.white,
    textAlign: "center",
  },
  centerRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[10],
  },
  skipBtn: { alignItems: "center", gap: 2 },
  skipEmoji: { fontSize: 24, color: Colors.white },
  skipLabel: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.xs,
    color: Colors.white + "BB",
  },
  playBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: { fontSize: 28, color: Colors.white, marginLeft: 3 },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: { fontSize: 20, color: Colors.white },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[4],
    gap: Spacing[2],
  },
  timeLabel: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.xs,
    color: Colors.white,
    minWidth: 38,
    textAlign: "center",
  },
  scrubberTrack: {
    flex: 1,
    height: 28,
    justifyContent: "center",
    position: "relative",
  },
  trackBg: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "rgba(255,255,255,0.35)",
    borderRadius: Radii.full,
  },
  trackFill: {
    position: "absolute",
    left: 0,
    height: 3,
    backgroundColor: Colors.accent,
    borderRadius: Radii.full,
  },
  thumb: {
    position: "absolute",
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.white,
    marginLeft: -7,
    top: "50%",
    marginTop: -7,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 3,
  },

  infoPanel: { flex: 1, backgroundColor: Colors.background },
  infoPanelContent: {
    paddingHorizontal: Layout.screenPaddingH,
    paddingTop: Spacing[5],
  },
  breadcrumb: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.xs,
    color: Colors.primary,
    letterSpacing: 0.3,
    marginBottom: Spacing[2],
  },
  lessonTitle: {
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize["2xl"],
    color: Colors.text,
    lineHeight: FontSize["2xl"] * 1.1,
    marginBottom: Spacing[4],
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing[2],
    marginBottom: Spacing[4],
  },
  metaPill: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1] + 2,
    borderRadius: Radii.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  metaPillPrimary: {
    backgroundColor: Colors.primary + "15",
    borderColor: Colors.primary + "40",
  },
  metaPillFree: {
    backgroundColor: Colors.success + "15",
    borderColor: Colors.success + "40",
  },
  metaText: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.sm,
    color: Colors.muted,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: Radii.full,
    marginBottom: Spacing[5],
    overflow: "hidden",
  },
  progressBarFill: {
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: Radii.full,
  },
  descCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing[5],
    marginBottom: Spacing[5],
    ...Shadows.sm,
  },
  descLabel: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.xs,
    letterSpacing: 1.5,
    color: Colors.muted,
    marginBottom: Spacing[2],
  },
  descText: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.base,
    color: Colors.muted,
    lineHeight: FontSize.base * 1.6,
  },
  moreCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    overflow: "hidden",
    marginBottom: Spacing[4],
    ...Shadows.sm,
  },
  moreSectionTitle: {
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize.lg,
    color: Colors.text,
    padding: Spacing[4],
    paddingBottom: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  moreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    padding: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + "50",
  },
  moreRowCurrent: { backgroundColor: Colors.primary + "08" },
  moreIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  moreIconCurrent: { backgroundColor: Colors.primary + "25" },
  moreIconText: { fontSize: 15 },
  moreInfo: { flex: 1, gap: 2 },
  moreTitle: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.base,
    color: Colors.text,
  },
  moreMeta: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.xs,
    color: Colors.muted,
  },
});
