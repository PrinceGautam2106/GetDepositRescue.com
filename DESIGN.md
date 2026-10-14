# DESIGN.md - Design Language & Standards

## 1. Aesthetic: Vercel-Inspired Minimalist Legal-Tech
- **Theme:** Default dark mode with deep monochrome neutrals. Light mode supported via high-contrast slate tones.
- **Palette:**
  - Background (canvas): `#000000` (Pure Black) or `#09090b` (Zinc-950)
  - Cards & Containers: `#121215` (Zinc-900) with a 1px border of `#27272a` (Zinc-800)
  - Interactive Hover Borders: `#3f3f46` (Zinc-700)
  - Text Primary: `#fafafa` (Zinc-50)
  - Text Secondary: `#a1a1aa` (Zinc-400)
  - Text Muted: `#71717a` (Zinc-500)
  - Success/Win: `#10b981` (Emerald-500) - Used for statutory penalty calculations & positive claims
  - Violation/Urgency: `#f43f5e` (Rose-500) - Used for landlord deadline violations
  - Interactive Primary CTA: `#ffffff` background with `#000000` text, inverted hover (`hover:bg-zinc-200`)
  - Secondary CTA: `#18181b` (Zinc-900) with 1px border `#27272a` (`hover:bg-zinc-800`)
- **Typography:**
  - Headings & Interface: Inter or Geist Sans (`font-sans`)
  - Statutory Data, Money Numbers, Penalties: JetBrains Mono or Geist Mono (`font-mono`)
- **Spacing & Layout:**
  - Compact, intentional information density.
  - Border radius: `rounded-lg` (8px) for cards, `rounded-md` (6px) for inner form inputs.
  - Transition duration: `transition-all duration-150 ease-out`.
