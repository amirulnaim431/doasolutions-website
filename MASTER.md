# DOA Solutions — Master Design System

This document is the canonical design source for the DOA Solutions website, Showcase, and About experience.

## Brand foundation

- Purpose: turn fragmented, manual business operations into reliable digital systems.
- Audience: Malaysian SMEs and growing service businesses that need websites, dashboards, booking, POS, CRM, workforce, reporting, automation, infrastructure, and support.
- Voice: direct, capable, practical, calm. Explain outcomes before technology.
- Visual metaphor: a control layer connecting the moving parts of a business.
- Never: generic startup gradients, invented client results, playful SaaS illustrations, excessive glass, or motion that competes with the message.

## Shared tokens

### Color

| Token | Value | Role |
|---|---:|---|
| `ink-950` | `#07100d` | Primary dark background |
| `ink-900` | `#0b1713` | Elevated dark surface |
| `ink-800` | `#13231d` | Borders and secondary surfaces |
| `bone-50` | `#f4f1e8` | Primary light surface and dark-mode text |
| `bone-100` | `#e8e3d6` | Secondary light surface |
| `slate-500` | `#5b6c64` | Muted text on light surfaces |
| `green-500` | `#22c77a` | Brand action and live-system signal |
| `green-400` | `#51e49b` | Dark-mode accessible highlight |
| `green-700` | `#08784a` | Light-mode action |
| `amber-400` | `#f0b84b` | Experimental accent only |
| `red-500` | `#e25d5d` | Error |
| `signal-violet` | `#9970ff` | RoyalLegacyz portal |
| `signal-copper` | `#e08b43` | KKI portal |
| `signal-blue` | `#5497ff` | H&N Takaful portal |
| `signal-rose` | `#f486a6` | Lindo Clinic portal |
| `signal-amber` | `#f0b84b` | Inaz Mobile Spa portal |

All normal text must meet WCAG AA contrast. Green is never the sole carrier of meaning.

### Typography

- Display/headings: `Arial Narrow`, `Roboto Condensed`, `Helvetica Neue`, sans-serif.
- Body: `Inter`, `Segoe UI`, system-ui, sans-serif.
- Technical labels/data: `IBM Plex Mono`, `SFMono-Regular`, Consolas, monospace.
- Display: `clamp(3.5rem, 10vw, 9.5rem)`, 800, line-height .85–.95, tight tracking.
- H1: `clamp(3rem, 7vw, 7rem)`, 750, line-height .9.
- H2: `clamp(2.25rem, 5vw, 5rem)`, 720, line-height .95.
- H3: `clamp(1.35rem, 2vw, 2rem)`, 650, line-height 1.05.
- Body: `clamp(1rem, 1.25vw, 1.125rem)`, 400, line-height 1.65.
- Label: `.72rem`, 650, uppercase, tracking `.16em`.

### Spacing and layout

- Base unit: 4px; primary rhythm: 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 144.
- Content width: 1440px maximum; readable copy width: 68ch.
- Gutters: 20px mobile, 32px tablet, 48–72px desktop.
- Breakpoints: 375 / 768 / 1024 / 1440.
- Desktop grid: 12 columns. Mobile: one primary content column.
- Section rhythm is spacious; operational/data areas may become denser.

### Shape and elevation

- Main site: 0–8px radii, 1px borders, flat layered surfaces.
- Showcase: 16–28px radii for portals, light emitted through borders.
- About: mostly square, occasional pill only for metadata.
- Shadows: reserved for floating interactive elements; depth primarily uses borders, overlap, color, and light.

### Motion

- Signature ease: `cubic-bezier(.2, 0, 0, 1)`.
- Ambient ease: `cubic-bezier(.4, 0, .2, 1)`.
- Durations: 120ms micro, 280ms standard, 520ms cinematic, 900ms ambient.
- Entrances: transform + opacity with stagger under 400ms total.
- Exits: shorter and quieter than entrances.
- Animate transforms and opacity, not layout dimensions.
- `prefers-reduced-motion` disables continuous and scroll-linked effects.

### Components

- Buttons: one primary CTA per section; minimum 44px touch target; clear hover, focus, active and disabled states.
- Cards: semantic links/articles, visible action without relying on hover.
- Navigation: persistent desktop navigation, compact accessible mobile menu.
- Focus: 2px `green-400` outline with 3px offset on dark; `green-700` on light.
- Decorative canvas/WebGL is `aria-hidden` and never blocks pointer input.

## Page direction: Main website

- Mood: premium industrial, trustworthy, precise, calm.
- Palette: bone-dominant editorial surface with graphite control panels and operational green.
- Composition: asymmetrical hero, strict technical grid, evidence-led sections.
- Components: sharp bordered modules, system-map canvas, direct CTAs.
- Motion: corporate 150–300ms interactions, restrained scroll reveals, no bounce.
- Primary effect: lightweight Canvas 2D connected-node system; static diagram fallback.

## Page direction: Showcase

- Mood: cinematic, futuristic, immersive, curated.
- Palette: near-black, bone text, electric green, spectral steel.
- Composition: single 3D hero object followed by deep project portals.
- Components: rounded project worlds, numeric index, industry and capability metadata.
- Motion: GSAP 300–700ms choreography, ScrollTrigger reveals, Three.js pointer depth.
- Fallback: static CSS orbital graphic for reduced motion, low-power devices, or WebGL failure.

## Page direction: About DOA Solutions

- Mood: bold, experimental, editorial, candid.
- Palette: bone/black inversion with green and a limited amber interruption.
- Composition: asymmetric manifesto, oversized type, modular field notes.
- Components: square thesis blocks, numbered principles, capability ledger.
- Motion: energetic 120–350ms typography and pointer response; no gimmick that obscures company facts.
- Primary effect: CSS/SVG composition with minimal JavaScript.

## Accessibility and performance contract

- Semantic landmarks and sequential headings.
- Skip links and visible keyboard focus.
- 44px minimum touch targets and no hover-only information.
- No horizontal overflow at 375px.
- Reduced-motion static state remains complete and readable.
- Canvas/WebGL pauses when the page is hidden and disposes resources on unmount.
- Showcase effects degrade before content or navigation does.
