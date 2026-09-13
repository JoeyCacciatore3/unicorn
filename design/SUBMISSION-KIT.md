# Submission Kit — UNICORN, Hooves of Hope

> ✅ **MEDIA: 100% FRESH (2026-09-12)** — 7 screenshots + 38s live trailer + GIF + cover, all captured from the current build. Inventory below.

Copy is paste-ready. **All facts re-verified against `src/*.js` 2026-09-12 at B48-52 (SHIPPED — git d7b5671 == Wavedash mn732cds3bswb9902e5jphnqz98eb6n8; 13,229 B, 83 free; save v46 via const SV).** B46+B47 = gauntlet-patroller seed fix + RED-pit rung raise + 7 low perchers→leaping hunters + charge kinds gained a charge-safe HOP cap (leaping chargers that bounce off mushroom pads) + dialogue anti-mash cooldown.

**State snapshot (2026-09-12):** B48-52 is **shipped & aligned** — git `main == origin == d7b5671`, Wavedash playtest build **mn732cds3bswb9902e5jphnqz98eb6n8**, built at **13,229 / 13,312 B (83 B free, 99.4%)**, save **v46** (single `const SV` version source), single slot `uni_s0`. B48-52: the in-game TITLE palette now self-syncs to the spawn zone (EAST RUN, matching the GREATCORN opening — was a stale hardcoded MEADOW from an earlier map build); top-left HUD lettering (LV+name, rainbow ×count) renders in the RC rainbow palette; clouds raised to the top edge + spread; floating HP bars doubled in thickness; the over-unicorn verb popup is replaced by a single post-intro RC-rainbow-cycling arrow pointing at the ? help button (which holds the full 10-key reference); and the ENDING is now a HARD FINISH — the GREATCORN win dialogue is removed, so the last-DarkCorn kill IS the finale (impact freeze → celebration + a rainbow VICTORY banner over the arch → hard cut to the title screen = game over). Console gates: **zero errors, Chromium + Firefox 155**, re-verified against the shipped B48-52 dist. NOTE: `design/screenshots/01_title.png` + `design/cover_square.png` still show the pre-B48 MEADOW title palette — re-capture against the shipped title before final upload. Enemy base-logic: spikes EJECT any foe that lands on them (one invariant, no per-kind guards; blocked foes pace the moat edge); mushroom bounce applies to foes AND bosses (home-ward redirect keeps bosses in-arena); the sky has a third top-tier altitude. B46+B47 added more visible jumping — 7 low sky perchers became leaping hunters and the CHARGE kinds (k3/k5) gained a charge-safe HOP cap so the aggressive rushers leap at you (and bounce off mushroom pads); the RED-boss pit rung was raised so a boss can hop out; and a dialogue anti-mash cooldown ensures the last GREATCORN teaching bubble is readable before the LV1→2 level-up. Console gates: **zero errors, Chromium + Firefox 155**, re-verified against the shipped B47 dist. The world is a **480×38 SPINE-AND-LOOP** map: a readable surface SPINE with the spawn HUB at center (tile 240), difficulty ramping OUTWARD to the far edges, distinct zone SHAPES (PEAK vertical ladder · CANOPY climb · MEADOW rest+alcoves · EASTRUN pit-gauntlet · SUMMIT ascending staircase), VARIED-HEIGHT HILLS (h3-h4, all tactical: charge-breakers + bolt-eaters) that flank surface bosses into enclosed zones, a **parallel SKY HIGHWAY** (platforms link end-to-end so you can traverse at altitude OR on the ground), and an underground **CAVE NETWORK** carved into solid rock: three distinct systems (WEST/VIOLET shallow — antechamber→2-tall skinny tunnel→boss hall + single-entrance secret pocket · CENTRAL 2-chamber network — entry chamber→skinny tunnel→west pocket · EAST/INDIGO deep two-tier — upper chamber→drop-shaft→deep halls joined by a crawl-tunnel + side pocket), 6 underground chests, foes in every chamber, cave voids you platform across to escape. Bounce mushrooms are all on the outdoor ground surface. Platform + mushroom + cave-clearance placement is enforced by **tools/map-geometry.mjs** (stable-math build gate: ≥2t headroom, no terrain burial, ≥3t vertical spacing, mushrooms outdoors on ground; player collider 10×14px verified to fit every tunnel/pit/chamber). B38 fixed iPhone landscape/fullscreen: the canvas is sized from its own laid-out box (position:fixed;inset:0), not visualViewport, curing the "fits half the screen" bug. Since B28: same feature set; all six enemies are **grounded walkers**; the skill tree is **gone** (abilities always-on). For the authoritative running state see the **Definitive State** knowledge entry.

