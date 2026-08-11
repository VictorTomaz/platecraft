import { useState, useRef, useCallback } from "react";

const THRESHOLD = 70;
const MAX_PULL = 100;

export default function usePullToRefresh(onRefresh) {
  const [pulling, setPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef(null);

  const handleStart = useCallback(
    (clientY) => {
      if (refreshing) return;
      if (window.scrollY <= 0) {
        startY.current = clientY;
        setPulling(true);
      }
    },
    [refreshing]
  );

  const handleMove = useCallback(
    (clientY) => {
      if (!pulling || refreshing) return;
      const delta = clientY - startY.current;
      if (delta > 0) {
        setPullDistance(Math.min(delta * 0.5, MAX_PULL));
      }
    },
    [pulling, refreshing]
  );

  const handleEnd = useCallback(async () => {
    if (!pulling) return;
    setPulling(false);
    if (pullDistance > THRESHOLD) {
      setRefreshing(true);
      setPullDistance(THRESHOLD);
      await onRefresh();
      setRefreshing(false);
    }
    setPullDistance(0);
  }, [pulling, pullDistance, onRefresh]);

  const handlers = {
    ref: containerRef,
    onTouchStart: (e) => handleStart(e.touches[0].clientY),
    onTouchMove: (e) => handleMove(e.touches[0].clientY),
    onTouchEnd: handleEnd,
    onMouseDown: (e) => handleStart(e.clientY),
    onMouseMove: (e) => {
      if (pulling) handleMove(e.clientY);
    },
    onMouseUp: handleEnd,
    onMouseLeave: () => {
      if (pulling) handleEnd();
    },
  };

  return { handlers, pullDistance, refreshing };
}