var CACHE="rr25-v24";
self.addEventListener("install", function(e){
  self.skipWaiting();
});
self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){
        if(k!==CACHE) return caches.delete(k);
      }));
    }).then(function(){ return self.clients.claim(); })
  );
});
self.addEventListener("fetch", function(e){
  var req=e.request;
  if(req.method!=="GET") return;
  /* Seitenaufruf: Chrome übernimmt cache:"no-store" bei Navigationen nicht und liefert index.html sonst
     bis zu 10 Minuten aus dem HTTP-Cache (GitHub Pages: max-age=600). Darum die Seite über die Adresse frisch holen. */
  var net=req.mode==="navigate"
    ? fetch(req.url, {cache:"no-store", credentials:"same-origin", redirect:"manual"})
    : fetch(req, {cache:"no-store"});
  e.respondWith(
    net.then(function(res){
      return res;
    }).catch(function(){
      return caches.match(req);
    })
  );
});
/* Tippen auf eine Erinnerung (nur mit Opt-in in «Mehr»): offene App nach vorne holen, sonst öffnen */
self.addEventListener("notificationclick", function(e){
  e.notification.close();
  var url=(e.notification.data&&e.notification.data.url)||"./";
  e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(function(cs){
    for(var i=0;i<cs.length;i++){ if("focus" in cs[i]){ if(cs[i].navigate && url.indexOf("#")>0) cs[i].navigate(url); return cs[i].focus(); } }
    return self.clients.openWindow(url);
  }));
});
