// // // app/(tabs)/profile.tsx

import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
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
import {
  useAuthStore,
  usePlayerStore,
  useProgressStore,
} from "../../lib/store";
import { supabase } from "../../lib/supabase";
import { getFirstName } from "../../lib/utils";

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
  const router = useRouter();
  const { profile, logout } = useAuthStore();
  const { clearProgress } = useProgressStore();
  const { clearPlayer } = usePlayerStore();

  const [toggles, setToggles] = useState<Record<string, boolean>>({
    reminders: true,
    streak: true,
    content: false,
  });
  const [loggingOut, setLoggingOut] = useState(false);

  const setToggle = (key: string, val: boolean) => {
    setToggles((prev) => ({ ...prev, [key]: val }));
  };

  const handleLogOut = async () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          setLoggingOut(true);
          await supabase.auth.signOut();
          logout();
          clearProgress();
          clearPlayer();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  // Avatar initials from full name
  const initials = (profile?.full_name ?? "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const firstName = getFirstName(profile?.full_name ?? "");

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

      {/* Avatar + info */}
      <View style={styles.profileCard}>
        <LinearGradient
          colors={[Colors.primary, Colors.primaryDark]}
          style={styles.avatarCircle}
        >
          <Text style={styles.avatarText}>{initials}</Text>
        </LinearGradient>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{profile?.full_name ?? "—"}</Text>
          <Text style={styles.profileEmail}>{profile?.email ?? "—"}</Text>
          <View
            style={[
              styles.accessBadge,
              {
                backgroundColor: profile?.is_paid
                  ? Colors.success + "20"
                  : Colors.accent + "25",
              },
            ]}
          >
            <Text
              style={[
                styles.accessText,
                {
                  color: profile?.is_paid ? Colors.success : Colors.accentDark,
                },
              ]}
            >
              {profile?.is_paid ? "✦  Full Access" : "⚡  Free Plan"}
            </Text>
          </View>
        </View>
      </View>

      {/* Quick stats */}
      <View style={styles.quickStats}>
        {[
          { label: "Streak", value: `${profile?.streak_count ?? 0} 🔥` },
          { label: "Exam", value: profile?.exam_target ?? "—" },
          { label: "Plan", value: profile?.is_paid ? "Paid ✅" : "Free" },
        ].map((s) => (
          <View key={s.label} style={styles.quickStat}>
            <Text style={styles.quickValue}>{s.value}</Text>
            <Text style={styles.quickLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Upgrade nudge for free users */}
      {!profile?.is_paid && (
        <TouchableOpacity
          style={styles.upgradeNudge}
          onPress={() => router.push("/course-info")}
          activeOpacity={0.85}
        >
          <Text style={styles.upgradeNudgeText}>
            🚀 Unlock all chapters for ₹999 →
          </Text>
        </TouchableOpacity>
      )}

      {/* Settings */}
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
        onPress={handleLogOut}
        disabled={loggingOut}
      >
        <Text style={styles.logoutText}>
          {loggingOut ? "Logging out…" : "Log Out"}
        </Text>
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
    marginTop: Spacing[1],
  },
  accessText: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.xs,
    letterSpacing: 0.3,
  },
  quickStats: {
    flexDirection: "row",
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    marginBottom: Spacing[4],
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
  upgradeNudge: {
    backgroundColor: Colors.primary + "12",
    borderWidth: 1,
    borderColor: Colors.primary + "30",
    borderRadius: Radii.xl,
    padding: Spacing[4],
    alignItems: "center",
    marginBottom: Spacing[5],
  },
  upgradeNudgeText: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.base,
    color: Colors.primary,
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

// import { LinearGradient } from "expo-linear-gradient";
// import { useState } from "react";
// import {
//   ScrollView,
//   StyleSheet,
//   Switch,
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
// } from "../../constants/theme";

// type SettingRow = {
//   label: string;
//   emoji: string;
//   type: "nav" | "toggle";
//   key?: string;
// };

// type SettingSection = {
//   title: string;
//   items: SettingRow[];
// };

// const SETTINGS: SettingSection[] = [
//   {
//     title: "Account",
//     items: [
//       { label: "Edit Profile", emoji: "✏️", type: "nav" },
//       { label: "Change Password", emoji: "🔑", type: "nav" },
//       { label: "Subscription", emoji: "💎", type: "nav" },
//     ],
//   },
//   {
//     title: "Notifications",
//     items: [
//       {
//         label: "Study Reminders",
//         emoji: "⏰",
//         type: "toggle",
//         key: "reminders",
//       },
//       { label: "Streak Alerts", emoji: "🔥", type: "toggle", key: "streak" },
//       { label: "New Content", emoji: "📚", type: "toggle", key: "content" },
//     ],
//   },
//   {
//     title: "Support",
//     items: [
//       { label: "Help & FAQ", emoji: "❓", type: "nav" },
//       { label: "Contact Us", emoji: "💬", type: "nav" },
//       { label: "Rate the App", emoji: "⭐", type: "nav" },
//     ],
//   },
//   {
//     title: "App",
//     items: [
//       { label: "Privacy Policy", emoji: "🔒", type: "nav" },
//       { label: "Terms of Service", emoji: "📄", type: "nav" },
//       { label: "App Version 1.0.0", emoji: "ℹ️", type: "nav" },
//     ],
//   },
// ];

// export default function ProfileScreen() {
//   const insets = useSafeAreaInsets();
//   const [toggles, setToggles] = useState<Record<string, boolean>>({
//     reminders: true,
//     streak: true,
//     content: false,
//   });

//   const setToggle = (key: string, val: boolean) => {
//     setToggles((prev) => ({ ...prev, [key]: val }));
//   };

//   return (
//     <ScrollView
//       style={styles.root}
//       contentContainerStyle={[
//         styles.content,
//         {
//           paddingTop: insets.top + Spacing[4],
//           paddingBottom: insets.bottom + 100,
//         },
//       ]}
//       showsVerticalScrollIndicator={false}
//     >
//       <Text style={styles.heading}>Profile</Text>

//       {/* Avatar + info card */}
//       <View style={styles.profileCard}>
//         <LinearGradient
//           colors={[Colors.primary, Colors.primaryDark]}
//           style={styles.avatarCircle}
//         >
//           <Text style={styles.avatarText}>PS</Text>
//         </LinearGradient>
//         <View style={styles.profileInfo}>
//           <Text style={styles.profileName}>Priya Sharma</Text>
//           <Text style={styles.profileEmail}>priya@example.com</Text>
//           <View style={styles.accessBadge}>
//             <Text style={styles.accessText}>✦ Full Access</Text>
//           </View>
//         </View>
//       </View>

//       {/* Quick stats */}
//       <View style={styles.quickStats}>
//         {[
//           { label: "Streak", value: "7 🔥" },
//           { label: "Completed", value: "8 ✅" },
//           { label: "Exam", value: "APTET" },
//         ].map((s) => (
//           <View key={s.label} style={styles.quickStat}>
//             <Text style={styles.quickValue}>{s.value}</Text>
//             <Text style={styles.quickLabel}>{s.label}</Text>
//           </View>
//         ))}
//       </View>

//       {/* Settings sections */}
//       {SETTINGS.map((section) => (
//         <View key={section.title} style={styles.section}>
//           <Text style={styles.sectionTitle}>{section.title}</Text>
//           <View style={styles.sectionCard}>
//             {section.items.map((item, idx) => (
//               <View key={item.label}>
//                 <View style={styles.settingRow}>
//                   <View style={styles.settingLeft}>
//                     <Text style={styles.settingEmoji}>{item.emoji}</Text>
//                     <Text style={styles.settingLabel}>{item.label}</Text>
//                   </View>
//                   {item.type === "toggle" && item.key ? (
//                     <Switch
//                       value={toggles[item.key]}
//                       onValueChange={(v) => setToggle(item.key!, v)}
//                       trackColor={{
//                         false: Colors.border,
//                         true: Colors.primary + "60",
//                       }}
//                       thumbColor={
//                         toggles[item.key] ? Colors.primary : Colors.muted
//                       }
//                     />
//                   ) : (
//                     <Text style={styles.settingArrow}>›</Text>
//                   )}
//                 </View>
//                 {idx < section.items.length - 1 && (
//                   <View style={styles.separator} />
//                 )}
//               </View>
//             ))}
//           </View>
//         </View>
//       ))}

//       {/* Log out */}
//       <TouchableOpacity
//         style={styles.logoutBtn}
//         onPress={() => console.log("Log out pressed")}
//       >
//         <Text style={styles.logoutText}>Log Out</Text>
//       </TouchableOpacity>

//       <Text style={styles.versionNote}>
//         History Mastery v1.0.0 · Made with ❤️ for Indian exam aspirants
//       </Text>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: Colors.background },
//   content: { paddingHorizontal: Layout.screenPaddingH },
//   heading: {
//     fontFamily: FontFamily.playfairBold,
//     fontSize: FontSize["2xl"],
//     color: Colors.text,
//     marginBottom: Spacing[5],
//   },
//   profileCard: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing[4],
//     backgroundColor: Colors.surface,
//     borderRadius: Radii.xl,
//     padding: Spacing[5],
//     marginBottom: Spacing[4],
//     ...Shadows.md,
//   },
//   avatarCircle: {
//     width: 68,
//     height: 68,
//     borderRadius: 34,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   avatarText: {
//     fontFamily: FontFamily.playfairBold,
//     fontSize: FontSize.xl,
//     color: Colors.white,
//   },
//   profileInfo: { flex: 1, gap: Spacing[1] },
//   profileName: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.lg,
//     color: Colors.text,
//   },
//   profileEmail: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.sm,
//     color: Colors.muted,
//   },
//   accessBadge: {
//     alignSelf: "flex-start",
//     paddingHorizontal: Spacing[3],
//     paddingVertical: Spacing[1],
//     borderRadius: Radii.full,
//     backgroundColor: Colors.accent + "25",
//     marginTop: Spacing[1],
//   },
//   accessText: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.xs,
//     color: Colors.accentDark,
//     letterSpacing: 0.3,
//   },
//   quickStats: {
//     flexDirection: "row",
//     backgroundColor: Colors.surface,
//     borderRadius: Radii.xl,
//     marginBottom: Spacing[6],
//     ...Shadows.sm,
//   },
//   quickStat: {
//     flex: 1,
//     alignItems: "center",
//     paddingVertical: Spacing[4],
//     gap: Spacing[1],
//   },
//   quickValue: {
//     fontFamily: FontFamily.playfairBold,
//     fontSize: FontSize.lg,
//     color: Colors.text,
//   },
//   quickLabel: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.xs,
//     color: Colors.muted,
//   },
//   section: { marginBottom: Spacing[5] },
//   sectionTitle: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.xs,
//     letterSpacing: 1.5,
//     color: Colors.muted,
//     marginBottom: Spacing[2],
//     paddingLeft: Spacing[1],
//   },
//   sectionCard: {
//     backgroundColor: Colors.surface,
//     borderRadius: Radii.xl,
//     ...Shadows.sm,
//     overflow: "hidden",
//   },
//   settingRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: Spacing[4],
//   },
//   settingLeft: { flexDirection: "row", alignItems: "center", gap: Spacing[3] },
//   settingEmoji: { fontSize: 20 },
//   settingLabel: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.base,
//     color: Colors.text,
//   },
//   settingArrow: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.xl,
//     color: Colors.muted,
//   },
//   separator: {
//     height: 1,
//     backgroundColor: Colors.border,
//     marginLeft: Spacing[12],
//   },
//   logoutBtn: {
//     height: Layout.buttonHeight,
//     borderRadius: Layout.buttonRadius,
//     borderWidth: 1.5,
//     borderColor: Colors.error + "40",
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: Colors.error + "08",
//     marginBottom: Spacing[5],
//   },
//   logoutText: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.base,
//     color: Colors.error,
//   },
//   versionNote: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.xs,
//     color: Colors.muted,
//     textAlign: "center",
//     marginBottom: Spacing[4],
//   },
// });
