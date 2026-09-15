(function(){
  var G=
    "Tu:\nStehen. Füsse. Feld halten. Nicht suchen — nur prüfen.\n\n"+
    "Ohne — sprich:\nIch gehe allein weiter zum Wort.\nKein Kontakt. Kein Auftrag.\n\n"+
    "Mit — nur wenn klar. Sprich:\nIch behalte den Raum.\nMein Feld bleibt geschlossen.\nNur klare, begrenzbare Präsenz.\nAuftrag nur in einem Satz. Dann gehst du vollständig.\n\n"+
    "Prüfen: Mitte da? Klar oder Nebel? Druck oder Ruhe?\nBei Druck, Theater, Sog: sofort schliessen. Kein Auftrag.";

  var MAP={
    stopp:
      "Tu:\nStehen. Feld hart halten. Nicht die Geschichte aufmachen.\n\n"+
      "Ohne — sprich:\nIch gehe allein weiter zum Wort.\nDer Stopp sitzt ohne Hilfskraft.\n\n"+
      "Mit — nur wenn klar. Sprich:\nIch behalte den Raum.\nTrage den Stopp gegen [Name].\nDann gehst du vollständig.\nKein eigener Krieg. Kein Bleiben.\n\n"+
      "Prüfen: Mitte da? Klar oder Nebel?\nBei Druck: sofort schliessen.",
    schutz:
      "Tu:\nStand fest. Grenze halten.\n\n"+
      "Ohne — sprich:\nIch schliesse mein Feld selbst.\nIch gehe weiter zum Wort.\n\n"+
      "Mit — nur wenn klar. Sprich:\nHalte den Schutz.\nDann geh.\n\n"+
      "Prüfen: Druck oder Ruhe? Bei Druck: ohne weiter.",
    schutz2:
      "Tu:\nDu bleibst hier. [Name] bleibt [Name].\n\n"+
      "Ohne — sprich:\nIch gebe den Schutz selbst.\nWeiter zum Wort.\n\n"+
      "Mit — nur wenn klar. Sprich:\nTrage den Schutz zu [Name].\nDann geh vollständig.\n\n"+
      "Prüfen: Sog? Dann sofort schliessen.",
    heil:
      "Tu:\nRaum geben. Kein Druck.\n\n"+
      "Ohne — sprich:\nDie Heilung geht ohne Hilfskraft.\nWeiter zum Wort.\n\n"+
      "Mit — nur wenn klar. Sprich:\nTrage reine Heilung zu [Name].\nDann geh.\n\n"+
      "Prüfen: Klar oder Nebel?",
    zur:
      "Tu:\nBei dir bleiben. Nicht nachlaufen.\n\n"+
      "Ohne — sprich:\nIch hole zurück was meins ist.\nWeiter zum Wort.\n\n"+
      "Mit — nur wenn klar. Sprich:\nHole zurück was meins ist.\nDann geh.",
    karma:
      "Tu:\nAbgeben, nicht kämpfen.\n\n"+
      "Ohne — sprich:\nDer Ausgleich geht durch das Feld.\nWeiter zum Wort.\n\n"+
      "Mit — nur wenn klar. Sprich:\nTrage den Ausgleich rein.\nDann geh.",
    liebe:
      "Tu:\nWärme ja. Kleben nein.\n\n"+
      "Ohne — sprich:\nDie Nähe darf stimmig kommen.\nWeiter zum Wort.\n\n"+
      "Mit — nur wenn klar. Sprich:\nTrage stimmige Nähe ohne Zwang.\nDann geh.",
    liebezw:
      "Tu:\nFeld hart. Bei Sog sofort zu.\n\n"+
      "Ohne — sprich:\nIch setze selbst.\nWeiter zum Wort.\n\n"+
      "Mit — nur wenn klar. Sprich:\nTrage die gesetzte Bindung.\nDann geh vollständig.\n\n"+
      "Theater oder Sog: sofort schliessen.",
    anz:
      "Tu:\nKurz halten. Sofort zurück in den Körper.\n\n"+
      "Ohne — sprich:\nDer Weg darf sich öffnen.\nWeiter zum Wort.\n\n"+
      "Mit — nur wenn klar. Sprich:\nÖffne den Weg.\nDann geh.",
    trenn:
      "Tu:\nNur den Faden. Nicht die Geschichte.\n\n"+
      "Ohne — sprich:\nIch löse den Faden selbst.\nWeiter zum Wort.\n\n"+
      "Mit — nur wenn der Faden allein nicht reisst. Sprich:\nLöse den Faden.\nDann geh.",
    trenn2:
      "Tu:\nAussen bleiben.\n\n"+
      "Ohne — sprich:\nDer Faden zwischen [A] und [B] löst sich.\nWeiter zum Wort.\n\n"+
      "Mit — nur wenn klar. Sprich:\nLöse den Faden zwischen [A] und [B].\nDann geh.",
    finst:
      "Tu:\nHalten, nicht neu setzen.\n\n"+
      "Ohne — sprich:\nWas wahr ist, bleibt.\nWeiter zum Wort.\n\n"+
      "Mit — nur wenn klar. Sprich:\nFestige das Wahre. Lass Altes fallen.\nDann geh.",
    schaden:
      "Tu:\nMass halten. Wut steuert nicht.\n\n"+
      "Ohne — sprich:\nIch setze selbst.\nWeiter zum Wort.\n\n"+
      "Mit — nur wenn klar. Sprich:\nTrage Rückgabe und Begrenzung zu [Name].\nDann geh vollständig.\n\n"+
      "Theater oder Sog: sofort schliessen.",
    fluch:
      "Tu:\nFeld hart. Du bleibst der Spieler.\n\n"+
      "Ohne — sprich:\nIch setze das Wort selbst.\nWeiter zum Wort.\n\n"+
      "Mit — nur wenn klar. Sprich:\nTrage das gesetzte Wort zu [Name].\nBegrenze die Bahn.\nDann gehst du vollständig.\n\n"+
      "Prüfen: Mitte da? Bei Druck: sofort schliessen.",
    segen:
      "Tu:\nWärme ohne Sog.\n\n"+
      "Ohne — sprich:\nDer Segen geht durch das Feld.\nWeiter zum Wort.\n\n"+
      "Mit — nur wenn klar. Sprich:\nTrage den Segen zu [Name].\nDann geh vollständig.",
    ueber:
      "Tu:\nAuftrag in einem Satz. Feld hart.\n\n"+
      "Ohne — sprich:\nIch setze den Auftrag selbst.\nWeiter zum Wort.\n\n"+
      "Mit — nur wenn klar. Sprich:\nTrage die Übernahme von [Name] nur für [Auftrag].\nDann geh vollständig."
  };

  (R||[]).forEach(function(r){
    if(!r || !r.steps) return;
    r.steps.forEach(function(st){
      if(st && /Wesenheit/i.test(st[0])) st[1]=MAP[r.id]||G;
    });
  });
})();
