"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, Plus, Trash2, Calendar, RefreshCw, AlertCircle, DollarSign, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { getLocalData, setLocalData } from "@/lib/storage";

interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: "monthly" | "yearly";
  category: string;
  nextRenewalDate?: string;
}

const DEFAULT_SUBS_JA: Subscription[] = [
  { id: "1", name: "動画配信サービス (Netflix)", amount: 1490, billingCycle: "monthly", category: "エンタメ" },
  { id: "2", name: "音楽配信 (Spotify)", amount: 980, billingCycle: "monthly", category: "エンタメ" },
  { id: "3", name: "Amazon プライム", amount: 5900, billingCycle: "yearly", category: "ショッピング" },
  { id: "4", name: "フィットネスジム", amount: 7700, billingCycle: "monthly", category: "ヘルスケア" },
];

const DEFAULT_SUBS_EN: Subscription[] = [
  { id: "1", name: "Netflix Premium", amount: 15.99, billingCycle: "monthly", category: "Entertainment" },
  { id: "2", name: "Spotify Family", amount: 16.99, billingCycle: "monthly", category: "Entertainment" },
  { id: "3", name: "Amazon Prime", amount: 139, billingCycle: "yearly", category: "Shopping" },
  { id: "4", name: "Gym Membership", amount: 50, billingCycle: "monthly", category: "Health" },
];

export function SubscriptionCalculator() {
  const { t, language } = useLanguage();
  const defaultSubs = language === "ja" ? DEFAULT_SUBS_JA : DEFAULT_SUBS_EN;

  const [subscriptions, setSubscriptions] = useState<Subscription[]>(defaultSubs);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = getLocalData<Subscription[]>(`kakei_subs_${language}`, defaultSubs);
    setSubscriptions(saved);
  }, [language]);

  useEffect(() => {
    if (!mounted) return;
    setLocalData(`kakei_subs_${language}`, subscriptions);
  }, [subscriptions, mounted, language]);

  const symbol = language === "ja" ? "¥" : "$";

  const totalMonthly = subscriptions.reduce((sum, sub) => {
    const val = Number(sub.amount) || 0;
    return sum + (sub.billingCycle === "yearly" ? val / 12 : val);
  }, 0);

  const totalYearly = totalMonthly * 12;

  const addSub = () => {
    setSubscriptions([
      ...subscriptions,
      {
        id: Date.now().toString(),
        name: language === "ja" ? "新規サブスク" : "New Subscription",
        amount: language === "ja" ? 1000 : 10,
        billingCycle: "monthly",
        category: language === "ja" ? "その他" : "General",
      },
    ]);
  };

  const removeSub = (id: string) => {
    setSubscriptions(subscriptions.filter((s) => s.id !== id));
  };

  const updateSub = (id: string, field: keyof Subscription, val: any) => {
    setSubscriptions(subscriptions.map((s) => (s.id === id ? { ...s, [field]: val } : s)));
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center shadow-md text-white">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              {language === "ja" ? "サブスクリプション管理 & 節約" : "Subscription Tracker & Optimizer"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {language === "ja"
                ? "固定費・月額サービスの見直しで年間支出を劇的にカット"
                : "Track recurring fees and audit unnecessary recurring monthly costs"}
            </p>
          </div>
        </div>

        <button
          onClick={addSub}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>{language === "ja" ? "サブスクを追加" : "Add Subscription"}</span>
        </button>
      </div>

      {/* Summary Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="pro-card p-5 border-l-4 border-l-rose-500">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {language === "ja" ? "月間サブスク合計" : "Total Monthly Subscriptions"}
          </p>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
            {symbol}
            {Math.round(totalMonthly).toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {language === "ja" ? "年間の固定費換算:" : "Yearly cost equivalent:"} {symbol}
            {Math.round(totalYearly).toLocaleString()}
          </p>
        </div>

        <div className="pro-card p-5 border-l-4 border-l-amber-500">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {language === "ja" ? "登録サービス数" : "Active Services"}
          </p>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1 tabular-nums">
            {subscriptions.length} {language === "ja" ? "件" : "items"}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {language === "ja" ? "不要なサービスを解約して家計改善" : "Cancel unused tools to free budget"}
          </p>
        </div>

        <div className="pro-card p-5 border-l-4 border-l-emerald-500 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <Sparkles className="w-4 h-4" />
            <span>{language === "ja" ? "Kakeibo 節約アドバイス" : "Kakeibo Savings Tip"}</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            {language === "ja"
              ? "「使っていないサブスクを1つ解約するだけ」で年間1万円以上の節約になり、返済資金に充てられます。"
              : "Canceling just 1 unused subscription saves $100+ yearly that can accelerate debt payoff."}
          </p>
        </div>
      </div>

      {/* Subscription List Table / Cards */}
      <div className="pro-card p-5 space-y-4">
        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
          {language === "ja" ? "契約中サービス一覧" : "Active Subscription List"}
        </h3>

        <div className="space-y-3">
          {subscriptions.map((sub) => (
            <div
              key={sub.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 hover:border-rose-300 transition-colors"
            >
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                <input
                  type="text"
                  value={sub.name}
                  onChange={(e) => updateSub(sub.id, "name", e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 outline-none"
                  placeholder={language === "ja" ? "サービス名" : "Service Name"}
                />

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">{symbol}</span>
                  <input
                    type="number"
                    value={sub.amount}
                    onChange={(e) => updateSub(sub.id, "amount", parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 outline-none tabular-nums"
                  />
                </div>

                <select
                  value={sub.billingCycle}
                  onChange={(e) => updateSub(sub.id, "billingCycle", e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-rose-500 outline-none"
                >
                  <option value="monthly">{language === "ja" ? "月額 (Monthly)" : "Monthly"}</option>
                  <option value="yearly">{language === "ja" ? "年額 (Yearly)" : "Yearly"}</option>
                </select>
              </div>

              <button
                onClick={() => removeSub(sub.id)}
                className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer shrink-0 self-end sm:self-center"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
