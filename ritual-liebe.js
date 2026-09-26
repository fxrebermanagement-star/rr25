(function(){
  var SOFT=[
    ["Vorbereitung","Name oben.\n\nTu:\nEine Kerze. Wasser danach."],
    ["Schutz","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch schliesse mein Feld hart."],
    ["Auftrag","Tu:\nNoch du. Dein Satz.\n\nSprich jetzt den Auftrag."],
    ["Foto","Tu:\nJetzt Foto. Anker. Umdrehen."],
    ["369","Tu:\nZähler.\n\nDrei:\n[Name]\n\nSechs:\nDer Auftrag.\n\nNeun:\nEs ist gesetzt."],
    ["Es ist so","Sprich dreimal:\nEs ist so."],
    ["Rückkehr","Sprich:\nIch bin hier."],
    ["Feld hart","Sprich:\nIch schliesse mein Feld hart."],
    ["Schluss","Tu:\nWasser. Alltag."]
  ];
  var HART=[
    ["Vorbereitung","Name oben.\n\nTu:\nEine Kerze. Wasser danach."],
    ["Schutz","Tu:\nFüsse. Drei Atemzüge.\nGrenze um DICH.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch schliesse mein Feld hart."],
    ["Auftrag","Tu:\nNoch du. Dein Satz.\n\nSprich jetzt den Auftrag."],
    ["Foto","Tu:\nJetzt Foto. Anker. Umdrehen. Bleibt unten."],
    ["Ich bin","Tu:\nName laut.\n\nSprich:\nIch bin [Name]."],
    ["369","Tu:\nZähler. Noch [Name].\n\nDrei:\n[Name]\n\nSechs:\nDer Auftrag.\n\nNeun:\nEs ist gesetzt."],
    ["Es ist so","Sprich dreimal:\nEs ist so."],
    ["Rückkehr","Tu:\nRaus.\n\nSprich:\nIch bin wieder ich.\nIch bin nicht [Name].\nIch bin hier."],
    ["Feld hart","Tu:\nGrenze um DICH.\n\nSprich:\nIch schliesse mein Feld hart."],
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
        R[j].t="Liebesritual"; R[j].s="Schutz. Auftrag. Foto. 369. Raus."; R[j].tag="Liebe"; R[j].need=["Name"]; R[j].steps=steps; R[j]._ich=1; found=true;
      }
    }
    if(!found) R.push({id:"liebe",t:"Liebesritual",s:"Schutz. Auftrag. Foto. 369. Raus.",tag:"Liebe",need:["Name"],steps:SOFT,_ich:1});
  }
  apply();
  if(typeof openR==="function" && !openR._liebeR2){
    var _o=openR; openR=function(id){ apply(); return _o.apply(this,arguments); }; openR._liebeR2=1;
  }
})();
