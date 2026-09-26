(function(){
  var STEPS=[
    ["Vorbereitung",
      "Name oben.\nFoto: Anker, umdrehen. Bleibt unten.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur [Name].\nNur das Wort."],
    ["Standort",
      "Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage."],
    ["Feld hart",
      "Tu:\nGrenze um den Körper.\n\nSprich:\nIch schliesse mein Feld hart."],
    ["Ruf",
      "Tu:\nEinen Atem. Nicht fragen.\n\nSprich:\nDie Bahn trägt.\nIch führe.\nFluch auf [Name]."],
    ["Versetzen",
      "Tu:\nFoto unten. Name laut. Stehen.\n\nSprich:\nIch bin [Name].\nNur für dieses Wort."],
    ["Auftrag",
      "Sprich von innen:\nIch bin [Name].\nIch trage das Wort hart.\nKein Ausweichen.\nKein Ende.\nDie Bahn hält."],
    ["Wort",
      "Sprich von innen:\nIch bin [Name].\nDas Wort sitzt hart in mir.\nWille und Bahn halten.\nKein Entkommen.\nKein Zugang zum Spieler.\nWas hier gesetzt ist, bleibt hier.\nNicht zum Träger."],
    ["369",
      "Tu:\nZähler. Das Wort halten.\n\nDrei:\nIch bin [Name]. Das Wort sitzt.\n\nSechs:\nDie Bahn hält. Kein Ausweichen.\n\nNeun:\nEs bleibt. Kein Ende."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so."],
    ["Siegel",
      "Tu:\nHand vor die Flamme.\n\nSprich:\nVersiegelt.\nÜbergeben.\nEs läuft."],
    ["Rückkehr",
      "Tu:\nSofort. Haut. Atem. Füsse.\n\nSprich:\nIch bin wieder ich.\nIch bin nicht [Name].\nIch bin hier.\nFeld zu."],
    ["Schluss",
      "Sprich:\nDanke Feld.\n\nTu:\nWasser. Alltag.\nFoto bleibt unten."]
  ];
  if(typeof R==="undefined") return;
  var found=false;
  for(var i=0;i<R.length;i++){
    if(R[i].id==="fluch"){
      R[i].t="Fluch";
      R[i].s="Ich bin [Name]. Hart. Bahn hält. Kein Ende.";
      R[i].tag="Person X";
      R[i].need=["Name"];
      R[i].steps=STEPS;
      R[i]._ich=1;
      found=true;
    }
  }
  if(!found) R.push({id:"fluch",t:"Fluch",s:"Ich bin [Name]. Hart. Bahn hält. Kein Ende.",tag:"Person X",need:["Name"],steps:STEPS,_ich:1});
})();
