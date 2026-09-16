(function(){
  var SVG=
    '<svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'+
    '<defs>'+
    '<linearGradient id="g36" x1="0" x2="1"><stop offset="0" stop-color="#c9a6ff"/><stop offset="1" stop-color="#7ef0e6"/></linearGradient>'+
    '<linearGradient id="g69" x1="0" x2="1"><stop offset="0" stop-color="#7ef0e6"/><stop offset="1" stop-color="#ff9ad8"/></linearGradient>'+
    '</defs>'+
    '<line x1="78" y1="72" x2="148" y2="72" stroke="url(#g36)" stroke-width="2"/>'+
    '<line x1="212" y1="72" x2="282" y2="72" stroke="url(#g69)" stroke-width="2"/>'+
    '<circle cx="62" cy="72" r="28" fill="none" stroke="#c9a6ff" stroke-width="2"/>'+
    '<circle cx="180" cy="72" r="28" fill="none" stroke="#7ef0e6" stroke-width="2"/>'+
    '<circle cx="298" cy="72" r="28" fill="none" stroke="#ff9ad8" stroke-width="2"/>'+
    '<text x="62" y="78" text-anchor="middle" font-size="22" fill="#e8d6ff" font-family="Georgia,serif">3</text>'+
    '<text x="180" y="78" text-anchor="middle" font-size="22" fill="#b8fff6" font-family="Georgia,serif">6</text>'+
    '<text x="298" y="78" text-anchor="middle" font-size="22" fill="#ffc4ea" font-family="Georgia,serif">9</text>'+
    '<text x="62" y="118" text-anchor="middle" font-size="11" fill="#c4b4e0" font-family="system-ui,sans-serif">stehen</text>'+
    '<text x="180" y="118" text-anchor="middle" font-size="11" fill="#7ef0e6" font-family="system-ui,sans-serif">tragen</text>'+
    '<text x="298" y="118" text-anchor="middle" font-size="11" fill="#ff9ad8" font-family="system-ui,sans-serif">siegeln</text>'+
    '<path d="M290 148 C 180 188, 180 188, 70 148" fill="none" stroke="#ff9ad8" stroke-width="1.6"/>'+
    '<path d="M78 154 L70 148 L80 144" fill="none" stroke="#ff9ad8" stroke-width="1.6"/>'+
    '<text x="180" y="176" text-anchor="middle" font-size="12" fill="#ffb3ea" font-family="system-ui,sans-serif" letter-spacing="0.12em">Schluss</text>'+
    '</svg>';
  function empty(){
    var list=document.getElementById("list");
    if(!list) return true;
    if(!list.children.length) return true;
    if(list.children.length===1 && list.querySelector("#skizze")) return true;
    return false;
  }
  function paint(){
    var home=document.getElementById("home");
    var list=document.getElementById("list");
    if(!home||!list) return;
    var el=document.getElementById("skizze");
    if(!empty()){
      if(el) el.remove();
      return;
    }
    if(!el){
      el=document.createElement("div");
      el.id="skizze";
      el.innerHTML=SVG;
      list.appendChild(el);
    }
  }
  var css=document.createElement("style");
  css.textContent=[
    "#skizze{margin:.35rem 0 .2rem;padding:.15rem 0 .1rem}",
    "#skizze svg{display:block;width:100%;height:auto;max-height:11.5rem}"
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
  setTimeout(paint,400);
  setTimeout(paint,1200);
})();
