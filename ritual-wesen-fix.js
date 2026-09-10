(function(){
  var r=R.find(function(x){return x.id==="wesen"});
  if(!r) return;
  r.s="Nur nach Trennung, wenn der Faden nicht reicht";
  var prep=(r.steps[0]&&r.steps[0][0]==="Vorbereitung")?r.steps[0]:null;
  var body=[
    ["Nicht die Trennung","Das ist nicht das Ritual zwischen A und B.\nDie einfache Trennung kommt zuerst.\nHier rufst du nur, wenn der Faden allein nicht gefallen ist."],
    ["Raum behalten","Füße. Drei Atemzüge. Eigenes Feld zu.\nIch behalte den Raum. Ich werde nicht zum Medium ohne Grenze."],
    ["Filter","Nur klare, erkennbare, stimmige Präsenz.\nDrängen, Nebel, Theater, Sog: sofort schließen.\nKein Name aus fremden Listen."],
    ["Fragen","Wer bereit und geeignet ist, den restlichen Faden zwischen [A] und [B] zu lösen, möge sich zeigen.\nPrüfen: Bist du klar? Ist die Aufgabe deine? Gehst du danach vollständig?"],
    ["Auftrag","Nur den restlichen Faden lösen.\nKein Schaden darüber hinaus. Kein Bleiben.\nDer Auftrag endet, wenn der Faden weg ist."],
    ["Entlassen","Danke. Der Auftrag ist beendet.\nDu bist frei. Alle Verbindungen zu mir lösen sich.\nIch schließe den Kontakt jetzt."],
    ["Rückkehr","Ich bin nicht [A]. Ich bin nicht [B]. Ich bin nicht die Wesenheit.\nIch kehre vollständig zurück. Meine Energie gehört mir.\nSo sei es. Erden."]
  ];
  r.steps=prep?[prep].concat(body):body;
  if(typeof renderList==="function") renderList();
})();
