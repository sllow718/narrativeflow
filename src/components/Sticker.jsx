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
      className="sticker"
      style={{
        background: c.bg,
        border: selected ? `2px solid ${c.dot}` : `1.5px solid ${c.border}`,
        padding: compact ? "6px 10px" : "10px 13px",
        cursor: enableDrag ? "grab" : onClick ? "pointer" : "default",
        opacity: dimmed ? 0.45 : 1,
        boxShadow: selected ? `0 0 0 3px ${c.dot}33` : "0 1px 3px rgba(0,0,0,0.08)",
        fontSize: compact ? 11 : 12.5,
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
      <span className="sticker-dot" style={{ background: c.dot }} />
      <span className="sticker-text" style={{ color: c.text }}>{sticker.text}</span>
    </div>
  );
}
