(function(){
  var WAHL=
    "Tu:\nStehen. Füsse. Feld hart halten.\n\n"+
    "Ohne — sprich:\nIch gehe allein weiter zum Wort.\nKein Rufen. Kein Kontakt.\n\n"+
    "Mit — nur wenn nötig. Sprich:\nIch öffne nur für klare Hilfe.\nDann kommt das Rufen.";

  var RUFEN=
    "Tu:\nNicht suchen. Nicht ziehen. Nur rufen und warten.\nEin Atem. Feld bleibt zu — nur ein Tor, kein Haus.\n\n"+
    "Sprich:\nIch rufe nur, was klar, erkennbar und begrenzbar ist.\nNur für diesen einen Auftrag.\nTheater, Nebel, Stimmen ohne Grenze bleiben draussen.\nWer das nicht halten kann, kommt nicht.\nWenn du kommst, zeig dich klar.";

  var PRUEF=
    "Tu:\nMitte spüren. Haut. Atem. Ein Atem warten.\n\n"+
    "Sprich:\nBist du klar?\nIst die Mitte da?\nDruck oder Ruhe?\n\n"+
    "Bei Ruhe und Klarheit: weiter zum Auftrag.\nBei Druck, Theater, Sog — sprich:\nDu gehst. Ich schliesse.\nDann ohne weiter zum Wort.";

  var AUF={
    stopp:"Sprich:\nDein Auftrag ist nur:\nTrage den Stopp gegen [Name].\nDie Bahn gegen mich, mein Haus und meine Leute endet.\nDann gehst du vollständig.\nKein eigener Krieg. Kein Bleiben.",
    schutz:"Sprich:\nDein Auftrag ist nur:\nHalte den Schutz um mein Feld.\nDann gehst du.",
    schutz2:"Sprich:\nDein Auftrag ist nur:\nTrage den Schutz zu [Name].\nDann gehst du vollständig.",
    heil:"Sprich:\nDein Auftrag ist nur:\nTrage reine Heilung zu [Name].\nKein Druck. Dann gehst du.",
    zur:"Sprich:\nDein Auftrag ist nur:\nHole zurück was meins ist.\nDann gehst du.",
    karma:"Sprich:\nDein Auftrag ist nur:\nTrage den Ausgleich rein.\nKeine Rache. Dann gehst du.",
    liebe:"Sprich:\nDein Auftrag ist nur:\nTrage stimmige Nähe zu [Name] ohne Zwang.\nDann gehst du.",
    liebezw:"Sprich:\nDein Auftrag ist nur:\nTrage die gesetzte Bindung zu [Name].\nDann gehst du vollständig.",
    anz:"Sprich:\nDein Auftrag ist nur:\nÖffne den Weg zum Kontakt mit [Name], wenn er stimmig ist.\nDann gehst du.",
    trenn:"Sprich:\nDein Auftrag ist nur:\nLöse den Faden zwischen mir und [Name].\nDann gehst du.",
    trenn2:"Sprich:\nDein Auftrag ist nur:\nLöse den Faden zwischen [A] und [B].\nDann gehst du.",
    finst:"Sprich:\nDein Auftrag ist nur:\nFestige was wahr ist. Lass Altes fallen.\nDann gehst du.",
    schaden:"Sprich:\nDein Auftrag ist nur:\nTrage Rückgabe und Begrenzung zu [Name].\nDann gehst du vollständig.",
    fluch:"Sprich:\nDein Auftrag ist nur:\nTrage das gesetzte Wort zu [Name].\nBegrenze die Bahn.\nDann gehst du vollständig.",
    segen:"Sprich:\nDein Auftrag ist nur:\nTrage den Segen zu [Name].\nDann gehst du vollständig.",
    ueber:"Sprich:\nDein Auftrag ist nur:\nTrage die Übernahme von [Name] für [Auftrag].\nDann gehst du vollständig."
  };

  (R||[]).forEach(function(r){
    if(!r || !r.steps) return;
    var i=-1;
    for(var k=0;k<r.steps.length;k++){
      if(/Wesenheit/i.test(r.steps[k][0])) i=k;
    }
    if(i<0) return;
    r.steps[i][0]="Wesenheit";
    r.steps[i][1]=WAHL;
    var next=r.steps[i+1] && r.steps[i+1][0];
    if(next!=="Rufen"){
      r.steps.splice(i+1,0,
        ["Rufen", RUFEN],
        ["Prüfen", PRUEF],
        ["Auftrag an die Wesenheit", "Tu:\nNur wenn die Prüfung klar war. Sonst zurück und ohne weiter.\n\n"+(AUF[r.id]||"Sprich:\nDein Auftrag ist nur dieser eine Satz.\nDann gehst du vollständig.")]
      );
    }
  });
})();
