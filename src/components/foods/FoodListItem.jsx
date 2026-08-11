import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Pencil, Trash2, ArrowLeftRight } from "lucide-react";
import EditFoodDialog from "@/components/foods/EditFoodDialog";
import { toggleUnit, convertAmount } from "@/lib/unitConversion";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function FoodListItem({ food, onUpdated, onDeleted, onDeleteFailed }) {
  const [amount, setAmount] = useState(food.serving_amount);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setDeleteOpen(false);
    onDeleted?.(food.id);
    try {
      await base44.entities.Food.delete(food.id);
    } catch (error) {
      onDeleteFailed?.(food);
      toast({ title: "Failed to delete", description: "Please try again.", variant: "destructive" });
    }
  };

  // Per-unit ratios based on the food's current stored values
  const perUnit = {
    calories: food.calories / food.serving_amount,
    protein: food.protein / food.serving_amount,
    carbs: food.carbs / food.serving_amount,
    fats: food.fats / food.serving_amount,
  };

  const amountNum = parseFloat(amount) || 0;
  const calories = perUnit.calories * amountNum;
  const protein = perUnit.protein * amountNum;
  const carbs = perUnit.carbs * amountNum;
  const fats = perUnit.fats * amountNum;

  const handleBlur = async () => {
    if (amountNum <= 0 || amountNum === food.serving_amount) return;
    const previous = {
      serving_amount: food.serving_amount,
      calories: food.calories,
      protein: food.protein,
      carbs: food.carbs,
      fats: food.fats,
    };
    const updated = {
      serving_amount: amountNum,
      calories,
      protein,
      carbs,
      fats,
    };
    onUpdated(food.id, updated);
    try {
      await base44.entities.Food.update(food.id, updated);
    } catch (error) {
      setAmount(previous.serving_amount);
      onUpdated(food.id, previous);
      toast({ title: "Failed to update", description: "Please try again.", variant: "destructive" });
    }
  };

  const handleToggleUnit = async () => {
    const newUnit = toggleUnit(food.serving_unit);
    const newServingAmount = convertAmount(food.serving_amount, food.serving_unit, newUnit);
    const newAmount = convertAmount(amountNum, food.serving_unit, newUnit);
    const previousAmount = amount;
    const previous = { serving_unit: food.serving_unit, serving_amount: food.serving_amount };
    const updated = { serving_unit: newUnit, serving_amount: newServingAmount };
    setAmount(newAmount);
    onUpdated(food.id, updated);
    try {
      await base44.entities.Food.update(food.id, updated);
    } catch (error) {
      setAmount(previousAmount);
      onUpdated(food.id, previous);
      toast({ title: "Failed to update", description: "Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="bg-[#16213E] rounded-2xl p-3 flex items-center justify-between">
      <div className="min-w-0 flex-1">
        <p className="text-white font-bold text-sm truncate">{food.name}</p>
        <div className="flex items-center gap-1 text-white/40 text-xs mt-1">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onBlur={handleBlur}
            className="w-14 bg-[#0F1830] text-white rounded-md px-1.5 py-0.5 text-xs border border-white/10 focus:outline-none focus:border-[#06D6A0]"
          />
          <button
            type="button"
            onClick={handleToggleUnit}
            title={`Switch to ${toggleUnit(food.serving_unit)}`}
            className="inline-flex items-center gap-0.5 shrink-0 hover:text-white"
          >
            {food.serving_unit} <ArrowLeftRight className="w-2.5 h-2.5" />
          </button>
          <span className="truncate">· {Math.round(calories)} kcal · P{Math.round(protein)} C{Math.round(carbs)} F{Math.round(fats)}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => setEditOpen(true)}
          className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white hover:bg-white/10"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button
          onClick={() => setDeleteOpen(true)}
          className="w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-red-400 hover:bg-white/10"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <EditFoodDialog
        food={food}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSaved={(id, updated) => {
          setAmount(updated.serving_amount);
          onUpdated(id, updated);
        }}
      />
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="bg-[#16213E] border-white/10 text-white rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete {food.name}?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/60">
              This will permanently remove this food from your list. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-white/10 text-white hover:bg-white/10 hover:text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 text-white hover:bg-red-500/80"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}