# HOOVES OF HOPE

Entry for [js13kGames 2026](https://js13kgames.com/) — theme: **Unicorns and Rainbows**.

A 2D pixel-art platformer-RPG in **13 KB**. The DARKNESS stole the world's color; you are the
last unicorn. Name your unicorn, explore one contiguous world, defeat the seven **DARK CORNS**,
and reclaim the **RAINBOW SHARDS** that restore the world. STR/MAG combat with LUCK-driven crits,
gear that recolors your unicorn, and permanent stat allocation.

A **GREAT CORN** — a violet, gold-maned elder, boss-sized (matches the DARK CORN silhouette) —
stands watch at the starting paddock. On a new game he opens an auto-playing 5-bubble intro
(head-stemmed speech bubbles, advanced one per tap) that sets the goal, nudges the controls, and
points you outward. Walk back and JUMP near him afterward for cycled re-talk quips. Finishing the
intro grants a free first level-up.

**Categories:** Desktop · Mobile · Wavedash

## World — one compact, fully-utilized map

**One unified 480×38-tile map (7,680×608 px)**, no portals or zone loads — walk from any boss to
any other. It is authored as **three clearly-stacked bands** built around the exact jump envelope
(so every gap/climb is reachable by construction):

| Band | Rows | Role |
|---|---|---|
| **SKY** | 1–17 | above-ground platform routes (drop-through), climbs, the boss summits |
| **GROUND** | 18–23 | a **uniform 6-tile walkable band** (`GROUND_H=6`, surface-top row `SR=18`), full-width highway |
| **CAVES** | 24–36 | a built-from-air underground network — three systems, two-tier halls (floor seal row 37), return rungs, entered via drop-shafts (two exits per wide chamber) |

The old sprawling 600×160 world (mostly empty air/slab) was fully re-authored into this tighter
form — same feature set, ~85% smaller grid, and it **saved bytes** (denser, clustered coordinates
compress better under Roadroller). Caves span three distinct systems (rows 24–36, floor seal row 37) with
return rungs in every shaft — always leavable.

**7 zones for 7 DARK CORNS** (x-bands scale into the 480-wide world; each has a distinct palette):
PEAK/BLUE · CANOPY/YELLOW · MEADOW/RED · EAST RUN/ORANGE (spawn is centered here at tile 240) ·
SUMMIT/GREEN, plus two underground zones selected by depth — UNDER-DEPTHS/VIOLET and
UNDER-CAVERN/INDIGO. The paddock around the centered spawn is a low-threat safe zone.

Every boss, chest, and cell is verified reachable by a build-time traversal audit (Return Law: you
can always path home) at the player's real ability tier (double- and triple-jump).

## Progression
- **Every level:** +2 stat points (STR / HP / MAG / DEF / LUCK). **Level 20 cap** — all gains come
  from level-up points.
- **Allocation lock:** a level-up auto-pauses into the character menu with the cursor on STR, and
  **you cannot leave the menu (or move the cursor off the stat column) until every pending point is
  spent** — the game enforces allocation. This holds on fresh level-ups *and* on reload, so unspent
  points can never persist "for later."
- **No skill tree** — all abilities are always-on (triple jump / long dash / double shot / basic
  heal). Kind + level is the only difficulty axis.
- **Equipment:** enemies drop colored body-part gear that recolors the matching part of your unicorn
  AND gives a stat bonus (its slot's stat, scaling with level; higher-level gear can carry a second
  sub-stat).
- **XP curve:** quadratic (`L*L + 40`) — steady early pace, later levels earned.
- Each level fully restores HP + MP; a LEVEL UP rainbow banner shows for 1.8s.
- **Two auto-save moments:** level-up + respawn after death. Manual save via the ✕ back button /
  `Esc` → SAVE + EXIT popup.

## Equipment
4 gear slots matching body parts: **BODY**(+HP), **MANE**(+MAG), **HORN**(+STR), **HOOVES**(+DEF).
- Everyone starts the same neutral white unicorn — **ONE save slot**. Empty save → the title shows
  **NEW GAME** (asks only your name, required); occupied save → `NAME · LVx`, tapping opens a
  **CONTINUE / DELETE** popup.
- Gear comes from the shared loot roll — LUCK raises drop chance; bosses drop guaranteed.
- **10-slot inventory** (gear only). Tap a bag slot to select, tap again (or EQUIP / JUMP / Enter)
  to equip; **DROP** discards permanently — behind a **CONFIRM / BACK** gate so a mis-tap can't
  destroy gear. Tap an equipped slot to UNEQUIP back to the bag.
- Gear renders as tinted pixel-art icons (BODY→breastplate, MANE→cape, HORN→sword, HOOVES→horseshoe)
  colored by the drop's roll — the same color it paints onto that body part when equipped.
- **Potion hot-bar:** two slots (HP · MP) hold up to 5 each — tap/click or press `I`/`O` to drink.
  Persistent, visible even in the character menu. Potions live ONLY here (no inventory spillover).

## Combat
Damage splits by attack type: **physical (DASH/STOMP) = STR**, **magic (SHOOT) = MAG** — both
`× (crit ? 2 : 1)`, gear folded in. (MAG also sets max MP.)
- **Crit chance: 12% + LUCK × 3%** — the same number drives the loot-drop roll (one LUCK stat, three
  payoffs: drop chance, crit chance, gear tier).
- Defense: `max(incoming/4, incoming − DEF)` — bosses always deal ≥25%.
- **Quadratic scaling** (matches the XP curve) — high-level fights become endurance battles:
  regular HP `fh + (lvl*lvl >> 1)`, regular dmg `fd + (lvl>>2)`; boss HP `(20 + bi*4) + lvl*lvl`,
  boss dmg `(8 + bi) + (lvl>>2)`.
- **Color-coded invuln (IFR = 1.5s knob):** 🔴 red flash after damage · 🟢 green after HEAL · dash =
  silent invuln (the motion is the tell) · respawn = spawn-safety padding.
- **Enemy hit reaction** (one `f.fl` timer): red ~6 Hz strobe + AI pause + i-frame.
- **Death beat:** on death the world freezes for `VBEAT` (1.5s, the *same* pause as a boss-kill
  victory beat) while skull particles burst from the fallen unicorn, then it transitions home to the
  paddock and the DEATH dialogue.
- 7 **DARK CORN** bosses share the name; each is identified by its horn+mane color = the rainbow band
  it holds. All use the full 3-move kit (cap = 19 = SHOOT + HOP + CHARGE) and are relentless (no
  stand-off). Defeated DARK CORNs turn friendly and linger at their arena as GREAT-CORN-purple NPCs.

## Enemies — six kinds, all grounded walkers
All six regular kinds share **one movement family** (grounded walker physics, same gravity as the
player) and differ only by **sprite + one attack verb + HP/damage**. Attack bits: **1 = SHOOT ·
2 = HOP · 16 = CHARGE** (`FT[k] = [hp, dmg, capBits]`, uniform size `cz=4`):

| k | Sprite | Tier / attack | Color |
|---|---|---|---|
| 1 | walker-small (separate head, 4 legs) | HOP (4 HP, fragile) | pink |
| 4 | walker-fast (racing lean, speed lines) | HOP (6 HP, tankier) | orange |
| 2 | walker-tent (dome + 3 wiggling tendril-legs) | SHOOT (10 HP) | teal |
| 6 | walker-spike (dome + 4 downward spiky legs) | SHOOT (11 HP) | light-purple |
| 3 | caster (hooded robe) | CHARGE+HOP (14 HP, heavy) | violet |
| 5 | walker-hop (tall body, chunky legs) | CHARGE+HOP (8 HP, glass) | gold |

- **Two behavior modes** (per-placement, not per-kind): **HUNTER** (default — engages when near) and
  **PATROL** (optional 4th seed element `[x,y,k,1]` → a Goomba-style walker that ignores you,
  contact-damage only). 10 high sky-ladder / gauntlet foes are PATROLLERS (never chase — pure terrain obstacles); the 44 ground/cave/low-perch foes are leashed HUNTERS that return home when disengaged.
- **Stand-off de-pile:** SHOOT/CHARGE hunters stop ~`SO`=100 px out and ring you instead of all
  homing to the same point (only HOP kinds close to contact) — clusters read as a formation, not a
  dogpile.
- **Elevation rule:** aerial platform routes are kept low-tier (the jumping is already the challenge);
  tough CHARGE/SHOOT kinds live on flat ground where traversal is free.
- SHOOT kinds show a stationary skull at their center for ~0.5s before firing — the same skull then
  launches as the projectile. CHARGE kinds telegraph with a dir-lock wind-up + committed dash (no
  skull) and now also LEAP toward you between charges (they carry the HOP cap too — a charge-safe
  hop that only fires at pursuit speed, never mid-dash). Contact damage is universal. Spikes never
  trap a foe: any enemy that lands on spikes ejects a hop toward the nearest standable side.

Roster is **54 regular foes** (k1×10 · k2×9 · k3×8 · k4×9 · k5×9 · k6×9 — the first-east charger swapped to a gentle hopper per the Goomba law), elevation-rule placed.

## Item drops
A kill drops loot at `12% + LUCK×3%` (bosses guaranteed; **chests** give 2 guaranteed items). Each
drop is **60% gear / 40% potion** (potion = 50/50 HP/MP):
- **HP / MP POTION** — fills the hot-bar counter (stack to 5); drink restores HP/MP.
- **GEAR PART** — primary bonus `1 + (lvl>>2) + (LUCK>>3)`; at LV4+ a ~50% chance of a second sub-stat.
  No fixed tiers — deeper gear is simply stronger.

Drops land on any non-air tile and stay until you die (no despawn). Pickup radius 18 px, 0.5s grace so
you always see loot appear. **RAINBOW SHARDS** are progression tokens (not items) — each DARK CORN
surrenders one on defeat (auto-collected, restores full HP + MP). Collect all 7 → THE DARKNESS LIFTS.

## Controls
One scheme, keyboard + touch fully at parity:

| Action | Keyboard | Touch |
|---|---|---|
| Move | A/D or ←→ | Floating joystick (left 40%) |
| Drop through platform | S / ↓ | joystick down |
| Jump (fixed height, triple) | Space / W / ↑ | JUMP button |
| Dash (attack) | J | DASH button |
| Shoot | L | SHOOT button |
| Heal (costs MP) | H | HEAL button |
| HP potion | **I** | HP box (left of SHOOT) |
| MP potion | **O** | MP box (left of DASH) |
| Interact (talk / chest) | Space/JUMP near | tap near |
| Menu / allocate / sheet | P | auto-opens on level-up · tap your name |
| Back / Save + exit | **Esc** | ✕ back button |
| Mute toggle | M | 🔊 speaker icon |
| Controls help | — | ? icon |

`Esc` is the universal "back out one level": in play it opens the SAVE/EXIT popup; in the menu it
closes it (blocked while points are pending); in any confirm popup it cancels. All binary popups
(SAVE/EXIT, DROP-confirm, save-slot) are keyboard-navigable (←→ toggle, Enter confirm, Esc back).
Every touch control shares one visual language: dark fill + `#8cf` blue outline.

## Build
Requires **Node ≥ 20**.
```
npm install
npm run build    # esbuild → terser → roadroller → inline → zip → ECT
```
Six build gates: **map-audit** (traversal — no stuck cells, all bosses/chests reachable at
double/triple-jump tier, Return Law), **spike-audit** (chest + procedural-scatter spike safety),
**pal-check** (PAL length ⇔ gear-color range), minified-check + packed-check (artifact integrity),
and the **13,312-byte** budget (also: no external URLs, no unprefixed localStorage).

**Current: 12,954 / 13,312 B (97.3%) — 358 B free.** See `SIZELOG.md` for the live-updated tail and
the "Definitive state" knowledge entry for the authoritative snapshot.

## Save format
One slot: `localStorage.uni_s0`. Version **v46** (strict gate — older saves auto-discard; `SV` const in main.js is the single source).

Fields: `{ v, h(hp), x(xp), l(lvl), n(mn), g(bosses[7] → 2|0), t(stats[STR,HP,MAG,DEF,LUCK]),
d(pending), m(name), o(chestBits), q(eq[4]), i(inv[]), P([hpPot,mpPot]), K(kills), D(deaths),
R(runtime) }`. Not saved: `col` (derived from `eq` at load), `mute` (runtime-only), dialogue state,
foes/chests (reseeded).

## Structure
- `src/main.js` — the game (~1,380 lines)
- `src/world.js` — the 3-band tile map + entity seeds + procedural scatter (~190 lines)
- `src/data.js` — static tables (palette/zones, foe tiers, gear, GREAT CORN dialogue)
- `build.mjs` — full pipeline + compliance gates (also emits the Wavedash variant)
- `tools/map-audit.mjs` — traversal prover (bosses/chests reachable, Return Law)
- `tools/spike-audit.mjs` — placement safety (chest + scatter spike overlap)
- `tools/pal-check.mjs` — PAL length ⇔ gear color-range guard
- `tools/map-editor.html` — local map-authoring tool (untracked, not shipped)
- `dist/wavedash/` — Wavedash platform variant (leaderboards + stats via a byte-free wrapper)
