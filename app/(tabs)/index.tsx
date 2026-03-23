// // // // app/(tabs)/index.tsx

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
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
  Shadows,
  Spacing,
} from "../../constants/theme";
import { useAuthStore, useProgressStore } from "../../lib/store";
import {
  getLastWatchedLesson,
  getSubjects,
  getUserProgress,
  LastWatchedLesson,
  Subject,
} from "../../lib/supabase";
import { formatDuration, getFirstName } from "../../lib/utils";

const FILTERS = ["All", "APTET", "DSC", "UPSC", "TSPSC"] as const;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { user, profile } = useAuthStore();
  const { setAllProgress } = useProgressStore();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [lastLesson, setLastLesson] = useState<LastWatchedLesson | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  const firstName = getFirstName(profile?.full_name ?? "there");

  const loadData = useCallback(async () => {
    try {
      // getSubjects() is a public query — doesn't need auth
      const subjectsData = await getSubjects();
      setSubjects(subjectsData);

      // These need a logged-in user
      if (user) {
        const [lastLessonData, progressData] = await Promise.all([
          getLastWatchedLesson(user.id),
          getUserProgress(user.id),
        ]);
        setLastLesson(lastLessonData);
        setAllProgress(progressData);
      }
    } catch (e) {
      console.error("HomeScreen loadData error:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const filteredSubjects =
    activeFilter === "All"
      ? subjects
      : subjects.filter((s) => s.exam_tags.includes(activeFilter));

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.root}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + Spacing[4],
          paddingBottom: insets.bottom + 100,
        },
      ]}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.primary}
        />
      }
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {greeting}, {firstName} 👋
          </Text>
          <Text style={styles.subGreeting}>Ready to study today?</Text>
        </View>
        <View style={styles.streakBadge}>
          <LinearGradient
            colors={[Colors.accent, Colors.accentDark]}
            style={styles.streakGradient}
          >
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakCount}>{profile?.streak_count ?? 0}</Text>
            <Text style={styles.streakLabel}>day{"\n"}streak</Text>
          </LinearGradient>
        </View>
      </View>

      {/* ── Upgrade Banner (only if not paid) ── */}
      {!profile?.is_paid && (
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => router.push("/course-info")}
          style={styles.bannerWrap}
        >
          <LinearGradient
            colors={[Colors.primary, Colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.banner}
          >
            <View style={styles.bannerLeft}>
              <Text style={styles.bannerTitle}>Unlock Full Access</Text>
              <Text style={styles.bannerSub}>
                All chapters · Mock tests · Notes
              </Text>
            </View>
            <View style={styles.bannerRight}>
              <Text style={styles.bannerPrice}>₹999</Text>
              <Text style={styles.bannerArrow}>→</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* ── Continue Watching ── */}
      {lastLesson && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Continue Watching</Text>
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => router.push(`/lesson/${lastLesson.lesson_id}`)}
            style={styles.continueCard}
          >
            <View style={styles.continueCardInner}>
              <View style={styles.continueThumbnail}>
                <Text style={styles.continueThumbnailEmoji}>▶️</Text>
              </View>
              <View style={styles.continueInfo}>
                <Text style={styles.continueChapter}>
                  {lastLesson.subject_title} · {lastLesson.chapter_title}
                </Text>
                <Text style={styles.continueTitle} numberOfLines={2}>
                  {lastLesson.lesson_title}
                </Text>
                {lastLesson.duration_seconds > 0 && (
                  <>
                    <View style={styles.progressBarBg}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${Math.min(
                              100,
                              Math.round(
                                (lastLesson.watched_seconds /
                                  lastLesson.duration_seconds) *
                                  100,
                              ),
                            )}%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {formatDuration(
                        Math.max(
                          0,
                          lastLesson.duration_seconds -
                            lastLesson.watched_seconds,
                        ),
                      )}{" "}
                      left ·{" "}
                      {Math.round(
                        (lastLesson.watched_seconds /
                          lastLesson.duration_seconds) *
                          100,
                      )}
                      % watched
                    </Text>
                  </>
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Filter Chips ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filtersRow}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterChip,
              activeFilter === f && styles.filterChipActive,
            ]}
            onPress={() => setActiveFilter(f)}
            activeOpacity={0.75}
          >
            <Text
              style={[
                styles.filterChipText,
                activeFilter === f && styles.filterChipTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Subject Cards ── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Subjects</Text>
        </View>

        {filteredSubjects.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyText}>
              {subjects.length === 0
                ? "No subjects found.\nCheck Supabase RLS on subjects table\nor verify seed data was inserted."
                : `No subjects tagged "${activeFilter}"`}
            </Text>
          </View>
        ) : (
          filteredSubjects.map((card) => (
            <TouchableOpacity
              key={card.id}
              activeOpacity={0.88}
              onPress={() => router.push(`/chapter/${card.id}`)}
              style={styles.subjectCard}
            >
              <View
                style={[
                  styles.subjectEmojiBg,
                  { backgroundColor: card.color + "18" },
                ]}
              >
                <Text style={styles.subjectEmoji}>{card.emoji}</Text>
              </View>
              <View style={styles.subjectInfo}>
                <Text style={styles.subjectTitle}>{card.title}</Text>
                <Text style={styles.subjectSub}>{card.subtitle}</Text>
                <View style={styles.subjectMeta}>
                  <Text style={styles.subjectChapters}>
                    📚 {card.chapter_count} chapters
                  </Text>
                  {card.exam_tags.slice(0, 2).map((tag) => (
                    <View key={tag} style={styles.tagPill}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <Text style={styles.subjectArrow}>›</Text>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Layout.screenPaddingH },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing[5],
  },
  greeting: {
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize["2xl"],
    color: Colors.text,
  },
  subGreeting: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.base,
    color: Colors.muted,
    marginTop: Spacing[1],
  },
  streakBadge: { borderRadius: Radii.lg, overflow: "hidden", ...Shadows.md },
  streakGradient: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    alignItems: "center",
    flexDirection: "row",
    gap: Spacing[1],
  },
  streakEmoji: { fontSize: 22 },
  streakCount: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.xl,
    color: Colors.white,
  },
  streakLabel: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.xs,
    color: Colors.white + "CC",
    lineHeight: FontSize.xs * 1.3,
  },
  bannerWrap: {
    borderRadius: Radii.xl,
    overflow: "hidden",
    marginBottom: Spacing[6],
    ...Shadows.lg,
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing[5],
  },
  bannerLeft: { flex: 1 },
  bannerTitle: {
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize.lg,
    color: Colors.white,
    marginBottom: Spacing[1],
  },
  bannerSub: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.sm,
    color: Colors.white + "BB",
  },
  bannerRight: { alignItems: "flex-end", gap: Spacing[1] },
  bannerPrice: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.xl,
    color: Colors.white,
  },
  bannerArrow: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.xl,
    color: Colors.white + "AA",
  },
  section: { marginBottom: Spacing[6] },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing[4],
  },
  sectionTitle: {
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize.lg,
    color: Colors.text,
    marginBottom: Spacing[4],
  },
  continueCard: {
    borderRadius: Radii.xl,
    overflow: "hidden",
    backgroundColor: Colors.surface,
    ...Shadows.md,
  },
  continueCardInner: {
    flexDirection: "row",
    padding: Spacing[4],
    gap: Spacing[4],
  },
  continueThumbnail: {
    width: 80,
    height: 70,
    borderRadius: Radii.md,
    backgroundColor: Colors.primary + "20",
    alignItems: "center",
    justifyContent: "center",
  },
  continueThumbnailEmoji: { fontSize: 28 },
  continueInfo: { flex: 1, gap: Spacing[1] },
  continueChapter: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.xs,
    color: Colors.muted,
  },
  continueTitle: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.base,
    color: Colors.text,
  },
  progressBarBg: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: Radii.full,
    marginTop: Spacing[2],
  },
  progressBarFill: {
    height: 4,
    backgroundColor: Colors.primary,
    borderRadius: Radii.full,
  },
  progressText: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.xs,
    color: Colors.muted,
  },
  filtersRow: {
    gap: Spacing[2],
    paddingRight: Spacing[5],
    marginBottom: Spacing[5],
  },
  filterChip: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  filterChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  filterChipText: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.sm,
    color: Colors.muted,
  },
  filterChipTextActive: { color: Colors.white },
  subjectCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[4],
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing[4],
    marginBottom: Spacing[3],
    ...Shadows.sm,
  },
  subjectEmojiBg: {
    width: 52,
    height: 52,
    borderRadius: Radii.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  subjectEmoji: { fontSize: 26 },
  subjectInfo: { flex: 1, gap: Spacing[1] },
  subjectTitle: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  subjectSub: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.sm,
    color: Colors.muted,
  },
  subjectMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[2],
    marginTop: Spacing[1],
  },
  subjectChapters: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.xs,
    color: Colors.muted,
  },
  tagPill: {
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary + "15",
  },
  tagText: {
    fontFamily: FontFamily.latoBold,
    fontSize: 10,
    color: Colors.primary,
  },
  subjectArrow: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.xl,
    color: Colors.muted,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: Spacing[10],
    gap: Spacing[3],
  },
  emptyEmoji: { fontSize: 40 },
  emptyText: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.base,
    color: Colors.muted,
  },
});

// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import { useCallback, useEffect, useState } from "react";
// import {
//   ActivityIndicator,
//   RefreshControl,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import {
//   Colors,
//   FontFamily,
//   FontSize,
//   Layout,
//   Radii,
//   Shadows,
//   Spacing,
// } from "../../constants/theme";
// import { useAuthStore, useProgressStore } from "../../lib/store";
// import {
//   getLastWatchedLesson,
//   getSubjects,
//   getUserProgress,
//   LastWatchedLesson,
//   Subject,
// } from "../../lib/supabase";
// import { formatDuration, getFirstName } from "../../lib/utils";

// const FILTERS = ["All", "APTET", "DSC", "UPSC", "TSPSC"] as const;

// export default function HomeScreen() {
//   const insets = useSafeAreaInsets();
//   const router = useRouter();
//   const { user, profile } = useAuthStore();
//   const { setAllProgress } = useProgressStore();

//   const [subjects, setSubjects] = useState<Subject[]>([]);
//   const [lastLesson, setLastLesson] = useState<LastWatchedLesson | null>(null);
//   const [activeFilter, setActiveFilter] = useState<string>("All");
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);

//   const greeting = (() => {
//     const h = new Date().getHours();
//     if (h < 12) return "Good morning";
//     if (h < 17) return "Good afternoon";
//     return "Good evening";
//   })();

