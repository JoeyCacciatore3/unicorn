# Wavedash store-page update — STAGED, ready to paste

**Currency: B48-52 shipped & aligned (git `main == origin == d7b5671`; Wavedash playtest build `mn732cds3bswb9902e5jphnqz98eb6n8`).** Build **13,229 B / 83 free (99.4%)**, save **v46** via single `const SV`. B48-52: title palette self-syncs to the spawn zone (EAST RUN, matches the opening); rainbow top-HUD lettering; clouds raised/spread to the top; thicker floating HP bars; a single post-intro RC-rainbow-cycling arrow → ? button (replaces the over-unicorn verb popup); HARD FINISH ending — GREATCORN win dialogue removed, last-boss kill IS the finale (freeze → VICTORY banner celebration → hard cut to title). Both console gates 0 errors on the B48-52 dist. NOTE: title screenshot + cover still show the pre-B48 palette — re-capture before final upload. Enemy base-logic: SPIKE→BOUNCE eject (no per-kind guards; blocked foes pace the moat edge); mushroom bounce for foes AND bosses; three sky altitudes. B46+B47: 7 low perchers→leaping hunters + charge kinds gained a charge-safe HOP cap (leaping chargers that bounce off mushroom pads) + RED-pit rung raised (boss can escape) + dialogue anti-mash cooldown (last teaching bubble readable); both console gates 0 errors on the B47 dist. Copy re-verified against `src/*.js`. The world is a **480×38 spine-and-loop** map — a surface spine with the spawn hub at center (tile 240), difficulty ramping outward, distinct zone shapes, varied-height hills (h3-h4) enclosing surface bosses, a parallel sky highway (traverse at altitude or on the ground), and an underground **cave network** carved into rock (three distinct systems with chambers, 2-tall skinny tunnels, single-entrance secrets, 6 chests, cave voids you platform across to escape). Platform/mushroom/cave-clearance placement is enforced by a stable-math geometry gate (tools/map-geometry.mjs). B38 fixed iPhone landscape/fullscreen (canvas sized from its own box, not visualViewport). The **skill tree is gone** (abilities always-on); all six enemies are **grounded walkers**.

> ✅ **MEDIA: 100% FRESH (2026-09-12)** — all capture media re-shot live against the current build; references below are current.

**Why this doc exists:** the store page (title, description, cover, screenshots, tags, trailer) is editable **only** in the web Developer Portal — session-auth gated. The CLI/API key has NO store-metadata endpoint. An agent cannot push these; they need your logged-in browser. Everything below is pre-written so your part is copy-paste + file-pick.

Portal: **https://wavedash.com/dev-portal** → your game → Store page.
> ✅ **Slug CONFIRMED = `hoovesofhope`**, portal title **"Hooves Of Hope"**. Verified 2026-09-10 via `wavedash project list` (game_id `j97697bsqqnzpcxbmpdhfs3hen8cp5yv` — the same id in `wavedash.toml`). The old `nat-20-unicorn` slug is fully retired; no ambiguity remains. Display **title** everywhere = **HOOVES OF HOPE**.

---

## 1. TITLE
```
UNICORN, Hooves of Hope
```
> Only the display title changes; the URL slug is fixed by the platform.

---

## 2. DESCRIPTION (paste — Wavedash-style: one-line hook, then skimmable beats)

```
The world lost its color. You're the last unicorn who can bring it back.

The DARKCORN shattered the rainbow and drained the world to grey. Name your unicorn, grow strong, and hunt down all seven DARKCORN to reclaim the rainbow shards — a full pixel-art platformer-RPG in under 13 KB.

- Level up 5 stats — every level you allocate +2 points (the game locks you in until you spend them). Triple jump, long dash, double shot, and healing are all yours from the start.
- Loot gear that drops as pixel icons and recolors your unicorn — horn, mane, body, and hooves each carry a stat.
- Fight 6 enemy kinds across three attack styles — melee leapers, ranged snipers, and telegraphed chargers — then face 7 DARKCORN bosses that run the full apex kit and hunt you down once woken.
- Explore a compact three-band world — sky platform routes, a walkable highway, and an underground cave network across meadows, canopy, storm peaks, and deep caverns.
- Crit with LUCK, heal in a pinch, return to the GREATCORN for a full restore, and hunt down 20 hidden chests.

Plays with keyboard or touch, desktop or mobile — one build, both.

Controls — Keyboard: WASD/arrows move · Space jump · J dash · L shot · H heal · I/O potions · P menu · Esc back. Touch: floating joystick + action buttons.
```

---

## 3. TAGS (pick 5–8; Wavedash says favor accuracy over reach)
```
platformer · rpg · action · pixel-art · metroidvania · adventure · fantasy · singleplayer
```
> `metroidvania` is honest here (one connected map, ability-gated reach). Drop it if you'd rather stay conservative.

---

