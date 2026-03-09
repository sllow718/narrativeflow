import { useState } from "react";
import Sticker from "./Sticker";
import { STICKER_COLORS, STORYBOARD_COLS } from "../config/constants";

let nextId = 100;
const genId = () => `custom-${nextId++}`;

export default function StoryboardTab({ stickers, setStickers, storyboard, setStoryboard, onDragStart, dragOver, setDragOver, onDrop, placedStickerIds }) {
  const [showCreate, setShowCreate] = useState(false);
  const [newText, setNewText]       = useState("");
  const [newColor, setNewColor]     = useState("purple");

  const addCustomSticker = () => {
    if (!newText.trim()) return;
    setStickers(prev => [...prev, { id: genId(), text: newText.trim(), color: newColor }]);
    setNewText("");
    setShowCreate(false);
  };

  return (
    <div style={{ display: "flex", height: "calc(100vh - 56px)", overflow: "hidden" }}>
      {/* ── Sticker Tray ── */}
      <aside style={{ width: 220, background: "#fff", borderRight: "1.5px solid #e5e7eb", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ padding: "18px 16px 12px", borderBottom: "1px solid #f3f4f6" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.7px" }}>Sticker Tray</span>
            <button
              onClick={() => setShowCreate(p => !p)}
              style={{ background: "#6366f1", border: "none", borderRadius: 6, padding: "3px 8px", color: "#fff", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
            >
              + New
            </button>
          </div>
          <p style={{ fontSize: 11, color: "#d1d5db", lineHeight: 1.4 }}>Drag stickers into columns →</p>
        </div>

        {showCreate && (
          <div style={{ padding: 12, borderBottom: "1px solid #f3f4f6", background: "#fafafa" }}>
            <textarea
              value={newText}
              onChange={e => setNewText(e.target.value)}
              placeholder="Sticker text..."
              style={{ width: "100%", boxSizing: "border-box", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: 8, fontSize: 12, fontFamily: "'DM Sans', sans-serif", resize: "none", height: 70, outline: "none", marginBottom: 8 }}
            />
            <div style={{ display: "flex", gap: 5, marginBottom: 8, flexWrap: "wrap" }}>
              {Object.keys(STICKER_COLORS).map(c => (
                <button
                  key={c}
                  onClick={() => setNewColor(c)}
                  style={{ width: 20, height: 20, borderRadius: "50%", background: STICKER_COLORS[c].dot, border: newColor === c ? "2.5px solid #111" : "2px solid transparent", cursor: "pointer", outline: "none" }}
                />
              ))}
            </div>
            <button
              onClick={addCustomSticker}
              style={{ width: "100%", background: "#6366f1", border: "none", borderRadius: 7, padding: "7px", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
            >
              Add Sticker
            </button>
          </div>
        )}

        <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
          {stickers.map(s => (
            <Sticker key={s.id} sticker={s} onDragStart={(e, st) => onDragStart(e, st, "tray")} compact dimmed={placedStickerIds.has(s.id)} />
          ))}
        </div>
      </aside>

      {/* ── 3 Columns ── */}
      <main style={{ flex: 1, display: "flex", overflow: "hidden", background: "#f8f7f5" }}>
        {STORYBOARD_COLS.map((col, i) => (
          <div
            key={col.id}
            onDragOver={e => { e.preventDefault(); setDragOver(col.id); }}
            onDragLeave={() => setDragOver(null)}
            onDrop={e => onDrop(e, col.id, "storyboard")}
            style={{ flex: 1, minWidth: 240, borderRight: i < 2 ? "1.5px solid #e5e7eb" : "none", display: "flex", flexDirection: "column", background: dragOver === col.id ? "rgba(99,102,241,0.03)" : "transparent", transition: "background 0.15s" }}
          >
            <div style={{ padding: "20px 20px 16px", borderBottom: "1.5px solid #e5e7eb", background: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{col.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#111", letterSpacing: "-0.3px" }}>{col.label}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af", fontWeight: 500 }}>{col.desc}</div>
                </div>
                <div style={{ marginLeft: "auto", background: "#f3f4f6", borderRadius: 100, padding: "2px 10px", fontSize: 11, fontWeight: 700, color: "#6b7280" }}>
                  {storyboard[col.id].length}
                </div>
              </div>
            </div>

            <div style={{ flex: 1, padding: 16, display: "flex", flexDirection: "column", gap: 10, overflowY: "auto", minHeight: 200 }}>
              {storyboard[col.id].length === 0 && (
                <div style={{ border: "2px dashed #e5e7eb", borderRadius: 12, padding: "32px 16px", textAlign: "center", color: "#d1d5db", fontSize: 12, fontWeight: 500 }}>
                  Drop stickers here
                </div>
              )}
              {storyboard[col.id].map(s => (
                <div key={s.id} style={{ position: "relative" }}>
                  <Sticker sticker={s} onDragStart={(e, st) => onDragStart(e, st, col.id)} />
                  <button
                    onClick={() => setStoryboard(prev => ({ ...prev, [col.id]: prev[col.id].filter(x => x.id !== s.id) }))}
                    style={{ position: "absolute", top: 5, right: 5, background: "rgba(0,0,0,0.12)", border: "none", borderRadius: "50%", width: 18, height: 18, fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#666", padding: 0 }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
