(function(){
  if(typeof fill==="function"){
    var _f=fill;
    fill=function(s,m){
      return _f(s,m).split("[Wofür]").join((m&&m["Wofür"])||"[Wofür]");
    };
  }
  var STEPS=[
    ["Vorbereitung",
      "Name und Wofür oben eingeben.\nWofür: ein Satz. Nicht drei Wünsche.\nFoto wenn da: Anker, dann umdrehen.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur Segen auf [Name].\nNur [Wofür].\nGabe, kein Handel."],
    ["Standort",
      "Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage."],
    ["Feld hart",
      "Tu:\nGrenze um den Körper. Einmal feststehen.\n\nSprich:\nIch schliesse mein Feld hart.\nIch gebe Wort, nicht mich."],
    ["Versetzen",
      "Tu:\nName laut. Foto wenn da. Einmal stehen.\n\nSprich:\nIch bin [Name].\nNur für [Wofür].\nWärme ja. Verschmelzen nein."],
    ["Rufen",
      "Tu:\nFeld bleibt hart. Einen Atem.\n\nSprich:\nDu bist da.\nIch führe.\nDu trägst nur den Segen [Wofür].\nKein Theater. Kein Sog. Kein Mehr."],
    ["Auftrag",
      "Sprich aus [Name] heraus:\nIch nehme [Wofür] an.\nRein. Ohne Bindung.\nKein Bleiben über den Segen hinaus."],
    ["Wort",
      "Sprich:\nIch bin [Name].\nSegen sitzt: [Wofür].\nDas darf wachsen.\nLast und Zugriff bleiben draussen.\nDer Segen bindet nicht."],
    ["369",
      "Tu:\nZähler. Halte das Wort. Nicht neu setzen.\n\nDrei:\nDer Segen sitzt.\n\nSechs:\n[Wofür] darf wachsen.\n\nNeun:\nDas Wort ist gelegt."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so."],
    ["Siegel",
      "Tu:\nHand aufs Herz. Einen Atem.\n\nSprich:\nVersiegelt.\nDas Feld hat es."],
    ["Entlassen",
      "Tu:\nNicht nachwinken. Tor zu.\n\nSprich:\nDer Auftrag ist beendet.\nIch danke dir.\nDu bist frei.\nAlle Verbindungen lösen sich.\nDu bleibst nicht.\nIch schliesse das Tor."],
    ["Rückkehr",
      "Tu:\nHaut. Atem. Füsse. Raum.\n\nSprich:\nIch bin nicht [Name].\nIch bin wieder ich.\nIch bin hier.\nFeld zu.\nDer Segen bleibt bei [Name].\nMeine Energie gehört mir."],
    ["Schluss",
      "Sprich dreimal:\nDanke Gott.\nDanke Universum.\nDanke Energien.\nDanke Feld.\n\nTu:\nWasser. Alltag. Nicht nachkontrollieren."]
  ];
  function apply(){
    if(typeof R==="undefined") return;
    var found=false;
    for(var i=0;i<R.length;i++){
      if(R[i].id==="segen"){
        R[i].t="Segen";
        R[i].s="Ich bin [Name]. Ein Satz Wofür.";
        R[i].tag="Person X";
        R[i].need=["Name","Wofür"];
        R[i].steps=STEPS;
        found=true;
      }
    }
    if(!found) R.push({id:"segen",t:"Segen",s:"Ich bin [Name]. Ein Satz Wofür.",tag:"Person X",need:["Name","Wofür"],steps:STEPS});
  }
  apply();
  setTimeout(apply,300);
  setTimeout(apply,900);
})();
