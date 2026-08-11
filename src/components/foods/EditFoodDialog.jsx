import React, { useState, useEffect } from "react";
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
import { Loader2, ArrowLeftRight } from "lucide-react";
import { toggleUnit, convertAmount } from "@/lib/unitConversion";

export default function EditFoodDialog({ food, open, onOpenChange, onSaved }) {
  const [form, setForm] = useState(food);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(food);
  }, [open, food]);

  const handleChange = (field, value) => {
    const isNumber = ["serving_amount", "calories", "protein", "carbs", "fats"].includes(field);
    setForm({ ...form, [field]: isNumber ? Number(value) : value });
  };

  const handleToggleUnit = () => {
    const newUnit = toggleUnit(form.serving_unit);
    const newAmount = convertAmount(form.serving_amount, form.serving_unit, newUnit);
    setForm({ ...form, serving_unit: newUnit, serving_amount: newAmount });
  };

  const save = async () => {
    if (!form?.name?.trim()) return;
    setSaving(true);
    try {
      await base44.entities.Food.update(food.id, form);
      onOpenChange(false);
      onSaved?.(food.id, form);
    } finally {
      setSaving(false);
    }
  };

  if (!form) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#16213E] border-white/10 text-white max-w-sm rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-white font-extrabold">Edit Food</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label className="text-white/60 text-xs">Name</Label>
            <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} className="bg-[#1A1A2E] border-white/10 text-white" />
          </div>
          <div>
            <Label className="text-white/60 text-xs">Brand</Label>
            <Input value={form.brand || ""} onChange={(e) => handleChange("brand", e.target.value)} className="bg-[#1A1A2E] border-white/10 text-white" />
          </div>
          <div className="grid grid-cols-2 gap-3 min-w-0">
            <div className="min-w-0">
              <Label className="text-white/60 text-xs">Serving Amount</Label>
              <Input type="number" value={form.serving_amount} onChange={(e) => handleChange("serving_amount", e.target.value)} className="bg-[#1A1A2E] border-white/10 text-white" />
            </div>
            <div className="min-w-0">
              <Label className="text-white/60 text-xs">Unit</Label>
              <div className="flex items-center gap-1">
                <Input value={form.serving_unit} onChange={(e) => handleChange("serving_unit", e.target.value)} className="bg-[#1A1A2E] border-white/10 text-white min-w-0" />
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-white/60 text-xs">Calories</Label>
              <Input type="number" value={form.calories} onChange={(e) => handleChange("calories", e.target.value)} className="bg-[#1A1A2E] border-white/10 text-white" />
            </div>
            <div>
              <Label className="text-white/60 text-xs">Protein (g)</Label>
              <Input type="number" value={form.protein} onChange={(e) => handleChange("protein", e.target.value)} className="bg-[#1A1A2E] border-white/10 text-white" />
            </div>
            <div>
              <Label className="text-white/60 text-xs">Carbs (g)</Label>
              <Input type="number" value={form.carbs} onChange={(e) => handleChange("carbs", e.target.value)} className="bg-[#1A1A2E] border-white/10 text-white" />
            </div>
            <div>
              <Label className="text-white/60 text-xs">Fats (g)</Label>
              <Input type="number" value={form.fats} onChange={(e) => handleChange("fats", e.target.value)} className="bg-[#1A1A2E] border-white/10 text-white" />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="flex-1 text-white/60">Cancel</Button>
            <Button onClick={save} disabled={saving} className="flex-1 bg-[#06D6A0] text-[#1A1A2E] font-bold hover:bg-[#06D6A0]/80">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}