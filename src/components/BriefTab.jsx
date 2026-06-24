import { STICKER_COLORS } from "../config/constants";

export default function BriefTab({ activity, activities, isMobile = false, selectedActivityId, onActivityChange, onContinue }) {
  return (
    <div className="content-area" style={{ padding: isMobile ? "24px 14px 36px" : "48px 24px" }}>
      <div className="content-centered">

        <div className="pill-badge pill-violet" style={{ marginBottom: 22 }}>
          Scenario Brief
        </div>

        <h1 className="brief-page-heading" style={{ fontSize: isMobile ? 28 : 34, fontWeight: 800, color: "var(--color-heading)", letterSpacing: "-0.8px" }}>
          {activity.scenarioTitle}
        </h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: 14, marginBottom: 16, fontWeight: 500 }}>{activity.className}</p>

        <div className="brief-scenario-selector">
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--color-muted)", letterSpacing: "0.5px", textTransform: "uppercase" }}>Scenario</span>
          <select
            value={selectedActivityId ?? activity.id}
            onChange={(e) => onActivityChange?.(e.target.value)}
            className="brief-select"
            style={{ width: isMobile ? "100%" : "auto" }}
          >
            {(activities ?? [activity]).map((act) => (
              <option key={act.id} value={act.id}>
                {act.scenarioTitle}
              </option>
            ))}
          </select>
        </div>

        <div className="card" style={{ padding: isMobile ? 20 : 32, marginBottom: 24 }}>
          <h3 className="section-heading">Your Mission</h3>
          {activity.scenarioBrief.split("\n\n").map((para, i, arr) => (
            <p
              key={i}
              className="brief-body-text"
              style={{ textAlign: isMobile ? "left" : "justify" }}
            >
              {para}
            </p>
          ))}
        </div>

        <div className="brief-sticker-preview" style={{ padding: isMobile ? 20 : 28 }}>
          <h3 className="section-heading" style={{ marginBottom: 18 }}>
            Your Stickers ({activity.masterStickers.length})
          </h3>
          <div className="brief-stickers-grid">
            {activity.masterStickers.map((s) => (
              <div
                key={s.id}
                className="brief-sticker-chip"
                style={{
                  background: STICKER_COLORS[s.color].bg,
                  border: `1.5px solid ${STICKER_COLORS[s.color].border}`,
                  color: STICKER_COLORS[s.color].text,
                }}
              >
                <span className="brief-sticker-chip-dot" style={{ background: STICKER_COLORS[s.color].dot }} />
                <span style={{ whiteSpace: "pre-line" }}>{s.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-violet brief-cta" style={{ padding: isMobile ? 20 : 28 }}>
          <div>
            <p style={{ color: "var(--color-violet-text)", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>Ready to build your story?</p>
            <p style={{ color: "var(--color-violet-dark)", fontSize: 13 }}>Head to the Storyboard to start organising insights.</p>
          </div>
          <button
            onClick={onContinue}
            className="btn-primary"
            style={{ width: isMobile ? "100%" : "auto" }}
          >
            Start Storyboard
          </button>
        </div>

      </div>
    </div>
  );
}
