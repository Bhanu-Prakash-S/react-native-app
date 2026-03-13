// // app/(tabs)/progress.tsx

import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, Text, View } from "react-native";
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

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
const ACTIVE_DAYS = [0, 1, 2, 3, 5]; // Mon-Thu + Sat active

const MILESTONES = [
  {
    label: "First Lesson",
    desc: "Complete your first lesson",
    done: true,
    progress: 1,
  },
  {
    label: "3-Day Streak",
    desc: "Study 3 days in a row",
    done: true,
    progress: 1,
  },
  {
    label: "7-Day Streak",
    desc: "Study 7 days in a row",
    done: false,
    progress: 7 / 7,
  },
  {
    label: "Chapter Master",
    desc: "Complete a full chapter",
    done: false,
    progress: 0.7,
  },
  {
    label: "Subject Scholar",
    desc: "Complete an entire subject",
    done: false,
    progress: 0.3,
  },
];

const STATS = [
  { emoji: "📖", value: "12", label: "Lessons Started" },
  { emoji: "✅", value: "8", label: "Completed" },
  { emoji: "⏱️", value: "45m", label: "Watch Time" },
];

export default function ProgressScreen() {
  const insets = useSafeAreaInsets();

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
      <Text style={styles.heading}>Your Progress</Text>

      {/* Streak Card */}
      <LinearGradient
        colors={[Colors.accent, Colors.accentDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.streakCard}
      >
        <View style={styles.streakTop}>
          <View>
            <Text style={styles.streakTitle}>🔥 Current Streak</Text>
            <Text style={styles.streakDays}>7 days</Text>
          </View>
          <Text style={styles.streakBest}>Best: 12 days</Text>
        </View>
        {/* Day strip */}
        <View style={styles.dayStrip}>
          {DAYS.map((day, i) => {
            const active = ACTIVE_DAYS.includes(i);
            return (
              <View key={i} style={styles.dayItem}>
                <View style={[styles.dayDot, active && styles.dayDotActive]}>
                  {active && <Text style={styles.dayCheck}>✓</Text>}
                </View>
                <Text style={styles.dayLabel}>{day}</Text>
              </View>
            );
          })}
        </View>
      </LinearGradient>

      {/* Stat cards */}
      <View style={styles.statsRow}>
        {STATS.map((s) => (
          <View key={s.label} style={styles.statCard}>
            <Text style={styles.statEmoji}>{s.emoji}</Text>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Overall completion */}
      <View style={styles.completionCard}>
        <View style={styles.completionHeader}>
          <Text style={styles.completionTitle}>Overall Completion</Text>
          <Text style={styles.completionPct}>35%</Text>
        </View>
        <View style={styles.completionBarBg}>
          <LinearGradient
            colors={[Colors.primary, Colors.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.completionBarFill, { width: "35%" }]}
          />
        </View>
        <Text style={styles.completionSub}>8 of 30 chapters completed</Text>
      </View>

      {/* Daily quote */}
      <View style={styles.quoteCard}>
        <Text style={styles.quoteEmoji}>💬</Text>
        <Text style={styles.quoteText}>
          "The more you know about the past, the better prepared you are for the
          future."
        </Text>
        <Text style={styles.quoteAuthor}>— Theodore Roosevelt</Text>
      </View>

      {/* Milestones */}
      <Text style={styles.sectionTitle}>Milestones</Text>
      {MILESTONES.map((m, i) => (
        <View key={i} style={styles.milestoneRow}>
          <View
            style={[styles.milestoneIcon, m.done && styles.milestoneIconDone]}
          >
            <Text style={styles.milestoneIconText}>{m.done ? "🏆" : "🎯"}</Text>
          </View>
          <View style={styles.milestoneInfo}>
            <View style={styles.milestoneTitleRow}>
              <Text style={styles.milestoneLabel}>{m.label}</Text>
              <Text style={styles.milestonePct}>
                {Math.round(m.progress * 100)}%
              </Text>
            </View>
            <Text style={styles.milestoneDesc}>{m.desc}</Text>
            <View style={styles.milestoneBarBg}>
              <View
                style={[
                  styles.milestoneBarFill,
                  {
                    width: `${m.progress * 100}%`,
                    backgroundColor: m.done ? Colors.success : Colors.primary,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  content: { paddingHorizontal: Layout.screenPaddingH },
  heading: {
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize["2xl"],
    color: Colors.text,
    marginBottom: Spacing[5],
  },
  streakCard: {
    borderRadius: Radii.xl,
    padding: Spacing[5],
    marginBottom: Spacing[5],
    ...Shadows.md,
  },
  streakTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing[4],
  },
  streakTitle: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.sm,
    color: Colors.white + "CC",
  },
  streakDays: {
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize["3xl"],
    color: Colors.white,
  },
  streakBest: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.sm,
    color: Colors.white + "BB",
  },
  dayStrip: { flexDirection: "row", justifyContent: "space-between" },
  dayItem: { alignItems: "center", gap: Spacing[1] },
  dayDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white + "30",
    alignItems: "center",
    justifyContent: "center",
  },
  dayDotActive: { backgroundColor: Colors.white },
  dayCheck: { fontSize: 14, color: Colors.accentDark },
  dayLabel: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.xs,
    color: Colors.white + "BB",
  },
  statsRow: { flexDirection: "row", gap: Spacing[3], marginBottom: Spacing[5] },
  statCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing[4],
    alignItems: "center",
    gap: Spacing[1],
    ...Shadows.sm,
  },
  statEmoji: { fontSize: 24 },
  statValue: {
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize["2xl"],
    color: Colors.text,
  },
  statLabel: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.xs,
    color: Colors.muted,
    textAlign: "center",
  },
  completionCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing[5],
    marginBottom: Spacing[5],
    ...Shadows.sm,
  },
  completionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing[3],
  },
  completionTitle: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  completionPct: {
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize.xl,
    color: Colors.primary,
  },
  completionBarBg: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: Radii.full,
    marginBottom: Spacing[2],
    overflow: "hidden",
  },
  completionBarFill: { height: 8, borderRadius: Radii.full },
  completionSub: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.sm,
    color: Colors.muted,
  },
  quoteCard: {
    backgroundColor: Colors.primary + "10",
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    borderRadius: Radii.md,
    padding: Spacing[5],
    marginBottom: Spacing[6],
  },
  quoteEmoji: { fontSize: 24, marginBottom: Spacing[2] },
  quoteText: {
    fontFamily: FontFamily.playfairItalic,
    fontSize: FontSize.md,
    color: Colors.text,
    lineHeight: FontSize.md * 1.6,
    marginBottom: Spacing[2],
  },
  quoteAuthor: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.sm,
    color: Colors.muted,
  },
  sectionTitle: {
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize.lg,
    color: Colors.text,
    marginBottom: Spacing[4],
  },
  milestoneRow: {
    flexDirection: "row",
    gap: Spacing[4],
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing[4],
    marginBottom: Spacing[3],
    ...Shadows.sm,
  },
  milestoneIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  milestoneIconDone: { backgroundColor: Colors.success + "20" },
  milestoneIconText: { fontSize: 20 },
  milestoneInfo: { flex: 1, gap: Spacing[1] },
  milestoneTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  milestoneLabel: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.base,
    color: Colors.text,
  },
  milestonePct: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  milestoneDesc: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.sm,
    color: Colors.muted,
  },
  milestoneBarBg: {
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: Radii.full,
    marginTop: Spacing[2],
    overflow: "hidden",
  },
  milestoneBarFill: { height: 4, borderRadius: Radii.full },
});