## 4. COVER ART
```
design/cover_square.png   ✅ FRESH B42 (2026-09-12) — 1080×1080 crop of the live B42 title (old B28 cover showed removed floater enemies; replaced + 512/256 variants regenerated)
```
> Cover is now the FRESH B42 title crop — verified against the live build 2026-09-12 (the B28 version's lower band showed removed floater enemies; that was the staleness). If the portal wants 16:9 instead of 1:1, use `design/screenshots/01_title.png` (1920×1080) directly.

---

## 5. SCREENSHOTS (upload 3–5, gameplay first) — ✅ FRESH set in design/screenshots/
`design/screenshots/` ✅ FRESH B42 set (01_title…07_boss, 1920×1080 native, captured live via `tools/capture-build.mjs` + `__G` staging — equipped unicorn, overlay visible). The recommended composition/order below matches the shipped set:

| # | File | Shows |
|---|---|---|
| 1 | `01_title.png` | Title — rainbow "HOOVES OF HOPE" logo, both unicorns under the arch |
| 2 | `04_menu.png` | Character menu — colored portrait + 4 FILLED gear slots, the stats column (STR/HP/MAG/DEF/LUCK) + colored inventory — the gear/RPG showcase (NO skill tree — it's removed) |
| 3 | `03_combat.png` | Combat — equipped colored unicorn at a trench, "+8 XP", pink foes, spike pits, chest + full control overlay |
| 4 | `05_world.png` | Platforming vista — equipped colored unicorn mid-jump over spikes, distant enemies, chests + full control overlay |
| 5 | `02_intro.png` | GREATCORN quest intro ("Reclaim every rainbow. One per DARKCORN. There are seven.") — equipped unicorn + full HUD + touch controls |

> `design/screenshots/` is clean — only the seven live-capture PNGs (`01_title` … `07_boss`) remain. Older superseded sets were removed on the 2026-09-12 media-refresh.

---

## 6. TRAILER (optional but recommended)
```
design/trailer.mp4   ✅ FRESH B42 (2026-09-12) — 38s 1080p live-gameplay cut (title → intro → moat/goomba + on-camera verb hint → sky hops → cave → boss kill + rainbow bank); B28-proven encode recipe (animation/crf15/yuv420p + silent AAC + faststart)
```
> Encoded with the verified best-practice recipe for flat-color pixel art: `-tune animation -crf 15 -pix_fmt yuv420p`, silent AAC track (needed for Twitter/X autoplay), `+faststart` for web streaming. Features the EQUIPPED colored unicorn (matches the screenshots). Structure: crisp title card (2.5s) → 1.8× gameplay body (movement, combat, menu flash showing equipped slots) → end card ("HOOVES OF HOPE / Unicorns and Rainbows / js13kGames 2026"). No play URL baked in (publish not yet live). Older stale cuts were removed on the 2026-09-12 media-refresh.

**GIF for the js13k description:** `design/gif/gameplay.gif` ✅ FRESH B42 — 640×360, 8s sky-hop loop, 3.0 MB (palettegen 192c + bayer, gifsicle -O3). Embed in the Markdown description (GIF-in-description remains a js13k discoverability best-practice).

---

## 7. ACHIEVEMENTS — thresholds need CLI re-tune (Wavedash-side)
Verify live state (count + thresholds):
```
wavedash achievement list --game-id j97697bsqqnzpcxbmpdhfs3hen8cp5yv
```
> Local `design/achievements/` has 8 PNGs (table below). Definitive State records a **9th server-side achievement — ASCENDED** (recreated 2026-09-12); confirm via CLI, and if present, add a matching `design/achievements/ASCENDED.png` before Sep 20 (or accept the platform's emoji fallback).

Correct thresholds for the CURRENT 7-boss / 7-shard / 20-chest / LV20-cap build:

| ID | Correct threshold | Action |
|---|---|---|
| PRISMATIC | all **7** shards (win) | update — was 5 |
| HALFWAY | 3–4 of 7 shards (or count-agnostic) | update — was "3 of 5" |
| EXPLORER | reach all **7** zones | update — was "5 zones" |
| HOARDER | open all **20** chests | ✓ valid |
| FIRST_LIGHT / NATURAL_20 / APOTHEOSIS (LV15) / FULLY_GEARED | unchanged | ✓ valid |

```
wavedash achievement update EXPLORER  --description "..." --game-id j97697bsqqnzpcxbmpdhfs3hen8cp5yv
wavedash achievement update HALFWAY   --description "..." --game-id j97697bsqqnzpcxbmpdhfs3hen8cp5yv
wavedash achievement update PRISMATIC --description "..." --game-id j97697bsqqnzpcxbmpdhfs3hen8cp5yv
```

---

## What the operator does (portal login required)
1. **Title** → `UNICORN, Hooves of Hope`
2. **Description** → paste Section 2
3. **Tags** → Section 3
4. **Cover art** → `design/cover_square.png` (✅ fresh B42, ready to upload)
5. **Screenshots** → upload the FRESH B42 set (Section 5), gameplay first
6. **Trailer** → `design/trailer.mp4` already fresh (Sep 12); upload as-is (optional but recommended)
7. **Achievements** → re-tune 3 thresholds via CLI (Section 7); verify 8 vs 9 live count (Definitive State records a 9th, ASCENDED)

**Deadlines:** js13k submit ≤ Sep 13 13:00 CEST · Wavedash publish ≤ Sep 20 CEST.
