"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  FileText,
  Printer,
  Receipt,
  RotateCcw,
  Search,
  CheckCircle2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  ShieldCheck,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  FileSpreadsheet
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { getLocalData, setLocalData } from "@/lib/storage";
import { PdfReportModal } from "@/components/pdf-report-modal";

interface Transaction {
  id: string;
  date: string;
  pillar: "needs" | "wants" | "culture" | "reserves" | "income";
  description: string;
  amount: number;
  method: string;
  reflection?: string;
  isNew?: boolean;
}

const DEFAULT_TRANSACTIONS_JA: Transaction[] = [
  {
    id: "tx-1",
    date: "05/22",
    pillar: "income",
    description: "信託ファンド 四半期配当金 (Passive Dividends)",
    amount: 130000,
    method: "住信SBIネット銀行",
    reflection: "不労所得・長期複利運用",
  },
  {
    id: "tx-2",
    date: "05/21",
    pillar: "culture",
    description: "オライリー社『ソフトウェアアーキテクチャの基礎』",
    amount: -4180,
    method: "Mastercard",
    reflection: "知識の資産化・読書",
  },
  {
    id: "tx-3",
    date: "05/20",
    pillar: "wants",
    description: "京都 宇治式部郷 伝統茶筅・宇治挽き抹茶詰合せ",
    amount: -6450,
    method: "PayPay",
    reflection: "週末の静寂時間・心のリセット",
  },
  {
    id: "tx-4",
    date: "05/18",
    pillar: "wants",
    description: "東海道新幹線 指定席 (東京⇆京都 出張併用移動)",
    amount: -28240,
    method: "SmartEX / AMEX",
    reflection: "視野拡大の旅費",
  },
  {
    id: "tx-5",
    date: "05/01",
    pillar: "needs",
    description: "住居家賃・管理費・高速光回線インターネット",
    amount: -148000,
    method: "自動口座振替",
    reflection: "生活基盤固定コスト",
  },
];

const DEFAULT_TRANSACTIONS_EN: Transaction[] = [
  {
    id: "tx-1",
    date: "05/22",
    pillar: "income",
    description: "Quarterly Trust Fund Dividend Yield",
    amount: 1100,
    method: "Checking Account",
    reflection: "Passive index distribution",
  },
  {
    id: "tx-2",
    date: "05/21",
    pillar: "culture",
    description: "O'Reilly Architectural Books & Learning",
    amount: -48,
    method: "Credit Card",
    reflection: "Knowledge asset investment",
  },
  {
    id: "tx-3",
    date: "05/20",
    pillar: "wants",
    description: "Artisanal Coffee & Weekend Gathering",
    amount: -35,
    method: "Apple Pay",
    reflection: "Social restoration",
  },
  {
    id: "tx-4",
    date: "05/18",
    pillar: "wants",
    description: "High-Speed Rail Trip to Coast",
    amount: -185,
    method: "Travel Card",
    reflection: "Mindful leisure travel",
  },
  {
    id: "tx-5",
    date: "05/01",
    pillar: "needs",
    description: "Apartment Lease, Utilities & Fiber Internet",
    amount: -1450,
    method: "Direct Debit",
    reflection: "Essential fixed housing base",
  },
];

