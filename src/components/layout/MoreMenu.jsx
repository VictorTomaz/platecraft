import React from "react";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function MoreMenu() {
  const navigate = useNavigate();

  return (
    <div className="absolute top-[calc(env(safe-area-inset-top,24px)+16px)] right-4 z-20">
      <DropdownMenu>
        <DropdownMenuTrigger className="w-9 h-9 flex items-center justify-center rounded-full bg-[#16213E] text-white">
          <MoreVertical className="w-4 h-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-[#16213E] border-white/10 text-white">
          <DropdownMenuItem onClick={() => navigate("/about")} className="focus:bg-white/10 focus:text-white">
            About
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/support")} className="focus:bg-white/10 focus:text-white">
            Support
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/privacy-policy")} className="focus:bg-white/10 focus:text-white">
            Privacy Policy
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate("/terms")} className="focus:bg-white/10 focus:text-white">
            Terms &amp; Conditions
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}