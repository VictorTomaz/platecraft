import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UtensilsCrossed, Apple, History, Calculator, ScanBarcode, ChefHat } from "lucide-react";
import { getStackTop, resetTab } from "@/lib/tabNavigation";

const TABS = [
  { to: "/", label: "Today", icon: UtensilsCrossed },
  { to: "/my-foods", label: "My Foods", icon: Apple },
  { to: "/scan-barcode", label: "Scan", icon: ScanBarcode },
  { to: "/food-log", label: "Log", icon: History },
  { to: "/calorie-calculator", label: "Calculator", icon: Calculator },
  { to: "/meal-prep", label: "Meal Prep", icon: ChefHat },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname;

  const handleTabClick = (to) => {
    if (activeTab === to) {
      // Tapping the already-active tab resets its internal stack back to its root.
      resetTab(to);
      navigate(to, { replace: true });
    } else {
      // Switching tabs restores wherever that tab's stack was left off.
      navigate(getStackTop(to));
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
      <div className="w-full max-w-[430px] bg-[#16213E] border-t border-white/10 px-1 pt-2 pb-[calc(env(safe-area-inset-bottom)+8px)] flex">
        {TABS.map(({ to, label, icon: Icon }) => {
          const isActive = activeTab === to;
          return (
            <button
              key={to}
              onClick={() => handleTabClick(to)}
              className={`flex flex-1 flex-col items-center justify-center gap-1 min-h-[44px] rounded-2xl px-1 py-1.5 transition-colors ${
                isActive ? "text-[#06D6A0]" : "text-white/50"
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className="text-[10px] font-semibold tracking-wide whitespace-nowrap">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}