(function(){
  var steps=[
    ["Vorbereitung","Name von Person X klar. Laut sagen oder aufschreiben.\nHandy stumm und weg. Tür zu wenn möglich.\nKerze wenn da. Salz. Siegelzeichen oder Ritualbuch daneben.\nWasser danach bereit — das gehört zur Arbeit.\nFoto nur als Anker. Anschauen, dann umdrehen oder zudecken.\nEigenes Feld zuerst. Ohne geschlossenes Feld kein Fluch.\nKein Theater. Keine Show. Keine Wut als Steuer.\nWut macht 6 ohne 9. Erst Mitte, dann Wort.\nWesenheit nur wenn das Wort allein nicht sitzt. Sonst ohne.\nMass jetzt setzen: nur [Name]. Nur Begrenzung und Rückgabe. Ein Ende."],
    ["Schutz zuerst","Füsse auf den Boden. Drei Atemzüge.\nIch bin der Spieler, nicht die Spielfigur.\nDer Beobachter ist wach.\nMein Feld ist geschlossen, klar und stabil.\nNichts Fremdes hat Zutritt.\nIch öffne nur für dieses eine Wort.\nIch werde nicht zum Werkzeug.\nIch bleibe in meiner Mitte."],
    ["Ankommen","Stelle dich oder setze dich. Kiefer lösen. Schultern fallen lassen.\nNoch drei Atemzüge, langsamer.\nIch öffne nur für [Name].\nIch bleibe ich. [Name] bleibt [Name].\nKein Verschmelzen. Kein Sog. Kein Nachlaufen."],
    ["Kreis","Sprich:\nIch öffne diesen Raum nur für den Fluch auf [Name].\nNur das gesetzte Mass darf hier sein.\nUnbeteiligte bleiben draussen.\nKein Auftrag auf Haus, Kind, Arbeit oder Dritte, die nicht [Name] sind.\nKein unendliches Nachsetzen.\nDie Arbeit hat ein Ende.\nWas gesetzt wird, ist Begrenzung und Rückgabe — nicht blinder Hass."],
    ["Lage","[Name] vor dir im Feld, nicht in dir.\nDie Bahn wahrnehmen, soweit nötig: wo [Name] gegen dich, dein Haus oder deine Leute geht.\nNicht die ganze Biografie. Nur die Bahn.\nWenn es zieht, nebelt oder heiss wird: einen Schritt zurück in die Füsse.\nIch bleibe der Spieler."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur so:\nFilter hart. Nur klare, begrenzbare Präsenz.\nPrüfen: Mitte da? Klar oder Nebel? Druck oder Ruhe?\nDrängen, Theater, Sog, Stimmen ohne Grenze: sofort schliessen. Kein Auftrag.\nAuftrag nur, wenn klar:\nTrage das gesetzte Wort zu [Name].\nBegrenze die Bahn gegen mich, mein Haus und meine Leute.\nDann gehst du vollständig.\nKein eigener Krieg. Kein Mehr. Kein Bleiben."],
    ["Wort","Sprich langsam, einmal vollständig:\n\nIch setze den Fluch auf [Name].\nDie Bahn von [Name] gegen mich bricht.\nDie Bahn von [Name] gegen mein Haus bricht.\nDie Bahn von [Name] gegen meine Leute bricht.\nWas von [Name] als Schaden ausgeht, kehrt zur Quelle.\nDer Zugriff fällt ab und findet keinen Halt.\nKein Halt an meinem Körper.\nKein Halt an meinem Feld.\nKein Halt an meinem Weg.\nDas Wort sitzt.\nDas Wort ist begrenzt.\nDas Wort hat ein Ende."],
    ["369","Sprich jede Zeile. Zwischen den Runden ein Atem. Zähler unten.\n\nDrei Mal:\nIch setze den Fluch auf [Name]. Die Bahn bricht.\nIch setze den Fluch auf [Name]. Die Bahn bricht.\nIch setze den Fluch auf [Name]. Die Bahn bricht.\n\nSechs Mal:\nWas [Name] als Schaden sendet, kehrt zur Quelle und findet keinen Halt.\nWas [Name] als Schaden sendet, kehrt zur Quelle und findet keinen Halt.\nWas [Name] als Schaden sendet, kehrt zur Quelle und findet keinen Halt.\nWas [Name] als Schaden sendet, kehrt zur Quelle und findet keinen Halt.\nWas [Name] als Schaden sendet, kehrt zur Quelle und findet keinen Halt.\nWas [Name] als Schaden sendet, kehrt zur Quelle und findet keinen Halt.\n\nNeun Mal:\nDer Fluch ist gesetzt, begrenzt und geschlossen. Es ist so.\nDer Fluch ist gesetzt, begrenzt und geschlossen. Es ist so.\nDer Fluch ist gesetzt, begrenzt und geschlossen. Es ist so.\nDer Fluch ist gesetzt, begrenzt und geschlossen. Es ist so.\nDer Fluch ist gesetzt, begrenzt und geschlossen. Es ist so.\nDer Fluch ist gesetzt, begrenzt und geschlossen. Es ist so.\nDer Fluch ist gesetzt, begrenzt und geschlossen. Es ist so.\nDer Fluch ist gesetzt, begrenzt und geschlossen. Es ist so.\nDer Fluch ist gesetzt, begrenzt und geschlossen. Es ist so."],
    ["Halten","Einen Atem lang stehen lassen.\nNicht nachschieben. Nicht verstärken. Nicht erklären.\nDas Feld hat das Wort.\nWas gesetzt ist, bleibt gesetzt."],
    ["Siegel","Salz, Siegelzeichen oder Hand auf die Erde / den Boden.\nEinmal. Nicht dreimal aus Unruhe.\nSprich:\nVersiegelt.\nAbgegeben.\nGeschlossen.\nDie Arbeit ist dem Feld übergeben."],
    ["Entlassen","Falls eine Wesenheit da war:\nDer Auftrag ist beendet. Ich danke dir.\nDu bist frei.\nLöse alle Verbindungen zu mir und zu [Name].\nDu bleibst nicht.\nIch schliesse den Kontakt.\n\nOhne Wesenheit: weiter zur Rückkehr."],
    ["Rückkehr","Ich bin nicht [Name].\nIch kehre vollständig in mich zurück.\nHaut. Atem. Füsse. Raum.\nMeine Energie gehört mir.\nAlles Fremde löst sich und geht.\nDer Auftrag endet hier.\nKein Nachsetzen. Kein Kontrollieren. Kein zweites Ritual heute.\nSo sei es.\nErden. Wasser trinken. Alltag."]
  ];
  for(var i=R.length-1;i>=0;i--) if(R[i].id==="fluch") R.splice(i,1);
  R.push({
    id:"fluch",
    t:"Fluch",
    s:"Gegen Person X. Wort setzen und schliessen.",
    tag:"Person X",
    need:["Name"],
    steps:steps
  });
  if(typeof renderList==="function") renderList();
})();
