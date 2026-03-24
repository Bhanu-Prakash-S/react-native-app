// // // app/course-info.tsx

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
import { useAuthStore } from "../lib/store";

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
  const { profile } = useAuthStore();
  const isPaid = profile?.is_paid ?? false;

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

      {/* Sticky bottom — CTA or full-access badge */}
      {isPaid ? (
        <View
          style={[
            styles.stickyBottom,
            { paddingBottom: insets.bottom || Spacing[4] },
          ]}
        >
          <View style={styles.fullAccessRow}>
            <Text style={styles.fullAccessEmoji}>✅</Text>
            <View>
              <Text style={styles.fullAccessTitle}>You have full access</Text>
              <Text style={styles.fullAccessSub}>
                All chapters and lessons are unlocked
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.replace("/(tabs)")}
              style={styles.goLearnBtn}
            >
              <Text style={styles.goLearnText}>Go learn →</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
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
      )}
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
  // Full access state
  fullAccessRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
  },
  fullAccessEmoji: { fontSize: 28 },
  fullAccessTitle: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.base,
    color: Colors.text,
  },
  fullAccessSub: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.sm,
    color: Colors.muted,
  },
  goLearnBtn: {
    marginLeft: "auto",
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    backgroundColor: Colors.primary,
    borderRadius: Radii.md,
  },
  goLearnText: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.sm,
    color: Colors.white,
  },
});

// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import {
//   Dimensions,
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
// } from "../constants/theme";

// const { width: SCREEN_W } = Dimensions.get("window");

// const FEATURES = [
//   {
//     emoji: "🎬",
//     title: "120+ Video Lessons",
//     desc: "HD quality, downloadable",
//   },
//   { emoji: "📝", title: "Detailed Notes", desc: "PDF notes for every chapter" },
//   { emoji: "🧪", title: "Mock Tests", desc: "5 full-length practice exams" },
//   { emoji: "🔄", title: "Lifetime Access", desc: "Study at your own pace" },
//   { emoji: "📱", title: "Offline Mode", desc: "Download & study anywhere" },
//   { emoji: "🏆", title: "Exam Mapped", desc: "APTET, DSC, UPSC, TSPSC" },
// ];

// const TESTIMONIALS = [
//   {
//     name: "Ravi Kumar",
//     exam: "APTET 2024",
//     score: "⭐⭐⭐⭐⭐",
//     text: "Cleared APTET in first attempt. The structured approach made all the difference!",
//     avatar: "RK",
//   },
//   {
//     name: "Sunita Devi",
//     exam: "DSC 2024",
//     score: "⭐⭐⭐⭐⭐",
//     text: "Ancient History was always confusing, but the video explanations here are crystal clear.",
//     avatar: "SD",
//   },
//   {
//     name: "Arjun Reddy",
//     exam: "TSPSC 2023",
//     score: "⭐⭐⭐⭐⭐",
//     text: "Worth every rupee. The mock tests perfectly mirror the actual exam pattern.",
//     avatar: "AR",
//   },
// ];

// const STATS = [
//   { value: "12,000+", label: "Students" },
//   { value: "94%", label: "Pass Rate" },
//   { value: "4.9★", label: "Rating" },
// ];

// export default function CourseInfoScreen() {
//   const insets = useSafeAreaInsets();
//   const router = useRouter();

//   return (
//     <View style={[styles.root, { paddingBottom: insets.bottom }]}>
//       <ScrollView
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={styles.scrollContent}
//       >
//         {/* Gradient hero */}
//         <LinearGradient
//           colors={[Colors.primaryDark, Colors.primary, Colors.primaryLight]}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 1 }}
//           style={[styles.hero, { paddingTop: insets.top + Spacing[4] }]}
//         >
//           <TouchableOpacity
//             onPress={() => router.back()}
//             style={styles.backBtn}
//           >
//             <Text style={styles.backText}>← Back</Text>
//           </TouchableOpacity>

//           <View style={styles.heroBadge}>
//             <Text style={styles.heroBadgeText}>🏛️ COMPLETE COURSE</Text>
//           </View>
//           <Text style={styles.heroTitle}>
//             Master History for{"\n"}Competitive Exams
//           </Text>
//           <Text style={styles.heroSub}>
//             The most comprehensive history course for APTET, DSC, UPSC & TSPSC
//             aspirants
//           </Text>

