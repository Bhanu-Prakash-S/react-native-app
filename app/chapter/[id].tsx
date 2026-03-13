// // app/chapter/[id].tsx

import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
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

type LessonStatus = "free" | "progress" | "locked" | "completed";

type Lesson = {
  id: string;
  title: string;
  duration: string;
  status: LessonStatus;
  progress?: number;
};

type Chapter = {
  id: string;
  title: string;
  lessonCount: number;
  lessons: Lesson[];
};

const SUBJECT_TITLES: Record<string, string> = {
  "1": "Ancient History",
  "2": "Medieval India",
  "3": "Modern India",
};

const CHAPTERS: Chapter[] = [
  {
    id: "ch1",
    title: "Chapter 1: Prehistoric India",
    lessonCount: 4,
    lessons: [
      {
        id: "l1",
        title: "Stone Age Civilizations",
        duration: "18 min",
        status: "free",
      },
      {
        id: "l2",
        title: "Chalcolithic Period",
        duration: "14 min",
        status: "free",
      },
      {
        id: "l3",
        title: "Megalithic Culture",
        duration: "22 min",
        status: "progress",
        progress: 0.45,
      },
      {
        id: "l4",
        title: "Vedic Period Overview",
        duration: "25 min",
        status: "locked",
      },
    ],
  },
  {
    id: "ch2",
    title: "Chapter 2: Indus Valley Civilization",
    lessonCount: 4,
    lessons: [
      {
        id: "l5",
        title: "Discovery & Excavation",
        duration: "16 min",
        status: "free",
      },
      {
        id: "l6",
        title: "Urban Planning & Architecture",
        duration: "20 min",
        status: "free",
      },
      {
        id: "l7",
        title: "Trade & Economy",
        duration: "18 min",
        status: "progress",
        progress: 0.7,
      },
      {
        id: "l8",
        title: "Decline of the Civilization",
        duration: "15 min",
        status: "locked",
      },
    ],
  },
];

const STATUS_CONFIG: Record<LessonStatus, { icon: string; color: string }> = {
  free: { icon: "▶️", color: Colors.primary },
  progress: { icon: "⏸️", color: Colors.accent },
  locked: { icon: "🔒", color: Colors.muted },
  completed: { icon: "✅", color: Colors.success },
};

