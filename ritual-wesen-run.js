(function(){
  var STEPS=[
    ["Vorbereitung","Eigenes Feld zuerst schließen.\nHandy weg. Wasser bereit.\nDen Auftrag in einem Satz kennen.\nKontakt kurz. Entlassen ist Pflicht."],
    ["Raum","Füße auf den Boden. Drei Atemzüge.\nIch bin der Spieler, nicht die Spielfigur.\nDer Beobachter ist wach.\nIch behalte den Raum."],
    ["Filter","Nur klare, erkennbare, stimmige Präsenz darf sich zeigen.\nDrängen, Nebel, Theater, Sog: sofort schließen.\nKeine fremden Listen."],
    ["Kontakt","Wer bereit, klar und in der Lage ist, sich zu zeigen, darf sich zeigen.\nNur Kontakt. Noch kein Auftrag.\nPrüfen: Bleibt meine Mitte? Ist die Präsenz klar?"],
    ["Auftrag","Der Auftrag lautet:\n[Auftrag]\nNur das. Nichts darüber hinaus.\nDer Auftrag endet, wenn er erfüllt ist."],
    ["Grenze","Kein Zugriff auf Unbeteiligte.\nKein unnötiger Schaden.\nIch bleibe der Spieler. Die Wesenheit bleibt Werk, nicht Herr."],
    ["Entlassen","Der Auftrag ist gegeben und begrenzt.\nIch danke. Du gehst, wenn die Arbeit getan ist.\nAlle Verbindungen zu mir lösen sich.\nIch schließe den Kontakt."],
    ["Rückkehr","Ich bin nicht die Wesenheit.\nIch kehre vollständig in mich zurück.\nMeine Energie gehört mir.\nSo sei es. Erden."]
  ];
  function put(){
    for(var i=R.length-1;i>=0;i--) if(R[i].id==="wesen") R.splice(i,1);
    R.push({id:"wesen",t:"Kontakt Wesenheit",s:"Auftrag setzen. Kontakt. Entlassen.",tag:"Feld",need:["Auftrag"],steps:STEPS.slice()});
  }
  put();
  var prev=openR;
  openR=function(id,wer){
    if(id!=="wesen") return prev(id,wer);
    var i=0, mem={Auftrag:(wer||"")};
    function tx(s){ return String(s||"").split("[Auftrag]").join(mem.Auftrag||"[Auftrag]"); }
    function draw(){
      var last=i===STEPS.length-1;
      var field=i===0?'<input id="aufT" placeholder="Auftrag">':'';
      document.getElementById("run").innerHTML=
        '<div class="hero"><p class="sub">Kontakt Wesenheit · '+(i+1)+'/'+STEPS.length+'</p><h2>'+STEPS[i][0]+'</h2></div>'+
        field+'<p class="words">'+tx(STEPS[i][1])+'</p>'+
        '<div class="row"><button type="button" class="btn ghost" id="prev">'+(i?"Zurück":"Liste")+'</button>'+
        '<button type="button" class="btn primary" id="next">'+(last?"So sei es":"Weiter")+'</button></div>';
      var inp=document.getElementById("aufT");
      if(inp){ inp.value=mem.Auftrag||""; inp.oninput=function(){ mem.Auftrag=inp.value.trim(); }; }
      document.getElementById("prev").onclick=function(){ if(!i){show("home");return;} i--; draw(); };
      document.getElementById("next").onclick=function(){
        if(inp) mem.Auftrag=inp.value.trim();
        if(i<STEPS.length-1){ i++; draw(); return; }
        var d=load();
        d.log.unshift({id:uid(),t:now(),titel:"Kontakt Wesenheit",wer:mem.Auftrag||"",wesen:true});
        save(d); show("after");
      };
    }
    show("run"); draw();
  };
  if(typeof renderList==="function") renderList();
})();
