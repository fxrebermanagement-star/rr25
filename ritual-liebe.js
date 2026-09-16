(function(){
  var STEPS=[
    ["Vorbereitung",
      "Name von [Name] oben eingeben.\nFoto wenn da: Anker, dann umdrehen.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nLiebe und Bindung auf [Name].\nHart. Klar.\nIch bleibe ich.\n[Name] bleibt [Name]."],
    ["Ankommen",
      "Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler.\nDer Beobachter ist wach."],
    ["Feld hart",
      "Tu:\nGrenze um den Körper. Einmal feststehen.\n\nSprich:\nIch schliesse mein Feld hart.\nNichts Fremdes hat Zutritt.\nMeine Energie gehört mir."],
    ["Ausrichten",
      "Tu:\n[Name] wahrnehmen, ohne [Name] zu werden.\n\nSprich:\nIch richte fest auf [Name].\nKein Verschmelzen."],
    ["Rufen",
      "Tu:\nFeld bleibt hart. Einen Atem. Mitte halten.\n\nSprich:\nDu bist da.\nIch führe.\nDu trägst nur Bindung und Weg zu [Name].\nKein Theater. Kein Sog. Kein Mehr."],
    ["Auftrag geben",
      "Sprich:\nBinde [Name] an den Weg zu mir.\nDie Anziehung hält.\nDer Kontakt findet mich.\nKein Bleiben in [Name].\nKein Zerlegen des Lebens.\nNur Bindung. Nur Weg.\nDanach gehst du vollständig."],
    ["Wort",
      "Sprich:\n[Name] fühlt die Bindung.\n[Name] denkt an mich.\nDer Weg zu mir steht offen und zieht.\nDie Nähe geschieht.\nDu trägst. Ich führe."],
    ["369",
      "Tu:\nZähler. Halte das Wort. Nicht neu setzen.\n\nDrei:\nDie Bindung sitzt.\n\nSechs:\nDer Weg zieht [Name] zu mir.\n\nNeun:\nEs ist gesetzt."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so."],
    ["Siegel",
      "Tu:\nHand vor die Flamme oder aufs Herz. Einen Atem.\n\nSprich:\nVersiegelt.\nDas Feld hat es."],
    ["Entlassen",
      "Tu:\nNicht nachwinken. Tor zu.\n\nSprich:\nDer Auftrag ist beendet.\nIch danke dir.\nDu bist frei.\nAlle Verbindungen lösen sich.\nDu bleibst nicht.\nIch schliesse das Tor."],
    ["Rückkehr",
      "Tu:\nHaut. Atem. Füsse. Raum.\n\nSprich:\nIch bin nicht [Name].\nIch bin nicht die Wesenheit.\nIch kehre vollständig zurück.\nMeine Energie gehört mir."],
    ["Schluss",
      "Sprich dreimal:\nDanke Gott.\nDanke Universum.\nDanke Energien.\nDanke Feld.\n\nSprich:\nKein zweites Ritual aus Unruhe heute.\n\nTu:\nWasser. Alltag. Nicht nachkontrollieren."]
  ];
  if(typeof R==="undefined") return;
  function put(id,t,s){
    var found=false;
    for(var i=0;i<R.length;i++){
      if(R[i].id===id){
        R[i].t=t; R[i].s=s; R[i].tag="Liebe"; R[i].need=["Name"]; R[i].steps=STEPS; found=true;
      }
    }
    if(!found) R.push({id:id,t:t,s:s,tag:"Liebe",need:["Name"],steps:STEPS});
  }
  put("liebe","Liebesritual","Hart. Bindung auf Person X.");
  put("liebezw","Liebesritual Bindung","Hart. Bindung auf Person X.");
})();