export default function ChapterScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [expandedChapter, setExpandedChapter] = useState<string>("ch1");

  const subjectTitle = SUBJECT_TITLES[id ?? "1"] ?? "Subject";

  const toggleChapter = (chapterId: string) => {
    setExpandedChapter((prev) => (prev === chapterId ? "" : chapterId));
  };

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{subjectTitle}</Text>
          <Text style={styles.headerSub}>
            {CHAPTERS.length} chapters · 8 lessons
          </Text>
        </View>
        <View style={styles.backBtn} />
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 100 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Progress bar */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Your progress</Text>
            <Text style={styles.progressPct}>25%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: "25%" }]} />
          </View>
        </View>

        {/* Chapters */}
        {CHAPTERS.map((chapter) => {
          const isExpanded = expandedChapter === chapter.id;
          return (
            <View key={chapter.id} style={styles.chapterBlock}>
              {/* Accordion header */}
              <TouchableOpacity
                style={styles.chapterHeader}
                onPress={() => toggleChapter(chapter.id)}
                activeOpacity={0.8}
              >
                <View style={styles.chapterHeaderLeft}>
                  <Text style={styles.chapterEmoji}>
                    {isExpanded ? "📖" : "📕"}
                  </Text>
                  <View>
                    <Text style={styles.chapterTitle}>{chapter.title}</Text>
                    <Text style={styles.chapterMeta}>
                      {chapter.lessonCount} lessons
                    </Text>
                  </View>
                </View>
                <Text
                  style={[styles.chevron, isExpanded && styles.chevronOpen]}
                >
                  ›
                </Text>
              </TouchableOpacity>

              {/* Lessons */}
              {isExpanded && (
                <View style={styles.lessonsList}>
                  {chapter.lessons.map((lesson, idx) => {
                    const cfg = STATUS_CONFIG[lesson.status];
                    const isLocked = lesson.status === "locked";
                    return (
                      <TouchableOpacity
                        key={lesson.id}
                        style={[
                          styles.lessonRow,
                          isLocked && styles.lessonRowLocked,
                        ]}
                        activeOpacity={isLocked ? 1 : 0.8}
                        onPress={() =>
                          !isLocked && router.push(`/lesson/${lesson.id}`)
                        }
                      >
                        <View
                          style={[
                            styles.lessonIndex,
                            { backgroundColor: cfg.color + "20" },
                          ]}
                        >
                          <Text style={styles.lessonEmoji}>{cfg.icon}</Text>
                        </View>
                        <View style={styles.lessonInfo}>
                          <Text
                            style={[
                              styles.lessonTitle,
                              isLocked && styles.lessonTitleLocked,
                            ]}
                          >
                            {lesson.title}
                          </Text>
                          <Text style={styles.lessonDuration}>
                            {lesson.duration}
                          </Text>
                          {lesson.status === "progress" &&
                            lesson.progress !== undefined && (
                              <View style={styles.lessonProgressBg}>
                                <View
                                  style={[
                                    styles.lessonProgressFill,
                                    { width: `${lesson.progress * 100}%` },
                                  ]}
                                />
                              </View>
                            )}
                        </View>
                        {!isLocked && <Text style={styles.lessonArrow}>›</Text>}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Layout.screenPaddingH,
    paddingVertical: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  backBtn: { width: 40 },
  backIcon: { fontSize: 22, color: Colors.primary },
  headerCenter: { flex: 1, alignItems: "center" },
  headerTitle: {
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize.md,
    color: Colors.text,
  },
  headerSub: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.xs,
    color: Colors.muted,
  },
  content: { padding: Layout.screenPaddingH },
  progressSection: { marginBottom: Spacing[6] },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: Spacing[2],
  },
  progressLabel: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.sm,
    color: Colors.muted,
  },
  progressPct: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.sm,
    color: Colors.primary,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: Radii.full,
    overflow: "hidden",
  },
  progressBarFill: {
    height: 6,
    backgroundColor: Colors.primary,
    borderRadius: Radii.full,
  },
  chapterBlock: {
    marginBottom: Spacing[4],
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    overflow: "hidden",
    ...Shadows.sm,
  },
  chapterHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing[4],
  },
  chapterHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    flex: 1,
  },
  chapterEmoji: { fontSize: 22 },
  chapterTitle: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.base,
    color: Colors.text,
  },
  chapterMeta: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.xs,
    color: Colors.muted,
  },
  chevron: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.xl,
    color: Colors.muted,
    transform: [{ rotate: "0deg" }],
  },
  chevronOpen: { transform: [{ rotate: "90deg" }] },
  lessonsList: { borderTopWidth: 1, borderTopColor: Colors.border },
  lessonRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing[3],
    padding: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border + "80",
  },
  lessonRowLocked: { opacity: 0.55 },
  lessonIndex: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  lessonEmoji: { fontSize: 18 },
  lessonInfo: { flex: 1, gap: 2 },
  lessonTitle: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.base,
    color: Colors.text,
  },
  lessonTitleLocked: { color: Colors.muted },
  lessonDuration: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.xs,
    color: Colors.muted,
  },
  lessonProgressBg: {
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: Radii.full,
    marginTop: Spacing[1],
    overflow: "hidden",
  },
  lessonProgressFill: {
    height: 3,
    backgroundColor: Colors.accent,
    borderRadius: Radii.full,
  },
  lessonArrow: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.lg,
    color: Colors.muted,
  },
});

// import React, { useEffect, useState } from 'react';
// import {
//   View, Text, StyleSheet, ScrollView, TouchableOpacity,
//   ActivityIndicator,
// } from 'react-native';
// import { router, useLocalSearchParams } from 'expo-router';
// import { LinearGradient } from 'expo-linear-gradient';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { getChapters, getLessons, Chapter, Lesson } from '../../lib/supabase';
// import { useAuthStore, useProgressStore } from '../../lib/store';
// import { Colors, Typography, Radii, Shadows, Layout } from '../../constants/theme';
// import { formatDuration } from '../../lib/utils';

