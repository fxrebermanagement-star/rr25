(function(){
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./sw.js").catch(function(){});
  }
  var files=["ritual-list.js?v=1","ritual-navkill.js?v=1","ritual-look.js?v=13"];
  files.forEach(function(src){
    var s=document.createElement("script");
    s.src=src;
    document.body.appendChild(s);
  });
})();
