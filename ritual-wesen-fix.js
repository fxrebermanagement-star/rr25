(function(){
  if(typeof fill==="function"){
    var _fill=fill;
    fill=function(s,m){
      return _fill(s,m).split("[Auftrag]").join(m.Auftrag||"[Auftrag]");
    };
  }
  var r=R.find(function(x){return x.id==="wesen"});
  if(!r) return;
  r.t="Kontakt Wesenheit";
  r.s="Raum · Filter · Auftrag · Entlassen";
  r.tag="Feld";
  r.need=["Auftrag"];
  var prep=["Vorbereitung","Eigenes Feld zuerst schließen.\nHandy weg. Wasser bereit.\nAuftrag in einem Satz klar haben, bevor du öffnest.\nKontakt kurz halten. Entlassen ist Pflicht, nicht optional."];
  r.steps=[
    prep,
    ["Raum","Füße. Drei Atemzüge.\nIch bin der Spieler. Der Beobachter ist wach.\nIch behalte den Raum. Ich öffne nicht mein ganzes Feld."],
    ["Filter","Nur klare, erkennbare, stimmige Präsenz.\nDrängen, Nebel, Theater, Sog, Verwirrung: sofort schließen.\nKeine Namen aus fremden Listen. Kein Befehl von außen."],
    ["Kontakt","Wer bereit, klar und in der Lage ist, sich zu zeigen, darf sich zeigen.\nNur zeigen. Noch kein Auftrag.\nPrüfen: Bleibt meine Mitte? Ist die Präsenz klar? Geht sie danach wieder?"],
    ["Auftrag","Der Auftrag lautet:\n[Auftrag]\nNur das. Nichts darüber hinaus.\nDer Auftrag endet, wenn er erfüllt ist. Danach kein Bleiben."],
    ["Grenze","Kein unnötiger Schaden.\nKein Zugriff auf Unbeteiligte.\nIch bleibe der Spieler. Die Wesenheit bleibt Werk, nicht Herr."],
    ["Entlassen","Der Auftrag ist gegeben und begrenzt.\nIch danke. Du gehst, wenn die Arbeit getan ist.\nAlle Verbindungen zu mir lösen sich. Ich schließe den Kontakt."],
    ["Rückkehr","Ich bin nicht die Wesenheit.\nIch kehre vollständig in mich zurück.\nMeine Energie gehört mir.\nSo sei es. Erden. Wasser, Alltag."]
  ];
  if(typeof renderList==="function") renderList();
})();
