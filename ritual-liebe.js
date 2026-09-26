(function(){
  var SOFT=[
    ["Vorbereitung","Name oben. Foto umdrehen.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nBindung auf [Name].\nIch bleibe ich."],
    ["Standort","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage."],
    ["Mein Feld","Tu:\nGrenze um DICH.\n\nSprich:\nIch schliesse mein Feld hart."],
    ["Ruf","Tu:\nEinen Atem. Nicht fragen.\n\nSprich:\nDie Bahn trägt.\nIch führe.\nBindung auf [Name]."],
    ["Auftrag","Sprich:\nBinde [Name] an den Weg zu mir.\nDie Bahn hält."],
    ["Wort","Sprich:\nDie Bindung sitzt.\nDer Weg zieht.\nDie Nähe geschieht."],
    ["369","Tu:\nZähler.\n\nDrei:\nDie Bindung sitzt.\n\nSechs:\nDer Weg zieht.\n\nNeun:\nGesetzt."],
    ["Es ist so","Sprich dreimal:\nEs ist so."],
    ["Rückkehr","Sprich:\nIch bin hier.\nFeld zu."],
    ["Siegel","Tu:\nAls du. Hand vor die Flamme.\n\nSprich:\nVersiegelt.\nÜbergeben.\nEs läuft."],
    ["Schluss","Sprich:\nDanke Feld.\n\nTu:\nWasser. Alltag."]
  ];
  var HART=[
    ["Vorbereitung","Name oben. Foto umdrehen. Bleibt unten.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nLiebe hart.\nIch bin noch ich."],
    ["Standort","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage.\nNoch nicht [Name]."],
    ["Mein Feld","Tu:\nGrenze um DICH. Bevor du gehst.\n\nSprich:\nIch schliesse mein Feld hart.\nErst danach [Name]."],
    ["Ruf","Tu:\nEinen Atem. Nicht fragen.\n\nSprich:\nDie Bahn trägt.\nIch führe.\nLiebe hart auf [Name]."],
    ["Versetzen","Tu:\nFoto unten. Name laut.\n\nSprich:\nIch bin [Name].\nNur für dieses Wort."],
    ["Auftrag","Sprich von innen:\nIch bin [Name].\nDie Bindung sitzt hart.\nDer Weg zieht.\nKein Ende.\nDie Bahn hält."],
    ["Wort","Sprich von innen:\nIch bin [Name].\nNähe geschieht hart.\nWille und Bahn halten.\nKein Zugang zum Spieler."],
    ["369","Tu:\nZähler. Noch [Name]. Nicht Feld schliessen.\n\nDrei:\nBindung sitzt.\n\nSechs:\nWeg zieht.\n\nNeun:\nBleibt. Kein Ende."],
    ["Es ist so","Sprich dreimal:\nEs ist so."],
    ["Rückkehr","Tu:\nSofort raus.\n\nSprich:\nIch bin wieder ich.\nIch bin nicht [Name].\nIch bin hier.\nFeld zu."],
    ["Siegel","Tu:\nAls du. Hand vor die Flamme.\n\nSprich:\nVersiegelt.\nÜbergeben.\nEs läuft."],
    ["Schluss","Sprich:\nDanke Feld.\n\nTu:\nWasser. Foto unten. Alltag."]
  ];
  function apply(){
    if(typeof R==="undefined") return;
    for(var i=R.length-1;i>=0;i--) if(R[i].id==="liebezw") R.splice(i,1);
    var hart=(window._mass==="Nagelhart");
    var steps=hart?HART:SOFT;
    var found=false;
    for(var j=0;j<R.length;j++){
      if(R[j].id==="liebe"){
        R[j].t="Liebesritual";
        R[j].s=hart?"Hart. Hinein. Raus. Siegel.":"Ich bleibe ich. Bindung.";
        R[j].tag="Liebe"; R[j].need=["Name"]; R[j].steps=steps; R[j]._ich=1; found=true;
      }
    }
    if(!found) R.push({id:"liebe",t:"Liebesritual",s:"Bindung.",tag:"Liebe",need:["Name"],steps:SOFT,_ich:1});
  }
  apply();
  if(typeof openR==="function" && !openR._liebeH2){
    var _o=openR; openR=function(id){ apply(); return _o.apply(this,arguments); }; openR._liebeH2=1;
  }
})();
