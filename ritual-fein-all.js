(function(){
  if(window.__feinAll) return;
  window.__feinAll=1;
  var s=document.createElement("style");
  s.id="feinAll";
  s.textContent=[
    "#kleidBtn,#sigilSave,nav [data-v=person]{display:none!important}",
    "body,.app{background:radial-gradient(120% 70% at 50% -8%,#3a1858 0%,#160a26 42%,#090614 75%) fixed!important}",
    ".brand{letter-spacing:.28em;font-size:.62rem}",
    ".doll{border-radius:1.05rem;box-shadow:0 0 16px rgba(255,122,217,.32)}",
    "#moonTxt,#sunTxt{font-size:.58rem;line-height:1.28;color:#cbb6e0}",
    "#kOut,#sigilBox{border-radius:1.15rem;border:1px solid rgba(255,122,217,.2);background:rgba(12,6,20,.72)}",
    "#kOut:empty{min-height:8.5rem}",
    "#tools{gap:.38rem}",
    "#tools .tile{border-radius:1rem;min-height:3.05rem}",
    "#sigilT,#sigRow input{text-transform:uppercase;letter-spacing:.07em;border-radius:1rem}",
    "#cats{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:.38rem!important;background:none!important;border:0!important;overflow:visible!important}",
    "#cats .chip{width:100%;text-align:center;border-radius:999px;padding:.46rem .15rem;min-height:2.12rem;font-size:.72rem}",
    "#cats .chip.on{background:linear-gradient(165deg,#ff7ad9,#7ef0e6);color:#14081c;border-color:transparent;font-weight:650}",
    "#list .card,#pinDank{border-radius:1.05rem}",
    "#list .card b{font-size:1.02rem}",
    ".group{letter-spacing:.18em;color:#ff9ad8}",
    "#run .words{font-size:1.18rem;line-height:1.7}",
    ".btn.primary{background:linear-gradient(165deg,#ff7ad9,#7ec8ff);color:#14081c;border:0}",
    "nav{background:rgba(10,6,18,.9)!important;border-radius:1.2rem 1.2rem 0 0!important}",
    "nav button.on{background:linear-gradient(165deg,#ff7ad9,#7ec8ff)!important;color:#14081c!important}",
    "#kOut .kz,.kcard .kz{color:#ff9ad8;text-shadow:0 0 14px rgba(255,122,217,.5)}"
  ].join("");
  document.head.appendChild(s);
  function tidy(){
    var k=document.getElementById("kleidBtn"); if(k) k.remove();
    var a=document.getElementById("sigilSave"); if(a) a.remove();
    document.querySelectorAll('nav [data-v="person"]').forEach(function(n){ n.remove(); });
  }
  tidy();
  setTimeout(tidy,400);
})();
