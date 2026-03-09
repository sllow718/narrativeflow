import { useState } from "react";

export default function TeamNamePage({ activity, onSubmit }) {
  const [name, setName]   = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) { setError("Please enter a team name."); return; }
    onSubmit(name.trim());
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f0f0f8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(99,102,241,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.1) 1px, transparent 1px)", backgroundSize: "48px 48px", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 460, width: "90%", padding: "0 16px", textAlign: "center" }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 36 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 14 L9 4 L15 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.5 10 H12.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ color: "#111", fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px" }}>NarrativeFlow</span>
        </div>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: 100, padding: "5px 14px", color: "#6366f1", fontSize: 12, fontWeight: 600, letterSpacing: "0.5px", marginBottom: 28, textTransform: "uppercase" }}>
          <span>⬤</span> {activity.className}
        </div>

        <h1 style={{ color: "#111", fontSize: 32, fontWeight: 800, letterSpacing: "-0.8px", marginBottom: 12 }}>
          What's your name?
        </h1>
        <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 36 }}>{activity.scenarioTitle}</p>

        <input
          value={name}
          onChange={e => { setName(e.target.value); setError(""); }}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          placeholder="e.g. Poh Ming Fu"
          autoFocus
          style={{ width: "100%", boxSizing: "border-box", background: "#fff", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "14px 18px", color: "#111", fontSize: 16, outline: "none", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, marginBottom: 12 }}
          onFocus={e => (e.target.style.borderColor = "#6366f1")}
          onBlur={e =>  (e.target.style.borderColor = "#e5e7eb")}
        />
        {error && <p style={{ color: "#f87171", fontSize: 13, marginBottom: 10, textAlign: "left" }}>{error}</p>}

        <button
          onClick={handleSubmit}
          style={{ width: "100%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", borderRadius: 12, padding: "14px", color: "#fff", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
          onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
        >
          Enter Workshop →
        </button>
      </div>
    </div>
  );
}
