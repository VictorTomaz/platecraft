import React from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@/components/GoogleIcon";
import { Apple, UtensilsCrossed } from "lucide-react";

export default function Welcome() {
  const handleGoogle = () => base44.auth.loginWithProvider("google", "/");
  const handleApple = () => base44.auth.loginWithProvider("apple", "/");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#1A1A2E] px-6">
      <div className="w-full max-w-sm text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#06D6A0] mb-6">
          <UtensilsCrossed className="w-8 h-8 text-[#1A1A2E]" aria-hidden="true" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">PlateCraft</h1>
        <p className="text-white/50 mt-2 mb-10">Plan meals and track nutrition, effortlessly.</p>

        <div className="space-y-3">
          <Button
            className="w-full h-12 text-sm font-medium bg-white text-[#1A1A2E] hover:bg-white/90"
            onClick={handleGoogle}
          >
            <GoogleIcon className="w-5 h-5 mr-2" />
            Continue with Google
          </Button>
          <Button
            className="w-full h-12 text-sm font-medium bg-black text-white hover:bg-black/80"
            onClick={handleApple}
          >
            <Apple className="w-5 h-5 mr-2" />
            Continue with Apple
          </Button>
        </div>


      </div>
    </div>
  );
}