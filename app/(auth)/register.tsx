// // // app/(auth)/register.tsx

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
  Radii,
  Shadows,
  Spacing,
} from "../../constants/theme";
import { supabase } from "../../lib/supabase";

const EXAM_OPTIONS = ["APTET", "DSC", "UPSC", "TSPSC", "Other"] as const;
type ExamOption = (typeof EXAM_OPTIONS)[number];

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedExam, setSelectedExam] = useState<ExamOption | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Missing fields", "Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Weak password", "Password must be at least 8 characters.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { full_name: fullName.trim() },
      },
    });
    setLoading(false);

    if (error) {
      Alert.alert("Registration Failed", error.message);
      return;
    }

    // Update profile with exam_target and full_name
    // (The trigger creates the row; we update the extra fields)
    if (data.user) {
      await supabase
        .from("profiles")
        .update({
          full_name: fullName.trim(),
          exam_target: selectedExam ?? "Other",
        })
        .eq("id", data.user.id);
    }

    Alert.alert("Account Created! 🎉", "Please sign in to continue.", [
      { text: "Go to Login", onPress: () => router.replace("/(auth)/login") },
    ]);
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
            paddingTop: insets.top + Spacing[5],
            paddingBottom: insets.bottom + Spacing[6],
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Create your{"\n"}account</Text>
        <Text style={styles.subheading}>
          Start your history exam prep today
        </Text>

        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>FULL NAME</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Priya Sharma"
              placeholderTextColor={Colors.muted}
              autoCapitalize="words"
            />
          </View>

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
                placeholder="Min. 8 characters"
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

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>I'M PREPARING FOR</Text>
            <View style={styles.chipRow}>
              {EXAM_OPTIONS.map((exam) => {
                const active = selectedExam === exam;
                return (
                  <TouchableOpacity
                    key={exam}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setSelectedExam(exam)}
                    activeOpacity={0.75}
                  >
                    <Text
                      style={[styles.chipText, active && styles.chipTextActive]}
                    >
                      {exam}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <TouchableOpacity
            onPress={handleRegister}
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
                <Text style={styles.ctaText}>Create Account</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By registering you agree to our{" "}
            <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </View>

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.loginLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingHorizontal: Layout.screenPaddingH },
  backBtn: { marginBottom: Spacing[6] },
  backText: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.base,
    color: Colors.primary,
  },
  heading: {
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize["3xl"],
    lineHeight: FontSize["3xl"] * 1.1,
    color: Colors.text,
    marginBottom: Spacing[2],
  },
  subheading: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.base,
    color: Colors.muted,
    marginBottom: Spacing[8],
  },
  form: { gap: Spacing[5] },
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
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing[2] },
  chip: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: Radii.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  chipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "15",
  },
  chipText: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.sm,
    color: Colors.muted,
  },
  chipTextActive: { color: Colors.primary },
  ctaBtn: {
    height: Layout.buttonHeight,
    borderRadius: Layout.buttonRadius,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.md,
  },
  ctaText: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.md,
    color: Colors.white,
    letterSpacing: 0.5,
  },
  termsText: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.sm,
    color: Colors.muted,
    textAlign: "center",
    lineHeight: FontSize.sm * 1.6,
  },
  termsLink: { fontFamily: FontFamily.latoBold, color: Colors.primary },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: Spacing[6],
  },
  loginText: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.base,
    color: Colors.muted,
  },
  loginLink: {
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
//     Radii,
//     Shadows,
//     Spacing,
// } from "../../constants/theme";

// const EXAM_OPTIONS = ["APTET", "DSC", "UPSC", "TSPSC", "Other"] as const;
// type ExamOption = (typeof EXAM_OPTIONS)[number];

// export default function RegisterScreen() {
//   const insets = useSafeAreaInsets();
//   const router = useRouter();

//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [selectedExam, setSelectedExam] = useState<ExamOption | null>(null);

//   return (
//     <KeyboardAvoidingView
//       style={styles.root}
//       behavior={Platform.OS === "ios" ? "padding" : undefined}
//     >
//       <ScrollView
//         contentContainerStyle={[
//           styles.scroll,
//           {
//             paddingTop: insets.top + Spacing[5],
//             paddingBottom: insets.bottom + Spacing[6],
//           },
//         ]}
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Back */}
//         <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
//           <Text style={styles.backText}>← Back</Text>
//         </TouchableOpacity>

