(function(){
  var KEY="rr25_skizze";
  var A=
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
  var B=
    '<svg viewBox="0 0 360 250" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'+
    '<line x1="96" y1="70" x2="138" y2="70" stroke="#8a7aa0" stroke-width="1.6"/>'+
    '<line x1="222" y1="70" x2="264" y2="70" stroke="#8a7aa0" stroke-width="1.6"/>'+
    '<circle cx="64" cy="70" r="32" fill="#0b0812" stroke="#7ec8a0" stroke-width="1.8"/>'+
    '<circle cx="180" cy="70" r="32" fill="#0b0812" stroke="#c0aad8" stroke-width="1.8"/>'+
    '<circle cx="296" cy="70" r="32" fill="#0b0812" stroke="#e8c070" stroke-width="1.8"/>'+
    '<text x="64" y="76" text-anchor="middle" font-size="13" fill="#d8f0e4" font-family="Georgia,serif">Erde</text>'+
    '<text x="180" y="76" text-anchor="middle" font-size="13" fill="#eee4f8" font-family="Georgia,serif">Mensch</text>'+
    '<text x="296" y="76" text-anchor="middle" font-size="12" fill="#f8e8c0" font-family="Georgia,serif">Universum</text>'+
    '<text x="64" y="122" text-anchor="middle" font-size="13" fill="#b0a0c4" font-family="system-ui,sans-serif">stehen</text>'+
    '<text x="180" y="122" text-anchor="middle" font-size="13" fill="#8cbcb6" font-family="system-ui,sans-serif">tragen</text>'+
    '<text x="296" y="122" text-anchor="middle" font-size="13" fill="#c8b080" font-family="system-ui,sans-serif">siegeln</text>'+
    '<path d="M280 150 C 180 186, 180 186, 80 150" fill="none" stroke="#a8889c" stroke-width="1.5"/>'+
    '<polyline points="90,158 80,150 92,146" fill="none" stroke="#a8889c" stroke-width="1.5"/>'+
    '<text x="180" y="228" text-anchor="middle" font-size="13" fill="#d0b0c4" font-family="system-ui,sans-serif" letter-spacing="0.22em">SCHLUSS</text>'+
    '</svg>';
  function mode(){
    try{ return localStorage.getItem(KEY)==="emu"?"emu":"369"; }catch(e){ return "369"; }
  }
  function setMode(m){ try{ localStorage.setItem(KEY,m); }catch(e){} }
  function startOnly(){
    var on=document.querySelector("#cats .chip.on");
    var list=document.getElementById("list");
    var cards=list && list.querySelector(".card,[data-id]");
    return !on && !cards;
  }
  function draw(el){
    el.innerHTML=(mode()==="emu"?B:A)+'<p class="skHint">tippen zum Wechseln</p>';
  }
  function mount(){
    var home=document.getElementById("home");
    var list=document.getElementById("list");
    if(!home) return null;
    var el=document.getElementById("skizze");
    if(!el){
      el=document.createElement("div");
      el.id="skizze";
      if(list) home.insertBefore(el, list);
      else home.appendChild(el);
      el.addEventListener("click", function(ev){
        ev.stopPropagation();
        setMode(mode()==="emu"?"369":"emu");
        draw(el);
      });
    }
    if(!el.querySelector("svg")) draw(el);
    return el;
  }
  function paint(){
    var el=mount();
    if(!el) return;
    if(!el.querySelector("svg")) draw(el);
    el.style.display=startOnly()?"block":"none";
  }
  var css=document.createElement("style");
  css.textContent=[
    "#skizze{margin:.7rem auto .2rem;width:92%;max-width:24rem;cursor:pointer}",
    "#skizze svg{display:block;width:100%;height:15rem}",
    "#skizze .skHint{margin:.1rem 0 0;text-align:center;font-size:.62rem;letter-spacing:.12em;text-transform:uppercase;color:#7a6a88}",
    "#home:has(#cats .chip.on) #skizze{display:none!important}",
    "#home:has(#list .card) #skizze,#home:has(#list button) #skizze{display:none!important}"
  ].join("");
  document.head.appendChild(css);
  mount(); paint();
  document.addEventListener("click", function(e){
    if(e.target.closest && e.target.closest("#skizze")) return;
    setTimeout(paint, 0); setTimeout(paint, 80);
  });
  if(typeof renderList==="function" && !renderList._sk){
    var rl=renderList;
    renderList=function(){ rl(); paint(); };
    renderList._sk=1;
  }
})();
