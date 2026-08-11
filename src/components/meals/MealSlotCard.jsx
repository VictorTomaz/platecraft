import React from "react";
import { Check } from "lucide-react";

export default function MealSlotCard({ slot, calories, itemCount, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative bg-[#16213E] rounded-3xl p-4 flex flex-col items-center gap-1.5 min-h-[120px] justify-center active:scale-95 transition-transform shadow-lg"
      style={{ boxShadow: `0 8px 24px -12px ${slot.color}88` }}
    >
      {itemCount > 0 && (
        <span
          className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center"
          style={{ backgroundColor: slot.color }}
        >
          <Check className="w-3 h-3 text-[#1A1A2E]" strokeWidth={3} />
        </span>
      )}
      <span className="text-3xl">{slot.emoji}</span>
      <span className="text-white font-extrabold text-sm tracking-tight">{slot.label}</span>
      <span className="text-white/50 text-xs font-semibold">
        {calories > 0 ? `${Math.round(calories)} kcal` : "Empty"}
      </span>
    </button>
  );
}