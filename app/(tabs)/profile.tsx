// // app/(tabs)/profile.tsx

import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Switch,
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

type SettingRow = {
  label: string;
  emoji: string;
  type: "nav" | "toggle";
  key?: string;
};

type SettingSection = {
  title: string;
  items: SettingRow[];
};

const SETTINGS: SettingSection[] = [
  {
    title: "Account",
    items: [
      { label: "Edit Profile", emoji: "✏️", type: "nav" },
      { label: "Change Password", emoji: "🔑", type: "nav" },
      { label: "Subscription", emoji: "💎", type: "nav" },
    ],
  },
  {
    title: "Notifications",
    items: [
      {
        label: "Study Reminders",
        emoji: "⏰",
        type: "toggle",
        key: "reminders",
      },
      { label: "Streak Alerts", emoji: "🔥", type: "toggle", key: "streak" },
      { label: "New Content", emoji: "📚", type: "toggle", key: "content" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Help & FAQ", emoji: "❓", type: "nav" },
      { label: "Contact Us", emoji: "💬", type: "nav" },
      { label: "Rate the App", emoji: "⭐", type: "nav" },
    ],
  },
  {
    title: "App",
    items: [
      { label: "Privacy Policy", emoji: "🔒", type: "nav" },
      { label: "Terms of Service", emoji: "📄", type: "nav" },
      { label: "App Version 1.0.0", emoji: "ℹ️", type: "nav" },
    ],
  },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    reminders: true,
    streak: true,
    content: false,
  });

  const setToggle = (key: string, val: boolean) => {
    setToggles((prev) => ({ ...prev, [key]: val }));
  };

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
      <Text style={styles.heading}>Profile</Text>

      {/* Avatar + info card */}
      <View style={styles.profileCard}>
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={styles.avatarCircle}
        >
          <Text style={styles.avatarText}>PS</Text>
        </LinearGradient>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Priya Sharma</Text>
          <Text style={styles.profileEmail}>priya@example.com</Text>
          <View style={styles.accessBadge}>
            <Text style={styles.accessText}>✦ Full Access</Text>
          </View>
        </View>
      </View>

      {/* Quick stats */}
      <View style={styles.quickStats}>
        {[
          { label: "Streak", value: "7 🔥" },
          { label: "Completed", value: "8 ✅" },
          { label: "Exam", value: "APTET" },
        ].map((s) => (
          <View key={s.label} style={styles.quickStat}>
            <Text style={styles.quickValue}>{s.value}</Text>
            <Text style={styles.quickLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Settings sections */}
      {SETTINGS.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.sectionCard}>
            {section.items.map((item, idx) => (
              <View key={item.label}>
                <View style={styles.settingRow}>
                  <View style={styles.settingLeft}>
                    <Text style={styles.settingEmoji}>{item.emoji}</Text>
                    <Text style={styles.settingLabel}>{item.label}</Text>
                  </View>
                  {item.type === "toggle" && item.key ? (
                    <Switch
                      value={toggles[item.key]}
                      onValueChange={(v) => setToggle(item.key!, v)}
                      trackColor={{
                        false: Colors.border,
                        true: Colors.primary + "60",
                      }}
                      thumbColor={
                        toggles[item.key] ? Colors.primary : Colors.muted
                      }
                    />
                  ) : (
                    <Text style={styles.settingArrow}>›</Text>
                  )}
                </View>
                {idx < section.items.length - 1 && (
                  <View style={styles.separator} />
                )}
              </View>
            ))}
          </View>
        </View>
      ))}

      {/* Log out */}
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => console.log("Log out pressed")}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      <Text style={styles.versionNote}>
        History Mastery v1.0.0 · Made with ❤️ for Indian exam aspirants
      </Text>
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
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[4],
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing[5],
    marginBottom: Spacing[4],
    ...Shadows.md,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize.xl,
    color: Colors.white,
  },
  profileInfo: { flex: 1, gap: Spacing[1] },
  profileName: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.lg,
    color: Colors.text,
  },
  profileEmail: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.sm,
    color: Colors.muted,
  },
  accessBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: Radii.full,
    backgroundColor: Colors.accent + "25",
    marginTop: Spacing[1],
  },
  accessText: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.xs,
    color: Colors.accentDark,
    letterSpacing: 0.3,
  },
  quickStats: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    marginBottom: Spacing[6],
    ...Shadows.sm,
  },
  quickStat: {
    flex: 1,
    alignItems: "center",
    paddingVertical: Spacing[4],
    gap: Spacing[1],
  },
  quickValue: {
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize.lg,
    color: Colors.text,
  },
  quickLabel: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.xs,
    color: Colors.muted,
  },
  section: { marginBottom: Spacing[5] },
  sectionTitle: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.xs,
    letterSpacing: 1.5,
    color: Colors.muted,
    marginBottom: Spacing[2],
    paddingLeft: Spacing[1],
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    ...Shadows.sm,
    overflow: "hidden",
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing[4],
  },
  settingLeft: { flexDirection: "row", alignItems: "center", gap: Spacing[3] },
  settingEmoji: { fontSize: 20 },
  settingLabel: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.base,
    color: Colors.text,
  },
  settingArrow: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.xl,
    color: Colors.muted,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: Spacing[12],
  },
  logoutBtn: {
    height: Layout.buttonHeight,
    borderRadius: Layout.buttonRadius,
    borderWidth: 1.5,
    borderColor: Colors.error + "40",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.error + "08",
    marginBottom: Spacing[5],
  },
  logoutText: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.base,
    color: Colors.error,
  },
  versionNote: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.xs,
    color: Colors.muted,
    textAlign: "center",
    marginBottom: Spacing[4],
  },
});

