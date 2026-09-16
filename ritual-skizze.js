(function(){
  var SVG=
    '<svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'+
    '<line x1="78" y1="72" x2="148" y2="72" stroke="#8f7aa8" stroke-width="1.4"/>'+
    '<line x1="212" y1="72" x2="282" y2="72" stroke="#8f7aa8" stroke-width="1.4"/>'+
    '<circle cx="62" cy="72" r="26" fill="none" stroke="#b9a3d4" stroke-width="1.5"/>'+
    '<circle cx="180" cy="72" r="26" fill="none" stroke="#7ec8c0" stroke-width="1.5"/>'+
    '<circle cx="298" cy="72" r="26" fill="none" stroke="#d89ac0" stroke-width="1.5"/>'+
    '<text x="62" y="78" text-anchor="middle" font-size="20" fill="#ddd0ee" font-family="Georgia,serif">3</text>'+
    '<text x="180" y="78" text-anchor="middle" font-size="20" fill="#d5f3ef" font-family="Georgia,serif">6</text>'+
    '<text x="298" y="78" text-anchor="middle" font-size="20" fill="#f3d0e6" font-family="Georgia,serif">9</text>'+
    '<text x="62" y="116" text-anchor="middle" font-size="11" fill="#9b8aaf" font-family="system-ui,sans-serif">stehen</text>'+
    '<text x="180" y="116" text-anchor="middle" font-size="11" fill="#7aa8a3" font-family="system-ui,sans-serif">tragen</text>'+
    '<text x="298" y="116" text-anchor="middle" font-size="11" fill="#c48aae" font-family="system-ui,sans-serif">siegeln</text>'+
    '<path d="M286 146 C 180 182, 180 182, 74 146" fill="none" stroke="#a8889c" stroke-width="1.3"/>'+
    '<path d="M82 152 L74 146 L84 142" fill="none" stroke="#a8889c" stroke-width="1.3"/>'+
    '<text x="180" y="174" text-anchor="middle" font-size="11" fill="#b89aac" font-family="system-ui,sans-serif" letter-spacing="0.14em">Schluss</text>'+
    '</svg>';
  function hasCards(){
    var list=document.getElementById("list");
    if(!list) return false;
    return !!list.querySelector(".card,[data-id]");
  }
  function paint(){
    var list=document.getElementById("list");
    if(!list) return;
    var el=document.getElementById("skizze");
    if(hasCards()){
      if(el) el.remove();
      return;
    }
    if(el) return;
    el=document.createElement("div");
    el.id="skizze";
    el.innerHTML=SVG;
    list.appendChild(el);
  }
  var css=document.createElement("style");
  css.textContent=[
    "#skizze{margin:.2rem 0 0;padding:0}",
    "#skizze svg{display:block;width:100%;height:auto;max-height:10.8rem}",
    "#list:empty{display:block}"
  ].join("");
  document.head.appendChild(css);
  if(typeof renderList==="function" && !renderList._sk){
    var rl=renderList;
    renderList=function(){
      rl();
      paint();
    };
    renderList._sk=1;
  }
  paint();
  setTimeout(paint,600);
})();
