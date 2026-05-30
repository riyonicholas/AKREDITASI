"use client";

// ─────────────────────────────────────────────────────────────────────────────
//  Button — komponen tombol dengan beberapa variant & size
//  Cara pakai:
//    <Button>Klik Saya</Button>
//    <Button variant="outline" size="sm">Batal</Button>
//    <Button variant="danger">Hapus</Button>
//    <Button loading>Loading...</Button>
// ─────────────────────────────────────────────────────────────────────────────

const VARIANTS = {
    primary: "bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-[0_4px_14px_rgba(139,92,246,0.35)] hover:shadow-[0_6px_20px_rgba(139,92,246,0.5)]",
    success: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_4px_14px_rgba(16,185,129,0.3)]",
    danger: "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-[0_4px_14px_rgba(239,68,68,0.3)]",
    outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
};

const SIZES = {
    xs: "px-2.5 py-1 text-[0.75rem]",
    sm: "px-3.5 py-1.5 text-[0.82rem]",
    md: "px-5 py-2.5 text-[0.9rem]",
    lg: "px-7 py-3 text-[1rem]",
};

export function Button({
    children,
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    className = "",
    ...props
}) {
    return (
        <button
            disabled={disabled || loading}
            className={`
                inline-flex items-center justify-center gap-2 rounded-xl font-semibold
                border-none cursor-pointer outline-none transition-all duration-200
                hover:-translate-y-0.5 active:translate-y-0
                disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0
                ${VARIANTS[variant] ?? VARIANTS.primary}
                ${SIZES[size] ?? SIZES.md}
                ${className}
            `}
            {...props}
        >
            {loading && (
                <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
            )}
            {children}
        </button>
    );
}
