(function(){
  var s=document.createElement("style");
  s.textContent=[
    ".duo{display:grid;grid-template-columns:1fr 1fr;gap:.4rem;align-items:stretch}",
    "#kOut,#sigilBox{height:12.2rem;min-height:12.2rem;margin:0}",
    "#kOut .kcard{height:12.2rem;margin:0;overflow:hidden;display:flex;flex-direction:column;justify-content:center;padding:.55rem .45rem}",
    "#kOut .kcard small{display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}",
    "#sigilBox{display:flex;flex-direction:column;padding:.45rem .4rem}",
    "#sigilC{width:5.6rem;height:5.6rem;margin:.15rem auto 0}"
  ].join("");
  document.head.appendChild(s);
})();
