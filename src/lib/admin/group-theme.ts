// Per-group accent palette for the admin UI.
// Each group of resources owns one hue, used semantically: sidebar dot,
// dashboard stat card, resource page chip. Not decoration.
// Tailwind classes must be string-literal so JIT can pick them up.

export type GroupTheme = {
  name: string;
  dot: string;          // small colored swatch (4-8% surface)
  tint: string;         // card background tint
  ring: string;         // hairline border
  icon: string;         // solid icon bg
  iconFg: string;       // foreground on icon bg
  text: string;         // accent text color
  badge: string;        // pill badge
};

const THEMES: Record<string, GroupTheme> = {
  Home: {
    name: "Home",
    dot: "bg-amber-500",
    tint: "bg-amber-50 dark:bg-amber-950/30",
    ring: "ring-amber-200/70 dark:ring-amber-900/40",
    icon: "bg-amber-500",
    iconFg: "text-white",
    text: "text-amber-700 dark:text-amber-300",
    badge: "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300",
  },
  About: {
    name: "About",
    dot: "bg-sky-500",
    tint: "bg-sky-50 dark:bg-sky-950/30",
    ring: "ring-sky-200/70 dark:ring-sky-900/40",
    icon: "bg-sky-500",
    iconFg: "text-white",
    text: "text-sky-700 dark:text-sky-300",
    badge: "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300",
  },
  Citizen: {
    name: "Citizen",
    dot: "bg-emerald-500",
    tint: "bg-emerald-50 dark:bg-emerald-950/30",
    ring: "ring-emerald-200/70 dark:ring-emerald-900/40",
    icon: "bg-emerald-500",
    iconFg: "text-white",
    text: "text-emerald-700 dark:text-emerald-300",
    badge: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
  },
  Police: {
    name: "Police",
    dot: "bg-indigo-500",
    tint: "bg-indigo-50 dark:bg-indigo-950/30",
    ring: "ring-indigo-200/70 dark:ring-indigo-900/40",
    icon: "bg-indigo-500",
    iconFg: "text-white",
    text: "text-indigo-700 dark:text-indigo-300",
    badge: "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300",
  },
  Training: {
    name: "Training",
    dot: "bg-violet-500",
    tint: "bg-violet-50 dark:bg-violet-950/30",
    ring: "ring-violet-200/70 dark:ring-violet-900/40",
    icon: "bg-violet-500",
    iconFg: "text-white",
    text: "text-violet-700 dark:text-violet-300",
    badge: "bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300",
  },
  Other: {
    name: "Other",
    dot: "bg-rose-500",
    tint: "bg-rose-50 dark:bg-rose-950/30",
    ring: "ring-rose-200/70 dark:ring-rose-900/40",
    icon: "bg-rose-500",
    iconFg: "text-white",
    text: "text-rose-700 dark:text-rose-300",
    badge: "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300",
  },
};

const FALLBACK: GroupTheme = {
  name: "—",
  dot: "bg-gray-400",
  tint: "bg-gray-50 dark:bg-gray-900",
  ring: "ring-gray-200 dark:ring-gray-800",
  icon: "bg-gray-500",
  iconFg: "text-white",
  text: "text-gray-700 dark:text-gray-300",
  badge: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
};

export function getGroupTheme(group: string): GroupTheme {
  return THEMES[group] ?? FALLBACK;
}
