import React from "react";
import MacroPills from "@/components/meals/MacroPills";

export default function MealIdeaCard({ meal }) {
  return (
    <div className="bg-[#16213E] rounded-3xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-white font-extrabold">{meal.name}</span>
        <span className="text-[#06D6A0] font-extrabold">{Math.round(meal.total_calories)} kcal</span>
      </div>

      <div className="space-y-2">
        {meal.foods.map((f, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-white/80 font-medium">{f.food_name}</span>
            <span className="text-white/40 text-xs">{f.serving_amount} {f.serving_unit} • {Math.round(f.calories)} kcal</span>
          </div>
        ))}
      </div>

      <MacroPills protein={meal.total_protein} carbs={meal.total_carbs} fats={meal.total_fats} />
    </div>
  );
}