import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export default function BarcodeResultForm({ form, setForm, onBack, onSave, saving }) {
  return (
    <div className="space-y-3">
      <div>
        <Label className="text-white/60 text-xs">Name</Label>
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-[#16213E] border-white/10 text-white" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-white/60 text-xs">Serving Amount</Label>
          <Input type="number" value={form.serving_amount} onChange={(e) => setForm({ ...form, serving_amount: Number(e.target.value) })} className="bg-[#16213E] border-white/10 text-white" />
        </div>
        <div>
          <Label className="text-white/60 text-xs">Unit</Label>
          <Input value={form.serving_unit} onChange={(e) => setForm({ ...form, serving_unit: e.target.value })} className="bg-[#16213E] border-white/10 text-white" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-white/60 text-xs">Calories</Label>
          <Input type="number" value={form.calories} onChange={(e) => setForm({ ...form, calories: Number(e.target.value) })} className="bg-[#16213E] border-white/10 text-white" />
        </div>
        <div>
          <Label className="text-white/60 text-xs">Protein (g)</Label>
          <Input type="number" value={form.protein} onChange={(e) => setForm({ ...form, protein: Number(e.target.value) })} className="bg-[#16213E] border-white/10 text-white" />
        </div>
        <div>
          <Label className="text-white/60 text-xs">Carbs (g)</Label>
          <Input type="number" value={form.carbs} onChange={(e) => setForm({ ...form, carbs: Number(e.target.value) })} className="bg-[#16213E] border-white/10 text-white" />
        </div>
        <div>
          <Label className="text-white/60 text-xs">Fats (g)</Label>
          <Input type="number" value={form.fats} onChange={(e) => setForm({ ...form, fats: Number(e.target.value) })} className="bg-[#16213E] border-white/10 text-white" />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <Button variant="ghost" onClick={onBack} className="flex-1 text-white/60">Back</Button>
        <Button onClick={onSave} disabled={saving} className="flex-1 bg-[#06D6A0] text-[#1A1A2E] font-bold hover:bg-[#06D6A0]/80">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Food"}
        </Button>
      </div>
    </div>
  );
}