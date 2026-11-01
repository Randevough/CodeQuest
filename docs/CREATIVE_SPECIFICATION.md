# CodeQuest Creative Specification: Playful Arcade Design System

**Document Version:** 1.0.0  
**Status:** Approved Specification  
**Branch:** `feature/creative-arcade-design`  
**Target Platform:** CodeQuest Developer Platform (Cyber University)  
**Governing Principles:** `DESIGN.md`, `antislop-ui`, `antislop-copywriting`, `design-md` (WCAG 2.2 AA)

---

## 1. Executive Summary & Brand Identity Vision

CodeQuest is a gamified developer bounty platform for Cyber University students. The visual language must balance two distinct forces:
1. **Developer Workstation:** High density, crisp legibility, unambiguous data hierarchy, rapid keyboard access, and zero decorative noise that hinders task execution.
2. **Playful Arcade:** Chunky physical cartridges, tactile push-buttons with mechanical travel, arcade cabinet chassis depth, coin-op tokens, and high-energy neon highlights.

### The Core Metaphor: The Retro-Arcade Developer Terminal
Rather than a generic SaaS product pretending to be "cool" through dark backgrounds and purple gradients, CodeQuest embodies a **physical arcade terminal** tailored for software developers:
- Surfaces behave like physical matte arcade chassis plates (`#17112E`) and recessed slot trays (`#251B43`).
- Interactive elements possess **tactile weight** — buttons extrude 4px down (`0 4px 0 [edge-token]`) and mechanically depress by `2px` on click.
- High-contrast neon accents (`#B7F94D` Electric Lime, `#42D9EF` Cyber Cyan) simulate illuminated LED switches and cabinet neon tubes, never muddy gradients.
- Typography speaks with confidence: punchy display titles, paired with ultra-readable geometric text and monospaced terminal metrics.

---

## 2. D1: Visual System Audit & Root-Cause Diagnosis

An exhaustive audit of the baseline application reveals why it previously felt like a generic dark SaaS with purple and grid rather than an authentic Playful Arcade platform.

### 2.1 The 7 Visual "Slop" Tells in the Baseline App

| # | Visual Symptom | Technical Cause | Why It Reads as Generic Dark SaaS | Required Arcade Fix |
|---|----------------|-----------------|-----------------------------------|----------------------|
| **1** | **Ubiquitous Repeating Background Grid** | `body` styled with `background-image: linear-gradient(...)` 32px grid in `src/app/globals.css`. | Default AI/SaaS cliché to fake a "technical" look without brand intent (`antislop-ui` R-07). | Stripped from `body`. Page canvas is solid deep void `#0D0A1F`. Grid is reserved solely for targeted arcade panels (`.arcade-grid-bg`) with explicit purpose. |
| **2** | **Blurred Radial Neon Orbs** | `src/app/page.tsx` hero rendered `bg-secondary/20 blur-3xl` and `bg-primary/15 blur-3xl` radial blobs. | Training-data default seen on hundreds of AI landing pages. Creates muddy contrast and visual soup. | Replace blurred ambient orbs with hard-edged cabinet panels, crisp borders, and tactile cartridge containers. |
| **3** | **Brittle Icon Web Font (FOUT & Text Leaks)** | `<link>` and `@import` to Google Fonts `Material Symbols Outlined`. Usage via `<span className="material-symbols-outlined">icon_name</span>`. | External CDN network request blocks rendering. When fonts fail, latency spikes, or offline, ligatures leak raw text ("emoji_events", "military_tech", "travel_explore"). | Replace fragile font ligatures with zero-dependency, self-contained SVG icon components. |
| **4** | **Inconsistent Tactile Mechanics** | Mixed button classes: `.button-primary` had purple control border on lime; other buttons used generic Tailwind `bg-zinc-800 rounded-lg`. | No unified physics model. Interactive controls lacked consistent mechanical depth. | Standardize `.button-primary` and `.button-secondary` with `0 4px 0` edge shadows, matching border edges, and active `translateY(2px)`. |
| **5** | **Flat Leaderboard (No Hall of Fame)** | `LeaderboardTable.tsx` had `const borderAccent = ''`; top 3 ranks looked identical to rank 10 except for icon color. | Lacks gaming prestige; reads like an administrative enterprise table rather than an arcade high-score podium. | Implement distinctive gold (`#FFD166`), silver (`#C4BBD8`), and bronze (`#D97706`) arcade podium pedestal accents with high-score badge flair. |
| **6** | **Quest Cards as Blog Posts** | `QuestCard.tsx` and `WorkspaceQuestCard.tsx` had flat surface backgrounds with thin purple borders. | Looked like generic documentation or blog cards rather than collectible bounty cartridges. | Redesign as physical arcade quest cartridges with distinct difficulty badges, clear dev slot meters, and tactile hover states. |
| **7** | **External Third-Party Avatar Dependency** | Heavy reliance on `api.dicebear.com` HTTP queries across `auth.ts`, `user.ts`, `profile.tsx`, and `LeaderboardTable.tsx`. | Broken images on flaky networks, privacy leakage, and inconsistent visual styles. | Build a deterministic, offline SVG `UserAvatar` fallback system using user seed hashing and arcade color mapping. |

