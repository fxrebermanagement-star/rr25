(function(){
  var KEY="rr25_kleid";
  function mode(){ return localStorage.getItem(KEY)||"ruhig"; }
  function apply(){
    document.documentElement.setAttribute("data-kleid", mode());
    var b=document.getElementById("kleidBtn");
    if(b) b.textContent=mode()==="neon"?"Ruhiger":"Neon wie vorher";
  }
  function btn(){
    if(document.getElementById("kleidBtn")) return;
    var home=document.getElementById("home");
    if(!home) return;
    var a=document.createElement("button");
    a.type="button"; a.id="kleidBtn"; a.className="kleid";
    home.appendChild(a);
    apply();
  }
  var s=document.createElement("style");
  s.textContent=[
    "#kleidBtn{display:block;width:100%;margin:1.1rem 0 .4rem;border:0;background:transparent;color:#8e7aa8;font:inherit;font-size:.68rem;letter-spacing:.08em}",
    "html[data-kleid=ruhig] #cats .chip{background:rgba(20,12,32,.4);border-color:rgba(255,255,255,.08);color:#9b8aad}",
    "html[data-kleid=ruhig] #list .card,.card,#pinDank{background:rgba(22,12,34,.72);box-shadow:none;border-color:rgba(255,255,255,.08)}",
    "html[data-kleid=ruhig] #tools{gap:.46rem}",
    "html[data-kleid=ruhig] #tools .tile{padding:.42rem .06rem .38rem;border-radius:.9rem;background:rgba(10,8,18,.55)}",
    "html[data-kleid=ruhig] #tools .tile b{font-size:1rem;margin-bottom:.18rem}",
    "html[data-kleid=ruhig] nav button{color:#6e5a80!important}",
    "html[data-kleid=ruhig] nav button.on{background:linear-gradient(165deg,#ff7ad9,#7ec8ff)!important;color:#14081c!important}",
    "html[data-kleid=neon] #cats .chip.on,html[data-kleid=ruhig] #cats .chip.on{background:linear-gradient(165deg,#ff7ad9,#7ef0e6)!important;color:#14081c!important}"
  ].join("");
  document.head.appendChild(s);
  document.addEventListener("click",function(e){
    if(e.target&&e.target.id==="kleidBtn"){
      localStorage.setItem(KEY, mode()==="neon"?"ruhig":"neon");
      apply();
    }
  });
  apply();
  btn();
  setTimeout(btn,300);
})();
