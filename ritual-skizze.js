(function(){
  var SVG=
    '<svg viewBox="0 0 360 190" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" shape-rendering="geometricPrecision">'+
    '<line x1="88" y1="70" x2="152" y2="70" stroke="#8f7aa8" stroke-width="1.5"/>'+
    '<line x1="208" y1="70" x2="272" y2="70" stroke="#8f7aa8" stroke-width="1.5"/>'+
    '<circle cx="62" cy="70" r="24" fill="#0c0814" stroke="#b9a3d4" stroke-width="1.5"/>'+
    '<circle cx="180" cy="70" r="24" fill="#0c0814" stroke="#7ec8c0" stroke-width="1.5"/>'+
    '<circle cx="298" cy="70" r="24" fill="#0c0814" stroke="#d89ac0" stroke-width="1.5"/>'+
    '<text x="62" y="76" text-anchor="middle" font-size="20" fill="#ddd0ee" font-family="Georgia,serif">3</text>'+
    '<text x="180" y="76" text-anchor="middle" font-size="20" fill="#d5f3ef" font-family="Georgia,serif">6</text>'+
    '<text x="298" y="76" text-anchor="middle" font-size="20" fill="#f3d0e6" font-family="Georgia,serif">9</text>'+
    '<text x="62" y="112" text-anchor="middle" font-size="11" fill="#9b8aaf" font-family="system-ui,sans-serif">stehen</text>'+
    '<text x="180" y="112" text-anchor="middle" font-size="11" fill="#7aa8a3" font-family="system-ui,sans-serif">tragen</text>'+
    '<text x="298" y="112" text-anchor="middle" font-size="11" fill="#c48aae" font-family="system-ui,sans-serif">siegeln</text>'+
    '<path d="M284 140 C 180 174, 180 174, 76 140" fill="none" stroke="#a8889c" stroke-width="1.3"/>'+
    '<polyline points="84,146 76,140 86,136" fill="none" stroke="#a8889c" stroke-width="1.3"/>'+
    '<text x="180" y="168" text-anchor="middle" font-size="11" fill="#b89aac" font-family="system-ui,sans-serif" letter-spacing="0.14em">Schluss</text>'+
    '</svg>';
  function mount(){
    var home=document.getElementById("home");
    var list=document.getElementById("list");
    if(!home) return null;
    var el=document.getElementById("skizze");
    if(el) return el;
    el=document.createElement("div");
    el.id="skizze";
    el.innerHTML=SVG;
    if(list) home.insertBefore(el, list.nextSibling);
    else home.appendChild(el);
    return el;
  }
  function paint(){
    var el=mount();
    if(!el) return;
    var list=document.getElementById("list");
    var cards=list && list.querySelector(".card,[data-id]");
    el.style.display=cards?"none":"block";
  }
  var css=document.createElement("style");
  css.textContent=[
    "#skizze{margin:.15rem 0 0;padding:0;min-height:10rem}",
    "#skizze svg{display:block;width:100%;height:10rem}"
  ].join("");
  document.head.appendChild(css);
  mount();
  paint();
  document.addEventListener("click", function(e){
    if(e.target.closest && e.target.closest("#cats .chip")) setTimeout(paint, 0);
  });
  if(typeof show==="function" && !show._sk){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="home") paint();
      return r;
    };
    show._sk=1;
  }
})();
