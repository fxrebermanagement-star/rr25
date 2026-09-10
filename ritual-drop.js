(function(){
  ["fil","fremd"].forEach(function(id){
    for(var i=R.length-1;i>=0;i--) if(R[i].id===id) R.splice(i,1);
  });
  if(typeof renderList==="function") renderList();
})();
