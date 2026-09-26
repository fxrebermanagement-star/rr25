(function(){
  if(typeof fill==="function" && !fill._wes2){
    var _f=fill;
    fill=function(s,m){
      return _f(s,m).split("[Auftrag]").join((m&&m.Auftrag)||"[Auftrag]");
    };
    fill._wes2=1;
  }
  var STEPS=[
    ["Vorbereitung",
      "Auftrag oben eingeben. Ein Satz.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur dieser Auftrag.\nIch bleibe ich."],
    ["Standort",
      "Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage."],
    ["Feld hart",
      "Tu:\nGrenze um den Körper.\n\nSprich:\nIch schliesse mein Feld hart."],
    ["Ruf",
      "Tu:\nEinen Atem. Nicht fragen. Nicht warten auf Antwort.\n\nSprich:\nDie Bahn trägt.\nIch führe.\nNur [Auftrag]."],
    ["Auftrag",
      "Sprich einmal:\nTrage [Auftrag].\nEin Ende.\nDann gehst du."],
    ["369",
      "Tu:\nZähler. Halte das Wort. Nicht neu setzen.\n\nDrei:\nDer Auftrag ist gegeben.\n\nSechs:\nEs wird getragen.\n\nNeun:\nEs ist gesetzt."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so."],
    ["Siegel",
      "Tu:\nHand vor die Flamme oder aufs Herz.\n\nSprich:\nVersiegelt.\nÜbergeben."],
    ["Rückkehr",
      "Tu:\nHaut. Atem. Füsse.\n\nSprich:\nIch bin hier.\nIch bin nicht die Bahn.\nFeld zu."],
    ["Schluss",
      "Sprich:\nDanke Feld.\n\nTu:\nWasser. Alltag.\nNicht nachkontrollieren."]
  ];
  if(typeof R==="undefined") return;
  var found=false;
  for(var i=0;i<R.length;i++){
    if(R[i].id==="wesen"){
      R[i].t="Wesenheit für Auftrag";
      R[i].s="Bahn trägt. Ich führe. Ein Ende.";
      R[i].tag="Feld";
      R[i].need=["Auftrag"];
      R[i].steps=STEPS;
      R[i]._ich=1;
      found=true;
    }
  }
  if(!found) R.push({id:"wesen",t:"Wesenheit für Auftrag",s:"Bahn trägt. Ich führe. Ein Ende.",tag:"Feld",need:["Auftrag"],steps:STEPS,_ich:1});
})();
