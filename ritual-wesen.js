(function(){
  if(typeof fill==="function" && !fill._wes3){
    var _f=fill;
    fill=function(s,m){ return _f(s,m).split("[Auftrag]").join((m&&m.Auftrag)||"[Auftrag]"); };
    fill._wes3=1;
  }
  var STEPS=[
    ["Vorbereitung","Auftrag oben. Ein Satz.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur [Auftrag].\nIch bleibe ich."],
    ["Standort","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage."],
    ["Mein Feld","Sprich:\nIch schliesse mein Feld hart."],
    ["Ruf","Tu:\nEinen Atem. Nicht fragen.\n\nSprich:\nDie Bahn trägt.\nIch führe.\nNur [Auftrag]."],
    ["Auftrag","Sprich:\nTrage [Auftrag].\nDie Bahn hält."],
    ["Wort","Sprich:\n[Auftrag] läuft."],
    ["369","Tu:\nZähler.\n\nDrei:\nGegeben.\n\nSechs:\nGetragen.\n\nNeun:\nGesetzt."],
    ["Es ist so","Sprich dreimal:\nEs ist so."],
    ["Rückkehr","Sprich:\nIch bin hier.\nIch bin nicht die Bahn.\nFeld zu."],
    ["Siegel","Tu:\nAls du. Hand vor die Flamme.\n\nSprich:\nVersiegelt.\nÜbergeben.\nEs läuft."],
    ["Schluss","Sprich:\nDanke Feld.\n\nTu:\nWasser. Alltag."]
  ];
  if(typeof R==="undefined") return;
  var found=false;
  for(var i=0;i<R.length;i++){
    if(R[i].id==="wesen"){
      R[i].t="Wesenheit für Auftrag"; R[i].s="Bahn trägt. Ich führe."; R[i].tag="Feld"; R[i].need=["Auftrag"]; R[i].steps=STEPS; R[i]._ich=1; found=true;
    }
  }
  if(!found) R.push({id:"wesen",t:"Wesenheit für Auftrag",s:"Bahn trägt. Ich führe.",tag:"Feld",need:["Auftrag"],steps:STEPS,_ich:1});
})();
