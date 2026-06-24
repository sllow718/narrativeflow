import { useState } from "react";
import Sticker from "./Sticker";
import StickerTray from "./StickerTray";
import { STICKER_COLORS, STORYBOARD_COLS } from "../config/constants";

export default function StoryboardTab({
  isMobile = false,
  stickers,
  storyboard,
  onDragStart,
  dragOver,
  setDragOver,
  onDrop,
  placedStickerIds,
  selectedSticker,
  onStickerTap,
  onZoneTap,
  onStickerRemove,
  onCustomStickerCreate,
}) {
  const [showCreate, setShowCreate] = useState(false);
  const [newText, setNewText] = useState("");
  const [newColor, setNewColor] = useState("purple");

  const addCustomSticker = () => {
    if (!newText.trim()) return;
    onCustomStickerCreate(newText.trim(), newColor);
    setNewText("");
    setShowCreate(false);
  };

  const createForm = (
    <div className="custom-sticker-form">
      <textarea
        value={newText}
        onChange={(e) => setNewText(e.target.value)}
        placeholder="Sticker text..."
        className="custom-sticker-textarea"
      />
      <div className="color-picker">
        {Object.keys(STICKER_COLORS).map((c) => (
          <button
            key={c}
            onClick={() => setNewColor(c)}
            className={`color-swatch${newColor === c ? " selected" : ""}`}
            style={{ background: STICKER_COLORS[c].dot }}
          />
        ))}
      </div>
      <button onClick={addCustomSticker} className="btn-primary btn-primary-sm" style={{ width: "100%", borderRadius: 7, padding: "7px", fontSize: 12 }}>
        Add Sticker
      </button>
    </div>
  );

  return (
    <div className="two-panel" style={{ flexDirection: isMobile ? "column" : "row" }}>
      <StickerTray
        isMobile={isMobile}
        title="Sticker Tray"
        subtitle="Drag stickers into columns"
        showCreate={showCreate}
        onToggleCreate={() => setShowCreate((p) => !p)}
        createForm={createForm}
        stickers={stickers}
        placedStickerIds={placedStickerIds}
        selectedSticker={selectedSticker}
        onDragStart={onDragStart}
        onStickerTap={onStickerTap}
        enableDrag={!isMobile}
      />

      {/* Main content: 3-column storyboard */}
      <div className="content-area" style={{ display: "flex", overflow: "auto", background: "var(--color-bg)" }}>
        <div className="storyboard-columns" style={{ flexDirection: isMobile ? "column" : "row" }}>
          {STORYBOARD_COLS.map((col, i) => (
            <div
              key={col.id}
              className={`storyboard-col${dragOver === col.id ? " drag-over" : ""}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(col.id); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => onDrop(e, col.id, "storyboard")}
              onClick={() => { if (isMobile) onZoneTap(col.id, "storyboard"); }}
              style={{
                borderRight: !isMobile && i < STORYBOARD_COLS.length - 1 ? "1.5px solid var(--color-border)" : "none",
                borderBottom: isMobile && i < STORYBOARD_COLS.length - 1 ? "1.5px solid var(--color-border)" : "none",
              }}
            >
              <div className="zone-header" style={{ padding: isMobile ? "14px 14px 12px" : "20px 20px 16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{col.icon}</span>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: "var(--color-heading)", letterSpacing: "-0.3px" }}>{col.label}</div>
                    <div style={{ fontSize: 11, color: "var(--color-muted)", fontWeight: 500 }}>{col.desc}</div>
                  </div>
                  <div className="zone-count">{storyboard[col.id].length}</div>
                </div>
              </div>

              <div className="storyboard-col-content">
                {storyboard[col.id].length === 0 && (
                  <div className="drop-zone-empty" style={{ borderRadius: 12, padding: "32px 16px", fontSize: 12 }}>
                    {isMobile ? "Tap a sticker, then tap here" : "Drop stickers here"}
                  </div>
                )}
                {storyboard[col.id].map((s) => (
                  <div key={s.id} style={{ position: "relative" }}>
                    <Sticker
                      sticker={s}
                      onDragStart={(e, st) => onDragStart(e, st, col.id)}
                      onClick={() => { if (isMobile) onStickerTap(s); }}
                      selected={isMobile && selectedSticker?.id === s.id}
                      enableDrag={!isMobile}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStickerRemove(s, col.id, "storyboard");
                      }}
                      className="sticker-remove"
                      style={{ top: 5, right: 5, width: 18, height: 18, fontSize: 11, color: "#666" }}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
