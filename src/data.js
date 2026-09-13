// data.js — UNICORN static lookup tables: palette, gear/enemy/boss data, sprite bitmaps.
// game state). esbuild inlines these back into the single bundle, so this split is
// byte-neutral — it exists purely to keep main.js focused on behaviour.
// that reads or writes live game state (STATS closures, canvas draws) stays in main.js.


// UNIFIED PALETTE — 17 colors, shared across all 4 body parts.
// auto-derived via dim(): base → 85% → 70% brightness (no stored triples).
// GUARD (byte-law #14): PAL[8] must NOT equal ANY ZB row's sky (col 5).
// background — a gear roll of c=8 would produce invisible-against-sky gear.
// the mana-blue literal '#4a76ff' here means: (a) distinct-from-sky gear color, and
// (b) roadroller LZ-backrefs the same string used elsewhere (mana bar, XP text).
export const PAL = [
  '#f5f1f4','#f7d9c0','#ffd75e','#ff9d3c','#ff5d6c','#ff99cc',
  '#e08ae0','#c47fe0','#4a76ff','#40e8b0','#5ac878',
  '#ffffff','#2a1f14','#4a3828','#4ad46a','#6a5acd'
];
// Derive a darker shade of any hex color (each channel * f).
// AND rock shading (base = dim(accent)) so we store one accent, not two tones.
export const dim = (h, f) => '#' + h.slice(1).match(/../g).map(c => (Math.max(0, parseInt(c, 16) * f | 0)).toString(16).padStart(2, '0')).join('');
export const mane3 = i => [PAL[i], dim(PAL[i], .85), dim(PAL[i], .7)];
// EQUIPMENT slot maps — slot 0=BODY(+HP) 1=MANE(+MAG) 2=HORN(+STR) 3=HOOVES(+DEF).
export const SLOT_STAT = [1, 2, 0, 3];                // slot→stat index: HP, MAG, STR, DEF
export const SLOT_LBL = ['BODY', 'MANE', 'HORN', 'HOOVES'];
// Stat colors — used by menu bars/labels AND by equipment strokes (menu box + inv slot + world drop)
// so gear identity is visible at pickup: STR red · HP green · MAG blue · DEF violet · LUCK orange.
export const SC = ['#ff5d6c', '#6cf279', '#4a76ff', '#c47fe0', '#ff9d3c'];   // STR red (attack=damage) · HP green (=HP bar/heal/potion) · MAG blue (=MP bar) · DEF violet (PAL[7]) · LUCK orange (PAL[3]) — one colour per meaning, zero stat/HUD clashes

