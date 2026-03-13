// // app/lesson/[id].tsx

import { useLocalSearchParams, useRouter } from "expo-router";
import {
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
    Colors,
    FontFamily,
    FontSize,
    Layout,
    Radii,
    Spacing
} from "../../constants/theme";

const { width: SCREEN_W } = Dimensions.get("window");
const VIDEO_H = (SCREEN_W * 9) / 16;

const LESSON_DATA: Record<
  string,
  { title: string; chapter: string; duration: string }
> = {
  l1: {
    title: "Stone Age Civilizations",
    chapter: "Prehistoric India",
    duration: "18 min",
  },
  l2: {
    title: "Chalcolithic Period",
    chapter: "Prehistoric India",
    duration: "14 min",
  },
  l3: {
    title: "Megalithic Culture",
    chapter: "Prehistoric India",
    duration: "22 min",
  },
  l5: {
    title: "Discovery & Excavation",
    chapter: "Indus Valley",
    duration: "16 min",
  },
  "1": {
    title: "The Maurya Empire & Ashoka",
    chapter: "Ancient History · Ch. 2",
    duration: "24 min",
  },
};

export default function LessonScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const lesson = LESSON_DATA[id ?? "1"] ?? {
    title: "Lesson Title",
    chapter: "Chapter Name",
    duration: "—",
  };

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      {/* Dark header */}
      <View style={[styles.header, { paddingTop: insets.top + Spacing[2] }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {lesson.title}
        </Text>
        <View style={styles.backBtn} />
      </View>

      {/* 16:9 video placeholder */}
      <View style={[styles.videoBox, { height: VIDEO_H }]}>
        <View style={styles.playCircle}>
          <Text style={styles.playIcon}>▶</Text>
        </View>
        <Text style={styles.videoPlaceholderText}>
          Video Player — Coming in Phase 4
        </Text>
      </View>

      {/* Lesson info */}
      <View style={styles.infoCard}>
        <Text style={styles.chapterBreadcrumb}>📚 {lesson.chapter}</Text>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaPill}>
            <Text style={styles.metaText}>⏱️ {lesson.duration}</Text>
          </View>
          <View style={styles.metaPill}>
            <Text style={styles.metaText}>🆓 Free Preview</Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Your progress</Text>
            <Text style={styles.progressPct}>0%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: "0%" }]} />
          </View>
        </View>

        {/* Description */}
        <Text style={styles.descLabel}>ABOUT THIS LESSON</Text>
        <Text style={styles.descText}>
          This lesson covers key concepts and historical events relevant to
          competitive exams. Watch the full video and review the notes to
          maximize retention before your exam.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.text },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Layout.screenPaddingH,
    paddingBottom: Spacing[3],
    backgroundColor: Colors.text,
  },
  backBtn: { width: 40, alignItems: "center" },
  backText: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.lg,
    color: Colors.white,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.base,
    color: Colors.white,
  },
  videoBox: {
    width: SCREEN_W,
    backgroundColor: "#2A2724",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing[4],
  },
  playCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary + "CC",
    alignItems: "center",
    justifyContent: "center",
  },
  playIcon: { fontSize: 28, color: Colors.white, marginLeft: 4 },
  videoPlaceholderText: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.sm,
    color: Colors.white + "55",
  },
  infoCard: {
    flex: 1,
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radii["2xl"],
    borderTopRightRadius: Radii["2xl"],
    marginTop: -Radii["2xl"],
    padding: Layout.screenPaddingH,
    paddingTop: Spacing[6],
  },
  chapterBreadcrumb: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.sm,
    color: Colors.muted,
    marginBottom: Spacing[2],
  },
  lessonTitle: {
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize["2xl"],
    color: Colors.text,
    marginBottom: Spacing[4],
  },
  metaRow: { flexDirection: "row", gap: Spacing[3], marginBottom: Spacing[5] },
  metaPill: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1] + 2,
    borderRadius: Radii.full,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  metaText: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.sm,
    color: Colors.muted,
  },
  progressSection: { marginBottom: Spacing[5] },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing[2],
  },
  progressLabel: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.sm,
    color: Colors.muted,
  },
  progressPct: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: Radii.full,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 6,
    backgroundColor: Colors.primary,
    borderRadius: Radii.full,
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
});

