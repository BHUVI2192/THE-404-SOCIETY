(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const l of r)if(l.type==="childList")for(const h of l.addedNodes)h.tagName==="LINK"&&h.rel==="modulepreload"&&s(h)}).observe(document,{childList:!0,subtree:!0});function i(r){const l={};return r.integrity&&(l.integrity=r.integrity),r.referrerPolicy&&(l.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?l.credentials="include":r.crossOrigin==="anonymous"?l.credentials="omit":l.credentials="same-origin",l}function s(r){if(r.ep)return;r.ep=!0;const l=i(r);fetch(r.href,l)}})();const Ft={dashboard:'<rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/>',universe:'<circle cx="12" cy="12" r="2.4"/><circle cx="5" cy="6" r="1.8"/><circle cx="19" cy="7" r="1.8"/><circle cx="6" cy="19" r="1.8"/><circle cx="19" cy="18" r="1.8"/><path d="M10.2 10.6 6.3 7.2M13.9 10.9l3.9-2.7M10.4 13.6 7.3 17.5M13.9 13.4l3.9 3.3"/>',roadmaps:'<path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20z"/><path d="M9 4v13.5M15 6.5V20"/>',resources:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',video:'<circle cx="12" cy="12" r="9.5"/><path d="m10 8.5 5.5 3.5-5.5 3.5z"/>',insights:'<path d="M3 3v18h18"/><path d="m7 15 4-4.5 3.5 3L20 7"/>',search:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',external:'<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',close:'<path d="M18 6 6 18M6 6l12 12"/>',back:'<path d="m15 18-6-6 6-6"/>',plus:'<path d="M12 5v14M5 12h14"/>',minus:'<path d="M5 12h14"/>',fit:'<path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3"/>',layers:'<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',topics:'<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="9"/>',graph:'<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="8" r="2.5"/><circle cx="9" cy="18" r="2.5"/><path d="m8 7 8 1M7 8l2 8M17 10.2 11 16.5"/>',list:'<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',user:'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',lock:'<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',badge:'<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="2"/><path d="M15 8h2M15 12h2M7 16h10"/>',check:'<path d="m5 13 4 4L19 7"/>'},A=(e,t="")=>`<svg class="icon ${t}" viewBox="0 0 24 24" aria-hidden="true">${Ft[e]||""}</svg>`,Ct='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="6" r="2.2" fill="currentColor"/><circle cx="6" cy="17" r="2.2" fill="currentColor"/><circle cx="18" cy="17" r="2.2" fill="currentColor"/><path d="M11 8 7 15M13 8l4 7M8.5 17h7"/></svg>',rt="builder404",Mt=[{id:"404-9F82",name:"Bhuvan N",role:"Founder & President"},{id:"404-3D71",name:"K Hrishikesh",role:"Co-Founder & Vice President"},{id:"404-8E43",name:"K Deepak",role:"CTO"},{id:"404-5A19",name:"Rudresh J",role:"CCO"},{id:"404-4C62",name:"Pramath H",role:"CINO"},{id:"404-7B90",name:"Yashwardhan Kumar",role:"COO"}],vt="builderportal:session",K="builderportal:synced_members",St="https://ccteuughftetfjpvrjtb.supabase.co",ot="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjdGV1dWdoZnRldGZqcHZyanRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg2MjU1NTYsImV4cCI6MjEwNDIwMTU1Nn0.IKE9hWJpaa-neqRVljSoXglY7Ltw-XxsCPFRdwW6nvQ";function It(){try{const e=JSON.parse(localStorage.getItem(K)||"[]"),t=new Map;return Mt.forEach(i=>t.set(i.id.toUpperCase(),i)),e.forEach(i=>t.set(i.id.toUpperCase(),i)),Array.from(t.values())}catch{return Mt}}async function Wt(e){const t=String(e||"").trim().toUpperCase();if(!t)return null;const i=t.startsWith("404-")?t:`404-${t}`,s=[i,t],l=It().find(h=>s.includes(h.id.toUpperCase()));if(l)return l;try{const h=`or=(member_id.ilike.${encodeURIComponent(i)},member_id.ilike.${encodeURIComponent(t)})`,d=await fetch(`${St}/rest/v1/members?${h}&select=*`,{headers:{apikey:ot,Authorization:`Bearer ${ot}`}});if(d.ok){const n=await d.json();if(Array.isArray(n)&&n.length>0){const p=n[0],a={id:p.member_id,name:p.name,role:p.interest||p.college||"Builder"};try{const m=JSON.parse(localStorage.getItem(K)||"[]");m.push(a),localStorage.setItem(K,JSON.stringify(m))}catch{}return a}}const o=`status=eq.approved&or=(member_id.ilike.${encodeURIComponent(i)},member_id.ilike.${encodeURIComponent(t)})`,c=await fetch(`${St}/rest/v1/onboarding_applications?${o}&select=*`,{headers:{apikey:ot,Authorization:`Bearer ${ot}`}});if(c.ok){const n=await c.json();if(Array.isArray(n)&&n.length>0){const p=n[0],a={id:p.member_id,name:p.name,role:p.interest||p.college||"Builder"};try{const m=JSON.parse(localStorage.getItem(K)||"[]");m.push(a),localStorage.setItem(K,JSON.stringify(m))}catch{}return a}}}catch(h){console.warn("Database member lookup unavailable:",h)}return null}function Y(){try{const e=localStorage.getItem(vt);return e?JSON.parse(e):null}catch{return null}}async function Dt(e,t){const i=String(e||"").trim().toUpperCase(),s=String(t||"").trim();if(!i)throw new Error("Please enter your Member ID");if(s!==rt)throw new Error("Incorrect password. Common access key: "+rt);const r=await Wt(i);if(!r)throw new Error(`Member ID "${i}" not found. Please enter the unique Member ID sent to your email upon community acceptance.`);const l={id:r.id,name:r.name,role:r.role,loggedInAt:new Date().toISOString()};return localStorage.setItem(vt,JSON.stringify(l)),window.dispatchEvent(new CustomEvent("authchange",{detail:l})),l}function Ut(){localStorage.removeItem(vt),window.dispatchEvent(new CustomEvent("authchange",{detail:null})),location.hash="#/login"}const Vt=[{href:"#/",id:"dashboard",label:"Dashboard",icon:"dashboard"},{href:"#/universe",id:"universe",label:"Universe",icon:"universe"},{href:"#/roadmaps",id:"roadmaps",label:"Roadmaps",icon:"roadmaps"},{href:"#/resources",id:"resources",label:"Resources",icon:"resources"},{href:"#/videos",id:"videos",label:"Videos",icon:"video"},{href:"#/insights",id:"insights",label:"Insights",icon:"insights"}];function Gt(e){if(!e)return"??";const t=e.trim().split(/\s+/);return t.length===1?t[0].slice(0,2).toUpperCase():(t[0][0]+t[t.length-1][0]).toUpperCase()}function Jt(e){e.innerHTML=`
    <div class="app" id="app-root">
      <aside class="sidebar" id="app-sidebar">
        <a class="brand" href="#/">
          <span class="brand-mark">${Ct}</span>
          <span class="brand-name">builderportal<small>Learn, build, ship</small></span>
        </a>
        <nav class="nav">
          <div class="nav-label">Explore</div>
          ${Vt.map(d=>`<a href="${d.href}" data-nav="${d.id}">${A(d.icon)}<span>${d.label}</span></a>`).join("")}
        </nav>
        <div class="sidebar-foot">
          <div class="user-profile-slot" id="user-profile-slot"></div>
          <button class="btn theme-btn" id="theme-toggle" aria-label="Toggle theme">${A("moon")}<span>Dark mode</span></button>
          <div class="source-note">404 Society · Progress saved per member.</div>
        </div>
      </aside>
      <main class="main" id="main"></main>
    </div>
    <aside class="drawer" id="drawer" aria-hidden="true"></aside>`;const t=e.querySelector("#app-root"),i=e.querySelector("#user-profile-slot");function s(){const d=Y();if(!d){i.innerHTML="";return}i.innerHTML=`
      <div class="user-profile-badge">
        <div class="profile-avatar">${Gt(d.name)}</div>
        <div class="profile-meta">
          <div class="profile-name" title="${d.name}">${d.name}</div>
          <div class="profile-sub">
            <span class="profile-id">${d.id}</span>
            ${d.role?`<span class="profile-role">${d.role}</span>`:""}
          </div>
        </div>
        <button class="btn-icon signout-btn" id="btn-signout" title="Sign out (${d.name})">
          ${A("logout")}
        </button>
      </div>
    `;const o=i.querySelector("#btn-signout");o&&o.addEventListener("click",c=>{c.preventDefault(),Ut()})}const r=localStorage.getItem("theme"),l=d=>{document.documentElement.dataset.theme=d,localStorage.setItem("theme",d);const o=e.querySelector("#theme-toggle");o.innerHTML=`${A(d==="dark"?"sun":"moon")}<span>${d==="dark"?"Light mode":"Dark mode"}</span>`,window.dispatchEvent(new Event("themechange"))};l(r||"light"),e.querySelector("#theme-toggle").addEventListener("click",()=>l(document.documentElement.dataset.theme==="dark"?"light":"dark"));const h=d=>{const o=Y(),c=d==="/login"||!o;t.classList.toggle("auth-mode",c);const n=d==="/"?"dashboard":d.split("/")[1].replace(/^roadmap$/,"roadmaps");e.querySelectorAll("[data-nav]").forEach(p=>p.classList.toggle("active",p.dataset.nav===n)),s()};return window.addEventListener("routechange",d=>h(d.detail)),window.addEventListener("authchange",()=>{h(location.hash.replace(/^#/,"")||"/")}),s(),e.querySelector("#main")}const Rt=[];let nt=null;const F=(e,t)=>{const i=[],s=new RegExp("^"+e.replace(/:(\w+)/g,(r,l)=>(i.push(l),"([^/]+)"))+"/?$");Rt.push({re:s,keys:i,view:t})},Yt=()=>location.hash.replace(/^#/,"")||"/";async function Zt(e){const t=Yt().split("?")[0],i=Y();if(!i&&t!=="/login"){location.hash="#/login";return}if(i&&t==="/login"){location.hash="#/";return}for(const s of Rt){const r=s.re.exec(t);if(!r)continue;const l=Object.fromEntries(s.keys.map((h,d)=>[h,decodeURIComponent(r[d+1])]));if(nt){try{nt()}catch{}nt=null}e.innerHTML="",e.scrollTop=0,nt=await s.view(e,l)||null,window.dispatchEvent(new CustomEvent("routechange",{detail:t}));return}location.hash=i?"#/":"#/login"}const pt=new Map,ft=async e=>{if(pt.has(e))return pt.get(e);const t=[`/builderportal/data/${e}`,`./data/${e}`,`/data/${e}`,`/public/data/${e}`,`data/${e}`];for(const i of t)try{const s=await fetch(i),r=s.headers.get("content-type")||"";if(s.ok&&!r.includes("text/html")){const l=await s.json();return pt.set(e,l),l}}catch{}throw new Error(`Failed to load data/${e}`)},Z=()=>ft("index.json"),Xt=()=>ft("resources.json"),Kt=e=>ft(`roadmaps/${e}.json`),P={article:{label:"Articles",single:"Article",color:"var(--t-article)"},official:{label:"Official docs",single:"Official",color:"var(--t-official)"},video:{label:"Videos",single:"Video",color:"var(--t-video)"},opensource:{label:"Open source",single:"Open source",color:"var(--t-opensource)"},roadmap:{label:"Roadmap links",single:"Roadmap",color:"var(--t-roadmap)"},course:{label:"Courses",single:"Course",color:"var(--t-course)"},book:{label:"Books",single:"Book",color:"var(--t-book)"},podcast:{label:"Podcasts",single:"Podcast",color:"var(--t-podcast)"}},j={"ai-ml":"#8b5cf6",web:"#3b82f6",languages:"#f59e0b","cloud-devops":"#06b6d4",data:"#10b981",mobile:"#ec4899",security:"#ef4444","cs-career":"#64748b"};function dt(e){const t=/^var\((--[\w-]+)\)$/.exec(e);return t?getComputedStyle(document.documentElement).getPropertyValue(t[1]).trim():e}const et=()=>{const e=getComputedStyle(document.documentElement),t=i=>e.getPropertyValue(i).trim();return{bg:t("--surface"),ink:t("--ink"),muted:t("--muted"),faint:t("--faint"),border:t("--border"),accent:t("--accent")}},Qt=new Intl.NumberFormat("en-US"),C=e=>Qt.format(e),gt=(e,t)=>t?`${(e/t*100).toFixed(1)}%`:"0%",q=e=>String(e??"").replace(/[&<>"']/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[t]),te=e=>{try{return new URL(e).hostname.replace(/^www\./,"")}catch{return e}},Q=(e,t=160)=>{let i;return(...s)=>{clearTimeout(i),i=setTimeout(()=>e(...s),t)}};function bt(e,t){const i=Math.min(window.devicePixelRatio||1,2),s=e.clientWidth,r=t??e.clientHeight;t&&(e.style.height=`${t}px`),e.width=Math.round(s*i),e.height=Math.round(r*i);const l=e.getContext("2d");return l.setTransform(i,0,0,i,0,0),{ctx:l,w:s,h:r,dpr:i}}function yt(e,t){const i=new ResizeObserver(()=>t());return i.observe(e),()=>i.disconnect()}const kt=(e,t,i,s,r,l)=>{e.beginPath(),e.roundRect?e.roundRect(t,i,s,r,l):e.rect(t,i,s,r)},B=document.createElement("div");B.className="tooltip";document.body.appendChild(B);const z={show(e,t,i){B.innerHTML=e,B.classList.add("show");const s=B.getBoundingClientRect();B.style.left=`${Math.min(t+14,window.innerWidth-s.width-12)}px`,B.style.top=`${Math.min(i+14,window.innerHeight-s.height-12)}px`},hide(){B.classList.remove("show")}};function ee(e,t,{centerLabel:i="Total",onHover:s}={}){const r=t.reduce((a,m)=>a+m.value,0);let l=-1,h=null;const d=()=>{const{ctx:a,w:m,h:u}=bt(e,e.clientWidth),f=et(),g=m/2,$=u/2,y=Math.max(0,Math.min(m,u)/2-6),x=Math.max(0,y*.68);if(h={cx:g,cy:$,R:y,r:x,arcs:[]},y<=0||x<=0)return;a.clearRect(0,0,m,u);let L=-Math.PI/2;const S=.025;t.forEach((I,O)=>{const W=I.value/r*Math.PI*2,H=L+W;h.arcs.push([L,H]);const D=O===l?5:0;a.beginPath(),a.arc(g,$,y+D,L+S,Math.max(L+S,H-S)),a.arc(g,$,x,Math.max(L+S,H-S),L+S,!0),a.closePath(),a.fillStyle=dt(I.color),a.globalAlpha=l===-1||l===O?1:.28,a.fill(),L=H}),a.globalAlpha=1,a.textAlign="center",a.textBaseline="middle";const T=t[l];a.fillStyle=f.ink,a.font="700 28px Montserrat, sans-serif",a.fillText(C(T?T.value:r),g,$-8),a.fillStyle=f.muted,a.font="500 12px Montserrat, sans-serif",a.fillText(T?`${T.label} · ${gt(T.value,r)}`:i,g,$+16)},o=a=>{const m=e.getBoundingClientRect(),u=a.clientX-m.left-h.cx,f=a.clientY-m.top-h.cy,g=Math.hypot(u,f);if(g<h.r-4||g>h.R+8)return-1;let $=Math.atan2(f,u);return $<-Math.PI/2&&($+=Math.PI*2),h.arcs.findIndex(([y,x])=>$>=y&&$<x)},c=a=>{const m=o(a);m!==l&&(l=m,d(),s==null||s(m)),e.style.cursor=m>=0?"pointer":"default"},n=()=>{l!==-1&&(l=-1,d(),s==null||s(-1)),z.hide()};e.addEventListener("mousemove",c),e.addEventListener("mouseleave",n),d();const p=yt(e,d);return window.addEventListener("themechange",d),{highlight(a){l=a,d()},destroy(){p(),window.removeEventListener("themechange",d)}}}const se=(e,t)=>{const i=t.reduce((s,r)=>s+e[r],0)||1;return`<div class="stackbar">${t.filter(s=>e[s]).map(s=>`<i style="width:${e[s]/i*100}%;background:${P[s].color}" title="${P[s].label}: ${C(e[s])}"></i>`).join("")}</div>`},Ot=(e,t)=>{var i;return((i=e.categories.find(s=>s.id===t))==null?void 0:i.label)??t},ct=(e,{href:t}={})=>{const i=Math.max(...e.map(s=>s.value),1);return`<div class="bars">${e.map(s=>{const r=t?"a":"div";return`<${r} class="bar-row" ${t?`href="${t(s)}"`:""}>
      <span class="name">${q(s.label)}</span>
      <span class="bar-track"><span class="bar-fill" style="display:block;width:${s.value/i*100}%;background:${s.color}"></span></span>
      <span class="val">${C(s.value)}</span>
    </${r}>`}).join("")}</div>`},st=({title:e,sub:t,crumb:i,actions:s=""})=>`
  <div class="page-head">
    <div>${i?`<a class="crumb" href="${i.href}">${i.icon}${q(i.label)}</a>`:""}
      <h1>${q(e)}</h1>${t?`<p>${t}</p>`:""}</div>
    ${s}
  </div>`;async function ae(e){const t=Y(),i=await Z(),{totals:s,roadmaps:r,types:l}=i,h=l.map(g=>({key:g,label:P[g].label,value:s.byType[g],color:P[g].color})),d=[...r].sort((g,$)=>$.topics-g.topics).slice(0,10),o=i.categories.map(g=>{const $=r.filter(y=>y.category===g.id);return{...g,count:$.length,topics:$.reduce((y,x)=>y+x.topics,0)}}).sort((g,$)=>$.topics-g.topics),c=r.reduce((g,$)=>g+$.withoutResources,0),n=[...r].filter(g=>g.topics>=20).map(g=>({r:g,ratio:g.resources/g.topics})).sort((g,$)=>g.ratio-$.ratio).slice(0,5),p=(g,$,y,x)=>`
    <div class="card stat">
      <div class="stat-icon" style="background:color-mix(in srgb, ${$} 14%, transparent);color:${$}">${A(g)}</div>
      <div><div class="stat-value">${C(y)}</div><div class="stat-label">${x}</div></div>
    </div>`,a=t?`Welcome back, ${t.name}`:"Overview",m=t?`Member ID: ${t.id} · ${t.role||"Builder"} · 404 Society Builder Portal`:"All roadmaps, topics, and learning resources at a glance.";e.innerHTML=`<div class="page">
    ${st({title:a,sub:m,actions:`<a class="btn primary" href="#/universe">${A("universe")}Open universe</a>`})}
    <div class="grid grid-4">
      ${p("roadmaps","var(--accent)",s.roadmaps,"Roadmaps")}
      ${p("topics","var(--t-official)",s.topics,"Topics")}
      ${p("layers","var(--t-article)",s.resources,"Curated resources")}
      ${p("video","var(--t-video)",s.byType.video,"Video links")}
    </div>
    <div class="grid grid-3-2" style="margin-top:20px">
      <div class="card">
        <div class="card-head"><div class="card-title">Resource mix</div><div class="card-sub">Hover a slice</div></div>
        <div class="donut-layout">
          <canvas class="donut-canvas" id="donut"></canvas>
          <div class="legend" id="legend">
            ${h.map((g,$)=>`<div class="legend-row" data-i="${$}"><span class="dot" style="background:${g.color}"></span><span>${g.label}</span><span class="n">${C(g.value)}</span><span class="p">${gt(g.value,s.resources)}</span></div>`).join("")}
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-head"><div class="card-title">Topics by category</div><div class="card-sub">${o.length} groups</div></div>
        ${ct(o.map(g=>({label:g.label,value:g.topics,color:j[g.id]})))}
      </div>
    </div>
    <div class="grid grid-3-2" style="margin-top:20px">
      <div class="card">
        <div class="card-head"><div class="card-title">Largest roadmaps</div><a class="card-sub" href="#/roadmaps">View all →</a></div>
        ${ct(d.map(g=>({label:g.title,value:g.topics,color:j[g.category],slug:g.slug})),{href:g=>`#/roadmap/${g.slug}`})}
      </div>
      <div class="card">
        <div class="card-head"><div class="card-title">Content gaps</div><div class="card-sub">Opportunities</div></div>
        <div class="gap-list">
          <div class="gap-item"><span>Topics with no resources</span><b>${C(c)}</b></div>
          <div class="gap-item"><span>Share of all topics</span><b>${gt(c,s.topics)}</b></div>
          <div class="gap-item"><span>Roadmaps without content</span><b>${C(s.emptyRoadmaps)}</b></div>
        </div>
        <div class="section-label" style="margin:22px 0 8px">Thinnest coverage · resources per topic</div>
        <div class="gap-list">
          ${n.map(({r:g,ratio:$})=>`<a class="gap-item" href="#/roadmap/${g.slug}"><span>${g.title}</span><b>${$.toFixed(2)}</b></a>`).join("")}
        </div>
      </div>
    </div>
  </div>`;const u=e.querySelector("#legend"),f=ee(e.querySelector("#donut"),h,{centerLabel:"Resources",onHover:g=>u.querySelectorAll(".legend-row").forEach($=>$.classList.toggle("hl",+$.dataset.i===g))});return u.querySelectorAll(".legend-row").forEach(g=>{g.onmouseenter=()=>f.highlight(+g.dataset.i),g.onmouseleave=()=>f.highlight(-1)}),()=>f.destroy()}class Pt{constructor(t,i={}){this.canvas=t,this.ctx=t.getContext("2d"),this.opts={repulse:1400,gravity:.015,damping:.82,pad:3,labelZoom:1.1,...i},this.view={x:0,y:0,k:1},this.nodes=[],this.links=[],this.byId=new Map,this.adj=new Map,this.alpha=0,this.hover=null,this.selected=null,this.filter=null,this.theme=et(),this._bind(),this.resize(),this._ro=new ResizeObserver(()=>this.resize()),this._ro.observe(t),this._onTheme=()=>{this.theme=et(),this.draw()},window.addEventListener("themechange",this._onTheme)}setData(t,i,s=220){this.nodes=t,this.byId=new Map(t.map(r=>[r.id,r])),this.links=i.map(r=>({...r,s:this.byId.get(r.source),t:this.byId.get(r.target)})).filter(r=>r.s&&r.t),this.adj=new Map(t.map(r=>[r.id,new Set]));for(const r of this.links)this.adj.get(r.s.id).add(r.t.id),this.adj.get(r.t.id).add(r.s.id);t.forEach((r,l)=>{if(r.x==null){const h=l*2.399963,d=14*Math.sqrt(l+1);r.x=Math.cos(h)*d,r.y=Math.sin(h)*d}r.vx=0,r.vy=0}),t.forEach(r=>r.deg=0);for(const r of this.links)r.s.deg++,r.t.deg++;this.alpha=1;for(let r=0;r<s;r++)this._tick(Math.max(.05,1-r/s));this.alpha=.25,this.fit(!1),this._loop()}_tick(t){const{repulse:i,gravity:s,damping:r,pad:l}=this.opts,h=this.nodes,d=h.length;for(let o=0;o<d;o++){const c=h[o];for(let n=o+1;n<d;n++){const p=h[n];let a=p.x-c.x,m=p.y-c.y,u=a*a+m*m;if(u>9e4)continue;u<.01&&(a=Math.random()-.5,m=Math.random()-.5,u=.5);const f=Math.sqrt(u);let g=i*t/u;const $=c.r+p.r+l;f<$&&(g+=($-f)*.35);const y=a/f*g,x=m/f*g;c.vx-=y,c.vy-=x,p.vx+=y,p.vy+=x}}for(const o of this.links){const c=o.t.x-o.s.x,n=o.t.y-o.s.y,p=Math.sqrt(c*c+n*n)||.01,a=(p-o.dist)/p*(o.strength??.12)*t/Math.min(o.s.deg,o.t.deg),m=o.s.deg/(o.s.deg+o.t.deg);o.s.vx+=c*a*(1-m),o.s.vy+=n*a*(1-m),o.t.vx-=c*a*m,o.t.vy-=n*a*m}for(const o of h){if(o.fixed){o.vx=o.vy=0;continue}o.vx-=o.x*s*t,o.vy-=o.y*s*t,o.vx*=r,o.vy*=r;const c=Math.hypot(o.vx,o.vy);c>30&&(o.vx*=30/c,o.vy*=30/c),o.x+=o.vx,o.y+=o.vy}}_loop(){if(this._raf)return;const t=()=>{this._raf=null,this.alpha>.015||this.dragging?(this._tick(Math.max(this.alpha,.05)),this.alpha*=.985,this.draw(),this._raf=requestAnimationFrame(t)):this.draw()};this._raf=requestAnimationFrame(t)}reheat(t=.3){this.alpha=Math.max(this.alpha,t),this._loop()}resize(){const t=Math.min(window.devicePixelRatio||1,2),i=this.canvas.clientWidth,s=this.canvas.clientHeight;!i||!s||(this.w=i,this.h=s,this.canvas.width=Math.round(i*t),this.canvas.height=Math.round(s*t),this.dpr=t,this.draw())}fit(t=!0,i=70){if(!this.nodes.length||!this.w)return;let s=1/0,r=1/0,l=-1/0,h=-1/0;for(const a of this.nodes)s=Math.min(s,a.x-a.r),r=Math.min(r,a.y-a.r),l=Math.max(l,a.x+a.r),h=Math.max(h,a.y+a.r);const d=Math.min((this.w-i*2)/(l-s||1),(this.h-i*2)/(h-r||1),2.2),o={k:d,x:this.w/2-(s+l)/2*d,y:this.h/2-(r+h)/2*d};if(!t){this.view=o;return}const c={...this.view},n=performance.now(),p=a=>{const m=Math.min(1,(a-n)/380),u=1-Math.pow(1-m,3);this.view={k:c.k+(o.k-c.k)*u,x:c.x+(o.x-c.x)*u,y:c.y+(o.y-c.y)*u},this.draw(),m<1&&requestAnimationFrame(p)};requestAnimationFrame(p)}zoomBy(t,i=this.w/2,s=this.h/2){const r=this.view,l=Math.min(6,Math.max(.15,r.k*t));r.x=i-(i-r.x)/r.k*l,r.y=s-(s-r.y)/r.k*l,r.k=l,this.draw()}toWorld(t,i){return{x:(t-this.view.x)/this.view.k,y:(i-this.view.y)/this.view.k}}pick(t,i){const{x:s,y:r}=this.toWorld(t,i);for(let l=this.nodes.length-1;l>=0;l--){const h=this.nodes[l],d=h.r+3/this.view.k;if((h.x-s)**2+(h.y-r)**2<=d*d)return h}return null}_bind(){const t=this.canvas,i=l=>{const h=t.getBoundingClientRect();return[l.clientX-h.left,l.clientY-h.top]};let s=null;t.addEventListener("pointerdown",l=>{const[h,d]=i(l),o=this.pick(h,d);s={px:h,py:d,node:o,moved:!1,vx:this.view.x,vy:this.view.y},t.setPointerCapture(l.pointerId),o||t.classList.add("grabbing")}),t.addEventListener("pointermove",l=>{var c,n;const[h,d]=i(l);if(s){const p=h-s.px,a=d-s.py;if(Math.abs(p)+Math.abs(a)>4&&(s.moved=!0),s.node&&s.moved&&!s.node.fixed){this.dragging=!0;const m=this.toWorld(h,d);s.node.x=m.x,s.node.y=m.y,s.node.vx=s.node.vy=0,this.reheat(.2)}else s.node||(this.view.x=s.vx+p,this.view.y=s.vy+a,this.draw());return}const o=this.pick(h,d);o!==this.hover&&(this.hover=o,t.classList.toggle("pointer",!!o),this.draw()),(n=(c=this.opts).onHover)==null||n.call(c,o,l)});const r=l=>{var d,o;if(!s)return;const h=s;if(s=null,this.dragging=!1,t.classList.remove("grabbing"),!h.moved){const[c,n]=i(l),p=this.pick(c,n);this.selected=p,this.draw(),(o=(d=this.opts).onSelect)==null||o.call(d,p)}};t.addEventListener("pointerup",r),t.addEventListener("pointercancel",r),t.addEventListener("pointerleave",()=>{var l,h;!s&&this.hover&&(this.hover=null,(h=(l=this.opts).onHover)==null||h.call(l,null),this.draw())}),t.addEventListener("wheel",l=>{l.preventDefault();const[h,d]=i(l);this.zoomBy(Math.exp(-l.deltaY*.0015),h,d)},{passive:!1})}select(t){this.selected=t,this.draw()}setFilter(t){this.filter=t,this.draw()}draw(){const{ctx:t,view:i,dpr:s}=this;if(!this.w)return;const r=this.theme,l=this.opts;t.setTransform(s,0,0,s,0,0),t.clearRect(0,0,this.w,this.h),t.save(),t.translate(i.x,i.y),t.scale(i.k,i.k);const h=this.hover||this.selected,d=h?this.adj.get(h.id):null,o=n=>!this.filter||this.filter(n),c=n=>(!h||n===h||d.has(n.id))&&o(n);for(const n of this.links){const p=h?n.s===h||n.t===h:o(n.s)&&o(n.t);t.globalAlpha=p?n.alpha??.5:.05,t.strokeStyle=p&&h?n.s.color:r.faint,t.lineWidth=(n.width??1)/Math.sqrt(i.k)*(p&&h?1.6:1),t.beginPath(),t.moveTo(n.s.x,n.s.y),t.lineTo(n.t.x,n.t.y),t.stroke()}for(const n of this.nodes){const p=c(n);t.globalAlpha=p?1:.13,t.fillStyle=n.color,t.beginPath(),t.arc(n.x,n.y,n.r,0,6.2832),t.fill(),n===this.selected||n===this.hover?(t.lineWidth=2.5/i.k,t.strokeStyle=r.ink,t.beginPath(),t.arc(n.x,n.y,n.r+3/i.k,0,6.2832),t.stroke()):n.ring&&(t.lineWidth=1.6/i.k,t.strokeStyle=r.bg,t.stroke())}t.globalAlpha=1,t.textAlign="center",t.textBaseline="middle";for(const n of this.nodes){if(!(n===this.hover||n===this.selected||d&&d.has(n.id)&&n.always!==!1&&i.k>.9&&n.r>8||n.always&&c(n)||n.label&&i.k>=l.labelZoom*(n.zoomAt??1)&&c(n)&&n.r*i.k>6)||!n.label)continue;const m=Math.max(9.5,Math.min(n.labelSize??12,13))/(n.stickyLabel,1);t.font=`${n.weight??600} ${m/i.k}px Montserrat, sans-serif`;const u=n.r+(6+m*.5)/i.k;t.globalAlpha=c(n)?1:.2,t.lineWidth=4/i.k,t.strokeStyle=r.bg,t.lineJoin="round",t.strokeText(n.label,n.x,n.y+u),t.fillStyle=r.ink,t.fillText(n.label,n.x,n.y+u)}t.restore(),t.globalAlpha=1}destroy(){cancelAnimationFrame(this._raf),this._ro.disconnect(),window.removeEventListener("themechange",this._onTheme)}}async function ie(e){const t=await Z(),i=new Set;e.innerHTML=`<div class="page">
    ${st({title:"Roadmap universe",sub:`${t.roadmaps.length} roadmaps connected by ${t.links.length} cross-links. Node size reflects topic count, colour reflects category.`})}
    <div class="card graph-card">
      <canvas id="g"></canvas>
      <div class="graph-hint">Drag to pan · scroll to zoom · click a roadmap to open</div>
      <div class="graph-tools">
        <button class="btn-icon" data-z="1.25" aria-label="Zoom in">${A("plus")}</button>
        <button class="btn-icon" data-z="0.8" aria-label="Zoom out">${A("minus")}</button>
        <button class="btn-icon" data-fit aria-label="Fit to view">${A("fit")}</button>
      </div>
      <div class="graph-legend" id="legend">
        ${t.categories.map(o=>`<div class="row btn-row" data-cat="${o.id}"><span class="dot" style="background:${j[o.id]}"></span>${o.label}</div>`).join("")}
      </div>
    </div>
  </div>`;const s=t.categories.map(o=>({id:`cat:${o.id}`,r:9,color:j[o.id],label:o.label,always:!0,hub:!0,category:o.id,weight:700,labelSize:12,ring:!0})),r=[...s,...t.roadmaps.map(o=>({id:o.slug,r:4+Math.sqrt(o.topics)*.62,color:j[o.category],label:o.title,category:o.category,data:o,weight:500,labelSize:11,zoomAt:o.topics>150?.3:o.topics>80?1.3:2.4}))],l=[...t.roadmaps.map(o=>({source:`cat:${o.category}`,target:o.slug,dist:60+Math.random()*70,strength:.7,alpha:.2})),...t.links.map(o=>({source:o.source,target:o.target,dist:160,strength:.006,width:.8+Math.min(2,o.weight*.25),alpha:.4})),...s.flatMap((o,c)=>s.slice(c+1).map(n=>({source:o.id,target:n.id,dist:330,strength:.08,alpha:0})))],h=e.querySelector("#g");await document.fonts.ready;const d=new Pt(h,{repulse:5200,gravity:.012,labelZoom:.9,onHover:(o,c)=>{o&&!o.hub?z.show(`<b>${o.label}</b>${C(o.data.topics)} topics · ${C(o.data.resources)} resources<br><span>${Ot(t,o.category)}</span>`,c.clientX,c.clientY):z.hide()},onSelect:o=>{o&&!o.hub&&(location.hash=`#/roadmap/${o.id}`)}});return d.setData(r,l,320),e.querySelectorAll("[data-z]").forEach(o=>o.onclick=()=>d.zoomBy(+o.dataset.z)),e.querySelector("[data-fit]").onclick=()=>d.fit(),e.querySelectorAll("[data-cat]").forEach(o=>{o.onclick=()=>{const c=o.dataset.cat;i.has(c)?i.delete(c):i.add(c),o.classList.toggle("off",i.has(c)),d.setFilter(i.size?n=>!i.has(n.category):null)}}),()=>{d.destroy(),z.hide()}}const zt=e=>{var i;return`builderportal:${((i=Y())==null?void 0:i.id)||"guest"}:done:${e}`};function tt(e){try{return new Set(JSON.parse(localStorage.getItem(zt(e))||"[]"))}catch{return new Set}}function Ht(e,t){try{localStorage.setItem(zt(e),JSON.stringify([...t]))}catch{}}function oe(e,t){const i=tt(e);return i.has(t)?i.delete(t):i.add(t),Ht(e,i),i.has(t)}const ne=e=>Ht(e,new Set),Et=new Set(["frontend","backend","ai-engineer","cyber-security","full-stack","devops","data-analyst","ai-data-scientist","machine-learning","data-engineer","network-engineer","qa","software-architect","forward-deployed-engineer","game-developer","android","ux-design","product-manager","product-design","devsecops","bi-analyst","postgresql-dba","mlops","seo","blockchain","ios","engineering-manager","inference-engineering","technical-writer","server-side-game-developer","devrel"]),Lt=e=>e.endsWith("-beginner");async function le(e){const t=await Z(),i={q:"",cat:"all",sort:"name"},s={name:(c,n)=>c.title.localeCompare(n.title),topics:(c,n)=>n.topics-c.topics,resources:(c,n)=>n.resources-c.resources},r=new Map(t.roadmaps.map(c=>[c.slug,tt(c.slug).size])),l=c=>t.roadmaps.filter(n=>n.category===c).length;e.innerHTML=`<div class="page">
    ${st({title:"Roadmaps",sub:`${t.roadmaps.length} step-by-step learning paths. Open one to follow its flowchart and track your progress.`})}
    <div class="dir">
      <aside class="dir-side">
        <div class="input-wrap" style="min-width:0;max-width:none">${A("search")}<input class="input" id="q" placeholder="Search roadmaps" /></div>
        <select class="input" id="sort" style="padding-left:14px"><option value="name">Sort: name</option><option value="topics">Sort: most topics</option><option value="resources">Sort: most resources</option></select>
        <div class="cats" id="cats">
          <button class="on" data-cat="all">All roadmaps<span class="count">${t.roadmaps.length}</span></button>
          ${t.categories.map(c=>`<button data-cat="${c.id}"><span class="dot" style="background:${j[c.id]}"></span>${q(c.label)}<span class="count">${l(c.id)}</span></button>`).join("")}
        </div>
      </aside>
      <div id="out"></div>
    </div>
  </div>`;const h=c=>{const n=r.get(c.slug)||0;return`<a class="tile" href="#/roadmap/${c.slug}">
      <div class="t-top"><span class="dot" style="background:${j[c.category]}"></span>${q(c.title)}</div>
      <div class="t-meta">${C(c.topics)} topics, ${C(c.resources)} resources</div>
      ${n?`<div class="t-bar"><i style="width:${Math.min(100,n/c.topics*100)}%"></i></div>`:""}
    </a>`},d=e.querySelector("#out"),o=()=>{const c=i.q.toLowerCase(),n=t.roadmaps.filter(a=>(i.cat==="all"||a.category===i.cat)&&a.title.toLowerCase().includes(c)).sort(s[i.sort]),p=[["Role-based roadmaps",n.filter(a=>Et.has(a.slug))],["Skill-based roadmaps",n.filter(a=>!Et.has(a.slug)&&!Lt(a.slug))],["Beginner tracks",n.filter(a=>Lt(a.slug))]].filter(([,a])=>a.length);d.innerHTML=p.map(([a,m])=>`<section class="dir-section"><h2><span>${a}</span><span>${m.length}</span></h2><div class="tiles">${m.map(h).join("")}</div></section>`).join("")||'<div class="empty">No roadmaps match your search.</div>'};e.querySelector("#q").oninput=Q(c=>{i.q=c.target.value,o()}),e.querySelector("#sort").onchange=c=>{i.sort=c.target.value,o()},e.querySelector("#cats").onclick=c=>{const n=c.target.closest("[data-cat]");n&&(i.cat=n.dataset.cat,e.querySelectorAll("#cats button").forEach(p=>p.classList.toggle("on",p===n)),o())},o()}const jt=()=>document.getElementById("drawer");function $t(e,t,i=!0){const s=t[e[0]],r=P[s],l=String(e[2]).startsWith("#");return`<a class="res" href="${q(e[2])}" ${l?"":'target="_blank" rel="noopener noreferrer"'}>
    <span class="badge" style="background:color-mix(in srgb, ${r.color} 14%, transparent);color:${r.color}">${r.single}</span>
    <span><div class="res-title">${q(e[1]||e[2])}</div>${i?`<div class="res-meta">${l?"Opens in builderportal":q(te(e[2]))}</div>`:""}</span>
    ${A("external")}
  </a>`}function re(e,t,i,{done:s,onToggle:r}={}){const l=jt(),h={};e.resources.forEach(o=>{var c;return(h[c=i[o[0]]]||(h[c]=[])).push(o)}),l.innerHTML=`
    <div class="drawer-head">
      <div>
        <h2>${q(e.title)}</h2>
        <small>${e.resources.length} resource${e.resources.length===1?"":"s"} in ${q(t.title)}</small>
      </div>
      <button class="btn-icon" id="drawer-close" aria-label="Close">${A("close")}</button>
    </div>
    <div class="drawer-body">
      ${r?`<button class="btn ${s?"":"primary"}" id="drawer-done">${s?"Completed. Undo":"Mark as completed"}</button>`:""}
      ${e.description?`<p>${q(e.description)}</p>`:"<p>No description yet for this topic.</p>"}
      ${Object.entries(h).map(([o,c])=>`
        <div>
          <div class="section-label" style="color:${P[o].color}">${P[o].label} (${c.length})</div>
          <div class="res-list">${c.map(n=>$t(n,i)).join("")}</div>
        </div>`).join("")||'<div class="empty">No linked resources.</div>'}
    </div>`,l.classList.add("open"),l.setAttribute("aria-hidden","false"),l.querySelector("#drawer-close").onclick=lt;const d=l.querySelector("#drawer-done");d&&(d.onclick=()=>{const o=r(e);d.className=`btn ${o?"":"primary"}`,d.textContent=o?"Completed. Undo":"Mark as completed"})}function lt(){const e=jt();e.classList.remove("open"),e.setAttribute("aria-hidden","true")}function ce(e,t){const i=new Map(e.map(d=>[d.id,d])),s=new Map(e.map(d=>[d.title.toLowerCase(),d])),r=new Set,l=((t==null?void 0:t.stages)||[]).map((d,o)=>({id:`s${o}`,title:d.title,topics:(d.topics||[]).map(c=>i.get(c)||s.get(String(c).toLowerCase())).filter(c=>c&&!r.has(c.id)&&r.add(c.id))})).filter(d=>d.topics.length),h=e.filter(d=>!r.has(d.id));return h.length&&l.push({id:`s${l.length}`,title:"More topics",topics:h}),l}const mt={W:1200,CW:200,CH:40,CGAP:8,COLGAP:10,SW:230,SH:46,ROOT_W:300,ROOT_H:56,STAGE_GAP:56,TRUNK:132,PALETTE:["#4f46e5","#3b82f6","#10b981","#f59e0b","#ec4899","#8b5cf6","#06b6d4","#ef4444","#64748b","#84cc16"]};function de(e,t,i){const s=[""];for(const l of e.split(/\s+/)){const h=s[s.length-1],d=h?`${h} ${l}`:l;i(d)<=t?s[s.length-1]=d:s.length<2?s.push(l):s[1]=`${s[1]} ${l}`}const r=l=>{if(i(l)<=t)return l;let h=l;for(;h.length>1&&i(`${h}…`)>t;)h=h.slice(0,-1);return`${h.trimEnd()}…`};return s.map(r)}function he(e,t){const{W:i,CW:s,CH:r,CGAP:l,COLGAP:h,SW:d,SH:o,ROOT_W:c,ROOT_H:n,STAGE_GAP:p,TRUNK:a,PALETTE:m}=mt,u=i/2,f=s-44,g={width:i,root:{x:u-c/2,y:20,w:c,h:n},stages:[],spine:[]};let $=g.root.y+n+p,y={x:u,y:g.root.y+n};e.forEach((L,S)=>{const T=m[S%m.length],I=L.topics.length,O=Math.ceil(I/2),W=I-O,H=k=>k>12?2:1,D=H(O),U=H(W),V=(k,b)=>Math.ceil(k/b),at=Math.max(V(O,D),V(W,U),1),G=at*r+(at-1)*l,J={x:u-d/2,y:$+G/2-o/2,w:d,h:o},v=[],w=(k,b,E)=>{const R=Math.ceil(k.length/E),ht=$+(G-(R*r+(R-1)*l))/2;return k.forEach((N,X)=>{const it=Math.floor(X/R),_=X%R,xt=u+b*(a+8),_t=b<0?xt-s-it*(s+h):xt+it*(s+h),Bt=ht+_*(r+l);v.push({topic:N,x:_t,y:Bt,w:s,h:r,lines:de(N.title,f,t)})}),R};w(L.topics.slice(0,O),-1,D),w(L.topics.slice(O),1,U);const M=[];for(const k of[-1,1]){const b=v.filter(N=>k<0?N.x<u:N.x>u).map(N=>N.y+r/2);if(!b.length)continue;const E=J.y+o/2,R=u+k*a,ht=u+k*(d/2);M.push(`M${ht},${E} H${R}`),M.push(`M${R},${Math.min(E,...b)} V${Math.max(E,...b)}`),[...new Set(b)].forEach(N=>{const X=v.filter(_=>Math.abs(_.y+r/2-N)<1&&(k<0?_.x<u:_.x>u)),it=k<0?Math.min(...X.map(_=>_.x)):Math.max(...X.map(_=>_.x+_.w));M.push(`M${R},${N} H${it}`)})}g.stages.push({index:S,id:L.id,title:L.title,color:T,node:J,chips:v,paths:M,top:$,bottom:$+G,count:I}),g.spine.push(`M${y.x},${y.y} V${J.y}`),y={x:u,y:J.y+o},$+=G+p});const x={x:u-120,y:$-p+40,w:240,h:44};return g.spine.push(`M${y.x},${y.y} V${x.y}`),g.end=x,g.height=x.y+x.h+24,g}let ut;const pe=e=>(ut||(ut=document.createElement("canvas").getContext("2d")),ut.font=e,t=>ut.measureText(t).width);function ue(e,{done:t,query:i="",title:s,sub:r}){const l=he(e,pe("600 11.5px Montserrat, sans-serif")),h=i.trim().toLowerCase(),d=e.reduce((a,m)=>a+m.topics.length,0),o=e.reduce((a,m)=>a+m.topics.filter(u=>t.has(u.id)).length,0),c=[];c.push(`<svg class="flow" viewBox="0 0 ${l.width} ${l.height}" width="${l.width}" height="${l.height}" role="img" aria-label="${q(s)} flowchart">`),l.spine.forEach(a=>c.push(`<path class="spine" d="${a}"/>`));const n=l.root;c.push(`<g class="root"><rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" rx="14"/><text x="${n.x+n.w/2}" y="${n.y+24}" text-anchor="middle" class="root-t">${q(s)}</text><text x="${n.x+n.w/2}" y="${n.y+43}" text-anchor="middle" class="root-s">${q(r)}</text></g>`),l.stages.forEach(a=>{const m=a.chips.filter(f=>t.has(f.topic.id)).length;c.push(`<g id="stage-${a.index}" class="stage" style="--c:${a.color}">`),a.paths.forEach(f=>c.push(`<path class="link" d="${f}"/>`));const u=a.node;c.push(`<g class="snode"><rect x="${u.x}" y="${u.y}" width="${u.w}" height="${u.h}" rx="12"/><text x="${u.x+u.w/2}" y="${u.y+21}" text-anchor="middle" class="sn-t">${q(a.title.length>26?a.title.slice(0,25)+"…":a.title)}</text><text x="${u.x+u.w/2}" y="${u.y+36}" text-anchor="middle" class="sn-s">${m} of ${a.count} done</text></g>`),a.chips.forEach(f=>{const g=t.has(f.topic.id),$=h&&!f.topic.title.toLowerCase().includes(h),y=f.lines.length===1?f.y+f.h/2+4:f.y+f.h/2-3;c.push(`<g class="tchip${g?" done":""}${$?" dim":""}" data-id="${q(f.topic.id)}" tabindex="0" role="button" aria-label="${q(f.topic.title)}${g?", completed":""}">
        <rect class="bg" x="${f.x}" y="${f.y}" width="${f.w}" height="${f.h}" rx="9"/>
        <rect class="strip" x="${f.x}" y="${f.y+8}" width="4" height="${f.h-16}" rx="2"/>
        <text x="${f.x+16}" y="${y}" class="ct">${f.lines.map((x,L)=>`<tspan x="${f.x+16}" dy="${L?14:0}">${q(x)}</tspan>`).join("")}</text>
        <g class="chk" data-act="toggle" role="checkbox" aria-checked="${g}" aria-label="Mark ${q(f.topic.title)} as done"><circle class="ring-c" cx="${f.x+f.w-17}" cy="${f.y+f.h/2}" r="8.5"/><path class="tick" d="M${f.x+f.w-21},${f.y+f.h/2} l3,3 l6,-6"/></g>
      </g>`)}),c.push("</g>")});const p=l.end;return c.push(`<g class="end${o===d&&d?" complete":""}"><rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="22"/><text x="${p.x+p.w/2}" y="${p.y+27}" text-anchor="middle">${o===d&&d?"Roadmap complete":`${o} of ${d} done`}</text></g>`),c.push("</svg>"),{svg:c.join(""),width:l.width,height:l.height,layout:l}}const qt={label:"No resources",color:"#a1a1aa"},Tt=2*Math.PI*38;async function ge(e,{slug:t}){const i=await Z(),s=i.roadmaps.find(v=>v.slug===t);if(!s){e.innerHTML='<div class="page"><div class="empty">Roadmap not found.</div></div>';return}const{topics:r,layout:l}=await Kt(t),h=i.types,d=ce(r,l),o=j[s.category],c=r.length;let n=tt(t);const p=v=>{if(!v.resources.length)return"none";const w={};return v.resources.forEach(M=>w[M[0]]=(w[M[0]]||0)+1),h[+Object.entries(w).sort((M,k)=>k[1]-M[1]||M[0]-k[0])[0][0]]},a=v=>v==="none"?qt.color:dt(P[v].color),m=v=>v==="none"?qt.label:P[v].label,u=r.map(v=>({...v,kind:p(v)})),f=[...new Set(u.map(v=>v.kind))].sort((v,w)=>u.filter(M=>M.kind===w).length-u.filter(M=>M.kind===v).length),g=[...new Set(r.flatMap(v=>v.resources.filter(w=>String(w[2]).startsWith("#/roadmap/")).map(w=>w[2].slice(10))))].map(v=>i.roadmaps.find(w=>w.slug===v)).filter(v=>v&&v.slug!==t),$=h.filter(v=>s.counts[v]).sort((v,w)=>s.counts[w]-s.counts[v]);e.innerHTML=`<div class="page">
    <div class="page-head">
      <div>
        <a class="crumb" href="#/roadmaps">${A("back")}All roadmaps</a>
        <h1>${q(s.title)}</h1>
        <p>${q(Ot(i,s.category))} learning path with ${C(s.topics)} topics in ${d.length} stages</p>
      </div>
      <div class="prog" id="prog"></div>
    </div>
    <details class="card about">
      <summary>What is ${q(s.title)}?</summary>
      <div class="about-body">This path has <b>${C(s.topics)} topics</b> and <b>${C(s.resources)} resources</b>: ${$.slice(0,4).map(v=>`${C(s.counts[v])} ${P[v].label.toLowerCase()}`).join(", ")}. Topics are grouped into <b>${d.length} stages</b>, read from the top of the flowchart to the bottom. Select a topic to see its description and links, and tick the circle to track what you have finished.${s.withoutResources?` ${C(s.withoutResources)} topics do not have linked resources yet.`:""}</div>
    </details>
    <div class="card" style="margin-bottom:20px;padding:16px 22px">${se(s.counts,h)}
      <div class="chips" style="margin-top:14px;gap:18px">${$.map(v=>`<span class="card-sub"><span class="dot" style="background:${P[v].color};margin-right:6px"></span>${P[v].label} <b style="color:var(--ink)">${C(s.counts[v])}</b></span>`).join("")}</div>
    </div>
    <div class="tabs" id="mode">
      <button class="on" data-m="flow">${A("roadmaps")}Flowchart</button>
      <button data-m="graph">${A("graph")}Graph</button>
      <button data-m="list">${A("list")}List</button>
      <button data-m="res">${A("resources")}Resources</button>
    </div>
    <div id="view"></div>
    ${g.length?`<div class="related"><h3>Related roadmaps</h3><div class="chips">${g.map(v=>`<a class="chip" href="#/roadmap/${v.slug}"><span class="dot" style="background:${j[v.category]}"></span>${q(v.title)}</a>`).join("")}</div></div>`:""}
  </div>`;const y=e.querySelector("#view");let x=null,L="",S=1,T=null;const I=()=>{const v=n.size,w=c?v/c:0;e.querySelector("#prog").innerHTML=`<div class="ring"><svg viewBox="0 0 84 84"><circle class="track" cx="42" cy="42" r="38" fill="none" stroke-width="7"/><circle class="val" cx="42" cy="42" r="38" fill="none" stroke-width="7" stroke-linecap="round" stroke-dasharray="${Tt}" stroke-dashoffset="${Tt*(1-w)}"/></svg><b>${Math.round(w*100)}%</b></div>
      <div class="meta"><b>${v} of ${C(c)}</b><span class="card-sub">topics completed</span><div style="margin-top:8px"><button class="btn" id="reset">Reset progress</button></div></div>`,e.querySelector("#reset").onclick=()=>{(!n.size||confirm("Clear your progress on this roadmap?"))&&(ne(t),n=tt(t),I(),T&&V())}},O=new Map(r.map(v=>[v.id,v])),W=v=>{const w=oe(t,v.id);return n=tt(t),I(),w},H=v=>v&&re(v,s,h,{done:n.has(v.id),onToggle:w=>{const M=W(w);return T&&D(),M}}),D=()=>{const v=y.querySelector(".flow-scroll"),w=v==null?void 0:v.scrollLeft,M=v==null?void 0:v.scrollTop;if(U(),v){const k=y.querySelector(".flow-scroll");k.scrollLeft=w,k.scrollTop=M}},U=()=>{const v=ue(d,{done:n,query:L,title:s.title,sub:`${C(c)} topics in ${d.length} stages`}),w=y.querySelector(".flow-scroll");w.innerHTML=v.svg;const M=w.querySelector("svg");S===1?(M.style.width="100%",M.style.height="auto"):(M.style.width=`${v.width*S}px`,M.style.height=`${v.height*S}px`),y.querySelector("#zv").textContent=`${Math.round(S*100)}%`,y.querySelectorAll("[data-stage]").forEach(k=>{const b=v.layout.stages[+k.dataset.stage],E=b.chips.filter(R=>n.has(R.topic.id)).length;k.querySelector("i").textContent=`${E}/${b.count}`})},V=()=>{x==null||x.destroy(),x=null,z.hide(),T=!0,y.innerHTML=`
      <div class="flow-bar">
        <div class="input-wrap">${A("search")}<input class="input" id="fq" placeholder="Find a topic…" value="${q(L)}" /></div>
        <span class="grow"></span>
        <div class="zoom"><button class="btn-icon" data-z="-0.1" aria-label="Zoom out">${A("minus")}</button><span id="zv">100%</span><button class="btn-icon" data-z="0.1" aria-label="Zoom in">${A("plus")}</button><button class="btn-icon" data-z="0" aria-label="Reset zoom">${A("fit")}</button></div>
      </div>
      <div class="stage-nav">${d.map((w,M)=>`<button class="chip" data-stage="${M}"><span class="dot" style="background:${mt.PALETTE[M%mt.PALETTE.length]}"></span>${q(w.title)} <span class="count"><i style="font-style:normal"></i></span></button>`).join("")}</div>
      <div class="flow-scroll"></div>`,U();const v=y.querySelector(".flow-scroll");y.querySelector("#fq").oninput=Q(w=>{L=w.target.value.trim(),U()}),y.querySelectorAll("[data-z]").forEach(w=>w.onclick=()=>{const M=+w.dataset.z;S=M===0?1:Math.min(1.6,Math.max(.5,+(S+M).toFixed(2))),U()}),y.querySelector(".stage-nav").onclick=w=>{var k;const M=w.target.closest("[data-stage]");M&&((k=y.querySelector(`#stage-${M.dataset.stage}`))==null||k.scrollIntoView({behavior:"smooth",block:"start"}))},v.onclick=w=>{const M=w.target.closest(".tchip");if(!M)return;const k=O.get(M.dataset.id);w.target.closest('[data-act="toggle"]')?(W(k),D()):H(k)},v.onkeydown=w=>{var k,b;const M=(b=(k=w.target).closest)==null?void 0:b.call(k,".tchip");M&&(w.key==="Enter"||w.key===" ")&&(w.preventDefault(),H(O.get(M.dataset.id)))}},at=async()=>{T=null,y.innerHTML=`
      <div class="card graph-card">
        <canvas id="g"></canvas>
        <div class="input-wrap" style="position:absolute;top:16px;left:16px;min-width:260px">${A("search")}<input class="input" id="tq" placeholder="Highlight topics…" value="${q(L)}" /></div>
        <div class="graph-tools">
          <button class="btn-icon" data-z="1.25" aria-label="Zoom in">${A("plus")}</button>
          <button class="btn-icon" data-z="0.8" aria-label="Zoom out">${A("minus")}</button>
          <button class="btn-icon" data-fit aria-label="Fit to view">${A("fit")}</button>
        </div>
        <div class="graph-legend">
          <div class="row"><span class="dot" style="background:${o};width:13px;height:13px"></span>${q(s.title)}</div>
          ${f.map(b=>`<div class="row"><span class="dot" style="background:${a(b)}"></span>${m(b)} <span class="card-sub">${u.filter(E=>E.kind===b).length}</span></div>`).join("")}
          <div class="card-sub" style="margin-top:4px">Topic colour = dominant resource type</div>
        </div>
      </div>`;const v=y.querySelector("#g");await document.fonts.ready;const w=[{id:"root",r:26,color:o,label:s.title,always:!0,fixed:!0,x:0,y:0,weight:700,labelSize:13,ring:!0,root:!0}],M=[];f.forEach((b,E)=>{const R=E/f.length*Math.PI*2;w.push({id:`hub:${b}`,r:13,color:a(b),label:m(b),always:!0,weight:700,labelSize:11.5,ring:!0,hub:!0,x:Math.cos(R)*230,y:Math.sin(R)*230,kind:b}),M.push({source:"root",target:`hub:${b}`,dist:230,strength:.6,width:1.6,alpha:.5})}),u.forEach((b,E)=>{w.push({id:`t:${E}`,r:3.2+Math.min(b.resources.length,8)*.55,color:a(b.kind),label:b.title,topic:b,kind:b.kind,weight:500,labelSize:10.5,zoomAt:1.9}),M.push({source:`hub:${b.kind}`,target:`t:${E}`,dist:38+Math.sqrt(u.length)*2.2,strength:.35,alpha:.3,width:.7})}),x=new Pt(v,{repulse:900+Math.sqrt(u.length)*40,gravity:.006,labelZoom:1,onHover:(b,E)=>{b!=null&&b.topic?z.show(`<b>${q(b.topic.title)}</b>${b.topic.resources.length} resources, ${m(b.kind)}`,E.clientX,E.clientY):z.hide()},onSelect:b=>{b!=null&&b.topic?H(b.topic):lt()}}),x.setData(w,M,300);const k=()=>x.setFilter(L?b=>{var E;return b.root||b.hub||((E=b.topic)==null?void 0:E.title.toLowerCase().includes(L.toLowerCase()))}:null);k(),y.querySelector("#tq").oninput=Q(b=>{L=b.target.value.trim(),k()}),y.querySelectorAll("[data-z]").forEach(b=>b.onclick=()=>x.zoomBy(+b.dataset.z)),y.querySelector("[data-fit]").onclick=()=>x.fit()},G=()=>{x==null||x.destroy(),x=null,T=null,z.hide(),y.innerHTML=`
      <div class="toolbar"><div class="input-wrap">${A("search")}<input class="input" id="lq" placeholder="Search topics…" value="${q(L)}" /></div></div>
      <div class="card"><div class="res-list" id="topics"></div><div class="more" id="more"></div></div>`;let v=40;const w=()=>{const M=L.toLowerCase(),k=u.filter(E=>E.title.toLowerCase().includes(M));y.querySelector("#topics").innerHTML=k.slice(0,v).map(E=>`<a class="res" href="javascript:void(0)" data-i="${u.indexOf(E)}">
          <span class="dot" style="background:${n.has(E.id)?"#10b981":a(E.kind)};width:11px;height:11px"></span>
          <span><div class="res-title">${q(E.title)}</div><div class="res-meta">${E.resources.length} resource${E.resources.length===1?"":"s"}${n.has(E.id)?", completed":""}</div></span>
          <span class="card-sub">${m(E.kind)}</span></a>`).join("")||'<div class="empty">No topics match.</div>',y.querySelector("#more").innerHTML=k.length>v?`<button class="btn" id="more-btn">Show more (${k.length-v})</button>`:"";const b=y.querySelector("#more-btn");b&&(b.onclick=()=>{v+=60,w()})};y.querySelector("#lq").oninput=Q(M=>{L=M.target.value.trim(),v=40,w()}),y.querySelector("#topics").onclick=M=>{const k=M.target.closest("[data-i]");k&&H(u[+k.dataset.i])},w()},J=()=>{x==null||x.destroy(),x=null,T=null,z.hide();const v=[];r.forEach(b=>b.resources.forEach(E=>v.push({r:E,topic:b.title})));let w="all",M=50;y.innerHTML=`<div class="chips" id="rchips" style="margin-bottom:16px"><button class="chip on" data-t="all">All <span class="count">${v.length}</span></button>${$.map(b=>`<button class="chip" data-t="${b}"><span class="dot" style="background:${P[b].color}"></span>${P[b].label} <span class="count">${s.counts[b]}</span></button>`).join("")}</div>
      <div class="card"><div class="res-list" id="rl"></div><div class="more" id="rm"></div></div>`;const k=()=>{const b=v.filter(R=>w==="all"||h[R.r[0]]===w);y.querySelector("#rl").innerHTML=b.slice(0,M).map(R=>$t(R.r,h)).join("")||'<div class="empty">Nothing here.</div>',y.querySelector("#rm").innerHTML=b.length>M?`<button class="btn" id="rmb">Show more (${b.length-M})</button>`:"";const E=y.querySelector("#rmb");E&&(E.onclick=()=>{M+=80,k()})};y.querySelector("#rchips").onclick=b=>{const E=b.target.closest("[data-t]");E&&(w=E.dataset.t,M=50,y.querySelectorAll("#rchips .chip").forEach(R=>R.classList.toggle("on",R===E)),k())},k()};return e.querySelector("#mode").onclick=v=>{const w=v.target.closest("[data-m]");w&&(e.querySelectorAll("#mode button").forEach(M=>M.classList.toggle("on",M===w)),lt(),{flow:V,graph:at,list:G,res:J}[w.dataset.m]())},I(),V(),()=>{x==null||x.destroy(),z.hide(),lt()}}function Nt(e,{preset:t}){return(async()=>{var n;const[i,s]=await Promise.all([Z(),Xt()]),r=i.types,l={q:"",type:t||"all",rm:"all",shown:60},h=t==="video";e.innerHTML=`<div class="page">
      ${st({title:h?"Video library":"Resource library",sub:h?`${C(i.totals.byType.video)} curated YouTube lessons, playlists and courses linked across the roadmaps.`:`${C(i.totals.resources)} curated links — articles, official docs, videos, courses, books and more.`})}
      <div class="toolbar">
        <div class="input-wrap">${A("search")}<input class="input" id="q" placeholder="Search ${h?"videos":"resources"}…" /></div>
        <select class="input" id="rm"><option value="all">All roadmaps</option>${i.roadmaps.map((p,a)=>`<option value="${a}">${q(p.title)}</option>`).join("")}</select>
      </div>
      ${h?"":`<div class="chips" id="chips" style="margin-bottom:20px">
        <button class="chip on" data-t="all">All <span class="count">${C(i.totals.resources)}</span></button>
        ${r.map((p,a)=>`<button class="chip" data-t="${a}"><span class="dot" style="background:${P[p].color}"></span>${P[p].label} <span class="count">${C(i.totals.byType[p])}</span></button>`).join("")}
      </div>`}
      <div class="card"><div class="card-head"><div class="card-title" id="count"></div></div><div class="res-list" id="list"></div><div class="more" id="more"></div></div>
    </div>`;const d=h?r.indexOf("video"):l.type==="all"?-1:+l.type;l.t=d;const o=e.querySelector("#list"),c=()=>{const p=l.q.toLowerCase(),a=s.filter(u=>(l.t===-1||u[0]===l.t)&&(l.rm==="all"||u[3]===+l.rm)&&(!p||u[1].toLowerCase().includes(p)||u[4].toLowerCase().includes(p)));e.querySelector("#count").textContent=`${C(a.length)} result${a.length===1?"":"s"}`,o.innerHTML=a.slice(0,l.shown).map(u=>$t(u,r,!1).replace('<div class="res-title">','<div class="res-title">').replace(/<\/div><\/span>/,`</div><div class="res-meta">${q(u[4])} · ${q(i.roadmaps[u[3]].title)}</div></span>`)).join("")||'<div class="empty">Nothing matches your filters.</div>',e.querySelector("#more").innerHTML=a.length>l.shown?'<button class="btn" id="more-btn">Show more</button>':"";const m=e.querySelector("#more-btn");m&&(m.onclick=()=>{l.shown+=100,c()})};e.querySelector("#q").oninput=Q(p=>{l.q=p.target.value.trim(),l.shown=60,c()}),e.querySelector("#rm").onchange=p=>{l.rm=p.target.value,l.shown=60,c()},(n=e.querySelector("#chips"))==null||n.addEventListener("click",p=>{const a=p.target.closest("[data-t]");a&&(l.t=a.dataset.t==="all"?-1:+a.dataset.t,l.shown=60,e.querySelectorAll(".chip").forEach(m=>m.classList.toggle("on",m===a)),c())}),c()})()}const me=e=>Nt(e,{}),ve=e=>Nt(e,{preset:"video"});function fe(e,t,i,{onRowClick:s}={}){const o=Math.max(...t.flatMap(m=>m.values),1);let c=null;const n=()=>{const m=44+t.length*32+8,{ctx:u,w:f}=bt(e,m),g=et();u.clearRect(0,0,f,m);const $=Math.max(48,(f-214)/i.length-4);u.textBaseline="middle",u.font="600 11px Montserrat, sans-serif",u.textAlign="center",i.forEach((y,x)=>{u.fillStyle=g.muted,u.fillText(y.label,214+x*($+4)+$/2,44/2)}),t.forEach((y,x)=>{const L=44+x*32;u.textAlign="right",u.font=`${(c==null?void 0:c.i)===x?700:500} 12px Montserrat, sans-serif`,u.fillStyle=(c==null?void 0:c.i)===x?g.ink:g.muted,u.fillText(y.label,200,L+28/2),y.values.forEach((S,T)=>{const I=214+T*($+4);if(kt(u,I,L,$,28,7),u.fillStyle=g.border,u.globalAlpha=.45,u.fill(),S>0){const O=Math.log1p(S)/Math.log1p(o);u.globalAlpha=.14+O*.86,u.fillStyle=dt(p(i,T).color),u.fill(),O>.45&&$>44&&(u.globalAlpha=1,u.fillStyle="#fff",u.textAlign="center",u.font="600 10.5px Montserrat, sans-serif",u.fillText(C(S),I+$/2,L+28/2+.5))}u.globalAlpha=1,c&&c.i===x&&c.j===T&&(kt(u,I-1,L-1,$+2,30,8),u.strokeStyle=g.ink,u.lineWidth=2,u.stroke())})}),e._geo={cw:$}},p=(m,u)=>m[u];e.onmousemove=m=>{const u=e.getBoundingClientRect(),f=m.clientX-u.left,g=m.clientY-u.top,$=e._geo.cw,y=Math.floor((f-214)/($+4)),x=Math.floor((g-44)/32),L=x>=0&&x<t.length&&y>=0&&y<i.length&&f>=214,S=L?{i:x,j:y}:x>=0&&x<t.length&&f<214?{i:x,j:-1}:null;JSON.stringify(S)!==JSON.stringify(c)&&(c=S,n()),e.style.cursor=S?"pointer":"default",L?z.show(`<b>${t[x].label}</b><span>${i[y].label}: </span>${C(t[x].values[y])}`,m.clientX,m.clientY):z.hide()},e.onmouseleave=()=>{c=null,n(),z.hide()},e.onclick=()=>{c&&(s==null||s(t[c.i]))},n();const a=yt(e,n);return window.addEventListener("themechange",n),{destroy(){a(),window.removeEventListener("themechange",n)}}}function be(e,t,{xLabel:i,yLabel:s,height:r=420,onClick:l}={}){const h={l:62,r:24,t:20,b:52};let d=null,o=[];const c=a=>{const m=10**Math.floor(Math.log10(a)),u=a/m;return(u<=1?1:u<=2?2:u<=5?5:10)*m},n=()=>{const{ctx:a,w:m,h:u}=bt(e,r),f=et();a.clearRect(0,0,m,u);const g=c(Math.max(...t.map(S=>S.x))*1.05),$=c(Math.max(...t.map(S=>S.y))*1.05),y=S=>h.l+S/g*(m-h.l-h.r),x=S=>u-h.b-S/$*(u-h.t-h.b);a.font="500 11px Montserrat, sans-serif",a.textBaseline="middle",a.lineWidth=1;for(let S=0;S<=4;S++){const T=$/4*S,I=x(T);a.strokeStyle=f.border,a.beginPath(),a.moveTo(h.l,I),a.lineTo(m-h.r,I),a.stroke(),a.fillStyle=f.faint,a.textAlign="right",a.fillText(C(Math.round(T)),h.l-12,I)}a.textAlign="center",a.textBaseline="top";for(let S=0;S<=4;S++){const T=g/4*S;a.fillStyle=f.faint,a.fillText(C(Math.round(T)),y(T),u-h.b+12)}a.fillStyle=f.muted,a.font="600 11px Montserrat, sans-serif",a.fillText(i,(h.l+m-h.r)/2,u-18),a.save(),a.translate(16,(h.t+u-h.b)/2),a.rotate(-Math.PI/2),a.textBaseline="middle",a.fillText(s,0,0),a.restore(),o=t.map(S=>({p:S,x:y(S.x),y:x(S.y),r:S.size})),o.forEach(({p:S,x:T,y:I,r:O})=>{a.globalAlpha=d&&d.p!==S?.35:.82,a.fillStyle=S.color,a.beginPath(),a.arc(T,I,O,0,6.2832),a.fill(),a.globalAlpha=1,a.lineWidth=1.5,a.strokeStyle=f.bg,a.stroke()});const L=[...o].sort((S,T)=>T.p.y-S.p.y).slice(0,7);a.textAlign="left",a.textBaseline="middle",a.font="600 11px Montserrat, sans-serif",L.forEach(({p:S,x:T,y:I,r:O})=>{a.lineWidth=4,a.strokeStyle=f.bg,a.strokeText(S.label,T+O+6,I),a.fillStyle=f.ink,a.fillText(S.label,T+O+6,I)})};e.onmousemove=a=>{const m=e.getBoundingClientRect(),u=a.clientX-m.left,f=a.clientY-m.top,g=[...o].reverse().find($=>($.x-u)**2+($.y-f)**2<=($.r+3)**2)||null;((g==null?void 0:g.p)??null)!==((d==null?void 0:d.p)??null)&&(d=g,n()),e.style.cursor=g?"pointer":"default",g?z.show(`<b>${g.p.label}</b>${C(g.p.x)} topics · ${C(g.p.y)} resources`,a.clientX,a.clientY):z.hide()},e.onmouseleave=()=>{d=null,n(),z.hide()},e.onclick=()=>d&&(l==null?void 0:l(d.p)),n();const p=yt(e,n);return window.addEventListener("themechange",n),{destroy(){p(),window.removeEventListener("themechange",n)}}}async function ye(e){const t=await Z(),{roadmaps:i,types:s}=t,r=[...i].sort((p,a)=>a.resources-p.resources).slice(0,24),l=i.filter(p=>p.topics>=15).map(p=>({r:p,v:p.resources/p.topics})).sort((p,a)=>a.v-p.v),h=[...i].sort((p,a)=>a.counts.video-p.counts.video).slice(0,8);e.innerHTML=`<div class="page">
    ${st({title:"Insights",sub:"Where the learning material lives: resource density by roadmap, size versus depth, and the richest topics per resource."})}
    <div class="stack">
      <div class="card">
        <div class="card-head"><div class="card-title">Resource heatmap</div><div class="card-sub">Top 24 roadmaps · colour intensity is log-scaled</div></div>
        <canvas class="chart-canvas" id="heat"></canvas>
      </div>
      <div class="card">
        <div class="card-head"><div class="card-title">Size vs. depth</div><div class="card-sub">Each bubble is a roadmap, coloured by category</div></div>
        <canvas class="chart-canvas" id="scatter"></canvas>
        <div class="chips" style="margin-top:12px;gap:18px">${t.categories.map(p=>`<span class="card-sub"><span class="dot" style="background:${j[p.id]};margin-right:6px"></span>${p.label}</span>`).join("")}</div>
      </div>
      <div class="grid grid-2">
        <div class="card">
          <div class="card-head"><div class="card-title">Richest resource density</div><div class="card-sub">Resources per topic · ≥15 topics</div></div>
          ${ct(l.slice(0,8).map(({r:p,v:a})=>({label:p.title,value:+a.toFixed(2),color:j[p.category],slug:p.slug})),{href:p=>`#/roadmap/${p.slug}`})}
        </div>
        <div class="card">
          <div class="card-head"><div class="card-title">Most video-rich roadmaps</div><div class="card-sub">Video links</div></div>
          ${ct(h.map(p=>({label:p.title,value:p.counts.video,color:dt(P.video.color),slug:p.slug})),{href:p=>`#/roadmap/${p.slug}`})}
        </div>
      </div>
    </div>
  </div>`;const d=s.map(p=>({key:p,label:P[p].single,color:P[p].color})),o=r.map(p=>({key:p.slug,label:p.title,values:s.map(a=>p.counts[a])})),c=fe(e.querySelector("#heat"),o,d,{onRowClick:p=>location.hash=`#/roadmap/${p.key}`}),n=be(e.querySelector("#scatter"),i.map(p=>({id:p.slug,label:p.title,x:p.topics,y:p.resources,color:j[p.category],size:5+Math.sqrt(p.counts.video)*.7})),{xLabel:"Topics",yLabel:"Resources",onClick:p=>location.hash=`#/roadmap/${p.id}`});return()=>{c.destroy(),n.destroy()}}function $e(e){if(Y()){location.hash="#/";return}let t="",i=!1;function s(){const h=It();e.innerHTML=`
      <div class="login-wrapper">
        <div class="login-decor-bg"></div>
        <div class="login-box">
          <div class="login-header">
            <div class="login-brand">
              <span class="brand-mark">${Ct}</span>
              <div>
                <div class="login-app-title">builderportal</div>
                <div class="login-app-sub">The 404 Society · Internal Platform</div>
              </div>
            </div>
            <div class="login-badge-pill">Member Only</div>
          </div>

          <div class="login-card">
            <div class="login-card-header">
              <div class="login-welcome-title">Welcome, Builder</div>
              <p class="login-welcome-desc">
                Sign in using the unique Member ID sent to your email upon community acceptance.
              </p>
            </div>

            ${t?`<div class="login-alert error">${t}</div>`:""}

            <form id="signin-form" class="login-form">
              <div class="form-group">
                <div class="form-label-row">
                  <label for="member-id">Unique Member ID</label>
                  <span class="id-hint">Check your acceptance mail</span>
                </div>
                <div class="input-wrap login-input-wrap">
                  ${A("badge")}
                  <input
                    type="text"
                    id="member-id"
                    name="memberId"
                    class="input login-input"
                    placeholder="e.g. 404-9F82"
                    autocomplete="username"
                    required
                    autofocus
                    spellcheck="false"
                  />
                </div>
              </div>

              <div class="form-group">
                <div class="form-label-row">
                  <label for="password">Password</label>
                  <span class="password-hint">Common: <code>${rt}</code></span>
                </div>
                <div class="input-wrap login-input-wrap">
                  ${A("lock")}
                  <input
                    type="password"
                    id="password"
                    name="password"
                    class="input login-input"
                    value="${rt}"
                    autocomplete="current-password"
                    required
                  />
                  <button type="button" class="btn-toggle-pass" id="btn-toggle-pass" title="Toggle password visibility">
                    👁
                  </button>
                </div>
              </div>

              <button type="submit" class="btn primary btn-login-submit" ${i?"disabled":""}>
                <span>${i?"Authenticating...":"Enter Portal"}</span>
                ${A("back","icon-flip")}
              </button>

              <div class="quick-roster-section">
                <div class="quick-roster-title">
                  <span>Core Roster Members</span>
                  <span class="count">${h.length} unique IDs</span>
                </div>
                <div class="roster-chips">
                  ${h.map(d=>`
                    <button
                      type="button"
                      class="roster-chip"
                      data-id="${d.id}"
                      title="Select ${d.name} (${d.role}) — ${d.id}"
                    >
                      <span class="chip-avatar">${r(d.name)}</span>
                      <div class="chip-text">
                        <span class="chip-name">${d.name}</span>
                        <span class="chip-id">${d.id}</span>
                      </div>
                    </button>
                  `).join("")}
                </div>
              </div>
            </form>
          </div>

          <div class="login-footer">
            <p>Member accounts are automatically synchronized from community database approvals.</p>
          </div>
        </div>
      </div>
    `,l()}function r(h){if(!h)return"??";const d=h.trim().split(/\s+/);return d.length===1?d[0].slice(0,2).toUpperCase():(d[0][0]+d[d.length-1][0]).toUpperCase()}function l(){const h=e.querySelector("#btn-toggle-pass"),d=e.querySelector("#password");h&&d&&h.addEventListener("click",()=>{const c=d.type==="password";d.type=c?"text":"password",h.textContent=c?"🔒":"👁"}),e.querySelectorAll(".roster-chip").forEach(c=>{c.addEventListener("click",()=>{const n=c.dataset.id,p=e.querySelector("#member-id");p&&(p.value=n,p.focus())})});const o=e.querySelector("#signin-form");o&&o.addEventListener("submit",async c=>{var a,m,u,f;c.preventDefault();const n=((m=(a=e.querySelector("#member-id"))==null?void 0:a.value)==null?void 0:m.trim())||"",p=((f=(u=e.querySelector("#password"))==null?void 0:u.value)==null?void 0:f.trim())||"";t="",i=!0,s();try{await Dt(n,p),location.hash="#/"}catch(g){t=g.message||"Login failed",i=!1,s()}})}return s(),()=>{}}const At=Jt(document.getElementById("app"));F("/login",$e);F("/",ae);F("/universe",ie);F("/roadmaps",le);F("/roadmap/:slug",ge);F("/resources",me);F("/videos",ve);F("/insights",ye);const wt=()=>Zt(At).catch(e=>{console.error(e),At.innerHTML=`<div class="page"><div class="empty">Something went wrong loading this page.<br>${String(e.message)}</div></div>`});window.addEventListener("hashchange",wt);window.addEventListener("authchange",wt);document.fonts.load("600 14px Montserrat").finally(wt);
