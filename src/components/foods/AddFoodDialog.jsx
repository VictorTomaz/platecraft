import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Search, Loader2, ArrowLeftRight } from "lucide-react";
import { toggleUnit, convertAmount } from "@/lib/unitConversion";

const emptyForm = { name: "", brand: "", serving_amount: 1, serving_unit: "oz", calories: 0, protein: 0, carbs: 0, fats: 0 };

export default function AddFoodDialog({ open, onOpenChange, onSaved }) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [form, setForm] = useState(null);
  const [base, setBase] = useState(null);
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setQuery(""); setResults([]); setSearched(false); setHasMore(false); setPage(0); setForm(null); setBase(null);
  };

  const handleAmountChange = (value) => {
    const newAmount = Number(value);
    if (base && base.amount > 0 && newAmount > 0) {
      const ratio = newAmount / base.amount;
      setForm({
        ...form,
        serving_amount: newAmount,
        calories: Math.round(base.calories * ratio),
        protein: Math.round(base.protein * ratio),
        carbs: Math.round(base.carbs * ratio),
        fats: Math.round(base.fats * ratio),
      });
    } else {
      setForm({ ...form, serving_amount: newAmount });
    }
  };

  const handleMacroChange = (field, value) => {
    const num = Number(value);
    const updatedForm = { ...form, [field]: num };
    setForm(updatedForm);
    setBase({
      amount: updatedForm.serving_amount,
      calories: updatedForm.calories,
      protein: updatedForm.protein,
      carbs: updatedForm.carbs,
      fats: updatedForm.fats,
    });
  };

  const handleSearch = async (e) => {
    e?.preventDefault?.();
    if (!query.trim()) return;
    setSearching(true);
    setPage(0);
    const data = await base44.functions.invoke("searchEdamamFoods", { query, page: 0 })
      .then((res) => res.data)
      .catch(() => ({ foods: [], hasMore: false }));
    setResults(data.foods || []);
    setHasMore(!!data.hasMore);
    setSearching(false);
    setSearched(true);
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setLoadingMore(true);
    const data = await base44.functions.invoke("searchEdamamFoods", { query, page: nextPage })
      .then((res) => res.data)
      .catch(() => ({ foods: [], hasMore: false }));
    setResults((prev) => [...prev, ...(data.foods || [])]);
    setHasMore(!!data.hasMore);
    setPage(nextPage);
    setLoadingMore(false);
  };

  const pickResult = (p) => {
    setForm({
      name: p.name || query,
      brand: p.brand || "",
      serving_amount: p.serving_amount || 100,
      serving_unit: p.serving_unit || "g",
      calories: p.calories || 0,
      protein: p.protein || 0,
      carbs: p.carbs || 0,
      fats: p.fats || 0,
    });
    setBase({
      amount: p.serving_amount || 100,
      calories: p.calories || 0,
      protein: p.protein || 0,
      carbs: p.carbs || 0,
      fats: p.fats || 0,
    });
  };

  const handleToggleUnit = () => {
    const newUnit = toggleUnit(form.serving_unit);
    const newAmount = convertAmount(form.serving_amount, form.serving_unit, newUnit);
    setForm({ ...form, serving_unit: newUnit, serving_amount: newAmount });
    if (base) setBase({ ...base, amount: convertAmount(base.amount, form.serving_unit, newUnit) });
  };

  const startManual = () => {
    setForm({ ...emptyForm, name: query });
    setBase({ amount: emptyForm.serving_amount, calories: 0, protein: 0, carbs: 0, fats: 0 });
  };

  const save = async () => {
    if (!form?.name?.trim()) return;
    setSaving(true);
    try {
      await base44.entities.Food.create(form);
      reset();
      onOpenChange(false);
      onSaved?.();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) reset(); }}>
      <DialogContent className="bg-[#16213E] border-white/10 text-white max-w-sm w-[calc(100%-2rem)] rounded-3xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-white font-extrabold">Add Food</DialogTitle>
        </DialogHeader>

        {!form && (
          <div className="space-y-3 min-w-0">
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search a food..."
                className="bg-[#1A1A2E] border-white/10 text-white"
              />
              <Button type="submit" disabled={searching} className="bg-[#06D6A0] text-[#1A1A2E] hover:bg-[#06D6A0]/80 shrink-0">
                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </form>
            <div className="max-h-[55vh] min-h-[12rem] overflow-y-auto scroll-y space-y-2 pr-1">
              {results.map((p, i) => (
                <button
                  key={i}
                  onClick={() => pickResult(p)}
                  className="w-full min-w-0 text-left bg-[#1A1A2E] rounded-2xl p-3 hover:bg-[#1A1A2E]/60 overflow-hidden"
                >
                  <p className="font-bold text-sm truncate min-w-0">{p.name || "Unnamed"}</p>
                  <p className="text-white/40 text-xs truncate min-w-0">
                    {p.brand ? `${p.brand} · ` : ""}{p.calories} kcal / {p.serving_amount || 100}{p.serving_unit || "g"}
                    {p.source === "fdc" ? " · USDA" : p.source === "off" ? " · Open Food Facts" : ""}
                  </p>
                </button>
              ))}
              {searched && results.length === 0 && !searching && (
                <p className="text-white/40 text-sm text-center py-2">No results found.</p>
              )}
              {hasMore && results.length > 0 && (
                <Button
                  variant="ghost"
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="w-full text-white/60 hover:text-white"
                >
                  {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : "Load more"}
                </Button>
              )}
            </div>
            <Button variant="ghost" onClick={startManual} className="w-full text-white/60 hover:text-white">
              Enter food manually instead
            </Button>
          </div>
        )}

        {form && (
          <div className="space-y-3 min-w-0">
            <div>
              <Label className="text-white/60 text-xs">Name</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-[#1A1A2E] border-white/10 text-white" />
            </div>
            <div className="grid grid-cols-2 gap-3 min-w-0">
              <div className="min-w-0">
                <Label className="text-white/60 text-xs">Serving Amount</Label>
                <Input type="number" value={form.serving_amount} onChange={(e) => handleAmountChange(e.target.value)} className="bg-[#1A1A2E] border-white/10 text-white" />
              </div>
              <div className="min-w-0">
                <Label className="text-white/60 text-xs">Unit</Label>
                <div className="flex items-center gap-1">
                  <Input value={form.serving_unit} onChange={(e) => setForm({ ...form, serving_unit: e.target.value })} className="bg-[#1A1A2E] border-white/10 text-white min-w-0" />
                  <button
                    type="button"
                    onClick={handleToggleUnit}
                    title={`Switch to ${toggleUnit(form.serving_unit)}`}
                    className="shrink-0 w-9 h-9 flex items-center justify-center rounded-md bg-[#1A1A2E] border border-white/10 text-white/60 hover:text-white"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 min-w-0">
              <div className="min-w-0">
                <Label className="text-white/60 text-xs">Calories</Label>
                <Input type="number" value={form.calories} onChange={(e) => handleMacroChange("calories", e.target.value)} className="bg-[#1A1A2E] border-white/10 text-white" />
              </div>
              <div className="min-w-0">
                <Label className="text-white/60 text-xs">Protein (g)</Label>
                <Input type="number" value={form.protein} onChange={(e) => handleMacroChange("protein", e.target.value)} className="bg-[#1A1A2E] border-white/10 text-white" />
              </div>
              <div className="min-w-0">
                <Label className="text-white/60 text-xs">Carbs (g)</Label>
                <Input type="number" value={form.carbs} onChange={(e) => handleMacroChange("carbs", e.target.value)} className="bg-[#1A1A2E] border-white/10 text-white" />
              </div>
              <div className="min-w-0">
                <Label className="text-white/60 text-xs">Fats (g)</Label>
                <Input type="number" value={form.fats} onChange={(e) => handleMacroChange("fats", e.target.value)} className="bg-[#1A1A2E] border-white/10 text-white" />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button variant="ghost" onClick={() => setForm(null)} className="flex-1 text-white/60">Back</Button>
              <Button onClick={save} disabled={saving} className="flex-1 bg-[#06D6A0] text-[#1A1A2E] font-bold hover:bg-[#06D6A0]/80">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Food"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}