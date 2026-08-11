import { useState, useEffect } from "react";
import { getTabState, setTabState } from "@/lib/tabState";

// Like useState, but the value survives unmount/remount by living in a module-level store,
// so filter/selection state is preserved when navigating away from and back to a tab.
export default function usePersistentState(key, defaultValue) {
  const [value, setValue] = useState(() => getTabState(key, defaultValue));

  useEffect(() => {
    setTabState(key, value);
  }, [key, value]);

  return [value, setValue];
}