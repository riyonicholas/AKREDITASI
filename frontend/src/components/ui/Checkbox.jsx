"use client";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as LabelPrimitive from "@radix-ui/react-label";

// ─────────────────────────────────────────────────────────────────────────────
//  Checkbox — kotak centang berbasis Radix UI
//  Cara pakai:
//    <Checkbox id="syarat" label="Saya setuju syarat & ketentuan" checked={v} onCheckedChange={setV} />
// ─────────────────────────────────────────────────────────────────────────────

export function Checkbox({ id, label, checked, onCheckedChange, disabled = false }) {
    return (
        <div className="flex items-center gap-2.5">
            <CheckboxPrimitive.Root
                id={id}
                checked={checked}
                onCheckedChange={onCheckedChange}
                disabled={disabled}
                className="
                    h-4.5 w-4.5 rounded-md border border-slate-300 bg-white
                    flex items-center justify-center shrink-0
                    transition-all cursor-pointer outline-none
                    data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600
                    disabled:opacity-50 disabled:cursor-not-allowed
                    dark:border-white/20 dark:bg-white/[0.06]
                    dark:data-[state=checked]:bg-violet-500 dark:data-[state=checked]:border-violet-500
                "
                style={{ height: "18px", width: "18px" }}
            >
                <CheckboxPrimitive.Indicator className="text-white text-xs font-bold">
                    ✓
                </CheckboxPrimitive.Indicator>
            </CheckboxPrimitive.Root>
            {label && (
                <LabelPrimitive.Root htmlFor={id} className="text-[0.875rem] text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                    {label}
                </LabelPrimitive.Root>
            )}
        </div>
    );
}
