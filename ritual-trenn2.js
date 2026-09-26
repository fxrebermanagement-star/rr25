(function(){
  var STEPS=[
    ["Vorbereitung",
      "Beide Namen oben. Foto umdrehen.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur der Faden zwischen [A] und [B].\nIch werde weder [A] noch [B]."],
    ["Standort",
      "Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage."],
    ["Feld hart",
      "Sprich:\nIch schliesse mein Feld hart."],
    ["Ruf",
      "Tu:\nEinen Atem. Nicht fragen.\n\nSprich:\nDie Bahn trägt.\nIch führe.\nNur der Faden zwischen [A] und [B]."],
    ["Auftrag",
      "Sprich einmal:\nTrenne den Faden zwischen [A] und [B].\nEin Ende.\nDann gehst du."],
    ["Wort",
      "Sprich:\nDer Faden zwischen [A] und [B] löst sich.\nJeder steht wieder allein."],
    ["369",
      "Tu:\nZähler.\n\nDrei:\nDer Faden löst sich.\n\nSechs:\nGetrennt.\n\nNeun:\nVollzogen."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so."],
    ["Siegel",
      "Sprich:\nVersiegelt.\nÜbergeben."],
    ["Rückkehr",
      "Sprich:\nIch bin nicht [A].\nIch bin nicht [B].\nIch bin hier.\nFeld zu."],
    ["Schluss",
      "Sprich:\nDanke Feld.\n\nTu:\nWasser. Alltag."]
  ];
  if(typeof R==="undefined") return;
  var found=false;
  for(var i=0;i<R.length;i++){
    if(R[i].id==="trenn2"){
      R[i].t="Trennung zweier anderer"; R[i].s="Nur der Faden zwischen A und B."; R[i].tag="Trennung"; R[i].need=["A","B"]; R[i].steps=STEPS; R[i]._ich=1; found=true;
    }
  }
  if(!found){
    var at=-1;
    for(var j=0;j<R.length;j++) if(R[j].id==="trenn") at=j;
    var row={id:"trenn2",t:"Trennung zweier anderer",s:"Nur der Faden zwischen A und B.",tag:"Trennung",need:["A","B"],steps:STEPS,_ich:1};
    if(at>=0) R.splice(at+1,0,row); else R.push(row);
  }
})();
