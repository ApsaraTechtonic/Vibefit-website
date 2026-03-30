'use client';

import { useState } from 'react';
import { Camera } from "lucide-react";
import { LensScanner } from "./LensScanner";

export function LensButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <section 
        onClick={() => setIsOpen(true)}
        className="mb-10 mt-4 rounded-[32px] bg-foreground text-background p-6 shadow-xl relative overflow-hidden group cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
        <div className="relative z-10 flex flex-col h-full justify-center">
          <div className="bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
            <Camera size={24} />
          </div>
          <h2 className="text-3xl font-heading font-semibold tracking-tight">Lens Scan</h2>
          <p className="text-gray-300 font-sans text-sm mt-2 max-w-[200px]">Auto-log your food, scale, or gym equipment.</p>
        </div>
      </section>

      <LensScanner isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
