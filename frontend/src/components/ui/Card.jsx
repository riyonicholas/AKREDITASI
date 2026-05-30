"use client";

// ─────────────────────────────────────────────────────────────────────────────
//  Card — kotak konten dengan berbagai variant
//  Cara pakai:
//    <Card title="Statistik" icon="📊">
//      <p>Konten di sini</p>
//    </Card>
//
//    <Card variant="glass" footer={<Button>Simpan</Button>}>...</Card>
// ─────────────────────────────────────────────────────────────────────────────

const VARIANTS = {
    default: "border border-slate-200 bg-white",
    glass: "border border-slate-200/50 bg-white/70 backdrop-blur-xl",
    solid: "border border-slate-200 bg-slate-50",
    glow: "border border-violet-200 bg-white shadow-[0_0_20px_rgba(139,92,246,0.1)]",
};

export function Card({ children, title, icon, description, footer, variant = "default", className = "" }) {
    return (
        <div className={`rounded-2xl text-slate-800 ${VARIANTS[variant] ?? VARIANTS.default} ${className}`}>
            {(title || icon) && (
                <div className="flex items-center gap-2.5 px-5 pt-5 pb-4 border-b border-slate-100">
                    {icon && <span className="text-xl">{icon}</span>}
                    <div>
                        {title && <h3 className="m-0 text-[0.95rem] font-semibold text-slate-900">{title}</h3>}
                        {description && <p className="m-0 text-[0.78rem] text-slate-500 mt-0.5">{description}</p>}
                    </div>
                </div>
            )}
            <div className="p-5">{children}</div>
            {footer && (
                <div className="px-5 pb-5 flex justify-end gap-3 border-t border-slate-100 pt-4">
                    {footer}
                </div>
            )}
        </div>
    );
}
