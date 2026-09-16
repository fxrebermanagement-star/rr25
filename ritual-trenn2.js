(function(){
  var STEPS=[
    ["Vorbereitung",
      "Beide Namen oben eingeben.\nFoto wenn da: Anker, dann umdrehen.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur Trennung. Nur der Faden zwischen [A] und [B].\nKein Hass.\nKein Nachsetzen.\nIch bleibe ich.\nIch werde weder [A] noch [B]."],
    ["Ankommen",
      "Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler.\nDer Beobachter ist wach."],
    ["Feld hart",
      "Tu:\nGrenze um den Körper. Einmal feststehen.\n\nSprich:\nIch schliesse mein Feld hart.\nNichts Fremdes hat Zutritt.\nMeine Energie gehört mir."],
    ["Lage",
      "Sprich:\nIhre Wege gehören ihnen.\nDen Faden zwischen ihnen wahrnehmen, nicht den zu mir.\nDie unstimmige Verbindung zwischen [A] und [B] darf sich lösen."],
    ["Rufen",
      "Tu:\nFeld bleibt hart. Einen Atem. Mitte halten.\n\nSprich:\nDu bist da.\nIch führe.\nDu trägst nur die Trennung des Fadens zwischen [A] und [B].\nKein Theater. Kein Sog. Kein Mehr."],
    ["Auftrag geben",
      "Sprich:\nTrenne den Faden zwischen [A] und [B].\nNur der Faden.\nKein Urteil. Kein Schaden darüber hinaus.\nDanach gehst du vollständig."],
    ["Wort",
      "Sprich:\nDie Verbindung zwischen [A] und [B] löst sich.\nJeder gehört wieder sich selbst.\nOhne Hass, ohne Schaden.\nDu trägst. Ich führe."],
    ["369",
      "Tu:\nZähler. Halte das Wort. Nicht neu setzen.\n\nDrei:\nDie Verbindung zwischen [A] und [B] löst sich.\n\nSechs:\nDie Fäden fallen ab.\n\nNeun:\nSie sind voneinander frei."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so."],
    ["Siegel",
      "Tu:\nHand vor die Flamme oder aufs Herz. Einen Atem.\n\nSprich:\nVersiegelt.\nDas Feld hat es."],
    ["Entlassen",
      "Tu:\nNicht nachwinken. Tor zu.\n\nSprich:\nDer Auftrag ist beendet.\nIch danke dir.\nDu bist frei.\nAlle Verbindungen lösen sich.\nDu bleibst nicht.\nIch schliesse das Tor."],
    ["Rückkehr",
      "Tu:\nHaut. Atem. Füsse. Raum.\n\nSprich:\nIch bin nicht [A].\nIch bin nicht [B].\nIch bin nicht die Wesenheit.\nIch kehre vollständig zurück.\nMeine Energie gehört mir."],
    ["Schluss",
      "Sprich dreimal:\nDanke Gott.\nDanke Universum.\nDanke Energien.\nDanke Feld.\n\nTu:\nWasser. Alltag. Nicht nachkontrollieren."]
  ];
  if(typeof R==="undefined") return;
  var found=false;
  for(var i=0;i<R.length;i++){
    if(R[i].id==="trenn2"){
      R[i].t="Trennung zweier anderer";
      R[i].s="Nur der Faden zwischen A und B.";
      R[i].tag="Trennung";
      R[i].need=["A","B"];
      R[i].steps=STEPS;
      found=true;
    }
  }
  if(!found){
    var at=-1;
    for(var j=0;j<R.length;j++) if(R[j].id==="trenn") at=j;
    var row={id:"trenn2",t:"Trennung zweier anderer",s:"Nur der Faden zwischen A und B.",tag:"Trennung",need:["A","B"],steps:STEPS};
    if(at>=0) R.splice(at+1,0,row); else R.push(row);
  }
})();
