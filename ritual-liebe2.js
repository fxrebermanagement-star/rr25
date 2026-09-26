(function(){
  var STEPS=[
    ["Vorbereitung","Beide Namen. Foto umdrehen.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur der Faden zwischen [A] und [B].\nIch werde weder [A] noch [B]."],
    ["Standort","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage."],
    ["Mein Feld","Sprich:\nIch schliesse mein Feld hart."],
    ["Ruf","Tu:\nEinen Atem. Nicht fragen.\n\nSprich:\nDie Bahn trägt.\nIch führe.\nBindung [A] und [B]."],
    ["Auftrag","Sprich:\nBinde [A] und [B].\nDie Bahn hält."],
    ["Wort","Sprich:\n[A] fühlt [B].\n[B] fühlt [A].\nDie Bindung sitzt."],
    ["369","Tu:\nZähler.\n\nDrei:\nBindung sitzt.\n\nSechs:\nWeg zieht.\n\nNeun:\nGesetzt."],
    ["Es ist so","Sprich dreimal:\nEs ist so."],
    ["Rückkehr","Sprich:\nIch bin nicht [A].\nIch bin nicht [B].\nIch bin hier.\nFeld zu."],
    ["Siegel","Tu:\nAls du. Hand vor die Flamme.\n\nSprich:\nVersiegelt.\nÜbergeben.\nEs läuft."],
    ["Schluss","Sprich:\nDanke Feld.\n\nTu:\nWasser. Alltag."]
  ];
  if(typeof R==="undefined") return;
  for(var i=R.length-1;i>=0;i--) if(R[i].id==="anz") R.splice(i,1);
  var found=false;
  for(var j=0;j<R.length;j++){
    if(R[j].id==="liebe2"){
      R[j].t="Liebe zwei Personen"; R[j].s="Faden zwischen A und B."; R[j].tag="Liebe"; R[j].need=["A","B"]; R[j].steps=STEPS; R[j]._ich=1; found=true;
    }
  }
  if(!found) R.push({id:"liebe2",t:"Liebe zwei Personen",s:"Faden zwischen A und B.",tag:"Liebe",need:["A","B"],steps:STEPS,_ich:1});
})();
