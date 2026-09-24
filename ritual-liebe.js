(function(){
  var STEPS=[
    ["Vorbereitung",
      "Name oben eingeben.\nFoto wenn da: Anker, dann umdrehen. Erst dann weiter.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur Bindung auf [Name].\nIch bleibe ich.\n[Name] bleibt [Name]."],
    ["Standort",
      "Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage."],
    ["Feld hart",
      "Tu:\nGrenze um den Körper.\n\nSprich:\nIch schliesse mein Feld hart.\nMeine Energie gehört mir."],
    ["Ausrichten",
      "Tu:\n[Name] wahrnehmen. Nicht werden.\n\nSprich:\nIch richte auf [Name].\nKein Verschmelzen."],
    ["Rufen",
      "Tu:\nEinen Atem. Mitte halten.\n\nSprich:\nDu bist da.\nIch führe.\nDu trägst nur Bindung und Weg zu [Name]."],
    ["Auftrag",
      "Sprich:\nBinde [Name] an den Weg zu mir.\nKein Bleiben in [Name].\nNur Bindung. Nur Weg.\nDanach gehst du vollständig."],
    ["Wort",
      "Sprich:\nDie Bindung sitzt.\nDer Weg zu mir zieht.\nDie Nähe geschieht."],
    ["369",
      "Tu:\nZähler. Halte das Wort.\n\nDrei:\nDie Bindung sitzt.\n\nSechs:\nDer Weg zieht.\n\nNeun:\nEs ist gesetzt."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so."],
    ["Siegel",
      "Tu:\nHand aufs Herz. Einen Atem.\n\nSprich:\nVersiegelt."],
    ["Entlassen",
      "Sprich:\nAuftrag beendet.\nDu bist frei.\nTor zu."],
    ["Rückkehr",
      "Tu:\nHaut. Atem. Füsse.\n\nSprich:\nIch bin nicht [Name].\nIch bin hier.\nFeld zu."],
    ["Schluss",
      "Sprich:\nDanke Feld.\n\nTu:\nWasser. Alltag."]
  ];
  if(typeof R==="undefined") return;
  for(var i=R.length-1;i>=0;i--) if(R[i].id==="liebezw") R.splice(i,1);
  var found=false;
  for(var j=0;j<R.length;j++){
    if(R[j].id==="liebe"){
      R[j].t="Liebesritual";
      R[j].s="Ich bleibe ich. Bindung auf [Name].";
      R[j].tag="Liebe";
      R[j].need=["Name"];
      R[j].steps=STEPS;
      found=true;
    }
  }
  if(!found) R.push({id:"liebe",t:"Liebesritual",s:"Ich bleibe ich. Bindung auf [Name].",tag:"Liebe",need:["Name"],steps:STEPS});
})();
