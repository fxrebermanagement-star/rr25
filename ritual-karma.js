(function(){
  var STEPS=[
    ["Vorbereitung",
      "Name von [Name] oben eingeben.\n\nTu:\nEine Kerze am Platz. Wasser danach.\n\nSprich:\nNur Ausgleich mit [Name].\nKeine Rache.\nKein Nachsetzen.\nIch bleibe ich."],
    ["Ankommen",
      "Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler.\nDer Beobachter ist wach."],
    ["Feld hart",
      "Tu:\nGrenze um den Körper. Einmal feststehen.\n\nSprich:\nIch schliesse mein Feld hart.\nNichts Fremdes hat Zutritt.\nMeine Energie gehört mir."],
    ["Lage",
      "Sprich:\nWas zwischen mir und [Name] genommen oder aufgeladen wurde, darf jetzt in stimmiger Form zurück.\nDie Last darf gehen.\nOhne Hass."],
    ["Rufen",
      "Tu:\nFeld bleibt hart. Einen Atem. Mitte spüren.\nBei Nebel warten, bis es still ist.\n\nSprich:\nDu bist da.\nIch führe.\nDu trägst nur den Ausgleich mit [Name].\nKein Theater. Kein Sog. Kein Mehr."],
    ["Auftrag geben",
      "Sprich:\nTrage den Ausgleich mit [Name].\nNur Rückgabe. Nur Lösung.\nKein eigener Krieg. Kein Schaden darüber hinaus.\nDanach gehst du vollständig."],
    ["Wort",
      "Sprich:\nWas zwischen mir und [Name] genommen oder aufgeladen wurde, kehrt jetzt in stimmiger Form zurück.\nDer Ausgleich geschieht ohne Hass.\nDie Last darf gehen.\nDu trägst. Ich führe."],
    ["369",
      "Tu:\nZähler. Halte das Wort. Nicht neu setzen.\n\nDrei:\nDer Ausgleich geschieht.\n\nSechs:\nDie Energie kehrt rein zurück.\n\nNeun:\nEs ist vollendet."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so."],
    ["Siegel",
      "Tu:\nHand vor die Flamme oder aufs Herz. Einen Atem.\n\nSprich:\nVersiegelt.\nDas Feld hat es."],
    ["Entlassen",
      "Tu:\nNicht nachwinken. Tor zu.\n\nSprich:\nDer Auftrag ist beendet.\nIch danke dir.\nDu bist frei.\nAlle Verbindungen lösen sich.\nDu bleibst nicht.\nIch schliesse das Tor."],
    ["Rückkehr",
      "Tu:\nHaut. Atem. Füsse. Raum.\n\nSprich:\nIch bin nicht [Name].\nIch bin nicht die Wesenheit.\nIch kehre vollständig zurück.\nMeine Energie gehört mir."],
    ["Schluss",
      "Sprich dreimal:\nDanke Gott.\nDanke Universum.\nDanke Energien.\nDanke Feld.\n\nSprich:\nKein zweites Ritual aus Unruhe heute.\n\nTu:\nWasser. Alltag. Nicht nachkontrollieren."]
  ];
  if(typeof R==="undefined") return;
  var found=false;
  for(var i=0;i<R.length;i++){
    if(R[i].id==="karma"){
      R[i].t="Karma-Ausgleich";
      R[i].s="Nicht Rache. Ausgleich mit Person X.";
      R[i].tag="Energie";
      R[i].need=["Name"];
      R[i].steps=STEPS;
      found=true;
    }
  }
  if(!found){
    R.push({id:"karma",t:"Karma-Ausgleich",s:"Nicht Rache. Ausgleich mit Person X.",tag:"Energie",need:["Name"],steps:STEPS});
  }
})();
