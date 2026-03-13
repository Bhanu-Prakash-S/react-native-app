// // constants/theme.ts

// ─── History Mastery — Design System ───────────────────────────────────────

export const Colors = {
  // Core palette
  primary: "#C4622D", // burnt sienna
  background: "#FAF7F2", // warm cream
  surface: "#FFFFFF",
  accent: "#E8A855", // golden amber
  text: "#1C1A17",
  muted: "#8C7B6B",
  border: "#E5DDD0",

  // Extended palette
  primaryLight: "#E07B47",
  primaryDark: "#A34E22",
  accentLight: "#F2C478",
  accentDark: "#C98730",
  surfaceAlt: "#F5F0E8",
  error: "#D94F3D",
  success: "#4A7C59",
  warning: "#E8A855",
  info: "#4A7CA8",

  // Overlay
  overlay: "rgba(28, 26, 23, 0.5)",
  overlayLight: "rgba(28, 26, 23, 0.15)",
  white: "#FFFFFF",
  black: "#000000",
  transparent: "transparent",
} as const;

export const FontFamily = {
  // Playfair Display — headings, display text
  playfair: "PlayfairDisplay_400Regular",
  playfairMedium: "PlayfairDisplay_500Medium",
  playfairSemiBold: "PlayfairDisplay_600SemiBold",
  playfairBold: "PlayfairDisplay_700Bold",
  playfairItalic: "PlayfairDisplay_400Regular_Italic",
  playfairBoldItalic: "PlayfairDisplay_700Bold_Italic",

  // Lato — body, UI labels
  lato: "Lato_400Regular",
  latoLight: "Lato_300Light",
  latoBold: "Lato_700Bold",
  latoBlack: "Lato_900Black",
  latoItalic: "Lato_400Regular_Italic",
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  "2xl": 28,
  "3xl": 34,
  "4xl": 40,
  "5xl": 48,
} as const;

export const LineHeight = {
  tight: 1.15,
  snug: 1.3,
  normal: 1.5,
  relaxed: 1.65,
  loose: 2,
} as const;

export const LetterSpacing = {
  tighter: -0.5,
  tight: -0.25,
  normal: 0,
  wide: 0.5,
  wider: 1,
  widest: 2,
} as const;

export const Typography = {
  // Display headings — Playfair Display
  displayXl: {
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize["5xl"],
    lineHeight: FontSize["5xl"] * LineHeight.tight,
    letterSpacing: LetterSpacing.tight,
    color: Colors.text,
  },
  displayLg: {
    fontFamily: FontFamily.playfairBold,
    fontSize: FontSize["4xl"],
    lineHeight: FontSize["4xl"] * LineHeight.snug,
    letterSpacing: LetterSpacing.tight,
    color: Colors.text,
  },
  displayMd: {
    fontFamily: FontFamily.playfairSemiBold,
    fontSize: FontSize["3xl"],
    lineHeight: FontSize["3xl"] * LineHeight.snug,
    letterSpacing: LetterSpacing.tight,
    color: Colors.text,
  },
  displaySm: {
    fontFamily: FontFamily.playfairSemiBold,
    fontSize: FontSize["2xl"],
    lineHeight: FontSize["2xl"] * LineHeight.snug,
    color: Colors.text,
  },

  // Section headings — Lato Bold
  h1: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.xl,
    lineHeight: FontSize.xl * LineHeight.snug,
    letterSpacing: LetterSpacing.tight,
    color: Colors.text,
  },
  h2: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.lg,
    lineHeight: FontSize.lg * LineHeight.snug,
    color: Colors.text,
  },
  h3: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.md,
    lineHeight: FontSize.md * LineHeight.normal,
    color: Colors.text,
  },

  // Body text — Lato
  bodyLg: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.md,
    lineHeight: FontSize.md * LineHeight.relaxed,
    color: Colors.text,
  },
  body: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.base,
    lineHeight: FontSize.base * LineHeight.relaxed,
    color: Colors.text,
  },
  bodySm: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * LineHeight.normal,
    color: Colors.muted,
  },

  // UI labels
  label: {
    fontFamily: FontFamily.latoBold,
    fontSize: FontSize.sm,
    lineHeight: FontSize.sm * LineHeight.normal,
    letterSpacing: LetterSpacing.wider,
    textTransform: "uppercase" as const,
    color: Colors.muted,
  },
  caption: {
    fontFamily: FontFamily.lato,
    fontSize: FontSize.xs,
    lineHeight: FontSize.xs * LineHeight.normal,
    color: Colors.muted,
  },
} as const;

export const Spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
} as const;

export const Radii = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  "2xl": 24,
  "3xl": 32,
  full: 9999,
} as const;

