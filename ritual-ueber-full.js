(function(){
  var steps=[
    ["Vorbereitung","Name von Person X klar.\nAufgabe in einem einzigen Satz — nicht drei Aufträge.\nHandy weg. Tür zu wenn möglich.\nEigenes Feld zuerst schliessen.\nFoto nur als Anker, dann zudecken.\nKerze optional. Salz. Wasser danach.\nWesenheit nur wenn die Aufgabe ohne sie nicht sitzt. Sonst ohne.\nDu übernimmst für die Aufgabe, nicht für immer.\nNicht für das ganze Leben von [Name]."],
    ["Schutz zuerst","Füsse. Drei Atemzüge.\nIch bin der Spieler, nicht die Spielfigur.\nDer Beobachter ist wach.\nMein Feld ist geschlossen.\nIch bleibe ich. [Name] bleibt [Name]."],
    ["Ankommen","Knie locker. Ausatmen länger als einatmen.\nKein Verschmelzen. Kein Sog.\nWenn es zieht: zurück in den Körper."],
    ["Kreis","Sprich:\nIch öffne nur für die Übernahme von [Name].\nNur diese Aufgabe:\n[Auftrag]\nKein Auftrag darüber hinaus.\nKein Unbeteiligter. Kein Nachsatz. Kein Bleiben.\nDie Übernahme endet, wenn die Aufgabe erfüllt ist oder wenn ich schliesse."],
    ["Ausrichten","[Name] wahrnehmen, ohne [Name] zu werden.\nZugang nur so weit, wie die Aufgabe braucht.\nDruck vermeiden."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur so:\nWer klar und für diese eine Aufgabe geeignet ist, darf sich zeigen.\nPrüfen: Mitte da? Klar oder Nebel?\nBei Druck oder Theater: sofort schliessen.\nAuftrag nur: hilf, dass [Name] die Aufgabe [Auftrag] trägt, bis sie erfüllt ist. Dann gehst du vollständig."],
    ["Wort","Sprich:\nIch übernehme [Name] für die Aufgabe.\nWille, Bahn und Handeln von [Name] richten sich auf:\n[Auftrag]\nZugang nur so weit, wie die Aufgabe braucht.\nKein Mehr. Kein Besitz. Kein Bleiben in [Name]."],
    ["369","Sprich jede Zeile. Zwischen den Runden ein Atem. Zähler unten.\n\nDrei Mal:\nIch übernehme [Name] für die Aufgabe.\nIch übernehme [Name] für die Aufgabe.\nIch übernehme [Name] für die Aufgabe.\n\nSechs Mal:\nDer Wille von [Name] hält bei der Aufgabe.\nDer Wille von [Name] hält bei der Aufgabe.\nDer Wille von [Name] hält bei der Aufgabe.\nDer Wille von [Name] hält bei der Aufgabe.\nDer Wille von [Name] hält bei der Aufgabe.\nDer Wille von [Name] hält bei der Aufgabe.\n\nNeun Mal:\nDie Aufgabe läuft. Es ist so.\nDie Aufgabe läuft. Es ist so.\nDie Aufgabe läuft. Es ist so.\nDie Aufgabe läuft. Es ist so.\nDie Aufgabe läuft. Es ist so.\nDie Aufgabe läuft. Es ist so.\nDie Aufgabe läuft. Es ist so.\nDie Aufgabe läuft. Es ist so.\nDie Aufgabe läuft. Es ist so."],
    ["Grenze","Kein Bleiben in [Name].\nKein zweites Ritual aus Unruhe.\nWenn die Aufgabe erfüllt ist, fällt die Übernahme.\nWenn du schliesst, fällt sie jetzt."],
    ["Halten","Einen Atem lang stehen lassen.\nNicht nachschieben."],
    ["Entlassen","Falls eine Wesenheit da war:\nDer Auftrag ist beendet. Ich danke dir.\nDu bist frei. Löse alle Verbindungen zu mir und zu [Name].\nIch schliesse den Kontakt.\n\nOhne Wesenheit: weiter zum Feld-Check."],
    ["Feld-Check","Ich bin nicht [Name].\nHaut. Atem. Füsse. Raum.\nIch kehre vollständig in mich zurück.\nMeine Energie gehört mir.\nWas nicht meins ist, geht.\nDie Übernahme endet hier, sobald die Aufgabe erfüllt ist.\nSo sei es.\nErden. Wasser. Alltag. Nicht nachkontrollieren."]
  ];
  for(var i=R.length-1;i>=0;i--) if(R[i].id==="ueber") R.splice(i,1);
  R.unshift({id:"ueber",t:"Person übernehmen",s:"Person X für Aufgabe X. Begrenzt.",tag:"Person X",need:["Name","Auftrag"],steps:steps});
  if(typeof renderList==="function") renderList();
})();
