(function(){
  if(typeof fill==="function"){
    var _f=fill;
    fill=function(s,m){
      var out=_f(s,m);
      out=out.split("[Auftrag]").join((m&&m.Auftrag)||"[Auftrag]");
      out=out.split("[Wofür]").join((m&&m["Wofür"])||"[Wofür]");
      out=out.split("[Mass]").join((m&&m.Mass)||"[Mass]");
      return out;
    };
  }
  var SEGEN=[
    ["Vorbereitung","Name und Wofür oben eingeben.\nWofür: ein Satz. Nicht drei Wünsche.\nFoto wenn da: Anker, dann umdrehen.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur Segen auf [Name].\nNur [Wofür].\nGabe, kein Handel.\nIch bleibe ich."],
    ["Ankommen","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler.\nDer Beobachter ist wach."],
    ["Feld hart","Tu:\nGrenze um den Körper. Einmal feststehen.\n\nSprich:\nIch schliesse mein Feld hart.\nIch gebe Wort, nicht mich."],
    ["Ausrichten","Tu:\n[Name] wahrnehmen, ohne [Name] zu werden.\n\nSprich:\nWärme ja. Verschmelzen nein.\nDer Segen geht zu [Name]. Ich bleibe hier."],
    ["Rufen","Tu:\nFeld bleibt hart. Einen Atem.\n\nSprich:\nDu bist da.\nIch führe.\nDu trägst nur den Segen [Wofür] zu [Name].\nKein Theater. Kein Sog. Kein Mehr."],
    ["Auftrag geben","Sprich:\nTrage zu [Name] nur [Wofür].\nRein. Ohne Bindung.\nKein Bleiben in [Name].\nDanach gehst du vollständig."],
    ["Wort","Sprich:\nIch lege Segen auf [Name].\nWofür: [Wofür].\nDas darf wachsen.\nLast und Zugriff bleiben draussen.\nDer Segen bindet nicht.\nDu trägst. Ich führe."],
    ["369","Tu:\nZähler. Halte das Wort. Nicht neu setzen.\n\nDrei:\nDer Segen sitzt auf [Name].\n\nSechs:\n[Wofür] darf wachsen.\n\nNeun:\nDas Wort ist gelegt."],
    ["Es ist so","Sprich dreimal:\nEs ist so."],
    ["Siegel","Tu:\nHand aufs Herz. Einen Atem.\n\nSprich:\nVersiegelt.\nDas Feld hat es."],
    ["Entlassen","Tu:\nNicht nachwinken. Tor zu.\n\nSprich:\nDer Auftrag ist beendet.\nIch danke dir.\nDu bist frei.\nAlle Verbindungen lösen sich.\nDu bleibst nicht.\nIch schliesse das Tor."],
    ["Rückkehr","Tu:\nHaut. Atem. Füsse. Raum.\n\nSprich:\nIch bin nicht [Name].\nIch bin nicht die Wesenheit.\nIch kehre vollständig zurück.\nDer Segen bleibt bei [Name].\nMeine Energie gehört mir."],
    ["Schluss","Sprich dreimal:\nDanke Gott.\nDanke Universum.\nDanke Energien.\nDanke Feld.\n\nTu:\nWasser. Alltag. Nicht nachkontrollieren."]
  ];
  var FLUCH=[
    ["Vorbereitung","Name und Mass oben eingeben.\nMass: ein Satz. Nicht drei Strafen.\nFoto wenn da: Anker, dann umdrehen.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur [Name].\nNur dieses Mass: [Mass].\nKein Nachsetzen.\nIch bleibe ich."],
    ["Ankommen","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler.\nDer Beobachter ist wach.\nWut steuert nicht."],
    ["Feld hart","Tu:\nGrenze um den Körper. Einmal feststehen.\n\nSprich:\nIch schliesse mein Feld hart.\nNichts Fremdes hat Zutritt.\nMeine Energie gehört mir."],
    ["Lage","Sprich:\n[Name] steht im Wort.\nOhne [Name] zu werden.\nOhne mich zu verlieren."],
    ["Rufen","Tu:\nFeld bleibt hart. Einen Atem.\n\nSprich:\nDu bist da.\nIch führe.\nDu trägst nur das Mass [Mass] auf [Name].\nKein Theater. Kein Sog. Kein Mehr."],
    ["Auftrag geben","Sprich:\nTrage zu [Name] nur [Mass]. Hart.\nKein Ausweichen.\nKein eigener Krieg.\nKein Bleiben in [Name].\nDanach gehst du vollständig."],
    ["Wort","Sprich:\nIch setze das Wort hart auf [Name].\nMass: [Mass].\nDie Bahn von [Name] gegen mich bricht und bleibt gebrochen.\nJedes Ausweichen fällt.\nWas [Name] als Schaden setzt, kehrt vollständig zur Quelle.\nKein Halt. Kein Zugang. Kein Nachsatz zu mir.\nDu trägst. Ich führe."],
    ["369","Tu:\nZähler. Halte das Wort. Nicht neu setzen.\n\nDrei:\nDas Mass sitzt hart auf [Name].\n\nSechs:\n[Mass]\n\nNeun:\nGeschlossen. Es bleibt gesetzt."],
    ["Es ist so","Sprich dreimal:\nEs ist so."],
    ["Siegel","Tu:\nHand vor die Flamme oder aufs Herz. Einen Atem.\n\nSprich:\nVersiegelt.\nAbgegeben.\nGeschlossen."],
    ["Entlassen","Tu:\nNicht nachwinken. Tor zu.\n\nSprich:\nDer Auftrag ist beendet.\nIch danke dir.\nDu bist frei.\nAlle Verbindungen lösen sich.\nDu bleibst nicht.\nIch schliesse das Tor."],
    ["Rückkehr","Tu:\nHaut. Atem. Füsse. Raum.\n\nSprich:\nIch bin nicht [Name].\nIch bin nicht die Wesenheit.\nIch kehre vollständig zurück.\nMeine Energie gehört mir."],
    ["Schluss","Sprich dreimal:\nDanke Gott.\nDanke Universum.\nDanke Energien.\nDanke Feld.\n\nSprich:\nKein zweites Ritual aus Unruhe heute.\n\nTu:\nWasser. Alltag. Nicht nachsetzen."]
  ];
  function put(id,t,s,need,steps){
    var found=false;
    for(var i=0;i<R.length;i++){
      if(R[i].id===id){
        R[i].t=t; R[i].s=s; R[i].tag="Person X"; R[i].need=need; R[i].steps=steps;
        found=true;
      }
    }
    if(!found) R.push({id:id,t:t,s:s,tag:"Person X",need:need,steps:steps});
  }
  function go(){
    if(typeof R==="undefined") return;
    for(var i=R.length-1;i>=0;i--){
      if(R[i].id==="finst" || R[i].id==="fremd") R.splice(i,1);
      else if(R[i].id==="schaden"){ R[i].tag="Person X"; R[i].t="Schadenszauber"; R[i].s="Vorhanden. Nicht Pflicht."; }
      else if(R[i].id==="wesen"){ R[i].t="Wesenheit für Auftrag"; R[i].s="Kontakt mit Auftrag. Mass halten."; R[i].tag="Feld"; }
    }
    put("segen","Segen","Ein Name. Ein Satz Wofür.",["Name","Wofür"],SEGEN);
    put("fluch","Fluch","Ein Name. Ein Satz Mass.",["Name","Mass"],FLUCH);
  }
  function paint(){
    var list=document.getElementById("list");
    if(!list || typeof cat==="undefined" || cat!=="Person X") return;
    if(list.querySelector('[data-id="segen"]')) return;
    var b=document.createElement("button");
    b.type="button"; b.className="card"; b.setAttribute("data-id","segen");
    b.innerHTML="<b>Segen</b><small>Ein Name. Ein Satz Wofür.</small>";
    b.onclick=function(){ fromPlan=null; openR("segen"); };
    var fl=list.querySelector('[data-id="fluch"]');
    if(fl) list.insertBefore(b, fl); else list.appendChild(b);
  }
  go();
  if(typeof renderList==="function" && !renderList._px){
    var prev=renderList;
    renderList=function(){
      go();
      prev();
      paint();
    };
    renderList._px=1;
  }
  if(typeof renderList==="function") renderList();
})();