//   const firstName = getFirstName(profile?.full_name ?? "there");

//   const loadData = useCallback(async () => {
//     const [subjectsData, lastLessonData] = await Promise.all([
//       getSubjects(),
//       user ? getLastWatchedLesson(user.id) : Promise.resolve(null),
//     ]);

//     setSubjects(subjectsData);
//     setLastLesson(lastLessonData);

//     if (user) {
//       const progressData = await getUserProgress(user.id);
//       setAllProgress(progressData);
//     }

//     setLoading(false);
//     setRefreshing(false);
//   }, [user]);

//   useEffect(() => {
//     loadData();
//   }, [loadData]);

//   const onRefresh = () => {
//     setRefreshing(true);
//     loadData();
//   };

//   const filteredSubjects =
//     activeFilter === "All"
//       ? subjects
//       : subjects.filter((s) => s.exam_tags.includes(activeFilter));

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator color={Colors.primary} size="large" />
//       </View>
//     );
//   }

//   console.log(subjects);

//   return (
//     <ScrollView
//       style={styles.root}
//       contentContainerStyle={[
//         styles.content,
//         {
//           paddingTop: insets.top + Spacing[4],
//           paddingBottom: insets.bottom + 100,
//         },
//       ]}
//       showsVerticalScrollIndicator={false}
//       refreshControl={
//         <RefreshControl
//           refreshing={refreshing}
//           onRefresh={onRefresh}
//           tintColor={Colors.primary}
//         />
//       }
//     >
//       {/* ── Header ── */}
//       <View style={styles.header}>
//         <View>
//           <Text style={styles.greeting}>
//             {greeting}, {firstName} 👋
//           </Text>
//           <Text style={styles.subGreeting}>Ready to study today?</Text>
//         </View>
//         <View style={styles.streakBadge}>
//           <LinearGradient
//             colors={[Colors.accent, Colors.accentDark]}
//             style={styles.streakGradient}
//           >
//             <Text style={styles.streakEmoji}>🔥</Text>
//             <Text style={styles.streakCount}>{profile?.streak_count ?? 0}</Text>
//             <Text style={styles.streakLabel}>day{"\n"}streak</Text>
//           </LinearGradient>
//         </View>
//       </View>

//       {/* ── Upgrade Banner (only if not paid) ── */}
//       {!profile?.is_paid && (
//         <TouchableOpacity
//           activeOpacity={0.88}
//           onPress={() => router.push("/course-info")}
//           style={styles.bannerWrap}
//         >
//           <LinearGradient
//             colors={[Colors.primary, Colors.primaryDark]}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//             style={styles.banner}
//           >
//             <View style={styles.bannerLeft}>
//               <Text style={styles.bannerTitle}>Unlock Full Access</Text>
//               <Text style={styles.bannerSub}>
//                 All chapters · Mock tests · Notes
//               </Text>
//             </View>
//             <View style={styles.bannerRight}>
//               <Text style={styles.bannerPrice}>₹999</Text>
//               <Text style={styles.bannerArrow}>→</Text>
//             </View>
//           </LinearGradient>
//         </TouchableOpacity>
//       )}

