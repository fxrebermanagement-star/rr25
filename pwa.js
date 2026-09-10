(function(){
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./sw.js").catch(function(){});
  }
  ["ritual-list.js?v=2","ritual-navkill.js?v=1","ritual-look.js?v=13","ritual-feinschliff.js?v=2","ritual-order.js?v=1","ritual-backup.js?v=7","ritual-zahl.js?v=3","ritual-mond.js?v=1","ritual-zfix.js?v=1","ritual-design.js?v=3","ritual-sigil.js?v=9","ritual-type.js?v=3","ritual-sigil-live.js?v=1"].forEach(function(src){
    var s=document.createElement("script");
    s.src=src;
    document.body.appendChild(s);
  });
})();
