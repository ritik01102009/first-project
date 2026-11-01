"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type SupportedLanguage = "ja" | "en";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

export const translations: Record<SupportedLanguage, Record<string, any>> = {
  ja: {
    app: {
      name: "家計管理",
      tagline: "スマートな財務自由化エンジン",
    },
    nav: {
      dashboard: "ダッシュボード",
      debt: "借金返済シミュレーター",
      recommender: "最適返済診断",
      budget: "家計簿・予算管理",
      savings: "貯蓄目標トラッカー",
      subscriptions: "サブスク見直し計算機",
      education: "金融ナレッジ",
      theme_toggle: "テーマ切替",
      lang_toggle: "言語切替 (現在: 日本語)",
    },
    hero: {
      badge: "完全無料 · プライバシー保護 · 登録不要",
      title_lead: "お金の流れを完全に",
      title_highlight: "コントロール",
      description: "究極の無料借金返済計算ツール＆予算管理アプリ。雪だるま式（スノーボール）と雪崩式（アバランチ）を比較し、最短で経済的自由を実現しましょう。",
      start_debt: "借金計算をはじめる",
      find_method: "最適返済法を診断する",
    },
    stats: {
      avg_debt_label: "世帯平均負債額",
      avg_debt_sub: "（米国参考データ）",
      apr_label: "リボ・カード平均金利",
      apr_sub: "年率換算",
      speed_label: "返済期間の短縮効果",
      speed_sub: "最適な返済戦略の適用時",
    },
    tools: {
      section_title: "ファイナンシャル・ツール一覧",
      section_desc: "借金完済から毎月の貯蓄まで、あなたの資産形成を強力にサポートします",
      debt: {
        title: "借金返済シミュレーター",
        desc: "スノーボール法とアバランチ法をリアルタイム比較。完済予定日と利息削減額を可視化します。",
      },
      recommender: {
        title: "最適返済メソッド診断",
        desc: "簡単な4つの質問に答えるだけで、あなたに一番合った返済戦略をAI診断します。",
      },
      budget: {
        title: "家計簿・予算トラッカー",
        desc: "月収と支出カテゴリを管理。無駄遣いを防ぎ、手元に残る金額を明確にします。",
      },
      savings: {
        title: "貯蓄目標トラッカー",
        desc: "非常時資金や旅行、車の購入目標を設定し、達成までの進捗を追跡します。",
      },
      subscriptions: {
        title: "サブスク見直し計算機",
        desc: "毎月・年間の固定費を一覧化。不要なサブスクリプションを削減して節約しましょう。",
      },
      education: {
        title: "金融ガイド・学習",
        desc: "スノーボール法、アバランチ法、50/30/20ルールなど実践的な金融知識を解説。",
      },
    },
    debt: {
      title: "借金返済シミュレーター",
      subtitle: "スノーボール方式（小口優先） vs アバランチ方式（高金利優先）の比較",
      total_debt: "負債総額",
      min_payments: "毎月の最低返済額",
      payoff_time: "完済までの期間",
      months: "ヶ月",
      total_interest: "総利息支払額",
      strategy_label: "返済戦略",
      snowball: "スノーボール方式",
      avalanche: "アバランチ方式",
      extra_payment: "追加の毎月返済額",
      current_active: "選択中",
      your_debts: "登録された負債一覧",
      add_debt: "借入を追加",
      debt_name_placeholder: "借入名（例: クレジットカード）",
      balance: "残高",
      apr: "年利 (%)",
      min_pay: "毎月最低支払",
      delete: "削除",
      months_suffix: "ヶ月で完済",
      interest_suffix: "利息合計",
      snowball_desc: "残高が小さい順に返済し、小さな達成感を積み重ねます。",
      avalanche_desc: "金利が高い順に返済し、支払う利息総額を最小限に抑えます。",
    },
    recommender: {
      title: "最適返済メソッド診断",
      subtitle: "あなたにぴったりの返済計画をわずか1分で提案します",
      step: "質問",
      of: "/",
      retake: "診断をやり直す",
      recommended_result: "あなたにおすすめの返済方法",
      start_with: "この戦略で始める",
    },
    budget: {
      title: "家計簿・予算トラッカー",
      subtitle: "月収と支出カテゴリを整理し、黒字家計をつくりましょう",
      monthly_income: "毎月の手取り月収",
      total_budgeted: "予算設定合計",
      total_spent: "支出実績合計",
      remaining: "今月の残り残高",
      categories: "支出カテゴリ一覧",
      add_category: "カテゴリ追加",
      name_placeholder: "カテゴリ名（例: 食費、家賃）",
      budgeted: "予算枠",
      spent: "支出額",
      over_budget: "予算オーバー",
      within_budget: "予算内",
    },
    savings: {
      title: "貯蓄目標トラッカー",
      subtitle: "目標金額と毎月の積立額から達成時期を予測します",
      total_saved: "現在の貯蓄総額",
      total_target: "目標総額",
      overall_progress: "全体の達成率",
      monthly_saving: "毎月の積立可能額",
      goals_list: "あなたの貯蓄目標",
      add_goal: "目標を追加",
      goal_name_placeholder: "目標名（例: 緊急予備資金、ハワイ旅行）",
      target_amount: "目標金額",
      current_amount: "現在の貯金額",
      eta: "達成予測",
      completed: "達成済み！🎉",
      months_to_go: "ヶ月後",
    },
    subs: {
      title: "サブスク見直し計算機",
      subtitle: "月額・年額の契約サービスを棚卸しして無駄をカット",
      active_count: "契約中のサブスク",
      monthly_cost: "月間合計コスト",
      yearly_cost: "年間合計コスト",
      inactive_count: "停止・解約済み",
      category_breakdown: "カテゴリ別月間支出",
      all_subs: "サブスクリプション一覧",
      add_sub: "サブスクを追加",
      sub_name_placeholder: "サービス名（例: Netflix, Spotify）",
      cost: "料金",
      monthly: "月払い",
      yearly: "年払い",
      category: "カテゴリ",
      active: "有効",
      paused: "停止中",
    },
    education: {
      title: "金融ガイド・知識ベース",
      subtitle: "借金ゼロと経済的自立を加速させる実証済みのマネー戦略",
      read_more: "詳細を読む",
    },
    footer: {
      brand_description: "完全無料＆安全な借金返済シミュレーター兼家計簿アプリ。アカウント登録不要、データはすべてお使いの端末にのみ保存されます。",
      privacy: "100%クライアント処理 — 入力データは外部送信されません",
      copyright: "家計管理 — スマート財務自由化エンジン。All rights reserved.",
      built_for: "借金のない明るい未来のために",
      tools_heading: "ツール",
      learn_heading: "学習",
      features_heading: "特長",
      dashboard_heading: "ダッシュボード",
      pdf_export: "PDFレポート出力",
      multi_language: "多言語対応（日/英）",
      strategy_compare: "返済シミュレーション比較",
      privacy_first: "安心のプライバシー設計",
    },
    faq: {
      title: "よくある質問 (FAQ)",
      q1: "家計管理は何から始めればよいですか？",
      a1: "まずは現状の把握から始めましょう。毎月の固定費（家賃、通信費、保険など）と変動費（食費、交際費など）を書き出し、収入とのバランスを確認することからスタートするのがおすすめです。",
      q2: "毎月いくら貯金すればよいですか？",
      a2: "一般的には手取り収入の20%を貯金に回すのが理想的ですが、まずは無理のない範囲（5%〜10%）から始め、習慣化することが大切です。",
      q3: "固定費はどこから見直すべきですか？",
      a3: "スマホ料金（格安SIMへの移行）、サブスクリプションの解約、保険の見直し、電気・ガス会社の切り替えなど、一度の手続きで効果が長く続くものから着手しましょう。",
      q4: "共働き世帯の家計管理はどうすればよいですか？",
      a4: "「共通口座にお互いが一定額を入れる」「生活費を項目ごとに分担する」など、夫婦で話し合って透明性の高い方法を選ぶことが円満な家計管理のコツです。",
      q5: "ボーナスはどう使うべきですか？",
      a5: "まずは貯金や投資に回す分を優先的に確保し、残りを自分へのご褒美や大きな買い物、特別支出の予備費として計画的に使うのが理想的です。",
      q6: "Kakeikanri.onlineとは何ですか？",
      a6: "Kakeikanri.onlineは、家計簿、支出管理、貯蓄習慣、月々の資金管理など、実用的なパーソナルファイナンス教育のためのオンラインリソースです。初心者がシンプルで継続可能な家計管理のルーチンを構築するのを支援します。",
      q7: "利用料は無料ですか？",
      a7: "はい、Kakeikanri.onlineの基本ツールと教育コンテンツはすべて無料でご利用いただけます。",
      q8: "誰のためのツールですか？",
      a8: "家計管理を始めたばかりの初心者から、効率的に資産を増やしたい方、借金返済を計画したい方まで、自分のお金をコントロールしたいすべての方に最適です。",
      q9: "金融アドバイスは提供していますか？",
      a9: "Kakeikanri.onlineは教育情報の提供を目的としており、個別の投資助言や法的・税務的なアドバイスは行っていません。重要な決定については専門家にご相談ください。",
      q10: "データは安全ですか？",
      a10: "はい。当サイトのツールはすべてクライアント側（ブラウザ内）で処理され、お客様の財務データが外部サーバーに送信されることはありません。プライバシーを第一に設計されています。"
    },
  },
  en: {
    app: {
      name: "KakeiKanri",
      tagline: "Smart Financial Freedom Engine",
    },
    nav: {
      dashboard: "Dashboard",
      debt: "Debt Calculator",
      recommender: "Method Finder",
      budget: "Budget Tracker",
      savings: "Savings Goals",
      subscriptions: "Subscriptions",
      bill_splitter: "Bill Splitter",
      education: "Learn",
      theme_toggle: "Toggle theme",
      lang_toggle: "Change language (Current: English)",
    },
    hero: {
      badge: "100% Free · Private · No Account Needed",
      title_lead: "Take Full Control of Your",
      title_highlight: "Finances",
      description: "The ultimate free debt payoff calculator and budget tracker. Compare Snowball vs Avalanche strategies, eliminate high-interest debt, and achieve financial freedom faster.",
      start_debt: "Start Debt Calculator",
      find_method: "Find Your Best Strategy",
    },
    stats: {
      avg_debt_label: "Average Household Debt",
      avg_debt_sub: "US national average",
      apr_label: "Average Credit Card APR",
      apr_sub: "Annual percentage rate",
      speed_label: "Faster to Debt Freedom",
      speed_sub: "With the right payoff strategy",
    },
    tools: {
      section_title: "Financial Toolkit",
      section_desc: "Everything you need to eliminate debt, optimize spending, and build lasting wealth",
      debt: {
        title: "Debt Payoff Calculator",
        desc: "Compare Snowball vs Avalanche methods in real time. Know your exact debt-free date and total interest saved.",
      },
      recommender: {
        title: "Smart Method Finder",
        desc: "Answer 4 simple questions to receive a personalized debt reduction strategy tailored to your habits.",
      },
      budget: {
        title: "Budget Tracker",
        desc: "Monitor your income versus category expenses. Take control of where every single dollar goes.",
      },
      savings: {
        title: "Savings Goals Tracker",
        desc: "Set emergency fund, vacation, or big purchase targets and watch your milestones turn into reality.",
      },
      subscriptions: {
        title: "Subscription Calculator",
        desc: "Audit monthly and annual recurring fees. Spot unused subscriptions and reclaim your cash flow.",
      },
      bill_splitter: {
        title: "Bill Splitter",
        desc: "Split group expenses fairly and instantly. Track who owes what without any complex setup.",
      },
      education: {
        title: "Financial Education",
        desc: "Master proven financial strategies including Snowball, Avalanche, and the 50/30/20 budgeting rule.",
      },
    },
    debt: {
      title: "Debt Payoff Calculator",
      subtitle: "Compare Snowball (smallest balance first) vs Avalanche (highest interest first)",
      total_debt: "Total Debt",
      min_payments: "Monthly Min. Payments",
      payoff_time: "Time to Debt-Free",
      months: "mo",
      total_interest: "Total Interest Paid",
      strategy_label: "Payoff Strategy",
      snowball: "Snowball Method",
      avalanche: "Avalanche Method",
      extra_payment: "Extra Monthly Payment",
      current_active: "Active",
      your_debts: "Your Debts",
      add_debt: "Add Debt",
      debt_name_placeholder: "Debt name (e.g. Credit Card)",
      balance: "Balance",
      apr: "APR (%)",
      min_pay: "Min. Pay",
      delete: "Delete",
      months_suffix: "months to payoff",
      interest_suffix: "total interest",
      snowball_desc: "Tackles smallest balance first to build early psychological momentum.",
      avalanche_desc: "Tackles highest interest rate first to minimize total money paid to interest.",
    },
    recommender: {
      title: "Smart Method Finder",
      subtitle: "Find your ideal payoff roadmap in under 1 minute",
      step: "Question",
      of: "/",
      retake: "Retake Quiz",
      recommended_result: "Your Recommended Strategy",
      start_with: "Start with this Strategy",
    },
    budget: {
      title: "Budget Tracker",
      subtitle: "Organize income and expense categories to maintain a healthy surplus",
      monthly_income: "Monthly Take-Home Income",
      total_budgeted: "Total Budgeted",
      total_spent: "Total Spent",
      remaining: "Remaining Cash Flow",
      categories: "Expense Categories",
      add_category: "Add Category",
      name_placeholder: "Category name (e.g. Groceries, Rent)",
      budgeted: "Budget",
      spent: "Spent",
      over_budget: "Over Budget",
      within_budget: "Within Budget",
    },
    savings: {
      title: "Savings Goals Tracker",
      subtitle: "Track milestones and project completion dates with regular contributions",
      total_saved: "Total Saved",
      total_target: "Total Target",
      overall_progress: "Overall Progress",
      monthly_saving: "Available Monthly Savings",
      goals_list: "Your Savings Goals",
      add_goal: "Add Goal",
      goal_name_placeholder: "Goal name (e.g. Emergency Fund, Trip)",
      target_amount: "Target Amount",
      current_amount: "Current Saved",
      eta: "Estimated ETA",
      completed: "Completed! 🎉",
      months_to_go: "months left",
    },
    subs: {
      title: "Subscription Calculator",
      subtitle: "Audit and eliminate unused recurring monthly and annual costs",
      active_count: "Active Services",
      monthly_cost: "Monthly Cost",
      yearly_cost: "Yearly Cost",
      inactive_count: "Paused / Inactive",
      category_breakdown: "Monthly Cost by Category",
      all_subs: "All Subscriptions",
      add_sub: "Add Subscription",
      sub_name_placeholder: "Service name (e.g. Netflix, Spotify)",
      cost: "Cost",
      monthly: "Monthly",
      yearly: "Yearly",
      category: "Category",
      active: "Active",
      paused: "Paused",
    },
    bill_splitter: {
      title: "Bill Splitter",
      subtitle: "Divide costs fairly among friends and family",
      add_member: "Add Member",
      member_name: "Member Name",
      add_expense: "Add Expense",
      expense_name: "Expense Name",
      amount: "Amount",
      paid_by: "Paid By",
      balances: "Balances",
      owes: "owes",
      to: "to",
      total_expenses: "Total Expenses",
      clear_all: "Clear All",
    },
    education: {
      title: "Financial Knowledge Base",
      subtitle: "Proven principles to accelerate your journey to complete financial independence",
      read_more: "Read Guide",
    },
    footer: {
      brand_description: "The free, client-side debt payoff calculator and budget tracker. No account needed. No tracking. Just pure financial clarity.",
      privacy: "100% Client-Side — Your financial numbers never leave your browser",
      copyright: "家計管理 — Smart Financial Freedom Engine. All rights reserved.",
      built_for: "Built for debt-free futures",
      tools_heading: "Tools",
      learn_heading: "Learn",
      features_heading: "Features",
      dashboard_heading: "Dashboard",
      pdf_export: "PDF Report Export",
      multi_language: "Multi-Language Support (JA / EN)",
      strategy_compare: "Strategy Comparison",
      privacy_first: "Privacy-First Architecture",
    },
    faq: {
      title: "Frequently Asked Questions",
      q1: "What is Kakeikanri.online?",
      a1: "Kakeikanri.online is an online resource for practical personal-finance education, including household budgeting, expense tracking, savings habits, and monthly money management. It helps beginners build a simple, repeatable financial routine.",
      q2: "Is Kakeikanri.online free to use?",
      a2: "Yes, all basic tools and educational content on Kakeikanri.online are completely free to use.",
      q3: "Who is Kakeikanri.online for?",
      a3: "It is for anyone looking to take control of their finances, from beginners starting their first budget to those looking to optimize their savings and eliminate debt.",
      q4: "Does Kakeikanri.online provide financial advice?",
      a4: "No, Kakeikanri.online provides educational information and tools for informational purposes only. It does not provide professional financial, investment, or legal advice.",
      q5: "How do I start managing my household budget?",
      a5: "Start by listing all your monthly income and expenses. Use our Budget Tracker to categorize your spending and identify areas where you can save.",
      q6: "What is the 50/30/20 budgeting rule?",
      a6: "It's a simple guideline: 50% of income for needs, 30% for wants, and 20% for savings and debt repayment.",
      q7: "How much should I keep in an emergency fund?",
      a7: "Most experts recommend saving 3 to 6 months of essential living expenses in an easily accessible account.",
      q8: "Should I pay off debt or save first?",
      a8: "Generally, it's wise to build a small emergency fund first, then focus on high-interest debt while continuing to save for future goals.",
      q9: "Is my financial data safe?",
      a9: "Yes. All data remains on your local device's browser. We do not store or transmit your financial information to any external servers.",
      q10: "Can I use Kakeikanri.online on mobile?",
      a10: "Yes, the site is fully responsive and works perfectly on smartphones, tablets, and desktop computers.",
      q11: "What is a budget tracker?",
      a11: "A budget tracker is a tool that records your monthly income, fixed expenses, variable expenses, and savings. It helps you see where your money goes and identify categories that exceed your planned budget.",
      q12: "How do I use a budget tracker?",
      a12: "Enter your monthly take-home pay, add fixed bills such as rent, utilities, insurance, and subscriptions, then track variable spending such as groceries, transportation, and entertainment. At the end of the month, compare your planned budget with your actual spending.",
      q13: "What is the difference between fixed and variable expenses?",
      a13: "Fixed expenses stay about the same every month, such as rent, phone service, insurance, and subscriptions. Variable expenses change from month to month, such as groceries, gasoline, dining out, shopping, and entertainment.",
      q14: "Which expenses should I review first to save money?",
      a14: "Start with recurring fixed costs: mobile plans, subscriptions, insurance, utilities, food delivery, and unused memberships. Reducing fixed costs can create savings every month, while variable-cost cuts depend on ongoing habits.",
      q15: "How much should I save each month?",
      a15: "A practical target is 10–20% of your take-home pay, but begin with an amount you can automate consistently. Even a small automatic transfer on payday is more effective than waiting to save whatever remains at month-end.",
      q16: "How much should I keep in an emergency fund?",
      a16: "Start with a small emergency-fund target, such as $500 to $1,000, then build toward three to six months of essential living expenses. The right amount depends on your job stability, health coverage, dependents, and monthly obligations.",
      q17: "Should I track expenses daily or weekly?",
      a17: "Weekly tracking is easier for many people, but record large or unusual purchases immediately. The best method is the one you can maintain consistently.",
      q18: "What is a debt payoff planner?",
      a18: "A debt payoff planner organizes your debts by balance, interest rate, and minimum payment, then helps you decide where to put extra money each month. It can show your payoff order and progress toward becoming debt-free.",
      q19: "What is the debt avalanche method?",
      a19: "The avalanche method directs extra money toward the debt with the highest interest rate first, while paying the minimum on all other debts. It usually saves the most money in interest over time.",
      q20: "What is the debt snowball method?",
      a20: "The snowball method directs extra money toward the debt with the smallest balance first, while paying the minimum on all other debts. Once that debt is paid off, you add its payment to the next-smallest debt.",
      q21: "Which debt payoff method should I choose?",
      a21: "Choose the avalanche method if your main goal is minimizing interest, and the snowball method if quick wins help you stay motivated. Both methods require you to make every minimum payment and apply all extra money to one target debt at a time.",
      q22: "Should I save while paying off debt?",
      a22: "Yes. Build a small starter emergency fund before sending every spare dollar toward debt. This helps prevent an unexpected car repair, medical bill, or income disruption from forcing you to borrow again.",
      q23: "Should I pay off credit cards or student loans first?",
      a23: "In many cases, prioritize high-interest credit-card debt first because it usually costs more over time. Student loans may have lower rates and different repayment protections, so compare interest rates, minimum payments, and available repayment options before deciding.",
      q24: "What should I do if I cannot keep up with debt payments?",
      a24: "List every debt, payment, interest rate, and due date, then prioritize essential expenses such as housing, utilities, transportation needed for work, insurance, and required obligations. If you are at risk of missing payments, contact your lender early and consider speaking with a certified credit counselor.",
      q25: "What is a bill splitter?",
      a25: "A bill splitter divides a shared expense—such as a restaurant bill, trip cost, utility bill, or group purchase—among the people involved. It can also handle unequal shares, tax, tips, and individual add-ons.",
      q26: "How do I split a restaurant bill?",
      a26: "Add the food total, sales tax, and tip, then divide by the number of people if everyone ordered similarly. If orders differ significantly, assign each person their own items first, then split the shared tax and tip.",
      q27: "Should I split the tip equally?",
      a27: "If everyone received similar service, splitting the tip equally is simple and fair. If one person ordered much more food or drinks, calculate each person’s share of the pre-tax subtotal, then apply the same tip percentage to each share.",
      q28: "How should roommates split utilities?",
      a28: "Rent is often split by room size or by agreement, while electricity, gas, water, and internet are commonly split equally. If usage differs greatly, use meter readings or a usage-based rule and review the arrangement every few months.",
      q29: "How can we avoid bill-splitting disputes?",
      a29: "Agree before the expense on the total, participants, payment method, and whether tax, tips, or fees are included. Keep a record of who paid, who owes whom, and when the payment was completed.",
      q30: "Can a bill splitter handle unequal payments?",
      a30: "Yes. Enter each person’s individual items or percentage share, add shared costs such as tax, tip, delivery fees, or group purchases, and the tool can calculate each person’s final amount.",
    },
  },

};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default language is Japanese ("ja") as requested
  const [language, setLanguageState] = useState<SupportedLanguage>("ja");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("spensensie_language") as SupportedLanguage | null;
    if (saved && (saved === "en" || saved === "ja")) {
      setLanguageState(saved);
      document.documentElement.setAttribute("lang", saved);
    } else {
      document.documentElement.setAttribute("lang", "ja");
    }
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem("spensensie_language", lang);
    document.documentElement.setAttribute("lang", lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === "ja" ? "en" : "ja");
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let current: any = translations[language];

    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k];
      } else {
        // Fallback to English if key missing in target language
        let fallback: any = translations["en"];
        for (const fk of keys) {
          if (fallback && typeof fallback === "object" && fk in fallback) {
            fallback = fallback[fk];
          } else {
            fallback = key;
            break;
          }
        }
        current = fallback;
        break;
      }
    }

    // Safety guard: NEVER return an object to React JSX children
    if (typeof current === "object" || current === undefined || current === null) {
      return key;
    }

    return String(current);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}