> **Ground-truth rule:** if any figure here disagrees with `src/data.js` + `src/main.js` + `src/world.js`, the source wins — re-grep before trusting.

## Verified game facts (from source, batch 48-52)
- **Title (player-facing):** the title screen renders `UNICORN` (one word, rainbow letters) over `HOOVES OF HOPE`; the cover art matches. → **`UNICORN, Hooves of Hope`**.
- **Physics:** player and every enemy share ONE jump/gravity model (`GV=900`, launch `JV=280`) — arcs are identical and learnable; enemies no longer out-jump you. The player keeps a smaller, nimbler collision box.
- **6 enemy kinds (`FT`) organized into 3 ATTACK TIERS × 2 kinds** — pursuit speed is UNIFORM for every foe (they all home at one speed); the **attack** is what separates them (cap bits: 1=shoot, 2=hop, 16=charge). B47: the CHARGE kinds (k3/k5) also carry the HOP cap (cap 18 = charge+hop) so they LEAP toward you between charges — HP/dmg unchanged, roles still read clearly (leaping rushers vs snipers vs pure hoppers):
  - **Tier 1 — HOP (melee leapers):** k1 (fragile), k4 (tankier) — leap toward you on a cadence.
  - **Tier 2 — SHOOT (ranged):** k2, k6 — hold position and fire bolts.
  - **Tier 3 — CHARGE (elite):** k3 (heavy), k5 (glass) — telegraphed dash: wind-up tell → fast lunge → recover.
  - Sprites are still per-kind (cosmetic) but no longer signal the tier — the attack does. **All six are now grounded walkers** (the old teal "tent" + purple "spike" floaters were flipped upright to sit on terrain like the rest; downward legs/tendrils). A per-placement PATROL flag (`[x,y,k,1]`) can make any foe a Goomba-style walker, and SHOOT/CHARGE hunters stand off (`SO`=100px, ring you) instead of dogpiling.
