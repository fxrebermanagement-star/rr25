(function(){
  var STEPS=[
    ["Vorbereitung",
      "Beide Namen oben eingeben.\nFoto wenn da: Anker, dann umdrehen.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nBindung zwischen [A] und [B].\nHart. Klar.\nIch bleibe ich.\nIch werde weder [A] noch [B]."],
    ["Ankommen",
      "Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler.\nDer Beobachter ist wach."],
    ["Feld hart",
      "Tu:\nGrenze um den Körper. Einmal feststehen.\n\nSprich:\nIch schliesse mein Feld hart.\nNichts Fremdes hat Zutritt.\nMeine Energie gehört mir."],
    ["Ausrichten",
      "Tu:\n[A] und [B] wahrnehmen, ohne sie zu werden.\n\nSprich:\nNur der Faden zwischen ihnen.\nNicht der zu mir."],
    ["Rufen",
      "Tu:\nFeld bleibt hart. Einen Atem. Mitte halten.\n\nSprich:\nDu bist da.\nIch führe.\nDu trägst nur die Bindung zwischen [A] und [B].\nKein Theater. Kein Sog. Kein Mehr."],
    ["Auftrag geben",
      "Sprich:\nBinde [A] und [B] aneinander.\nDie Anziehung zwischen ihnen hält.\nDer Weg zueinander steht.\nKein Bleiben in [A]. Kein Bleiben in [B].\nKein Zerlegen ihrer Leben darüber hinaus.\nNur Bindung. Nur Weg.\nDanach gehst du vollständig."],
    ["Wort",
      "Sprich:\n[A] fühlt [B].\n[B] fühlt [A].\nDie Bindung sitzt.\nDer Weg zueinander zieht.\nDu trägst. Ich führe."],
    ["369",
      "Tu:\nZähler. Halte das Wort. Nicht neu setzen.\n\nDrei:\nDie Bindung zwischen [A] und [B] sitzt.\n\nSechs:\nDer Weg zueinander zieht.\n\nNeun:\nEs ist gesetzt."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so."],
    ["Siegel",
      "Tu:\nHand vor die Flamme oder aufs Herz. Einen Atem.\n\nSprich:\nVersiegelt.\nDas Feld hat es."],
    ["Entlassen",
      "Tu:\nNicht nachwinken. Tor zu.\n\nSprich:\nDer Auftrag ist beendet.\nIch danke dir.\nDu bist frei.\nAlle Verbindungen lösen sich.\nDu bleibst nicht.\nIch schliesse das Tor."],
    ["Rückkehr",
      "Tu:\nHaut. Atem. Füsse. Raum.\n\nSprich:\nIch bin nicht [A].\nIch bin nicht [B].\nIch bin nicht die Wesenheit.\nIch kehre vollständig zurück.\nMeine Energie gehört mir."],
    ["Schluss",
      "Sprich dreimal:\nDanke Gott.\nDanke Universum.\nDanke Energien.\nDanke Feld.\n\nSprich:\nKein zweites Ritual aus Unruhe heute.\n\nTu:\nWasser. Alltag. Nicht nachkontrollieren."]
  ];
  if(typeof R==="undefined") return;
  for(var i=R.length-1;i>=0;i--) if(R[i].id==="anz") R.splice(i,1);
  var found=false;
  for(var j=0;j<R.length;j++){
    if(R[j].id==="liebe2"){
      R[j].t="Liebe zwei Personen";
      R[j].s="Bindung zwischen A und B.";
      R[j].tag="Liebe";
      R[j].need=["A","B"];
      R[j].steps=STEPS;
      found=true;
    }
  }
  if(!found){
    var at=-1;
    for(var k=0;k<R.length;k++) if(R[k].id==="liebe") at=k;
    var row={id:"liebe2",t:"Liebe zwei Personen",s:"Bindung zwischen A und B.",tag:"Liebe",need:["A","B"],steps:STEPS};
    if(at>=0) R.splice(at+1,0,row); else R.push(row);
  }
  if(typeof renderList==="function") renderList();
})();