// import React, { useEffect, useState } from 'react';
// import {
//   View, Text, StyleSheet, ScrollView, ActivityIndicator,
// } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useAuthStore, useProgressStore } from '../../lib/store';
// import { getUserProgress, getSubjects } from '../../lib/supabase';
// import { Colors, Typography, Radii, Shadows, Layout } from '../../constants/theme';

// // Generate last 7 days for streak display
// function getLast7Days() {
//   const days = [];
//   for (let i = 6; i >= 0; i--) {
//     const d = new Date();
//     d.setDate(d.getDate() - i);
//     days.push({
//       date: d.toISOString().split('T')[0],
//       label: d.toLocaleDateString('en-IN', { weekday: 'short' }).slice(0, 1),
//       dayNum: d.getDate(),
//     });
//   }
//   return days;
// }

// export default function ProgressScreen() {
//   const insets = useSafeAreaInsets();
//   const { profile } = useAuthStore();
//   const { setAllProgress, progressMap } = useProgressStore();
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     totalWatched: 0,
//     totalCompleted: 0,
//     totalMinutes: 0,
//   });

//   const days = getLast7Days();
//   const today = new Date().toISOString().split('T')[0];
//   // In a real app, you'd fetch daily_activity table.
//   // For now, mark today as active if streak > 0
//   const activeDay = today;

