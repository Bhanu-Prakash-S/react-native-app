// // app/(tabs)/search.tsx

import { useState } from "react";
import {
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

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");

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
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery("")}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Empty state */}
      <View style={styles.emptyState}>
        <Text style={styles.emptyEmoji}>🗺️</Text>
        <Text style={styles.emptyTitle}>
          {query.length > 0 ? "No results found" : "Explore History"}
        </Text>
        <Text style={styles.emptySubtitle}>
          {query.length > 0
            ? `We couldn't find anything for "${query}"`
            : "Search across all subjects, chapters\nand exam topics"}
        </Text>
      </View>
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
    marginBottom: Spacing[8],
  },
  searchIcon: { fontSize: 18 },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.lato,
    fontSize: FontSize.base,
    color: Colors.text,
  },
  clearIcon: { fontSize: 16, color: Colors.muted },
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

// import React, { useState, useCallback } from 'react';
// import {
//   View, Text, StyleSheet, TextInput, ScrollView,
//   TouchableOpacity, ActivityIndicator,
// } from 'react-native';
// import { router } from 'expo-router';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { supabase } from '../../lib/supabase';
// import { Colors, Typography, Radii, Shadows, Layout } from '../../constants/theme';
// import { formatDuration } from '../../lib/utils';
// import { useAuthStore } from '../../lib/store';

// export default function SearchScreen() {
//   const insets = useSafeAreaInsets();
//   const { profile } = useAuthStore();
//   const [query, setQuery] = useState('');
//   const [results, setResults] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [searched, setSearched] = useState(false);

//   const handleSearch = useCallback(async (text: string) => {
//     setQuery(text);
//     if (text.length < 2) {
//       setResults([]);
//       setSearched(false);
//       return;
//     }

//     setLoading(true);
//     setSearched(true);

//     const { data } = await supabase
//       .from('lessons')
//       .select('id, title, duration_seconds, is_free, chapters(title, subjects(title))')
//       .ilike('title', `%${text}%`)
//       .limit(20);

//     setResults(data ?? []);
//     setLoading(false);
//   }, []);

//   return (
//     <View style={[styles.container, { paddingTop: insets.top + 20 }]}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Text style={styles.pageTitle}>Search</Text>
//         <Text style={styles.pageSubtitle}>Find any lesson by topic or keyword</Text>
//       </View>

//       {/* Search input */}
//       <View style={styles.searchBar}>
//         <Text style={styles.searchIcon}>🔍</Text>
//         <TextInput
//           style={styles.searchInput}
//           placeholder="Search lessons, topics..."
//           placeholderTextColor={Colors.textMuted}
//           value={query}
//           onChangeText={handleSearch}
//           returnKeyType="search"
//           autoCorrect={false}
//         />
//         {query.length > 0 && (
//           <TouchableOpacity onPress={() => { setQuery(''); setResults([]); setSearched(false); }}>
//             <Text style={styles.clearBtn}>✕</Text>
//           </TouchableOpacity>
//         )}
//       </View>

