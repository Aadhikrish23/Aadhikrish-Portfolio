---
name: Aadhi.dev Portfolio (public site)
description: A dark, quiet monograph where the work is the subject - ink and slate neutrals, one calm steel-blue accent, a big editorial serif.
colors:
  ink: "#0b0f14"
  panel: "#11161d"
  hairline: "#232b36"
  mist-white: "#e8ecf1"
  slate-text: "#b2becc"
  slate-dim: "#96a2b0"
  slate-field: "#1b2433"
  steel-blue: "#3f6fb5"
typography:
  display-hero:
    fontFamily: "Bodoni Moda Variable, Georgia, serif"
    fontSize: "clamp(3.75rem, 8vw, 6rem)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  display-section:
    fontFamily: "Bodoni Moda Variable, Georgia, serif"
    fontSize: "clamp(3rem, 6vw, 4.5rem)"
    fontWeight: 500
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Bodoni Moda Variable, Georgia, serif"
    fontSize: "2.25rem"
    fontWeight: 500
    lineHeight: 1.25
  title:
    fontFamily: "Bodoni Moda Variable, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: "Geist Variable, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Geist Variable, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
rounded:
  none: "0px"
spacing:
  gutter: "20px"
  gutter-md: "40px"
  section: "112px"
  block: "56px"
components:
  button-primary:
    backgroundColor: "{colors.steel-blue}"
    textColor: "#ffffff"
    rounded: "{rounded.none}"
    padding: "14px 28px"
  button-primary-hover:
    backgroundColor: "{colors.slate-text}"
    textColor: "#ffffff"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.mist-white}"
    rounded: "{rounded.none}"
    padding: "14px 28px"
  button-outline-hover:
    backgroundColor: "{colors.mist-white}"
    textColor: "{colors.ink}"
  tag-chip:
    backgroundColor: "transparent"
    textColor: "{colors.slate-text}"
    rounded: "{rounded.none}"
    padding: "4px 12px"
  slate-field:
    backgroundColor: "{colors.slate-field}"
    textColor: "{colors.mist-white}"
    rounded: "{rounded.none}"
---

# Design System: Aadhi.dev Portfolio (public site)

Scope: the public pages only (Home, Projects, Project detail, Blog, Blog post). The admin panel keeps its own slate styling and is not described here. All public tokens are CSS variables (RGB triplets) scoped to `.site` in `client/src/index.css`, exposed as Tailwind colors in `client/tailwind.config.js`. The slate-field token is still named `--brown` / `bg-brown` in code; the name is historical, the value is slate.

Content is data, not code. Hero headline, tagline, bio and portrait, About statement, paragraphs, experience, tech focus, interests and contact details are edited in the admin Site Settings page; projects, posts and skills come from the API. This system styles whatever those fields contain.

## Overview

**Creative North Star: "The Quiet Monograph"**

A dark, quiet monograph in which the work is the subject and the interface recedes. Cool ink and slate neutrals carry the page, a large high-contrast Bodoni serif carries every heading, and a single steel-blue accent marks the few places the visitor can act or is currently located. The owner chose this cooler, professional and elegant palette over the original warm-earth reference; it is the binding palette.

Everything is square-edged and flat: slabs, images, buttons and chips have no radius and no card elevation, and there is no curved or geometric decoration. Depth comes from full-bleed slate fields set against ink, and from hairlines. All photography (portrait, project screenshots, blog covers) is natural color with no tint, duotone or parallax. The site is dark-only; there is no light theme.

**Key Characteristics:**
- Ink ground, slate-field full-bleed bands, slate-text secondary copy and mist-white primary text.
- Steel blue reserved for the primary button, active-nav underline, link and action underlines, the short dash by the hero tagline, selection, the server-status dot and the reading-progress bar.
- Bodoni Moda for display only, Geist for everything else.
- Radius 0 on all UI; no curved accent motif.
- Project screenshots and blog covers are shown whole, never cropped or tinted.
- One authored entrance (hero), restrained motion elsewhere, all gated by reduced-motion.

## Colors

A narrow cool palette: near-black ink, one lifted panel, one hairline, two slate text tones, a slate field, and a single calm blue.

### Primary
- **Steel Blue** (`steel-blue`, rgb 63 111 181): primary button fill (white text), active-nav 2px underline, 2px to 4px underlines under inline links and "View All" actions, the 40px dash beside the hero tagline, highlighted hero words, list dashes on project detail, arrow hover on cards, text selection, the server-status dot, the reading-progress bar and blog quote borders. Never text on the slate field: it fails 4.5:1 there.

