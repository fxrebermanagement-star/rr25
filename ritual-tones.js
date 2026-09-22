(function(){
  function toneOf(r){
    if(!r) return "soft";
    var id=String(r.id||"");
    var tag=String(r.tag||"");
    var t=String(r.t||"");
    if(id==="segen") return "soft";
    if(id==="fluch"||id==="ueber"||id==="schaden"||/Fluch|übernehmen|Zwang|hart/i.test(t+" "+(r.s||""))) return "hart";
    if(tag==="Person X") return "hart";
    if(id==="liebe"||id==="liebe2") return "hart";
    if(tag==="Feld"||id==="wesen"||id==="ahn"||id==="fremd"||id==="finst"||id==="fil") return "feld";
    return "soft";
  }
  function paint(){
    var list=document.getElementById("list");
    if(!list || typeof R==="undefined") return;
    list.querySelectorAll(".card[data-id]").forEach(function(b){
      var id=b.getAttribute("data-id");
      var r=null;
      for(var i=0;i<R.length;i++) if(R[i].id===id){ r=R[i]; break; }
      var tone=toneOf(r);
      var tag=r&&r.tag?r.tag:"";
      b.setAttribute("data-tone",tone);
      if(tag) b.setAttribute("data-tag",tag);
    });
    var cats=document.getElementById("cats");
    if(cats){
      cats.querySelectorAll(".chip").forEach(function(c){
        var k=c.getAttribute("data-cat")||"";
        c.setAttribute("data-cat",k);
      });
    }
  }
  var css=document.createElement("style");
  css.textContent=[
    "#list .card{position:relative;overflow:hidden;padding-left:.95rem!important}",
    "#list .card:before{content:\"\";position:absolute;left:0;top:0;bottom:0;width:4px}",
    "#list .card[data-tone=soft]:before{background:#6fce86}",
    "#list .card[data-tone=soft]{border-color:rgba(111,206,134,.28)!important}",
    "#list .card[data-tone=hart]:before{background:#e25a5a}",
    "#list .card[data-tone=hart]{border-color:rgba(226,90,90,.38)!important;background:linear-gradient(180deg,rgba(90,22,28,.42),rgba(18,8,16,.9))!important}",
    "#list .card[data-tone=feld]:before{background:#b48cff}",
    "#list .card[data-tone=feld]{border-color:rgba(180,140,255,.32)!important}",
    "#list .card[data-tag=Schutz]:before{background:#6fce86}",
    "#list .card[data-tag=Energie]:before{background:#e2c36b}",
    "#list .card[data-tag=Liebe][data-tone=hart]:before{background:#e25a5a}",
    "#list .card[data-tag=Liebe][data-tone=soft]:before{background:#ff8adf}",
    "#list .card[data-tag=Trennung]:before{background:#ff9a6a}",
    "#cats .chip[data-cat=Schutz]{border-color:rgba(111,206,134,.4)}",
    "#cats .chip[data-cat=Energie]{border-color:rgba(226,195,107,.4)}",
    "#cats .chip[data-cat=Liebe]{border-color:rgba(255,138,223,.4)}",
    "#cats .chip[data-cat=Trennung]{border-color:rgba(255,154,106,.4)}",
    "#cats .chip[data-cat=\"Person X\"]{border-color:rgba(226,90,90,.45)}",
    "#cats .chip[data-cat=Feld]{border-color:rgba(180,140,255,.45)}",
    "#cats .chip[data-cat=Schutz].on{background:linear-gradient(165deg,#6fce86,#c8f5d4)!important;color:#102016!important}",
    "#cats .chip[data-cat=Energie].on{background:linear-gradient(165deg,#e2c36b,#f7e7b0)!important;color:#201806!important}",
    "#cats .chip[data-cat=Liebe].on{background:linear-gradient(165deg,#ff7ad9,#ffd0f0)!important;color:#201018!important}",
    "#cats .chip[data-cat=Trennung].on{background:linear-gradient(165deg,#ff9a6a,#ffd2b8)!important;color:#24140c!important}",
    "#cats .chip[data-cat=\"Person X\"].on{background:linear-gradient(165deg,#e25a5a,#f3b0b0)!important;color:#1c0c0c!important}",
    "#cats .chip[data-cat=Feld].on{background:linear-gradient(165deg,#b48cff,#e2d4ff)!important;color:#160e24!important}"
  ].join("");
  document.head.appendChild(css);
  if(typeof renderList==="function" && !renderList._tone){
    var rl=renderList;
    renderList=function(){
      rl();
      paint();
      setTimeout(paint,40);
    };
    renderList._tone=1;
  }
  document.addEventListener("click", function(){ setTimeout(paint,30); });
  paint();
  setTimeout(paint,200);
})();
