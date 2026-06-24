import { useState } from "react";

export default function TeamNamePage({ activity, onSubmit }) {
  const [name, setName]   = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) { setError("Please enter a team name."); return; }
    onSubmit(name.trim());
  };

  return (
    <div className="team-page">
      <div className="team-page-bg" />

      <div className="team-page-card">
        <div className="team-page-logo">
          <div className="brand-logo">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 14 L9 4 L15 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.5 10 H12.5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="brand-name" style={{ fontSize: 22, letterSpacing: "-0.5px" }}>NarrativeFlow</span>
        </div>

        <div className="pill-badge pill-indigo" style={{ marginBottom: 28 }}>
          <span>⬤</span> {activity.className}
        </div>

        <h1 style={{ color: "var(--color-heading)", fontSize: 32, fontWeight: 800, letterSpacing: "-0.8px", marginBottom: 12 }}>
          What's your name?
        </h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: 14, marginBottom: 36 }}>{activity.scenarioTitle}</p>

        <input
          value={name}
          onChange={e => { setName(e.target.value); setError(""); }}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          placeholder="e.g. Poh Ming Fu"
          autoFocus
          className="team-page-input"
        />
        {error && <p className="team-page-error">{error}</p>}

        <button onClick={handleSubmit} className="team-page-btn">
          Enter Workshop →
        </button>
      </div>
    </div>
  );
}
