(function(){
  if(typeof fill==="function"){
    var _f=fill;
    fill=function(s,m){
      var out=_f(s,m);
      out=out.split("[Mass]").join((m&&m.Mass)||"[Mass]");
      out=out.split("[Wofür]").join((m&&m["Wofür"])||"[Wofür]");
      out=out.split("[Auftrag]").join((m&&m.Auftrag)||"[Auftrag]");
      return out;
    };
  }
  var STEPS=[
    ["Vorbereitung","Name und Mass oben eingeben.\nMass: ein Satz. Rückgabe und Grenze, nicht drei Strafen.\nFoto wenn da: Anker, dann umdrehen.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur [Name].\nNur dieses Mass: [Mass].\nKein Nachsetzen.\nIch bleibe ich."],
    ["Ankommen","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler.\nDer Beobachter ist wach.\nWut steuert nicht."],
    ["Feld hart","Tu:\nGrenze um den Körper. Einmal feststehen.\n\nSprich:\nIch schliesse mein Feld hart.\nNichts Fremdes hat Zutritt.\nMeine Energie gehört mir."],
    ["Lage","Sprich:\n[Name] steht im Mass.\nOhne [Name] zu werden.\nOhne mich zu verlieren."],
    ["Rufen","Tu:\nFeld bleibt hart. Einen Atem.\n\nSprich:\nDu bist da.\nIch führe.\nDu trägst nur das Mass [Mass] auf [Name].\nKein Theater. Kein Sog. Kein Mehr."],
    ["Auftrag geben","Sprich:\nTrage zu [Name] nur [Mass].\nRückgabe. Grenze.\nKein eigener Krieg.\nKein Bleiben in [Name].\nDanach gehst du vollständig."],
    ["Wort","Sprich:\nIch setze das Mass auf [Name].\nMass: [Mass].\nWas [Name] als Schaden setzt, kehrt vollständig zur Quelle.\nKein Halt an mir.\nKein Zugang zu mir.\nDu trägst. Ich führe."],
    ["369","Tu:\nZähler. Halte das Wort. Nicht neu setzen.\n\nDrei:\nDas Mass sitzt auf [Name].\n\nSechs:\n[Mass]\n\nNeun:\nRückgabe läuft. Grenze hält."],
    ["Es ist so","Sprich dreimal:\nEs ist so."],
    ["Siegel","Tu:\nHand vor die Flamme oder aufs Herz. Einen Atem.\n\nSprich:\nVersiegelt.\nAbgegeben.\nGeschlossen."],
    ["Entlassen","Tu:\nNicht nachwinken. Tor zu.\n\nSprich:\nDer Auftrag ist beendet.\nIch danke dir.\nDu bist frei.\nAlle Verbindungen lösen sich.\nDu bleibst nicht.\nIch schliesse das Tor."],
    ["Rückkehr","Tu:\nHaut. Atem. Füsse. Raum.\n\nSprich:\nIch bin nicht [Name].\nIch bin nicht die Wesenheit.\nIch kehre vollständig zurück.\nMeine Energie gehört mir."],
    ["Schluss","Sprich dreimal:\nDanke Gott.\nDanke Universum.\nDanke Energien.\nDanke Feld.\n\nSprich:\nKein zweites Ritual aus Unruhe heute.\n\nTu:\nWasser. Alltag. Nicht nachsetzen."]
  ];
  function put(){
    if(typeof R==="undefined") return;
    var found=false;
    for(var i=0;i<R.length;i++){
      if(R[i].id==="schaden"){
        R[i].t="Schadenszauber";
        R[i].s="Vorhanden. Nicht Pflicht.";
        R[i].tag="Person X";
        R[i].need=["Name","Mass"];
        R[i].steps=STEPS;
        found=true;
      }
    }
    if(!found) R.push({id:"schaden",t:"Schadenszauber",s:"Vorhanden. Nicht Pflicht.",tag:"Person X",need:["Name","Mass"],steps:STEPS});
  }
  put();
  if(typeof openR==="function"){
    var _o=openR;
    openR=function(id){ if(id==="schaden") put(); return _o.apply(this,arguments); };
  }
  if(typeof renderList==="function"){
    try{ renderList(); }catch(e){}
  }
})();
