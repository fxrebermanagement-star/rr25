(function(){
  if(!("serviceWorker" in navigator)) return;
  if(window.caches){
    caches.keys().then(function(keys){
      keys.forEach(function(k){ caches.delete(k); });
    });
  }
  navigator.serviceWorker.getRegistrations().then(function(rs){
    rs.forEach(function(r){ r.update(); });
  });
  navigator.serviceWorker.register("./sw.js?v=6").then(function(reg){
    if(reg.waiting){
      try{ reg.waiting.postMessage("skip"); }catch(e){}
    }
    setTimeout(function(){ try{ reg.update(); }catch(e){} }, 4000);
  }).catch(function(){});
  navigator.serviceWorker.addEventListener("controllerchange", function(){
    if(window.__rr25reload) return;
    window.__rr25reload=1;
    location.reload();
  });
})();
