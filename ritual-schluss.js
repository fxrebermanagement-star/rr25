(function(){
  if(typeof openR!=="function") return;
  var _o=openR;
  openR=function(){ return _o.apply(this,arguments); };
})();