---

## 3. D2.1: Palette & Token Hierarchy

The CodeQuest palette is engineered on a strict **80 / 15 / 5** balance to maintain high contrast, dark-mode ergonomics, and vibrant arcade energy.

```
┌────────────────────────────────────────────────────────────────────────┐
│                                                                        │
│   80% Dark Arcade Void & Chassis                                       │
│   #0D0A1F (Canvas)  •  #17112E (Surface)  •  #251B43 (Raised Slot)     │
│                                                                        │
├────────────────────────────────────────┬───────────────────────────────┤
│   15% Violet Circuitry & Borders       │   5% Neon Kinetic Energy      │
│   #4A3B68 (Border) • #6D28B8 (Violet)  │   #B7F94D (Lime 1P Action)    │
│   #8876A8 (Control) • #41176E (Edge)   │   #42D9EF (Focus) • #FFD166   │
└────────────────────────────────────────┴───────────────────────────────┘
```

### 3.1 Design Token Reference Table

| Semantic Token | HEX Value | RGB Tuple | Semantic Role & Intent | Text Color Rule |
|----------------|-----------|-----------|------------------------|-----------------|
| `--color-bg` | `#0D0A1F` | `13 10 31` | Deep arcade interior void / page canvas. | Paired with `--color-text` (`#F7F5FF`) |
| `--color-surface` | `#17112E` | `23 17 46` | Cabinet chassis panels, cards, navigation bar, inputs. | Paired with `--color-text` (`#F7F5FF`) |
| `--color-surface-raised` | `#251B43` | `37 27 67` | Elevated trays, modal dialogues, active dropdowns, hover cards. | Paired with `--color-text` (`#F7F5FF`) |
| `--color-border` | `#4A3B68` | `74 59 104` | Decorative dividers, structural seams, card boundaries. | Non-text UI boundary (3.2:1 vs `#0D0A1F`) |
| `--color-control-border`| `#8876A8` | `136 118 168` | Interactive input borders, secondary button outlines. | High-visibility control boundary (4.5:1 vs `#17112E`) |
| `--color-text` | `#F7F5FF` | `247 245 255` | Primary body text, titles, prominent data figures. | High contrast (16.8:1 vs `#17112E`) |
| `--color-text-muted` | `#C4BBD8` | `196 187 216` | Secondary labels, metadata, timestamps, input placeholders. | Subtle contrast (9.9:1 vs `#17112E`) |
| `--color-primary` | `#B7F94D` | `183 249 77` | **1P Primary Action:** Neon Lime CTA, quest claims, active highlights. | **STRICT: Must use `--color-on-primary` (`#0D0A1F`). NEVER white!** |
| `--color-primary-hover`| `#C9FF78` | `201 255 120` | Hover state for 1P Primary buttons. | Dark text (`#0D0A1F`) |
| `--color-primary-edge` | `#609C26` | `96 156 38` | Bottom 3D shadow extrusion for Lime buttons (`0 4px 0`). | Border and shadow depth |
| `--color-on-primary` | `#0D0A1F` | `13 10 31` | Text and icons rendered atop Lime primary surfaces. | 15.4:1 contrast ratio |
| `--color-secondary` | `#6D28B8` | `109 40 184` | **2P Secondary Action:** Arcade Violet buttons, active tabs, squad tags. | Paired with `--color-on-secondary` (`#F7F5FF`) |
| `--color-secondary-hover`| `#7A32C8`| `122 50 200` | Hover state for 2P Secondary buttons. | Light text (`#F7F5FF`) |
| `--color-secondary-edge`| `#41176E`| `65 23 110` | Bottom 3D shadow extrusion for Violet buttons and panel drops. | Shadow depth |
| `--color-on-secondary` | `#F7F5FF` | `247 245 255` | Text and icons rendered atop Violet secondary surfaces. | 7.35:1 contrast ratio |
| `--color-focus` | `#42D9EF` | `66 217 239` | Cyber Cyan keyboard focus rings, active navigation indicators. | 10.7:1 contrast ratio vs `#17112E` |
| `--color-warning` | `#FFD166` | `255 209 102` | Arcade Gold coins, 1st place podium, urgent quest warnings. | 12.6:1 contrast ratio vs `#17112E` |
| `--color-info` | `#79DFF2` | `121 223 242` | Info notices, Specialist quest tags, system hints. | 12.4:1 contrast ratio vs `#17112E` |
| `--color-success` | `#80E6AD` | `128 230 173` | Approved submissions, Novice quest tags, active streaks. | 12.0:1 contrast ratio vs `#17112E` |
| `--color-danger` | `#FF9AAA` | `255 154 170` | Drop quest action, penalties, submission rejections. | 9.0:1 contrast ratio vs `#17112E` |

