(function(){
  var SVG=
    '<svg viewBox="0 0 360 230" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" shape-rendering="geometricPrecision">'+
    '<line x1="92" y1="78" x2="140" y2="78" stroke="#8f7aa8" stroke-width="1.6"/>'+
    '<line x1="220" y1="78" x2="268" y2="78" stroke="#8f7aa8" stroke-width="1.6"/>'+
    '<circle cx="62" cy="78" r="30" fill="#0c0814" stroke="#b9a3d4" stroke-width="1.7"/>'+
    '<circle cx="180" cy="78" r="30" fill="#0c0814" stroke="#7ec8c0" stroke-width="1.7"/>'+
    '<circle cx="298" cy="78" r="30" fill="#0c0814" stroke="#d89ac0" stroke-width="1.7"/>'+
    '<text x="62" y="86" text-anchor="middle" font-size="24" fill="#eee4f8" font-family="Georgia,serif">3</text>'+
    '<text x="180" y="86" text-anchor="middle" font-size="24" fill="#e0faf6" font-family="Georgia,serif">6</text>'+
    '<text x="298" y="86" text-anchor="middle" font-size="24" fill="#f8dceb" font-family="Georgia,serif">9</text>'+
    '<text x="62" y="128" text-anchor="middle" font-size="12" fill="#a898bc" font-family="system-ui,sans-serif">stehen</text>'+
    '<text x="180" y="128" text-anchor="middle" font-size="12" fill="#86b8b2" font-family="system-ui,sans-serif">tragen</text>'+
    '<text x="298" y="128" text-anchor="middle" font-size="12" fill="#c898b0" font-family="system-ui,sans-serif">siegeln</text>'+
    '<path d="M286 158 C 180 198, 180 198, 74 158" fill="none" stroke="#a8889c" stroke-width="1.4"/>'+
    '<polyline points="84,165 74,158 86,154" fill="none" stroke="#a8889c" stroke-width="1.4"/>'+
    '<text x="180" y="216" text-anchor="middle" font-size="12" fill="#c4a4b6" font-family="system-ui,sans-serif" letter-spacing="0.18em">Schluss</text>'+
    '</svg>';
  function mount(){
    var home=document.getElementById("home");
    var list=document.getElementById("list");
    if(!home) return null;
    var el=document.getElementById("skizze");
    if(!el){
      el=document.createElement("div");
      el.id="skizze";
      if(list) home.insertBefore(el, list.nextSibling);
      else home.appendChild(el);
    }
    if(el.getAttribute("data-v")!=="2"){
      el.setAttribute("data-v","2");
      el.innerHTML=SVG;
    }
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
    "#skizze{margin:.55rem auto 0;padding:0;width:100%;max-width:22rem}",
    "#skizze svg{display:block;width:100%;height:13.2rem;margin:0 auto}"
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
