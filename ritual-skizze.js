(function(){
  var KEY="rr25_skizze";
  var ZKEY="rr25_tagesziel_v1";
  var A='<svg viewBox="0 0 360 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><filter id="g3" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><line x1="108" y1="78" x2="148" y2="78" stroke="rgba(180,160,210,.55)" stroke-width="2"/><line x1="212" y1="78" x2="252" y2="78" stroke="rgba(180,160,210,.55)" stroke-width="2"/><circle cx="68" cy="78" r="42" fill="#0b0526" stroke="#d4b8ee" stroke-width="2.4" filter="url(#g3)"/><circle cx="180" cy="78" r="42" fill="#0b0526" stroke="#7ef0e6" stroke-width="2.6" filter="url(#g3)"/><circle cx="292" cy="78" r="42" fill="#0b0526" stroke="#ff4fe0" stroke-width="2.4" filter="url(#g3)"/><text class="sy" x="68" y="92" text-anchor="middle" font-size="38" font-family="Apple Color Emoji,Noto Color Emoji,Segoe UI Emoji,sans-serif">❤️</text><text class="wd" x="68" y="88" text-anchor="middle" font-size="22" fill="#f6eefe" font-family="Georgia,serif">Ich</text><text class="sy" x="180" y="92" text-anchor="middle" font-size="38" font-family="Apple Color Emoji,Noto Color Emoji,Segoe UI Emoji,sans-serif">🙏</text><text class="wd" x="180" y="88" text-anchor="middle" font-size="22" fill="#e8fff8" font-family="Georgia,serif">Spiel</text><text class="sy" x="292" y="92" text-anchor="middle" font-size="38" font-family="Apple Color Emoji,Noto Color Emoji,Segoe UI Emoji,sans-serif">👁</text><text class="wd" x="292" y="88" text-anchor="middle" font-size="20" fill="#ffe6f6" font-family="Georgia,serif">Quelle</text><text class="sose" x="180" y="176" text-anchor="middle" font-size="19" font-style="italic" letter-spacing="5" fill="#cbb6ee" fill-opacity=".78" font-family="Georgia,serif">So sei es</text></svg>';
  var B='<svg viewBox="0 0 360 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><filter id="gE" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><line x1="108" y1="78" x2="148" y2="78" stroke="rgba(180,160,210,.55)" stroke-width="2"/><line x1="212" y1="78" x2="252" y2="78" stroke="rgba(180,160,210,.55)" stroke-width="2"/><circle cx="68" cy="78" r="42" fill="#0b0526" stroke="#7ec8a0" stroke-width="2.4" filter="url(#gE)"/><circle cx="180" cy="78" r="42" fill="#0b0526" stroke="#c0aad8" stroke-width="2.4" filter="url(#gE)"/><circle cx="292" cy="78" r="42" fill="#0b0526" stroke="#e8c070" stroke-width="2.4" filter="url(#gE)"/><text class="sy" x="68" y="92" text-anchor="middle" font-size="38" font-family="Apple Color Emoji,Noto Color Emoji,Segoe UI Emoji,sans-serif">❤️</text><text class="wd" x="68" y="84" text-anchor="middle" font-size="15" fill="#d8f0e4" font-family="Georgia,serif">Ich</text><text class="sy" x="180" y="92" text-anchor="middle" font-size="38" font-family="Apple Color Emoji,Noto Color Emoji,Segoe UI Emoji,sans-serif">🙏</text><text class="wd" x="180" y="84" text-anchor="middle" font-size="15" fill="#eee4f8" font-family="Georgia,serif">Spiel</text><text class="sy" x="292" y="92" text-anchor="middle" font-size="38" font-family="Apple Color Emoji,Noto Color Emoji,Segoe UI Emoji,sans-serif">👁</text><text class="wd" x="292" y="84" text-anchor="middle" font-size="15" fill="#f8e8c0" font-family="Georgia,serif">Quelle</text><text class="sose" x="180" y="176" text-anchor="middle" font-size="19" font-style="italic" letter-spacing="5" fill="#cbb6ee" fill-opacity=".78" font-family="Georgia,serif">So sei es</text></svg>';
  function today(){
    var n=new Date();
    return n.getFullYear()+"-"+String(n.getMonth()+1).padStart(2,"0")+"-"+String(n.getDate()).padStart(2,"0");
  }
  function loadZ(){ try{ return JSON.parse(localStorage.getItem(ZKEY)||"{}"); }catch(e){ return {}; } }
  function saveZ(d){ try{ localStorage.setItem(ZKEY, JSON.stringify(d)); }catch(e){} }
  function locked(){
    var d=loadZ();
    return (d.day===today() && d.txt) ? d : null;
  }
  function esc(s){ return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;"); }
  function mode(){ try{ return localStorage.getItem(KEY)==="emu"?"emu":"369"; }catch(e){ return "369"; } }
  function setMode(m){ try{ localStorage.setItem(KEY,m); }catch(e){} }
  function startOnly(){ return !document.querySelector("#cats .chip.on"); }
  function toLog(txt){
    if(typeof load!=="function"||typeof save!=="function") return;
    var d=load(); d.log=d.log||[];
    var day=today();
    if(d.log.some(function(e){ return e.titel==="Tagesziel" && String(e.day||"")===day; })) return;
    d.log.unshift({
      id: typeof uid==="function"?uid():("z"+Date.now().toString(36)),
      t: typeof now==="function"?now():new Date().toLocaleString("de-CH"),
      titel:"Tagesziel", wer:txt, note:txt, day:day
    });
    try{ save(d); }catch(e){}
  }
  function bindForm(el){
    var go=el.querySelector("#skZielGo");
    var inp=el.querySelector("#skZielT");
    if(!go||!inp||go._on) return;
    go._on=1;
    go.onclick=function(ev){
      ev.preventDefault(); ev.stopPropagation();
      var t=String(inp.value||"").trim().slice(0,180);
      if(!t) return;
      saveZ({day:today(), txt:t});
      toLog(t);
      draw(el, true);
    };
  }
  /* Build 62: Worte-Zustand bleibt bis zum nächsten Antippen (kein Timer) und überlebt jedes Neuzeichnen */
  var WORDS=false;
  function applyWords(el){ var q=el&&el.querySelector("svg"); if(q) q.classList.toggle("w",WORDS); }
  function draw(el, force){
    if(!el) return;
    var z=locked();
    if(!force && !z && el.querySelector("#skZielT")) { bindForm(el); return; }
    var svg=mode()==="emu"?B:A;
    if(z){
      el.innerHTML=svg+'<div class="skZiel"><small>Tagesziel</small><b>'+esc(z.txt)+'</b></div>';
    } else {
      el.innerHTML=svg+'<div class="skForm"><small>Tagesziel</small><input id="skZielT" maxlength="180" placeholder="Ein Satz für heute" autocomplete="off"><button type="button" class="btn primary" id="skZielGo">Setzen</button></div>';
      bindForm(el);
    }
    applyWords(el);
  }
  function mount(){
    var home=document.getElementById("home");
    var list=document.getElementById("list");
    if(!home) return null;
    var el=document.getElementById("skizze");
    if(!el){
      el=document.createElement("div");
      el.id="skizze";
      if(list) home.insertBefore(el, list); else home.appendChild(el);
      /* Build 62: Antippen wechselt zwischen Symbolen und den Worten Ich / Spiel / Quelle; die Worte bleiben, bis erneut getippt wird */
      el.addEventListener("click", function(ev){
        if(ev.target.closest && (ev.target.closest(".skZiel")||ev.target.closest(".skForm"))) return;
        ev.stopPropagation(); ev.preventDefault();
        if(!el.querySelector("svg")) return;
        WORDS=!WORDS; applyWords(el);
      });
      draw(el,true);
    }
    return el;
  }
  function paint(){
    var el=mount();
    if(!el) return;
    el.style.display=startOnly()?"block":"none";
    if(!el.querySelector("svg")) draw(el,true);
    else if(locked() && el.querySelector("#skZielT")) draw(el,true);
    else if(!locked() && el.querySelector(".skZiel")) draw(el,true);
    applyWords(el);
  }
  var css=document.createElement("style");
  css.textContent=[
    "#skizze{display:block;margin:.35rem auto .55rem;width:100%;max-width:26rem;cursor:pointer}",
    "#skizze svg{display:block;width:100%;height:13.2rem}",
    "#skizze .skZiel,#skizze .skForm{cursor:default;background:rgba(48,18,72,.7);border:1px solid rgba(150,170,255,.28);border-radius:1.15rem;padding:.62rem .8rem;margin:.05rem 0 0}",
    "#skizze .skZiel small,#skizze .skForm small{display:block;letter-spacing:.14em;text-transform:uppercase;font-size:.58rem;color:#ff4fe0;margin:0 0 .2rem}",
    "#skizze .skZiel b{display:block;font-family:Georgia,serif;font-weight:500;font-size:1.02rem;color:#eaf2ff}",
    "#skizze .skForm input{text-align:left;margin:.1rem 0 .35rem}",
    "#home:has(#cats .chip.on) #skizze{display:none!important}",
    "#skizze{-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none;touch-action:manipulation}",
    "#skizze svg .sy,#skizze svg .wd{transition:opacity .4s ease}",
    "#skizze svg .wd{opacity:0}#skizze svg.w .wd{opacity:1}#skizze svg.w .sy{opacity:0}",
    "@media (prefers-reduced-motion:reduce){#skizze svg .sy,#skizze svg .wd{transition:none}}",
    "#skizze svg circle{animation:skNeon 6.5s ease-in-out infinite}",
    "@keyframes skNeon{0%,100%{opacity:.9}50%{opacity:1}}",
    "@media (prefers-reduced-motion:reduce){#skizze svg circle{animation:none}}",
    /* Build 117: Tagesziel-Karte zeigt nur den Satz, kein Zeichen, kein Bild; Höhe nach Inhalt */
    "html body #skizze .skZiel{height:auto!important;min-height:0!important;max-height:none!important;background-image:none!important;overflow:hidden}",
    "html body #skizze .skZiel>:not(small):not(b),html body #skizze .skZiel svg,html body #skizze .skZiel canvas,html body #skizze .skZiel img{display:none!important}",
    "html body #skizze .skZiel::before,html body #skizze .skZiel::after,html body #skizze .skZiel b::before,html body #skizze .skZiel b::after{content:none!important;display:none!important;background:none!important}",
    "html body #skizze .skZiel b{overflow-wrap:anywhere}"
  ].join("");
  document.head.appendChild(css);
  mount(); paint();
  if(typeof renderList==="function" && !renderList._sk){
    var rl=renderList; renderList=function(){ rl(); paint(); }; renderList._sk=1;
  }
  if(typeof show==="function" && !show._sk){
    var sh=show;
    show=function(id){ var r=sh.apply(this,arguments); if(id==="home") setTimeout(paint,30); return r; };
    show._sk=1;
  }
})();
