// Tracks a per-tab navigation stack so each bottom tab keeps its own
// browsing history, independent from the others (like a stack navigator).
export const TAB_PATHS = ["/", "/my-foods", "/scan-barcode", "/food-log", "/calorie-calculator", "/meal-prep"];

const tabStacks = {};
TAB_PATHS.forEach((tab) => { tabStacks[tab] = [tab]; });

let tabVisitOrder = ["/"];
let currentTab = "/";

export function isTabPath(path) {
  return TAB_PATHS.includes(path);
}

export function getActiveTab() {
  return currentTab;
}

export function getStackTop(tab) {
  const stack = tabStacks[tab] || [tab];
  return stack[stack.length - 1];
}

// Call whenever the current location is one of the tab root paths.
export function onTabRootVisited(tab) {
  currentTab = tab;
  if (!tabStacks[tab]) tabStacks[tab] = [tab];
  tabVisitOrder = [tab, ...tabVisitOrder.filter((t) => t !== tab)];
}

// Call whenever the current location is a pushed subpage (not a tab root).
// Works for both forward pushes and back/forward navigation to an
// already-known page, keeping the active tab's stack in sync either way.
export function syncSubpage(path) {
  const stack = tabStacks[currentTab] || [currentTab];
  const idx = stack.indexOf(path);
  tabStacks[currentTab] = idx !== -1 ? stack.slice(0, idx + 1) : [...stack, path];
}

// Resets a tab's stack back to just its root (used when tapping the already-active tab).
export function resetTab(tab) {
  tabStacks[tab] = [tab];
}