(function(){
  var SVG=
    '<svg viewBox="0 0 360 250" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'+
    '<line x1="96" y1="70" x2="138" y2="70" stroke="#8a7aa0" stroke-width="1.6"/>'+
    '<line x1="222" y1="70" x2="264" y2="70" stroke="#8a7aa0" stroke-width="1.6"/>'+
    '<circle cx="64" cy="70" r="32" fill="#0b0812" stroke="#c0aad8" stroke-width="1.8"/>'+
    '<circle cx="180" cy="70" r="32" fill="#0b0812" stroke="#7ec8c0" stroke-width="1.8"/>'+
    '<circle cx="296" cy="70" r="32" fill="#0b0812" stroke="#d89ac0" stroke-width="1.8"/>'+
    '<text x="64" y="78" text-anchor="middle" font-size="26" fill="#f0e6fa" font-family="Georgia,serif">3</text>'+
    '<text x="180" y="78" text-anchor="middle" font-size="26" fill="#e4faf6" font-family="Georgia,serif">6</text>'+
    '<text x="296" y="78" text-anchor="middle" font-size="26" fill="#fadcea" font-family="Georgia,serif">9</text>'+
    '<text x="64" y="122" text-anchor="middle" font-size="13" fill="#b0a0c4" font-family="system-ui,sans-serif">stehen</text>'+
    '<text x="180" y="122" text-anchor="middle" font-size="13" fill="#8cbcb6" font-family="system-ui,sans-serif">tragen</text>'+
    '<text x="296" y="122" text-anchor="middle" font-size="13" fill="#d0a0b8" font-family="system-ui,sans-serif">siegeln</text>'+
    '<path d="M280 150 C 180 186, 180 186, 80 150" fill="none" stroke="#a8889c" stroke-width="1.5"/>'+
    '<polyline points="90,158 80,150 92,146" fill="none" stroke="#a8889c" stroke-width="1.5"/>'+
    '<text x="180" y="228" text-anchor="middle" font-size="13" fill="#d0b0c4" font-family="system-ui,sans-serif" letter-spacing="0.22em">SCHLUSS</text>'+
    '</svg>';
  function startOnly(){
    var on=document.querySelector("#cats .chip.on");
    var list=document.getElementById("list");
    var cards=list && list.children.length && !list.querySelector("#skizze");
    return !on && !cards;
  }
  function mount(){
    var home=document.getElementById("home");
    var list=document.getElementById("list");
    if(!home) return null;
    var el=document.getElementById("skizze");
    if(!el){
      el=document.createElement("div");
      el.id="skizze";
      el.innerHTML=SVG;
      if(list) home.insertBefore(el, list);
      else home.appendChild(el);
    }
    return el;
  }
  function paint(){
    var el=mount();
    if(!el) return;
    el.style.display=startOnly()?"block":"none";
  }
  var css=document.createElement("style");
  css.textContent=[
    "#skizze{margin:.7rem auto .2rem;width:92%;max-width:24rem}",
    "#skizze svg{display:block;width:100%;height:15rem}",
    "#home:has(#cats .chip.on) #skizze{display:none!important}",
    "#home:has(#list .card) #skizze,#home:has(#list button) #skizze{display:none!important}"
  ].join("");
  document.head.appendChild(css);
  mount(); paint();
  document.addEventListener("click", function(){ setTimeout(paint, 0); setTimeout(paint, 80); });
  if(typeof renderList==="function" && !renderList._sk){
    var rl=renderList;
    renderList=function(){ rl(); paint(); };
    renderList._sk=1;
  }
})();
