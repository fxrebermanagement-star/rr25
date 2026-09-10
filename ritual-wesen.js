(function(){
  if(typeof fill==="function"){
    var _f=fill;
    fill=function(s,m){
      return _f(s,m).split("[Auftrag]").join((m&&m.Auftrag)||"[Auftrag]");
    };
  }
  for(var i=R.length-1;i>=0;i--) if(R[i].id==="wesen") R.splice(i,1);
  R.push({
    id:"wesen",
    t:"Kontakt Wesenheit",
    s:"Raum · Filter · Auftrag · Entlassen",
    tag:"Feld",
    need:["Auftrag"],
    steps:[
      ["Vorbereitung","Eigenes Feld zuerst schließen.\nHandy weg. Wasser bereit.\nDen Auftrag in einem Satz kennen, bevor der Raum geöffnet wird.\nKontakt kurz. Entlassen ist Pflicht."],
      ["Raum","Füße auf den Boden. Drei Atemzüge.\nIch bin der Spieler, nicht die Spielfigur.\nDer Beobachter ist wach.\nIch behalte den Raum. Ich öffne nicht mein ganzes Feld."],
      ["Filter","Nur klare, erkennbare, stimmige Präsenz darf sich zeigen.\nDrängen, Nebel, Theater, Sog, Verwirrung: sofort schließen.\nKeine fremden Listen. Kein Befehl von außen."],
      ["Kontakt","Wer bereit, klar und in der Lage ist, sich zu zeigen, darf sich zeigen.\nNur Kontakt. Noch kein Auftrag.\nPrüfen: Bleibt meine Mitte? Ist die Präsenz klar? Geht sie danach wieder?"],
      ["Auftrag","Der Auftrag lautet:\n[Auftrag]\nNur das. Nichts darüber hinaus.\nDer Auftrag endet, wenn er erfüllt ist. Danach kein Bleiben."],
      ["Grenze","Kein Zugriff auf Unbeteiligte.\nKein unnötiger Schaden.\nIch bleibe der Spieler. Die Wesenheit bleibt Werk, nicht Herr."],
      ["Entlassen","Der Auftrag ist gegeben und begrenzt.\nIch danke. Du gehst, wenn die Arbeit getan ist.\nAlle Verbindungen zu mir lösen sich.\nIch schließe den Kontakt jetzt."],
      ["Rückkehr","Ich bin nicht die Wesenheit.\nIch kehre vollständig in mich zurück.\nMeine Energie gehört mir.\nSo sei es. Erden. Wasser, Alltag."]
    ]
  });
  if(typeof PREP==="object") PREP.wesen="Eigenes Feld zuerst. Auftrag klar. Kontakt kurz. Entlassen Pflicht.";
  if(typeof renderList==="function") renderList();
})();
