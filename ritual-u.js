(function(){
  var STEPS=[
    ["Vorbereitung","Name und Auftrag oben. Ein Satz.\nFoto: Anker, umdrehen.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur [Auftrag].\nNicht für immer."],
    ["Standort","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage."],
    ["Feld hart","Sprich:\nIch schliesse mein Feld hart."],
    ["Ruf","Tu:\nEinen Atem. Nicht fragen.\n\nSprich:\nDie Bahn trägt.\nIch führe.\nNur [Auftrag]."],
    ["Versetzen","Tu:\nFoto unten. Name laut.\n\nSprich:\nIch bin [Name].\nNur für [Auftrag]."],
    ["Auftrag","Sprich von innen:\nIch halte [Auftrag]. Hart.\nEin Ende."],
    ["Wort","Sprich:\nWille und Bahn halten bei [Auftrag].\nBis ich schliesse."],
    ["369","Tu:\nZähler.\n\nDrei:\nIch bin [Name].\n\nSechs:\n[Auftrag] hält.\n\nNeun:\nLäuft. Bis ich schliesse."],
    ["Es ist so","Sprich dreimal:\nEs ist so."],
    ["Siegel","Sprich:\nVersiegelt.\nGehalten."],
    ["Rückkehr","Tu:\nSofort. Haut. Atem. Füsse.\n\nSprich:\nIch bin wieder ich.\nIch bin nicht [Name].\nIch bin hier.\nFeld zu.\nDie Übernahme endet hier."],
    ["Schluss","Sprich:\nDanke Feld.\n\nTu:\nWasser. Alltag."]
  ];
  function put(){
    if(typeof R==="undefined") return;
    var found=false;
    for(var i=0;i<R.length;i++){
      if(R[i].id==="ueber"){
        R[i].t="Person übernehmen"; R[i].s="Hart. Kurz hinein. Hart raus."; R[i].tag="Person X"; R[i].need=["Name","Auftrag"]; R[i].steps=STEPS; R[i]._ich=1; found=true;
      }
    }
    if(!found) R.push({id:"ueber",t:"Person übernehmen",s:"Hart. Kurz hinein. Hart raus.",tag:"Person X",need:["Name","Auftrag"],steps:STEPS,_ich:1});
  }
  function card(){
    var list=document.getElementById("list");
    if(!list || typeof cat==="undefined" || cat!=="Person X") return;
    if(list.querySelector('[data-id="ueber"]')) return;
    var b=document.createElement("button");
    b.type="button"; b.className="card"; b.setAttribute("data-id","ueber");
    b.innerHTML="<b>Person übernehmen</b><small>Hart. Kurz hinein. Hart raus.</small>";
    b.onclick=function(){ fromPlan=null; openR("ueber"); };
    list.insertBefore(b, list.firstChild);
  }
  put();
  if(typeof renderList==="function" && !renderList._u4){
    var prev=renderList;
    renderList=function(){ put(); prev(); card(); };
    renderList._u4=1;
  }
  if(typeof openR==="function" && !openR._u4){
    var _o=openR;
    openR=function(id){ if(id==="ueber") put(); return _o.apply(this,arguments); };
    openR._u4=1;
  }
})();
