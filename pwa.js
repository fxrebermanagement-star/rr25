(function(){
  if(!("serviceWorker" in navigator)) return;
  /* Stand dieser Datei. Muss zu <meta name="rr25-build"> in index.html passen (beide zusammen erhöhen).
     Kommt index.html noch aus einem alten Zwischenspeicher (älterer Stand), einmal frisch laden. Nutzerdaten bleiben unberührt. */
  var BUILD=15;
  var mb=document.querySelector('meta[name="rr25-build"]'), have=mb?+mb.getAttribute("content"):0;
  if(have<BUILD){
    try{
      if(sessionStorage.getItem("rr25_frisch")!==String(BUILD)){
        sessionStorage.setItem("rr25_frisch",String(BUILD));
        location.reload();
      }
    }catch(e){}
  }
  if(window.caches){
    caches.keys().then(function(keys){
      keys.forEach(function(k){ caches.delete(k); });
    });
  }
  navigator.serviceWorker.getRegistrations().then(function(rs){
    rs.forEach(function(r){ r.update(); });
  });
  navigator.serviceWorker.register("./sw.js?v=15").then(function(reg){
    if(reg.waiting){
      try{ reg.waiting.postMessage("skip"); }catch(e){}
    }
    setTimeout(function(){ try{ reg.update(); }catch(e){} }, 4000);
  }).catch(function(){});
  /* Kein automatisches Neuladen mehr, wenn ein neuer Service-Worker übernimmt: sw.js holt jede Datei
     ohnehin frisch aus dem Netz (network-first, no-store), die Seite ist also schon aktuell.
     Das Neuladen hat die App nach jedem Update ein zweites Mal aufgebaut (Flackern beim Start). */
})();
