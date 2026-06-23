// NarrativeFlow Analytics — Core Module
// Buffers events in memory, flushes to Firestore in batches.
// Free tier optimized: 1-2 writes per session, not per event.

import { EVENTS } from "./events";
import { getDb } from "./config";
import {
  collection,
  setDoc,
  doc,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";

// --- Session management via sessionStorage ---
// Survives page refresh, dies on tab close = each tab = one workshop

const STORAGE_KEY = "narrativeflow_session";

function getStoredSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSessionToStorage(session) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // sessionStorage unavailable (private browsing in some browsers)
  }
}

// --- Buffer ---
let buffer = [];
let flushTimer = null;
let session = null; // { sessionId, docId, teamName, scenarioId, scenarioTitle, tabsVisited, startedAt, totalStickersPlaced }

// --- Flush logic ---

async function flush() {
  if (!buffer.length || !session) return;

  const db = getDb();
  const events = [...buffer];
  buffer = [];

  try {
    const sessionRef = doc(db, "sessions", session.docId);
    await setDoc(
      sessionRef,
      {
        events: arrayUnion(...events),
        totalStickersPlaced: session.totalStickersPlaced,
        tabsVisited: [...session.tabsVisited],
      },
      { merge: true }
    );
  } catch (e) {
    // Put events back in buffer on failure
    buffer = [...events, ...buffer];
    console.warn("Analytics flush failed:", e);
  }
}

function scheduleFlush() {
  if (flushTimer) clearTimeout(flushTimer);
  flushTimer = setTimeout(flush, 5_000); // 5 seconds (dev), 60s in prod
}

function checkBufferSize() {
  if (buffer.length >= 50) {
    flush();
    if (flushTimer) clearTimeout(flushTimer);
    flushTimer = null;
  }
}

// --- Public API ---

export function initSession(userAgent, screenWidth, screenHeight) {
  let stored = getStoredSession();

  if (stored && stored.sessionId && stored.docId) {
    // Resume existing session (page refresh)
    // Convert tabsVisited back to Set (sessionStorage serializes to array)
    session = {
      ...stored,
      tabsVisited: new Set(Array.isArray(stored.tabsVisited) ? stored.tabsVisited : ["brief"]),
      totalStickersPlaced: stored.totalStickersPlaced || 0,
      startedAt: stored.startedAt || Date.now(),
    };
  } else {
    // New session (new tab)
    const sessionId = crypto.randomUUID();
    const docId = crypto.randomUUID();
    session = {
      sessionId,
      docId,
      tabsVisited: new Set(["brief"]),
      totalStickersPlaced: 0,
      startedAt: Date.now(),
    };
    saveSessionToStorage({
      sessionId: session.sessionId,
      docId: session.docId,
      tabsVisited: [...session.tabsVisited],
      totalStickersPlaced: session.totalStickersPlaced,
      startedAt: session.startedAt,
    });
  }

  // Log app_load event
  logEvent(EVENTS.APP_LOAD, { userAgent, screenWidth, screenHeight });

  // Listen for tab close / visibility changes
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
  window.addEventListener("beforeunload", () => {
    endSession();
    flush();
  });

  scheduleFlush();
}

export function logEvent(eventType, data = {}) {
  if (!session) return;

  buffer.push({
    eventType,
    timestamp: Date.now(),
    data,
  });

  checkBufferSize();
  if (!flushTimer) scheduleFlush();
}

export function startSessionDoc(teamName, scenarioId, scenarioTitle) {
  if (!session) return;

  session.teamName = teamName;
  session.scenarioId = scenarioId;
  session.scenarioTitle = scenarioTitle;

  const db = getDb();
  const sessionRef = doc(db, "sessions", session.docId);

  // Fire-and-forget — don't await
  setDoc(sessionRef, {
    sessionId: session.sessionId,
    teamName,
    scenarioId,
    scenarioTitle,
    userAgent: navigator.userAgent,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    startedAt: serverTimestamp(),
    totalStickersPlaced: 0,
    tabsVisited: ["brief"],
    events: [],
  }).catch((e) => console.warn("Analytics session init failed:", e));
}

export function endSession() {
  if (!session) return;

  const durationMs = Date.now() - session.startedAt;

  logEvent(EVENTS.SESSION_END, {
    durationMs,
    totalStickersPlaced: session.totalStickersPlaced,
    tabsVisited: [...session.tabsVisited],
  });

  // Update session doc with end stats
  try {
    const db = getDb();
    const sessionRef = doc(db, "sessions", session.docId);
    setDoc(
      sessionRef,
      {
        endedAt: serverTimestamp(),
        durationMs,
        totalStickersPlaced: session.totalStickersPlaced,
        tabsVisited: [...session.tabsVisited],
      },
      { merge: true }
    ).catch(() => {});
  } catch {}
}

// --- Convenience methods ---

export function logTeamNameSubmitted(teamName, scenarioId) {
  logEvent(EVENTS.TEAM_NAME_SUBMITTED, { teamName, scenarioId });
}

export function logTabSwitched(fromTab, toTab) {
  if (session && session.tabsVisited) {
    session.tabsVisited.add(toTab);
  }
  logEvent(EVENTS.TAB_SWITCHED, { fromTab, toTab });
}

export function logScenarioChanged(fromActivityId, toActivityId) {
  logEvent(EVENTS.SCENARIO_CHANGED, { fromActivityId, toActivityId });
}

export function logStoryboardStarted(scenarioId) {
  logEvent(EVENTS.STORYBOARD_STARTED, { scenarioId });
}

export function logStickerPlaced(stickerId, source, zoneId, zoneType) {
  if (session) session.totalStickersPlaced++;
  logEvent(EVENTS.STICKER_PLACED, { stickerId, source, zoneId, zoneType });
}

export function logStickerRemoved(stickerId, zoneId, zoneType) {
  if (session && session.totalStickersPlaced > 0) {
    session.totalStickersPlaced--;
  }
  logEvent(EVENTS.STICKER_REMOVED, { stickerId, zoneId, zoneType });
}

export function logCustomStickerCreated(text, color) {
  logEvent(EVENTS.CUSTOM_STICKER_CREATED, { text, color });
}

export function logMobileStickerSelected(stickerId) {
  logEvent(EVENTS.MOBILE_STICKER_SELECTED, { stickerId });
}