// // Mux-powered video player screen
// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import {
//   View, Text, StyleSheet, TouchableOpacity, Dimensions,
//   StatusBar, Platform, ActivityIndicator, ScrollView,
// } from 'react-native';
// import { router, useLocalSearchParams } from 'expo-router';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
// import * as ScreenOrientation from 'expo-screen-orientation';
// import { useAuthStore, useProgressStore } from '../../lib/store';
// import { supabase, upsertProgress, getLessons } from '../../lib/supabase';
// import { Colors, Typography, Radii, Shadows } from '../../constants/theme';
// import { formatDuration } from '../../lib/utils';

// const { width: SCREEN_WIDTH } = Dimensions.get('window');
// const VIDEO_HEIGHT = SCREEN_WIDTH * (9 / 16); // 16:9 aspect ratio

// // ── Mux stream URL builder ───────────────────────────────────────────────────
// function getMuxStreamUrl(playbackId: string) {
//   return `https://stream.mux.com/${playbackId}.m3u8`;
// }
// function getMuxThumbnail(playbackId: string) {
//   return `https://image.mux.com/${playbackId}/thumbnail.jpg?time=5`;
// }

// export default function LessonScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const insets = useSafeAreaInsets();
//   const { profile } = useAuthStore();
//   const { setProgress } = useProgressStore();

//   const videoRef = useRef<Video>(null);
//   const progressSaveTimer = useRef<NodeJS.Timeout | null>(null);

//   const [lesson, setLesson] = useState<any>(null);
//   const [relatedLessons, setRelatedLessons] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [isBuffering, setIsBuffering] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [showControls, setShowControls] = useState(true);
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);
//   const controlsTimer = useRef<NodeJS.Timeout | null>(null);

//   useEffect(() => {
//     loadLesson();
//     return () => {
//       // Save progress on unmount
//       if (progressSaveTimer.current) clearTimeout(progressSaveTimer.current);
//       saveProgress(currentTime);
//     };
//   }, [id]);

//   const loadLesson = async () => {
//     const { data } = await supabase
//       .from('lessons')
//       .select('*, chapters(id, title, subject_id)')
//       .eq('id', id)
//       .single();
//     setLesson(data);

//     if (data?.chapter_id) {
//       const lessons = await getLessons(data.chapter_id);
//       setRelatedLessons(lessons.filter((l: any) => l.id !== id));
//     }
//     setLoading(false);
//   };

//   const saveProgress = useCallback(async (watchedSecs: number) => {
//     if (!profile?.id || !id || watchedSecs < 5) return;
//     const isCompleted = duration > 0 && watchedSecs / duration > 0.9;
//     await upsertProgress(profile.id, id, Math.floor(watchedSecs), isCompleted);
//     setProgress(id, {
//       id: '',
//       user_id: profile.id,
//       lesson_id: id,
//       watched_seconds: Math.floor(watchedSecs),
//       is_completed: isCompleted,
//       last_watched_at: new Date().toISOString(),
//     });
//   }, [profile, id, duration]);

//   const handlePlaybackStatus = (status: AVPlaybackStatus) => {
//     if (!status.isLoaded) return;
//     setIsPlaying(status.isPlaying);
//     setIsBuffering(status.isBuffering);
//     setCurrentTime(status.positionMillis / 1000);
//     if (status.durationMillis) setDuration(status.durationMillis / 1000);

//     // Auto-save progress every 10 seconds
//     if (status.isPlaying) {
//       if (progressSaveTimer.current) clearTimeout(progressSaveTimer.current);
//       progressSaveTimer.current = setTimeout(() => {
//         saveProgress(status.positionMillis / 1000);
//       }, 10000);
//     }
//   };

