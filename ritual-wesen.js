(function(){
  if(typeof fill==="function"){
    var _f=fill;
    fill=function(s,m){
      return _f(s,m).split("[Auftrag]").join((m&&m.Auftrag)||"[Auftrag]");
    };
  }
  var STEPS=[
    ["Vorbereitung",
      "Auftrag oben eingeben. Kurz und klar.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur dieser Auftrag.\nKein Mehr.\nIch bleibe ich."],
    ["Ankommen",
      "Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler.\nDer Beobachter ist wach."],
    ["Feld hart",
      "Tu:\nGrenze um den Körper. Einmal feststehen.\n\nSprich:\nIch schliesse mein Feld hart.\nNichts Fremdes hat Zutritt.\nMeine Energie gehört mir."],
    ["Rufen",
      "Tu:\nFeld bleibt hart. Einen Atem. Mitte halten.\n\nSprich:\nDu bist da.\nIch führe.\nDu trägst nur: [Auftrag].\nKein Theater. Kein Sog. Kein Mehr."],
    ["Auftrag geben",
      "Sprich:\nTrage nur [Auftrag].\nNur das. Ein Ende.\nKein eigener Krieg.\nKein Bleiben in mir.\nDanach gehst du vollständig."],
    ["Wort",
      "Sprich:\n[Auftrag] geschieht jetzt.\nDu trägst. Ich führe.\nDas Mass hält."],
    ["369",
      "Tu:\nZähler. Halte das Wort. Nicht neu setzen.\n\nDrei:\nDer Auftrag ist gegeben.\n\nSechs:\nEs wird getragen.\n\nNeun:\nEs ist gesetzt."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so."],
    ["Siegel",
      "Tu:\nHand vor die Flamme oder aufs Herz. Einen Atem.\n\nSprich:\nVersiegelt.\nDas Feld hat es."],
    ["Entlassen",
      "Tu:\nNicht nachwinken. Tor zu.\n\nSprich:\nDer Auftrag ist beendet.\nIch danke dir.\nDu bist frei.\nAlle Verbindungen lösen sich.\nDu bleibst nicht.\nIch schliesse das Tor."],
    ["Rückkehr",
      "Tu:\nHaut. Atem. Füsse. Raum.\n\nSprich:\nIch bin nicht die Wesenheit.\nIch kehre vollständig zurück.\nMeine Energie gehört mir."],
    ["Schluss",
      "Sprich dreimal:\nDanke Gott.\nDanke Universum.\nDanke Energien.\nDanke Feld.\n\nTu:\nWasser. Alltag. Nicht nachkontrollieren."]
  ];
  if(typeof R==="undefined") return;
  var found=false;
  for(var i=0;i<R.length;i++){
    if(R[i].id==="wesen"){
      R[i].t="Wesenheit für Auftrag";
      R[i].s="Kontakt mit Auftrag. Mass halten.";
      R[i].tag="Feld";
      R[i].need=["Auftrag"];
      R[i].steps=STEPS;
      found=true;
    }
  }
  if(!found) R.push({id:"wesen",t:"Wesenheit für Auftrag",s:"Kontakt mit Auftrag. Mass halten.",tag:"Feld",need:["Auftrag"],steps:STEPS});
})();
