import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteAccountDialog() {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setDeleting(true);
    await base44.functions.invoke("deleteAccount", {});
    toast({ title: "Account deleted", description: "Your account has been permanently deleted." });
    setTimeout(() => {
      base44.auth.logout("/login");
    }, 1200);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="outline"
        className="w-full border-[#EF476F]/30 bg-[#EF476F]/10 text-[#EF476F] font-bold rounded-2xl h-12 hover:bg-[#EF476F]/20"
      >
        <Trash2 className="w-4 h-4 mr-2" /> Delete Account
      </Button>

      <AlertDialog
        open={open}
        onOpenChange={(v) => {
          if (!deleting) {
            setOpen(v);
            setConfirmText("");
          }
        }}
      >
        <AlertDialogContent className="bg-[#16213E] border-white/10 text-white max-w-[360px] rounded-3xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Delete your account?</AlertDialogTitle>
            <AlertDialogDescription className="text-white/50">
              This will permanently delete your account and all your data, including foods, meal
              logs, and calorie goals. This action cannot be undone. Type DELETE to confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE to confirm"
            disabled={deleting}
            className="bg-[#1A1A2E] border-white/10 text-white"
          />
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={deleting}
              className="bg-transparent border-white/10 text-white hover:bg-white/5 hover:text-white"
            >
              Cancel
            </AlertDialogCancel>
            <Button
              onClick={handleDelete}
              disabled={confirmText !== "DELETE" || deleting}
              className="bg-[#EF476F] text-white font-bold hover:bg-[#EF476F]/80"
            >
              {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Account"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}