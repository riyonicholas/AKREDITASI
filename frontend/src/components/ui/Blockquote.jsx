"use client";

// ─────────────────────────────────────────────────────────────────────────────
//  Blockquote — kutipan / catatan informatif
//  Cara pakai:
//    <Blockquote>Ini adalah catatan penting.</Blockquote>
//    <Blockquote variant="warning" title="Perhatian">Jangan lupa simpan!</Blockquote>
//    <Blockquote variant="danger">Data ini akan dihapus permanen.</Blockquote>
// ─────────────────────────────────────────────────────────────────────────────

const VARIANTS = {
    info: { bar: "bg-indigo-500", bg: "bg-indigo-50 dark:bg-indigo-400/[0.07]", text: "text-indigo-700 dark:text-indigo-300", icon: "ℹ️" },
    warning: { bar: "bg-amber-500", bg: "bg-amber-50 dark:bg-amber-400/[0.07]", text: "text-amber-700 dark:text-amber-300", icon: "⚠️" },
    danger: { bar: "bg-red-500", bg: "bg-red-50 dark:bg-red-400/[0.07]", text: "text-red-700 dark:text-red-300", icon: "❌" },
    success: { bar: "bg-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-400/[0.07]", text: "text-emerald-700 dark:text-emerald-300", icon: "✅" },
    tip: { bar: "bg-violet-500", bg: "bg-violet-50 dark:bg-violet-400/[0.07]", text: "text-violet-700 dark:text-violet-300", icon: "💡" },
};

export function Blockquote({ children, variant = "info", title, icon }) {
    const v = VARIANTS[variant] ?? VARIANTS.info;
    const emoji = icon ?? v.icon;

    return (
        <div className={`flex gap-3 rounded-xl ${v.bg} p-4 border border-slate-100 dark:border-white/[0.05]`}>
            <div className={`w-1 shrink-0 rounded-full self-stretch ${v.bar}`} />
            <div className="flex gap-2.5 flex-1 min-w-0">
                <span className="text-base shrink-0 mt-0.5">{emoji}</span>
                <div className="min-w-0">
                    {title && <p className={`m-0 mb-1 text-[0.82rem] font-semibold uppercase tracking-wide ${v.text}`}>{title}</p>}
                    <div className="text-[0.875rem] text-slate-700 dark:text-slate-300 leading-relaxed">{children}</div>
                </div>
            </div>
        </div>
    );
}
