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
  try{ if(typeof cat!=="undefined" && (cat==="Alle"||cat==="Alltag")) cat=""; }catch(e){}
  renderList=function(){
    var order=["Schutz","Energie","Liebe","Trennung","Person X","Feld"];
    var cats=document.getElementById("cats");
    var list=document.getElementById("list");
    if(!cats||!list) return;
    var start=!cat || cat==="Alle" || cat==="Alltag";
    if(start) cat="";
    cats.innerHTML=order.map(function(x){
      return '<button class="chip'+(x===cat?' on':'')+'" data-cat="'+x+'">'+x+'</button>';
    }).join("");
    cats.querySelectorAll("[data-cat]").forEach(function(b){
      b.onclick=function(){ cat=b.getAttribute("data-cat"); renderList(); };
    });
    if(start){
      list.innerHTML="";
      var sk=document.getElementById("skizze");
      if(sk) sk.style.display="block";
      return;
    }
    var items=R.filter(function(r){ return r.tag===cat; });
    list.innerHTML=items.map(function(r){
      return '<button class="card" data-id="'+r.id+'"><b>'+r.t+'</b><small>'+r.s+'</small></button>';
    }).join("") || "<p class='meta'>Nichts in dieser Reihe.</p>";
    list.querySelectorAll(".card").forEach(function(b){
      b.onclick=function(){ fromPlan=null; openR(b.getAttribute("data-id")); };
    });
  };
  renderList();
})();
