// world.js — UNICORN: unified single-map world (spine-and-loop).
// One contiguous world (no portals / level-loads), x-banded into palette ZONES (see ZB in data.js).
// Tiles: 0 air, 1 solid, 2 one-way platform, 3 spikes.

// ============================ MAP MODEL (SPINE-AND-LOOP) ============================
// DESIGN PLAN: proj map-design (spine-and-loop, spawn HUB, difficulty ramps outward, sectioned pacing).
//
// SPINE (surface, the readable through-line): GROUND band rows 18-23 (solid highway). SPAWN is the HUB
//   at CENTER (tile 240, safe paddock). The world reads OUTWARD both ways; DIFFICULTY RAMPS with distance
//   from the hub (gentle near spawn → hardest at the far edges PEAK/SUMMIT).
// UNDERGROUND rows 24-32 = SEALED ROCK (air, reachable ONLY through cave-spoke shafts — NOT a 2nd highway).
//   Row 33 = FLOOR SEAL (catches every spoke fall → RETURN LAW).
// CAVE SPOKES = discrete VERTICAL DUNGEONS: drop-shaft in → descend → boss/treasure at the bottom →
//   return-rung climb LOOPS back UP to the surface at a NEW x (tension down, release up, progress sideways).
// ZONES (7 bosses): WEST arm hub→MEADOW(RED)→CANOPY(YELLOW)→PEAK(BLUE); EAST arm hub→EASTRUN(ORANGE)→SUMMIT(GREEN);
//   underground VIOLET (shallow spoke) + INDIGO (deep spoke). Each zone has a distinct SHAPE (climb / arena / gauntlet).
// PACING: REST before every boss; no two gauntlet/arena sections adjacent; foes CLUSTER at arenas/gauntlets,
//   NONE in the hub/rests. Chests reward EFFORT (climb-tops, off-spine alcoves, spoke bottoms) — never on flat spine.
// JUMP ENVELOPE (JV=280,GV=900,bounce=-510): authored on the DJ envelope (rise<=4, gap<=7 = forgiving);
//   TRI (rise<=6, gap<=10) + bounce (+4 rise) reserved for secrets/rewards.
// LAWS: L1 spikes FLUSH ([x,18,w,1,3], solid beneath, hop-over). L2 shafts have return rungs <=4t apart.
//   L4 RETURN LAW — every standable cell reaches the paddock (build FAILS on any stuck spot). L5 DEATH LAW.
// ============================================================================================
export const T = 16, W = 480, H = 38;
export const GROUND_H = 6, SR = 18;                 // walkable ground band thickness + surface-top row
export const grid = new Uint8Array(W * H);
export const tile = (tx, ty) => (tx < 0 || tx >= W || ty >= H) ? 1 : ty < 0 ? 0 : grid[ty * W + tx];

const box = (x, y, w, h, v = 1) => { for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) grid[j * W + i] = v; };