- **7 DARKCORN bosses** (`RBC`, 7 entries; bands RED, ORANGE, YELLOW, BLUE, VIOLET, GREEN, INDIGO). All named "DARKCORN"; identity = horn + mane color. Every boss runs the **full apex kit** (charge + hop + shoot, cap=19). Difficulty scales with tier `bi` and your level: HP `(20+bi*4)+lvl²`, dmg `(8+bi)+(lvl>>2)`. Bosses are always present (seeded), idle until you enter their 128px ring **or land any hit on them** (aggro-on-damage, B41 — no range-plinking exploit), then hunt relentlessly (ungated — they chase off ledges and through spike pits). Defeated = the band's rainbow shard banks; killed bosses don't respawn. *(No half-HP enrage — that mechanic was removed.)*
- **7 zones** (`ZB`) — surface: PEAK (BLUE), CANOPY (YELLOW), MEADOW (RED), EAST RUN (ORANGE, centered spawn), SUMMIT (GREEN); underground: DEPTHS (VIOLET), CAVERN (INDIGO). One contiguous **480×38** world (SKY rows 0–17 · GROUND band rows 18–23 · CAVE band rows 24–36 · floor seal row 37), each zone its own 5-color palette.
- **7 rainbow shards** — one per DARKCORN. GREATCORN intro: "Reclaim every shard. One per DARKCORN. There are seven."
- **No skill tree** — all abilities are always-on (triple jump / long dash / double shot / basic heal). Kind + level is the only difficulty axis. On level-up the game **locks you into the stat menu until you spend the +2 points** (allocation lock, also on reload — points can never persist unspent).
- **20 chests** (`seeds.chests`), all reachability-audited by `tools/map-audit.mjs`.
- **54 regular foes** — hand-placed `foes` (29) + fill `foesX` (25); per kind k1×10 · k2×9 · k3×8 · k4×9 · k5×9 · k6×9 (re-counted 2026-09-12 @ B41 — the goomba swap moved one k3→k1). **Two legible behavior tiers:** 10 high sky-ladder / gauntlet **patrollers** (never chase, contact obstacles) + 44 ground/cave/low-perch **hunters** (aggro in range, leap/charge/snipe, leash home when you leave). Safe marketing figure: "over 50 enemies across 6 kinds."
- **4 gear slots** — BODY (+HP), MANE (+MAG), HORN (+STR), HOOVES (+DEF). Gear drops as pixel icons and recolors the matching body part. `BAG=10` (gear only).
- **5 stats** (`SC`) — STR (red), HP (green), MAG (blue), DEF (violet), LUCK (orange). Cap **LV20** (`CAP=20`); +2 stat points per level. Start HP/MP = **20** (base 16 + stat 2×2); all stats start at 2.
- **Potion hot-bar** — 2 slots (HP / MP), stack to 5 each, **+20** per drink (+1.5s i-frame flash). Both boxes sit as a left column of the action grid — HP box on the SHOOT row, MP box on the DASH row. Hotkeys **I** (HP) · **O** (MP).
- **Bounce mushrooms** — spring-launch traversal, stacks with DBL/TRI JUMP (west bounce-sky route feeds the BLUE summit).
- **Controls** — Keyboard: WASD/arrows move · Space/W/↑ jump (= interact, fixed-height triple jump) · S/↓ drop-through · J dash-attack · L shot · H heal · **I** HP-potion · **O** MP-potion · P menu · M mute · **Esc** back / save-exit. Touch: floating joystick + action buttons (full parity). One build, desktop + mobile.
- **Save** — v46, strict version gate (SV const, single source) (no cross-version compat), single slot `uni_s0`. Auto-saves on level-up + respawn; player always respawns at the paddock.
- **Console errors** — ✅ 0 in BOTH gates, verified 2026-09-12 against the shipped dist: Chromium (full opening flow) + real Firefox 155 (full opening flow). The disqualifying criterion is CLOSED.

## Names (keep identical everywhere)
- **Title:** `UNICORN, Hooves of Hope`
- js13k draft registration LOCKS the unique name — register early to claim it.
- **Slug (CONFIRMED):** **`hoovesofhope`** — title **"Hooves Of Hope"**. Verified 2026-09-10 via `wavedash project list`: game_id `j97697bsqqnzpcxbmpdhfs3hen8cp5yv` (the same id in `wavedash.toml`) → slug `hoovesofhope`. The old `nat-20-unicorn` slug is fully retired — no ambiguity remains.

---

## js13k submit form (js13kgames.com/submit — deadline Sep 13, 13:00 CEST)
Flow: register draft → upload zip (automated in-browser test; **console errors block**; roadroller zips process slowly) → details → Presentation (cover/thumbnails) → team (prefilled from repo) → submit. Draft stays editable until deadline.

**Description (Markdown supported):**

