(function(){
  var ANZ=[
    ["Vorbereitung","Name oben eingeben.\nFoto vor dich: Anker. Name laut. Dann umdrehen.\n\nTu:\nEine Kerze.\n\nSprich:\nNur Anziehung.\nKein Halten.\nKein Zwang.\nIch bleibe ich."],
    ["Ankommen","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler.\nDer Beobachter ist wach."],
    ["Feld","Tu:\nGrenze um den Körper.\n\nSprich:\nIch schliesse mein Feld.\nMeine Energie gehört mir."],
    ["Wort","Sprich:\nDer Weg zu [Name] öffnet sich.\nDie Anziehung darf wirken.\nKein Binden.\nKein Bleiben in [Name]."],
    ["369","Tu:\nZähler.\n\nDrei:\nDie Anziehung öffnet.\n\nSechs:\nDer Weg darf gefunden werden.\n\nNeun:\nEs ist gesetzt."],
    ["Es ist so","Sprich dreimal:\nEs ist so."],
    ["Rückkehr","Sprich:\nIch bin nicht [Name].\nIch kehre vollständig zurück."],
    ["Schluss","Sprich dreimal:\nDanke Gott. Danke Universum. Danke Energien. Danke Feld.\n\nTu:\nWasser. Alltag. Nicht nachladen."]
  ];
  var ABBR=[
    ["Lage","Sprich:\nEin Zug läuft noch.\nIch breche ab.\nKein neuer Auftrag."],
    ["Feld hart","Sprich:\nIch schliesse mein Feld hart.\nAlles Offene geht zu."],
    ["Abbruch","Sprich:\nDer laufende Zug endet hier.\nAlle Fäden die ich gesetzt habe und nicht halten sollen, fallen.\nIch rufe nichts nach."],
    ["Rückkehr","Sprich:\nIch bin nicht die andere Person.\nIch bin nicht die Wesenheit.\nIch kehre vollständig zurück.\nMeine Energie gehört mir."],
    ["Schluss","Sprich dreimal:\nEs ist so.\n\nTu:\nWasser. Alltag."]
  ];
  function grab(id){
    for(var i=0;i<(R||[]).length;i++) if(R[i].id===id) return R[i];
    return null;
  }
  function hasTitle(steps,t){
    return (steps||[]).some(function(s){ return s[0]===t; });
  }
  function insertAfter(steps, after, row){
    var out=steps.slice();
    for(var i=0;i<out.length;i++){
      if(out[i][0]===after){ out.splice(i+1,0,row); return out; }
    }
    out.splice(1,0,row);
    return out;
  }
  function fotoStep(who){
    return ["Foto","Tu:\nFoto von "+who+" vor dich.\nName laut.\nAnschauen. Ankern. Umdrehen.\nOhne Foto: Name dreimal."];
  }
  function patch(){
    if(typeof R==="undefined") return;
    var l=grab("liebe");
    if(l){ l.t="Bindung"; l.s="Hart. Hält den Faden."; l.tag="Liebe"; }
    var l2=grab("liebe2");
    if(l2){ l2.t="Bindung zweier"; l2.s="Hart. Faden zwischen A und B."; l2.tag="Liebe"; }
    var t=grab("trenn");
    if(t){ t.t="Trennung selbst"; t.s="Soft. Nur dein Faden."; }
    var t2=grab("trenn2");
    if(t2){ t2.t="Trennung anderer"; t2.s="Hart. Faden zwischen A und B."; }
    if(!grab("anz")){
      var at=-1; for(var i=0;i<R.length;i++) if(R[i].id==="liebe") at=i;
      var row={id:"anz",t:"Anziehung",s:"Soft. Öffnet. Hält nicht.",tag:"Liebe",need:["Name"],steps:ANZ};
      if(at>=0) R.splice(at,0,row); else R.push(row);
    } else {
      var a=grab("anz"); a.t="Anziehung"; a.s="Soft. Öffnet. Hält nicht."; a.tag="Liebe"; a.need=["Name"]; a.steps=ANZ;
    }
    if(!grab("abbr")){
      R.push({id:"abbr",t:"Abbruch",s:"Laufenden Zug hart beenden. Heimkehren.",tag:"Feld",need:[],steps:ABBR});
    } else {
      var b=grab("abbr"); b.t="Abbruch"; b.s="Laufenden Zug hart beenden. Heimkehren."; b.tag="Feld"; b.steps=ABBR;
    }
    [["liebe","[Name]"],["liebe2","[A] und [B]"],["trenn2","[A] und [B]"],["fluch","[Name]"],["ueber","[Name]"]].forEach(function(pair){
      var r=grab(pair[0]); if(!r||!r.steps) return;
      if(!hasTitle(r.steps,"Foto")) r.steps=insertAfter(r.steps,"Vorbereitung", fotoStep(pair[1]));
    });
    var u=grab("ueber");
    if(u&&u.steps&&!hasTitle(u.steps,"Sofort zurück")){
      u.steps=insertAfter(u.steps,"Eintritt",[
        "Sofort zurück",
        "Sprich sofort nach dem Satz Ich bin [Name]:\nIch bin [Name] nur für [Auftrag].\nIch bin wieder ich.\nDer Beobachter hält.\nDie Aufgabe läuft ohne dass ich bleibe."
      ]);
    }
  }
  patch();
  if(typeof renderList==="function" && !renderList._bahn){
    var rl=renderList;
    renderList=function(){ patch(); rl(); };
    renderList._bahn=1;
  }
})();