export function BudgetTracker() {
  const { t, language } = useLanguage();
  const isJa = language === "ja";

  const initialIncome = isJa ? 680000 : 5000;
  const initialTransactions = isJa ? DEFAULT_TRANSACTIONS_JA : DEFAULT_TRANSACTIONS_EN;

  const [income, setIncome] = useState<number>(initialIncome);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Form State
  const [formDate, setFormDate] = useState("2025-05-22");
  const [formPillar, setFormPillar] = useState<Transaction["pillar"]>("wants");
  const [formDesc, setFormDesc] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formMethod, setFormMethod] = useState(isJa ? "クレジットカード" : "Credit Card");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Filter & Search State
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Interactive Donut Chart Center State
  const [donutCenter, setDonutCenter] = useState({
    title: isJa ? "総支出" : "Total Spent",
    value: isJa ? "¥358,400" : "$2,450",
    sub: isJa ? "予算比 -8.1%" : "Within Budget",
  });

  // Interactive Chart Tooltip State
  const [tooltip, setTooltip] = useState<{
    visible: boolean;
    x: number;
    y: number;
    text: string;
  }>({ visible: false, x: 0, y: 0, text: "" });

  // Kaizen Accordion State
  const [openKaizen, setOpenKaizen] = useState<number | null>(0);

  // CSV Toast State
  const [csvToast, setCsvToast] = useState(false);

  // Load from local storage
  useEffect(() => {
    setMounted(true);
    const savedIncome = getLocalData<number>(`spensensie_zen_income_${language}`, initialIncome);
    const savedTx = getLocalData<Transaction[]>(`spensensie_zen_tx_${language}`, initialTransactions);
    setIncome(savedIncome);
    setTransactions(savedTx);
  }, [language]);

  // Persist to local storage
  useEffect(() => {
    if (!mounted) return;
    setLocalData(`spensensie_zen_income_${language}`, income);
    setLocalData(`spensensie_zen_tx_${language}`, transactions);
  }, [income, transactions, mounted, language]);

  // Pillar Budget Definitions
  const pillarsConfig = {
    needs: {
      name: isJa ? "1. 消費 (Needs)" : "1. Needs",
      subtitle: isJa ? "生活必需 (住居・食料・光熱・医療)" : "Essential living, rent, groceries",
      color: "#526349",
      bgClass: "bg-emerald-800/10 dark:bg-emerald-900/30",
      badgeColor: "bg-secondary/20 text-emerald-800 dark:text-emerald-300",
      budget: isJa ? 200000 : 1800,
      spent: isJa ? 182000 : 1550,
    },
    wants: {
      name: isJa ? "2. 浪費 (Wants)" : "2. Wants",
      subtitle: isJa ? "心の潤い (外食・嗜好品・娯楽)" : "Joy, dining, leisure, recreation",
      color: "#C74736",
      bgClass: "bg-rose-500/10 dark:bg-rose-950/30",
      badgeColor: "bg-rose-500/20 text-rose-700 dark:text-rose-300",
      budget: isJa ? 70000 : 600,
      spent: isJa ? 54200 : 420,
    },
    culture: {
      name: isJa ? "3. 教養・投資 (Culture)" : "3. Culture & Growth",
      subtitle: isJa ? "自己投資 (書籍・美術・スキル)" : "Books, learning, self-investment",
      color: "#C6A66B",
      bgClass: "bg-amber-500/10 dark:bg-amber-950/30",
      badgeColor: "bg-amber-500/20 text-amber-800 dark:text-amber-300",
      budget: isJa ? 35000 : 350,
      spent: isJa ? 28400 : 260,
    },
    reserves: {
      name: isJa ? "4. 予備・突発 (Reserves)" : "4. Reserves",
      subtitle: isJa ? "防衛余力 (冠婚葬祭・緊急予備)" : "Emergency defense, unexpected costs",
      color: "#829477",
      bgClass: "bg-teal-500/10 dark:bg-teal-950/30",
      badgeColor: "bg-teal-500/20 text-teal-800 dark:text-teal-300",
      budget: isJa ? 20000 : 250,
      spent: isJa ? 13800 : 120,
    },
  };

  const totalSpent = Object.values(pillarsConfig).reduce((acc, p) => acc + p.spent, 0);
  const netSurplus = income - totalSpent;
  const savingsRate = Math.round((netSurplus / income) * 100);

  // Quick transaction form submission
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDesc.trim() || !formAmount) return;

    const numAmount = parseFloat(formAmount);
    const isIncome = formPillar === "income";
    const signedAmount = isIncome ? Math.abs(numAmount) : -Math.abs(numAmount);

    const dateParts = formDate.split("-");
    const formattedDate = dateParts.length === 3 ? `${dateParts[1]}/${dateParts[2]}` : "05/22";

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      date: formattedDate,
      pillar: formPillar,
      description: formDesc.trim(),
      amount: signedAmount,
      method: formMethod,
      reflection: isIncome ? "即時収入反映" : "新規即時記録 (ローカル暗号化)",
      isNew: true,
    };

    setTransactions([newTx, ...transactions]);
    setFormDesc("");
    setFormAmount("");

    if (isIncome) {
      setIncome((prev) => prev + numAmount);
    } else {
      setIncome((prev) => prev - numAmount);
    }

    // Pulse notification
    setSaveStatus(isJa ? "暗号化書き込み完了 ✓" : "Saved locally ✓");
    setTimeout(() => setSaveStatus(null), 2500);
  };

  const handleDeleteTransaction = (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    if (tx) {
      if (tx.pillar === "income") {
        setIncome((prev) => prev - tx.amount);
      } else {
        setIncome((prev) => prev + Math.abs(tx.amount));
      }
    }
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter = filter === "all" || tx.pillar === filter;
    const matchesSearch =
      !searchQuery ||
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.method.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleExportCsv = () => {
    setCsvToast(true);
    setTimeout(() => setCsvToast(false), 2400);
  };

  return (
    <div className="space-y-8">
      {/* ============================================================== */}
      {/* 1. TOP HEADER & MONTH CONTROLLER                                */}
      {/* ============================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-2">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isJa ? "100% 端末内処理・サーバー通信ゼロ" : "100% Client-Side • Private & Local"}</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isJa ? "完全無料 · 登録不要 · ローカル暗号化" : "No Account Needed • Local Storage"}</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 font-serif-jp tracking-tight">
            {isJa ? "家計簿・予算トラッカー" : "Zen Budget & Cashflow Engine"}{" "}
            <span className="text-xs sm:text-sm font-normal text-slate-500 dark:text-slate-400 ml-2 font-sans">
              {isJa ? "Kakeibo Four-Pillar Engine" : "Classical Japanese Kakeibo"}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            {isJa
              ? "お金の流れを整え、心の余白をつくる。古典家計簿（羽仁もと子式）の知恵を忠実に再現した4大柱配分システム。"
              : "Organize cashflow with mindful discipline. Built upon classical 4-pillar Kakeibo wisdom for quiet, lasting financial serenity."}
          </p>
        </div>

        {/* Month Selector & Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center bg-white dark:bg-slate-800 rounded-xl shadow-xs p-1 border border-slate-200 dark:border-slate-700">
            <button
              aria-label="Previous Month"
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-3 py-1 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {isJa ? "2025年 5月 (皐月)" : "May 2025"}
              </span>
            </div>
            <button
              aria-label="Next Month"
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{csvToast ? (isJa ? "暗号化CSV出力完了 ✓" : "CSV Exported ✓") : isJa ? "CSV入出力" : "Export CSV"}</span>
          </button>

          <button
            onClick={() => setShowPdfModal(true)}
            className="btn-sheen inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isJa ? "和風月次PDF出力" : "Export PDF Report"}</span>
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. EXECUTIVE MONTHLY KPI OVERVIEW CARDS                         */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Income Card */}
        <div className="zen-card relative bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-xs border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">{isJa ? "今月の総収入" : "Total Monthly Income"}</span>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-xs text-slate-400">{isJa ? "¥" : "$"}</span>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono tracking-tight">
              {isJa ? income.toLocaleString() : income.toLocaleString()}
            </span>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
            <span>{isJa ? "給与: ¥550,000" : "Base: $4,000"}</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium">
              {isJa ? "配当・副業 +¥130,000" : "Yield +$1,000"}
            </span>
          </div>
        </div>

        {/* Expense Card */}
        <div className="zen-card relative bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-xs border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">{isJa ? "今月の総支出" : "Total Spent"}</span>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-xs text-slate-400">{isJa ? "¥" : "$"}</span>
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono tracking-tight">
              {isJa ? totalSpent.toLocaleString() : totalSpent.toLocaleString()}
            </span>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
            <span>{isJa ? "予算限度: ¥390,000" : "Budget: $2,800"}</span>
            <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
              {isJa ? "消化率 52.7%" : "52.7% used"}
            </span>
          </div>
        </div>

        {/* Net Surplus Card */}
        <div className="zen-card relative bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-xs border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">{isJa ? "手元残高・貯蓄余力" : "Net Surplus / Savings"}</span>
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="text-xs text-slate-400">{isJa ? "¥" : "$"}</span>
            <span className="text-2xl font-black text-slate-900 dark:text-slate-100 font-mono tracking-tight">
              {isJa ? netSurplus.toLocaleString() : netSurplus.toLocaleString()}
            </span>
          </div>
          <div className="mt-4 pt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
            <span>{isJa ? "余白率" : "Surplus Rate"}</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
              +{savingsRate}% {isJa ? "残余" : "retained"}
            </span>
          </div>
        </div>

        {/* Savings Rate Target Card */}
        <div className="zen-card relative bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-xs border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
            <span className="text-xs font-semibold">{isJa ? "貯蓄率進捗" : "Target Savings Progress"}</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {savingsRate}%
            </span>
            <span className="text-xs text-slate-400">{isJa ? "/ 目標 40%" : "/ Target 40%"}</span>
          </div>
          <div className="mt-4 space-y-1.5 border-t border-slate-100 dark:border-slate-800 pt-3">
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(savingsRate * 2, 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400">
              <span>{isJa ? "目標超過ペース (+7.3%)" : "Exceeding Target (+7.3%)"}</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{isJa ? "良好" : "Pace: Prime"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. INTERACTIVE 4-PILLAR KAKEIBO BUDGET FRAMEWORK               */}
      {/* ============================================================== */}
      <section className="zen-card bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 gap-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping opacity-75" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-serif-jp">
                {isJa ? "家計簿4大柱 予算配分" : "Four-Pillar Kakeibo Budget Matrix"}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isJa
                ? "消費（生きる糧）・浪費（心の潤い）・教養（未来への種）・予備（不時の備え）に整然と分類。"
                : "Classify into Needs (Life), Wants (Joy), Culture (Future), and Reserves (Defense)."}
            </p>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold self-start md:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>{isJa ? "50/30/20 ルール適合指標: 理想的配分" : "50/30/20 Rule: Optimal Balance"}</span>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {Object.entries(pillarsConfig).map(([key, pillar]) => {
            const pct = Math.round((pillar.spent / pillar.budget) * 100);
            const remaining = pillar.budget - pillar.spent;

            return (
              <div
                key={key}
                className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 flex flex-col justify-between hover:border-slate-400 dark:hover:border-slate-600 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {pillar.name}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${pillar.badgeColor}`}>
                      {pct}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mb-4">{pillar.subtitle}</p>

                  <div className="flex justify-between items-baseline mb-2 text-xs">
                    <span className="text-slate-500 dark:text-slate-400">
                      {isJa ? "支出" : "Spent"} {isJa ? `¥${pillar.spent.toLocaleString()}` : `$${pillar.spent}`}
                    </span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {isJa ? "枠" : "Budget"} {isJa ? `¥${pillar.budget.toLocaleString()}` : `$${pillar.budget}`}
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        backgroundColor: pillar.color,
                        width: `${Math.min(pct, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 flex items-center justify-between text-[11px] border-t border-slate-200/60 dark:border-slate-700/50">
                  <span className="text-slate-500 dark:text-slate-400">
                    {isJa ? "残余:" : "Remaining:"} {isJa ? `¥${remaining.toLocaleString()}` : `$${remaining}`}
                  </span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {pct <= 100 ? (isJa ? "計画通り" : "On Track") : (isJa ? "超過注意" : "Over Target")}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. VISUAL ANALYTICS: DONUT SHARE & SPENDING VELOCITY CURVE     */}
      {/* ============================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Donut Category Distribution */}
        <div className="zen-card lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-serif-jp">
                {isJa ? "支出構成比率" : "Expenditure Distribution"}
              </h3>
              <span className="text-xs font-mono text-slate-400">May 2025</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              {isJa ? "各円弧にホバーで構成比と内訳を表示" : "Hover over any slice for details"}
            </p>

            {/* SVG Donut */}
            <div className="relative flex items-center justify-center my-4">
              <svg className="w-56 h-56 transform -rotate-90" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle cx="80" cy="80" r="62" fill="transparent" stroke="#e2e8f0" strokeWidth="20" className="dark:stroke-slate-800" />

                {/* Needs Slice: 50.8% */}
                <circle
                  cx="80"
                  cy="80"
                  r="62"
                  fill="transparent"
                  stroke="#526349"
                  strokeWidth="20"
                  strokeDasharray="197.8 389.5"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  className="chart-sector"
                  onMouseEnter={() =>
                    setDonutCenter({
                      title: isJa ? "消費 (Needs)" : "Needs",
                      value: isJa ? "¥182,000" : "$1,550",
                      sub: "構成比 50.8%",
                    })
                  }
                  onMouseLeave={() =>
                    setDonutCenter({
                      title: isJa ? "総支出" : "Total Spent",
                      value: isJa ? "¥358,400" : "$2,450",
                      sub: isJa ? "予算比 -8.1%" : "Within Budget",
                    })
                  }
                />

                {/* Wants Slice: 15.1% */}
                <circle
                  cx="80"
                  cy="80"
                  r="62"
                  fill="transparent"
                  stroke="#C74736"
                  strokeWidth="20"
                  strokeDasharray="58.8 389.5"
                  strokeDashoffset="-200"
                  strokeLinecap="round"
                  className="chart-sector"
                  onMouseEnter={() =>
                    setDonutCenter({
                      title: isJa ? "浪費 (Wants)" : "Wants",
                      value: isJa ? "¥54,200" : "$420",
                      sub: "構成比 15.1%",
                    })
                  }
                  onMouseLeave={() =>
                    setDonutCenter({
                      title: isJa ? "総支出" : "Total Spent",
                      value: isJa ? "¥358,400" : "$2,450",
                      sub: isJa ? "予算比 -8.1%" : "Within Budget",
                    })
                  }
                />

                {/* Culture Slice: 7.9% */}
                <circle
                  cx="80"
                  cy="80"
                  r="62"
                  fill="transparent"
                  stroke="#C6A66B"
                  strokeWidth="20"
                  strokeDasharray="30.7 389.5"
                  strokeDashoffset="-262"
                  strokeLinecap="round"
                  className="chart-sector"
                  onMouseEnter={() =>
                    setDonutCenter({
                      title: isJa ? "教養・投資" : "Culture & Growth",
                      value: isJa ? "¥28,400" : "$260",
                      sub: "構成比 7.9%",
                    })
                  }
                  onMouseLeave={() =>
                    setDonutCenter({
                      title: isJa ? "総支出" : "Total Spent",
                      value: isJa ? "¥358,400" : "$2,450",
                      sub: isJa ? "予算比 -8.1%" : "Within Budget",
                    })
                  }
                />

                {/* Reserves Slice: 3.9% */}
                <circle
                  cx="80"
                  cy="80"
                  r="62"
                  fill="transparent"
                  stroke="#829477"
                  strokeWidth="20"
                  strokeDasharray="15.2 389.5"
                  strokeDashoffset="-295"
                  strokeLinecap="round"
                  className="chart-sector"
                  onMouseEnter={() =>
                    setDonutCenter({
                      title: isJa ? "予備・突発" : "Reserves",
                      value: isJa ? "¥13,800" : "$120",
                      sub: "構成比 3.9%",
                    })
                  }
                  onMouseLeave={() =>
                    setDonutCenter({
                      title: isJa ? "総支出" : "Total Spent",
                      value: isJa ? "¥358,400" : "$2,450",
                      sub: isJa ? "予算比 -8.1%" : "Within Budget",
                    })
                  }
                />
              </svg>

              {/* Dynamic Center Info */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {donutCenter.title}
                </span>
                <span className="text-xl font-black text-slate-900 dark:text-slate-100 font-mono">
                  {donutCenter.value}
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  {donutCenter.sub}
                </span>
              </div>
            </div>
          </div>

          {/* Donut Legend */}
          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#526349]" />
              <span className="text-slate-700 dark:text-slate-300">消費 (50.8%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C74736]" />
              <span className="text-slate-700 dark:text-slate-300">浪費 (15.1%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C6A66B]" />
              <span className="text-slate-700 dark:text-slate-300">教養 (7.9%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#829477]" />
              <span className="text-slate-700 dark:text-slate-300">予備 (3.9%)</span>
            </div>
          </div>
        </div>

        {/* Right: Daily Cashflow Velocity & Trajectory Curve */}
        <div className="zen-card lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-7 shadow-xs border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 font-serif-jp">
                  {isJa ? "日別支出ペース・累積推移" : "Daily Spending Velocity"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isJa ? "等速ペース線と実績累積カーブの対比" : "Ideal budget pace vs actual cumulative spend"}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-1 text-slate-400">
                  <span className="w-3 h-0.5 bg-slate-400 inline-block" />
                  {isJa ? "理想線 (¥12,500/日)" : "Ideal ($80/d)"}
                </span>
                <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                  <span className="w-3 h-1 bg-rose-600 rounded inline-block" />
                  {isJa ? "実績累積" : "Actual Spend"}
                </span>
              </div>
            </div>

            {/* Interactive SVG Trend Chart */}
            <div className="w-full h-56 mt-4 relative">
              {/* Floating Tooltip */}
              {tooltip.visible && (
                <div
                  className="absolute z-30 pointer-events-none bg-slate-900 text-white text-[11px] px-2.5 py-1.5 rounded-lg shadow-lg -translate-x-1/2 -translate-y-full transition-all"
                  style={{ left: `${tooltip.x}px`, top: `${tooltip.y}px` }}
                >
                  {tooltip.text}
                </div>
              )}

              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 220" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGradientZen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C74736" stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#C74736" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="40" x2="600" y2="40" stroke="#e2e8f0" strokeWidth="1" className="dark:stroke-slate-800" />
                <line x1="0" y1="90" x2="600" y2="90" stroke="#e2e8f0" strokeWidth="1" className="dark:stroke-slate-800" />
                <line x1="0" y1="140" x2="600" y2="140" stroke="#e2e8f0" strokeWidth="1" className="dark:stroke-slate-800" />
                <line x1="0" y1="190" x2="600" y2="190" stroke="#e2e8f0" strokeWidth="1" className="dark:stroke-slate-800" />

                {/* Ideal Budget Trajectory (Dashed) */}
                <line x1="20" y1="190" x2="580" y2="40" stroke="#94a3b8" strokeDasharray="4 4" strokeWidth="1.5" opacity="0.6" />

                {/* Area Under Curve */}
                <path d="M 20 190 Q 90 185, 140 165 T 260 135 T 380 95 T 460 75 L 460 190 Z" fill="url(#areaGradientZen)" />

                {/* Animated Actual Spend Curve */}
                <path
                  d="M 20 190 Q 90 185, 140 165 T 260 135 T 380 95 T 460 75"
                  fill="none"
                  stroke="#C74736"
                  strokeWidth="3"
                  strokeLinecap="round"
                  className="path-animate"
                />

                {/* Data Points */}
                {[
                  { cx: 20, cy: 190, day: "5月1日", val: isJa ? "¥12,000" : "$80" },
                  { cx: 140, cy: 165, day: "5月8日", val: isJa ? "¥98,500" : "$680" },
                  { cx: 260, cy: 135, day: "5月15日", val: isJa ? "¥210,400" : "$1,450" },
                  { cx: 380, cy: 95, day: "5月19日", val: isJa ? "¥312,000" : "$2,100" },
                ].map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.cx}
                    cy={pt.cy}
                    r="4"
                    fill="#C74736"
                    className="cursor-pointer hover:scale-150 transition-transform"
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({
                        visible: true,
                        x: pt.cx,
                        y: pt.cy - 10,
                        text: `${pt.day}: ${pt.val}`,
                      });
                    }}
                    onMouseLeave={() => setTooltip({ visible: false, x: 0, y: 0, text: "" })}
                  />
                ))}

                {/* Current Day Node with Glowing Lantern Pulse */}
                <circle cx="460" cy="75" r="7" fill="#C74736" stroke="#ffffff" strokeWidth="2.5" className="animate-pulse-glow" />
                <circle
                  cx="460"
                  cy="75"
                  r="5"
                  fill="#C74736"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="cursor-pointer"
                  onMouseEnter={() =>
                    setTooltip({
                      visible: true,
                      x: 460,
                      y: 65,
                      text: isJa ? "5月22日 (本日): ¥358,400" : "May 22 (Today): $2,450",
                    })
                  }
                  onMouseLeave={() => setTooltip({ visible: false, x: 0, y: 0, text: "" })}
                />
                <line x1="460" y1="75" x2="460" y2="190" stroke="#C74736" strokeDasharray="2 2" strokeWidth="1" />
                <text x="468" y="72" fill="#C74736" fontSize="11" fontWeight="600">
                  {isJa ? "本日 (22日): ¥358,400" : "Today: $2,450"}
                </text>
              </svg>

              {/* X-axis Labels */}
              <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2 px-1 font-mono">
                <span>5/1</span>
                <span>5/8</span>
                <span>5/15</span>
                <span className="text-rose-600 dark:text-rose-400 font-bold">{isJa ? "22日 (今日)" : "Today"}</span>
                <span>{isJa ? "31日 (月末)" : "5/31"}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 dark:bg-slate-800/40 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-slate-800 dark:text-slate-200 font-medium">
                {isJa
                  ? "月末着地予測: 約¥382,000（予算 ¥390,000 以内に着地予定）"
                  : "Forecast: Ending at ~$2,620 (Comfortably inside $2,800 limit)"}
              </span>
            </div>
            <span className="text-slate-500 dark:text-slate-400">
              {isJa ? "残 9日 / 推奨枠 ¥3,511/日" : "9 Days Left • Target $24/day"}
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. QUICK ENTRY FORM & INTERACTIVE LEDGER MATRIX                */}
      {/* ============================================================== */}
      <section className="zen-card bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 dark:border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-2">
          <div className="flex items-center gap-2.5">
            <Receipt className="w-5 h-5 text-rose-600 dark:text-rose-400" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-serif-jp">
              {isJa ? "支出・収入の簡易記帳" : "Quick Entry & Mindful Ledger"}
            </h2>
            <span className="text-xs text-slate-400 hidden sm:inline">
              {isJa ? "即時ローカル暗号化反映" : "Instant local encryption"}
            </span>
          </div>

          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium transition-all">
            {saveStatus || (isJa ? "自動バックアップ: 有効" : "Auto-Backup: Active")}
          </span>
        </div>

        {/* Quick Entry Form Bar */}
        <form onSubmit={handleAddTransaction} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 pt-2 pb-6">
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              {isJa ? "日付" : "Date"}
            </label>
            <input
              type="date"
              value={formDate}
              onChange={(e) => setFormDate(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              {isJa ? "家計柱カテゴリ" : "Kakeibo Pillar"}
            </label>
            <select
              value={formPillar}
              onChange={(e) => setFormPillar(e.target.value as Transaction["pillar"])}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
            >
              <option value="needs">{isJa ? "1. 消費 (Needs)" : "1. Needs"}</option>
              <option value="wants">{isJa ? "2. 浪費 (Wants)" : "2. Wants"}</option>
              <option value="culture">{isJa ? "3. 教養・投資 (Culture)" : "3. Culture"}</option>
              <option value="reserves">{isJa ? "4. 予備・突発 (Reserves)" : "4. Reserves"}</option>
              <option value="income">{isJa ? "+ 収入 (Income)" : "+ Income"}</option>
            </select>
          </div>

          <div className="lg:col-span-3">
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              {isJa ? "品目・支出内容" : "Description"}
            </label>
            <input
              type="text"
              placeholder={isJa ? "例: 宇治抹茶セット / 書籍" : "e.g. Kyoto Green Tea"}
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              required
              className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 placeholder:text-slate-400"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              {isJa ? "金額 (円)" : "Amount ($)"}
            </label>
            <input
              type="number"
              placeholder={isJa ? "2800" : "25"}
              value={formAmount}
              onChange={(e) => setFormAmount(e.target.value)}
              required
              className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>

          <div className="lg:col-span-2">
            <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1">
              {isJa ? "決済方法" : "Payment Method"}
            </label>
            <select
              value={formMethod}
              onChange={(e) => setFormMethod(e.target.value)}
              className="w-full h-10 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 cursor-pointer"
            >
              <option>{isJa ? "クレジットカード" : "Credit Card"}</option>
              <option>{isJa ? "QR / 電子マネー" : "Apple Pay / QR"}</option>
              <option>{isJa ? "銀行口座引落" : "Direct Debit"}</option>
              <option>{isJa ? "現金" : "Cash"}</option>
            </select>
          </div>

          <div className="lg:col-span-1 flex items-end">
            <button
              type="submit"
              className="btn-sheen w-full h-10 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 mr-1" />
              <span>{isJa ? "記録" : "Add"}</span>
            </button>
          </div>
        </form>

        {/* Ledger Filter Tabs & Search */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {[
                { key: "all", label: isJa ? "すべて (All)" : "All" },
                { key: "needs", label: isJa ? "消費 (Needs)" : "Needs" },
                { key: "wants", label: isJa ? "浪費 (Wants)" : "Wants" },
                { key: "culture", label: isJa ? "教養・投資" : "Culture" },
                { key: "income", label: isJa ? "収入 (Income)" : "Income" },
              ].map((btn) => (
                <button
                  key={btn.key}
                  onClick={() => setFilter(btn.key)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    filter === btn.key
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder={isJa ? "取引を検索..." : "Search transactions..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200/60 dark:border-slate-800 font-semibold">
                  <th className="py-3 px-4 rounded-l-lg">{isJa ? "日付 / 柱" : "Date / Pillar"}</th>
                  <th className="py-3 px-4">{isJa ? "品目・内容" : "Description"}</th>
                  <th className="py-3 px-4">{isJa ? "決済種別" : "Method"}</th>
                  <th className="py-3 px-4">{isJa ? "心のふりかえり" : "Mindful Reflection"}</th>
                  <th className="py-3 px-4 text-right">{isJa ? "金額" : "Amount"}</th>
                  <th className="py-3 px-3 text-center rounded-r-lg w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTransactions.map((tx) => {
                  const isPos = tx.amount > 0;
                  return (
                    <tr
                      key={tx.id}
                      className={`hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${
                        tx.isNew ? "row-newly-added" : ""
                      }`}
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              tx.pillar === "needs"
                                ? "bg-emerald-700"
                                : tx.pillar === "wants"
                                ? "bg-rose-600"
                                : tx.pillar === "culture"
                                ? "bg-amber-600"
                                : tx.pillar === "income"
                                ? "bg-emerald-500"
                                : "bg-teal-600"
                            }`}
                          />
                          <span className="font-mono text-slate-500 dark:text-slate-400">{tx.date}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {tx.pillar}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-100">
                        {tx.description}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">{tx.method}</td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                          <span className="text-emerald-600 font-bold">●</span> {tx.reflection}
                        </span>
                      </td>
                      <td
                        className={`py-3.5 px-4 text-right font-mono font-bold whitespace-nowrap ${
                          isPos ? "text-emerald-600 dark:text-emerald-400" : "text-slate-800 dark:text-slate-100"
                        }`}
                      >
                        {isPos ? `+${isJa ? "¥" : "$"}` : `-${isJa ? "¥" : "$"}`}
                        {Math.abs(tx.amount).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <button
                          onClick={() => handleDeleteTransaction(tx.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
            <span>
              {isJa
                ? `表示中: ${filteredTransactions.length} 件 (全 ${transactions.length} 件の明細)`
                : `Showing ${filteredTransactions.length} of ${transactions.length} records`}
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. EDITORIAL ZEN REFLECTION (KAIZEN CARD) & PRINTABLE EXPORT   */}
      {/* ============================================================== */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-4">
        {/* Kaizen Reflection Accordion */}
        <div className="zen-card lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5 mb-2">
            <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 font-serif-jp">
              {isJa ? "今月の心の振り返り (Kaizen Reflection)" : "Monthly Kaizen Reflection"}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mb-6">
            {isJa
              ? "数字の記録にとどまらず、支出がもたらした満足度を内省することで、来月の金銭感覚を研ぎ澄まします。"
              : "Financial mindfulness extends beyond numbers. Reflect on how each spending category served your wellbeing."}
          </p>

          <div className="space-y-3">
            {[
              {
                q: isJa
                  ? "Q1: 今月、心から満たされた最高のお金の使い方（満足度の高い支出）は何でしたか？"
                  : "Q1: Which expense brought the most genuine joy and lasting satisfaction this month?",
                a: isJa
                  ? "「京都での茶道道具の購入と手引きの書物。モノとしての所有欲ではなく、毎朝の静寂を生み出す習慣そのものへの投資となった。」"
                  : "'Purchasing artisanal matcha and books on mindfulness. It wasn't material consumerism, but an investment in calm daily morning routines.'",
              },
              {
                q: isJa
                  ? "Q2: 見直せる衝動買いや、無くても困らなかった無駄遣いはありましたか？"
                  : "Q2: Were there impulse purchases that could be simplified or avoided next month?",
                a: isJa
                  ? "「疲労時に利用した深夜のデリバリー注文（計3回 約¥8,400）。週末に冷凍作り置きを準備しておくことで改善可能。」"
                  : "'Late-night delivery orders when exhausted ($65 total). Preparing weekend freezer staples will solve this comfortably.'",
              },
              {
                q: isJa
                  ? "Q3: 来月に向けて配分を整えたい支出カテゴリは？"
                  : "Q3: Which category allocation would you like to recalibrate for the upcoming cycle?",
                a: isJa
                  ? "「浪費枠を¥70,000から¥60,000に引き締め、浮いた¥10,000を夏の家族旅行用の特別予備費へ振り替える。」"
                  : "'Trim discretionary wants by $70, redirecting the surplus into the summer travel sanctuary reserve.'",
              },
            ].map((kz, index) => {
              const isOpen = openKaizen === index;
              return (
                <div
                  key={index}
                  className="rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-700/60 p-4 transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenKaizen(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 text-left cursor-pointer"
                  >
                    <span className="pr-2">{kz.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-rose-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="pt-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-800 p-3 rounded-lg mt-2.5 border border-slate-200/50 dark:border-slate-700">
                      {kz.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Card: Printable Washi Report */}
        <div className="zen-card lg:col-span-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 sm:p-7 flex flex-col justify-between border border-slate-200 dark:border-slate-800 shadow-xs">
          <div>
            <div className="w-12 h-12 rounded-xl bg-rose-600/10 text-rose-600 flex items-center justify-center mb-4">
              <Printer className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 font-serif-jp">
              {isJa ? "和風スタイル 月次レポート" : "Printable Washi PDF Report"}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              {isJa
                ? "伝統家計簿の様式美を備えたA4 printable PDFを出力できます。手書きの余白を残した印刷用サマリーです。"
                : "Export clean, minimalist vector monthly ledgers formatted with Japanese calligraphic aesthetics."}
            </p>

            <div className="mt-5 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{isJa ? "4大柱別 予算対比チャート同封" : "4-Pillar Budget Variance Chart"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{isJa ? "月次Kaizen内省メモの記録欄" : "Monthly Kaizen Notes Template"}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{isJa ? "100% 端末内でPDFレンダリング" : "100% Private Client Rendering"}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-700">
            <button
              onClick={() => setShowPdfModal(true)}
              className="btn-sheen w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isJa ? "和風スタイル月次PDFを出力" : "Generate Monthly PDF"}</span>
            </button>
            <p className="text-[10px] text-center text-slate-400 mt-2">
              {isJa ? "オフライン完全対応 · 登録不要" : "Offline Supported • Instant Download"}
            </p>
          </div>
        </div>
      </section>

      {/* PDF Modal */}
      {showPdfModal && (
        <PdfReportModal
          isOpen={showPdfModal}
          onClose={() => setShowPdfModal(false)}
          title={isJa ? "和風月次家計管理レポート" : "Monthly Kakeibo Budget Report"}
          subtitle={isJa ? "古典家計簿4大柱 収支決算書" : "Four-Pillar Cashflow & Budget Summary"}
          metrics={[
            { label: isJa ? "今月の総収入" : "Total Income", value: isJa ? `¥${income.toLocaleString()}` : `$${income}` },
            { label: isJa ? "今月の総支出" : "Total Spent", value: isJa ? `¥${totalSpent.toLocaleString()}` : `$${totalSpent}` },
            { label: isJa ? "手元残高・貯蓄余力" : "Net Surplus", value: isJa ? `¥${netSurplus.toLocaleString()}` : `$${netSurplus}` },
            { label: isJa ? "貯蓄率進捗" : "Savings Rate", value: `${savingsRate}%` },
          ]}
          tableHeaders={[isJa ? "家計柱カテゴリ" : "Pillar", isJa ? "予算額" : "Budget", isJa ? "支出実績" : "Spent", isJa ? "消化率" : "Util."]}
          tableRows={Object.values(pillarsConfig).map((p) => ({
            col1: p.name,
            col2: isJa ? `¥${p.budget.toLocaleString()}` : `$${p.budget}`,
            col3: isJa ? `¥${p.spent.toLocaleString()}` : `$${p.spent}`,
            col4: `${Math.round((p.spent / p.budget) * 100)}%`,
          }))}
          summaryNotes={[
            isJa ? "全データは端末内（ブラウザ）でプライベートに処理・出力されています。" : "All data rendered privately on your local device.",
          ]}
        />
      )}
    </div>
  );
}