//   const togglePlay = async () => {
//     if (!videoRef.current) return;
//     if (isPlaying) {
//       await videoRef.current.pauseAsync();
//     } else {
//       await videoRef.current.playAsync();
//     }
//     showControlsTemporarily();
//   };

//   const seek = async (seconds: number) => {
//     if (!videoRef.current) return;
//     const newTime = Math.max(0, Math.min(currentTime + seconds, duration));
//     await videoRef.current.setPositionAsync(newTime * 1000);
//     showControlsTemporarily();
//   };

//   const showControlsTemporarily = () => {
//     setShowControls(true);
//     if (controlsTimer.current) clearTimeout(controlsTimer.current);
//     controlsTimer.current = setTimeout(() => setShowControls(false), 3500);
//   };

//   const toggleFullscreen = async () => {
//     if (!isFullscreen) {
//       await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
//     } else {
//       await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
//     }
//     setIsFullscreen(!isFullscreen);
//   };

//   const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <StatusBar hidden={isFullscreen} />

//       {/* ── Video Player ── */}
//       <TouchableOpacity
//         style={[styles.videoWrapper, isFullscreen && styles.videoWrapperFullscreen]}
//         activeOpacity={1}
//         onPress={showControlsTemporarily}
//       >
//         {lesson?.mux_playback_id ? (
//           <Video
//             ref={videoRef}
//             source={{ uri: getMuxStreamUrl(lesson.mux_playback_id) }}
//             style={styles.video}
//             resizeMode={ResizeMode.CONTAIN}
//             onPlaybackStatusUpdate={handlePlaybackStatus}
//             shouldPlay={false}
//             isLooping={false}
//             isMuted={isMuted}
//             useNativeControls={false}
//           />
//         ) : (
//           /* Placeholder when no Mux ID is set yet */
//           <LinearGradient
//             colors={['#1C1A17', '#3D2B1F']}
//             style={styles.videoPlaceholder}
//           >
//             <Text style={styles.placeholderEmoji}>🎬</Text>
//             <Text style={styles.placeholderText}>Video not available yet</Text>
//           </LinearGradient>
//         )}

//         {/* Buffering indicator */}
//         {isBuffering && (
//           <View style={styles.bufferingOverlay}>
//             <ActivityIndicator size="large" color="#FFFFFF" />
//           </View>
//         )}

//         {/* Controls overlay */}
//         {showControls && (
//           <View style={styles.controlsOverlay}>
//             {/* Top bar */}
//             <LinearGradient
//               colors={['rgba(0,0,0,0.7)', 'transparent']}
//               style={styles.controlsTop}
//             >
//               <TouchableOpacity onPress={() => router.back()} style={styles.controlBtn}>
//                 <Text style={styles.controlIcon}>✕</Text>
//               </TouchableOpacity>
//               <Text style={styles.controlTitle} numberOfLines={1}>
//                 {lesson?.title}
//               </Text>
//               <TouchableOpacity onPress={() => setIsMuted(!isMuted)} style={styles.controlBtn}>
//                 <Text style={styles.controlIcon}>{isMuted ? '🔇' : '🔊'}</Text>
//               </TouchableOpacity>
//             </LinearGradient>

//             {/* Center controls */}
//             <View style={styles.controlsCenter}>
//               <TouchableOpacity style={styles.skipBtn} onPress={() => seek(-10)}>
//                 <Text style={styles.skipIcon}>⏪</Text>
//                 <Text style={styles.skipLabel}>10s</Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.playPauseBtn} onPress={togglePlay}>
//                 <Text style={styles.playPauseIcon}>{isPlaying ? '⏸' : '▶'}</Text>
//               </TouchableOpacity>

//               <TouchableOpacity style={styles.skipBtn} onPress={() => seek(10)}>
//                 <Text style={styles.skipIcon}>⏩</Text>
//                 <Text style={styles.skipLabel}>10s</Text>
//               </TouchableOpacity>
//             </View>

