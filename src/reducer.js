// ponytail: single reducer for all app state — replaces 9 useState calls
// and eliminates the nested setNarrative-inside-setStoryboard hack.
// Actions are explicit state transitions, not side effects.

import activities from "./config/activities";

const shuffleStickers = (stickers) => [...stickers].sort(() => Math.random() - 0.5);

export const initialState = {
  screen: "team",
  teamName: "",
  activeTab: "brief",
  activeActivityId: activities[0].id,
  stickers: shuffleStickers(activities[0].masterStickers),
  storyboard: { problem: [], action: [], outcome: [] },
  narrative: { intro: [], rising: [], climax: [], falling: [], conclude: [] },
  dragging: null,
  dragOver: null,
  selectedSticker: null,
};

export function reducer(state, action) {
  switch (action.type) {
    case "SET_TEAM": {
      return { ...state, screen: "app", teamName: action.teamName };
    }

    case "SWITCH_TAB": {
      return { ...state, activeTab: action.tab };
    }

    case "CHANGE_SCENARIO": {
      const activity = activities.find((a) => a.id === action.activityId) ?? activities[0];
      return {
        ...state,
        activeActivityId: action.activityId,
        stickers: shuffleStickers(activity.masterStickers),
        storyboard: { problem: [], action: [], outcome: [] },
        narrative: { intro: [], rising: [], climax: [], falling: [], conclude: [] },
        selectedSticker: null,
      };
    }

    case "ADD_CUSTOM_STICKER": {
      return {
        ...state,
        stickers: [{ id: action.id, text: action.text, color: action.color }, ...state.stickers],
      };
    }

    case "START_DRAG": {
      return { ...state, dragging: { sticker: action.sticker, source: action.source }, selectedSticker: action.sticker };
    }

    case "SET_DRAG_OVER": {
      return { ...state, dragOver: action.zoneId };
    }

    case "CLEAR_DRAG_OVER": {
      return { ...state, dragOver: null };
    }

    case "SELECT_STICKER": {
      return {
        ...state,
        selectedSticker: state.selectedSticker?.id === action.sticker.id ? null : action.sticker,
      };
    }

    // Atomic removal from ALL zones + placement in target zone.
    // This replaces the nested-setState hack.
    case "PLACE_STICKER": {
      const { sticker, zone, zoneType } = action;
      const removeFrom = (obj) => {
        const next = { ...obj };
        Object.keys(next).forEach((k) => {
          next[k] = next[k].filter((s) => s.id !== sticker.id);
        });
        return next;
      };

      return {
        ...state,
        storyboard: zoneType === "storyboard" ? { ...removeFrom(state.storyboard), [zone]: [...removeFrom(state.storyboard)[zone], sticker] } : removeFrom(state.storyboard),
        narrative: zoneType === "narrative" ? { ...removeFrom(state.narrative), [zone]: [...removeFrom(state.narrative)[zone], sticker] } : removeFrom(state.narrative),
        dragging: null,
        dragOver: null,
        selectedSticker: null,
      };
    }

    case "REMOVE_STICKER": {
      const { sticker, zoneId, zoneType } = action;
      if (zoneType === "storyboard") {
        return {
          ...state,
          storyboard: { ...state.storyboard, [zoneId]: state.storyboard[zoneId].filter((s) => s.id !== sticker.id) },
        };
      }
      return {
        ...state,
        narrative: { ...state.narrative, [zoneId]: state.narrative[zoneId].filter((s) => s.id !== sticker.id) },
      };
    }

    default:
      return state;
  }
}
