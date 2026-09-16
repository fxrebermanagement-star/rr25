(function(){
  var DROP={finst:1,fremd:1,fil:1};
  function lock(){
    if(typeof R==="undefined") return;
    for(var i=R.length-1;i>=0;i--){
      var r=R[i];
      if(DROP[r.id]){ R.splice(i,1); continue; }
      if(r.id==="wesen"){ r.t="Wesenheit für Auftrag"; r.s="Kontakt mit Auftrag. Mass halten."; r.tag="Feld"; }
      if(r.id==="ahn"){ r.t="Ahnen rufen"; r.s="Ehren, begrenzen, Auftrag."; r.tag="Feld"; }
      if(r.id==="segen"){ r.t="Segen"; r.s="Ein Name. Ein Satz Wofür."; r.tag="Person X"; if(!r.need) r.need=["Name","Wofür"]; }
      if(r.id==="fluch"){ r.t="Fluch"; r.s="Ein Name. Ein Satz Mass."; r.tag="Person X"; if(!r.need) r.need=["Name","Mass"]; }
      if(r.id==="ueber"){ r.t="Person übernehmen"; r.s="Hart. Ich bin [Name]. Bis ich schliesse."; r.tag="Person X"; if(!r.need) r.need=["Name","Auftrag"]; }
      if(r.id==="schaden"){ r.t="Schadenszauber"; r.s="Vorhanden. Nicht Pflicht."; r.tag="Person X"; }
    }
  }
  lock();
  if(typeof renderList==="function" && !renderList._lock){
    var prev=renderList;
    renderList=function(){ lock(); prev(); };
    renderList._lock=1;
  }
  if(typeof renderList==="function"){
    try{ renderList(); }catch(e){}
  }
})();