// import React, { useState } from 'react';
// import {
//   View, Text, StyleSheet, ScrollView, TouchableOpacity,
//   Switch, Alert,
// } from 'react-native';
// import { router } from 'expo-router';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useAuthStore } from '../../lib/store';
// import { supabase } from '../../lib/supabase';
// import { Colors, Typography, Radii, Shadows, Layout } from '../../constants/theme';

// export default function ProfileScreen() {
//   const insets = useSafeAreaInsets();
//   const { profile, logout } = useAuthStore();
//   const [notificationsEnabled, setNotificationsEnabled] = useState(true);

//   const handleLogout = () => {
//     Alert.alert(
//       'Log Out',
//       'Are you sure you want to log out?',
//       [
//         { text: 'Cancel', style: 'cancel' },
//         {
//           text: 'Log Out',
//           style: 'destructive',
//           onPress: async () => {
//             await supabase.auth.signOut();
//             logout();
//             router.replace('/(auth)/login');
//           },
//         },
//       ]
//     );
//   };

//   const initials = profile?.full_name
//     ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
//     : '??';

//   return (
//     <ScrollView
//       style={styles.container}
//       contentContainerStyle={[styles.content, { paddingTop: insets.top + 20 }]}
//       showsVerticalScrollIndicator={false}
//     >
//       {/* Profile hero */}
//       <View style={styles.profileHero}>
//         <LinearGradient
//           colors={['#C4622D', '#E8A855']}
//           style={styles.avatarCircle}
//         >
//           <Text style={styles.avatarInitials}>{initials}</Text>
//         </LinearGradient>

//         <Text style={styles.profileName}>{profile?.full_name ?? 'Student'}</Text>
//         <Text style={styles.profileEmail}>{profile?.email}</Text>

//         {/* Status badge */}
//         <View style={[
//           styles.statusBadge,
//           profile?.is_paid ? styles.statusBadgePaid : styles.statusBadgeFree,
//         ]}>
//           <Text style={[
//             styles.statusText,
//             profile?.is_paid ? styles.statusTextPaid : styles.statusTextFree,
//           ]}>
//             {profile?.is_paid ? '✅ Full Access' : '🔒 Free Plan'}
//           </Text>
//         </View>

