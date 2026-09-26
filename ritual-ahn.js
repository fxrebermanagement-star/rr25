(function(){
  var STEPS=[
    ["Vorbereitung","Name oben. Foto umdrehen.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur [Name].\nIch bleibe ich."],
    ["Standort","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage."],
    ["Mein Feld","Sprich:\nIch schliesse mein Feld hart."],
    ["Ruf","Tu:\nEinen Atem. Nicht fragen.\n\nSprich:\nDie Bahn trägt.\nIch führe.\nLinie [Name]."],
    ["Auftrag","Sprich:\nZeig was tragen darf.\nDie Bahn hält."],
    ["Wort","Sprich:\nIch ehre die Linie.\nIch gehöre mir."],
    ["369","Tu:\nZähler.\n\nDrei:\nKontakt klar.\n\nSechs:\nLinie trägt.\n\nNeun:\nIch gehöre mir."],
    ["Es ist so","Sprich dreimal:\nEs ist so."],
    ["Rückkehr","Sprich:\nDanke [Name].\nIch bin nicht [Name].\nIch bin hier.\nFeld zu."],
    ["Siegel","Tu:\nAls du. Hand vor die Flamme.\n\nSprich:\nVersiegelt."],
    ["Schluss","Sprich:\nDanke Feld.\n\nTu:\nWasser. Alltag."]
  ];
  if(typeof R==="undefined") return;
  var found=false;
  for(var i=0;i<R.length;i++){
    if(R[i].id==="ahn"){
      R[i].t="Ahnen rufen"; R[i].s="Linie. Auftrag. Zu."; R[i].tag="Feld"; R[i].need=["Name"]; R[i].steps=STEPS; R[i]._ich=1; found=true;
    }
  }
  if(!found) R.push({id:"ahn",t:"Ahnen rufen",s:"Linie. Auftrag. Zu.",tag:"Feld",need:["Name"],steps:STEPS,_ich:1});
})();
