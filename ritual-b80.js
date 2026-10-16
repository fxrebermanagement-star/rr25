/* ritual-b80.js — Build 80: Mondkarte (Tipp aufs Mond-Symbol), Wochenfarbe am Heute-Rand, stilles «So sei es» nach dem Ritual.
   Alles Overlay oder Farbe: keine neue Zeile auf der Heute-Seite. Zeiten in Berner Zeit (Europe/Zurich). Kein Ton, keine Vibration. */
(function(){
  if(window.__rr25b80) return; window.__rr25b80=1;
  var TZ="Europe/Zurich";
  function h(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function fmt(ms){
    try{ return new Intl.DateTimeFormat("de-CH",{timeZone:TZ,weekday:"short",day:"numeric",month:"numeric",hour:"2-digit",minute:"2-digit"}).format(new Date(ms)).replace(",",""); }catch(e){ return ""; }
  }
  function zday(ms){
    try{ var p=new Intl.DateTimeFormat("en-CA",{timeZone:TZ,year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date(ms)).split("-"); return Date.UTC(+p[0],+p[1]-1,+p[2])/86400000; }catch(e){ return Math.floor(ms/86400000); }
  }
  function inTage(ms,now){ var d=zday(ms)-zday(now); return d<=0?"heute":d===1?"morgen":"in "+d+" Tagen"; }
  /* ---------- 2) Wochenfarbe ---------- */
  var WK={0:["Sonne","255,200,87"],1:["Mond","170,196,255"],2:["Mars","255,90,74"],3:["Merkur","79,214,224"],4:["Jupiter","143,123,255"],5:["Venus","255,122,217"],6:["Saturn","154,160,181"]};
  function wochentag(){
    try{ var w=new Intl.DateTimeFormat("en-US",{timeZone:TZ,weekday:"short"}).format(new Date()); return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(w); }catch(e){ return new Date().getDay(); }
  }
  function farbe(){ var w=WK[wochentag()]||WK[5]; document.documentElement.style.setProperty("--wk",w[1]); document.documentElement.setAttribute("data-wk",w[0]); }
  farbe(); document.addEventListener("visibilitychange",function(){ if(!document.hidden) farbe(); }); setInterval(farbe,30*60*1000);
  /* ---------- 1) Mondkarte ---------- */
  var KEY={neu:"Neumond",zu:"Zunehmender Mond",voll:"Vollmond",ab:"Abnehmender Mond"};
  var SATZ={neu:"Neu setzen. Still halten.",zu:"Wachsen lassen. Nicht hetzen.",voll:"Sichtbar. Nicht nachsetzen.",ab:"Abgeben. Was fällt, darf fallen."};
  function ton(){
    var K=window.RR25_KAL, k=""; try{ k=K&&K.state?K.state().kind:""; }catch(e){}
    return k==="HARD"?"Hard":k==="ECHO"?"Echo":k==="STILL"?"Still":"Soft";
  }
  function karte(){
    var M=window.RR25_MOND, now=Date.now(); if(!M) return "";
    var m=M.day(now), nf=M.next(2,now), nn=M.next(0,now), name=m.viertel===1?"Erstes Viertel":m.viertel===3?"Letztes Viertel":(KEY[m.key]||m.name);
    var pct=Math.round((1-Math.cos(m.p*2*Math.PI))/2*100), t=ton();
    function zeile(l,ms){ return ms?'<div class="mkR"><span>'+l+'</span><b>'+inTage(ms,now)+'</b><small>'+h(fmt(ms))+'</small></div>':""; }
    return '<div class="mkHead"><span class="mkSym">'+h(m.sym)+'</span><div><b>'+h(name)+'</b><small>'+pct+' % beleuchtet</small></div></div>'+
      '<p class="mkSay">'+h(SATZ[m.key]||"")+'</p>'+zeile("Vollmond",nf)+zeile("Neumond",nn)+
      '<div class="mkTon"><span>Ton heute</span><b class="mk'+t+'">'+t+'</b></div>'+
      '<p class="mkNote">Berner Zeit · Tipp daneben schliesst</p>';
  }
  function zu(){
    var b=document.getElementById("mkBack"), c=document.getElementById("mkCard"), w=document.getElementById("moonWrap");
    if(b) b.remove(); if(c) c.remove(); if(w) w.setAttribute("aria-expanded","false");
  }
  function auf(){
    zu(); var w=document.getElementById("moonWrap"); if(!w) return; var html=karte(); if(!html) return;
    var b=document.createElement("div"); b.id="mkBack"; b.onclick=zu;
    var c=document.createElement("div"); c.id="mkCard"; c.setAttribute("role","dialog"); c.setAttribute("aria-label","Mond"); c.innerHTML=html;
    var hd=document.querySelector("header"), top=hd?hd.getBoundingClientRect().bottom:60;
    c.style.top=(top+4)+"px";
    document.body.appendChild(b); document.body.appendChild(c); w.setAttribute("aria-expanded","true");
  }
  function mondInit(){
    var w=document.getElementById("moonWrap"); if(!w||w.__mk) return; w.__mk=1;
    w.setAttribute("role","button"); w.setAttribute("tabindex","0"); w.setAttribute("aria-expanded","false"); w.setAttribute("aria-label","Mondkarte öffnen"); w.style.cursor="pointer";
    w.addEventListener("click",function(){ if(document.getElementById("mkCard")) zu(); else auf(); });
    w.addEventListener("keydown",function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); w.click(); } });
  }
  mondInit();
  document.addEventListener("keydown",function(e){ if(e.key==="Escape") zu(); });
  /* ---------- 3) So sei es ---------- */
  var fertig=0;
  function soSeiEs(){
    var old=document.getElementById("soSeiEs"); if(old) old.remove();
    var t=document.createElement("div"); t.id="soSeiEs"; t.setAttribute("role","status"); t.textContent="So sei es";
    document.body.appendChild(t);
    var k=document.getElementById("kOut"); if(k){ k.classList.remove("swGlow"); void k.offsetWidth; k.classList.add("swGlow"); }
    setTimeout(function(){ t.classList.add("aus"); },1500);
    setTimeout(function(){ t.remove(); if(k) k.classList.remove("swGlow"); },2100);
  }
  if(typeof show==="function"&&!show._b80){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="after") fertig=Date.now();
      else if(id==="home"){ if(fertig&&Date.now()-fertig<10*60*1000){ fertig=0; setTimeout(soSeiEs,250); } }
      else fertig=0;
      zu();
      return r;
    };
    show._b80=1;
  }
  var css=document.createElement("style");
  css.textContent=[
    "html #kOut{border-color:rgba(var(--wk,255,122,217),.36)!important;transition:border-color .6s,box-shadow 1.6s}",
    "html #kOut.swGlow{animation:swGlow 2s ease-out 1}",
    "@keyframes swGlow{0%{box-shadow:inset 0 0 0 1px rgba(255,255,255,.05),0 10px 24px rgba(0,0,0,.2),0 0 0 rgba(200,120,255,0)}30%{box-shadow:inset 0 0 0 1px rgba(255,255,255,.08),0 10px 24px rgba(0,0,0,.2),0 0 22px rgba(200,120,255,.5)}100%{box-shadow:inset 0 0 0 1px rgba(255,255,255,.05),0 10px 24px rgba(0,0,0,.2),0 0 0 rgba(200,120,255,0)}}",
    "#soSeiEs{position:fixed;left:50%;bottom:calc(6.2rem + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:60;pointer-events:none;font-family:Georgia,serif;font-size:1.15rem;letter-spacing:.14em;color:#f1e1ff;padding:.45rem 1.3rem;border-radius:999px;background:rgba(24,10,40,.78);border:1px solid rgba(200,120,255,.35);text-shadow:0 0 12px rgba(200,120,255,.7);animation:swIn .5s ease-out both;transition:opacity .55s}",
    "#soSeiEs.aus{opacity:0}",
    "@keyframes swIn{from{opacity:0;transform:translateX(-50%) translateY(6px)}to{opacity:1;transform:translateX(-50%)}}",
    "@media (prefers-reduced-motion:reduce){html #kOut.swGlow{animation:none}#soSeiEs{animation:none}#soSeiEs,html #kOut{transition:none}}",
    "#moonWrap:focus-visible{outline:1px solid rgba(200,120,255,.6);border-radius:.8rem}",
    "#mkBack{position:fixed;inset:0;z-index:70;background:transparent}",
    "#mkCard{position:fixed;left:.6rem;z-index:71;width:min(17.5rem,calc(100vw - 1.2rem));padding:.85rem .95rem .7rem;border-radius:1.1rem;background:linear-gradient(180deg,rgba(44,20,68,.97),rgba(14,8,24,.98));border:1px solid rgba(200,120,255,.35);box-shadow:0 14px 34px rgba(0,0,0,.5),0 0 18px rgba(160,90,255,.22);color:#e6d4ff}",
    ".mkHead{display:flex;align-items:center;gap:.7rem}.mkSym{font-size:2rem;line-height:1;filter:drop-shadow(0 0 6px rgba(170,100,255,.5))}.mkHead b{display:block;font-family:Georgia,serif;font-weight:400;font-size:1.05rem;color:#f1e1ff}.mkHead small{font-size:.66rem;color:#a994c4}",
    ".mkSay{margin:.55rem 0 .4rem;font-size:.78rem;line-height:1.4;color:#e6d4ff}",
    ".mkR{display:grid;grid-template-columns:4.6rem auto 1fr;align-items:baseline;gap:.4rem;padding:.2rem 0;font-size:.76rem;border-top:1px solid rgba(200,120,255,.12)}.mkR span{color:#d6a6ff;font-size:.62rem;letter-spacing:.14em;text-transform:uppercase}.mkR b{font-weight:600;color:#fff}.mkR small{text-align:right;color:#a994c4;font-size:.66rem}",
    ".mkTon{display:flex;justify-content:space-between;align-items:center;margin-top:.35rem;padding-top:.4rem;border-top:1px solid rgba(200,120,255,.12);font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:#d6a6ff}.mkTon b{font-size:.74rem;letter-spacing:.04em;text-transform:none;padding:.12rem .7rem;border-radius:999px;border:1px solid}",
    ".mkSoft{color:#5fe0a0;border-color:rgba(95,224,160,.5);background:rgba(46,204,113,.1)}.mkHard{color:#ff7a8e;border-color:rgba(255,84,112,.55);background:rgba(231,76,60,.12)}.mkEcho,.mkStill{color:#e6d4ff;border-color:rgba(200,120,255,.5);background:rgba(160,90,255,.14)}",
    ".mkNote{margin:.5rem 0 0;font-size:.58rem;color:#8e7aa8}"
  ].join("");
  document.head.appendChild(css);
})();