//             {/* Bottom bar: progress + time + fullscreen */}
//             <LinearGradient
//               colors={['transparent', 'rgba(0,0,0,0.7)']}
//               style={styles.controlsBottom}
//             >
//               <View style={styles.progressRow}>
//                 <Text style={styles.timeText}>{formatDuration(currentTime)}</Text>
//                 <View style={styles.progressTrack}>
//                   <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
//                   <View style={[styles.progressThumb, { left: `${progressPercent}%` }]} />
//                 </View>
//                 <Text style={styles.timeText}>{formatDuration(duration)}</Text>
//               </View>

//               <TouchableOpacity onPress={toggleFullscreen} style={styles.fullscreenBtn}>
//                 <Text style={styles.controlIcon}>{isFullscreen ? '⊡' : '⊞'}</Text>
//               </TouchableOpacity>
//             </LinearGradient>
//           </View>
//         )}
//       </TouchableOpacity>

//       {/* ── Lesson Info & Related (only in portrait) ── */}
//       {!isFullscreen && (
//         <ScrollView
//           contentContainerStyle={[styles.infoArea, { paddingBottom: insets.bottom + 24 }]}
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Lesson title */}
//           <View style={styles.lessonHeader}>
//             <Text style={styles.chapterLabel}>
//               {lesson?.chapters?.title}
//             </Text>
//             <Text style={styles.lessonTitle}>{lesson?.title}</Text>
//             <View style={styles.durationRow}>
//               <Text style={styles.durationText}>🕐 {formatDuration(lesson?.duration_seconds ?? 0)}</Text>
//               {progressPercent > 0 && (
//                 <Text style={styles.progressText}>
//                   {Math.round(progressPercent)}% watched
//                 </Text>
//               )}
//             </View>
//           </View>

//           {/* Description */}
//           {lesson?.description && (
//             <View style={styles.descriptionCard}>
//               <Text style={styles.descriptionTitle}>About this lesson</Text>
//               <Text style={styles.descriptionText}>{lesson.description}</Text>
//             </View>
//           )}

//           {/* Related lessons */}
//           {relatedLessons.length > 0 && (
//             <View style={styles.relatedSection}>
//               <Text style={styles.relatedTitle}>More in this chapter</Text>
//               {relatedLessons.slice(0, 5).map((related, idx) => (
//                 <TouchableOpacity
//                   key={related.id}
//                   style={styles.relatedCard}
//                   onPress={() => {
//                     if (!related.is_free && !profile?.is_paid) {
//                       router.push('/course-info');
//                       return;
//                     }
//                     router.replace(`/lesson/${related.id}`);
//                   }}
//                 >
//                   <View style={[
//                     styles.relatedNum,
//                     (!related.is_free && !profile?.is_paid) && styles.relatedNumLocked,
//                   ]}>
//                     <Text style={styles.relatedNumText}>
//                       {(!related.is_free && !profile?.is_paid) ? '🔒' : `${idx + 1}`}
//                     </Text>
//                   </View>
//                   <View style={styles.relatedInfo}>
//                     <Text style={styles.relatedName} numberOfLines={1}>{related.title}</Text>
//                     <Text style={styles.relatedDuration}>{formatDuration(related.duration_seconds)}</Text>
//                   </View>
//                 </TouchableOpacity>
//               ))}
//             </View>
//           )}
//         </ScrollView>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#1C1A17' },
//   loadingContainer: {
//     flex: 1,
//     backgroundColor: Colors.background,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   // Video
//   videoWrapper: {
//     width: SCREEN_WIDTH,
//     height: VIDEO_HEIGHT,
//     backgroundColor: '#000',
//     position: 'relative',
//   },
//   videoWrapperFullscreen: {
//     flex: 1,
//     height: undefined,
//   },
//   video: {
//     width: '100%',
//     height: '100%',
//   },
//   videoPlaceholder: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 12,
//   },
//   placeholderEmoji: { fontSize: 48 },
//   placeholderText: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.base,
//     color: 'rgba(255,255,255,0.6)',
//   },
//   bufferingOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor: 'rgba(0,0,0,0.3)',
//   },

