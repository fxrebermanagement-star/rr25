(function(){
  var STEPS=[
    ["Vorbereitung",
      "Name von [Name] oben eingeben.\nFoto wenn da: Anker, dann umdrehen.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur Trennung. Nur der Faden zu [Name].\nKein Hass.\nKein Nachsetzen.\nIch bleibe ich."],
    ["Ankommen",
      "Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler.\nDer Beobachter ist wach."],
    ["Feld hart",
      "Tu:\nGrenze um den Körper. Einmal feststehen.\n\nSprich:\nIch schliesse mein Feld hart.\nNichts Fremdes hat Zutritt.\nMeine Energie gehört mir."],
    ["Lage",
      "Sprich:\nDie Verbindung zwischen mir und [Name] darf sich lösen.\nAlle unstimmigen Fäden werden getrennt.\nIch lasse frei und werde frei."],
    ["Rufen",
      "Tu:\nFeld bleibt hart. Einen Atem. Mitte halten.\n\nSprich:\nDu bist da.\nIch führe.\nDu trägst nur die Trennung des Fadens zu [Name].\nKein Theater. Kein Sog. Kein Mehr."],
    ["Auftrag geben",
      "Sprich:\nTrenne den Faden zwischen mir und [Name].\nNur der Faden.\nKein Urteil. Kein Schaden darüber hinaus.\nDanach gehst du vollständig."],
    ["Wort",
      "Sprich:\nDie Verbindung zwischen mir und [Name] löst sich.\nDie Fäden fallen ab und kehren zum Ursprung.\nIch lasse frei. Ich werde frei.\nDu trägst. Ich führe."],
    ["369",
      "Tu:\nZähler. Halte das Wort. Nicht neu setzen.\n\nDrei:\nDie Verbindung löst sich.\n\nSechs:\nFäden fallen ab.\n\nNeun:\nDie Trennung ist vollzogen."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so."],
    ["Siegel",
      "Tu:\nHand vor die Flamme oder aufs Herz. Einen Atem.\n\nSprich:\nVersiegelt.\nDas Feld hat es."],
    ["Entlassen",
      "Tu:\nNicht nachwinken. Tor zu.\n\nSprich:\nDer Auftrag ist beendet.\nIch danke dir.\nDu bist frei.\nAlle Verbindungen lösen sich.\nDu bleibst nicht.\nIch schliesse das Tor."],
    ["Rückkehr",
      "Tu:\nHaut. Atem. Füsse. Raum.\n\nSprich:\nIch bin nicht [Name].\nIch bin nicht die Wesenheit.\nIch kehre vollständig zurück.\nMeine Energie gehört mir."],
    ["Schluss",
      "Sprich dreimal:\nDanke Gott.\nDanke Universum.\nDanke Energien.\nDanke Feld.\n\nTu:\nWasser. Alltag. Nicht nachkontrollieren."]
  ];
  if(typeof R==="undefined") return;
  var found=false;
  for(var i=0;i<R.length;i++){
    if(R[i].id==="trenn"){
      R[i].t="Trennung — selbst";
      R[i].s="Nur der Faden zu Person X.";
      R[i].tag="Trennung";
      R[i].need=["Name"];
      R[i].steps=STEPS;
      found=true;
    }
  }
  if(!found) R.push({id:"trenn",t:"Trennung — selbst",s:"Nur der Faden zu Person X.",tag:"Trennung",need:["Name"],steps:STEPS});
})();
