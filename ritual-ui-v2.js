/* ritual-ui-v2.js — kleine UI-Hilfen: Hinweis auf der leeren Zeichen-Kachel. */
(function(){
  var css=document.createElement("style");
  css.textContent=[
    "#sigilBox{position:relative;background:radial-gradient(circle at 50% 42%,rgba(120,60,190,.38),rgba(36,16,66,.9) 62%),linear-gradient(160deg,#2a1248,#150a2a)!important;border:1px solid rgba(201,155,255,.34)!important;box-shadow:inset 0 0 22px rgba(160,100,255,.18),0 0 14px rgba(160,100,255,.14)!important}",
    "#sigilC{background:transparent!important;display:block}",
    "#sigHint{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.35rem;text-align:center;padding:.8rem;pointer-events:none;color:#9ee8e0;font-size:.74rem;line-height:1.35}",
    "#sigHint b{font-size:1.6rem;font-weight:400;color:#7ef0e6;text-shadow:0 0 12px rgba(126,240,230,.55)}",
    "#sigHint[hidden]{display:none}",
    "#sigHint b{letter-spacing:.12em}",
    "#sigPress{position:absolute;left:50%;bottom:.7rem;transform:translateX(-50%);padding:.35rem .8rem;border-radius:99px;background:rgba(20,10,34,.82);border:1px solid rgba(201,155,255,.5);color:#f1e6ff;font-size:.8rem;letter-spacing:.06em;white-space:nowrap;pointer-events:none;box-shadow:0 0 14px rgba(160,100,255,.45);opacity:0;transition:opacity .2s}",
    "#sigPress.on{opacity:1}",
    ".bakBar .btn{min-height:2rem;font-size:.72rem;font-weight:500}"
  ].join("");
  document.head.appendChild(css);
  function empty(){
    var t=document.getElementById("sigilT");
    var d={}; try{ d=JSON.parse(localStorage.getItem("rr25_sigil")||"{}"); }catch(e){}
    return !(d && d.l) && !(t && String(t.value||"").trim());
  }
  function paint(){
    var box=document.getElementById("sigilBox"); if(!box) return;
    var el=document.getElementById("sigHint");
    if(!el){
      el=document.createElement("div"); el.id="sigHint";
      el.innerHTML="<b>❤️ 🙏 👁</b><span>Absicht eintippen,<br>dann «Zeichen».</span>";
      box.appendChild(el);
    }
    el.hidden=!empty();
  }
  /* Antippen der Kachel: kurz «Ich · Spiel · Quelle» */
  var pressT=0;
  document.addEventListener("click",function(e){
    var box=document.getElementById("sigilBox");
    if(box && e.target && e.target.closest && e.target.closest("#sigilBox")){
      var pr=document.getElementById("sigPress");
      if(!pr){ pr=document.createElement("div"); pr.id="sigPress"; pr.setAttribute("aria-live","polite"); pr.textContent="Ich · Spiel · Quelle"; box.appendChild(pr); }
      pr.classList.add("on"); clearTimeout(pressT); pressT=setTimeout(function(){ pr.classList.remove("on"); },2400);
    }
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
