(function(){
  function drop(){
    if(typeof R==="undefined") return;
    for(var i=R.length-1;i>=0;i--){
      if(R[i].id==="schaden") R.splice(i,1);
    }
  }
  drop();
  if(typeof renderList==="function" && !renderList._sch){
    var prev=renderList;
    renderList=function(){ drop(); prev(); };
    renderList._sch=1;
  }
  if(typeof renderList==="function"){
    try{ renderList(); }catch(e){}
  }
})();
