/* ritual-b94.js — Build 94: Feinschliff. Nur Abstände, Tippflächen und Grössen, keine Logik.
   Heute-Seite: Tippflächen nur unsichtbar vergrössert (::after), damit die Höhe 1088 px bleibt. */
(function(){
  if(window.__rr25b94) return; window.__rr25b94=1;
  var A="content:'';position:absolute;left:-3px;right:-3px;top:-5px;bottom:-5px";
  var css=document.createElement("style");
  css.textContent=[
    /* Heute: unsichtbar auf mindestens 40 px */
    "#home #cats .chip,#home .toneChip,#home #rezHome,#home .bkLater,#home .btn:not(#sigilSave){position:relative}",
    "#home #cats .chip::after{content:'';position:absolute;left:0;right:0;top:-3.2px;bottom:-3.2px}",
    "#home .toneChip::after{content:'';position:absolute;left:0;right:0;top:-4.6px;bottom:-4.6px}",
    "#home .bkLater::after{content:'';position:absolute;left:0;right:0;top:-4px;bottom:-4px}",
    "#home .btn:not(#sigilSave)::after{content:'';position:absolute;left:0;right:0;top:-3px;bottom:-3px}",
    /* andere Seiten: echte Mindesthöhe 40 px */
    "main .screen:not(#home) button:not(.kmDay):not(.kmNav){min-height:40px}",
    "html #abBtn,html #mzBtn,html #zlBtn,html #rbBtn{min-height:40px!important}",
    "html #rbBar{display:grid!important;grid-template-columns:1fr 1fr;gap:.45rem}",
    "#mehrSheet button,html #sxOut,html #sxIn{min-height:40px}",
    "html #logFilt .logchip{min-height:40px}",
    "html #logFilt .logchip.log-grau{font-size:.76rem;padding:.42rem .72rem;letter-spacing:0}",
    "button.rbTag,button.rbNav,#abPanel button{min-width:40px}",
    ".kmNav{width:40px;height:40px}",
    "button.kmYear{min-height:40px;min-width:40px}",
    ".kmDay{height:40px}",
    /* Build 100 (eingefaltet in Build 115): Knopfzone der Chronik kompakter. Sichtbar ca. 30 px, Tippfläche 40 px per ::after */
    "html body #rbBar{display:flex!important;flex-wrap:wrap;justify-content:center;gap:10px 8px;margin:.1rem auto .6rem;max-width:290px}",
    "html body #rbBar>button{flex:0 0 auto;width:auto!important;position:relative;min-height:30px!important;height:30px;padding:0 .8rem!important;font-size:.72rem!important;line-height:1;letter-spacing:.01em;border-radius:999px!important;display:inline-flex;align-items:center;justify-content:center;white-space:nowrap}",
    "html body #rbBar>button::after{"+A+"}",
    "html body #logFilt{justify-content:center;gap:10px 6px!important;margin:.1rem 0 .6rem!important}",
    "html body #logFilt .logchip{position:relative;min-height:30px!important;height:30px;padding:0 .7rem!important;font-size:.74rem!important;line-height:1;display:inline-flex;align-items:center;justify-content:center}",
    "html body #logFilt .logchip::after{"+A+"}"
  ].join("");
  document.head.appendChild(css);
})();
