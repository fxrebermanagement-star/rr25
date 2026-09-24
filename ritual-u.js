(function(){
  var STEPS=[
    ["Vorbereitung","Name und Auftrag oben eingeben.\nAuftrag: ein Satz.\nFoto wenn da: Anker, dann umdrehen.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur für [Auftrag].\nNicht für immer.\nNicht für das ganze Leben."],
    ["Standort","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage."],
    ["Feld hart","Tu:\nGrenze um den Körper. Einmal feststehen.\n\nSprich:\nIch schliesse mein Feld hart.\nNichts Fremdes hat Zutritt.\nMeine Energie gehört mir."],
    ["Versetzen","Tu:\nName laut. Foto wenn da. Bewusst eintreten. Nicht verschwimmen.\n\nSprich:\nIch bin [Name].\nNur für [Auftrag].\nNicht die ganze Biografie."],
    ["Rufen","Tu:\nFeld bleibt hart. Einen Atem.\n\nSprich:\nDu bist da.\nIch führe.\nDu trägst nur: [Auftrag].\nKein Theater. Kein Sog. Kein Mehr."],
    ["Auftrag","Sprich aus [Name] heraus:\nIch halte [Auftrag]. Hart.\nKein Ausweichen.\nKein eigener Krieg.\nKein Bleiben über die Aufgabe hinaus."],
    ["Wort","Sprich:\nIch bin [Name].\nWille und Bahn halten hart bei [Auftrag].\nKein Ausweichen.\nKein Mehr.\nDie Übernahme hält, bis ich schliesse."],
    ["369","Tu:\nZähler. Halte das Wort. Nicht neu setzen.\n\nDrei:\nIch bin [Name].\n\nSechs:\nDer Wille hält bei [Auftrag].\n\nNeun:\nDie Aufgabe läuft. Bis ich schliesse."],
    ["Es ist so","Sprich dreimal:\nEs ist so."],
    ["Siegel","Tu:\nHand aufs Herz. Einen Atem.\n\nSprich:\nVersiegelt.\nGehalten.\nBis ich schliesse."],
    ["Entlassen","Tu:\nNicht nachwinken. Tor zu.\n\nSprich:\nDer Auftrag ist beendet.\nIch danke dir.\nDu bist frei.\nAlle Verbindungen lösen sich.\nDu bleibst nicht.\nIch schliesse das Tor."],
    ["Rückkehr","Tu:\nHaut. Atem. Füsse. Raum.\n\nSprich:\nIch bin nicht [Name].\nIch bin wieder ich.\nIch bin hier.\nFeld zu.\nDie Übernahme endet hier.\nMeine Energie gehört mir."],
    ["Schluss","Sprich dreimal:\nDanke Gott.\nDanke Universum.\nDanke Energien.\nDanke Feld.\n\nSprich:\nKein zweites Ritual aus Unruhe heute.\n\nTu:\nWasser. Alltag."]
  ];
  function put(){
    if(typeof R==="undefined") return;
    var found=false;
    for(var i=0;i<R.length;i++){
      if(R[i].id==="ueber"){
        R[i].t="Person übernehmen";
        R[i].s="Hart. Ich bin [Name]. Dann zurück.";
        R[i].tag="Person X";
        R[i].need=["Name","Auftrag"];
        R[i].steps=STEPS;
        found=true;
      }
    }
    if(!found) R.push({id:"ueber",t:"Person übernehmen",s:"Hart. Ich bin [Name]. Dann zurück.",tag:"Person X",need:["Name","Auftrag"],steps:STEPS});
  }
  function card(){
    var list=document.getElementById("list");
    if(!list || typeof cat==="undefined" || cat!=="Person X") return;
    if(list.querySelector('[data-id="ueber"]')) return;
    var b=document.createElement("button");
    b.type="button"; b.className="card"; b.setAttribute("data-id","ueber");
    b.innerHTML="<b>Person übernehmen</b><small>Hart. Ich bin [Name]. Dann zurück.</small>";
    b.onclick=function(){ fromPlan=null; openR("ueber"); };
    list.insertBefore(b, list.firstChild);
  }
  put();
  if(typeof renderList==="function" && !renderList._u3){
    var prev=renderList;
    renderList=function(){ put(); prev(); card(); };
    renderList._u3=1;
  }
  if(typeof openR==="function"){
    var _o=openR;
    openR=function(id){ if(id==="ueber") put(); return _o.apply(this,arguments); };
  }
  if(typeof renderList==="function") renderList();
})();
