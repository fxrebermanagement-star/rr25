(function(){
  var STEPS=[
    ["Vorbereitung","Name und Auftrag oben.\nFoto umdrehen.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur [Auftrag].\nIch bin noch ich."],
    ["Standort","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage.\nNoch nicht [Name]."],
    ["Mein Feld","Tu:\nGrenze um DICH.\n\nSprich:\nIch schliesse mein Feld hart.\nErst danach [Name]."],
    ["Ruf","Tu:\nEinen Atem. Nicht fragen.\n\nSprich:\nDie Bahn trägt.\nIch führe.\nNur [Auftrag]."],
    ["Versetzen","Tu:\nFoto unten. Name laut.\n\nSprich:\nIch bin [Name].\nNur für [Auftrag]."],
    ["Auftrag","Sprich von innen:\nIch bin [Name].\nIch halte [Auftrag] hart.\nDie Bahn hält."],
    ["Wort","Sprich von innen:\nWille und Bahn halten bei [Auftrag]."],
    ["369","Tu:\nZähler. Noch [Name].\n\nDrei:\nIch bin [Name].\n\nSechs:\n[Auftrag] hält.\n\nNeun:\nLäuft."],
    ["Es ist so","Sprich dreimal:\nEs ist so."],
    ["Rückkehr","Tu:\nSofort raus.\n\nSprich:\nIch bin wieder ich.\nIch bin nicht [Name].\nIch bin hier.\nFeld zu.\nDie Übernahme endet hier."],
    ["Siegel","Tu:\nAls du. Hand vor die Flamme.\n\nSprich:\nVersiegelt.\nÜbergeben."],
    ["Schluss","Sprich:\nDanke Feld.\n\nTu:\nWasser. Alltag."]
  ];
  function put(){
    if(typeof R==="undefined") return;
    var found=false;
    for(var i=0;i<R.length;i++){
      if(R[i].id==="ueber"){
        R[i].t="Person übernehmen"; R[i].s="Hinein. Raus. Siegel."; R[i].tag="Person X"; R[i].need=["Name","Auftrag"]; R[i].steps=STEPS; R[i]._ich=1; found=true;
      }
    }
    if(!found) R.push({id:"ueber",t:"Person übernehmen",s:"Hinein. Raus. Siegel.",tag:"Person X",need:["Name","Auftrag"],steps:STEPS,_ich:1});
  }
  function card(){
    var list=document.getElementById("list");
    if(!list || typeof cat==="undefined" || cat!=="Person X") return;
    if(list.querySelector('[data-id="ueber"]')) return;
    var b=document.createElement("button");
    b.type="button"; b.className="card"; b.setAttribute("data-id","ueber");
    b.innerHTML="<b>Person übernehmen</b><small>Hinein. Raus. Siegel.</small>";
    b.onclick=function(){ fromPlan=null; openR("ueber"); };
    list.insertBefore(b, list.firstChild);
  }
  put();
  if(typeof renderList==="function" && !renderList._u5){
    var prev=renderList; renderList=function(){ put(); prev(); card(); }; renderList._u5=1;
  }
})();