//       {/* Results */}
//       {loading ? (
//         <ActivityIndicator style={{ marginTop: 40 }} color={Colors.primary} />
//       ) : !searched ? (
//         <View style={styles.emptyState}>
//           <Text style={styles.emptyEmoji}>📚</Text>
//           <Text style={styles.emptyTitle}>Search for history lessons</Text>
//           <Text style={styles.emptySubtitle}>
//             Try "Indus Valley", "Mughal Empire", "Indian Independence"
//           </Text>
//         </View>
//       ) : results.length === 0 ? (
//         <View style={styles.emptyState}>
//           <Text style={styles.emptyEmoji}>🤔</Text>
//           <Text style={styles.emptyTitle}>No lessons found</Text>
//           <Text style={styles.emptySubtitle}>Try a different keyword</Text>
//         </View>
//       ) : (
//         <ScrollView
//           contentContainerStyle={styles.resultsList}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}
//         >
//           <Text style={styles.resultsCount}>
//             {results.length} lesson{results.length !== 1 ? 's' : ''} found
//           </Text>
//           {results.map((lesson) => {
//             const isLocked = !lesson.is_free && !profile?.is_paid;
//             return (
//               <TouchableOpacity
//                 key={lesson.id}
//                 style={styles.resultCard}
//                 onPress={() => {
//                   if (isLocked) { router.push('/course-info'); return; }
//                   router.push(`/lesson/${lesson.id}`);
//                 }}
//               >
//                 <View style={[styles.resultIcon, isLocked && styles.resultIconLocked]}>
//                   <Text style={styles.resultIconText}>{isLocked ? '🔒' : '▶'}</Text>
//                 </View>
//                 <View style={styles.resultInfo}>
//                   <Text style={styles.resultPath} numberOfLines={1}>
//                     {lesson.chapters?.subjects?.title} › {lesson.chapters?.title}
//                   </Text>
//                   <Text style={styles.resultTitle} numberOfLines={2}>{lesson.title}</Text>
//                   <View style={styles.resultMeta}>
//                     <Text style={styles.resultDuration}>
//                       🕐 {formatDuration(lesson.duration_seconds)}
//                     </Text>
//                     {lesson.is_free && (
//                       <View style={styles.freeBadge}>
//                         <Text style={styles.freeBadgeText}>FREE</Text>
//                       </View>
//                     )}
//                   </View>
//                 </View>
//               </TouchableOpacity>
//             );
//           })}
//           <View style={{ height: 40 }} />
//         </ScrollView>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: Layout.screenPadding },
//   header: { marginBottom: 20, gap: 4 },
//   pageTitle: {
//     fontFamily: Typography.heading,
//     fontSize: Typography.size['2xl'],
//     color: Colors.textPrimary,
//   },
//   pageSubtitle: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: Colors.textMuted,
//   },
//   searchBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: Colors.surface,
//     borderRadius: Radii.full,
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     gap: 10,
//     ...Shadows.sm,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     marginBottom: 20,
//   },
//   searchIcon: { fontSize: 18 },
//   searchInput: {
//     flex: 1,
//     fontFamily: Typography.body,
//     fontSize: Typography.size.base,
//     color: Colors.textPrimary,
//   },
//   clearBtn: { fontSize: 16, color: Colors.textMuted, padding: 4 },

//   // Empty state
//   emptyState: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     gap: 12,
//     paddingBottom: 60,
//   },
//   emptyEmoji: { fontSize: 56 },
//   emptyTitle: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.lg,
//     color: Colors.textPrimary,
//   },
//   emptySubtitle: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: Colors.textMuted,
//     textAlign: 'center',
//     paddingHorizontal: 24,
//   },

//   // Results
//   resultsList: { gap: 12 },
//   resultsCount: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: Colors.textMuted,
//     marginBottom: 4,
//   },
//   resultCard: {
//     backgroundColor: Colors.surface,
//     borderRadius: Radii.lg,
//     padding: 14,
//     flexDirection: 'row',
//     gap: 12,
//     ...Shadows.sm,
//     borderWidth: 1,
//     borderColor: Colors.border,
//   },
//   resultIcon: {
//     width: 44,
//     height: 44,
//     borderRadius: Radii.full,
//     backgroundColor: Colors.primary + '15',
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexShrink: 0,
//   },
//   resultIconLocked: { backgroundColor: Colors.surfaceMuted },
//   resultIconText: { fontSize: 16 },
//   resultInfo: { flex: 1, gap: 4 },
//   resultPath: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.xs,
//     color: Colors.primary,
//   },
//   resultTitle: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.base,
//     color: Colors.textPrimary,
//     lineHeight: 22,
//   },
//   resultMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
//   resultDuration: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: Colors.textMuted,
//   },
//   freeBadge: {
//     backgroundColor: Colors.primary + '15',
//     paddingHorizontal: 7,
//     paddingVertical: 2,
//     borderRadius: Radii.full,
//   },
//   freeBadgeText: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.xs,
//     color: Colors.primary,
//     letterSpacing: 0.5,
//   },
// });
