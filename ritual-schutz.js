(function(){
  var STEPS=[
    ["Vorbereitung",
      "Tu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur Schutz. Nur ich."],
    ["Standort",
      "Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage."],
    ["Feld hart",
      "Tu:\nGrenze um den Körper.\n\nSprich:\nIch schliesse mein Feld hart."],
    ["Wort",
      "Sprich:\nIch schütze mich vollständig.\nDie Grenze hält.\nFremdes findet keinen Halt."],
    ["369",
      "Tu:\nZähler. Nicht neu setzen.\n\nDrei:\nDas Feld ist hart.\n\nSechs:\nFremdes prallt ab.\n\nNeun:\nIch bin bei mir."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so."],
    ["Siegel",
      "Tu:\nHand aufs Herz.\n\nSprich:\nVersiegelt."],
    ["Schluss",
      "Sprich:\nIch bin hier.\nFeld zu.\n\nTu:\nWasser. Alltag."]
  ];
  var WEG=[
    ["Standort",
      "Tu:\nFüsse. Einen Atem.\n\nSprich:\nIch bin hier."],
    ["Feld hart",
      "Sprich:\nIch schliesse mein Feld hart."],
    ["Wort",
      "Sprich:\nIch bin geschützt unterwegs.\nDie Bahn bleibt bei mir."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so."],
    ["Schluss",
      "Sprich:\nFeld zu.\n\nTu:\nWeitergehen."]
  ];
  if(typeof R==="undefined") return;
  var found=false, foundW=false;
  for(var i=0;i<R.length;i++){
    if(R[i].id==="schutz"){
      R[i].t="Schutz selbst"; R[i].s="Feld hart. Wort. Zu."; R[i].tag="Schutz"; R[i].steps=STEPS; delete R[i].need; found=true;
    }
    if(R[i].id==="weg"){
      R[i].t="Schutz unterwegs"; R[i].s="Kurz. 3× Es ist so."; R[i].tag="Schutz"; R[i].steps=WEG; delete R[i].need; foundW=true;
    }
  }
  if(!found) R.push({id:"schutz",t:"Schutz selbst",s:"Feld hart. Wort. Zu.",tag:"Schutz",steps:STEPS});
  if(!foundW) R.push({id:"weg",t:"Schutz unterwegs",s:"Kurz. 3× Es ist so.",tag:"Schutz",steps:WEG});
})();
