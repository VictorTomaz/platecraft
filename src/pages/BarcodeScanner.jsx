import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ScanBarcode } from "lucide-react";
import BarcodeResultForm from "@/components/foods/BarcodeResultForm";

export default function BarcodeScanner({ active = true }) {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);

  const [supported, setSupported] = useState(true);
  const [cameraError, setCameraError] = useState("");
  const [looking, setLooking] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);

  const stopCamera = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const lookupBarcode = async (code) => {
    stopCamera();
    setLooking(true);
    try {
      const res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
      const data = await res.json();
      if (data.status === 1) {
        const p = data.product;
        const n = p.nutriments || {};
        setForm({
          name: p.product_name || `Item ${code}`,
          brand: p.brands || "",
          serving_amount: 100,
          serving_unit: "g",
          calories: Math.round(n["energy-kcal_100g"] || 0),
          protein: Math.round(n["proteins_100g"] || 0),
          carbs: Math.round(n["carbohydrates_100g"] || 0),
          fats: Math.round(n["fat_100g"] || 0),
        });
      } else {
        setForm({ name: `Item ${code}`, brand: "", serving_amount: 100, serving_unit: "g", calories: 0, protein: 0, carbs: 0, fats: 0 });
      }
    } catch {
      setForm({ name: `Item ${code}`, brand: "", serving_amount: 100, serving_unit: "g", calories: 0, protein: 0, carbs: 0, fats: 0 });
    } finally {
      setLooking(false);
    }
  };

  useEffect(() => {
    if (!("BarcodeDetector" in window)) {
      setSupported(false);
      return;
    }
    if (!active || form) {
      stopCamera();
      return;
    }

    let cancelled = false;
    const detector = new window.BarcodeDetector({ formats: ["ean_13", "ean_8", "upc_a", "upc_e"] });

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        const scan = async () => {
          if (!videoRef.current || videoRef.current.readyState < 2) {
            rafRef.current = requestAnimationFrame(scan);
            return;
          }
          try {
            const codes = await detector.detect(videoRef.current);
            if (codes.length > 0) {
              lookupBarcode(codes[0].rawValue);
              return;
            }
          } catch {
            // ignore detection frame errors
          }
          rafRef.current = requestAnimationFrame(scan);
        };
        rafRef.current = requestAnimationFrame(scan);
      } catch {
        setCameraError("Camera access denied. You can still enter a barcode manually below.");
      }
    };

    start();
    return () => {
      cancelled = true;
      stopCamera();
    };
  }, [active, form]);

  const save = async () => {
    if (!form?.name?.trim()) return;
    setSaving(true);
    try {
      await base44.entities.Food.create(form);
      navigate("/my-foods");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-5 pt-4 pb-4">
      <h1 className="text-white text-2xl font-extrabold tracking-tight mb-6">Scan Barcode</h1>

      {looking && (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <Loader2 className="w-8 h-8 text-[#06D6A0] animate-spin" />
          <p className="text-white/40 text-sm">Looking up product...</p>
        </div>
      )}

      {!looking && form && (
        <BarcodeResultForm form={form} setForm={setForm} onBack={() => setForm(null)} onSave={save} saving={saving} />
      )}

      {!looking && !form && supported && (
        <div className="space-y-3">
          <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-card">
            <video ref={videoRef} className="w-full h-full object-cover" muted playsInline />
            <div className="absolute inset-6 border-2 border-[#06D6A0]/70 rounded-2xl pointer-events-none" />
          </div>
          {cameraError ? (
            <p className="text-white/40 text-sm text-center">{cameraError}</p>
          ) : (
            <p className="text-white/40 text-sm text-center">Point your camera at a barcode</p>
          )}
        </div>
      )}

      {!looking && !form && !supported && (
        <div className="flex flex-col items-center justify-center text-center gap-3 py-10">
          <ScanBarcode className="w-10 h-10 text-white/20" />
          <p className="text-white/40 text-sm">Barcode scanning isn't supported in this browser. Enter the code manually.</p>
        </div>
      )}

      {!looking && !form && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (manualCode.trim()) lookupBarcode(manualCode.trim());
          }}
          className="flex gap-2 mt-4"
        >
          <Input
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Enter barcode number"
            className="bg-card border-white/10 text-white"
          />
          <Button type="submit" className="bg-[#06D6A0] text-[#1A1A2E] font-bold hover:bg-[#06D6A0]/80 shrink-0">
            Lookup
          </Button>
        </form>
      )}
    </div>
  );
}