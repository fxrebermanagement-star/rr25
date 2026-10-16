/* ritual-b85.js — Build 85: kleiner Knopf «Rezept bauen» auf der Startseite, direkt unter den Ritual-Chips.
   Öffnet den Ritualbauer (eigene Vollseite, Build 86). Tippfläche 40 px, sichtbar nur eine kleine Pille; Seitenhöhe bleibt. */
(function(){
  if(window.__rr25b85) return; window.__rr25b85=1;
  function place(){
    var home=document.getElementById("home"), cats=document.getElementById("cats"); if(!home||!cats) return;
    var b=document.getElementById("rezHome");
    if(!b){
      b=document.createElement("button"); b.type="button"; b.id="rezHome"; b.setAttribute("aria-label","Rezept bauen, eigenes Ritual zusammenstellen");
      b.innerHTML="<span>✦ Rezept bauen</span>";
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
    "#rezHome{display:block;width:100%;height:40px;min-height:40px;margin:-5px 0 -5px;padding:0;background:transparent;border:0;box-shadow:none;text-align:center}",
    "#rezHome span{display:inline-block;font-size:.72rem;letter-spacing:.06em;line-height:1;padding:.4rem .95rem;border-radius:999px;border:1px solid rgba(200,120,255,.3);background:rgba(160,90,255,.08);color:#d9c4f5}",
    "#rezHome:active span,#rezHome:focus-visible span{border-color:rgba(200,120,255,.7);box-shadow:0 0 10px rgba(200,120,255,.3);color:#f6e6ff}",
    "html body main:has(#home.on){padding-bottom:4.45rem!important}",
    "html #home #cats{margin-bottom:0!important}",
    "html #home #skizze{margin-top:0!important}"
  ].join("");
  document.head.appendChild(css);
})();
