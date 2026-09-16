(function(){
  var STEPS=[
    ["Vorbereitung",
      "Name von [Name] oben eingeben.\n\nTu:\nEine Kerze anzünden.\nWasser danach bereitstellen.\n\nSprich:\nNur Stopp. Nur Distanz.\nNur [Name].\nKein Nachsetzen."],
    ["Ankommen",
      "Tu:\nFüsse auf den Boden. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler.\nDer Beobachter ist wach.\nIch bleibe ich.\n[Name] bleibt [Name]."],
    ["Feld hart",
      "Tu:\nGrenze um den Körper. Einmal feststehen.\n\nSprich:\nIch schliesse mein Feld hart.\nNichts Fremdes hat Zutritt.\nMeine Energie gehört mir."],
    ["Lage",
      "Sprich:\nSchaden von [Name] endet hier.\nIch halte das auf.\nOhne Hass.\nOhne mich zu verlieren."],
    ["Rufen",
      "Tu:\nFeld bleibt hart. Einen Atem.\n\nSprich:\nWer klar, erkennbar und für diesen Stopp geeignet ist, darf sich zeigen.\nKein Theater. Kein Sog."],
    ["Prüfen",
      "Tu:\nMitte spüren. Klar oder Nebel. Druck oder Ruhe.\nBei Nebel: einen Atem. Feld nochmals hart. Warten, bis es still ist.\nDann weiter.\n\nSprich:\nDie Mitte hält.\nIch gebe den Auftrag."],
    ["Auftrag geben",
      "Sprich:\nTrage den Stopp gegen [Name].\nNur [Name]. Nur Stopp. Ein Ende.\nKein Mehr. Kein eigener Krieg.\nDanach gehst du vollständig."],
    ["Wort",
      "Sprich:\nJeder Angriff von [Name] auf mich stoppt jetzt.\nDie Bahn ist zu.\nDu trägst. Ich führe.\nDer Zugriff fällt ab."],
    ["369",
      "Tu:\nZähler. Halte das Wort. Nicht neu setzen.\n\nDrei:\nDer Schaden stoppt.\n\nSechs:\nDer Zugriff fällt ab.\n\nNeun:\nIch bin frei und geschützt."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so."],
    ["Siegel",
      "Tu:\nHand kurz vor die Flamme oder flach aufs Herz. Einen Atem.\n\nSprich:\nVersiegelt.\nDas Feld hat es."],
    ["Entlassen",
      "Tu:\nNicht nachwinken. Tor zu.\n\nSprich:\nDer Auftrag ist beendet.\nIch danke dir.\nDu bist frei.\nAlle Verbindungen lösen sich.\nDu bleibst nicht.\nIch schliesse das Tor."],
    ["Rückkehr",
      "Tu:\nHaut. Atem. Füsse. Raum.\n\nSprich:\nIch bin nicht [Name].\nIch bin nicht die Wesenheit.\nIch kehre vollständig zurück.\nMeine Energie gehört mir."],
    ["Schluss",
      "Sprich dreimal:\nDanke Gott.\nDanke Universum.\nDanke Energien.\nDanke Feld.\n\nSprich:\nKein zweites Ritual aus Unruhe heute.\n\nTu:\nWasser. Alltag. Nicht nachkontrollieren."]
  ];
  if(typeof R==="undefined") return;
  var found=false;
  for(var i=0;i<R.length;i++){
    if(R[i].id==="stopp"){
      R[i].t="Schaden stoppen";
      R[i].s="Angriff endet. Ruf. Feld zu.";
      R[i].tag="Schutz";
      R[i].need=["Name"];
      R[i].steps=STEPS;
      found=true;
    }
  }
  if(!found){
    R.push({id:"stopp",t:"Schaden stoppen",s:"Angriff endet. Ruf. Feld zu.",tag:"Schutz",need:["Name"],steps:STEPS});
  }
  var run=document.getElementById("run");
  if(run && window.MutationObserver){
    new MutationObserver(function(){
      var h=run.querySelector("h2");
      var sub=run.querySelector(".sub");
      if(!h || !/Prüfen/i.test(h.textContent||"")) return;
      if(!sub || !/Schaden stoppen/i.test(sub.textContent||"")) return;
      var n=document.getElementById("pNein");
      var j=document.getElementById("pJa");
      var row=n && n.parentNode;
      if(row && row.classList && row.classList.contains("row")) row.remove();
      else { if(n) n.remove(); if(j) j.remove(); }
    }).observe(run,{childList:true,subtree:true});
  }
})();
