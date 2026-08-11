import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { getSlot } from "@/lib/mealSlots";
import { convertAmount } from "@/lib/unitConversion";
import MacroPills from "@/components/meals/MacroPills";
import FoodLibraryCard from "@/components/foods/FoodLibraryCard";
import PlateItemCard from "@/components/foods/PlateItemCard";

export default function MealBuilder() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const params = new URLSearchParams(window.location.search);
  const slotId = params.get("slot") || "breakfast";
  const date = params.get("date") || new Date().toISOString().slice(0, 10);
  const slot = getSlot(slotId);

  const [foods, setFoods] = useState([]);
  const [plate, setPlate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("protein");

  useEffect(() => {
    (async () => {
      const [foodList, entries] = await Promise.all([
        base44.entities.Food.list("-created_date"),
        base44.entities.MealEntry.filter({ date, meal_slot: slotId }),
      ]);
      setFoods(foodList);
      setPlate(
        entries.map((e) => ({
          key: e.id,
          food_name: e.food_name,
          serving_amount: e.serving_amount,
          serving_unit: e.serving_unit,
          base_calories: e.base_calories,
          base_protein: e.base_protein,
          base_carbs: e.base_carbs,
          base_fats: e.base_fats,
          multiplier: e.multiplier || 1,
        }))
      );
      setLoading(false);
    })();
  }, [date, slotId]);

  const getMacroCategory = (food) => {
    const max = Math.max(food.protein || 0, food.carbs || 0, food.fats || 0);
    if (max === (food.protein || 0)) return "protein";
    if (max === (food.carbs || 0)) return "carbs";
    return "fats";
  };

  const categories = [
    { key: "protein", label: "Protein", color: "#FF6B6B", foods: foods.filter((f) => getMacroCategory(f) === "protein") },
    { key: "carbs", label: "Carbs", color: "#FFD166", foods: foods.filter((f) => getMacroCategory(f) === "carbs") },
    { key: "fats", label: "Fats", color: "#4ECDC4", foods: foods.filter((f) => getMacroCategory(f) === "fats") },
  ];

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === "plate" && source.droppableId.startsWith("library-")) {
      const food = foods.find((f) => f.id === draggableId);
      if (!food) return;
      setPlate((prev) => [
        ...prev,
        {
          key: `${food.id}-${Date.now()}`,
          food_name: food.name,
          serving_amount: food.serving_amount,
          serving_unit: food.serving_unit,
          base_calories: food.calories,
          base_protein: food.protein,
          base_carbs: food.carbs,
          base_fats: food.fats,
          multiplier: 1,
        },
      ]);
    }
  };

  const updateMultiplier = (key, value) => {
    setPlate((prev) => prev.map((p) => (p.key === key ? { ...p, multiplier: value } : p)));
  };

  const updateUnit = (key, newUnit) => {
    setPlate((prev) =>
      prev.map((p) =>
        p.key === key
          ? { ...p, serving_unit: newUnit, serving_amount: convertAmount(p.serving_amount, p.serving_unit, newUnit) }
          : p
      )
    );
  };

  const removeItem = (key) => setPlate((prev) => prev.filter((p) => p.key !== key));

  const totals = plate.reduce(
    (acc, p) => ({
      calories: acc.calories + p.base_calories * p.multiplier,
      protein: acc.protein + p.base_protein * p.multiplier,
      carbs: acc.carbs + p.base_carbs * p.multiplier,
      fats: acc.fats + p.base_fats * p.multiplier,
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const save = () => {
    navigate("/");
    toast({ title: "Meal saved", description: `${slot.label} updated` });
    (async () => {
      const existing = await base44.entities.MealEntry.filter({ date, meal_slot: slotId });
      if (existing.length > 0) {
        await Promise.all(existing.map((e) => base44.entities.MealEntry.delete(e.id)));
      }
      if (plate.length > 0) {
        await base44.entities.MealEntry.bulkCreate(
          plate.map((p) => ({
            date,
            meal_slot: slotId,
            food_name: p.food_name,
            serving_amount: p.serving_amount,
            serving_unit: p.serving_unit,
            base_calories: p.base_calories,
            base_protein: p.base_protein,
            base_carbs: p.base_carbs,
            base_fats: p.base_fats,
            multiplier: p.multiplier,
            calories: p.base_calories * p.multiplier,
            protein: p.base_protein * p.multiplier,
            carbs: p.base_carbs * p.multiplier,
            fats: p.base_fats * p.multiplier,
          }))
        );
      }
    })();
  };

  if (loading) return <div className="p-6 text-white/40 text-sm">Loading...</div>;

  return (
    <div className="px-5 pt-6 pb-4">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full bg-[#16213E] text-white">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-white text-xl font-extrabold flex items-center gap-1.5">
            <span>{slot.emoji}</span> {slot.label}
          </h1>
        </div>
      </div>

      <div className="bg-[#16213E] rounded-3xl p-4 mb-4">
        <p className="text-white font-extrabold text-2xl mb-2">{Math.round(totals.calories)} kcal</p>
        <MacroPills protein={totals.protein} carbs={totals.carbs} fats={totals.fats} />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex items-center gap-2 mb-2">
          <img
            src="https://media.base44.com/images/public/6a45765641e1152e86a5def3/4c801eb6e_PlateCraftlogo1.png"
            alt="PlateCraft"
            className="w-5 h-5 object-contain"
          />
          <p className="text-white/50 text-xs font-bold uppercase tracking-wider">Your Plate</p>
        </div>
        <Droppable droppableId="plate">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`relative rounded-[2rem] p-4 mb-6 min-h-[120px] space-y-2 transition-all duration-300 overflow-hidden ${
                snapshot.isDraggingOver ? "bg-[#8BC34A]/15 scale-[1.02]" : "bg-[radial-gradient(circle_at_50%_35%,#22314D_0%,#16213E_75%)]"
              }`}
              style={{
                border: "3px solid transparent",
                backgroundImage: snapshot.isDraggingOver
                  ? undefined
                  : "linear-gradient(#16213E, #16213E), conic-gradient(from 180deg, #8BC34A 0deg 120deg, #FFD166 120deg 240deg, #2C3E50 240deg 360deg)",
                backgroundOrigin: "border-box",
                backgroundClip: "padding-box, border-box",
              }}
            >
              {plate.length === 0 && (
                <div className="relative flex flex-col items-center justify-center py-6 gap-1 min-h-[280px]">
                  <img
                    src="https://media.base44.com/images/public/6a45765641e1152e86a5def3/09fc7768c_PlateCraftsmalllogo.png"
                    alt="PlateCraft"
                    className="absolute inset-0 w-full h-full object-contain"
                  />
                  <motion.p
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative text-white/40 text-sm text-center font-semibold bg-[#16213E]/70 px-3 py-1 rounded-full"
                  >
                    Drag foods here to build your plate
                  </motion.p>
                </div>
              )}
              <AnimatePresence>
                {plate.map((item) => (
                  <motion.div
                    key={item.key}
                    layout
                    initial={{ opacity: 0, y: 16, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  >
                    <PlateItemCard
                      item={item}
                      onMultiplierChange={(v) => updateMultiplier(item.key, v)}
                      onUnitChange={(u) => updateUnit(item.key, u)}
                      onRemove={() => removeItem(item.key)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <p className="text-white/50 text-xs font-bold uppercase tracking-wider mb-2">Your Foods</p>
        {foods.length === 0 && (
          <p className="text-white/30 text-sm text-center py-6">Add foods from the My Foods page first</p>
        )}
        <div className="flex gap-2 mb-3">
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
        {categories.map((cat) => (
          <Droppable key={cat.key} droppableId={`library-${cat.key}`} isDropDisabled>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`space-y-2 ${activeCategory === cat.key ? "" : "hidden"}`}
              >
                {cat.foods.length === 0 && (
                  <p className="text-white/30 text-sm text-center py-6">No foods in this category</p>
                )}
                {cat.foods.map((food, index) => (
                  <Draggable key={food.id} draggableId={food.id} index={index}>
                    {(dragProvided, snapshot) => (
                      <FoodLibraryCard food={food} provided={dragProvided} isDragging={snapshot.isDragging} />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>

      <button
        onClick={save}
        className="w-full mt-6 rounded-2xl py-3.5 font-extrabold text-[#1A1A2E] flex items-center justify-center gap-2"
        style={{ backgroundColor: slot.color }}
      >
        Save Meal
      </button>
    </div>
  );
}