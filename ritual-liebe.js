(function(){
  var SOFT=[
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
  var HART=[
    ["Vorbereitung",
      "Name oben eingeben.\nFoto: kurz Anker, dann umdrehen. Bild bleibt unten.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nLiebe hart. Ein Träger.\nKein zweites Ich-bin."],
    ["Standort",
      "Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage."],
    ["Feld hart",
      "Tu:\nGrenze um den Körper.\n\nSprich:\nIch schliesse mein Feld hart."],
    ["Ruf",
      "Tu:\nEinen Atem. Nicht fragen.\n\nSprich:\nDie Bahn ist da.\nAuftrag Liebe hart."],
    ["Versetzen",
      "Tu:\nFoto bleibt unten. Name laut.\nEinmal stehen.\n\nSprich:\nIch bin [Name].\nNur für dieses Wort."],
    ["Auftrag",
      "Sprich von innen:\nDie Bindung sitzt.\nDer Weg zieht.\nDie Nähe geschieht hart."],
    ["369",
      "Tu:\nZähler. Nicht nachdenken.\n\nDrei:\nDie Bindung sitzt.\n\nSechs:\nDer Weg zieht.\n\nNeun:\nEs ist gesetzt."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so."],
    ["Siegel",
      "Tu:\nHand über die Kerze oder Salz.\n\nSprich:\nVersiegelt.\nÜbergeben."],
    ["Rückkehr",
      "Tu:\nSofort. Haut. Atem. Füsse.\n\nSprich:\nIch bin wieder ich.\nIch bin nicht [Name].\nIch bin hier.\nFeld zu."],
    ["Schluss",
      "Tu:\nFoto bleibt unten. Wasser. Alltag.\nKein Prüfen.\n\nSprich:\nDanke Feld."]
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
        R[j].s=hart?"Hart. Kurz hinein. Hart raus.":"Ich bleibe ich. Bindung auf [Name].";
        R[j].tag="Liebe";
        R[j].need=["Name"];
        R[j].steps=steps;
        R[j]._ich=1;
        found=true;
      }
    }
    if(!found) R.push({id:"liebe",t:"Liebesritual",s:"Ich bleibe ich. Bindung auf [Name].",tag:"Liebe",need:["Name"],steps:SOFT,_ich:1});
  }
  apply();
  if(typeof openR==="function" && !openR._liebeH){
    var _o=openR;
    openR=function(id){
      apply();
      return _o.apply(this,arguments);
    };
    openR._liebeH=1;
  }
  setTimeout(apply,400);
})();
