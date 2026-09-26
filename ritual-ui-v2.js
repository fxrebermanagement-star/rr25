/* ritual-ui-v2.js — kleine UI-Hilfen: Hinweis auf der leeren Zeichen-Kachel. */
(function(){
  var css=document.createElement("style");
  css.textContent=[
    "#sigilBox{position:relative}",
    "#sigHint{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.35rem;text-align:center;padding:.8rem;pointer-events:none;color:#9ee8e0;font-size:.74rem;line-height:1.35}",
    "#sigHint b{font-size:1.6rem;font-weight:400;color:#7ef0e6;text-shadow:0 0 12px rgba(126,240,230,.55)}",
    "#sigHint[hidden]{display:none}",
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
      el.innerHTML="<b>✽</b><span>Absicht eintippen,<br>dann «Zeichen».</span>";
      box.appendChild(el);
    }
    el.hidden=!empty();
  }
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
  function moon(){ var tx=document.getElementById("moonTxt"); if(tx) tx.innerHTML=moonLine(); }
  moon(); setTimeout(moon,300); setInterval(moon,30*60*1000);
})();
