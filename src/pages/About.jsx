import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function About() {
  const navigate = useNavigate();
  return (
    <div className="px-5 pt-2 pb-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full bg-card text-white">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-white text-xl font-extrabold">About</h1>
      </div>
      <div className="bg-card rounded-3xl p-5 text-white/70 text-sm leading-relaxed">
        <p>
          Welcome to PlateCraft! We make healthy eating easy and fun. Track your daily macros,
          explore exciting meal prep ideas, and learn to Craft balanced plates. We simplify
          healthy living by helping you effortlessly track your daily macro goal so you can
          fuel your body with accuracy.
        </p>
        <p className="mt-3">
          PlateCraft is a subsidiary of Based-Peptides LLC.
        </p>
      </div>
    </div>
  );
}