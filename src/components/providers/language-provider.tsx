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
    dashboard: "Dashboard",
    debt: "Debt Payoff",
    recommender: "Method Finder",
    budget: "Budget Tracker",
    savings: "Savings Goals",
    subscriptions: "Subscriptions",
    bill_splitter: "Bill Splitter",
    education: "Learn",
    theme_toggle: "Toggle theme",
    lang_toggle: "Change language (Current: English)",
  },
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
      q1: "住宅ローンは年収の何倍まで借りられますか？（住宅ローン 年収の何倍）",
      a1: "住宅ローンの借入額の目安は、年収の5倍〜7倍程度が一般的です。金融機関の審査基準では年収の7〜8倍程度まで融資を受けられるケースもありますが、無理のない返済を続けるための安全圏は「年収の5〜6倍」、年間返済比率（返済負担率）では「手取り年収の20〜25%以内」が理想とされています。借入可能額ではなく「返済可能額」を基準にシミュレーションすることが重要です。",
      q2: "住宅ローン控除は何年間受けられますか？（住宅ローン控除 何年間）",
      a2: "住宅ローン控除（住宅借入金等特別控除）の控除期間は、新築住宅・買取再販住宅の場合で原則13年間、中古（既存）住宅の場合は10年間です。毎年末の住宅ローン残高（上限額あり）の0.7%が、所得税および一部住民税から直接控除されます。13年間の控除を受けるには、省エネ基準適合住宅やZEH水準、長期優良住宅などの省エネ性能基準を満たしている必要があります。",
      q3: "住宅ローンは何歳まで借り入れ・完済ができますか？（住宅ローン 何歳まで）",
      a3: "住宅ローンの借入可能年齢は多くの金融機関で「満65歳〜70歳未満」、完済時の年齢上限は「満80歳未満（79歳まで）」に設定されています。ただし定年退職後も返済が続くと老後生活資金を圧迫するリスクがあります。そのため、30代〜40代前半までに借入を行い「65歳までに完済するプラン」を組むか、退職金や繰り上げ返済を活用してリタイア前に残高を減らす返済計画が推奨されます。",
      q4: "住宅ローンはどこの金融機関がいいですか？（住宅ローン どこがいい）",
      a4: "最適な借入先は、「金利タイプ」「団信（団体信用生命保険）の充実度」「借入諸費用」の優先順位によって異なります。ネット銀行（auじぶん銀行・住信SBIネット銀行など）は最低水準の変動金利と無料団信が魅力です。メガバンクは対面サポートや安心感を重視する方に適しています。全期間固定金利を希望するなら住宅金融支援機構の「フラット35」が最適です。",
      q5: "住宅ローンの繰り上げ返済とは何ですか？（繰り上げ返済とは）",
      a5: "住宅ローンの「繰り上げ返済」とは、毎月の約定返済とは別に、まとまった資金を支払って元金の一部または全部を前倒しで返済する仕組みです。支払った金額すべてが元金の返済に充当されるため、その元金にかかる将来の利息を大幅に軽減できます。返済期間を縮める「期間短縮型」と、毎月の返済額を軽くする「返済額軽減型」があります。",
      q6: "家計簿とは何ですか？つけるメリットは？（家計簿とは）",
      a6: "家計簿とは、家庭における日々の収入と支出を記録・管理し、お金の流れ（収支状況）を可視化するための帳簿です。最大の目的は単にレシートを記録することではなく、「何にいくら使っているか（使途不明金の特定）」を把握し、支出の優先順位を見極めて「貯蓄・投資に回す余剰資金を生み出すこと」にあります。",
      q7: "エクセルで家計簿を作るにはどうすればいいですか？（家計簿 エクセル 作り方）",
      a7: "エクセルで使いやすい家計簿を作る基本手順は4ステップです。①「日付」「費目」「内容」「支出額」「収入額」「支払い方法」のヘッダーを作成。②月間合計やカテゴリ別集計にSUM関数やSUMIF関数を設定。③別シートに月別収支ダッシュボードを作成。④ピボットテーブルや円グラフで支出割合を可視化します。",
      q8: "ノートを使った手書き家計簿の作り方を教えてください（家計簿ノート 作り方）",
      a8: "手書き家計簿を挫折せずに続けるコツは、ノートを見開き2ページで1ヶ月分管理することです。左ページに家賃や光熱費などの固定費と予算目標を書き、右ページに日々の変動費を食費・生活費など3〜4つの最小限のカテゴリで記録します。1円単位の厳密さよりも大枠を把握することが継続の秘訣です。",
      q9: "デット・スノーボール方式とアバランチ方式の違いは何ですか？",
      a9: "スノーボール方式は金利に関係なく「残高の小さい借入」から優先して完済し、心理的な達成感を積み重ねる方法です。アバランチ方式は「金利（年利%）が最も高い借入」から優先して返済し、支払う利息総額を数学的に最小化する方法です。",
      q10: "Kakeikanri（家計管理）のデータは安全ですか？",
      a10: "はい。当サイトのツールはすべてクライアント側（ブラウザ内）でのみ処理され、財務データが外部サーバーに送信・保存されることは一切ありません。プライバシーを第一に設計されています。"
    },
  },
  en: {
    app: {
      name: "KakeiKanri",
      tagline: "Smart Financial Freedom Engine",
    },
    nav: {
    dashboard: "Dashboard",
    debt: "Debt Payoff",
    recommender: "Method Finder",
    budget: "Budget Tracker",
    savings: "Savings Goals",
    subscriptions: "Subscriptions",
    bill_splitter: "Bill Splitter",
    education: "Learn",
    theme_toggle: "Toggle theme",
    lang_toggle: "Change language (Current: English)",
  },
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
      title: "Frequently Asked Questions (FAQ)",
      q1: "How many times your annual income can you borrow for a housing loan?",
      a1: "As a general guideline, a safe mortgage borrowing limit is between 5 to 7 times your gross annual income. While financial institutions may approve up to 7 to 8 times your income as a ceiling, a financially secure benchmark is 5 to 6 times income, with an annual debt-to-income ratio within 20% to 25% of take-home pay.",
      q2: "How many years does the housing loan tax deduction last?",
      a2: "The mortgage tax deduction in Japan lasts for 13 years for newly built and certified resale homes, and 10 years for standard existing homes. Borrowers receive an annual tax deduction of up to 0.7% of their year-end loan balance credited against income tax.",
      q3: "Up to what age can you borrow or pay back a housing loan?",
      a3: "Most banks allow borrowing up to age 65 to 70, with the final repayment age ceiling set at age 79 (before turning 80). To ensure financial stability after retirement, it is recommended to plan for full payoff before age 65.",
      q4: "Which bank or lender is best for a housing loan?",
      a4: "The ideal lender depends on your priorities: online banks offer the lowest variable interest rates and free disease insurance riders; megabanks provide comprehensive in-person branch consultation; and Flat 35 (JHF) offers guaranteed long-term fixed interest rates.",
      q5: "What is early repayment (pre-payment) of debt?",
      a5: "Early repayment means paying an additional lump sum toward your loan principal beyond regular monthly installments. Because 100% of the prepayment reduces the principal balance, it directly saves on future interest payments.",
      q6: "What is a household budget / expense tracker?",
      a6: "A household budget (Kakeibo) is a system for tracking and visualizing daily income and expenditures. The primary purpose is identifying untracked spending and creating surplus cash flow for savings and investing.",
      q7: "How do you make an expense tracker in Excel?",
      a7: "To build an Excel budget tracker: 1) create columns for Date, Category, Item, Amount, and Payment Method; 2) use SUM and SUMIF formulas to calculate totals; 3) build a monthly summary dashboard; and 4) generate charts to visualize expense distribution.",
      q8: "How do you create a handwritten expense tracker notebook?",
      a8: "For a sustainable handwritten notebook: use a two-page monthly spread. Write fixed costs and budget goals on the left page, and log daily variable expenses on the right page grouped into 3-4 simple categories like Groceries, Living, and Discretionary.",
      q9: "What is Kakeikanri.online?",
      a9: "Kakeikanri.online is an online resource for practical personal-finance education, including household budgeting, expense tracking, savings habits, and monthly money management. It helps beginners build a simple, repeatable financial routine.",
      q10: "Is my financial data safe?",
      a10: "Yes. All data remains on your local device's browser. We do not store or transmit your financial information to any external servers."
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