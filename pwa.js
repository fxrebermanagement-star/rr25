(function(){
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./sw.js").catch(function(){});
  }
  ["ritual-list.js?v=2","ritual-navkill.js?v=1","ritual-look.js?v=13","ritual-feinschliff.js?v=2","ritual-order.js?v=1","ritual-backup.js?v=4"].forEach(function(src){
    var s=document.createElement("script");
    s.src=src;
    document.body.appendChild(s);
  });
})();
