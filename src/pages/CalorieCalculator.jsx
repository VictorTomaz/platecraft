import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ResponsiveSelect from "@/components/ui/responsive-select";
import { ACTIVITY_LEVELS } from "@/lib/mealSlots";
import { Loader2, Check } from "lucide-react";
import MacroSplitSliders from "@/components/meals/MacroSplitSliders";

const GOALS = [
  { id: "gain_weight", label: "Gain Weight", offset: 250, split: { p: 0.3, c: 0.45, f: 0.25 }, color: "#118AB2" },
  { id: "maintain", label: "Maintain Weight", offset: 0, split: { p: 0.3, c: 0.4, f: 0.3 }, color: "#FFD166" },
  { id: "mild_loss", label: "Mild Weight Loss", offset: -250, split: { p: 0.35, c: 0.35, f: 0.3 }, color: "#06D6A0" },
  { id: "moderate_loss", label: "Moderate Weight Loss", offset: -500, split: { p: 0.35, c: 0.35, f: 0.3 }, color: "#FFA630" },
  { id: "extreme_loss", label: "Extreme Weight Loss", offset: -1000, split: { p: 0.4, c: 0.3, f: 0.3 }, color: "#EF476F" },
];

export default function CalorieCalculator() {
  const [form, setForm] = useState({ age: "", gender: "male", height_ft: "", height_in: "", weight_lb: "", activity_level: "moderate" });
  const [result, setResult] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState("maintain");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const goals = await base44.entities.CalorieGoal.filter({ is_active: true }, "-created_date", 1);
      if (goals[0]) {
        const g = goals[0];
        const totalInches = Math.round(g.height_cm / 2.54);
        setForm({ age: g.age, gender: g.gender, height_ft: Math.floor(totalInches / 12), height_in: totalInches % 12, weight_lb: Math.round(g.weight_kg * 2.20462), activity_level: g.activity_level });
        setSelectedGoal(g.goal_type);
      }
    })();
  }, []);

  const calculate = (e) => {
    e.preventDefault();
    const { age, gender, height_ft, height_in, weight_lb, activity_level } = form;
    const a = Number(age), h = (Number(height_ft) * 12 + Number(height_in || 0)) * 2.54, w = Number(weight_lb) / 2.20462;
    const bmr = gender === "male" ? 10 * w + 6.25 * h - 5 * a + 5 : 10 * w + 6.25 * h - 5 * a - 161;
    const multiplier = ACTIVITY_LEVELS.find((l) => l.id === activity_level)?.multiplier || 1.2;
    const tdee = bmr * multiplier;
    const targets = GOALS.map((g) => {
      const calories = Math.round(tdee + g.offset);
      return {
        ...g,
        calories,
        protein: Math.round((calories * g.split.p) / 4),
        carbs: Math.round((calories * g.split.c) / 4),
        fats: Math.round((calories * g.split.f) / 9),
      };
    });
    setResult({ bmr: Math.round(bmr), tdee: Math.round(tdee), targets });
    setSaved(false);
  };

  const saveGoal = async () => {
    if (!result) return;
    const target = result.targets.find((t) => t.id === selectedGoal);
    setSaving(true);
    const existing = await base44.entities.CalorieGoal.filter({ is_active: true });
    if (existing.length > 0) {
      await Promise.all(existing.map((g) => base44.entities.CalorieGoal.update(g.id, { is_active: false })));
    }
    await base44.entities.CalorieGoal.create({
      age: Number(form.age),
      gender: form.gender,
      height_cm: (Number(form.height_ft) * 12 + Number(form.height_in || 0)) * 2.54,
      weight_kg: Number(form.weight_lb) / 2.20462,
      activity_level: form.activity_level,
      bmr: result.bmr,
      tdee: result.tdee,
      goal_type: selectedGoal,
      daily_calorie_target: target.calories,
      protein_target: target.protein,
      carbs_target: target.carbs,
      fats_target: target.fats,
      is_active: true,
    });
    setSaving(false);
    setSaved(true);
  };

  return (
    <div className="px-5 pt-8 pb-4">
      <h1 className="text-white text-2xl font-extrabold tracking-tight mb-5">Calorie Calculator</h1>

      <form onSubmit={calculate} className="bg-[#16213E] rounded-3xl p-4 space-y-3 mb-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-white/60 text-xs">Age</Label>
            <Input type="number" required value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="bg-[#1A1A2E] border-white/10 text-white" />
          </div>
          <div>
            <Label className="text-white/60 text-xs">Gender</Label>
            <ResponsiveSelect
              value={form.gender}
              onValueChange={(v) => setForm({ ...form, gender: v })}
              options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]}
              label="Gender"
            />
          </div>
          <div>
            <Label className="text-white/60 text-xs">Height (ft'in)</Label>
            <div className="flex gap-2">
              <Input type="number" required placeholder="ft" value={form.height_ft} onChange={(e) => setForm({ ...form, height_ft: e.target.value })} className="bg-[#1A1A2E] border-white/10 text-white" />
              <Input type="number" placeholder="in" value={form.height_in} onChange={(e) => setForm({ ...form, height_in: e.target.value })} className="bg-[#1A1A2E] border-white/10 text-white" />
            </div>
          </div>
          <div>
            <Label className="text-white/60 text-xs">Weight (lb)</Label>
            <Input type="number" required value={form.weight_lb} onChange={(e) => setForm({ ...form, weight_lb: e.target.value })} className="bg-[#1A1A2E] border-white/10 text-white" />
          </div>
        </div>
        <div>
          <Label className="text-white/60 text-xs">Activity Level</Label>
          <ResponsiveSelect
            value={form.activity_level}
            onValueChange={(v) => setForm({ ...form, activity_level: v })}
            options={ACTIVITY_LEVELS.map((l) => ({ value: l.id, label: l.label }))}
            label="Activity Level"
          />
        </div>
        <Button type="submit" className="w-full bg-[#06D6A0] text-[#1A1A2E] font-extrabold hover:bg-[#06D6A0]/80">
          Calculate
        </Button>
      </form>

      <MacroSplitSliders calories={result?.targets.find((t) => t.id === selectedGoal)?.calories} />

      {result && (
        <>
          <div className="flex gap-3 mb-5">
            <div className="flex-1 bg-[#16213E] rounded-2xl p-3 text-center">
              <p className="text-white/40 text-xs font-semibold">BMR</p>
              <p className="text-white font-extrabold text-lg">{result.bmr}</p>
            </div>
            <div className="flex-1 bg-[#16213E] rounded-2xl p-3 text-center">
              <p className="text-white/40 text-xs font-semibold">TDEE</p>
              <p className="text-white font-extrabold text-lg">{result.tdee}</p>
            </div>
          </div>

          <div className="space-y-3 mb-5">
            {result.targets.map((t) => (
              <button
                key={t.id}
                onClick={() => { setSelectedGoal(t.id); setSaved(false); }}
                className="w-full text-left rounded-3xl p-4 border-2 transition-colors"
                style={{
                  borderColor: selectedGoal === t.id ? t.color : "rgba(255,255,255,0.1)",
                  backgroundColor: "#16213E",
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-extrabold">{t.label}</span>
                  <span className="font-extrabold" style={{ color: t.color }}>{t.calories} kcal</span>
                </div>
                <div className="flex gap-2">
                  <span className="rounded-full bg-blue-500/20 text-blue-300 font-bold px-2 py-0.5 text-[11px]">P {t.protein}g</span>
                  <span className="rounded-full bg-orange-500/20 text-orange-300 font-bold px-2 py-0.5 text-[11px]">C {t.carbs}g</span>
                  <span className="rounded-full bg-green-500/20 text-green-300 font-bold px-2 py-0.5 text-[11px]">F {t.fats}g</span>
                </div>
              </button>
            ))}
          </div>

          <Button onClick={saveGoal} disabled={saving} className="w-full bg-white text-[#1A1A2E] font-extrabold hover:bg-white/90">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <><Check className="w-4 h-4 mr-1" /> Saved as Daily Goal</> : "Save as Daily Goal"}
          </Button>
        </>
      )}
    </div>
  );
}