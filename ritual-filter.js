if(typeof cat!=="undefined" && (cat==="Alle"||cat==="Alltag")) cat="Schutz";
(function(){
  var old=renderList;
  renderList=function(){
    if(cat==="Alle"||cat==="Alltag") cat="Schutz";
    old();
    ["Alle","Alltag"].forEach(function(name){
      var n=document.querySelector('#cats [data-cat="'+name+'"]');
      if(n) n.remove();
    });
    var home=document.getElementById("home");
    var cats=document.getElementById("cats");
    var pin=document.getElementById("pinDank");
    if(home&&cats&&!pin){
      pin=document.createElement("button");
      pin.type="button";
      pin.id="pinDank";
      pin.className="card";
      pin.innerHTML="<b>Tägliches Dankesritual</b><small>Gesundheit · Liebe · Geld · Schutz</small>";
      pin.onclick=function(){ fromPlan=null; openR("dank"); };
      home.insertBefore(pin, cats);
    }
    document.querySelectorAll('#list [data-id="dank"]').forEach(function(el){
      var prev=el.previousElementSibling;
      el.remove();
      if(prev&&prev.classList.contains("group")&&/Alltag/.test(prev.textContent)) prev.remove();
    });
  };
  renderList();
})();
