import Sticker from "./Sticker";
import StickerTray from "./StickerTray";
import { NARRATIVE_NODES } from "../config/constants";

export default function NarrativeTab({
  isMobile = false,
  stickers,
  narrative,
  onDragStart,
  dragOver,
  setDragOver,
  onDrop,
  selectedSticker,
  onStickerTap,
  onZoneTap,
  onStickerRemove,
}) {
  const nodePositions = isMobile
    ? [
        { x: 30, y: 88 },
        { x: 140, y: 42 },
        { x: 250, y: 20 },
        { x: 360, y: 38 },
        { x: 470, y: 84 },
      ]
    : [
        { x: 50, y: 90 },
        { x: 220, y: 35 },
        { x: 450, y: 8 },
        { x: 680, y: 25 },
        { x: 850, y: 80 },
      ];

  const arcPath = isMobile
    ? "M 30 88 Q 130 10, 250 20 Q 360 24, 470 84"
    : "M 50 90 Q 250 10, 450 8 Q 650 6, 850 80";

  // ponytail: build placedStickerIds only for narrative zones
  const placedStickerIds = new Set(
    Object.values(narrative).flat().map((s) => s.id)
  );

  return (
    <div className="two-panel" style={{ flexDirection: isMobile ? "column" : "row" }}>
      <StickerTray
        isMobile={isMobile}
        title="All Stickers"
        subtitle="Drag onto the arc nodes"
        stickers={stickers}
        placedStickerIds={placedStickerIds}
        selectedSticker={selectedSticker}
        onDragStart={onDragStart}
        onStickerTap={onStickerTap}
        enableDrag={!isMobile}
      />

      {/* Main content: Story Arc */}
      <main className="content-area" style={{ padding: isMobile ? "20px 14px 24px" : "32px 32px 48px", background: "var(--color-bg)" }}>
        <div className="content-wide" style={{ maxWidth: 900 }}>
          <h2 style={{ fontSize: isMobile ? 20 : 22, fontWeight: 800, color: "var(--color-heading)", letterSpacing: "-0.5px", marginBottom: 6 }}>Story Arc</h2>
          <p style={{ color: "var(--color-muted)", fontSize: 13, marginBottom: isMobile ? 18 : 32 }}>
            Map your stickers onto the narrative structure below.
          </p>

          <div style={{ position: "relative", marginBottom: isMobile ? 20 : 40 }}>
            <svg viewBox={isMobile ? "0 0 500 105" : "0 0 900 100"} className="arc-svg">
              <defs>
                <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="50%" stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              <path d={arcPath} fill="none" stroke="url(#arcGrad)" strokeWidth="3" strokeLinecap="round" />
              {NARRATIVE_NODES.map((node, i) => (
                <circle key={node.id} cx={nodePositions[i].x} cy={nodePositions[i].y} r="8" fill={node.color} />
              ))}
            </svg>
          </div>

          <div className="narrative-grid" style={{ gridTemplateColumns: isMobile ? "1fr" : "repeat(5, minmax(0, 1fr))" }}>
            {NARRATIVE_NODES.map((node) => (
              <div
                key={node.id}
                className={`drop-zone${dragOver === node.id ? " drag-over" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(node.id); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={(e) => onDrop(e, node.id, "narrative")}
                onClick={() => { if (isMobile) onZoneTap(node.id, "narrative"); }}
                style={{
                  borderColor: dragOver === node.id ? node.color : undefined,
                  boxShadow: dragOver === node.id ? `0 0 0 4px ${node.color}22` : undefined,
                  minHeight: isMobile ? 140 : 180,
                }}
              >
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: node.color, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 3 }}>
                    {node.icon}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "var(--color-heading)", letterSpacing: "-0.2px", marginBottom: 2 }}>{node.label}</div>
                  <div style={{ fontSize: 11, color: "var(--color-muted)" }}>{node.desc}</div>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  {narrative[node.id].length === 0 && (
                    <div className="drop-zone-empty" style={{ borderRadius: 9, padding: "20px 10px" }}>
                      {isMobile ? "Tap a sticker, then tap here" : "Drop here"}
                    </div>
                  )}
                  {narrative[node.id].map((s) => (
                    <div key={s.id} style={{ position: "relative" }}>
                      <Sticker
                        sticker={s}
                        onDragStart={(e, st) => onDragStart(e, st, node.id)}
                        onClick={() => { if (isMobile) onStickerTap(s); }}
                        selected={isMobile && selectedSticker?.id === s.id}
                        enableDrag={!isMobile}
                        compact
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onStickerRemove(s, node.id, "narrative");
                        }}
                        className="sticker-remove"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {Object.values(narrative).some((v) => v.length > 0) && (
            <div className="narrative-summary" style={{ padding: isMobile ? 18 : 28 }}>
              <h3 className="narrative-summary-title">Your Narrative Summary</h3>
              <div className="narrative-summary-items">
                {NARRATIVE_NODES.map(
                  (node) =>
                    narrative[node.id].length > 0 && (
                      <div key={node.id} className="narrative-summary-row">
                        <div className="narrative-summary-dot" style={{ background: node.color }} />
                        <div>
                          <span className="narrative-summary-label" style={{ color: node.color }}>
                            {node.label}:{" "}
                          </span>
                          <span className="narrative-summary-text">{narrative[node.id].map((s) => s.text).join(" | ")}</span>
                        </div>
                      </div>
                    )
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
