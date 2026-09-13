(function(){
  var r={
    id:"schaden",
    t:"Schadenszauber",
    s:"Vorhanden. Nicht Pflicht.",
    tag:"Feld",
    need:["Name"],
    steps:[
      ["Vorbereitung","Dies ist die Gegenseite. Du musst es nicht tun.\nNur wenn du die Verantwortung voll übernimmst.\nHandy weg. Eigenes Feld zuerst schliessen.\nName von [Name] bereit. Foto nur als Anker, nicht als Fessel.\nKerze optional. Salz. Siegelzeichen wenn da.\nWasser zum Erden danach.\nKein Theater. Keine Wut als Steuer.\nNur setzen, wenn du es wirklich willst. Sonst zurück."],
      ["Halt","Füsse auf den Boden. Drei Atemzüge.\nIch bin der Spieler, nicht die Spielfigur.\nDer Beobachter ist wach.\nIch bleibe in meiner Mitte.\nIch werde nicht zum Werkzeug."],
      ["Schutz zuerst","Erst das eigene Feld schliessen.\nNichts Fremdes hat Zutritt.\nIch öffne nur für diese eine Arbeit.\nUnbeteiligte bleiben draussen."],
      ["Rahmen","Nur [Name]. Nur das gesetzte Mass.\nKein Nachsetzen ins Leben von Unbeteiligten.\nKein unendlicher Auftrag.\nDie Arbeit hat ein Ende.\nWas gesetzt wird, ist Begrenzung und Rückgabe — nicht blinder Hass."],
      ["Absicht","Was von [Name] als Schaden ausgeht, kehrt in stimmiger Form zur Quelle.\nDer Zugriff auf mich, mein Haus und meine Leute endet.\nDie Bahn bricht. Der Halt fällt."],
      ["369","Sprich jede Zeile vollständig. Zwischen den Runden ein Atem. Zähler unten.\n\nDrei Mal:\nDer Schaden kehrt zur Quelle.\nDer Schaden kehrt zur Quelle.\nDer Schaden kehrt zur Quelle.\n\nSechs Mal:\nDer Zugriff von [Name] fällt ab und findet keinen Halt.\nDer Zugriff von [Name] fällt ab und findet keinen Halt.\nDer Zugriff von [Name] fällt ab und findet keinen Halt.\nDer Zugriff von [Name] fällt ab und findet keinen Halt.\nDer Zugriff von [Name] fällt ab und findet keinen Halt.\nDer Zugriff von [Name] fällt ab und findet keinen Halt.\n\nNeun Mal:\nDie Arbeit ist gesetzt und begrenzt. Es ist so.\nDie Arbeit ist gesetzt und begrenzt. Es ist so.\nDie Arbeit ist gesetzt und begrenzt. Es ist so.\nDie Arbeit ist gesetzt und begrenzt. Es ist so.\nDie Arbeit ist gesetzt und begrenzt. Es ist so.\nDie Arbeit ist gesetzt und begrenzt. Es ist so.\nDie Arbeit ist gesetzt und begrenzt. Es ist so.\nDie Arbeit ist gesetzt und begrenzt. Es ist so.\nDie Arbeit ist gesetzt und begrenzt. Es ist so."],
      ["Siegel","Optional Salz oder Siegelzeichen.\nDie Arbeit ist geschlossen.\nKein Wiederholen aus Wut.\nEinmal setzen, abgeben."],
      ["Rückkehr","Ich bin nicht [Name].\nIch kehre vollständig in mich zurück.\nMeine Energie gehört mir.\nDer Auftrag endet hier.\nSo sei es.\nErden. Wasser, Körper, Alltag."]
    ]
  };
  for(var i=R.length-1;i>=0;i--) if(R[i].id==="schaden") R.splice(i,1);
  R.push(r);
  if(typeof renderList==="function") renderList();
})();
