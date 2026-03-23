// import { Redirect } from "expo-router";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Colors } from "../constants/theme";
import { supabase } from "../lib/supabase";

/**
 * Smart root redirect:
 * 1. Active session → /(tabs)
 * 2. No session + has onboarded → /(auth)/login
 * 3. No session + first launch → /onboarding
 */
export default function Index() {
  const [destination, setDestination] = useState<string | null>(null);

  useEffect(() => {
    async function resolve() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setDestination("/(tabs)");
        return;
      }

      const hasOnboarded = await AsyncStorage.getItem("hasOnboarded");
      setDestination(hasOnboarded ? "/(auth)/login" : "/onboarding");
    }
    resolve();
  }, []);

  if (!destination) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator color={Colors.primary} />
      </View>
    );
  }

  return <Redirect href={destination as any} />;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
});

// // Root redirect → onboarding flow
// export default function Index() {
//   return <Redirect href="/onboarding" />;
// }
