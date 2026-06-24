import { useEffect, useState, useReducer, useMemo } from "react";
import activities from "./config/activities";
import TeamNamePage from "./components/TeamNamePage";
import BriefTab from "./components/BriefTab";
import StoryboardTab from "./components/StoryboardTab";
import NarrativeTab from "./components/NarrativeTab";
import { reducer, initialState } from "./reducer";
import useAnalytics from "./useAnalytics";

export default function App() {
  const analytics = useAnalytics();
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

  const [state, dispatch] = useReducer(reducer, initialState);
  const { screen, teamName, activeTab, activeActivityId, stickers, storyboard, narrative, dragging, dragOver, selectedSticker } = state;

  const activity = useMemo(
    () => activities.find((act) => act.id === activeActivityId) ?? activities[0],
    [activeActivityId]
  );

  const placedStickerIds = useMemo(() => {
    const ids = new Set();
    Object.values(storyboard).flat().forEach((s) => ids.add(s.id));
    Object.values(narrative).flat().forEach((s) => ids.add(s.id));
    return ids;
  }, [storyboard, narrative]);

  // Drag-and-drop handlers (thin wrappers — logic is in the reducer)
  const handleDragStart = (e, sticker, source = "tray") => {
    dispatch({ type: "START_DRAG", sticker, source });
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDrop = (e, zone, zoneType, explicitSticker = null) => {
    e?.preventDefault?.();
    const sticker = explicitSticker ?? dragging?.sticker ?? selectedSticker;
    if (!sticker) return;

    const source = dragging?.source || "tray";
    dispatch({ type: "PLACE_STICKER", sticker, zone, zoneType });
    analytics.logStickerPlaced(sticker.id, source, zone, zoneType);
  };

  const TABS = [
    { id: "brief", label: "1. Brief" },
    { id: "storyboard", label: "2. Storyboard" },
    { id: "narrative", label: "3. Narrative" },
  ];

  if (screen === "team") {
    return (
      <TeamNamePage
        activity={activity}
        onSubmit={(name) => {
          analytics.logTeamNameSubmitted(name, activity.id);
          analytics.startSessionDoc(name, activity.id, activity.scenarioTitle);
          dispatch({ type: "SET_TEAM", teamName: name });
        }}
      />
    );
  }

  return (
    <div className="app-shell">
      <header className="app-header" style={{ padding: isMobile ? "10px 14px" : "8px 24px", flexWrap: isMobile ? "wrap" : "nowrap" }}>
        <div className="header-left" style={{ gap: isMobile ? 10 : 16, order: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="brand-logo">
              <svg width="14" height="14" viewBox="0 0 18 18" fill="none">
                <path d="M3 14 L9 4 L15 14" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5.5 10 H12.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="brand-name">NarrativeFlow</span>
          </div>

          {!isMobile && <div className="header-divider" />}

          <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
            <div className="team-avatar">{teamName[0]?.toUpperCase()}</div>
            {!isMobile && (
              <span className="team-label" style={{ maxWidth: isCompact ? 160 : 220 }}>
                {teamName}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, flex: isMobile ? "1 1 100%" : "0 1 auto", width: isMobile ? "100%" : "auto", order: isMobile ? 3 : 2 }}>
          <nav className="tab-nav" style={{ width: isMobile ? "100%" : "auto" }}>
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  analytics.logTabSwitched(activeTab, t.id);
                  dispatch({ type: "SWITCH_TAB", tab: t.id });
                }}
                className={`tab-btn${activeTab === t.id ? " active" : ""}`}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {activeTab === "brief" && (
        <BriefTab
          activity={activity}
          activities={activities}
          isMobile={isMobile}
          selectedActivityId={activeActivityId}
          onActivityChange={(id) => {
            analytics.logScenarioChanged(activeActivityId, id);
            dispatch({ type: "CHANGE_SCENARIO", activityId: id });
          }}
          onContinue={() => {
            analytics.logStoryboardStarted(activity.id);
            dispatch({ type: "SWITCH_TAB", tab: "storyboard" });
          }}
        />
      )}
      {activeTab === "storyboard" && (
        <StoryboardTab
          isMobile={isMobile}
          stickers={stickers}
          storyboard={storyboard}
          onDragStart={handleDragStart}
          dragOver={dragOver}
          setDragOver={(id) => dispatch({ type: "SET_DRAG_OVER", zoneId: id })}
          onDrop={handleDrop}
          placedStickerIds={placedStickerIds}
          selectedSticker={selectedSticker}
          onStickerTap={(sticker) => {
            analytics.logMobileStickerSelected(sticker.id);
            dispatch({ type: "SELECT_STICKER", sticker });
          }}
          onStickerRemove={(sticker, zoneId, zoneType) => {
            analytics.logStickerRemoved(sticker.id, zoneId, zoneType);
            dispatch({ type: "REMOVE_STICKER", sticker, zoneId, zoneType });
          }}
          onCustomStickerCreate={(text, color) => {
            analytics.logCustomStickerCreated(text, color);
            const id = `custom-${crypto.randomUUID()}`;
            dispatch({ type: "ADD_CUSTOM_STICKER", id, text, color });
          }}
          onZoneTap={(zone, type) => handleDrop(null, zone, type, selectedSticker)}
        />
      )}
      {activeTab === "narrative" && (
        <NarrativeTab
          isMobile={isMobile}
          stickers={stickers}
          narrative={narrative}
          onDragStart={handleDragStart}
          dragOver={dragOver}
          setDragOver={(id) => dispatch({ type: "SET_DRAG_OVER", zoneId: id })}
          onDrop={handleDrop}
          selectedSticker={selectedSticker}
          onStickerRemove={(sticker, zoneId, zoneType) => {
            analytics.logStickerRemoved(sticker.id, zoneId, zoneType);
            dispatch({ type: "REMOVE_STICKER", sticker, zoneId, zoneType });
          }}
          onStickerTap={(sticker) => {
            analytics.logMobileStickerSelected(sticker.id);
            dispatch({ type: "SELECT_STICKER", sticker });
          }}
          onZoneTap={(zone, type) => handleDrop(null, zone, type, selectedSticker)}
        />
      )}
    </div>
  );
}
