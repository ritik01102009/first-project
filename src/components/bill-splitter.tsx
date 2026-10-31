"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Scan,
  Upload,
  Plus,
  Trash2,
  Users,
  Receipt,
  FileText,
  Printer,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Calculator,
  ArrowRight,
  Split,
  Percent,
  CheckCircle2,
  Camera,
} from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";
import { getLocalData, setLocalData } from "@/lib/storage";
import { PdfReportModal } from "@/components/pdf-report-modal";

export interface BillItem {
  id: string;
  name: string;
  price: number;
  assignedTo: string[]; // Person IDs
}

export interface Person {
  id: string;
  name: string;
  color: string;
}

const PERSON_COLORS = [
  "#6366f1", // Indigo
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#8b5cf6", // Purple
  "#f97316", // Orange
  "#14b8a6", // Teal
];

const DEFAULT_PEOPLE_JA: Person[] = [
  { id: "p1", name: "自分", color: PERSON_COLORS[0] },
  { id: "p2", name: "ケンタ", color: PERSON_COLORS[1] },
  { id: "p3", name: "サクラ", color: PERSON_COLORS[2] },
];

const DEFAULT_PEOPLE_EN: Person[] = [
  { id: "p1", name: "Me", color: PERSON_COLORS[0] },
  { id: "p2", name: "Alex", color: PERSON_COLORS[1] },
  { id: "p3", name: "Sarah", color: PERSON_COLORS[2] },
];

const DEFAULT_ITEMS_JA: BillItem[] = [
  { id: "1", name: "特選和牛グリルコース", price: 6800, assignedTo: ["p1", "p2"] },
  { id: "2", name: "フレッシュシーザーサラダ", price: 1200, assignedTo: ["p1", "p2", "p3"] },
  { id: "3", name: "クラフト生ビール (x2)", price: 1600, assignedTo: ["p2", "p3"] },
  { id: "4", name: "自家製ティラミス", price: 850, assignedTo: ["p1"] },
];

const DEFAULT_ITEMS_EN: BillItem[] = [
  { id: "1", name: "Wood-Fired Truffle Pizza", price: 24.5, assignedTo: ["p1", "p2"] },
  { id: "2", name: "Crispy Calamari & Dip", price: 14.0, assignedTo: ["p1", "p2", "p3"] },
  { id: "3", name: "Craft Cocktails (x2)", price: 26.0, assignedTo: ["p2", "p3"] },
  { id: "4", name: "Classic Italian Tiramisu", price: 9.5, assignedTo: ["p1"] },
];