// export default function ChapterScreen() {
//   const { id, title } = useLocalSearchParams<{ id: string; title: string }>();
//   const insets = useSafeAreaInsets();
//   const { profile } = useAuthStore();
//   const { getProgress } = useProgressStore();

//   const [chapters, setChapters] = useState<Chapter[]>([]);
//   const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
//   const [lessonsByChapter, setLessonsByChapter] = useState<Record<string, Lesson[]>>({});
//   const [loadingLessons, setLoadingLessons] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getChapters(id).then((data) => {
//       setChapters(data);
//       setLoading(false);
//       if (data.length > 0) toggleChapter(data[0].id);
//     });
//   }, [id]);

//   const toggleChapter = async (chapterId: string) => {
//     if (expandedChapter === chapterId) {
//       setExpandedChapter(null);
//       return;
//     }
//     setExpandedChapter(chapterId);
//     if (!lessonsByChapter[chapterId]) {
//       setLoadingLessons(chapterId);
//       const lessons = await getLessons(chapterId);
//       setLessonsByChapter((prev) => ({ ...prev, [chapterId]: lessons }));
//       setLoadingLessons(null);
//     }
//   };

//   const handleLessonPress = (lesson: Lesson) => {
//     if (!lesson.is_free && !profile?.is_paid) {
//       router.push('/course-info');
//       return;
//     }
//     router.push(`/lesson/${lesson.id}`);
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color={Colors.primary} />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <LinearGradient
//         colors={['#FAF7F2', '#FAF7F2']}
//         style={[styles.header, { paddingTop: insets.top + 16 }]}
//       >
//         <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
//           <Text style={styles.backIcon}>←</Text>
//         </TouchableOpacity>
//         <View style={styles.headerTitles}>
//           <Text style={styles.headerLabel}>History Course</Text>
//           <Text style={styles.headerTitle} numberOfLines={1}>{title}</Text>
//         </View>
//       </LinearGradient>

//       {/* Chapters accordion */}
//       <ScrollView
//         contentContainerStyle={styles.scrollContent}
//         showsVerticalScrollIndicator={false}
//       >
//         {chapters.map((chapter, chIdx) => {
//           const isExpanded = expandedChapter === chapter.id;
//           const lessons = lessonsByChapter[chapter.id] ?? [];
//           const isLoadingThis = loadingLessons === chapter.id;

//           // Calculate chapter progress
//           const completedCount = lessons.filter((l) => getProgress(l.id)?.is_completed).length;
//           const progressPercent = lessons.length > 0
//             ? (completedCount / lessons.length) * 100 : 0;

//           return (
//             <View key={chapter.id} style={styles.chapterBlock}>
//               {/* Chapter header */}
//               <TouchableOpacity
//                 style={[styles.chapterHeader, isExpanded && styles.chapterHeaderExpanded]}
//                 onPress={() => toggleChapter(chapter.id)}
//                 activeOpacity={0.85}
//               >
//                 <View style={styles.chapterNumberBadge}>
//                   <Text style={styles.chapterNumber}>{chIdx + 1}</Text>
//                 </View>
//                 <View style={styles.chapterInfo}>
//                   <Text style={styles.chapterTitle}>{chapter.title}</Text>
//                   <Text style={styles.chapterMeta}>
//                     {chapter.total_lessons} lesson{chapter.total_lessons !== 1 ? 's' : ''}
//                     {completedCount > 0 && ` · ${completedCount} done`}
//                   </Text>
//                   {/* Mini progress bar */}
//                   {completedCount > 0 && (
//                     <View style={styles.miniProgressBar}>
//                       <View style={[styles.miniProgressFill, { width: `${progressPercent}%` }]} />
//                     </View>
//                   )}
//                 </View>
//                 <Text style={[styles.chevron, isExpanded && styles.chevronOpen]}>›</Text>
//               </TouchableOpacity>

