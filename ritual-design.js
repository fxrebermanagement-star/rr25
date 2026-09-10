(function(){
  var s=document.createElement("style");
  s.id="rrDesign";
  s.textContent=[
    "body,.app{background:radial-gradient(120% 70% at 50% -8%,#3a1858 0%,#1a0a2c 38%,#090614 72%) fixed!important}",
    ".doll{animation:runeAtem 5.6s ease-in-out infinite;box-shadow:0 0 16px rgba(255,122,217,.35)}",
    "@keyframes runeAtem{0%,100%{filter:drop-shadow(0 0 4px rgba(255,122,217,.35));transform:scale(1)}50%{filter:drop-shadow(0 0 12px rgba(126,240,230,.5));transform:scale(1.04)}}",
    "#cats{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:.38rem!important;padding:0!important;margin:.5rem 0 .55rem!important;overflow:visible!important;background:transparent!important;border:0!important;flex-wrap:unset}",
    "#cats .chip{width:100%!important;flex:unset!important;min-width:0!important;box-sizing:border-box;text-align:center;border:1px solid rgba(255,255,255,.12)!important;background:rgba(16,10,28,.72)!important;color:#d7c6ea!important;border-radius:999px!important;padding:.46rem .2rem!important;min-height:2.15rem!important;font-size:.72rem!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    "#cats .chip.on{background:linear-gradient(165deg,#ff7ad9,#7ef0e6)!important;color:#14081c!important;border-color:transparent!important;font-weight:650;box-shadow:0 0 16px rgba(255,122,217,.28)}",
    "nav{border-radius:1.25rem 1.25rem 0 0!important;background:rgba(10,6,18,.88)!important}",
    "nav button.on{background:linear-gradient(165deg,#ff7ad9,#7ec8ff)!important;color:#14081c!important}"
  ].join("");
  document.head.appendChild(s);
  var farbe={"Schutz":"#ff7ad9","Energie":"#7dffa3","Liebe":"#9fd6ff","Trennung":"#c89bff","Person X":"#7ef0e6","Feld":"#e6d36a"};
  function paintCards(){
    var list=document.getElementById("list");
    if(!list) return;
    var tag="Schutz";
    Array.prototype.forEach.call(list.children,function(n){
      if(n.classList.contains("group")){ tag=(n.textContent||"").trim(); return; }
      if(!n.classList.contains("card")) return;
      var c=farbe[tag]||"#ff7ad9";
      n.style.boxShadow="inset 3px 0 0 "+c+", 0 10px 24px rgba(0,0,0,.22)";
    });
    var cats=document.getElementById("cats");
    if(cats) cats.scrollLeft=0;
  }
  if(typeof renderList==="function"){
    var prev=renderList;
    renderList=function(){ prev(); paintCards(); };
  }
  paintCards();
  setTimeout(paintCards,400);
})();
