// // app/(auth)/login.tsx

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
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

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

        {/* Heading */}
        <Text style={styles.heading}>Welcome{"\n"}back</Text>
        <Text style={styles.subheading}>Sign in to continue your journey</Text>

        {/* Form */}
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

          {/* CTA */}
          <TouchableOpacity
            onPress={() => router.replace("/(tabs)")}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={[Colors.primaryLight, Colors.primary, Colors.primaryDark]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.ctaBtn}
            >
              <Text style={styles.ctaText}>Sign In</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Course preview link */}
          <TouchableOpacity
            style={styles.previewBtn}
            onPress={() => router.push("/course-info")}
          >
            <Text style={styles.previewText}>👀 Browse courses first</Text>
          </TouchableOpacity>
        </View>

        {/* Register link */}
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

// import React, { useState } from 'react';
// import {
//   View, Text, StyleSheet, TextInput, TouchableOpacity,
//   KeyboardAvoidingView, Platform, ScrollView, Alert,
// } from 'react-native';
// import { router } from 'expo-router';
// import { LinearGradient } from 'expo-linear-gradient';
// import * as Haptics from 'expo-haptics';
// import { supabase } from '../../lib/supabase';
// import { Colors, Typography, Spacing, Radii, Shadows } from '../../constants/theme';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleLogin = async () => {
//     if (!email || !password) {
//       Alert.alert('Missing fields', 'Please enter your email and password.');
//       return;
//     }
//     setLoading(true);
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

//     const { error } = await supabase.auth.signInWithPassword({ email, password });

//     if (error) {
//       Alert.alert('Login Failed', error.message);
//       setLoading(false);
//       return;
//     }
//     // Auth store listener in _layout.tsx handles navigation
//     setLoading(false);
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.flex}
//       behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//     >
//       <ScrollView
//         contentContainerStyle={styles.container}
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Header decoration */}
//         <View style={styles.headerDecor}>
//           <LinearGradient
//             colors={['#C4622D', '#E8A855']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 1 }}
//             style={styles.gradientBadge}
//           >
//             <Text style={styles.badgeEmoji}>📚</Text>
//           </LinearGradient>
//         </View>

//         {/* Heading */}
//         <View style={styles.headingArea}>
//           <Text style={styles.title}>Welcome back</Text>
//           <Text style={styles.subtitle}>
//             Continue your history learning journey
//           </Text>
//         </View>

//         {/* Form */}
//         <View style={styles.form}>
//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Email</Text>
//             <TextInput
//               style={styles.input}
//               value={email}
//               onChangeText={setEmail}
//               placeholder="you@example.com"
//               placeholderTextColor={Colors.textMuted}
//               keyboardType="email-address"
//               autoCapitalize="none"
//               autoCorrect={false}
//             />
//           </View>

//           <View style={styles.inputGroup}>
//             <Text style={styles.label}>Password</Text>
//             <View style={styles.passwordRow}>
//               <TextInput
//                 style={[styles.input, styles.passwordInput]}
//                 value={password}
//                 onChangeText={setPassword}
//                 placeholder="Enter your password"
//                 placeholderTextColor={Colors.textMuted}
//                 secureTextEntry={!showPassword}
//                 autoCapitalize="none"
//               />
//               <TouchableOpacity
//                 style={styles.showBtn}
//                 onPress={() => setShowPassword(!showPassword)}
//               >
//                 <Text style={styles.showBtnText}>
//                   {showPassword ? 'Hide' : 'Show'}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//           </View>

//           <TouchableOpacity style={styles.forgotBtn}>
//             <Text style={styles.forgotText}>Forgot password?</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Login Button */}
//         <TouchableOpacity
//           style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
//           onPress={handleLogin}
//           disabled={loading}
//           activeOpacity={0.85}
//         >
//           <LinearGradient
//             colors={['#C4622D', '#E8845A']}
//             start={{ x: 0, y: 0 }}
//             end={{ x: 1, y: 0 }}
//             style={styles.loginBtnGradient}
//           >
//             <Text style={styles.loginBtnText}>
//               {loading ? 'Signing in...' : 'Sign In'}
//             </Text>
//           </LinearGradient>
//         </TouchableOpacity>

//         {/* Divider */}
//         <View style={styles.dividerRow}>
//           <View style={styles.dividerLine} />
//           <Text style={styles.dividerText}>New here?</Text>
//           <View style={styles.dividerLine} />
//         </View>

//         {/* Register link */}
//         <TouchableOpacity
//           style={styles.registerBtn}
//           onPress={() => router.push('/(auth)/register')}
//         >
//           <Text style={styles.registerBtnText}>Create an account</Text>
//         </TouchableOpacity>

//         {/* Course info teaser */}
//         <TouchableOpacity
//           style={styles.courseTeaser}
//           onPress={() => router.push('/course-info')}
//         >
//           <Text style={styles.courseTeaserText}>
//             👀 Browse course before signing up →
//           </Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   flex: { flex: 1, backgroundColor: Colors.background },
//   container: {
//     flexGrow: 1,
//     paddingHorizontal: 28,
//     paddingTop: 80,
//     paddingBottom: 40,
//   },
//   headerDecor: {
//     alignItems: 'flex-start',
//     marginBottom: 32,
//   },
//   gradientBadge: {
//     width: 64,
//     height: 64,
//     borderRadius: Radii.lg,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   badgeEmoji: { fontSize: 32 },
//   headingArea: { marginBottom: 40 },
//   title: {
//     fontFamily: Typography.heading,
//     fontSize: Typography.size['3xl'],
//     color: Colors.textPrimary,
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.base,
//     color: Colors.textMuted,
//     lineHeight: 22,
//   },
//   form: { gap: 20, marginBottom: 32 },
//   inputGroup: { gap: 8 },
//   label: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.sm,
//     color: Colors.textSecondary,
//     letterSpacing: 0.3,
//   },
//   input: {
//     backgroundColor: Colors.surface,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     borderRadius: Radii.md,
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     fontFamily: Typography.body,
//     fontSize: Typography.size.base,
//     color: Colors.textPrimary,
//     ...Shadows.sm,
//   },
//   passwordRow: { position: 'relative' },
//   passwordInput: { paddingRight: 64 },
//   showBtn: {
//     position: 'absolute',
//     right: 16,
//     top: 0,
//     bottom: 0,
//     justifyContent: 'center',
//   },
//   showBtnText: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.sm,
//     color: Colors.primary,
//   },
//   forgotBtn: { alignSelf: 'flex-end' },
//   forgotText: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: Colors.primary,
//   },
//   loginBtn: { borderRadius: Radii.full, overflow: 'hidden', ...Shadows.md },
//   loginBtnDisabled: { opacity: 0.6 },
//   loginBtnGradient: { paddingVertical: 18, alignItems: 'center' },
//   loginBtnText: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.md,
//     color: '#FFFFFF',
//     letterSpacing: 0.3,
//   },
//   dividerRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 12,
//     marginVertical: 24,
//   },
//   dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
//   dividerText: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: Colors.textMuted,
//   },
//   registerBtn: {
//     borderWidth: 1.5,
//     borderColor: Colors.primary,
//     borderRadius: Radii.full,
//     paddingVertical: 16,
//     alignItems: 'center',
//   },
//   registerBtnText: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.base,
//     color: Colors.primary,
//   },
//   courseTeaser: {
//     marginTop: 24,
//     alignItems: 'center',
//   },
//   courseTeaserText: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: Colors.textMuted,
//   },
// });
