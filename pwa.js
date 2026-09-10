(function(){
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./sw.js").catch(function(){});
  }
  var a=document.createElement("script");
  a.src="ritual-list.js?v=1";
  document.body.appendChild(a);
  var b=document.createElement("script");
  b.src="ritual-navkill.js?v=1";
  document.body.appendChild(b);
})();
