(function(){
  var SOFT=[
    ["Vorbereitung","Name oben.\n\nTu:\nEine Kerze. Wasser danach.\nFoto noch nicht."],
    ["Standort","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage."],
    ["Mein Feld","Sprich:\nIch schliesse mein Feld hart."],
    ["Foto","Tu:\nJetzt Foto. Kurz Anker. Dann umdrehen."],
    ["Ruf","Tu:\nEinen Atem. Nicht fragen.\n\nSprich:\nDie Bahn trägt.\nIch führe."],
    ["Auftrag","Tu:\nDein Satz. Einmal.\n\nSprich jetzt."],
    ["Wort","Tu:\nDein Wort.\n\nSprich jetzt."],
    ["369","Tu:\nZähler. Wort halten."],
    ["Es ist so","Sprich dreimal:\nEs ist so."],
    ["Rückkehr","Sprich:\nIch bin hier.\nFeld zu."],
    ["Siegel","Tu:\nAls du. Hand vor die Flamme.\n\nSprich:\nVersiegelt.\nÜbergeben.\nEs läuft."],
    ["Schluss","Tu:\nWasser. Alltag."]
  ];
  var HART=[
    ["Vorbereitung","Name oben.\n\nTu:\nEine Kerze. Wasser danach.\nFoto noch nicht.\n\nSprich:\nIch bin noch ich."],
    ["Standort","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage."],
    ["Mein Feld","Tu:\nGrenze um DICH.\n\nSprich:\nIch schliesse mein Feld hart."],
    ["Foto","Tu:\nJetzt Foto. Kurz Anker. Dann umdrehen. Bleibt unten."],
    ["Ruf","Tu:\nEinen Atem. Nicht fragen.\n\nSprich:\nDie Bahn trägt.\nIch führe."],
    ["Versetzen","Tu:\nName laut.\n\nSprich:\nIch bin [Name].\nNur für dieses Wort."],
    ["Auftrag","Tu:\nVon innen. Dein Satz.\n\nSprich jetzt."],
    ["Wort","Tu:\nVon innen. Dein Wort.\nBahn hält. Nicht zum Träger.\n\nSprich jetzt."],
    ["369","Tu:\nZähler. Noch [Name]. Nicht Feld schliessen."],
    ["Es ist so","Sprich dreimal:\nEs ist so."],
    ["Rückkehr","Tu:\nSofort raus.\n\nSprich:\nIch bin wieder ich.\nIch bin nicht [Name].\nIch bin hier.\nFeld zu."],
    ["Siegel","Tu:\nAls du. Hand vor die Flamme.\n\nSprich:\nVersiegelt.\nÜbergeben.\nEs läuft."],
    ["Schluss","Tu:\nWasser. Foto unten. Alltag."]
  ];
  function apply(){
    if(typeof R==="undefined") return;
    for(var i=R.length-1;i>=0;i--) if(R[i].id==="liebezw") R.splice(i,1);
    var hart=(window._mass==="Nagelhart");
    var steps=hart?HART:SOFT;
    var found=false;
    for(var j=0;j<R.length;j++){
      if(R[j].id==="liebe"){
        R[j].t="Liebesritual"; R[j].s=hart?"Gerüst hart. Wort im Mund.":"Gerüst. Wort im Mund."; R[j].tag="Liebe"; R[j].need=["Name"]; R[j].steps=steps; R[j]._ich=1; found=true;
      }
    }
    if(!found) R.push({id:"liebe",t:"Liebesritual",s:"Gerüst. Wort im Mund.",tag:"Liebe",need:["Name"],steps:SOFT,_ich:1});
  }
  apply();
  if(typeof openR==="function" && !openR._liebeF){
    var _o=openR; openR=function(id){ apply(); return _o.apply(this,arguments); }; openR._liebeF=1;
  }
})();
