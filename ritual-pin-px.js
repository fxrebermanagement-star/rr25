(function(){
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
  function grab(id){
    if(typeof R==="undefined") return null;
    for(var i=0;i<R.length;i++) if(R[i].id===id) return R[i];
    return null;
  }
  function ensure(){
    if(typeof R==="undefined") return;
    var s=grab("segen");
    if(!s){
      R.push({id:"segen",t:"Segen",s:"Ein Name. Ein Satz Wofür.",tag:"Person X",need:["Name","Wofür"],steps:SEGEN});
    } else {
      s.t="Segen"; s.s="Ein Name. Ein Satz Wofür."; s.tag="Person X";
      s.need=["Name","Wofür"];
      s.steps=SEGEN;
    }
  }
  function paint(){
    ensure();
    var list=document.getElementById("list");
    if(!list || typeof cat==="undefined" || cat!=="Person X") return;
    if(!list.querySelector('[data-id="segen"]')){
      var b=document.createElement("button");
      b.type="button"; b.className="card"; b.setAttribute("data-id","segen");
      b.innerHTML="<b>Segen</b><small>Ein Name. Ein Satz Wofür.</small>";
      b.onclick=function(){ fromPlan=null; openR("segen"); };
      var fl=list.querySelector('[data-id="fluch"]');
      if(fl) list.insertBefore(b, fl); else list.appendChild(b);
    }
  }
  if(typeof openR==="function"){
    var _o=openR;
    openR=function(id){
      if(id==="segen") ensure();
      return _o.apply(this, arguments);
    };
  }
  if(typeof renderList==="function"){
    var prev=renderList;
    renderList=function(){
      ensure();
      prev();
      paint();
    };
  }
  ensure();
  setTimeout(function(){ if(typeof renderList==="function") renderList(); }, 400);
})();
