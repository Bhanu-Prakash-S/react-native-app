// // app/(tabs)/_layout.tsx

import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors, FontFamily, FontSize } from "../../constants/theme";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = Platform.OS === "ios" ? 90 : 72;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.muted,
        tabBarLabelStyle: {
          fontFamily: FontFamily.latoBold,
          fontSize: FontSize.xs,
          letterSpacing: 0.3,
          marginTop: -2,
          marginBottom: Platform.OS === "android" ? 6 : 0,
        },
        tabBarStyle: {
          height: tabBarHeight + insets.bottom,
          paddingTop: 10,
          paddingBottom: insets.bottom || 10,
          backgroundColor: Colors.surface,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          shadowColor: Colors.text,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 8,
        },
        tabBarIconStyle: { marginBottom: 2 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ focused }) => <TabIcon emoji="🔍" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: "Progress",
          tabBarIcon: ({ focused }) => <TabIcon emoji="📊" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

function TabIcon({ emoji, focused }: { emoji: string; focused: boolean }) {
  const { Text } = require("react-native");
  return (
    <Text style={{ fontSize: focused ? 24 : 22, opacity: focused ? 1 : 0.6 }}>
      {emoji}
    </Text>
  );
}

// import { Tabs } from 'expo-router';
// import { View, Text, StyleSheet, Platform } from 'react-native';
// import { Colors, Typography } from '../../constants/theme';

// function TabIcon({
//   emoji, label, focused,
// }: {
//   emoji: string; label: string; focused: boolean;
// }) {
//   return (
//     <View style={styles.tabItem}>
//       <Text style={[styles.tabEmoji, focused && styles.tabEmojiActive]}>
//         {emoji}
//       </Text>
//       <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
//         {label}
//       </Text>
//     </View>
//   );
// }

// export default function TabLayout() {
//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarStyle: styles.tabBar,
//         tabBarShowLabel: false,
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon emoji="🏠" label="Home" focused={focused} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="search"
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon emoji="🔍" label="Search" focused={focused} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="progress"
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon emoji="📊" label="Progress" focused={focused} />
//           ),
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           tabBarIcon: ({ focused }) => (
//             <TabIcon emoji="👤" label="Profile" focused={focused} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }

// const styles = StyleSheet.create({
//   tabBar: {
//     backgroundColor: Colors.surface,
//     borderTopWidth: 1,
//     borderTopColor: Colors.border,
//     height: Platform.OS === 'ios' ? 90 : 72,
//     paddingTop: 8,
//     paddingBottom: Platform.OS === 'ios' ? 28 : 12,
//     shadowColor: '#1C1A17',
//     shadowOffset: { width: 0, height: -2 },
//     shadowOpacity: 0.06,
//     shadowRadius: 12,
//     elevation: 12,
//   },
//   tabItem: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 3,
//   },
//   tabEmoji: {
//     fontSize: 22,
//     opacity: 0.4,
//   },
//   tabEmojiActive: {
//     opacity: 1,
//   },
//   tabLabel: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.xs,
//     color: Colors.tabInactive,
//   },
//   tabLabelActive: {
//     color: Colors.tabActive,
//     fontFamily: Typography.bodyMedium,
//   },
// });
