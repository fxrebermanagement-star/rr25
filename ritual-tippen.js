/* ritual-tippen.js — Build 50: sanftes Neon-Violett-Leuchten, solange eine Karte gedrückt wird.
   Nur :active, kurzer Übergang; bei «Bewegung reduzieren» ohne Übergang und ohne Verkleinern.
   Die Zeichen-Kachel (#sigilBox) ist keine Karte und bleibt unberührt. */
(function(){
  if(window.__rr25tip) return; window.__rr25tip=1;
  var css=document.createElement("style");
  css.textContent=[
    ".card,.kcard,.msItem{-webkit-tap-highlight-color:transparent;transition:box-shadow .16s ease-out,border-color .16s ease-out,transform .12s ease-out}",
    "html .card:active,html .kcard:active,html .msItem:active{border-color:rgba(214,160,255,.75)!important;box-shadow:0 0 0 1px rgba(214,160,255,.55),0 0 6px rgba(190,120,255,.5),inset 0 0 14px rgba(200,130,255,.28)!important;transition-duration:.06s}",
    "html button.card:active,html .kcard:active,html .msItem:active{transform:scale(.985)}",
    "@media (prefers-reduced-motion:reduce){.card,.kcard,.msItem{transition:none}html button.card:active,html .kcard:active,html .msItem:active{transform:none}}"
  ].join("");
  document.head.appendChild(css);
})();
