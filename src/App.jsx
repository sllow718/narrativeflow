import { useState } from "react";
import activity from "./config/activity";
import TeamNamePage from "./components/TeamNamePage";
import BriefTab from "./components/BriefTab";
import StoryboardTab from "./components/StoryboardTab";
import NarrativeTab from "./components/NarrativeTab";

export default function App() {
  // ── Screen state ──────────────────────────────────────────────────────────
  const [screen, setScreen]     = useState("team"); // "team" | "app"
  const [teamName, setTeamName] = useState("");

  // ── Workspace state ───────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState("brief");
  const [stickers, setStickers] = useState(
  [...activity.masterStickers].sort(() => Math.random() - 0.5)
);
  const [storyboard, setStoryboard] = useState({ problem: [], action: [], outcome: [] });
  const [narrative, setNarrative]   = useState({ intro: [], rising: [], climax: [], falling: [], conclude: [] });
  const [dragging, setDragging]   = useState(null); // { sticker, source }
  const [dragOver, setDragOver]   = useState(null);

  // ── Derived ───────────────────────────────────────────────────────────────
  const placedStickerIds = new Set([
    ...Object.values(storyboard).flat().map(s => s.id),
    ...Object.values(narrative).flat().map(s => s.id),
  ]);

  // ── Drag handlers ─────────────────────────────────────────────────────────
  const handleDragStart = (e, sticker, source = "tray") => {
    setDragging({ sticker, source });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e, zone, type) => {
    e.preventDefault();
    if (!dragging) return;
    const { sticker, source } = dragging;

    if (type === "storyboard") {
      setStoryboard(prev => {
        const next = { ...prev };
        // Remove from old storyboard col if it came from one
        Object.keys(next).forEach(k => { next[k] = next[k].filter(s => s.id !== sticker.id); });
        // Remove from narrative if cross-tab move
        setNarrative(pn => {
          const nn = { ...pn };
          Object.keys(nn).forEach(k => { nn[k] = nn[k].filter(s => s.id !== sticker.id); });
          return nn;
        });
        next[zone] = [...next[zone], sticker];
        return next;
      });
    } else if (type === "narrative") {
      setNarrative(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(k => { next[k] = next[k].filter(s => s.id !== sticker.id); });
        next[zone] = [...next[zone], sticker];
        return next;
      });
    }

    setDragging(null);
    setDragOver(null);
  };

  // ── Export ────────────────────────────────────────────────────────────────
  const exportProgress = () => {
    const data = { team: teamName, class: activity.className, storyboard, narrative };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `${teamName.replace(/\s/g, "_")}_narrative.json`;
    a.click();
  };

  // ── Team name screen ──────────────────────────────────────────────────────
  if (screen === "team") {
    return <TeamNamePage activity={activity} onSubmit={name => { setTeamName(name); setScreen("app"); }} />;
  }

  // ── Main workspace ────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f5", fontFamily: "'DM Sans', sans-serif" }}>

      {/* Top Bar */}
      <header style={{ background: "#fff", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, borderBottom: "1.5px solid #e5e7eb", position: "sticky", top: 0, zIndex: 100 }}>
        {/* Left: Logo + team */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <path d="M3 14 L9 4 L15 14" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5.5 10 H12.5" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </div>
            <span style={{ color: "#111", fontWeight: 700, fontSize: 15 }}>NarrativeFlow</span>
          </div>
          <div style={{ width: 1, height: 20, background: "#e5e7eb" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#fff" }}>
              {teamName[0]?.toUpperCase()}
            </div>
            <span style={{ color: "#6b7280", fontSize: 13, fontWeight: 500 }}>{teamName}</span>
          </div>
        </div>

        {/* Centre: Tabs */}
        <nav style={{ display: "flex", gap: 4 }}>
          {[
            { id: "brief",      label: "① Brief" },
            { id: "storyboard", label: "② Storyboard" },
            { id: "narrative",  label: "③ Narrative" },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{ background: activeTab === t.id ? "rgba(99,102,241,0.1)" : "transparent", border: activeTab === t.id ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent", borderRadius: 8, padding: "6px 14px", color: activeTab === t.id ? "#6366f1" : "#9ca3af", fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif" }}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* Right: Export */}
        <button
          onClick={exportProgress}
          style={{ background: "transparent", border: "1px solid #e5e7eb", borderRadius: 8, padding: "6px 14px", color: "#6b7280", fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.15s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.color = "#6366f1"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#6b7280"; }}
        >
          ↓ Export
        </button>
      </header>

      {/* Tab Content */}
      {activeTab === "brief" && (
        <BriefTab activity={activity} onContinue={() => setActiveTab("storyboard")} />
      )}
      {activeTab === "storyboard" && (
        <StoryboardTab
          stickers={stickers}
          setStickers={setStickers}
          storyboard={storyboard}
          setStoryboard={setStoryboard}
          onDragStart={handleDragStart}
          dragOver={dragOver}
          setDragOver={setDragOver}
          onDrop={handleDrop}
          placedStickerIds={placedStickerIds}
        />
      )}
      {activeTab === "narrative" && (
        <NarrativeTab
          stickers={stickers}
          narrative={narrative}
          setNarrative={setNarrative}
          onDragStart={handleDragStart}
          dragOver={dragOver}
          setDragOver={setDragOver}
          onDrop={handleDrop}
        />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 3px; }
      `}</style>
    </div>
  );
}
