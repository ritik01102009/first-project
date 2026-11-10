"use client";

import React, { useState } from "react";
import {
  TrendingDown,
  PiggyBank,
  CreditCard,
  BarChart3,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Calendar,
  Layers,
  FileText,
  Clock,
  Compass,
  DollarSign
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

interface DashboardOverviewProps {
  onNavigate: (tab: string) => void;
}

export function DashboardOverview({ onNavigate }: DashboardOverviewProps) {
  const { t, language } = useLanguage();
  const [strategy, setStrategy] = useState<"snowball" | "avalanche">("snowball");

  const isJa = language === "ja";

  const tools = [
    {
      id: "budget",
      num: "01",
      title: isJa ? "直感的な家計管理" : "Intuitive Budget Tracker",
      subtitle: isJa ? "古典家計簿4大柱" : "Kakeibo 4-Pillar Matrix",
      description: isJa
        ? "消費・浪費・教養投資・予備の4大柱で支出を整流化。リアルタイムの円弧チャートと日別推移カーブで支出ペースを把握。"
        : "Categorize spending into Needs, Wants, Culture, and Reserves. Monitor daily spending velocity and category balance with live analytics.",
      color: "from-amber-600 to-rose-600",
      accent: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/10",
    },
    {
      id: "debt",
      num: "02",
      icon: CreditCard,
      title: isJa ? "アルゴリズム負債返済" : "Algorithmic Debt Payoff",
      subtitle: isJa ? "スノーボール vs アバランチ" : "Snowball vs Avalanche",
      description: isJa
        ? "数学的利息最小化と心理的達成感の2大戦略をリアルタイム比較。枯山水の飛び石のように着実に完済の禅の門へ。"
        : "Compare optimal Avalanche interest savings against empowering Snowball quick wins with interactive milestone projections.",
      color: "from-emerald-600 to-teal-500",
      accent: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      id: "savings",
      num: "03",
      icon: PiggyBank,
      title: isJa ? "心静かな貯蓄目標" : "Mindful Savings Goals",
      subtitle: isJa ? "生活防衛資金・目標追跡" : "Emergency Cushion & Milestones",
      description: isJa
        ? "生活防衛資金や特別支出の目標を設定し、進捗リングで可視化。焦りのない持続可能な資産形成ルーティンを確立。"
        : "Establish emergency reserves and life milestones. Track steady progress rings without financial anxiety.",
      color: "from-amber-500 to-yellow-600",
      accent: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10",
    },
    {
      id: "recommender",
      num: "04",
      icon: BarChart3,
      title: isJa ? "最適返済診断 (AI)" : "Smart Method Finder",
      subtitle: isJa ? "4問の診断で道筋を発見" : "4-Question Strategy Quiz",
      description: isJa
        ? "借入件数や性格、キャッシュフローから最適な返済優先順位をパーソナライズ診断。迷わず今日から実行可能。"
        : "Answer 4 intuitive questions about your debt structure and psychology to receive a customized debt-free roadmap.",
      color: "from-teal-600 to-cyan-500",
      accent: "text-teal-600 dark:text-teal-400",
      bg: "bg-teal-500/10",
    },
  ];

  // Stepping stones data for the Karesansui path
  const stones = [
    {
      step: "01",
      title: isJa ? "個人ローン" : "Personal Loan",
      status: isJa ? "完済" : "Cleared",
      amount: isJa ? "¥450,000" : "$3,000",
      cleared: true,
      active: false,
      date: "Jan 2024",
    },
    {
      step: "02",
      title: isJa ? "PC・機器割賦" : "Tech Financing",
      status: isJa ? "完済" : "Cleared",
      amount: isJa ? "¥280,000" : "$1,850",
      cleared: true,
      active: false,
      date: "Aug 2024",
    },
    {
      step: "03",
      title: isJa ? "学生クレジット" : "Student Credit",
      status: isJa ? "完済" : "Cleared",
      amount: isJa ? "¥1,020,000" : "$6,800",
      cleared: true,
      active: false,
      date: "Feb 2025",
    },
    {
      step: "04",
      title: isJa ? "マイカーローン" : "Auto Loan",
      status: isJa ? "返済中" : "Active",
      amount: isJa ? "残 ¥650,000" : "$4,300 Left",
      cleared: false,
      active: true,
      progress: "78%",
    },
    {
      step: "05",
      title: isJa ? "目的別借入" : "Graduate Note",
      status: isJa ? "次期対象" : "In Queue",
      amount: isJa ? "¥1,200,000" : "$8,000",
      cleared: false,
      active: false,
    },
    {
      step: "06",
      title: isJa ? "禅の門・完済" : "Zen Gate",
      status: isJa ? "目標" : "Goal",
      amount: isJa ? "¥0 自由への到達" : "$0 Balance",
      cleared: false,
      active: false,
      isGoal: true,
    },
  ];

  return (
    <div className="space-y-12">
      {/* ============================================================== */}
      {/* 1. HERO SECTION: Rising Sun Halo & Zen Fintech Japanese Craft  */}
      {/* ============================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-surface-washi dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-8 sm:p-12 shadow-xl">
        {/* Rising Hinomaru Sun Halo Gradient Background */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[580px] h-[580px] rounded-full pointer-events-none blur-3xl opacity-35 dark:opacity-20 -z-0"
          style={{
            background:
              "radial-gradient(circle, rgba(199,71,54,0.45) 0%, rgba(198,166,107,0.2) 50%, transparent 70%)",
          }}
        />

        {/* Japanese Hanko (Seal) in Top Right */}
        <div className="absolute top-6 right-6 hidden sm:flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-rose-600/10 dark:bg-rose-500/20 border border-rose-600/30 text-rose-600 dark:text-rose-400 font-serif-jp font-bold text-xs select-none shadow-xs">
          <span>家計</span>
          <span>安心</span>
        </div>

        <div className="relative z-10 max-w-3xl">
          {/* Overline Badge */}
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-washi-subtle dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />
              <span>{isJa ? "伝統と革新 • Zen Fintech Craft" : "Tradition & Innovation • Zen Fintech Craft"}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isJa ? "100% 端末内処理・サーバー通信ゼロ" : "100% Client-Side • Zero Server Tracking"}</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 leading-tight mb-4 font-serif-jp">
            {isJa ? "お金の流れを完全にコントロール。" : "Take Control of Your Money."} <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-amber-600 to-emerald-600 dark:from-rose-400 dark:via-amber-300 dark:to-emerald-400 font-normal italic">
              {isJa ? "心静かな家計管理へ。" : "Find Your Financial Balance."}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-2xl">
            {isJa
              ? "お金を整え、暮らしを豊かに。古典家計簿（羽仁もと子式）の知恵と現代フィンテックの融合により、借金完済から毎月の貯蓄まで最短で経済的自由を実現します。"
              : "A peaceful, intentional path toward absolute debt freedom and mindful budget mastery. Blending classical four-pillar Kakeibo wisdom with modern algorithmic clarity."}
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
            <button
              onClick={() => onNavigate("budget")}
              className="btn-sheen px-6 py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isJa ? "家計簿・予算を記録する" : "Open Budget Tracker"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate("debt")}
              className="px-6 py-3.5 rounded-xl bg-surface-container-lowest dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 font-semibold text-sm border border-slate-300/80 dark:border-slate-700 transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{isJa ? "借金返済シミュレーター" : "Debt Payoff Engine"}</span>
            </button>
          </div>
        </div>

        {/* Floating Micro-Metric Tickers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 pt-8 border-t border-slate-200/60 dark:border-slate-800">
          <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xs border border-slate-200/50 dark:border-slate-700/50">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {isJa ? "純資産モニタリング" : "Total Net Assets"}
              </div>
              <div className="text-base font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                {isJa ? "¥1,480,000" : "$96,371"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xs border border-slate-200/50 dark:border-slate-700/50">
            <div className="w-9 h-9 rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {isJa ? "貯蓄余力ペース" : "Savings Velocity"}
              </div>
              <div className="text-base font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                {isJa ? "+18.4% • ¥320,000/月" : "+18.4% • $2,100/mo"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 rounded-xl bg-white/70 dark:bg-slate-800/60 backdrop-blur-xs border border-slate-200/50 dark:border-slate-700/50">
            <div className="w-9 h-9 rounded-lg bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {isJa ? "完済スコア (Freedom)" : "Freedom Score"}
              </div>
              <div className="text-base font-bold text-slate-800 dark:text-slate-100 tabular-nums">
                {isJa ? "94/100 • 15ヶ月で完済" : "94/100 • 15 Mo to 0 Debt"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. KARESANSUI STEPPING STONE GARDEN PATH (枯山水 自由への歩み) */}
      {/* ============================================================== */}
      <section className="zen-card relative rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-sm overflow-hidden">
        {/* Raked sand background wave subtle effect */}
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, #202522, #202522 1px, transparent 1px, transparent 18px)",
          }}
        />

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                  {isJa ? "枯山水 • 自由への歩み" : "Karesansui • The Zen Garden Path to Freedom"}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif-jp">
                {isJa ? "飛び石を渡るように、確実な完済へ。" : "Like Stepping Stones Across a Zen Garden."}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {isJa
                  ? "小口返済（スノーボール）と高金利優先（アバランチ）の2大戦略で、借金の石を一つずつ静かに取り除きます。"
                  : "Every scheduled repayment dissolves burden into serenity. Track each milestone step on the path to zero debt."}
              </p>
            </div>

            {/* Strategy Switcher */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
              <button
                onClick={() => setStrategy("snowball")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  strategy === "snowball"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
                }`}
              >
                {isJa ? "スノーボール式 (達成感優先)" : "Snowball (Quick Wins)"}
              </button>
              <button
                onClick={() => setStrategy("avalanche")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  strategy === "avalanche"
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
                }`}
              >
                {isJa ? "アバランチ式 (利息削減優先)" : "Avalanche (Max Savings)"}
              </button>
            </div>
          </div>

          {/* Stepping Stone Trail Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 my-6">
            {stones.map((st, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl flex flex-col items-center text-center transition-all ${
                  st.cleared
                    ? "bg-emerald-500/10 dark:bg-emerald-950/20 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
                    : st.active
                    ? "bg-rose-50 dark:bg-rose-950/20 border-2 border-rose-500 shadow-md ring-2 ring-rose-500/20"
                    : st.isGoal
                    ? "bg-amber-500/15 dark:bg-amber-950/30 border border-amber-500/40 text-amber-800 dark:text-amber-300"
                    : "bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center mb-2.5 ${
                    st.cleared
                      ? "bg-emerald-600 text-white"
                      : st.active
                      ? "bg-rose-600 text-white animate-pulse"
                      : st.isGoal
                      ? "bg-amber-600 text-white"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-500"
                  }`}
                >
                  {st.cleared ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : st.active ? (
                    <Clock className="w-5 h-5" />
                  ) : st.isGoal ? (
                    <Sparkles className="w-5 h-5" />
                  ) : (
                    <span className="text-xs font-mono font-bold">{st.step}</span>
                  )}
                </div>

                <div className="text-[10px] uppercase font-bold tracking-wider mb-0.5 opacity-80">
                  {st.status}
                </div>
                <div className="text-xs font-bold text-slate-900 dark:text-slate-100">{st.title}</div>
                <div className="text-[11px] font-mono mt-1 font-semibold">{st.amount}</div>

                {st.progress && (
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-rose-600 h-full rounded-full" style={{ width: st.progress }} />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Path Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {isJa ? "現在の残債総額" : "Remaining Debt"}
              </span>
              <div className="text-lg font-bold text-slate-800 dark:text-slate-100 font-mono">
                {isJa ? "¥1,850,000" : "$12,300"}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {isJa ? "毎月の返済配分" : "Monthly Payment"}
              </span>
              <div className="text-lg font-bold text-slate-800 dark:text-slate-100 font-mono">
                {isJa ? "¥125,000" : "$830"}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {isJa ? "完済予定時期" : "Estimated Freedom"}
              </span>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {isJa ? "2026年 8月" : "August 2026"}
              </div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/40">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                {isJa ? "削減される総利息" : "Interest Saved"}
              </span>
              <div className="text-lg font-bold text-amber-600 dark:text-amber-400 font-mono">
                {isJa ? "¥340,000" : "$2,250"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. ARTISANAL BENTO FEATURES MATRIX                             */}
      {/* ============================================================== */}
      <div>
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 uppercase tracking-widest mb-1">
            <Layers className="w-3.5 h-3.5" />
            <span>{isJa ? "洗練された機能群" : "Artisanal Features Suite"}</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif-jp">
            {isJa ? "静寂と明確さをもたらす、4つのコアツール。" : "Crafted for Clarity. Honed by Tradition."}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isJa
              ? "金銭的な不安を取り除き、日々の支出と未来の資産形成をシンプルに統合します。"
              : "Every tool inside KakeiKanri is designed to replace financial anxiety with calm, intentional structure."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.id}
                onClick={() => onNavigate(t.id)}
                className="zen-card p-6 sm:p-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl ${t.bg} ${t.accent} flex items-center justify-center group-hover:scale-105 transition-transform`}
                    >
                      {Icon ? <Icon className="w-6 h-6" /> : null}
                    </div>
                    <span className="font-mono text-xs font-bold text-slate-400 dark:text-slate-500">
                      {t.num} / FEATURE
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">
                    {t.subtitle}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors mb-2.5">
                    {t.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                  <span>{isJa ? "ツールを起動する" : "Open Module"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
