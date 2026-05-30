"use client";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as LabelPrimitive from "@radix-ui/react-label";

// ─────────────────────────────────────────────────────────────────────────────
//  Switch — toggle on/off berbasis Radix UI
//  Cara pakai:
//    <Switch id="notif" label="Aktifkan notifikasi" checked={v} onCheckedChange={setV} />
// ─────────────────────────────────────────────────────────────────────────────

export function Switch({ id, label, checked, onCheckedChange, disabled = false }) {
    return (
        <div className="flex items-center gap-3">
            <SwitchPrimitive.Root
                id={id}
                checked={checked}
                onCheckedChange={onCheckedChange}
                disabled={disabled}
                className="
                    relative h-6 w-11 rounded-full border-none cursor-pointer outline-none
                    bg-slate-200 transition-colors duration-200
                    data-[state=checked]:bg-violet-600
                    disabled:opacity-50 disabled:cursor-not-allowed
                    dark:bg-white/10 dark:data-[state=checked]:bg-violet-500
                "
            >
                <SwitchPrimitive.Thumb className="
                    block h-4 w-4 rounded-full bg-white shadow-md
                    transition-transform duration-200
                    translate-x-1 data-[state=checked]:translate-x-6
                " />
            </SwitchPrimitive.Root>
            {label && (
                <LabelPrimitive.Root htmlFor={id} className="text-[0.875rem] text-slate-700 dark:text-slate-300 cursor-pointer select-none">
                    {label}
                </LabelPrimitive.Root>
            )}
        </div>
    );
}
