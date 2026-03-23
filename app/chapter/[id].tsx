// // // app/chapter/[id].tsx

import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
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
import { useAuthStore, useProgressStore } from "../../lib/store";
import { Chapter, getChapters, getLessons, Lesson } from "../../lib/supabase";
import { formatDuration } from "../../lib/utils";

type ChapterWithLessons = Chapter & { lessons?: Lesson[] };

type LessonStatus = "free" | "progress" | "locked" | "completed";

function getLessonStatus(
  lesson: Lesson,
  isPaid: boolean,
  progressMap: Record<string, any>,
): LessonStatus {
  const prog = progressMap[lesson.id];
  if (prog?.is_completed) return "completed";
  if (prog?.watched_seconds > 0) return "progress";
  if (!lesson.is_free && !isPaid) return "locked";
  return "free";
}

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
  const { profile } = useAuthStore();
  const { progressMap } = useProgressStore();

  const [chapters, setChapters] = useState<ChapterWithLessons[]>([]);
  const [subjectTitle, setSubjectTitle] = useState("Subject");
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);
  const [loadingChapters, setLoadingChapters] = useState(true);
  const [loadingLessons, setLoadingLessons] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    if (!id) return;
    getChapters(id).then((data) => {
      setChapters(data);
      if (data.length > 0) {
        setExpandedChapter(data[0].id);
        fetchLessons(data[0].id);
      }
      setLoadingChapters(false);
    });
  }, [id]);

  const fetchLessons = async (chapterId: string) => {
    setLoadingLessons((prev) => ({ ...prev, [chapterId]: true }));
    const lessons = await getLessons(chapterId);
    setChapters((prev) =>
      prev.map((ch) => (ch.id === chapterId ? { ...ch, lessons } : ch)),
    );
    setLoadingLessons((prev) => ({ ...prev, [chapterId]: false }));
  };

  const toggleChapter = (chapterId: string) => {
    if (expandedChapter === chapterId) {
      setExpandedChapter(null);
    } else {
      setExpandedChapter(chapterId);
      const ch = chapters.find((c) => c.id === chapterId);
      if (!ch?.lessons) fetchLessons(chapterId);
    }
  };

  const handleLessonPress = (lesson: Lesson) => {
    const status = getLessonStatus(
      lesson,
      profile?.is_paid ?? false,
      progressMap,
    );
    if (status === "locked") {
      router.push("/course-info");
      return;
    }
    router.push(`/lesson/${lesson.id}`);
  };

  // Compute overall chapter completion
  const completedCount = chapters.reduce((acc, ch) => {
    const total = ch.lessons?.length ?? 0;
    const done =
      ch.lessons?.filter((l) => progressMap[l.id]?.is_completed).length ?? 0;
    return acc + done;
  }, 0);
  const totalLessons = chapters.reduce(
    (acc, ch) => acc + (ch.lesson_count ?? 0),
    0,
  );
  const completionPct =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {subjectTitle}
          </Text>
          <Text style={styles.headerSub}>
            {chapters.length} chapters · {totalLessons} lessons
          </Text>
        </View>
        <View style={styles.backBtn} />
      </View>

      {loadingChapters ? (
        <View style={styles.loadingCenter}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingBottom: insets.bottom + 100 },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Progress */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Your progress</Text>
              <Text style={styles.progressPct}>{completionPct}%</Text>
            </View>
            <View style={styles.progressBarBg}>
              <View
                style={[styles.progressBarFill, { width: `${completionPct}%` }]}
              />
            </View>
          </View>

          {/* Chapters */}
          {chapters.map((chapter) => {
            const isExpanded = expandedChapter === chapter.id;
            const isLoadingLessons = loadingLessons[chapter.id];

            return (
              <View key={chapter.id} style={styles.chapterBlock}>
                <TouchableOpacity
                  style={styles.chapterHeader}
                  onPress={() => toggleChapter(chapter.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.chapterHeaderLeft}>
                    <Text style={styles.chapterEmoji}>
                      {isExpanded ? "📖" : "📕"}
                    </Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.chapterTitle}>{chapter.title}</Text>
                      <Text style={styles.chapterMeta}>
                        {chapter.lesson_count} lessons
                      </Text>
                    </View>
                  </View>
                  <Text
                    style={[styles.chevron, isExpanded && styles.chevronOpen]}
                  >
                    ›
                  </Text>
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.lessonsList}>
                    {isLoadingLessons ? (
                      <View style={styles.lessonsLoader}>
                        <ActivityIndicator color={Colors.primary} />
                      </View>
                    ) : (
                      (chapter.lessons ?? []).map((lesson) => {
                        const status = getLessonStatus(
                          lesson,
                          profile?.is_paid ?? false,
                          progressMap,
                        );
                        const cfg = STATUS_CONFIG[status];
                        const progress = progressMap[lesson.id];
                        const progressPct =
                          lesson.duration_seconds > 0
                            ? (progress?.watched_seconds ?? 0) /
                              lesson.duration_seconds
                            : 0;

                        return (
                          <TouchableOpacity
                            key={lesson.id}
                            style={[
                              styles.lessonRow,
                              status === "locked" && styles.lessonRowLocked,
                            ]}
                            activeOpacity={status === "locked" ? 0.6 : 0.8}
                            onPress={() => handleLessonPress(lesson)}
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
                                  status === "locked" &&
                                    styles.lessonTitleLocked,
                                ]}
                              >
                                {lesson.title}
                              </Text>
                              <Text style={styles.lessonDuration}>
                                {formatDuration(lesson.duration_seconds)}
                                {lesson.is_free ? "  ·  Free" : ""}
                              </Text>
                              {status === "progress" && progressPct > 0 && (
                                <View style={styles.lessonProgressBg}>
                                  <View
                                    style={[
                                      styles.lessonProgressFill,
                                      { width: `${progressPct * 100}%` },
                                    ]}
                                  />
                                </View>
                              )}
                            </View>
                            {status !== "locked" && (
                              <Text style={styles.lessonArrow}>›</Text>
                            )}
                          </TouchableOpacity>
                        );
                      })
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </ScrollView>
      )}
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
  loadingCenter: { flex: 1, alignItems: "center", justifyContent: "center" },
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
  },
  chevronOpen: { transform: [{ rotate: "90deg" }] },
  lessonsList: { borderTopWidth: 1, borderTopColor: Colors.border },
  lessonsLoader: { padding: Spacing[6], alignItems: "center" },
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

// import { useLocalSearchParams, useRouter } from "expo-router";
// import { useState } from "react";
// import {
//     ScrollView,
//     StyleSheet,
//     Text,
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

// type LessonStatus = "free" | "progress" | "locked" | "completed";

// type Lesson = {
//   id: string;
//   title: string;
//   duration: string;
//   status: LessonStatus;
//   progress?: number;
// };

// type Chapter = {
//   id: string;
//   title: string;
//   lessonCount: number;
//   lessons: Lesson[];
// };

// const SUBJECT_TITLES: Record<string, string> = {
//   "1": "Ancient History",
//   "2": "Medieval India",
//   "3": "Modern India",
// };

// const CHAPTERS: Chapter[] = [
//   {
//     id: "ch1",
//     title: "Chapter 1: Prehistoric India",
//     lessonCount: 4,
//     lessons: [
//       {
//         id: "l1",
//         title: "Stone Age Civilizations",
//         duration: "18 min",
//         status: "free",
//       },
//       {
//         id: "l2",
//         title: "Chalcolithic Period",
//         duration: "14 min",
//         status: "free",
//       },
//       {
//         id: "l3",
//         title: "Megalithic Culture",
//         duration: "22 min",
//         status: "progress",
//         progress: 0.45,
//       },
//       {
//         id: "l4",
//         title: "Vedic Period Overview",
//         duration: "25 min",
//         status: "locked",
//       },
//     ],
//   },
//   {
//     id: "ch2",
//     title: "Chapter 2: Indus Valley Civilization",
//     lessonCount: 4,
//     lessons: [
//       {
//         id: "l5",
//         title: "Discovery & Excavation",
//         duration: "16 min",
//         status: "free",
//       },
//       {
//         id: "l6",
//         title: "Urban Planning & Architecture",
//         duration: "20 min",
//         status: "free",
//       },
//       {
//         id: "l7",
//         title: "Trade & Economy",
//         duration: "18 min",
//         status: "progress",
//         progress: 0.7,
//       },
//       {
//         id: "l8",
//         title: "Decline of the Civilization",
//         duration: "15 min",
//         status: "locked",
//       },
//     ],
//   },
// ];

// const STATUS_CONFIG: Record<LessonStatus, { icon: string; color: string }> = {
//   free: { icon: "▶️", color: Colors.primary },
//   progress: { icon: "⏸️", color: Colors.accent },
//   locked: { icon: "🔒", color: Colors.muted },
//   completed: { icon: "✅", color: Colors.success },
// };

// export default function ChapterScreen() {
//   const insets = useSafeAreaInsets();
//   const router = useRouter();
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const [expandedChapter, setExpandedChapter] = useState<string>("ch1");

//   const subjectTitle = SUBJECT_TITLES[id ?? "1"] ?? "Subject";

//   const toggleChapter = (chapterId: string) => {
//     setExpandedChapter((prev) => (prev === chapterId ? "" : chapterId));
//   };

//   return (
//     <View style={[styles.root, { paddingTop: insets.top }]}>
//       {/* Header */}
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
//           <Text style={styles.backIcon}>←</Text>
//         </TouchableOpacity>
//         <View style={styles.headerCenter}>
//           <Text style={styles.headerTitle}>{subjectTitle}</Text>
//           <Text style={styles.headerSub}>
//             {CHAPTERS.length} chapters · 8 lessons
//           </Text>
//         </View>
//         <View style={styles.backBtn} />
//       </View>

//       <ScrollView
//         contentContainerStyle={[
//           styles.content,
//           { paddingBottom: insets.bottom + 100 },
//         ]}
//         showsVerticalScrollIndicator={false}
//       >
//         {/* Progress bar */}
//         <View style={styles.progressSection}>
//           <View style={styles.progressHeader}>
//             <Text style={styles.progressLabel}>Your progress</Text>
//             <Text style={styles.progressPct}>25%</Text>
//           </View>
//           <View style={styles.progressBarBg}>
//             <View style={[styles.progressBarFill, { width: "25%" }]} />
//           </View>
//         </View>

//         {/* Chapters */}
//         {CHAPTERS.map((chapter) => {
//           const isExpanded = expandedChapter === chapter.id;
//           return (
//             <View key={chapter.id} style={styles.chapterBlock}>
//               {/* Accordion header */}
//               <TouchableOpacity
//                 style={styles.chapterHeader}
//                 onPress={() => toggleChapter(chapter.id)}
//                 activeOpacity={0.8}
//               >
//                 <View style={styles.chapterHeaderLeft}>
//                   <Text style={styles.chapterEmoji}>
//                     {isExpanded ? "📖" : "📕"}
//                   </Text>
//                   <View>
//                     <Text style={styles.chapterTitle}>{chapter.title}</Text>
//                     <Text style={styles.chapterMeta}>
//                       {chapter.lessonCount} lessons
//                     </Text>
//                   </View>
//                 </View>
//                 <Text
//                   style={[styles.chevron, isExpanded && styles.chevronOpen]}
//                 >
//                   ›
//                 </Text>
//               </TouchableOpacity>

//               {/* Lessons */}
//               {isExpanded && (
//                 <View style={styles.lessonsList}>
//                   {chapter.lessons.map((lesson, idx) => {
//                     const cfg = STATUS_CONFIG[lesson.status];
//                     const isLocked = lesson.status === "locked";
//                     return (
//                       <TouchableOpacity
//                         key={lesson.id}
//                         style={[
//                           styles.lessonRow,
//                           isLocked && styles.lessonRowLocked,
//                         ]}
//                         activeOpacity={isLocked ? 1 : 0.8}
//                         onPress={() =>
//                           !isLocked && router.push(`/lesson/${lesson.id}`)
//                         }
//                       >
//                         <View
//                           style={[
//                             styles.lessonIndex,
//                             { backgroundColor: cfg.color + "20" },
//                           ]}
//                         >
//                           <Text style={styles.lessonEmoji}>{cfg.icon}</Text>
//                         </View>
//                         <View style={styles.lessonInfo}>
//                           <Text
//                             style={[
//                               styles.lessonTitle,
//                               isLocked && styles.lessonTitleLocked,
//                             ]}
//                           >
//                             {lesson.title}
//                           </Text>
//                           <Text style={styles.lessonDuration}>
//                             {lesson.duration}
//                           </Text>
//                           {lesson.status === "progress" &&
//                             lesson.progress !== undefined && (
//                               <View style={styles.lessonProgressBg}>
//                                 <View
//                                   style={[
//                                     styles.lessonProgressFill,
//                                     { width: `${lesson.progress * 100}%` },
//                                   ]}
//                                 />
//                               </View>
//                             )}
//                         </View>
//                         {!isLocked && <Text style={styles.lessonArrow}>›</Text>}
//                       </TouchableOpacity>
//                     );
//                   })}
//                 </View>
//               )}
//             </View>
//           );
//         })}
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   root: { flex: 1, backgroundColor: Colors.background },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingHorizontal: Layout.screenPaddingH,
//     paddingVertical: Spacing[4],
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.border,
//     backgroundColor: Colors.surface,
//   },
//   backBtn: { width: 40 },
//   backIcon: { fontSize: 22, color: Colors.primary },
//   headerCenter: { flex: 1, alignItems: "center" },
//   headerTitle: {
//     fontFamily: FontFamily.playfairBold,
//     fontSize: FontSize.md,
//     color: Colors.text,
//   },
//   headerSub: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.xs,
//     color: Colors.muted,
//   },
//   content: { padding: Layout.screenPaddingH },
//   progressSection: { marginBottom: Spacing[6] },
//   progressHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: Spacing[2],
//   },
//   progressLabel: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.sm,
//     color: Colors.muted,
//   },
//   progressPct: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.sm,
//     color: Colors.primary,
//   },
//   progressBarBg: {
//     height: 6,
//     backgroundColor: Colors.border,
//     borderRadius: Radii.full,
//     overflow: "hidden",
//   },
//   progressBarFill: {
//     height: 6,
//     backgroundColor: Colors.primary,
//     borderRadius: Radii.full,
//   },
//   chapterBlock: {
//     marginBottom: Spacing[4],
//     backgroundColor: Colors.surface,
//     borderRadius: Radii.xl,
//     overflow: "hidden",
//     ...Shadows.sm,
//   },
//   chapterHeader: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     padding: Spacing[4],
//   },
//   chapterHeaderLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing[3],
//     flex: 1,
//   },
//   chapterEmoji: { fontSize: 22 },
//   chapterTitle: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.base,
//     color: Colors.text,
//   },
//   chapterMeta: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.xs,
//     color: Colors.muted,
//   },
//   chevron: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.xl,
//     color: Colors.muted,
//     transform: [{ rotate: "0deg" }],
//   },
//   chevronOpen: { transform: [{ rotate: "90deg" }] },
//   lessonsList: { borderTopWidth: 1, borderTopColor: Colors.border },
//   lessonRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     gap: Spacing[3],
//     padding: Spacing[4],
//     borderBottomWidth: 1,
//     borderBottomColor: Colors.border + "80",
//   },
//   lessonRowLocked: { opacity: 0.55 },
//   lessonIndex: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   lessonEmoji: { fontSize: 18 },
//   lessonInfo: { flex: 1, gap: 2 },
//   lessonTitle: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.base,
//     color: Colors.text,
//   },
//   lessonTitleLocked: { color: Colors.muted },
//   lessonDuration: {
//     fontFamily: FontFamily.lato,
//     fontSize: FontSize.xs,
//     color: Colors.muted,
//   },
//   lessonProgressBg: {
//     height: 3,
//     backgroundColor: Colors.border,
//     borderRadius: Radii.full,
//     marginTop: Spacing[1],
//     overflow: "hidden",
//   },
//   lessonProgressFill: {
//     height: 3,
//     backgroundColor: Colors.accent,
//     borderRadius: Radii.full,
//   },
//   lessonArrow: {
//     fontFamily: FontFamily.latoBold,
//     fontSize: FontSize.lg,
//     color: Colors.muted,
//   },
// });
