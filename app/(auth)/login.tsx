// // // app/(auth)/login.tsx

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Colors,
  FontFamily,
  FontSize,
  Layout,
  Shadows,
  Spacing
} from "../../constants/theme";
import { supabase } from "../../lib/supabase";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please enter your email and password.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    setLoading(false);

    if (error) {
      Alert.alert("Sign In Failed", error.message);
    } else {
      // Auth listener in _layout.tsx handles profile fetch + navigation
      router.replace("/(tabs)");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          {
            paddingTop: insets.top + Spacing[6],
            paddingBottom: insets.bottom + Spacing[6],
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo mark */}
        <View style={styles.logoRow}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>📜</Text>
          </View>
          <Text style={styles.logoLabel}>History Mastery</Text>
        </View>

        <Text style={styles.heading}>Welcome{"\n"}back</Text>
        <Text style={styles.subheading}>Sign in to continue your journey</Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>EMAIL</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={Colors.muted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>PASSWORD</Text>
            <View style={styles.passwordRow}>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={Colors.muted}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={styles.eyeBtn}
                onPress={() => setShowPassword((v) => !v)}
              >
                <Text style={styles.eyeIcon}>{showPassword ? "🙈" : "👁️"}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[Colors.primaryLight, Colors.primary, Colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaBtn}
            >
              {loading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.ctaText}>Sign In</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={styles.previewBtn}
            onPress={() => router.push("/course-info")}
          >
            <Text style={styles.previewText}>👀 Browse courses first</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.registerLink}>Create one</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Layout.screenPaddingH },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    marginBottom: Spacing[8],
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  logoEmoji: { fontSize: 20 },
  logoLabel: {
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  heading: {
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize["4xl"],
    lineHeight: FontSize["4xl"] * 1.1,
    color: Colors.text,
    marginBottom: Spacing[2],
  },
  subheading: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.base,
    color: Colors.muted,
    marginBottom: Spacing[8],
  },
  form: { gap: Spacing[4] },
  inputGroup: { gap: Spacing[1] + 2 },
  inputLabel: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.xs,
    letterSpacing: 1.5,
    color: Colors.muted,
  },
  input: {
    height: Layout.inputHeight,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Layout.inputRadius,
    paddingHorizontal: Spacing[4],
    fontFamily: FontFamily.lato,
    fontSize: FontSize.base,
    color: Colors.text,
    backgroundColor: Colors.surface,
  },
  passwordRow: { position: "relative" },
  passwordInput: { paddingRight: Spacing[12] },
  eyeBtn: {
    position: "absolute",
    right: Spacing[4],
    top: 0,
    height: Layout.inputHeight,
    justifyContent: "center",
  },
  eyeIcon: { fontSize: 18 },
  forgotBtn: { alignSelf: "flex-end" },
  forgotText: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  ctaBtn: {
    height: Layout.buttonHeight,
    borderRadius: Layout.buttonRadius,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing[2],
    ...Shadows.md,
  },
  ctaText: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.md,
    color: Colors.white,
    letterSpacing: 0.5,
  },
  divider: { flexDirection: "row", alignItems: "center", gap: Spacing[3] },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.sm,
    color: Colors.muted,
  },
  previewBtn: {
    height: Layout.buttonHeight,
    borderRadius: Layout.buttonRadius,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.surface,
  },
  previewText: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.base,
    color: Colors.muted,
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing[6],
  },
  registerText: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.base,
    color: Colors.muted,
  },
  registerLink: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.base,
    color: Colors.primary,
  },
});

// import { LinearGradient } from "expo-linear-gradient";
// import { useRouter } from "expo-router";
// import { useState } from "react";
// import {
//     KeyboardAvoidingView,
//     Platform,
//     ScrollView,
//     StyleSheet,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     View,
// } from "react-native";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import {
//     Colors,
//     FontFamily,
//     FontSize,
//     Layout,
//     Shadows,
//     Spacing
// } from "../../constants/theme";

// export default function LoginScreen() {
//   const insets = useSafeAreaInsets();
//   const router = useRouter();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   return (
//     <KeyboardAvoidingView
//       style={styles.root}
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//     >
//       <ScrollView
//         contentContainerStyle={[
//           styles.scroll,
//           {
//             paddingTop: insets.top + Spacing[6],
//             paddingBottom: insets.bottom + Spacing[6],
//           },
//         ]}
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Logo mark */}
//         <View style={styles.logoRow}>
//           <View style={styles.logoCircle}>
//             <Text style={styles.logoEmoji}>📜</Text>
//           </View>
//           <Text style={styles.logoLabel}>History Mastery</Text>
//         </View>

//         {/* Heading */}
//         <Text style={styles.heading}>Welcome{"\n"}back</Text>
//         <Text style={styles.subheading}>Sign in to continue your journey</Text>

