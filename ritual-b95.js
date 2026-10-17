/* ritual-b95.js — Build 95: Heute ohne Scrollen.
   Die ganze Startseite (bis und mit Tagesziel) passt zwischen Kopfzeile (75 px) und Tab-Leiste (66 px).
   Höhen hängen an der verfügbaren Höhe --hh (dvh), nach oben begrenzt auf die bisherigen Masse.
   Nur Abstände, Höhen und Schriften; Zeichen-Kachel skaliert nur proportional (Canvas passt sich selbst an).
   Tippflächen bleiben >= 40 px (unsichtbar per ::after). */
(function(){
  if(window.__rr25b95) return; window.__rr25b95=1;
  var P="html body #home ";
  var css=document.createElement("style");
  css.textContent=[
    ":root{--hh:calc(100vh - 141px);--hh:calc(100dvh - 141px)}",
    ":root{--sg:clamp(104px,calc(var(--hh)*.205),181px)}",
    "html body main:has(#home.on){padding-bottom:0!important}",
    "html body #home.on{padding-bottom:0!important}",
    /* Kachelzeile: Heute breit, Zeichen quadratisch */
    P+".duo{grid-template-columns:minmax(0,1fr) var(--sg)!important;gap:6px!important}",
    P+"#kOut,"+P+"#sigilBox{height:var(--sg)!important;min-height:0!important}",
    P+"#kOut{aspect-ratio:auto!important}",
    P+"#kOut .kcard{padding:4px 8px!important}",
    P+"#kOut .kcard .group{margin:0 0 1px!important;font-size:.62rem!important}",
    P+"#kOut .kcard .kz{margin:0 0 1px!important;font-size:calc(var(--sg)*.17)!important;line-height:1.05!important}",
    P+"#kOut .kcard b{margin:0 0 2px!important;font-size:.95rem!important;line-height:1.15!important}",
    P+"#kOut .kcard small{font-size:.7rem!important;line-height:1.28!important}",
    /* Zeichen-Kachel: Hinweis nur proportional mitskalieren (Bezug: 181 px) */
    P+"#sigHint{padding:calc(var(--sg)*.066)!important;gap:calc(var(--sg)*.029)!important;font-size:calc(var(--sg)*.0613)!important}",
    P+"#sigHint b{font-size:calc(var(--sg)*.1326)!important}",
    P+"#kasten{padding:1px 0!important;margin-bottom:0!important}",
    P+"#tools{margin-top:4px!important}",
    P+"#tools .tile{height:clamp(40px,calc(var(--hh)*.064),48px)!important;min-height:0!important;padding:3px 2px!important}",
    P+"#tools .tile b{margin:0 0 1px!important;font-size:.95rem!important;line-height:1.05!important}",
    P+"#tools .tile span{font-size:.58rem!important;line-height:1!important}",
    P+"#sigRow{margin-top:4px!important}",
    P+"#sigilT{height:40px!important;padding-top:0!important;padding-bottom:0!important}",
    /* Ton-Zeile */
    P+"#toneRow{margin-top:5px!important;gap:3px 6px!important}",
    P+"#toneRow .toneChip{height:28px!important;min-height:0!important}",
    P+"#toneRow .toneChip::after{top:-7px!important;bottom:-7px!important}",
    P+"#sigilSave{height:40px!important;padding-top:0!important;padding-bottom:0!important}",
    P+"#toneAnker{font-size:.66rem!important;line-height:1.1!important;margin:0!important;padding:0!important}",
    /* Sicherungskarte kompakt: Text links, Knöpfe rechts */
    P+"#bakCard{display:grid!important;grid-template-columns:minmax(0,1fr) auto;column-gap:8px;align-items:center;margin:5px 0 0!important;padding:5px 10px!important}",
    P+"#bakCard .bkTag{grid-column:1;margin:0!important;font-size:.52rem!important;line-height:1.1!important}",
    P+"#bakCard .bkHead{grid-column:1;font-size:.88rem!important;line-height:1.15!important}",
    P+"#bakCard .bkSub{grid-column:1;margin:1px 0 0!important;font-size:.64rem!important;line-height:1.2!important}",
    P+"#bakCard .bkBtns{grid-column:2;grid-row:1/4;margin:0!important;display:flex!important;flex-direction:column;align-items:stretch;gap:2px}",
    P+"#bakCard .bkBtns .btn{height:32px!important;min-height:0!important;padding:0 12px!important;width:auto!important;flex:none!important}",
    P+"#bakCard .bkLater{height:26px!important;text-align:center}",
    P+"#bakCard .bkLater::after{top:-7px!important;bottom:-7px!important}",
    P+"#bakCard .bkBtns .btn::after{top:-4px!important;bottom:-4px!important}",
    /* Satzzeilen */
    P+"#mondSag{margin:5px 0 3px!important;font-size:.76rem!important;line-height:1.1!important}",
    P+"#feldZeile{margin:-4px 0 0!important;font-size:.66rem!important;line-height:1.1!important}",
    P+"#pinDank{margin:3px 0 0!important;padding-top:5px!important;padding-bottom:5px!important}",
    P+"#pinDank b{font-size:.92rem!important;line-height:1.15!important}",
    P+"#pinDank small{font-size:.66rem!important;line-height:1.15!important;margin-top:1px!important}",
    /* Chips */
    P+"#v3CatLab{margin:6px 0 3px!important;font-size:.52rem!important;line-height:1!important}",
    P+"#cats .chip,"+P+"#rezHome{min-height:0!important;height:28px!important;padding-top:0!important;padding-bottom:0!important}",
    P+"#cats{overflow:visible!important}",
    P+"#cats .chip::after{top:-6px!important;bottom:-6px!important}",
    P+"#rezHome{margin-top:3px!important}",
    P+"#rezHome::after{top:-6px!important;bottom:-6px!important}",
    /* Skizze: Kreise und Tagesziel */
    P+"#skizze{margin-top:2px!important}",
    P+"#skizze > svg{display:block;height:clamp(60px,calc(var(--hh)*.125),159px)!important;width:100%!important}",
    P+"#skizze .skForm{display:grid!important;grid-template-columns:minmax(0,1fr) auto;column-gap:6px;align-items:center;margin:0!important;padding:4px 8px 5px!important}",
    P+"#skizze .skForm small{grid-column:1/3;margin:0 0 1px!important;font-size:.52rem!important;line-height:1.1!important}",
    P+"#skizze #skZielT{grid-column:1;height:40px!important;margin:0!important;padding-top:0!important;padding-bottom:0!important}",
    P+"#skizze #skZielGo{grid-column:2;height:32px!important;min-height:0!important;margin:0!important;padding:0 12px!important;width:auto!important}",
    P+"#skizze #skZielGo::after{content:'';position:absolute;left:-4px;right:-4px;top:-4px;bottom:-4px}",
    P+"#skizze #skZielGo{position:relative}"
  ].join("\n")+"\n"+[
    "@media (max-height:780px){",
    ":root{--sg:clamp(100px,calc(var(--hh)*.205),181px)}",
    P+"#skizze > svg{height:clamp(46px,calc(var(--hh)*.085),159px)!important}",
    P+"#cats .chip,"+P+"#rezHome{height:26px!important}",
    P+"#cats .chip::after,"+P+"#rezHome::after{top:-7px!important;bottom:-7px!important}",
    P+"#toneRow .toneChip{height:26px!important}",
    P+"#bakCard{padding-top:3px!important;padding-bottom:3px!important;margin-top:3px!important}",
    P+"#mondSag{margin:3px 0 2px!important}",
    P+"#v3CatLab{margin:4px 0 2px!important}",
    "}"
  ].join("\n");
  document.head.appendChild(css);
})();
