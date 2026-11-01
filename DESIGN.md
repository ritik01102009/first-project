---
version: alpha
name: Stripe-Inspired-KakeiKanri-design-system
description: An inspired interpretation of Stripe's world-class financial infrastructure design language adapted for KakeiKanri / SpendSensie — featuring deep navy ink, electric indigo primary, atmospheric gradient mesh, tabular-figure financial numbers, tight pill buttons, crisp hairline cards, and full mobile responsiveness across all devices (320px–1440px+).

colors:
  primary: "#533afd"
  primary-deep: "#4434d4"
  primary-press: "#2e2b8c"
  primary-soft: "#665efd"
  primary-bg-subdued-hover: "#b9b9f9"
  brand-dark-900: "#0f172a"
  brand-dark-950: "#020617"
  ink: "#0d253d"
  ink-secondary: "#273951"
  ink-mute: "#64748d"
  ink-mute-2: "#61718a"
  on-primary: "#ffffff"
  canvas: "#ffffff"
  canvas-soft: "#f8fafc"
  canvas-cream: "#f5e9d4"
  hairline: "#e2e8f0"
  hairline-dark: "#1e293b"
  hairline-input: "#cbd5e1"
  emerald: "#10b981"
  emerald-soft: "#ecfdf5"
  ruby: "#ea2261"
  magenta: "#f96bee"
  lemon: "#eab308"
  shadow-blue: "#003770"

typography:
  font-primary: "Inter, 'SF Pro Display', system-ui, -apple-system, sans-serif"
  font-tabular: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
  features:
    global: "font-feature-settings: 'ss01'"
    numbers: "font-feature-settings: 'tnum', 'zero'"

rounded:
  xs: 4px
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  2xl: 20px
  pill: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  huge: 64px

components:
  button-primary-pill:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
    minHeight: "44px"
    touchTarget: ">= 44px"
  button-secondary-pill:
    backgroundColor: "transparent"
    borderColor: "{colors.hairline}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
    minHeight: "44px"
  card-feature-light:
    backgroundColor: "{colors.canvas}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.xl}"
    padding: "20px (mobile) / 28px (desktop)"
    boxShadow: "0 1px 3px rgba(0,55,112,0.06), 0 1px 2px rgba(0,55,112,0.04)"
  card-dashboard-metric:
    backgroundColor: "{colors.canvas}"
    rounded: "{rounded.lg}"
    padding: "16px (mobile) / 20px (desktop)"
    borderColor: "{colors.hairline}"
  mobile-nav-bar:
    touchTarget: "min 48px height per link"
    overflowX: "auto"
    scrollSnapType: "x mandatory"

mobile-responsiveness:
  breakpoints:
    xs: "< 375px (Compact Mobile: iPhone SE, Galaxy Fold outer)"
    sm: "375px - 639px (Standard Mobile: iPhone 13-16, Pixel)"
    md: "640px - 767px (Large Mobile / Phablet)"
    lg: "768px - 1023px (Tablet Portrait)"
    xl: "1024px - 1279px (Laptop / Tablet Landscape)"
    2xl: ">= 1280px (Desktop)"
  guidelines:
    touch-targets: "Minimum 44x44px for all buttons, toggles, and inputs"
    safe-areas: "Respect iOS safe area insets on mobile navigation and sticky headers"
    horizontal-scroll: "No accidental horizontal body overflow; charts and tables must wrap or scroll smoothly within their parent card"
    metric-cards: "Stack 1-column on mobile (< 640px), 2-column on tablet (640px-1023px), 4-column on desktop (>= 1024px)"
    tabs-navigation: "Provide sticky touch-friendly mobile bottom bar or smooth horizontal scrollable pill ribbon"
    data-tables: "Card-based summary on mobile; full column table with sticky headers on desktop"
---

# KakeiKanri / SpendSensie — Stripe-Inspired Design System

## Overview
This design system adapts Stripe's renowned financial UI principles to KakeiKanri / SpendSensie. It pairs deep ink typography and electric indigo/emerald financial accents with high-precision numeric tables, tactile pill buttons, and responsive card layouts engineered for seamless use on any mobile phone, tablet, or desktop display.

### Core Visual Signatures
1. **Financial Clarity & Tabular Figures**: Every currency figure, balance, and calculation uses tabular figures (`tnum`, `font-mono`) for alignment across ledgers and calculators.
2. **Atmospheric Mesh & Depth**: Subtle top ambient gradient mesh on light and dark surfaces gives cards an elevated, physical presence without clutter.
3. **Decisive Pill Actions**: Short, high-contrast pill action buttons (`rounded-full`, min 44px touch height on mobile).
4. **Mobile-First Layout**: Every dashboard metric, debt payoff chart, budget slider, and subscription card is engineered to adapt gracefully from narrow 320px screens up to ultrawide monitors.