//         {/* Form */}
//         <View style={styles.form}>
//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>EMAIL</Text>
//             <TextInput
//               style={styles.input}
//               value={email}
//               onChangeText={setEmail}
//               placeholder="you@example.com"
//               placeholderTextColor={Colors.muted}
//               keyboardType="email-address"
//               autoCapitalize="none"
//             />
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>PASSWORD</Text>
//             <View style={styles.passwordRow}>
//               <TextInput
//                 style={[styles.input, styles.passwordInput]}
//                 value={password}
//                 onChangeText={setPassword}
//                 placeholder="••••••••"
//                 placeholderTextColor={Colors.muted}
//                 secureTextEntry={!showPassword}
//                 autoCapitalize="none"
//               />
//               <TouchableOpacity
//                 style={styles.eyeBtn}
//                 onPress={() => setShowPassword((v) => !v)}
//               >
//                 <Text style={styles.eyeIcon}>{showPassword ? "🙈" : "👁️"}</Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           <TouchableOpacity style={styles.forgotBtn}>
//             <Text style={styles.forgotText}>Forgot password?</Text>
//           </TouchableOpacity>

//           {/* CTA */}
//           <TouchableOpacity
//             onPress={() => router.replace("/(tabs)")}
//             activeOpacity={0.85}
//           >
//             <LinearGradient
//               colors={[Colors.primaryLight, Colors.primary, Colors.primaryDark]}
//               start={{ x: 0, y: 0 }}
//               end={{ x: 1, y: 0 }}
//               style={styles.ctaBtn}
//             >
//               <Text style={styles.ctaText}>Sign In</Text>
//             </LinearGradient>
//           </TouchableOpacity>

//           {/* Divider */}
//           <View style={styles.divider}>
//             <View style={styles.dividerLine} />
//             <Text style={styles.dividerText}>or</Text>
//             <View style={styles.dividerLine} />
//           </View>

//           {/* Course preview link */}
//           <TouchableOpacity
//             style={styles.previewBtn}
//             onPress={() => router.push("/course-info")}
//           >
//             <Text style={styles.previewText}>👀 Browse courses first</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Register link */}
//         <View style={styles.registerRow}>
//           <Text style={styles.registerText}>Don't have an account? </Text>
//           <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
//             <Text style={styles.registerLink}>Create one</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: Colors.background },
//   scroll: { paddingHorizontal: Layout.screenPaddingH },
//   logoRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing[3],
//     marginBottom: Spacing[8],
//   },
//   logoCircle: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: Colors.primary,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   logoEmoji: { fontSize: 20 },
//   logoLabel: {
//     fontFamily: FontFamily.playfairBold,
//     fontSize: FontSize.md,
//     color: Colors.text,
//   },
//   heading: {
//     fontFamily: FontFamily.playfairBold,
//     fontSize: FontSize["4xl"],
//     lineHeight: FontSize["4xl"] * 1.1,
//     color: Colors.text,
//     marginBottom: Spacing[2],
//   },
//   subheading: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.base,
//     color: Colors.muted,
//     marginBottom: Spacing[8],
//   },
//   form: { gap: Spacing[4] },
//   inputGroup: { gap: Spacing[1] + 2 },
//   inputLabel: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.xs,
//     letterSpacing: 1.5,
//     color: Colors.muted,
//   },
//   input: {
//     height: Layout.inputHeight,
//     borderWidth: 1.5,
//     borderColor: Colors.border,
//     borderRadius: Layout.inputRadius,
//     paddingHorizontal: Spacing[4],
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.base,
//     color: Colors.text,
//     backgroundColor: Colors.surface,
//   },
//   passwordRow: { position: "relative" },
//   passwordInput: { paddingRight: Spacing[12] },
//   eyeBtn: {
//     position: "absolute",
//     right: Spacing[4],
//     top: 0,
//     height: Layout.inputHeight,
//     justifyContent: "center",
//   },
//   eyeIcon: { fontSize: 18 },
//   forgotBtn: { alignSelf: "flex-end" },
//   forgotText: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.sm,
//     color: Colors.primary,
//   },
//   ctaBtn: {
//     height: Layout.buttonHeight,
//     borderRadius: Layout.buttonRadius,
//     alignItems: "center",
//     justifyContent: "center",
//     marginTop: Spacing[2],
//     ...Shadows.md,
//   },
//   ctaText: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.md,
//     color: Colors.white,
//     letterSpacing: 0.5,
//   },
//   divider: { flexDirection: "row", alignItems: "center", gap: Spacing[3] },
//   dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
//   dividerText: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.sm,
//     color: Colors.muted,
//   },
//   previewBtn: {
//     height: Layout.buttonHeight,
//     borderRadius: Layout.buttonRadius,
//     borderWidth: 1.5,
//     borderColor: Colors.border,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: Colors.surface,
//   },
//   previewText: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.base,
//     color: Colors.muted,
//   },
//   registerRow: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: Spacing[6],
//   },
//   registerText: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.base,
//     color: Colors.muted,
//   },
//   registerLink: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.base,
//     color: Colors.primary,
//   },
// });