---

## 4. D2.2: Contrast Validation Matrix (WCAG 2.2 AA)

All color combinations in CodeQuest comply with WCAG 2.2 Level AA requirements:
- **Normal Text (< 18pt / < 14pt bold):** Minimum contrast ratio of **4.5:1**
- **Large Text (>= 18pt / >= 14pt bold) & UI Components:** Minimum contrast ratio of **3.0:1**

### 4.1 Contrast Verification Engine Data

Exact computed relative luminance:
$$\text{Luminance } L = 0.2126 \cdot R_{lin} + 0.7152 \cdot G_{lin} + 0.0722 \cdot B_{lin}$$
$$\text{Contrast Ratio } CR = \frac{L_1 + 0.05}{L_2 + 0.05}$$

| Foreground Token | Background Token | Exact Ratio | WCAG Normal (>= 4.5:1) | WCAG Large/UI (>= 3.0:1) | Assessment & Rule |
|------------------|------------------|-------------|-------------------------|--------------------------|-------------------|
| `--color-text` (`#F7F5FF`) | `--color-bg` (`#0D0A1F`) | **18.01:1** | **PASS (AAA)** | **PASS (AAA)** | Ultra-crisp reading text on canvas. |
| `--color-text` (`#F7F5FF`) | `--color-surface` (`#17112E`) | **16.83:1** | **PASS (AAA)** | **PASS (AAA)** | High-contrast standard card body text. |
| `--color-text` (`#F7F5FF`) | `--color-surface-raised` (`#251B43`) | **14.78:1** | **PASS (AAA)** | **PASS (AAA)** | Modal dialogue and elevated card text. |
| `--color-text-muted` (`#C4BBD8`) | `--color-bg` (`#0D0A1F`) | **10.60:1** | **PASS (AAA)** | **PASS (AAA)** | Metadata and subtitles on canvas. |
| `--color-text-muted` (`#C4BBD8`) | `--color-surface` (`#17112E`) | **9.90:1** | **PASS (AAA)** | **PASS (AAA)** | Card metadata, labels, and timestamps. |
| `--color-text-muted` (`#C4BBD8`) | `--color-surface-raised` (`#251B43`) | **8.70:1** | **PASS (AAA)** | **PASS (AAA)** | Dialog hints and placeholder text. |
| `--color-on-primary` (`#0D0A1F`) | `--color-primary` (`#B7F94D`) | **15.43:1** | **PASS (AAA)** | **PASS (AAA)** | **Mandatory:** Dark text on lime button. |
| *`#FFFFFF` (White)* | `--color-primary` (`#B7F94D`) | **1.26:1** | **FAIL** | **FAIL** | **FORBIDDEN:** White text on lime is illegible. |
| `--color-on-secondary` (`#F7F5FF`) | `--color-secondary` (`#6D28B8`) | **7.35:1** | **PASS (AAA)** | **PASS (AAA)** | Light text on arcade violet button. |
| `--color-focus` (`#42D9EF`) | `--color-surface` (`#17112E`) | **10.73:1** | **PASS (AAA)** | **PASS (AAA)** | Keyboard focus ring visibility. |
| `--color-focus` (`#42D9EF`) | `--color-bg` (`#0D0A1F`) | **11.48:1** | **PASS (AAA)** | **PASS (AAA)** | Focus indicators on raw canvas. |
| `--color-control-border` (`#8876A8`)| `--color-surface` (`#17112E`) | **4.50:1** | **PASS (AA)** | **PASS (AAA)** | Input field and control borders. |
| `--color-warning` (`#FFD166`) | `--color-surface` (`#17112E`) | **12.60:1** | **PASS (AAA)** | **PASS (AAA)** | Points coin badges and gold podium. |
| `--color-success` (`#80E6AD`) | `--color-surface` (`#17112E`) | **11.97:1** | **PASS (AAA)** | **PASS (AAA)** | Success state and Novice badges. |
| `--color-danger` (`#FF9AAA`) | `--color-surface` (`#17112E`) | **9.04:1** | **PASS (AAA)** | **PASS (AAA)** | Danger warnings and drop buttons. |

