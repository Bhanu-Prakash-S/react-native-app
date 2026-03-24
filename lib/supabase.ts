// // // // lib/supabase.ts

import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import "react-native-url-polyfill/auto";

// ─── Secure Storage Adapter for Supabase Auth Tokens ────────────────────────

const ExpoSecureStoreAdapter = {
  getItem: (key: string): Promise<string | null> => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string): Promise<void> => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string): Promise<void> => {
    return SecureStore.deleteItemAsync(key);
  },
};

// ─── Supabase Client ─────────────────────────────────────────────────────────

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// ─── TypeScript Types ─────────────────────────────────────────────────────────

export type Profile = {
  id: string;
  full_name: string;
  email: string;
  exam_target: string | null;
  is_paid: boolean;
  streak_count: number;
  last_active_date: string | null;
  avatar_url: string | null;
  created_at: string;
};

export type Subject = {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  exam_tags: string[];
  chapter_count: number;
  order_index: number;
  created_at: string;
};

export type Chapter = {
  id: string;
  subject_id: string;
  title: string;
  order_index: number;
  lesson_count: number;
  created_at: string;
};

export type Lesson = {
  id: string;
  chapter_id: string;
  title: string;
  duration_seconds: number;
  order_index: number;
  is_free: boolean;
  mux_playback_id: string;
  description: string | null;
  created_at: string;
};

export type Progress = {
  id: string;
  user_id: string;
  lesson_id: string;
  watched_seconds: number;
  is_completed: boolean;
  last_watched_at: string;
};

export type Purchase = {
  id: string;
  user_id: string;
  amount_paise: number;
  razorpay_payment_id: string | null;
  status: "pending" | "success" | "failed";
  created_at: string;
};

export type LastWatchedLesson = {
  lesson_id: string;
  lesson_title: string;
  duration_seconds: number;
  watched_seconds: number;
  chapter_title: string;
  subject_title: string;
};

// ─── Helper Functions ─────────────────────────────────────────────────────────
// All screens call these — never call supabase directly from screens.

/** Fetch a user's profile by their auth UID */
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("getProfile error:", error.message);
    return null;
  }
  return data as Profile;
}

/** Fetch all subjects ordered by order_index */
export async function getSubjects(): Promise<Subject[]> {
  const { data, error } = await supabase
    .from("subjects")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error(
      "getSubjects error:",
      error.code,
      error.message,
      error.details,
    );
    return [];
  }

  if (!data || data.length === 0) {
    console.warn("getSubjects: 0 rows returned — check RLS on subjects table.");
    return [];
  }

  // Safely normalise exam_tags — Postgres TEXT[] can arrive as "{APTET,UPSC}"
  return data.map((row: any) => ({
    ...row,
    exam_tags: parsePostgresArray(row.exam_tags),
  })) as Subject[];
}

/**
 * Normalises a Postgres array value to a plain JS string array.
 * Handles: JS array, Postgres literal "{A,B,C}", null/undefined.
 */
function parsePostgresArray(value: unknown): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .replace(/^\{|\}$/g, "")
      .split(",")
      .map((s) => s.trim().replace(/^"|"$/g, ""))
      .filter(Boolean);
  }
  return [];
}

/** Fetch chapters for a given subject, ordered */
export async function getChapters(subjectId: string): Promise<Chapter[]> {
  const { data, error } = await supabase
    .from("chapters")
    .select("*")
    .eq("subject_id", subjectId)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("getChapters error:", error.message);
    return [];
  }
  return (data as Chapter[]) ?? [];
}

/** Fetch lessons for a given chapter, ordered */
export async function getLessons(chapterId: string): Promise<Lesson[]> {
  const { data, error } = await supabase
    .from("lessons")
    .select("*")
    .eq("chapter_id", chapterId)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("getLessons error:", error.message);
    return [];
  }
  return (data as Lesson[]) ?? [];
}

/** Fetch all progress records for a user */
export async function getUserProgress(userId: string): Promise<Progress[]> {
  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("getUserProgress error:", error.message);
    return [];
  }
  return (data as Progress[]) ?? [];
}

/**
 * Upsert progress for a lesson. Uses lesson_id + user_id as the conflict key.
 * watched_seconds is only updated if the new value is greater (never go backward).
 */
export async function upsertProgress(
  userId: string,
  lessonId: string,
  watchedSecs: number,
  isCompleted: boolean,
): Promise<Progress | null> {
  const now = new Date().toISOString();
  // Postgres column is INTEGER — must be a whole number
  const watchedSecsInt = Math.floor(watchedSecs);

  const { data, error } = await supabase
    .from("progress")
    .upsert(
      {
        user_id: userId,
        lesson_id: lessonId,
        watched_seconds: watchedSecsInt,
        is_completed: isCompleted,
        last_watched_at: now,
      },
      {
        onConflict: "user_id,lesson_id",
        ignoreDuplicates: false,
      },
    )
    .select()
    .single();

  if (error) {
    console.error("upsertProgress error:", error.message);
    return null;
  }
  return data as Progress;
}

/**
 * Fetch the last watched lesson for a user, with full joins to
 * get chapter + subject context for the "Continue Watching" card.
 */
