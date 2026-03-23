// // // import { Stack } from "expo-router";

import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_400Regular_Italic,
  PlayfairDisplay_500Medium,
  PlayfairDisplay_600SemiBold,
  PlayfairDisplay_700Bold,
  PlayfairDisplay_700Bold_Italic,
  useFonts,
} from "@expo-google-fonts/playfair-display";

import {
  Lato_300Light,
  Lato_400Regular,
  Lato_400Regular_Italic,
  Lato_700Bold,
  Lato_900Black,
} from "@expo-google-fonts/lato";

import { Colors } from "../constants/theme";
import { useAuthStore, usePlayerStore, useProgressStore } from "../lib/store";
import { getProfile, supabase, updateStreak } from "../lib/supabase";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();

  const { setUser, setProfile, setLoading, setInitialized, logout } =
    useAuthStore();
  const { setAllProgress, clearProgress } = useProgressStore();
  const { clearPlayer } = usePlayerStore();

  const [fontsLoaded, fontError] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_500Medium,
    PlayfairDisplay_600SemiBold,
    PlayfairDisplay_700Bold,
    PlayfairDisplay_400Regular_Italic,
    PlayfairDisplay_700Bold_Italic,
    Lato_300Light,
    Lato_400Regular,
    Lato_700Bold,
    Lato_900Black,
    Lato_400Regular_Italic,
  });

  // Hide splash once fonts are ready
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Auth state listener — runs once on mount
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        const profile = await getProfile(session.user.id);
        if (profile) {
          setProfile(profile);
          await updateStreak(session.user.id);
        }
      }
      setInitialized(true);
      setLoading(false);
    });

    // Listen for future changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setUser(session.user);
        setLoading(true);
        const profile = await getProfile(session.user.id);
        if (profile) {
          setProfile(profile);
          await updateStreak(session.user.id);
        }
        setLoading(false);
      }

      if (event === "SIGNED_OUT") {
        logout();
        clearProgress();
        clearPlayer();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor={Colors.background} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.background },
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="index" options={{ animation: "none" }} />
          <Stack.Screen name="onboarding" options={{ animation: "fade" }} />
          <Stack.Screen
            name="(auth)"
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
          <Stack.Screen
            name="lesson/[id]"
            options={{ animation: "slide_from_bottom", presentation: "modal" }}
          />
          <Stack.Screen
            name="course-info"
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="billing"
            options={{ animation: "slide_from_right" }}
          />
          <Stack.Screen
            name="chapter/[id]"
            options={{ animation: "slide_from_right" }}
          />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
});

// import { Stack } from "expo-router";
// import * as SplashScreen from "expo-splash-screen";
// import { StatusBar } from "expo-status-bar";
// import { useEffect } from "react";
// import { StyleSheet } from "react-native";
// import { GestureHandlerRootView } from "react-native-gesture-handler";

// import {
//   PlayfairDisplay_400Regular,
//   PlayfairDisplay_400Regular_Italic,
//   PlayfairDisplay_500Medium,
//   PlayfairDisplay_600SemiBold,
//   PlayfairDisplay_700Bold,
//   PlayfairDisplay_700Bold_Italic,
//   useFonts,
// } from "@expo-google-fonts/playfair-display";

// import {
//   Lato_300Light,
//   Lato_400Regular,
//   Lato_400Regular_Italic,
//   Lato_700Bold,
//   Lato_900Black,
// } from "@expo-google-fonts/lato";

// import { Colors } from "../constants/theme";

// // Keep splash screen visible until fonts are ready
// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {
//   const [fontsLoaded, fontError] = useFonts({
//     PlayfairDisplay_400Regular,
//     PlayfairDisplay_500Medium,
//     PlayfairDisplay_600SemiBold,
//     PlayfairDisplay_700Bold,
//     PlayfairDisplay_400Regular_Italic,
//     PlayfairDisplay_700Bold_Italic,
//     Lato_300Light,
//     Lato_400Regular,
//     Lato_700Bold,
//     Lato_900Black,
//     Lato_400Regular_Italic,
//   });

//   useEffect(() => {
//     if (fontsLoaded || fontError) {
//       SplashScreen.hideAsync();
//     }
//   }, [fontsLoaded, fontError]);

//   if (!fontsLoaded && !fontError) {
//     return null;
//   }

//   return (
//     <GestureHandlerRootView style={styles.root}>
//       <StatusBar style="dark" backgroundColor={Colors.background} />
//       <Stack
//         screenOptions={{
//           headerShown: false,
//           contentStyle: { backgroundColor: Colors.background },
//           animation: "fade",
//         }}
//       />
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   root: {
//     flex: 1,
//     backgroundColor: Colors.background,
//   },
// });
