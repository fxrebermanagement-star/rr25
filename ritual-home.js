(function(){
  function build(){
    var kast=document.getElementById("kasten");
    if(!kast||document.getElementById("tools")) return;
    var brand=document.querySelector("header .brand");
    var sub=document.querySelector("header .sub");
    if(brand) brand.textContent="RR25";
    if(sub) sub.textContent="Feld · Ritual · Zeichen";
    var tools=document.createElement("div");
    tools.id="tools";
    tools.innerHTML=
      '<button type="button" class="tile" data-go="kTag"><i></i><span>Karte</span></button>'+
      '<button type="button" class="tile" data-go="kDrei"><i></i><span>Drei</span></button>'+
      '<button type="button" class="tile" data-go="pendelGo"><i></i><span>Pendel</span></button>'+
      '<button type="button" class="tile" data-go="sigilGo"><i></i><span>Zeichen</span></button>';
    kast.appendChild(tools);
    var row=document.createElement("div");
    row.id="sigRow";
    var inp=document.getElementById("sigilT");
    var save=document.getElementById("sigilSave");
    if(inp) row.appendChild(inp);
    if(save) row.appendChild(save);
    kast.appendChild(row);
  }
  var css=document.createElement("style");
  css.textContent=[
    "header .brand{font-size:.92rem;letter-spacing:.34em;font-weight:500}",
    "header .sub{font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;color:#9b7aad}",
    "#kasten{background:linear-gradient(180deg,rgba(56,22,90,.28),rgba(12,6,20,.2));border:1px solid rgba(232,160,255,.14);border-radius:1.35rem;padding:.7rem .7rem .8rem;margin:.15rem 0 .7rem}",
    "#under,#pendelGo{display:none!important}",
    "#tools{display:grid;grid-template-columns:repeat(4,1fr);gap:.4rem;margin-top:.62rem}",
    "#tools .tile{border:1px solid rgba(232,160,255,.16);background:rgba(18,8,30,.72);color:#f6eaff;border-radius:1.05rem;padding:.62rem .15rem .55rem;font:inherit;font-size:.68rem;letter-spacing:.04em}",
    "#tools .tile i{display:block;width:8px;height:8px;border-radius:99px;margin:0 auto .32rem;background:linear-gradient(165deg,#9650d2,#ff7ad9)}",
    "#sigRow{display:grid;grid-template-columns:1fr auto;gap:.35rem;margin-top:.5rem;align-items:center}",
    "#sigRow input{margin:0;border-radius:.9rem}",
    "#sigRow #sigilSave{margin:0;border-radius:.9rem;padding:.62rem .9rem;white-space:nowrap}",
    "#festHint{border-radius:999px!important;padding:.42rem .85rem!important;margin:.15rem 0 .55rem!important}",
    "#festHint b{font-size:.82rem}",
    "#festHint small{font-size:.68rem}",
    "#festHint p{display:none}",
    "#list .card{border-radius:1.2rem}"
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
