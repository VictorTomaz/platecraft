import React from "react";
import { GripVertical } from "lucide-react";

export default function FoodLibraryCard({ food, provided, isDragging, compact }) {
  if (compact) {
    return (
      <div
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        className={`bg-[#16213E] rounded-xl p-2 border border-white/5 ${
          isDragging ? "ring-2 ring-[#06D6A0] shadow-2xl" : ""
        }`}
      >
        <p className="text-white font-bold text-xs truncate">{food.name}</p>
        <p className="text-white/40 text-[10px]">
          {Math.round(food.calories)} kcal
        </p>
      </div>
    );
  }

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      className={`flex items-center gap-2 bg-[#16213E] rounded-2xl p-3 border border-white/5 ${
        isDragging ? "ring-2 ring-[#06D6A0] shadow-2xl" : ""
      }`}
    >
      <GripVertical className="w-4 h-4 text-white/30 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-white font-bold text-sm truncate">{food.name}</p>
        <p className="text-white/40 text-xs">
          {food.serving_amount}{food.serving_unit} · {Math.round(food.calories)} kcal
        </p>
      </div>
    </div>
  );
}