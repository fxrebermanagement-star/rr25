(function(){
  function build(){
    var kast=document.getElementById("kasten");
    if(!kast) return;
    var brand=document.querySelector("header .brand");
    var sub=document.querySelector("header .sub");
    if(brand) brand.textContent="ROLF REBER 25";
    if(sub) sub.textContent="";
    var tools=document.getElementById("tools");
    if(!tools){
      tools=document.createElement("div");
      tools.id="tools";
      kast.appendChild(tools);
    }
    tools.innerHTML=
      '<button type="button" class="tile t1" data-go="kTag"><b>✦</b><span>Karte</span></button>'+
      '<button type="button" class="tile t2" data-go="kDrei"><b>☰</b><span>Drei</span></button>'+
      '<button type="button" class="tile t3" data-go="zahlGo"><b>369</b><span>Zähler</span></button>'+
      '<button type="button" class="tile t4" data-go="sigilGo"><b>✽</b><span>Zeichen</span></button>';
    if(!document.getElementById("zahlGo")){
      var h=document.createElement("button");
      h.type="button"; h.id="zahlGo"; h.hidden=true;
      kast.appendChild(h);
    }
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
    "header .sub{display:none}",
    "#kasten{background:transparent;border:0;padding:.2rem 0 .35rem;margin:0 0 .4rem}",
    "#under,#pendelGo{display:none!important}",
    ".duo{gap:.42rem}",
    "#tools{display:grid;grid-template-columns:repeat(4,1fr);gap:.4rem;margin-top:.5rem}",
    "#tools .tile{border:1px solid rgba(255,255,255,.1);background:rgba(12,8,20,.7);border-radius:.95rem;padding:.5rem .08rem .42rem;font:inherit}",
    "#tools .tile b{display:block;font-size:1.05rem;line-height:1;margin:0 0 .22rem;font-weight:500}",
    "#tools .tile span{display:block;font-size:.6rem;letter-spacing:.05em}",
    "#tools .t1{border-color:rgba(255,122,217,.4);color:#ffb3ea}",
    "#tools .t2{border-color:rgba(126,200,255,.4);color:#9fd6ff}",
    "#tools .t3{border-color:rgba(46,230,214,.4);color:#7ef0e6}",
    "#tools .t4{border-color:rgba(125,255,163,.4);color:#a6ffc4}",
    "#sigRow{display:grid;grid-template-columns:1fr auto;gap:.32rem;margin-top:.42rem;align-items:center}",
    "#sigRow input{margin:0;border-radius:.85rem;min-height:2.3rem}",
    "#sigRow #sigilSave{margin:0;border-radius:.85rem;padding:.55rem .8rem;white-space:nowrap;min-height:2.3rem}"
  ].join("");
  document.head.appendChild(css);
  document.addEventListener("click",function(e){
    var t=e.target.closest&&e.target.closest("#tools [data-go]");
    if(!t) return;
    var id=t.getAttribute("data-go");
    if(id==="zahlGo"){
      var z=document.getElementById("zahlGo");
      if(z) z.click();
      return;
    }
    var el=document.getElementById(id);
    if(el) el.click();
  });
  build();
  setTimeout(build,280);
})();
