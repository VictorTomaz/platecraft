import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";

const MACROS = [
  { key: "protein", label: "Protein", color: "#3B82F6", calsPerGram: 4 },
  { key: "carbs", label: "Carbs", color: "#F97316", calsPerGram: 4 },
  { key: "fat", label: "Fat", color: "#06D6A0", calsPerGram: 9 },
];

export default function MacroSplitSliders({ calories }) {
  const [pct, setPct] = useState({ protein: 30, carbs: 45, fat: 25 });

  const handleChange = (key, value) => {
    const newVal = Math.round(value[0]);
    const otherKeys = MACROS.map((m) => m.key).filter((k) => k !== key);
    const remaining = 100 - newVal;
    const otherTotal = pct[otherKeys[0]] + pct[otherKeys[1]];

    const next = { ...pct, [key]: newVal };
    if (otherTotal === 0) {
      next[otherKeys[0]] = Math.round(remaining / 2);
      next[otherKeys[1]] = remaining - next[otherKeys[0]];
    } else {
      next[otherKeys[0]] = Math.round((pct[otherKeys[0]] / otherTotal) * remaining);
      next[otherKeys[1]] = remaining - next[otherKeys[0]];
    }
    setPct(next);
  };

  return (
    <div className="bg-[#16213E] rounded-3xl p-4 space-y-5 mb-5">
      <p className="text-white font-extrabold">Macronutrient Split</p>
      {MACROS.map((m) => {
        const grams = calories ? Math.round((calories * (pct[m.key] / 100)) / m.calsPerGram) : 0;
        return (
          <div key={m.key}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80 font-semibold text-sm">{m.label}</span>
              <span className="font-bold text-sm" style={{ color: m.color }}>
                {pct[m.key]}% · {grams}g
              </span>
            </div>
            <Slider
              value={[pct[m.key]]}
              onValueChange={(v) => handleChange(m.key, v)}
              min={0}
              max={100}
              step={1}
              className="[&_[role=slider]]:border-2"
              style={{ "--tw-ring-color": m.color }}
            />
          </div>
        );
      })}
    </div>
  );
}