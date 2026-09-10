(function(){
  var s=document.createElement("style");
  s.id="rrDesign";
  s.textContent=[
    "body,.app{background:radial-gradient(120% 70% at 50% -8%,#3a1858 0%,#1a0a2c 38%,#090614 72%) fixed!important}",
    ".doll{animation:runeAtem 5.6s ease-in-out infinite;box-shadow:0 0 16px rgba(255,122,217,.35)}",
    "@keyframes runeAtem{0%,100%{filter:drop-shadow(0 0 4px rgba(255,122,217,.35));transform:scale(1)}50%{filter:drop-shadow(0 0 12px rgba(126,240,230,.5));transform:scale(1.04)}}",
    "#cats{display:flex!important;flex-wrap:nowrap!important;gap:.4rem;padding:.12rem 0 .35rem;margin:.5rem 0 .45rem;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none;background:transparent!important;border:0!important;border-radius:0!important}",
    "#cats::-webkit-scrollbar{display:none}",
    "#cats .chip{flex:0 0 auto;border:1px solid rgba(255,255,255,.12)!important;background:rgba(16,10,28,.72)!important;color:#d7c6ea!important;border-radius:999px!important;padding:.48rem .86rem!important;min-height:2.15rem!important;font-size:.78rem!important;white-space:nowrap}",
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
  }
  if(typeof renderList==="function"){
    var prev=renderList;
    renderList=function(){ prev(); paintCards(); };
  }
  paintCards();
  setTimeout(paintCards,400);
})();
