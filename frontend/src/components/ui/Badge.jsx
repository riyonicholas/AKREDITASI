"use client";

// ─────────────────────────────────────────────────────────────────────────────
//  Badge — label status kecil berwarna
//  Cara pakai:
//    <Badge>Aktif</Badge>
//    <Badge variant="warning">Cuti</Badge>
//    <Badge variant="danger">Nonaktif</Badge>
// ─────────────────────────────────────────────────────────────────────────────

const VARIANTS = {
    default: "bg-violet-100 text-violet-700 dark:bg-violet-400/10 dark:text-violet-400",
    success: "bg-emerald-100 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400",
    warning: "bg-amber-100 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400",
    danger: "bg-red-100 text-red-700 dark:bg-red-400/10 dark:text-red-400",
    info: "bg-indigo-100 text-indigo-700 dark:bg-indigo-400/10 dark:text-indigo-400",
    orange: "bg-orange-100 text-orange-700 dark:bg-orange-400/10 dark:text-orange-400",
};

// Peta otomatis berdasarkan teks status umum
const STATUS_MAP = {
    aktif: "success",
    lulus: "info",
    cuti: "warning",
    nonaktif: "danger",
    pemeliharaan: "orange",
};

export function Badge({ children, variant, className = "" }) {
    const auto = STATUS_MAP[String(children).toLowerCase()];
    const v = variant ?? auto ?? "default";

    return (
        <span className={`
            inline-block rounded-full px-2.5 py-0.5
            text-[0.73rem] font-bold uppercase tracking-wide
            ${VARIANTS[v] ?? VARIANTS.default}
            ${className}
        `}>
            {children}
        </span>
    );
}
