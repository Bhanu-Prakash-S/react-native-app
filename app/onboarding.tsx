// // // app/onboarding.tsx

import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  ListRenderItemInfo,
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

type Slide = {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  accent: string;
  accentDark: string;
};

const SLIDES: Slide[] = [
  {
    id: "1",
    emoji: "📜",
    title: "History Made\nSimple",
    subtitle:
      "Complex topics broken down into clear, structured lessons designed for Indian competitive exams.",
    accent: Colors.primary,
    accentDark: Colors.primaryDark,
  },
  {
    id: "2",
    emoji: "🎯",
    title: "Prepare for\nYour Exam",
    subtitle:
      "APTET, DSC, UPSC, TSPSC — curated content mapped to each exam's syllabus and pattern.",
    accent: "#4A7C59",
    accentDark: "#355A40",
  },
  {
    id: "3",
    emoji: "🔥",
    title: "Build Your\nStudy Streak",
    subtitle:
      "Track your daily progress, earn milestones, and stay motivated with streaks and achievements.",
    accent: Colors.accentDark,
    accentDark: "#A06820",
  },
];

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const flatListRef = useRef<FlatList<Slide>>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);

  const finish = async () => {
    await AsyncStorage.setItem("hasOnboarded", "true");
    router.replace("/(auth)/login");
  };

  const goNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      finish();
    }
  };

  const skip = () => finish();

  const renderSlide = ({ item }: ListRenderItemInfo<Slide>) => (
    <View style={[styles.slide, { width: SCREEN_W }]}>
      {/* Concentric rings */}
      <View style={styles.ringsContainer}>
        <View
          style={[
            styles.ring,
            styles.ring3,
            { borderColor: item.accent + "10" },
          ]}
        />
        <View
          style={[
            styles.ring,
            styles.ring2,
            { borderColor: item.accent + "20" },
          ]}
        />
        <View
          style={[
            styles.ring,
            styles.ring1,
            { borderColor: item.accent + "35" },
          ]}
        />
        <LinearGradient
          colors={[item.accent + "30", item.accent + "15"]}
          style={styles.emojiCircle}
        >
          <Text style={styles.slideEmoji}>{item.emoji}</Text>
        </LinearGradient>
      </View>

      <Text style={styles.slideTitle}>{item.title}</Text>
      <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
    </View>
  );

  const currentSlide = SLIDES[currentIndex];
  const isLast = currentIndex === SLIDES.length - 1;

  return (
    <View
      style={[
        styles.root,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      {/* Skip */}
      <TouchableOpacity style={styles.skipBtn} onPress={skip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false },
        )}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
          setCurrentIndex(idx);
        }}
        style={styles.flatList}
      />

      {/* Dot indicators */}
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => {
          const inputRange = [
            (i - 1) * SCREEN_W,
            i * SCREEN_W,
            (i + 1) * SCREEN_W,
          ];
          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [8, 24, 8],
            extrapolate: "clamp",
          });
          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });
          return (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  width: dotWidth,
                  opacity,
                  backgroundColor: currentSlide.accent,
                },
              ]}
            />
          );
        })}
      </View>

      {/* CTA button */}
      <TouchableOpacity
        style={styles.ctaWrap}
        onPress={goNext}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={[currentSlide.accent, currentSlide.accentDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.ctaBtn}
        >
          <Text style={styles.ctaText}>
            {isLast ? "Get Started →" : "Continue →"}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  skipBtn: {
    position: "absolute",
    top: 56,
    right: Layout.screenPaddingH,
    zIndex: 10,
  },
  skipText: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.base,
    color: Colors.muted,
  },
  flatList: { flex: 1 },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Layout.screenPaddingH,
    paddingTop: 60,
  },
  ringsContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing[10],
  },
  ring: { position: "absolute", borderRadius: 9999, borderWidth: 1 },
  ring1: { width: 160, height: 160 },
  ring2: { width: 210, height: 210 },
  ring3: { width: 260, height: 260 },
  emojiCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  slideEmoji: { fontSize: 56 },
  slideTitle: {
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize["3xl"],
    lineHeight: FontSize["3xl"] * 1.1,
    color: Colors.text,
    textAlign: "center",
    marginBottom: Spacing[5],
  },
  slideSubtitle: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.md,
    color: Colors.muted,
    textAlign: "center",
    lineHeight: FontSize.md * 1.6,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing[2],
    marginBottom: Spacing[6],
  },
  dot: { height: 8, borderRadius: Radii.full },
  ctaWrap: {
    marginHorizontal: Layout.screenPaddingH,
    marginBottom: Spacing[6],
  },
  ctaBtn: {
    height: Layout.buttonHeight,
    borderRadius: Layout.buttonRadius,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.lg,
  },
  ctaText: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.md,
    color: Colors.white,
    letterSpacing: 0.5,
  },
});

// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import { useRef, useState } from "react";
// import {
//     Animated,
//     Dimensions,
//     FlatList,
//     ListRenderItemInfo,
//     StyleSheet,
//     Text,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import {
//     Colors,
//     FontFamily,
//     FontSize,
//     Layout,
//     Radii,
//     Shadows,
//     Spacing,
// } from "../constants/theme";

// const { width: SCREEN_W } = Dimensions.get("window");

// type Slide = {
//   id: string;
//   emoji: string;
//   title: string;
//   subtitle: string;
//   accent: string;
//   accentDark: string;
// };

// const SLIDES: Slide[] = [
//   {
//     id: "1",
//     emoji: "📜",
//     title: "History Made\nSimple",
//     subtitle:
//       "Complex topics broken down into clear, structured lessons designed for Indian competitive exams.",
//     accent: Colors.primary,
//     accentDark: Colors.primaryDark,
//   },
//   {
//     id: "2",
//     emoji: "🎯",
//     title: "Prepare for\nYour Exam",
//     subtitle:
//       "APTET, DSC, UPSC, TSPSC — curated content mapped to each exam's syllabus and pattern.",
//     accent: "#4A7C59",
//     accentDark: "#355A40",
//   },
//   {
//     id: "3",
//     emoji: "🔥",
//     title: "Build Your\nStudy Streak",
//     subtitle:
//       "Track your daily progress, earn milestones, and stay motivated with streaks and achievements.",
//     accent: Colors.accentDark,
//     accentDark: "#A06820",
//   },
// ];

// export default function OnboardingScreen() {
//   const insets = useSafeAreaInsets();
//   const router = useRouter();
//   const flatListRef = useRef<FlatList<Slide>>(null);
//   const scrollX = useRef(new Animated.Value(0)).current;
//   const [currentIndex, setCurrentIndex] = useState(0);

//   const goNext = () => {
//     if (currentIndex < SLIDES.length - 1) {
//       flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
//     } else {
//       console.log("Onboarding complete");
//       router.replace("/(auth)/login");
//     }
//   };

//   const skip = () => router.replace("/(auth)/login");

//   const renderSlide = ({ item }: ListRenderItemInfo<Slide>) => (
//     <View style={[styles.slide, { width: SCREEN_W }]}>
//       {/* Concentric rings */}
//       <View style={styles.ringsContainer}>
//         <View
//           style={[
//             styles.ring,
//             styles.ring3,
//             { borderColor: item.accent + "10" },
//           ]}
//         />
//         <View
//           style={[
//             styles.ring,
//             styles.ring2,
//             { borderColor: item.accent + "20" },
//           ]}
//         />
//         <View
//           style={[
//             styles.ring,
//             styles.ring1,
//             { borderColor: item.accent + "35" },
//           ]}
//         />
//         <LinearGradient
//           colors={[item.accent + "30", item.accent + "15"]}
//           style={styles.emojiCircle}
//         >
//           <Text style={styles.slideEmoji}>{item.emoji}</Text>
//         </LinearGradient>
//       </View>

//       <Text style={styles.slideTitle}>{item.title}</Text>
//       <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
//     </View>
//   );

//   const currentSlide = SLIDES[currentIndex];
//   const isLast = currentIndex === SLIDES.length - 1;

//   return (
//     <View
//       style={[
//         styles.root,
//         { paddingTop: insets.top, paddingBottom: insets.bottom },
//       ]}
//     >
//       {/* Skip */}
//       <TouchableOpacity style={styles.skipBtn} onPress={skip}>
//         <Text style={styles.skipText}>Skip</Text>
//       </TouchableOpacity>

