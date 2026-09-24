(function(){
  var STEPS=[
    ["Vorbereitung",
      "Beide Namen oben eingeben.\nFoto wenn da: Anker, dann umdrehen.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur der Faden zwischen [A] und [B].\nIch bleibe ich.\nIch werde weder [A] noch [B]."],
    ["Standort",
      "Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage."],
    ["Feld hart",
      "Tu:\nGrenze um den Körper.\n\nSprich:\nIch schliesse mein Feld hart.\nMeine Energie gehört mir."],
    ["Ausrichten",
      "Tu:\n[A] und [B] wahrnehmen. Nicht werden.\n\nSprich:\nNur der Faden zwischen ihnen.\nNicht der zu mir."],
    ["Rufen",
      "Tu:\nEinen Atem. Mitte halten.\n\nSprich:\nDu bist da.\nIch führe.\nDu trägst nur die Bindung zwischen [A] und [B]."],
    ["Auftrag",
      "Sprich:\nBinde [A] und [B] aneinander.\nKein Bleiben in [A]. Kein Bleiben in [B].\nNur Bindung. Nur Weg.\nDanach gehst du vollständig."],
    ["Wort",
      "Sprich:\n[A] fühlt [B].\n[B] fühlt [A].\nDie Bindung sitzt.\nDer Weg zueinander zieht."],
    ["369",
      "Tu:\nZähler. Halte das Wort.\n\nDrei:\nDie Bindung sitzt.\n\nSechs:\nDer Weg zieht.\n\nNeun:\nEs ist gesetzt."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so."],
    ["Siegel",
      "Tu:\nHand aufs Herz. Einen Atem.\n\nSprich:\nVersiegelt."],
    ["Entlassen",
      "Sprich:\nAuftrag beendet.\nDu bist frei.\nTor zu."],
    ["Rückkehr",
      "Tu:\nHaut. Atem. Füsse.\n\nSprich:\nIch bin nicht [A].\nIch bin nicht [B].\nIch bin hier.\nFeld zu."],
    ["Schluss",
      "Sprich:\nDanke Feld.\n\nTu:\nWasser. Alltag."]
  ];
  if(typeof R==="undefined") return;
  for(var i=R.length-1;i>=0;i--) if(R[i].id==="anz") R.splice(i,1);
  var found=false;
  for(var j=0;j<R.length;j++){
    if(R[j].id==="liebe2"){
      R[j].t="Liebe zwei Personen";
      R[j].s="Ein Träger. Faden zwischen A und B.";
      R[j].tag="Liebe";
      R[j].need=["A","B"];
      R[j].steps=STEPS;
      found=true;
    }
  }
  if(!found){
    var at=-1;
    for(var k=0;k<R.length;k++) if(R[k].id==="liebe") at=k;
    var row={id:"liebe2",t:"Liebe zwei Personen",s:"Ein Träger. Faden zwischen A und B.",tag:"Liebe",need:["A","B"],steps:STEPS};
    if(at>=0) R.splice(at+1,0,row); else R.push(row);
  }
})();
