/* rituals-v2.js — eine saubere Datenquelle für alle Rituale.
   Wird vom ritual-runner-v2.js gelesen. Kein Logik-Code hier, nur Texte.
   Reihenfolge im Ablauf folgt dem Buch: Timing -> (Hard: Diagnose -> Ethik-Gate)
   -> Rahmen -> Absicht -> (nur bei Identifikation: Ich bin [Name] und sofort zurück)
   -> 369 (3 Ich / 6 Spiel / 9 Quelle) -> So sei es (Siegel) -> Rückkehr -> optional Es ist so -> Echo.
   Abbruch in jedem Schritt möglich (Runner).
   Build 51: zeit = passende Zeit (Planetentag 0 So … 6 Sa, Mond zu/ab/neu/voll), nur Hinweis im Tor.
   Hard: Bannen am Anfang, Gabe · Preis nach So sei es. Neun = Quelle.
   Alte IDs und Titel bleiben lesbar: RR_ALT_ID (z. B. weg -> kreis) und RR_ALT_TITEL (Chronik-Titel -> ID). */
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
  {id:'schutz',tone:'soft',t:'Schutz selbst',s:'Feld schliessen. Soft.',cat:'Schutz',hard:false,zeit:{tag:[2,6]},flow:[
    ['Vorbereitung','Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur Schutz. Nur ich.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Die Quelle ist wach.'],
    ['Absicht','Sprich:|Ich schütze mich jetzt vollständig.|Mein Feld ist geschlossen, klar und stabil.|Alles Fremde prallt ab oder geht in die Erde. Meine Energie gehört mir.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Mein Schutz ist stark.|Sechs: Alles Fremde prallt ab.|Neun: Ich bin die Quelle. Ich bin klar und bei mir.'],
    ['So sei es','Tu:|Hand aufs Herz.||Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin ganz bei mir. Meine Energie gehört nur mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag. Nicht nachkontrollieren.']
  ]},
  {id:'schutz2',tone:'soft',t:'Schutz für eine andere Person',s:'Feld von Person X. Soft.',cat:'Schutz',hard:false,need:['Name'],zeit:{tag:[2,6]},flow:[
    ['Vorbereitung','Name oben. Foto nur als Anker, dann umdrehen. Sonst reicht der Name.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur Schutz für [Name]. Kein Mehr.|Ich bleibe ich. [Name] bleibt [Name].'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Die Quelle ist wach.|Ich richte mich auf [Name] aus, ohne mich zu verlieren.'],
    ['Feld','Tu:|Grenze um dich.||Sprich:|Ich schliesse mein Feld. Meine Energie gehört mir.|Wärme ja. Verschmelzen nein.'],
    ['Absicht','Sprich:|Das Feld von [Name] wird klar und geschützt.|Die Energie bleibt bei [Name]. Alles Ziehende prallt ab.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Das Feld von [Name] ist geschützt.|Sechs: Es bleibt klar und geschlossen.|Neun: Ich sehe es. [Name] ist in der Kraft.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin nicht [Name]. Ich kehre vollständig in mich zurück.|Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag. Nicht nachkontrollieren.']
  ]},
  {id:'stopp',tone:'grenze',t:'Schaden stoppen',s:'Angriff endet. Feld zu. Grenze.',cat:'Schutz',hard:false,grenze:true,need:['Name'],zeit:{tag:[2],mond:'ab'},flow:[
    ['Vorbereitung','Name oben.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur Stopp. Nur Distanz. Nur [Name]. Kein Nachsetzen.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Die Quelle ist wach.|Ich bleibe ich. [Name] bleibt [Name].'],
    ['Feld','Tu:|Grenze um dich.||Sprich:|Ich schliesse mein Feld hart. Nichts Fremdes hat Zutritt.'],
    ['Absicht','Sprich:|Jeder Angriff von [Name] auf mich stoppt jetzt.|Die Bahn ist zu. Ohne Hass. Ohne mich zu verlieren.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Der Schaden stoppt.|Sechs: Der Zugriff fällt ab.|Neun: Ich sehe es. Ich bin frei und geschützt.'],
    ['So sei es','Tu:|Hand aufs Herz.||Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin nicht [Name]. Ich kehre vollständig zurück.|Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag. Nicht nachkontrollieren.']
  ]},
  {id:'kreis',tone:'soft',t:'Schutzkreis · kurz',s:'Jeden Tag oder unterwegs. Kurz. Soft.',cat:'Schutz',hard:false,skipTiming:true,flow:[
    ['Standort','Tu:|Füsse. Ein Atem.||Sprich:|Ich bin hier.'],
    ['Kreis','Tu:|Einmal um dich zeigen. Unterwegs genügt die Hand aufs Herz.||Sprich:|Ich ziehe meinen Kreis. Nichts Fremdes hat Zutritt.|Meine Energie gehört mir.'],
    ['369','Kurz:|Drei: Der Kreis steht.|Sechs: Fremdes prallt ab.|Neun: Ich bin die Quelle. Ich bin bei mir.'],
    ['So sei es','Sprich:|Versiegelt. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin bei mir. Ich gehe klar weiter.']
  ]},
  {id:'raum',tone:'soft',t:'Raum reinigen',s:'Ort klären. Soft.',cat:'Schutz',hard:false,zeit:{tag:[6],mond:'ab'},flow:[
    ['Vorbereitung','Tu:|Fenster kurz auf. Eine Kerze oder Rauch. Salz und Wasser bereit.||Sprich:|Nur dieser Raum. Nur klar.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Die Quelle ist wach.'],
    ['Reinigen','Tu:|Durch den Raum gehen, Ecken zuerst.||Sprich:|Alles Schwere und Fremde löst sich und geht.|Dieser Raum wird klar, ruhig und rein.'],
    ['Füllen','Tu:|In der Mitte stehen. Hände öffnen.||Sprich:|Licht und Ruhe füllen diesen Raum.|Nur was mir guttut, wohnt hier.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Der Raum wird klar.|Sechs: Alles Fremde geht.|Neun: Ich sehe es. Der Raum ist rein und ruhig.'],
    ['So sei es','Tu:|Etwas Salz an die Schwelle.||Sprich:|Versiegelt. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin ganz bei mir. Der Raum gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Tu:|Wasser weg. Lüften. Alltag.']
  ]},

  /* ---------- ENERGIE ---------- */
  {id:'heil',tone:'soft',t:'Heilung',s:'Ergänzung zur Medizin. Soft.',cat:'Energie',hard:false,need:['Name'],zeit:{tag:[0,1],mond:'zu'},flow:[
    ['Vorbereitung','Name oben.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Heilung für [Name]. Arzt bleibt parallel. Ich bleibe ich.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Die Quelle ist wach.'],
    ['Rahmen','Sprich:|Ich öffne nur für reine, stimmige Heilung.'],
    ['Absicht','Sprich:|Der Körper von [Name] findet natürliche, vollständige Heilung.|Alles, was die Heilung behindert, löst sich. Zum höchsten Wohl.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Die Heilung sitzt.|Sechs: Alles Störende löst sich.|Neun: Ich sehe es. Die Heilung ist gesetzt.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin nicht [Name]. Ich kehre vollständig zurück.|Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag. Nicht nachfragen.']
  ]},
  {id:'karma',tone:'soft',t:'Karma-Ausgleich',s:'Nicht Rache. Soft.',cat:'Energie',hard:false,need:['Name'],needOpt:true,zeit:{tag:[6],mond:'ab'},flow:[
    ['Vorbereitung','Tu:|Eine Kerze. Wasser danach.||Sprich:|Ausgleich. Nicht Rache. Ohne Hass. Ich bleibe ich.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Die Quelle ist wach.'],
    ['Schutz','Tu:|Grenze um dich.||Sprich:|Ich schliesse mein eigenes Feld, bevor ich ausgleiche.'],
    ['Absicht','Sprich:|Was mir genommen oder aufgeladen wurde, kehrt in stimmiger Form zurück.|Der Ausgleich geschieht ohne Hass. Die Last darf gehen.|Ich schaue nicht auf den Fall des anderen.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Der Ausgleich geschieht.|Sechs: Die Energie kehrt rein zurück.|Neun: Ich sehe es. Es ist vollendet.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin ganz bei mir. Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag. Nicht nachkontrollieren.']
  ]},
  {id:'zur',tone:'soft',t:'Energie zurückholen',s:'Nach Kontakt. Nur holen. Soft.',cat:'Energie',hard:false,need:['Name'],needOpt:true,zeit:{tag:[0]},flow:[
    ['Vorbereitung','Name oben, wenn der Kontakt eine Person war.||Tu:|Eine Kerze am Platz. Wasser danach.||Sprich:|Nur zurück. Nichts rufen.|Was mein ist, kommt. Was nicht mein ist, geht.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Die Quelle ist wach. Ich bin in mir.'],
    ['Feld','Tu:|Grenze um dich.||Sprich:|Ich schliesse mein Feld. Meine Energie gehört mir.'],
    ['Absicht','Sprich:|Alles, was von mir genommen wurde oder an mir hängt, kehrt jetzt rein und vollständig zu mir zurück.|Fremde Energie löst sich und geht. Ich hole nicht nach. Ich empfange.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Die Energie kehrt rein zurück.|Sechs: Fremdes löst sich und geht.|Neun: Ich bin die Quelle. Ich bin vollständig bei mir.'],
    ['So sei es','Tu:|Hand aufs Herz.||Sprich:|Versiegelt. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin zurück in mir. Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Körper. Alltag.']
  ]},
  {id:'segen',tone:'soft',t:'Segen',s:'Ein Name. Ein Wofür. Soft.',cat:'Energie',hard:false,need:['Name','Wofür'],zeit:{tag:[0,4],mond:'zu'},flow:[
    ['Vorbereitung','Name und Wofür oben.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Segen für [Name]. Nur [Wofür]. Ich bleibe ich.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Die Quelle ist wach.'],
    ['Absicht','Sprich:|Ich setze Segen für [Name]: [Wofür].|Nur zum Guten. Der freie Wille bleibt.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Der Segen sitzt.|Sechs: [Wofür] findet den Weg.|Neun: Ich sehe es. Es ist gesetzt.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin ganz bei mir. Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag.']
  ]},
  {id:'fuelle',tone:'soft',t:'Fülle und Geld',s:'Versorgung. Soft.',cat:'Energie',hard:false,zeit:{tag:[4],mond:'zu'},flow:[
    ['Vorbereitung','Tu:|Eine Kerze. Etwas mit Wert vor dir. Wasser danach.||Sprich:|Nur Fülle. Ohne Hetze.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Die Quelle ist wach.'],
    ['Absicht','Sprich:|Ich bin versorgt. Die Fülle findet ihren Weg zu mir.|Geld kommt, bewegt sich und darf bleiben. Zum höchsten Wohl.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Ich bin versorgt.|Sechs: Der Weg öffnet sich.|Neun: Ich sehe es. Es ist gesetzt.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin ganz bei mir. Ich klammere nicht.|Füsse. Atem. Raum.'],
    ['Schluss','Tu:|Wasser. Alltag. Nicht nachrechnen.']
  ]},
  {id:'schlaf',tone:'soft',t:'Schlaf und Traum',s:'Ruhe. Still.',cat:'Energie',hard:false,skipTiming:true,noStatus:true,noRk:true,flow:[
    ['Vorbereitung','Am Bett. Licht tief.||Tu:|Ein Atem. Handy lautlos, nur diese App offen.||Sprich:|Nichts Neues mehr. Nur Ruhe.'],
    ['Feld','Sprich:|Ich schliesse mein Feld. Nichts Fremdes hat Zutritt.|Der Raum ist ruhig und sicher.'],
    ['Absicht','Sprich:|Ich schlafe tief und ruhig.|Was mir dienen soll, darf im Traum klar werden.|Am Morgen erinnere ich, was wichtig ist.'],
    ['So sei es','Sprich leise:|So sei es.'],
    ['Rückkehr','Sprich:|Ich bin bei mir. Ich lasse los.|Atem. Schwer werden. Schlafen.']
  ]},

  /* ---------- LIEBE ---------- */
  {id:'anz',tone:'soft',t:'Anziehung',s:'Öffnen ohne Zwang. Soft.',cat:'Liebe',hard:false,need:['Name'],zeit:{tag:[5],mond:'zu'},flow:[
    ['Vorbereitung','Name oben. Foto als Anker, dann umdrehen.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur Anziehung. Kein Halten. Kein Zwang. Ich bleibe ich.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Die Quelle ist wach.'],
    ['Absicht','Sprich:|[Name] fühlt sich zu mir hingezogen und spürt den Wunsch nach Kontakt.|Kontakt geschieht leicht und natürlich. Nur wenn es für beide stimmig ist.|Kein Festhalten. Kein Brechen des Willens.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Die Anziehung ist da.|Sechs: Der Kontakt findet den Weg.|Neun: Ich sehe es. Es ist gesetzt.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin nicht [Name]. Ich kehre vollständig zurück.|Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag. Nicht täglich nachziehen.']
  ]},
  {id:'einladen',tone:'soft',t:'Liebe einladen',s:'Ohne Namen. Venus. Soft.',cat:'Liebe',hard:false,zeit:{tag:[5],mond:'zu'},flow:[
    ['Vorbereitung','Wenn möglich Freitag, Venustag.||Tu:|Eine Kerze, rosa oder weiss. Wasser danach.||Sprich:|Ohne Namen. Ohne Zwang. Ich öffne mich.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Die Quelle ist wach.'],
    ['Absicht','Sprich:|Ich bin offen für Liebe, die mir guttut.|Die passende Liebe findet den Weg zu mir, frei und stimmig.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Ich bin offen.|Sechs: Liebe findet den Weg.|Neun: Ich sehe es. Es ist gesetzt.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin ganz bei mir. Ich warte nicht, ich lebe.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag.']
  ]},
  {id:'liebe',tone:'hard',soft:'anz',t:'Bindung',s:'Hält den Faden. Hart.',cat:'Liebe',hard:true,haerte:true,need:['Name'],zeit:{tag:[5],mond:'zu'},
    preis:'Zäher Faden — was du bindest, bindet dich mit.',gegen:'Beweglichkeit sinkt. Rückbindung möglich. Fehlende 9 kostet.',flow:[
    ['Vorbereitung','Name oben. Foto als Anker, dann umdrehen.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Das ist Bindung, nicht Anziehung. Ich kenne den Preis. Ich bleibe ich.'],
    ['Bannen','Tu:|Salz oder Rauch. Einmal um dich.||Sprich:|Was nicht hierher gehört, geht. Der Raum ist rein.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge. Grenze um dich.||Sprich:|Ich bin der Spieler. Die Quelle ist wach.|Ich schliesse mein Feld hart.'],
    ['Rahmen','Sprich:|Ich öffne bewusst für Bindung. Ich kenne die Gegenseite.|Nur so weit, wie ich den Preis trage.'],
    ['Absicht','Sprich:|Zwischen mir und [Name] entsteht ein fester, spürbarer Faden.|Nähe hält. Aufmerksamkeit bleibt.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Der Faden hält.|Sechs: Die Bindung ist gesetzt.|Neun: Ich sehe es. Es ist gebunden.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Gabe · Preis','Tu:|Eine Gabe hinstellen: Wasser, Salz oder etwas von dir.||Sprich:|Ich gebe das als Ausgleich. Ich trage den Preis.'],
    ['Rückkehr','Sprich:|Ich bin nicht [Name]. Ich kehre vollständig zurück.|Meine Energie gehört mir. Die Quelle bleibt wach.|Alles Fremde löst sich und geht.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag. Nicht nachladen.']
  ]},
  {id:'liebe2',tone:'hard',soft:'anz',t:'Bindung zweier',s:'Faden zwischen A und B. Hart.',cat:'Liebe',hard:true,haerte:true,need:['A','B'],zeit:{tag:[5],mond:'zu'},
    preis:'Zwei Willen — der Ausgleich sucht dich.',gegen:'Rückbindung möglich. Ohne 9 der Kreis aus Macht und Preis.',flow:[
    ['Vorbereitung','Beide Namen oben. Foto als Anker, dann umdrehen.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur der Faden zwischen [A] und [B]. Ich werde weder [A] noch [B].'],
    ['Bannen','Tu:|Salz oder Rauch. Einmal um dich.||Sprich:|Was nicht hierher gehört, geht. Der Raum ist rein.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge. Grenze um dich.||Sprich:|Ich bin der Spieler. Die Quelle ist wach.|Ich schliesse mein Feld hart.'],
    ['Rahmen','Sprich:|Ich greife bewusst in zwei Willen ein. Ich kenne den Preis und die Gegenseite.'],
    ['Absicht','Sprich:|Zwischen [A] und [B] entsteht ein fester Faden der Nähe.|Soweit Feld und Preis tragen.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Der Faden hält.|Sechs: Die Bindung ist gesetzt.|Neun: Ich sehe es. Es ist gebunden.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Gabe · Preis','Tu:|Eine Gabe hinstellen: Wasser, Salz oder etwas von dir.||Sprich:|Ich gebe das als Ausgleich. Ich trage den Preis.'],
    ['Rückkehr','Sprich:|Ich bin nicht [A]. Ich bin nicht [B].|Ich kehre vollständig zurück. Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag. Nicht nachladen.']
  ]},

  /* ---------- TRENNUNG ---------- */
  {id:'trenn',tone:'grenze',t:'Trennung selbst',s:'Nur dein Faden. Grenze.',cat:'Trennung',hard:false,grenze:true,need:['Name'],zeit:{tag:[6],mond:'ab'},flow:[
    ['Vorbereitung','Name oben. Foto als Anker, dann umdrehen.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur der Faden zu [Name]. Kein Urteil. Kein Nachsetzen. Ich bleibe ich.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Die Quelle ist wach.'],
    ['Absicht','Sprich:|Die Verbindung zwischen mir und [Name] löst sich jetzt.|Alle unstimmigen Fäden werden getrennt. Ich lasse frei und werde frei.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Die Verbindung löst sich.|Sechs: Die Fäden fallen ab.|Neun: Ich sehe es. Die Trennung ist gesetzt.'],
    ['Schnitt','Tu:|Einen Faden durchschneiden oder über der Kerze verbrennen.|Reste aus dem Haus bringen.||Sprich:|Getrennt.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin nicht [Name]. Ich kehre vollständig in mich zurück.|Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag.']
  ]},
  {id:'band',tone:'grenze',t:'Band lösen',s:'Ohne Person · Muster oder Ort. Sanft. Grenze.',cat:'Trennung',hard:false,grenze:true,zeit:{tag:[6],mond:'ab'},flow:[
    ['Vorbereitung','Für ein Muster, eine Gewohnheit oder einen Ort. Für eine Person: «Trennung selbst».||Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur das Band. Kein Urteil. Kein Nachsetzen.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Die Quelle ist wach.'],
    ['Absicht','Tu:|Das Muster oder den Ort still benennen.||Sprich:|Das Band, das nicht mehr stimmt, darf sich lösen.|Alle unstimmigen Fäden fallen ab. Ich lasse frei und werde frei.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Das Band löst sich.|Sechs: Die Fäden fallen ab.|Neun: Ich sehe es. Es ist gesetzt.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin ganz bei mir. Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag.']
  ]},
  {id:'trenn2',tone:'hard',soft:'trenn',haerte:true,t:'Trennung anderer',s:'Faden zwischen A und B. Hart.',cat:'Trennung',hard:true,need:['A','B'],zeit:{tag:[6],mond:'ab'},
    preis:'Fremde Fäden schneiden — der Ausgleich sucht dich.',gegen:'Nur wenn klar und nötig. Sonst soft.',flow:[
    ['Vorbereitung','Beide Namen oben. Foto als Anker, dann umdrehen.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur der Faden zwischen [A] und [B]. Lösung, nicht Zerstörung.'],
    ['Bannen','Tu:|Salz oder Rauch. Einmal um dich.||Sprich:|Was nicht hierher gehört, geht. Der Raum ist rein.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge. Grenze um dich.||Sprich:|Ich bin der Spieler. Die Quelle ist wach.|Ich schliesse mein Feld hart.'],
    ['Absicht','Sprich:|Die unstimmige Verbindung zwischen [A] und [B] löst sich.|Die Fäden fallen ab. Jeder gehört wieder sich selbst. Ohne unnötigen Schaden.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Die Verbindung löst sich.|Sechs: Die Fäden fallen ab.|Neun: Ich sehe es. Sie sind voneinander frei.'],
    ['Schnitt','Tu:|Einen Faden durchschneiden oder über der Kerze verbrennen.|Reste aus dem Haus bringen.||Sprich:|Getrennt. Jeder gehört sich selbst.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Gabe · Preis','Tu:|Eine Gabe hinstellen: Wasser, Salz oder etwas von dir.||Sprich:|Ich gebe das als Ausgleich. Ich trage den Preis.'],
    ['Rückkehr','Sprich:|Ich bin nicht [A]. Ich bin nicht [B].|Ich kehre vollständig zurück. Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag.']
  ]},

  /* ---------- PERSON X ---------- */
  {id:'fluch',tone:'hard',soft:'karma',t:'Fluch',s:'Schadensbahn. Hart.',cat:'Person X',hard:true,haerte:true,ichHart:true,need:['Name'],zeit:{tag:[2,6],mond:'ab'},
    preis:'Schaden kehrt zum Sender. Wer schaden will, zahlt fast immer.',gegen:'Rücklauf. Verlust der 9. Kreis aus Macht und Preis.',flow:[
    ['Vorbereitung','Name oben.||Tu:|Eine Kerze. Wasser und Salz bereit.||Sprich:|Soft-Karma zuerst, wenn es reicht. Sonst hier. Ich halte keinen Hass.'],
    ['Bannen','Tu:|Salz oder Rauch. Einmal um dich.||Sprich:|Was nicht hierher gehört, geht. Der Raum ist rein.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge. Grenze um dich.||Sprich:|Ich bin der Spieler. Die Quelle ist wach.|Ich schliesse mein Feld hart.'],
    ['Rahmen','Sprich:|Nur die Bahn, die [Name] selbst gelegt hat.|Nichts darüber hinaus. Kein Dritter. Ich kenne den Preis.'],
    ['Spiegel','Tu:|Hände vor die Brust, Flächen nach aussen.||Sprich:|Was zurückkommt, prallt an meinem Feld ab und geht in die Erde.|Nichts davon bleibt an mir.'],
    ['Absicht','Sprich:|Was [Name] mir mit Absicht an Schaden geschickt hat, kehrt auf derselben Bahn zu [Name] zurück.|Nicht mehr und nicht weniger. Ich setze und lasse los.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Die Bahn ist gesetzt.|Sechs: Der Ausgleich läuft.|Neun: Ich sehe es. Übergeben.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Gabe · Preis','Tu:|Eine Gabe hinstellen: Wasser, Salz oder etwas von dir.||Sprich:|Ich gebe das als Ausgleich. Ich trage den Preis.'],
    ['Rückkehr','Sprich:|Ich bin nicht [Name]. Ich kehre vollständig zurück.|Meine Energie gehört mir. Ich bleibe im Spiel. Ich bleibe ich.|Füsse. Atem. Raum.'],
    ['Reinigen','Tu:|Hände mit Salzwasser waschen. Das Wasser weggiessen.||Sprich:|Rein. Nichts bleibt an mir.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag. Nicht nachladen.']
  ]},
  {id:'ueber',tone:'hard',soft:'segen',haerte:true,t:'Person übernehmen',s:'Hinein. Sofort raus. Hart.',cat:'Person X',hard:true,ich:true,need:['Name','Auftrag'],zeit:{tag:[3]},
    preis:'Hängen ohne Rückkehr.',gegen:'Qualitätswechsel, fremder Blick. Ohne Sofort-Rückkehr zahlst du.',flow:[
    ['Vorbereitung','Name und Auftrag oben.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur [Auftrag]. Ich bin noch ich.'],
    ['Bannen','Tu:|Salz oder Rauch. Einmal um dich.||Sprich:|Was nicht hierher gehört, geht. Der Raum ist rein.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge. Grenze um dich.||Sprich:|Ich bin der Spieler. Die Quelle ist wach.|Ich schliesse mein Feld hart. Noch nicht [Name].'],
    ['Absicht','Sprich:|Ich setze: [Auftrag].|Ein Satz. Nur so weit, wie es stimmig ist.'],
    ['Versetzen','Tu:|Foto umgedreht unter die Hand. Name laut.||Sprich:|Ich bin [Name]. Nur für [Auftrag].|Von innen setze ich die Absicht.'],
    ['Zurück aus [Name]','Sprich sofort:|Ich bin nicht mehr [Name].|Ich bin wieder ich. Die Quelle hält.|Die Aufgabe läuft, ohne dass ich bleibe.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Saat gesetzt.|Sechs: Bewegung hält.|Neun: Ich sehe es. Ich bin zurück und klar.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Gabe · Preis','Tu:|Eine Gabe hinstellen: Wasser, Salz oder etwas von dir.||Sprich:|Ich gebe das als Ausgleich. Ich trage den Preis.'],
    ['Rückkehr','Doppelt prüfen.||Sprich:|Ich bin nicht [Name]. Ich kehre vollständig zurück.|Meine Energie gehört nur mir. Alles Fremde geht.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag.']
  ]},

  /* ---------- FELD ---------- */
  {id:'wesen',tone:'hard',t:'Wesenheit für Auftrag',s:'Nur wenn der Faden nicht reicht. Hartes Ende.',cat:'Person X',hard:true,wesenSelf:true,need:['Name','Auftrag'],zeit:{tag:[1,6]},
    preis:'Ein Mitspieler mehr im Feld — du bleibst verantwortlich.',gegen:'Täuschung möglich. Filter und klares Ende sind Pflicht.',flow:[
    ['Vorbereitung','Name und Auftrag oben. Ein Satz.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur [Auftrag]. Für [Name] nur, wenn gesetzt. Ich bleibe ich.'],
    ['Bannen','Tu:|Salz oder Rauch. Einmal um dich.||Sprich:|Was nicht hierher gehört, geht. Der Raum ist rein.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge. Grenze um dich.||Sprich:|Ich bin der Spieler. Die Quelle ist wach.|Ich schliesse mein Feld hart.'],
    ['Wesenheit · Filter','Sprich:|Ich behalte den Raum.|Nur klare, stimmige Präsenz. Was drängt, bleibt draussen.|Kein Verschmelzen. Kein Nachlaufen.'],
    ['Wesenheit · Rufen','Sprich:|Wer bereit und geeignet ist, [Auftrag] zu tragen, möge sich zeigen.'],
    ['Wesenheit · Auftrag','Sprich:|Dein Auftrag ist: [Auftrag]. Nur in diesem Rahmen.|Ohne unnötigen Schaden. Der Auftrag endet, wenn er erfüllt ist.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Gegeben.|Sechs: Getragen.|Neun: Ich sehe es. Gesetzt.'],
    ['So sei es','Sprich:|Versiegelt. So sei es.'],
    ['Wesenheit · Entlassen','Sprich:|Der Auftrag ist beendet, wenn er erfüllt ist. Ich danke dir.|Du bist frei. Löse alle Verbindungen. Ich schliesse den Kontakt.'],
    ['Rückkehr','Sprich:|Ich bin nicht die Wesenheit. Ich bin ganz bei mir.|Meine Energie gehört nur mir. Alles Fremde löst sich und geht.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag.']
  ]},
  {id:'ahn',tone:'feld',t:'Ahnen rufen',s:'Ehren, begrenzen, entlassen. Feld.',cat:'Feld',hard:false,need:['Name'],zeit:{tag:[1,6],mond:'ab'},flow:[
    ['Vorbereitung','Name oben.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur [Name]. Ich bleibe ich.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Die Quelle ist wach.'],
    ['Einladung','Sprich:|[Name], wenn du bereit und willens bist, zeige dich.|Ich möchte verstehen, nicht übernehmen.'],
    ['Grenze','Sprich:|Ich ehre dich und die Linie.|Ich gehöre mir selbst. Ungesunde Muster lasse ich nicht in mein Leben.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Kontakt klar.|Sechs: Die Linie trägt.|Neun: Ich sehe es. Ich gehöre mir.'],
    ['So sei es','Sprich:|Versiegelt. So sei es.'],
    ['Entlassen','Sprich:|Danke. Du kannst in Frieden gehen.|Ich schliesse den Kontakt. Meine Energie gehört mir.'],
    ['Rückkehr','Sprich:|Ich bin nicht [Name]. Ich bin ganz bei mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag.']
  ]},
  {id:'neumond',tone:'feld',t:'Neumond · Aussaat',s:'Neu setzen. Soft.',cat:'Feld',hard:false,zeit:{mond:'neu'},flow:[
    ['Vorbereitung','Neumond oder zunehmender Mond.||Tu:|Eine Kerze. Papier und Stift.||Sprich:|Neu setzen. Still wachsen lassen.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Die Quelle ist wach.'],
    ['Absicht','Tu:|Einen Satz aufschreiben.||Sprich:|Das setze ich als Saat: dein Satz.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Die Saat ist gelegt.|Sechs: Sie darf wachsen.|Neun: Ich sehe die Saat. Es ist gesetzt.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin ganz bei mir. Ich wässere nicht aus Angst.|Füsse. Atem. Raum.'],
    ['Schluss','Tu:|Zettel weglegen. Wasser. Alltag.']
  ]},
  {id:'vollmond',tone:'feld',t:'Vollmond · Ernte und Dank',s:'Ernten. Nicht nachsetzen. Soft.',cat:'Feld',hard:false,zeit:{mond:'voll'},flow:[
    ['Vorbereitung','Vollmond oder kurz danach.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Ernte und Dank. Nicht nachsetzen.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin hier. Ich bin klar.'],
    ['Dank und Ernte','Sprich:|Danke für das, was reif geworden ist.|Was fällt, darf fallen. Ich halte nichts fest.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Ich sehe die Ernte.|Sechs: Ich danke.|Neun: Ich sehe es. Ich lasse los.'],
    ['So sei es','Sprich:|Geerntet. Gedankt. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin ganz bei mir. Ich setze heute nichts nach.|Füsse. Atem. Raum.'],
    ['Schluss','Tu:|Wasser. Alltag.']
  ]},
  {id:'dankfeld',tone:'soft',t:'Dank ans Feld',s:'Nur danken. Keine Bitte, keine neue Ladung. Etwa 9 Minuten.',cat:'Feld',hard:false,skipTiming:true,noStatus:true,chronikSatz:true,flow:[
    ['Ankommen','Tu:|Eine Kerze an. Drei ruhige Atemzüge.'],
    ['Erinnern','Tu:|Drei Dinge, die zuletzt gewirkt haben: eins für Ich ❤️, eins für Spiel 🙏, eins für Quelle 👁.||Sprich:|Leise aussprechen.'],
    ['Danken','Tu:|Hände aufs Herz, dann öffnen.||Sprich:|Feld, ich danke dir. Ich habe es gesehen.'],
    ['Gabe','Tu:|Etwas Kleines geben: ein Schluck Wasser, eine Prise Salz oder Stille.'],
    ['Schliessen','Sprich:|So sei es.||Tu:|Kerze aus. Ein Satz in die Chronik.']
  ]},
  {id:'anker',tone:'feld',t:'Rückkehr · Anker',s:'Nach der Arbeit schliessen. Etwa 3 Minuten.',cat:'Person X',hard:false,skipTiming:true,noStatus:true,anker:true,flow:[
    ['Körper','Tu:|Füsse auf den Boden. Hände spüren. Das Gewicht sinkt nach unten.||Sprich:|Ich bin in meinem Körper.'],
    ['Raum','Tu:|Bewusst umschauen. Ein, zwei Dinge laut benennen.||Sprich:|Ich bin hier, nicht mehr im Ritual.'],
    ['Atem','Tu:|Einige ruhige Atemzüge. Länger aus als ein.||Sprich:|Ich bin ruhig. Ich bin bei mir.'],
    ['Feld zu','Tu:|Abschlussgeste: Hände zusammen, dann lösen.||Sprich:|Das Feld ist zu. Es ist so.||Heute nicht weiterarbeiten.']
  ]},
  {id:'echo',tone:'feld',t:'Echo lesen',s:'Nur beobachten. Ein Satz. Kein neues Portal.',cat:'Feld',hard:false,skipTiming:true,noStatus:true,echoRead:true,flow:[
    ['Beobachten','Tu:|Still werden. Keine Kerze aus Pflicht.||Sprich:|Nur lesen. Nicht nachladen. Kein neues Portal.'],
    ['Ein Satz','Tu:|Was sich gezeigt hat, in einem Satz notieren.|Anruf, Gefühl, Zufall — nur Rohdaten.||Sprich:|Ich schaue. Ich deute nicht.'],
    ['Schluss','Sprich:|Danke Feld. Buch zu.||Tu:|Wasser. Alltag. Heute nichts nachsetzen.']
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
  /* Build 51: alte IDs und Chronik-Titel bleiben lesbar */
  window.RR_ALT_ID={weg:'kreis'};
  window.RR_ALT_TITEL={'Schutz unterwegs':'kreis','Täglicher Schutzkreis':'kreis'};

  /* Build 60: Anzeigename für alte Chronik-Titel (nur Anzeige, gespeicherte Daten bleiben): «Schutz unterwegs · Nagelhart» -> «Schutzkreis · kurz · Nagelhart» */
  window.RR_ANZEIGE=function(t){
    t=String(t==null?"":t); var A=window.RR_ALT_TITEL||{}, L=window.RR_RITUALS||[];
    for(var k in A){ if(t===k||t.indexOf(k+" · ")===0){ for(var q=0;q<L.length;q++) if(L[q].id===A[k]) return L[q].t+t.slice(k.length); } }
    return t;
  };  window.RR_CATS=CATS;
})();
