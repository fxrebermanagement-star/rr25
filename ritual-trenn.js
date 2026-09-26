(function(){
  var STEPS=[
    ["Vorbereitung",
      "Name oben. Foto: Anker, umdrehen.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur der Faden zu [Name].\nIch bleibe ich."],
    ["Standort",
      "Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage."],
    ["Feld hart",
      "Sprich:\nIch schliesse mein Feld hart."],
    ["Ruf",
      "Tu:\nEinen Atem. Nicht fragen.\n\nSprich:\nDie Bahn trägt.\nIch führe.\nNur Trennung des Fadens zu [Name]."],
    ["Auftrag",
      "Sprich einmal:\nTrenne den Faden zwischen mir und [Name].\nEin Ende.\nDann gehst du."],
    ["Wort",
      "Sprich:\nDer Faden zu [Name] löst sich.\nIch lasse. Ich bin frei."],
    ["369",
      "Tu:\nZähler.\n\nDrei:\nDer Faden löst sich.\n\nSechs:\nGetrennt.\n\nNeun:\nVollzogen."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so."],
    ["Siegel",
      "Sprich:\nVersiegelt.\nÜbergeben."],
    ["Rückkehr",
      "Sprich:\nIch bin hier.\nIch bin nicht [Name].\nFeld zu."],
    ["Schluss",
      "Sprich:\nDanke Feld.\n\nTu:\nWasser. Alltag."]
  ];
  if(typeof R==="undefined") return;
  var found=false;
  for(var i=0;i<R.length;i++){
    if(R[i].id==="trenn"){
      R[i].t="Trennung — selbst"; R[i].s="Nur der Faden zu Person X."; R[i].tag="Trennung"; R[i].need=["Name"]; R[i].steps=STEPS; R[i]._ich=1; found=true;
    }
  }
  if(!found) R.push({id:"trenn",t:"Trennung — selbst",s:"Nur der Faden zu Person X.",tag:"Trennung",need:["Name"],steps:STEPS,_ich:1});
})();