//   useEffect(() => {
//     loadProgress();
//   }, [profile]);

//   const loadProgress = async () => {
//     if (!profile) return;
//     const progressData = await getUserProgress(profile.id);
//     setAllProgress(progressData);

//     const totalWatched = progressData.length;
//     const totalCompleted = progressData.filter((p) => p.is_completed).length;
//     const totalMinutes = Math.round(
//       progressData.reduce((sum, p) => sum + (p.watched_seconds ?? 0), 0) / 60
//     );
//     setStats({ totalWatched, totalCompleted, totalMinutes });
//     setLoading(false);
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }

//   const completionPercent = stats.totalWatched > 0
//     ? Math.round((stats.totalCompleted / stats.totalWatched) * 100) : 0;

//   return (
//     <ScrollView
//       style={styles.container}
//       contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}
//       showsVerticalScrollIndicator={false}
//     >
//       {/* Header */}
//       <Text style={styles.pageTitle}>Your Progress</Text>
//       <Text style={styles.pageSubtitle}>Keep the momentum going 📈</Text>

//       {/* Streak Hero Card */}
//       <LinearGradient
//         colors={['#C4622D', '#9E4A1E']}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={styles.streakCard}
//       >
//         <View style={styles.streakTop}>
//           <View>
//             <Text style={styles.streakLabel}>Current Streak</Text>
//             <View style={styles.streakRow}>
//               <Text style={styles.streakFlame}>🔥</Text>
//               <Text style={styles.streakNumber}>{profile?.streak_count ?? 0}</Text>
//               <Text style={styles.streakDays}>days</Text>
//             </View>
//           </View>
//           <View style={styles.streakInsight}>
//             <Text style={styles.streakInsightText}>
//               {profile?.streak_count === 0
//                 ? 'Start your streak today!'
//                 : profile?.streak_count === 1
//                 ? 'Great start! Come back tomorrow.'
//                 : profile?.streak_count && profile.streak_count >= 7
//                 ? 'Incredible dedication! 🏆'
//                 : 'Keep it up! You\'re doing great.'}
//             </Text>
//           </View>
//         </View>

//         {/* 7-day calendar strip */}
//         <View style={styles.dayStrip}>
//           {days.map((day) => {
//             const isToday = day.date === today;
//             const isActive = isToday && (profile?.streak_count ?? 0) > 0;
//             return (
//               <View key={day.date} style={styles.dayItem}>
//                 <Text style={[styles.dayLabel, isToday && styles.dayLabelActive]}>
//                   {day.label}
//                 </Text>
//                 <View style={[
//                   styles.dayCircle,
//                   isActive && styles.dayCircleActive,
//                   isToday && !isActive && styles.dayCircleToday,
//                 ]}>
//                   <Text style={[
//                     styles.dayNum,
//                     isActive && styles.dayNumActive,
//                   ]}>
//                     {isActive ? '✓' : day.dayNum}
//                   </Text>
//                 </View>
//               </View>
//             );
//           })}
//         </View>
//       </LinearGradient>

//       {/* Stats row */}
//       <View style={styles.statsGrid}>
//         <StatCard
//           icon="▶️"
//           value={`${stats.totalWatched}`}
//           label="Lessons Started"
//           color={Colors.primary}
//         />
//         <StatCard
//           icon="✅"
//           value={`${stats.totalCompleted}`}
//           label="Completed"
//           color={Colors.success}
//         />
//         <StatCard
//           icon="⏱️"
//           value={`${stats.totalMinutes}`}
//           label="Minutes Watched"
//           color={Colors.accent}
//         />
//       </View>

//       {/* Completion ring */}
//       <View style={styles.completionCard}>
//         <View style={styles.completionLeft}>
//           <Text style={styles.completionTitle}>Lessons Completed</Text>
//           <Text style={styles.completionValue}>
//             {stats.totalCompleted}{' '}
//             <Text style={styles.completionTotal}>/ {stats.totalWatched} started</Text>
//           </Text>
//           {/* Progress bar */}
//           <View style={styles.completionBar}>
//             <View style={[styles.completionFill, { width: `${completionPercent}%` }]} />
//           </View>
//           <Text style={styles.completionPct}>{completionPercent}% done</Text>
//         </View>
//         <View style={styles.completionRing}>
//           <Text style={styles.completionRingPct}>{completionPercent}%</Text>
//           <Text style={styles.completionRingLabel}>Complete</Text>
//         </View>
//       </View>