// ---------- MEADOW (480×38 spine-and-loop world, all CORN bosses) ---------
const MEADOW = {
  MAP: [
    // ===== SPINE — 3-band skeleton =====
    [0, 0, 3, H], [W - 3, 0, 3, H],        // borders (scale off W/H)
    [3, 18, W - 6, 6],                      // GROUND BAND rows 18-23 (surface highway).
    [3, 24, W - 6, 13, 1],                  // UNDERGROUND ROCK — rows 24-36 SOLID; caves are CARVED into it as chambers/tunnels/shafts (walls on all sides) — a real explorable NETWORK, not floating ledges in a void.
    [3, 37, W - 6, 1],                      // FLOOR SEAL row 37 (walls the very bottom of every carved shaft)
    // ---- SURFACE SPIKES (flush [x,18,w,1,3], solid beneath, hop-over) — at section edges as teach/moat, never scattered ----
    [220, 18, 3, 1, 3], [260, 18, 3, 1, 3],                      // HUB paddock pale — flank the safe pocket (x223-259, spawn 240 + GREATCORN 245). Foes edge-turn at spikes; player hops out (teaches the first jump).
    [200, 18, 3, 1, 3],                                          // RED moat (last hop into the arena)
    [292, 18, 3, 1, 3],                                          // ORANGE moat
    [312, 18, 4, 1, 3], [324, 18, 4, 1, 3], [336, 18, 4, 1, 3],  // EASTRUN PIT-GAUNTLET — spike-hop run (the "test"). NOTE: the 3rd strip is INTENTIONALLY carved to a single spike (x336) by the East cave entry shaft below (paint-then-carve) — one spike guarding the cave drop at 337-339.
    [56, 18, 3, 1, 3],                                           // CANOPY arena moat
    // ---- HILLS (solid, h3-h4 — ALL tall enough to be real TACTICAL terrain: block CHARGE dashes, eat SHOOT bolts (bolts die on solid only), foes edge-turn at them) — REQUIRED hops so flat stretches aren't a stroll (h3+ needs the double jump). Tops are walkable route-steps; DECO greens each top. ----
    [92, 14, 4, 4, 1], [162, 15, 4, 3, 1], [278, 15, 4, 3, 1],   // core mesas: west-meadow arena (h4) · meadow rest (h3) · eastrun intro (h3, was h2)
    [22, 14, 4, 4, 1], [62, 15, 4, 3, 1], [82, 15, 4, 3, 1],     // PEAK/CANOPY: BLUE east wall (h4, encloses BLUE vs the west border) · canopy approach (h3) · west-meadow (h3, was h2)
    [178, 14, 4, 4, 1], [203, 15, 3, 3, 1],                      // MEADOW: high-route ridge (h4) · RED west wall (h3, was h2 — pockets RED vs the cave mouth; safe beside the moat: foes now rest ON spike tops and exit over the 1-high west side)
    [306, 15, 4, 3, 1], [430, 14, 4, 4, 1],                      // EAST: ORANGE east gateway (h3, pockets ORANGE before the gauntlet) · summit ridge (h4 — DJ-returnable; h5 walls off DJ return)

    // ============ WEST ARM (hub → PEAK: gentle → hardest) ============
    // --- MEADOW (t90-224): RED arena [TEACH] + open REST + 2 treasure alcoves + combat perch ---
    // Deliberate structure: arena perch (climb), two alcoves ALIGNED at r12 fed by one r15 rest step, a 2-tier high-route stack, RED approach.
    [104, 13, 6, 1, 2], [116, 15, 6, 1, 2],// MEADOW combat-arena perch — chest 18 (climb reward) + r15 step
    [132, 12, 6, 1, 2], [152, 12, 6, 1, 2],// treasure alcoves B/A — chests 10 & 9 (aligned at r12, clearly above the rest route)
    [142, 15, 6, 1, 2],                    // rest step — r15 hub feeding both alcoves (rise 3 each side)
    [172, 14, 6, 1, 2], [172, 11, 6, 1, 2],// meadow high-route — chest 1 (aligned 2-tier stack)
    [196, 14, 6, 1, 2],                    // RED-approach step
    // --- CANOPY (t38-56): VERT_CLIMB → YELLOW crest [TWIST] ---
    [38, 15, 6, 1, 2], [44, 11, 6, 1, 2],  // canopy terrace (rise 3, 4)
    [40, 7, 9, 1, 2],                      // CANOPY crest — YELLOW boss b2 + chest 2 (rise 4)
    // --- PEAK (t8-24): tight VERT_CLIMB → BLUE + TRI-secret (hardest-west) ---
    [8, 15, 5, 1, 2], [14, 12, 5, 1, 2], [8, 9, 5, 1, 2], [14, 6, 5, 1, 2],   // zigzag ladder (rise 3 each, DJ-safe)
    [8, 4, 6, 1, 2],                       // PEAK ledge — chest 3
    [18, 1, 6, 1, 2],                      // PEAK TRI-secret ledge — chest 8 (rise 3 from row4)

    // ============ EAST ARM (hub → SUMMIT: gentle → hardest) ============
    // --- HUB (t224-260): safe paddock, ZERO foes — the release node you always return to ---
    [228, 15, 6, 1, 2],                    // paddock-west approach step
    [238, 14, 6, 1, 2],                    // paddock perch — chest 17 (DJ from surface, above centered spawn x240)
    // --- EASTRUN (t260-340): ORANGE arena [TEACH] → PIT_GAUNTLET [TEST] ---
    [268, 14, 6, 1, 2],                    // intro sky step — chest 14
    [282, 14, 6, 1, 2],                    // ORANGE-approach step (aligned r14)
    [300, 14, 6, 1, 2], [312, 12, 6, 1, 2], [324, 12, 6, 1, 2], [336, 14, 6, 1, 2],   // pit-gauntlet OVERHEAD sky route — even gap-7 symmetric arc (r14→r12→r12→r14) over the 3-spike pit
    [316, 8, 6, 1, 2],                     // gauntlet high reward — chest 11 (bounce + jump)
    // --- SUMMIT (t356-476): VERT_CLIMB [TWIST] → GREEN boss climax — a clean ascending STAIRCASE to the summit ---
    [356, 14, 6, 1, 2], [366, 14, 6, 1, 2],// east tower top (chest 16) + eastrun→summit transition (aligned r14)
    [384, 15, 6, 1, 2], [384, 12, 6, 1, 2],// summit gate — chest 4 (aligned 2-tier stack)
    [396, 15, 6, 1, 2], [408, 13, 6, 1, 2], [420, 11, 6, 1, 2], [432, 9, 6, 1, 2],   // summit STAIRCASE — even rise-2/gap-7 steps (chests 19, 13, 5) rising to the landing
    [443, 7, 17, 1, 2],                    // GREEN SUMMIT landing — GREEN boss b5 + chest 6 (wide climax platform, fed directly by the staircase top)
    [460, 9, 6, 1, 2],                     // summit crown ledge — chest 15 (beside the landing)

    // ============ SKY HIGHWAY — connective platforms so the WHOLE sky is a traversable PARALLEL route (hop platform→platform end-to-end, gaps<=7t) OR use the ground. Every platform is a LINK, not decoration; the mesas (t92/162/278) double as route steps. ============
    // ---- SKY UPPER TIER — PEAK↔CANOPY hop-chain link + a SECOND ALTITUDE TIER (r11-12 islands ≥3 above the r14-15 chain, DJ rise) over the west corridor, meadow rest, and the hub→east corridor so free sky-hopping has vertical texture, not just a flat lane. All placements: headroom ≥2, stack ≥3, gap ≤7, rise ≤3, no spike overlap. ----
    [29, 14, 5, 1, 2],                     // PEAK↔CANOPY link — BLUE hill top (t22-25 r14) → here → canopy terrace t36
    [71, 12, 5, 1, 2],                     // west-corridor upper island (DJ rise 3 from the t66/t76 r15 span)
    [161, 12, 6, 1, 2],                    // meadow-rest upper tier (3 above the t162 h3 hill top) — alcoves r12 → high-route ridge r11 without dropping to r15
    [255, 11, 5, 1, 2],                    // hub-east upper island (DJ rise 4 from the t258 r15 step)
    [277, 11, 5, 1, 2],                    // ORANGE-approach upper island (4 above the t278 h3 hill top; rise 3 from the t282 r14 step)
    // ---- SKY TOP TIER (r8-10) — a THIRD altitude above the r11-13 islands so the MID-MAP sky has real vertical play: DJ up from a second-tier island (rise 3) onto a top perch, then bounce between the two-platform clusters. Mid-map only (PEAK/CANOPY/summit already carry tall natural terrain rows 4-9).
    [60, 10, 4, 1, 2], [69, 9, 4, 1, 2],   // WEST top perch: x71 r12 island → r9 (rise 3) → r10 step (gap 6)
    [150, 9, 4, 1, 2], [159, 9, 5, 1, 2],  // MEADOW top perch: flat r9 pair, each rise 3 above the r12 islands (x152, x161); gap 5 between
    [253, 8, 5, 1, 2], [262, 9, 4, 1, 2],  // HUB top perch: x255 r11 → r8 (rise 3) → r9 step (gap 5)
    [275, 8, 5, 1, 2], [284, 9, 4, 1, 2],  // ORANGE top perch: x277 r11 → r8 (rise 3) → r9 step (gap 5)
    // ---- SKY FREEDOM PASS (B44) — mid-gap steps in the 5 remaining sparse stretches; t51 also FIXES a latent rise-4 law break (r15 t56 → r11 t46 westbound had no legal step)
    [51, 13, 4, 1, 2],                     // CANOPY-west chain step: r15 t56 → r13 → r11 t46 (rises 2+2, gaps 1)
    [111, 14, 4, 1, 2],                    // hop-step over the t115-117 cave pit (r13 t106 ↔ r15 t116, rises 1)
    [331, 13, 4, 1, 2],                    // EASTRUN chain step above the spike-guarded East cave entry (r12 t326 ↔ r14 t336)
    [392, 13, 4, 1, 2], [403, 14, 4, 1, 2],// summit-approach second tier: r12 t386 → r13 → r15 t396 → r14 → r13 t408
    [56, 15, 5, 1, 2], [66, 15, 5, 1, 2], [76, 15, 5, 1, 2], [86, 15, 5, 1, 2], [98, 16, 4, 1, 2],   // CANOPY→MEADOW span (past the t92 mesa)
    [124, 14, 5, 1, 2],                                                                                 // MEADOW arena→alcoves link
    [182, 13, 5, 1, 2], [190, 14, 5, 1, 2],                                                             // high-route→RED-approach link
    [206, 14, 5, 1, 2], [214, 15, 5, 1, 2], [222, 15, 5, 1, 2],                                         // MEADOW→HUB span (over the CENTRAL cave mouth)
    [248, 15, 5, 1, 2], [258, 15, 5, 1, 2],                                                             // HUB→EASTRUN span
    [292, 14, 5, 1, 2],                                                                                 // ORANGE→gauntlet link
    [346, 14, 5, 1, 2], [376, 14, 5, 1, 2],                                                             // gauntlet→summit + summit-transition links

    // ============ CAVE NETWORK — explorable multi-chamber systems carved into the solid underground rock ============
    // Each system = several CHAMBERS joined by skinny 1-tall walk/crawl TUNNELS + vertical drop/climb SHAFTS, with a boss
    // + treasure deep inside and a climb-out that LOOPS to the surface at a NEW x. Some pockets are single-entrance secrets
    // (climb back out the only way in). Rock walls on all sides → reads as real caves, not floating ledges. Entry/exit
    // shafts also punch 3-wide surface gaps you must jump (B). (geometry gate: interior platforms keep >=2t headroom;
    // rungs sit inside shaft columns; every carved cell returns to the paddock.)

    // ===== WEST SYSTEM (VIOLET) — shallow upper-tier network: entry → antechamber → skinny tunnel → boss hall → climb-out (new x); + single-entrance secret pocket =====
    [115, 18, 3, 11, 0],                   // ENTRY drop-shaft (surface col 116 → antechamber floor r29)
    [109, 25, 31, 4, 0],                   // WEST ANTECHAMBER — air rows 25-28, floor r29 (cols 109-139)
    [118, 27, 6, 1, 2], [128, 27, 5, 1, 2],// antechamber ledges (r27, 2t headroom) — foes + chest 9
    [112, 29, 2, 1, 0], [110, 30, 8, 3, 0],// SECRET POCKET (single entrance): drop-hole in the floor → hidden pocket cols 110-117 rows 30-32 (chest 15)
    [112, 31, 3, 1, 2],                    // pocket climb-rung (floor r33 → r31 → back up the hole to r29)
    [139, 27, 8, 2, 0],                    // SKINNY TUNNEL (2-tall walk, doubled) antechamber → boss hall (cols 139-146 rows 27-28, rock ceiling r26, floor r29 continues)
    [147, 25, 29, 4, 0],                   // VIOLET BOSS HALL — air rows 25-28, floor r29 (cols 147-175)
    [154, 27, 6, 1, 2], [164, 27, 5, 1, 2],// boss-hall ledges (r27) — foe + chest 0
    [171, 18, 3, 7, 0],                    // CLIMB-OUT shaft (boss hall → surface at NEW x col 172)
    [171, 26, 3, 1, 2], [171, 23, 3, 1, 2], [171, 20, 3, 1, 2],   // climb-out rungs (rise 3)

    // ===== CENTRAL SYSTEM (t210) — single-entrance NETWORK: entry chamber → skinny tunnel → west pocket chamber =====
    [210, 18, 3, 10, 0],                   // entry/exit shaft (surface → chamber floor r28)
    [202, 25, 20, 3, 0],                   // entry chamber — air rows 25-27, floor r28 (cols 202-221)
    [206, 27, 5, 1, 2], [214, 27, 4, 1, 2],// chamber ledges (r27, 2t headroom) — chest 12 + foe
    [210, 24, 3, 1, 2], [210, 21, 3, 1, 2],// climb-out rungs
    [193, 26, 9, 2, 0],                    // SKINNY TUNNEL (2-tall) entry chamber → west pocket (cols 193-201, rows 26-27, rock ceiling r25)
    [183, 25, 11, 3, 0],                   // WEST POCKET — open chamber, air rows 25-27, floor r28 (cols 183-193); floor foe, loops back out via the entry shaft

    // ===== EAST SYSTEM (INDIGO) — DEEP two-tier network: entry → upper chamber → drop → deep hall west (boss) → skinny crawl → deep hall east (treasure) → long climb-out (new x); + single-entrance side pocket =====
    [337, 18, 3, 11, 0],                   // ENTRY drop-shaft (surface col 338 → upper chamber floor r29)
    [330, 25, 31, 4, 0],                   // EAST UPPER CHAMBER — air rows 25-28, floor r29 (cols 330-360)
    [340, 27, 6, 1, 2],                    // upper ledge (r27) — foe
    [351, 28, 3, 8, 0],                    // DROP-SHAFT upper → deep hall west (cols 351-353 rows 28-35, cuts the r29 divider)
    [340, 30, 30, 6, 0],                   // DEEP HALL WEST (INDIGO boss) — air rows 30-35, floor r36 (cols 340-369)
    [346, 34, 6, 1, 2], [356, 32, 6, 1, 2], [364, 34, 5, 1, 2],   // west-hall platforms (stacked, 2t headroom) — foe + chest 7 + extra step
    [328, 33, 8, 3, 0], [336, 34, 4, 2, 0],// SIDE POCKET (single entrance via crawl-tunnel, doubled 2-tall r34-35) — hard chest 19 (cols 328-335 rows 33-35, floor r36)
    [369, 34, 8, 2, 0],                    // SKINNY CRAWL-TUNNEL (2-tall, doubled) west hall → east hall (cols 369-376 rows 34-35, rock ceiling r33)
    [377, 30, 25, 6, 0],                   // DEEP HALL EAST (treasure) — air rows 30-35, floor r36 (cols 377-401)
    [380, 34, 6, 1, 2], [388, 32, 6, 1, 2],// east-hall platforms — foe + chest 13
    [395, 18, 3, 18, 0],                   // CLIMB-OUT shaft (deep hall east → surface at NEW x col 396)
    [395, 34, 3, 1, 2], [395, 31, 3, 1, 2], [395, 28, 3, 1, 2], [395, 25, 3, 1, 2], [395, 22, 3, 1, 2], [395, 19, 3, 1, 2]   // deep climb-out rungs (rise 3 the whole way up)
  ],

  bounce: [[14, 17], [48, 17], [126, 17], [154, 17], [300, 17], [330, 17], [420, 17], [458, 17], [190, 17], [276, 17], [408, 17], [73, 17], [110, 17], [384, 17]],   // BOUNCE MUSHROOMS — ALL on the outdoor ground surface (row 17, air cell + solid below, open sky above), never underground/buried. Enforced by tools/map-geometry.mjs RULE5. launch -510 keeps pl.air=0 so DJ/TRI stack at apex.   // BOUNCE MUSHROOMS (launch -510, keeps pl.air=0 so DJ/TRI stack at apex). >=1 per zone; each ENABLES a specific climb, not decoration. [388,36]=East deep-hall express-exit, [120,29]=West antechamber express-exit.
  bosses: [                              // 7 CORN bosses; 3rd field bi picks the rainbow band + palette
    [206, 17, 0],   // RED — MEADOW arena (past the spike moat) — first west boss [TEACH] (feet-row convention)
    [298, 17, 1],   // ORANGE — EASTRUN arena (past the spike moat) — first east boss [TEACH] (feet-row convention)
    [45, 6, 2],     // YELLOW — CANOPY crest (sky climb) [TWIST]
    [16, 17, 3],    // BLUE — PEAK base (far-west, hardest west) (feet-row convention)
    [160, 28, 4],   // VIOLET — West Boss Hall floor r29 (shallow VIOLET-tinted cave)
    [454, 6, 5],    // GREEN — SUMMIT landing (sky climax) — far-right-top bookend
    [362, 35, 6],   // INDIGO — East Deep Hall West floor r36 (deep INDIGO-tinted cave)
  ],
  chests: [
    [166, 27.3],    // 0  — West Boss Hall ledge (by VIOLET boss)
    [174, 11.3],    // 1  — meadow high-route top (2-tier stack)
    [47, 7.3],      // 2  — canopy crest (near YELLOW)
    [10, 4.3],      // 3  — peak ledge
    [386, 12.3],    // 4  — summit gate
    [434, 9.3],     // 5  — summit staircase top step
    [451, 7.3],     // 6  — GREEN summit landing
    [358, 32.3],    // 7  — East Deep Hall West platform (by INDIGO boss)
    [21, 1.3],      // 8  — PEAK TRI-secret
    [154, 12.3],    // 9  — meadow treasure alcove A (aligned r12)
    [134, 12.3],    // 10 — meadow treasure alcove B (aligned r12)
    [318, 8.3],     // 11 — EASTRUN gauntlet high reward
    [208, 27.3],    // 12 — CENTRAL secret chamber ledge
    [390, 32.3],    // 13 — East Deep Hall East platform (treasure chamber)
    [270, 14.3],    // 14 — eastrun intro step
    [113, 33.3],    // 15 — West secret pocket floor (single-entrance reward)
    [358, 14.3],    // 16 — east tower top
    [241, 14.3],    // 17 — HUB paddock perch (above centered spawn x240)
    [106, 13.3],    // 18 — MEADOW combat-arena perch (climb reward)
    [331, 36.3],    // 19 — East side pocket floor (single-entrance, crawl-tunnel reward)
  ],
  foes: [
    // SKY / CLIMB foes — ELEVATION RULE: gentle hop kinds only (k1/k4); traversal is the challenge.
    // 4th element 1 = PATROLLER: sky/platform foes are pure traversal
    // obstacles — walk + edge-turn + contact damage, NEVER aggro/hop-chase. Ground foes hunt (leashed);
    // bosses latch. Three legible tiers, zero overlap. ([450,7] GREEN-landing foe stays a HUNTER — it's
    // an arena fight participant, not a platform dweller.)
    [8, 15, 1, 1], [14, 12, 4, 1], [8, 9, 1, 1], [14, 6, 4, 1], // PEAK climb (patrol)
    [38, 15, 1, 1], [44, 11, 4, 1],                             // CANOPY climb (patrol)
    [104, 13, 1, 1], [172, 11, 4, 1],                           // MEADOW sky (patrol)
    [312, 11, 1, 1], [324, 11, 4, 1],                           // EASTRUN gauntlet sky arc (patrol — timing obstacles ON the r12 one-way platforms over the spike run). y=11 (NOT 12): feet-tile must equal the platform row (r12) to land ON it; at y=12 the feet-tile is r13 (air) → the one-way platform is MISSED and the patroller falls onto the r18 spikes below, where a patroller (never `near` → never hops) is trapped forever (2-enemies-stuck-on-spikes bug).
    [420, 11, 1, 1], [432, 9, 4, 1],                            // SUMMIT staircase (patrol)
    [450, 7, 1],                                                // GREEN arena (HUNTER — boss-arena participant on the landing)
    // ARENA / GAUNTLET ground foes — flat carries the tough kinds (charge k3/k5, shoot k2/k6). CLUSTERED, none in rests/hub.
    [52, 17, 3], [70, 17, 5], [80, 17, 2],                      // CANOPY arena — RULE6-validated placement
    [96, 17, 6], [110, 17, 3], [120, 17, 5],                    // MEADOW combat arena
    [198, 17, 2], [190, 17, 6],                                 // RED arena
    [270, 17, 1],                                               // EASTRUN intro — GOOMBA LAW: the FIRST ground foe a new player touches is a k1 hopper (4hp, stompable, gentle leap) — a safe practice target, NOT a tier-3 charger. Chargers debut later in the run.
    [290, 17, 5], [296, 17, 2],                                 // ORANGE arena
    [310, 17, 6], [320, 17, 3],                                 // EASTRUN gauntlet ground (in the spike-gap lanes) — RULE6-validated placement
    [428, 17, 5], [438, 17, 2],                                 // SUMMIT ground
    [444, 17, 6],                                               // GREEN arena ground
  ],
  // FILL FOES — cave-spoke + surface fill. Held out of world.js ledge-grow (keeps LCG stable for scatter).
  // main.js seedFoes concatenates these into the live foe list. Total (foes+foesX) = 54 = 9 of each kind.
  foesX: [
    // Cave-spoke foes seat at floorRow-1 (gravity drops them ONTO the chamber floor).
    [124, 28, 3], [132, 28, 5],                                // WEST antechamber — floor foes (seat r28 → floor r29)
    [156, 28, 2],                                              // WEST boss hall — floor foe
    [214, 26, 6],                                              // CENTRAL secret — foe on the r27 ledge (seat r26)
    [344, 28, 2], [348, 28, 6],                                // EAST upper chamber — floor foes
    [352, 35, 2], [360, 35, 3], [382, 35, 5], [386, 35, 3],    // EAST deep halls — floor foes (seat r35 → floor r36), populate the deep chambers
    // Surface/sky fill to complete 9-of-each (hop kinds on platforms per elevation rule; charge/shoot on flat).
    [172, 14, 1, 1], [268, 14, 1, 1],                          // k1 fill (sky — patrol, same rule as seeds.foes sky group)
    [116, 15, 4, 1], [282, 14, 4, 1], [408, 13, 4, 1],         // k4 fill (sky — patrol)
    [34, 17, 2], [186, 27, 2],                                 // k2 fill — 2nd seated in the CENTRAL west pocket (floor foe r27→r28), 3rd in the EAST deep hall
    [88, 17, 3], [420, 17, 3],                                 // k3 fill (ground)
    [144, 17, 5], [286, 17, 5], [436, 17, 5],                  // k5 fill (ground)
    [59, 17, 6], [152, 17, 6], [460, 17, 6],                   // k6 fill (ground)
  ],
};

