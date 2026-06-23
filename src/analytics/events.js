// Event type constants for NarrativeFlow analytics
// Use these to avoid typos when logging events across the app

export const EVENTS = {
  // App & Navigation
  APP_LOAD: "app_load",
  TEAM_NAME_SUBMITTED: "team_name_submitted",
  TAB_SWITCHED: "tab_switched",
  SCENARIO_CHANGED: "scenario_changed",
  STORYBOARD_STARTED: "storyboard_started",

  // Sticker Interactions
  STICKER_PLACED: "sticker_placed",
  STICKER_REMOVED: "sticker_removed",
  CUSTOM_STICKER_CREATED: "custom_sticker_created",

  // Mobile-Specific
  MOBILE_STICKER_SELECTED: "mobile_sticker_selected",
  MOBILE_STICKER_PLACED: "mobile_sticker_placed",

  // Session Lifecycle
  SESSION_END: "session_end",
};
