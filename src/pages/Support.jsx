import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import DeleteAccountDialog from "@/components/support/DeleteAccountDialog";

export default function Support() {
  const navigate = useNavigate();
  return (
    <div className="px-5 pt-2 pb-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-full bg-card text-white">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-white text-xl font-extrabold">Support</h1>
      </div>
      <div className="bg-card rounded-3xl p-5 text-white/70 text-sm leading-relaxed flex items-start gap-3 mb-4">
        <Mail className="w-4 h-4 mt-0.5 shrink-0" />
        <p>
          Need help? Reach out to our support team and we'll get back to you as soon as possible.
        </p>
      </div>
      <a
        href="mailto:Support@based-peptides.com"
        className="w-full flex items-center justify-center gap-2 rounded-2xl py-3.5 font-extrabold text-[#1A1A2E] bg-[#06D6A0]"
      >
        <Mail className="w-4 h-4" />
        Support@based-peptides.com
      </a>

      <div className="mt-10 pt-6 border-t border-white/10">
        <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-3">Danger Zone</p>
        <DeleteAccountDialog />
      </div>
    </div>
  );
}