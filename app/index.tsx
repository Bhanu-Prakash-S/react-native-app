import { Redirect } from "expo-router";

// Root redirect → onboarding flow
export default function Index() {
  return <Redirect href="/onboarding" />;
}

// import { LinearGradient } from "expo-linear-gradient";
// import { StyleSheet, Text, View } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { Colors, FontFamily, FontSize, Spacing } from "../constants/theme";

// export default function HomeScreen() {
//   const insets = useSafeAreaInsets();

//   return (
//     <View
//       style={[
//         styles.container,
//         { paddingTop: insets.top, paddingBottom: insets.bottom },
//       ]}
//     >
//       {/* Subtle warm gradient backdrop */}
//       <LinearGradient
//         colors={[Colors.background, Colors.surfaceAlt, Colors.background]}
//         locations={[0, 0.5, 1]}
//         style={StyleSheet.absoluteFillObject}
//       />

//       {/* Decorative arc */}
//       <View style={styles.arcContainer}>
//         <View style={styles.arc} />
//       </View>

//       {/* Content */}
//       <View style={styles.content}>
//         {/* Eyebrow label */}
//         <View style={styles.badge}>
//           <Text style={styles.badgeText}>PHASE 1 — FOUNDATION</Text>
//         </View>

//         {/* App name */}
//         <Text style={styles.appName}>History{"\n"}Mastery Course</Text>

//         {/* Decorative rule */}
//         <View style={styles.dividerRow}>
//           <View style={styles.dividerLine} />
//           <View style={styles.dividerDot} />
//           <View style={styles.dividerLine} />
//         </View>

//         {/* Subtitle */}
//         <Text style={styles.subtitle}>Your exam journey{"\n"}starts here</Text>

//         {/* Footer note */}
//         <Text style={styles.footerNote}>
//           Design system active · Fonts loaded · Theme configured
//         </Text>
//       </View>

//       {/* Bottom decoration */}
//       <View style={styles.bottomAccent}>
//         <View
//           style={[styles.accentPill, { backgroundColor: Colors.primary }]}
//         />
//         <View
//           style={[
//             styles.accentPill,
//             { backgroundColor: Colors.accent, width: 32 },
//           ]}
//         />
//         <View
//           style={[
//             styles.accentPill,
//             { backgroundColor: Colors.border, width: 16 },
//           ]}
//         />
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: Colors.background,
//   },
//   arcContainer: {
//     position: "absolute",
//     top: -120,
//     right: -80,
//     width: 320,
//     height: 320,
//     overflow: "hidden",
//   },
//   arc: {
//     width: 320,
//     height: 320,
//     borderRadius: 160,
//     borderWidth: 48,
//     borderColor: Colors.border,
//     opacity: 0.5,
//   },
//   content: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     paddingHorizontal: Spacing[8],
//   },
//   badge: {
//     backgroundColor: Colors.surface,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: 100,
//     paddingHorizontal: Spacing[4],
//     paddingVertical: Spacing[1] + 2,
//     marginBottom: Spacing[6],
//   },
//   badgeText: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.xs,
//     letterSpacing: 1.5,
//     color: Colors.primary,
//   },
//   appName: {
//     fontFamily: FontFamily.playfairBold,
//     fontSize: FontSize["5xl"],
//     lineHeight: FontSize["5xl"] * 1.05,
//     letterSpacing: -1,
//     color: Colors.text,
//     textAlign: "center",
//     marginBottom: Spacing[6],
//   },
//   dividerRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: Spacing[6],
//     gap: Spacing[3],
//   },
//   dividerLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: Colors.border,
//     maxWidth: 60,
//   },
//   dividerDot: {
//     width: 6,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: Colors.accent,
//   },
//   subtitle: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.lg,
//     lineHeight: FontSize.lg * 1.5,
//     color: Colors.muted,
//     textAlign: "center",
//     marginBottom: Spacing[10],
//   },
//   footerNote: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.xs,
//     color: Colors.border,
//     textAlign: "center",
//     letterSpacing: 0.3,
//   },
//   bottomAccent: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     gap: Spacing[2],
//     paddingBottom: Spacing[8],
//   },
//   accentPill: {
//     height: 4,
//     width: 48,
//     borderRadius: 2,
//   },
// });

// // // import React from "react";
// // // import Videolesson from "./components/Videolesson";

// // // export default function Index() {
// // //   return <Videolesson />;
// // // }

// // // app/index.tsx
// // // Smart redirect: checks auth state and navigates accordingly
// // import AsyncStorage from "@react-native-async-storage/async-storage";
// // import { router } from "expo-router";
// // import { useEffect } from "react";
// // import { ActivityIndicator, StyleSheet, View } from "react-native";
// // import { Colors } from "../constants/theme";
// // import { useAuthStore } from "../lib/store";

// // export default function Index() {
// //   const { user, isLoading } = useAuthStore();

// //   useEffect(() => {
// //     if (isLoading) return;

// //     const redirect = async () => {
// //       const hasOnboarded = await AsyncStorage.getItem("hasOnboarded");

// //       if (!hasOnboarded) {
// //         router.replace("./onboarding");
// //       } else if (!user) {
// //         router.replace("./(auth)/login");
// //       } else {
// //         router.replace("./(tabs)");
// //       }
// //     };

// //     redirect();
// //   }, [isLoading, user]);

// //   return (
// //     <View style={styles.container}>
// //       <ActivityIndicator size="large" color={Colors.primary} />
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: Colors.background,
// //     justifyContent: "center",
// //     alignItems: "center",
// //   },
// // });
