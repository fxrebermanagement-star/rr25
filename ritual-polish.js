(function(){
  var s=document.createElement("style");
  s.textContent=[
    "html,body{background:#070510;-webkit-tap-highlight-color:transparent}",
    "body{-webkit-font-smoothing:antialiased}",
    ".app{background:radial-gradient(120% 80% at 50% -8%,rgba(255,122,217,.13),transparent 50%),radial-gradient(90% 50% at 100% 0,rgba(126,200,255,.08),transparent 42%),#070510}",
    "header{background:rgba(7,5,16,.86)!important;border-bottom:1px solid rgba(255,122,217,.14)}",
    ".brand{letter-spacing:.34em;color:#ff8adf;text-shadow:0 0 18px rgba(255,122,217,.35)}",
    ".doll{box-shadow:0 0 16px rgba(255,122,217,.22)}",
    "#kasten{display:block!important;margin:0 0 .4rem!important}",
    "#home .duo{display:grid!important;grid-template-columns:1fr 1fr!important;gap:.45rem}",
    "#kOut,#sigilBox{border-radius:1.25rem!important;min-height:9.4rem!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.04)}",
    "#tools{display:grid!important;grid-template-columns:repeat(4,1fr)!important;margin-top:.48rem!important;gap:.38rem!important}",
    "#tools .tile{min-height:3.15rem;transition:transform .12s ease,box-shadow .12s ease}",
    "#tools .tile:active{transform:scale(.97)}",
    "#sigRow{display:grid!important}",
    "#under{display:none!important}",
    "#list:empty{display:none}",
    "#cats{gap:.4rem;margin:.62rem 0 .5rem}",
    ".chip{padding:.48rem .86rem;min-height:2.15rem;letter-spacing:.02em;transition:transform .12s ease,background .15s ease}",
    ".chip:active{transform:scale(.97)}",
    "#cats .chip.on{background:linear-gradient(165deg,#ff7ad9,#7ef0e6)!important;color:#14081c!important;box-shadow:0 0 16px rgba(255,122,217,.28)}",
    ".card{border-radius:1.2rem;padding:.82rem .88rem;transition:transform .12s ease,border-color .15s ease}",
    "#list .card:active{transform:scale(.99)}",
    "#list .card{border-color:rgba(255,122,217,.16)}",
    ".group{letter-spacing:.2em;color:#ff9ae4;margin:1.05rem 0 .28rem}",
    "#run .words{font-size:1.16rem;line-height:1.72}",
    "#run .sub{display:block!important;text-align:left;letter-spacing:.12em;text-transform:uppercase;font-size:.68rem;color:#c4b4e0;margin:0 0 .25rem}",
    "#run .pbar{display:block!important;height:3px;border-radius:99px;background:rgba(255,255,255,.08);margin:.1rem 0 .5rem;overflow:hidden}",
    "#run .pbar:after{content:\"\";display:block;height:100%;width:var(--p,8%);background:linear-gradient(90deg,#ff7ad9,#7ef0e6)}",
    ".kcard{background:linear-gradient(185deg,rgba(70,24,90,.7),rgba(12,8,28,.94));border:1px solid rgba(255,122,217,.22);border-radius:1.2rem;padding:1rem .95rem;margin:.5rem 0;text-align:center}",
    ".kcard b,.kcard small,.kcard .group{display:block}",
    "#sigilT{text-transform:uppercase}",
    "input:focus,textarea:focus,select:focus{outline:0;border-color:rgba(255,122,217,.55);box-shadow:0 0 0 3px rgba(255,122,217,.12)}",
    "nav{padding:.36rem .14rem calc(.4rem + env(safe-area-inset-bottom));background:rgba(8,4,18,.82);backdrop-filter:blur(16px);border-top:1px solid rgba(255,122,217,.16);border-left:0;border-right:0;border-bottom:0}",
    "nav button{padding:.56rem .04rem .46rem;font-size:.58rem;gap:.16rem}",
    "nav button svg{width:19px;height:19px}",
    "nav button.on{box-shadow:0 0 18px rgba(255,122,217,.25)}",
    ".bakBar .btn{min-height:2.15rem;font-size:.74rem;letter-spacing:.02em}",
    "#logFind{margin:.15rem 0 .55rem;min-height:2.25rem}",
    "#afterStay,#stay,.check{display:none!important}"
  ].join("");
  document.head.appendChild(s);

  var run=document.getElementById("run");
  if(run){
    function bar(){
      var sub=run.querySelector(".sub");
      if(!sub) return;
      var m=String(sub.textContent||"").match(/(\d+)\s*[\/\u00b7]\s*(\d+)/);
      var el=run.querySelector(".pbar");
      if(!el){ el=document.createElement("div"); el.className="pbar"; run.insertBefore(el, run.firstChild); }
      if(m) el.style.setProperty("--p", Math.max(8, Math.round((+m[1])/(+m[2]||1)*100))+"%");
    }
    new MutationObserver(bar).observe(run,{childList:true,subtree:true});
  }
})();