//           {/* 3 stats */}
//           <View style={styles.statsRow}>
//             {STATS.map((s) => (
//               <View key={s.label} style={styles.statItem}>
//                 <Text style={styles.statValue}>{s.value}</Text>
//                 <Text style={styles.statLabel}>{s.label}</Text>
//               </View>
//             ))}
//           </View>
//         </LinearGradient>

//         {/* Features */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>What's Included</Text>
//           <View style={styles.featuresGrid}>
//             {FEATURES.map((f) => (
//               <View key={f.title} style={styles.featureCard}>
//                 <Text style={styles.featureEmoji}>{f.emoji}</Text>
//                 <Text style={styles.featureTitle}>{f.title}</Text>
//                 <Text style={styles.featureDesc}>{f.desc}</Text>
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* Try before you buy banner */}
//         <View style={styles.tryBanner}>
//           <Text style={styles.tryEmoji}>👀</Text>
//           <View style={styles.tryInfo}>
//             <Text style={styles.tryTitle}>Try before you buy</Text>
//             <Text style={styles.trySub}>
//               First 2 lessons of every chapter are free
//             </Text>
//           </View>
//           <TouchableOpacity
//             style={styles.tryBtn}
//             onPress={() => router.push("/chapter/1")}
//           >
//             <Text style={styles.tryBtnText}>Preview</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Testimonials */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Student Reviews</Text>
//           {TESTIMONIALS.map((t) => (
//             <View key={t.name} style={styles.testimonialCard}>
//               <View style={styles.testimonialHeader}>
//                 <View style={styles.testimonialAvatar}>
//                   <Text style={styles.testimonialAvatarText}>{t.avatar}</Text>
//                 </View>
//                 <View>
//                   <Text style={styles.testimonialName}>{t.name}</Text>
//                   <Text style={styles.testimonialExam}>{t.exam}</Text>
//                 </View>
//                 <Text style={styles.testimonialScore}>{t.score}</Text>
//               </View>
//               <Text style={styles.testimonialText}>"{t.text}"</Text>
//             </View>
//           ))}
//         </View>

//         {/* Spacer for sticky footer */}
//         <View style={{ height: 100 }} />
//       </ScrollView>

