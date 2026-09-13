// CAPTURE BUILD — unminified bundle + dev hooks for marketing screenshots/trailer.
// NEVER shipped, NEVER touches src/. Produces dist/capture/index.html (visually
// identical to the real game — same source, just readable + window.__G hooks).
//
//   node tools/capture-build.mjs   →   serve dist/capture   →   drive via window.__G
//
// window.__G exposes the live in-IIFE state so a Playwright/browser session can
// teleport the unicorn to any zone and stage combat instead of walking in a line:
//   __G.pl            live player object (set .x/.y in PX to teleport; *16 from tiles)
//   __G.foes          live foe array
//   __G.seeds         world seed data (boss/chest/foe positions, in tiles)
//   __G.keys          held-key Set (clear stuck inputs)
//   __G.tp(tx,ty)     teleport by TILE coords (handles *16 + zeroes velocity)
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const run = (c) => execSync(c, { stdio: 'inherit' });

console.log('1/3 bundle (esbuild, unminified)…');
mkdirSync('dist/capture', { recursive: true });
run('npx esbuild src/main.js --bundle --format=iife --outfile=dist/capture/bundle.js');

console.log('2/3 inject dev hooks…');
let js = readFileSync('dist/capture/bundle.js', 'utf8');
// The bundle ends with the IIFE close `})();`. Inject a hook epilogue INSIDE that
// closure (last occurrence) so it captures the module-scope bindings.
const HOOK = ';try{window.__G={'
  + 'pl,seeds,keys,eq,inv,bs,'
  + 'get foes(){return foes},'   // foes is REASSIGNED by fresh()/load()/seedFoes() — must be a getter, not a captured value
  + 'get st(){return st},get lvl(){return lvl},get hp(){return hp},get mn(){return mn},'
  + 'get paused(){return paused},get dq(){return dq},get hs(){return hs},get phase(){return phase},'
  + 'get hpPot(){return hpPot},get mpPot(){return mpPot},get mute(){return mute},get savePop(){return savePop},get started(){return started},'   // input-audit: observe potion counts, mute, save/exit popup + started
  + 'drain:()=>{hp=Math.round(mHP()*.3);mn=Math.round(mMN()*.3);},'   // dev: knock HP+MP to 30% so the potion-quaff hotkeys have something to restore
  + 'cam,'
  + 'tp:(tx,ty)=>{pl.x=tx*16;pl.y=ty*16;pl.vx=0;pl.vy=0;pl.gr=0;},'
  // snap(): instantly center the camera on the player (no lerp) — mirrors the step() target so a teleported scene frames correctly.
  + 'snap:()=>{const tx=pl.x+PW/2+pl.face*40-VW/2,ty=pl.y-VH/2+20;cam.x=Math.max(0,Math.min(W*T-VW,tx));cam.y=Math.max(0,Math.min(H*T-VH,ty));},'
  // start(nm): jump straight into play with a name, no title keying. Clears the intro dialogue.
  + 'start:(nm)=>{fresh();ent=nm||"STAR";pName=nm||"STAR";phase=2;started=1;dq=0;},'
  + 'startReal:(nm)=>{fresh();ent=nm||"STAR";beginGame();},'   // FAITHFUL new-game path — runs the real beginGame() → talk(INTRO); tests the true intro→levelup→lock flow
  + 'get pending(){return pending},get di(){return di},'       // allocation-lock + dialogue-cursor inspection
  + 'menu:(v)=>{paused=v?1:0;},'          // open/close character menu deterministically
  + 'tp:(tx,ty)=>{pl.x=tx*16;pl.y=ty*16;pl.vx=0;pl.vy=0;cam.x=tx*16-240;cam.y=ty*16-135;},'   // teleport (tile coords) — visual band inspection
  + 'get foeRows(){return foes.map(f=>f.y/16|0)},'   // foe tile-rows — AI fall/void inspection
  + 'get foeXY(){return foes.map(f=>[f.x/16|0,f.y/16|0])},'   // foe tile x,y — pocket-intrusion inspection
  + 'get plPos(){return [pl.x/16|0,pl.y/16|0]},'     // player tile pos — respawn inspection
  + 'clearDlg:()=>{dq=0;},'               // force-dismiss any dialogue bubble
  + 'boss:(bi)=>{bs[bi]=0;},'             // reset a boss so it re-spawns on approach
  + 'get deathT(){return deathT},'        // read the death timer (VBEAT+1 → 0) to sample the death beat + home transition
  + 'kill:()=>{deathT=VBEAT+1;dBurst=.22;spray(pl.x+PW/2,pl.y+PH/2,14,1);},'  // reproduce the real death beat (main.js hp<=0): frozen pause + skull burst, then teleport-home transition
  + 'get parts(){return parts},get bs(){return bs},get foes(){return foes},get time(){return time},get winT(){return winT},'  // inspect particle/boss/foe/clock/win-finish state (hs already exposed above; finale verification)
  // power(): level up, set stats, equip one gear per slot (real equip()), leave 2 unspent
  // points so the blue "+N" pulse shows in the menu shot. Abilities are always-on now
  // (skill tree removed 2026-09) — no unlock step needed; every unicorn has the full kit.
  + 'power:()=>{lvl=12;st=[14,20,16,12,10];'
  + 'pending=2;hpPot=5;mpPot=3;eq[0]=eq[1]=eq[2]=eq[3]=null;inv.length=0;'
  + '[{t:0,s:0,c:9,b:6},{t:0,s:1,c:13,b:6},{t:0,s:2,c:4,b:6},{t:0,s:3,c:11,b:5}].forEach(g=>equip(g));'
  + 'hp=mHP();mn=mMN();}'
  + '}}catch(e){console.warn("hook fail",e)}\n';
const idx = js.lastIndexOf('})();');
if (idx === -1) throw new Error('capture-build: could not find IIFE close `})();`');
js = js.slice(0, idx) + HOOK + js.slice(idx);
writeFileSync('dist/capture/bundle.js', js);

console.log('3/3 write capture shell…');
const SHELL = '<title>HOOVES OF HOPE — capture</title>'
  + '<meta name=viewport content="width=device-width,initial-scale=1,viewport-fit=cover,user-scalable=no">'
  + '<style>html,body{margin:0;height:100%;background:#000;overflow:hidden;user-select:none}canvas{width:100%;height:100%;display:block;image-rendering:pixelated;touch-action:none}</style>'
  + '<canvas id=cv></canvas>';
writeFileSync('dist/capture/index.html', '<!doctype html><meta charset=utf-8>' + SHELL + '<script src="bundle.js"></script>');

console.log('✅ dist/capture/index.html ready — serve dist/capture and drive via window.__G');
