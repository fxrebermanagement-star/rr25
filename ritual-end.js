(function(){
  function wipe(){
    var after=document.getElementById("after");
    if(!after) return;
    var stay=document.getElementById("afterStay");
    if(stay) stay.remove();
    var go=document.getElementById("afterGo");
    if(go){
      go.textContent="Fertig";
      go.onclick=function(){ if(typeof show==="function") show("home"); };
    }
  }
  document.addEventListener("click", function(e){
    var t=e.target && e.target.closest && e.target.closest("#run #next");
    if(!t) return;
    var back=document.getElementById("back");
    var feld=document.getElementById("feldCheck");
    if(back) back.checked=true;
    if(feld) feld.checked=true;
  }, true);
  if(typeof show==="function" && !show._end){
    var prev=show;
    show=function(id){
      var r=prev.apply(this,arguments);
      if(id==="after") setTimeout(wipe,0);
      return r;
    };
    show._end=1;
  }
})();
