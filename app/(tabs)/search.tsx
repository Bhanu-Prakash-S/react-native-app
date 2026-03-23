// // // app/(tabs)/search.tsx

import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
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
  Spacing,
} from "../../constants/theme";
import { searchLessons } from "../../lib/supabase";
import { formatDuration } from "../../lib/utils";

type SearchResult = {
  id: string;
  title: string;
  duration_seconds: number;
  is_free: boolean;
  chapter_id: string;
  chapter_title: string;
  subject_title: string;
};

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      const data = await searchLessons(query);
      setResults(data);
      setLoading(false);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const renderResult = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={styles.resultRow}
      onPress={() => router.push(`/lesson/${item.id}`)}
      activeOpacity={0.8}
    >
      <View style={styles.resultIconBg}>
        <Text style={styles.resultIcon}>{item.is_free ? "▶️" : "🔒"}</Text>
      </View>
      <View style={styles.resultInfo}>
        <Text style={styles.resultTitle}>{item.title}</Text>
        <Text style={styles.resultBreadcrumb}>
          {item.subject_title} › {item.chapter_title}
        </Text>
        <Text style={styles.resultMeta}>
          {formatDuration(item.duration_seconds)}
          {item.is_free ? "  ·  Free" : "  ·  Premium"}
        </Text>
      </View>
      <Text style={styles.resultArrow}>›</Text>
    </TouchableOpacity>
  );

  const showEmpty = !loading && query.length > 0 && results.length === 0;
  const showIdle = query.length === 0;

  return (
    <View style={[styles.root, { paddingTop: insets.top + Spacing[4] }]}>
      <Text style={styles.heading}>Search</Text>

      {/* Search bar */}
      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={query}
          onChangeText={setQuery}
          placeholder="Search subjects, topics, exams…"
          placeholderTextColor={Colors.muted}
          returnKeyType="search"
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Loading */}
      {loading && (
        <View style={styles.loaderRow}>
          <ActivityIndicator color={Colors.primary} />
        </View>
      )}

      {/* Results list */}
      {!loading && results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={renderResult}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.resultsList}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}

      {/* Empty state when no results */}
      {showEmpty && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🔎</Text>
          <Text style={styles.emptyTitle}>No results</Text>
          <Text style={styles.emptySubtitle}>
            Nothing matched "{query}". Try a different keyword.
          </Text>
        </View>
      )}

      {/* Idle state */}
      {showIdle && !loading && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🗺️</Text>
          <Text style={styles.emptyTitle}>Explore History</Text>
          <Text style={styles.emptySubtitle}>
            Search across all subjects, chapters{"\n"}and exam topics
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: Layout.screenPaddingH,
  },
  heading: {
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize["2xl"],
    color: Colors.text,
    marginBottom: Spacing[5],
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radii.xl,
    paddingHorizontal: Spacing[4],
    height: Layout.inputHeight,
    marginBottom: Spacing[4],
  },
  searchIcon: { fontSize: 18 },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.lato,
    fontSize: FontSize.base,
    color: Colors.text,
  },
  clearIcon: { fontSize: 16, color: Colors.muted },
  loaderRow: { paddingVertical: Spacing[6], alignItems: "center" },
  resultsList: { paddingBottom: 120 },
  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing[4],
  },
  resultIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  resultIcon: { fontSize: 20 },
  resultInfo: { flex: 1, gap: 2 },
  resultTitle: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.base,
    color: Colors.text,
  },
  resultBreadcrumb: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.xs,
    color: Colors.primary,
  },
  resultMeta: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.xs,
    color: Colors.muted,
  },
  resultArrow: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.lg,
    color: Colors.muted,
  },
  separator: { height: Spacing[2] },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 120,
  },
  emptyEmoji: { fontSize: 56, marginBottom: Spacing[5] },
  emptyTitle: {
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize.xl,
    color: Colors.text,
    marginBottom: Spacing[3],
  },
  emptySubtitle: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.base,
    color: Colors.muted,
    textAlign: "center",
    lineHeight: FontSize.base * 1.6,
  },
});

// import { useState } from "react";
// import {
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
//     Spacing,
// } from "../../constants/theme";

// export default function SearchScreen() {
//   const insets = useSafeAreaInsets();
//   const [query, setQuery] = useState("");

//   return (
//     <View style={[styles.root, { paddingTop: insets.top + Spacing[4] }]}>
//       <Text style={styles.heading}>Search</Text>

//       {/* Search bar */}
//       <View style={styles.searchBar}>
//         <Text style={styles.searchIcon}>🔍</Text>
//         <TextInput
//           style={styles.searchInput}
//           value={query}
//           onChangeText={setQuery}
//           placeholder="Search subjects, topics, exams…"
//           placeholderTextColor={Colors.muted}
//           returnKeyType="search"
//         />
//         {query.length > 0 && (
//           <TouchableOpacity onPress={() => setQuery("")}>
//             <Text style={styles.clearIcon}>✕</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Empty state */}
//       <View style={styles.emptyState}>
//         <Text style={styles.emptyEmoji}>🗺️</Text>
//         <Text style={styles.emptyTitle}>
//           {query.length > 0 ? "No results found" : "Explore History"}
//         </Text>
//         <Text style={styles.emptySubtitle}>
//           {query.length > 0
//             ? `We couldn't find anything for "${query}"`
//             : "Search across all subjects, chapters\nand exam topics"}
//         </Text>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   root: {
//     flex: 1,
//     backgroundColor: Colors.background,
//     paddingHorizontal: Layout.screenPaddingH,
//   },
//   heading: {
//     fontFamily: FontFamily.playfairBold,
//     fontSize: FontSize["2xl"],
//     color: Colors.text,
//     marginBottom: Spacing[5],
//   },
//   searchBar: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing[3],
//     backgroundColor: Colors.surface,
//     borderWidth: 1.5,
//     borderColor: Colors.border,
//     borderRadius: Radii.xl,
//     paddingHorizontal: Spacing[4],
//     height: Layout.inputHeight,
//     marginBottom: Spacing[8],
//   },
//   searchIcon: { fontSize: 18 },
//   searchInput: {
//     flex: 1,
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.base,
//     color: Colors.text,
//   },
//   clearIcon: { fontSize: 16, color: Colors.muted },
//   emptyState: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     paddingBottom: 120,
//   },
//   emptyEmoji: { fontSize: 56, marginBottom: Spacing[5] },
//   emptyTitle: {
//     fontFamily: FontFamily.playfairBold,
//     fontSize: FontSize.xl,
//     color: Colors.text,
//     marginBottom: Spacing[3],
//   },
//   emptySubtitle: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.base,
//     color: Colors.muted,
//     textAlign: "center",
//     lineHeight: FontSize.base * 1.6,
//   },
// });