//               {/* Lessons list */}
//               {isExpanded && (
//                 <View style={styles.lessonsContainer}>
//                   {isLoadingThis ? (
//                     <ActivityIndicator
//                       size="small"
//                       color={Colors.primary}
//                       style={{ paddingVertical: 24 }}
//                     />
//                   ) : (
//                     lessons.map((lesson, lIdx) => {
//                       const progress = getProgress(lesson.id);
//                       const isCompleted = progress?.is_completed ?? false;
//                       const isLocked = !lesson.is_free && !profile?.is_paid;
//                       const watchedPct = progress && lesson.duration_seconds > 0
//                         ? (progress.watched_seconds / lesson.duration_seconds) * 100 : 0;

//                       return (
//                         <LessonCard
//                           key={lesson.id}
//                           lesson={lesson}
//                           index={lIdx}
//                           isCompleted={isCompleted}
//                           isLocked={isLocked}
//                           watchedPercent={watchedPct}
//                           onPress={() => handleLessonPress(lesson)}
//                         />
//                       );
//                     })
//                   )}
//                 </View>
//               )}
//             </View>
//           );
//         })}

//         <View style={{ height: 40 }} />
//       </ScrollView>
//     </View>
//   );
// }

// function LessonCard({
//   lesson, index, isCompleted, isLocked, watchedPercent, onPress,
// }: {
//   lesson: Lesson;
//   index: number;
//   isCompleted: boolean;
//   isLocked: boolean;
//   watchedPercent: number;
//   onPress: () => void;
// }) {
//   const isInProgress = watchedPercent > 0 && !isCompleted;

//   return (
//     <TouchableOpacity
//       style={[styles.lessonCard, isCompleted && styles.lessonCardCompleted]}
//       onPress={onPress}
//       activeOpacity={0.85}
//     >
//       {/* Play / Lock icon */}
//       <View style={[
//         styles.lessonPlayBtn,
//         isCompleted && styles.lessonPlayBtnCompleted,
//         isLocked && styles.lessonPlayBtnLocked,
//       ]}>
//         <Text style={styles.lessonPlayIcon}>
//           {isCompleted ? '✓' : isLocked ? '🔒' : '▶'}
//         </Text>
//       </View>

//       <View style={styles.lessonInfo}>
//         <Text style={[styles.lessonTitle, isLocked && styles.lessonTitleLocked]} numberOfLines={2}>
//           {index + 1}. {lesson.title}
//         </Text>
//         <View style={styles.lessonMetaRow}>
//           <Text style={styles.lessonDuration}>
//             🕐 {formatDuration(lesson.duration_seconds)}
//           </Text>
//           {lesson.is_free && (
//             <View style={styles.freeBadge}>
//               <Text style={styles.freeBadgeText}>FREE</Text>
//             </View>
//           )}
//           {isInProgress && (
//             <View style={styles.inProgressBadge}>
//               <Text style={styles.inProgressText}>In progress</Text>
//             </View>
//           )}
//         </View>

//         {/* Lesson progress bar */}
//         {isInProgress && (
//           <View style={styles.lessonProgressBar}>
//             <View style={[styles.lessonProgressFill, { width: `${watchedPercent}%` }]} />
//           </View>
//         )}
//       </View>

//       {isLocked && (
//         <Text style={styles.lockHint}>Unlock →</Text>
//       )}
//     </TouchableOpacity>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: Colors.background },
//   loadingContainer: {
//     flex: 1,
//     backgroundColor: Colors.background,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },

