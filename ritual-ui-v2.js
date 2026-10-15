/* ritual-ui-v2.js — kleine UI-Hilfen: Hinweis auf der leeren Zeichen-Kachel. */
(function(){
  var css=document.createElement("style");
  css.textContent=[
    "#sigilBox{position:relative;--tb:rgba(201,155,255,.4);--tg1:rgba(70,24,90,.62);--tg2:rgba(12,8,28,.92);--tgl:rgba(160,100,255,.16);background:linear-gradient(185deg,var(--tg1),var(--tg2))!important;border:1px solid var(--tb)!important;border-radius:1.15rem!important;overflow:hidden!important;box-shadow:inset 0 0 18px var(--tgl),0 0 12px var(--tgl)!important;outline:0!important}",
    "#sigilBox[data-ktone=soft]{--tb:rgba(46,204,113,.45);--tgl:rgba(46,204,113,.14)}",
    "#sigilBox[data-ktone=hard]{--tb:rgba(231,76,60,.5);--tgl:rgba(231,76,60,.16)}",
    "#sigilBox[data-ktone=echo]{--tb:rgba(93,173,226,.5);--tgl:rgba(93,173,226,.14)}",
    "#sigilBox[data-ktone=feld]{--tb:rgba(176,132,255,.5);--tgl:rgba(176,132,255,.16)}",
    "html[data-tagton=hard] #sigilBox{--tg1:rgba(100,22,44,.66);--tg2:rgba(24,6,16,.92)}",
    "html[data-tagton=soft] #sigilBox{--tg1:rgba(78,26,92,.62)}",
    "#sigilC{background:transparent!important;display:block}",
    "#sigHint{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.35rem;text-align:center;padding:.8rem;pointer-events:none;color:#9ee8e0;font-size:.74rem;line-height:1.35}",
    "#sigHint b{font-size:1.6rem;font-weight:400;color:#7ef0e6;text-shadow:0 0 12px rgba(126,240,230,.55)}",
    "#sigHint[hidden]{display:none}",
    "#sigHint b{letter-spacing:.12em}",
    "#sigPress{position:absolute;left:50%;bottom:.7rem;transform:translateX(-50%);padding:.35rem .8rem;border-radius:99px;background:rgba(20,10,34,.82);border:1px solid rgba(201,155,255,.5);color:#f1e6ff;font-size:.8rem;letter-spacing:.06em;white-space:nowrap;pointer-events:none;box-shadow:0 0 14px rgba(160,100,255,.45);opacity:0;transition:opacity .2s}",
    "#sigPress.on{opacity:1}",
    "html .logLeer{margin:.9rem 0;padding:.95rem 1rem;text-align:center;font-family:Georgia,serif;font-size:1rem;line-height:1.5;color:#d8c8f2;background:linear-gradient(185deg,rgba(70,24,90,.45),rgba(12,8,28,.8));border:1px dashed rgba(201,155,255,.38);border-radius:1.15rem;box-shadow:inset 0 0 18px rgba(160,100,255,.1)}",
    /* Build 59: Tippflächen mindestens ca. 32 px hoch */
    "html #cats .chip{min-height:2.25rem!important}",
    "html #toneChip,html #seasonChip{min-height:2.05rem!important;display:inline-flex;align-items:center}",
    "html #resonanzen .rzToneF{height:2rem!important;font-size:.7rem!important;padding:0 .7rem!important}",
    ".bakBar .btn{min-height:2rem;font-size:.72rem;font-weight:500}"
  ].join("");
  document.head.appendChild(css);
  function empty(){
    var t=document.getElementById("sigilT");
    var d={}; try{ d=JSON.parse(localStorage.getItem("rr25_sigil")||"{}"); }catch(e){}
    return !(d && d.l) && !(t && String(t.value||"").trim());
  }
  /* Kachel übernimmt Ton der Heute-Karte (Soft/Hard/Echo/Feld); Tageston kommt über html[data-tagton] */
  function tone(){
    var box=document.getElementById("sigilBox"), kc=document.querySelector("#kOut .kcard"); if(!box) return;
    var m=kc&&/ktone-(\w+)/.exec(kc.className), t=m?m[1]:"";
    if(t) box.setAttribute("data-ktone",t); else box.removeAttribute("data-ktone");
  }
  try{
    var ko=document.getElementById("kOut"); if(ko) new MutationObserver(tone).observe(ko,{childList:true,subtree:true,attributes:true,attributeFilter:["class"]});
  }catch(e){}
  function paint(){
    tone();
    var box=document.getElementById("sigilBox"); if(!box) return;
    var el=document.getElementById("sigHint");
    if(!el){
      el=document.createElement("div"); el.id="sigHint";
      el.innerHTML="<b>❤️ 🙏 👁</b><span>Absicht eintippen,<br>dann «Zeichen».</span>";
      box.appendChild(el);
    }
    el.hidden=!empty();
    if(pressOn) pressEl();
  }
  /* Antippen der Kachel: «Ich · Spiel · Quelle» bleibt stehen, bis erneut getippt wird (Build 62, kein Timer) */
  var pressOn=false;
  function pressEl(){
    var box=document.getElementById("sigilBox"); if(!box) return null;
    var pr=document.getElementById("sigPress");
    if(!pr){ pr=document.createElement("div"); pr.id="sigPress"; pr.setAttribute("aria-live","polite"); pr.textContent="Ich · Spiel · Quelle"; box.appendChild(pr); }
    pr.classList.toggle("on",pressOn); return pr;
  }
  document.addEventListener("click",function(e){
    if(e.target && e.target.closest && e.target.closest("#sigilBox")){ pressOn=!pressOn; pressEl(); }
  });
  document.addEventListener("click",function(e){
    if(e.target && e.target.closest && e.target.closest("#sigilGo,#sigilSave,[data-go=sigilGo]")) setTimeout(paint,120);
  });
  document.addEventListener("input",function(e){ if(e.target && e.target.id==="sigilT") paint(); });
  paint(); setTimeout(paint,600);

  /* Mond-Text in der Kopfzeile: heute / abnehmend / Tage bis Neu- bzw. Vollmond */
  function moonLine(){
    var syn=29.53058867, nm=Date.UTC(2000,0,6,18,14)/1000;
    var a=((Date.now()/1000-nm)/86400)%syn; if(a<0) a+=syn;
    var d=a-syn/2;
    function inT(n){ return n<=1?"morgen":"in "+n+" Tagen"; }
    if(Math.abs(d)<=0.6) return "Vollmond<br>heute";
    if(d>0){
      var n=Math.max(1,Math.round(syn-a));
      return (d<2?"Vollmond · abnehmend":"Abnehmend")+"<br>Neumond "+inT(n);
    }
    var z=Math.max(1,Math.round(-d));
    return (a<1.2?"Neumond":"Zunehmend")+"<br>Vollmond "+inT(z);
  }
  var SATZ={neu:"Neu setzen. Still halten.",zu:"Wachsen lassen. Nicht hetzen.",voll:"Sichtbar. Nicht nachsetzen.",ab:"Abgeben. Was fällt, darf fallen."};
  function moonLine2(m){
    function inT(n){ return n<=1?"morgen":"in "+n+" Tagen"; }
    if(m.key==="voll") return "Vollmond<br>heute";
    if(m.key==="ab") return "Abnehmend<br>Neumond "+inT(m.newIn);
    return m.name+"<br>Vollmond "+inT(m.fullIn);
  }
  function moon(){
    var tx=document.getElementById("moonTxt");
    var m=window.RR25_MOND?window.RR25_MOND.day():null;
    if(!m){ if(tx) tx.innerHTML=moonLine(); return; }
    if(tx) tx.innerHTML=moonLine2(m);
    var sy=document.getElementById("moonSym"); if(sy) sy.textContent=m.sym;
    var wr=document.getElementById("moonWrap"); if(wr) wr.title=m.name+" · "+SATZ[m.key];
  }
  moon(); setTimeout(moon,300); setInterval(moon,30*60*1000);
})();
