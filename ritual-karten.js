/* rr25 · Karten: ein Stapel für die Heute-Kachel, «Karte» (ziehen) und «Drei» (Legung).
   k: soft | feld | echo | hard · m: Mondphasen, zu denen die Karte besonders passt (neu, zu, voll, ab).
   Heute-Karte: pro Tag stabil, ohne Wiederholung, bis der Stapel durch ist (feste Reihenfolge aus dem Datum,
   sanft nach Mondphase gewichtet). Kein Speicher nötig: Die Reihenfolge wird aus dem Datum berechnet. */
(function(){
  var DECK=[
    {"id":"s01","k":"soft","t":"Morgendank","z":"☼","x":"Bevor das Telefon dran ist: drei Dinge nennen, für die du dankbar bist. Laut, nicht im Kopf. So beginnt der Tag bei dir."},
    {"id":"s02","k":"soft","t":"Wasserglas","z":"◡","x":"Ein Glas Wasser mit beiden Händen halten und einen guten Satz hineinsprechen. Dann langsam trinken. Was du trinkst, trägst du."},
    {"id":"s03","k":"soft","t":"Schwelle","z":"⊓","x":"Beim Heimkommen einen Moment an der Tür stehen bleiben. Der Tag draussen bleibt draussen. Erst dann die Schuhe aus."},
    {"id":"s04","k":"soft","t":"Venus","z":"♀\uFE0E","x":"Zeig heute, was du magst: ein Wort, ein Blick, eine kleine Aufmerksamkeit. Venus wirkt über Wärme, nie über Druck.","m":["zu","voll"]},
    {"id":"s05","k":"soft","t":"Stiller Segen","z":"✥","x":"Einem Menschen still Gutes wünschen, ohne es ihm zu sagen. Ein Satz genügt. Dann weitergehen und nicht zurückschauen."},
    {"id":"s06","k":"soft","t":"Schutzmantel","z":"⛨","x":"Spür, wie sich dein Feld eine Armlänge um dich schliesst. Was nicht zu dir gehört, gleitet ab. Einmal am Morgen reicht."},
    {"id":"s07","k":"soft","t":"Salz an der Tür","z":"⊡","x":"Eine Prise Salz auf die Schwelle. So weiss das Haus, wo es anfängt. Am nächsten Morgen wegwischen.","m":["ab"]},
    {"id":"s08","k":"soft","t":"Kerze","z":"✧","x":"Eine Kerze anzünden und nichts wollen. Nur schauen, bis der Atem ruhig wird. Auch das Auspusten ist ein Abschluss."},
    {"id":"s09","k":"soft","t":"Erster Bissen","z":"◒","x":"Den ersten Bissen heute bewusst nehmen und kurz danken, auch den Händen, die es gemacht haben. Fülle beginnt am Tisch."},
    {"id":"s10","k":"soft","t":"Geld ordnen","z":"⊚","x":"Das Portemonnaie aufräumen, die Scheine ordnen, einmal zählen. Ohne Sorge, nur wissen. Was geachtet wird, bleibt gern.","m":["zu"]},
    {"id":"s11","k":"soft","t":"Offene Hand","z":"☌","x":"Heute etwas geben, das nichts kostet: Zeit, ein Lob, den Vortritt. Eine Hand, die gibt, bleibt offen für das, was kommt."},
    {"id":"s12","k":"soft","t":"Barfuss","z":"▽","x":"Fünf Minuten barfuss stehen, auf Holz, Wiese oder Stein. Spüren, wo das Gewicht liegt. Erdung ist Fusssohle, kein Bild."},
    {"id":"s13","k":"soft","t":"Vier Atemzüge","z":"○","x":"Vier Takte ein, vier halten, vier aus. Das dreimal. Erst danach antworten oder entscheiden."},
    {"id":"s14","k":"soft","t":"Eine Schublade","z":"▦","x":"Eine Schublade, eine Ecke, ein Tisch: nur eins davon aufräumen, aber ganz. Wo Ordnung ist, fliesst es leichter."},
    {"id":"s15","k":"soft","t":"Schlafsegen","z":"☾","x":"Vor dem Einschlafen: Danke für heute. Was war, darf ruhen. Leg den Tag ab, bevor du das Licht löschst."},
    {"id":"s16","k":"soft","t":"Körper fragen","z":"☤","x":"Frag den Körper, was er braucht, und nimm die erste Antwort: trinken, gehen, ruhen. Der Arzt bleibt dabei."},
    {"id":"s17","k":"soft","t":"Freier Stuhl","z":"❀","x":"Liebe lädt man ein, man holt sie nicht. Mach Platz: ein freier Abend, ein offenes Ohr. Wer kommt, kommt freiwillig.","m":["neu","zu"]},
    {"id":"s18","k":"soft","t":"Eine Nachricht","z":"☍","x":"Schreib einem Menschen, der dir guttut. Ohne Anliegen, einfach so. Nähe wächst durch Kontakt, nicht durch Grübeln."},
    {"id":"s19","k":"soft","t":"Laut sprechen","z":"❝","x":"Sprich deinen Satz heute einmal in normaler Stimme. Nicht geflüstert, nicht gerufen. Was gesprochen ist, steht im Raum."},
    {"id":"s20","k":"soft","t":"Lüften","z":"☴","x":"Fenster auf, zehn Minuten. Alte Luft und alte Stimmung gehen zusammen hinaus. Danach tief einatmen: Das hier ist jetzt.","m":["ab"]},
    {"id":"s21","k":"soft","t":"Licht tanken","z":"☉","x":"Einmal heute ins Licht treten, Gesicht nach oben, drei Atemzüge. Kraft kommt nicht nur von innen."},
    {"id":"s22","k":"soft","t":"Zwei Minuten","z":"✲","x":"Das, was du aufschiebst: zwei Minuten davon, jetzt gleich. Nicht fertig machen, nur beginnen. Der Rest geht dann leichter.","m":["neu"]},
    {"id":"s23","k":"soft","t":"Freundliches Nein","z":"⬡","x":"Ein ruhiges Nein ist auch Schutz. Kurz, freundlich, ohne lange Begründung. Wer dich achtet, versteht es."},
    {"id":"s24","k":"soft","t":"Wie ein Freund","z":"♡","x":"Sei heute mit dir so geduldig wie mit einem guten Freund. Ein Fehler ist ein Schritt, kein Urteil."},
    {"id":"s25","k":"soft","t":"Fülle zählen","z":"✺","x":"Schreib auf, was schon da ist: Dach, Essen, Menschen, gesunde Hände. Fülle wächst, wenn du sie zählst, nicht wenn du sie jagst.","m":["voll"]},
    {"id":"s26","k":"soft","t":"Gute Fahrt","z":"⇝","x":"Vor dem Losfahren die Hand kurz aufs Lenkrad legen: Ich komme gut an. Dann fahren und nicht mehr daran denken."},
    {"id":"s27","k":"soft","t":"Haussegen","z":"⌂","x":"Geh durch jedes Zimmer und sag dort: Hier wohnt Frieden. Zuletzt an der Wohnungstür. Das Haus hört mit."},
    {"id":"s28","k":"soft","t":"Ein Lied","z":"♪","x":"Ein Lied, das dich aufrichtet, ganz hören. Nichts nebenher tun. Klang ist auch Arbeit, nur leichter."},
    {"id":"s29","k":"soft","t":"Zeigerpflanze","z":"✿","x":"Eine Pflanze giessen und ihr sagen, was bei dir wachsen soll. Nur diese eine. Sie wird dein Zeiger.","m":["zu"]},
    {"id":"s30","k":"soft","t":"Warme Hände","z":"❂","x":"Reib die Hände warm und leg sie dorthin, wo es zieht oder schmerzt. Eine Minute, ruhig atmen. Wärme ist die älteste Heilung."},
    {"id":"s31","k":"soft","t":"Bei dir bleiben","z":"⊕","x":"Zieht dich jemand in seine Geschichte, tritt innerlich einen Schritt zurück. Zuhören ja, mittragen nein."},
    {"id":"s32","k":"soft","t":"Nur zur Freude","z":"✶","x":"Tu heute eine Sache nur, weil sie dir Freude macht. Ohne Nutzen, ohne Plan. Freude hält das Feld weit."},
    {"id":"s33","k":"soft","t":"Gern gesehen","z":"❦","x":"Zieh heute etwas an, in dem du dich gern siehst. Wer sich selbst mag, strahlt es aus. Das ist schon Anziehung.","m":["zu","voll"]},
    {"id":"s34","k":"soft","t":"Still versöhnen","z":"∽","x":"Ein offener Streit? Du musst nicht anrufen. Wünsch dem anderen still das Gute. Für heute ist das genug."},
    {"id":"s35","k":"soft","t":"Stille Minuten","z":"▢","x":"Zehn Minuten ohne Bildschirm, Musik und Gespräch. Nur sitzen. In der Stille hörst du, was wirklich ansteht."},
    {"id":"s36","k":"soft","t":"Ernte aufschreiben","z":"❁","x":"Was hat sich seit dem letzten Vollmond gefügt? Schreib es auf, auch das Kleine. Ernte, die man nicht zählt, vergisst man.","m":["voll"]},
    {"id":"s37","k":"soft","t":"Samen im Dunkeln","z":"✱","x":"Ein neuer Wunsch, ein Satz, auf Papier. In eine Schublade legen und nicht täglich nachsehen. Samen keimen im Dunkeln.","m":["neu"]},
    {"id":"s38","k":"soft","t":"Weglassen","z":"◐","x":"Eine Gewohnheit, die dich Kraft kostet, heute einfach weglassen. Nur heute. Der abnehmende Mond nimmt sie gern mit.","m":["ab"]},
    {"id":"s39","k":"soft","t":"Kreis ziehen","z":"◎","x":"Mit dem Finger einen Kreis um dich zeichnen, im Uhrzeigersinn. Drinnen bist du, draussen der Lärm. Fünf Sekunden genügen."},
    {"id":"s40","k":"soft","t":"Gute Ahnen","z":"☥","x":"Denk an einen Menschen aus deiner Linie, der es gut mit dir meinte. Sag Danke. Seine Kraft darf helfen, seine Last bleibt bei ihm."},
    {"id":"s41","k":"soft","t":"Draussen gehen","z":"⚘","x":"Geh ein Stück ohne Ziel und schau, was blüht, was fällt, was ruht. Die Natur zeigt dir, welche Zeit gerade ist."},
    {"id":"s42","k":"soft","t":"Kleines Geschenk","z":"❖","x":"Bring heute jemandem eine Kleinigkeit mit: Kaffee, eine Blume, Schokolade. Venus liebt das Unerwartete.","m":["zu"]},
    {"id":"s43","k":"soft","t":"Aufrecht","z":"⇑","x":"Steh einen Moment ganz aufrecht, Scheitel zum Himmel, Füsse in den Boden. So sieht Vertrauen von aussen aus. Innen folgt es nach."},
    {"id":"s44","k":"soft","t":"Abenddank","z":"☆","x":"Am Abend einen Menschen nennen, der dir heute gutgetan hat. Vielleicht weiss er es nicht. Du darfst es ihm morgen sagen."},
    {"id":"s45","k":"soft","t":"Geld segnen","z":"✤","x":"Beim Bezahlen still sagen: Geh gut und komm vermehrt zurück. Geld fliesst lieber, wo es nicht festgehalten wird.","m":["zu"]},
    {"id":"s46","k":"soft","t":"Salzbad","z":"≋","x":"Abends eine Handvoll Salz ins Badewasser oder ins Fussbad. Was fremd war, fliesst ab. Danach ein Glas frisches Wasser.","m":["ab"]},
    {"id":"s47","k":"soft","t":"Freundlicher Blick","z":"❃","x":"Schau heute jemandem freundlich in die Augen, einen Moment länger als sonst. Ohne Absicht. Wärme spricht sich herum."},
    {"id":"s48","k":"soft","t":"Teepause","z":"∪","x":"Einen Tee kochen und ihn ohne Telefon trinken. Die Wärme in den Händen spüren. Kleine Pausen sind auch Schutz."},
    {"id":"s49","k":"soft","t":"Früh schlafen","z":"☽","x":"Heute eine halbe Stunde früher ins Bett. Der Körper arbeitet nachts für dich. Ausgeschlafen trägst du alles leichter.","m":["ab"]},
    {"id":"s50","k":"soft","t":"Stein in der Tasche","z":"⬢","x":"Einen kleinen Stein morgens bewusst einstecken. Wenn du ihn in der Tasche spürst, bist du wieder bei dir."},
    {"id":"s51","k":"soft","t":"Lachen","z":"❉","x":"Such dir heute einen Grund zu lachen, notfalls einen alten Film. Lachen löst, was Grübeln festhält."},
    {"id":"s52","k":"soft","t":"Um Hilfe bitten","z":"⋈","x":"Bitte heute jemanden um einen kleinen Gefallen. Nehmen gehört zum Fluss wie Geben. Wer nur gibt, staut."},
    {"id":"s53","k":"soft","t":"Namen segnen","z":"✾","x":"Sprich den Namen eines geliebten Menschen und häng einen Segen daran: Geh behütet. Mehr braucht es nicht."},
    {"id":"s54","k":"soft","t":"Schöner Tisch","z":"❧","x":"Deck heute den Tisch schön, auch wenn du allein isst. Eine Kerze, ein richtiger Teller. Du bist es wert.","m":["zu","voll"]},
    {"id":"f01","k":"feld","t":"Ein Satz","z":"✦","x":"Deine Absicht: ein Satz, in der Gegenwart, ohne »nicht«. Wenn du ihn nicht in einem Atemzug sagen kannst, ist er zu lang."},
    {"id":"f02","k":"feld","t":"Enter","z":"▷","x":"Enter ist der Moment, in dem du aufhörst zu planen und setzt. Ein Atemzug, ein innerer Klick. Ab da gilt es."},
    {"id":"f03","k":"feld","t":"Drei stehen","z":"∴","x":"Die ersten drei stellen den Satz auf. Langsam sprechen, jedes Wort mit Gewicht. Wer hier hetzt, baut auf Sand."},
    {"id":"f04","k":"feld","t":"Sechs tragen","z":"☷","x":"Die sechs tragen den Satz durch dich hindurch. Nicht mehr nachdenken, nur sprechen. Der Körper lernt mit."},
    {"id":"f05","k":"feld","t":"Neun siegeln","z":"⁂","x":"Mit der neunten Wiederholung ist der Satz aus deinen Händen. Kein zehntes Mal. Das Siegel hält von selbst."},
    {"id":"f06","k":"feld","t":"Der Beobachter","z":"◉","x":"Die Neun ist der, der zuschaut. Du sprichst, und ein Teil von dir sieht ruhig zu. Dieser Teil setzt nie nach."},
    {"id":"f07","k":"feld","t":"So sei es","z":"⊙","x":"Drei Worte, danach nichts mehr. Kein Nachsatz, kein Vielleicht. Das Feld braucht einen klaren Schluss."},
    {"id":"f08","k":"feld","t":"Es ist so","z":"≡","x":"Nicht »es wird«, sondern »es ist«. Wer in der Zukunft spricht, hält den Wunsch auf Abstand."},
    {"id":"f09","k":"feld","t":"Rückkehr","z":"↩\uFE0E","x":"Die Rückkehr ist der Riegel: Energie zurück zu dir, Hände waschen, etwas essen. Ohne sie bleibt eine Tür offen."},
    {"id":"f10","k":"feld","t":"Name und Datum","z":"▣","x":"Nach jeder Arbeit laut sagen: deinen Namen, das Datum, den Ort. Du bist hier, heute, ganz du. Damit ist zu."},
    {"id":"f11","k":"feld","t":"Nicht nachsetzen","z":"⊘","x":"Sprich den Satz nicht noch einmal, nur weil Zweifel kommt. Zweifel ist Wetter, keine Nachricht."},
    {"id":"f12","k":"feld","t":"Timing","z":"◔","x":"Nicht jede Stunde trägt gleich. Morgens setzen, abends danken, nachts ruhen. Wer den Moment wählt, braucht weniger Kraft."},
    {"id":"f13","k":"feld","t":"Brief einwerfen","z":"⇥","x":"Übergib den Auftrag wie einen Brief: einwerfen, loslassen, weitergehen. Niemand holt einen Brief zurück, um ihn nachzulesen."},
    {"id":"f14","k":"feld","t":"Einer zur Zeit","z":"Ⅰ","x":"Heute nur eine Arbeit. Zwei Wünsche in einem Ritual schwächen beide. Wähl den, der jetzt am meisten zählt."},
    {"id":"f15","k":"feld","t":"Stiller Tag","z":"◌","x":"Manche Tage sind zum Setzen da, andere zum Ruhen. Heute darf leer bleiben. Leere sammelt Kraft."},
    {"id":"f16","k":"feld","t":"Der Spieler","z":"♙","x":"Du bist der Spieler, nicht die Figur. Wird es eng, tritt heraus und schau aufs Brett. Von oben ist der nächste Zug klar."},
    {"id":"f17","k":"feld","t":"Der Schritt danach","z":"➶","x":"Nach dem Ritual einen kleinen Schritt im Alltag tun, der zum Satz passt. Das Feld öffnet die Tür, gehen musst du selbst."},
    {"id":"f18","k":"feld","t":"Ofen zu","z":"▯","x":"Was du gesetzt hast, braucht Zeit wie Brot im Ofen. Wer dauernd die Tür öffnet, lässt die Hitze hinaus."},
    {"id":"f19","k":"feld","t":"Neumond setzen","z":"●","x":"Neumond ist Aussaat. Absicht klar, Satz kurz, dann 3·6·9. Was jetzt gesetzt wird, wächst mit dem Licht.","m":["neu"]},
    {"id":"f20","k":"feld","t":"Vollmond ernten","z":"❍","x":"Vollmond ist Ernte, nicht Aussaat. Danken, zählen, abschliessen. Neues wartet auf den nächsten Neumond.","m":["voll"]},
    {"id":"e01","k":"echo","t":"Tag drei","z":"Ⅲ","x":"Am dritten Tag nur schauen: ein Anruf, ein Gefühl, ein Zufall? Aufschreiben, nicht deuten. Deuten kommt später."},
    {"id":"e02","k":"echo","t":"Tag neun","z":"Ⅸ","x":"Am neunten Tag die ehrliche Bilanz: wirkt, teilweise oder offen. Auch »offen« ist eine Antwort, mit der du arbeiten kannst."},
    {"id":"e03","k":"echo","t":"Eigene Augen","z":"◍","x":"Glaub nicht, was man dir erzählt, glaub, was du siehst. Notier heute ein Zeichen, das du selbst bemerkt hast."},
    {"id":"e04","k":"echo","t":"Leise Wirkung","z":"∿","x":"Wirkung kommt oft leise: besser geschlafen, weniger Streit, ein Weg wird frei. Achte heute auf das Kleine."},
    {"id":"e05","k":"echo","t":"Kein Echo","z":"◇","x":"Kam nichts zurück? Nicht lauter rufen. Prüf, ob der Satz klar war, und setz ihn beim nächsten passenden Mond neu."},
    {"id":"e06","k":"echo","t":"Chronik lesen","z":"▤","x":"Blättere in der Chronik zurück. Welche Arbeit hat bei dir am deutlichsten gewirkt? Dort liegt deine Stärke."},
    {"id":"e07","k":"echo","t":"Dazwischen","z":"∷","x":"Echo prüft man, man ruft es nicht herbei. Nur an Tag 3 und 9 hinschauen. Dazwischen einfach leben."},
    {"id":"e08","k":"echo","t":"Ein Satz ins Heft","z":"✎","x":"Schreib heute in einem Satz auf, wie es dir geht. In drei Wochen liest du nach und siehst, was sich wirklich verändert hat."},
    {"id":"e09","k":"echo","t":"Seitenweg","z":"↳","x":"Manchmal antwortet das Feld an anderer Stelle, als du gefragt hast. Schau auch daneben. Auch das ist Echo."},
    {"id":"e10","k":"echo","t":"Kreis schliessen","z":"↻","x":"Hat etwas gewirkt, dann einmal bewusst und laut danken. Dank schliesst den Kreis und macht den nächsten leichter.","m":["voll"]},
    {"id":"e11","k":"echo","t":"Vorher, nachher","z":"⇄","x":"Bevor du etwas setzt, schreib auf, wie es jetzt ist. Nur so erkennst du später, was sich bewegt hat."},
    {"id":"e12","k":"echo","t":"Muster erkennen","z":"※","x":"Wirkt es bei dir eher bei Neumond oder Vollmond, morgens oder abends? Die Chronik zeigt es dir nach ein paar Wochen."},
    {"id":"h01","k":"hard","t":"Feldgesetz","z":"⚖\uFE0E","x":"Jede harte Arbeit hat einen Preis, auch für dich. Frag vorher: gerecht, nötig, trage ich die Folgen? Drei Ja, sonst weich."},
    {"id":"h02","k":"hard","t":"Mit Mass","z":"⊞","x":"Hart heisst nicht masslos. Ein klarer Satz, eine Frist, ein Ende. Was ohne Mass gesetzt wird, kehrt ohne Mass zurück."},
    {"id":"h03","k":"hard","t":"Sauber schneiden","z":"⚔\uFE0E","x":"Vor dem Trennen genau benennen, was geht und was bleibt. Unscharf geschnitten wächst es wieder zusammen.","m":["ab"]},
    {"id":"h04","k":"hard","t":"Nicht im Zorn","z":"ϟ","x":"Wut ist Treibstoff, aber kein Steuer. Hartes nie am Tag des Streits. Eine Nacht schlafen, dann entscheiden."},
    {"id":"h05","k":"hard","t":"Zurück nach Hard","z":"↺","x":"Nach harter Arbeit: Salzwasser über die Hände, Name, Datum, etwas essen. Zurückkommen ist Pflicht, nicht Kür."},
    {"id":"h06","k":"hard","t":"Erst das eigene Feld","z":"△","x":"Bevor du nach aussen wirkst, schliess dein eigenes Feld. Wer offen wirkt, wird offen getroffen."},
    {"id":"h07","k":"hard","t":"Frist setzen","z":"⊠","x":"Harte Arbeit braucht ein Ablaufdatum, etwa bis zum nächsten Vollmond. Dann endet sie. Ohne Frist hängt sie an dir.","m":["voll"]},
    {"id":"h08","k":"hard","t":"Der Mond nimmt","z":"◑","x":"Abnehmender Mond trägt das Wegnehmen: Bänder lösen, Schaden stoppen. Gemessen, mit Gate und Rückkehr.","m":["ab"]},
    {"id":"h09","k":"hard","t":"Freier Wille","z":"☿","x":"Nichts über den freien Willen eines Menschen hinweg. Was nur mit Zwang hält, bricht und kommt zurück."},
    {"id":"h10","k":"hard","t":"Erst Diagnose","z":"◈","x":"Erst prüfen, dann handeln: Zieht es, steht es, ist es still? Wer ohne Diagnose hart arbeitet, trifft das Falsche."},
    {"id":"h11","k":"hard","t":"Gast mit Auftrag","z":"✵","x":"Eine Wesenheit bekommt Auftrag, Frist und Abschied. Danken und entlassen. Kein Gast bleibt über Nacht."},
    {"id":"h12","k":"hard","t":"Kurz und klar","z":"↯","x":"Hartes wirkt am besten kurz: hinein, setzen, heraus. Nicht darin verweilen und nicht nachsehen, ob es trifft."},
    {"id":"h13","k":"hard","t":"Wall statt Pfeil","z":"▥","x":"Läuft Schaden, zuerst stoppen, nicht strafen. Ein Wall, kein Pfeil. Meist reicht das schon."},
    {"id":"h14","k":"hard","t":"Keine Rache","z":"≠","x":"Ausgleich heisst: Was genommen wurde, kehrt zurück. Wie es den anderen trifft, ist nicht deine Sache."}
  ];
  var KIND={soft:"Soft",feld:"Feld",echo:"Echo",hard:"Hard"};
  var N=DECK.length, DAY=86400000;
  var A=new Date(2026,8,1,12).getTime();           /* Anker: 1. Sept. 2026, Mittag (sommerzeitfest) */

  function noon(ms){ var d=new Date(ms); return new Date(d.getFullYear(),d.getMonth(),d.getDate(),12).getTime(); }
  function dayIdx(ms){ return Math.round((noon(ms)-A)/DAY); }
  function dateOf(i){ return new Date(2026,8,1+i,12).getTime(); }
  function moonKey(ms){ try{ return window.RR25_MOND?window.RR25_MOND.day(ms).key:null; }catch(e){ return null; } }
  function rng(seed){ var a=seed>>>0; return function(){ a=(a+0x6D2B79F5)>>>0; var t=a; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296; }; }
  function weight(c,mk){ return (mk&&c.m&&c.m.indexOf(mk)>=0)?3:1; }
  function wpick(pool,mk,r){
    var sum=0,i; for(i=0;i<pool.length;i++) sum+=weight(pool[i],mk);
    var x=r()*sum; for(i=0;i<pool.length;i++){ x-=weight(pool[i],mk); if(x<0) return pool[i]; }
    return pool[pool.length-1];
  }

  /* Reihenfolge eines Durchgangs (N Tage): jede Karte genau einmal, Mondphase des Tages gewichtet.
     Auch über die Grenze zweier Durchgänge liegen mindestens N/3 Tage zwischen zwei gleichen Karten. */
  var cyc={};
  function cycle(c){
    if(cyc[c]) return cyc[c];
    var prev=null, G=Math.floor(N/3);
    if(c>0){ for(var k=Math.max(0,c-400);k<c;k++) cycle(k); prev=cyc[c-1]; }
    var r=rng(c*2654435761+0x2525), rest=DECK.slice(), out=[];
    for(var i=0;i<N;i++){
      var mk=moonKey(dateOf(c*N+i)), pool=rest;
      if(prev&&i<G){ /* Karten vom Ende des letzten Durchgangs frühestens nach G Tagen wieder */
        var late=prev.slice(N-G+i+1);
        var f=rest.filter(function(x){ return late.indexOf(x)<0; });
        if(f.length) pool=f;
      }
      var p=wpick(pool,mk,r); out.push(p); rest.splice(rest.indexOf(p),1);
    }
    return cyc[c]=out;
  }
  function todayCard(ms){
    var i=dayIdx(ms==null?Date.now():ms), c=Math.floor(i/N), pos=i-c*N;
    return cycle(c)[pos];
  }

  /* Ziehen und Legen: keine Doppelten in einer Legung, nie die Heute-Karte, kürzlich Gezogenes wird ausgelassen */
  var recent=[];
  function draw(n){
    var mk=moonKey(Date.now()), t=todayCard(), got=[];
    var avoid=recent.slice(-Math.floor(N/2));
    for(var j=0;j<n;j++){
      var pool=DECK.filter(function(c){ return c!==t && got.indexOf(c)<0 && avoid.indexOf(c)<0; });
      if(!pool.length) pool=DECK.filter(function(c){ return c!==t && got.indexOf(c)<0; });
      got.push(wpick(pool,mk,Math.random));
    }
    recent=recent.concat(got).slice(-N);
    return got;
  }

  function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;"); }
  function html(c,label){
    return '<div class="kcard ktone-'+c.k+'" data-kid="'+c.id+'"><span class="group">'+esc(label)+'</span><div class="kz">'+c.z+'</div><b>'+esc(c.t)+'</b><small>'+esc(c.x)+'</small></div>';
  }
  function go(id){
    document.querySelectorAll(".screen").forEach(function(s){ s.classList.toggle("on", s.id===id); });
    document.querySelectorAll("nav button").forEach(function(b){ b.classList.toggle("on", b.getAttribute("data-v")===id); });
    if(id==="drei") document.querySelectorAll("nav button").forEach(function(b){ b.classList.remove("on"); });
    try{ window.scrollTo(0,0); }catch(e){}
  }
  var shownDay=null;
  function showOne(){
    var out=document.getElementById("kOut"); if(!out) return;
    var c=todayCard(); shownDay=dayIdx(Date.now());
    out.innerHTML=html(c,"Heute");
    fit(out);
  }
  /* Sehr schmale Bildschirme oder grosse Systemschrift: Text in der Kachel etwas kleiner, nie abgeschnitten */
  function fit(out){
    var kc=out.querySelector(".kcard"), sm=kc&&kc.querySelector("small"); if(!sm) return;
    sm.style.fontSize="";
    var sizes=[.66,.62,.58,.54];
    for(var i=0;i<sizes.length&&over(kc);i++) sm.style.fontSize=sizes[i]+"rem";
  }
  function over(kc){
    if(!kc.clientHeight) return false;
    var r=kc.getBoundingClientRect(), a=kc.firstElementChild.getBoundingClientRect(), z=kc.lastElementChild.getBoundingClientRect();
    return kc.scrollHeight>kc.clientHeight+1||a.top<r.top+3||z.bottom>r.bottom-3;
  }
  window.addEventListener("resize",function(){ var o=document.getElementById("kOut"); if(o) fit(o); });
  var mode="drei";
  function frame(title,again){
    var sec=document.getElementById("drei"); if(!sec) return;
    var h=sec.querySelector(".hero h2"); if(h) h.textContent=title;
    var back=document.getElementById("dreiBack");
    var neu=document.getElementById("kNeu");
    if(!neu&&back&&back.parentNode){
      neu=document.createElement("button"); neu.type="button"; neu.id="kNeu"; neu.className="btn primary";
      back.parentNode.insertBefore(neu,back);
    }
    if(neu) neu.textContent=again;
  }
  function showZug(){
    mode="eine";
    var c=draw(1)[0], box=document.getElementById("dreiList");
    if(box) box.innerHTML=html(c,"Gezogen · "+KIND[c.k]);
    frame("Karte","Noch eine");
    go("drei");
  }
  function showDrei(){
    mode="drei";
    var d=draw(3), box=document.getElementById("dreiList");
    var pos=["Lage · steht","Block · zieht","Weg · still"];
    if(box) box.innerHTML=d.map(function(c,i){ return html(c,pos[i]+" · "+KIND[c.k]); }).join("");
    frame("Drei","Neu legen");
    go("drei");
  }
  document.addEventListener("click",function(e){
    var t=e.target; if(!t||!t.closest) return;
    if(t.closest("#kTag")) showZug();
    else if(t.closest("#kDrei")) showDrei();
    else if(t.closest("#kNeu")){ if(mode==="eine") showZug(); else showDrei(); }
    else if(t.closest("#dreiBack")) go("home");
  });
  document.addEventListener("visibilitychange",function(){
    if(document.visibilityState==="visible"&&shownDay!==dayIdx(Date.now())) showOne();
  });
  window.RR25_KARTEN={deck:DECK,today:todayCard,draw:draw,cycle:cycle,dayIdx:dayIdx,html:html,moon:moonKey,fit:fit};

  var s=document.createElement("style");
  s.textContent=[
    ".kcard{display:block;background:linear-gradient(185deg,rgba(70,24,90,.62),rgba(12,8,28,.92));border:1px solid rgba(255,122,217,.2);border-radius:1.15rem;padding:.9rem .85rem 1rem;margin:.48rem 0;text-align:center}",
    ".kcard .group{display:block;margin:0 0 .2rem}",
    ".kcard b{display:block;font-family:Georgia,serif;font-size:1.18rem;margin:.1rem 0 .35rem}",
    ".kcard small{display:block;color:#c4b4e0;line-height:1.4;font-size:.8rem}",
    ".kz{font-size:2.15rem;line-height:1;margin:.12rem 0 .32rem;color:#ff9ad8;text-shadow:0 0 14px rgba(255,122,217,.55),0 0 24px rgba(126,240,230,.25)}",
    "#kOut .kcard{height:100%;margin:0;padding:.5rem .42rem;display:flex;flex-direction:column;align-items:center;justify-content:center}",
    "#kOut .kcard b{font-size:1.02rem}",
    "#kOut .kcard small{font-size:.7rem;line-height:1.35}",
    "#dreiList .kcard{padding:1.05rem .95rem;border-left:5px solid transparent}",
    "#dreiList .kz{font-size:2.5rem}",
    "#dreiList .kcard small{font-size:.9rem;line-height:1.5}",
    ".ktone-soft{border-color:rgba(46,204,113,.45)}",
    ".ktone-soft .group,.ktone-soft b{color:#7dffb0}",
    ".ktone-hard{border-color:rgba(231,76,60,.5)}",
    ".ktone-hard .group,.ktone-hard b{color:#ff8a7a}",
    ".ktone-echo{border-color:rgba(93,173,226,.5)}",
    ".ktone-echo .group,.ktone-echo b{color:#8fd4ff}",
    ".ktone-feld{border-color:rgba(176,132,255,.5)}",
    ".ktone-feld .group,.ktone-feld b{color:#c9a8ff}",
    "#dreiList .ktone-soft{border-left-color:rgba(46,204,113,.75)}",
    "#dreiList .ktone-hard{border-left-color:rgba(231,76,60,.8)}",
    "#dreiList .ktone-echo{border-left-color:rgba(93,173,226,.8)}",
    "#dreiList .ktone-feld{border-left-color:rgba(176,132,255,.8)}",
    "#kasten{margin-bottom:.15rem}"
  ].join("");
  document.head.appendChild(s);
  showOne();
})();
