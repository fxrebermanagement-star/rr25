(function(){
  function go(){
    if(typeof R==="undefined") return;
    for(var i=R.length-1;i>=0;i--){
      var id=R[i].id;
      if(id==="finst" || id==="fremd" || id==="fil"){
        R.splice(i,1);
        continue;
      }
      if(id==="wesen"){
        R[i].t="Wesenheit für Auftrag";
        R[i].s="Kontakt mit Auftrag. Mass halten.";
        R[i].tag="Feld";
      }
      if(id==="ahn"){
        R[i].t="Ahnen rufen";
        R[i].s="Ehren, begrenzen, Auftrag.";
        R[i].tag="Feld";
      }
    }
  }
  go();
  if(typeof renderList==="function" && !renderList._feld){
    var prev=renderList;
    renderList=function(){ go(); prev(); };
    renderList._feld=1;
  }
  if(typeof renderList==="function") renderList();
})();
