(function(){
  var STEPS=[
    ["Vorbereitung",
      "Name von [Name] oben eingeben.\nFoto wenn da: Anker, dann umdrehen.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur [Name].\nNur das Wort.\nKein Nachsetzen.\nIch bleibe ich."],
    ["Ankommen",
      "Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler.\nDer Beobachter ist wach.\nWut steuert nicht."],
    ["Feld hart",
      "Tu:\nGrenze um den Körper. Einmal feststehen.\n\nSprich:\nIch schliesse mein Feld hart.\nNichts Fremdes hat Zutritt.\nMeine Energie gehört mir."],
    ["Lage",
      "Sprich:\n[Name] steht im Wort.\nOhne [Name] zu werden.\nOhne mich zu verlieren."],
    ["Rufen",
      "Tu:\nFeld bleibt hart. Einen Atem.\n\nSprich:\nDu bist da.\nIch führe.\nDu trägst nur das Wort auf [Name].\nKein Theater. Kein Sog. Kein Mehr."],
    ["Auftrag geben",
      "Sprich:\nTrage das Wort zu [Name]. Hart.\nKein Ausweichen.\nKein eigener Krieg.\nKein Bleiben in [Name].\nDanach gehst du vollständig."],
    ["Wort",
      "Sprich:\nIch setze das Wort hart auf [Name].\nDie Bahn von [Name] gegen mich bricht und bleibt gebrochen.\nJedes Ausweichen fällt.\nWas [Name] als Schaden setzt, kehrt vollständig zur Quelle.\nKein Halt. Kein Zugang. Kein Nachsatz zu mir.\nDu trägst. Ich führe."],
    ["369",
      "Tu:\nZähler. Halte das Wort. Nicht neu setzen.\n\nDrei:\nDas Wort sitzt hart auf [Name].\n\nSechs:\nDie Bahn ist zu. Die Rückgabe läuft.\n\nNeun:\nGeschlossen. Es bleibt gesetzt."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so."],
    ["Siegel",
      "Tu:\nHand vor die Flamme oder aufs Herz. Einen Atem.\n\nSprich:\nVersiegelt.\nAbgegeben.\nGeschlossen."],
    ["Entlassen",
      "Tu:\nNicht nachwinken. Tor zu.\n\nSprich:\nDer Auftrag ist beendet.\nIch danke dir.\nDu bist frei.\nAlle Verbindungen lösen sich.\nDu bleibst nicht.\nIch schliesse das Tor."],
    ["Rückkehr",
      "Tu:\nHaut. Atem. Füsse. Raum.\n\nSprich:\nIch bin nicht [Name].\nIch bin nicht die Wesenheit.\nIch kehre vollständig zurück.\nMeine Energie gehört mir."],
    ["Schluss",
      "Sprich dreimal:\nDanke Gott.\nDanke Universum.\nDanke Energien.\nDanke Feld.\n\nSprich:\nKein zweites Ritual aus Unruhe heute.\n\nTu:\nWasser. Alltag. Nicht nachsetzen."]
  ];
  if(typeof R==="undefined") return;
  var found=false;
  for(var i=0;i<R.length;i++){
    if(R[i].id==="fluch"){
      R[i].t="Fluch";
      R[i].s="Hart. Wort auf Person X.";
      R[i].tag="Person X";
      R[i].need=["Name"];
      R[i].steps=STEPS;
      found=true;
    }
  }
  if(!found) R.push({id:"fluch",t:"Fluch",s:"Hart. Wort auf Person X.",tag:"Person X",need:["Name"],steps:STEPS});
})();
