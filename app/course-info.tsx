// // app/course-info.tsx

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
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
} from "../constants/theme";

const { width: SCREEN_W } = Dimensions.get("window");

const FEATURES = [
  {
    emoji: "🎬",
    title: "120+ Video Lessons",
    desc: "HD quality, downloadable",
  },
  { emoji: "📝", title: "Detailed Notes", desc: "PDF notes for every chapter" },
  { emoji: "🧪", title: "Mock Tests", desc: "5 full-length practice exams" },
  { emoji: "🔄", title: "Lifetime Access", desc: "Study at your own pace" },
  { emoji: "📱", title: "Offline Mode", desc: "Download & study anywhere" },
  { emoji: "🏆", title: "Exam Mapped", desc: "APTET, DSC, UPSC, TSPSC" },
];

const TESTIMONIALS = [
  {
    name: "Ravi Kumar",
    exam: "APTET 2024",
    score: "⭐⭐⭐⭐⭐",
    text: "Cleared APTET in first attempt. The structured approach made all the difference!",
    avatar: "RK",
  },
  {
    name: "Sunita Devi",
    exam: "DSC 2024",
    score: "⭐⭐⭐⭐⭐",
    text: "Ancient History was always confusing, but the video explanations here are crystal clear.",
    avatar: "SD",
  },
  {
    name: "Arjun Reddy",
    exam: "TSPSC 2023",
    score: "⭐⭐⭐⭐⭐",
    text: "Worth every rupee. The mock tests perfectly mirror the actual exam pattern.",
    avatar: "AR",
  },
];

const STATS = [
  { value: "12,000+", label: "Students" },
  { value: "94%", label: "Pass Rate" },
  { value: "4.9★", label: "Rating" },
];

