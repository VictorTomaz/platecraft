import React from "react";

export default function MacroPills({ protein = 0, carbs = 0, fats = 0, size = "md" }) {
  const px = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs";
  return (
    <div className="flex gap-2">
      <span className={`rounded-full bg-blue-500/20 text-blue-300 font-bold ${px}`}>
        P {Math.round(protein)}g
      </span>
      <span className={`rounded-full bg-orange-500/20 text-orange-300 font-bold ${px}`}>
        C {Math.round(carbs)}g
      </span>
      <span className={`rounded-full bg-green-500/20 text-green-300 font-bold ${px}`}>
        F {Math.round(fats)}g
      </span>
    </div>
  );
}