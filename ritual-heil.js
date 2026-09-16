(function(){
  var STEPS=[
    ["Vorbereitung",
      "Name oben eingeben. Auch der eigene Name geht.\nFoto wenn da: nur als Anker, dann umdrehen.\n\nTu:\nEine Kerze am Platz. Wasser danach.\n\nSprich:\nNur Heilung für [Name].\nArzt bleibt.\nKein Mehr.\nIch bleibe ich."],
    ["Ankommen",
      "Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler.\nDer Beobachter ist wach.\nIch richte mich auf [Name] aus, ohne [Name] zu werden."],
    ["Feld hart",
      "Tu:\nGrenze um den Körper. Einmal feststehen.\n\nSprich:\nIch schliesse mein Feld hart.\nNichts Fremdes hat Zutritt.\nMeine Energie gehört mir."],
    ["Ausrichten",
      "Tu:\n[Name] wahrnehmen, ohne die Krankheit zu werden.\n\nSprich:\nWärme ja. Übernehmen nein."],
    ["Rufen",
      "Tu:\nFeld bleibt hart. Einen Atem.\n\nSprich:\nDu bist da.\nIch führe.\nDu trägst nur die Heilung für [Name].\nKein Theater. Kein Sog. Kein Mehr."],
    ["Prüfen",
      "Tu:\nMitte spüren. Bei Nebel: Atem, Feld hart, warten.\nDann weiter.\n\nSprich:\nDie Mitte hält.\nIch gebe den Auftrag."],
    ["Auftrag geben",
      "Sprich:\nTrage die Heilung zu [Name].\nWas heilen darf, heilt.\nWas den Weg blockiert, darf sich lösen.\nKein Bleiben in [Name]. Kein Mehr.\nDanach gehst du vollständig."],
    ["Wort",
      "Sprich:\nDie Krankheit von [Name] findet jetzt natürliche, vollständige Heilung.\nAlles, was die Heilung behindert, löst sich.\nDu trägst. Ich führe.\nZum höchsten Wohl."],
    ["369",
      "Tu:\nZähler. Halte das Wort. Nicht neu setzen.\n\nDrei:\nDie Krankheit von [Name] heilt.\n\nSechs:\nAlles Störende löst sich.\n\nNeun:\nDie Heilung ist im Gange."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so."],
    ["Siegel",
      "Tu:\nHand vor die Flamme oder aufs Herz. Einen Atem.\n\nSprich:\nVersiegelt.\nDas Feld hat es."],
    ["Entlassen",
      "Tu:\nNicht nachwinken. Tor zu.\n\nSprich:\nDer Auftrag ist beendet.\nIch danke dir.\nDu bist frei.\nAlle Verbindungen lösen sich.\nDu bleibst nicht.\nIch schliesse das Tor."],
    ["Rückkehr",
      "Tu:\nHaut. Atem. Füsse. Raum.\n\nSprich:\nIch bin nicht [Name].\nIch bin nicht die Wesenheit.\nIch kehre vollständig zurück.\nMeine Energie gehört mir."],
    ["Schluss",
      "Sprich dreimal:\nDanke Gott.\nDanke Universum.\nDanke Energien.\nDanke Feld.\n\nTu:\nWasser. Alltag. Nicht nachkontrollieren."]
  ];
  if(typeof R==="undefined") return;
  var found=false;
  for(var i=0;i<R.length;i++){
    if(R[i].id==="heil"){
      R[i].t="Heilung";
      R[i].s="Ergänzung zur Medizin. Krankheit lösen.";
      R[i].tag="Energie";
      R[i].need=["Name"];
      R[i].steps=STEPS;
      found=true;
    }
  }
  if(!found){
    R.push({id:"heil",t:"Heilung",s:"Ergänzung zur Medizin. Krankheit lösen.",tag:"Energie",need:["Name"],steps:STEPS});
  }
  var run=document.getElementById("run");
  if(run && window.MutationObserver){
    new MutationObserver(function(){
      var h=run.querySelector("h2");
      var sub=run.querySelector(".sub");
      if(!h || !/Prüfen/i.test(h.textContent||"")) return;
      if(!sub || !/Heilung/i.test(sub.textContent||"")) return;
      var n=document.getElementById("pNein");
      var row=n && n.parentNode;
      if(row && row.classList && row.classList.contains("row")) row.remove();
    }).observe(run,{childList:true,subtree:true});
  }
})();