---

## 5. D2.3: Component Personality & Design Blueprints

### 5.1 Tactile Arcade Buttons (Physics & State Engine)

Arcade buttons must simulate the physical travel of arcade leaf-switch buttons.
- **Resting state:** Elevated with a solid 4px edge shadow (`0 4px 0 [edge-token]`).
- **Hover state:** Surfaces brighten (`--color-primary-hover`), edge shadow remains rigid.
- **Active / Pressed state:** Button physically translates downward by `2px` (`translateY(2px)`), reducing edge shadow to `2px` (`0 2px 0 [edge-token]`). This preserves layout allocation without causing layout shifts.
- **Focus state:** Cyan focus ring (`#42D9EF`) with `2px` outline and `2px` offset, keeping the tactile edge intact.
- **Disabled state:** Flat border, `opacity: 0.5`, `box-shadow: none`, `transform: none`, `cursor: not-allowed`.

```css
/* Tactile Button Specifications */
.button-primary {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid var(--color-primary-edge);
  border-radius: var(--radius-button); /* 16px */
  padding: 10px 20px;
  font-family: var(--font-geist-sans), system-ui, sans-serif;
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background-color: var(--color-primary); /* #B7F94D */
  color: var(--color-on-primary); /* #0D0A1F */
  box-shadow: 0 4px 0 var(--color-primary-edge); /* #609C26 */
  transition: background-color 140ms ease, box-shadow 140ms ease, transform 140ms ease;
}

.button-primary:hover:not(:disabled) {
  background-color: var(--color-primary-hover); /* #C9FF78 */
}

.button-primary:active:not(:disabled) {
  transform: translateY(2px);
  box-shadow: 0 2px 0 var(--color-primary-edge);
}

.button-secondary {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid var(--color-control-border); /* #8876A8 */
  border-radius: var(--radius-button);
  padding: 10px 20px;
  font-family: var(--font-geist-sans), system-ui, sans-serif;
  font-size: 15px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background-color: var(--color-secondary); /* #6D28B8 */
  color: var(--color-on-secondary); /* #F7F5FF */
  box-shadow: 0 4px 0 var(--color-secondary-edge); /* #41176E */
  transition: background-color 140ms ease, box-shadow 140ms ease, transform 140ms ease;
}

.button-secondary:hover:not(:disabled) {
  background-color: var(--color-secondary-hover); /* #7A32C8 */
}

.button-secondary:active:not(:disabled) {
  transform: translateY(2px);
  box-shadow: 0 2px 0 var(--color-secondary-edge);
}
```