//       {/* Slides */}
//       <Animated.FlatList
//         ref={flatListRef}
//         data={SLIDES}
//         keyExtractor={(item) => item.id}
//         renderItem={renderSlide}
//         horizontal
//         pagingEnabled
//         showsHorizontalScrollIndicator={false}
//         scrollEventThrottle={16}
//         onScroll={Animated.event(
//           [{ nativeEvent: { contentOffset: { x: scrollX } } }],
//           { useNativeDriver: false },
//         )}
//         onMomentumScrollEnd={(e) => {
//           const idx = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
//           setCurrentIndex(idx);
//         }}
//         style={styles.flatList}
//       />

//       {/* Dot indicators */}
//       <View style={styles.dotsRow}>
//         {SLIDES.map((_, i) => {
//           const inputRange = [
//             (i - 1) * SCREEN_W,
//             i * SCREEN_W,
//             (i + 1) * SCREEN_W,
//           ];
//           const dotWidth = scrollX.interpolate({
//             inputRange,
//             outputRange: [8, 24, 8],
//             extrapolate: "clamp",
//           });
//           const opacity = scrollX.interpolate({
//             inputRange,
//             outputRange: [0.3, 1, 0.3],
//             extrapolate: "clamp",
//           });
//           return (
//             <Animated.View
//               key={i}
//               style={[
//                 styles.dot,
//                 {
//                   width: dotWidth,
//                   opacity,
//                   backgroundColor: currentSlide.accent,
//                 },
//               ]}
//             />
//           );
//         })}
//       </View>

//       {/* CTA button */}
//       <TouchableOpacity
//         style={styles.ctaWrap}
//         onPress={goNext}
//         activeOpacity={0.85}
//       >
//         <LinearGradient
//           colors={[currentSlide.accent, currentSlide.accentDark]}
//           start={{ x: 0, y: 0 }}
//           end={{ x: 1, y: 0 }}
//           style={styles.ctaBtn}
//         >
//           <Text style={styles.ctaText}>
//             {isLast ? "Get Started →" : "Continue →"}
//           </Text>
//         </LinearGradient>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: Colors.background },
//   skipBtn: {
//     position: "absolute",
//     top: 56,
//     right: Layout.screenPaddingH,
//     zIndex: 10,
//   },
//   skipText: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.base,
//     color: Colors.muted,
//   },
//   flatList: { flex: 1 },
//   slide: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingHorizontal: Layout.screenPaddingH,
//     paddingTop: 60,
//   },
//   ringsContainer: {
//     alignItems: "center",
//     justifyContent: "center",
//     marginBottom: Spacing[10],
//   },
//   ring: { position: "absolute", borderRadius: 9999, borderWidth: 1 },
//   ring1: { width: 160, height: 160 },
//   ring2: { width: 210, height: 210 },
//   ring3: { width: 260, height: 260 },
//   emojiCircle: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   slideEmoji: { fontSize: 56 },
//   slideTitle: {
//     fontFamily: FontFamily.playfairBold,
//     fontSize: FontSize["3xl"],
//     lineHeight: FontSize["3xl"] * 1.1,
//     color: Colors.text,
//     textAlign: "center",
//     marginBottom: Spacing[5],
//   },
//   slideSubtitle: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.md,
//     color: Colors.muted,
//     textAlign: "center",
//     lineHeight: FontSize.md * 1.6,
//   },
//   dotsRow: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: Spacing[2],
//     marginBottom: Spacing[6],
//   },
//   dot: { height: 8, borderRadius: Radii.full },
//   ctaWrap: {
//     marginHorizontal: Layout.screenPaddingH,
//     marginBottom: Spacing[6],
//   },
//   ctaBtn: {
//     height: Layout.buttonHeight,
//     borderRadius: Layout.buttonRadius,
//     alignItems: "center",
//     justifyContent: "center",
//     ...Shadows.lg,
//   },
//   ctaText: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.md,
//     color: Colors.white,
//     letterSpacing: 0.5,
//   },
// });
