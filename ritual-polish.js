(function(){
  var s=document.createElement("style");
  s.textContent=[
    "html,body{background:#070510}",
    ".app{background:radial-gradient(120% 80% at 50% -8%,rgba(255,122,217,.11),transparent 48%),#070510}",
    "header{background:rgba(7,5,16,.84)!important;border-bottom:1px solid rgba(255,122,217,.12)}",
    ".brand{letter-spacing:.34em;color:#ff8adf}",
    "#kasten{display:block!important;margin:0 0 .4rem!important}",
    "#home .duo{display:grid!important;grid-template-columns:1fr 1fr!important;gap:.4rem}",
    "#kOut,#sigilBox{border-radius:1.2rem!important;min-height:9.4rem!important}",
    "#tools{display:grid!important;grid-template-columns:repeat(4,1fr)!important;margin-top:.42rem!important}",
    "#sigRow{display:grid!important}",
    "#under{display:none!important}",
    "#list:empty{display:none}",
    "#run .words{font-size:1.16rem;line-height:1.72}",
    "#run .sub{display:block!important;text-align:left;letter-spacing:.12em;text-transform:uppercase;font-size:.68rem;color:#c4b4e0;margin:0 0 .25rem}",
    "#run .pbar{display:block!important;height:3px;border-radius:99px;background:rgba(255,255,255,.08);margin:.1rem 0 .5rem;overflow:hidden}",
    "#run .pbar:after{content:\"\";display:block;height:100%;width:var(--p,8%);background:linear-gradient(90deg,#ff7ad9,#7ef0e6)}",
    ".kcard{background:linear-gradient(185deg,rgba(70,24,90,.7),rgba(12,8,28,.94));border:1px solid rgba(255,122,217,.22);border-radius:1.2rem;padding:1rem .95rem;margin:.5rem 0;text-align:center}",
    ".kcard b,.kcard small,.kcard .group{display:block}",
    "#sigilT{text-transform:uppercase}",
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