export default function CourseInfoScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.root, { paddingBottom: insets.bottom }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Gradient hero */}
        <LinearGradient
          colors={[Colors.primaryDark, Colors.primary, Colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.hero, { paddingTop: insets.top + Spacing[4] }]}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.heroBadge}>
            <Text style={styles.heroBadgeText}>🏛️ COMPLETE COURSE</Text>
          </View>
          <Text style={styles.heroTitle}>
            Master History for{"\n"}Competitive Exams
          </Text>
          <Text style={styles.heroSub}>
            The most comprehensive history course for APTET, DSC, UPSC & TSPSC
            aspirants
          </Text>

          {/* 3 stats */}
          <View style={styles.statsRow}>
            {STATS.map((s) => (
              <View key={s.label} style={styles.statItem}>
                <Text style={styles.statValue}>{s.value}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What's Included</Text>
          <View style={styles.featuresGrid}>
            {FEATURES.map((f) => (
              <View key={f.title} style={styles.featureCard}>
                <Text style={styles.featureEmoji}>{f.emoji}</Text>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureDesc}>{f.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Try before you buy banner */}
        <View style={styles.tryBanner}>
          <Text style={styles.tryEmoji}>👀</Text>
          <View style={styles.tryInfo}>
            <Text style={styles.tryTitle}>Try before you buy</Text>
            <Text style={styles.trySub}>
              First 2 lessons of every chapter are free
            </Text>
          </View>
          <TouchableOpacity
            style={styles.tryBtn}
            onPress={() => router.push("/chapter/1")}
          >
            <Text style={styles.tryBtnText}>Preview</Text>
          </TouchableOpacity>
        </View>

        {/* Testimonials */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Student Reviews</Text>
          {TESTIMONIALS.map((t) => (
            <View key={t.name} style={styles.testimonialCard}>
              <View style={styles.testimonialHeader}>
                <View style={styles.testimonialAvatar}>
                  <Text style={styles.testimonialAvatarText}>{t.avatar}</Text>
                </View>
                <View>
                  <Text style={styles.testimonialName}>{t.name}</Text>
                  <Text style={styles.testimonialExam}>{t.exam}</Text>
                </View>
                <Text style={styles.testimonialScore}>{t.score}</Text>
              </View>
              <Text style={styles.testimonialText}>"{t.text}"</Text>
            </View>
          ))}
        </View>

        {/* Spacer for sticky footer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Sticky bottom CTA */}
      <View
        style={[
          styles.stickyBottom,
          { paddingBottom: insets.bottom || Spacing[4] },
        ]}
      >
        <View style={styles.stickyInfo}>
          <Text style={styles.stickyOriginalPrice}>₹2,999</Text>
          <Text style={styles.stickyPrice}>₹999</Text>
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>67% OFF</Text>
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => router.push("/billing")}
          style={styles.enrollBtnWrap}
        >
          <LinearGradient
            colors={[Colors.primaryLight, Colors.primary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.enrollBtn}
          >
            <Text style={styles.enrollText}>Enroll Now →</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { paddingBottom: 0 },
  hero: { padding: Layout.screenPaddingH, paddingBottom: Spacing[8] },
  backBtn: { marginBottom: Spacing[6] },
  backText: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.base,
    color: Colors.white + "CC",
  },
  heroBadge: {
    alignSelf: "flex-start",
    backgroundColor: Colors.white + "20",
    borderRadius: Radii.full,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[1] + 2,
    marginBottom: Spacing[4],
  },
  heroBadgeText: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.xs,
    color: Colors.white,
    letterSpacing: 1,
  },
  heroTitle: {
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize["3xl"],
    color: Colors.white,
    lineHeight: FontSize["3xl"] * 1.1,
    marginBottom: Spacing[4],
  },
  heroSub: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.base,
    color: Colors.white + "BB",
    lineHeight: FontSize.base * 1.6,
    marginBottom: Spacing[6],
  },
  statsRow: { flexDirection: "row", gap: Spacing[1] },
  statItem: {
    flex: 1,
    backgroundColor: Colors.white + "15",
    borderRadius: Radii.md,
    padding: Spacing[3],
    alignItems: "center",
  },
  statValue: {
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize.lg,
    color: Colors.white,
  },
  statLabel: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.xs,
    color: Colors.white + "BB",
  },
  section: { padding: Layout.screenPaddingH, paddingTop: Spacing[6] },
  sectionTitle: {
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize.xl,
    color: Colors.text,
    marginBottom: Spacing[5],
  },
  featuresGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing[3] },
  featureCard: {
    width: (SCREEN_W - Layout.screenPaddingH * 2 - Spacing[3]) / 2,
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing[4],
    gap: Spacing[1],
    ...Shadows.sm,
  },
  featureEmoji: { fontSize: 24 },
  featureTitle: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.base,
    color: Colors.text,
  },
  featureDesc: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.sm,
    color: Colors.muted,
  },
  tryBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    marginHorizontal: Layout.screenPaddingH,
    backgroundColor: Colors.accent + "20",
    borderWidth: 1,
    borderColor: Colors.accent + "50",
    borderRadius: Radii.xl,
    padding: Spacing[4],
  },
  tryEmoji: { fontSize: 28 },
  tryInfo: { flex: 1 },
  tryTitle: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.base,
    color: Colors.text,
  },
  trySub: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.sm,
    color: Colors.muted,
  },
  tryBtn: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    backgroundColor: Colors.accent,
    borderRadius: Radii.md,
  },
  tryBtnText: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.sm,
    color: Colors.white,
  },
  testimonialCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing[4],
    marginBottom: Spacing[3],
    ...Shadows.sm,
  },
  testimonialHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    marginBottom: Spacing[3],
  },
  testimonialAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  testimonialAvatarText: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.sm,
    color: Colors.white,
  },
  testimonialName: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.base,
    color: Colors.text,
  },
  testimonialExam: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.xs,
    color: Colors.muted,
  },
  testimonialScore: { marginLeft: "auto", fontSize: 12 },
  testimonialText: {
    fontFamily: FontFamily.playfairItalic,
    fontSize: FontSize.base,
    color: Colors.muted,
    lineHeight: FontSize.base * 1.6,
  },
  stickyBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[4],
    paddingHorizontal: Layout.screenPaddingH,
    paddingTop: Spacing[4],
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  stickyInfo: { flexDirection: "row", alignItems: "center", gap: Spacing[2] },
  stickyOriginalPrice: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.sm,
    color: Colors.muted,
    textDecorationLine: "line-through",
  },
  stickyPrice: {
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize.xl,
    color: Colors.text,
  },
  discountBadge: {
    backgroundColor: Colors.success + "20",
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
    borderRadius: Radii.xs,
  },
  discountText: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.xs,
    color: Colors.success,
  },
  enrollBtnWrap: { flex: 1 },
  enrollBtn: {
    height: Layout.buttonHeight,
    borderRadius: Layout.buttonRadius,
    alignItems: "center",
    justifyContent: "center",
  },
  enrollText: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.md,
    color: Colors.white,
    letterSpacing: 0.5,
  },
});

// import React from 'react';
// import {
//   View, Text, StyleSheet, ScrollView, TouchableOpacity,
// } from 'react-native';
// import { router } from 'expo-router';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { Colors, Typography, Radii, Shadows, Layout } from '../constants/theme';

// const FEATURES = [
//   { icon: '🎥', title: 'Full Video Library', desc: 'Access all history lessons — Ancient to Modern' },
//   { icon: '📱', title: 'Watch Anywhere', desc: 'iOS & Android, any time, any place' },
//   { icon: '🎯', title: 'Exam-Focused', desc: 'Content mapped to APTET, DSC, UPSC syllabi' },
//   { icon: '📊', title: 'Track Progress', desc: 'Know exactly where you stand each day' },
//   { icon: '🔥', title: 'Streak Rewards', desc: 'Stay consistent with daily streaks' },
//   { icon: '🆕', title: 'New Lessons Added', desc: 'Fresh content added regularly' },
// ];

