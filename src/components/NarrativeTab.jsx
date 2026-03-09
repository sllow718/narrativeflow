import Sticker from "./Sticker";
import { NARRATIVE_NODES } from "../config/constants";

export default function NarrativeTab({ stickers, narrative, setNarrative, onDragStart, dragOver, setDragOver, onDrop }) {
  return (
    <div style={{ display: "flex", height: "calc(100vh - 56px)", overflow: "hidden" }}>
      {/* ── Sidebar ── */}
      <aside style={{ width: 220, background: "#fff", borderRight: "1.5px solid #e5e7eb", display: "flex", flexDirection: "column", overflowY: "auto" }}>
        <div style={{ padding: "18px 16px 12px", borderBottom: "1px solid #f3f4f6" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.7px", display: "block", marginBottom: 4 }}>All Stickers</span>
          <p style={{ fontSize: 11, color: "#d1d5db", lineHeight: 1.4 }}>Drag onto the arc nodes →</p>
        </div>
        <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
          {stickers.map(s => (
            <Sticker
              key={s.id}
              sticker={s}
              onDragStart={(e, st) => onDragStart(e, st, "tray")}
              compact
              dimmed={Object.values(narrative).flat().some(n => n.id === s.id)}
            />
          ))}
        </div>
      </aside>

      {/* ── Arc Area ── */}
      <main style={{ flex: 1, overflowY: "auto", padding: "32px 32px 48px", background: "#f8f7f5" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111", letterSpacing: "-0.5px", marginBottom: 6 }}>Story Arc</h2>
          <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 32 }}>Map your stickers onto the narrative structure below.</p>

          {/* SVG Arc */}
          <div style={{ position: "relative", marginBottom: 40 }}>
            <svg viewBox="0 0 900 100" style={{ width: "100%", overflow: "visible" }}>
              <defs>
                <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%"   stopColor="#6366f1" />
                  <stop offset="50%"  stopColor="#ec4899" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              <path d="M 50 90 Q 250 10, 450 8 Q 650 6, 850 80" fill="none" stroke="url(#arcGrad)" strokeWidth="3" strokeLinecap="round" />
              {NARRATIVE_NODES.map((node, i) => {
                const xs = [50, 220, 450, 680, 850];
                const ys = [90, 35, 8, 25, 80];
                return <circle key={node.id} cx={xs[i]} cy={ys[i]} r="8" fill={node.color} />;
              })}
            </svg>
          </div>

          {/* 5 Node Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 14 }}>
            {NARRATIVE_NODES.map(node => (
              <div
                key={node.id}
                onDragOver={e => { e.preventDefault(); setDragOver(node.id); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={e => onDrop(e, node.id, "narrative")}
                style={{ background: "#fff", border: dragOver === node.id ? `2px solid ${node.color}` : "1.5px solid #e5e7eb", borderRadius: 14, padding: 16, display: "flex", flexDirection: "column", gap: 10, minHeight: 180, transition: "border-color 0.15s, box-shadow 0.15s", boxShadow: dragOver === node.id ? `0 0 0 4px ${node.color}22` : "0 2px 6px rgba(0,0,0,0.04)" }}
              >
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: node.color, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 3 }}>{node.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#111", letterSpacing: "-0.2px", marginBottom: 2 }}>{node.label}</div>
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>{node.desc}</div>
                </div>
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                  {narrative[node.id].length === 0 && (
                    <div style={{ border: "2px dashed #e5e7eb", borderRadius: 9, padding: "20px 10px", textAlign: "center", color: "#d1d5db", fontSize: 11, fontWeight: 500, flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      Drop here
                    </div>
                  )}
                  {narrative[node.id].map(s => (
                    <div key={s.id} style={{ position: "relative" }}>
                      <Sticker sticker={s} onDragStart={(e, st) => onDragStart(e, st, node.id)} compact />
                      <button
                        onClick={() => setNarrative(prev => ({ ...prev, [node.id]: prev[node.id].filter(x => x.id !== s.id) }))}
                        style={{ position: "absolute", top: 4, right: 4, background: "rgba(0,0,0,0.12)", border: "none", borderRadius: "50%", width: 16, height: 16, fontSize: 10, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", padding: 0 }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          {Object.values(narrative).some(v => v.length > 0) && (
            <div style={{ marginTop: 40, background: "#ede9fe", border: "1.5px solid #c4b5fd", borderRadius: 16, padding: 28 }}>
              <h3 style={{ color: "#3730a3", fontSize: 16, fontWeight: 800, marginBottom: 20 }}>📖 Your Narrative Summary</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {NARRATIVE_NODES.map(node => narrative[node.id].length > 0 && (
                  <div key={node.id} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: node.color, flexShrink: 0, marginTop: 5 }} />
                    <div>
                      <span style={{ color: node.color, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px" }}>{node.label}: </span>
                      <span style={{ color: "#4c1d95", fontSize: 13 }}>{narrative[node.id].map(s => s.text).join(" · ")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
