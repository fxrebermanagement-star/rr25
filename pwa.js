(function(){
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./sw.js").catch(function(){});
  }
  var s=document.createElement("script");
  s.src="ritual-person-boot.js?v=2";
  document.body.appendChild(s);
})();
