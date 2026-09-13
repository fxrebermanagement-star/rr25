(function(){
  var steps=[
    ["Vorbereitung","Name von Person X klar. Laut sagen oder aufschreiben.\nHandy stumm und weg. Ungestörter Platz.\nEigenes Feld zuerst schliessen.\nKerze wenn da. Salz. Wasser danach bereit.\nRitualbuch darf daneben liegen.\nFoto nur als Anker, dann weglegen.\nKein Hass im Mund. Kein Handel. Segen ist Gabe.\nWesenheit nur wenn der Segen ohne sie nicht sitzt. Sonst ohne."],
    ["Schutz zuerst","Füsse auf den Boden. Drei Atemzüge.\nIch bin der Spieler, nicht die Spielfigur.\nDer Beobachter ist wach.\nMein Feld ist geschlossen.\nIch gebe Wort, nicht mich."],
    ["Ankommen","Stelle dich oder setze dich. Schultern fallen lassen. Kiefer lösen.\nDrei ruhige Atemzüge. Nichts hetzen.\nIch bleibe ich. [Name] bleibt [Name].\nWärme ja. Verschmelzen nein."],
    ["Kreis","Sprich:\nIch öffne diesen Raum nur für Segen auf [Name].\nNur das Stimmige und Reine darf hier sein.\nUnklares, Ziehendes, Fremdes bleibt draussen.\nKein Auftrag über den Segen hinaus."],
    ["Ausrichten","[Name] wahrnehmen, ohne [Name] zu werden.\nDer Segen geht zu [Name]. Ich bleibe hier.\nWenn es zieht: zurück in die Füsse."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur so:\nFilter zuerst. Nur klare, stimmige Präsenz.\nAuftrag: trage den Segen zu [Name] und geh danach vollständig.\nBei Druck oder Nebel: ohne Wesenheit weitermachen."],
    ["Wort","Sprich langsam, einmal vollständig:\n\nIch lege Segen auf [Name].\nSchutz um den Körper.\nKlarheit im Kopf.\nWeg unter den Füssen.\nWas stimmig ist, darf wachsen.\nWas zieht, Last und fremder Zugriff bleiben draussen.\nDer Segen ist rein.\nEr bindet nicht.\nEr hält."],
    ["369","Zähler unten. Zwischen den Runden ein Atem.\n\n3  [Name] ist gesegnet und gehalten.\n6  Der Segen sitzt, wirkt und bleibt rein.\n9  Das Wort ist gelegt. Es ist so."],
    ["Halten","Einen Atem lang stehen lassen.\nNicht nachkontrollieren.\nDer Segen ist gegeben."],
    ["Siegel","Hand aufs Herz oder eine Prise Salz.\nSprich:\nGegeben.\nVersiegelt.\nNicht nachholen."],
    ["Entlassen","Falls eine Wesenheit da war:\nDanke. Der Auftrag ist erfüllt.\nDu gehst vollständig. Alle Fäden lösen sich.\nIch schliesse den Kontakt.\n\nOhne Wesenheit: weiter zum Feld-Check."],
    ["Feld-Check","Haut. Atem. Füsse. Raum.\nIch bin nicht [Name].\nIch bin zurück in mir.\nMeine Energie gehört mir.\nDer Segen bleibt bei [Name].\nSo sei es.\nErden. Wasser. Alltag."]
  ];
  for(var i=R.length-1;i>=0;i--) if(R[i].id==="segen") R.splice(i,1);
  R.push({id:"segen",t:"Segen",s:"Für Person X. Wort legen und halten.",tag:"Person X",need:["Name"],steps:steps});
  if(typeof renderList==="function") renderList();
})();
