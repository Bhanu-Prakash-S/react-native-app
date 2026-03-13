# 📚 History E-Learning App — Setup Guide

## Prerequisites
- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- EAS CLI: `npm install -g eas-cli`
- iOS Simulator (Mac) or Android Studio

## Step 1 — Create Expo Project
```bash
npx create-expo-app@latest HistoryApp --template blank-typescript
cd HistoryApp
```

## Step 2 — Install All Dependencies
```bash
npx expo install expo-router expo-splash-screen expo-status-bar expo-av expo-video
npx expo install expo-font @expo-google-fonts/playfair-display @expo-google-fonts/lato
npx expo install expo-linear-gradient expo-blur expo-haptics
npx expo install expo-secure-store expo-notifications expo-device
npx expo install react-native-safe-area-context react-native-screens
npx expo install react-native-gesture-handler react-native-reanimated
npx expo install @supabase/supabase-js react-native-url-polyfill
npx expo install zustand @react-native-async-storage/async-storage
npm install mux-react-native-player         # or follow Mux React Native SDK docs
npm install react-native-razorpay
npm install react-native-progress
npm install date-fns
```

## Step 3 — Environment Variables
Create `.env` file:
```
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_MUX_ENV_KEY=your_mux_env_key
EXPO_PUBLIC_RAZORPAY_KEY=your_razorpay_key_id
```

## Step 4 — Supabase Setup
Run these SQL commands in your Supabase SQL editor:

```sql
-- Users profile (extends Supabase auth)
create table profiles (
  id uuid references auth.users primary key,
  full_name text,
  email text,
  avatar_url text,
  is_paid boolean default false,
  exam_target text,
  streak_count integer default 0,
  last_active_date date,
  created_at timestamptz default now()
);

-- Subjects / Courses
create table subjects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  thumbnail_url text,
  exam_tags text[],
  total_chapters integer default 0,
  is_active boolean default true
);

-- Chapters
create table chapters (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references subjects(id),
  title text not null,
  description text,
  order_index integer,
  total_lessons integer default 0
);

-- Lessons
create table lessons (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid references chapters(id),
  title text not null,
  description text,
  mux_playback_id text,        -- from Mux dashboard
  mux_asset_id text,
  duration_seconds integer,
  order_index integer,
  is_free boolean default false,
  thumbnail_url text
);

-- Progress tracking
create table progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  lesson_id uuid references lessons(id),
  watched_seconds integer default 0,
  is_completed boolean default false,
  last_watched_at timestamptz default now(),
  unique(user_id, lesson_id)
);

-- Purchases
create table purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  razorpay_payment_id text,
  razorpay_order_id text,
  amount integer,              -- in paise
  status text default 'pending',
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table progress enable row level security;
alter table purchases enable row level security;

-- Policies
create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can read own progress" on progress for select using (auth.uid() = user_id);
create policy "Users can upsert own progress" on progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress" on progress for update using (auth.uid() = user_id);
```

## Step 5 — Mux Setup
1. Create account at mux.com
2. Go to Settings → API Keys → Create new key
3. Upload your history lesson videos
4. Get the `playback_id` for each video and add to Supabase lessons table

## Step 6 — Razorpay Setup
1. Create account at razorpay.com
2. Go to Settings → API Keys → Generate Key (Test mode first)
3. Add key to .env

## Step 7 — Run the App
```bash
npx expo start
# Press 'i' for iOS simulator
# Press 'a' for Android emulator
# Scan QR with Expo Go app on real device
```

## Step 8 — Build for Production
```bash
eas build --platform ios
eas build --platform android
```

## Folder Structure
```
HistoryApp/
├── app/                        # Expo Router screens
│   ├── _layout.tsx             # Root layout
│   ├── index.tsx               # Splash redirect
│   ├── onboarding.tsx
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── login.tsx
│   │   └── register.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── index.tsx           # Home
│       ├── search.tsx
│       ├── progress.tsx
│       └── profile.tsx
├── components/                 # Reusable components
├── lib/                        # Supabase, stores, utils
├── constants/                  # Theme, colors, typography
└── assets/                     # Fonts, images
```
