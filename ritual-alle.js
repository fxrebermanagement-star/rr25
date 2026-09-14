(function(){
  function put(r){
    for(var i=R.length-1;i>=0;i--) if(R[i].id===r.id) R.splice(i,1);
    R.push(r);
  }
  function z3(a,b,c){
    return "Zähler unten. Zwischen den Runden ein Atem.\n\n3  "+a+"\n6  "+b+"\n9  "+c;
  }

  put({id:"dank",t:"Tägliches Dankesritual",s:"Gesundheit · Liebe · Geld · Schutz",tag:"Alltag",steps:[
    ["Vorbereitung","Handy stumm. Ungestörter Platz.\nVier Themen: Gesundheit, Liebe, Geld, Schutz.\nKerzen wenn da. Sonst vier Punkte im Feld.\nSalz optional. Wasser danach.\nRitualbuch darf daneben liegen."],
    ["Ankommen","Füsse auf den Boden. Drei ruhige Atemzüge.\nIch bin der Spieler, nicht die Spielfigur.\nDer Beobachter ist wach.\nIch handle aus klarer Mitte."],
    ["Dank","Für jedes Thema dreimal. Langsam. Nach jedem Thema ein Atem.\nDanke für Gesundheit.\nDanke für Liebe.\nDanke für Geld und Versorgung.\nDanke für Schutz durch das Feld."],
    ["Setzen","Jetzt nicht bitten. Setzen.\nIch bin gesund. Es ist so.\nIch bin geliebt. Es ist so.\nIch bin versorgt. Es ist so.\nIch bin geschützt. Es ist so.\nNach jedem Es ist so innehalten."],
    ["Siegel","Optional auf jede Kerze eine Prise Salz.\nDies versiegelt und reinigt.\nOhne Kerzen: dieselbe Bewegung innerlich."],
    ["Feld-Check","Dreimal: Danke für alles.\nDie Arbeit ist dem Feld übergeben.\nHaut. Atem. Füsse. Raum.\nSo sei es. Loslassen. Wasser. Alltag."]
  ]});

  put({id:"stopp",t:"Schaden stoppen",s:"Angriff endet. Feld zu.",tag:"Schutz",need:["Name"],steps:[
    ["Vorbereitung","Name klar. Handy weg.\nEigenes Feld zuerst. Ohne das kein Weiter.\nKerze optional. Salz. Wasser danach.\nKein Hass als Steuer. Nur Stopp und Distanz."],
    ["Schutz zuerst","Füsse. Drei Atemzüge.\nIch bin der Spieler. Der Beobachter ist wach.\nMein Feld ist geschlossen.\nNichts Fremdes hat Zutritt."],
    ["Kreis","Ich öffne nur für Stopp gegen den Zugriff von [Name].\nKein Nachsetzen. Kein Theater. Kein Unbeteiligter."],
    ["Lage","[Name] will schaden oder zieht.\nIch halte das hier auf.\nOhne mich zu verlieren. Ich bleibe der Spieler."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur: trage den Stopp, dann geh vollständig.\nBei Druck oder Nebel: ohne weiter."],
    ["Wort","Jeder Angriff von [Name] auf mich, mein Haus und meine Leute stoppt jetzt.\nDie Bahn ist zu. Der Zugriff fällt ab.\nWas ausgesendet wurde, endet hier."],
    ["369",z3("Der Schaden stoppt.","Der Zugriff fällt ab und findet keinen Halt.","Ich bin frei und geschützt. Es ist so.")],
    ["Halten","Einen Atem lang stehen lassen. Nicht nachschieben."],
    ["Siegel","Salz oder Hand auf den Boden. Versiegelt. Abgegeben."],
    ["Entlassen","Falls eine Wesenheit da war: Danke. Du gehst vollständig. Kontakt zu."],
    ["Feld-Check","Ich bin nicht [Name]. Haut. Atem. Füsse. Raum.\nMeine Energie gehört mir. So sei es. Erden. Wasser."]
  ]});

  put({id:"schutz",t:"Schutz selbst",s:"Feld schliessen",tag:"Schutz",steps:[
    ["Vorbereitung","Handy weg. Ungestörter Platz.\nKerze wenn da. Salz. Wasser danach.\nRitualbuch darf daneben liegen."],
    ["Ankommen","Füsse. Drei Atemzüge.\nIch bin der Spieler, nicht die Spielfigur.\nDer Beobachter ist wach."],
    ["Kreis","Ich öffne diesen Raum nur für Schutz.\nNur das Stimmige und Reine darf hier sein.\nUnklares bleibt draussen."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur: halte den Schutz, dann geh.\nBei Druck: ohne weiter."],
    ["Wort","Ich schütze mich jetzt vollständig.\nMein Feld ist geschlossen, klar und stabil.\nJede fremde Energie prallt ab oder geht in die Erde.\nMeine Energie gehört allein mir."],
    ["369",z3("Mein Schutz ist aktiv und stark.","Alles Fremde prallt ab und findet keinen Halt.","Ich bin klar, geschützt und bei mir. Es ist so.")],
    ["Halten","Körpergrenze spüren: Haut, Atem, Stand."],
    ["Siegel","Der Schutz ist gesetzt und versiegelt. Nicht aufgeben, wenn Unruhe kommt."],
    ["Entlassen","Falls Wesenheit da war: Danke. Du gehst. Kontakt zu."],
    ["Feld-Check","Haut. Atem. Füsse. Raum. So sei es. Erden. Wasser. Alltag."]
  ]});

  put({id:"schutz2",t:"Schutz für eine andere Person",s:"Vor Arbeit oder Tag",tag:"Schutz",need:["Name"],steps:[
    ["Vorbereitung","Name von [Name] klar. Handy weg.\nEigenes Feld zuerst schliessen.\nFoto nur als Anker, dann weglegen.\nKerze optional. Salz. Wasser danach."],
    ["Schutz zuerst","Füsse. Drei Atemzüge.\nIch bin der Spieler.\nIch gebe Schutz, nicht mich."],
    ["Kreis","Nur für Schutz von [Name].\nKein Auftrag darüber hinaus."],
    ["Ausrichten","[Name] wahrnehmen, ohne [Name] zu werden.\nWärme ja. Verschmelzen nein."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur: trage den Schutz zu [Name], dann geh vollständig."],
    ["Wort","Das Feld von [Name] wird klar und geschützt.\nDie Energie bleibt bei [Name].\nAlles Ziehende prallt ab."],
    ["369",z3("Die Energie von [Name] ist geschützt.","Das Feld von [Name] bleibt klar und geschlossen.","[Name] ist in der Kraft. Es ist so.")],
    ["Halten","Einen Atem. Der Schutz geht zu [Name]. Ich bleibe hier."],
    ["Siegel","Gegeben. Versiegelt. Nicht nachholen."],
    ["Entlassen","Falls Wesenheit da war: Danke. Du gehst. Kontakt zu."],
    ["Feld-Check","Ich bin nicht [Name]. Haut. Atem. Füsse.\nMeine Energie gehört mir. Der Schutz bleibt bei [Name].\nSo sei es. Erden."]
  ]});

  put({id:"heil",t:"Heilung",s:"Ergänzung zur Medizin",tag:"Energie",need:["Name"],steps:[
    ["Vorbereitung","Name klar. Arzt bleibt parallel. Ich ersetze nichts.\nHandy weg. Eigenes Feld zuerst.\nKerze optional. Wasser danach."],
    ["Schutz zuerst","Füsse. Drei Atemzüge.\nIch bin der Spieler. Der Beobachter ist wach."],
    ["Kreis","Ich öffne nur für reine, stimmige Heilung von [Name].\nKein Erzwingen. Zum höchsten Wohl."],
    ["Ausrichten","[Name] wahrnehmen, ohne die Person zu werden.\nZugang suchen: Körper, Wunde, Qualität der Heilung.\nKein Druck. Nur Raum."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur: trage reine Heilung zu [Name], dann geh."],
    ["Wort","Die Wunde von [Name] findet jetzt natürliche, vollständige Heilung.\nAlles, was die Heilung behindert, löst sich.\nDer Körper erinnert sich und schliesst sauber."],
    ["369",z3("Die Wunde von [Name] heilt vollständig.","Alles Störende löst sich.","Die Heilung ist im Gange. Es ist so.")],
    ["Halten","Einen Atem. Nicht nachholen, wenn es sitzt."],
    ["Siegel","Gegeben. Dem Feld übergeben."],
    ["Entlassen","Falls Wesenheit da war: Danke. Du gehst. Kontakt zu."],
    ["Feld-Check","Ich bin nicht [Name]. Haut. Atem. Füsse.\nSo sei es. Erden. Wasser."]
  ]});

  put({id:"zur",t:"Energie zurückholen",s:"Nach Kontakt",tag:"Energie",steps:[
    ["Vorbereitung","Handy weg. Eigenes Feld zuerst.\nWasser danach bereit. Das gehört zur Arbeit."],
    ["Ankommen","Füsse. Drei Atemzüge.\nIch bin der Spieler. Der Beobachter ist wach."],
    ["Kreis","Nur Rückholung. Kein Nachsetzen. Kein Krieg."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur: hole zurück was meins ist, dann geh."],
    ["Wort","Alles, was von mir genommen wurde oder an mir hängt, kehrt jetzt rein und vollständig zu mir zurück.\nFremde Energie löst sich und geht.\nIch bin klar, ruhig und bei mir."],
    ["369",z3("Meine Energie kehrt zurück.","Fremdes löst sich.","Ich bin ganz bei mir. Es ist so.")],
    ["Halten","Einen Atem. Spüren, nicht suchen."],
    ["Siegel","Zurück. Versiegelt. Bei mir."],
    ["Entlassen","Falls Wesenheit da war: Danke. Du gehst. Kontakt zu."],
    ["Feld-Check","Haut. Atem. Füsse. Raum. Wasser. Körper. Alltag.\nSo sei es."]
  ]});

  put({id:"karma",t:"Karma-Ausgleich",s:"Nicht Rache",tag:"Energie",steps:[
    ["Vorbereitung","Namen oder Gegenstände derer, die geschadet haben, bereitlegen.\nEigenes Feld zuerst. Handy weg.\nKein Hass. Kein Nachsetzen. Feuer oder Sonne optional."],
    ["Schutz zuerst","Füsse. Drei Atemzüge.\nIch bin der Spieler. Der Beobachter ist wach.\nIch werde nicht zum dunklen Spieler."],
    ["Kreis","Nur Ausgleich. Nur Rückgabe. Kein Krieg."],
    ["Übergabe","Namen und Gegenstände dem Feld übergeben.\nNicht behalten. Nicht zerlegen. Dem Feld geben."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur: trage den Ausgleich rein, dann geh."],
    ["Wort","Was mir genommen oder aufgeladen wurde, kehrt in stimmiger Form zurück.\nDer Ausgleich geschieht ohne Hass.\nDie Last darf gehen."],
    ["369",z3("Der Ausgleich geschieht.","Die Energie kehrt rein zurück.","Es ist vollendet. Ich bin frei. Es ist so.")],
    ["Halten","Abgeben. Nicht nachkontrollieren."],
    ["Siegel","Ritualbuch darf daneben liegen. Versiegelt."],
    ["Entlassen","Falls Wesenheit da war: Danke. Du gehst. Kontakt zu."],
    ["Feld-Check","Haut. Atem. Füsse. So sei es. Erden. Alltag."]
  ]});

  put({id:"liebe",t:"Liebesritual",s:"Anziehung ohne Zwang",tag:"Liebe",need:["Name"],steps:[
    ["Vorbereitung","Name klar. Foto nur als Anker, dann weglegen.\nHandy weg. Eigenes Feld zuerst.\nKerze optional. Wasser danach.\nKein Festhalten. Jeder bleibt frei."],
    ["Ankommen","Füsse. Drei Atemzüge.\nIch bin der Spieler. Der Beobachter ist wach."],
    ["Kreis","Ich öffne nur für stimmige Liebe zwischen mir und [Name].\nKein Brechen des Willens."],
    ["Ausrichten","[Name] wahrnehmen, ohne [Name] zu werden.\nWärme ja. Kleben nein."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur: trage stimmige Nähe, ohne Zwang, dann geh."],
    ["Wort","Zwischen mir und [Name] darf sich stimmige Nähe zeigen.\nWärme, Kontakt, Ehrlichkeit.\nNur wenn es für beide wahr ist."],
    ["369",z3("Die Anziehung ist klar.","Der Weg öffnet sich leicht.","Liebe findet uns, wenn sie stimmig ist. Es ist so.")],
    ["Halten","Einen Atem. Nicht nachsetzen."],
    ["Siegel","Gegeben. Losgelassen."],
    ["Entlassen","Falls Wesenheit da war: Danke. Du gehst. Kontakt zu."],
    ["Feld-Check","Ich bin nicht [Name]. Haut. Atem. Füsse.\nMeine Energie gehört mir. So sei es. Erden."]
  ]});

  put({id:"liebezw",t:"Liebesritual mit Zwang",s:"Bindung. Du trägst die Verantwortung.",tag:"Liebe",need:["Name"],steps:[
    ["Vorbereitung","Name klar. Foto nur als Anker.\nEigenes Feld zuerst. Handy weg.\nDu weisst, dass dies Zwang ist. Kein Spiel.\nWasser danach."],
    ["Schutz zuerst","Füsse. Drei Atemzüge.\nIch bin der Spieler. Der Beobachter ist wach.\nIch werde nicht zum Werkzeug."],
    ["Kreis","Nur [Name]. Nur das gesetzte Mass.\nKein Auftrag auf Unbeteiligte.\nDie Arbeit hat ein Ende."],
    ["Ausrichten","[Name] wahrnehmen, ohne [Name] zu werden."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur: trage die gesetzte Bindung zu [Name], dann geh vollständig.\nBei Theater oder Sog: sofort schliessen."],
    ["Wort","[Name] denkt an mich.\n[Name] fühlt Zug und Verlangen nach mir.\nDer Wille richtet sich auf Kontakt und Nähe zu mir.\nDie Bahn bleibt offen, bis ich sie schliesse."],
    ["369",z3("[Name] kommt zu mir.","Der Wille von [Name] hält bei mir.","Die Bindung ist gesetzt. Es ist so.")],
    ["Halten","Einen Atem. Einmal setzen."],
    ["Siegel","Salz oder Siegelzeichen. Nicht aus Unruhe wiederholen."],
    ["Entlassen","Falls Wesenheit da war: Danke. Du gehst. Kontakt zu."],
    ["Feld-Check","Ich bin nicht [Name]. Haut. Atem. Füsse.\nMeine Energie gehört mir. So sei es. Erden. Wasser."]
  ]});

  put({id:"anz",t:"Anziehung und Kontakt",s:"Nur wenn stimmig",tag:"Liebe",need:["Name"],steps:[
    ["Vorbereitung","Name klar. Foto nur als Anker, nicht als Fessel.\nHandy weg. Eigenes Feld zuerst."],
    ["Ankommen","Füsse. Drei Atemzüge.\nIch bin der Spieler. Der Beobachter ist wach."],
    ["Kreis","Nur stimmiger Kontakt. Kein Festhalten."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur: öffne den Weg zum Kontakt, dann geh."],
    ["Wort","[Name] fühlt die Anziehung.\nKontakt geschieht leicht und natürlich.\nNur wenn es für beide stimmig ist."],
    ["369",z3("Die Anziehung ist da.","Der Kontakt findet den Weg.","Es ist so.")],
    ["Halten","Kurz ausrichten. Sofort zurück in den eigenen Körper."],
    ["Siegel","Abgegeben. Nicht nachlaufen."],
    ["Entlassen","Falls Wesenheit da war: Danke. Du gehst. Kontakt zu."],
    ["Feld-Check","Ich kehre in mich zurück. Haut. Atem. Füsse.\nSo sei es. Erden."]
  ]});

  put({id:"trenn",t:"Trennung — selbst",s:"Nur der Faden",tag:"Trennung",need:["Name"],steps:[
    ["Vorbereitung","Name klar. Handy weg.\nEigenes Feld zuerst.\nNur der Faden. Kein Urteil."],
    ["Ankommen","Füsse. Drei Atemzüge.\nIch bin der Spieler. Der Beobachter ist wach.\nIch bleibe in meiner Mitte."],
    ["Kreis","Ich öffne nur für klare Trennung zwischen mir und [Name].\nKein Nachsetzen. Kein Theater."],
    ["Lage","Den Faden wahrnehmen. Nicht die ganze Geschichte."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur wenn der Faden allein nicht reicht.\nAuftrag: löse den Faden, dann geh vollständig."],
    ["Wort","Die Verbindung zwischen mir und [Name] löst sich.\nAlle unstimmigen Fäden werden getrennt.\nIch lasse frei und werde frei.\nWas stimmig bleiben darf, bleibt. Was zieht, geht."],
    ["369",z3("Die Verbindung löst sich.","Die Fäden fallen ab und kehren zum Ursprung.","Die Trennung ist vollzogen. Es ist so.")],
    ["Halten","Einen Atem. Nicht nachschneiden."],
    ["Siegel","Getrennt. Versiegelt."],
    ["Entlassen","Falls Wesenheit da war: Danke. Du gehst. Kontakt zu."],
    ["Feld-Check","Ich bin nicht [Name]. Haut. Atem. Füsse.\nMeine Energie gehört mir. So sei es. Erden."]
  ]});

  put({id:"trenn2",t:"Trennung zweier anderer",s:"Nur der Faden",tag:"Trennung",need:["A","B"],steps:[
    ["Vorbereitung","Namen A und B klar. Handy weg.\nEigenes Feld zuerst.\nIhre Wege gehören ihnen."],
    ["Schutz zuerst","Füsse. Drei Atemzüge.\nIch bin der Spieler. Ich bleibe in meiner Mitte."],
    ["Kreis","Nur Trennung des unstimmigen Fadens zwischen [A] und [B].\nOhne Hass. Ohne Schaden."],
    ["Lage","Den Faden zwischen [A] und [B] wahrnehmen — nicht den Faden zu dir."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur: löse den Faden zwischen [A] und [B], dann geh."],
    ["Wort","Die unstimmige Verbindung zwischen [A] und [B] löst sich.\nDie Fäden zwischen ihnen fallen ab.\nJeder gehört wieder sich selbst."],
    ["369",z3("Die Verbindung zwischen [A] und [B] löst sich.","Die Fäden fallen ab.","Sie sind voneinander frei. Es ist so.")],
    ["Halten","Einen Atem. Nicht nacharbeiten."],
    ["Siegel","Getrennt. Abgegeben."],
    ["Entlassen","Falls Wesenheit da war: Danke. Du gehst. Kontakt zu."],
    ["Feld-Check","Ich bin nicht [A]. Ich bin nicht [B].\nHaut. Atem. Füsse. Meine Energie gehört mir.\nSo sei es. Erden."]
  ]});

  put({id:"wesen",t:"Kontakt Wesenheit",s:"Für Aufgabe X. Fragen, begrenzen, entlassen",tag:"Feld",need:["Auftrag"],steps:[
    ["Vorbereitung","Aufgabe in einem Satz. Nicht drei Aufträge.\nHandy weg. Eigenes Feld zuerst hart schliessen.\nNur wenn nötig. Sonst ohne Wesenheit arbeiten."],
    ["Schutz zuerst","Füsse. Drei Atemzüge.\nIch bin der Spieler. Ich behalte den Raum.\nFilter zuerst."],
    ["Kreis","Ich öffne nur für klare Hilfe bei:\n[Auftrag]\nUnklares, Drängendes, Theater bleibt draussen."],
    ["Fragen","Wer klar, erkennbar und für diese eine Aufgabe geeignet ist, darf sich zeigen.\nKeine Namenslisten. Kein Befehl aus fremden Systemen."],
    ["Prüfen","Mitte da? Klar oder Nebel? Druck oder Ruhe?\nDrängen, Theater, Sog: sofort schliessen. Kein Auftrag."],
    ["Auftrag","Dein Auftrag ist nur:\n[Auftrag]\nKein Mehr. Kein Bleiben. Der Auftrag endet, wenn er erfüllt ist."],
    ["369",z3("Der Auftrag ist klar gesetzt.","Die Wesenheit trägt nur diesen Auftrag.","Danach geht sie vollständig. Es ist so.")],
    ["Halten","Einen Atem. Nicht ausweiten."],
    ["Entlassen","Der Auftrag ist beendet. Ich danke dir.\nDu bist frei. Löse alle Verbindungen zu mir.\nIch schliesse den Kontakt."],
    ["Feld-Check","Haut. Atem. Füsse. Raum.\nMeine Energie gehört mir. Der Raum gehört mir.\nSo sei es. Erden. Wasser."]
  ]});

  put({id:"fremd",t:"Fremde Wesenheit",s:"Kurz. Hartes Ende",tag:"Feld",steps:[
    ["Vorbereitung","Handy weg. Eigenes Feld zuerst hart.\nKein Auftrag. Nur zeigen oder schliessen."],
    ["Schutz zuerst","Füsse. Drei Atemzüge.\nIch behalte den Raum. Filter zuerst."],
    ["Kreis","Nur klare, erkennbare Wesenheit ohne Täuschung."],
    ["Einladung","Wer bereit und in der Lage ist, sich klar zu zeigen, möge sich melden.\nKein Auftrag. Nur zeigen."],
    ["Prüfen","Mitte da? Klar oder neblig? Druck oder Ruhe?\nDrängen, Theater, Sog: sofort schliessen."],
    ["Ende","Der Kontakt ist beendet. Alle Verbindungen lösen sich.\nDu gehst und bleibst nicht."],
    ["Feld-Check","Der Raum gehört mir. Haut. Atem. Füsse.\nSo sei es. Erden."]
  ]});

  put({id:"ahn",t:"Ahnenkontakt",s:"Ehren und begrenzen",tag:"Feld",need:["Name"],steps:[
    ["Vorbereitung","Name der Ahnenlinie klar. Handy weg.\nEigenes Feld zuerst.\nLast und ungesunde Muster bleiben draussen."],
    ["Ankommen","Füsse. Drei Atemzüge.\nIch ehre die Linie und gehöre mir selbst."],
    ["Kreis","Nur für [Name], klar und stimmig.\nNähe ja. Verschmelzung nein."],
    ["Einladung","[Name], wenn du bereit und willens bist, zeige dich.\nIch möchte verstehen, nicht übernehmen."],
    ["Grenze","Ich ehre dich und die Linie.\nIch gehöre mir selbst.\nUngesunde Muster lasse ich nicht in mein Leben."],
    ["Schluss","Danke. Du kannst in Frieden gehen.\nIch schliesse den Kontakt."],
    ["Feld-Check","Meine Energie gehört mir. Haut. Atem. Füsse.\nSo sei es. Erden."]
  ]});

  put({id:"finst",t:"Festigen und halten",s:"Was wahr ist, bleibt. Altes darf fallen.",tag:"Feld",steps:[
    ["Vorbereitung","Handy weg. Eigenes Feld zuerst.\nKerze optional. Salz. Wasser danach."],
    ["Ankommen","Füsse. Drei Atemzüge.\nIch bin der Spieler. Der Beobachter ist wach."],
    ["Kreis","Ich öffne nur für klare Arbeit.\nDie Kraft darf lösen, klären und verstärken, was bereits im Feld ist."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur: festige das Wahre, lass Altes fallen, dann geh."],
    ["Wort","Was nicht mehr stimmig ist, darf abfallen.\nWas gesetzt und wahr ist, wird gestärkt.\nMein Feld bleibt klar."],
    ["369",z3("Altes löst sich.","Das Feld klärt und verstärkt.","Es ist gesetzt und gehalten. Es ist so.")],
    ["Halten","Einen Atem. Nicht nachbessern."],
    ["Siegel","Gesetzt. Gehalten. Geschlossen."],
    ["Entlassen","Falls Wesenheit da war: Danke. Du gehst. Kontakt zu."],
    ["Feld-Check","Haut. Atem. Füsse. So sei es. Erden."]
  ]});

  put({id:"schaden",t:"Schadenszauber",s:"Vorhanden. Nicht Pflicht.",tag:"Feld",need:["Name"],steps:[
    ["Vorbereitung","Dies ist die Gegenseite. Du musst es nicht tun.\nNur wenn du die Verantwortung voll übernimmst.\nHandy weg. Eigenes Feld zuerst.\nName klar. Foto nur als Anker.\nKein Theater. Keine Wut als Steuer."],
    ["Schutz zuerst","Füsse. Drei Atemzüge.\nIch bin der Spieler. Der Beobachter ist wach.\nIch werde nicht zum Werkzeug."],
    ["Kreis","Nur [Name]. Nur Begrenzung und Rückgabe.\nKein Unbeteiligter. Die Arbeit hat ein Ende."],
    ["Lage","Die Bahn von [Name] wahrnehmen, soweit nötig. Nicht die ganze Biografie."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur: trage Rückgabe und Begrenzung, dann geh vollständig.\nBei Theater oder Sog: sofort schliessen."],
    ["Wort","Was von [Name] als Schaden ausgeht, kehrt zur Quelle.\nDer Zugriff auf mich, mein Haus und meine Leute endet.\nDie Bahn bricht. Der Halt fällt."],
    ["369",z3("Der Schaden kehrt zur Quelle.","Der Zugriff von [Name] fällt ab und findet keinen Halt.","Die Arbeit ist gesetzt und begrenzt. Es ist so.")],
    ["Halten","Einen Atem. Einmal setzen."],
    ["Siegel","Salz oder Siegelzeichen. Nicht aus Wut wiederholen."],
    ["Entlassen","Falls Wesenheit da war: Danke. Du gehst. Kontakt zu."],
    ["Feld-Check","Ich bin nicht [Name]. Haut. Atem. Füsse.\nDer Auftrag endet hier. So sei es. Erden. Wasser."]
  ]});

  for(var j=R.length-1;j>=0;j--) if(R[j].id==="fil") R.splice(j,1);

  if(typeof renderList==="function") renderList();
})();
