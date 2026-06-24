import Sticker from "./Sticker";

// ponytail: shared sidebar — saves ~30 lines per tab.
// Custom sticker creation is opt-in via showCreate/onToggleCreate props.
export default function StickerTray({
  isMobile,
  title = "All Stickers",
  subtitle,
  showCreate,
  onToggleCreate,
  createForm,
  stickers,
  placedStickerIds,
  selectedSticker,
  onDragStart,
  onStickerTap,
  enableDrag,
}) {
  return (
    <aside
      className="sticker-tray"
      style={{
        width: isMobile ? "100%" : 220,
        maxHeight: isMobile ? "42vh" : "none",
        borderRight: isMobile ? "none" : undefined,
        borderBottom: isMobile ? "1.5px solid var(--color-border)" : "none",
      }}
    >
      <div className="tray-header">
        <div className="tray-header-row">
          <span className="tray-title">{title}</span>
          {onToggleCreate && (
            <button onClick={onToggleCreate} className="btn-small-create">
              + New
            </button>
          )}
        </div>
        {subtitle && <p className="tray-subtitle">{subtitle}</p>}
      </div>

      {showCreate && createForm}

      <div className="tray-stickers">
        {stickers.map((s) => (
          <Sticker
            key={s.id}
            sticker={s}
            onDragStart={(e, st) => onDragStart(e, st, "tray")}
            onClick={() => { if (isMobile) onStickerTap(s); }}
            selected={isMobile && selectedSticker?.id === s.id}
            enableDrag={enableDrag}
            compact
            dimmed={placedStickerIds.has(s.id)}
          />
        ))}
      </div>
    </aside>
  );
}
