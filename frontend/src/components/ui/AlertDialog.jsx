"use client";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

// ─────────────────────────────────────────────────────────────────────────────
//  AlertDialog — dialog konfirmasi (Hapus, Keluar, dll)
//  Cara pakai:
//    <AlertDialog
//      trigger={<Button variant="danger">Hapus</Button>}
//      title="Konfirmasi Hapus"
//      description="Data tidak bisa dikembalikan."
//      onConfirm={() => handleDelete(id)}
//    />
// ─────────────────────────────────────────────────────────────────────────────

export function AlertDialog({ trigger, title, description, onConfirm, confirmLabel = "Ya, Lanjutkan", confirmVariant = "danger" }) {
    const confirmCls = confirmVariant === "danger"
        ? "bg-gradient-to-r from-red-500 to-rose-500 shadow-[0_4px_14px_rgba(239,68,68,0.3)]"
        : "bg-gradient-to-r from-violet-500 to-indigo-500 shadow-[0_4px_14px_rgba(139,92,246,0.3)]";

    return (
        <AlertDialogPrimitive.Root>
            <AlertDialogPrimitive.Trigger asChild>{trigger}</AlertDialogPrimitive.Trigger>
            <AlertDialogPrimitive.Portal>
                <AlertDialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
                <AlertDialogPrimitive.Content className="
                    fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2
                    w-[380px] max-w-[95vw] rounded-2xl border border-slate-200
                    bg-white p-7 shadow-2xl outline-none
                    dark:border-white/10 dark:bg-[#1a1740]
                ">
                    <AlertDialogPrimitive.Title className="m-0 mb-2 text-lg font-bold text-slate-800 dark:text-slate-200">
                        {title}
                    </AlertDialogPrimitive.Title>
                    <AlertDialogPrimitive.Description className="m-0 mb-6 text-[0.875rem] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {description}
                    </AlertDialogPrimitive.Description>
                    <div className="flex justify-end gap-3">
                        <AlertDialogPrimitive.Cancel asChild>
                            <button className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-[0.875rem] text-slate-600 cursor-pointer hover:bg-slate-100 hover:text-slate-800 transition-colors outline-none dark:border-white/10 dark:bg-white/[0.05] dark:text-slate-400 dark:hover:text-slate-200">
                                Batal
                            </button>
                        </AlertDialogPrimitive.Cancel>
                        <AlertDialogPrimitive.Action asChild>
                            <button onClick={onConfirm} className={`rounded-xl border-none px-5 py-2 text-[0.875rem] font-semibold text-white cursor-pointer hover:-translate-y-0.5 transition-transform outline-none ${confirmCls}`}>
                                {confirmLabel}
                            </button>
                        </AlertDialogPrimitive.Action>
                    </div>
                </AlertDialogPrimitive.Content>
            </AlertDialogPrimitive.Portal>
        </AlertDialogPrimitive.Root>
    );
}
