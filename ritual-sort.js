(function(){
  var SEGEN=[
    ["Vorbereitung","Name und Wofür oben eingeben.\nWofür: ein Satz. Nicht drei Wünsche.\nFoto wenn da: Anker, dann umdrehen.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur Segen auf [Name].\nNur [Wofür].\nGabe, kein Handel.\nIch bleibe ich."],
    ["Ankommen","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler.\nDer Beobachter ist wach."],
    ["Feld hart","Tu:\nGrenze um den Körper. Einmal feststehen.\n\nSprich:\nIch schliesse mein Feld hart.\nIch gebe Wort, nicht mich."],
    ["Ausrichten","Tu:\n[Name] wahrnehmen, ohne [Name] zu werden.\n\nSprich:\nWärme ja. Verschmelzen nein.\nDer Segen geht zu [Name]. Ich bleibe hier."],
    ["Rufen","Tu:\nFeld bleibt hart. Einen Atem.\n\nSprich:\nDu bist da.\nIch führe.\nDu trägst nur den Segen [Wofür] zu [Name].\nKein Theater. Kein Sog. Kein Mehr."],
    ["Auftrag geben","Sprich:\nTrage zu [Name] nur [Wofür].\nRein. Ohne Bindung.\nKein Bleiben in [Name].\nDanach gehst du vollständig."],
    ["Wort","Sprich:\nIch lege Segen auf [Name].\nWofür: [Wofür].\nDas darf wachsen.\nLast und Zugriff bleiben draussen.\nDer Segen bindet nicht.\nDu trägst. Ich führe."],
    ["369","Tu:\nZähler. Halte das Wort. Nicht neu setzen.\n\nDrei:\nDer Segen sitzt auf [Name].\n\nSechs:\n[Wofür] darf wachsen.\n\nNeun:\nDas Wort ist gelegt."],
    ["Es ist so","Sprich dreimal:\nEs ist so."],
    ["Siegel","Tu:\nHand aufs Herz. Einen Atem.\n\nSprich:\nVersiegelt.\nDas Feld hat es."],
    ["Entlassen","Tu:\nNicht nachwinken. Tor zu.\n\nSprich:\nDer Auftrag ist beendet.\nIch danke dir.\nDu bist frei.\nAlle Verbindungen lösen sich.\nDu bleibst nicht.\nIch schliesse das Tor."],
    ["Rückkehr","Tu:\nHaut. Atem. Füsse. Raum.\n\nSprich:\nIch bin nicht [Name].\nIch bin nicht die Wesenheit.\nIch kehre vollständig zurück.\nDer Segen bleibt bei [Name].\nMeine Energie gehört mir."],
    ["Schluss","Sprich dreimal:\nDanke Gott.\nDanke Universum.\nDanke Energien.\nDanke Feld.\n\nTu:\nWasser. Alltag. Nicht nachkontrollieren."]
  ];
  var FLUCH=[
    ["Vorbereitung","Name von [Name] oben eingeben.\nFoto wenn da: Anker, dann umdrehen.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur [Name].\nNur das Wort.\nKein Nachsetzen.\nIch bleibe ich."],
    ["Ankommen","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler.\nDer Beobachter ist wach.\nWut steuert nicht."],
    ["Feld hart","Tu:\nGrenze um den Körper. Einmal feststehen.\n\nSprich:\nIch schliesse mein Feld hart.\nNichts Fremdes hat Zutritt.\nMeine Energie gehört mir."],
    ["Lage","Sprich:\n[Name] steht im Wort.\nOhne [Name] zu werden.\nOhne mich zu verlieren."],
    ["Rufen","Tu:\nFeld bleibt hart. Einen Atem.\n\nSprich:\nDu bist da.\nIch führe.\nDu trägst nur das Wort auf [Name].\nKein Theater. Kein Sog. Kein Mehr."],
    ["Auftrag geben","Sprich:\nTrage das Wort zu [Name]. Hart.\nKein Ausweichen.\nKein eigener Krieg.\nKein Bleiben in [Name].\nDanach gehst du vollständig."],
    ["Wort","Sprich:\nIch setze das Wort hart auf [Name].\nDie Bahn von [Name] gegen mich bricht und bleibt gebrochen.\nJedes Ausweichen fällt.\nWas [Name] als Schaden setzt, kehrt vollständig zur Quelle.\nKein Halt. Kein Zugang. Kein Nachsatz zu mir.\nDu trägst. Ich führe."],
    ["369","Tu:\nZähler. Halte das Wort. Nicht neu setzen.\n\nDrei:\nDas Wort sitzt hart auf [Name].\n\nSechs:\nDie Bahn ist zu. Die Rückgabe läuft.\n\nNeun:\nGeschlossen. Es bleibt gesetzt."],
    ["Es ist so","Sprich dreimal:\nEs ist so."],
    ["Siegel","Tu:\nHand vor die Flamme oder aufs Herz. Einen Atem.\n\nSprich:\nVersiegelt.\nAbgegeben.\nGeschlossen."],
    ["Entlassen","Tu:\nNicht nachwinken. Tor zu.\n\nSprich:\nDer Auftrag ist beendet.\nIch danke dir.\nDu bist frei.\nAlle Verbindungen lösen sich.\nDu bleibst nicht.\nIch schliesse das Tor."],
    ["Rückkehr","Tu:\nHaut. Atem. Füsse. Raum.\n\nSprich:\nIch bin nicht [Name].\nIch bin nicht die Wesenheit.\nIch kehre vollständig zurück.\nMeine Energie gehört mir."],
    ["Schluss","Sprich dreimal:\nDanke Gott.\nDanke Universum.\nDanke Energien.\nDanke Feld.\n\nSprich:\nKein zweites Ritual aus Unruhe heute.\n\nTu:\nWasser. Alltag. Nicht nachsetzen."]
  ];
  function go(){
    if(typeof R==="undefined") return;
    var hasS=false, hasF=false;
    for(var i=R.length-1;i>=0;i--){
      var r=R[i];
      if(r.id==="finst" || r.id==="fremd") R.splice(i,1);
      else if(r.id==="schaden"){ r.tag="Person X"; r.t="Schadenszauber"; r.s="Vorhanden. Nicht Pflicht."; }
      else if(r.id==="wesen"){ r.t="Wesenheit für Auftrag"; r.s="Kontakt mit Auftrag. Mass halten."; r.tag="Feld"; }
      else if(r.id==="segen"){
        hasS=true;
        r.t="Segen"; r.s="Ein Name. Ein Satz Wofür."; r.tag="Person X";
        r.need=["Name","Wofür"]; r.steps=SEGEN;
      }
      else if(r.id==="fluch"){
        hasF=true;
        r.t="Fluch"; r.s="Hart. Wort auf Person X."; r.tag="Person X";
        r.need=["Name"]; r.steps=FLUCH;
      }
    }
    if(!hasS) R.push({id:"segen",t:"Segen",s:"Ein Name. Ein Satz Wofür.",tag:"Person X",need:["Name","Wofür"],steps:SEGEN});
    if(!hasF) R.push({id:"fluch",t:"Fluch",s:"Hart. Wort auf Person X.",tag:"Person X",need:["Name"],steps:FLUCH});
    if(typeof renderList==="function") renderList();
  }
  go();
  setTimeout(go,200);
  setTimeout(go,900);
  setTimeout(go,2000);
})();
