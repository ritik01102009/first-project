---
name: design-md
description: Curated collection of 84+ real-world DESIGN.md design system specifications (Stripe, Linear, Vercel, Supabase, Claude, Figma, Apple, etc.) based on Google Stitch standards. Use when designing, styling, or generating UI components, establishing visual consistency, or applying a brand design language to a project.
version: 1.0.0
---

# Design MD (`DESIGN.md`) Skill

A skill for applying and generating UI adhering to **`DESIGN.md`** specifications—a design system document format introduced by Google Stitch that AI coding agents read to build visually consistent, production-grade interfaces.

```
AGENTS.md  -> How to build the project (tech stack, conventions, tools)
DESIGN.md  -> How the project should look and feel (design tokens, colors, type, components, tone)
```

---

## What is Inside This Skill

This skill contains 84+ verified `DESIGN.md` design system profiles extracted from leading products and design teams, located in `references/`:

### Available Design Systems by Category

- **Developer Tools & Cloud**:
  - `vercel` — Minimalist monochrome precision, Geist sans/mono typography, crisp borders.
  - `linear.app` — Ultra-refined dark mode, subtle purple/indigo accents, crisp keyboard shortcuts.
  - `supabase` — Emerald green accents, high-contrast dark surfaces, code-forward styling.
  - `cursor` — Sleek dark chrome, gradient accents, IDE-inspired UI.
  - `warp` — Terminal block styling, modern monospace aesthetic.
  - `hashicorp`, `posthog`, `sentry`, `datadog-labs`, `clickhouse`, `mongodb`

- **AI & Frontier Tech**:
  - `claude` — Warm terracotta accents, soft paper tones, editorial layouts, refined typography.
  - `cohere` — Vibrant multi-color gradients, data-dense enterprise dashboard aesthetics.
  - `elevenlabs` — Cinematic dark mode, waveform visuals, glowing highlights.
  - `minimax`, `mistral.ai`, `ollama`, `replicate`, `runwayml`, `together.ai`, `x.ai`, `voltagent`

- **Design, Creative & Web**:
  - `figma` — Vibrant multi-color badges, toolbars, playful canvas interactions.
  - `framer` — Motion-first layouts, bold typography, sleek dark/light contrasts.
  - `webflow`, `miro`, `clay`, `airtable`

- **Fintech & Enterprise**:
  - `stripe` — Industry-standard financial precision, vibrant gradients, clean cards, polished typography.
  - `coinbase`, `kraken`, `binance`, `revolut`, `wise`, `mastercard`, `mercury`, `sap`, `oracle`

- **Productivity & Consumer**:
  - `apple` — Human Interface Guidelines, subtle translucent blur, SF Pro styling.
  - `notion` — Clean minimal workspace, warm backgrounds, refined typography.
  - `cal` — Clean scheduling interface, subtle neutral borders.
  - `intercom`, `resend`, `mintlify`, `superhuman`, `slack`, `spotify`, `starbucks`, `nike`, `tesla`

---

## How to Use This Skill

### 1. Apply a Pre-Built Design System to a Project
To adopt a design style for the current project:
1. Locate the desired design under `references/<brand>/DESIGN.md`.
2. Copy it to the project root as `DESIGN.md`:
   ```powershell
   Copy-Item -Path .agents/skills/design-md/references/<brand>/DESIGN.md -Destination ./DESIGN.md
   ```
3. Whenever generating components or pages, instruct the agent to follow the root `DESIGN.md`.

### 2. Inspect a Specific Design Spec
Read the design file directly to inspect its color tokens, typography scales, spacing rules, and component patterns:
```powershell
Get-Content .agents/skills/design-md/references/<brand>/DESIGN.md
```

### 3. Generate UI Adhering to DESIGN.md
When implementing UI components (React, Tailwind CSS, Next.js, HTML/CSS):
- **Colors**: Use the exact semantic tokens specified in `DESIGN.md` (backgrounds, borders, muted text, accents).
- **Typography**: Adhere strictly to the font families, scale, line heights, and weights defined in the spec.
- **Elevation & Radius**: Apply the defined border radiuses (e.g. `rounded-md`, `rounded-full`) and shadow elevations.
- **Tone & Layout**: Match the visual rhythm, density (compact vs spacious), and component anatomy.

