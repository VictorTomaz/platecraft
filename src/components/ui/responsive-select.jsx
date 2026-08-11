import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";

export default function ResponsiveSelect({ value, onValueChange, options, placeholder = "Select...", label }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  const handleSelect = (v) => {
    onValueChange(v);
    setOpen(false);
  };

  const trigger = (
    <button
      type="button"
      className="w-full flex items-center justify-between rounded-md border bg-[#1A1A2E] border-white/10 text-white px-3 py-2 text-sm h-10"
    >
      <span>{selected ? selected.label : placeholder}</span>
      <ChevronDown className="w-4 h-4 opacity-50" />
    </button>
  );

  const optionsList = (
    <div className="max-h-[50vh] overflow-y-auto space-y-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => handleSelect(o.value)}
          className="w-full flex items-center justify-between px-4 py-3 text-left text-white text-sm hover:bg-white/5 rounded-xl"
        >
          {o.label}
          {o.value === value && <Check className="w-4 h-4 text-[#06D6A0]" />}
        </button>
      ))}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        <DrawerContent className="bg-[#16213E] border-white/10">
          <DrawerHeader>
            <DrawerTitle className="text-white">{label || placeholder}</DrawerTitle>
          </DrawerHeader>
          <div className="px-2 pb-6">{optionsList}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent className="bg-[#16213E] border-white/10 p-1 w-64">{optionsList}</PopoverContent>
    </Popover>
  );
}