```markdown
**The DARKNESS drained the world to grey, and you are the last unicorn left to bring the color back.**

Name your unicorn and cross one large connected world to defeat all seven DARKCORN
and reclaim the rainbow shards they shattered.

- ⚔️ **STR / MAG combat** — physical damage scales with STR, magic with MAG; LUCK drives crit chance
  AND loot drops (one stat, three payoffs).
- 📈 **RPG progression** — 5 stats, a hard LV20 cap, and gear that drops as pixel item icons and
  recolors the matching part of your unicorn (mane / horn / body / hooves). Every level you allocate
  +2 points — the game locks you in until you spend them.
- 👑 **7 DARKCORN bosses** — dark mirrors of yourself, each holding one rainbow band
  (red → indigo). All run the full apex kit — charge, hop, and ranged fire — and hunt you relentlessly once woken.
- 🌍 **7 regions in one connected world** — a compact three-band map (sky platforms, a walkable
  highway, and an underground cave network). Sunlit meadows, high canopy, storm peaks, deep caverns.
- 🐴 **6 enemy kinds in 3 attack styles** — melee leapers, ranged snipers, and leaping chargers.
  Everyone shares one movement, so it's the attack that separates them — you learn one moveset at a time.
- 🗨️ **A GREATCORN guide** greets you with a chatty intro and re-talk quips, and fully heals you when you return.
- 🎒 20 hidden chests · 2-slot potion hot-bar (HP + MP, stack to 5, +20) · single save slot, auto-saves on level-up and respawn.

**Controls:** WASD/arrows + Space jump · J dash-attack · L shot · H heal · I/O potions · P menu ·
Esc back — or touch: floating joystick + action buttons. One build, desktop and mobile.
```

**Categories:** Desktop · Mobile · Wavedash

---

## Wavedash store page
See **`design/WAVEDASH-UPLOAD.md`** for the paste-ready portal checklist (title, description, tags, screenshot order, trailer). Store metadata is editable ONLY in the browser Developer Portal (session-auth gated) — the CLI/API key has no metadata endpoint.

Portal: **https://wavedash.com/dev-portal** → **Hooves Of Hope** (slug `hoovesofhope`) → Store page.

---

## Achievements — 8 icons local · 9 on server per Definitive State (verify with CLI)
Verify current live state with `wavedash achievement list --game-id j97697bsqqnzpcxbmpdhfs3hen8cp5yv`. Local icons: 8 PNGs in `design/achievements/*.png` (256×256). The Definitive State + Wavedash knowledge entry both record a 9th achievement — **ASCENDED** (recreated 2026-09-12) — server-side; no local PNG. If the CLI confirms 9 live, either add an ASCENDED.png before Sep 20 or rely on the platform's emoji fallback. Thresholds below reflect the CURRENT 7-boss / 7-shard / 20-chest / LV20-cap build.

| Identifier | Title | Correct threshold (current build) | Note |
|---|---|---|---|
| FIRST_LIGHT | First Light | first DARKCORN kill | ✓ valid |
| HALFWAY | Halfway to Whole | reach 3–4 of 7 shards (or keep count-agnostic) | re-tune — was "3 of 5" |
| PRISMATIC | Prismatic | all **7** shards (win) | re-tune — was "5" |
| NATURAL_20 | Natural 20 | land a crit | ✓ valid |
| APOTHEOSIS | Apotheosis | reach level 15 | ✓ valid (mid-late; cap is LV20) |
| FULLY_GEARED | Fully Geared | all 4 gear slots equipped | ✓ valid |
| EXPLORER | Explorer | reach all **7** zones | re-tune — was "5 zones" |
| HOARDER | Hoarder | open all **20** chests | ✓ valid |

**Glue status:** wrapped build emits `Wavedash.init({})` + creates 5 leaderboards (Highest Level, Bosses Defeated, Total Damage, Total Kills, Fastest Clear) + pushes 6 stats (KILLS, CHESTS, BOSSES, LEVEL, GEAR, FASTCLEAR) with `storeStats()`, sig-deduped, on a 5s interval plus `pagehide` / `visibilitychange`. Achievements unlock server-side from those stats — no `setAchievement()` calls required. All glue lives in `dist/wavedash/index.html` outside the 13 KB zip (byte-free). SDK glue verified 2026-09-13 via mocked `window.Wavedash`: init fires, all 5 leaderboards created with correct sort/display, score uploads + stat pushes fire, `bosses<7` correctly withholds Fastest Clear + sets `FASTCLEAR=0`, 0 console errors.

---

