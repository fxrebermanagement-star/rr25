(function(){
  function put(r){
    for(var i=R.length-1;i>=0;i--) if(R[i].id===r.id) R.splice(i,1);
    R.push(r);
  }
  put({id:"ueber",t:"Person übernehmen",s:"Person X für Aufgabe X",tag:"Person X",need:["Name","Auftrag"],steps:[
    ["Vorbereitung","Name von Person X klar aufschreiben oder laut sagen.\nAufgabe in einem einzigen Satz. Nicht drei Aufträge.\nHandy stumm und weg. Tür zu wenn möglich.\nEigenes Feld zuerst schliessen: Füsse, drei Atemzüge, Schutz.\nFoto nur als Anker, dann zudecken oder umdrehen.\nKerze optional. Salz. Wasser danach bereitstellen.\nWesenheit: nur wenn die Aufgabe ohne sie nicht sitzt. Sonst ohne.\nDu übernimmst für die Aufgabe, nicht für immer. Nicht für das ganze Leben von [Name]."],
    ["Ankommen","Stelle dich oder setze dich. Füsse auf den Boden. Knie locker.\nDrei ruhige Atemzüge. Einatmen durch die Nase, ausatmen länger.\nIch bin der Spieler, nicht die Spielfigur.\nDer Beobachter ist wach.\nIch handle aus klarer Mitte.\nIch bleibe ich. [Name] bleibt [Name].\nKein Verschmelzen. Kein Sog."],
    ["Rahmen","Ich öffne diesen Raum nur für die Übernahme von [Name].\nNur diese Aufgabe:\n[Auftrag]\nKein Auftrag darüber hinaus.\nKein Unbeteiligter. Kein Nachsatz. Kein Bleiben.\nDie Übernahme endet, wenn die Aufgabe erfüllt ist oder wenn ich schliesse."],
    ["Ausrichten","[Name] wahrnehmen, ohne [Name] zu werden.\nGesicht, Stimme, Bahn — nur so weit, wie die Aufgabe braucht.\nZugang suchen. Druck vermeiden.\nWenn es zieht oder neblig wird: einen Schritt zurück in den eigenen Körper."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur so:\nEigenes Feld bleibt geschlossen.\nWer klar, erkennbar und für diese eine Aufgabe geeignet ist, darf sich zeigen.\nPrüfen: Mitte da? Klar oder Nebel? Druck oder Ruhe?\nBei Druck, Theater, Sog: sofort schliessen, ohne Auftrag.\nAuftrag nur: hilf, dass [Name] die Aufgabe [Auftrag] trägt, bis sie erfüllt ist. Dann gehst du vollständig."],
    ["Wort","Ich übernehme [Name] für die Aufgabe.\nWille, Bahn und Handeln von [Name] richten sich auf:\n[Auftrag]\nZugang nur so weit, wie die Aufgabe braucht.\nKein Mehr. Kein Besitz. Kein Bleiben in [Name]."],
    ["369","Sprich jede Zeile vollständig. Zwischen den Runden ein Atem. Zähler unten.\n\nDrei Mal:\nIch übernehme [Name] für die Aufgabe.\nIch übernehme [Name] für die Aufgabe.\nIch übernehme [Name] für die Aufgabe.\n\nSechs Mal:\nDer Wille von [Name] hält bei der Aufgabe.\nDer Wille von [Name] hält bei der Aufgabe.\nDer Wille von [Name] hält bei der Aufgabe.\nDer Wille von [Name] hält bei der Aufgabe.\nDer Wille von [Name] hält bei der Aufgabe.\nDer Wille von [Name] hält bei der Aufgabe.\n\nNeun Mal:\nDie Aufgabe läuft. Es ist so.\nDie Aufgabe läuft. Es ist so.\nDie Aufgabe läuft. Es ist so.\nDie Aufgabe läuft. Es ist so.\nDie Aufgabe läuft. Es ist so.\nDie Aufgabe läuft. Es ist so.\nDie Aufgabe läuft. Es ist so.\nDie Aufgabe läuft. Es ist so.\nDie Aufgabe läuft. Es ist so."],
    ["Grenze","Kein Bleiben in [Name].\nKein zweites Ritual aus Unruhe.\nWenn die Aufgabe erfüllt ist, fällt die Übernahme von selbst.\nWenn du schliesst, fällt sie jetzt."],
    ["Entlassen","Falls eine Wesenheit da war:\nDer Auftrag ist beendet. Ich danke dir.\nDu bist frei. Löse alle Verbindungen zu mir und zu [Name].\nIch schliesse den Kontakt."],
    ["Rückkehr","Ich bin nicht [Name].\nIch kehre vollständig in mich zurück.\nHaut, Atem, Füsse, Raum.\nMeine Energie gehört mir.\nWas nicht meins ist, geht.\nSo sei es.\nErden. Wasser trinken. Alltag. Nicht nachkontrollieren."]
  ]});
  put({id:"segen",t:"Segen",s:"Für Person X. Wort legen.",tag:"Person X",need:["Name"],steps:[
    ["Vorbereitung","Name von Person X klar. Optional Foto nur als Anker, dann weglegen.\nHandy stumm und weg. Ungestörter Platz.\nEigenes Feld zuerst schliessen.\nKerze wenn da. Salz. Wasser danach.\nRitualbuch darf daneben liegen.\nKein Hass im Mund. Kein Handel. Segen ist Gabe.\nWesenheit nur wenn der Segen ohne sie nicht sitzt. Sonst ohne."],
    ["Ankommen","Stelle dich oder setze dich. Füsse auf den Boden.\nSchultern fallen lassen. Kiefer lösen.\nDrei ruhige Atemzüge. Nichts hetzen.\nIch bin der Spieler, nicht die Spielfigur.\nDer Beobachter ist wach.\nIch handle aus klarer Mitte.\nIch gebe Wort, nicht mich."],
    ["Rahmen","Ich öffne diesen Raum nur für Segen auf [Name].\nNur das Stimmige und Reine darf hier sein.\nUnklares, Ziehendes, Fremdes bleibt draussen.\nKein Auftrag über den Segen hinaus."],
    ["Ausrichten","[Name] wahrnehmen, ohne [Name] zu werden.\nWärme ja. Verschmelzen nein.\nIch bleibe in meiner Mitte.\nDer Segen geht zu [Name]. Ich bleibe hier."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur so:\nFilter zuerst. Nur klare, stimmige Präsenz.\nAuftrag: trage den Segen zu [Name] und geh danach vollständig.\nBei Druck oder Nebel: ohne Wesenheit weitermachen."],
    ["Wort","Ich lege Segen auf [Name].\nSchutz um den Körper.\nKlarheit im Kopf.\nWeg unter den Füssen.\nWas stimmig ist, darf wachsen.\nWas zieht, Last und fremder Zugriff bleiben draussen.\nDer Segen ist rein. Er bindet nicht. Er hält."],
    ["369","Sprich jede Zeile vollständig. Zwischen den Runden ein Atem. Zähler unten.\n\nDrei Mal:\n[Name] ist gesegnet und gehalten.\n[Name] ist gesegnet und gehalten.\n[Name] ist gesegnet und gehalten.\n\nSechs Mal:\nDer Segen sitzt, wirkt und bleibt rein.\nDer Segen sitzt, wirkt und bleibt rein.\nDer Segen sitzt, wirkt und bleibt rein.\nDer Segen sitzt, wirkt und bleibt rein.\nDer Segen sitzt, wirkt und bleibt rein.\nDer Segen sitzt, wirkt und bleibt rein.\n\nNeun Mal:\nDas Wort ist gelegt. Es ist so.\nDas Wort ist gelegt. Es ist so.\nDas Wort ist gelegt. Es ist so.\nDas Wort ist gelegt. Es ist so.\nDas Wort ist gelegt. Es ist so.\nDas Wort ist gelegt. Es ist so.\nDas Wort ist gelegt. Es ist so.\nDas Wort ist gelegt. Es ist so.\nDas Wort ist gelegt. Es ist so."],
    ["Siegel","Optional Hand aufs Herz oder eine Prise Salz.\nDer Segen ist gegeben.\nNicht nachkontrollieren.\nNicht aus Unruhe wiederholen."],
    ["Entlassen","Falls eine Wesenheit da war:\nDanke. Der Auftrag ist erfüllt.\nDu gehst vollständig. Alle Fäden lösen sich.\nIch schliesse den Kontakt."],
    ["Rückkehr","Ich bin nicht [Name].\nIch kehre vollständig in mich zurück.\nMeine Energie gehört mir.\nDer Segen bleibt bei [Name].\nSo sei es.\nErden. Wasser. Alltag."]
  ]});
  put({id:"fluch",t:"Fluch",s:"Gegen Person X. Wort setzen.",tag:"Person X",need:["Name"],steps:[
    ["Vorbereitung","Name von Person X klar. Handy weg.\nEigenes Feld zuerst schliessen — ohne das kein Weiter.\nKerze optional. Salz. Siegelzeichen wenn du eines hast.\nWasser danach bereit.\nFoto nur als Anker, nicht als Fessel, dann weglegen.\nDu weisst, dass dies ein Fluch ist. Kein Theater.\nKeine Wut als Steuer. Wut macht 6 ohne 9.\nWesenheit nur wenn das Wort allein nicht reicht. Sonst ohne.\nMass setzen: nur [Name], nur Begrenzung und Rückgabe, ein Ende."],
    ["Ankommen","Füsse auf den Boden. Drei Atemzüge.\nIch bin der Spieler, nicht die Spielfigur.\nDer Beobachter ist wach.\nIch öffne nur für dieses eine Wort auf [Name].\nIch bleibe in meiner Mitte. Ich werde nicht zum Werkzeug."],
    ["Rahmen","Nur [Name]. Nur das gesetzte Mass.\nKein Auftrag auf Unbeteiligte.\nKein unendliches Nachsetzen.\nDie Arbeit hat ein Ende.\nWas gesetzt wird: Begrenzung und Rückgabe. Nicht blinder Hass."],
    ["Lage","[Name] steht im Wort.\nOhne mich zu verlieren. Ohne [Name] zu werden.\nDie Bahn von [Name] wahrnehmen, soweit nötig.\nIch bleibe der Spieler."],
    ["Wesenheit","Ohne Wesenheit weiter zum Wort.\nMit Wesenheit nur so:\nFilter hart. Nur klare, begrenzbare Präsenz.\nPrüfen: Mitte da? Klar oder Nebel?\nBei Drängen, Theater, Sog: sofort schliessen.\nAuftrag nur: trage das gesetzte Wort zu [Name], begrenze die Bahn, dann geh vollständig.\nKein eigener Krieg. Kein Mehr."],
    ["Wort","Ich setze den Fluch auf [Name].\nDie Bahn von [Name] gegen mich, mein Haus und meine Leute bricht.\nWas von [Name] als Schaden ausgeht, kehrt zur Quelle.\nDer Zugriff fällt ab und findet keinen Halt.\nDas Wort sitzt. Das Wort ist begrenzt. Das Wort hat ein Ende."],
    ["369","Sprich jede Zeile vollständig. Zwischen den Runden ein Atem. Zähler unten.\n\nDrei Mal:\nDas Wort sitzt auf [Name].\nDas Wort sitzt auf [Name].\nDas Wort sitzt auf [Name].\n\nSechs Mal:\nDie Bahn von [Name] ist begrenzt und kehrt zurück.\nDie Bahn von [Name] ist begrenzt und kehrt zurück.\nDie Bahn von [Name] ist begrenzt und kehrt zurück.\nDie Bahn von [Name] ist begrenzt und kehrt zurück.\nDie Bahn von [Name] ist begrenzt und kehrt zurück.\nDie Bahn von [Name] ist begrenzt und kehrt zurück.\n\nNeun Mal:\nDer Fluch ist gesetzt und geschlossen. Es ist so.\nDer Fluch ist gesetzt und geschlossen. Es ist so.\nDer Fluch ist gesetzt und geschlossen. Es ist so.\nDer Fluch ist gesetzt und geschlossen. Es ist so.\nDer Fluch ist gesetzt und geschlossen. Es ist so.\nDer Fluch ist gesetzt und geschlossen. Es ist so.\nDer Fluch ist gesetzt und geschlossen. Es ist so.\nDer Fluch ist gesetzt und geschlossen. Es ist so.\nDer Fluch ist gesetzt und geschlossen. Es ist so."],
    ["Siegel","Salz oder Siegelzeichen.\nEinmal setzen. Abgeben.\nNicht aus Unruhe wiederholen.\nDie Arbeit ist geschlossen."],
    ["Entlassen","Falls eine Wesenheit da war:\nDer Auftrag ist beendet. Ich danke dir.\nDu bist frei. Alle Verbindungen lösen sich.\nDu bleibst nicht. Ich schliesse den Kontakt."],
    ["Rückkehr","Ich bin nicht [Name].\nIch kehre vollständig in mich zurück.\nHaut, Atem, Füsse, Raum.\nMeine Energie gehört mir.\nDer Auftrag endet hier.\nSo sei es.\nErden. Wasser. Alltag. Nicht nachsetzen."]
  ]});
  if(typeof fill==="function"){
    var _f=fill;
    fill=function(s,m){ return _f(s,m).split("[Auftrag]").join((m&&m.Auftrag)||"[Auftrag]"); };
  }
  renderList=function(){
    var order=["Alltag","Schutz","Energie","Liebe","Trennung","Person X","Feld"];
    var cats=document.getElementById("cats");
    var list=document.getElementById("list");
    if(!cats||!list) return;
    cats.innerHTML=["Alle"].concat(order).map(function(x){
      return '<button class="chip'+(x===cat?' on':'')+'" data-cat="'+x+'">'+x+'</button>';
    }).join("");
    cats.querySelectorAll("[data-cat]").forEach(function(b){
      b.onclick=function(){ cat=b.getAttribute("data-cat"); renderList(); };
    });
    var items=R.filter(function(r){ return cat==="Alle"||r.tag===cat; });
    var g={};
    items.forEach(function(r){ (g[r.tag]=g[r.tag]||[]).push(r); });
    list.innerHTML=Object.keys(g).sort(function(a,b){ return order.indexOf(a)-order.indexOf(b); }).map(function(k){
      return '<p class="group">'+k+'</p>'+g[k].map(function(r){
        return '<button class="card" data-id="'+r.id+'"><b>'+r.t+'</b><small>'+r.s+'</small></button>';
      }).join("");
    }).join("");
    list.querySelectorAll(".card").forEach(function(b){
      b.onclick=function(){ fromPlan=null; openR(b.getAttribute("data-id")); };
    });
    cats.querySelectorAll('[data-cat="Alle"],[data-cat="Alltag"]').forEach(function(n){ n.remove(); });
  };
  renderList();
})();
