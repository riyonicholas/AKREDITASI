"use client";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

// ─────────────────────────────────────────────────────────────────────────────
//  Tooltip — tooltip hover berbasis Radix UI
//  Cara pakai:
//    <Tooltip content="Hapus data ini">
//      <button>🗑️</button>
//    </Tooltip>
//
//  Note: Bungkus halaman dengan <Tooltip.Provider> jika belum ada
// ─────────────────────────────────────────────────────────────────────────────

export function Tooltip({ children, content, side = "top", sideOffset = 6 }) {
    return (
        <TooltipPrimitive.Root>
            <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
            <TooltipPrimitive.Portal>
                <TooltipPrimitive.Content
                    side={side}
                    sideOffset={sideOffset}
                    className="
                        rounded-lg border border-slate-200 bg-white
                        px-3 py-1.5 text-[0.78rem] text-slate-800 shadow-xl z-[70]
                        animate-in fade-in slide-in-from-bottom-1
                        dark:border-white/10 dark:bg-[#1e1b4b] dark:text-slate-200
                    "
                >
                    {content}
                    <TooltipPrimitive.Arrow className="fill-white dark:fill-[#1e1b4b]" />
                </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
    );
}

export { TooltipPrimitive as TooltipProvider };
