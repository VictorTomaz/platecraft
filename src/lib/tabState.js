// In-memory store that persists values across component unmount/remount
// (e.g. when switching between BottomNav tabs), for the lifetime of the app session.
const store = {};

export function getTabState(key, defaultValue) {
  return key in store ? store[key] : defaultValue;
}

export function setTabState(key, value) {
  store[key] = value;
}