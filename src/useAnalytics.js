// ponytail: thin hook — single import in App.jsx instead of 8.
// If analytics backend changes, swap the implementation here.
import {
  logTeamNameSubmitted,
  logTabSwitched,
  logScenarioChanged,
  logStoryboardStarted,
  logStickerPlaced,
  logStickerRemoved,
  logCustomStickerCreated,
  logMobileStickerSelected,
  startSessionDoc,
} from "./analytics/analytics";

export default function useAnalytics() {
  return {
    logTeamNameSubmitted,
    logTabSwitched,
    logScenarioChanged,
    logStoryboardStarted,
    logStickerPlaced,
    logStickerRemoved,
    logCustomStickerCreated,
    logMobileStickerSelected,
    startSessionDoc,
  };
}
