"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeSwitcher from "../../components/ThemeSwitcher";
import {
    Menu, X, LayoutDashboard, PenTool, Files,
    UserCircle, CreditCard, LogOut, Shield, Crown,
    Settings, HelpCircle, Sparkles, ChevronLeft, ChevronRight
} from "lucide-react";

type Profile = {
    id: string;
    brand_name?: string | null;
    avatar_url?: string | null;
    mode: "business" | "creator";
};

type SideNavProps = {
    userEmail?: string | null;
    activeProfile?: Profile | null;
    isPro?: boolean;
    isCollapsed?: boolean;
    onToggle?: () => void;
};

// Component helper for menu items
function MenuItemComp({
    href, label, icon, locked = false, badge = "",
    isActive = false, onClick, isCollapsed = false
}: {
    href: string; label: string; icon: React.ReactNode;
    locked?: boolean; badge?: string; isActive?: boolean;
    onClick?: () => void; isCollapsed?: boolean;
}) {
    return (
        <Link
            href={href}
            onClick={onClick}
            title={isCollapsed ? label : undefined}
            className={`relative flex items-center ${isCollapsed ? 'justify-center px-0' : 'justify-between px-5'} py-3.5 mx-3 rounded-[20px] transition-all duration-300 group ${isActive
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 scale-[1.02]'
                : 'text-slate-400 hover:bg-white hover:shadow-sm hover:text-slate-600'
                }`}
        >
            <div className={`flex items-center gap-3.5 relative z-10 ${isCollapsed ? 'justify-center' : ''}`}>
                <span className={`${isActive ? 'text-pastel-blue' : 'text-slate-300 group-hover:text-slate-500'} transition-colors duration-300`}>
                    {icon}
                </span>
                {!isCollapsed && (
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                        {label}
                    </span>
                )}
            </div>

            {!isCollapsed && (
                <div className="flex items-center gap-2 relative z-10">
                    {locked && (
                        <Shield className="w-3 h-3 text-slate-300 group-hover:text-slate-400" />
                    )}
                    {!locked && badge && (
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-400'}`}>
                            {badge}
                        </span>
                    )}
                </div>
            )}

            {/* Locked indicator for collapsed state */}
            {isCollapsed && locked && (
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-slate-200" />
            )}
        </Link>
    );
}

