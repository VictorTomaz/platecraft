import React, { useState } from "react";
import { motion } from "framer-motion";
import { Trash2, Pencil, Check, ArrowLeftRight } from "lucide-react";
import { toggleUnit, convertAmount } from "@/lib/unitConversion";

const MACRO_COLORS = { protein: "#FF6B6B", carbs: "#FFD166", fats: "#4ECDC4" };

function getMacroColor(item) {
  const max = Math.max(item.base_protein || 0, item.base_carbs || 0, item.base_fats || 0);
  if (max === (item.base_protein || 0)) return MACRO_COLORS.protein;
  if (max === (item.base_carbs || 0)) return MACRO_COLORS.carbs;
  return MACRO_COLORS.fats;
}

export default function PlateItemCard({ item, onMultiplierChange, onUnitChange, onRemove }) {
  const [editing, setEditing] = useState(false);
  const totalAmount = item.serving_amount * item.multiplier;
  const [amountValue, setAmountValue] = useState(totalAmount);
  const accentColor = getMacroColor(item);

  const startEditing = () => {
    setAmountValue(totalAmount);
    setEditing(true);
  };

  const handleToggleUnit = () => {
    const newUnit = toggleUnit(item.serving_unit);
    const newAmountValue = convertAmount(amountValue, item.serving_unit, newUnit);
    setAmountValue(newAmountValue);
    onUnitChange(newUnit);
  };

  const confirmEdit = () => {
    const newAmount = parseFloat(amountValue);
    if (newAmount > 0 && item.serving_amount > 0) {
      onMultiplierChange(newAmount / item.serving_amount);
    }
    setEditing(false);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.015 }}
      className="flex items-center gap-3 bg-[#1A1A2E] rounded-2xl p-3 border border-white/5 relative overflow-hidden"
    >
      <span className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl" style={{ backgroundColor: accentColor }} />
      <span
        className="w-2.5 h-2.5 rounded-full shrink-0 ml-1"
        style={{ backgroundColor: accentColor, boxShadow: `0 0 8px ${accentColor}` }}
      />
      <div className="flex-1 min-w-0">
        <p className="text-white font-bold text-sm truncate">{item.food_name}</p>
        {editing ? (
          <div className="flex items-center gap-1 mt-1">
            <input
              type="number"
              value={amountValue}
              onChange={(e) => setAmountValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && confirmEdit()}
              autoFocus
              className="w-16 bg-[#0F1830] text-white rounded-md px-1.5 py-0.5 text-xs border border-white/10 focus:outline-none focus:border-[#06D6A0]"
            />
            <button
              type="button"
              onClick={handleToggleUnit}
              title={`Switch to ${toggleUnit(item.serving_unit)}`}
              className="inline-flex items-center gap-0.5 text-white/40 text-xs hover:text-white"
            >
              {item.serving_unit} <ArrowLeftRight className="w-2.5 h-2.5" />
            </button>
          </div>
        ) : (
          <p className="text-white/40 text-xs">
            {Math.round(item.base_calories * item.multiplier)} kcal · {totalAmount}{item.serving_unit}
          </p>
        )}
      </div>
      {editing ? (
        <button onClick={confirmEdit} className="w-9 h-9 flex items-center justify-center text-[#06D6A0]">
          <Check className="w-4 h-4" />
        </button>
      ) : (
        <button onClick={startEditing} className="w-9 h-9 flex items-center justify-center text-white/50">
          <Pencil className="w-4 h-4" />
        </button>
      )}
      <button onClick={onRemove} className="w-9 h-9 flex items-center justify-center text-[#EF476F] hover:scale-110 transition-transform">
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
}