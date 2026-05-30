"use client";
import * as SelectPrimitive from "@radix-ui/react-select";

// ─────────────────────────────────────────────────────────────────────────────
//  Select — dropdown pilihan berbasis Radix UI
//  Cara pakai:
//    <Select
//      value={value}
//      onValueChange={setValue}
//      placeholder="Pilih status..."
//      items={["Aktif", "Cuti", "Lulus"]}
//    />
//    // atau dengan label:
//    items={[{ value: "1", label: "Aktif" }, { value: "0", label: "Nonaktif" }]}
// ─────────────────────────────────────────────────────────────────────────────

export function Select({ value, onValueChange, items = [], placeholder = "Pilih...", disabled = false, className = "" }) {
    const normalize = (item) =>
        typeof item === "string" ? { value: item, label: item } : item;

    return (
        <SelectPrimitive.Root value={value} onValueChange={onValueChange} disabled={disabled}>
            <SelectPrimitive.Trigger className={`
                flex items-center justify-between gap-2
                rounded-xl border border-slate-200 bg-slate-50
                px-3.5 py-2.5 text-[0.875rem] text-slate-800
                cursor-pointer outline-none min-w-[140px]
                transition-all focus:border-violet-500
                data-[placeholder]:text-slate-400
                disabled:opacity-50 disabled:cursor-not-allowed
                dark:border-white/[0.12] dark:bg-white/[0.07]
                dark:text-slate-200 dark:focus:border-violet-400
                dark:data-[placeholder]:text-slate-500
                ${className}
            `}>
                <SelectPrimitive.Value placeholder={placeholder} />
                <SelectPrimitive.Icon className="text-slate-400 text-xs shrink-0">▾</SelectPrimitive.Icon>
            </SelectPrimitive.Trigger>
            <SelectPrimitive.Portal>
                <SelectPrimitive.Content
                    className="overflow-hidden rounded-xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-xl z-[60] dark:border-white/10 dark:bg-[rgba(15,12,41,0.97)] dark:shadow-2xl"
                    position="popper"
                    sideOffset={6}
                >
                    <SelectPrimitive.Viewport className="p-1.5">
                        {items.map(item => {
                            const { value: v, label } = normalize(item);
                            // Mencegah error Next.js / Radix "value prop must not be an empty string"
                            if (v === "" || v === null || v === undefined) return null;
                            const strValue = String(v);
                            return (
                                <SelectPrimitive.Item key={strValue} value={strValue}
                                    className="flex items-center px-3 py-2 rounded-lg text-[0.875rem] text-slate-700 cursor-pointer outline-none data-[highlighted]:bg-violet-100 data-[highlighted]:text-violet-900 data-[state=checked]:text-violet-700 data-[state=checked]:font-semibold dark:text-slate-300 dark:data-[highlighted]:bg-violet-500/15 dark:data-[highlighted]:text-violet-300 dark:data-[state=checked]:text-violet-400"
                                >
                                    <SelectPrimitive.ItemText>{label}</SelectPrimitive.ItemText>
                                </SelectPrimitive.Item>
                            );
                        })}
                    </SelectPrimitive.Viewport>
                </SelectPrimitive.Content>
            </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
    );
}