export const Shadows = {
  none: {
    shadowColor: "transparent",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  lg: {
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  xl: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 32,
    elevation: 12,
  },
} as const;

export const Layout = {
  screenPaddingH: Spacing[5],
  screenPaddingV: Spacing[6],
  maxWidth: 480,
  cardRadius: Radii.lg,
  buttonHeight: 52,
  buttonRadius: Radii.md,
  inputHeight: 52,
  inputRadius: Radii.md,
  headerHeight: 56,
  tabBarHeight: 64,
  iconSizeSm: 18,
  iconSizeMd: 22,
  iconSizeLg: 28,
} as const;

// // Warm & Academic Design System

// export const Colors = {
//   // Primary palette
//   primary: '#C4622D',        // Burnt sienna — CTAs, active states
//   primaryLight: '#E8845A',   // Lighter sienna — hover/pressed
//   primaryDark: '#9E4A1E',    // Deeper sienna — shadows, borders

//   // Accent
//   accent: '#E8A855',         // Golden amber — streaks, highlights
//   accentLight: '#F5C97A',    // Soft gold — backgrounds
//   accentDark: '#C4882E',     // Deep gold

//   // Backgrounds
//   background: '#FAF7F2',     // Warm cream — main background
//   surface: '#FFFFFF',        // White — cards
//   surfaceWarm: '#F5EFE6',    // Warm off-white — subtle sections
//   surfaceMuted: '#EDE5D8',   // Muted warm — dividers, chips

//   // Text
//   textPrimary: '#1C1A17',    // Near-black warm — headings
//   textSecondary: '#5C4F3D',  // Warm brown — body text
//   textMuted: '#8C7B6B',      // Warm gray — captions, placeholders
//   textInverse: '#FAF7F2',    // Cream — text on dark backgrounds

//   // Status
//   success: '#4A7C59',        // Forest green
//   successLight: '#EAF4EE',
//   warning: '#C4622D',        // Reuse primary
//   error: '#C0392B',
//   errorLight: '#FBEAE9',

//   // Lesson states
//   locked: '#C4B5A5',         // Grayed warm — locked lesson
//   completed: '#4A7C59',      // Green — completed
//   inProgress: '#E8A855',     // Gold — in progress
//   free: '#C4622D',           // Primary — free tag

//   // Borders & dividers
//   border: '#E5DDD0',
//   borderLight: '#F0E9DE',

//   // Overlay
//   overlay: 'rgba(28, 26, 23, 0.6)',
//   overlayLight: 'rgba(28, 26, 23, 0.15)',

//   // Tab bar
//   tabActive: '#C4622D',
//   tabInactive: '#8C7B6B',
//   tabBackground: '#FFFFFF',
// };

// export const Typography = {
//   // Font families (loaded via expo-google-fonts)
//   heading: 'PlayfairDisplay_700Bold',
//   headingMedium: 'PlayfairDisplay_600SemiBold',
//   headingRegular: 'PlayfairDisplay_400Regular',
//   body: 'Lato_400Regular',
//   bodyMedium: 'Lato_700Bold',
//   bodyLight: 'Lato_300Light',

//   // Font sizes
//   size: {
//     xs: 11,
//     sm: 13,
//     base: 15,
//     md: 17,
//     lg: 20,
//     xl: 24,
//     '2xl': 28,
//     '3xl': 32,
//     '4xl': 38,
//   },

//   // Line heights
//   lineHeight: {
//     tight: 1.2,
//     normal: 1.5,
//     relaxed: 1.75,
//   },

//   // Letter spacing
//   tracking: {
//     tight: -0.5,
//     normal: 0,
//     wide: 0.5,
//     wider: 1.5,
//   },
// };

// export const Spacing = {
//   xs: 4,
//   sm: 8,
//   md: 16,
//   lg: 24,
//   xl: 32,
//   '2xl': 48,
//   '3xl': 64,
// };

// export const Radii = {
//   sm: 8,
//   md: 12,
//   lg: 16,
//   xl: 24,
//   full: 999,
// };

// export const Shadows = {
//   sm: {
//     shadowColor: '#1C1A17',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.06,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   md: {
//     shadowColor: '#1C1A17',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 12,
//     elevation: 4,
//   },
//   lg: {
//     shadowColor: '#1C1A17',
//     shadowOffset: { width: 0, height: 8 },
//     shadowOpacity: 0.14,
//     shadowRadius: 20,
//     elevation: 8,
//   },
//   card: {
//     shadowColor: '#C4622D',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.08,
//     shadowRadius: 16,
//     elevation: 5,
//   },
// };

// export const Layout = {
//   screenPadding: 20,
//   cardRadius: 16,
//   tabBarHeight: 80,
//   headerHeight: 60,
// };
