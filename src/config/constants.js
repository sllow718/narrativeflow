// ─────────────────────────────────────────────────────────────────────────────
// constants.js
// UI constants — sticker colours, storyboard columns, narrative arc nodes.
// ─────────────────────────────────────────────────────────────────────────────

export const STICKER_COLORS = {
  red:    { bg: "#ffe4e4", border: "#f87171", text: "#7f1d1d", dot: "#ef4444" },
  blue:   { bg: "#dbeafe", border: "#60a5fa", text: "#1e3a5f", dot: "#3b82f6" },
  yellow: { bg: "#fef9c3", border: "#facc15", text: "#713f12", dot: "#eab308" },
  green:  { bg: "#dcfce7", border: "#4ade80", text: "#14532d", dot: "#22c55e" },
  purple: { bg: "#f3e8ff", border: "#c084fc", text: "#581c87", dot: "#a855f7" },
};

export const STORYBOARD_COLS = [
  { id: "problem", label: "Problem",          icon: "⚡", desc: "Pain points & issues" },
  { id: "action",  label: "Action / Analysis", icon: "🔍", desc: "How & what was done" },
  { id: "outcome", label: "Outcome",           icon: "✦",  desc: "Results & recommendations" },
];

export const NARRATIVE_NODES = [
  { id: "intro",    label: "Introduction",  icon: "01", desc: "Set the scene",          color: "#6366f1" },
  { id: "rising",   label: "Rising Action", icon: "02", desc: "Build the tension",      color: "#8b5cf6" },
  { id: "climax",   label: "Climax",        icon: "03", desc: "Central insight / peak", color: "#ec4899" },
  { id: "falling",  label: "Falling Action",icon: "04", desc: "Explore solutions",      color: "#f97316" },
  { id: "conclude", label: "Conclusion",    icon: "05", desc: "Final resolution",       color: "#10b981" },
];
