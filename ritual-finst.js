(function(){
  var r=R.find(function(x){return x.id==="finst"});
  if(!r) return;
  r.t="Festigen und halten";
  r.s="Was wahr ist, bleibt. Altes darf fallen.";
  if(typeof renderList==="function") renderList();
})();
