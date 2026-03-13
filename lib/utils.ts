// // // lib/utils.ts

// ─── History Mastery — Utility Functions ───────────────────────────────────

/**
 * Formats a duration in seconds to "m:ss" or "h:mm:ss"
 */
export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "0:00";

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const ss = String(s).padStart(2, "0");

  if (h > 0) {
    const mm = String(m).padStart(2, "0");
    return `${h}:${mm}:${ss}`;
  }
  return `${m}:${ss}`;
}

/**
 * Returns a relative time string from a date string
 * e.g. "just now", "5 min ago", "3 hours ago", "2 days ago"
 */
export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return "just now";
  if (diffSec < 3600) {
    const min = Math.floor(diffSec / 60);
    return `${min} min ago`;
  }
  if (diffSec < 86400) {
    const hr = Math.floor(diffSec / 3600);
    return `${hr} hour${hr > 1 ? "s" : ""} ago`;
  }
  if (diffSec < 2592000) {
    const d = Math.floor(diffSec / 86400);
    return `${d} day${d > 1 ? "s" : ""} ago`;
  }
  if (diffSec < 31536000) {
    const mo = Math.floor(diffSec / 2592000);
    return `${mo} month${mo > 1 ? "s" : ""} ago`;
  }
  const yr = Math.floor(diffSec / 31536000);
  return `${yr} year${yr > 1 ? "s" : ""} ago`;
}

/**
 * Returns the first word (first name) from a full name
 */
export function getFirstName(fullName: string): string {
  if (!fullName?.trim()) return "";
  return fullName.trim().split(/\s+/)[0];
}

/**
 * Formats an amount in paise to Indian Rupee string
 * e.g. 99900 → "₹999", 100000 → "₹1,000"
 */
export function formatINR(paise: number): string {
  if (isNaN(paise) || paise < 0) return "₹0";

  const rupees = Math.floor(paise / 100);
  return `₹${rupees.toLocaleString("en-IN")}`;
}

/**
 * Clamps a number between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Truncates a string to a max length with ellipsis
 */
export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "…";
}

/**
 * Capitalizes the first letter of a string
 */
export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// // /**
// //  * Format seconds into mm:ss or hh:mm:ss string
// //  */
// // export function formatDuration(seconds: number): string {
// //   if (!seconds || seconds <= 0) return '0:00';
// //   const hrs = Math.floor(seconds / 3600);
// //   const mins = Math.floor((seconds % 3600) / 60);
// //   const secs = Math.floor(seconds % 60);

// //   if (hrs > 0) {
// //     return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
// //   }
// //   return `${mins}:${String(secs).padStart(2, '0')}`;
// // }

// // /**
// //  * Format a date string into a human-readable relative time
// //  */
// // export function timeAgo(dateStr: string): string {
// //   const date = new Date(dateStr);
// //   const now = new Date();
// //   const diffMs = now.getTime() - date.getTime();
// //   const diffMins = Math.floor(diffMs / 60000);
// //   const diffHours = Math.floor(diffMins / 60);
// //   const diffDays = Math.floor(diffHours / 24);

// //   if (diffMins < 1) return 'just now';
// //   if (diffMins < 60) return `${diffMins}m ago`;
// //   if (diffHours < 24) return `${diffHours}h ago`;
// //   if (diffDays === 1) return 'yesterday';
// //   if (diffDays < 7) return `${diffDays}d ago`;
// //   return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
// // }

// // /**
// //  * Get first name from full name
// //  */
// // export function getFirstName(fullName: string): string {
// //   return fullName?.split(' ')[0] ?? 'Student';
// // }

// // /**
// //  * Format amount in paise to INR display string
// //  */
// // export function formatINR(paise: number): string {
// //   const rupees = paise / 100;
// //   return `₹${rupees.toLocaleString('en-IN')}`;
// // }