### Secondary
- **Slate Field** (`slate-field`, rgb 27 36 51): full-bleed bands (About experience, contact close, empty-project placeholder). Field color only; text on it is mist white.

### Neutral
- **Ink** (`ink`, rgb 11 15 20): page ground, also the text color on hovered mist buttons.
- **Panel** (`panel`, rgb 17 22 29): barely lifted surfaces, skeletons, image wells, status pill, error block.
- **Hairline** (`hairline`, rgb 35 43 54): section dividers, chip and image borders, scrolled-navbar border.
- **Mist White** (`mist-white`, rgb 232 236 241): primary text; the only text color on the slate field. Dividers on the field use it at 25% opacity.
- **Slate Text** (`slate-text`, rgb 178 190 204): secondary and running copy, nav links at rest, outline-button border and focus outline, hover fill of the primary button.
- **Slate Dim** (`slate-dim`, rgb 150 162 176): tertiary text (counters, bullets, "+N" overflow).

Markdown links in blog prose use a lifted blue (`rgb 124 164 230`, #7ca4e6) with a steel-blue underline so link text stays legible on ink.

### Named Rules
**The Blue-Is-Signal Rule.** Steel blue marks action and place: fills, underlines, a dash, a dot, a progress bar. If it would color a sentence on the slate field, use mist white with a blue underline instead.
**The Slate-Is-Ground Rule.** Slate field is a band, not a text color. Text on it is mist white only.

## Typography

**Display Font:** Bodoni Moda Variable, with optical-size axis (fallback Georgia, serif)
**Body Font:** Geist Variable (fallback system-ui, sans-serif)

**Character:** A razor-contrast Didone against a neutral geometric sans: studio monograph over engineering clarity. The serif is never used small.

### Hierarchy
- **Display hero** (500, 3.75rem / 4.5rem / 6rem by breakpoint, 1.02, -0.025em): hero headline only, revealed word by word.
- **Display section** (500, 3rem / 4.5rem, 1.02, -0.025em): section titles (About Me, Skills, Projects, Blog) and blog post titles.
- **Headline** (500, 1.875rem to 2.25rem, ~1.2): project titles, About lead (weight 400), experience roles, contact heading scaling 2.25rem to 3.75rem.
- **Title** (400-500, 1.5rem): sub-blocks (Tech Focus, Interests), empty/error state titles, skill category names at 1.5rem to 1.875rem.
- **Body** (Geist 400, 1.125rem, relaxed): hero bio, experience highlights; running copy at 1rem in slate text. Cap at 52-56ch.
- **Label** (Geist 400-500, 0.875rem): nav links, chips, meta lines. Sentence case; no uppercase, no letter-spaced labels.

### Named Rules
**The Serif-Is-Loud Rule.** Bodoni is for headings and pull statements at 1.5rem and up. Everything smaller is Geist.

## Layout

One centered column, `max-w-6xl` (72rem) with 20px side gutters, 40px from `md`. A 12-column grid drives composition: hero is 7 + 5 (text left, portrait right), About lead is 7 + 5, experience is 5 + 7, contact is heading 7 + link rows 5, skills are one equal-width column per category (up to five) each under a 1px slate-text hairline at 40% opacity, projects are one wide lead (21:9 frame hint from `md`, 16:9 below) followed by an asymmetric row of 7 columns and 5 columns with the narrow one dropped 7rem. Sections stack with a hairline top border and 80px (112px from `md`) vertical padding. Full-bleed slate fields break out of the column while their content returns to it. Fixed navbar is 4rem tall; the hero fills `100dvh - 4rem`. Sections carry anchors (`#about`, `#skills`, `#projects`, `#blog`, `#contact`) with `scroll-mt-16` so the fixed navbar never covers a heading. Breakpoints: sm 640, md 768, lg 1024.

## Elevation & Depth

Flat and tonal. Depth is conveyed by field contrast (ink, panel, slate field) and hairlines. The single shadow in the system is the server-status pill (`shadow-lg` in black at 40%), a transient floating notice. Cards, buttons and chips never carry shadow.

Z-index scale: status pill 30, navbar 40, reading progress bar 50.

### Named Rules
**The Flat-By-Default Rule.** Surfaces are flat. Only the transient status pill floats.

## Shapes

Square. Radius is 0 on every slab, image, button, chip, input-like surface and prose image. There is no curved accent shape and no decorative bar or block; shape language is rectangles, hairlines, and short 2px dashes used as list bullets and the tagline mark. Chips and cards use 1px hairline borders; empty states use a dashed hairline.

## Components

### Buttons
- **Shape:** rectangle, radius 0, padding 14px x 28px (primary, outline), 12px x 24px on detail pages.
- **Primary:** steel-blue fill, white text (`on-accent`), weight 500. Hover turns slate text. Press nudges down 1px.
- **Outline:** 1px slate-text border, mist-white text; hover fills mist white with ink text.
- **Inline link:** mist-white text with a 2px steel-blue underline (`border-b-2` for "View All" actions).
- **Focus:** 2px slate-text outline, 3px offset, for all `.site` elements.

### Chips
- **Tech tag:** 1px hairline border, slate-text, 14px, padding 4px x 12px; overflow shown as plain "+N" in slate dim.
- **Skill index:** no tiles, fills or borders. Each category is a column that starts with a 1px hairline, a Bodoni category title, and a plain list: a 22px single-colour glyph in slate text beside 17px mist-white text, 12px apart. Skills are ordered strongest first (level, then name). Glyphs come from a curated single-colour set (`monoIcons.ts`) and brighten to mist white on hover; a custom-uploaded icon or unmapped skill keeps its own artwork, greyscaled at rest with colour restored on hover. Never letter monograms as a first choice.

### Cards / Containers
- **Project card:** image frame (whole screenshot, natural color and proportion, `object-contain`, capped at 34rem tall, 1px hairline border on a panel well that lightens to slate text on hover) over text; title in Bodoni, arrow-up-right icon turning steel blue on hover, summary in slate text cut on a word boundary, up to four tags. Info is always visible, never hover-only. A project with no image shows a slate-field plate with its initial in large Bodoni.
- **Slate field:** full-bleed band, mist-white text only.
- **Contact rows:** on the slate field, heading left and three link rows (Email, GitHub, LinkedIn) right; each row is a top-ruled line (mist white at 25%) with a 24px icon, small label over a larger value, and an arrow-up-right at the far end that drifts up and right on hover. Text dims to slate text on hover.
- **Kerned display text:** Bodoni Moda has no kerning pair for W before a lowercase letter or for P/F before round letters and r, which leaves visible gaps in CMS-driven titles. Dynamic display text goes through the `Kerned` component, which applies a measured negative letter-spacing to just those pairs. Do not fix this with global tracking.

### Navigation
Fixed 4rem row: site-name wordmark in Bodoni left, three Geist links (Home, Projects, Blog) right. Active link has a 2px steel-blue bottom border and mist-white text; inactive are slate text, hover mist white. Transparent at top, ink with a hairline after 20px of scroll. No hamburger; the three links fit at all widths.

### Photography
Images are never filtered. Project screenshots and blog covers are shown whole and uncropped (`object-contain`, tall images letterboxed). The hero portrait sits in a 4:5 frame, natural color, positioned to keep the face. No duotone, tint or parallax.

### Motion
One authored sequence: hero headline words rise out of a mask (0.8s, 50ms stagger), supporting lines rise in, the portrait is revealed by a clip-path wipe (1.1s). Easing is `cubic-bezier(0.16, 1, 0.3, 1)`. Scroll `Reveal` (28px rise, 0.8s, once) is used only on project cards. All motion collapses to static under `prefers-reduced-motion`.

### State blocks
Loading is a pulsing panel skeleton; empty is a dashed-hairline box with a Bodoni title and optional underlined action; error is a bordered panel with an outline "Try again". The server wake-up pill is a hairline-bordered panel with a steel-blue square dot.

### Analytics
Vercel Analytics is mounted in the public layout only; it has no visual footprint.

## Do's and Don'ts

### Do:
- **Do** keep radius at 0 and decoration to hairlines and short dashes.
- **Do** set text on the slate field in mist white only.
- **Do** show every image in natural color; show screenshots and covers whole.
- **Do** use Bodoni for headings at 1.5rem and above, Geist below.
- **Do** keep steel blue to fills, underlines, dashes, dots and progress marks.
- **Do** give every motion a `prefers-reduced-motion` static fallback.
- **Do** keep project information visible without hover.
- **Do** keep copy editable as data; do not hard-code owner content into components.

### Don't:
- **Don't** use steel blue, slate text or slate dim as text where they fall below 4.5:1 (blue on the slate field).
- **Don't** add a light theme or a dark-mode toggle; the site is dark-only.
- **Don't** introduce pills, rounded cards or soft card shadows.
- **Don't** add neon, gradient fills, decorative curves or a centered gradient hero.
- **Don't** apply duotone, tint, sepia or parallax to photography.
