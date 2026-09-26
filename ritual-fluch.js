(function(){
  var STEPS=[
    ["Vorbereitung",
      "Name oben.\n\nTu:\nEine Kerze. Wasser danach.\nFoto noch nicht."],
    ["Schutz",
      "Tu:\nFüsse. Drei Atemzüge.\nGrenze um DICH.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch schliesse mein Feld hart."],
    ["Foto",
      "Tu:\nJetzt Foto. Kurz Anker.\nDann umdrehen. Bleibt unten."],
    ["Auftrag",
      "Tu:\nNoch du. Dein Satz.\n\nSprich jetzt den Auftrag."],
    ["Ich bin",
      "Tu:\nName laut.\n\nSprich:\nIch bin [Name]."],
    ["369",
      "Tu:\nZähler. Noch [Name].\n\nDrei:\n[Name]\n\nSechs:\nDer Auftrag.\n\nNeun:\nEs ist gesetzt."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so."],
    ["Rückkehr",
      "Tu:\nRaus. Haut. Atem. Füsse.\n\nSprich:\nIch bin wieder ich.\nIch bin nicht [Name].\nIch bin hier."],
    ["Feld hart",
      "Tu:\nGrenze um DICH.\n\nSprich:\nIch schliesse mein Feld hart."],
    ["Schluss",
      "Tu:\nWasser. Foto bleibt unten. Alltag."]
  ];
  if(typeof R==="undefined") return;
  var found=false;
  for(var i=0;i<R.length;i++){
    if(R[i].id==="fluch"){
      R[i].t="Fluch"; R[i].s="Schutz. Auftrag. Ich bin. 369. Raus. Feld hart."; R[i].tag="Person X"; R[i].need=["Name"]; R[i].steps=STEPS; R[i]._ich=1; found=true;
    }
  }
  if(!found) R.push({id:"fluch",t:"Fluch",s:"Schutz. Auftrag. Ich bin. 369. Raus. Feld hart.",tag:"Person X",need:["Name"],steps:STEPS,_ich:1});
})();
