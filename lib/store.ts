// // lib/store.ts
// import { create } from 'zustand';
// import { Profile, Progress } from './supabase';

// type AuthState = {
//   user: { id: string; email: string } | null;
//   profile: Profile | null;
//   isLoading: boolean;
//   setUser: (user: { id: string; email: string } | null) => void;
//   setProfile: (profile: Profile | null) => void;
//   setLoading: (loading: boolean) => void;
//   logout: () => void;
// };

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   profile: null,
//   isLoading: true,
//   setUser: (user) => set({ user }),
//   setProfile: (profile) => set({ profile }),
//   setLoading: (isLoading) => set({ isLoading }),
//   logout: () => set({ user: null, profile: null }),
// }));

// type ProgressState = {
//   progressMap: Record<string, Progress>; // keyed by lessonId
//   setProgress: (lessonId: string, progress: Progress) => void;
//   setAllProgress: (progressList: Progress[]) => void;
//   getProgress: (lessonId: string) => Progress | undefined;
// };

// export const useProgressStore = create<ProgressState>((set, get) => ({
//   progressMap: {},
//   setProgress: (lessonId, progress) =>
//     set((state) => ({
//       progressMap: { ...state.progressMap, [lessonId]: progress },
//     })),
//   setAllProgress: (progressList) => {
//     const map: Record<string, Progress> = {};
//     progressList.forEach((p) => { map[p.lesson_id] = p; });
//     set({ progressMap: map });
//   },
//   getProgress: (lessonId) => get().progressMap[lessonId],
// }));

// type PlayerState = {
//   currentLesson: {
//     id: string;
//     title: string;
//     muxPlaybackId: string;
//     chapterTitle: string;
//     durationSeconds: number;
//   } | null;
//   isPlaying: boolean;
//   setCurrentLesson: (lesson: PlayerState['currentLesson']) => void;
//   setPlaying: (playing: boolean) => void;
// };

// export const usePlayerStore = create<PlayerState>((set) => ({
//   currentLesson: null,
//   isPlaying: false,
//   setCurrentLesson: (lesson) => set({ currentLesson: lesson }),
//   setPlaying: (isPlaying) => set({ isPlaying }),
// }));
