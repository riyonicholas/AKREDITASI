"use client";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

// ─────────────────────────────────────────────────────────────────────────────
//  Separator — garis pemisah horizontal/vertikal
//  Cara pakai:
//    <Separator />                         ← horizontal
//    <Separator orientation="vertical" />  ← vertikal
//    <Separator label="atau" />            ← dengan label di tengah
// ─────────────────────────────────────────────────────────────────────────────

export function Separator({ orientation = "horizontal", label, className = "" }) {
    if (label) {
        return (
            <div className={`flex items-center gap-3 ${className}`}>
                <SeparatorPrimitive.Root className="flex-1 bg-slate-200 dark:bg-white/[0.08] data-[orientation=horizontal]:h-px" />
                <span className="text-[0.78rem] text-slate-500 shrink-0">{label}</span>
                <SeparatorPrimitive.Root className="flex-1 bg-slate-200 dark:bg-white/[0.08] data-[orientation=horizontal]:h-px" />
            </div>
        );
    }

    return (
        <SeparatorPrimitive.Root
            orientation={orientation}
            className={`
                bg-slate-200 dark:bg-white/[0.08]
                data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full
                data-[orientation=vertical]:w-px data-[orientation=vertical]:h-full
                ${className}
            `}
        />
    );
}
