(function(){
  var STEPS=[
    ["Vorbereitung",
      "Name von [Name] oben eingeben.\nFoto wenn da: Anker, dann umdrehen.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur [Name].\nNur Kontakt.\nKeine Last.\nIch bleibe ich."],
    ["Ankommen",
      "Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler.\nDer Beobachter ist wach."],
    ["Feld hart",
      "Tu:\nGrenze um den Körper. Einmal feststehen.\n\nSprich:\nIch schliesse mein Feld hart.\nLast bleibt draussen.\nMeine Energie gehört mir."],
    ["Ausrichten",
      "Tu:\n[Name] ehren, ohne [Name] zu werden.\n\nSprich:\nLinie ja.\nMuster nein, die nicht mehr tragen."],
    ["Rufen",
      "Tu:\nFeld bleibt hart. Einen Atem. Mitte halten.\n\nSprich:\n[Name], du bist da.\nIch führe.\nIch möchte verstehen, nicht übernehmen."],
    ["Auftrag geben",
      "Sprich:\nNur zeigen, was ich tragen darf.\nKeine Last in mein Leben.\nKein Bleiben in mir.\nDanach gehst du in Frieden."],
    ["Wort",
      "Sprich:\nIch ehre dich und die Linie.\nIch gehöre mir selbst.\nUngesunde Muster lasse ich nicht in mein Leben."],
    ["369",
      "Tu:\nZähler. Halte das Wort. Nicht neu setzen.\n\nDrei:\nDer Kontakt ist klar begrenzt.\n\nSechs:\nDie Last bleibt draussen.\n\nNeun:\nIch gehöre mir."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so."],
    ["Siegel",
      "Tu:\nHand aufs Herz. Einen Atem.\n\nSprich:\nVersiegelt.\nDas Feld hat es."],
    ["Entlassen",
      "Tu:\nNicht nachwinken. Tor zu.\n\nSprich:\nDanke [Name].\nDu kannst in Frieden gehen.\nIch schliesse den Kontakt.\nAlle Verbindungen lösen sich."],
    ["Rückkehr",
      "Tu:\nHaut. Atem. Füsse. Raum.\n\nSprich:\nIch bin nicht [Name].\nIch kehre vollständig zurück.\nMeine Energie gehört mir."],
    ["Schluss",
      "Sprich dreimal:\nDanke Gott.\nDanke Universum.\nDanke Energien.\nDanke Feld.\n\nTu:\nWasser. Alltag."]
  ];
  if(typeof R==="undefined") return;
  var found=false;
  for(var i=0;i<R.length;i++){
    if(R[i].id==="ahn"){
      R[i].t="Ahnen rufen";
      R[i].s="Ehren, begrenzen, Auftrag.";
      R[i].tag="Feld";
      R[i].need=["Name"];
      R[i].steps=STEPS;
      found=true;
    }
  }
  if(!found) R.push({id:"ahn",t:"Ahnen rufen",s:"Ehren, begrenzen, Auftrag.",tag:"Feld",need:["Name"],steps:STEPS});
})();
