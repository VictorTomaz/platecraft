import React, { useEffect, useState, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { format, addDays, subDays, startOfWeek, isSameDay } from "date-fns";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export default function WeeklyProgressChart() {
  const [anchorDate, setAnchorDate] = useState(new Date());
  const [weekly, setWeekly] = useState([]);
  const [loading, setLoading] = useState(true);

  const weekStart = useMemo(
    () => startOfWeek(anchorDate, { weekStartsOn: 0 }),
    [anchorDate]
  );
  const weekDays = useMemo(
    () => Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const load = async () => {
    setLoading(true);
    const dateStrs = weekDays.map((d) => format(d, "yyyy-MM-dd"));
    try {
      const results = await Promise.all(
        dateStrs.map((ds) => base44.entities.MealEntry.filter({ date: ds }))
      );
      const aggregated = results.map((dayEntries, i) => {
        const totals = dayEntries.reduce(
          (acc, e) => ({
            calories: acc.calories + (e.calories || 0),
            protein: acc.protein + (e.protein || 0),
            carbs: acc.carbs + (e.carbs || 0),
            fats: acc.fats + (e.fats || 0),
          }),
          { calories: 0, protein: 0, carbs: 0, fats: 0 }
        );
        return {
          label: format(weekDays[i], "EEEEE"),
          date: weekDays[i],
          ...totals,
        };
      });
      setWeekly(aggregated);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [anchorDate]);

  const today = new Date();
  const currentWeekStart = startOfWeek(today, { weekStartsOn: 0 });
  const isFutureWeek = weekStart > currentWeekStart;
  const isCurrentWeek = isSameDay(weekStart, currentWeekStart);

  return (
    <div className="bg-card rounded-3xl p-4 mb-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-white font-bold text-sm">Weekly Progress</p>
          <p className="text-white/40 text-xs">Calories & macros</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAnchorDate((d) => subDays(d, 7))}
            className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-white"
            aria-label="Previous week"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-white/70 text-xs font-medium w-32 text-center">
            {format(weekStart, "MMM d")} – {format(addDays(weekStart, 6), "MMM d")}
          </span>
          <button
            onClick={() => setAnchorDate((d) => addDays(d, 7))}
            disabled={isCurrentWeek || isFutureWeek}
            className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-white disabled:opacity-30"
            aria-label="Next week"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-5 h-5 text-white/40 animate-spin" />
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <ComposedChart data={weekly} margin={{ top: 5, right: 5, bottom: 0, left: -22 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="rgba(255,255,255,0.45)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="left"
              stroke="rgba(255,255,255,0.45)"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="rgba(255,255,255,0.25)"
              fontSize={9}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.04)" }}
              contentStyle={{
                background: "#1b1c30",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 12,
                fontSize: 12,
                color: "#fff",
              }}
              labelStyle={{ color: "rgba(255,255,255,0.6)" }}
              labelFormatter={(_, payload) =>
                payload?.length ? format(payload[0].payload.date, "EEE, MMM d") : ""
              }
            />
            <Legend wrapperStyle={{ fontSize: 11 }} iconType="circle" />
            <Bar
              yAxisId="left"
              dataKey="calories"
              name="Calories"
              fill="#06D6A0"
              radius={[4, 4, 0, 0]}
              barSize={16}
            />
            <Line yAxisId="right" type="monotone" dataKey="protein" name="Protein" stroke="#4CC9F0" strokeWidth={2} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="carbs" name="Carbs" stroke="#F72585" strokeWidth={2} dot={false} />
            <Line yAxisId="right" type="monotone" dataKey="fats" name="Fats" stroke="#F4A261" strokeWidth={2} dot={false} />
          </ComposedChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}