(function(){
  if(typeof fill==="function" && !fill._seg3){
    var _f=fill;
    fill=function(s,m){ return _f(s,m).split("[Wofür]").join((m&&m["Wofür"])||"[Wofür]"); };
    fill._seg3=1;
  }
  var STEPS=[
    ["Vorbereitung","Name und Wofür oben.\nFoto umdrehen.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nSegen auf [Name].\nNur [Wofür].\nIch bleibe ich."],
    ["Standort","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage."],
    ["Mein Feld","Sprich:\nIch schliesse mein Feld hart."],
    ["Ruf","Tu:\nEinen Atem. Nicht fragen.\n\nSprich:\nDie Bahn trägt.\nIch führe.\nSegen [Wofür] zu [Name]."],
    ["Auftrag","Sprich:\nTrage zu [Name] nur [Wofür].\nDie Bahn hält."],
    ["Wort","Sprich:\nSegen auf [Name].\n[Wofür] sitzt."],
    ["369","Tu:\nZähler.\n\nDrei:\nSegen sitzt.\n\nSechs:\n[Wofür] läuft.\n\nNeun:\nGesetzt."],
    ["Es ist so","Sprich dreimal:\nEs ist so."],
    ["Rückkehr","Sprich:\nIch bin hier.\nFeld zu."],
    ["Siegel","Tu:\nAls du. Hand vor die Flamme.\n\nSprich:\nVersiegelt.\nÜbergeben.\nEs läuft."],
    ["Schluss","Sprich:\nDanke Feld.\n\nTu:\nWasser. Alltag."]
  ];
  if(typeof R==="undefined") return;
  var found=false;
  for(var i=0;i<R.length;i++){
    if(R[i].id==="segen"){
      R[i].t="Segen"; R[i].s="Wort geht hin. Ich bleibe."; R[i].tag="Person X"; R[i].need=["Name","Wofür"]; R[i].steps=STEPS; R[i]._ich=1; found=true;
    }
  }
  if(!found) R.push({id:"segen",t:"Segen",s:"Wort geht hin. Ich bleibe.",tag:"Person X",need:["Name","Wofür"],steps:STEPS,_ich:1});
})();
