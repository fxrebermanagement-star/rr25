(function(){
  var STEPS=[
    ["Vorbereitung",
      "Name von [Name] oben eingeben.\nFoto wenn da: Anker, dann umdrehen.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur Segen auf [Name].\nGabe, kein Handel.\nIch bleibe ich."],
    ["Ankommen",
      "Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler.\nDer Beobachter ist wach."],
    ["Feld hart",
      "Tu:\nGrenze um den Körper. Einmal feststehen.\n\nSprich:\nIch schliesse mein Feld hart.\nIch gebe Wort, nicht mich."],
    ["Ausrichten",
      "Tu:\n[Name] wahrnehmen, ohne [Name] zu werden.\n\nSprich:\nWärme ja. Verschmelzen nein.\nDer Segen geht zu [Name]. Ich bleibe hier."],
    ["Rufen",
      "Tu:\nFeld bleibt hart. Einen Atem.\n\nSprich:\nDu bist da.\nIch führe.\nDu trägst nur den Segen zu [Name].\nKein Theater. Kein Sog. Kein Mehr."],
    ["Auftrag geben",
      "Sprich:\nTrage den Segen zu [Name].\nRein. Ohne Bindung.\nKein Bleiben in [Name].\nDanach gehst du vollständig."],
    ["Wort",
      "Sprich:\nIch lege Segen auf [Name].\nSchutz um den Körper.\nKlarheit im Kopf.\nWeg unter den Füssen.\nWas stimmig ist, darf wachsen.\nLast und fremder Zugriff bleiben draussen.\nDu trägst. Ich führe."],
    ["369",
      "Tu:\nZähler. Halte das Wort. Nicht neu setzen.\n\nDrei:\n[Name] ist gesegnet und gehalten.\n\nSechs:\nDer Segen sitzt und bleibt rein.\n\nNeun:\nDas Wort ist gelegt."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so."],
    ["Siegel",
      "Tu:\nHand aufs Herz. Einen Atem.\n\nSprich:\nVersiegelt.\nDas Feld hat es."],
    ["Entlassen",
      "Tu:\nNicht nachwinken. Tor zu.\n\nSprich:\nDer Auftrag ist beendet.\nIch danke dir.\nDu bist frei.\nAlle Verbindungen lösen sich.\nDu bleibst nicht.\nIch schliesse das Tor."],
    ["Rückkehr",
      "Tu:\nHaut. Atem. Füsse. Raum.\n\nSprich:\nIch bin nicht [Name].\nIch bin nicht die Wesenheit.\nIch kehre vollständig zurück.\nDer Segen bleibt bei [Name].\nMeine Energie gehört mir."],
    ["Schluss",
      "Sprich dreimal:\nDanke Gott.\nDanke Universum.\nDanke Energien.\nDanke Feld.\n\nTu:\nWasser. Alltag. Nicht nachkontrollieren."]
  ];
  if(typeof R==="undefined") return;
  var found=false;
  for(var i=0;i<R.length;i++){
    if(R[i].id==="segen"){
      R[i].t="Segen";
      R[i].s="Wort legen. Gabe, kein Handel.";
      R[i].tag="Person X";
      R[i].need=["Name"];
      R[i].steps=STEPS;
      found=true;
    }
  }
  if(!found) R.push({id:"segen",t:"Segen",s:"Wort legen. Gabe, kein Handel.",tag:"Person X",need:["Name"],steps:STEPS});
})();