---

### 5.2 Quest Cards: The Bounty Cartridge Metaphor

Quest cards are styled as **physical game cartridges** slotted into the terminal.

#### Anatomy of a Quest Cartridge:
1. **Chassis Header:**
   - **Difficulty Badge:** Retro cartridge labels with dedicated contrast accents:
     - `Novice` / `Beginner`: Green border `#80E6AD`, text `#80E6AD`, background `#17112E`.
     - `Specialist` / `Intermediate`: Cyan border `#79DFF2`, text `#79DFF2`, background `#17112E`.
     - `Elite` / `Advanced`: Lime border `#B7F94D`, text `#B7F94D`, background `#17112E`.
     - `Legendary` / `Exclusive`: Gold border `#FFD166`, text `#FFD166`, background `#17112E` with 1px inset ring.
   - **Track Tag:** Web, AI, Mobile, Security, Systems (`#C4BBD8` with `#4A3B68` border).
   - **Bounty Token:** Coin badge featuring points value (e.g., `250 PTS`) with `#FFD166` coin icon and border.
2. **Title & Mission Brief:**
   - H3 in `Geist Sans` 700 with high-contrast text (`#F7F5FF`).
   - Description in `Geist Sans` 400 (`#C4BBD8`), bounded to 2 lines for rhythmic card height.
3. **Cartridge Bottom Slot (Metadata & Dev Gauge):**
   - **Dev Capacity Gauge:** Slot count indicator (e.g., `2/3 Devs`). Filled slots turn `#FF9AAA` when full, `#B7F94D` when slots remain.
   - **Countdown Timer:** Tabular monospaced time indicator (`3d left`, `4h left`, or `Expired`).
4. **Interactive Hover Physics:**
   - On hover, the cartridge lifts slightly (`translateY(-2px)`) and gains a hardened arcade panel shadow (`0 4px 0 var(--color-secondary-edge)`). No generic blurred drop-shadows.

---

### 5.3 Leaderboard: The Hall of Fame Podium

The leaderboard celebrates top developer prestige using arcade high-score table conventions.

#### Podium Hierarchy:

```
          ┌─────────────────┐
          │     RANK 01     │  Gold Crown • #FFD166
          │   1ST PODIUM    │  Border Accent: 3px Solid Gold
          │  + Gold Shimmer │  Shadow: 0 4px 0 #805300
          └────────┬────────┘
  ┌────────────────┴────────┬────────────────┐
  │         RANK 02         │    RANK 03     │
  │       2ND PODIUM        │   3RD PODIUM   │
  │ Silver Star • #C4BBD8   │ Bronze Medal   │
  │ Border: 3px Solid Silver│ Border: Bronze │
  └─────────────────────────┴────────────────┘
  ────────────────────────────────────────────
  RANKS 04 - 10+: Clean Monospaced Rows (#04, #05)
```

1. **Rank 01 (Grandmaster Champion):**
   - Row styled with `.arcade-podium-1` (3px solid `#FFD166` left border + subtle 8% gold tint gradient).
   - Golden trophy icon + bold monospaced rank `01` in `#FFD166`.
   - Avatar framed with a `#FFD166` 2px ring.
2. **Rank 02 (Master Contender):**
   - Row styled with `.arcade-podium-2` (3px solid `#C4BBD8` left border + subtle 8% silver tint gradient).
   - Silver medal icon + bold monospaced rank `02` in `#C4BBD8`.
   - Avatar framed with a `#C4BBD8` 2px ring.
3. **Rank 03 (Elite Challenger):**
   - Row styled with `.arcade-podium-3` (3px solid `#D97706` bronze border + subtle 8% bronze tint gradient).
   - Bronze badge icon + bold monospaced rank `03` in `#D97706`.
   - Avatar framed with a `#D97706` 2px ring.