export default function SideNav({ userEmail, activeProfile, isPro, isCollapsed = false, onToggle }: SideNavProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { t } = useI18n();
    const [isOpen, setIsOpen] = useState(false);

    // Helper to determine active state (handles query params roughly)
    const isActive = (path: string) => {
        if (path === '/dashboard/planner') return pathname === '/dashboard/planner' && !window.location.search.includes('saved');
        if (path.includes('?')) return false; // Simple check, could be better
        return pathname === path;
    };

    async function handleLogout() {
        await supabase.auth.signOut();
        router.replace("/login");
    }

    const MobileMenu = () => (
        <div className="space-y-6 pt-10">
            <div className="px-6 mb-8">
                <div className="bg-white p-5 rounded-[28px] shadow-sm border border-slate-100 flex items-center gap-4">
                    <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-pastel-pink to-pastel-purple flex items-center justify-center text-white font-black shadow-sm">
                        {(activeProfile?.brand_name || "C").charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest">{activeProfile?.brand_name || "Creator"}</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                            {isPro ? "Authority Elite" : "Free Plan"}
                        </p>
                    </div>
                </div>
            </div>
            <nav className="space-y-1">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-3 px-8">Command Center</p>
                <MenuItemComp href="/dashboard" label="Dashboard" icon={<LayoutDashboard size={18} />} isActive={pathname === '/dashboard'} onClick={() => setIsOpen(false)} />
                <MenuItemComp href="/studio" label="Studio" icon={<PenTool size={18} />} locked={!isPro} badge="Pro" isActive={pathname === '/studio'} onClick={() => setIsOpen(false)} />
                <MenuItemComp href="/projects" label="Projects" icon={<Files size={18} />} isActive={pathname === '/projects'} onClick={() => setIsOpen(false)} />

                <div className="h-px bg-slate-100/50 my-4 mx-8" />

                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-3 px-8">Strategy</p>
                <MenuItemComp href="/dashboard/planner" label="Viral Planner" icon={<Sparkles size={18} />} isActive={pathname.includes('/planner')} onClick={() => setIsOpen(false)} />
                <MenuItemComp href="/profiles" label="Identities" icon={<UserCircle size={18} />} isActive={pathname === '/profiles'} onClick={() => setIsOpen(false)} />
                <MenuItemComp href="/plans" label="Subscriptions" icon={<CreditCard size={18} />} isActive={pathname === '/plans'} onClick={() => setIsOpen(false)} />

                <div className="h-px bg-slate-100/50 my-4 mx-8" />

                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-3 px-8">System</p>
                <MenuItemComp href="/settings" label="Settings" icon={<Settings size={18} />} isActive={pathname === '/settings'} onClick={() => setIsOpen(false)} />
                <MenuItemComp href="/help" label="Help" icon={<HelpCircle size={18} />} isActive={pathname === '/help'} onClick={() => setIsOpen(false)} />
            </nav>
        </div>
    );

    return (
        <>
            {/* Mobile Header */}
            <div className={`lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-md border-b border-slate-100 z-40 flex items-center justify-between px-6 transition-all ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center text-white">
                        <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="font-black text-lg tracking-tighter text-slate-800 uppercase">CreatorHub</span>
                </div>
                <button onClick={() => setIsOpen(true)} className="p-2 text-slate-400 hover:text-slate-800 active:scale-95 transition-all">
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsOpen(false)} className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 lg:hidden" />
                        <motion.aside initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed left-0 top-0 bottom-0 w-80 bg-slate-50 border-r border-slate-100 z-50 lg:hidden flex flex-col shadow-2xl">
                            <div className="p-6 flex items-center justify-between">
                                <span className="font-black text-lg tracking-tighter text-slate-800 uppercase">CreatorHub</span>
                                <button onClick={() => setIsOpen(false)} className="p-2 text-slate-400 hover:text-slate-800">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <MobileMenu />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop SideNav */}
            <aside
                className={`hidden lg:flex flex-col h-screen sticky top-0 z-40 transition-all duration-300 ease-in-out border-r border-border bg-background/50 backdrop-blur-xl`}
            >
                {/* Glass Background Layer */}
                <div className="absolute inset-0 bg-white/40 backdrop-blur-2xl shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)]" />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                    {/* Header */}
                    <div className={`${isCollapsed ? 'px-3 py-6' : 'p-8 pb-6'} transition-all`}>
                        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3 px-2'} mb-8 group min-h-[40px]`}>
                            <Link href="/" className="block">
                                <div className="w-10 h-10 rounded-[14px] bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/20 group-hover:scale-110 transition-transform duration-500">
                                    <Sparkles className="w-5 h-5 text-pastel-blue" />
                                </div>
                            </Link>
                            {!isCollapsed && (
                                <Link href="/" className="flex flex-col">
                                    <span className="font-heading font-black text-xl tracking-tighter text-slate-800 leading-none">CreatorHub</span>
                                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 mt-1.5 group-hover:text-pastel-blue transition-colors">Workspace</span>
                                </Link>
                            )}
                        </div>

                        {/* Profile Pill */}
                        <div className={`bg-white/50 border border-white/60 shadow-sm flex items-center gap-3 cursor-default hover:bg-white transition-colors overflow-hidden ${isCollapsed ? 'rounded-[20px] p-2 justify-center w-14 h-14 mx-auto' : 'rounded-[24px] p-3'}`}>
                            <div className="w-10 h-10 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-sm shadow-inner">
                                {(activeProfile?.brand_name || "U").charAt(0).toUpperCase()}
                            </div>
                            {!isCollapsed && (
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-black text-slate-700 text-[11px] truncate uppercase tracking-widest">{activeProfile?.brand_name || "User"}</h3>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                                        {isPro ? "Authority Elite" : "Free Plan"}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Nav Items */}
                    <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-6 scrollbar-none">
                        {!isCollapsed && <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-3 px-6 pt-2">Command Center</p>}
                        {isCollapsed && <div className="h-4" />}

                        <MenuItemComp href="/dashboard" label="Dashboard" icon={<LayoutDashboard size={18} />} isActive={pathname === '/dashboard'} isCollapsed={isCollapsed} />
                        <MenuItemComp href="/studio" label="Studio" icon={<PenTool size={18} />} locked={!isPro} badge="Pro" isActive={pathname === '/studio'} isCollapsed={isCollapsed} />
                        <MenuItemComp href="/projects" label="Projects" icon={<Files size={18} />} isActive={pathname === '/projects'} isCollapsed={isCollapsed} />

                        <div className={`h-px bg-slate-100/50 my-6 ${isCollapsed ? 'mx-2' : 'mx-6'}`} />

                        {!isCollapsed && <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-3 px-6">Strategy</p>}

                        <MenuItemComp href="/dashboard/planner" label="Viral Planner" icon={<Sparkles size={18} />} isActive={pathname.includes('/planner')} isCollapsed={isCollapsed} />
                        <MenuItemComp href="/profiles" label="Identities" icon={<UserCircle size={18} />} isActive={pathname === '/profiles'} isCollapsed={isCollapsed} />
                        <MenuItemComp href="/plans" label="Subscriptions" icon={<CreditCard size={18} />} isActive={pathname === '/plans'} isCollapsed={isCollapsed} />

                        <div className={`h-px bg-slate-100/50 my-6 ${isCollapsed ? 'mx-2' : 'mx-6'}`} />

                        {!isCollapsed && <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em] mb-3 px-6">System</p>}

                        <MenuItemComp href="/settings" label="Settings" icon={<Settings size={18} />} isActive={pathname === '/settings'} isCollapsed={isCollapsed} />
                        <MenuItemComp href="/help" label="Help" icon={<HelpCircle size={18} />} isActive={pathname === '/help'} isCollapsed={isCollapsed} />
                    </nav>

                    {/* Footer */}
                    <div className={`${isCollapsed ? 'p-3' : 'p-6'} transition-all`}>
                        <div className={`flex items-center ${isCollapsed ? 'flex-col gap-4' : 'justify-between px-2'}`}>
                            {onToggle && (
                                <button
                                    onClick={onToggle}
                                    className={`w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors ${isCollapsed ? 'mb-2' : ''}`}
                                >
                                    {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                                </button>
                            )}

                            {!isCollapsed && (
                                <div className="flex items-center gap-4">
                                    <ThemeSwitcher />
                                    <button onClick={handleLogout} className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors">
                                        <LogOut size={14} />
                                    </button>
                                </div>
                            )}

                            {isCollapsed && (
                                <button onClick={handleLogout} className="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors">
                                    <LogOut size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
