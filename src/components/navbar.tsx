"use client";

import React, { useState } from "react";
import { useTheme } from "@/components/providers/theme-provider";
import { useLanguage } from "@/components/providers/language-provider";
import {
  Sun,
  Moon,
  Menu,
  X,
  TrendingUp,
  Globe,
  LayoutDashboard,
  CreditCard,
  Sparkles,
  Wallet,
  PiggyBank,
  Split,
  GraduationCap,
} from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: "dashboard", labelKey: "nav.dashboard", icon: LayoutDashboard },
  { id: "debt", labelKey: "nav.debt", icon: CreditCard },
  { id: "recommender", labelKey: "nav.recommender", icon: Sparkles },
  { id: "budget", labelKey: "nav.budget", icon: Wallet },
  { id: "savings", labelKey: "nav.savings", icon: PiggyBank },
  { id: "bill-splitter", labelKey: "nav.bill_splitter", icon: Split },
  { id: "education", labelKey: "nav.education", icon: GraduationCap },
];

export function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const { isDark, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <button
          onClick={() => setActiveTab("dashboard")}
          className="flex items-center gap-2.5 group cursor-pointer focus:outline-none"
          aria-label="KakeiKanri Home"
        >
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200/80 dark:border-slate-700/80 shadow-md group-hover:scale-105 transition-transform bg-amber-50 shrink-0">
            <img src="/logo.jpg" alt="KakeiKanri Logo" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-black text-slate-800 dark:text-slate-100 text-lg leading-tight tracking-tight">
              {language === "ja" ? "家計管理" : "KakeiKanri"}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold tracking-wider uppercase hidden sm:block">
              {language === "ja" ? "資産・債務マネージャー" : "Wealth & Budget Manager"}
            </span>
          </div>
        </button>

        {/* Desktop Navigation Tabs */}
        <nav className="hidden xl:flex items-center gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/80"
              }`}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </nav>

        {/* Action Controls: Language + Dark Mode + Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* Language Switcher Icon Button */}
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-300 dark:hover:border-emerald-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer group min-h-[38px]"
            title={language === "ja" ? "Switch to English" : "日本語に切り替え"}
            aria-label={t("nav.lang_toggle")}
          >
            <Globe className="w-4 h-4 text-emerald-500 group-hover:rotate-45 transition-transform duration-300" />
            <span className="uppercase font-extrabold text-[11px] text-emerald-600 dark:text-emerald-400">
              {language === "ja" ? "日本語" : "EN"}
            </span>
          </button>

          {/* Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all shadow-xs cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center"
            title={isDark ? "ライトモードに切替" : "ダークモードに切替"}
            aria-label={t("nav.theme_toggle")}
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-90 transition-transform duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>

          {/* Mobile hamburger menu button */}
          <button
            className="xl:hidden p-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Horizontal Touch-Friendly Pill Navigation Bar (Sub-Header) */}
      <div className="xl:hidden w-full overflow-x-auto no-scrollbar border-t border-slate-200/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md px-3 py-2">
        <div className="flex items-center gap-1.5 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer min-h-[36px] ${
                  isActive
                    ? "bg-slate-900 text-white dark:bg-emerald-500 dark:text-white shadow-xs font-bold scale-[1.02]"
                    : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400 dark:text-white" : "text-slate-400"}`} />
                <span>{t(tab.labelKey)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Full Dropdown Menu */}
      {menuOpen && (
        <div className="xl:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-3 flex flex-col gap-1 shadow-2xl animate-fadeIn">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-between min-h-[46px] ${
                  isActive
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/30"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:bg-slate-200 dark:active:bg-slate-700"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-emerald-500" : "text-slate-400"}`} />
                  <span>{t(tab.labelKey)}</span>
                </div>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
