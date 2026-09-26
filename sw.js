var CACHE="rr25-v6";
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
  e.respondWith(
    fetch(req, {cache:"no-store"}).then(function(res){
      return res;
    }).catch(function(){
      return caches.match(req);
    })
  );
});
