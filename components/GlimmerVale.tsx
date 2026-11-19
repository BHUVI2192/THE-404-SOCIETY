// @ts-nocheck
// Glimmer Meadow: a WebGL2 night-field component for Framer, with three scenes.
//
// Original work. Three scenes, switched with the Scene property:
//   Lavender Aurora  a lavender field under a green and violet aurora,
//                    with teal glitter hills and firefly glows.
//   Dusk Dunes       wind-carved desert dunes under a setting sun, with
//                    ember glitter, rising sparks and dune grass.
//   Moonlit Mountains  a jagged range under a moon, frost-sparkle
//                    ridgelines, wandering fireflies and wildflowers.
// The landscapes, plant designs, sky, palettes and motion are authored for
// this component. It
// uses no third-party artwork, images, fonts or code: everything is
// generated in shaders at runtime. The only imports are React and Framer.
import{jsx as _jsx,jsxs as _jsxs}from"react/jsx-runtime";import{useEffect,useRef,useState}from"react";const useIsStaticRenderer = () => false;/* ------------------------------------------------------------------ *
 *  Scene
 *    Sky       deep blue night with slow aurora curtains.
 *    Hills     a perspective heightfield: one tall ridge on the right
 *              and a long far ridge showing through the low left. A dark
 *              terrain mesh writes depth; glitter rows are depth-tested
 *              against it.
 *    Glitter   teal, green and gold dots, brightest on each crest.
 *    Meadow    lavender spikes on stems, firefly bokeh and grass,
 *              softly defocused towards the camera.
 *    Glow      HDR bloom and a faint lens fringe.
 *
 *  Framer notes
 *    - Static on the canvas and in exports (useIsStaticRenderer).
 *    - Pauses rendering while scrolled out of view.
 *    - Honours prefers-reduced-motion.
 * ------------------------------------------------------------------ *//** Tuning values. Out of the box Advanced changes nothing. */const DEFAULT_ADVANCED={loopSec:8,waveHeight:25,waveLength:70,crestBright:100,slopeBright:100,pointSize:100,twinkleSharp:8,prismShare:60,crestColor:"#FFF3C4",slopeColor:"#35D6B4",slopeDeep:"#1B7C95",hillShadow:"#08161F",glowColor:"#B8FFE6",glowStrength:60,lightShift:0,hotspotStrength:70,skyMid:"#10305E",horizonGlow:"#B8FFE0",horizonGlowStrength:30,petalColor:"#8C66F0",petalTip:"#E6D6FF",flowerCore:"#FFC24D",flowerSize:100,flowerBlur:100,fringe:100,sway:50,midCount:110,bokehCount:90,grassCount:320,glintCount:20,glintSize:100,bob:6,seed:7,grain:12,vignette:15,hover:50,sceneDrop:18};// ── camera and world ──