//       {/* ── Continue Watching ── */}
//       {lastLesson && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Continue Watching</Text>
//           <TouchableOpacity
//             activeOpacity={0.88}
//             onPress={() => router.push(`/lesson/${lastLesson.lesson_id}`)}
//             style={styles.continueCard}
//           >
//             <View style={styles.continueCardInner}>
//               <View style={styles.continueThumbnail}>
//                 <Text style={styles.continueThumbnailEmoji}>▶️</Text>
//               </View>
//               <View style={styles.continueInfo}>
//                 <Text style={styles.continueChapter}>
//                   {lastLesson.subject_title} · {lastLesson.chapter_title}
//                 </Text>
//                 <Text style={styles.continueTitle} numberOfLines={2}>
//                   {lastLesson.lesson_title}
//                 </Text>
//                 <View style={styles.progressBarBg}>
//                   <View
//                     style={[
//                       styles.progressBarFill,
//                       {
//                         width: `${Math.min(
//                           100,
//                           (lastLesson.watched_seconds /
//                             lastLesson.duration_seconds) *
//                             100,
//                         )}%`,
//                       },
//                     ]}
//                   />
//                 </View>
//                 <Text style={styles.progressText}>
//                   {formatDuration(
//                     lastLesson.duration_seconds - lastLesson.watched_seconds,
//                   )}{" "}
//                   left
//                 </Text>
//               </View>
//             </View>
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* ── Filter Chips ── */}
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.filtersRow}
//       >
//         {FILTERS.map((f) => (
//           <TouchableOpacity
//             key={f}
//             style={[
//               styles.filterChip,
//               activeFilter === f && styles.filterChipActive,
//             ]}
//             onPress={() => setActiveFilter(f)}
//             activeOpacity={0.75}
//           >
//             <Text
//               style={[
//                 styles.filterChipText,
//                 activeFilter === f && styles.filterChipTextActive,
//               ]}
//             >
//               {f}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       {/* ── Subject Cards ── */}
//       <View style={styles.section}>
//         <View style={styles.sectionHeader}>
//           <Text style={styles.sectionTitle}>Subjects</Text>
//         </View>

