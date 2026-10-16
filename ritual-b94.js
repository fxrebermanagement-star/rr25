/* ritual-b94.js — Build 94: Feinschliff. Nur Abstände, Tippflächen und Grössen, keine Logik.
   Heute-Seite: Tippflächen nur unsichtbar vergrössert (::after), damit die Höhe 1088 px bleibt. */
(function(){
  if(window.__rr25b94) return; window.__rr25b94=1;
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
    ".kmDay{height:40px}"
  ].join("");
  document.head.appendChild(css);
})();
