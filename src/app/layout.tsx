import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import "./design-system.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LanguageProvider } from "@/components/providers/language-provider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef0f3" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0c0e" },
  ],
};

export const metadata: Metadata = {
  title: "KakeiKanri (家計管理) - Personal Finance and Debt Management App",
  description:
    "KakeiKanri (家計管理) is the best budget app and credit card debt payoff calculator. Compare Debt Snowball vs Avalanche, track budget, and export professional PDF reports.",
  keywords: [
    "debt payoff calculator",
    "credit card debt payoff calculator",
    "kakeikanri",
    "debt payoff planner",
    "debt payoff spreadsheet",
    "debt payoff",
    "budget tracker",
    "budget tracker app",
    "free budget tracker",
    "budget tracker template",
    "budget tracker google sheets",
    "best budget app",
    "budgeting apps",
    "free budgeting apps",
    "best apps for budgeting",
    "money tracker",
    "money management apps",
    "budget planner app",
    "家計簿",
    "家計簿 無料",
    "家計簿 エクセル",
    "家計簿 テンプレート",
    "家計簿 アプリ 無料",
    "家計簿 web",
    "支出管理",
    "支出管理 無料",
    "家計簿 印刷 無料",
    "収支管理",
    "貯金 計算",
    "貯金シミュレーション"
  ],
  authors: [{ name: "家計管理 Team" }],
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
  verification: {
    google: ["NJ9lfG5gSJGsY5qRXOAqsAjPYt10NihnwnHlnFJaYN0", "google9559afa4dce591dc"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-type="software" data-radius="sharp" suppressHydrationWarning>
      <head>
        <script async src="https://googletagmanager.com"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        </script>
        <meta name="page-type" content="software" />
        <meta name="site-kind" content="software" />
        <link rel="icon" href="/logo.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/logo.jpg" />
        <meta name="google-site-verification" content="NJ9lfG5gSJGsY5qRXOAqsAjPYt10NihnwnHlnFJaYN0" />
        <meta name="google-site-verification" content="google9559afa4dce591dc" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@400..700&family=Geist+Mono:wght@400..500&family=Noto+Serif+JP:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" rel="stylesheet" />
      </head>
      <body>
        <ThemeProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
