(function(){
  var s=document.createElement("style");
  s.id="rrDesign";
  s.textContent=[
    "body,.app{background:radial-gradient(120% 70% at 50% -8%,#3a1858 0%,#1a0a2c 38%,#090614 72%) fixed!important}",
    ".app{position:relative}",
    ".app::before{content:'';position:fixed;inset:0;pointer-events:none;background:radial-gradient(60% 40% at 80% 10%,rgba(126,200,255,.08),transparent 60%),radial-gradient(50% 35% at 10% 30%,rgba(255,122,217,.1),transparent 55%);z-index:0}",
    "header,main,nav{position:relative;z-index:1}",
    ".doll{animation:runeAtem 5.6s ease-in-out infinite;box-shadow:0 0 16px rgba(255,122,217,.35),0 0 36px rgba(126,240,230,.12)}",
    "@keyframes runeAtem{0%,100%{filter:drop-shadow(0 0 4px rgba(255,122,217,.35));transform:scale(1)}50%{filter:drop-shadow(0 0 12px rgba(126,240,230,.55));transform:scale(1.04)}}",
    "#cats{display:flex;flex-wrap:wrap;gap:.32rem;padding:.38rem .4rem;margin:.45rem 0 .55rem;background:rgba(18,10,32,.55);border:1px solid rgba(255,255,255,.08);border-radius:1.2rem;backdrop-filter:blur(10px)}",
    "#cats .chip{border-color:rgba(255,255,255,.1);background:transparent}",
    "#cats .chip.on{box-shadow:0 0 18px rgba(255,122,217,.28)}",
    "#list .card{position:relative;overflow:hidden}",
    "#list .card::before{content:'';position:absolute;left:0;top:0;bottom:0;width:3px;border-radius:3px 0 0 3px}",
    "#home .group+ .card::before,#list .card::before{background:#ff7ad9}",
    ".group{margin-top:.85rem}",
    "nav{border-radius:1.25rem 1.25rem 0 0!important;background:rgba(10,6,18,.88)!important;border:1px solid rgba(255,255,255,.1)!important;border-bottom:0!important;box-shadow:0 -10px 30px rgba(0,0,0,.35);padding:.38rem .28rem calc(.42rem + env(safe-area-inset-bottom))!important}",
    "nav button{border-radius:1rem!important;color:#8a769c!important}",
    "nav button.on{background:linear-gradient(165deg,#ff7ad9,#7ec8ff)!important;color:#14081c!important;box-shadow:0 6px 18px rgba(255,122,217,.28);font-weight:650}",
    "#tools .tile{backdrop-filter:blur(8px)}",
    "#kOut,#sigilBox{box-shadow:0 10px 28px rgba(0,0,0,.28),0 0 0 1px rgba(255,255,255,.04) inset}",
    "#list .card,#pinDank{box-shadow:0 10px 24px rgba(0,0,0,.22)}"
  ].join("");
  document.head.appendChild(s);

  var farbe={
    "Schutz":"#ff7ad9",
    "Energie":"#7dffa3",
    "Liebe":"#9fd6ff",
    "Trennung":"#c89bff",
    "Person X":"#7ef0e6",
    "Feld":"#e6d36a",
    "Alltag":"#ffb3ea"
  };
  function paintCards(){
    var list=document.getElementById("list");
    if(!list) return;
    var tag="Schutz";
    Array.prototype.forEach.call(list.children,function(n){
      if(n.classList.contains("group")){
        tag=(n.textContent||"").trim();
        return;
      }
      if(!n.classList.contains("card")) return;
      var c=farbe[tag]||"#ff7ad9";
      n.style.boxShadow="inset 3px 0 0 "+c+", 0 10px 24px rgba(0,0,0,.22)";
      n.style.borderColor=c.replace(")",",.35)").indexOf("rgba")>=0?c:"rgba(255,255,255,.1)";
    });
  }
  if(typeof renderList==="function"){
    var prev=renderList;
    renderList=function(){ prev(); paintCards(); };
  }
  paintCards();
  setTimeout(paintCards,500);
})();