//         {filteredSubjects.length === 0 ? (
//           <View style={styles.emptyState}>
//             <Text style={styles.emptyEmoji}>📭</Text>
//             <Text style={styles.emptyText}>
//               No subjects for {activeFilter} yet
//             </Text>
//           </View>
//         ) : (
//           filteredSubjects.map((card) => (
//             <TouchableOpacity
//               key={card.id}
//               activeOpacity={0.88}
//               onPress={() => router.push(`/chapter/${card.id}`)}
//               style={styles.subjectCard}
//             >
//               <View
//                 style={[
//                   styles.subjectEmojiBg,
//                   { backgroundColor: card.color + "18" },
//                 ]}
//               >
//                 <Text style={styles.subjectEmoji}>{card.emoji}</Text>
//               </View>
//               <View style={styles.subjectInfo}>
//                 <Text style={styles.subjectTitle}>{card.title}</Text>
//                 <Text style={styles.subjectSub}>{card.subtitle}</Text>
//                 <View style={styles.subjectMeta}>
//                   <Text style={styles.subjectChapters}>
//                     📚 {card.chapter_count} chapters
//                   </Text>
//                   {card.exam_tags.slice(0, 2).map((tag) => (
//                     <View key={tag} style={styles.tagPill}>
//                       <Text style={styles.tagText}>{tag}</Text>
//                     </View>
//                   ))}
//                 </View>
//               </View>
//               <Text style={styles.subjectArrow}>›</Text>
//             </TouchableOpacity>
//           ))
//         )}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: Colors.background },
//   content: { paddingHorizontal: Layout.screenPaddingH },
//   loadingContainer: {
//     flex: 1,
//     backgroundColor: Colors.background,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "flex-start",
//     marginBottom: Spacing[5],
//   },
//   greeting: {
//     fontFamily: FontFamily.playfairBold,
//     fontSize: FontSize["2xl"],
//     color: Colors.text,
//   },
//   subGreeting: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.base,
//     color: Colors.muted,
//     marginTop: Spacing[1],
//   },
//   streakBadge: { borderRadius: Radii.lg, overflow: "hidden", ...Shadows.md },
//   streakGradient: {
//     paddingHorizontal: Spacing[3],
//     paddingVertical: Spacing[2],
//     alignItems: "center",
//     flexDirection: "row",
//     gap: Spacing[1],
//   },
//   streakEmoji: { fontSize: 22 },
//   streakCount: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.xl,
//     color: Colors.white,
//   },
//   streakLabel: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.xs,
//     color: Colors.white + "CC",
//     lineHeight: FontSize.xs * 1.3,
//   },
//   bannerWrap: {
//     borderRadius: Radii.xl,
//     overflow: "hidden",
//     marginBottom: Spacing[6],
//     ...Shadows.lg,
//   },
//   banner: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: Spacing[5],
//   },
//   bannerLeft: { flex: 1 },
//   bannerTitle: {
//     fontFamily: FontFamily.playfairBold,
//     fontSize: FontSize.lg,
//     color: Colors.white,
//     marginBottom: Spacing[1],
//   },
//   bannerSub: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.sm,
//     color: Colors.white + "BB",
//   },
//   bannerRight: { alignItems: "flex-end", gap: Spacing[1] },
//   bannerPrice: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.xl,
//     color: Colors.white,
//   },
//   bannerArrow: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.xl,
//     color: Colors.white + "AA",
//   },
//   section: { marginBottom: Spacing[6] },
//   sectionHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: Spacing[4],
//   },
//   sectionTitle: {
//     fontFamily: FontFamily.playfairBold,
//     fontSize: FontSize.lg,
//     color: Colors.text,
//     marginBottom: Spacing[4],
//   },
//   continueCard: {
//     borderRadius: Radii.xl,
//     overflow: "hidden",
//     backgroundColor: Colors.surface,
//     ...Shadows.md,
//   },
//   continueCardInner: {
//     flexDirection: "row",
//     padding: Spacing[4],
//     gap: Spacing[4],
//   },
//   continueThumbnail: {
//     width: 80,
//     height: 70,
//     borderRadius: Radii.md,
//     backgroundColor: Colors.primary + "20",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   continueThumbnailEmoji: { fontSize: 28 },
//   continueInfo: { flex: 1, gap: Spacing[1] },
//   continueChapter: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.xs,
//     color: Colors.muted,
//   },
//   continueTitle: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.base,
//     color: Colors.text,
//   },
//   progressBarBg: {
//     height: 4,
//     backgroundColor: Colors.border,
//     borderRadius: Radii.full,
//     marginTop: Spacing[2],
//   },
//   progressBarFill: {
//     height: 4,
//     backgroundColor: Colors.primary,
//     borderRadius: Radii.full,
//   },
//   progressText: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.xs,
//     color: Colors.muted,
//   },
//   filtersRow: {
//     gap: Spacing[2],
//     paddingRight: Spacing[5],
//     marginBottom: Spacing[5],
//   },
//   filterChip: {
//     paddingHorizontal: Spacing[4],
//     paddingVertical: Spacing[2],
//     borderRadius: Radii.full,
//     borderWidth: 1.5,
//     borderColor: Colors.border,
//     backgroundColor: Colors.surface,
//   },
//   filterChipActive: {
//     borderColor: Colors.primary,
//     backgroundColor: Colors.primary,
//   },
//   filterChipText: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.sm,
//     color: Colors.muted,
//   },
//   filterChipTextActive: { color: Colors.white },
//   subjectCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing[4],
//     backgroundColor: Colors.surface,
//     borderRadius: Radii.xl,
//     padding: Spacing[4],
//     marginBottom: Spacing[3],
//     ...Shadows.sm,
//   },
//   subjectEmojiBg: {
//     width: 52,
//     height: 52,
//     borderRadius: Radii.lg,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   subjectEmoji: { fontSize: 26 },
//   subjectInfo: { flex: 1, gap: Spacing[1] },
//   subjectTitle: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.md,
//     color: Colors.text,
//   },
//   subjectSub: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.sm,
//     color: Colors.muted,
//   },
//   subjectMeta: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing[2],
//     marginTop: Spacing[1],
//   },
//   subjectChapters: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.xs,
//     color: Colors.muted,
//   },
//   tagPill: {
//     paddingHorizontal: Spacing[2],
//     paddingVertical: 2,
//     borderRadius: Radii.full,
//     backgroundColor: Colors.primary + "15",
//   },
//   tagText: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: 10,
//     color: Colors.primary,
//   },
//   subjectArrow: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.xl,
//     color: Colors.muted,
//   },
//   emptyState: {
//     alignItems: "center",
//     paddingVertical: Spacing[10],
//     gap: Spacing[3],
//   },
//   emptyEmoji: { fontSize: 40 },
//   emptyText: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.base,
//     color: Colors.muted,
//   },
// });