const CAM_H=2.2;const PITCH=.25;const TAN_V=.33;const TAN_H=.5;const NEAR=.3;const FAR=220;const D0=1.6// nearest terrain row
;const D1=90// farthest terrain row
;const RIDGE_PTS=72e3;const FIELD_PTS=5e4;const MAX_PTS=RIDGE_PTS+FIELD_PTS;const ROW_DT=.05;const ROWS_FRONT=34;const ROWS_BACK=6;const MAX_HF=12e3;const PT_D0=3;const PT_D1=24;const MESH_C=240;const MESH_R=200;const MESH_S=1.3;const BLOOM_LEVELS=6;const MAX_SPRITES=4200;const SPR_STRIDE=13;const TAU=Math.PI*2;const SPIKE_ASP=2// quad height / width for a flower spike
;/** The far range: a broad envelope with sharp peaks cut into it. */const MOUNTAIN_RANGE=Array.from({length:41},(_,i)=>{const u=-.35+i*.0425;const env=.225-.045*Math.sin(u*3.4+.4)-.02*Math.sin(u*7.7+2);const y=env+.09*Math.pow(Math.abs(Math.sin(u*13+.7)),.7)+.03*Math.pow(Math.abs(Math.sin(u*37+2.1)),.8);return[u,y,16];});const THEMES=[{mode:0,ridgeA:[[-.35,.54,7],[0,.53,7],[.1,.51,7.2],[.2,.49,7.4],[.3,.455,7.6],[.4,.43,7.8],[.5,.4,8],[.6,.37,8],[.68,.345,8],[.74,.335,8],[.8,.345,8],[.86,.37,8.2],[.92,.4,8.4],[1,.42,8.6],[1.35,.44,8.6]],// The far ridge shows through the low left, as a long band behind the near one.
ridgeB:[[-.35,.44,13],[0,.435,13],[.15,.43,13.5],[.3,.425,14],[.45,.42,14],[.6,.43,13],[.8,.45,12],[1,.46,12],[1.35,.47,12]],shoulder:.74,hotX:.74,sheen:[.2,.5,.42],colors:{background:"#02070C",skyTop:"#071536",skyHorizon:"#1F6E86",skyMid:"#10305E",horizonGlow:"#B8FFE0",glowColor:"#B8FFE6",crestColor:"#FFF3C4",slopeColor:"#35D6B4",slopeDeep:"#1B7C95",hillShadow:"#08161F",petalColor:"#8C66F0",petalTip:"#E6D6FF",flowerCore:"#FFC24D"},plants:[[.06,.93,.15,0,.7],[.17,.82,.12,0,.85],[.3,.97,.13,0,.55],[.42,.8,.09,0,.95],[.55,.9,.11,1,1],[.68,.99,.15,0,.5],[.79,.83,.1,0,.9],[.9,.92,.13,0,.65],[.96,.76,.07,0,.9],[.12,.7,.065,0,1],[.35,.7,.06,0,1],[.62,.72,.055,0,.95],[.85,.68,.05,1,1],[.5,.67,.045,0,1]],bokeh:["#7DFFC8","#B8FF7A","#FFE27A","#8FF0FF","#FFB86B"],glints:["#7DFFB0","#7FE8FF","#FFFFFF","#FFE27A","#B8FF7A","#C9A8FF"],mid:["#7A5FDB","#D9C6FF","#FFC24D"],grass:[[15/255,42/255,20/255],[58/255,124/255,62/255]],tint:(l,warm)=>warm?[1,.72,.92]:[l*l,l*(.4+.6*l),l*(.6+.4*l)],midTint:(br,warm)=>warm?[br,br*.72,br*.92]:[br*.86,br*.9,br]},{mode:1,// Dunes: the near dune crests on the left and rolls away to the right,
// where a far dune shows its crest against the setting sun.
ridgeA:[[-.35,.4,7.5],[0,.385,7.5],[.1,.365,7.5],[.2,.35,7.4],[.28,.345,7.4],[.36,.355,7.3],[.46,.385,7.2],[.56,.43,7.1],[.66,.47,7],[.76,.5,6.9],[.86,.52,6.8],[1,.53,6.8],[1.35,.54,6.8]],ridgeB:[[-.35,.47,13],[.2,.45,13.5],[.4,.43,14],[.55,.41,15],[.68,.395,15],[.8,.4,14],[1,.42,13],[1.35,.43,13]],shoulder:.28,hotX:.66,sheen:[.55,.28,.1],colors:{background:"#0A0508",skyTop:"#1B1240",skyHorizon:"#FF8A4A",skyMid:"#5E2A6E",horizonGlow:"#FFC070",glowColor:"#FFB070",crestColor:"#FFE2A0",slopeColor:"#FF7A2A",slopeDeep:"#B3301F",hillShadow:"#1C0A0E",petalColor:"#2E160F",petalTip:"#FFB35A",flowerCore:"#FF8A30"},plants:[[.05,.95,.15,0,.8],[.16,.84,.1,0,.9],[.27,.99,.13,0,.6],[.4,.82,.085,0,1],[.52,.93,.12,1,1],[.64,.99,.15,0,.55],[.76,.86,.095,0,.95],[.88,.95,.13,0,.7],[.96,.8,.07,0,.9],[.1,.72,.06,0,1],[.33,.73,.055,0,1],[.58,.74,.05,0,1],[.82,.7,.05,1,1],[.46,.69,.045,0,1]],bokeh:["#FF6A2A","#FF9A3A","#FFC85A","#FF4A22","#FFE08A"],glints:["#FFD27A","#FF9A4A","#FFFFFF","#FF6A3A","#FFE9B0","#FFB080"],mid:["#3A1D12","#FFC27A","#FF8A30"],grass:[[.1,.05,.04],[.45,.28,.12]],tint:(l,warm)=>warm?[1,.85,.6]:[l,l*l*.95,l*l*.8],midTint:(br,warm)=>warm?[br,br*.85,br*.6]:[br,br*.9,br*.78]},{mode:2,// Mountains: a low foothill ridge in front, and a jagged far range behind it
// whose upper ridgeline carries a band of frost sparkle.
ridgeA:[[-.35,.5,7],[0,.51,7],[.15,.525,7.1],[.3,.51,7.1],[.45,.49,7.2],[.55,.475,7.2],[.65,.485,7.1],[.8,.51,7.1],[.95,.525,7],[1.1,.52,7],[1.35,.5,7]],ridgeB:MOUNTAIN_RANGE,shoulder:.5,hotX:.24,sheen:[.22,.38,.6],colors:{background:"#04070D",skyTop:"#050B1E",skyHorizon:"#2A5A78",skyMid:"#0F2650",horizonGlow:"#9FD8FF",glowColor:"#BFE6FF",crestColor:"#EAF6FF",slopeColor:"#6FB6E8",slopeDeep:"#2C5E9E",hillShadow:"#070E1A",petalColor:"#FFE9A8",petalTip:"#C8F0FF",flowerCore:"#FFD45A"},plants:[[.07,.92,.14,0,.7],[.2,.84,.1,0,.85],[.31,.97,.12,0,.6],[.44,.82,.085,0,.95],[.56,.92,.115,1,1],[.7,.99,.14,0,.5],[.81,.85,.1,0,.9],[.92,.93,.12,0,.65],[.97,.78,.07,0,.9],[.13,.71,.065,0,1],[.37,.72,.058,0,1],[.63,.73,.052,0,1],[.86,.7,.05,1,1],[.5,.68,.045,0,1]],bokeh:["#E8FF7A","#FFF08A","#C8FF6A","#FFE06A","#B8F06A"],glints:["#E8FF7A","#FFFFFF","#FFF08A","#BFE6FF","#C8FF6A","#FFE06A"],mid:["#FFFFFF","#FFFFFF","#FFC94A"],grass:[[.03,.08,.1],[.12,.3,.28]],tint:(l,warm)=>warm?[1,1,1]:[l*(.55+.45*l),l*(.6+.4*l),l],midTint:(br,warm)=>warm?[br,br,br]:[br*.9,br*.95,br]},
{mode:3,ridgeA:[[-.35,.52,7],[0,.51,7],[.12,.49,7.2],[.25,.47,7.4],[.38,.44,7.6],[.5,.41,7.8],[.62,.38,8],[.72,.35,8],[.82,.36,8],[.92,.39,8.2],[1,.41,8.4],[1.35,.43,8.6]],ridgeB:[[-.35,.44,13],[0,.43,13],[.15,.42,13.5],[.35,.41,14],[.55,.4,14],[.75,.42,13],[1,.44,12],[1.35,.45,12]],shoulder:.72,hotX:.28,sheen:[.95,.9,.7],colors:{background:"#082548",skyTop:"#0C4A9E",skyHorizon:"#B2E0FD",skyMid:"#3B82F6",horizonGlow:"#FFF4D4",glowColor:"#FFF0C0",crestColor:"#FEF08A",slopeColor:"#10B981",slopeDeep:"#064E3B",hillShadow:"#0F3642",petalColor:"#60A5FA",petalTip:"#E0F2FE",flowerCore:"#FACC15"},plants:[[.06,.93,.15,0,.9],[.17,.82,.12,0,.95],[.3,.97,.13,0,.8],[.42,.8,.09,0,1],[.55,.9,.11,1,1],[.68,.99,.15,0,.75],[.79,.83,.1,0,.9],[.9,.92,.13,0,.85],[.96,.76,.07,0,1],[.12,.7,.065,0,1],[.35,.7,.06,0,1],[.62,.72,.055,0,.95],[.85,.68,.05,1,1],[.5,.67,.045,0,1]],bokeh:["#67E8F9","#A7F3D0","#FEF08A","#93C5FD","#FDE047"],glints:["#FFFFFF","#FEF08A","#BAE6FD","#E0F2FE","#FDE68A"],mid:["#2563EB","#93C5FD","#FBBF24"],grass:[[16/255,75/255,38/255],[52/255,178/255,85/255]],tint:(l,warm)=>warm?[1,.95,.8]:[l*.9,l*.95,l],midTint:(br,warm)=>warm?[br,br*.92,br*.75]:[br*.8,br*.9,br]}];const COLOR_KEYS=["crestColor","slopeColor","slopeDeep","hillShadow","glowColor","skyMid","horizonGlow","petalColor","petalTip","flowerCore"];const CORNERS=[-1,-1,1,-1,1,1,-1,-1,1,1,-1,1];const num=(v,d)=>typeof v==="number"&&isFinite(v)?v:d;const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));const smooth=(a,b,x)=>{const t=clamp((x-a)/(b-a),0,1);return t*t*(3-2*t);};function parseColor(input,fallback=[0,0,0]){if(typeof input!=="string")return fallback;let s=input.trim();const v=s.match(/^var\([^,]+,\s*(.+)\)$/);if(v)s=v[1].trim();if(s[0]==="#"){let h=s.slice(1);if(h.length===3||h.length===4)h=h.split("").map(c=>c+c).join("");const n=parseInt(h.slice(0,6),16);if(h.length>=6&&!isNaN(n))return[(n>>16&255)/255,(n>>8&255)/255,(n&255)/255];return fallback;}const m=s.match(/rgba?\(([^)]+)\)/);if(m){const p=m[1].split(/[\s,/]+/).filter(Boolean).map(parseFloat);if(p.length>=3&&!isNaN(p[0])&&!isNaN(p[1])&&!isNaN(p[2]))return[p[0]/255,p[1]/255,p[2]/255];}return fallback;}const mix3=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t];function mulberry32(a){return()=>{a|=0;a=a+1831565813|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}// ── terrain: one height function, written twice (GLSL and JS) ──
// Two ridges, authored as screen crest lines and solved back into heights
// for the camera at rest: a near ridge that peaks on the left, dips into a
// valley and climbs again on the right, and a far ridge that shows through
// the valley. Each is a rounded dome across depth.
const RN=48;const RU0=-.35;const RU1=1.35;// u (frame share across), crest y (frame share down), distance
const FALL_A=[6.5,3];const FALL_B=[6.5,3];const FLOOR=-1.6;const SHOULDER=[1.1,1.2];const SHOULDER_SWELL=.6;function catmull(pts,col,u){const n=pts.length;const x=clamp(u,pts[0][0],pts[n-1][0]);let i=0;while(i<n-2&&x>pts[i+1][0])i++;const p0=pts[Math.max(i-1,0)][col],p1=pts[i][col],p2=pts[i+1][col],p3=pts[Math.min(i+2,n-1)][col];const t=(x-pts[i][0])/(pts[i+1][0]-pts[i][0]);return .5*(2*p1+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t*t+(-p0+3*p1-3*p2+p3)*t*t*t);}/** Per column: (height A, distance A, height B, distance B). */function buildRidges(ridgeA,ridgeB){const c=Math.cos(PITCH),s=Math.sin(PITCH);const out=new Float32Array(RN*4);for(let i=0;i<RN;i++){const u=RU0+(RU1-RU0)*i/(RN-1);[ridgeA,ridgeB].forEach((r,j)=>{const y=catmull(r,1,u);const z=catmull(r,2,u);const k=(1-2*y)*TAN_V;out[i*4+j*2]=CAM_H+z*(k*c-s)/(c+k*s);out[i*4+j*2+1]=z;});}return out;}const RIDGE_SETS=THEMES.map(t=>buildRidges(t.ridgeA,t.ridgeB));let RIDGES=RIDGE_SETS[0]// the active scene's ridges, set once per frame
;const TERRAIN_GLSL=`
uniform vec4 u_cam;   // camX, camY, cos pitch, sin pitch
uniform vec4 u_proj;  // tanH, tanV, A, B
uniform vec4 u_wave;  // 1/scale, amp, k, phase
uniform float u_off;  // downward shift of the whole landscape, in clip units
uniform vec4 u_th;    // shoulder centre, scene mode (0 aurora, 1 dunes)
uniform vec4 u_r[${RN}];
vec4 cr(vec4 p0, vec4 p1, vec4 p2, vec4 p3, float t){
  return 0.5 * (2.0 * p1 + (-p0 + p2) * t + (2.0 * p0 - 5.0 * p1 + 4.0 * p2 - p3) * t * t + (-p0 + 3.0 * p1 - 3.0 * p2 + p3) * t * t * t);
}
vec4 ridgeAt(float u){
  float f = clamp((u - ${RU0.toFixed(3)}) / ${(RU1-RU0).toFixed(3)}, 0.0, 1.0) * ${(RN-1).toFixed(1)};
  int i = int(min(floor(f), ${(RN-2).toFixed(1)}));
  float t = f - float(i);
  return cr(u_r[max(i - 1, 0)], u_r[i], u_r[i + 1], u_r[min(i + 2, ${RN-1})], t);
}
float dome(float t, float wf, float wb){
  if (t < 0.0) { float f = clamp(-t / wf, 0.0, 1.0); float g = 1.0 - f * f; return g * g; }
  float f = clamp(t / wb, 0.0, 1.0);
  return 1.0 - f * f * (3.0 - 2.0 * f);
}
float smax(float a, float b, float k){
  float h = max(k - abs(a - b), 0.0) / k;
  return max(a, b) + h * h * k * 0.25;
}
float shoulderA(float u){
  float k = (u - u_th.x) / 0.2;
  return ${SHOULDER[0].toFixed(2)} + ${SHOULDER_SWELL.toFixed(2)} * exp(-k * k);
}
float ridgeLit(vec4 r, float which){
  return which < 0.5 ? smoothstep(1.35, 2.05, r.x - ${FLOOR.toFixed(2)}) : smoothstep(0.4, 1.2, r.z - ${FLOOR.toFixed(2)});
}
float baseH(float x, float d, out float crest, out float owner){
  float u = 0.5 + (x / (${TAN_H.toFixed(3)} * max(d, 0.5))) * 0.5;
  vec4 r = ridgeAt(0.5 + (u - 0.5) * u_wave.x);
  float ca = dome(d - r.y, ${FALL_A[0].toFixed(2)}, ${FALL_A[1].toFixed(2)});
  float cb = dome(d - r.w, ${FALL_B[0].toFixed(2)}, ${FALL_B[1].toFixed(2)});
  float a = (r.x - ${FLOOR.toFixed(2)}) * ca;
  float b = (r.z - ${FLOOR.toFixed(2)}) * cb;
  float ta = d - r.y, tb = d - r.w;
  float sa = 1.0 - smoothstep(0.0, ta < 0.0 ? shoulderA(0.5 + (u - 0.5) * u_wave.x) : ${FALL_A[1].toFixed(2)}, abs(ta));
  float sb = 1.0 - smoothstep(0.0, tb < 0.0 ? ${SHOULDER[1].toFixed(2)} : ${FALL_B[1].toFixed(2)}, abs(tb));
  owner = a > b ? 0.0 : 1.0;
  crest = a > b ? sa * ridgeLit(r, 0.0) : sb * ridgeLit(r, 1.0);
  float cliff = smoothstep(r.w + ${FALL_B[1].toFixed(2)}, r.w + ${(FALL_B[1]+4).toFixed(2)}, d);
  return ${FLOOR.toFixed(2)} + smax(a, b, 0.35) - cliff * 40.0;
}
float sheetEnd(float x, float d){
  float u = 0.5 + (x / (${TAN_H.toFixed(3)} * max(d, 0.5))) * 0.5;
  vec4 r = ridgeAt(0.5 + (u - 0.5) * u_wave.x);
  return step(r.w + ${FALL_B[1].toFixed(2)}, d);
}
float terrH(float x, float d, out float crest, out float owner){
  float e = smoothstep(3.0, 8.0, d);
  float a = u_wave.z * (x + 0.35 * d);
  float w = sin(a - u_wave.w) - sin(a)
          + 0.6 * (sin(1.86 * a + 2.0 * u_wave.w + 1.3) - sin(1.86 * a + 1.3));
  return baseH(x, d, crest, owner) + u_wave.y * e * w;
}
float terrH(float x, float d){ float c, o; return terrH(x, d, c, o); }
vec3 viewOf(vec3 P){
  vec3 r = P - vec3(u_cam.x, u_cam.y, 0.0);
  float depth = -r.y * u_cam.w - r.z * u_cam.z;
  float yv = r.y * u_cam.z - r.z * u_cam.w;
  return vec3(r.x, yv, depth);
}
vec4 clipOf(vec3 v){
  return vec4(v.x / u_proj.x, v.y / u_proj.y, u_proj.z * v.z + u_proj.w, v.z);
}
vec3 normalAt(float x, float d){
  float e = 0.05;
  float hx = (terrH(x + e, d) - terrH(x - e, d)) / (2.0 * e);
  float hd = (terrH(x, d + e) - terrH(x, d - e)) / (2.0 * e);
  return normalize(vec3(-hx, 1.0, hd));
}`;function ridgeAt(u,out){const f=clamp((u-RU0)/(RU1-RU0),0,1)*(RN-1);const i=Math.min(Math.floor(f),RN-2);const t=f-i;const i0=Math.max(i-1,0),i3=Math.min(i+2,RN-1);for(let q=0;q<4;q++){const p0=RIDGES[i0*4+q],p1=RIDGES[i*4+q],p2=RIDGES[(i+1)*4+q],p3=RIDGES[i3*4+q];out[q]=.5*(2*p1+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t*t+(-p0+3*p1-3*p2+p3)*t*t*t);}return out;}const dome=(t,wf,wb)=>{if(t<0){const f=clamp(-t/wf,0,1);const g=1-f*f;return g*g;}const f=clamp(t/wb,0,1);return 1-f*f*(3-2*f);};const smax=(a,b,k)=>{const h=Math.max(k-Math.abs(a-b),0)/k;return Math.max(a,b)+h*h*k*.25;};const R4=[0,0,0,0];function baseH(x,d,w){const u=.5+x/(TAN_H*Math.max(d,.5))*.5;const r=ridgeAt(.5+(u-.5)*w.si,R4);const a=(r[0]-FLOOR)*dome(d-r[1],FALL_A[0],FALL_A[1]);const b=(r[2]-FLOOR)*dome(d-r[3],FALL_B[0],FALL_B[1]);const cliff=smooth(r[3]+FALL_B[1],r[3]+FALL_B[1]+4,d);return FLOOR+smax(a,b,.35)-cliff*40;}function terrH(x,d,w){const e=smooth(3,8,d);const a=w.k*(x+.35*d);const wv=Math.sin(a-w.ph)-Math.sin(a)+.6*(Math.sin(1.86*a+2*w.ph+1.3)-Math.sin(1.86*a+1.3));return baseH(x,d,w)+w.amp*e*wv;}/** Screen fraction (0 top, 1 bottom) of the topmost terrain in one column. */function crestYAt(fx,w,camX,camY,c,s){const ndcX=fx*2-1;let best=-Infinity;for(let d=3;d<70;d+=.2){const x=camX+ndcX*TAN_H*d;const ry=terrH(x,d,w)-camY;const depth=-ry*s+d*c;const yv=ry*c+d*s;const ny=yv/depth/TAN_V;if(ny>best)best=ny;}return .5-best*.5;}// ── static geometry ──
function buildPoints(seed){const rnd=mulberry32(seed*9973+1);const d=new Float32Array(MAX_PTS*4);let i=0;const put=(a,b,c,e)=>{const o=i++*4;d[o]=a;d[o+1]=b;d[o+2]=c;d[o+3]=e;};const rows=ROWS_FRONT+ROWS_BACK+1;const share=[.4,.6];for(let ridge=0;ridge<2;ridge++){const per=Math.floor(RIDGE_PTS*share[ridge]/rows);for(let k=-ROWS_FRONT;k<=ROWS_BACK;k++){const off=rnd();for(let n=0;n<per;n++){put(-.32+1.64*(n+off+(rnd()-.5)*.5)/per,(k+(rnd()-.5)*.22)*ROW_DT,rnd(),ridge);}}}while(i<MAX_PTS){const z=PT_D0+(PT_D1-PT_D0)*Math.sqrt(rnd());put((rnd()*2-1)*z*TAN_H*1.25,z,rnd(),2);}// Shuffle, so Density thins every row evenly.
for(let a=MAX_PTS-1;a>0;a--){const b=Math.floor(rnd()*(a+1));for(let q=0;q<4;q++){const t=d[a*4+q];d[a*4+q]=d[b*4+q];d[b*4+q]=t;}}return d;}function buildHillFlowers(seed){const rnd=mulberry32(seed*6151+5);const d=new Float32Array(MAX_HF*4);const streaks=[];for(let i=0;i<160;i++){const z=3.5+(30-3.5)*Math.sqrt(rnd());streaks.push([(rnd()*2-1)*z*TAN_H*1.2,z,.6+2.2*rnd(),(rnd()-.5)*.5]);}for(let i=0;i<MAX_HF;i++){let x,z;if(rnd()<.65){const s=streaks[Math.floor(rnd()*streaks.length)];const t=(rnd()-.5)*s[2];x=s[0]+t+(rnd()-.5)*.25;z=s[1]+t*s[3]+(rnd()-.5)*.25;}else{z=3.5+(34-3.5)*Math.sqrt(rnd());x=(rnd()*2-1)*z*TAN_H*1.25;}const o=i*4;d[o]=x;d[o+1]=z;d[o+2]=rnd();d[o+3]=rnd();}return d;}function buildMesh(){const v=new Float32Array((MESH_C+1)*(MESH_R+1)*2);let o=0;for(let j=0;j<=MESH_R;j++){const d=D0*Math.pow(D1/D0,j/MESH_R);for(let i=0;i<=MESH_C;i++){v[o++]=i/MESH_C*2-1;v[o++]=d;}}const idx=new Uint32Array(MESH_C*MESH_R*6);o=0;for(let j=0;j<MESH_R;j++){for(let i=0;i<MESH_C;i++){const a=j*(MESH_C+1)+i;const b=a+1;const c=a+MESH_C+1;const e=c+1;idx[o++]=a;idx[o++]=c;idx[o++]=b;idx[o++]=b;idx[o++]=c;idx[o++]=e;}}return{v,idx};}const item=p=>({kind:0,x:0,y:0,d:0,key:0,f:0,tilt:1,rot:0,n:0,blur:0,ph:0,tint:[1,1,1],col:[1,1,1],alpha:1,h:0,w:0,ang:0,near:0,ox:0,oy:0,...p});function buildMeadow(seed,mid,bokeh,grass,T){const rnd=mulberry32(seed*7919+13);const items=[];for(const[x,y,d,warm,light]of T.plants){const tilt=.6+.22*rnd();const rot=rnd()*TAU;const ph=(rnd()-.5)*.9;items.push(item({kind:0,x,y,d:d*1.3,key:y+.08,tilt,rot,n:([9,15,5,10][T.mode]||9)+Math.floor(rnd()*([5,6,3,4][T.mode]||5)),blur:.04+d*1.3,ph,tint:T.tint(light,warm)}));}const pushBokeh=(x,y,d,col,alpha)=>items.push(item({kind:2,x,y,d,col,alpha,ph:rnd()*TAU,key:y}));const drifts=[];for(let i=0;i<12;i++)drifts.push([rnd(),.56+.15*rnd()]);for(let i=0;i<8;i++){const x=.55+.06*i;drifts.push([x,.66+.02*Math.sin(x*7)]);}for(let i=0;i<mid;i++){let x,y;if(rnd()<.7){const c=drifts[Math.floor(rnd()*drifts.length)];x=c[0]+(rnd()-.5)*.16;y=c[1]+(rnd()-.5)*.035;}else{x=-.03+1.06*rnd();y=.54+.24*rnd();}const f=clamp((y-.53)/.27,0,1);const br=.62+.45*f;const warm=rnd()<.2;const d=(.018+.045*f)*(.7+.6*rnd());items.push(item({kind:1,x,y,f,key:y,d,tilt:.42+.3*rnd(),rot:rnd()*TAU,n:([6,10,5,8][T.mode]||6)+Math.floor(rnd()*([4,5,3,4][T.mode]||4)),blur:.06+.07*f+.04*rnd(),ph:rnd()*TAU,tint:T.midTint(br,warm),alpha:.65+.35*f}));if(bokeh>0&&rnd()<.7){const g=parseColor(T.glints[Math.floor(rnd()*T.glints.length)]);pushBokeh(x+(rnd()-.5)*d*.6,y-d*.25,d*(.14+.12*rnd()),g,1.1+.9*rnd());}}for(let i=0;i<bokeh;i++){const y=rnd()<.7?.6+.16*rnd():.55+.42*Math.pow(rnd(),1.3);pushBokeh(rnd(),y,.004+.012*rnd()*rnd(),parseColor(T.bokeh[Math.floor(rnd()*T.bokeh.length)]),.7+.9*rnd());}for(let i=0;i<bokeh*4;i++){const y=.6+.2*Math.pow(rnd(),1.6);const hue=.18+.4*rnd();const col=T.mode===3?mix3([.25,.65,1],[1,.95,.4],(hue-.18)/.4):T.mode===2?mix3([.7,1,.3],[1,.9,.4],(hue-.18)/.4):T.mode?mix3([1,.2,.05],[1,.85,.4],(hue-.18)/.4):[0,.33,.67].map(o=>.55+.45*Math.cos(TAU*(hue+o)));pushBokeh(rnd(),y,.004+.005*rnd()*(y-.55)*8,col,.9+1.3*rnd());}if(bokeh>0){pushBokeh(.12,.87,.016,parseColor(T.bokeh[2]),.9);pushBokeh(.7,.9,.014,parseColor(T.bokeh[0]),.8);}for(let i=0;i<grass;i++){const y=rnd()<.6?.58+.2*rnd():.54+.48*Math.pow(rnd(),.8);const f=clamp((y-.54)/.48,0,1);const h=(.018+.075*f)*(.6+.8*rnd());const m=rnd();items.push(item({kind:3,x:rnd(),y,f,key:y,h,w:h*(.07+.06*rnd()),ang:(rnd()-.5)*.7,ph:rnd()*TAU,col:mix3(T.grass[0],T.grass[1],m*(1-.85*f)),alpha:.85*(1-.8*f)}));}items.sort((a,b)=>a.key-b.key);return items;}/** A head's tilt rides in the alpha slot's integer part: 0.62 -> 62.xxx. */const packTilt=(tilt,alpha)=>Math.floor(clamp(tilt,.05,1)*100)+clamp(alpha,0,1)*.999;/** How much a spike's quad must grow so its defocused edge isn't clipped. */const grow=bl=>clamp(.85+bl*1.1,1,1.9);function pushSprite(b,i,W,H,cx,cy,hx,hy,ang,type,q0,q1,q2,q3,r,g,bl,a){if(i>=MAX_SPRITES)return i;const c=Math.cos(ang),s=Math.sin(ang);let o=i*6*SPR_STRIDE;for(let k=0;k<6;k++){const lx=CORNERS[k*2],ly=CORNERS[k*2+1];b[o++]=(cx+lx*hx*c-ly*hy*s)/W;b[o++]=(cy+lx*hx*s+ly*hy*c)/H;b[o++]=lx;b[o++]=ly;b[o++]=type;b[o++]=q0;b[o++]=q1;b[o++]=q2;b[o++]=q3;b[o++]=r;b[o++]=g;b[o++]=bl;b[o++]=a;}return i+1;}// ── shaders ──
const FS_VS=`#version 300 es
in vec2 a_p;
out vec2 v_uv;
void main(){ v_uv = a_p * 0.5 + 0.5; gl_Position = vec4(a_p, 0.0, 1.0); }`;const SKY_FS=`#version 300 es
precision highp float;
uniform vec2 u_res;
uniform vec3 u_top, u_mid, u_hor, u_gc;
uniform vec4 u_g;   // glow x, glow y (0 top), strength, aspect
uniform float u_ph; // loop phase, 0..2pi
uniform float u_drop; // landscape drop, share of frame height
uniform float u_theme; // 0 aurora, 1 dusk, 2 mountain, 3 morning
out vec4 o;
void main(){
  vec2 f = gl_FragCoord.xy / max(u_res, vec2(1.0));
  float ys = 1.0 - f.y;
  float y = ys - u_drop;   // sky bands sit lower with the landscape

  if (u_theme > 2.5) {
    // ══════════════════════════════════════════════════════════════════
    // MORNING SKY: Morning blue sky with moving procedural clouds & sun
    // ══════════════════════════════════════════════════════════════════
    vec3 c = mix(u_top, u_mid, smoothstep(0.0, 0.30, y));
    c = mix(c, u_hor, smoothstep(0.18, 0.48, y));

    // Radiant Morning Sun
    vec2 sunPos = vec2(u_g.x, u_g.y - 0.04);
    vec2 sp = vec2((f.x - sunPos.x) * u_g.w, ys - sunPos.y);
    float sd = length(sp);

    float sunDisc = smoothstep(0.044, 0.034, sd);
    float sunCorona = exp(-sd * sd / 0.016) * 1.5;
    float sunHaze = exp(-sd * sd / 0.15) * 0.45;
    float rayAngle = atan(sp.y, sp.x);
    float rays = 0.88 + 0.12 * sin(rayAngle * 10.0 + u_ph * 0.4);

    vec3 sunLight = vec3(1.0, 0.98, 0.92) * sunDisc * 2.5 +
                    vec3(1.0, 0.92, 0.72) * sunCorona * rays +
                    vec3(1.0, 0.94, 0.82) * sunHaze;
    c += sunLight;

    // Moving Procedural Cumulus Clouds (drifting across the sky with time)
    float cloudDrift = u_ph * 0.28;
    vec2 cuv1 = vec2(f.x * 3.4 + cloudDrift * 0.12, (ys - u_drop * 0.4) * 4.4);
    vec2 cuv2 = vec2(f.x * 7.0 + cloudDrift * 0.20, (ys - u_drop * 0.4) * 8.8);
    vec2 cuv3 = vec2(f.x * 14.5 + cloudDrift * 0.28, (ys - u_drop * 0.4) * 17.6);

    float n1 = 0.5 + 0.5 * sin(cuv1.x * 2.4 + sin(cuv1.y * 3.0 + cuv1.x * 1.2));
    float n2 = 0.5 + 0.5 * sin(cuv2.x * 2.6 - sin(cuv2.y * 2.4));
    float n3 = 0.5 + 0.5 * sin(cuv3.x * 3.0 + cuv3.y * 2.2);

    float cDense = n1 * 0.55 + n2 * 0.32 + n3 * 0.13;
    float cShape = smoothstep(0.44, 0.78, cDense);

    // Limit clouds to sky area above the rolling hills
    float skyMask = smoothstep(0.04, 0.28, y) * smoothstep(0.92, 0.38, ys);
    float finalAlpha = cShape * skyMask * 0.86;

    // Cloud shading: brilliant sunlit white on top, soft airy light-blue in shade
    vec3 cloudLit = vec3(1.0, 1.0, 1.0);
    vec3 cloudShade = vec3(0.78, 0.88, 0.98);
    vec3 cloudColor = mix(cloudShade, cloudLit, smoothstep(0.46, 0.76, cDense));

    // Sun rim warmth on clouds near the rising sun
    float nearSun = clamp(1.0 - sd * 1.5, 0.0, 1.0);
    cloudColor += vec3(0.22, 0.18, 0.08) * nearSun;

    c = mix(c, cloudColor, finalAlpha);

    o = vec4(c, 1.0);
    return;
  }

  vec3 c = mix(u_top, u_mid, smoothstep(0.0, 0.22, y));
  c = mix(c, u_hor, smoothstep(0.14, 0.36, y));
  // Towards the light the sky warms, evenly across the frame.
  float side = clamp(0.65 + (f.x - u_g.x), 0.0, 1.3) * (1.0 - 0.4 * smoothstep(0.1, 0.36, y));
  c *= mix(vec3(1.0), mix(mix(vec3(1.05, 1.35, 1.25), vec3(1.3, 1.1, 0.95), step(0.5, u_theme)), vec3(0.95, 1.1, 1.3), step(1.5, u_theme)), side);
  vec2 d = vec2((f.x - u_g.x) * u_g.w, (ys - u_g.y) * 1.8);
  c += u_gc * u_g.z * exp(-dot(d, d) / 0.05) * 0.35;
  // Aurora: a slow curtain with vertical folds and fine rays. Integer
  // multipliers on the phase keep the motion looping.
  float xa = f.x * 6.2831853;
  float wob = 0.6 * sin(xa * 2.0 + u_ph) + 0.4 * sin(xa * 3.0 - u_ph * 2.0);
  float cy = 0.2 + 0.06 * wob;
  float vert = exp(-pow((y - cy) / 0.11, 2.0));
  float fold = 0.5 + 0.5 * sin(xa * 5.0 + 2.5 * sin(xa * 2.0 + u_ph) + u_ph);
  float rays = 0.65 + 0.35 * sin(f.x * 140.0 + 6.0 * sin(f.x * 9.0));
  vec3 aur = mix(vec3(0.2, 1.0, 0.65), vec3(0.6, 0.35, 1.0), smoothstep(cy - 0.02, cy - 0.14, y));
  c += aur * vert * (0.2 + 0.8 * fold * fold) * rays * 0.4 * (1.0 - min(u_theme, 1.0));
  // Dusk: a low sun setting behind the far crest, and a few stars high up.
  if (u_theme > 0.5) {
    if (u_theme < 1.5) {
      vec2 sp = vec2((f.x - u_g.x) * u_g.w, ys - (u_g.y - 0.05));
      float sd = length(sp);
      c += u_gc * (smoothstep(0.05, 0.04, sd) * 2.4 + exp(-sd * sd / 0.03) * 0.55);
    } else {
      // a moon high over the range, with a soft halo
      vec2 mp = vec2((f.x - u_g.x) * u_g.w, ys - (0.1 + u_drop));
      float md = length(mp);
      float shade = 0.85 + 0.15 * sin(mp.x * 60.0) * sin(mp.y * 45.0 + 1.0);
      c += vec3(0.86, 0.92, 1.0) * (smoothstep(0.046, 0.042, md) * shade * 1.6 + exp(-md * md / 0.012) * 0.35 + exp(-md * md / 0.12) * 0.12);
    }
    vec2 g = gl_FragCoord.xy / (u_res.y * 0.011);
    vec2 gi = floor(g);
    float hs = fract(sin(dot(gi, vec2(127.1, 311.7))) * 43758.5453);
    float star = step(0.985, hs) * smoothstep(0.24, 0.0, length(fract(g) - 0.5)) * (1.0 - smoothstep(0.0, 0.5, ys));
    star *= 1.0 - smoothstep(0.1, 0.5, dot(c, vec3(0.333)));
    c += vec3(1.0, 0.95, 0.85) * star * 1.4;
  }
  o = vec4(c, 1.0);
}`;const TERRAIN_VS=`#version 300 es
precision highp float;
in vec2 a_m;  // frame share across (-1..1), distance
${TERRAIN_GLSL}
uniform vec4 u_fog;   // fog rgb, fog distance
uniform vec3 u_shadow, u_ground, u_rim, u_sky, u_sheen;
out vec3 v_col;
void main(){
  float d = a_m.y;
  float x = u_cam.x + a_m.x * ${MESH_S.toFixed(2)} * d * u_proj.x;
  float crest, owner;
  float H = terrH(x, d, crest, owner);
  vec3 P = vec3(x, H, -d);
  vec3 v = viewOf(P);
  gl_Position = clipOf(v);
  vec3 N = normalAt(x, d);
  vec3 V = normalize(vec3(u_cam.x, u_cam.y, 0.0) - P);
  float facing = clamp(dot(N, V), 0.0, 1.0);
  vec3 c = mix(u_shadow * 1.15 + u_rim * 0.06, u_shadow * 0.72, smoothstep(0.02, 0.3, facing));
  c = mix(u_ground, c, smoothstep(3.0, 6.5, d));
  c += u_sheen * pow(crest, 1.6);
  float sy = 0.5 - 0.5 * gl_Position.y / gl_Position.w;
  c = mix(c, u_ground, smoothstep(0.58, 0.8, sy) * 0.92);
  float fog = 1.0 - exp(-max(d - 8.0, 0.0) / u_fog.w);
  c = mix(c, u_fog.rgb, fog);
  v_col = mix(c, u_sky, smoothstep(18.0, 40.0, d));
  gl_Position.y -= u_off * gl_Position.w;
}`;const TERRAIN_FS=`#version 300 es
precision highp float;
in vec3 v_col;
out vec4 o;
void main(){ o = vec4(v_col, 1.0); }`;const GLITTER_VS=`#version 300 es
precision highp float;
in vec4 a_d;   // ridge rows: (u, offset from crest, seed, ridge 0|1); scatter: (x, distance, seed, 2)
${TERRAIN_GLSL}
uniform vec4 u_px;     // half height px, point scale, max size, min size
uniform vec4 u_light;  // crest, slope, flash, twinkle sharpness
uniform vec4 u_tw;     // twinkle period, iridescent share, glint share, time
uniform vec4 u_hot;    // hot ndc x, hot ndc y, hot strength, glint size
uniform vec4 u_sun;    // direction towards the light, glint cycle
uniform vec4 u_fog;
uniform vec3 u_crest, u_slope, u_deep;
out vec3 v_col;
out float v_kind;
out float v_soft;
float h(float n){ return fract(sin(n) * 43758.5453123); }
// thin-film rainbow: red, magenta, blue, cyan, green, yellow as t rises
vec3 film(float t){ return 0.5 + 0.5 * cos(6.2831853 * (t + vec3(0.0, 0.33, 0.67))); }
// frost: icy blue to white
vec3 frost(float t){ return mix(vec3(0.35, 0.6, 1.0), vec3(0.95, 0.98, 1.0), t); }
// glowing embers: deep red, through orange, to pale gold as t rises
vec3 ember(float t){ return mix(mix(vec3(0.9, 0.1, 0.05), vec3(1.0, 0.45, 0.08), smoothstep(0.0, 0.5, t)), vec3(1.0, 0.85, 0.35), smoothstep(0.5, 1.0, t)); }
void main(){
  float x = a_d.x, d = a_d.y, s = a_d.z;
  bool row = a_d.w < 1.5;
  float prof = 0.0;
  float sh = a_d.w < 0.5 ? shoulderA(a_d.x) : ${SHOULDER[1].toFixed(2)};
  if (row) {
    vec4 r = ridgeAt(a_d.x);
    d = (a_d.w < 0.5 ? r.y : r.w) + a_d.y;
    x = (a_d.x - 0.5) / u_wave.x * 2.0 * ${TAN_H.toFixed(3)} * d;
    float t = a_d.y;
    prof = t < 0.0 ? exp(-pow(-t / sh, 4.0)) : 0.55 * exp(-pow(t / 0.35, 2.0));
    prof *= 0.55 + 0.45 * h(floor(t / ${ROW_DT.toFixed(3)} + 0.5) * 7.31 + a_d.w * 3.7);
    prof *= clamp(d / 7.0, 1.0, 1.45) * ridgeLit(r, a_d.w);
  }
  float crest, owner;
  float H = terrH(x, d, crest, owner);
  vec3 P = vec3(x, H + 0.03, -d);
  vec3 v = viewOf(P);
  gl_Position = clipOf(v);
  vec3 N = normalAt(x, d);
  vec3 V = normalize(vec3(u_cam.x, u_cam.y, 0.0) - P);
  float facing = dot(N, V);
  float graze = 1.0 - clamp(facing, 0.0, 1.0);
  float h1 = h(s * 91.7 + 1.3), h2 = h(s * 47.3 + 7.1), h3 = h(s * 13.9 + 3.7);
  float h4 = h(s * 71.1 + 5.3), h5 = h(s * 29.3 + 9.9), h6 = h(s * 53.7 + 2.2);

  float rim = smoothstep(0.42, 0.03, facing);
  float back = clamp(dot(N, u_sun.xyz) * 0.5 + 0.6, 0.0, 1.0);
  float hills = smoothstep(2.5, 7.0, d);
  float top = row ? prof * prof * prof * 8.0 * (0.3 + 2.4 * h2 * h2 * h2) : crest * crest * 0.2;
  float I = u_light.x * (top + 0.06 * rim * rim) * back * (0.3 + 0.7 * hills)
          + u_light.y * (0.01 + 0.07 * pow(h2, 4.0)) * (0.35 + 0.65 * hills);
  rim = max(rim, top);
  vec2 ndc = gl_Position.xy / gl_Position.w;
  vec2 dh = (ndc - u_hot.xy) * vec2(3.4, 8.0);
  I *= 1.0 + u_hot.z * 1.6 * exp(-dot(dh, dh)) * (0.3 + rim);

  float ph = 6.2831853 * (u_tw.w / u_tw.x + h5);
  float fl = pow(0.5 + 0.5 * sin(ph), u_light.w);
  I *= 0.6 + u_light.z * fl;

  // Iridescence: warm gold on the crest, turning blue and violet down the
  // ribbon, every dot a little off its neighbours; about one in five cool.
  float bpos = row ? clamp(-a_d.y / sh, -0.4, 1.6) : 1.0 + h3;
  float hue = 0.2 + bpos * 0.2 + (h1 - 0.5) * 0.2 + (h5 < 0.22 ? 0.4 : 0.0);
  vec3 iri = u_th.y > 1.5
    ? mix(frost(clamp(1.0 - bpos * 0.5 + (h1 - 0.5) * 0.6, 0.0, 1.0)), vec3(0.7, 0.55, 1.0), h5 < 0.22 ? 0.55 : 0.0)
    : u_th.y > 0.5
    ? mix(ember(clamp(1.0 - bpos * 0.55 + (h1 - 0.5) * 0.55, 0.0, 1.0)), vec3(1.0), 0.1)
    : mix(film(hue + 0.03 * sin(ph)), vec3(1.0), 0.16);
  vec3 col = mix(u_crest, mix(u_slope, u_deep, h3), smoothstep(0.25, 0.0, rim) * 0.85);
  col = h4 < u_tw.y ? iri : mix(col, iri, 0.55);
  if (h4 < u_tw.y) I = min(I, 1.6);
  float fog = 1.0 - exp(-max(d - 8.0, 0.0) / u_fog.w);
  col = mix(col, u_fog.rgb * 1.6, fog * 0.5);
  I *= 1.0 - 0.35 * fog;

  float px = u_px.y * u_px.x / (max(v.z, 0.1) * u_proj.y) * (0.7 + 0.6 * h1);
  float blur = smoothstep(4.5, 2.0, d);
  px *= 1.0 + 1.5 * blur;
  v_soft = blur;
  float sz = clamp(px, u_px.w, u_px.z);
  I *= min(1.0, (px * px) / (sz * sz)) / (1.0 + 3.0 * blur);

  I *= 1.0 - smoothstep(0.6, 0.8, 0.5 - 0.5 * ndc.y);
  v_kind = 0.0;
  if (h6 < u_tw.z) {
    float cyc = fract(u_tw.w / u_sun.w + h3);
    float a = pow(sin(3.14159265 * cyc), 3.0);
    float lit = smoothstep(0.25, 0.6, rim) * (1.0 - fog);
    v_kind = 1.0;
    I = a * lit * 2.2;
    sz = clamp(u_px.x * 0.05 * u_hot.w * (0.6 + 0.4 * h2) * a, 0.0, u_px.z);
    if (lit * a < 0.02) sz = 0.0;
    col = mix(u_crest, vec3(1.0), 0.5);
  }
  v_col = col * I;
  gl_Position.y -= u_off * gl_Position.w;
  bool hide = sheetEnd(x, d) > 0.5 || d < 1.0 || (row && abs(owner - a_d.w) > 0.5);
  gl_PointSize = hide ? 0.0 : sz;
}`;const GLITTER_FS=`#version 300 es
precision highp float;
in vec3 v_col;
in float v_kind;
in float v_soft;
out vec4 o;
void main(){
  vec2 q = gl_PointCoord * 2.0 - 1.0;
  float d = dot(q, q);
  if (v_kind > 0.5) {
    float r = sqrt(d);
    float rays = exp(-abs(q.y) * 28.0) * max(1.0 - abs(q.x), 0.0)
               + exp(-abs(q.x) * 28.0) * max(1.0 - abs(q.y), 0.0);
    float core = exp(-d * 30.0);
    o = vec4(v_col * (core * 1.5 + rays * 0.8 + exp(-r * 6.0) * 0.15), 0.0);
    return;
  }
  if (d > 1.0) discard;
  float core = exp(-d * 6.0);
  float disc = 1.0 - smoothstep(0.55, 1.0, d);
  float rimB = smoothstep(0.35, 0.9, d) * disc;
  float val = mix(core * 0.9 + disc * 0.3, disc * 0.55 + rimB * 0.45, v_soft);
  o = vec4(v_col * val, 0.0);
}`;const FLOWER_VS=`#version 300 es
precision highp float;
in vec4 a_d;
${TERRAIN_GLSL}
uniform vec4 u_px;    // half height px, flower scale, max size, sway phase
uniform vec4 u_fog;
uniform vec3 u_petal, u_tip, u_core, u_deep;
out vec3 v_col;
out vec3 v_rim;
out vec3 v_core;
out float v_asp;
out float v_a;
out float v_seed;
void main(){
  float x = a_d.x, d = a_d.y;
  v_seed = fract(a_d.z * 7.13 + a_d.w * 3.71);
  float H = terrH(x, d);
  vec3 P = vec3(x, H + 0.05, -d);
  vec3 v = viewOf(P);
  gl_Position = clipOf(v);
  vec3 N = normalAt(x, d);
  vec3 V = normalize(vec3(u_cam.x, u_cam.y, 0.0) - P);
  float facing = clamp(dot(N, V), 0.0, 1.0);
  v_asp = clamp(facing * 0.75, 0.25, 0.5);
  float px = u_px.y * u_px.x * 0.075 / (max(v.z, 0.1) * u_proj.y) * (0.6 + 0.8 * a_d.z);
  float sz = clamp(px, 0.0, u_px.z);
  float fog = 1.0 - exp(-max(d - 8.0, 0.0) / u_fog.w);
  float hills = smoothstep(3.0, 7.0, d);
  vec3 c = mix(u_deep, u_petal, a_d.w * a_d.w) * (0.6 + 0.4 * (1.0 - facing));
  v_col = mix(c, u_fog.rgb * 0.8, fog);
  v_rim = u_tip * 0.5 * (1.0 - fog);
  v_core = u_core * 0.25 * (1.0 - fog);
  v_a = hills * (1.0 - fog * 0.9) * min(1.0, px / 2.0);
  gl_Position.y -= u_off * gl_Position.w;
  gl_PointSize = sz < 1.5 || sheetEnd(x, d) > 0.5 ? 0.0 : sz;
}`;const FLOWER_FS=`#version 300 es
precision highp float;
in vec3 v_col;
in vec3 v_rim;
in vec3 v_core;
in float v_asp;
in float v_a;
in float v_seed;
out vec4 o;
float hsh(float n){ return fract(sin(n) * 43758.5453123); }
void main(){
  vec2 q = gl_PointCoord * 2.0 - 1.0;
  q.y /= v_asp;
  float r = length(q);
  if (r > 1.0) discard;
  float m = 1.0 - smoothstep(0.35, 1.0, r);
  float centre = 1.0 - smoothstep(0.0, 0.4, r);
  if (m < 0.01) discard;
  float top = smoothstep(0.0, -0.9, q.y * v_asp) * smoothstep(0.25, 0.9, r);
  vec3 c = v_col * (0.8 + 0.3 * r) + v_rim * top;
  c = mix(c, v_core * 2.4, centre);
  if (v_seed < 0.4) {
    vec2 g = vec2(hsh(v_seed * 91.0) - 0.5, hsh(v_seed * 47.0) - 0.7) * 1.2;
    float s = exp(-dot(q - g, q - g) * 30.0);
    vec3 hue = 0.5 + 0.5 * cos(6.2831853 * (hsh(v_seed * 13.0) + vec3(0.0, 0.33, 0.67)));
    c += mix(hue, vec3(1.0), 0.35) * s * 1.6;
  }
  float al = m * v_a;
  o = vec4(c * al, al * 0.9);
}`;const SPRITE_VS=`#version 300 es
in vec2 a_p;
in vec2 a_uv;
in float a_type;
in vec4 a_q;
in vec4 a_c;
out vec2 v_uv;
out float v_type;
out vec4 v_q;
out vec4 v_c;
out vec2 v_scr;
void main(){
  v_uv = a_uv; v_type = a_type; v_q = a_q; v_c = a_c; v_scr = a_p;
  gl_Position = vec4(a_p.x * 2.0 - 1.0, 1.0 - a_p.y * 2.0, 0.0, 1.0);
}`;const SPRITE_FS=`#version 300 es
precision highp float;
in vec2 v_uv;
in float v_type;
in vec4 v_q;
in vec4 v_c;
in vec2 v_scr;
uniform vec3 u_petal, u_tip, u_core, u_mpetal, u_mrim, u_mcore;
uniform float u_fringe;
uniform float u_theme;
out vec4 o;
float hsh(float n){ return fract(sin(n) * 43758.5453123); }
const float ASP = ${SPIKE_ASP.toFixed(2)};
const float SY0 = -0.3;   // where the flower head starts, above the stem
const float SY1 = ${(SPIKE_ASP*.88).toFixed(2)};   // tip of the head
// One lavender spike: whorls of small buds that shrink towards the tip.
// x runs across the quad (-1..1), y is height in the same units.
// Returns coverage in .x, position along the head in .y (0 base, 1 tip),
// the bud's own shade in .z and how far up its bud this pixel sits in .w.
float leanX(float Y, float lean){
  float t = clamp((Y - SY0) / (SY1 - SY0), 0.0, 1.0);
  return lean * t * t;
}
vec4 spike(float x, float Y, float N, float seed, float bl, float th){
  float L = SY1 - SY0;
  float tt = (Y - SY0) / L;
  float k0 = floor(tt * N);
  float clear = 1.0;
  vec4 acc = vec4(0.0);
  for (int j = -2; j <= 1; j++) {
    float k = k0 + float(j);
    if (k < 0.0 || k >= N) continue;
    float rowT = (k + 0.5) / N;
    float cy = SY0 + rowT * L;
    float wdk = th > 0.5 ? 0.32 * smoothstep(0.0, 0.25, rowT) * (1.0 - 0.4 * rowT) + 0.05 : 0.5 * smoothstep(0.0, 0.2, rowT) * (1.0 - 0.6 * rowT * rowT) + 0.06;
    for (int s = 0; s < 2; s++) {
      float side = s == 0 ? -1.0 : 1.0;
      float h1 = hsh(k * 7.31 + side * 3.1 + seed), h2 = hsh(k * 3.17 + side * 5.3 + seed * 1.7);
      float bx = side * wdk * (0.4 + 0.45 * h1);
      float by = cy + (h2 - 0.5) * 0.14;
      float rb = (L / N) * (th > 0.5 ? 0.55 + 0.3 * h2 : 0.8 + 0.3 * h2) * (1.0 - 0.3 * rowT);
      vec2 dv = vec2(x - bx, (Y - by) * 0.85);
      float m = 1.0 - smoothstep(rb * 0.62 - bl, rb + bl, length(dv));
      clear *= 1.0 - m;
      float up = clamp(dv.y / rb, -1.0, 1.0);
      acc += vec4(1.0, rowT, 0.6 + 0.4 * clamp(0.5 + 0.5 * up, 0.0, 1.0), up) * m;
    }
  }
  float cover = 1.0 - clear;
  return vec4(cover, acc.yzw / max(acc.x, 1e-4));
}
void main(){
  vec2 p = v_uv;
  float r = length(p);
  float t = v_type;
  if (t < 0.5) {
    float bl = max(v_q.x, 0.012);
    float N = floor(v_q.y), rot = v_q.z;
    float w = fract(v_q.w) / 0.999;
    float seed = rot * 13.7;
    p *= 1.0 + fract(v_q.y) * 2.0;
    bool big = v_c.a < 0.5;
    vec3 base = big ? u_petal : u_mpetal;
    vec3 tip = big ? u_tip : u_mrim;
    vec3 cc = big ? u_core : u_mcore;
    float blw = bl * 0.45;
    float x = p.x, Y = -p.y * ASP;

    float dune = step(0.5, u_theme) * step(u_theme, 1.5);
    if (u_theme > 1.5) {
      // a wildflower: a ring of rounded petals on a thin stem, in one of five colours
      float hc = hsh(seed * 0.71);
      vec3 pal = hc < 0.2 ? vec3(1.0, 0.42, 0.66) : hc < 0.4 ? vec3(1.0, 0.84, 0.29) : hc < 0.6 ? vec3(0.65, 0.55, 1.0) : hc < 0.8 ? vec3(0.96, 0.94, 1.0) : vec3(1.0, 0.54, 0.29);
      float hcy = SY1 * 0.8;
      float R0 = 0.62;
      vec2 q = vec2(x, (Y - hcy) / 0.72);
      float rr = length(q);
      float ang = atan(q.y, q.x) + seed;
      float step6 = 6.2831853 / N;
      float k0 = floor(ang / step6 + 0.5);
      float clearW = 1.0, acc = 0.0, wsum = 0.0;
      for (int j = -1; j <= 1; j++) {
        float kk = k0 + float(j);
        float th = kk * step6 - seed;
        vec2 dv = vec2(cos(th), sin(th));
        float len = R0 * (0.82 + 0.25 * hsh(kk * 3.7 + seed));
        vec2 al = q - dv * len * 0.55;
        float a1 = dot(al, dv), a2 = dot(al, vec2(-dv.y, dv.x));
        float e = length(vec2(a1 / (len * 0.52), a2 / (len * 0.34)));
        float m = 1.0 - smoothstep(0.82 - blw * 2.0, 1.0 + blw * 2.0, e);
        clearW *= 1.0 - m;
        acc += m * (0.65 + 0.35 * clamp(rr / len, 0.0, 1.0));
        wsum += m;
      }
      float cover = 1.0 - clearW;
      float shadeW = acc / max(wsum, 1e-4);
      float core = 1.0 - smoothstep(0.12 - blw, 0.16 + blw, rr);
      vec3 petalCol = pal * shadeW * v_c.rgb + vec3(0.55, 0.7, 1.0) * smoothstep(0.0, 0.6, q.y / R0) * 0.12;
      vec3 flowerCol = mix(petalCol, cc * 0.95, core);
      float alphaH = max(cover, core);
      float scW = 0.06 * sin(Y * 1.1 + seed);
      float stemW = (1.0 - smoothstep(0.03, 0.06 + blw, abs(x - scW))) * (1.0 - smoothstep(hcy - 0.15, hcy + 0.05, Y)) * (1.0 - alphaH);
      vec3 stemC = vec3(0.07, 0.2, 0.14) * (0.45 + 0.55 * max(v_c.r, 0.3)) * (0.7 + 0.5 * smoothstep(-ASP, hcy, Y));
      float fadeW = smoothstep(-ASP, -ASP + 0.5, Y);
      o = vec4((flowerCol * alphaH + stemC * stemW) * w * fadeW, clamp(max(alphaH, stemW), 0.0, 1.0) * 0.93 * w * fadeW);
      return;
    }
    float lean = dune > 0.5 ? (hsh(seed * 0.37) - 0.5) * 1.1 : 0.0;
    vec4 pt = spike(x - leanX(Y, lean), Y, N, seed, blw, dune);
    // Lens fringe: the red and blue images of a defocused head are a little
    // larger than the green, so its edges wear a coloured rim.
    vec2 dir = v_scr - 0.5;
    vec2 off = dir / max(length(dir), 0.05) * u_fringe * (0.01 + bl * 0.08) * min(length(dir) * 2.5, 1.0);
    float k = u_fringe * (0.015 + bl * 0.12);
    vec2 pR = (p - off) / (1.0 + k), pB = (p + off * 0.5) / (1.0 + k * 0.8);
    float mR = spike(pR.x - leanX(-pR.y * ASP, lean), -pR.y * ASP, N, seed, blw, dune).x;
    float mB = spike(pB.x - leanX(-pB.y * ASP, lean), -pB.y * ASP, N, seed, blw, dune).x;
    float mG = pt.x;

    // Buds: base colour low on the spike, paler towards the tip, each bud
    // shaded from its lower side to its top, with the warm light behind the
    // ridge catching the upper rim.
    float tp = pt.y;
    vec3 bud = mix(base, tip, smoothstep(0.25, 1.0, tp) * 0.75);
    bud *= pt.z * (0.7 + 0.4 * tp) * v_c.rgb;
    float rimLit = smoothstep(0.3, 1.0, pt.w);
    float rimK = dune > 0.5 ? 1.6 : 0.5;
    bud += cc * rimLit * (0.2 + 0.6 * tp) * rimK * max(v_c.r, 0.3);

    // Stem: a thin curved stalk below the head, fading into the grass.
    float sc = 0.08 * sin(Y * 1.2 + seed) - 0.08 * sin(SY0 * 1.2 + seed);
    float stem = (1.0 - smoothstep(0.035, 0.07 + blw, abs(x - sc))) * (1.0 - smoothstep(SY0, SY0 + 0.15, Y)) * (1.0 - mG);
    vec3 stemCol = (dune > 0.5 ? vec3(0.22, 0.12, 0.07) : vec3(0.09, 0.28, 0.17)) * (0.45 + 0.55 * max(v_c.r, 0.3)) * (0.7 + 0.5 * smoothstep(-ASP, SY0, Y));
    float fade = smoothstep(-ASP, -ASP + 0.5, Y);

    // a faint aura round the head
    float aura = exp(-pow(max(abs(x) - 0.25, 0.0) * 2.5, 2.0)) * smoothstep(SY0 - 0.3, SY0 + 0.3, Y) * (1.0 - smoothstep(SY1, SY1 + 0.5, Y)) * (1.0 - mG) * 0.1;

    float alpha = clamp(max(max(mG, mR * 0.8), stem), 0.0, 1.0) * 0.93 * w * fade;
    vec3 rgb = (bud * vec3(mR, mG, mB) + stemCol * stem + tip * aura) * w * fade;
    o = vec4(rgb, alpha);
  } else if (t < 1.5) {
    // defocused bokeh: a flat disc with a slightly brighter rim, each
    // channel a slightly different size so it wears a thin rainbow edge.
    vec3 d3 = 1.0 - smoothstep(vec3(0.68), vec3(0.98), r * vec3(0.94, 1.0, 1.07));
    float disc = d3.g;
    float rim = smoothstep(0.5, 0.92, r) * disc;
    vec3 col = v_c.rgb * (d3 * 0.65 + rim * 0.45) + vec3(1.0, 0.95, 0.82) * exp(-r * r * 3.5) * 0.9 * v_c.a;
    o = vec4(col * v_q.w * (1.0 + v_c.a), disc * v_c.a * 0.85);
  } else if (t < 2.5) {
    float core = exp(-r * r * 25.0);
    float rays = exp(-abs(p.y) * 30.0) * max(1.0 - abs(p.x), 0.0) + exp(-abs(p.x) * 30.0) * max(1.0 - abs(p.y), 0.0);
    o = vec4(v_c.rgb * (core + rays * 0.7) * v_q.w, 0.0);
  } else if (t < 3.5) {
    float k = p.y * 0.5 + 0.5;
    float hw = 0.12 + 0.88 * k;
    float edge = 1.0 - smoothstep(hw * 0.55, hw, abs(p.x));
    float a = edge * smoothstep(0.0, 0.2, k) * v_q.w;
    float lit = 0.45 + 0.9 * smoothstep(0.45, 1.0, k);
    o = vec4(v_c.rgb * lit * a, a);
  } else {
    float g = exp(-r * r * 4.5) * (1.0 - smoothstep(0.8, 1.0, r));
    o = vec4(v_c.rgb * g * v_q.w, 0.0);
  }
}`;// Dual-filter (Kawase) bloom: cheap, wide and smooth.
const DOWN_FS=`#version 300 es
precision highp float;
in vec2 v_uv;
uniform sampler2D u_src;
uniform vec2 u_texel;
uniform float u_pre;   // 1 on the first pass: keep only what is bright
out vec4 o;
vec3 pre(vec3 c){
  float b = max(c.r, max(c.g, c.b));
  float k = clamp(b - 0.45, 0.0, 0.8);
  float w = max(k * k / (4.0 * 0.8 + 0.0001), b - 1.25) / max(b, 0.0001);
  return c * max(w, 0.0);
}
void main(){
  vec2 h = u_texel * 0.5;
  vec3 s = texture(u_src, v_uv).rgb * 4.0;
  s += texture(u_src, v_uv - h).rgb;
  s += texture(u_src, v_uv + h).rgb;
  s += texture(u_src, v_uv + vec2(h.x, -h.y)).rgb;
  s += texture(u_src, v_uv - vec2(h.x, -h.y)).rgb;
  s /= 8.0;
  o = vec4(u_pre > 0.5 ? pre(min(s, vec3(6.0))) : s, 1.0);
}`;const UP_FS=`#version 300 es
precision highp float;
in vec2 v_uv;
uniform sampler2D u_src;
uniform vec2 u_texel;
out vec4 o;
void main(){
  vec2 h = u_texel * 0.5;
  vec3 s = texture(u_src, v_uv + vec2(-h.x * 2.0, 0.0)).rgb;
  s += texture(u_src, v_uv + vec2(-h.x, h.y)).rgb * 2.0;
  s += texture(u_src, v_uv + vec2(0.0, h.y * 2.0)).rgb;
  s += texture(u_src, v_uv + vec2(h.x, h.y)).rgb * 2.0;
  s += texture(u_src, v_uv + vec2(h.x * 2.0, 0.0)).rgb;
  s += texture(u_src, v_uv + vec2(h.x, -h.y)).rgb * 2.0;
  s += texture(u_src, v_uv + vec2(0.0, -h.y * 2.0)).rgb;
  s += texture(u_src, v_uv + vec2(-h.x, -h.y)).rgb * 2.0;
  o = vec4(s / 12.0, 1.0);
}`;const COMPOSITE_FS=`#version 300 es
precision highp float;
in vec2 v_uv;
uniform sampler2D u_scene, u_bloom;
uniform vec3 u_tint;
uniform vec2 u_bl;   // bloom strength, lens fringe
out vec4 o;
vec3 shoulder(vec3 c){
  // Identity below 0.75, then rolls off. Applied to the brightest channel
  // and scaled through, so a bright coloured dot keeps its hue.
  float m = max(c.r, max(c.g, c.b));
  if (m <= 0.75) return c;
  float t = 0.75 + 0.25 * (1.0 - exp(-(m - 0.75) / 0.25));
  vec3 h = c * (t / m);
  return mix(h, vec3(t), clamp((m - 1.1) / 2.2, 0.0, 0.7));
}
void main(){
  vec2 d = v_uv - 0.5;
  vec2 ca = d * dot(d, d) * 0.009 * u_bl.y;
  vec3 c;
  c.r = texture(u_scene, v_uv - ca).r;
  c.g = texture(u_scene, v_uv).g;
  c.b = texture(u_scene, v_uv + ca).b;
  vec3 b;
  b.r = texture(u_bloom, v_uv - ca * 2.0).r;
  b.g = texture(u_bloom, v_uv).g;
  b.b = texture(u_bloom, v_uv + ca * 2.0).b;
  c += b * u_bl.x * u_tint;
  o = vec4(shoulder(c), 1.0);
}`;function makeProgram(gl,vs,fs,names){const sh=(type,src)=>{const s=gl.createShader(type);if(!s)throw new Error("createShader failed");gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s)||"shader compile failed");return s;};const p=gl.createProgram();if(!p)throw new Error("createProgram failed");gl.attachShader(p,sh(gl.VERTEX_SHADER,vs));gl.attachShader(p,sh(gl.FRAGMENT_SHADER,fs));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p)||"link failed");const u={};for(const n of names)u[n]=gl.getUniformLocation(p,n);return{prog:p,u};}function vaoFor(gl,prog,buf,layout){const vao=gl.createVertexArray();gl.bindVertexArray(vao);gl.bindBuffer(gl.ARRAY_BUFFER,buf);const stride=layout.reduce((a,l)=>a+l[1],0)*4;let off=0;for(const[name,size]of layout){const loc=gl.getAttribLocation(prog,name);if(loc>=0){gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,stride,off*4);}off+=size;}gl.bindVertexArray(null);return vao;}function makeTarget(gl,w,h,hdr,withDepth){const tex=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,tex);if(hdr)gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA16F,w,h,0,gl.RGBA,gl.HALF_FLOAT,null);else gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);const fb=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fb);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,tex,0);let depth=null;if(withDepth){depth=gl.createRenderbuffer();gl.bindRenderbuffer(gl.RENDERBUFFER,depth);gl.renderbufferStorage(gl.RENDERBUFFER,gl.DEPTH_COMPONENT24,w,h);gl.framebufferRenderbuffer(gl.FRAMEBUFFER,gl.DEPTH_ATTACHMENT,gl.RENDERBUFFER,depth);}gl.bindFramebuffer(gl.FRAMEBUFFER,null);return{tex,fb,depth,w,h};}function freeTarget(gl,t){gl.deleteTexture(t.tex);gl.deleteFramebuffer(t.fb);if(t.depth)gl.deleteRenderbuffer(t.depth);}function targetOk(gl,t){gl.bindFramebuffer(gl.FRAMEBUFFER,t.fb);const ok=gl.checkFramebufferStatus(gl.FRAMEBUFFER)===gl.FRAMEBUFFER_COMPLETE;gl.bindFramebuffer(gl.FRAMEBUFFER,null);return ok;}const WORLD_U=["u_cam","u_proj","u_wave","u_off","u_th","u_r[0]"];function setupGpu(gl){const quad=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,quad);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);const fsProg=(fs,names)=>{const p=makeProgram(gl,FS_VS,fs,names);return{...p,vao:vaoFor(gl,p.prog,quad,[["a_p",2]])};};const terrain=makeProgram(gl,TERRAIN_VS,TERRAIN_FS,[...WORLD_U,"u_fog","u_shadow","u_ground","u_rim","u_sky","u_sheen"]);const mesh=buildMesh();const meshBuf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,meshBuf);gl.bufferData(gl.ARRAY_BUFFER,mesh.v,gl.STATIC_DRAW);const meshVao=vaoFor(gl,terrain.prog,meshBuf,[["a_m",2]]);gl.bindVertexArray(meshVao);const idxBuf=gl.createBuffer();gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,idxBuf);gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,mesh.idx,gl.STATIC_DRAW);gl.bindVertexArray(null);const glitter=makeProgram(gl,GLITTER_VS,GLITTER_FS,[...WORLD_U,"u_px","u_light","u_tw","u_hot","u_sun","u_fog","u_crest","u_slope","u_deep"]);const ptBuf=gl.createBuffer();const flower=makeProgram(gl,FLOWER_VS,FLOWER_FS,[...WORLD_U,"u_px","u_fog","u_petal","u_tip","u_core","u_deep"]);const hfBuf=gl.createBuffer();const sprite=makeProgram(gl,SPRITE_VS,SPRITE_FS,["u_petal","u_tip","u_core","u_mpetal","u_mrim","u_mcore","u_fringe","u_theme"]);const sprBuf=gl.createBuffer();const range=gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE);return{sky:fsProg(SKY_FS,["u_res","u_top","u_mid","u_hor","u_gc","u_g","u_ph","u_drop","u_theme"]),down:fsProg(DOWN_FS,["u_src","u_texel","u_pre"]),up:fsProg(UP_FS,["u_src","u_texel"]),comp:fsProg(COMPOSITE_FS,["u_scene","u_bloom","u_tint","u_bl"]),terrain:{...terrain,vao:meshVao,count:mesh.idx.length},glitter:{...glitter,buf:ptBuf,vao:vaoFor(gl,glitter.prog,ptBuf,[["a_d",4]])},flower:{...flower,buf:hfBuf,vao:vaoFor(gl,flower.prog,hfBuf,[["a_d",4]])},sprite:{...sprite,buf:sprBuf,vao:vaoFor(gl,sprite.prog,sprBuf,[["a_p",2],["a_uv",2],["a_type",1],["a_q",4],["a_c",4]])},maxPt:range&&range[1]?range[1]:64};}const ADV_KEYS=Object.keys(DEFAULT_ADVANCED);/** Tuning values arrive as flat Framer props; the object form still works. */function pickAdvanced(p){const out={...p.advanced??{}};for(const k of ADV_KEYS){const v=p[k];if(v!==undefined&&v!==null)out[k]=v;}return out;}const SCENE_CHOICES=[{id:"aurora",label:"Lavender Aurora"}];const CONTROLS_CSS=`
.gm-group{pointer-events:auto;display:flex;gap:4px;padding:4px;border-radius:999px;background:rgba(6,10,24,.55);border:1px solid rgba(255,255,255,.2);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}
.gm-btn{pointer-events:auto;cursor:pointer;font:500 13px/1 system-ui,-apple-system,"Segoe UI",sans-serif;min-height:36px;padding:0 14px;border-radius:999px;border:0;color:#fff;background:transparent}
.gm-btn[aria-pressed="true"]{background:rgba(255,255,255,.92);color:#0b1020}
.gm-sw{display:flex;align-items:center;gap:10px;background:rgba(6,10,24,.55);border:1px solid rgba(255,255,255,.2);-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px)}
.gm-track{position:relative;width:34px;height:20px;border-radius:999px;background:rgba(255,255,255,.3)}
.gm-track[data-on="true"]{background:#7dffc8}
.gm-knob{position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:#fff;transition:left .15s}
.gm-track[data-on="true"] .gm-knob{left:16px}
.gm-btn:focus-visible{outline:2px solid #fff;outline-offset:2px;box-shadow:0 0 0 4px rgba(0,0,0,.6)}
@media (prefers-reduced-motion:reduce){.gm-knob{transition:none}}
`;const SCENE_LABELS=["A lavender field under a glowing green and violet aurora"];const sceneIndex=_=>0;/** Colour controls left empty (transparent) fall back to the scene's own palette. */const isUnset=v=>typeof v!=="string"||v.trim()===""||/^(transparent|#0{4}|#0{8}|rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0(\.0+)?\s*\))$/i.test(v.trim());const themed=(v,fallback)=>isUnset(v)?fallback:v;function resolveAdvanced(raw,T){const out={...DEFAULT_ADVANCED,...raw??{}};for(const k of COLOR_KEYS)out[k]=themed(raw?.[k],T.colors[k]);return out;}/**
 * Glimmer Vale
 *
 * @framerIntrinsicWidth 1200
 * @framerIntrinsicHeight 800
 *
 * @framerSupportedLayoutWidth any
 * @framerSupportedLayoutHeight any
 */export default function GlimmerVale(props){const{speed=50,scale=100,density=60,sparkle=50,scene="aurora",decorative=true,altText,showTabs=false,showToggle=false,controlsPosition="bottom",background,skyTop,skyHorizon,animateOnCanvas=false,style}=props;const advIn=pickAdvanced(props);const adv={...DEFAULT_ADVANCED,...advIn};// Static on the Framer canvas and in exports: draw one frame, no loop.
const isStatic=useIsStaticRenderer();const rootRef=useRef(null);const canvasRef=useRef(null);const sizeRef=useRef({w:1200,h:800});const pointerRef=useRef({tx:0,ty:0,over:0,down:0,x:0,y:0,o:0,d:0});const staticRef=useRef(isStatic);const[error,setError]=useState("");// the visitor's pick from the built-in scene buttons; a change to the Scene property resets it
const[picked,setPicked]=useState(null);const[paused,setPaused]=useState(false);const activeScene=picked??scene;useEffect(()=>setPicked(null),[scene]);const dirtyRef=useRef(true);const visibleRef=useRef(true);const[grainUrl,setGrainUrl]=useState("");const liveRef=useRef({scene:activeScene,speed,scale,density,sparkle,background:background??"",skyTop:skyTop??"",skyHorizon:skyHorizon??""});liveRef.current={scene:activeScene,speed,scale,density,sparkle,background:background??"",skyTop:skyTop??"",skyHorizon:skyHorizon??"",advanced:advIn};staticRef.current=isStatic&&!animateOnCanvas||paused;// any render means a prop may have changed: redraw once if static
dirtyRef.current=true;// ── WebGL scene ──
useEffect(()=>{const canvas=canvasRef.current;const root=rootRef.current;if(!canvas||!root)return;const measure=()=>{const w=root.offsetWidth||1200;const h=root.offsetHeight||800;sizeRef.current={w,h};dirtyRef.current=true;};measure();const ro=new ResizeObserver(measure);ro.observe(root);// pause while off screen
let io=null;if(typeof IntersectionObserver!=="undefined"){io=new IntersectionObserver(entries=>{for(const e of entries)visibleRef.current=e.isIntersecting;});io.observe(root);}const cleanupObservers=()=>{ro.disconnect();if(io)io.disconnect();};const gl=canvas.getContext("webgl2",{alpha:false,antialias:false,premultipliedAlpha:true,preserveDrawingBuffer:true});if(!gl){console.warn("GlimmerVale: WebGL2 is not available");setError("WebGL2 is not available in this browser");return cleanupObservers;}let gpu;try{gpu=setupGpu(gl);}catch(err){console.error("GlimmerVale:",err);setError("Shader error: "+(err instanceof Error?err.message:String(err)).slice(0,400));return cleanupObservers;}let hdr=!!gl.getExtension("EXT_color_buffer_float");const mq=typeof window.matchMedia==="function"?window.matchMedia("(prefers-reduced-motion: reduce)"):null;const spr=new Float32Array(MAX_SPRITES*6*SPR_STRIDE);let scene=null;let bloom=[];let pointSeed=NaN;let meadowKey="";let meadow=[];let last=-1;let tw=0;let raf=0;const allocate=(cw,ch)=>{if(scene)freeTarget(gl,scene);bloom.forEach(t=>freeTarget(gl,t));scene=makeTarget(gl,cw,ch,hdr,true);if(hdr&&!targetOk(gl,scene)){freeTarget(gl,scene);hdr=false;scene=makeTarget(gl,cw,ch,false,true);}bloom=[];let w=cw,h=ch;for(let i=0;i<BLOOM_LEVELS;i++){w=Math.max(1,w>>1);h=Math.max(1,h>>1);bloom.push(makeTarget(gl,w,h,hdr,false));}};const frame=now=>{raf=requestAnimationFrame(frame);// skip work while hidden, or when static and nothing changed
if(!visibleRef.current){last=-1;return;}const isStaticNow=staticRef.current;if(isStaticNow&&!dirtyRef.current)return;dirtyRef.current=false;const L=liveRef.current;const themeIdx=sceneIndex(L.scene);const T=THEMES[themeIdx];RIDGES=RIDGE_SETS[themeIdx];const adv=resolveAdvanced(L.advanced,T);const midPetal=parseColor(T.mid[0]),midRim=parseColor(T.mid[1]),midCore=parseColor(T.mid[2]);const rdt=last<0?0:Math.min(Math.max(0,(now-last)/1e3),1/20);last=now;const loop=Math.max(2,num(adv.loopSec,8));const spd=isStaticNow||mq&&mq.matches?0:Math.max(0,num(L.speed,50))/50;tw=(tw+rdt*spd)%loop;const{w:W,h:H}=sizeRef.current;if(W<2||H<2)return;const dpr=Math.min(2,window.devicePixelRatio||1);const cw=Math.round(W*dpr),ch=Math.round(H*dpr);if(canvas.width!==cw||canvas.height!==ch||!scene||scene.w!==cw||scene.h!==ch){canvas.width=cw;canvas.height=ch;allocate(cw,ch);}const sceneT=scene;// pointer, eased in and out
const P=pointerRef.current;const kp=1-Math.exp(-rdt/.4);P.x+=(P.tx-P.x)*kp;P.y+=(P.ty-P.y)*kp;P.o+=(P.over-P.o)*kp;P.d+=(P.down-P.d)*(1-Math.exp(-rdt/.25));const hk=Math.max(0,num(adv.hover,50))/50;const scaleF=clamp(num(L.scale,100),30,200)/100;const spark=clamp(num(L.sparkle,50),0,100)/50;const dens=clamp(num(L.density,60),10,100)/100;const unit=Math.min(W,H*.75);const sx=-P.x*.02*hk;const bob=num(adv.bob,6)/1e3*Math.sin(TAU*tw/loop);// camera: the pointer slides it a little, so near hills cross far ones
const camX=P.x*.35*hk;const camY=CAM_H+bob*6-P.y*.06*hk;const pitch=PITCH+P.y*.008*hk;const cosP=Math.cos(pitch),sinP=Math.sin(pitch);const worldW=2*TAN_H*12;const wave={si:1/scaleF,amp:num(adv.waveHeight,25)/1e3*3,k:TAU/Math.max(.3,num(adv.waveLength,70)/100*worldW*scaleF),ph:TAU*tw/loop};// Scene Lower: share of the frame height the landscape sits lower by
const drop=clamp(num(adv.sceneDrop,18),0,45)/100;const hotX=clamp(T.hotX+num(adv.lightShift,0)/100,.02,.98);const hotS=num(adv.hotspotStrength,70)/100;const hotY=crestYAt(hotX,wave,camX,camY,cosP,sinP)+.06;const glowS=num(adv.glowStrength,60)/100*(1+.4*P.d*hk);const swayK=num(adv.sway,50)/50;const flowerK=num(adv.flowerSize,100)/100*scaleF;const blurK=num(adv.flowerBlur,100)/100;const bg=parseColor(themed(L.background,T.colors.background),[0,0,0]);const crestC=parseColor(adv.crestColor,[1,.95,.86]);const glowC=parseColor(adv.glowColor,[1,.9,.72]);const shadow=parseColor(adv.hillShadow,[.08,.11,.2]);const slopeC=parseColor(adv.slopeColor,[.44,.55,.85]);const deep=parseColor(adv.slopeDeep,[.24,.31,.6]);const skyHor=parseColor(themed(L.skyHorizon,T.colors.skyHorizon),[.29,.44,.63]);const petalC=parseColor(adv.petalColor,[.55,.4,.94]);const tipC=parseColor(adv.petalTip,[.9,.84,1]);const coreC=parseColor(adv.flowerCore,[.91,.64,.12]);const fogC=mix3(skyHor,deep,.45);const fogDist=22*scaleF;// static data
const seed=Math.round(num(adv.seed,7));if(seed!==pointSeed){gl.bindBuffer(gl.ARRAY_BUFFER,gpu.glitter.buf);gl.bufferData(gl.ARRAY_BUFFER,buildPoints(seed),gl.STATIC_DRAW);gl.bindBuffer(gl.ARRAY_BUFFER,gpu.flower.buf);gl.bufferData(gl.ARRAY_BUFFER,buildHillFlowers(seed),gl.STATIC_DRAW);pointSeed=seed;}const midN=Math.round(clamp(num(adv.midCount,110),0,200));const bokN=Math.round(clamp(num(adv.bokehCount,90),0,200));const grassN=Math.round(clamp(num(adv.grassCount,320),0,400));const mKey=`${seed}|${midN}|${bokN}|${grassN}|${themeIdx}`;if(mKey!==meadowKey){meadow=buildMeadow(seed,midN,bokN,grassN,T);meadowKey=mKey;}// ── sprites: the hot spot's glow first, then the meadow ──
let si=0;const hxPx=hotX*W,hyPx=(hotY+drop)*H;const gR=unit*.13*scaleF;if(T.mode!==2)si=pushSprite(spr,si,W,H,hxPx,hyPx,gR*.6,gR*.4,0,4,0,0,0,hotS*.35,glowC[0],glowC[1],glowC[2],0);if(T.mode!==2)si=pushSprite(spr,si,W,H,hxPx,hyPx,W*.14,H*.012,0,4,0,0,0,hotS*.3,glowC[0],glowC[1],glowC[2],0);for(const m of meadow){// lower the meadow with the hills, anchored at the bottom edge
const my=m.y+drop*clamp((1-m.y)/.46,0,1);if(m.kind===0||m.kind===5){const near=m.d/.15;const sw=Math.sin(TAU*tw/(loop/2)+m.ph);const ang=1.5*Math.PI/180*swayK*(.5+.5*near)*sw;const R=m.d*.5*unit*flowerK;const cx=m.x*W+sw*.004*W*near*swayK-P.x*.04*hk*W*near;const cy=my*H-P.y*.015*hk*H*near;const hx=R/.8;if(m.kind===0){const bl=m.blur*blurK;const g=grow(bl);// the spike stands on (cx, cy); its quad is centred above that
const hy=hx*g*SPIKE_ASP;si=pushSprite(spr,si,W,H,cx+Math.sin(ang)*hy,cy-Math.cos(ang)*hy,hx*g,hy,ang,0,bl,m.n+(g-1)*.5,m.rot,packTilt(1,1),m.tint[0],m.tint[1],m.tint[2],0);}else{const c=Math.cos(ang),s=Math.sin(ang);const ox=m.ox*hx,oy=m.oy*hx;// defocused, so each speck is a soft round spot that
// burns hot enough for the bloom to spread it
const r=hx*m.w*(.6+.6*blurK);si=pushSprite(spr,si,W,H,cx+ox*c-oy*s,cy+ox*s+oy*c,r,r,0,1,0,0,0,m.alpha*(.8+.6*spark),m.col[0],m.col[1],m.col[2],.5);}}else if(m.kind===1){const sw=Math.sin(TAU*tw/(loop/2)+m.ph);const ang=1*Math.PI/180*swayK*sw;const R=m.d*.5*unit*flowerK;const cx=m.x*W+sw*.002*W*swayK-P.x*W*hk*(.012+.015*m.f);const cy=(my+bob*(1-m.f))*H-P.y*.006*hk*H;const hx=R/.8;const bl=m.blur*blurK;const g=grow(bl);const hy=hx*g*SPIKE_ASP;si=pushSprite(spr,si,W,H,cx+Math.sin(ang)*hy,cy-Math.cos(ang)*hy,hx*g,hy,ang,0,bl,m.n+(g-1)*.5,m.rot,packTilt(1,m.alpha),m.tint[0],m.tint[1],m.tint[2],1);}else if(m.kind===2){const s=Math.sin(TAU*tw/loop+m.ph);let breath=.8+.2*s;let dy=-.008*s+.008*Math.sin(m.ph);let rx=0;if(T.mode===1){// sparks rise from the dunes, drift sideways and burn out; loops with the cycle
const fr=(tw/loop+m.ph/TAU)%1;dy=-.12*fr;rx=Math.sin(fr*TAU*2+m.ph)*.006*W;breath=Math.pow(Math.sin(Math.PI*fr),1.5)*1.15;}else if(T.mode===2){// fireflies wander in slow loops and blink; integer multiples keep the loop seamless
const w1=TAU*tw/loop;dy=.02*Math.sin(w1+m.ph*2)+.01*Math.sin(2*w1+m.ph);rx=(Math.sin(w1+m.ph)*.012+Math.sin(2*w1+m.ph*3)*.006)*W;breath=Math.pow(Math.max(0,Math.sin(2*w1+m.ph*5)),3)*1.4+.1;}const R=m.d*.5*unit*scaleF*(T.mode===2?1.5:1);const cx=m.x*W-P.x*.025*hk*W+rx;const cy=(my+dy)*H-P.y*.01*hk*H;si=pushSprite(spr,si,W,H,cx,cy,R,R,0,1,0,0,0,m.alpha*breath,m.col[0],m.col[1],m.col[2],0);}else{const ang=m.ang+Math.sin(TAU*tw/(loop/2)+m.ph)*.03*swayK;const hh=m.h*.5*unit*scaleF;const hw=Math.max(.6,m.w*.5*unit*scaleF);const bx=m.x*W-P.x*W*hk*(.012+.02*m.f);const by=my*H;// a tuft: three blades fanning from one root
for(let b=-1;b<=1;b++){const a2=ang+b*.24;const h2=hh*(1-.18*Math.abs(b)-.1*b);const x2=bx+b*hw*2.5;si=pushSprite(spr,si,W,H,x2+Math.sin(a2)*h2,by-Math.cos(a2)*h2,hw,h2,a2,3,0,0,0,m.alpha,m.col[0],m.col[1],m.col[2],1);}}}// ── draw the scene (HDR) ──
gl.bindFramebuffer(gl.FRAMEBUFFER,sceneT.fb);gl.viewport(0,0,cw,ch);gl.disable(gl.DEPTH_TEST);gl.disable(gl.BLEND);gl.depthMask(true);gl.clearColor(bg[0],bg[1],bg[2],1);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);const S=gpu.sky;gl.useProgram(S.prog);gl.uniform2f(S.u.u_res,cw,ch);gl.uniform3fv(S.u.u_top,parseColor(themed(L.skyTop,T.colors.skyTop),[.14,.23,.45]));gl.uniform3fv(S.u.u_mid,parseColor(adv.skyMid,[.18,.31,.56]));gl.uniform3fv(S.u.u_hor,skyHor);gl.uniform3fv(S.u.u_gc,parseColor(adv.horizonGlow,[1,.89,.72]));gl.uniform4f(S.u.u_g,hotX+sx*.3,hotY+drop-.02,num(adv.horizonGlowStrength,30)/100,W/H);gl.uniform1f(S.u.u_ph,TAU*tw/loop);gl.uniform1f(S.u.u_drop,drop);gl.uniform1f(S.u.u_theme,T.mode);gl.bindVertexArray(S.vao);gl.drawArrays(gl.TRIANGLES,0,3);const A=(FAR+NEAR)/(FAR-NEAR),B=-2*FAR*NEAR/(FAR-NEAR);const setWorld=u=>{gl.uniform4f(u.u_cam,camX,camY,cosP,sinP);gl.uniform4f(u.u_proj,TAN_H,TAN_V,A,B);gl.uniform4f(u.u_wave,wave.si,wave.amp,wave.k,wave.ph);gl.uniform1f(u.u_off,drop*2);gl.uniform4f(u.u_th,T.shoulder,T.mode,0,0);gl.uniform4f(u.u_fog,fogC[0],fogC[1],fogC[2],fogDist);gl.uniform4fv(u["u_r[0]"],RIDGES);};// terrain: dark, writes depth so near ridges hide far glitter
gl.enable(gl.DEPTH_TEST);gl.depthFunc(gl.LEQUAL);const Tr=gpu.terrain;gl.useProgram(Tr.prog);setWorld(Tr.u);gl.uniform3fv(Tr.u.u_shadow,shadow);gl.uniform3fv(Tr.u.u_ground,bg);gl.uniform3fv(Tr.u.u_rim,slopeC);gl.uniform3fv(Tr.u.u_sky,skyHor);// the glow between the dots is a soft teal, not grey
const sheen=mix3(slopeC,glowC,.25).map((c,i)=>c*T.sheen[i]*(num(adv.crestBright,100)/100));gl.uniform3fv(Tr.u.u_sheen,sheen);gl.bindVertexArray(Tr.vao);gl.drawElements(gl.TRIANGLES,Tr.count,gl.UNSIGNED_INT,0);gl.depthMask(false);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);// flower heads on the slopes
const Fl=gpu.flower;gl.useProgram(Fl.prog);setWorld(Fl.u);gl.uniform4f(Fl.u.u_px,ch/2,flowerK,gpu.maxPt,0);gl.uniform3fv(Fl.u.u_petal,slopeC);gl.uniform3fv(Fl.u.u_tip,petalC);gl.uniform3fv(Fl.u.u_core,coreC);gl.uniform3fv(Fl.u.u_deep,deep);gl.bindVertexArray(Fl.vao);gl.drawArrays(gl.POINTS,0,Math.floor(MAX_HF*dens));// glitter sheet
const G=gpu.glitter;gl.useProgram(G.prog);setWorld(G.u);gl.uniform4f(G.u.u_px,ch/2,.017*scaleF*(num(adv.pointSize,100)/100),gpu.maxPt,1*dpr);const flash=.45*spark*(1+.3*P.o*hk+.8*P.d*hk);gl.uniform4f(G.u.u_light,num(adv.crestBright,100)/100,num(adv.slopeBright,100)/100,flash,Math.max(1,num(adv.twinkleSharp,8)));const drawn=Math.floor(MAX_PTS*dens);const glintShare=clamp(num(adv.glintCount,20),0,60)*spark*4/Math.max(1,drawn);gl.uniform4f(G.u.u_tw,loop/5,clamp(num(adv.prismShare,60)/100*Math.min(1,.5+spark*.5),0,1),glintShare,tw);gl.uniform4f(G.u.u_hot,hotX*2-1+sx,1-hotY*2,hotS,num(adv.glintSize,100)/100);const sl=Math.hypot((hotX*2-1)*TAN_H,.18,1);gl.uniform4f(G.u.u_sun,(hotX*2-1)*TAN_H/sl,.18/sl,-1/sl,loop/10);gl.uniform3fv(G.u.u_crest,crestC);gl.uniform3fv(G.u.u_slope,slopeC);gl.uniform3fv(G.u.u_deep,deep);gl.bindVertexArray(G.vao);gl.drawArrays(gl.POINTS,0,drawn);// the meadow, in front of everything
gl.disable(gl.DEPTH_TEST);const Sp=gpu.sprite;gl.useProgram(Sp.prog);gl.uniform3fv(Sp.u.u_petal,petalC);gl.uniform3fv(Sp.u.u_tip,tipC);gl.uniform3fv(Sp.u.u_core,coreC);gl.uniform3fv(Sp.u.u_mpetal,midPetal);gl.uniform3fv(Sp.u.u_mrim,midRim);gl.uniform3fv(Sp.u.u_mcore,midCore);gl.uniform1f(Sp.u.u_fringe,num(adv.fringe,100)/100);gl.uniform1f(Sp.u.u_theme,T.mode);gl.bindBuffer(gl.ARRAY_BUFFER,Sp.buf);gl.bufferData(gl.ARRAY_BUFFER,spr.subarray(0,si*6*SPR_STRIDE),gl.DYNAMIC_DRAW);gl.bindVertexArray(Sp.vao);gl.drawArrays(gl.TRIANGLES,0,si*6);// ── bloom ──
gl.disable(gl.BLEND);const Dn=gpu.down;gl.useProgram(Dn.prog);gl.bindVertexArray(Dn.vao);gl.activeTexture(gl.TEXTURE0);gl.uniform1i(Dn.u.u_src,0);let src=sceneT;for(let i=0;i<bloom.length;i++){const dst=bloom[i];gl.bindFramebuffer(gl.FRAMEBUFFER,dst.fb);gl.viewport(0,0,dst.w,dst.h);gl.bindTexture(gl.TEXTURE_2D,src.tex);gl.uniform2f(Dn.u.u_texel,1/src.w,1/src.h);gl.uniform1f(Dn.u.u_pre,i===0?1:0);gl.drawArrays(gl.TRIANGLES,0,3);src=dst;}const Up=gpu.up;gl.useProgram(Up.prog);gl.bindVertexArray(Up.vao);gl.uniform1i(Up.u.u_src,0);gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE);for(let i=bloom.length-1;i>0;i--){const from=bloom[i],dst=bloom[i-1];gl.bindFramebuffer(gl.FRAMEBUFFER,dst.fb);gl.viewport(0,0,dst.w,dst.h);gl.bindTexture(gl.TEXTURE_2D,from.tex);gl.uniform2f(Up.u.u_texel,1/from.w,1/from.h);gl.drawArrays(gl.TRIANGLES,0,3);}gl.disable(gl.BLEND);// ── composite to screen ──
gl.bindFramebuffer(gl.FRAMEBUFFER,null);gl.viewport(0,0,cw,ch);const C=gpu.comp;gl.useProgram(C.prog);gl.bindVertexArray(C.vao);gl.activeTexture(gl.TEXTURE0);gl.bindTexture(gl.TEXTURE_2D,sceneT.tex);gl.uniform1i(C.u.u_scene,0);gl.activeTexture(gl.TEXTURE1);gl.bindTexture(gl.TEXTURE_2D,bloom[0].tex);gl.uniform1i(C.u.u_bloom,1);gl.activeTexture(gl.TEXTURE0);gl.uniform3fv(C.u.u_tint,mix3([1,1,1],glowC,.35));gl.uniform2f(C.u.u_bl,glowS*.75,num(adv.fringe,100)/100);gl.drawArrays(gl.TRIANGLES,0,3);gl.bindVertexArray(null);};raf=requestAnimationFrame(frame);return()=>{cancelAnimationFrame(raf);cleanupObservers();if(scene)freeTarget(gl,scene);bloom.forEach(t=>freeTarget(gl,t));};},[]);// ── pointer release on window ──
useEffect(()=>{const up=()=>{pointerRef.current.down=0;};window.addEventListener("pointerup",up);window.addEventListener("pointercancel",up);return()=>{window.removeEventListener("pointerup",up);window.removeEventListener("pointercancel",up);};},[]);// ── grain tile ──
useEffect(()=>{const c=document.createElement("canvas");c.width=c.height=128;const ctx=c.getContext("2d");if(!ctx)return;const im=ctx.createImageData(128,128);for(let i=0;i<128*128;i++){const v=Math.random()*255;im.data[i*4]=v;im.data[i*4+1]=v;im.data[i*4+2]=v;im.data[i*4+3]=255;}ctx.putImageData(im,0,0);setGrainUrl(c.toDataURL());},[]);// ── pointer ──
const onMove=e=>{const t=e.target;const w=t.offsetWidth||sizeRef.current.w;const h=t.offsetHeight||sizeRef.current.h;const P=pointerRef.current;P.tx=clamp(e.nativeEvent.offsetX/w*2-1,-1,1);P.ty=clamp(e.nativeEvent.offsetY/h*2-1,-1,1);P.over=1;};const onLeave=()=>{const P=pointerRef.current;P.tx=0;P.ty=0;P.over=0;};const onDown=e=>{onMove(e);pointerRef.current.down=1;};const sceneBg=themed(background,THEMES[sceneIndex(activeScene)].colors.background);const outerStyle={position:"relative",width:"100%",height:"100%",...style,overflow:"hidden",isolation:"isolate",background:sceneBg};return /*#__PURE__*/_jsxs("div",{style:outerStyle,children:[/*#__PURE__*/_jsxs("div",{ref:rootRef,// A purely visual scene: hidden from assistive tech by default, or exposed as a labelled image.
// It has no controls, so nothing here needs keyboard focus; the pointer movement only drives a light parallax.
"aria-hidden":decorative?true:undefined,role:decorative?undefined:"img","aria-label":decorative?undefined:altText&&altText.trim()?altText:SCENE_LABELS[sceneIndex(activeScene)],onPointerMove:onMove,onPointerEnter:onMove,onPointerLeave:onLeave,onPointerDown:onDown,style:{position:"absolute",inset:0,overflow:"hidden",background:sceneBg,isolation:"isolate"},children:[/*#__PURE__*/_jsx("canvas",{"aria-hidden":"true",ref:canvasRef,style:{position:"absolute",inset:0,width:"100%",height:"100%",display:"block"}}),error?/*#__PURE__*/_jsx("div",{role:"status",style:{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",padding:24,textAlign:"center",color:"#fff",font:"500 13px/1.4 system-ui, sans-serif",background:"linear-gradient(#233A74, #000)",whiteSpace:"pre-wrap"},children:"Glimmer Vale: "+error}):null,grainUrl&&num(adv.grain,0)>0?/*#__PURE__*/_jsx("div",{"aria-hidden":"true",style:{position:"absolute",inset:0,pointerEvents:"none",backgroundImage:`url(${grainUrl})`,backgroundRepeat:"repeat",backgroundSize:"128px 128px",mixBlendMode:"overlay",opacity:clamp(num(adv.grain,0),0,100)/100*.35}}):null,num(adv.vignette,0)>0?/*#__PURE__*/_jsx("div",{"aria-hidden":"true",style:{position:"absolute",inset:0,pointerEvents:"none",background:"radial-gradient(ellipse 75% 75% at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.9) 100%)",opacity:clamp(num(adv.vignette,0),0,100)/100}}):null]}),showTabs||showToggle?/*#__PURE__*/_jsxs("div",{style:{position:"absolute",left:0,right:0,[controlsPosition==="top"?"top":"bottom"]:20,display:"flex",justifyContent:"center",flexWrap:"wrap",gap:12,padding:"0 16px",pointerEvents:"none",zIndex:2},children:[/*#__PURE__*/_jsx("style",{children:CONTROLS_CSS}),showTabs?// Native buttons give Enter and Space activation and focus for free; aria-pressed says which scene is showing.
/*#__PURE__*/_jsx("div",{role:"group","aria-label":"Scene",className:"gm-group",children:SCENE_CHOICES.map(c=>/*#__PURE__*/_jsx("button",{type:"button",className:"gm-btn","aria-pressed":activeScene===c.id,onClick:()=>setPicked(c.id),children:c.label},c.id))}):null,showToggle?/*#__PURE__*/_jsxs("button",{type:"button",role:"switch","aria-checked":!paused,className:"gm-btn gm-sw",onClick:()=>setPaused(v=>!v),children:[/*#__PURE__*/_jsx("span",{"aria-hidden":"true",className:"gm-track","data-on":!paused?"true":"false",children:/*#__PURE__*/_jsx("span",{className:"gm-knob"})}),/*#__PURE__*/_jsx("span",{children:"Motion"})]}):null]}):null]});}GlimmerVale.displayName="Glimmer Meadow";// ── Framer property controls ──
const slider=(title,min,max,step=1,unit)=>({type:ControlType.Number,title,min,max,step,unit,displayStepper:true});const color=title=>({type:ControlType.Color,title});/** Every tuning control is a flat prop with its real default, shown only when Show Advanced is on. */const withDefault=(key,ctrl)=>({...ctrl,// colours default to "empty", which means use the active scene's palette
    defaultValue:typeof DEFAULT_ADVANCED[key]==="string"?"rgba(0,0,0,0)":DEFAULT_ADVANCED[key],hidden:p=>!p.showAdvanced});
export { GlimmerVale };
