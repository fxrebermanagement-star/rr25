(function(){
  function go(){
    if(typeof R==="undefined") return;
    var hasSegen=false;
    for(var i=R.length-1;i>=0;i--){
      var r=R[i];
      if(r.id==="finst" || r.id==="fremd") R.splice(i,1);
      else if(r.id==="schaden"){ r.tag="Person X"; r.t="Schadenszauber"; r.s="Vorhanden. Nicht Pflicht."; }
      else if(r.id==="wesen"){ r.t="Wesenheit für Auftrag"; r.s="Kontakt mit Auftrag. Mass halten."; r.tag="Feld"; }
      else if(r.id==="segen"){
        hasSegen=true;
        r.t="Segen";
        r.s="Ein Name. Ein Satz Wofür.";
        r.tag="Person X";
        if(!r.need || r.need.indexOf("Wofür")<0) r.need=["Name","Wofür"];
      }
      else if(r.id==="fluch"){ r.t="Fluch"; r.s="Hart. Wort auf Person X."; r.tag="Person X"; }
    }
    if(!hasSegen){
      R.push({id:"segen",t:"Segen",s:"Ein Name. Ein Satz Wofür.",tag:"Person X",need:["Name","Wofür"],steps:[]});
    }
    if(typeof renderList==="function") renderList();
  }
  go();
  setTimeout(go,200);
  setTimeout(go,800);
  setTimeout(go,1800);
})();
