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
  navigator.serviceWorker.register("./sw.js?v=10").then(function(reg){
    if(reg.waiting){
      try{ reg.waiting.postMessage("skip"); }catch(e){}
    }
    setTimeout(function(){ try{ reg.update(); }catch(e){} }, 4000);
  }).catch(function(){});
  /* Kein automatisches Neuladen mehr, wenn ein neuer Service-Worker übernimmt: sw.js holt jede Datei
     ohnehin frisch aus dem Netz (network-first, no-store), die Seite ist also schon aktuell.
     Das Neuladen hat die App nach jedem Update ein zweites Mal aufgebaut (Flackern beim Start). */
})();
