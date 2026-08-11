import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { MEAL_SLOTS } from "@/lib/mealSlots";
import MealSlotCard from "@/components/meals/MealSlotCard";
import MacroPills from "@/components/meals/MacroPills";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import usePullToRefresh from "@/hooks/usePullToRefresh";

export default function Today() {
  const navigate = useNavigate();
  const today = format(new Date(), "yyyy-MM-dd");
  const [entries, setEntries] = useState([]);
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const [e, g] = await Promise.all([
      base44.entities.MealEntry.filter({ date: today }),
      base44.entities.CalorieGoal.filter({ is_active: true }, "-created_date", 1),
    ]);
    setEntries(e);
    setGoal(g[0] || null);
    setLoading(false);
  };

  useEffect(() => { load(); }, [today]);

  const { handlers, pullDistance, refreshing } = usePullToRefresh(load);

  const slotTotals = (slotId) =>
    entries.filter((e) => e.meal_slot === slotId).reduce((s, e) => s + (e.calories || 0), 0);

  const slotCount = (slotId) => entries.filter((e) => e.meal_slot === slotId).length;

  const dayTotals = entries.reduce(
    (acc, e) => ({
      calories: acc.calories + (e.calories || 0),
      protein: acc.protein + (e.protein || 0),
      carbs: acc.carbs + (e.carbs || 0),
      fats: acc.fats + (e.fats || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const target = goal?.daily_calorie_target;
  const pct = target ? Math.min(100, Math.round((dayTotals.calories / target) * 100)) : 0;

  if (loading) {
    return <div className="p-6 text-white/40 text-sm">Loading...</div>;
  }

  return (
    <div {...handlers} className="px-5 pt-4 pb-4">
      <div
        style={{ height: refreshing ? 36 : pullDistance }}
        className="flex items-center justify-center overflow-hidden transition-[height] duration-200"
      >
        {(pullDistance > 8 || refreshing) && (
          <Loader2 className={`w-5 h-5 text-white/50 ${refreshing ? "animate-spin" : ""}`} />
        )}
      </div>
      <p className="text-white/40 text-sm font-semibold">{format(new Date(), "EEEE, MMMM d")}</p>
      <h1 className="text-white text-3xl font-extrabold tracking-tight mb-6">PlateCraft</h1>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {MEAL_SLOTS.map((slot) => (
          <MealSlotCard
            key={slot.id}
            slot={slot}
            calories={slotTotals(slot.id)}
            itemCount={slotCount(slot.id)}
            onClick={() => navigate(`/meal-builder?slot=${slot.id}&date=${today}`)}
          />
        ))}
      </div>

      <div className="bg-card rounded-3xl p-5">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-white font-extrabold text-2xl">{Math.round(dayTotals.calories)}</span>
          <span className="text-white/40 text-sm font-semibold">
            {target ? `of ${target} kcal` : "kcal today"}
          </span>
        </div>
        {target && (
          <div className="w-full h-2 rounded-full bg-white/10 mb-3 overflow-hidden">
            <div className="h-full bg-[#06D6A0] rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
        )}
        <MacroPills protein={dayTotals.protein} carbs={dayTotals.carbs} fats={dayTotals.fats} />
      </div>
    </div>
  );
}