4. **Ranks 04 through 10+:**
   - Clean tabular rows with monospaced numbers (`04`, `05`, `12`).
   - Subtle hover highlight (`bg-surface-raised`), clear quest count, tabular points column.
5. **Player Standing Widget (`UserStanding.tsx`):**
   - Sticky HUD card showing player rank with ordinal suffixes (`1st`, `2nd`, `3rd`, `14th`).
   - "Points to Overtake" progress meter displaying points needed to advance to the next rank.
   - Primary action linking directly to character profile using `.button-secondary`.

---

### 5.4 Player Profile: The Player Character Sheet

The profile page functions as an **Arcade Player Character Sheet**:
- **Player Banner & Avatar Frame:** Avatar surrounded by a retro status ring reflecting rank or role (Admin / Guild Master / Member).
- **Player Metadata HUD:** Handle, enrolled university email (`@cyber-univ.ac.id`), and date joined presented in a structured badge cluster.
- **Stats Arcade Grid:**
  - `TOTAL POINTS`: Monospaced numbers in gold (`#FFD166`).
  - `QUESTS COMPLETED`: Count of verified submissions in lime (`#B7F94D`).
  - `CURRENT SQUAD`: Active squad affiliation or "Solo Adventurer".
  - `GUILD RANK`: Current standings position.
- **Badge Showcase:** Pixel-style trophy shelf containing unlocked achievement badges with distinct rarity borders.
- **Tabbed Activity Log:** Clear separation between `Active Quests`, `Completed History`, and `Earned Badges`.

---

### 5.5 UserAvatar Fallback System

External avatar generation endpoints (such as `api.dicebear.com`) are strictly banned from production runtime dependencies. They fail when offline, leak user requests to third parties, and introduce visible layout flash.

#### The CodeQuest Native Offline Avatar Standard:
When `user.avatar` or `user.image` is null:
1. Compute a deterministic 32-bit hash from the user's `id` or `name`.
2. Map the hash to one of 6 arcade token colors:
   - `0`: `#6D28B8` (Arcade Violet)
   - `1`: `#006B80` (Cyan Depth)
   - `2`: `#609C26` (Forest Lime)
   - `3`: `#805300` (Bronze Gold)
   - `4`: `#78658F` (Amethyst)
   - `5`: `#B01B41` (Crimson)
3. Extract up to 2 uppercase initials from the player's name (e.g. "Alex Mercer" -> "AM", "Budi" -> "BU").
4. Render an inline SVG or CSS container with bold monospaced font, 100% offline, zero network latency, zero broken icons.

```tsx
// Architectural Specification: Deterministic Arcade Avatar Fallback
export function UserAvatarFallback({ name, id, size = 40 }: { name?: string | null; id?: string; size?: number }) {
  const seed = (name || id || 'Player').trim();
  const hash = Array.from(seed).reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) | 0, 0);
  const palette = ['#6D28B8', '#006B80', '#609C26', '#805300', '#78658F', '#B01B41'];
  const bg = palette[Math.abs(hash) % palette.length];
  
  const initials = seed
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('') || 'CQ';

  return (
    <div
      style={{ width: size, height: size, backgroundColor: bg }}
      className="rounded-full flex items-center justify-center font-mono font-bold text-white select-none border border-border shrink-0"
      aria-label={name || 'Player Avatar'}
    >
      <span style={{ fontSize: Math.floor(size * 0.42) }}>{initials}</span>
    </div>
  );
}
```

---

## 6. D2.4: SVG Iconography Standard

### 6.1 Why Material Symbols Font Is Deprecated
The baseline application loads `Material Symbols Outlined` via an external Google Fonts `@import`. This introduces critical failures:
1. **Network Dependency:** Font blocking causes layout shifts (CLS) and delays first paint.
2. **FOUT & Text Leaks:** Before the font loads, or when offline, browser renders raw ligatures in UI ("sports_esports", "military_tech", "travel_explore").
3. **Inconsistent Stroke Weights:** Material Symbols renders with blurry anti-aliasing on dark backgrounds at small sizes (14-16px).

