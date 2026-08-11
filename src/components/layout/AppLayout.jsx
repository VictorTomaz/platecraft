import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import BottomNav from "@/components/layout/BottomNav";
import MoreMenu from "@/components/layout/MoreMenu";
import { getTabState, setTabState } from "@/lib/tabState";
import { TAB_PATHS, isTabPath, onTabRootVisited, syncSubpage } from "@/lib/tabNavigation";
import Today from "@/pages/Today";
import MyFoods from "@/pages/MyFoods";
import BarcodeScanner from "@/pages/BarcodeScanner";
import FoodLog from "@/pages/FoodLog";
import CalorieCalculator from "@/pages/CalorieCalculator";
import MealPrep from "@/pages/MealPrep";

const TAB_COMPONENTS = {
  "/": Today,
  "/my-foods": MyFoods,
  "/scan-barcode": BarcodeScanner,
  "/food-log": FoodLog,
  "/calorie-calculator": CalorieCalculator,
  "/meal-prep": MealPrep,
};

export default function AppLayout() {
  const location = useLocation();
  const pathname = location.pathname;
  const onTab = isTabPath(pathname);
  const showBottomNav = onTab;

  // Only mount a tab's page once it has actually been visited, then keep it mounted
  // for the rest of the session so switching back preserves its state.
  const [visitedTabs, setVisitedTabs] = useState(() => (onTab ? [pathname] : []));
  useEffect(() => {
    if (onTab) {
      setVisitedTabs((prev) => (prev.includes(pathname) ? prev : [...prev, pathname]));
    }
  }, [pathname, onTab]);

  // Keep a buffer history entry at the app root so a native Android back gesture
  // steps backward through in-app navigation instead of exiting the WebView.
  useEffect(() => {
    if (location.pathname === "/") {
      window.history.pushState({ platecraftRoot: true }, "", location.pathname);
    }
  }, [location.pathname]);

  // Cache each route's scroll position in the shared tabState registry so switching
  // tabs or navigating back restores exactly where the user left off.
  useEffect(() => {
    const key = `scroll:${location.pathname}`;
    const saved = getTabState(key, 0);
    if (saved > 0) window.scrollTo(0, saved);
    return () => setTabState(key, window.scrollY);
  }, [location.pathname]);

  // Keep each tab's independent navigation stack in sync with the current location,
  // whether the change came from a push (new page) or a pop (back/forward).
  useEffect(() => {
    if (onTab) {
      onTabRootVisited(pathname);
    } else {
      syncSubpage(pathname);
    }
  }, [pathname, onTab]);

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className={`w-full max-w-[430px] min-h-screen relative pt-[env(safe-area-inset-top,24px)] ${showBottomNav ? "pb-24" : ""}`}>
        {pathname === "/" && <MoreMenu />}

        {/* Every tab root stays permanently mounted so switching tabs never resets its state */}
        <div style={{ display: onTab ? "block" : "none" }}>
          {TAB_PATHS.filter((tab) => visitedTabs.includes(tab)).map((tab) => {
            const TabComponent = TAB_COMPONENTS[tab];
            const isActiveTab = pathname === tab;
            return (
              <motion.div
                key={tab}
                style={{ display: isActiveTab ? "block" : "none" }}
                initial={false}
                animate={isActiveTab ? { opacity: 1, x: 0 } : { opacity: 0, x: 0 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                <TabComponent active={isActiveTab} />
              </motion.div>
            );
          })}
        </div>

        {/* Pages pushed on top of a tab (e.g. Meal Builder, About) render as an overlay */}
        <AnimatePresence mode="wait">
          {!onTab && (
            <motion.div
              key={pathname}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <Outlet />
            </motion.div>
          )}
        </AnimatePresence>

        {showBottomNav && <BottomNav />}
      </div>
    </div>
  );
}