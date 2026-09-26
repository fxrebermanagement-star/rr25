(function(){
  var STEPS=[
    ["Vorbereitung",
      "Name oben.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nAusgleich mit [Name].\nIch bleibe ich."],
    ["Standort",
      "Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage."],
    ["Feld hart",
      "Sprich:\nIch schliesse mein Feld hart."],
    ["Ruf",
      "Tu:\nEinen Atem. Nicht fragen.\n\nSprich:\nDie Bahn trägt.\nIch führe.\nNur Ausgleich mit [Name]."],
    ["Auftrag",
      "Sprich einmal:\nTrage den Ausgleich mit [Name].\nEin Ende.\nDann gehst du."],
    ["Wort",
      "Sprich:\nWas zwischen mir und [Name] hängt, gleicht sich aus.\nDie Last geht."],
    ["369",
      "Tu:\nZähler.\n\nDrei:\nAusgleich läuft.\n\nSechs:\nLast geht.\n\nNeun:\nGesetzt."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so."],
    ["Siegel",
      "Sprich:\nVersiegelt.\nÜbergeben."],
    ["Rückkehr",
      "Sprich:\nIch bin nicht [Name].\nIch bin hier.\nFeld zu."],
    ["Schluss",
      "Sprich:\nDanke Feld.\n\nTu:\nWasser. Alltag."]
  ];
  if(typeof R==="undefined") return;
  var found=false;
  for(var i=0;i<R.length;i++){
    if(R[i].id==="karma"){
      R[i].t="Karma-Ausgleich"; R[i].s="Ausgleich mit Person X."; R[i].tag="Energie"; R[i].need=["Name"]; R[i].steps=STEPS; R[i]._ich=1; found=true;
    }
  }
  if(!found) R.push({id:"karma",t:"Karma-Ausgleich",s:"Ausgleich mit Person X.",tag:"Energie",need:["Name"],steps:STEPS,_ich:1});
})();
