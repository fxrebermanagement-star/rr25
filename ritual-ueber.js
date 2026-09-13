(function(){
  if(typeof fill==="function"){
    var _f=fill;
    fill=function(s,m){
      return _f(s,m).split("[Auftrag]").join((m&&m.Auftrag)||"[Auftrag]");
    };
  }
  function card(){
    var list=document.getElementById("list");
    if(!list) return;
    if(typeof cat!=="undefined" && cat!=="Person X") return;
    if(list.querySelector('[data-id="ueber"]')) return;
    var b=document.createElement("button");
    b.type="button"; b.className="card"; b.setAttribute("data-id","ueber");
    b.innerHTML="<b>Person übernehmen</b><small>Person X für Aufgabe X</small>";
    b.onclick=function(){ fromPlan=null; openR("ueber"); };
    list.insertBefore(b, list.firstChild);
  }
  var old=renderList;
  if(typeof old==="function"){
    renderList=function(){
      old();
      card();
    };
  }
  card();
})();
