"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, DollarSign, Users, Receipt } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { getLocalData, setLocalData } from "@/lib/storage";

interface Member {
  id: string;
  name: string;
}

interface Expense {
  id: string;
  name: string;
  amount: number;
  paidById: string;
}

export function BillSplitter() {
  const { t, language } = useLanguage();
  const [members, setMembers] = useState<Member[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newMemberName, setNewMemberName] = useState("");
  const [newExpenseName, setNewExpenseName] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [newExpensePayer, setNewExpensePayer] = useState("");

  useEffect(() => {
    setMembers(getLocalData<Member[]>("splitio_members", []));
    setExpenses(getLocalData<Expense[]>("splitio_expenses", []));
  }, []);

  useEffect(() => {
    setLocalData("splitio_members", members);
    setLocalData("splitio_expenses", expenses);
  }, [members, expenses]);

  const addMember = () => {
    if (!newMemberName.trim()) return;
    setMembers([...members, { id: Date.now().toString(), name: newMemberName }]);
    setNewMemberName("");
  };

  const addExpense = () => {
    if (!newExpenseName.trim() || !newExpenseAmount || !newExpensePayer) return;
    setExpenses([
      ...expenses,
      {
        id: Date.now().toString(),
        name: newExpenseName,
        amount: parseFloat(newExpenseAmount),
        paidById: newExpensePayer,
      },
    ]);
    setNewExpenseName("");
    setNewExpenseAmount("");
  };

  const balances = useMemo(() => {
    const b: Record<string, number> = {};
    members.forEach((m) => (b[m.id] = 0));
    expenses.forEach((e) => {
      const share = e.amount / members.length;
      members.forEach((m) => {
        if (m.id === e.paidById) b[m.id] += e.amount - share;
        else b[m.id] -= share;
      });
    });
    return b;
  }, [members, expenses]);

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-md">
          <Receipt className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">{t("bill_splitter.title")}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">{t("bill_splitter.subtitle")}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Members */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-4">
            <Users className="w-4 h-4 text-emerald-500" /> {language === "ja" ? "メンバー" : "Members"}
          </h3>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
              placeholder={language === "ja" ? "メンバー名" : "Name"}
            />
            <button onClick={addMember} className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md cursor-pointer">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {members.map((m) => (
              <div key={m.id} className="flex justify-between items-center p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-sm text-emerald-800 dark:text-emerald-300">
                {m.name}
                <button onClick={() => setMembers(members.filter((mem) => mem.id !== m.id))}><Trash2 className="w-4 h-4 text-emerald-500" /></button>
              </div>
            ))}
          </div>
        </div>

        {/* Expenses */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-4">
            <DollarSign className="w-4 h-4 text-emerald-500" /> {t("bill_splitter.add_expense")}
          </h3>
          <div className="space-y-2 mb-4">
            <input
              type="text"
              value={newExpenseName}
              onChange={(e) => setNewExpenseName(e.target.value)}
              placeholder={t("bill_splitter.expense_name")}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
            />
            <input
              type="number"
              value={newExpenseAmount}
              onChange={(e) => setNewExpenseAmount(e.target.value)}
              placeholder={t("bill_splitter.amount")}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
            />
            <select
              value={newExpensePayer}
              onChange={(e) => setNewExpensePayer(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
            >
              <option value="">{t("bill_splitter.paid_by")}</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
            <button onClick={addExpense} className="w-full bg-emerald-600 text-white py-2 rounded-xl text-sm font-bold shadow-md cursor-pointer">
              {t("bill_splitter.add_expense")}
            </button>
          </div>
        </div>
      </div>

      {/* Balances */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">{t("bill_splitter.balances")}</h3>
        <div className="space-y-2">
          {members.map(m => {
            const bal = balances[m.id];
            if (Math.abs(bal) < 0.01) return null;
            return (
              <div key={m.id} className="flex justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-sm font-semibold">
                <span>{m.name}</span>
                <span className={bal > 0 ? "text-emerald-600" : "text-rose-600"}>
                  {bal > 0 ? `${t("bill_splitter.owes")} ${bal.toFixed(2)}` : `${t("bill_splitter.owes")} ${Math.abs(bal).toFixed(2)}`}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between font-bold text-slate-800 dark:text-slate-100">
           <span>{t("bill_splitter.total_expenses")}</span>
           <span>{total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