export function BillSplitter() {
  const { t, language } = useLanguage();
  const currencySymbol = language === "ja" ? "¥" : "$";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const defaultPeople = language === "ja" ? DEFAULT_PEOPLE_JA : DEFAULT_PEOPLE_EN;
  const defaultItems = language === "ja" ? DEFAULT_ITEMS_JA : DEFAULT_ITEMS_EN;

  const [people, setPeople] = useState<Person[]>(defaultPeople);
  const [items, setItems] = useState<BillItem[]>(defaultItems);
  const [merchant, setMerchant] = useState(language === "ja" ? "トラットリア・ベッラ" : "Trattoria Bella & Grill");
  const [taxPercent, setTaxPercent] = useState<number>(language === "ja" ? 10 : 8.5);
  const [tipPercent, setTipPercent] = useState<number>(language === "ja" ? 0 : 15);
  const [splitTaxTipMode, setSplitTaxTipMode] = useState<"proportional" | "equal">("proportional");
  const [splitMode, setSplitMode] = useState<"item-by-item" | "equal">("item-by-item");

  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<string>("");
  const [scannedImagePreview, setScannedImagePreview] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [newPersonName, setNewPersonName] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedPeople = getLocalData<Person[]>(`spensensie_split_people_${language}`, defaultPeople);
    const savedItems = getLocalData<BillItem[]>(`spensensie_split_items_${language}`, defaultItems);
    setPeople(savedPeople);
    setItems(savedItems);
  }, [language]);

  useEffect(() => {
    if (!mounted) return;
    setLocalData(`spensensie_split_people_${language}`, people);
    setLocalData(`spensensie_split_items_${language}`, items);
  }, [people, items, mounted, language]);

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
  const taxAmount = (subtotal * taxPercent) / 100;
  const tipAmount = (subtotal * tipPercent) / 100;
  const grandTotal = subtotal + taxAmount + tipAmount;

  // Breakdown per person
  const personBreakdowns = people.map((person) => {
    // Collect items assigned to this person
    const personItems: { item: BillItem; sharePrice: number }[] = [];
    let itemSubtotal = 0;

    items.forEach((item) => {
      if (item.assignedTo.includes(person.id)) {
        const share = item.assignedTo.length > 0 ? (Number(item.price) || 0) / item.assignedTo.length : 0;
        personItems.push({ item, sharePrice: share });
        itemSubtotal += share;
      }
    });

    let personTax = 0;
    let personTip = 0;

    if (splitTaxTipMode === "proportional") {
      const prop = subtotal > 0 ? itemSubtotal / subtotal : 0;
      personTax = taxAmount * prop;
      personTip = tipAmount * prop;
    } else {
      const count = people.length > 0 ? people.length : 1;
      personTax = taxAmount / count;
      personTip = tipAmount / count;
    }

    const totalOwed = itemSubtotal + personTax + personTip;

    return {
      person,
      items: personItems,
      subtotal: itemSubtotal,
      tax: personTax,
      tip: personTip,
      totalOwed,
    };
  });

  // Scanner Handler
  const handleScanReceipt = async (file?: File, sampleId?: string) => {
    setIsScanning(true);
    setScanStatus(language === "ja" ? "SmartBillAnalyzer OCRを起動中..." : "Initializing SmartBillAnalyzer OCR...");

    try {
      const formData = new FormData();
      if (file) {
        formData.append("file", file);
        setScannedImagePreview(URL.createObjectURL(file));
      } else if (sampleId) {
        formData.append("sampleId", sampleId);
        const sampleMap: Record<string, string> = {
          "sample1-restaurant": "/samples/receipts/sample1-restaurant.jpeg",
          "sample2-cafe": "/samples/receipts/sample2-cafe.png",
          "sample3-telecom": "/samples/receipts/sample3-telecom.png",
          "sample4-grocery": "/samples/receipts/sample4-grocery.jpeg",
        };
        setScannedImagePreview(sampleMap[sampleId] || "/samples/receipts/sample1-restaurant.jpeg");
      }

      setScanStatus(language === "ja" ? "OpenCVで画像を最適化中..." : "Preprocessing receipt image with OpenCV...");
      await new Promise((r) => setTimeout(r, 600));

      setScanStatus(language === "ja" ? "品目・金額・税額を自動抽出中..." : "Extracting line items, taxes & total...");

      const res = await fetch("/api/scan-bill", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success && Array.isArray(data.items)) {
        setMerchant(data.merchant || "Scanned Bill");
        
        // Map parsed items and assign evenly to current people initially
        const allPersonIds = people.map((p) => p.id);
        const mappedItems: BillItem[] = data.items.map((it: any, idx: number) => ({
          id: `item-${Date.now()}-${idx}`,
          name: it.name,
          price: it.price,
          assignedTo: allPersonIds,
        }));

        setItems(mappedItems);
        if (data.tax && data.subtotal) {
          const calcTaxPct = Math.round((data.tax / data.subtotal) * 100 * 10) / 10;
          setTaxPercent(calcTaxPct > 0 ? calcTaxPct : (language === "ja" ? 10 : 8.5));
        }
        if (data.tip && data.subtotal) {
          const calcTipPct = Math.round((data.tip / data.subtotal) * 100 * 10) / 10;
          setTipPercent(calcTipPct);
        }
      }
    } catch (err) {
      console.error("Scan error:", err);
    } finally {
      setIsScanning(false);
      setScanStatus("");
    }
  };

  // Item Management
  const addItem = () => {
    setItems([
      ...items,
      {
        id: `custom-${Date.now()}`,
        name: language === "ja" ? "新規品目" : "New Item",
        price: language === "ja" ? 1000 : 10,
        assignedTo: people.map((p) => p.id),
      },
    ]);
  };

  const updateItem = (id: string, field: "name" | "price", value: any) => {
    setItems(items.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  };

  const removeItem = (id: string) => {
    setItems(items.filter((it) => it.id !== id));
  };

  const toggleItemPerson = (itemId: string, personId: string) => {
    setItems(
      items.map((it) => {
        if (it.id !== itemId) return it;
        const assigned = it.assignedTo.includes(personId)
          ? it.assignedTo.filter((id) => id !== personId)
          : [...it.assignedTo, personId];
        return { ...it, assignedTo: assigned };
      })
    );
  };

  const assignAllToItem = (itemId: string) => {
    setItems(
      items.map((it) => {
        if (it.id !== itemId) return it;
        const allAssigned = it.assignedTo.length === people.length;
        return {
          ...it,
          assignedTo: allAssigned ? (people.length > 0 ? [people[0].id] : []) : people.map((p) => p.id),
        };
      })
    );
  };

  // People Management
  const addPerson = () => {
    if (!newPersonName.trim()) return;
    const color = PERSON_COLORS[people.length % PERSON_COLORS.length];
    const newPerson: Person = {
      id: `p-${Date.now()}`,
      name: newPersonName.trim(),
      color,
    };
    setPeople([...people, newPerson]);
    setNewPersonName("");
  };

  const removePerson = (id: string) => {
    if (people.length <= 1) return;
    setPeople(people.filter((p) => p.id !== id));
    setItems(
      items.map((it) => ({
        ...it,
        assignedTo: it.assignedTo.filter((pid) => pid !== id),
      }))
    );
  };

  const equalPerPerson = people.length > 0 ? grandTotal / people.length : grandTotal;

  // Copy Settlement Summary for Messenger / WhatsApp / LINE
  const handleCopySummary = () => {
    let text = `🧾 ${merchant} — ${language === "ja" ? "割り勘計算書" : "Bill Split Summary"}\n`;
    text += `💰 ${language === "ja" ? "合計金額" : "Grand Total"}: ${currencySymbol}${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
    text += `👥 ${language === "ja" ? "分割人数" : "Split Members"}: ${people.length} ${language === "ja" ? "名" : "people"}\n`;
    text += `──────────────\n`;

    if (splitMode === "equal") {
      text += `⚖️ ${language === "ja" ? "均等割り勘モード" : "Mode: Equal Split"}\n`;
      text += `👉 ${language === "ja" ? "1人あたりの支払額" : "Each Person Pays"}: ${currencySymbol}${equalPerPerson.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n`;
      people.forEach((p) => {
        text += `👤 ${p.name}: ${currencySymbol}${equalPerPerson.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
      });
    } else {
      text += `📋 ${language === "ja" ? "品目別割り勘モード" : "Mode: Item-by-Item Split"}\n\n`;
      personBreakdowns.forEach((pb) => {
        text += `👤 ${pb.person.name}: ${currencySymbol}${pb.totalOwed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n`;
        pb.items.forEach((it) => {
          text += `   • ${it.item.name} (${currencySymbol}${it.sharePrice.toFixed(2)})\n`;
        });
        if (taxAmount > 0 || tipAmount > 0) {
          text += `   • ${language === "ja" ? "税・チップ分" : "Tax & Tip"}: ${currencySymbol}${(pb.tax + pb.tip).toFixed(2)}\n`;
        }
        text += `\n`;
      });
    }

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Reset
  const handleReset = () => {
    setPeople(defaultPeople);
    setItems(defaultItems);
    setMerchant(language === "ja" ? "トラットリア・ベッラ" : "Trattoria Bella & Grill");
    setScannedImagePreview(null);
    setTaxPercent(language === "ja" ? 10 : 8.5);
    setTipPercent(language === "ja" ? 0 : 15);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-md">
            <Split className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                {language === "ja" ? "スマート割り勘 & レシートスキャナー" : "Smart Bill Splitter & Scanner"}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                SmartBillAnalyzer AI
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {language === "ja"
                ? "レシート画像をアップロードして品目・税金を自動スキャン。個別品目や割り勘を1タップで計算します。"
                : "Scan restaurant receipts or invoices with OCR. Split item-by-item with automated taxes and tips."}
            </p>
          </div>
        </div>

        {/* Top actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold transition-all shadow-xs cursor-pointer min-h-[38px]"
            title="Reset to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{language === "ja" ? "リセット" : "Reset"}</span>
          </button>
          <button
            onClick={() => setShowPdfModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer min-h-[38px]"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-500" />
            <span>{language === "ja" ? "PDF出力" : "Export PDF"}</span>
          </button>
          <button
            onClick={handleCopySummary}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer min-h-[38px] ${
              copied
                ? "bg-emerald-500 text-white"
                : "bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800"
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? (language === "ja" ? "コピー完了!" : "Copied!") : (language === "ja" ? "結果をコピー" : "Share Summary")}</span>
          </button>
        </div>
      </div>

      {/* OCR Scanner Card (Integrated with SmartBillAnalyzer) */}
      <div className="rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border border-indigo-800/40 p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle at 80% 20%, #6366f1 0%, transparent 50%), radial-gradient(circle at 20% 80%, #ec4899 0%, transparent 50%)",
          }}
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          <div className="lg:col-span-2 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
              <Scan className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>{language === "ja" ? "SmartBillAnalyzer OCR スキャン" : "SmartBillAnalyzer OCR Scanner"}</span>
            </div>
            <h3 className="text-xl md:text-2xl font-black tracking-tight text-white">
              {language === "ja" ? "レシートや領収書を瞬時にデータ化" : "Snap or Upload Any Bill to Auto-Split"}
            </h3>
            <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-xl">
              {language === "ja"
                ? "スマートOCRエンジンがレシート画像を解析し、料理名・品目・金額・消費税を自動で読み取ります。手入力の手間がゼロになります。"
                : "Our neural OCR engine detects merchant names, dates, item descriptions, and tax totals automatically. Edit and assign them with zero typing."}
            </p>

            {/* Quick Sample Bill Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {language === "ja" ? "サンプルレシート:" : "Quick Samples:"}
              </span>
              <button
                disabled={isScanning}
                onClick={() => handleScanReceipt(undefined, "sample1-restaurant")}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold text-white border border-white/20 transition-all cursor-pointer flex items-center gap-1.5 min-h-[34px]"
              >
                <Receipt className="w-3.5 h-3.5 text-indigo-400" />
                <span>{language === "ja" ? "レストラン" : "Restaurant"}</span>
              </button>
              <button
                disabled={isScanning}
                onClick={() => handleScanReceipt(undefined, "sample2-cafe")}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold text-white border border-white/20 transition-all cursor-pointer flex items-center gap-1.5 min-h-[34px]"
              >
                <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                <span>{language === "ja" ? "カフェ" : "Cafe"}</span>
              </button>
              <button
                disabled={isScanning}
                onClick={() => handleScanReceipt(undefined, "sample3-telecom")}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold text-white border border-white/20 transition-all cursor-pointer flex items-center gap-1.5 min-h-[34px]"
              >
                <FileText className="w-3.5 h-3.5 text-cyan-400" />
                <span>{language === "ja" ? "通信・光熱費" : "Utility Bill"}</span>
              </button>
              <button
                disabled={isScanning}
                onClick={() => handleScanReceipt(undefined, "sample4-grocery")}
                className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-xs font-semibold text-white border border-white/20 transition-all cursor-pointer flex items-center gap-1.5 min-h-[34px]"
              >
                <Receipt className="w-3.5 h-3.5 text-emerald-400" />
                <span>{language === "ja" ? "スーパー" : "Grocery"}</span>
              </button>
            </div>
          </div>

          {/* Upload / Camera Action Box */}
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-400/40 rounded-2xl p-6 bg-slate-900/60 backdrop-blur-xs text-center hover:border-indigo-400 transition-colors">
            {/* Standard file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleScanReceipt(e.target.files[0]);
                }
              }}
            />

            {/* Direct Camera input for mobile */}
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleScanReceipt(e.target.files[0]);
                }
              }}
            />

            {isScanning ? (
              <div className="space-y-3 py-4 flex flex-col items-center">
                <div className="w-10 h-10 border-3 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-bold text-indigo-300">{scanStatus}</p>
              </div>
            ) : scannedImagePreview ? (
              <div className="space-y-3 w-full">
                <div className="relative mx-auto w-32 h-24 rounded-lg overflow-hidden border border-indigo-500/40 shadow-md">
                  <img src={scannedImagePreview} alt="Scanned receipt" className="w-full h-full object-cover" />
                  <div className="absolute top-1 right-1 bg-emerald-500 rounded-full p-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex-1 py-2 px-3 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{language === "ja" ? "カメラで撮り直す" : "Retake Photo"}</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 py-2 px-3 rounded-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-slate-600 flex items-center justify-center gap-1.5 cursor-pointer min-h-[40px]"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{language === "ja" ? "ファイル選択" : "Upload File"}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="w-full sm:w-auto py-2.5 px-4 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-extrabold text-xs transition-all shadow-lg shadow-indigo-500/30 cursor-pointer flex items-center justify-center gap-2 min-h-[42px]"
                  >
                    <Camera className="w-4 h-4" />
                    <span>{language === "ja" ? "カメラで撮影" : "Snap with Camera"}</span>
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto py-2.5 px-4 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[42px]"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{language === "ja" ? "ファイルを選択" : "Upload Image"}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-400">JPG, PNG, JPEG, WEBP (MAX. 10MB)</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* People / Friends Strip */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-500" />
              <span>{language === "ja" ? "参加メンバー" : "Split Members"}</span>
              <span className="text-xs text-slate-400 font-normal">({people.length})</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === "ja" ? "割り勘に参加する友達の名前を追加・管理できます" : "Add or remove members sharing this bill"}
            </p>
          </div>

          {/* Add person input */}
          <div className="flex items-center gap-2 max-w-xs w-full">
            <input
              type="text"
              value={newPersonName}
              onChange={(e) => setNewPersonName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addPerson()}
              placeholder={language === "ja" ? "メンバー名 (例: ケン)" : "Member name (e.g. David)"}
              className="flex-1 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-400 min-h-[38px]"
            />
            <button
              onClick={addPerson}
              className="px-3.5 py-1.5 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer min-h-[38px] flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === "ja" ? "追加" : "Add"}</span>
            </button>
          </div>
        </div>

        {/* Members Pill List */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {people.map((person) => (
            <div
              key={person.id}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-bold text-slate-800 dark:text-slate-100 shadow-xs"
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: person.color }} />
              <span>{person.name}</span>
              {people.length > 1 && (
                <button
                  onClick={() => removePerson(person.id)}
                  className="text-slate-400 hover:text-rose-500 cursor-pointer ml-0.5"
                  title="Remove person"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Items on Left, Settlement Breakdown on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Items List & Config (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Items Card */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 gap-2">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-indigo-500" />
                <input
                  type="text"
                  value={merchant}
                  onChange={(e) => setMerchant(e.target.value)}
                  className="font-bold text-slate-800 dark:text-slate-100 text-sm bg-transparent border-b border-dashed border-slate-300 dark:border-slate-600 focus:outline-none focus:border-indigo-400 px-1 py-0.5"
                />
              </div>
              <button
                onClick={addItem}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold transition-all shadow-xs cursor-pointer min-h-[36px] self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === "ja" ? "品目を追加" : "Add Item"}</span>
              </button>
            </div>

            {/* Item Rows */}
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {items.map((item, idx) => (
                <div key={item.id} className="p-4 sm:p-5 space-y-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Item Name */}
                    <div className="flex-1">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(item.id, "name", e.target.value)}
                        placeholder="Item name"
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-400 min-h-[38px]"
                      />
                    </div>

                    {/* Price and Delete */}
                    <div className="flex items-center gap-2">
                      <div className="relative w-32">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">
                          {currencySymbol}
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          value={item.price}
                          onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)}
                          className="w-full py-1.5 pr-3 pl-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-400 font-mono tabular-nums min-h-[38px]"
                        />
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer min-w-[38px] min-h-[38px] flex items-center justify-center"
                        title="Delete item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Person Assignment Selector */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
                      {language === "ja" ? "負担者:" : "Split by:"}
                    </span>
                    {people.map((person) => {
                      const isAssigned = item.assignedTo.includes(person.id);
                      return (
                        <button
                          key={person.id}
                          onClick={() => toggleItemPerson(item.id, person.id)}
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 min-h-[30px] ${
                            isAssigned
                              ? "bg-indigo-500 text-white shadow-xs font-bold"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                          }`}
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: isAssigned ? "#ffffff" : person.color }}
                          />
                          <span>{person.name}</span>
                        </button>
                      );
                    })}
                    <button
                      onClick={() => assignAllToItem(item.id)}
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer ml-auto"
                    >
                      {item.assignedTo.length === people.length
                        ? (language === "ja" ? "全員解除" : "Clear all")
                        : (language === "ja" ? "全員で均等割り" : "Split all")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tax & Tip Settings Card */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Percent className="w-3.5 h-3.5 text-indigo-500" />
              <span>{language === "ja" ? "税金・チップ・割り勘設定" : "Taxes, Tips & Split Method"}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Tax input */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1.5">
                  {language === "ja" ? "消費税・サービス税 (%)" : "Tax Rate (%)"}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-400 font-mono tabular-nums min-h-[40px]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold">%</span>
                </div>
              </div>

              {/* Tip input */}
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block mb-1.5">
                  {language === "ja" ? "チップ (%)" : "Tip Rate (%)"}
                </label>
                <div className="flex items-center gap-1.5">
                  {[0, 10, 15, 18, 20].map((tVal) => (
                    <button
                      key={tVal}
                      onClick={() => setTipPercent(tVal)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer min-h-[40px] ${
                        tipPercent === tVal
                          ? "bg-indigo-500 text-white shadow-xs"
                          : "border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                      }`}
                    >
                      {tVal}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Split Method Toggle */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === "ja" ? "税金・チップの按分方法:" : "Tax & Tip Distribution:"}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSplitTaxTipMode("proportional")}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer min-h-[36px] ${
                    splitTaxTipMode === "proportional"
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {language === "ja" ? "注文額に応じた比率 (公平)" : "Proportional to Spend (Fair)"}
                </button>
                <button
                  onClick={() => setSplitTaxTipMode("equal")}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer min-h-[36px] ${
                    splitTaxTipMode === "equal"
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {language === "ja" ? "全員で均等" : "Even Split"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Settlement & Per-Person Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Split Mode Switcher (Equal vs Item-by-item) */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-1.5 flex items-center gap-1.5 shadow-xs">
            <button
              onClick={() => setSplitMode("item-by-item")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                splitMode === "item-by-item"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Split className="w-3.5 h-3.5" />
              <span>{language === "ja" ? "品目ごとに個別割り勘" : "Split by Items"}</span>
            </button>
            <button
              onClick={() => setSplitMode("equal")}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                splitMode === "equal"
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{language === "ja" ? `均等割り勘 (${people.length}人)` : `Equal Split (÷${people.length})`}</span>
            </button>
          </div>

          {/* Bill Total Overview Card */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 flex items-center justify-between">
              <span>{language === "ja" ? "お会計サマリー" : "Bill Summary"}</span>
              <span className="text-xs text-indigo-500 font-semibold">{people.length} {language === "ja" ? "名で分割" : "members"}</span>
            </h3>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex justify-between">
                <span>{language === "ja" ? "小計 (品目合計):" : "Subtotal:"}</span>
                <span className="font-mono tabular-nums font-bold text-slate-800 dark:text-slate-100">
                  {currencySymbol}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              {taxAmount > 0 && (
                <div className="flex justify-between">
                  <span>{language === "ja" ? `消費税 (${taxPercent}%):` : `Tax (${taxPercent}%):`}</span>
                  <span className="font-mono tabular-nums font-bold text-slate-800 dark:text-slate-100">
                    {currencySymbol}{taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              )}
              {tipAmount > 0 && (
                <div className="flex justify-between">
                  <span>{language === "ja" ? `チップ (${tipPercent}%):` : `Tip (${tipPercent}%):`}</span>
                  <span className="font-mono tabular-nums font-bold text-slate-800 dark:text-slate-100">
                    {currencySymbol}{tipAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <span className="text-sm font-black text-slate-800 dark:text-slate-100">
                {language === "ja" ? "お支払い総額:" : "Grand Total:"}
              </span>
              <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono tabular-nums">
                {currencySymbol}{grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {splitMode === "equal" && (
              <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-900 dark:text-indigo-200">
                  {language === "ja" ? "1人あたりの均等負担額:" : "Equal Amount Per Person:"}
                </span>
                <span className="font-mono tabular-nums font-black text-indigo-600 dark:text-indigo-400 text-base">
                  {currencySymbol}{equalPerPerson.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </div>

          {/* Member Owed Breakdown Cards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>{language === "ja" ? "メンバー別 支払い額内訳" : "Individual Member Breakdown"}</span>
              <span className="text-[10px] text-indigo-500 font-semibold lowercase">
                {splitMode === "equal" ? (language === "ja" ? "均等按分" : "equal share") : (language === "ja" ? "品目個別" : "itemized")}
              </span>
            </h4>

            {personBreakdowns.map((pb) => {
              const displayAmount = splitMode === "equal" ? equalPerPerson : pb.totalOwed;
              return (
                <div
                  key={pb.person.id}
                  className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 shadow-xs space-y-3 transition-all hover:border-indigo-300 dark:hover:border-indigo-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-extrabold text-xs shadow-xs"
                        style={{ backgroundColor: pb.person.color }}
                      >
                        {pb.person.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-800 dark:text-slate-100">{pb.person.name}</div>
                        <div className="text-[10px] text-slate-400">
                          {splitMode === "equal"
                            ? (language === "ja" ? `総額の 1/${people.length} を均等負担` : `1/${people.length} equal share of total`)
                            : `${pb.items.length} ${language === "ja" ? "品目を負担" : "items assigned"}`}
                        </div>
                      </div>
                    </div>

                    {/* Total Owed Amount */}
                    <div className="text-right">
                      <div className="text-lg font-black text-slate-900 dark:text-white font-mono tabular-nums">
                        {currencySymbol}{displayAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        {language === "ja" ? "支払い担当額" : "Amount to pay"}
                      </div>
                    </div>
                  </div>

                  {/* Sub-item Details (Only in item-by-item mode) */}
                  {splitMode === "item-by-item" && pb.items.length > 0 && (
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                      {pb.items.map((it) => (
                        <div key={it.item.id} className="flex justify-between items-center text-[11px]">
                          <span className="truncate pr-2">• {it.item.name}</span>
                          <span className="font-mono tabular-nums font-semibold shrink-0">
                            {currencySymbol}{it.sharePrice.toFixed(2)}
                          </span>
                        </div>
                      ))}
                      {(pb.tax > 0 || pb.tip > 0) && (
                        <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1">
                          <span>• {language === "ja" ? "税金・チップ負担分" : "Tax & Tip Share"}</span>
                          <span className="font-mono tabular-nums">
                            +{currencySymbol}{(pb.tax + pb.tip).toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PDF Report Modal */}
      <PdfReportModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        title={language === "ja" ? `${merchant} 割り勘精算レポート` : `${merchant} Bill Split Official Report`}
        subtitle={
          language === "ja"
            ? `SmartBillAnalyzerでスキャンされた合計 ${currencySymbol}${grandTotal.toFixed(2)} の品目別・メンバー別精算明細です。`
            : `Itemized split breakdown of ${currencySymbol}${grandTotal.toFixed(2)} across ${people.length} members analyzed by SmartBillAnalyzer.`
        }
        data={{
          date: new Date().toLocaleDateString(),
          summaryCards: [
            { label: language === "ja" ? "お支払い総額" : "Grand Total", value: `${currencySymbol}${grandTotal.toFixed(2)}` },
            { label: language === "ja" ? "小計" : "Subtotal", value: `${currencySymbol}${subtotal.toFixed(2)}` },
            { label: language === "ja" ? "税金 + チップ" : "Tax & Tip", value: `${currencySymbol}${(taxAmount + tipAmount).toFixed(2)}` },
            { label: language === "ja" ? "参加人数" : "People", value: `${people.length}名` },
          ],
          tables: [
            {
              title: language === "ja" ? "メンバー別 支払い確定額" : "Settlement By Member",
              headers: [
                language === "ja" ? "メンバー" : "Member",
                language === "ja" ? "品目小計" : "Items Subtotal",
                language === "ja" ? "税・チップ" : "Tax & Tip",
                language === "ja" ? "合計支払い額" : "Total Owed",
              ],
              rows: personBreakdowns.map((pb) => [
                pb.person.name,
                `${currencySymbol}${pb.subtotal.toFixed(2)}`,
                `${currencySymbol}${(pb.tax + pb.tip).toFixed(2)}`,
                `${currencySymbol}${pb.totalOwed.toFixed(2)}`,
              ]),
            },
            {
              title: language === "ja" ? "スキャン品目一覧" : "Scanned Itemized Items",
              headers: [
                language === "ja" ? "品目名" : "Item",
                language === "ja" ? "金額" : "Price",
                language === "ja" ? "負担メンバー" : "Split By",
              ],
              rows: items.map((it) => [
                it.name,
                `${currencySymbol}${it.price.toFixed(2)}`,
                it.assignedTo.map((pid) => people.find((p) => p.id === pid)?.name || "").filter(Boolean).join(", "),
              ]),
            },
          ],
        }}
      />
    </div>
  );
}

