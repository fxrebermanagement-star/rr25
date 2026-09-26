(function(){
  var STEPS=[
    ["Vorbereitung","Name oben. Foto umdrehen.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nHeilung für [Name].\nIch bleibe ich."],
    ["Standort","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage."],
    ["Mein Feld","Sprich:\nIch schliesse mein Feld hart."],
    ["Ruf","Tu:\nEinen Atem. Nicht fragen.\n\nSprich:\nDie Bahn trägt.\nIch führe.\nHeilung für [Name]."],
    ["Auftrag","Sprich:\nTrage die Heilung zu [Name].\nDie Bahn hält."],
    ["Wort","Sprich:\nDie Krankheit von [Name] heilt.\nWas blockiert, löst sich."],
    ["369","Tu:\nZähler.\n\nDrei:\nHeilung sitzt.\n\nSechs:\nBlock löst sich.\n\nNeun:\nIm Gang."],
    ["Es ist so","Sprich dreimal:\nEs ist so."],
    ["Rückkehr","Sprich:\nIch bin nicht [Name].\nIch bin hier.\nFeld zu."],
    ["Siegel","Tu:\nAls du. Hand vor die Flamme.\n\nSprich:\nVersiegelt.\nÜbergeben.\nEs läuft."],
    ["Schluss","Sprich:\nDanke Feld.\n\nTu:\nWasser. Alltag."]
  ];
  if(typeof R==="undefined") return;
  var found=false;
  for(var i=0;i<R.length;i++){
    if(R[i].id==="heil"){
      R[i].t="Heilung"; R[i].s="Bahn trägt Heilung."; R[i].tag="Energie"; R[i].need=["Name"]; R[i].steps=STEPS; R[i]._ich=1; found=true;
    }
  }
  if(!found) R.push({id:"heil",t:"Heilung",s:"Bahn trägt Heilung.",tag:"Energie",need:["Name"],steps:STEPS,_ich:1});
})();
