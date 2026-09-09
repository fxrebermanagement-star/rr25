(function(){
  function build(){
    var kast=document.getElementById("kasten");
    if(!kast) return;
    var brand=document.querySelector("header .brand");
    var sub=document.querySelector("header .sub");
    if(brand) brand.textContent="RR25";
    if(sub) sub.textContent="Feld · Ritual · Zeichen";
    var tools=document.getElementById("tools");
    if(!tools){
      tools=document.createElement("div");
      tools.id="tools";
      kast.appendChild(tools);
    }
    tools.innerHTML=
      '<button type="button" class="tile t1" data-go="kTag"><b>✦</b><span>Karte</span></button>'+
      '<button type="button" class="tile t2" data-go="kDrei"><b>☰</b><span>Drei</span></button>'+
      '<button type="button" class="tile t3" data-go="pendelGo"><b>◉</b><span>Pendel</span></button>'+
      '<button type="button" class="tile t4" data-go="sigilGo"><b>✽</b><span>Zeichen</span></button>';
    if(!document.getElementById("sigRow")){
      var row=document.createElement("div");
      row.id="sigRow";
      var inp=document.getElementById("sigilT");
      var save=document.getElementById("sigilSave");
      if(inp) row.appendChild(inp);
      if(save) row.appendChild(save);
      kast.appendChild(row);
    }
  }
  var css=document.createElement("style");
  css.textContent=[
    "#kasten{background:linear-gradient(180deg,rgba(80,20,70,.35),rgba(8,20,28,.35));border:1px solid rgba(126,200,255,.18);border-radius:1.35rem;padding:.7rem .7rem .8rem;margin:.15rem 0 .7rem}",
    "#under,#pendelGo{display:none!important}",
    "#tools{display:grid;grid-template-columns:repeat(4,1fr);gap:.4rem;margin-top:.62rem}",
    "#tools .tile{border:1px solid rgba(255,255,255,.1);background:rgba(12,8,20,.75);color:#fff;border-radius:1.05rem;padding:.55rem .1rem .5rem;font:inherit}",
    "#tools .tile b{display:block;font-size:1.15rem;line-height:1;margin:0 0 .28rem;font-weight:400}",
    "#tools .tile span{display:block;font-size:.64rem;letter-spacing:.04em}",
    "#tools .t1{border-color:rgba(255,122,217,.45);color:#ffb3ea}",
    "#tools .t2{border-color:rgba(126,200,255,.45);color:#9fd6ff}",
    "#tools .t3{border-color:rgba(46,230,214,.45);color:#7ef0e6}",
    "#tools .t4{border-color:rgba(125,255,163,.45);color:#a6ffc4}",
    "#sigRow{display:grid;grid-template-columns:1fr auto;gap:.35rem;margin-top:.5rem;align-items:center}",
    "#sigRow input{margin:0;border-radius:.9rem}",
    "#sigRow #sigilSave{margin:0;border-radius:.9rem;padding:.62rem .9rem;white-space:nowrap}"
  ].join("");
  document.head.appendChild(css);
  document.addEventListener("click",function(e){
    var t=e.target.closest&&e.target.closest("#tools [data-go]");
    if(!t) return;
    var id=t.getAttribute("data-go");
    var el=document.getElementById(id);
    if(el) el.click();
    else if(id==="pendelGo"&&typeof show==="function") show("pendel");
  });
  build();
  setTimeout(build,280);
})();