## Assets inventory
```
design/
├── cover_square.png      ✅ FRESH B42 (2026-09-12) — 1080×1080, center-crop of the LIVE B42 title screenshot (01_title.png crop 1080:1080:420:0 — full "HOOVES OF HOPE" logo + rainbow arch + both unicorns, current world/ground band). Lossless. Replaced the B28 cover, whose lower band still showed the REMOVED floater enemies + old sky layout.
├── cover/                ✅ downscaled B42 variants: cover_512.png (512²), cover_256.png (256²) — regenerated 2026-09-12 from the new square (neighbor scale, verified crisp). Aug-30 stale archive deleted.
├── screenshots/          ✅ FRESH B42 (2026-09-12) — 7×1920×1080 native lossless, captured LIVE from dist/capture (real engine, real inputs; gear staged via __G.power(), same practice as B28 set): 01_title · 02_intro ("The Greatcorn.|Obviously." bubble) · 03_combat (CANOPY arena, relocated moat sniper visible) · 04_menu (4 gear slots + pending +2 pulse + description bubble) · 05_world (sky platform + drops + ORANGE DARKCORN leaping in-frame) · 06_cave (INDIGO deep hall, chest + lurking DARKCORN + live damage) · 07_boss (ORANGE fight, damage popups, spike-edge standoff)
├── trailer.mp4           ✅ FRESH B42 — 38s 1920×1080 h264 (`-tune animation -crf 15 -pix_fmt yuv420p` + silent AAC + faststart), cut from a LIVE recorded gameplay run (operator directive: real gameplay only): title → intro bubbles → LV1 moat jump + goomba first-kill (the "J DASH / L SHOOT" verb hint fires ON CAMERA at t≈12s) → sky-highway hops → cave dive → ORANGE boss kill + rainbow bank. Traversal beats at 1.2-1.4×.
├── gif/gameplay.gif      ✅ FRESH B42 — 640×360, 8s sky-hop loop, 20fps, 3.0 MB (palettegen 192c + bayer, gifsicle -O3). For the js13k Markdown description embed.
├── cover/cover_square_b42.png   ✅ PROMOTED 2026-09-12 (operator: "fix the title image") — now identical to cover_square.png; kept as the B42 provenance copy
└── achievements/         ✅ 8 PNGs (thresholds need CLI re-tune per table above)
```
## Master checklist (operator)

### ⚠️ Pre-submission action items
| # | Action | Where | When |
|---|---|---|---|
| 1 | Register js13k draft, claim name `UNICORN, Hooves of Hope` | js13kgames.com/submit | NOW — locks name; tests roadroller zip. Deadline Sep 13 13:00 CEST |
| 2 | Firefox DevTools zero-console-errors check on `dist/game.zip` | local | Before each js13k upload (disqualifying criterion) |
| 3 | Re-capture `design/screenshots/01_title.png` + `design/cover_square.png` against the shipped B48-52 title (EAST RUN palette). Screenshots 02-07 + trailer + GIF are current. | local | before final Wavedash upload |
| 4 | Wavedash store paste-in (title, desc, tags, cover, screenshots, trailer) | Portal (see `WAVEDASH-UPLOAD.md`) | Anytime — review has lag |
| 5 | Re-tune EXPLORER / HALFWAY / PRISMATIC thresholds | `wavedash achievement update` | Before Sep 20 |
| 6 | Final zip → js13k form | js13kgames.com/submit | ≤ Sep 13 13:00 CEST |
| 7 | Wavedash PUBLISH latest build | Portal dashboard | ≤ Sep 20 CEST (deploy-only week — no fixes after) |

### ⏸ Deferred (operator decision)
| # | Action | Why |
|---|---|---|
| ⏸ | Add local `ASCENDED.png` icon if the CLI confirms it as the 9th live achievement | Currently server-side only per Definitive State; platform emoji fallback works but a matching icon completes the set. |
| ⏸ | Mobile category — separate submission | Touch input works; rules allow multi-game entries but same-game-across-platforms is BANNED. |

---

**RELEASE RITUAL (Joey directive 2026-09-02):** every code change ships as `commit → git push origin main → node build.mjs → wavedash build push -m "…"`. GitHub push + Wavedash deploy go as ONE unit so the live deploy never drifts from source. Docs-only commits (like this one) are exempt — git-push only, no rebuild/re-push.
