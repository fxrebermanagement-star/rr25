var CACHE="rr25-v47";
/* Offline-Vorrat: alles, was die App zum Starten braucht. Online bleibt es wie bisher: jede Datei frisch aus dem Netz.
   Der Vorrat ist nur der Ersatz, wenn kein Netz da ist. Liste anpassen, wenn index.html andere Dateien lädt. */
var VORRAT=[
  "./", "index.html", "styles-v13a.css", "styles-v13b.css",
  "bundle-1.js", "bundle-2.js", "bundle-3.js", "bundle-4.js", "bundle-5.js", "bundle-6.js", "bundle-7.js",
  "manifest.webmanifest", "icon-44.svg", "icon-44-maskable.svg", "icon.svg", "rune.svg",
  "kalender.json", "kalender-more.json", "kalender-2027a.json", "kalender-2027b.json",
  "resonanzen-a.json", "resonanzen-b.json", "resonanzen-c.json",
  "resonanzen-ico-a.json", "resonanzen-ico-b.json", "resonanzen-ico-c.json"
];
/* Schlüssel ohne ?v=… und #…, damit jede Version einer Datei denselben Platz im Vorrat hat */
function key(url){ var u=new URL(url, self.registration.scope); u.search=""; u.hash=""; return u.href; }
var IM_VORRAT={};
VORRAT.forEach(function(p){ IM_VORRAT[key(p)]=1; });
self.addEventListener("install", function(e){
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(c){
    return Promise.all(VORRAT.map(function(p){
      return fetch(key(p), {cache:"no-store"}).then(function(res){
        if(res.ok) return c.put(key(p), res);
      }).catch(function(){});
    }));
  }));
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
  var k=key(req.url);
  e.respondWith(
    net.then(function(res){
      /* Frische Antwort auch in den Offline-Vorrat legen, damit er immer dem letzten Online-Stand entspricht */
      if(IM_VORRAT[k] && res && res.ok && res.type==="basic"){
        var copy=res.clone();
        var put=caches.open(CACHE).then(function(c){ return c.put(k, copy); }).catch(function(){});
        try{ e.waitUntil(put); }catch(x){}
      }
      return res;
    }).catch(function(){
      return caches.match(k).then(function(hit){
        if(hit || req.mode!=="navigate") return hit || Response.error();
        return caches.match(key("./")).then(function(home){ return home || Response.error(); });
      });
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
