import { useEffect, useState } from "react";
import activities from "./config/activities";
import TeamNamePage from "./components/TeamNamePage";
import BriefTab from "./components/BriefTab";
import StoryboardTab from "./components/StoryboardTab";
import NarrativeTab from "./components/NarrativeTab";

const createEmptyStoryboard = () => ({ problem: [], action: [], outcome: [] });
const createEmptyNarrative = () => ({ intro: [], rising: [], climax: [], falling: [], conclude: [] });
const shuffleStickers = (stickers) => [...stickers].sort(() => Math.random() - 0.5);

export default function App() {
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = viewportWidth < 768;
  const isCompact = viewportWidth < 1024;

  const [screen, setScreen] = useState("team");
  const [teamName, setTeamName] = useState("");

  const [activeTab, setActiveTab] = useState("brief");
  const [activeActivityId, setActiveActivityId] = useState(activities[0].id);
  const activity = activities.find((act) => act.id === activeActivityId) ?? activities[0];
  const [stickers, setStickers] = useState(() => shuffleStickers(activities[0].masterStickers));
  const [storyboard, setStoryboard] = useState(() => createEmptyStoryboard());
  const [narrative, setNarrative] = useState(() => createEmptyNarrative());
  const [dragging, setDragging] = useState(null);
  const [dragOver, setDragOver] = useState(null);
  const [selectedSticker, setSelectedSticker] = useState(null);

  const placedStickerIds = new Set([
    ...Object.values(storyboard)
      .flat()
      .map((s) => s.id),
    ...Object.values(narrative)
      .flat()
      .map((s) => s.id),
  ]);

  useEffect(() => {
    setStickers(shuffleStickers(activity.masterStickers));
    setStoryboard(createEmptyStoryboard());
    setNarrative(createEmptyNarrative());
    setSelectedSticker(null);
  }, [activity.id]);

  const handleDragStart = (e, sticker, source = "tray") => {
    setDragging({ sticker, source });
    setSelectedSticker(sticker);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e, zone, type, explicitSticker = null) => {
    e?.preventDefault?.();
    const sticker = explicitSticker ?? dragging?.sticker ?? selectedSticker;
    if (!sticker) return;

    if (type === "storyboard") {
      setStoryboard((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((k) => {
          next[k] = next[k].filter((s) => s.id !== sticker.id);
        });
        setNarrative((pn) => {
          const nn = { ...pn };
          Object.keys(nn).forEach((k) => {
            nn[k] = nn[k].filter((s) => s.id !== sticker.id);
          });
          return nn;
        });
        next[zone] = [...next[zone], sticker];
        return next;
      });
    } else if (type === "narrative") {
      setNarrative((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((k) => {
          next[k] = next[k].filter((s) => s.id !== sticker.id);
        });
        next[zone] = [...next[zone], sticker];
        return next;
      });
    }

    setDragging(null);
    setDragOver(null);
    setSelectedSticker(null);
  };

  const exportProgress = () => {
    const data = { team: teamName, class: activity.className, storyboard, narrative };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${teamName.replace(/\s/g, "_")}_narrative.json`;
    a.click();
  };

  if (screen === "team") {
    return <TeamNamePage activity={activity} onSubmit={(name) => { setTeamName(name); setScreen("app"); }} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8f7f5", fontFamily: "'DM Sans', sans-serif" }}>
      <header
        style={{
          background: "#fff",
          padding: isMobile ? "10px 14px" : "8px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          flexWrap: isMobile ? "wrap" : "nowrap",
          minHeight: 56,
          borderBottom: "1.5px solid #e5e7eb",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 10 : 16, minWidth: 0, order: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <path d="M3 14 L9 4 L15 14" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5.5 10 H12.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
            <span style={{ color: "#111", fontWeight: 700, fontSize: 15 }}>NarrativeFlow</span>
          </div>

          {!isMobile && <div style={{ width: 1, height: 20, background: "#e5e7eb" }} />}

          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {teamName[0]?.toUpperCase()}
            </div>
            {!isMobile && (
              <span
                style={{
                  color: "#6b7280",
                  fontSize: 13,
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: isCompact ? 160 : 220,
                }}
              >
                {teamName}
              </span>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flex: isMobile ? "1 1 100%" : "0 1 auto",
            width: isMobile ? "100%" : "auto",
            order: isMobile ? 3 : 2,
          }}
        >
          <nav
            style={{
              display: "flex",
              gap: 4,
              overflowX: "auto",
              width: isMobile ? "100%" : "auto",
              paddingBottom: isMobile ? 2 : 0,
            }}
          >
            {[
              { id: "brief", label: "1. Brief" },
              { id: "storyboard", label: "2. Storyboard" },
              { id: "narrative", label: "3. Narrative" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  background: activeTab === t.id ? "rgba(99,102,241,0.1)" : "transparent",
                  border: activeTab === t.id ? "1px solid rgba(99,102,241,0.3)" : "1px solid transparent",
                  borderRadius: 8,
                  padding: "6px 14px",
                  color: activeTab === t.id ? "#6366f1" : "#9ca3af",
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  fontFamily: "'DM Sans', sans-serif",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        <button
          onClick={exportProgress}
          style={{
            background: "transparent",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: "6px 14px",
            color: "#6b7280",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.15s",
            order: isMobile ? 2 : 3,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "#6366f1";
            e.currentTarget.style.color = "#6366f1";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "#e5e7eb";
            e.currentTarget.style.color = "#6b7280";
          }}
        >
          Export
        </button>
      </header>

      {activeTab === "brief" && (
        <BriefTab
          activity={activity}
          activities={activities}
          isMobile={isMobile}
          selectedActivityId={activeActivityId}
          onActivityChange={(id) => setActiveActivityId(id)}
          onContinue={() => setActiveTab("storyboard")}
        />
      )}
      {activeTab === "storyboard" && (
        <StoryboardTab
          isMobile={isMobile}
          stickers={stickers}
          setStickers={setStickers}
          storyboard={storyboard}
          setStoryboard={setStoryboard}
          onDragStart={handleDragStart}
          dragOver={dragOver}
          setDragOver={setDragOver}
          onDrop={handleDrop}
          placedStickerIds={placedStickerIds}
          selectedSticker={selectedSticker}
          onStickerTap={(sticker) => setSelectedSticker((prev) => (prev?.id === sticker.id ? null : sticker))}
          onZoneTap={(zone, type) => handleDrop(null, zone, type, selectedSticker)}
        />
      )}
      {activeTab === "narrative" && (
        <NarrativeTab
          isMobile={isMobile}
          stickers={stickers}
          narrative={narrative}
          setNarrative={setNarrative}
          onDragStart={handleDragStart}
          dragOver={dragOver}
          setDragOver={setDragOver}
          onDrop={handleDrop}
          selectedSticker={selectedSticker}
          onStickerTap={(sticker) => setSelectedSticker((prev) => (prev?.id === sticker.id ? null : sticker))}
          onZoneTap={(zone, type) => handleDrop(null, zone, type, selectedSticker)}
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
