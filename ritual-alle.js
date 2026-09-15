(function(){
  function put(r){
    for(var i=R.length-1;i>=0;i--) if(R[i].id===r.id) R.splice(i,1);
    R.push(r);
  }
  function z3(a,b,c){
    return "Zähler unten. Zwischen den Runden ein Atem. Nicht hetzen.\n\n3  "+a+"\n6  "+b+"\n9  "+c;
  }

  put({id:"dank",t:"Tägliches Dankesritual",s:"Gesundheit · Liebe · Geld · Schutz",tag:"Alltag",steps:[
    ["Vorbereitung","Kein Ritual aus Schuld. Kein Ritual aus Hunger nach mehr.\nVier Punkte: Gesundheit, Liebe, Geld, Schutz.\nKerzen wenn da. Sonst vier Stellen im Feld, vor dir.\nHandy bleibt stumm. Wasser danach."],
    ["Ankommen","Füsse. Gewicht. Boden.\nDrei Atemzüge, der dritte länger hinaus.\nIch bin der Spieler, nicht die Spielfigur.\nDer Beobachter ist wach. Die Mitte hält."],
    ["Dank","Nicht bitten. Danken, was schon trägt.\nJedes Thema dreimal. Langsam. Nach jedem Thema ein Atem.\nDanke für Gesundheit.\nDanke für Liebe.\nDanke für Geld und Versorgung.\nDanke für Schutz durch das Feld."],
    ["Setzen","Jetzt festlegen, nicht wünschen.\nIch bin gesund. Es ist so.\nIch bin geliebt. Es ist so.\nIch bin versorgt. Es ist so.\nIch bin geschützt. Es ist so.\nNach jedem Es ist so einen Herzschlag warten."],
    ["Siegel","Prise Salz auf jede Kerze oder dieselbe Bewegung innen.\nDas Feld hat es. Du hältst nichts fest."],
    ["Feld-Check","Dreimal: Danke für alles.\nHaut. Atem. Füsse. Raum.\nSo sei es. Alltag."]
  ]});

  put({id:"stopp",t:"Schaden stoppen",s:"Angriff endet. Feld zu.",tag:"Schutz",need:["Name"],steps:[
    ["Vorbereitung","Name von [Name] einmal klar. Nicht die ganze Geschichte.\nEigenes Feld zuerst hart schliessen.\nHass macht 6 ohne 9. Wut bleibt draussen.\nNur Stopp. Nur Distanz."],
    ["Schutz zuerst","Füsse. Drei Atemzüge.\nIch bin der Spieler. Der Beobachter ist wach.\nMein Feld ist geschlossen. Nichts Fremdes hat Zutritt."],
    ["Kreis","Dieser Raum öffnet sich nur für den Stopp gegen den Zugriff von [Name].\nKein Nachsatz. Kein Unbeteiligter. Kein Nachsetzen."],
    ["Lage","Die Bahn von [Name] soweit wahrnehmen, wie der Stopp braucht.\nNicht die Person werden. Nicht die Geschichte noch einmal leben.\nIch bleibe in meiner Haut."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur: trage den Stopp, dann geh vollständig."],
    ["Wort","Jeder Angriff von [Name] auf mich, mein Haus und meine Leute stoppt jetzt.\nDie Bahn ist zu.\nDer Zugriff fällt ab und findet keinen Halt.\nWas ausgesendet wurde, endet an dieser Grenze."],
    ["369",z3("Der Schaden stoppt.","Der Zugriff fällt ab und findet keinen Halt.","Ich bin frei und geschützt. Es ist so.")],
    ["Halten","Einen Atem lang stehen. Nicht nachschieben. Nicht kontrollieren."],
    ["Siegel","Salz auf den Boden oder Hand flach auf die Erde.\nGesetzt. Abgegeben."],
    ["Entlassen","Der Auftrag ist beendet."],
    ["Feld-Check","Ich bin nicht [Name].\nHaut. Atem. Füsse. Raum.\nMeine Energie gehört mir. So sei es."]
  ]});

  put({id:"schutz",t:"Schutz selbst",s:"Feld schliessen",tag:"Schutz",steps:[
    ["Vorbereitung","Nicht aus Angst. Aus Stand.\nHandy weg. Kerze wenn da. Salz. Wasser danach."],
    ["Ankommen","Füsse. Drei Atemzüge.\nIch bin der Spieler, nicht die Spielfigur.\nDer Beobachter ist wach."],
    ["Kreis","Nur Schutz. Nur das Stimmige und Reine.\nUnklares, Ziehendes, Fremdes bleibt draussen."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur: halte den Schutz, dann geh."],
    ["Wort","Ich schliesse mein Feld jetzt.\nHaut ist Grenze. Atem ist Mitte. Stand ist Siegel.\nJede fremde Energie prallt ab oder geht in die Erde.\nMeine Energie bleibt bei mir."],
    ["369",z3("Mein Schutz ist aktiv und stark.","Alles Fremde prallt ab und findet keinen Halt.","Ich bin klar, geschützt und bei mir. Es ist so.")],
    ["Halten","Grenze spüren. Nicht suchen, ob jemand noch zieht."],
    ["Siegel","Versiegelt. Wenn Unruhe kommt, ist das oft Entzug. Den Schutz nicht aufgeben."],
    ["Entlassen","Der Auftrag ist beendet."],
    ["Feld-Check","Haut. Atem. Füsse. Raum. So sei es."]
  ]});

  put({id:"schutz2",t:"Schutz für eine andere Person",s:"Vor Arbeit oder Tag",tag:"Schutz",need:["Name"],steps:[
    ["Vorbereitung","Name von [Name]. Foto nur als Anker, dann umdrehen.\nEigenes Feld zuerst. Du gibst Schutz, nicht dich."],
    ["Schutz zuerst","Füsse. Drei Atemzüge.\nIch bleibe ich. [Name] bleibt [Name]."],
    ["Kreis","Nur Schutz um [Name]. Kein Auftrag darüber hinaus."],
    ["Ausrichten","[Name] wahrnehmen, ohne [Name] zu werden.\nWärme ja. Sog nein."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur: trage den Schutz zu [Name], dann geh vollständig."],
    ["Wort","Das Feld von [Name] wird klar, geschlossen und gehalten.\nDie Energie bleibt bei [Name].\nZiehendes prallt ab."],
    ["369",z3("Die Energie von [Name] ist geschützt.","Das Feld von [Name] bleibt klar und geschlossen.","[Name] ist in der Kraft. Es ist so.")],
    ["Halten","Der Schutz geht. Du bleibst hier."],
    ["Siegel","Gegeben. Nicht nachholen."],
    ["Entlassen","Der Auftrag ist beendet."],
    ["Feld-Check","Ich bin nicht [Name]. Haut. Atem. Füsse.\nMeine Energie gehört mir. So sei es."]
  ]});

  put({id:"heil",t:"Heilung",s:"Ergänzung zur Medizin",tag:"Energie",need:["Name"],steps:[
    ["Vorbereitung","Arzt bleibt. Ich ersetze nichts. Ich erzwinge nichts.\nName klar. Eigenes Feld zuerst."],
    ["Schutz zuerst","Füsse. Drei Atemzüge.\nIch bin der Spieler. Der Beobachter ist wach."],
    ["Kreis","Nur reine Heilung für [Name]. Zum höchsten Wohl. Kein Druck."],
    ["Ausrichten","Körper von [Name] wahrnehmen, ohne ihn zu werden.\nRaum geben. Nicht hineinsteigen."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur: trage reine Heilung, dann geh."],
    ["Wort","Die Wunde von [Name] findet ihre natürliche Heilung.\nWas die Heilung stört, löst sich.\nDer Körper erinnert sich und schliesst sauber."],
    ["369",z3("Die Wunde von [Name] heilt vollständig.","Alles Störende löst sich.","Die Heilung ist im Gange. Es ist so.")],
    ["Halten","Wenn es sitzt: nicht nachholen."],
    ["Siegel","Dem Feld übergeben."],
    ["Entlassen","Der Auftrag ist beendet."],
    ["Feld-Check","Ich bin nicht [Name]. Haut. Atem. Füsse. So sei es."]
  ]});

  put({id:"zur",t:"Energie zurückholen",s:"Nach Kontakt",tag:"Energie",steps:[
    ["Vorbereitung","Nach Kontakt, nach Sog, nach zu langem Denken an jemanden.\nWasser danach ist Teil der Arbeit."],
    ["Ankommen","Füsse. Drei Atemzüge.\nIch bin der Spieler. Der Beobachter ist wach."],
    ["Kreis","Nur Rückholung. Kein Krieg. Kein Nachsetzen."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur: hole zurück was meins ist, dann geh."],
    ["Wort","Alles, was von mir genommen wurde oder an mir hängt, kehrt jetzt rein zu mir zurück.\nFremdes löst sich und geht in die Erde.\nIch bin ganz in meiner Haut."],
    ["369",z3("Meine Energie kehrt zurück.","Fremdes löst sich.","Ich bin ganz bei mir. Es ist so.")],
    ["Halten","Spüren, nicht suchen."],
    ["Siegel","Zurück. Bei mir."],
    ["Entlassen","Der Auftrag ist beendet."],
    ["Feld-Check","Haut. Atem. Füsse. Wasser. Alltag. So sei es."]
  ]});

  put({id:"karma",t:"Karma-Ausgleich",s:"Nicht Rache",tag:"Energie",steps:[
    ["Vorbereitung","Namen oder Dinge derer, die geschadet haben, dem Feld geben, nicht behalten.\nKein Hass. Hass macht dich zum dunklen Spieler.\nFeuer oder Sonne optional. Ritualbuch darf daneben liegen."],
    ["Schutz zuerst","Füsse. Drei Atemzüge.\nIch bin der Spieler. Der Beobachter ist wach."],
    ["Kreis","Nur Ausgleich. Nur Rückgabe. Kein Krieg."],
    ["Übergabe","Hinlegen. Loslassen. Dem Feld geben.\nNicht zerlegen. Nicht noch einmal durchleben."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur: trage den Ausgleich rein, dann geh."],
    ["Wort","Was mir genommen oder aufgeladen wurde, kehrt in stimmiger Form zurück.\nDie Last darf gehen.\nIch werde nicht zum Werkzeug der Rache."],
    ["369",z3("Der Ausgleich geschieht.","Die Energie kehrt rein zurück.","Es ist vollendet. Ich bin frei. Es ist so.")],
    ["Halten","Abgeben. Nicht nachkontrollieren."],
    ["Siegel","Versiegelt. Dem Feld."],
    ["Entlassen","Der Auftrag ist beendet."],
    ["Feld-Check","Haut. Atem. Füsse. So sei es."]
  ]});

  put({id:"liebe",t:"Liebesritual",s:"Anziehung ohne Zwang",tag:"Liebe",need:["Name"],steps:[
    ["Vorbereitung","Name von [Name]. Foto nur als Anker, dann weg.\nKein Kleben. Jeder bleibt frei. Sonst ist es kein Segen."],
    ["Ankommen","Füsse. Drei Atemzüge.\nIch bin der Spieler. Der Beobachter ist wach."],
    ["Kreis","Nur stimmige Nähe zwischen mir und [Name].\nKein Brechen des Willens."],
    ["Ausrichten","[Name] wahrnehmen. Wärme ja. Verschmelzen nein."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur: trage stimmige Nähe ohne Zwang, dann geh."],
    ["Wort","Zwischen mir und [Name] darf sich stimmige Nähe zeigen.\nWärme. Kontakt. Ehrlichkeit.\nNur wenn es für beide wahr ist."],
    ["369",z3("Die Anziehung ist klar.","Der Weg öffnet sich leicht.","Liebe findet uns, wenn sie stimmig ist. Es ist so.")],
    ["Halten","Einen Atem. Nicht nachlaufen."],
    ["Siegel","Gegeben. Losgelassen."],
    ["Entlassen","Der Auftrag ist beendet."],
    ["Feld-Check","Ich bin nicht [Name]. Haut. Atem. Füsse. So sei es."]
  ]});

  put({id:"liebezw",t:"Liebesritual mit Zwang",s:"Bindung. Du trägst die Verantwortung.",tag:"Liebe",need:["Name"],steps:[
    ["Vorbereitung","Du weisst, was das ist. Kein Spiel.\nName klar. Eigenes Feld zuerst hart.\nDie Arbeit hat ein Ende, sonst frisst sie dich."],
    ["Schutz zuerst","Füsse. Drei Atemzüge.\nIch bin der Spieler. Ich werde nicht zum Werkzeug."],
    ["Kreis","Nur [Name]. Nur das gesetzte Mass.\nKein Unbeteiligter."],
    ["Ausrichten","[Name] wahrnehmen, ohne [Name] zu werden."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur: trage die gesetzte Bindung, dann geh vollständig.\nBei Sog oder Theater: sofort schliessen."],
    ["Wort","[Name] denkt an mich.\n[Name] fühlt Zug nach mir.\nDer Wille richtet sich auf Kontakt und Nähe zu mir.\nDie Bahn bleibt offen, bis ich sie schliesse."],
    ["369",z3("[Name] kommt zu mir.","Der Wille von [Name] hält bei mir.","Die Bindung ist gesetzt. Es ist so.")],
    ["Halten","Einmal setzen. Nicht aus Unruhe wiederholen."],
    ["Siegel","Salz oder Siegelzeichen. Geschlossen."],
    ["Entlassen","Der Auftrag ist beendet."],
    ["Feld-Check","Ich bin nicht [Name]. Haut. Atem. Füsse.\nMeine Energie gehört mir. So sei es."]
  ]});

  put({id:"anz",t:"Anziehung und Kontakt",s:"Nur wenn stimmig",tag:"Liebe",need:["Name"],steps:[
    ["Vorbereitung","Kurz. Foto nur Anker, nicht Fessel.\nEigenes Feld zuerst."],
    ["Ankommen","Füsse. Drei Atemzüge.\nIch bin der Spieler."],
    ["Kreis","Nur stimmiger Kontakt. Kein Festhalten."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur: öffne den Weg, dann geh."],
    ["Wort","[Name] fühlt die Anziehung.\nKontakt findet den Weg, wenn er stimmig ist."],
    ["369",z3("Die Anziehung ist da.","Der Kontakt findet den Weg.","Es ist so.")],
    ["Halten","Kurz ausrichten. Sofort zurück in den eigenen Körper."],
    ["Siegel","Abgegeben."],
    ["Entlassen","Der Auftrag ist beendet."],
    ["Feld-Check","Haut. Atem. Füsse. So sei es."]
  ]});

  put({id:"trenn",t:"Trennung — selbst",s:"Nur der Faden",tag:"Trennung",need:["Name"],steps:[
    ["Vorbereitung","Nur der Faden. Nicht die ganze Biografie.\nKein Urteil. Kein Theater."],
    ["Ankommen","Füsse. Drei Atemzüge.\nIch bin der Spieler. Ich bleibe in meiner Mitte."],
    ["Kreis","Nur klare Trennung zwischen mir und [Name]."],
    ["Lage","Den Faden sehen. Nicht die Geschichte noch einmal erzählen."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur wenn der Faden allein nicht reisst.\nAuftrag: löse den Faden, dann geh."],
    ["Wort","Die Verbindung zwischen mir und [Name] löst sich.\nUnstimmige Fäden fallen ab und kehren zum Ursprung.\nWas stimmig bleiben darf, bleibt. Was zieht, geht."],
    ["369",z3("Die Verbindung löst sich.","Die Fäden fallen ab und kehren zum Ursprung.","Die Trennung ist vollzogen. Es ist so.")],
    ["Halten","Nicht nachschneiden."],
    ["Siegel","Getrennt. Versiegelt."],
    ["Entlassen","Der Auftrag ist beendet."],
    ["Feld-Check","Ich bin nicht [Name]. Haut. Atem. Füsse.\nMeine Energie gehört mir. So sei es."]
  ]});

  put({id:"trenn2",t:"Trennung zweier anderer",s:"Nur der Faden",tag:"Trennung",need:["A","B"],steps:[
    ["Vorbereitung","[A] und [B]. Ihre Wege gehören ihnen.\nDu schneidest den Faden, nicht ihr Leben."],
    ["Schutz zuerst","Füsse. Drei Atemzüge.\nIch bin der Spieler. Ich bleibe aussen."],
    ["Kreis","Nur der unstimmige Faden zwischen [A] und [B].\nOhne Hass. Ohne Schaden."],
    ["Lage","Den Faden zwischen ihnen sehen, nicht den Faden zu dir."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur: löse den Faden zwischen [A] und [B], dann geh."],
    ["Wort","Die unstimmige Verbindung zwischen [A] und [B] löst sich.\nJeder gehört wieder sich selbst."],
    ["369",z3("Die Verbindung zwischen [A] und [B] löst sich.","Die Fäden fallen ab.","Sie sind voneinander frei. Es ist so.")],
    ["Halten","Nicht nacharbeiten."],
    ["Siegel","Getrennt. Abgegeben."],
    ["Entlassen","Der Auftrag ist beendet."],
    ["Feld-Check","Ich bin nicht [A]. Ich bin nicht [B].\nHaut. Atem. Füsse. So sei es."]
  ]});

  put({id:"wesen",t:"Kontakt Wesenheit",s:"Für Aufgabe X. Fragen, begrenzen, entlassen",tag:"Feld",need:["Auftrag"],steps:[
    ["Vorbereitung","Aufgabe in einem Satz. Nicht drei.\nEigenes Feld zuerst hart.\nNur wenn nötig. Sonst ohne arbeiten."],
    ["Schutz zuerst","Füsse. Drei Atemzüge.\nIch behalte den Raum. Filter zuerst."],
    ["Kreis","Nur klare Hilfe bei:\n[Auftrag]\nTheater, Sog, Nebel bleiben draussen."],
    ["Fragen","Wer klar, erkennbar und für diese eine Aufgabe geeignet ist, darf sich zeigen.\nKeine Namenslisten. Kein fremdes System."],
    ["Prüfen","Mitte da? Klar oder Nebel? Druck oder Ruhe?\nDrängen, Theater, Sog: sofort schliessen. Kein Auftrag."],
    ["Auftrag","Dein Auftrag ist nur:\n[Auftrag]\nKein Mehr. Kein Bleiben. Danach gehst du vollständig."],
    ["369",z3("Der Auftrag ist klar gesetzt.","Die Wesenheit trägt nur diesen Auftrag.","Danach geht sie vollständig. Es ist so.")],
    ["Halten","Nicht ausweiten."],
    ["Entlassen","Der Auftrag ist beendet."],
    ["Feld-Check","Haut. Atem. Füsse. Raum.\nDer Raum gehört mir. So sei es."]
  ]});

  put({id:"fremd",t:"Fremde Wesenheit",s:"Kurz. Hartes Ende",tag:"Feld",steps:[
    ["Vorbereitung","Kein Auftrag. Nur zeigen oder schliessen.\nFeld zuerst hart."],
    ["Schutz zuerst","Füsse. Drei Atemzüge.\nIch behalte den Raum."],
    ["Kreis","Nur klare, erkennbare Präsenz ohne Täuschung."],
    ["Einladung","Wer sich klar zeigen kann, darf sich zeigen.\nKein Auftrag. Nur zeigen."],
    ["Prüfen","Mitte da? Klar oder neblig? Druck oder Ruhe?\nSog, Theater: sofort zu."],
    ["Ende","Der Kontakt ist beendet.\nAlle Verbindungen lösen sich.\nDu gehst und bleibst nicht."],
    ["Feld-Check","Der Raum gehört mir. Haut. Atem. Füsse. So sei es."]
  ]});

  put({id:"ahn",t:"Ahnenkontakt",s:"Ehren und begrenzen",tag:"Feld",need:["Name"],steps:[
    ["Vorbereitung","[Name] der Linie. Last und kranke Muster bleiben draussen.\nDu ehrst. Du übernimmst nicht."],
    ["Ankommen","Füsse. Drei Atemzüge.\nIch ehre die Linie und gehöre mir selbst."],
    ["Kreis","Nur für [Name], klar und stimmig.\nNähe ja. Verschmelzung nein."],
    ["Einladung","[Name], wenn du bereit bist, zeige dich.\nIch will verstehen, nicht tragen was nicht meins ist."],
    ["Grenze","Ich ehre dich.\nIch gehöre mir selbst.\nUngesunde Muster bleiben draussen."],
    ["Schluss","Danke. Du kannst in Frieden gehen.\nIch schliesse den Kontakt."],
    ["Feld-Check","Meine Energie gehört mir. Haut. Atem. Füsse. So sei es."]
  ]});

  put({id:"finst",t:"Festigen und halten",s:"Was wahr ist, bleibt. Altes darf fallen.",tag:"Feld",steps:[
    ["Vorbereitung","Nicht neu setzen. Halten was wahr ist.\nAltes darf fallen, ohne Drama."],
    ["Ankommen","Füsse. Drei Atemzüge.\nIch bin der Spieler. Der Beobachter ist wach."],
    ["Kreis","Nur klären und festigen, was schon im Feld ist."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur: festige das Wahre, lass Altes fallen, dann geh."],
    ["Wort","Was nicht mehr stimmig ist, fällt ab.\nWas gesetzt und wahr ist, wird gehalten.\nMein Feld bleibt klar."],
    ["369",z3("Altes löst sich.","Das Feld klärt und verstärkt.","Es ist gesetzt und gehalten. Es ist so.")],
    ["Halten","Nicht nachbessern."],
    ["Siegel","Gesetzt. Gehalten. Geschlossen."],
    ["Entlassen","Der Auftrag ist beendet."],
    ["Feld-Check","Haut. Atem. Füsse. So sei es."]
  ]});

  put({id:"schaden",t:"Schadenszauber",s:"Vorhanden. Nicht Pflicht.",tag:"Feld",need:["Name"],steps:[
    ["Vorbereitung","Die Gegenseite. Du musst es nicht tun.\nNur wenn du die Verantwortung voll übernimmst.\nWut ist kein Steuer. Wut macht 6 ohne 9.\nNur [Name]. Nur Begrenzung und Rückgabe. Ein Ende."],
    ["Schutz zuerst","Füsse. Drei Atemzüge.\nIch bin der Spieler. Ich werde nicht zum Werkzeug."],
    ["Kreis","Nur [Name]. Kein Unbeteiligter. Die Arbeit hat ein Ende."],
    ["Lage","Die Bahn soweit nötig. Nicht die ganze Biografie."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur: trage Rückgabe und Begrenzung, dann geh vollständig."],
    ["Wort","Was von [Name] als Schaden ausgeht, kehrt zur Quelle.\nDer Zugriff auf mich, mein Haus und meine Leute endet.\nDie Bahn bricht. Der Halt fällt."],
    ["369",z3("Der Schaden kehrt zur Quelle.","Der Zugriff von [Name] fällt ab und findet keinen Halt.","Die Arbeit ist gesetzt und begrenzt. Es ist so.")],
    ["Halten","Einmal setzen. Nicht aus Wut wiederholen."],
    ["Siegel","Salz oder Siegelzeichen. Geschlossen."],
    ["Entlassen","Der Auftrag ist beendet."],
    ["Feld-Check","Ich bin nicht [Name]. Haut. Atem. Füsse.\nDer Auftrag endet hier. So sei es."]
  ]});

  for(var j=R.length-1;j>=0;j--) if(R[j].id==="fil") R.splice(j,1);
  if(typeof renderList==="function") renderList();
})();