export const seeds = MEADOW;

// Ground-find: first solid/platform surface ROW at or below (tx, ty), skipping air/spikes.
// One shared "seat on the surface" rule — used by chest snapping + bounce snapping (main.js).
export const groundRow = (tx, ty) => { for (let y = ty; y < H; y++) { const v = grid[y * W + tx]; if (v === 1 || v === 2) return y; } return H; };

// PROCEDURAL FOLIAGE v3 — LAYERED scatter (canon: Wei SIGGRAPH'10 multi-class blue noise ·
// Deussen SIGGRAPH'98 ecosystem shade · stratified quota cycles). Decorates exposed floor tops.
const Q = [1, 3, 6, 1, 3, 1, 6, 2];   // quota cycle (type ids: 1 grass · 6 flower · 3 shroom · 2 rock)
let seed = 13, rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;   // shared LCG: ledge growth + foliage
const scatter = () => {
  const d = [];
  const keep = [...seeds.chests, ...seeds.foes, ...seeds.bosses, ...(seeds.bounce || [])];
  const tc = {}, run = {}, qc = {}, sh = {};                     // per-row: tree cooldown, grass-run left, quota index, shade counter
  for (let x = 5; x < W - 5; x++) {
    if (keep.some(p => p && Math.abs(p[0] - x) < 2)) continue;   // keepout: skip cols near critical objects
    for (let y = 2; y < H; y++) {
      const v = grid[y * W + x];
      if ((v !== 1 && v !== 2) || grid[(y - 1) * W + x] !== 0) continue;    // exposed floor tops: solid ground AND one-way platform rungs
      if (run[y] > 0) { run[y]--; d.push([x, y - 1, 1]); }                                        // grass run continuation
      else if (v === 1 && x >= (tc[y] || 0) && rnd() < .2) { d.push([x, y - 1, 0]); tc[y] = x + 7; sh[y] = 3; }   // tree anchor — SOLID only; round TREE (dt0), opens a 3-slot shade zone
      else if (rnd() < .64) {
        let t = Q[(qc[y] = (qc[y] || 0) + 1) % 8];               // stratified: rotate the quota table
        if (sh[y] > 0 && t === 6) t = 3;                         // CANOPY: flower slot under shade → mushroom
        if (t === 1) run[y] = rnd() * 2 | 0;                     // grass may extend 0-2 extra cols
        d.push([x, y - 1, t]);
      }
      if (sh[y] > 0) sh[y]--;                                    // shade decays per ground slot
    }
  }
  return d;
};

// Module-init: paint MEADOW grid, grow combat ledges, scatter decor.
for (const m of seeds.MAP) box(...m);
// COMBAT LEDGES GROW — each foe/boss on a one-way (v=2) ledge widens it a seeded-random ±2-5
// tiles into open air (solid walls + spike pits preserved) → roomier fights, zero MAP data.
for (const [fx, fy] of [...seeds.foes, ...seeds.bosses]) {
  const r = groundRow(fx, fy), n = 2 + (rnd() * 4 | 0);
  if (grid[r * W + fx] === 2)                                          // only grow floating (v=2) ledges; solid arenas already roomy
    for (let c = fx - n; c <= fx + n; c++)
      if (grid[r * W + c] === 0 && grid[(r + 1) * W + c] !== 3) grid[r * W + c] = 2;   // air only; never over spikes
}
export const DECO = scatter();
// BOUNCE pads snapped to their solid landing row: [col, solidRow].
export const BOUNCE = seeds.bounce.map(([x, y]) => [x, groundRow(x, y + 1)]);
