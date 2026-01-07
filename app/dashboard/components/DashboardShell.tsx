"use client";

import { ReactNode, useState, useEffect } from "react";
import SideNav from "./SideNav";

type Profile = {
    id: string;
    brand_name?: string | null;
    avatar_url?: string | null;
    mode: "business" | "creator";
};

type DashboardShellProps = {
    children: ReactNode;
    userEmail?: string | null;
    activeProfile?: Profile | null;
    isPro: boolean;
};

export default function DashboardShell({
    children,
    userEmail,
    activeProfile,
    isPro
}: DashboardShellProps) {
    // Persist collapsed state if possible (optional, maybe later)
    const [isCollapsed, setIsCollapsed] = useState(false);

    // Mount check to avoid hydration mismatch if we were persisting, 
    // but for simple state false default is fine.

    return (
        <div className="flex flex-col lg:grid min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 text-base transition-all duration-300 ease-in-out"
            style={{
                gridTemplateColumns: isCollapsed ? "80px 1fr" : "288px 1fr"
            }}
        >
            <SideNav
                userEmail={userEmail}
                activeProfile={activeProfile}
                isPro={isPro}
                isCollapsed={isCollapsed}
                onToggle={() => setIsCollapsed(!isCollapsed)}
            />

            <main className="min-w-0 w-full transition-all duration-300 ease-in-out">
                {children}
            </main>
        </div>
    );
}
