(function(){
  var STEPS=[
    ["Vorbereitung",
      "Name oben. Foto umdrehen. Bleibt unten.\n\nTu:\nEine Kerze. Wasser danach."],
    ["Standort",
      "Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage.\nNoch nicht [Name]."],
    ["Mein Feld",
      "Tu:\nGrenze um DICH. Bevor du gehst.\n\nSprich:\nIch schliesse mein Feld hart."],
    ["Ruf",
      "Tu:\nEinen Atem. Nicht fragen.\n\nSprich:\nDie Bahn trägt.\nIch führe."],
    ["Versetzen",
      "Tu:\nFoto unten. Name laut.\n\nSprich:\nIch bin [Name].\nNur für dieses Wort."],
    ["Auftrag",
      "Tu:\nVon innen. Dein Satz.\nKein Roman.\n\nSprich jetzt."],
    ["Wort",
      "Tu:\nVon innen. Das Wort, das du kennst.\nDie Bahn hält.\nNicht zum Träger.\n\nSprich jetzt."],
    ["369",
      "Tu:\nZähler. Noch [Name]. Nicht Feld schliessen.\nWort halten. Nicht neu erfinden."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so."],
    ["Rückkehr",
      "Tu:\nSofort raus. Haut. Atem. Füsse.\n\nSprich:\nIch bin wieder ich.\nIch bin nicht [Name].\nIch bin hier.\nFeld zu."],
    ["Siegel",
      "Tu:\nAls du. Hand vor die Flamme.\n\nSprich:\nVersiegelt.\nÜbergeben.\nEs läuft."],
    ["Schluss",
      "Tu:\nWasser. Alltag.\nFoto bleibt unten."]
  ];
  if(typeof R==="undefined") return;
  var found=false;
  for(var i=0;i<R.length;i++){
    if(R[i].id==="fluch"){
      R[i].t="Fluch"; R[i].s="Gerüst. Wort im Mund."; R[i].tag="Person X"; R[i].need=["Name"]; R[i].steps=STEPS; R[i]._ich=1; found=true;
    }
  }
  if(!found) R.push({id:"fluch",t:"Fluch",s:"Gerüst. Wort im Mund.",tag:"Person X",need:["Name"],steps:STEPS,_ich:1});
})();