//         <Text style={styles.heading}>Create your{"\n"}account</Text>
//         <Text style={styles.subheading}>
//           Start your history exam prep today
//         </Text>

//         <View style={styles.form}>
//           {/* Full Name */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>FULL NAME</Text>
//             <TextInput
//               style={styles.input}
//               value={fullName}
//               onChangeText={setFullName}
//               placeholder="Priya Sharma"
//               placeholderTextColor={Colors.muted}
//               autoCapitalize="words"
//             />
//           </View>

//           {/* Email */}
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

//           {/* Password */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>PASSWORD</Text>
//             <View style={styles.passwordRow}>
//               <TextInput
//                 style={[styles.input, styles.passwordInput]}
//                 value={password}
//                 onChangeText={setPassword}
//                 placeholder="Min. 8 characters"
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

//           {/* Exam selector */}
//           <View style={styles.inputGroup}>
//             <Text style={styles.inputLabel}>I'M PREPARING FOR</Text>
//             <View style={styles.chipRow}>
//               {EXAM_OPTIONS.map((exam) => {
//                 const active = selectedExam === exam;
//                 return (
//                   <TouchableOpacity
//                     key={exam}
//                     style={[styles.chip, active && styles.chipActive]}
//                     onPress={() => setSelectedExam(exam)}
//                     activeOpacity={0.75}
//                   >
//                     <Text
//                       style={[styles.chipText, active && styles.chipTextActive]}
//                     >
//                       {exam}
//                     </Text>
//                   </TouchableOpacity>
//                 );
//               })}
//             </View>
//           </View>

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
//               <Text style={styles.ctaText}>Create Account</Text>
//             </LinearGradient>
//           </TouchableOpacity>

//           <Text style={styles.termsText}>
//             By registering you agree to our{" "}
//             <Text style={styles.termsLink}>Terms of Service</Text> and{" "}
//             <Text style={styles.termsLink}>Privacy Policy</Text>
//           </Text>
//         </View>

//         {/* Login link */}
//         <View style={styles.loginRow}>
//           <Text style={styles.loginText}>Already have an account? </Text>
//           <TouchableOpacity onPress={() => router.back()}>
//             <Text style={styles.loginLink}>Sign in</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: Colors.background },
//   scroll: { paddingHorizontal: Layout.screenPaddingH },
//   backBtn: { marginBottom: Spacing[6] },
//   backText: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.base,
//     color: Colors.primary,
//   },
//   heading: {
//     fontFamily: FontFamily.playfairBold,
//     fontSize: FontSize["3xl"],
//     lineHeight: FontSize["3xl"] * 1.1,
//     color: Colors.text,
//     marginBottom: Spacing[2],
//   },
//   subheading: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.base,
//     color: Colors.muted,
//     marginBottom: Spacing[8],
//   },
//   form: { gap: Spacing[5] },
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
//   chipRow: { flexDirection: "row", flexWrap: "wrap", gap: Spacing[2] },
//   chip: {
//     paddingHorizontal: Spacing[4],
//     paddingVertical: Spacing[2],
//     borderRadius: Radii.full,
//     borderWidth: 1.5,
//     borderColor: Colors.border,
//     backgroundColor: Colors.surface,
//   },
//   chipActive: {
//     borderColor: Colors.primary,
//     backgroundColor: Colors.primary + "15",
//   },
//   chipText: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.sm,
//     color: Colors.muted,
//   },
//   chipTextActive: { color: Colors.primary },
//   ctaBtn: {
//     height: Layout.buttonHeight,
//     borderRadius: Layout.buttonRadius,
//     alignItems: "center",
//     justifyContent: "center",
//     ...Shadows.md,
//   },
//   ctaText: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.md,
//     color: Colors.white,
//     letterSpacing: 0.5,
//   },
//   termsText: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.sm,
//     color: Colors.muted,
//     textAlign: "center",
//     lineHeight: FontSize.sm * 1.6,
//   },
//   termsLink: { fontFamily: FontFamily.latoBold, color: Colors.primary },
//   loginRow: {
//     flexDirection: "row",
//     justifyContent: "center",
//     marginTop: Spacing[6],
//   },
//   loginText: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.base,
//     color: Colors.muted,
//   },
//   loginLink: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.base,
//     color: Colors.primary,
//   },
// });
