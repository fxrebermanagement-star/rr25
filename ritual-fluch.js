(function(){
  var STEPS=[
    ["Vorbereitung",
      "Name von [Name] oben eingeben.\nFoto wenn da: Anker, dann umdrehen.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur [Name].\nNur das Wort.\nKein Nachsetzen."],
    ["Standort",
      "Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage."],
    ["Feld hart",
      "Tu:\nGrenze um den Körper. Einmal feststehen.\n\nSprich:\nIch schliesse mein Feld hart.\nNichts Fremdes hat Zutritt.\nMeine Energie gehört mir."],
    ["Versetzen",
      "Tu:\nName laut. Foto wenn da. Einmal stehen. Nicht schauspielern.\n\nSprich:\nIch bin [Name].\nNur für dieses Wort.\nNicht die ganze Biografie."],
    ["Rufen",
      "Tu:\nFeld bleibt hart. Einen Atem.\n\nSprich:\nDu bist da.\nIch führe.\nDu trägst nur das Wort.\nKein Theater. Kein Sog. Kein Mehr."],
    ["Auftrag",
      "Sprich aus [Name] heraus:\nIch trage das Wort hart.\nKein Ausweichen.\nKein eigener Krieg.\nKein Bleiben über das Wort hinaus."],
    ["Wort",
      "Sprich:\nIch bin [Name].\nDie Bahn gegen die Quelle bricht und bleibt gebrochen.\nJedes Ausweichen fällt.\nWas als Schaden gesetzt wird, kehrt vollständig zur Quelle.\nKein Halt. Kein Zugang. Kein Nachsatz."],
    ["369",
      "Tu:\nZähler. Halte das Wort. Nicht neu setzen.\n\nDrei:\nDas Wort sitzt.\n\nSechs:\nDie Bahn ist zu.\n\nNeun:\nGeschlossen. Es bleibt gesetzt."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so."],
    ["Siegel",
      "Tu:\nHand vor die Flamme oder aufs Herz. Einen Atem.\n\nSprich:\nVersiegelt.\nAbgegeben.\nGeschlossen."],
    ["Entlassen",
      "Tu:\nNicht nachwinken. Tor zu.\n\nSprich:\nDer Auftrag ist beendet.\nIch danke dir.\nDu bist frei.\nAlle Verbindungen lösen sich.\nDu bleibst nicht.\nIch schliesse das Tor."],
    ["Rückkehr",
      "Tu:\nHaut. Atem. Füsse. Raum.\n\nSprich:\nIch bin nicht [Name].\nIch bin wieder ich.\nIch bin hier.\nFeld zu.\nMeine Energie gehört mir."],
    ["Schluss",
      "Sprich dreimal:\nDanke Gott.\nDanke Universum.\nDanke Energien.\nDanke Feld.\n\nSprich:\nKein zweites Ritual aus Unruhe heute.\n\nTu:\nWasser. Alltag. Nicht nachsetzen."]
  ];
  if(typeof R==="undefined") return;
  var found=false;
  for(var i=0;i<R.length;i++){
    if(R[i].id==="fluch"){
      R[i].t="Fluch";
      R[i].s="Hart. Ich bin [Name]. Wort von innen.";
      R[i].tag="Person X";
      R[i].need=["Name"];
      R[i].steps=STEPS;
      found=true;
    }
  }
  if(!found) R.push({id:"fluch",t:"Fluch",s:"Hart. Ich bin [Name]. Wort von innen.",tag:"Person X",need:["Name"],steps:STEPS});
})();