//   // Controls
//   controlsOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: 'space-between',
//   },
//   controlsTop: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingTop: Platform.OS === 'ios' ? 48 : 16,
//     paddingBottom: 20,
//     gap: 12,
//   },
//   controlsCenter: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 40,
//   },
//   controlsBottom: {
//     paddingHorizontal: 16,
//     paddingBottom: 12,
//     gap: 8,
//   },
//   controlBtn: {
//     width: 36,
//     height: 36,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   controlIcon: { fontSize: 18, color: '#FFFFFF' },
//   controlTitle: {
//     flex: 1,
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.sm,
//     color: '#FFFFFF',
//     textAlign: 'center',
//   },
//   skipBtn: { alignItems: 'center', gap: 4 },
//   skipIcon: { fontSize: 28, color: '#FFFFFF' },
//   skipLabel: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.xs,
//     color: 'rgba(255,255,255,0.7)',
//   },
//   playPauseBtn: {
//     width: 64,
//     height: 64,
//     borderRadius: 32,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     alignItems: 'center',
//     justifyContent: 'center',
//     borderWidth: 2,
//     borderColor: 'rgba(255,255,255,0.5)',
//   },
//   playPauseIcon: { fontSize: 28, color: '#FFFFFF' },
//   progressRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   timeText: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.xs,
//     color: 'rgba(255,255,255,0.8)',
//     width: 40,
//   },
//   progressTrack: {
//     flex: 1,
//     height: 4,
//     backgroundColor: 'rgba(255,255,255,0.3)',
//     borderRadius: 2,
//     position: 'relative',
//   },
//   progressFill: {
//     height: 4,
//     backgroundColor: Colors.accent,
//     borderRadius: 2,
//   },
//   progressThumb: {
//     position: 'absolute',
//     width: 12,
//     height: 12,
//     borderRadius: 6,
//     backgroundColor: Colors.accent,
//     top: -4,
//     marginLeft: -6,
//   },
//   fullscreenBtn: { alignSelf: 'flex-end' },

//   // Lesson info
//   infoArea: {
//     backgroundColor: Colors.background,
//     paddingTop: 20,
//     paddingHorizontal: 20,
//     gap: 20,
//     flexGrow: 1,
//   },
//   lessonHeader: { gap: 8 },
//   chapterLabel: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.xs,
//     color: Colors.primary,
//     textTransform: 'uppercase',
//     letterSpacing: 1,
//   },
//   lessonTitle: {
//     fontFamily: Typography.heading,
//     fontSize: Typography.size['2xl'],
//     color: Colors.textPrimary,
//     lineHeight: 34,
//   },
//   durationRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 14,
//   },
//   durationText: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: Colors.textMuted,
//   },
//   progressText: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.sm,
//     color: Colors.accent,
//   },

//   // Description
//   descriptionCard: {
//     backgroundColor: Colors.surface,
//     borderRadius: Radii.lg,
//     padding: 16,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     gap: 8,
//     ...Shadows.sm,
//   },
//   descriptionTitle: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.base,
//     color: Colors.textPrimary,
//   },
//   descriptionText: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: Colors.textSecondary,
//     lineHeight: 22,
//   },

//   // Related
//   relatedSection: { gap: 12 },
//   relatedTitle: {
//     fontFamily: Typography.heading,
//     fontSize: Typography.size.lg,
//     color: Colors.textPrimary,
//   },
//   relatedCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: Colors.surface,
//     borderRadius: Radii.md,
//     padding: 12,
//     gap: 12,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     ...Shadows.sm,
//   },
//   relatedNum: {
//     width: 36,
//     height: 36,
//     borderRadius: Radii.full,
//     backgroundColor: Colors.primary + '15',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   relatedNumLocked: {
//     backgroundColor: Colors.surfaceMuted,
//   },
//   relatedNumText: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.sm,
//     color: Colors.primary,
//   },
//   relatedInfo: { flex: 1, gap: 2 },
//   relatedName: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.base,
//     color: Colors.textPrimary,
//   },
//   relatedDuration: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.xs,
//     color: Colors.textMuted,
//   },
// });
