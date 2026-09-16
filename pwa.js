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
  navigator.serviceWorker.register("./sw.js?v=5").catch(function(){});
})();
