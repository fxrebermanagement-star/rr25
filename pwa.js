(function(){
  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("./sw.js?v=4").catch(function(){});
  }
})();
