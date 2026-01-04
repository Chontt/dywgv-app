"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

type SideNavProps = {
    userEmail?: string | null;
    activeProfile?: any;
    isPro?: boolean;
};

// Extracted components to avoid creating components during render
function MenuItemComp({ href, label, icon, locked = false, badge = "", isActive = false, isPro = false, onClick, }: { href: string; label: React.ReactNode; icon: React.ReactNode; locked?: boolean; badge?: string; isActive?: boolean; isPro?: boolean; onClick?: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all group ${isActive
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                }`}
        >
            <div className="flex items-center gap-3">
                <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'}`}>
                    {icon}
                </span>
                {label}
            </div>
            {locked && !isPro && (
                <svg className="w-3.5 h-3.5 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            )}
            {!locked && badge && (
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${isActive ? 'bg-indigo-500 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                    {badge}
                </span>
            )}
        </Link>
    );
}

const SeparatorComp = () => <div className="h-px bg-slate-100 my-2 mx-4" />;

export default function SideNav({ userEmail, activeProfile, isPro }: SideNavProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { t } = useI18n();
    const [isOpen, setIsOpen] = useState(false);

    const isActive = (path: string) => pathname === path;

    async function handleLogout() {
        await supabase.auth.signOut();
        router.replace("/login");
    }

    // Use extracted components

    return (
        <>
            {/* Mobile Header (Fixed) */}
            <div className={`lg:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 z-40 flex items-center justify-between px-6 transition-all ${isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <Link href="/" className="flex items-center gap-2">
                    <img src="/logo.png" alt="PROMPTY" className="w-8 h-8 object-contain" />
                    <span className="font-heading font-bold text-xl text-slate-900">PROMPTY</span>
                </Link>
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 w-72 bg-slate-50 z-50 lg:hidden flex flex-col shadow-2xl"
                        >
                            <div className="p-6 flex items-center justify-between border-b border-slate-100">
                                <Link href="/" className="flex items-center gap-2">
                                    <img src="/logo.png" alt="PROMPTY" className="w-8 h-8 object-contain" />
                                    <span className="font-heading font-bold text-xl text-slate-900">PROMPTY</span>
                                </Link>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto pt-4 flex flex-col">
                                <SideContent
                                    userEmail={userEmail}
                                    activeProfile={activeProfile}
                                    isPro={isPro}
                                    t={t}
                                    isActive={isActive}
                                    handleLogout={handleLogout}
                                    onItemClick={() => setIsOpen(false)}
                                />
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar (Fixed) */}
            <aside className="w-64 bg-slate-50/50 border-r border-slate-200 hidden lg:flex flex-col h-screen fixed left-0 top-0 overflow-y-auto custom-scrollbar">
                <div className="p-8 pb-4">
                    <Link href="/" className="flex items-center gap-2 text-indigo-600 hover:opacity-80 transition-opacity">
                        <img src="/logo.png" alt="PROMPTY" className="w-8 h-8 object-contain" />
                        <span className="font-heading font-bold text-xl tracking-tight text-slate-900">PROMPTY</span>
                    </Link>
                </div>
                <div className="flex-1 flex flex-col">
                    <SideContent
                        userEmail={userEmail}
                        activeProfile={activeProfile}
                        isPro={isPro}
                        t={t}
                        isActive={isActive}
                        handleLogout={handleLogout}
                    />
                </div>
            </aside>

            {/* Mobile Header Spacer */}
            <div className="h-16 lg:hidden" />
        </>
    );
}

// Internal component to share content between mobile and desktop
function SideContent({ userEmail, activeProfile, isPro, t, isActive, handleLogout, onItemClick }: any) {
    // SideContent uses the module-level MenuItemComp and SeparatorComp

    return (
        <>
            {/* Profile Identity Hook */}
            <div className="px-6 mb-4">
                <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 relative overflow-hidden group hover:shadow-md transition-shadow cursor-pointer">
                    {/* Glowing effect for Pro */}
                    {isPro && <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-bl-full -mr-4 -mt-4 opacity-50"></div>}

                    <div className={`w-10 h-10 shrink-0 rounded-full bg-gradient-to-br p-0.5 flex items-center justify-center ${isPro ? 'from-indigo-500 to-purple-600' : 'from-slate-200 to-slate-300'}`}>
                        <div className="w-full h-full bg-slate-50 rounded-full border-2 border-white flex items-center justify-center overflow-hidden">
                            {activeProfile?.avatar_url ? (
                                <img src={activeProfile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <span className={`font-bold text-sm ${isPro ? 'text-indigo-600' : 'text-slate-400'}`}>
                                    {(activeProfile?.brand_name || "B").charAt(0).toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 text-xs truncate">
                            {activeProfile?.brand_name || t('profile_role_creator')}
                        </h3>
                        {isPro ? (
                            <p className="text-[10px] bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent font-bold uppercase tracking-wide truncate">
                                {t('dash_plan_pro')}
                            </p>
                        ) : (
                            <p className="text-[10px] text-slate-400 font-medium truncate">
                                {t('dash_plan_free')}
                            </p>
                        )}
                    </div>
                    {isPro && (
                        <div className="text-indigo-500">
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path></svg>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Menus */}
            <nav className="flex-1 px-4 space-y-1 pb-6">

                {!isPro && (
                    <Link
                        href="/plans"
                        className="mx-4 mb-4 p-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl text-white shadow-lg shadow-indigo-200 group relative overflow-hidden flex items-center justify-between"
                    >
                        <div className="relative z-10">
                            <p className="text-[10px] font-bold uppercase tracking-wider opacity-80">Authority Plan</p>
                            <p className="text-xs font-bold font-heading">Upgrade Now &rarr;</p>
                        </div>
                        <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
                    </Link>
                )}

                {/* CORE */}
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-4 mt-2">{t('nav_menu_section')}</p>

                <MenuItemComp href="/dashboard" label={t('nav_dashboard')} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>} isActive={isActive('/dashboard')} isPro={!!isPro} />

                <MenuItemComp href="/studio" label={t('nav_studio')} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>} badge={isPro ? "New" : "Quick"} isActive={isActive('/studio')} isPro={!!isPro} onClick={onItemClick} />

                <MenuItemComp href="/projects" label={t('nav_drafts')} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>} isActive={isActive('/projects')} isPro={!!isPro} />

                <MenuItemComp href="/projects" label={t('nav_projects')} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>} isActive={isActive('/projects')} isPro={!!isPro} />

                <SeparatorComp />

                {/* GROWTH */}
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-4 mt-2">{t('nav_growth_section')}</p>

                <MenuItemComp href="/profiles" label={t('nav_profiles')} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>} locked={!isPro} isActive={isActive('/profiles')} isPro={!!isPro} />

                <MenuItemComp href="/plans" label={t('nav_plans')} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>} isActive={isActive('/plans')} isPro={!!isPro} />

                <SeparatorComp />

                {/* UTILITY */}
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 px-4 mt-2">{t('nav_settings_section')}</p>

                <MenuItemComp href="/settings" label={t('nav_settings')} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>} isActive={isActive('/settings')} isPro={!!isPro} />

                <MenuItemComp href="/help" label={t('nav_help_feedback')} icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>} isActive={isActive('/help')} isPro={!!isPro} />

            </nav>

            {/* Bottom Actions */}
            <div className="p-4 border-t border-slate-200 mt-auto">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all group"
                >
                    <svg className="group-hover:translate-x-1 transition-transform" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                    {t('nav_logout')}
                </button>
            </div>
        </>
    );
}