// const TESTIMONIALS = [
//   { name: 'Ramya K.', exam: 'APTET 2024', text: 'Cleared APTET in my first attempt. The clarity in these lessons is unmatched!', rating: 5 },
//   { name: 'Srinivas M.', exam: 'DSC 2024', text: 'Finally understood the entire Indian history chronology. Worth every rupee.', rating: 5 },
//   { name: 'Divya R.', exam: 'UPSC Prelims', text: 'The bite-sized lessons fit perfectly into my daily schedule.', rating: 5 },
// ];

// export default function CourseInfoScreen() {
//   const insets = useSafeAreaInsets();

//   return (
//     <View style={styles.container}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 120 }}
//       >
//         {/* Hero */}
//         <LinearGradient
//           colors={['#C4622D', '#9E4A1E']}
//           style={[styles.hero, { paddingTop: insets.top + 20 }]}
//         >
//           <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
//             <Text style={styles.backIcon}>←</Text>
//           </TouchableOpacity>

//           <View style={styles.heroContent}>
//             <View style={styles.heroBadge}>
//               <Text style={styles.heroBadgeText}>📚 HISTORY MASTERY COURSE</Text>
//             </View>
//             <Text style={styles.heroTitle}>Master History.{'\n'}Crack Your Exam.</Text>
//             <Text style={styles.heroSub}>
//               Expert-taught video lessons designed specifically for APTET, DSC, UPSC, and TSPSC
//             </Text>

//             <View style={styles.statsRow}>
//               {[
//                 { value: '200+', label: 'Video Lessons' },
//                 { value: '50+', label: 'Topics Covered' },
//                 { value: '10k+', label: 'Students' },
//               ].map((s) => (
//                 <View key={s.label} style={styles.stat}>
//                   <Text style={styles.statValue}>{s.value}</Text>
//                   <Text style={styles.statLabel}>{s.label}</Text>
//                 </View>
//               ))}
//             </View>
//           </View>
//         </LinearGradient>

//         {/* Features */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>What's included</Text>
//           <View style={styles.featuresGrid}>
//             {FEATURES.map((f) => (
//               <View key={f.title} style={styles.featureCard}>
//                 <Text style={styles.featureIcon}>{f.icon}</Text>
//                 <Text style={styles.featureTitle}>{f.title}</Text>
//                 <Text style={styles.featureDesc}>{f.desc}</Text>
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* Free preview note */}
//         <View style={styles.previewBanner}>
//           <Text style={styles.previewEmoji}>🎁</Text>
//           <View style={styles.previewText}>
//             <Text style={styles.previewTitle}>Try before you buy</Text>
//             <Text style={styles.previewSub}>
//               First 2 lessons in each chapter are completely free. No card required.
//             </Text>
//           </View>
//         </View>

//         {/* Testimonials */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>What students say</Text>
//           {TESTIMONIALS.map((t) => (
//             <View key={t.name} style={styles.testimonialCard}>
//               <View style={styles.testimonialHeader}>
//                 <View style={styles.avatarCircle}>
//                   <Text style={styles.avatarInitial}>{t.name[0]}</Text>
//                 </View>
//                 <View>
//                   <Text style={styles.testimonialName}>{t.name}</Text>
//                   <Text style={styles.testimonialExam}>{t.exam}</Text>
//                 </View>
//                 <Text style={styles.testimonialRating}>
//                   {'⭐'.repeat(t.rating)}
//                 </Text>
//               </View>
//               <Text style={styles.testimonialText}>"{t.text}"</Text>
//             </View>
//           ))}
//         </View>
//       </ScrollView>

//       {/* Sticky CTA */}
//       <View style={[styles.stickyBottom, { paddingBottom: insets.bottom + 16 }]}>
//         <View style={styles.priceRow}>
//           <View>
//             <Text style={styles.priceLabel}>Full Course Access</Text>
//             <Text style={styles.price}>₹999 <Text style={styles.pricePeriod}>/ lifetime</Text></Text>
//           </View>
//           <Text style={styles.priceOriginal}>₹2,499</Text>
//         </View>
//         <TouchableOpacity
//           style={styles.enrollBtn}
//           onPress={() => router.push('/billing')}
//           activeOpacity={0.88}
//         >
//           <LinearGradient
//             colors={['#C4622D', '#E8845A']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//             style={styles.enrollBtnGradient}
//           >
//             <Text style={styles.enrollBtnText}>Enroll Now — ₹999</Text>
//           </LinearGradient>
//         </TouchableOpacity>
//         <Text style={styles.guarantee}>
//           🔒 Secure payment · 7-day money-back guarantee
//         </Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.background },

