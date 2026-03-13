// // lib/supabase.ts
// import 'react-native-url-polyfill/auto';
// import { createClient } from '@supabase/supabase-js';
// import * as SecureStore from 'expo-secure-store';

// const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// // Custom storage using Expo SecureStore for auth tokens
// const ExpoSecureStoreAdapter = {
//   getItem: (key: string) => SecureStore.getItemAsync(key),
//   setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
//   removeItem: (key: string) => SecureStore.deleteItemAsync(key),
// };

// export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
//   auth: {
//     storage: ExpoSecureStoreAdapter,
//     autoRefreshToken: true,
//     persistSession: true,
//     detectSessionInUrl: false,
//   },
// });

// // ─── Types ──────────────────────────────────────────────────────────────────

// export type Profile = {
//   id: string;
//   full_name: string;
//   email: string;
//   avatar_url: string | null;
//   is_paid: boolean;
//   exam_target: string | null;
//   streak_count: number;
//   last_active_date: string | null;
//   created_at: string;
// };

// export type Subject = {
//   id: string;
//   title: string;
//   description: string;
//   thumbnail_url: string;
//   exam_tags: string[];
//   total_chapters: number;
//   is_active: boolean;
// };

// export type Chapter = {
//   id: string;
//   subject_id: string;
//   title: string;
//   description: string;
//   order_index: number;
//   total_lessons: number;
// };

// export type Lesson = {
//   id: string;
//   chapter_id: string;
//   title: string;
//   description: string;
//   mux_playback_id: string;
//   mux_asset_id: string;
//   duration_seconds: number;
//   order_index: number;
//   is_free: boolean;
//   thumbnail_url: string | null;
// };

// export type Progress = {
//   id: string;
//   user_id: string;
//   lesson_id: string;
//   watched_seconds: number;
//   is_completed: boolean;
//   last_watched_at: string;
// };

// // ─── Helper Functions ────────────────────────────────────────────────────────

// export async function getProfile(userId: string): Promise<Profile | null> {
//   const { data, error } = await supabase
//     .from('profiles')
//     .select('*')
//     .eq('id', userId)
//     .single();
//   if (error) return null;
//   return data;
// }

// export async function getSubjects(): Promise<Subject[]> {
//   const { data } = await supabase
//     .from('subjects')
//     .select('*')
//     .eq('is_active', true)
//     .order('title');
//   return data || [];
// }

// export async function getChapters(subjectId: string): Promise<Chapter[]> {
//   const { data } = await supabase
//     .from('chapters')
//     .select('*')
//     .eq('subject_id', subjectId)
//     .order('order_index');
//   return data || [];
// }

// export async function getLessons(chapterId: string): Promise<Lesson[]> {
//   const { data } = await supabase
//     .from('lessons')
//     .select('*')
//     .eq('chapter_id', chapterId)
//     .order('order_index');
//   return data || [];
// }

// export async function getUserProgress(userId: string): Promise<Progress[]> {
//   const { data } = await supabase
//     .from('progress')
//     .select('*')
//     .eq('user_id', userId);
//   return data || [];
// }

// export async function upsertProgress(
//   userId: string,
//   lessonId: string,
//   watchedSeconds: number,
//   isCompleted: boolean
// ): Promise<void> {
//   await supabase.from('progress').upsert({
//     user_id: userId,
//     lesson_id: lessonId,
//     watched_seconds: watchedSeconds,
//     is_completed: isCompleted,
//     last_watched_at: new Date().toISOString(),
//   }, { onConflict: 'user_id,lesson_id' });
// }

// export async function getLastWatchedLesson(userId: string) {
//   const { data } = await supabase
//     .from('progress')
//     .select(`
//       *,
//       lessons (
//         id, title, duration_seconds, mux_playback_id, thumbnail_url,
//         chapters (
//           id, title,
//           subjects (id, title)
//         )
//       )
//     `)
//     .eq('user_id', userId)
//     .eq('is_completed', false)
//     .order('last_watched_at', { ascending: false })
//     .limit(1)
//     .single();
//   return data;
// }

// export async function updateStreak(userId: string): Promise<void> {
//   const { data: profile } = await supabase
//     .from('profiles')
//     .select('streak_count, last_active_date')
//     .eq('id', userId)
//     .single();

//   if (!profile) return;

//   const today = new Date().toISOString().split('T')[0];
//   const lastActive = profile.last_active_date;

//   if (lastActive === today) return; // already updated today

//   const yesterday = new Date();
//   yesterday.setDate(yesterday.getDate() - 1);
//   const yesterdayStr = yesterday.toISOString().split('T')[0];

//   const newStreak = lastActive === yesterdayStr ? profile.streak_count + 1 : 1;

//   await supabase
//     .from('profiles')
//     .update({ streak_count: newStreak, last_active_date: today })
//     .eq('id', userId);
// }