//         {!profile?.is_paid && (
//           <TouchableOpacity
//             style={styles.upgradeBtn}
//             onPress={() => router.push('/course-info')}
//           >
//             <Text style={styles.upgradeBtnText}>Upgrade to Full Access →</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Quick stats */}
//       <View style={styles.quickStats}>
//         <View style={styles.quickStat}>
//           <Text style={styles.quickStatValue}>{profile?.streak_count ?? 0}</Text>
//           <Text style={styles.quickStatLabel}>Day Streak 🔥</Text>
//         </View>
//         <View style={styles.statDivider} />
//         <View style={styles.quickStat}>
//           <Text style={styles.quickStatValue}>
//             {profile?.exam_target ?? '—'}
//           </Text>
//           <Text style={styles.quickStatLabel}>Target Exam 🎯</Text>
//         </View>
//       </View>

//       {/* Settings sections */}
//       <SettingsSection title="Account">
//         <SettingsRow
//           icon="👤"
//           label="Edit Profile"
//           onPress={() => { /* Navigate to edit profile */ }}
//         />
//         <SettingsRow
//           icon="🎯"
//           label="Change Target Exam"
//           value={profile?.exam_target ?? 'Not set'}
//           onPress={() => { /* Navigate to edit */ }}
//         />
//         {profile?.is_paid && (
//           <SettingsRow
//             icon="🧾"
//             label="Purchase Receipt"
//             onPress={() => { /* Show receipt */ }}
//           />
//         )}
//       </SettingsSection>

//       <SettingsSection title="Notifications">
//         <View style={styles.settingsRow}>
//           <View style={styles.settingsRowLeft}>
//             <Text style={styles.settingsRowIcon}>🔔</Text>
//             <Text style={styles.settingsRowLabel}>Daily Reminder</Text>
//           </View>
//           <Switch
//             value={notificationsEnabled}
//             onValueChange={setNotificationsEnabled}
//             trackColor={{ false: Colors.surfaceMuted, true: Colors.primary + '60' }}
//             thumbColor={notificationsEnabled ? Colors.primary : Colors.textMuted}
//           />
//         </View>
//       </SettingsSection>

//       <SettingsSection title="Support">
//         <SettingsRow icon="❓" label="FAQ" onPress={() => {}} />
//         <SettingsRow icon="📧" label="Contact Us" onPress={() => {}} />
//         <SettingsRow icon="📜" label="Terms of Service" onPress={() => {}} />
//         <SettingsRow icon="🔒" label="Privacy Policy" onPress={() => {}} />
//       </SettingsSection>

//       <SettingsSection title="App">
//         <SettingsRow
//           icon="⭐"
//           label="Rate the App"
//           onPress={() => {}}
//         />
//         <SettingsRow
//           icon="🔄"
//           label="App Version"
//           value="1.0.0"
//           onPress={() => {}}
//           noArrow
//         />
//       </SettingsSection>

//       {/* Logout */}
//       <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
//         <Text style={styles.logoutText}>Log Out</Text>
//       </TouchableOpacity>

//       {/* Delete account */}
//       <TouchableOpacity style={styles.deleteBtn}>
//         <Text style={styles.deleteText}>Delete Account</Text>
//       </TouchableOpacity>

//       <View style={{ height: 32 }} />
//     </ScrollView>
//   );
// }

// function SettingsSection({
//   title, children,
// }: {
//   title: string; children: React.ReactNode;
// }) {
//   return (
//     <View style={styles.section}>
//       <Text style={styles.sectionTitle}>{title}</Text>
//       <View style={styles.sectionCard}>{children}</View>
//     </View>
//   );
// }

