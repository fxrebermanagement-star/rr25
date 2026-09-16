(function(){
  var STEPS=[
    ["Vorbereitung",
      "Name von [Name] oben eingeben.\nFoto wenn da: nur als Anker, dann umdrehen. Sonst reicht der Name.\n\nTu:\nEine Kerze anzünden.\nWasser danach bereitstellen.\n\nSprich:\nNur Schutz für [Name].\nKein Mehr.\nIch bleibe ich.\n[Name] bleibt [Name]."],
    ["Ankommen",
      "Tu:\nFüsse auf den Boden. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler.\nDer Beobachter ist wach.\nIch richte mich auf [Name] aus, ohne [Name] zu werden."],
    ["Feld hart",
      "Tu:\nGrenze um den Körper. Einmal feststehen.\n\nSprich:\nIch schliesse mein Feld hart.\nNichts Fremdes hat Zutritt.\nMeine Energie gehört mir."],
    ["Ausrichten",
      "Tu:\n[Name] wahrnehmen, ohne [Name] zu werden.\n\nSprich:\nWärme ja. Verschmelzen nein.\nZugang nur so weit, wie der Schutz braucht."],
    ["Rufen",
      "Tu:\nFeld bleibt hart. Einen Atem.\n\nSprich:\nDu bist da.\nIch führe.\nDu trägst nur den Schutz für [Name].\nKein Theater. Kein Sog. Kein Mehr."],
    ["Prüfen",
      "Tu:\nMitte spüren. Klar oder Nebel. Druck oder Ruhe.\nBei Nebel: einen Atem. Feld nochmals hart. Warten, bis es still ist.\nDann weiter.\n\nSprich:\nDie Mitte hält.\nIch gebe den Auftrag."],
    ["Auftrag geben",
      "Sprich:\nTrage den Schutz zu [Name].\nDas Feld von [Name] bleibt klar und geschlossen.\nKein Bleiben in [Name]. Kein Mehr.\nDanach gehst du vollständig."],
    ["Wort",
      "Sprich:\nDas Feld von [Name] wird klar und geschützt.\nDie Energie bleibt bei [Name].\nAlles Ziehende prallt ab.\nDu trägst. Ich führe."],
    ["369",
      "Tu:\nZähler. Halte das Wort. Nicht neu setzen.\n\nDrei:\nDie Energie von [Name] ist geschützt.\n\nSechs:\nDas Feld von [Name] bleibt klar und geschlossen.\n\nNeun:\n[Name] ist in der Kraft."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so."],
    ["Siegel",
      "Tu:\nHand kurz vor die Flamme oder flach aufs Herz. Einen Atem.\n\nSprich:\nVersiegelt.\nDas Feld hat es."],
    ["Entlassen",
      "Tu:\nNicht nachwinken. Tor zu.\n\nSprich:\nDer Auftrag ist beendet.\nIch danke dir.\nDu bist frei.\nAlle Verbindungen lösen sich.\nDu bleibst nicht.\nIch schliesse das Tor."],
    ["Rückkehr",
      "Tu:\nHaut. Atem. Füsse. Raum.\n\nSprich:\nIch bin nicht [Name].\nIch bin nicht die Wesenheit.\nIch kehre vollständig in mich zurück.\nMeine Energie gehört mir."],
    ["Schluss",
      "Sprich dreimal:\nDanke Gott.\nDanke Universum.\nDanke Energien.\nDanke Feld.\n\nTu:\nWasser. Alltag. Nicht nachkontrollieren."]
  ];
  if(typeof R==="undefined") return;
  var found=false;
  for(var i=0;i<R.length;i++){
    if(R[i].id==="schutz2"){
      R[i].t="Schutz für eine andere Person";
      R[i].s="Feld von Person X schützen. Ruf.";
      R[i].tag="Schutz";
      R[i].need=["Name"];
      R[i].steps=STEPS;
      found=true;
    }
  }
  if(!found){
    R.push({id:"schutz2",t:"Schutz für eine andere Person",s:"Feld von Person X schützen. Ruf.",tag:"Schutz",need:["Name"],steps:STEPS});
  }
  var run=document.getElementById("run");
  if(run && window.MutationObserver){
    new MutationObserver(function(){
      var h=run.querySelector("h2");
      var sub=run.querySelector(".sub");
      if(!h || !/Prüfen/i.test(h.textContent||"")) return;
      if(!sub || !/Schutz für eine andere/i.test(sub.textContent||"")) return;
      var n=document.getElementById("pNein");
      var row=n && n.parentNode;
      if(row && row.classList && row.classList.contains("row")) row.remove();
    }).observe(run,{childList:true,subtree:true});
  }
})();