//   // Header
//   header: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: Layout.screenPadding,
//     paddingBottom: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.border,
//     gap: 14,
//   },
//   backBtn: {
//     width: 40,
//     height: 40,
//     borderRadius: Radii.full,
//     backgroundColor: Colors.surface,
//     alignItems: 'center',
//     justifyContent: 'center',
//     ...Shadows.sm,
//   },
//   backIcon: {
//     fontSize: 22,
//     color: Colors.textPrimary,
//   },
//   headerTitles: { flex: 1 },
//   headerLabel: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.xs,
//     color: Colors.primary,
//     textTransform: 'uppercase',
//     letterSpacing: 1,
//   },
//   headerTitle: {
//     fontFamily: Typography.heading,
//     fontSize: Typography.size.xl,
//     color: Colors.textPrimary,
//   },

//   scrollContent: {
//     paddingHorizontal: Layout.screenPadding,
//     paddingTop: 20,
//   },

//   // Chapter accordion
//   chapterBlock: {
//     marginBottom: 12,
//     borderRadius: Radii.lg,
//     overflow: 'hidden',
//     ...Shadows.sm,
//     borderWidth: 1,
//     borderColor: Colors.border,
//     backgroundColor: Colors.surface,
//   },
//   chapterHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 16,
//     gap: 12,
//   },
//   chapterHeaderExpanded: {
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.borderLight,
//   },
//   chapterNumberBadge: {
//     width: 36,
//     height: 36,
//     borderRadius: Radii.md,
//     backgroundColor: Colors.primaryLight + '20',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   chapterNumber: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.base,
//     color: Colors.primary,
//   },
//   chapterInfo: { flex: 1, gap: 4 },
//   chapterTitle: {
//     fontFamily: Typography.bodyMedium,
//     fontSize: Typography.size.base,
//     color: Colors.textPrimary,
//   },
//   chapterMeta: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.sm,
//     color: Colors.textMuted,
//   },
//   miniProgressBar: {
//     height: 3,
//     backgroundColor: Colors.surfaceMuted,
//     borderRadius: 2,
//     marginTop: 4,
//     width: '60%',
//   },
//   miniProgressFill: {
//     height: 3,
//     backgroundColor: Colors.success,
//     borderRadius: 2,
//   },
//   chevron: {
//     fontSize: 24,
//     color: Colors.textMuted,
//     transform: [{ rotate: '0deg' }],
//   },
//   chevronOpen: {
//     transform: [{ rotate: '90deg' }],
//   },

//   // Lessons
//   lessonsContainer: {
//     backgroundColor: Colors.background,
//   },
//   lessonCard: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 14,
//     gap: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.borderLight,
//   },
//   lessonCardCompleted: {
//     opacity: 0.75,
//   },
//   lessonPlayBtn: {
//     width: 40,
//     height: 40,
//     borderRadius: Radii.full,
//     backgroundColor: Colors.primary + '15',
//     alignItems: 'center',
//     justifyContent: 'center',
//     flexShrink: 0,
//   },
//   lessonPlayBtnCompleted: {
//     backgroundColor: Colors.success + '20',
//   },
//   lessonPlayBtnLocked: {
//     backgroundColor: Colors.surfaceMuted,
//   },
//   lessonPlayIcon: { fontSize: 14 },
//   lessonInfo: { flex: 1, gap: 4 },
//   lessonTitle: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.base,
//     color: Colors.textPrimary,
//     lineHeight: 22,
//   },
//   lessonTitleLocked: {
//     color: Colors.textMuted,
//   },
//   lessonMetaRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     flexWrap: 'wrap',
//   },
//   lessonDuration: {
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
//   inProgressBadge: {
//     backgroundColor: Colors.accent + '20',
//     paddingHorizontal: 7,
//     paddingVertical: 2,
//     borderRadius: Radii.full,
//   },
//   inProgressText: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.xs,
//     color: Colors.accentDark,
//   },
//   lessonProgressBar: {
//     height: 3,
//     backgroundColor: Colors.surfaceMuted,
//     borderRadius: 2,
//     marginTop: 4,
//   },
//   lessonProgressFill: {
//     height: 3,
//     backgroundColor: Colors.accent,
//     borderRadius: 2,
//   },
//   lockHint: {
//     fontFamily: Typography.body,
//     fontSize: Typography.size.xs,
//     color: Colors.primary,
//   },
// });
