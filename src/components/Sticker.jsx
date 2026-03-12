import { STICKER_COLORS } from "../config/constants";

export default function Sticker({ sticker, onDragStart, onClick, compact = false, dimmed = false, selected = false, enableDrag = true }) {
  const c = STICKER_COLORS[sticker.color] || STICKER_COLORS.blue;
  return (
    <div
      draggable={enableDrag}
      onDragStart={enableDrag ? (e) => onDragStart(e, sticker) : undefined}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e);
      }}
      style={{
        background: c.bg,
        border: selected ? `2px solid ${c.dot}` : `1.5px solid ${c.border}`,
        borderRadius: 10,
        padding: compact ? "6px 10px" : "10px 13px",
        cursor: enableDrag ? "grab" : onClick ? "pointer" : "default",
        userSelect: "none",
        opacity: dimmed ? 0.45 : 1,
        display: "flex",
        alignItems: "flex-start",
        gap: 7,
        transition: "transform 0.12s, box-shadow 0.12s",
        boxShadow: selected ? `0 0 0 3px ${c.dot}33` : "0 1px 3px rgba(0,0,0,0.08)",
        fontSize: compact ? 11 : 12.5,
        fontFamily: "'DM Sans', sans-serif",
        touchAction: "manipulation",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "scale(1.03)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)";
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: c.dot, flexShrink: 0, marginTop: 3 }} />
      <span style={{ color: c.text, fontWeight: 500, lineHeight: 1.4, whiteSpace: "pre-line" }}>{sticker.text}</span>
    </div>
  );
}
