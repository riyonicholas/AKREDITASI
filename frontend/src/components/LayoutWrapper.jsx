"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function LayoutWrapper({ children }) {
    const pathname = usePathname();
    const isLoginPage = pathname === "/login" || pathname === "/";

    if (isLoginPage) {
        return <main>{children}</main>;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50/50">
            <Navbar />
            <main className="flex-1 h-full overflow-y-auto custom-scrollbar">
                {children}
            </main>
        </div>
    );
}
