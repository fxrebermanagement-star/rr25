/* rituals-v2.js — eine saubere Datenquelle für alle Rituale.
   Wird vom ritual-runner-v2.js gelesen. Kein Logik-Code hier, nur Texte.
   Reihenfolge im Ablauf folgt dem Buch: Timing -> (Hard: Diagnose -> Ethik-Gate)
   -> Rahmen -> Absicht -> (nur bei Identifikation: Ich bin [Name] und sofort zurück)
   -> 369 (3 stehen / 6 tragen / 9 siegeln) -> So sei es (Siegel) -> Rückkehr -> optional Es ist so -> Echo.
   Abbruch in jedem Schritt möglich (Runner). */
(function(){
  var CATS=['Schutz','Energie','Liebe','Trennung','Person X','Feld'];
  var L=[
  /* ---------- ALLTAG (auf der Startseite angeheftet) ---------- */
  {id:'dank',tone:'soft',t:'Tägliches Dankesritual',s:'Gesundheit und Glück · Liebe · Geld · Schutz',cat:'Alltag',hard:false,pin:true,skipTiming:true,flow:[
    ['Vorbereitung','Tu:|Vier Kerzen. Salz bereit. Glocke bereit. Wasser danach.||Sprich:|Die vier stehen:|Gesundheit und Glück. Liebe. Geld. Schutz.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin hier. Ich bin klar. Ich trage.'],
    ['Danke','Sprich je dreimal Danke:|Danke für Gesundheit und Glück.|Danke für Liebe.|Danke für Geld und Versorgung.|Danke für Schutz durch das Feld.||Tu:|Glocke dreimal.'],
    ['Ich bin','Sprich dreimal, noch ohne Enter:|Ich bin gesund und glücklich.|Ich bin geliebt.|Ich bin versorgt.|Ich bin geschützt.'],
    ['Salz','Tu:|Dreimal Salz auf jede Kerze.||Sprich:|Versiegelt.'],
    ['So sei es','Sprich dreimal:|Danke für alles.||Tu:|Glocke dreimal. Das ist So sei es.'],
    ['Rückkehr','Sprich:|Ich bin hier. Ich bin ganz bei mir.|Füsse. Atem. Raum.'],
    ['Schluss','Tu:|Wasser. Alltag.']
  ]},

  /* ---------- SCHUTZ ---------- */
  {id:'schutz',tone:'soft',t:'Schutz selbst',s:'Feld schliessen. Soft.',cat:'Schutz',hard:false,flow:[
    ['Vorbereitung','Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur Schutz. Nur ich.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.'],
    ['Absicht','Sprich:|Ich schütze mich jetzt vollständig.|Mein Feld ist geschlossen, klar und stabil.|Alles Fremde prallt ab oder geht in die Erde. Meine Energie gehört mir.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Mein Schutz ist stark.|Sechs: Alles Fremde prallt ab.|Neun: Ich bin klar und bei mir.'],
    ['So sei es','Tu:|Hand aufs Herz.||Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin ganz bei mir. Meine Energie gehört nur mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag. Nicht nachkontrollieren.']
  ]},
  {id:'schutz2',tone:'soft',t:'Schutz für eine andere Person',s:'Feld von Person X. Soft.',cat:'Schutz',hard:false,need:['Name'],flow:[
    ['Vorbereitung','Name oben. Foto nur als Anker, dann umdrehen. Sonst reicht der Name.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur Schutz für [Name]. Kein Mehr.|Ich bleibe ich. [Name] bleibt [Name].'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.|Ich richte mich auf [Name] aus, ohne mich zu verlieren.'],
    ['Feld','Tu:|Grenze um dich.||Sprich:|Ich schliesse mein Feld. Meine Energie gehört mir.|Wärme ja. Verschmelzen nein.'],
    ['Absicht','Sprich:|Das Feld von [Name] wird klar und geschützt.|Die Energie bleibt bei [Name]. Alles Ziehende prallt ab.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Das Feld von [Name] ist geschützt.|Sechs: Es bleibt klar und geschlossen.|Neun: [Name] ist in der Kraft.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin nicht [Name]. Ich kehre vollständig in mich zurück.|Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag. Nicht nachkontrollieren.']
  ]},
  {id:'stopp',tone:'soft',t:'Schaden stoppen',s:'Angriff endet. Feld zu. Soft.',cat:'Schutz',hard:false,need:['Name'],flow:[
    ['Vorbereitung','Name oben.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur Stopp. Nur Distanz. Nur [Name]. Kein Nachsetzen.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.|Ich bleibe ich. [Name] bleibt [Name].'],
    ['Feld','Tu:|Grenze um dich.||Sprich:|Ich schliesse mein Feld hart. Nichts Fremdes hat Zutritt.'],
    ['Absicht','Sprich:|Jeder Angriff von [Name] auf mich stoppt jetzt.|Die Bahn ist zu. Ohne Hass. Ohne mich zu verlieren.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Der Schaden stoppt.|Sechs: Der Zugriff fällt ab.|Neun: Ich bin frei und geschützt.'],
    ['So sei es','Tu:|Hand aufs Herz.||Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin nicht [Name]. Ich kehre vollständig zurück.|Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag. Nicht nachkontrollieren.']
  ]},
  {id:'weg',tone:'soft',t:'Schutz unterwegs',s:'Kurz. Soft.',cat:'Schutz',hard:false,skipTiming:true,flow:[
    ['Standort','Tu:|Füsse. Ein Atem.||Sprich:|Ich bin hier.'],
    ['Feld','Sprich:|Ich schliesse mein Feld. Ich bin geschützt unterwegs.'],
    ['369','Kurz:|Drei: Feld steht.|Sechs: Fremdes prallt ab.|Neun: Ich bin bei mir.'],
    ['So sei es','Sprich:|Versiegelt. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin bei mir. Meine Energie gehört mir. Weitergehen.']
  ]},
  {id:'kreis',tone:'soft',t:'Täglicher Schutzkreis',s:'Kurz, jeden Tag. Soft.',cat:'Schutz',hard:false,skipTiming:true,flow:[
    ['Standort','Tu:|Füsse. Ein Atem.||Sprich:|Ich bin hier.'],
    ['Kreis','Tu:|Einmal um dich zeigen.||Sprich:|Ich ziehe meinen Kreis. Nichts Fremdes hat Zutritt.|Meine Energie gehört mir.'],
    ['369','Kurz:|Drei: Der Kreis steht.|Sechs: Fremdes prallt ab.|Neun: Ich bin bei mir.'],
    ['So sei es','Sprich:|Versiegelt. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin bei mir. Ich gehe klar in den Tag.']
  ]},
  {id:'raum',tone:'soft',t:'Raum reinigen',s:'Ort klären. Soft.',cat:'Schutz',hard:false,flow:[
    ['Vorbereitung','Tu:|Fenster kurz auf. Eine Kerze oder Rauch. Salz und Wasser bereit.||Sprich:|Nur dieser Raum. Nur klar.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.'],
    ['Reinigen','Tu:|Durch den Raum gehen, Ecken zuerst.||Sprich:|Alles Schwere und Fremde löst sich und geht.|Dieser Raum wird klar, ruhig und rein.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Der Raum wird klar.|Sechs: Alles Fremde geht.|Neun: Der Raum ist rein und ruhig.'],
    ['So sei es','Tu:|Etwas Salz an die Schwelle.||Sprich:|Versiegelt. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin ganz bei mir. Der Raum gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Tu:|Wasser weg. Lüften. Alltag.']
  ]},

  /* ---------- ENERGIE ---------- */
  {id:'heil',tone:'soft',t:'Heilung',s:'Ergänzung zur Medizin. Soft.',cat:'Energie',hard:false,need:['Name'],flow:[
    ['Vorbereitung','Name oben.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Heilung für [Name]. Arzt bleibt parallel. Ich bleibe ich.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.'],
    ['Rahmen','Sprich:|Ich öffne nur für reine, stimmige Heilung.'],
    ['Absicht','Sprich:|Die Wunde von [Name] findet natürliche, vollständige Heilung.|Alles, was die Heilung behindert, löst sich. Zum höchsten Wohl.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Die Heilung sitzt.|Sechs: Alles Störende löst sich.|Neun: Die Heilung ist im Gange.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin nicht [Name]. Ich kehre vollständig zurück.|Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag. Nicht nachfragen.']
  ]},
  {id:'karma',tone:'soft',t:'Karma-Ausgleich',s:'Nicht Rache. Soft.',cat:'Energie',hard:false,need:['Name'],needOpt:true,flow:[
    ['Vorbereitung','Name optional oben.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Ausgleich. Nicht Rache. Ohne Hass. Ich bleibe ich.'],
    ['Schutz','Tu:|Grenze um dich.||Sprich:|Ich schliesse zuerst mein eigenes Feld.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.'],
    ['Absicht','Sprich:|Was mir genommen oder aufgeladen wurde, kehrt in stimmiger Form zurück.|Der Ausgleich geschieht ohne Hass. Die Last darf gehen.|Ich schaue nicht auf den Fall des anderen.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Der Ausgleich geschieht.|Sechs: Die Energie kehrt rein zurück.|Neun: Es ist vollendet.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin ganz bei mir. Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag. Nicht nachkontrollieren.']
  ]},
  {id:'zur',tone:'soft',t:'Energie zurückholen',s:'Nach Kontakt. Nur holen. Soft.',cat:'Energie',hard:false,need:['Name'],needOpt:true,flow:[
    ['Vorbereitung','Name oben, wenn der Kontakt eine Person war. Sonst leer lassen.||Tu:|Eine Kerze am Platz. Wasser danach.||Sprich:|Nur zurück. Nichts rufen.|Was mein ist, kommt. Was nicht mein ist, geht.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach. Ich bin in mir.'],
    ['Feld','Tu:|Grenze um dich.||Sprich:|Ich schliesse mein Feld. Meine Energie gehört mir.'],
    ['Absicht','Sprich:|Alles, was von mir genommen wurde oder an mir hängt, kehrt jetzt rein und vollständig zu mir zurück.|Fremde Energie löst sich und geht. Ich hole nicht nach. Ich empfange.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Die Energie kehrt rein zurück.|Sechs: Fremdes löst sich und geht.|Neun: Ich bin vollständig bei mir.'],
    ['So sei es','Tu:|Hand aufs Herz.||Sprich:|Versiegelt. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin zurück in mir. Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Körper. Alltag.']
  ]},
  {id:'segen',tone:'soft',t:'Segen',s:'Ein Name. Ein Wofür. Soft.',cat:'Energie',hard:false,need:['Name','Wofür'],flow:[
    ['Vorbereitung','Name und Wofür oben.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Segen für [Name]. Nur [Wofür]. Ich bleibe ich.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.'],
    ['Absicht','Sprich:|Ich setze Segen für [Name]: [Wofür].|Nur zum Guten. Der freie Wille bleibt.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Der Segen sitzt.|Sechs: [Wofür] findet den Weg.|Neun: Es ist gesetzt.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin ganz bei mir. Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag.']
  ]},
  {id:'fuelle',tone:'soft',t:'Fülle und Geld',s:'Versorgung. Soft.',cat:'Energie',hard:false,flow:[
    ['Vorbereitung','Tu:|Eine Kerze. Etwas mit Wert vor dir. Wasser danach.||Sprich:|Nur Fülle. Ohne Hetze.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.'],
    ['Absicht','Sprich:|Ich bin versorgt. Die Fülle findet ihren Weg zu mir.|Geld kommt, bewegt sich und darf bleiben. Zum höchsten Wohl.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Ich bin versorgt.|Sechs: Der Weg öffnet sich.|Neun: Es ist im Gange.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin ganz bei mir. Ich klammere nicht.|Füsse. Atem. Raum.'],
    ['Schluss','Tu:|Wasser. Alltag. Nicht nachrechnen.']
  ]},
  {id:'schlaf',tone:'soft',t:'Schlaf und Traum',s:'Ruhe. Still.',cat:'Energie',hard:false,skipTiming:true,noStatus:true,flow:[
    ['Vorbereitung','Am Bett. Licht tief.||Tu:|Ein Atem. Handy lautlos, nur diese App offen.||Sprich:|Nichts Neues mehr. Nur Ruhe.'],
    ['Feld','Sprich:|Ich schliesse mein Feld. Nichts Fremdes hat Zutritt.|Der Raum ist ruhig und sicher.'],
    ['Absicht','Sprich:|Ich schlafe tief und ruhig.|Was mir dienen soll, darf im Traum klar werden.|Am Morgen erinnere ich, was wichtig ist.'],
    ['So sei es','Sprich leise:|So sei es.'],
    ['Rückkehr','Sprich:|Ich bin bei mir. Ich lasse los.|Atem. Schwer werden. Schlafen.']
  ]},

  /* ---------- LIEBE ---------- */
  {id:'anz',tone:'soft',t:'Anziehung',s:'Öffnen ohne Zwang. Soft.',cat:'Liebe',hard:false,need:['Name'],flow:[
    ['Vorbereitung','Name oben. Foto als Anker, dann umdrehen.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur Anziehung. Kein Halten. Kein Zwang. Ich bleibe ich.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.'],
    ['Absicht','Sprich:|[Name] fühlt sich zu mir hingezogen und spürt den Wunsch nach Kontakt.|Kontakt geschieht leicht und natürlich. Nur wenn es für beide stimmig ist.|Kein Festhalten. Kein Brechen des Willens.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Die Anziehung ist da.|Sechs: Der Kontakt findet den Weg.|Neun: Es ist im Gange.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin nicht [Name]. Ich kehre vollständig zurück.|Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag. Nicht täglich nachziehen.']
  ]},
  {id:'einladen',tone:'soft',t:'Liebe einladen',s:'Ohne Namen. Venus. Soft.',cat:'Liebe',hard:false,flow:[
    ['Vorbereitung','Wenn möglich Freitag, Venustag.||Tu:|Eine Kerze, rosa oder weiss. Wasser danach.||Sprich:|Ohne Namen. Ohne Zwang. Ich öffne mich.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.'],
    ['Absicht','Sprich:|Ich bin offen für Liebe, die mir guttut.|Die passende Liebe findet den Weg zu mir, frei und stimmig.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Ich bin offen.|Sechs: Liebe findet den Weg.|Neun: Es ist im Gange.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin ganz bei mir. Ich warte nicht, ich lebe.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag.']
  ]},
  {id:'liebe',tone:'hard',soft:'anz',t:'Bindung',s:'Hält den Faden. Hart.',cat:'Liebe',hard:true,haerte:true,need:['Name'],
    preis:'Zäher Faden — was du bindest, bindet dich mit.',gegen:'Beweglichkeit sinkt. Rückbindung möglich. Fehlende 9 kostet.',flow:[
    ['Vorbereitung','Name oben. Foto als Anker, dann umdrehen.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Das ist Bindung, nicht Anziehung. Ich kenne den Preis. Ich bleibe ich.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge. Grenze um dich.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.|Ich schliesse mein Feld hart.'],
    ['Rahmen','Sprich:|Ich öffne bewusst für Bindung. Ich kenne die Gegenseite.|Nur so weit, wie ich den Preis trage.'],
    ['Absicht','Sprich:|Zwischen mir und [Name] entsteht ein fester, spürbarer Faden.|Nähe hält. Aufmerksamkeit bleibt.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Der Faden hält.|Sechs: Die Bindung ist gesetzt.|Neun: Es ist gebunden.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin nicht [Name]. Ich kehre vollständig zurück.|Meine Energie gehört mir. Der Beobachter bleibt wach.|Alles Fremde löst sich und geht.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag. Nicht nachladen.']
  ]},
  {id:'liebe2',tone:'hard',soft:'anz',t:'Bindung zweier',s:'Faden zwischen A und B. Hart.',cat:'Liebe',hard:true,haerte:true,need:['A','B'],
    preis:'Zwei Willen — der Ausgleich sucht dich.',gegen:'Rückbindung möglich. Ohne 9 der Kreis aus Macht und Preis.',flow:[
    ['Vorbereitung','Beide Namen oben. Foto als Anker, dann umdrehen.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur der Faden zwischen [A] und [B]. Ich werde weder [A] noch [B].'],
    ['Standort','Tu:|Füsse. Drei Atemzüge. Grenze um dich.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.|Ich schliesse mein Feld hart.'],
    ['Rahmen','Sprich:|Ich greife bewusst in zwei Willen ein. Ich kenne den Preis und die Gegenseite.'],
    ['Absicht','Sprich:|Zwischen [A] und [B] entsteht ein fester Faden der Nähe.|Soweit Feld und Preis tragen.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Der Faden hält.|Sechs: Die Bindung ist gesetzt.|Neun: Es ist gebunden.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin nicht [A]. Ich bin nicht [B].|Ich kehre vollständig zurück. Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag. Nicht nachladen.']
  ]},

  /* ---------- TRENNUNG ---------- */
  {id:'trenn',tone:'soft',t:'Trennung selbst',s:'Nur dein Faden. Soft.',cat:'Trennung',hard:false,need:['Name'],flow:[
    ['Vorbereitung','Name oben. Foto als Anker, dann umdrehen.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur der Faden zu [Name]. Kein Urteil. Kein Nachsetzen. Ich bleibe ich.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.'],
    ['Absicht','Sprich:|Die Verbindung zwischen mir und [Name] löst sich jetzt.|Alle unstimmigen Fäden werden getrennt. Ich lasse frei und werde frei.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Die Verbindung löst sich.|Sechs: Die Fäden fallen ab.|Neun: Die Trennung ist im Gange.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin nicht [Name]. Ich kehre vollständig in mich zurück.|Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag.']
  ]},
  {id:'band',tone:'soft',t:'Band lösen',s:'Sanft. Nur der Faden. Soft.',cat:'Trennung',hard:false,need:['Name'],needOpt:true,flow:[
    ['Vorbereitung','Name oben, wenn es um eine Person geht.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur das Band. Kein Urteil. Kein Nachsetzen.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.'],
    ['Lösen','Sprich:|Das Band, das nicht mehr stimmt, darf sich lösen.|Das Band zwischen mir und [Name] löst sich.|Alle unstimmigen Fäden fallen ab. Ich lasse frei und werde frei.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Das Band löst sich.|Sechs: Die Fäden fallen ab.|Neun: Es ist im Gange.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin nicht [Name].|Ich bin ganz bei mir. Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag.']
  ]},
  {id:'trenn2',tone:'hard',soft:'trenn',haerte:true,t:'Trennung anderer',s:'Faden zwischen A und B. Hart.',cat:'Trennung',hard:true,need:['A','B'],
    preis:'Fremde Fäden schneiden — der Ausgleich sucht dich.',gegen:'Nur wenn klar und nötig. Sonst soft.',flow:[
    ['Vorbereitung','Beide Namen oben. Foto als Anker, dann umdrehen.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur der Faden zwischen [A] und [B]. Lösung, nicht Zerstörung.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge. Grenze um dich.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.|Ich schliesse mein Feld hart.'],
    ['Absicht','Sprich:|Die unstimmige Verbindung zwischen [A] und [B] löst sich.|Die Fäden fallen ab. Jeder gehört wieder sich selbst. Ohne unnötigen Schaden.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Die Verbindung löst sich.|Sechs: Die Fäden fallen ab.|Neun: Sie sind voneinander frei.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin nicht [A]. Ich bin nicht [B].|Ich kehre vollständig zurück. Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag.']
  ]},

  /* ---------- PERSON X ---------- */
  {id:'fluch',tone:'hard',soft:'karma',t:'Fluch',s:'Schadensbahn. Hart.',cat:'Person X',hard:true,haerte:true,ichHart:true,need:['Name'],
    preis:'Schaden kehrt zum Sender. Wer schaden will, zahlt fast immer.',gegen:'Rücklauf. Verlust der 9. Kreis aus Macht und Preis.',flow:[
    ['Vorbereitung','Name oben.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Soft-Karma zuerst, wenn es reicht. Sonst hier. Ich halte keinen Hass.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge. Grenze um dich.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.|Ich schliesse mein Feld hart.'],
    ['Absicht','Sprich:|Was [Name] gesät hat, kehrt in klarer Form.|Die Bahn ist gesetzt. Ich setze und lasse los.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Die Bahn ist gesetzt.|Sechs: Der Ausgleich läuft.|Neun: Übergeben.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin nicht [Name]. Ich kehre vollständig zurück.|Meine Energie gehört mir. Ich bleibe Spieler mit 9.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag. Nicht nachladen.']
  ]},
  {id:'ueber',tone:'hard',soft:'segen',haerte:true,t:'Person übernehmen',s:'Hinein. Sofort raus. Hart.',cat:'Person X',hard:true,ich:true,need:['Name','Auftrag'],
    preis:'Hängen ohne Rückkehr.',gegen:'Qualitätswechsel, fremder Blick. Ohne Sofort-Rückkehr zahlst du.',flow:[
    ['Vorbereitung','Name und Auftrag oben.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur [Auftrag]. Ich bin noch ich.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge. Grenze um dich.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.|Ich schliesse mein Feld hart. Noch nicht [Name].'],
    ['Absicht','Sprich:|Ich setze: [Auftrag].|Ein Satz. Nur so weit, wie es stimmig ist.'],
    ['Versetzen','Tu:|Foto unten. Name laut.||Sprich:|Ich bin [Name]. Nur für [Auftrag].|Von innen setze ich die Absicht.'],
    ['Zurück aus [Name]','Sprich sofort:|Ich bin nicht mehr [Name].|Ich bin wieder ich. Der Beobachter hält.|Die Aufgabe läuft, ohne dass ich bleibe.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Saat gesetzt.|Sechs: Bewegung hält.|Neun: Ich bin zurück und klar.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Doppelt prüfen. Sprich:|Ich bin nicht [Name]. Ich kehre vollständig zurück.|Meine Energie gehört nur mir. Alles Fremde geht.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag.']
  ]},

  /* ---------- FELD ---------- */
  {id:'wesen',tone:'hard',t:'Wesenheit für Auftrag',s:'Nur wenn der Faden nicht reicht. Hartes Ende.',cat:'Feld',hard:true,wesenSelf:true,need:['Auftrag'],
    preis:'Ein Mitspieler mehr im Feld — du bleibst verantwortlich.',gegen:'Täuschung möglich. Filter und klares Ende sind Pflicht.',flow:[
    ['Vorbereitung','Auftrag oben. Ein Satz.||Tu:|Eine Kerze. Wasser danach.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge. Grenze um dich.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.|Ich schliesse mein Feld hart.'],
    ['Filter','Sprich:|Nur klare, stimmige Präsenz. Was drängt, bleibt draussen.|Ich behalte den Raum.'],
    ['Fragen','Sprich:|Wer bereit und geeignet ist, [Auftrag] zu tragen, möge sich zeigen.'],
    ['Auftrag','Sprich:|Dein Auftrag ist: [Auftrag]. Nur in diesem Rahmen.|Ohne unnötigen Schaden. Der Auftrag endet, wenn er erfüllt ist.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Gegeben.|Sechs: Getragen.|Neun: Gesetzt.'],
    ['So sei es','Sprich:|Versiegelt. So sei es.'],
    ['Entlassen','Sprich:|Der Auftrag ist beendet, wenn er erfüllt ist. Ich danke dir.|Du bist frei. Löse alle Verbindungen. Ich schliesse den Kontakt.'],
    ['Rückkehr','Sprich:|Ich bin ganz bei mir. Meine Energie gehört nur mir.|Alles Fremde löst sich und geht.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag.']
  ]},
  {id:'ahn',tone:'feld',t:'Ahnen rufen',s:'Ehren, begrenzen, entlassen. Feld.',cat:'Feld',hard:false,need:['Name'],flow:[
    ['Vorbereitung','Name oben.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur [Name]. Ich bleibe ich.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.'],
    ['Einladung','Sprich:|[Name], wenn du bereit und willens bist, zeige dich.|Ich möchte verstehen, nicht übernehmen.'],
    ['Grenze','Sprich:|Ich ehre dich und die Linie.|Ich gehöre mir selbst. Ungesunde Muster lasse ich nicht in mein Leben.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Kontakt klar.|Sechs: Die Linie trägt.|Neun: Ich gehöre mir.'],
    ['So sei es','Sprich:|Versiegelt. So sei es.'],
    ['Entlassen','Sprich:|Danke. Du kannst in Frieden gehen.|Ich schliesse den Kontakt. Meine Energie gehört mir.'],
    ['Rückkehr','Sprich:|Ich bin nicht [Name]. Ich bin ganz bei mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag.']
  ]},
  {id:'neumond',tone:'feld',t:'Neumond · Aussaat',s:'Neu setzen. Soft.',cat:'Feld',hard:false,flow:[
    ['Vorbereitung','Neumond oder zunehmender Mond.||Tu:|Eine Kerze. Papier und Stift.||Sprich:|Neu setzen. Still wachsen lassen.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.'],
    ['Absicht','Tu:|Einen Satz aufschreiben.||Sprich:|Das setze ich als Saat: dein Satz.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Die Saat ist gelegt.|Sechs: Sie darf wachsen.|Neun: Es ist im Gange.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin ganz bei mir. Ich wässere nicht aus Angst.|Füsse. Atem. Raum.'],
    ['Schluss','Tu:|Zettel weglegen. Wasser. Alltag.']
  ]},
  {id:'vollmond',tone:'feld',t:'Vollmond · Ernte und Dank',s:'Ernten. Nicht nachsetzen. Soft.',cat:'Feld',hard:false,flow:[
    ['Vorbereitung','Vollmond oder kurz danach.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Ernte und Dank. Nicht nachsetzen.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin hier. Ich bin klar.'],
    ['Dank und Ernte','Sprich:|Danke für das, was reif geworden ist.|Was fällt, darf fallen. Ich halte nichts fest.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Ich sehe die Ernte.|Sechs: Ich danke.|Neun: Ich lasse los.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin ganz bei mir. Ich setze heute nichts nach.|Füsse. Atem. Raum.'],
    ['Schluss','Tu:|Wasser. Alltag.']
  ]},
  {id:'abbr',tone:'neutral',t:'Abbruch',s:'Laufenden Zug beenden. Heimkehren.',cat:'Feld',hard:false,neutral:true,skipTiming:true,noStatus:true,flow:[
    ['Lage','Sprich:|Ein Zug läuft noch. Ich breche ab. Kein neuer Auftrag.'],
    ['Feld','Sprich:|Ich schliesse mein Feld. Alles Offene geht zu.'],
    ['Abbruch','Sprich:|Der laufende Zug endet hier.|Alle Fäden, die ich gesetzt habe und die nicht halten sollen, fallen.|Ich rufe nichts nach. Die Arbeit ist nicht gesetzt.'],
    ['Rückkehr','Sprich:|Ich bin nicht die andere Person. Ich bin nicht die Wesenheit.|Ich kehre vollständig zurück. Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Es ist so.||Tu:|Wasser. Alltag.']
  ]}
  ];
  L.forEach(function(r){ r.flow=r.flow.map(function(st){ return [st[0], st[1].split('|').join('\n')]; }); });
  if(typeof R!=='undefined' && Array.isArray(R)){ R.length=0; for(var i=0;i<L.length;i++) R.push(L[i]); }
  window.RR_RITUALS=L;
  window.RR_CATS=CATS;
})();
