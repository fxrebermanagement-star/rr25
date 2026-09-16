(function(){
  var s=document.createElement("style");
  s.textContent=[
    "html,body{background:#070510}",
    ".app{background:radial-gradient(120% 80% at 50% -8%,rgba(255,122,217,.11),transparent 48%),#070510}",
    "header{background:rgba(7,5,16,.84)!important;border-bottom:1px solid rgba(255,122,217,.12)}",
    ".brand{letter-spacing:.34em;color:#ff8adf}",
    ".doll{box-shadow:0 0 16px rgba(255,122,217,.2)}",
    "#kasten{display:block!important;margin:0 0 .4rem!important}",
    "#home .duo{display:grid!important;grid-template-columns:1fr 1fr!important;gap:.4rem}",
    "#kOut,#sigilBox{border-radius:1.2rem!important;min-height:9.4rem!important}",
    "#kOut{border:1px solid rgba(255,122,217,.42)!important}",
    "#sigilBox{border:1px solid rgba(46,230,214,.32)!important}",
    "#tools{display:grid!important;grid-template-columns:repeat(4,1fr)!important;gap:.32rem!important;margin-top:.42rem!important}",
    "#tools .tile{border-radius:1rem!important;background:rgba(16,10,28,.8)!important}",
    "#sigRow{display:grid!important;grid-template-columns:1fr auto!important;margin-top:.36rem!important}",
    "#under{display:none!important}",
    "#pinDank{padding:.82rem .9rem!important;border:1px solid rgba(255,122,217,.28)!important;background:linear-gradient(180deg,rgba(72,22,90,.55),rgba(18,10,28,.88))!important}",
    "#cats{gap:.32rem;margin:.4rem 0 .2rem}",
    ".chip{background:rgba(18,10,30,.75)}",
    ".card{background:rgba(28,14,48,.74);border:1px solid rgba(126,200,255,.16)}",
    "#list:empty{display:none}",
    "#run .words{font-size:1.16rem;line-height:1.72}",
    ".primary{box-shadow:0 8px 18px rgba(255,122,217,.16)}",
    "input,textarea,select{background:#12081c}",
    "input:focus,textarea:focus{outline:0;border-color:rgba(255,122,217,.55)}",
    "#sigilT{text-transform:uppercase;letter-spacing:.05em}",
    ".kcard{background:linear-gradient(185deg,rgba(70,24,90,.7),rgba(12,8,28,.94));border:1px solid rgba(255,122,217,.22);border-radius:1.2rem;padding:1rem .95rem;margin:.5rem 0;text-align:center}",
    ".kcard b,.kcard small,.kcard .group{display:block}",
    ".kcard b{margin:.15rem 0 .35rem;font-family:Georgia,serif}",
    ".kcard small{color:#c4b4e0;line-height:1.45}",
    "#dreiList .kcard{padding:1.1rem 1rem}",
    ".bakBar .btn{min-height:2.05rem;font-size:.72rem}",
    "#entries .shots{display:none!important}",
    "nav{background:rgba(10,6,18,.96)!important}",
    "#afterStay,#stay,.check{display:none!important}",
    ".pbar{height:3px;border-radius:99px;background:rgba(255,255,255,.08);margin:.15rem 0 .55rem;overflow:hidden}",
    ".pbar:after{content:\"\";display:block;height:100%;width:var(--p,8%);background:linear-gradient(90deg,#ff7ad9,#7ef0e6)}"
  ].join("");
  document.head.appendChild(s);

  var home=document.getElementById("home");
  var kast=document.getElementById("kasten");
  if(home && kast) home.insertBefore(kast, home.firstChild);

  var nav=document.querySelector("nav");
  var gabe=nav && nav.querySelector('[data-v="opfer"]');
  var buch=nav && nav.querySelector('[data-v="buch"]');
  if(gabe){
    gabe.innerHTML='<svg viewBox="0 0 24 24"><path d="M12 4l2.2 4.6L19 10l-4.8 1.8L12 17l-2.2-5.2L5 10l4.8-1.4z"/><path d="M7 19h10"/></svg>Gabe';
    if(buch) nav.insertBefore(gabe, buch);
  }
  var oh=document.querySelector("#opfer h2"); if(oh) oh.textContent="Gabe";

  var inp=document.getElementById("sigilT");
  if(inp && !inp._up){
    inp._up=1;
    inp.setAttribute("autocomplete","off");
    inp.addEventListener("input", function(){ inp.value=inp.value.toUpperCase(); });
  }

  if(typeof R!=="undefined"){
    R.forEach(function(r){
      if(r.id==="segen"){ r.t="Segen"; r.tag="Person X"; }
      if(r.id==="fluch"){ r.t="Fluch"; r.tag="Person X"; }
      if(r.id==="ueber"){ r.t="Person übernehmen"; r.tag="Person X"; }
    });
  }

  var run=document.getElementById("run");
  if(run){
    function bar(){
      var sub=run.querySelector(".sub");
      if(!sub) return;
      var m=String(sub.textContent||"").match(/(\d+)\s*[\/\u00b7]\s*(\d+)/);
      var el=run.querySelector(".pbar");
      if(!el){ el=document.createElement("div"); el.className="pbar"; run.insertBefore(el, run.firstChild); }
      if(m) el.style.setProperty("--p", Math.max(6, Math.round((+m[1])/(+m[2]||1)*100))+"%");
    }
    new MutationObserver(bar).observe(run,{childList:true,subtree:true});
  }
})();
