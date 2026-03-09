import { STICKER_COLORS } from "../config/constants";

export default function BriefTab({ activity, onContinue }) {
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#ede9fe", border: "1px solid #c4b5fd", borderRadius: 100, padding: "4px 14px", color: "#7c3aed", fontSize: 12, fontWeight: 700, letterSpacing: "0.5px", marginBottom: 28, textTransform: "uppercase" }}>
        📋 Scenario Brief
      </div>

      <h1 style={{ fontSize: 34, fontWeight: 800, color: "#111", letterSpacing: "-0.8px", marginBottom: 6  }}>
        {activity.scenarioTitle}
      </h1>
      <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 40, fontWeight: 500 }}>
        {activity.className}
      </p>

      {/* Mission card */}
      <div style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 16, padding: 32, marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 14 }}>
          Your Mission
        </h3>
        {activity.scenarioBrief.split("\n\n").map((para, i) => (
          <p key={i} style={{ color: "#374151", fontSize: 15, textAlign: "justify", lineHeight: 1.75, marginBottom: i < activity.scenarioBrief.split("\n\n").length - 1 ? 16 : 0 }}>
            {para}
          </p>
        ))}
      </div>

      {/* Stickers card */}
      <div style={{ background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 16, padding: 28, marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
        <h3 style={{ fontSize: 13, fontWeight: 700, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 18 }}>
          Your Stickers ({activity.masterStickers.length})
        </h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {activity.masterStickers.map(s => (
            <div key={s.id} style={{ background: STICKER_COLORS[s.color].bg, border: `1.5px solid ${STICKER_COLORS[s.color].border}`, borderRadius: 8, padding: "7px 12px", fontSize: 12.5, color: STICKER_COLORS[s.color].text, fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: STICKER_COLORS[s.color].dot, flexShrink: 0 }} />
              {s.text}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "#ede9fe", border: "1.5px solid #c4b5fd", borderRadius: 16, padding: 28, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
        <div>
          <p style={{ color: "#3730a3", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Ready to build your story?</p>
          <p style={{ color: "#6d28d9", fontSize: 13 }}>Head to the Storyboard to start organising insights.</p>
        </div>
        <button
          onClick={onContinue}
          style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", borderRadius: 10, padding: "12px 22px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          Start Storyboard →
        </button>
      </div>
    </div>
  );
}
