(function(){
  if(typeof fill==="function"){
    var _f=fill;
    fill=function(s,m){
      var out=_f(s,m);
      out=out.split("[Auftrag]").join((m&&m.Auftrag)||"[Auftrag]");
      out=out.split("[Wofür]").join((m&&m["Wofür"])||"[Wofür]");
      return out;
    };
  }
  renderList=function(){
    var order=["Alltag","Schutz","Energie","Liebe","Trennung","Person X","Feld"];
    var cats=document.getElementById("cats");
    var list=document.getElementById("list");
    if(!cats||!list) return;
    cats.innerHTML=["Alle"].concat(order).map(function(x){
      return '<button class="chip'+(x===cat?' on':'')+'" data-cat="'+x+'">'+x+'</button>';
    }).join("");
    cats.querySelectorAll("[data-cat]").forEach(function(b){
      b.onclick=function(){ cat=b.getAttribute("data-cat"); renderList(); };
    });
    var items=R.filter(function(r){ return cat==="Alle"||r.tag===cat; });
    var g={};
    items.forEach(function(r){ (g[r.tag]=g[r.tag]||[]).push(r); });
    list.innerHTML=Object.keys(g).sort(function(a,b){ return order.indexOf(a)-order.indexOf(b); }).map(function(k){
      return '<p class="group">'+k+'</p>'+g[k].map(function(r){
        return '<button class="card" data-id="'+r.id+'"><b>'+r.t+'</b><small>'+r.s+'</small></button>';
      }).join("");
    }).join("");
    list.querySelectorAll(".card").forEach(function(b){
      b.onclick=function(){ fromPlan=null; openR(b.getAttribute("data-id")); };
    });
    cats.querySelectorAll('[data-cat="Alle"],[data-cat="Alltag"]').forEach(function(n){ n.remove(); });
  };
  renderList();
})();
