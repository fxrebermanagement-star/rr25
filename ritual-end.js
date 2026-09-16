(function(){
  function wipe(){
    ["afterStay","stay"].forEach(function(id){
      var el=document.getElementById(id);
      if(el) el.remove();
    });
    document.querySelectorAll("button").forEach(function(b){
      var t=(b.textContent||"").trim();
      if(t==="Später" || t==="Bleiben") b.remove();
    });
    var go=document.getElementById("afterGo");
    if(go){
      go.textContent="Fertig";
      go.onclick=function(){ if(typeof show==="function") show("home"); };
    }
  }
  document.addEventListener("click", function(e){
    var btn=e.target && e.target.closest && e.target.closest("#run #next");
    if(!btn) return;
    var back=document.getElementById("back");
    if(back) back.checked=true;
  }, true);
  wipe();
  if(typeof show==="function" && !show._end){
    var prev=show;
    show=function(id){
      var r=prev.apply(this,arguments);
      setTimeout(wipe,0);
      setTimeout(wipe,80);
      return r;
    };
    show._end=1;
  }
  if(window.MutationObserver){
    var after=document.getElementById("after");
    if(after) new MutationObserver(wipe).observe(after,{childList:true,subtree:true});
  }
})();
