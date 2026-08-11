import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { format, addDays, subDays } from "date-fns";
import { ChevronLeft, ChevronRight, Trash2, Loader2 } from "lucide-react";
import { MEAL_SLOTS } from "@/lib/mealSlots";
import MacroPills from "@/components/meals/MacroPills";
import usePullToRefresh from "@/hooks/usePullToRefresh";
import usePersistentState from "@/hooks/usePersistentState";
import { useToast } from "@/components/ui/use-toast";
import WeeklyProgressChart from "@/components/foodlog/WeeklyProgressChart";

export default function FoodLog() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [date, setDate] = usePersistentState("foodlog-date", new Date());
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const dateStr = format(date, "yyyy-MM-dd");

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.MealEntry.filter({ date: dateStr });
    setEntries(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [dateStr]);

  const { handlers, pullDistance, refreshing } = usePullToRefresh(load);

  const remove = async (id) => {
    const previousEntries = entries;
    setEntries((prev) => prev.filter((e) => e.id !== id));
    try {
      await base44.entities.MealEntry.delete(id);
    } catch (error) {
      setEntries(previousEntries);
      toast({ title: "Failed to delete", description: "Please try again.", variant: "destructive" });
    }
  };

  const dayTotals = entries.reduce(
    (acc, e) => ({
      calories: acc.calories + (e.calories || 0),
      protein: acc.protein + (e.protein || 0),
      carbs: acc.carbs + (e.carbs || 0),
      fats: acc.fats + (e.fats || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

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
      <h1 className="text-white text-2xl font-extrabold tracking-tight mb-5">Food Log</h1>

      <div className="flex items-center justify-between mb-5">
        <button onClick={() => setDate((d) => subDays(d, 1))} className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-white">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <p className="text-white font-bold">{format(date, "EEEE, MMM d")}</p>
        <button onClick={() => setDate((d) => addDays(d, 1))} className="w-10 h-10 rounded-full bg-card flex items-center justify-center text-white">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-card rounded-3xl p-4 mb-5">
        <p className="text-white font-extrabold text-2xl mb-2">{Math.round(dayTotals.calories)} kcal</p>
        <MacroPills protein={dayTotals.protein} carbs={dayTotals.carbs} fats={dayTotals.fats} />
      </div>

      <WeeklyProgressChart />

      {loading ? (
        <p className="text-white/40 text-sm">Loading...</p>
      ) : (
        <div className="space-y-4">
          {MEAL_SLOTS.map((slot) => {
            const items = entries.filter((e) => e.meal_slot === slot.id);
            if (items.length === 0) return null;
            return (
              <div key={slot.id} className="bg-card rounded-3xl p-4">
                <button
                  onClick={() => navigate(`/meal-builder?slot=${slot.id}&date=${dateStr}`)}
                  className="flex items-center gap-2 mb-3"
                >
                  <span>{slot.emoji}</span>
                  <span className="text-white font-bold text-sm">{slot.label}</span>
                </button>
                <div className="space-y-2">
                  {items.map((e) => (
                    <div key={e.id} className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{e.food_name}</p>
                        <p className="text-white/40 text-xs">
                          {Math.round(e.calories)} kcal · x{e.multiplier}
                        </p>
                      </div>
                      <button onClick={() => remove(e.id)} className="w-8 h-8 flex items-center justify-center text-[#EF476F] shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {entries.length === 0 && (
            <p className="text-white/40 text-sm text-center py-10">No meals logged for this day.</p>
          )}
        </div>
      )}
    </div>
  );
}