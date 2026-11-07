# Claude Code Guidelines - kakeikanri

This is a Next.js (App Router) project built with React 18, TypeScript, Tailwind CSS v4, Lucide icons, and Recharts.

## Development Commands

- `npm run dev` (or `bun run dev`): Start development server
- `npm run build`: Build production assets
- `npm run lint`: Run ESLint checks
- `npm run deploy`: Build project for deployment (Netlify)

## Next.js Rules & Conventions

- This project uses modern Next.js conventions (`app/` directory).
- Check `AGENTS.md` for specific Next.js agent notes and documentation.
- Maintain documentation integrity and preserve existing comments.

## Code Style & Architecture

- **Language**: TypeScript (`strict: true`)
- **Styling**: Tailwind CSS v4 with PostCSS
- **State & Forms**: `react-hook-form` + `zod` validation
- **Animations & UI**: `framer-motion` and `lucide-react`
- **Charts**: `recharts`