//       {/* Sticky bottom CTA */}
//       <View
//         style={[
//           styles.stickyBottom,
//           { paddingBottom: insets.bottom || Spacing[4] },
//         ]}
//       >
//         <View style={styles.stickyInfo}>
//           <Text style={styles.stickyOriginalPrice}>₹2,999</Text>
//           <Text style={styles.stickyPrice}>₹999</Text>
//           <View style={styles.discountBadge}>
//             <Text style={styles.discountText}>67% OFF</Text>
//           </View>
//         </View>
//         <TouchableOpacity
//           activeOpacity={0.85}
//           onPress={() => router.push("/billing")}
//           style={styles.enrollBtnWrap}
//         >
//           <LinearGradient
//             colors={[Colors.primaryLight, Colors.primary]}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//             style={styles.enrollBtn}
//           >
//             <Text style={styles.enrollText}>Enroll Now →</Text>
//           </LinearGradient>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: Colors.background },
//   scrollContent: { paddingBottom: 0 },
//   hero: { padding: Layout.screenPaddingH, paddingBottom: Spacing[8] },
//   backBtn: { marginBottom: Spacing[6] },
//   backText: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.base,
//     color: Colors.white + "CC",
//   },
//   heroBadge: {
//     alignSelf: "flex-start",
//     backgroundColor: Colors.white + "20",
//     borderRadius: Radii.full,
//     paddingHorizontal: Spacing[4],
//     paddingVertical: Spacing[1] + 2,
//     marginBottom: Spacing[4],
//   },
//   heroBadgeText: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.xs,
//     color: Colors.white,
//     letterSpacing: 1,
//   },
//   heroTitle: {
//     fontFamily: FontFamily.playfairBold,
//     fontSize: FontSize["3xl"],
//     color: Colors.white,
//     lineHeight: FontSize["3xl"] * 1.1,
//     marginBottom: Spacing[4],
//   },
//   heroSub: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.base,
//     color: Colors.white + "BB",
//     lineHeight: FontSize.base * 1.6,
//     marginBottom: Spacing[6],
//   },
//   statsRow: { flexDirection: "row", gap: Spacing[1] },
//   statItem: {
//     flex: 1,
//     backgroundColor: Colors.white + "15",
//     borderRadius: Radii.md,
//     padding: Spacing[3],
//     alignItems: "center",
//   },
//   statValue: {
//     fontFamily: FontFamily.playfairBold,
//     fontSize: FontSize.lg,
//     color: Colors.white,
//   },
//   statLabel: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.xs,
//     color: Colors.white + "BB",
//   },
//   section: { padding: Layout.screenPaddingH, paddingTop: Spacing[6] },
//   sectionTitle: {
//     fontFamily: FontFamily.playfairBold,
//     fontSize: FontSize.xl,
//     color: Colors.text,
//     marginBottom: Spacing[5],
//   },
//   featuresGrid: { flexDirection: "row", flexWrap: "wrap", gap: Spacing[3] },
//   featureCard: {
//     width: (SCREEN_W - Layout.screenPaddingH * 2 - Spacing[3]) / 2,
//     backgroundColor: Colors.surface,
//     borderRadius: Radii.xl,
//     padding: Spacing[4],
//     gap: Spacing[1],
//     ...Shadows.sm,
//   },
//   featureEmoji: { fontSize: 24 },
//   featureTitle: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.base,
//     color: Colors.text,
//   },
//   featureDesc: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.sm,
//     color: Colors.muted,
//   },
//   tryBanner: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing[3],
//     marginHorizontal: Layout.screenPaddingH,
//     backgroundColor: Colors.accent + "20",
//     borderWidth: 1,
//     borderColor: Colors.accent + "50",
//     borderRadius: Radii.xl,
//     padding: Spacing[4],
//   },
//   tryEmoji: { fontSize: 28 },
//   tryInfo: { flex: 1 },
//   tryTitle: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.base,
//     color: Colors.text,
//   },
//   trySub: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.sm,
//     color: Colors.muted,
//   },
//   tryBtn: {
//     paddingHorizontal: Spacing[4],
//     paddingVertical: Spacing[2],
//     backgroundColor: Colors.accent,
//     borderRadius: Radii.md,
//   },
//   tryBtnText: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.sm,
//     color: Colors.white,
//   },
//   testimonialCard: {
//     backgroundColor: Colors.surface,
//     borderRadius: Radii.xl,
//     padding: Spacing[4],
//     marginBottom: Spacing[3],
//     ...Shadows.sm,
//   },
//   testimonialHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing[3],
//     marginBottom: Spacing[3],
//   },
//   testimonialAvatar: {
//     width: 44,
//     height: 44,
//     borderRadius: 22,
//     backgroundColor: Colors.primary,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   testimonialAvatarText: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.sm,
//     color: Colors.white,
//   },
//   testimonialName: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.base,
//     color: Colors.text,
//   },
//   testimonialExam: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.xs,
//     color: Colors.muted,
//   },
//   testimonialScore: { marginLeft: "auto", fontSize: 12 },
//   testimonialText: {
//     fontFamily: FontFamily.playfairItalic,
//     fontSize: FontSize.base,
//     color: Colors.muted,
//     lineHeight: FontSize.base * 1.6,
//   },
//   stickyBottom: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing[4],
//     paddingHorizontal: Layout.screenPaddingH,
//     paddingTop: Spacing[4],
//     backgroundColor: Colors.surface,
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//     shadowColor: Colors.text,
//     shadowOffset: { width: 0, height: -4 },
//     shadowOpacity: 0.08,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   stickyInfo: { flexDirection: "row", alignItems: "center", gap: Spacing[2] },
//   stickyOriginalPrice: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.sm,
//     color: Colors.muted,
//     textDecorationLine: "line-through",
//   },
//   stickyPrice: {
//     fontFamily: FontFamily.playfairBold,
//     fontSize: FontSize.xl,
//     color: Colors.text,
//   },
//   discountBadge: {
//     backgroundColor: Colors.success + "20",
//     paddingHorizontal: Spacing[2],
//     paddingVertical: 2,
//     borderRadius: Radii.xs,
//   },
//   discountText: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.xs,
//     color: Colors.success,
//   },
//   enrollBtnWrap: { flex: 1 },
//   enrollBtn: {
//     height: Layout.buttonHeight,
//     borderRadius: Layout.buttonRadius,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   enrollText: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.md,
//     color: Colors.white,
//     letterSpacing: 0.5,
//   },
// });
