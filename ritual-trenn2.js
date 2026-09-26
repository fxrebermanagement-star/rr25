(function(){
  var STEPS=[
    ["Vorbereitung","Beide Namen. Foto umdrehen.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur der Faden zwischen [A] und [B]."],
    ["Standort","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage."],
    ["Mein Feld","Sprich:\nIch schliesse mein Feld hart."],
    ["Ruf","Tu:\nEinen Atem. Nicht fragen.\n\nSprich:\nDie Bahn trägt.\nIch führe.\nFaden [A] und [B]."],
    ["Auftrag","Sprich:\nTrenne den Faden zwischen [A] und [B].\nDie Bahn hält."],
    ["Wort","Sprich:\nDer Faden zwischen [A] und [B] löst sich."],
    ["369","Tu:\nZähler.\n\nDrei:\nLöst sich.\n\nSechs:\nGetrennt.\n\nNeun:\nVollzogen."],
    ["Es ist so","Sprich dreimal:\nEs ist so."],
    ["Rückkehr","Sprich:\nIch bin nicht [A].\nIch bin nicht [B].\nIch bin hier.\nFeld zu."],
    ["Siegel","Tu:\nAls du. Hand vor die Flamme.\n\nSprich:\nVersiegelt.\nÜbergeben."],
    ["Schluss","Sprich:\nDanke Feld.\n\nTu:\nWasser. Alltag."]
  ];
  if(typeof R==="undefined") return;
  var found=false;
  for(var i=0;i<R.length;i++){
    if(R[i].id==="trenn2"){
      R[i].t="Trennung zweier anderer"; R[i].s="Faden zwischen A und B."; R[i].tag="Trennung"; R[i].need=["A","B"]; R[i].steps=STEPS; R[i]._ich=1; found=true;
    }
  }
  if(!found) R.push({id:"trenn2",t:"Trennung zweier anderer",s:"Faden zwischen A und B.",tag:"Trennung",need:["A","B"],steps:STEPS,_ich:1});
})();
