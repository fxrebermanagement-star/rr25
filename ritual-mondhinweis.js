/* ritual-mondhinweis.js — Build 49: Mondphasen-Hinweis auf der Startseite.
   Am Vortag eines Neumonds oder Vollmonds und am Tag selbst eine kleine Karte unter der Ton-Zeile.
   Zeitpunkte: RR25_MOND (ritual-mondphase.js, Gerätezeit = Bern/Europe/Zurich). Hard-Phase: RR25_KAL (ritual-zeit.js).
   Keine neuen Schlüssel im Speicher. */
(function(){
  if(window.__rr25mh) return; window.__rr25mh=1;
  var DAY=86400000;
  function two(n){ return String(n).padStart(2,"0"); }
  function hm(ms){ var d=new Date(ms); return two(d.getHours())+":"+two(d.getMinutes()); }
  function h(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function day0(ms){ var d=new Date(ms); return new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime(); }
  function hardPhaseToday(now){
    try{ var K=window.RR25_KAL, s=K&&K.state(now), hd=s&&s.hardDay; return !!(hd&&/Vollmond/.test(String(hd.t||""))); }catch(e){ return false; }
  }
  /* Was gilt heute? null = keine Karte */
  function info(now){
    var M=window.RR25_MOND; if(!M) return null;
    var today=M.day(now), tom=M.day(day0(now)+DAY+12*3600000);
    if(today.key==="voll") return {k:"voll",head:"Heute Vollmond · Hard-Phase",sub:"Vollmond um "+hm(today.at)+". Ladung am stärksten. Ernten und danken, nicht nachsetzen. Abends Rückkehr · Anker."};
    if(today.key==="neu") return {k:"neu",head:"Heute Neumond · Neubeginn",sub:"Neumond um "+hm(today.at)+". Eine Absicht neu setzen. Klein anfangen."};
    if(tom.key==="voll") return {k:"voll",head:"Morgen Vollmond · Hard-Phase "+(hardPhaseToday(now)?"läuft":"beginnt"),sub:"Vollmond morgen um "+hm(tom.at)+"."+(hardPhaseToday(now)?" Die Hard-Phase hat heute begonnen. Abends Rückkehr · Anker.":" Ab morgen Hard-Phase. Heute vorbereiten.")};
    if(tom.key==="neu") return {k:"neu",head:"Morgen Neumond · Neubeginn",sub:"Neumond morgen um "+hm(tom.at)+". Heute abgeben und leeren, morgen neu setzen."};
    return null;
  }
  function anchor(){
    var home=document.getElementById("home"); if(!home) return null;
    var a=document.getElementById("bakCard");
    if(!a||a.parentNode!==home) a=document.getElementById("ankerHintCard");
    if(!a||a.parentNode!==home) a=document.getElementById("toneRow");
    return a&&a.parentNode===home?a:null;
  }
  function paint(){
    var el=document.getElementById("mondHint"), x=info(Date.now()), a=anchor();
    if(!x||!a){ if(el) el.remove(); return; }
    if(!el){ el=document.createElement("div"); el.id="mondHint"; el.className="card"; }
    var html='<p class="mhTag">Mondphase</p><b class="mhHead">'+h(x.head)+'</b><small class="mhSub">'+h(x.sub)+'</small>';
    if(el.getAttribute("data-k")!==x.k) el.setAttribute("data-k",x.k);
    if(el.innerHTML!==html) el.innerHTML=html;
    if(el.previousElementSibling!==a) a.parentNode.insertBefore(el,a.nextSibling);
  }
  var css=document.createElement("style");
  css.textContent=[
    "#home>#mondHint{margin:.55rem 0 .6rem;padding:.65rem .9rem .6rem;border-radius:1.1rem;border:1px solid rgba(232,160,255,.32);background:linear-gradient(160deg,rgba(48,20,78,.75),rgba(16,8,30,.92));box-shadow:0 0 16px rgba(201,155,255,.14)}",
    "#mondHint[data-k=voll]{border-color:rgba(255,84,112,.45);box-shadow:0 0 16px rgba(255,84,112,.14)}",
    "#mondHint .mhTag{margin:0 0 .12rem;font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:#c9a8ff}",
    "#mondHint[data-k=voll] .mhTag{color:#ff8aa0}",
    "#mondHint .mhHead{display:block;font-family:Georgia,serif;font-weight:500;font-size:1rem;color:#f6f0ff}",
    "#mondHint .mhSub{display:block;margin:.18rem 0 0;font-size:.74rem;color:#c4b4e0;line-height:1.4}"
  ].join("");
  document.head.appendChild(css);
  if(typeof show==="function"&&!show._mh){ var sh=show; show=function(id){ var r=sh.apply(this,arguments); if(id==="home") setTimeout(paint,60); return r; }; show._mh=1; }
  var home=document.getElementById("home");
  if(home&&window.MutationObserver){ var mo=new MutationObserver(function(){ clearTimeout(mo.t); mo.t=setTimeout(paint,80); }); mo.observe(home,{childList:true}); }
  setInterval(paint,60000);
  paint(); setTimeout(paint,1200);
  window.RR25_MONDHINWEIS={info:info,paint:paint};
})();