//       {/* Motivational quote */}
//       <View style={styles.quoteCard}>
//         <Text style={styles.quoteText}>
//           "History is not a burden on the memory but an illumination of the soul."
//         </Text>
//         <Text style={styles.quoteAuthor}>— Lord Acton</Text>
//       </View>

//       {/* Milestones */}
//       <View style={styles.milestonesSection}>
//         <Text style={styles.milestonesTitle}>Milestones</Text>
//         {[
//           { icon: '🌱', label: 'First lesson watched', target: 1, current: stats.totalWatched },
//           { icon: '📖', label: '10 lessons completed', target: 10, current: stats.totalCompleted },
//           { icon: '🔥', label: '7-day streak', target: 7, current: profile?.streak_count ?? 0 },
//           { icon: '⏱️', label: '60 minutes studied', target: 60, current: stats.totalMinutes },
//           { icon: '🏆', label: '25 lessons completed', target: 25, current: stats.totalCompleted },
//         ].map((m) => {
//           const achieved = m.current >= m.target;
//           const pct = Math.min((m.current / m.target) * 100, 100);
//           return (
//             <View key={m.label} style={[styles.milestone, achieved && styles.milestoneAchieved]}>
//               <Text style={styles.milestoneIcon}>{m.icon}</Text>
//               <View style={styles.milestoneInfo}>
//                 <Text style={[styles.milestoneLabel, achieved && styles.milestoneLabelDone]}>
//                   {m.label}
//                 </Text>
//                 <View style={styles.milestoneBar}>
//                   <View style={[
//                     styles.milestoneFill,
//                     achieved && styles.milestoneFillDone,
//                     { width: `${pct}%` },
//                   ]} />
//                 </View>
//                 <Text style={styles.milestonePct}>
//                   {m.current} / {m.target}
//                 </Text>
//               </View>
//               {achieved && <Text style={styles.achievedBadge}>✓</Text>}
//             </View>
//           );
//         })}
//       </View>

//       <View style={{ height: 32 }} />
//     </ScrollView>
//   );
// }

// function StatCard({
//   icon, value, label, color,
// }: {
//   icon: string; value: string; label: string; color: string;
// }) {
//   return (
//     <View style={[styles.statCard, { borderTopColor: color }]}>
//       <Text style={styles.statIcon}>{icon}</Text>
//       <Text style={[styles.statValue, { color }]}>{value}</Text>
//       <Text style={styles.statLabel}>{label}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.background },
//   content: { paddingHorizontal: Layout.screenPadding, gap: 20 },
//   loadingContainer: {
//     flex: 1,
//     backgroundColor: Colors.background,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   pageTitle: {
//     fontFamily: Typography.heading,
//     fontSize: Typography.size['2xl'],
//     color: Colors.textPrimary,
//   },
//   pageSubtitle: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.base,
//     color: Colors.textMuted,
//     marginTop: -8,
//     marginBottom: 4,
//   },

//   // Streak card
//   streakCard: {
//     borderRadius: Radii.xl,
//     padding: 20,
//     gap: 20,
//     ...Shadows.card,
//   },
//   streakTop: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start',
//   },
//   streakLabel: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: 'rgba(255,255,255,0.75)',
//     marginBottom: 4,
//   },
//   streakRow: {
//     flexDirection: 'row',
//     alignItems: 'flex-end',
//     gap: 4,
//   },
//   streakFlame: { fontSize: 36 },
//   streakNumber: {
//     fontFamily: Typography.heading,
//     fontSize: Typography.size['4xl'],
//     color: '#FFFFFF',
//     lineHeight: 50,
//   },
//   streakDays: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.md,
//     color: 'rgba(255,255,255,0.75)',
//     marginBottom: 8,
//   },
//   streakInsight: {
//     flex: 1,
//     alignItems: 'flex-end',
//   },
//   streakInsightText: {
//     fontFamily: Typography.headingRegular,
//     fontSize: Typography.size.sm,
//     color: 'rgba(255,255,255,0.85)',
//     textAlign: 'right',
//     lineHeight: 20,
//     fontStyle: 'italic',
//     maxWidth: 140,
//   },
//   dayStrip: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   dayItem: { alignItems: 'center', gap: 6 },
//   dayLabel: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.xs,
//     color: 'rgba(255,255,255,0.6)',
//   },
//   dayLabelActive: { color: '#FFFFFF', fontFamily: Typography.bodyMedium },
//   dayCircle: {
//     width: 34,
//     height: 34,
//     borderRadius: 17,
//     backgroundColor: 'rgba(255,255,255,0.15)',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   dayCircleActive: {
//     backgroundColor: Colors.accent,
//   },
//   dayCircleToday: {
//     borderWidth: 1.5,
//     borderColor: 'rgba(255,255,255,0.5)',
//   },
//   dayNum: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: 'rgba(255,255,255,0.7)',
//   },
//   dayNumActive: { color: '#FFFFFF', fontFamily: Typography.bodyMedium },