### 6.2 The CodeQuest Native SVG Standard
All icons must be rendered as **crisp, inline SVG elements** or dedicated SVG icon components.
- **ViewBox:** `0 0 24 24`
- **Fill:** `none`
- **Stroke:** `currentColor`
- **Stroke Width:** `2px` (or `2.5px` for small 14px indicators)
- **Stroke Linecap:** `round`
- **Stroke Linejoin:** `round`
- **Accessibility:** Interactive icon buttons must supply `aria-label`; decorative icons must supply `aria-hidden="true"`.

### 6.3 CodeQuest Master Iconography Catalog

| Platform Action / Entity | Icon Semantic Name | SVG Path Definition (`viewBox="0 0 24 24"`, `fill="none"`, `stroke="currentColor"`, `strokeWidth="2"`) |
|--------------------------|-------------------|---------------------------------------------------------------------------------------------------------|
| **Explore Quests** | `IconCompass` | `<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>` |
| **Leaderboard / Trophy** | `IconTrophy` | `<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H7v4h10v-4h-2c-.55 0-1-.45-1-1v-2.34"/><path d="M6 4h12v7a6 6 0 0 1-12 0V4z"/>` |
| **Workspace / Code** | `IconTerminal` | `<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>` |
| **Snatch / Claim Bounty**| `IconZap` | `<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>` |
| **Drop Quest** | `IconTrash` | `<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>` |
| **Devs / Squad** | `IconUsers` | `<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>` |
| **Coins / Points** | `IconCoin` | `<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><line x1="12" y1="9" x2="12" y2="15"/>` |
| **Deadline / Timer** | `IconTimer` | `<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>` |
| **Check / Success** | `IconCheckCircle`| `<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>` |
| **Warning / Alert** | `IconAlertTriangle`| `<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>` |
| **Notification Bell** | `IconBell` | `<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>` |
| **Player Profile** | `IconUser` | `<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>` |
| **Search / Filter** | `IconSearch` | `<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>` |
| **Arrow Action** | `IconArrowRight`| `<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>` |
| **Admin Shield** | `IconShield` | `<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>` |

---

## 7. D2.5: Microcopy & Anti-Slop Writing Rules

Per `antislop-copywriting` and `antislop-ui` standards, copy in CodeQuest must reflect genuine student developer culture: direct, technically grounded, action-oriented, and completely devoid of generic corporate AI puffery.

### 7.1 The Trailing Period Rule
**NEVER use trailing periods on short UI microcopy.**
Trailing periods add visual clutter and make headings, buttons, and badges read like formal sentences rather than interactive targets.

| Component Type | Prohibited (With Period) | Required Standard (No Period) |
|----------------|--------------------------|--------------------------------|
| **Button / CTA** | `Explore Quests.` | `Explore Quests` |
| **Button / CTA** | `Snatch Quest.` | `Snatch Quest` |
| **Hero Heading** | `LEVEL UP YOUR CODE.` | `LEVEL UP YOUR CODE` |
| **Section Heading** | `Global Leaderboard.` | `Global Leaderboard` |
| **Card Title** | `Full-Stack Task Runner.` | `Full-Stack Task Runner` |
| **Badge / Status** | `SEASON 1 ACTIVE.` | `SEASON 1 ACTIVE` |
| **Badge / Status** | `100 PTS.` | `100 PTS` |
| **Toast Alert** | `Quest snatched successfully.` | `Quest snatched successfully` |
| **Form Input Label** | `GitHub Repository URL.` | `GitHub Repository URL` |
| **Table Header** | `Total Points.` | `Total Points` |
| **Empty State Title** | `No Active Quests.` | `No Active Quests` |

*Exception:* Multi-sentence instructional body copy (e.g. detailed quest mission requirements or FAQ paragraphs) retains grammatical periods between and at the end of full prose sentences.

---

### 7.2 Antislop Copywriting Lexicon: Developer Action vs Corporate Slop

