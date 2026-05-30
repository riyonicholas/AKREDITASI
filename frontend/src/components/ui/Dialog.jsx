"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";

// ─────────────────────────────────────────────────────────────────────────────
//  Dialog — modal dialog berbasis Radix UI
//  Cara pakai:
//    <Dialog trigger={<Button>Buka</Button>} title="Judul">
//      <p>Konten dialog</p>
//    </Dialog>
// ─────────────────────────────────────────────────────────────────────────────

export function Dialog({ trigger, title, description, children, footer, open, onOpenChange }) {
    return (
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            {trigger && <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>}
            <DialogPrimitive.Portal>
                <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in" />
                <DialogPrimitive.Content className="
                    fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2
                    w-[480px] max-w-[95vw] max-h-[90vh] overflow-y-auto
                    rounded-2xl border border-slate-200 bg-white p-7 shadow-2xl outline-none
                    animate-in fade-in slide-in-from-bottom-4
                    dark:border-white/10 dark:bg-[#1a1740]
                ">
                    {title && (
                        <DialogPrimitive.Title className="m-0 mb-1 text-lg font-bold text-slate-900 dark:text-slate-200">
                            {title}
                        </DialogPrimitive.Title>
                    )}
                    {description && (
                        <DialogPrimitive.Description className="m-0 mb-5 text-[0.85rem] text-slate-500 leading-relaxed">
                            {description}
                        </DialogPrimitive.Description>
                    )}
                    <div>{children}</div>
                    {footer && <div className="mt-6 flex justify-end gap-3">{footer}</div>}
                    <DialogPrimitive.Close className="
                        absolute top-4 right-4 rounded-lg p-1.5 text-slate-400
                        hover:text-slate-800 hover:bg-slate-100 transition-colors
                        bg-transparent border-none cursor-pointer outline-none
                        dark:text-slate-500 dark:hover:text-slate-200 dark:hover:bg-white/10
                    ">✕</DialogPrimitive.Close>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        </DialogPrimitive.Root>
    );
}