//   // Stats grid
//   statsGrid: { flexDirection: 'row', gap: 12 },
//   statCard: {
//     flex: 1,
//     backgroundColor: Colors.surface,
//     borderRadius: Radii.lg,
//     padding: 14,
//     alignItems: 'center',
//     gap: 4,
//     borderTopWidth: 3,
//     ...Shadows.sm,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   statIcon: { fontSize: 22 },
//   statValue: {
//     fontFamily: Typography.heading,
//     fontSize: Typography.size.xl,
//   },
//   statLabel: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.xs,
//     color: Colors.textMuted,
//     textAlign: 'center',
//   },

//   // Completion
//   completionCard: {
//     backgroundColor: Colors.surface,
//     borderRadius: Radii.lg,
//     padding: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 20,
//     ...Shadows.sm,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   completionLeft: { flex: 1, gap: 8 },
//   completionTitle: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.base,
//     color: Colors.textPrimary,
//   },
//   completionValue: {
//     fontFamily: Typography.heading,
//     fontSize: Typography.size.xl,
//     color: Colors.textPrimary,
//   },
//   completionTotal: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: Colors.textMuted,
//   },
//   completionBar: {
//     height: 8,
//     backgroundColor: Colors.surfaceMuted,
//     borderRadius: 4,
//   },
//   completionFill: {
//     height: 8,
//     backgroundColor: Colors.success,
//     borderRadius: 4,
//   },
//   completionPct: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: Colors.textMuted,
//   },
//   completionRing: {
//     width: 80,
//     height: 80,
//     borderRadius: 40,
//     borderWidth: 6,
//     borderColor: Colors.success,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   completionRingPct: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.md,
//     color: Colors.success,
//   },
//   completionRingLabel: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.xs,
//     color: Colors.textMuted,
//   },

//   // Quote
//   quoteCard: {
//     backgroundColor: Colors.surfaceWarm,
//     borderRadius: Radii.lg,
//     padding: 20,
//     borderLeftWidth: 4,
//     borderLeftColor: Colors.primary,
//     gap: 8,
//   },
//   quoteText: {
//     fontFamily: Typography.headingRegular,
//     fontSize: Typography.size.base,
//     color: Colors.textSecondary,
//     lineHeight: 26,
//     fontStyle: 'italic',
//   },
//   quoteAuthor: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.sm,
//     color: Colors.primary,
//   },

//   // Milestones
//   milestonesSection: { gap: 12 },
//   milestonesTitle: {
//     fontFamily: Typography.heading,
//     fontSize: Typography.size.xl,
//     color: Colors.textPrimary,
//   },
//   milestone: {
//     backgroundColor: Colors.surface,
//     borderRadius: Radii.lg,
//     padding: 14,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     ...Shadows.sm,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   milestoneAchieved: {
//     borderColor: Colors.success + '60',
//     backgroundColor: Colors.successLight,
//   },
//   milestoneIcon: { fontSize: 24 },
//   milestoneInfo: { flex: 1, gap: 4 },
//   milestoneLabel: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.base,
//     color: Colors.textPrimary,
//   },
//   milestoneLabelDone: {
//     color: Colors.success,
//     fontFamily: Typography.bodyMedium,
//   },
//   milestoneBar: {
//     height: 4,
//     backgroundColor: Colors.surfaceMuted,
//     borderRadius: 2,
//   },
//   milestoneFill: {
//     height: 4,
//     backgroundColor: Colors.primary,
//     borderRadius: 2,
//   },
//   milestoneFillDone: {
//     backgroundColor: Colors.success,
//   },
//   milestonePct: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.xs,
//     color: Colors.textMuted,
//   },
//   achievedBadge: {
//     fontSize: 20,
//     color: Colors.success,
//   },
// });
