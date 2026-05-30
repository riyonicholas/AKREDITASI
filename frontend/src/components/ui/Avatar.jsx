"use client";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

// ─────────────────────────────────────────────────────────────────────────────
//  Avatar — foto profil dengan fallback inisial
//  Cara pakai:
//    <Avatar src="/foto.jpg" name="Budi Santoso" size="md" />
//    <Avatar name="Admin" />  ← hanya inisial
// ─────────────────────────────────────────────────────────────────────────────

const SIZES = { xs: "h-7 w-7 text-[0.65rem]", sm: "h-8 w-8 text-[0.72rem]", md: "h-10 w-10 text-[0.82rem]", lg: "h-14 w-14 text-[0.95rem]", xl: "h-20 w-20 text-[1.1rem]" };

function getInitials(name = "") {
    return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";
}

export function Avatar({ src, name, size = "md", className = "" }) {
    return (
        <AvatarPrimitive.Root className={`inline-flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 font-bold text-white shrink-0 ${SIZES[size] ?? SIZES.md} ${className}`}>
            <AvatarPrimitive.Image src={src} alt={name} className="h-full w-full rounded-full object-cover" />
            <AvatarPrimitive.Fallback delayMs={0} className="flex items-center justify-center h-full w-full">
                {getInitials(name)}
            </AvatarPrimitive.Fallback>
        </AvatarPrimitive.Root>
    );
}
