(function(){
  var STEPS=[
    ["Vorbereitung",
      "Name oben eingeben.\nFoto wenn da: Anker, dann umdrehen. Bild bleibt unten.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur [Name].\nNur das Wort.\nKein Nachsetzen."],
    ["Standort",
      "Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage."],
    ["Feld hart",
      "Tu:\nGrenze um den Körper.\n\nSprich:\nIch schliesse mein Feld hart."],
    ["Ruf",
      "Tu:\nEinen Atem. Nicht fragen.\n\nSprich:\nDie Bahn trägt.\nIch führe.\nNur das Wort."],
    ["Versetzen",
      "Tu:\nFoto bleibt unten. Name laut. Einmal stehen.\n\nSprich:\nIch bin [Name].\nNur für dieses Wort."],
    ["Auftrag",
      "Sprich von innen:\nIch trage das Wort hart.\nKein Ausweichen.\nEin Ende."],
    ["Wort",
      "Sprich:\nDie Bahn gegen die Quelle bricht und bleibt gebrochen.\nWas gesetzt wird, kehrt zur Quelle.\nKein Nachsatz."],
    ["369",
      "Tu:\nZähler. Nicht neu setzen.\n\nDrei:\nDas Wort sitzt.\n\nSechs:\nDie Bahn ist zu.\n\nNeun:\nEs bleibt gesetzt."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so."],
    ["Siegel",
      "Tu:\nHand vor die Flamme oder aufs Herz.\n\nSprich:\nVersiegelt.\nÜbergeben."],
    ["Rückkehr",
      "Tu:\nSofort. Haut. Atem. Füsse.\n\nSprich:\nIch bin wieder ich.\nIch bin nicht [Name].\nIch bin hier.\nFeld zu."],
    ["Schluss",
      "Sprich:\nDanke Feld.\n\nTu:\nWasser. Alltag.\nKein zweites Ritual aus Unruhe."]
  ];
  if(typeof R==="undefined") return;
  var found=false;
  for(var i=0;i<R.length;i++){
    if(R[i].id==="fluch"){
      R[i].t="Fluch";
      R[i].s="Hart. Bahn trägt. Wort von innen.";
      R[i].tag="Person X";
      R[i].need=["Name"];
      R[i].steps=STEPS;
      R[i]._ich=1;
      found=true;
    }
  }
  if(!found) R.push({id:"fluch",t:"Fluch",s:"Hart. Bahn trägt. Wort von innen.",tag:"Person X",need:["Name"],steps:STEPS,_ich:1});
})();
