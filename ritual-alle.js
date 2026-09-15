(function(){
  function put(r){
    for(var i=R.length-1;i>=0;i--) if(R[i].id===r.id) R.splice(i,1);
    R.push(r);
  }
  function z3(a,b,c){
    return "Tu:\nZähler unten bereit halten. Zwischen den Runden ein Atem. Nicht hetzen.\n\nSprich und zähle:\n3  "+a+"\n6  "+b+"\n9  "+c;
  }

  put({id:"dank",t:"Tägliches Dankesritual",s:"Gesundheit · Liebe · Geld · Schutz",tag:"Alltag",steps:[
    ["Vorbereitung","Tu:\nHandy stumm. Vier Stellen vor dir — Kerzen oder nur Punkte im Feld.\nWasser danach bereitstellen.\n\nSprich:\nIch öffne nur für Dank.\nNicht aus Schuld. Nicht aus Hunger."],
    ["Ankommen","Tu:\nFüsse auf den Boden. Gewicht spüren. Drei Atemzüge, der dritte länger hinaus.\n\nSprich:\nIch bin der Spieler, nicht die Spielfigur.\nDer Beobachter ist wach.\nDie Mitte hält."],
    ["Dank","Tu:\nJedes Thema dreimal. Langsam. Nach jedem Thema ein Atem.\n\nSprich:\nDanke für Gesundheit.\nDanke für Liebe.\nDanke für Geld und Versorgung.\nDanke für Schutz durch das Feld."],
    ["Setzen","Tu:\nNach jedem Es ist so einen Herzschlag warten.\n\nSprich:\nIch bin gesund. Es ist so.\nIch bin geliebt. Es ist so.\nIch bin versorgt. Es ist so.\nIch bin geschützt. Es ist so."],
    ["Siegel","Tu:\nPrise Salz auf jede Kerze — oder dieselbe Bewegung innen.\n\nSprich:\nDas Feld hat es.\nIch halte nichts fest."],
    ["Feld-Check","Tu:\nHaut, Atem, Füsse, Raum. Wasser.\n\nSprich:\nDanke für alles.\nDanke für alles.\nDanke für alles.\nSo sei es."]
  ]});

  put({id:"stopp",t:"Schaden stoppen",s:"Angriff endet. Feld zu.",tag:"Schutz",need:["Name"],steps:[
    ["Vorbereitung","Tu:\nName von [Name] einmal klar. Handy weg. Salz und Wasser bereit.\n\nSprich:\nIch schliesse mein Feld hart.\nNichts Fremdes hat Zutritt.\nNur Stopp. Nur Distanz."],
    ["Schutz zuerst","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler. Der Beobachter ist wach.\nMein Feld ist geschlossen."],
    ["Kreis","Tu:\nRaum halten. Nicht die Geschichte aufmachen.\n\nSprich:\nIch öffne nur für den Stopp gegen den Zugriff von [Name].\nKein Nachsatz. Kein Unbeteiligter."],
    ["Lage","Tu:\nDie Bahn von [Name] soweit wahrnehmen, wie der Stopp braucht. Bei Zug zurück in die Füsse.\n\nSprich:\nIch bleibe in meiner Haut.\nIch werde nicht [Name]."],
    ["Wesenheit","Tu:\nOhne: weiter. Mit: nur klare Präsenz.\n\nSprich bei Mit:\nTrage den Stopp.\nDann geh vollständig."],
    ["Wort","Tu:\nLangsam, einmal vollständig.\n\nSprich:\nJeder Angriff von [Name] auf mich, mein Haus und meine Leute stoppt jetzt.\nDie Bahn ist zu.\nDer Zugriff fällt ab und findet keinen Halt."],
    ["369",z3("Der Schaden stoppt.","Der Zugriff fällt ab und findet keinen Halt.","Ich bin frei und geschützt. Es ist so.")],
    ["Halten","Tu:\nEinen Atem lang stehen. Nicht nachschieben.\n\nSprich:\nGesetzt. Abgegeben."],
    ["Siegel","Tu:\nSalz auf den Boden oder Hand flach auf die Erde.\n\nSprich:\nVersiegelt."],
    ["Entlassen","Tu:\nNur wenn jemand da war.\n\nSprich:\nDer Auftrag ist beendet."],
    ["Feld-Check","Tu:\nHaut. Atem. Füsse. Raum. Wasser.\n\nSprich:\nIch bin nicht [Name].\nMeine Energie gehört mir.\nSo sei es."]
  ]});

  put({id:"schutz",t:"Schutz selbst",s:"Feld schliessen",tag:"Schutz",steps:[
    ["Vorbereitung","Tu:\nHandy weg. Kerze und Salz wenn da. Wasser danach.\n\nSprich:\nIch schliesse mein Feld hart.\nNicht aus Angst. Aus Stand."],
    ["Ankommen","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler, nicht die Spielfigur.\nDer Beobachter ist wach."],
    ["Kreis","Tu:\nRaum halten.\n\nSprich:\nNur Schutz.\nUnklares, Ziehendes, Fremdes bleibt draussen."],
    ["Wesenheit","Tu:\nOhne: weiter. Mit: nur halten, dann gehen.\n\nSprich bei Mit:\nHalte den Schutz.\nDann geh."],
    ["Wort","Tu:\nEinmal klar.\n\nSprich:\nIch schliesse mein Feld jetzt.\nHaut ist Grenze. Atem ist Mitte. Stand ist Siegel.\nJede fremde Energie prallt ab oder geht in die Erde.\nMeine Energie bleibt bei mir."],
    ["369",z3("Mein Schutz ist aktiv und stark.","Alles Fremde prallt ab und findet keinen Halt.","Ich bin klar, geschützt und bei mir. Es ist so.")],
    ["Halten","Tu:\nGrenze spüren. Nicht prüfen ob jemand zieht.\n\nSprich:\nDie Grenze hält."],
    ["Siegel","Tu:\nStand fest. Schultern fallen lassen.\n\nSprich:\nVersiegelt."],
    ["Entlassen","Tu:\nNur wenn jemand da war.\n\nSprich:\nDer Auftrag ist beendet."],
    ["Feld-Check","Tu:\nHaut. Atem. Füsse. Raum.\n\nSprich:\nSo sei es."]
  ]});

  put({id:"schutz2",t:"Schutz für eine andere Person",s:"Vor Arbeit oder Tag",tag:"Schutz",need:["Name"],steps:[
    ["Vorbereitung","Tu:\nName von [Name]. Foto anschauen, dann umdrehen. Handy weg.\n\nSprich:\nIch schliesse mein Feld.\nIch gebe Schutz, nicht mich."],
    ["Schutz zuerst","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bleibe ich.\n[Name] bleibt [Name]."],
    ["Kreis","Tu:\nNur diesen Auftrag halten.\n\nSprich:\nNur Schutz um [Name].\nKein Auftrag darüber hinaus."],
    ["Ausrichten","Tu:\n[Name] wahrnehmen, ohne [Name] zu werden. Bei Sog zurück in die Füsse.\n\nSprich:\nWärme ja. Sog nein."],
    ["Wesenheit","Tu:\nOhne: weiter. Mit: tragen lassen, dann entlassen.\n\nSprich bei Mit:\nTrage den Schutz zu [Name].\nDann geh vollständig."],
    ["Wort","Tu:\nEinmal.\n\nSprich:\nDas Feld von [Name] wird klar, geschlossen und gehalten.\nDie Energie bleibt bei [Name].\nZiehendes prallt ab."],
    ["369",z3("Die Energie von [Name] ist geschützt.","Das Feld von [Name] bleibt klar und geschlossen.","[Name] ist in der Kraft. Es ist so.")],
    ["Halten","Tu:\nEinen Atem. Du bleibst hier.\n\nSprich:\nDer Schutz geht. Ich bleibe."],
    ["Siegel","Tu:\nFoto zugedeckt lassen.\n\nSprich:\nGegeben. Nicht nachholen."],
    ["Entlassen","Tu:\nNur wenn jemand da war.\n\nSprich:\nDer Auftrag ist beendet."],
    ["Feld-Check","Tu:\nHaut. Atem. Füsse.\n\nSprich:\nIch bin nicht [Name].\nMeine Energie gehört mir.\nSo sei es."]
  ]});

  put({id:"heil",t:"Heilung",s:"Ergänzung zur Medizin",tag:"Energie",need:["Name"],steps:[
    ["Vorbereitung","Tu:\nName klar. Arzt bleibt parallel. Handy weg.\n\nSprich:\nIch schliesse mein Feld.\nIch ersetze nichts. Ich erzwinge nichts."],
    ["Schutz zuerst","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler. Der Beobachter ist wach."],
    ["Kreis","Tu:\nRaum geben, keinen Druck.\n\nSprich:\nNur reine Heilung für [Name].\nZum höchsten Wohl."],
    ["Ausrichten","Tu:\nKörper von [Name] wahrnehmen, ohne hineinzustiegen.\n\nSprich:\nRaum ja. Eindringen nein."],
    ["Wesenheit","Tu:\nOhne: weiter.\n\nSprich bei Mit:\nTrage reine Heilung.\nDann geh."],
    ["Wort","Tu:\nEinmal, ruhig.\n\nSprich:\nDie Wunde von [Name] findet ihre natürliche Heilung.\nWas die Heilung stört, löst sich.\nDer Körper erinnert sich und schliesst sauber."],
    ["369",z3("Die Wunde von [Name] heilt vollständig.","Alles Störende löst sich.","Die Heilung ist im Gange. Es ist so.")],
    ["Halten","Tu:\nWenn es sitzt, nicht nachholen.\n\nSprich:\nÜbergeben."],
    ["Siegel","Tu:\nLoslassen.\n\nSprich:\nDem Feld."],
    ["Entlassen","Tu:\nNur wenn jemand da war.\n\nSprich:\nDer Auftrag ist beendet."],
    ["Feld-Check","Tu:\nHaut. Atem. Füsse.\n\nSprich:\nIch bin nicht [Name].\nSo sei es."]
  ]});

  put({id:"zur",t:"Energie zurückholen",s:"Nach Kontakt",tag:"Energie",steps:[
    ["Vorbereitung","Tu:\nWasser bereitstellen. Handy weg.\n\nSprich:\nIch schliesse mein Feld.\nWas meins ist, kommt zurück."],
    ["Ankommen","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler. Der Beobachter ist wach."],
    ["Kreis","Tu:\nKein Krieg aufmachen.\n\nSprich:\nNur Rückholung. Kein Nachsetzen."],
    ["Wesenheit","Tu:\nOhne: weiter.\n\nSprich bei Mit:\nHole zurück was meins ist.\nDann geh."],
    ["Wort","Tu:\nEinmal.\n\nSprich:\nAlles, was von mir genommen wurde oder an mir hängt, kehrt jetzt rein zu mir zurück.\nFremdes löst sich und geht in die Erde.\nIch bin ganz in meiner Haut."],
    ["369",z3("Meine Energie kehrt zurück.","Fremdes löst sich.","Ich bin ganz bei mir. Es ist so.")],
    ["Halten","Tu:\nSpüren, nicht suchen.\n\nSprich:\nBei mir."],
    ["Siegel","Tu:\nWasser trinken.\n\nSprich:\nZurück. Versiegelt."],
    ["Entlassen","Tu:\nNur wenn jemand da war.\n\nSprich:\nDer Auftrag ist beendet."],
    ["Feld-Check","Tu:\nHaut. Atem. Füsse. Alltag.\n\nSprich:\nSo sei es."]
  ]});

  put({id:"karma",t:"Karma-Ausgleich",s:"Nicht Rache",tag:"Energie",steps:[
    ["Vorbereitung","Tu:\nNamen oder Dinge hinlegen. Feuer oder Sonne optional. Ritualbuch darf daneben.\n\nSprich:\nIch schliesse mein Feld.\nKein Hass. Nur Ausgleich."],
    ["Schutz zuerst","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler. Der Beobachter ist wach.\nIch werde nicht zum dunklen Spieler."],
    ["Kreis","Tu:\nNur diesen Auftrag.\n\nSprich:\nNur Rückgabe. Kein Krieg."],
    ["Übergabe","Tu:\nHinlegen. Hände weg. Nicht zerlegen.\n\nSprich:\nIch gebe es dem Feld."],
    ["Wesenheit","Tu:\nOhne: weiter.\n\nSprich bei Mit:\nTrage den Ausgleich rein.\nDann geh."],
    ["Wort","Tu:\nEinmal.\n\nSprich:\nWas mir genommen oder aufgeladen wurde, kehrt in stimmiger Form zurück.\nDie Last darf gehen.\nIch werde nicht zum Werkzeug der Rache."],
    ["369",z3("Der Ausgleich geschieht.","Die Energie kehrt rein zurück.","Es ist vollendet. Ich bin frei. Es ist so.")],
    ["Halten","Tu:\nNicht nachkontrollieren.\n\nSprich:\nAbgegeben."],
    ["Siegel","Tu:\nDinge nicht zurücknehmen.\n\nSprich:\nVersiegelt. Dem Feld."],
    ["Entlassen","Tu:\nNur wenn jemand da war.\n\nSprich:\nDer Auftrag ist beendet."],
    ["Feld-Check","Tu:\nHaut. Atem. Füsse.\n\nSprich:\nSo sei es."]
  ]});

  put({id:"liebe",t:"Liebesritual",s:"Anziehung ohne Zwang",tag:"Liebe",need:["Name"],steps:[
    ["Vorbereitung","Tu:\nName. Foto anschauen, dann weglegen. Handy weg.\n\nSprich:\nIch schliesse mein Feld.\nJeder bleibt frei."],
    ["Ankommen","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler. Der Beobachter ist wach."],
    ["Kreis","Tu:\nKein Kleben aufmachen.\n\nSprich:\nNur stimmige Nähe zwischen mir und [Name].\nKein Brechen des Willens."],
    ["Ausrichten","Tu:\n[Name] wahrnehmen. Bei Sog zurück.\n\nSprich:\nWärme ja. Verschmelzen nein."],
    ["Wesenheit","Tu:\nOhne: weiter.\n\nSprich bei Mit:\nTrage stimmige Nähe ohne Zwang.\nDann geh."],
    ["Wort","Tu:\nEinmal.\n\nSprich:\nZwischen mir und [Name] darf sich stimmige Nähe zeigen.\nWärme. Kontakt. Ehrlichkeit.\nNur wenn es für beide wahr ist."],
    ["369",z3("Die Anziehung ist klar.","Der Weg öffnet sich leicht.","Liebe findet uns, wenn sie stimmig ist. Es ist so.")],
    ["Halten","Tu:\nEinen Atem. Nicht nachlaufen.\n\nSprich:\nLosgelassen."],
    ["Siegel","Tu:\nFoto bleibt weg.\n\nSprich:\nGegeben."],
    ["Entlassen","Tu:\nNur wenn jemand da war.\n\nSprich:\nDer Auftrag ist beendet."],
    ["Feld-Check","Tu:\nHaut. Atem. Füsse.\n\nSprich:\nIch bin nicht [Name].\nSo sei es."]
  ]});

  put({id:"liebezw",t:"Liebesritual mit Zwang",s:"Bindung. Du trägst die Verantwortung.",tag:"Liebe",need:["Name"],steps:[
    ["Vorbereitung","Tu:\nName klar. Foto nur Anker, dann umdrehen. Feld zuerst.\n\nSprich:\nIch schliesse mein Feld hart.\nIch weiss, was das ist. Kein Spiel.\nDie Arbeit hat ein Ende."],
    ["Schutz zuerst","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler.\nIch werde nicht zum Werkzeug."],
    ["Kreis","Tu:\nMass halten.\n\nSprich:\nNur [Name]. Nur das gesetzte Mass.\nKein Unbeteiligter."],
    ["Ausrichten","Tu:\n[Name] wahrnehmen, ohne [Name] zu werden.\n\nSprich:\nIch bleibe in meiner Haut."],
    ["Wesenheit","Tu:\nBei Sog sofort schliessen.\n\nSprich bei Mit:\nTrage die gesetzte Bindung.\nDann geh vollständig."],
    ["Wort","Tu:\nEinmal setzen.\n\nSprich:\n[Name] denkt an mich.\n[Name] fühlt Zug nach mir.\nDer Wille richtet sich auf Kontakt und Nähe zu mir.\nDie Bahn bleibt offen, bis ich sie schliesse."],
    ["369",z3("[Name] kommt zu mir.","Der Wille von [Name] hält bei mir.","Die Bindung ist gesetzt. Es ist so.")],
    ["Halten","Tu:\nNicht aus Unruhe wiederholen.\n\nSprich:\nEinmal gesetzt."],
    ["Siegel","Tu:\nSalz oder Siegelzeichen.\n\nSprich:\nGeschlossen."],
    ["Entlassen","Tu:\nNur wenn jemand da war.\n\nSprich:\nDer Auftrag ist beendet."],
    ["Feld-Check","Tu:\nHaut. Atem. Füsse. Wasser.\n\nSprich:\nIch bin nicht [Name].\nMeine Energie gehört mir.\nSo sei es."]
  ]});

  put({id:"anz",t:"Anziehung und Kontakt",s:"Nur wenn stimmig",tag:"Liebe",need:["Name"],steps:[
    ["Vorbereitung","Tu:\nFoto kurz als Anker, dann weg. Handy weg.\n\nSprich:\nIch schliesse mein Feld.\nKein Festhalten."],
    ["Ankommen","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler."],
    ["Kreis","Tu:\nKurz halten.\n\nSprich:\nNur stimmiger Kontakt."],
    ["Wesenheit","Tu:\nOhne: weiter.\n\nSprich bei Mit:\nÖffne den Weg.\nDann geh."],
    ["Wort","Tu:\nEinmal.\n\nSprich:\n[Name] fühlt die Anziehung.\nKontakt findet den Weg, wenn er stimmig ist."],
    ["369",z3("Die Anziehung ist da.","Der Kontakt findet den Weg.","Es ist so.")],
    ["Halten","Tu:\nSofort zurück in den eigenen Körper.\n\nSprich:\nIch bin zurück."],
    ["Siegel","Tu:\nFoto bleibt weg.\n\nSprich:\nAbgegeben."],
    ["Entlassen","Tu:\nNur wenn jemand da war.\n\nSprich:\nDer Auftrag ist beendet."],
    ["Feld-Check","Tu:\nHaut. Atem. Füsse.\n\nSprich:\nSo sei es."]
  ]});

  put({id:"trenn",t:"Trennung — selbst",s:"Nur der Faden",tag:"Trennung",need:["Name"],steps:[
    ["Vorbereitung","Tu:\nName klar. Nicht die Biografie aufmachen. Handy weg.\n\nSprich:\nIch schliesse mein Feld.\nNur der Faden."],
    ["Ankommen","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler.\nIch bleibe in meiner Mitte."],
    ["Kreis","Tu:\nKein Theater.\n\nSprich:\nNur klare Trennung zwischen mir und [Name]."],
    ["Lage","Tu:\nDen Faden sehen. Nicht die Geschichte erzählen.\n\nSprich:\nNur dieser Faden."],
    ["Wesenheit","Tu:\nNur wenn der Faden allein nicht reisst.\n\nSprich bei Mit:\nLöse den Faden.\nDann geh."],
    ["Wort","Tu:\nEinmal.\n\nSprich:\nDie Verbindung zwischen mir und [Name] löst sich.\nUnstimmige Fäden fallen ab und kehren zum Ursprung.\nWas stimmig bleiben darf, bleibt. Was zieht, geht."],
    ["369",z3("Die Verbindung löst sich.","Die Fäden fallen ab und kehren zum Ursprung.","Die Trennung ist vollzogen. Es ist so.")],
    ["Halten","Tu:\nNicht nachschneiden.\n\nSprich:\nGetrennt."],
    ["Siegel","Tu:\nStand fest.\n\nSprich:\nVersiegelt."],
    ["Entlassen","Tu:\nNur wenn jemand da war.\n\nSprich:\nDer Auftrag ist beendet."],
    ["Feld-Check","Tu:\nHaut. Atem. Füsse.\n\nSprich:\nIch bin nicht [Name].\nMeine Energie gehört mir.\nSo sei es."]
  ]});

  put({id:"trenn2",t:"Trennung zweier anderer",s:"Nur der Faden",tag:"Trennung",need:["A","B"],steps:[
    ["Vorbereitung","Tu:\nNamen [A] und [B] klar. Handy weg.\n\nSprich:\nIch schliesse mein Feld.\nIch schneide den Faden, nicht ihr Leben."],
    ["Schutz zuerst","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler.\nIch bleibe aussen."],
    ["Kreis","Tu:\nKein Hass aufmachen.\n\nSprich:\nNur der unstimmige Faden zwischen [A] und [B]."],
    ["Lage","Tu:\nDen Faden zwischen ihnen sehen, nicht den zu dir.\n\nSprich:\nIhre Wege gehören ihnen."],
    ["Wesenheit","Tu:\nOhne: weiter.\n\nSprich bei Mit:\nLöse den Faden zwischen [A] und [B].\nDann geh."],
    ["Wort","Tu:\nEinmal.\n\nSprich:\nDie unstimmige Verbindung zwischen [A] und [B] löst sich.\nJeder gehört wieder sich selbst."],
    ["369",z3("Die Verbindung zwischen [A] und [B] löst sich.","Die Fäden fallen ab.","Sie sind voneinander frei. Es ist so.")],
    ["Halten","Tu:\nNicht nacharbeiten.\n\nSprich:\nGetrennt."],
    ["Siegel","Tu:\nLoslassen.\n\nSprich:\nAbgegeben."],
    ["Entlassen","Tu:\nNur wenn jemand da war.\n\nSprich:\nDer Auftrag ist beendet."],
    ["Feld-Check","Tu:\nHaut. Atem. Füsse.\n\nSprich:\nIch bin nicht [A]. Ich bin nicht [B].\nSo sei es."]
  ]});

  put({id:"wesen",t:"Kontakt Wesenheit",s:"Für Aufgabe X. Fragen, begrenzen, entlassen",tag:"Feld",need:["Auftrag"],steps:[
    ["Vorbereitung","Tu:\nAufgabe in einem Satz aufschreiben. Handy weg.\n\nSprich:\nIch schliesse mein Feld hart.\nNur wenn nötig."],
    ["Schutz zuerst","Tu:\nFüsse. Drei Atemzüge. Filter halten.\n\nSprich:\nIch behalte den Raum."],
    ["Kreis","Tu:\nNur diese Aufgabe.\n\nSprich:\nNur klare Hilfe bei:\n[Auftrag]\nTheater, Sog, Nebel bleiben draussen."],
    ["Fragen","Tu:\nWarten. Nicht listen.\n\nSprich:\nWer klar, erkennbar und für diese eine Aufgabe geeignet ist, darf sich zeigen."],
    ["Prüfen","Tu:\nMitte prüfen. Bei Druck sofort schliessen.\n\nSprich:\nKlar oder Nebel? Druck oder Ruhe?"],
    ["Auftrag","Tu:\nNur wenn klar.\n\nSprich:\nDein Auftrag ist nur:\n[Auftrag]\nKein Mehr. Kein Bleiben. Danach gehst du vollständig."],
    ["369",z3("Der Auftrag ist klar gesetzt.","Die Wesenheit trägt nur diesen Auftrag.","Danach geht sie vollständig. Es ist so.")],
    ["Halten","Tu:\nNicht ausweiten.\n\nSprich:\nNur das."],
    ["Entlassen","Tu:\nImmer schliessen.\n\nSprich:\nDer Auftrag ist beendet.\nIch danke dir.\nDu bist frei.\nDu bleibst nicht."],
    ["Feld-Check","Tu:\nHaut. Atem. Füsse. Raum. Wasser.\n\nSprich:\nDer Raum gehört mir.\nSo sei es."]
  ]});

  put({id:"fremd",t:"Fremde Wesenheit",s:"Kurz. Hartes Ende",tag:"Feld",steps:[
    ["Vorbereitung","Tu:\nKein Auftrag vorbereiten. Handy weg.\n\nSprich:\nIch schliesse mein Feld hart."],
    ["Schutz zuerst","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch behalte den Raum."],
    ["Kreis","Tu:\nFilter halten.\n\nSprich:\nNur klare Präsenz ohne Täuschung."],
    ["Einladung","Tu:\nNur zeigen lassen. Nicht anfreunden.\n\nSprich:\nWer sich klar zeigen kann, darf sich zeigen.\nKein Auftrag."],
    ["Prüfen","Tu:\nBei Sog sofort zu.\n\nSprich:\nMitte da? Klar oder Nebel?"],
    ["Ende","Tu:\nSchliessen, nicht diskutieren.\n\nSprich:\nDer Kontakt ist beendet.\nAlle Verbindungen lösen sich.\nDu gehst und bleibst nicht."],
    ["Feld-Check","Tu:\nHaut. Atem. Füsse.\n\nSprich:\nDer Raum gehört mir.\nSo sei es."]
  ]});

  put({id:"ahn",t:"Ahnenkontakt",s:"Ehren und begrenzen",tag:"Feld",need:["Name"],steps:[
    ["Vorbereitung","Tu:\nName der Linie. Handy weg.\n\nSprich:\nIch schliesse mein Feld.\nLast bleibt draussen."],
    ["Ankommen","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch ehre die Linie und gehöre mir selbst."],
    ["Kreis","Tu:\nNähe ohne Verschmelzung.\n\nSprich:\nNur für [Name], klar und stimmig."],
    ["Einladung","Tu:\nWarten. Nicht ziehen.\n\nSprich:\n[Name], wenn du bereit bist, zeige dich.\nIch will verstehen, nicht tragen was nicht meins ist."],
    ["Grenze","Tu:\nBei Sog schliessen.\n\nSprich:\nIch ehre dich.\nIch gehöre mir selbst.\nUngesunde Muster bleiben draussen."],
    ["Schluss","Tu:\nVerneigen oder Hand aufs Herz. Dann zu.\n\nSprich:\nDanke. Du kannst in Frieden gehen.\nIch schliesse den Kontakt."],
    ["Feld-Check","Tu:\nHaut. Atem. Füsse.\n\nSprich:\nMeine Energie gehört mir.\nSo sei es."]
  ]});

  put({id:"finst",t:"Festigen und halten",s:"Was wahr ist, bleibt. Altes darf fallen.",tag:"Feld",steps:[
    ["Vorbereitung","Tu:\nHandy weg. Kerze und Salz wenn da.\n\nSprich:\nIch schliesse mein Feld.\nNicht neu setzen. Halten was wahr ist."],
    ["Ankommen","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler. Der Beobachter ist wach."],
    ["Kreis","Tu:\nKein Drama um Altes.\n\nSprich:\nNur klären und festigen, was schon im Feld ist."],
    ["Wesenheit","Tu:\nOhne: weiter.\n\nSprich bei Mit:\nFestige das Wahre. Lass Altes fallen.\nDann geh."],
    ["Wort","Tu:\nEinmal.\n\nSprich:\nWas nicht mehr stimmig ist, fällt ab.\nWas gesetzt und wahr ist, wird gehalten.\nMein Feld bleibt klar."],
    ["369",z3("Altes löst sich.","Das Feld klärt und verstärkt.","Es ist gesetzt und gehalten. Es ist so.")],
    ["Halten","Tu:\nNicht nachbessern.\n\nSprich:\nGehalten."],
    ["Siegel","Tu:\nSalz oder Stand.\n\nSprich:\nGesetzt. Geschlossen."],
    ["Entlassen","Tu:\nNur wenn jemand da war.\n\nSprich:\nDer Auftrag ist beendet."],
    ["Feld-Check","Tu:\nHaut. Atem. Füsse.\n\nSprich:\nSo sei es."]
  ]});

  put({id:"schaden",t:"Schadenszauber",s:"Vorhanden. Nicht Pflicht.",tag:"Feld",need:["Name"],steps:[
    ["Vorbereitung","Tu:\nNur wenn du die Verantwortung übernimmst. Sonst zurück. Name klar. Foto Anker, dann umdrehen.\n\nSprich:\nIch schliesse mein Feld hart.\nWut steuert nicht.\nNur [Name]. Nur Begrenzung und Rückgabe. Ein Ende."],
    ["Schutz zuerst","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler.\nIch werde nicht zum Werkzeug."],
    ["Kreis","Tu:\nMass halten.\n\nSprich:\nNur [Name]. Kein Unbeteiligter. Die Arbeit hat ein Ende."],
    ["Lage","Tu:\nBahn soweit nötig. Nicht die Biografie.\n\nSprich:\nNur die Bahn."],
    ["Wesenheit","Tu:\nBei Theater sofort zu.\n\nSprich bei Mit:\nTrage Rückgabe und Begrenzung.\nDann geh vollständig."],
    ["Wort","Tu:\nEinmal setzen.\n\nSprich:\nWas von [Name] als Schaden ausgeht, kehrt zur Quelle.\nDer Zugriff auf mich, mein Haus und meine Leute endet.\nDie Bahn bricht. Der Halt fällt."],
    ["369",z3("Der Schaden kehrt zur Quelle.","Der Zugriff von [Name] fällt ab und findet keinen Halt.","Die Arbeit ist gesetzt und begrenzt. Es ist so.")],
    ["Halten","Tu:\nNicht aus Wut wiederholen.\n\nSprich:\nEinmal gesetzt."],
    ["Siegel","Tu:\nSalz oder Siegelzeichen.\n\nSprich:\nGeschlossen."],
    ["Entlassen","Tu:\nNur wenn jemand da war.\n\nSprich:\nDer Auftrag ist beendet."],
    ["Feld-Check","Tu:\nHaut. Atem. Füsse. Wasser.\n\nSprich:\nIch bin nicht [Name].\nDer Auftrag endet hier.\nSo sei es."]
  ]});

  for(var j=R.length-1;j>=0;j--) if(R[j].id==="fil") R.splice(j,1);
  if(typeof renderList==="function") renderList();
})();
