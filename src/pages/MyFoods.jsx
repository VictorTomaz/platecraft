import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Plus, Apple, ScanBarcode, Search, Loader2 } from "lucide-react";
import AddFoodDialog from "@/components/foods/AddFoodDialog";
import FoodListItem from "@/components/foods/FoodListItem";
import { Input } from "@/components/ui/input";
import usePullToRefresh from "@/hooks/usePullToRefresh";
import usePersistentState from "@/hooks/usePersistentState";

export default function MyFoods() {
  const navigate = useNavigate();
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeCategory, setActiveCategory] = usePersistentState("myfoods-category", "protein");
  const [search, setSearch] = usePersistentState("myfoods-search", "");

  const load = async () => {
    const data = await base44.entities.Food.list("-created_date");
    setFoods(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const { handlers, pullDistance, refreshing } = usePullToRefresh(load);

  const getMacroCategory = (food) => {
    const max = Math.max(food.protein || 0, food.carbs || 0, food.fats || 0);
    if (max === (food.protein || 0)) return "protein";
    if (max === (food.carbs || 0)) return "carbs";
    return "fats";
  };

  const categories = [
    { key: "protein", label: "Protein", color: "#FF6B6B" },
    { key: "carbs", label: "Carbs", color: "#FFD166" },
    { key: "fats", label: "Fats", color: "#4ECDC4" },
  ];

  const filteredFoods = foods
    .filter((f) => getMacroCategory(f) === activeCategory)
    .filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white text-2xl font-extrabold tracking-tight">My Foods</h1>
        <div className="flex gap-2">
          <Button onClick={() => navigate("/scan-barcode")} variant="outline" className="border-white/10 bg-card text-white font-bold rounded-full h-10 px-3 hover:bg-card/60">
            <ScanBarcode className="w-4 h-4" />
          </Button>
          <Button onClick={() => setDialogOpen(true)} className="bg-[#06D6A0] text-[#1A1A2E] font-bold rounded-full h-10 px-4 hover:bg-[#06D6A0]/80">
            <Plus className="w-4 h-4 mr-1" /> Add Food
          </Button>
        </div>
      </div>

      {!loading && foods.length > 0 && (
        <div className="relative mb-4">
          <Search className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search foods..."
            className="bg-card border-white/10 text-white pl-9"
          />
        </div>
      )}

      {!loading && foods.length > 0 && (
        <div className="flex gap-2 mb-4">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className="flex-1 rounded-xl py-2 text-xs font-bold uppercase transition-colors"
              style={
                activeCategory === cat.key
                  ? { backgroundColor: cat.color, color: "#1A1A2E" }
                  : { backgroundColor: "#16213E", color: "rgba(255,255,255,0.5)" }
              }
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="text-white/40 text-sm">Loading...</p>
      ) : foods.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 gap-3">
          <Apple className="w-10 h-10 text-white/20" />
          <p className="text-white/40 text-sm">No foods yet. Add your first one!</p>
        </div>
      ) : filteredFoods.length === 0 ? (
        <p className="text-white/30 text-sm text-center py-16">No foods in this category</p>
      ) : (
        <div className="space-y-2">
          {filteredFoods.map((f) => (
            <FoodListItem
              key={f.id}
              food={f}
              onUpdated={(id, updated) =>
                setFoods((prev) => prev.map((food) => (food.id === id ? { ...food, ...updated } : food)))
              }
              onDeleted={(id) => setFoods((prev) => prev.filter((food) => food.id !== id))}
              onDeleteFailed={(food) => setFoods((prev) => [food, ...prev])}
            />
          ))}
        </div>
      )}

      <AddFoodDialog open={dialogOpen} onOpenChange={setDialogOpen} onSaved={load} />
    </div>
  );
}