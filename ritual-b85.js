/* ritual-b85.js — Build 85: kleiner Knopf «Ritualbauer» auf der Startseite, direkt unter den Ritual-Chips.
   Öffnet den Ritualbauer (eigene Vollseite, Build 86). Tippfläche 40 px, sichtbar nur eine kleine Pille; Seitenhöhe bleibt. */
(function(){
  if(window.__rr25b85) return; window.__rr25b85=1;
  function place(){
    var home=document.getElementById("home"), cats=document.getElementById("cats"); if(!home||!cats) return;
    var b=document.getElementById("rezHome");
    if(!b){
      b=document.createElement("button"); b.type="button"; b.id="rezHome"; b.className="chip"; b.setAttribute("aria-label","Ritualbauer öffnen, eigenes Ritual zusammenstellen");
      b.textContent="✦ Ritualbauer";
      b.onclick=function(){
        try{ window.RR25_REZEPT&&window.RR25_REZEPT.open(); }catch(e){}
      };
    }
    if(cats.nextElementSibling!==b) home.insertBefore(b,cats.nextSibling);
  }
  place();
  var home=document.getElementById("home");
  if(home&&window.MutationObserver){ var t; new MutationObserver(function(){ clearTimeout(t); t=setTimeout(place,30); }).observe(home,{childList:true}); }
  var css=document.createElement("style");
  css.textContent=[
    "#rezHome{display:flex;width:fit-content;align-items:center;justify-content:center;margin:4px auto 0;position:relative;padding:.38rem .7rem!important;font-size:.64rem!important;min-height:33.8px!important;white-space:nowrap}",
    "#rezHome::after{content:'';position:absolute;left:-2px;right:-2px;top:-4px;bottom:-4px}",
    "html body main:has(#home.on){padding-bottom:3.95rem!important}",
    "html #home #cats{margin-bottom:0!important}",
    "html #home #skizze{margin-top:0!important}",
    "#rezHome:active,#rezHome:focus-visible{border-color:rgba(200,120,255,.7);box-shadow:0 0 10px rgba(200,120,255,.3);color:#f6e6ff}"
  ].join("");
  document.head.appendChild(css);
})();
