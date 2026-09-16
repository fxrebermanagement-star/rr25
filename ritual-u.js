(function(){
  var STEPS=[
    ["Vorbereitung","Name und Auftrag oben eingeben.\nAuftrag: ein Satz.\nFoto wenn da: Anker, dann umdrehen.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nIch übernehme [Name] nur für [Auftrag].\nNicht für immer.\nNicht für das ganze Leben.\nIch bleibe der Spieler."],
    ["Ankommen","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler.\nDer Beobachter ist wach."],
    ["Feld hart","Tu:\nGrenze um den Körper. Einmal feststehen.\n\nSprich:\nIch schliesse mein Feld hart.\nNichts Fremdes hat Zutritt.\nMeine Energie gehört mir."],
    ["Eintritt","Tu:\n[Name] wahrnehmen.\nDann bewusst eintreten. Nicht verschwimmen.\n\nSprich:\nIch bin [Name].\nNur für [Auftrag].\nDer Wille von [Name] hält bei mir."],
    ["Rufen","Tu:\nFeld bleibt hart. Einen Atem.\n\nSprich:\nDu bist da.\nIch führe.\nDu trägst nur: [Name] hält [Auftrag].\nKein Theater. Kein Sog. Kein Mehr."],
    ["Auftrag geben","Sprich:\nHilf, dass [Name] nur [Auftrag] trägt. Hart.\nKein Ausweichen.\nKein eigener Krieg.\nKein Bleiben über die Aufgabe hinaus.\nDanach gehst du vollständig."],
    ["Wort","Sprich:\nIch bin [Name].\nIch übernehme [Name] für [Auftrag].\nWille und Bahn von [Name] halten hart bei der Aufgabe.\nKein Ausweichen.\nKein Mehr.\nDie Übernahme hält, bis ich schliesse.\nDu trägst. Ich führe."],
    ["369","Tu:\nZähler. Halte das Wort. Nicht neu setzen.\n\nDrei:\nIch bin [Name].\n\nSechs:\nDer Wille hält hart bei [Auftrag].\n\nNeun:\nDie Aufgabe läuft. Bis ich schliesse."],
    ["Es ist so","Sprich dreimal:\nEs ist so."],
    ["Siegel","Tu:\nHand aufs Herz. Einen Atem.\n\nSprich:\nVersiegelt.\nGehalten.\nBis ich schliesse."],
    ["Entlassen","Tu:\nNicht nachwinken. Tor zu.\n\nSprich:\nDer Auftrag ist beendet.\nIch danke dir.\nDu bist frei.\nAlle Verbindungen lösen sich.\nDu bleibst nicht.\nIch schliesse das Tor."],
    ["Rückkehr","Tu:\nHaut. Atem. Füsse. Raum.\n\nSprich:\nIch bin nicht [Name].\nIch bin nicht die Wesenheit.\nIch kehre vollständig zurück.\nDie Übernahme endet hier.\nMeine Energie gehört mir."],
    ["Schluss","Sprich dreimal:\nDanke Gott.\nDanke Universum.\nDanke Energien.\nDanke Feld.\n\nSprich:\nKein zweites Ritual aus Unruhe heute.\n\nTu:\nWasser. Alltag."]
  ];
  function put(){
    if(typeof R==="undefined") return;
    var found=false;
    for(var i=0;i<R.length;i++){
      if(R[i].id==="ueber"){
        R[i].t="Person übernehmen";
        R[i].s="Hart. Ich bin [Name]. Bis ich schliesse.";
        R[i].tag="Person X";
        R[i].need=["Name","Auftrag"];
        R[i].steps=STEPS;
        found=true;
      }
    }
    if(!found) R.push({id:"ueber",t:"Person übernehmen",s:"Hart. Ich bin [Name]. Bis ich schliesse.",tag:"Person X",need:["Name","Auftrag"],steps:STEPS});
  }
  function card(){
    var list=document.getElementById("list");
    if(!list || typeof cat==="undefined" || cat!=="Person X") return;
    if(list.querySelector('[data-id="ueber"]')) return;
    var b=document.createElement("button");
    b.type="button"; b.className="card"; b.setAttribute("data-id","ueber");
    b.innerHTML="<b>Person übernehmen</b><small>Hart. Ich bin [Name]. Bis ich schliesse.</small>";
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
