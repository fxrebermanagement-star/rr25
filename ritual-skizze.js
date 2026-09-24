(function(){
  var KEY="rr25_skizze";
  var ZKEY="rr25_tagesziel_v1";
  var A='<svg viewBox="0 0 360 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><filter id="g3" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><line x1="108" y1="78" x2="148" y2="78" stroke="rgba(180,160,210,.55)" stroke-width="2"/><line x1="212" y1="78" x2="252" y2="78" stroke="rgba(180,160,210,.55)" stroke-width="2"/><circle cx="68" cy="78" r="42" fill="#0b0814" stroke="#d4b8ee" stroke-width="2.4" filter="url(#g3)"/><circle cx="180" cy="78" r="42" fill="#0b0814" stroke="#7ef0e6" stroke-width="2.6" filter="url(#g3)"/><circle cx="292" cy="78" r="42" fill="#0b0814" stroke="#ff7ad9" stroke-width="2.4" filter="url(#g3)"/><text x="68" y="90" text-anchor="middle" font-size="34" fill="#f6eefe" font-family="Georgia,serif">3</text><text x="180" y="90" text-anchor="middle" font-size="34" fill="#e8fff8" font-family="Georgia,serif">6</text><text x="292" y="90" text-anchor="middle" font-size="34" fill="#ffe6f6" font-family="Georgia,serif">9</text><text x="68" y="140" text-anchor="middle" font-size="13" fill="#c8b6dc" font-family="system-ui,sans-serif">stehen</text><text x="180" y="140" text-anchor="middle" font-size="13" fill="#9ee8e0" font-family="system-ui,sans-serif">tragen</text><text x="292" y="140" text-anchor="middle" font-size="13" fill="#f0b4d4" font-family="system-ui,sans-serif">siegeln</text><path d="M268 168 C 180 204, 180 204, 92 168" fill="none" stroke="rgba(200,160,190,.7)" stroke-width="1.8"/><polyline points="102,176 92,168 104,163" fill="none" stroke="rgba(200,160,190,.7)" stroke-width="1.8"/></svg>';
  var B='<svg viewBox="0 0 360 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><filter id="gE" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><line x1="108" y1="78" x2="148" y2="78" stroke="rgba(180,160,210,.55)" stroke-width="2"/><line x1="212" y1="78" x2="252" y2="78" stroke="rgba(180,160,210,.55)" stroke-width="2"/><circle cx="68" cy="78" r="42" fill="#0b0814" stroke="#7ec8a0" stroke-width="2.4" filter="url(#gE)"/><circle cx="180" cy="78" r="42" fill="#0b0814" stroke="#c0aad8" stroke-width="2.4" filter="url(#gE)"/><circle cx="292" cy="78" r="42" fill="#0b0814" stroke="#e8c070" stroke-width="2.4" filter="url(#gE)"/><text x="68" y="84" text-anchor="middle" font-size="15" fill="#d8f0e4" font-family="Georgia,serif">Erde</text><text x="180" y="84" text-anchor="middle" font-size="15" fill="#eee4f8" font-family="Georgia,serif">Mensch</text><text x="292" y="84" text-anchor="middle" font-size="13" fill="#f8e8c0" font-family="Georgia,serif">Universum</text><text x="68" y="140" text-anchor="middle" font-size="13" fill="#c8b6dc" font-family="system-ui,sans-serif">stehen</text><text x="180" y="140" text-anchor="middle" font-size="13" fill="#9ee8e0" font-family="system-ui,sans-serif">tragen</text><text x="292" y="140" text-anchor="middle" font-size="13" fill="#c8b080" font-family="system-ui,sans-serif">siegeln</text><path d="M268 168 C 180 204, 180 204, 92 168" fill="none" stroke="rgba(200,160,190,.7)" stroke-width="1.8"/><polyline points="102,176 92,168 104,163" fill="none" stroke="rgba(200,160,190,.7)" stroke-width="1.8"/></svg>';
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
      el.addEventListener("click", function(ev){
        if(ev.target.closest && (ev.target.closest(".skZiel")||ev.target.closest(".skForm"))) return;
        ev.stopPropagation();
        setMode(mode()==="emu"?"369":"emu");
        var keep=el.querySelector("#skZielT")?el.querySelector("#skZielT").value:"";
        var s=el.querySelector("svg");
        if(s) s.outerHTML=(mode()==="emu"?B:A);
        else draw(el,true);
        var inp=el.querySelector("#skZielT");
        if(inp) inp.value=keep;
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
  }
  var css=document.createElement("style");
  css.textContent=[
    "#skizze{display:block;margin:.35rem auto .55rem;width:100%;max-width:26rem;cursor:pointer}",
    "#skizze svg{display:block;width:100%;height:13.2rem}",
    "#skizze .skZiel,#skizze .skForm{cursor:default;background:rgba(48,18,72,.7);border:1px solid rgba(126,200,255,.2);border-radius:1.15rem;padding:.62rem .8rem;margin:.05rem 0 0}",
    "#skizze .skZiel small,#skizze .skForm small{display:block;letter-spacing:.14em;text-transform:uppercase;font-size:.58rem;color:#ff7ad9;margin:0 0 .2rem}",
    "#skizze .skZiel b{display:block;font-family:Georgia,serif;font-weight:500;font-size:1.02rem;color:#f6f0ff}",
    "#skizze .skForm input{text-align:left;margin:.1rem 0 .35rem}",
    "#home:has(#cats .chip.on) #skizze{display:none!important}"
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
