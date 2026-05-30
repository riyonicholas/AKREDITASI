"use client";

// ─────────────────────────────────────────────────────────────────────────────
//  Input — field teks/number/email dengan label dan error
//  (tidak butuh Radix — HTML native sudah cukup)
//  Cara pakai:
//    <Input label="Nama" value={nama} onChange={e => setNama(e.target.value)} />
//    <Input type="email" label="Email" error="Email tidak valid" />
//    <Input prefix="👤" placeholder="Username" />
// ─────────────────────────────────────────────────────────────────────────────

export function Input({
    label,
    id,
    error,
    prefix,
    suffix,
    className = "",
    ...props
}) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <label htmlFor={id} className="text-[0.78rem] font-semibold uppercase tracking-wider text-slate-400">
                    {label}
                </label>
            )}
            <div className="relative">
                {prefix && (
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-base pointer-events-none">
                        {prefix}
                    </span>
                )}
                <input
                    id={id}
                    className={`
                        w-full rounded-xl border bg-slate-50 text-[0.9rem] text-slate-900 outline-none
                        placeholder:text-slate-400 transition-all py-2.5
                        ${prefix ? "pl-10" : "pl-4"} ${suffix ? "pr-10" : "pr-4"}
                        ${error
                            ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.2)]"
                            : "border-slate-200 focus:border-violet-500 focus:shadow-[0_0_0_3px_rgba(139,92,246,0.2)]"
                        }
                        ${className}
                    `}
                    {...props}
                />
                {suffix && (
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-base">
                        {suffix}
                    </span>
                )}
            </div>
            {error && <p className="m-0 text-[0.78rem] text-red-400">{error}</p>}
        </div>
    );
}
