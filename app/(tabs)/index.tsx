// // app/(tabs)/index.tsx

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Dimensions,
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

const { width: SCREEN_W } = Dimensions.get("window");

const FILTERS = ["All", "APTET", "DSC", "UPSC", "TSPSC"] as const;

const SUBJECT_CARDS = [
  {
    id: "1",
    emoji: "🏛️",
    title: "Ancient History",
    subtitle: "Indus Valley to Maurya Empire",
    chapters: 8,
    tags: ["APTET", "UPSC"],
    color: "#C4622D",
  },
  {
    id: "2",
    emoji: "⚔️",
    title: "Medieval India",
    subtitle: "Delhi Sultanate to Mughal Era",
    chapters: 10,
    tags: ["DSC", "TSPSC"],
    color: "#4A7C59",
  },
  {
    id: "3",
    emoji: "🇮🇳",
    title: "Modern India",
    subtitle: "Colonial Era & Independence",
    chapters: 12,
    tags: ["APTET", "DSC", "UPSC"],
    color: "#4A7CA8",
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

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
    >
      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting}, Priya 👋</Text>
          <Text style={styles.subGreeting}>Ready to study today?</Text>
        </View>
        {/* Streak badge */}
        <View style={styles.streakBadge}>
          <LinearGradient
            colors={[Colors.accent, Colors.accentDark]}
            style={styles.streakGradient}
          >
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakCount}>7</Text>
            <Text style={styles.streakLabel}>day{"\n"}streak</Text>
          </LinearGradient>
        </View>
      </View>

      {/* ── Upgrade Banner ── */}
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

      {/* ── Continue Watching ── */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Continue Watching</Text>
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={() => router.push("/lesson/1")}
          style={styles.continueCard}
        >
          <View style={styles.continueCardInner}>
            <View style={styles.continueThumbnail}>
              <Text style={styles.continueThumbnailEmoji}>▶️</Text>
            </View>
            <View style={styles.continueInfo}>
              <Text style={styles.continueChapter}>
                Ancient History · Ch. 2
              </Text>
              <Text style={styles.continueTitle}>
                The Maurya Empire & Ashoka
              </Text>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: "60%" }]} />
              </View>
              <Text style={styles.progressText}>
                60% complete · 12 min left
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>

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
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {SUBJECT_CARDS.map((card) => (
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
                  📚 {card.chapters} chapters
                </Text>
                {card.tags.map((tag) => (
                  <View key={tag} style={styles.tagPill}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
            <Text style={styles.subjectArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Layout.screenPaddingH },
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
  seeAll: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
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
});

// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   View, Text, StyleSheet, ScrollView, TouchableOpacity,
//   RefreshControl, ActivityIndicator, Image,
// } from 'react-native';
// import { router } from 'expo-router';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useAuthStore, useProgressStore } from '../../lib/store';
// import {
//   getSubjects, getLastWatchedLesson, getUserProgress,
//   Subject,
// } from '../../lib/supabase';
// import { Colors, Typography, Spacing, Radii, Shadows, Layout } from '../../constants/theme';
// import { formatDuration } from '../../lib/utils';

// export default function HomeScreen() {
//   const insets = useSafeAreaInsets();
//   const { profile } = useAuthStore();
//   const { setAllProgress } = useProgressStore();

//   const [subjects, setSubjects] = useState<Subject[]>([]);
//   const [lastWatched, setLastWatched] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [activeFilter, setActiveFilter] = useState('All');

//   const firstName = profile?.full_name?.split(' ')[0] ?? 'Student';
//   const examFilters = ['All', 'APTET', 'DSC', 'UPSC', 'TSPSC'];

//   const loadData = useCallback(async () => {
//     if (!profile) return;
//     const [subjectsData, lastLesson, progressData] = await Promise.all([
//       getSubjects(),
//       getLastWatchedLesson(profile.id),
//       getUserProgress(profile.id),
//     ]);
//     setSubjects(subjectsData);
//     setLastWatched(lastLesson);
//     setAllProgress(progressData);
//     setLoading(false);
//   }, [profile]);

//   useEffect(() => { loadData(); }, [loadData]);

//   const onRefresh = async () => {
//     setRefreshing(true);
//     await loadData();
//     setRefreshing(false);
//   };

//   const filteredSubjects = activeFilter === 'All'
//     ? subjects
//     : subjects.filter((s) => s.exam_tags?.includes(activeFilter));

//   const getGreeting = () => {
//     const hour = new Date().getHours();
//     if (hour < 12) return 'Good morning';
//     if (hour < 17) return 'Good afternoon';
//     return 'Good evening';
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <ScrollView
//       style={styles.container}
//       contentContainerStyle={[
//         styles.content,
//         { paddingTop: insets.top + 16 },
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
//       {/* ── Header Greeting ── */}
//       <View style={styles.header}>
//         <View style={styles.greetingArea}>
//           <Text style={styles.greeting}>
//             {getGreeting()}, {firstName} 👋
//           </Text>
//           {profile?.exam_target && (
//             <View style={styles.examBadge}>
//               <Text style={styles.examBadgeText}>🎯 {profile.exam_target}</Text>
//             </View>
//           )}
//         </View>

//         {/* Streak badge */}
//         <View style={styles.streakBadge}>
//           <Text style={styles.streakEmoji}>🔥</Text>
//           <Text style={styles.streakCount}>{profile?.streak_count ?? 0}</Text>
//         </View>
//       </View>

//       {/* ── Paywall Banner (if not paid) ── */}
//       {!profile?.is_paid && (
//         <TouchableOpacity
//           style={styles.payBanner}
//           onPress={() => router.push('/course-info')}
//           activeOpacity={0.9}
//         >
//           <LinearGradient
//             colors={['#C4622D', '#E8845A']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={styles.payBannerGradient}
//           >
//             <View>
//               <Text style={styles.payBannerTitle}>Unlock Full Access</Text>
//               <Text style={styles.payBannerSub}>
//                 Get all lessons + future content
//               </Text>
//             </View>
//             <View style={styles.payBannerBtn}>
//               <Text style={styles.payBannerBtnText}>View Plans →</Text>
//             </View>
//           </LinearGradient>
//         </TouchableOpacity>
//       )}

//       {/* ── Continue Watching Card ── */}
//       {lastWatched && (
//         <View style={styles.sectionBlock}>
//           <Text style={styles.sectionTitle}>Continue Watching</Text>
//           <TouchableOpacity
//             style={styles.continueCard}
//             onPress={() => router.push(`/lesson/${lastWatched.lesson_id}`)}
//             activeOpacity={0.92}
//           >
//             {/* Thumbnail / Placeholder */}
//             <View style={styles.continueThumbnail}>
//               <LinearGradient
//                 colors={['#C4622D', '#9E4A1E']}
//                 style={styles.continueThumbnailGradient}
//               >
//                 <Text style={styles.continueThumbnailEmoji}>▶️</Text>
//               </LinearGradient>
//               {/* Progress bar */}
//               <View style={styles.progressBarContainer}>
//                 <View
//                   style={[
//                     styles.progressBar,
//                     {
//                       width: `${Math.min(
//                         ((lastWatched.watched_seconds ?? 0) /
//                           (lastWatched.lessons?.duration_seconds ?? 1)) * 100,
//                         100
//                       )}%`,
//                     },
//                   ]}
//                 />
//               </View>
//             </View>

//             <View style={styles.continueInfo}>
//               <Text style={styles.continueChapter} numberOfLines={1}>
//                 {lastWatched.lessons?.chapters?.title}
//               </Text>
//               <Text style={styles.continueTitle} numberOfLines={2}>
//                 {lastWatched.lessons?.title}
//               </Text>
//               <View style={styles.continueMetaRow}>
//                 <Text style={styles.continueMeta}>
//                   {formatDuration(lastWatched.watched_seconds ?? 0)} watched
//                 </Text>
//                 <Text style={styles.continueDot}>·</Text>
//                 <Text style={styles.continueMeta}>
//                   {formatDuration(lastWatched.lessons?.duration_seconds ?? 0)} total
//                 </Text>
//               </View>
//             </View>
//           </TouchableOpacity>
//         </View>
//       )}

//       {/* ── Exam Filter Chips ── */}
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         contentContainerStyle={styles.filterRow}
//         style={styles.filterScroll}
//       >
//         {examFilters.map((f) => (
//           <TouchableOpacity
//             key={f}
//             style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
//             onPress={() => setActiveFilter(f)}
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

//       {/* ── Subjects / Chapters ── */}
//       <View style={styles.sectionBlock}>
//         <Text style={styles.sectionTitle}>History Chapters</Text>

//         {filteredSubjects.length === 0 ? (
//           <View style={styles.emptyState}>
//             <Text style={styles.emptyEmoji}>📚</Text>
//             <Text style={styles.emptyText}>No chapters found for this filter</Text>
//           </View>
//         ) : (
//           <View style={styles.subjectGrid}>
//             {filteredSubjects.map((subject, index) => (
//               <SubjectCard
//                 key={subject.id}
//                 subject={subject}
//                 index={index}
//                 onPress={() =>
//                   router.push({
//                     pathname: '/chapter/[id]',
//                     params: { id: subject.id, title: subject.title },
//                   })
//                 }
//               />
//             ))}
//           </View>
//         )}
//       </View>

//       {/* Bottom spacing */}
//       <View style={{ height: 32 }} />
//     </ScrollView>
//   );
// }

// function SubjectCard({
//   subject, index, onPress,
// }: {
//   subject: Subject; index: number; onPress: () => void;
// }) {
//   const cardColors = [
//     ['#C4622D', '#9E4A1E'],
//     ['#E8A855', '#C4882E'],
//     ['#4A7C59', '#2E5C3E'],
//     ['#7B5EA7', '#5A3E8A'],
//     ['#2E86AB', '#1A5E7A'],
//     ['#C4622D', '#9E4A1E'],
//   ];
//   const [from, to] = cardColors[index % cardColors.length];

//   return (
//     <TouchableOpacity
//       style={styles.subjectCard}
//       onPress={onPress}
//       activeOpacity={0.88}
//     >
//       <LinearGradient
//         colors={[from + '18', to + '08']}
//         style={styles.subjectCardInner}
//       >
//         <View style={[styles.subjectIconBg, { backgroundColor: from + '20' }]}>
//           <Text style={styles.subjectIcon}>📖</Text>
//         </View>
//         <Text style={styles.subjectTitle} numberOfLines={2}>{subject.title}</Text>
//         <Text style={styles.subjectMeta}>
//           {subject.total_chapters} chapter{subject.total_chapters !== 1 ? 's' : ''}
//         </Text>
//         {subject.exam_tags && subject.exam_tags.length > 0 && (
//           <View style={styles.tagRow}>
//             {subject.exam_tags.slice(0, 2).map((tag) => (
//               <View key={tag} style={[styles.tag, { backgroundColor: from + '20' }]}>
//                 <Text style={[styles.tagText, { color: from }]}>{tag}</Text>
//               </View>
//             ))}
//           </View>
//         )}
//       </LinearGradient>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.background },
//   content: { paddingHorizontal: Layout.screenPadding },
//   loadingContainer: {
//     flex: 1,
//     backgroundColor: Colors.background,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   // Header
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//     marginBottom: 20,
//   },
//   greetingArea: { flex: 1 },
//   greeting: {
//     fontFamily: Typography.heading,
//     fontSize: Typography.size['2xl'],
//     color: Colors.textPrimary,
//     lineHeight: 34,
//   },
//   examBadge: {
//     marginTop: 6,
//     alignSelf: 'flex-start',
//     backgroundColor: Colors.accentLight,
//     paddingHorizontal: 10,
//     paddingVertical: 4,
//     borderRadius: Radii.full,
//   },
//   examBadgeText: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.xs,
//     color: Colors.accentDark,
//   },
//   streakBadge: {
//     backgroundColor: Colors.surface,
//     borderRadius: Radii.lg,
//     padding: 10,
//     alignItems: 'center',
//     ...Shadows.sm,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     minWidth: 60,
//   },
//   streakEmoji: { fontSize: 22 },
//   streakCount: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.base,
//     color: Colors.textPrimary,
//     marginTop: 2,
//   },

//   // Pay banner
//   payBanner: {
//     borderRadius: Radii.lg,
//     overflow: 'hidden',
//     marginBottom: 24,
//     ...Shadows.card,
//   },
//   payBannerGradient: {
//     padding: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   payBannerTitle: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.md,
//     color: '#FFFFFF',
//   },
//   payBannerSub: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: '#FFFFFF',
//     opacity: 0.85,
//     marginTop: 3,
//   },
//   payBannerBtn: {
//     backgroundColor: 'rgba(255,255,255,0.25)',
//     paddingHorizontal: 14,
//     paddingVertical: 8,
//     borderRadius: Radii.full,
//   },
//   payBannerBtnText: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.sm,
//     color: '#FFFFFF',
//   },

//   // Section
//   sectionBlock: { marginBottom: 28 },
//   sectionTitle: {
//     fontFamily: Typography.heading,
//     fontSize: Typography.size.xl,
//     color: Colors.textPrimary,
//     marginBottom: 16,
//   },

//   // Continue card
//   continueCard: {
//     backgroundColor: Colors.surface,
//     borderRadius: Radii.lg,
//     overflow: 'hidden',
//     flexDirection: 'row',
//     ...Shadows.md,
//     borderWidth: 1,
//     borderColor: Colors.borderLight,
//   },
//   continueThumbnail: {
//     width: 110,
//     position: 'relative',
//   },
//   continueThumbnailGradient: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     minHeight: 100,
//   },
//   continueThumbnailEmoji: { fontSize: 28 },
//   progressBarContainer: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 4,
//     backgroundColor: 'rgba(255,255,255,0.3)',
//   },
//   progressBar: {
//     height: 4,
//     backgroundColor: Colors.accent,
//   },
//   continueInfo: {
//     flex: 1,
//     padding: 14,
//     justifyContent: 'center',
//     gap: 4,
//   },
//   continueChapter: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.xs,
//     color: Colors.primary,
//     textTransform: 'uppercase',
//     letterSpacing: 0.8,
//   },
//   continueTitle: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.base,
//     color: Colors.textPrimary,
//     lineHeight: 22,
//   },
//   continueMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
//   continueMeta: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.xs,
//     color: Colors.textMuted,
//   },
//   continueDot: {
//     color: Colors.textMuted,
//     fontSize: Typography.size.xs,
//   },

//   // Filter
//   filterScroll: { marginBottom: 24, marginHorizontal: -Layout.screenPadding },
//   filterRow: {
//     paddingHorizontal: Layout.screenPadding,
//     gap: 8,
//   },
//   filterChip: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     borderRadius: Radii.full,
//     backgroundColor: Colors.surface,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   filterChipActive: {
//     backgroundColor: Colors.primary,
//     borderColor: Colors.primary,
//   },
//   filterChipText: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: Colors.textSecondary,
//   },
//   filterChipTextActive: {
//     color: '#FFFFFF',
//     fontFamily: Typography.bodyMedium,
//   },

//   // Subject grid
//   subjectGrid: { gap: 14 },
//   subjectCard: {
//     borderRadius: Radii.lg,
//     overflow: 'hidden',
//     ...Shadows.sm,
//     borderWidth: 1,
//     borderColor: Colors.borderLight,
//   },
//   subjectCardInner: {
//     padding: 18,
//     gap: 8,
//   },
//   subjectIconBg: {
//     width: 44,
//     height: 44,
//     borderRadius: Radii.md,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 4,
//   },
//   subjectIcon: { fontSize: 24 },
//   subjectTitle: {
//     fontFamily: Typography.headingMedium,
//     fontSize: Typography.size.lg,
//     color: Colors.textPrimary,
//     lineHeight: 26,
//   },
//   subjectMeta: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: Colors.textMuted,
//   },
//   tagRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
//   tag: {
//     paddingHorizontal: 8,
//     paddingVertical: 3,
//     borderRadius: Radii.full,
//   },
//   tagText: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.xs,
//   },

//   // Empty state
//   emptyState: { alignItems: 'center', paddingVertical: 48, gap: 12 },
//   emptyEmoji: { fontSize: 48 },
//   emptyText: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.base,
//     color: Colors.textMuted,
//   },
// });