// function SettingsRow({
//   icon, label, value, onPress, noArrow,
// }: {
//   icon: string;
//   label: string;
//   value?: string;
//   onPress: () => void;
//   noArrow?: boolean;
// }) {
//   return (
//     <TouchableOpacity style={styles.settingsRow} onPress={onPress}>
//       <View style={styles.settingsRowLeft}>
//         <Text style={styles.settingsRowIcon}>{icon}</Text>
//         <Text style={styles.settingsRowLabel}>{label}</Text>
//       </View>
//       <View style={styles.settingsRowRight}>
//         {value && <Text style={styles.settingsRowValue}>{value}</Text>}
//         {!noArrow && <Text style={styles.settingsRowArrow}>›</Text>}
//       </View>
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.background },
//   content: { paddingHorizontal: Layout.screenPadding, gap: 20, paddingBottom: 40 },

//   // Profile hero
//   profileHero: {
//     alignItems: 'center',
//     gap: 10,
//     paddingVertical: 20,
//   },
//   avatarCircle: {
//     width: 88,
//     height: 88,
//     borderRadius: 44,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginBottom: 4,
//   },
//   avatarInitials: {
//     fontFamily: Typography.heading,
//     fontSize: Typography.size.xl,
//     color: '#FFFFFF',
//   },
//   profileName: {
//     fontFamily: Typography.heading,
//     fontSize: Typography.size['2xl'],
//     color: Colors.textPrimary,
//   },
//   profileEmail: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: Colors.textMuted,
//   },
//   statusBadge: {
//     paddingHorizontal: 14,
//     paddingVertical: 6,
//     borderRadius: Radii.full,
//     marginTop: 4,
//   },
//   statusBadgePaid: { backgroundColor: Colors.success + '15' },
//   statusBadgeFree: { backgroundColor: Colors.surfaceMuted },
//   statusText: { fontFamily: Typography.bodyMedium, fontSize: Typography.size.sm },
//   statusTextPaid: { color: Colors.success },
//   statusTextFree: { color: Colors.textMuted },
//   upgradeBtn: {
//     marginTop: 4,
//     paddingHorizontal: 20,
//     paddingVertical: 10,
//     backgroundColor: Colors.primary,
//     borderRadius: Radii.full,
//   },
//   upgradeBtnText: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.sm,
//     color: '#FFFFFF',
//   },

//   // Quick stats
//   quickStats: {
//     backgroundColor: Colors.surface,
//     borderRadius: Radii.lg,
//     padding: 20,
//     flexDirection: 'row',
//     ...Shadows.sm,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   quickStat: { flex: 1, alignItems: 'center', gap: 4 },
//   quickStatValue: {
//     fontFamily: Typography.heading,
//     fontSize: Typography.size.xl,
//     color: Colors.textPrimary,
//   },
//   quickStatLabel: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: Colors.textMuted,
//   },
//   statDivider: { width: 1, backgroundColor: Colors.border },

//   // Section
//   section: { gap: 8 },
//   sectionTitle: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.sm,
//     color: Colors.textMuted,
//     textTransform: 'uppercase',
//     letterSpacing: 0.8,
//     paddingHorizontal: 4,
//   },
//   sectionCard: {
//     backgroundColor: Colors.surface,
//     borderRadius: Radii.lg,
//     overflow: 'hidden',
//     ...Shadows.sm,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   settingsRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.borderLight,
//   },
//   settingsRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
//   settingsRowIcon: { fontSize: 20 },
//   settingsRowLabel: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.base,
//     color: Colors.textPrimary,
//   },
//   settingsRowRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
//   settingsRowValue: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: Colors.textMuted,
//   },
//   settingsRowArrow: { fontSize: 22, color: Colors.textMuted },

//   // Logout / Delete
//   logoutBtn: {
//     borderWidth: 1.5,
//     borderColor: Colors.error,
//     borderRadius: Radii.full,
//     paddingVertical: 14,
//     alignItems: 'center',
//   },
//   logoutText: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.base,
//     color: Colors.error,
//   },
//   deleteBtn: { alignItems: 'center', paddingVertical: 8 },
//   deleteText: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: Colors.textMuted,
//     textDecorationLine: 'underline',
//   },
// });
