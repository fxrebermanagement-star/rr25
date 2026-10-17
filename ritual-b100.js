/* ritual-b100.js — Build 100: Knopfzone der Chronik kompakter (Funktionsknöpfe und Filter-Chips).
   Nur CSS. Sichtbare Höhe ca. 30 px, Tippfläche 40 px per unsichtbarem ::after, Abstand zwischen Reihen gross genug (kein Überlapp). */
(function(){
  if(window.__rr25b100) return; window.__rr25b100=1;
  var A="content:'';position:absolute;left:-3px;right:-3px;top:-5px;bottom:-5px";
  var css=document.createElement("style");
  css.textContent=[
    "html body #rbBar{display:flex!important;flex-wrap:wrap;justify-content:center;gap:10px 8px;margin:.1rem auto .6rem;max-width:290px}",
    "html body #rbBar>button{flex:0 0 auto;width:auto!important;position:relative;min-height:30px!important;height:30px;padding:0 .8rem!important;font-size:.72rem!important;line-height:1;letter-spacing:.01em;border-radius:999px!important;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap}",
    "html body #rbBar>button::after{"+A+"}",
    "html body #logFilt{justify-content:center;gap:10px 6px!important;margin:.1rem 0 .6rem!important}",
    "html body #logFilt .logchip{position:relative;min-height:30px!important;height:30px;padding:0 .7rem!important;font-size:.74rem!important;line-height:1;display:inline-flex;align-items:center;justify-content:center}",
    "html body #logFilt .logchip::after{"+A+"}"
  ].join("");
  document.head.appendChild(css);
})();