//   // Hero
//   hero: { paddingHorizontal: Layout.screenPadding, paddingBottom: 40 },
//   backBtn: {
//     width: 40,
//     height: 40,
//     borderRadius: Radii.full,
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 24,
//   },
//   backIcon: { fontSize: 22, color: '#FFFFFF' },
//   heroContent: { gap: 16 },
//   heroBadge: {
//     alignSelf: 'flex-start',
//     backgroundColor: 'rgba(255,255,255,0.2)',
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: Radii.full,
//   },
//   heroBadgeText: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.xs,
//     color: '#FFFFFF',
//     letterSpacing: 1,
//   },
//   heroTitle: {
//     fontFamily: Typography.heading,
//     fontSize: Typography.size['3xl'],
//     color: '#FFFFFF',
//     lineHeight: 44,
//   },
//   heroSub: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.base,
//     color: 'rgba(255,255,255,0.85)',
//     lineHeight: 24,
//   },
//   statsRow: {
//     flexDirection: 'row',
//     gap: 24,
//     marginTop: 8,
//   },
//   stat: { alignItems: 'center' },
//   statValue: {
//     fontFamily: Typography.heading,
//     fontSize: Typography.size.xl,
//     color: Colors.accent,
//   },
//   statLabel: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.xs,
//     color: 'rgba(255,255,255,0.75)',
//   },

//   // Section
//   section: { padding: Layout.screenPadding, gap: 16 },
//   sectionTitle: {
//     fontFamily: Typography.heading,
//     fontSize: Typography.size.xl,
//     color: Colors.textPrimary,
//   },

//   // Features
//   featuresGrid: { gap: 12 },
//   featureCard: {
//     backgroundColor: Colors.surface,
//     borderRadius: Radii.lg,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'flex-start',
//     gap: 14,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     ...Shadows.sm,
//   },
//   featureIcon: { fontSize: 24, marginTop: 2 },
//   featureTitle: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.base,
//     color: Colors.textPrimary,
//     marginBottom: 3,
//   },
//   featureDesc: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: Colors.textMuted,
//     lineHeight: 20,
//     flex: 1,
//   },

//   // Preview banner
//   previewBanner: {
//     marginHorizontal: Layout.screenPadding,
//     backgroundColor: Colors.accentLight,
//     borderRadius: Radii.lg,
//     padding: 16,
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     borderWidth: 1,
//     borderColor: Colors.accent + '40',
//   },
//   previewEmoji: { fontSize: 28 },
//   previewText: { flex: 1, gap: 4 },
//   previewTitle: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.base,
//     color: Colors.accentDark,
//   },
//   previewSub: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: Colors.textSecondary,
//     lineHeight: 20,
//   },

//   // Testimonials
//   testimonialCard: {
//     backgroundColor: Colors.surface,
//     borderRadius: Radii.lg,
//     padding: 16,
//     gap: 12,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     ...Shadows.sm,
//   },
//   testimonialHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 10,
//   },
//   avatarCircle: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: Colors.primary,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   avatarInitial: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.md,
//     color: '#FFFFFF',
//   },
//   testimonialName: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.base,
//     color: Colors.textPrimary,
//   },
//   testimonialExam: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.xs,
//     color: Colors.textMuted,
//   },
//   testimonialRating: { marginLeft: 'auto', fontSize: 13 },
//   testimonialText: {
//     fontFamily: Typography.headingRegular,
//     fontSize: Typography.size.base,
//     color: Colors.textSecondary,
//     lineHeight: 24,
//     fontStyle: 'italic',
//   },

//   // Sticky bottom
//   stickyBottom: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: Colors.surface,
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//     paddingHorizontal: Layout.screenPadding,
//     paddingTop: 16,
//     gap: 12,
//     ...Shadows.lg,
//   },
//   priceRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   priceLabel: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: Colors.textMuted,
//   },
//   price: {
//     fontFamily: Typography.heading,
//     fontSize: Typography.size['2xl'],
//     color: Colors.textPrimary,
//   },
//   pricePeriod: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: Colors.textMuted,
//   },
//   priceOriginal: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.md,
//     color: Colors.textMuted,
//     textDecorationLine: 'line-through',
//   },
//   enrollBtn: { borderRadius: Radii.full, overflow: 'hidden' },
//   enrollBtnGradient: { paddingVertical: 16, alignItems: 'center' },
//   enrollBtnText: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.md,
//     color: '#FFFFFF',
//     letterSpacing: 0.3,
//   },
//   guarantee: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.xs,
//     color: Colors.textMuted,
//     textAlign: 'center',
//   },
// });
