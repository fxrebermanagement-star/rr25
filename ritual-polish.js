(function(){
  var run=document.getElementById("run");
  if(!run) return;
  function bar(){
    var sub=run.querySelector(".sub");
    if(!sub) return;
    var m=String(sub.textContent||"").match(/(\d+)\s*[\/·]\s*(\d+)/);
    var el=run.querySelector(".pbar");
    if(!el){
      el=document.createElement("div");
      el.className="pbar";
      run.insertBefore(el, run.firstChild);
    }
    if(m){
      var a=+m[1], b=+m[2]||1;
      el.style.setProperty("--p", Math.max(6, Math.round(a/b*100))+"%");
    }
  }
  new MutationObserver(bar).observe(run,{childList:true,subtree:true});
})();
