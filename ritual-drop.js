(function(){
  ["fil","fremd"].forEach(function(id){
    for(var i=R.length-1;i>=0;i--) if(R[i].id===id) R.splice(i,1);
  });
  var w=R.find(function(x){return x.id==="wesen"});
  if(w){
    w.t="Wesenheit";
    w.s="Nur wenn nötig. Hartes Ende.";
  }
  if(typeof renderList==="function") renderList();
})();
