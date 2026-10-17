/* ritual-b95.js — Build 95/96: Heute ohne Scrollen, Höhe voll genutzt.
   Ein Verdichtungsfaktor --f (0 = eng, 1 = grosszügig wie vor Build 95) wird per JS so gewählt, dass die
   Startseite bis und mit Tagesziel genau zwischen Kopfzeile und Tab-Leiste passt (gemessene Container-Höhe,
   kein fester Abzug). Alle Masse sind Mischungen zwischen eng und grosszügig. Nur Abstände, Höhen, Schriften;
   die Zeichen-Kachel skaliert nur proportional. Tippflächen >= 40 px (unsichtbar per ::after). */
(function(){
  if(window.__rr25b95) return; window.__rr25b95=1;
  var P="html body #home ";
  function L(a,b){ return "calc("+a+"px + "+(b-a)+" * var(--f) * 1px)"; }
  function N(a,b){ return "calc("+a+" + "+(b-a)+" * var(--f))"; }
  var rules=[
    ":root{--f:0.5}",
    "html body main:has(#home.on),html body #home.on{padding-bottom:0!important}",
    /* Kachelzeile */
    P+".duo{grid-template-columns:minmax(0,1fr) "+L(104,181)+"!important;gap:"+L(6,8)+"!important}",
    P+"#kOut,"+P+"#sigilBox{height:"+L(104,181)+"!important;min-height:0!important}",
    P+"#kOut{aspect-ratio:auto!important}",
    P+"#kOut .kcard{padding:"+L(4,8)+" "+L(8,10)+"!important}",
    P+"#kOut .kcard .group{margin:0 0 "+L(1,3)+"!important;font-size:"+L(9.3,9.9)+"!important}",
    P+"#kOut .kcard .kz{margin:0 0 "+L(1,4)+"!important;font-size:"+L(18,32)+"!important;line-height:1.05!important}",
    P+"#kOut .kcard b{margin:0 0 "+L(2,5)+"!important;font-size:"+L(14.2,15.8)+"!important;line-height:1.15!important}",
    P+"#kOut .kcard small{font-size:"+L(10.4,11.6)+"!important;line-height:"+N(1.28,1.38)+"!important}",
    P+"#sigHint{padding:calc("+L(104,181)+" * .066)!important;gap:calc("+L(104,181)+" * .029)!important;font-size:calc("+L(104,181)+" * .0613)!important}",
    P+"#sigHint b{font-size:calc("+L(104,181)+" * .1326)!important}",
    P+"#kasten{padding:1px 0!important;margin-bottom:0!important}",
    P+"#tools{margin-top:"+L(4,6)+"!important}",
    P+"#tools .tile{height:"+L(40,50)+"!important;min-height:0!important;padding:"+L(3,7)+" 2px!important}",
    P+"#tools .tile b{margin:0 0 "+L(1,3)+"!important;font-size:"+L(14.2,15.8)+"!important;line-height:1.05!important}",
    P+"#tools .tile span{font-size:"+L(8.7,9.4)+"!important;line-height:1!important}",
    P+"#sigRow{margin-top:"+L(4,6)+"!important}",
    P+"#sigilT{height:"+L(40,44)+"!important;padding-top:0!important;padding-bottom:0!important}",
    P+"#sigilSave{height:"+L(40,44)+"!important;padding-top:0!important;padding-bottom:0!important}",
    /* Ton-Zeile */
    P+"#toneRow{margin-top:"+L(5,10)+"!important;gap:"+L(3,6)+" 6px!important}",
    P+"#toneRow .toneChip{height:"+L(26,32)+"!important;min-height:0!important}",
    P+"#toneRow .toneChip::after{top:-7px!important;bottom:-7px!important}",
    P+"#toneAnker{font-size:"+L(9.9,11)+"!important;line-height:"+N(1.1,1.4)+"!important;margin:0!important;padding:0!important}",
    /* Sicherungskarte kompakt */
    P+"#bakCard{display:grid!important;grid-template-columns:minmax(0,1fr) auto;column-gap:8px;align-items:center;margin:"+L(3,9)+" 0 0!important;padding:"+L(3,9)+" 10px!important}",
    P+"#bakCard .bkTag{grid-column:1;margin:0!important;font-size:"+L(7.8,8.7)+"!important;line-height:1.1!important}",
    P+"#bakCard .bkHead{grid-column:1;font-size:"+L(13.2,15.3)+"!important;line-height:1.15!important}",
    P+"#bakCard .bkSub{grid-column:1;margin:"+L(1,3)+" 0 0!important;font-size:"+L(9.6,11.1)+"!important;line-height:1.2!important}",
    P+"#bakCard .bkBtns{grid-column:2;grid-row:1/4;margin:0!important;display:flex!important;flex-direction:column;align-items:stretch;gap:2px}",
    P+"#bakCard .bkBtns .btn{height:"+L(32,38)+"!important;min-height:0!important;padding:0 12px!important;width:auto!important;flex:none!important}",
    P+"#bakCard .bkBtns .btn::after{top:-4px!important;bottom:-4px!important}",
    P+"#bakCard .bkLater{height:"+L(26,30)+"!important;text-align:center}",
    P+"#bakCard .bkLater::after{top:-7px!important;bottom:-7px!important}",
    /* Satzzeilen */
    P+"#mondSag{margin:"+L(3,10)+" 0 "+L(2,7)+"!important;font-size:"+L(11.4,12.9)+"!important;line-height:1.15!important}",
    P+"#feldZeile{margin:-4px 0 0!important;font-size:"+L(9.9,11.2)+"!important;line-height:1.15!important}",
    P+"#pinDank{margin:"+L(3,6)+" 0 0!important;padding-top:"+L(5,11)+"!important;padding-bottom:"+L(5,11)+"!important}",
    P+"#pinDank b{font-size:"+L(13.8,15.3)+"!important;line-height:1.15!important}",
    P+"#pinDank small{font-size:"+L(9.9,11.25)+"!important;line-height:1.15!important;margin-top:"+L(1,3)+"!important}",
    /* Chips */
    P+"#v3CatLab{margin:"+L(4,14)+" 0 "+L(2,6)+"!important;font-size:"+L(7.8,9)+"!important;line-height:1!important}",
    P+"#cats{overflow:visible!important}",
    P+"#cats .chip,"+P+"#rezHome{min-height:0!important;height:"+L(26,35)+"!important;padding-top:0!important;padding-bottom:0!important}",
    P+"#cats .chip::after,"+P+"#rezHome::after{top:-7px!important;bottom:-7px!important}",
    P+"#rezHome{margin-top:"+L(3,6)+"!important}",
    /* Skizze: Kreise und Tagesziel */
    P+"#skizze{margin-top:"+L(2,8)+"!important}",
    P+"#skizze > svg{display:block;height:"+L(46,159)+"!important;width:100%!important}",
    P+"#skizze .skForm{display:grid!important;grid-template-columns:minmax(0,1fr) auto;column-gap:6px;align-items:center;margin:0!important;padding:"+L(4,12)+" 8px "+L(5,13)+"!important}",
    P+"#skizze .skForm small{grid-column:1/3;margin:0 0 "+L(1,5)+"!important;font-size:"+L(7.8,8.7)+"!important;line-height:1.1!important}",
    P+"#skizze #skZielT{grid-column:1;height:"+L(40,44)+"!important;margin:0!important;padding-top:0!important;padding-bottom:0!important}",
    P+"#skizze #skZielGo{grid-column:2;position:relative;height:"+L(32,38)+"!important;min-height:0!important;margin:0!important;padding:0 12px!important;width:auto!important}",
    P+"#skizze #skZielGo::after{content:'';position:absolute;left:-4px;right:-4px;top:-4px;bottom:-4px}"
  ];
  var css=document.createElement("style"); css.textContent=rules.join("\n"); document.head.appendChild(css);

  /* Passung: grösstes f in [0,1], bei dem der Inhalt über der Tab-Leiste endet */
  var RES=8, busy=false, timer=0;
  function geom(){
    var hd=document.querySelector("header"), nv=document.querySelector("nav"), end=document.querySelector("#home #skizze .skForm")||document.getElementById("skizze");
    if(!hd||!end) return null;
    var vh=window.visualViewport?window.visualViewport.height:window.innerHeight;
    var nt=nv&&nv.getBoundingClientRect().height>0?nv.getBoundingClientRect().top:vh;
    return {nt:Math.min(nt,vh), end:end};
  }
  function fit(){
    var h=document.getElementById("home"); if(!h||!h.classList.contains("on")) return;
    var g=geom(); if(!g||!g.end.getBoundingClientRect().height) return;
    var root=document.documentElement, lo=0, hi=1, best=0, target=g.nt-RES;
    function bottom(f){ root.style.setProperty("--f",f); return g.end.getBoundingClientRect().bottom; }
    busy=true;
    if(bottom(1)<=target){ best=1; }
    else { for(var i=0;i<9;i++){ var m=(lo+hi)/2; if(bottom(m)<=target){ best=m; lo=m; } else hi=m; } }
    root.style.setProperty("--f",best.toFixed(4));
    window.RR25_HEUTE_FIT={f:best,bottom:g.end.getBoundingClientRect().bottom,navTop:g.nt};
    busy=false;
  }
  function later(){ if(busy) return; clearTimeout(timer); timer=setTimeout(fit,40); }
  window.addEventListener("resize",later);
  if(window.visualViewport) window.visualViewport.addEventListener("resize",later);
  window.addEventListener("load",function(){ later(); setTimeout(fit,600); setTimeout(fit,1800); });
  var home=document.getElementById("home");
  if(home&&window.MutationObserver){ new MutationObserver(later).observe(home,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:["class","hidden"]}); }
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(later);
  later();
})();