export async function getLastWatchedLesson(
  userId: string,
): Promise<LastWatchedLesson | null> {
  const { data, error } = await supabase
    .from("progress")
    .select(
      `
      lesson_id,
      watched_seconds,
      lessons (
        title,
        duration_seconds,
        chapters (
          title,
          subjects (
            title
          )
        )
      )
    `,
    )
    .eq("user_id", userId)
    .eq("is_completed", false)
    .order("last_watched_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return null;

  const lesson = data.lessons as any;
  const chapter = lesson?.chapters as any;
  const subject = chapter?.subjects as any;

  return {
    lesson_id: data.lesson_id,
    lesson_title: lesson?.title ?? "",
    duration_seconds: lesson?.duration_seconds ?? 0,
    watched_seconds: data.watched_seconds ?? 0,
    chapter_title: chapter?.title ?? "",
    subject_title: subject?.title ?? "",
  };
}

/**
 * Update the user's streak:
 * - If last_active_date is today → do nothing (already counted)
 * - If last_active_date is yesterday → increment streak
 * - Otherwise → reset streak to 1
 * Always sets last_active_date to today.
 */
export async function updateStreak(userId: string): Promise<void> {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("streak_count, last_active_date")
    .eq("id", userId)
    .single();

  if (error || !profile) return;

  const today = new Date().toISOString().split("T")[0]; // 'YYYY-MM-DD'
  const lastActive = profile.last_active_date;

  if (lastActive === today) return; // Already updated today

  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
  const newStreak =
    lastActive === yesterday ? (profile.streak_count ?? 0) + 1 : 1;

  await supabase
    .from("profiles")
    .update({ streak_count: newStreak, last_active_date: today })
    .eq("id", userId);
}

/**
 * Search lessons by title using case-insensitive ILIKE.
 * Returns lessons with their chapter and subject context.
 */
export async function searchLessons(query: string): Promise<
  Array<{
    id: string;
    title: string;
    duration_seconds: number;
    is_free: boolean;
    chapter_id: string;
    chapter_title: string;
    subject_title: string;
  }>
> {
  if (!query.trim()) return [];

  const { data, error } = await supabase
    .from("lessons")
    .select(
      `
      id,
      title,
      duration_seconds,
      is_free,
      chapter_id,
      chapters (
        title,
        subjects (
          title
        )
      )
    `,
    )
    .ilike("title", `%${query}%`)
    .limit(20);

  if (error || !data) return [];

  return data.map((row: any) => ({
    id: row.id,
    title: row.title,
    duration_seconds: row.duration_seconds,
    is_free: row.is_free,
    chapter_id: row.chapter_id,
    chapter_title: row.chapters?.title ?? "",
    subject_title: row.chapters?.subjects?.title ?? "",
  }));
}

// ─── Lesson with full context (for player screen) ─────────────────────────

export type LessonWithContext = Lesson & {
  chapter_title: string;
  chapter_id: string;
  subject_title: string;
  subject_id: string;
};

/**
 * Fetch a single lesson by id with chapter + subject joined,
 * so the player screen can show the full breadcrumb.
 */
export async function getLessonWithContext(
  lessonId: string,
): Promise<LessonWithContext | null> {
  const { data, error } = await supabase
    .from("lessons")
    .select(
      `
      *,
      chapters (
        id,
        title,
        subject_id,
        subjects (
          id,
          title
        )
      )
    `,
    )
    .eq("id", lessonId)
    .single();

  if (error || !data) {
    console.error("getLessonWithContext error:", error?.message);
    return null;
  }

  const chapter = data.chapters as any;
  const subject = chapter?.subjects as any;

  return {
    id: data.id,
    chapter_id: chapter?.id ?? "",
    title: data.title,
    duration_seconds: data.duration_seconds,
    order_index: data.order_index,
    is_free: data.is_free,
    mux_playback_id: data.mux_playback_id,
    description: data.description,
    created_at: data.created_at,
    chapter_title: chapter?.title ?? "",
    subject_title: subject?.title ?? "",
    subject_id: subject?.id ?? "",
  };
}

// ─── Payment helpers ──────────────────────────────────────────────────────────

/**
 * Insert a successful purchase record.
 * NOTE: In production, payment signature MUST be verified on your backend
 * before calling this — never trust client-side payment data alone.
 */
export async function insertPurchase(
  userId: string,
  razorpayPaymentId: string,
  amountPaise: number = 99900,
): Promise<void> {
  const { error } = await supabase.from("purchases").insert({
    user_id: userId,
    razorpay_payment_id: razorpayPaymentId,
    amount_paise: amountPaise,
    status: "success",
  });
  if (error) console.error("insertPurchase error:", error.message);
}

/**
 * Mark the user's profile as paid.
 */
export async function markUserPaid(userId: string): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({ is_paid: true })
    .eq("id", userId);
  if (error) console.error("markUserPaid error:", error.message);
}

/**
 * Fetch the most recent successful purchase for the receipt screen.
 */
export async function getPurchaseReceipt(
  userId: string,
): Promise<Purchase | null> {
  const { data, error } = await supabase
    .from("purchases")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "success")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return data as Purchase;
}
