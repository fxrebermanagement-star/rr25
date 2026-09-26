(function(){
  var STEPS=[
    ["Vorbereitung",
      "Beide Namen oben. Foto umdrehen.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur der Faden zwischen [A] und [B].\nIch werde weder [A] noch [B]."],
    ["Standort",
      "Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage."],
    ["Feld hart",
      "Sprich:\nIch schliesse mein Feld hart."],
    ["Ruf",
      "Tu:\nEinen Atem. Nicht fragen.\n\nSprich:\nDie Bahn trägt.\nIch führe.\nNur Bindung zwischen [A] und [B]."],
    ["Auftrag",
      "Sprich einmal:\nBinde [A] und [B].\nEin Ende.\nDann gehst du."],
    ["Wort",
      "Sprich:\n[A] fühlt [B].\n[B] fühlt [A].\nDie Bindung sitzt."],
    ["369",
      "Tu:\nZähler.\n\nDrei:\nDie Bindung sitzt.\n\nSechs:\nDer Weg zieht.\n\nNeun:\nGesetzt."],
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
  for(var i=R.length-1;i>=0;i--) if(R[i].id==="anz") R.splice(i,1);
  var found=false;
  for(var j=0;j<R.length;j++){
    if(R[j].id==="liebe2"){
      R[j].t="Liebe zwei Personen"; R[j].s="Ein Träger. Faden zwischen A und B."; R[j].tag="Liebe"; R[j].need=["A","B"]; R[j].steps=STEPS; R[j]._ich=1; found=true;
    }
  }
  if(!found){
    var at=-1;
    for(var k=0;k<R.length;k++) if(R[k].id==="liebe") at=k;
    var row={id:"liebe2",t:"Liebe zwei Personen",s:"Ein Träger. Faden zwischen A und B.",tag:"Liebe",need:["A","B"],steps:STEPS,_ich:1};
    if(at>=0) R.splice(at+1,0,row); else R.push(row);
  }
})();
