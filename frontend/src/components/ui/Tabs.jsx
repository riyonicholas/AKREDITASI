"use client";
import * as TabsPrimitive from "@radix-ui/react-tabs";

// ─────────────────────────────────────────────────────────────────────────────
//  Tabs — tab navigation berbasis Radix UI
//  Cara pakai:
//    <Tabs defaultValue="profil" tabs={[
//      { value: "profil",   label: "Profil",   content: <ProfilForm /> },
//      { value: "setelan",  label: "Setelan",  content: <SetelanForm /> },
//    ]} />
// ─────────────────────────────────────────────────────────────────────────────

export function Tabs({ defaultValue, value, onValueChange, tabs = [], className = "" }) {
    return (
        <TabsPrimitive.Root
            defaultValue={defaultValue}
            value={value}
            onValueChange={onValueChange}
            className={className}
        >
            {/* Tab List */}
            <TabsPrimitive.List className="flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 mb-6 dark:border-white/[0.08] dark:bg-white/[0.04]">
                {tabs.map(tab => (
                    <TabsPrimitive.Trigger
                        key={tab.value}
                        value={tab.value}
                        className="
                            flex-1 rounded-lg px-4 py-2 text-[0.875rem] font-medium text-slate-500
                            cursor-pointer outline-none border-none bg-transparent transition-all duration-200
                            data-[state=active]:bg-violet-100 data-[state=active]:text-violet-700
                            hover:text-slate-800
                            dark:data-[state=active]:bg-violet-500/20 dark:data-[state=active]:text-violet-300
                            dark:hover:text-slate-300
                        "
                    >
                        {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
                        {tab.label}
                    </TabsPrimitive.Trigger>
                ))}
            </TabsPrimitive.List>

            {/* Tab Panels */}
            {tabs.map(tab => (
                <TabsPrimitive.Content key={tab.value} value={tab.value}>
                    {tab.content}
                </TabsPrimitive.Content>
            ))}
        </TabsPrimitive.Root>
    );
}