| Context | Forbidden AI / Corporate Slop | Required CodeQuest Arcade Copy | Rationale |
|---------|-------------------------------|--------------------------------|-----------|
| **Hero Headline** | *Unlock the revolutionary power of next-level developer journeys* | **LEVEL UP YOUR CODE** | Direct, concise, grounded in gaming reality. |
| **Hero Subtitle** | *Empowering students to embark on seamless, cutting-edge software transformation* | **Claim real campus software bounties, build in collaborative squads, and earn verified guild points** | Concrete actions with verifiable objects (`antislop-copywriting` R-16). |
| **Taking a Quest** | *Enroll in this educational module* / *Register your interest* | **Snatch Quest** | "Snatch" captures competitive arcade mechanics. |
| **Dropping a Quest**| *Cancel participation in task* | **Drop Quest** | Direct, honest, standard gaming terminology. |
| **Submitting Code** | *Submit assignment for grading evaluation* | **Ship Submission** | "Ship" is authentic developer vernacular. |
| **Peer Review** | *Perform quality assessment protocol* | **Review PR** | Exact technical action. |
| **Leaderboard Empty**| *There is currently no data available in this view* | **No ranked members yet** | Eliminates filler; states the reality cleanly. |
| **Verification Alert**| *Please be advised that your token has been accepted* | **Email verified. You're ready to play** | Short, welcoming, human. |
| **Squad Status** | *Collaborative syndicate unit* | **Squad** | Simple, clear, standard. |

---

## 8. D3: Polish Design Tokens in `src/app/globals.css`

The following polish has been executed on `src/app/globals.css` and `tailwind.config.ts`:
1. **Body Background Grid Removed:** The global `background-image` linear-gradient grid was removed from `body`, restoring clean dark void `#0D0A1F` ergonomics across all screens.
2. **Arcade Grid Utility Scoped:** `.arcade-grid-bg` remains available as an opt-in utility for dedicated hero backgrounds and terminal panels.
3. **Tactile Button Shadows Refined:**
   - `.button-primary` border explicitly locked to `var(--color-primary-edge)` (`#609C26`) to avoid muddy purple border conflicts.
   - Mechanical travel defined: `transform: translateY(2px)` with `box-shadow: 0 2px 0 var(--color-primary-edge)`.
4. **Arcade Podium Utility Classes Added:**
   - `.arcade-podium-1` (Gold #FFD166 border + tint)
   - `.arcade-podium-2` (Silver #C4BBD8 border + tint)
   - `.arcade-podium-3` (Bronze #D97706 border + tint)
5. **Tailwind Extended Box Shadows:**
   - `"arcade-gold": "var(--shadow-podium-gold)"`
   - `"arcade-silver": "var(--shadow-podium-silver)"`
   - `"arcade-bronze": "var(--shadow-podium-bronze)"`

---

## 9. Implementation Checklist & Component Migration Roadmap

For developers and subagents executing UI refactoring:

- [x] **D1 Audit Completed:** Core dark SaaS tells diagnosed and cataloged.
- [x] **D2 Specification Authored:** `docs/CREATIVE_SPECIFICATION.md` created with exact tokens, contrast calculations, component blueprints, icon catalogs, and copy rules.
- [x] **D3 Token Polish:** `src/app/globals.css` and `tailwind.config.ts` updated with tactile shadows, podium tokens, and body grid removal.
- [ ] **Phase 1 Migration - Buttons:** Audit all buttons across `src/components` and convert raw Tailwind classes to `.button-primary` or `.button-secondary`.
- [ ] **Phase 2 Migration - Leaderboard:** Apply `.arcade-podium-1`, `.arcade-podium-2`, and `.arcade-podium-3` in `src/components/leaderboard/LeaderboardTable.tsx`.
- [ ] **Phase 3 Migration - Quest Cards:** Update `QuestCard.tsx` and `WorkspaceQuestCard.tsx` to adopt the bounty cartridge styling and difficulty badge rules.
- [ ] **Phase 4 Migration - Native SVG Icons:** Replace `<span className="material-symbols-outlined">...</span>` with inline SVG components from the Master Catalog.
- [ ] **Phase 5 Migration - Offline UserAvatar:** Implement `UserAvatar.tsx` fallback to replace external `api.dicebear.com` HTTP dependencies.
- [ ] **Phase 6 Verification:** Run `npm run type-check`, `npm run lint`, and verify WCAG contrast compliance.
