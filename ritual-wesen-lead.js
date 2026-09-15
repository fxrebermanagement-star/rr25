(function(){
  var WAHL=
    "Tu:\nFüsse. Feld hart. Einen Atem.\n\n"+
    "Ohne: du trägst das Wort allein. Kein Rufen.\n"+
    "Mit: du rufst, prüfst, gibst einen Auftrag, entlässt.\n\n"+
    "Wähle unten. Dann geht der Weg auseinander.";

  var RUFEN=
    "Tu:\nStehen. Feld bleibt geschlossen — nur ein Tor, kein Haus.\nNicht suchen. Nicht ziehen. Rufen und warten.\n\n"+
    "Sprich:\nIch rufe jetzt.\nNur was klar, erkennbar und begrenzbar ist.\nNur für diesen einen Auftrag.\nTheater, Nebel, Stimmen ohne Grenze: ihr kommt nicht.\nWenn du kommst, zeig dich klar.\nIch behalte den Raum.";

  var PRUEF=
    "Tu:\nEinen ganzen Atem warten. Mitte. Haut. Kiefer.\n\n"+
    "Sprich:\nBist du da?\nBist du klar?\nDruck oder Ruhe?\n\n"+
    "Ruhe und Klarheit: weiter zum Auftrag.\n\n"+
    "Druck, Theater, Sog — sprich:\nDu gehst jetzt.\nIch schliesse das Tor.\nDann zurück und ohne weiter zum Wort.";

  var AUF={
    stopp:"Sprich:\nHör den Auftrag.\nTrage den Stopp gegen [Name].\nDie Bahn gegen mich, mein Haus und meine Leute endet.\nKein eigener Krieg.\nWenn der Stopp sitzt, gehst du vollständig.",
    schutz:"Sprich:\nHör den Auftrag.\nHalte den Schutz um mein Feld.\nDann gehst du.",
    schutz2:"Sprich:\nHör den Auftrag.\nTrage den Schutz zu [Name].\nIch bleibe hier.\nDann gehst du vollständig.",
    heil:"Sprich:\nHör den Auftrag.\nTrage reine Heilung zu [Name].\nKein Druck.\nDann gehst du.",
    zur:"Sprich:\nHör den Auftrag.\nHole zurück was meins ist.\nDann gehst du.",
    karma:"Sprich:\nHör den Auftrag.\nTrage den Ausgleich rein. Keine Rache.\nDann gehst du.",
    liebe:"Sprich:\nHör den Auftrag.\nTrage stimmige Nähe zu [Name] ohne Zwang.\nDann gehst du.",
    liebezw:"Sprich:\nHör den Auftrag.\nTrage die gesetzte Bindung zu [Name].\nDann gehst du vollständig.",
    anz:"Sprich:\nHör den Auftrag.\nÖffne den Weg zu [Name], nur wenn stimmig.\nDann gehst du.",
    trenn:"Sprich:\nHör den Auftrag.\nLöse den Faden zwischen mir und [Name].\nDann gehst du.",
    trenn2:"Sprich:\nHör den Auftrag.\nLöse den Faden zwischen [A] und [B].\nDann gehst du.",
    finst:"Sprich:\nHör den Auftrag.\nFestige was wahr ist. Lass Altes fallen.\nDann gehst du.",
    schaden:"Sprich:\nHör den Auftrag.\nTrage Rückgabe und Begrenzung zu [Name].\nDann gehst du vollständig.",
    fluch:"Sprich:\nHör den Auftrag.\nTrage das gesetzte Wort zu [Name].\nBegrenze die Bahn.\nDann gehst du vollständig.",
    segen:"Sprich:\nHör den Auftrag.\nTrage den Segen zu [Name].\nDann gehst du vollständig.",
    ueber:"Sprich:\nHör den Auftrag.\nTrage die Übernahme von [Name] nur für [Auftrag].\nDann gehst du vollständig."
  };

  (R||[]).forEach(function(r){
    if(!r || !r.steps) return;
    var i=-1;
    for(var k=0;k<r.steps.length;k++){
      if(/^Wesenheit$/i.test(r.steps[k][0])) i=k;
    }
    if(i<0) return;
    r.steps[i][1]=WAHL;
    while(r.steps[i+1] && /^(Rufen|Prüfen|Auftrag)/i.test(r.steps[i+1][0])) r.steps.splice(i+1,1);
    r.steps.splice(i+1,0,
      ["Rufen", RUFEN],
      ["Prüfen", PRUEF],
      ["Auftrag geben", "Tu:\nNur wenn die Prüfung klar war.\nSonst zurück, Ohne wählen, weiter zum Wort.\n\n"+(AUF[r.id]||"Sprich:\nHör den Auftrag.\nNur dieser eine Satz.\nDann gehst du vollständig.")]
    );
  });
})();
