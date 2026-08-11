import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import ResponsiveSelect from "@/components/ui/responsive-select";
import { Loader2, Sparkles } from "lucide-react";
import MealIdeaCard from "@/components/mealprep/MealIdeaCard";

const MEAL_SLOTS = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "dinner", label: "Dinner" },
];

export default function MealPrep() {
  const [mealSlot, setMealSlot] = useState("breakfast");
  const [loading, setLoading] = useState(false);
  const [meals, setMeals] = useState(null);
  const [error, setError] = useState(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await base44.functions.invoke("generateMealIdea", { meal_slot: mealSlot, variety_seed: Math.random() });
      if (res.data?.error) {
        setError(res.data.error);
        setMeals(null);
      } else {
        setMeals(res.data.meals);
      }
    } catch (e) {
      setError("Something went wrong generating meal ideas. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="px-5 pt-8 pb-4">
      <h1 className="text-white text-2xl font-extrabold tracking-tight mb-5">Meal Prep</h1>

      <div className="mb-4">
        <Label className="text-white/60 text-xs">Meal</Label>
        <ResponsiveSelect
          value={mealSlot}
          onValueChange={setMealSlot}
          options={MEAL_SLOTS.map((s) => ({ value: s.id, label: s.label }))}
          label="Meal"
        />
      </div>

      <Button
        onClick={generate}
        disabled={loading}
        className="w-full bg-[#06D6A0] text-[#1A1A2E] font-extrabold hover:bg-[#06D6A0]/80 mb-5"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Sparkles className="w-4 h-4 mr-1" />}
        Generate Meal Prep
      </Button>

      {error && (
        <div className="bg-[#16213E] rounded-2xl p-4 text-center text-white/60 text-sm mb-5">{error}</div>
      )}

      {meals && (
        <div className="space-y-3">
          {meals.map((meal, i) => (
            <MealIdeaCard key={i} meal={meal} />
          ))}
        </div>
      )}

      {!meals && !error && !loading && (
        <div className="bg-[#16213E] rounded-2xl p-6 text-center text-white/40 text-sm">
          Tap the button above to generate meal ideas based on your saved foods and calorie goals.
        </div>
      )}
    </div>
  );
}