// FOECOL — k1..k6 body colors.
// background (PICO-8 fg/bg separation): foes use saturated warms + darker cools.
// FOECOL as PAL indices (regrouped for max contrast vs every zone + byte savings vs hex strings). k1=pink · k2=teal · k3=violet · k4=orange · k5=gold · k6=light-purple.
export const FOECOL = [, 5, 9, 7, 3, 2, 6];
// FT[k] = [hp, dm, capBits].  Pursuit speed is UNIFORM now (ASPD in main.js) — the ATTACK bit is the only differentiator.
// 3 TIERS × 2 variants. Attack bits: 1=SHOOT · 2=HOP · 16=CHARGE (bosses = 19 = all three = the apex kit).
//   TIER 1 HOP    → k1 (4hp fragile) · k4 (5hp tankier)   — melee leapers
//   TIER 2 SHOOT  → k2 (8hp) · k6 (9hp)                   — ranged bolts, hold + fire
//   TIER 3 CHARGE → k3 (12hp heavy) · k5 (6hp glass)      — telegraphed dash (windup-tell → dash → cooldown)
// (size UNIFORM — cz 4 for all foes + bosses.) Render sprite is still per-k (k1 walker-small · k2 walker-tent
// · k3 caster · k4 walker-fast · k5 walker-hop · k6 walker-spike) — ALL grounded walkers, COSMETIC only, decoupled from tier.
export const FT = [, [4, 3, 2], [10, 4, 1], [14, 6, 18], [6, 3, 2], [8, 5, 18], [11, 4, 1]];   // FT[k]=[hp,dm,capBits] — tier map above. B44 tune: hunter kinds +2hp (chargers +1dm) — early/mid game was too forgiving (LV2 trash died in 2-3 hits); k1 stays 4/3 (Goomba law: first foe + sky patrollers remain the forgiving teach targets). lvl² term still dominates late. B47: k3/k5 cap 16→18 (charge+HOP) — the aggressive rushers now LEAP toward you between charges (more visible jumping + they bounce off mushroom pads); hop-block is charge-safe (only fires at pursuit speed, never mid-dash) so no CSPD overshoot. Shoot kinds (k2/k6) stay grounded snipers; k1/k4 pure hoppers.
// DARKCORN bosses — all named just 'DARKCORN'; differentiated by horn + mane color = their RBC rainbow band.
// Count = RBC.length (data-driven; add an RBC entry + a seeds.bosses placement to add one).
// RBC values are PAL indices (bosses render via drawU + col swap — one canonical unicorn shape everywhere).
export const RBC = [4, 3, 2, 8, 7, 14, 15];
// 7-band rainbow (arc + title + effects).
export const RC = ['#ff5d6c','#ff9d3c','#ffd75e','#9fe89a','#8cf','#c47fe0','#c9a6f7'];
// Sky backdrop colour.
// ZONE BANDS — [xEndTile, dirt, top, foliage, accent, sky].
// pl.y depth overrides to an underground row (UNDERGROUND — caves, ONE dark theme, split VIOLET/INDIGO by depth).
// lookup rethemes terrain, top strips, trees, rocks, tufts AND sky (all read the destructure).
// 7 ZONES for 7 DARKCORNs: 5 surface boss territories by x + 2 underground bands split by depth
// (VIOLET cave-top y>384=row24 · INDIGO deep tier y>480=row30; cave band rows 24-36, floor seal r37 — thresholds match main.js draw ZC select).
export const ZB = [
  [32,  '#4a3a26', '#c0c8d0', '#5a7a6a', '#c0c8d0', '#4a9ad8'],   // PEAK (BLUE) — x-band scaled 600→480 (compact rebuild). snow-cap white top+accent, slate-green alpine foliage.
  [90,  '#5a3a2a', '#3a8a52', '#3a8a52', '#7a5a3a', '#5ab5ef'],   // CANOPY (YELLOW) — warm loam dirt, wood-brown accent.
  [224, '#5a3a1e', '#4a9a3a', '#4a9a3a', '#888888', '#6bc5ff'],   // MEADOW (RED) — original identity (spawn zone)
  [381, '#6a4a22', '#8a9a32', '#8a9a32', '#9a8a62', '#7ecfe8'],   // EAST RUN (ORANGE) — dry gold savanna
  [480, '#52341e', '#3a7a5e', '#3a7a5e', '#7a8a92', '#4a9ad8'],   // SUMMIT (GREEN) — deep teal, storm sky
  [0, '#32283e', '#6a4a8a', '#8a5aca', '#5a5a6a', '#1a1626'],   // UNDER-DEPTHS (VIOLET zone, upper caves rows 24-29 / y>384) — col0 (xEnd) NEVER read: underground selected by y-threshold, not the x-find. dead value.
  [0, '#1a1832', '#3a4a7a', '#6a5acd', '#4a4a72', '#080814'],   // UNDER-CAVERN (INDIGO zone, deep tier rows 30-36 / y>480) — col0 dead (see above). foliage reuses PAL[16] literal for LZ.
];
// Ground palette [dirt, surface-top, foliage, accent]: dirt/top theme solid+platform tiles
// foliage themes green deco (tree canopy, grass, flower stems); accent is the stone tone
// (rock base derived darker via dim(accent), so one stored color = two-tone boulder).


// Pixel sprites (bitmask rows, MSB-left) — decoded by spr() in main.js.
export const I_MP = [96,96,96,240,504,1020,2046,4095,4095,4095,4095,2046,1020,504];   // POTION 12×14 — 3 skinny 2-wide neck rows (r0-2; cork covers r0 only, r1-2 visible → clear skinny-neck feature), 4-wide shoulder taper starts r3, widening r4-6, 4 rows full 12-wide body, curving base.

// GREATCORN dialogue. '~' prefix = player unicorn speaks (bubble over its head), else GREATCORN. '|' = row break within one bubble.
// COUPLING: DEATH reuses INTRO[4] ("They hit hard.|Hurt? A potion,…") — keep INTRO defined above with index 4 = the hurt/heal line (recheck if reordered). No bubble-index spotlight/device-swap anymore (both removed).
export const INTRO = ["Oh! You're awake!", "~...who are you?", "The Greatcorn.|Obviously.", "The Darkcorn stole|my seven rainbows.|Win them back.", "They hit hard.|Hurt? A potion,|or talk to me."];
// Re-talk quips — cycled one per approach (JUMP near the GREATCORN after the intro).
// TALK — re-talk pool (jump near GREATCORN).
export const TALK = ["Rainbows won't fetch|themselves, pony.", "You've got this.|Probably.", "Stop bouncing at me.|I'm not a mushroom.", "This mane grooms|itself. Out of|respect."];
// DEATH — reuses the dialogue system for a respawn beat: fires at the paddock once the death beat + home transition completes (deathT crosses 0).
export const DEATH = ["~Ugh...", INTRO[4]];   // REUSE INTRO[4] = "They hit hard.|Hurt? A potion,|or talk to me." — the defeat + heal reminder lands exactly when relevant (you just died). Reference, NOT a duplicated literal (roadroller has no copy mechanism → a copy costs full price). COUPLING: INTRO must stay defined above + index 4 = the hurt/heal line; recheck if INTRO is reordered.
// WIN — talk to GREATCORN with all 7 rainbows banked (rainbows()===bs.length).
export const WIN = ["All seven! History|will remember|MY name."];
