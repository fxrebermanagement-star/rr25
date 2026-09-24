(function(){
  if(typeof fill==="function"){
    var _f=fill;
    fill=function(s,m){
      return _f(s,m).split("[Wofür]").join((m&&m["Wofür"])||"[Wofür]");
    };
  }
  var STEPS=[
    ["Vorbereitung",
      "Name und Wofür oben eingeben.\nWofür: ein Satz.\nFoto wenn da: Anker, dann umdrehen.\n\nTu:\nEine Kerze. Wasser danach.\n\nSprich:\nNur Segen auf [Name].\nNur [Wofür].\nIch bleibe ich."],
    ["Standort",
      "Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage."],
    ["Feld hart",
      "Tu:\nGrenze um den Körper. Einmal feststehen.\n\nSprich:\nIch schliesse mein Feld hart.\nIch gebe Wort, nicht mich."],
    ["Ausrichten",
      "Tu:\n[Name] wahrnehmen. Foto umgedreht. Nicht werden.\n\nSprich:\nDer Segen geht zu [Name].\nIch bleibe hier."],
    ["Rufen",
      "Tu:\nFeld bleibt hart. Einen Atem.\n\nSprich:\nDu bist da.\nIch führe.\nDu trägst nur den Segen [Wofür] zu [Name]."],
    ["Auftrag",
      "Sprich:\nTrage zu [Name] nur [Wofür].\nRein. Ohne Bindung.\nKein Bleiben in [Name].\nDanach gehst du vollständig."],
    ["Wort",
      "Sprich:\nSegen auf [Name].\nWofür: [Wofür].\nDas darf wachsen.\nLast bleibt draussen.\nDer Segen bindet nicht."],
    ["369",
      "Tu:\nZähler. Halte das Wort.\n\nDrei:\nDer Segen sitzt.\n\nSechs:\n[Wofür] darf wachsen.\n\nNeun:\nDas Wort ist gelegt."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so."],
    ["Siegel",
      "Tu:\nHand aufs Herz. Einen Atem.\n\nSprich:\nVersiegelt."],
    ["Entlassen",
      "Sprich:\nAuftrag beendet.\nDu bist frei.\nTor zu."],
    ["Rückkehr",
      "Tu:\nHaut. Atem. Füsse.\n\nSprich:\nIch bin hier.\nFeld zu."],
    ["Schluss",
      "Sprich:\nDanke Feld.\n\nTu:\nWasser. Alltag."]
  ];
  function apply(){
    if(typeof R==="undefined") return;
    var found=false;
    for(var i=0;i<R.length;i++){
      if(R[i].id==="segen"){
        R[i].t="Segen";
        R[i].s="Ich bleibe ich. Wort geht hin.";
        R[i].tag="Person X";
        R[i].need=["Name","Wofür"];
        R[i].steps=STEPS;
        found=true;
      }
    }
    if(!found) R.push({id:"segen",t:"Segen",s:"Ich bleibe ich. Wort geht hin.",tag:"Person X",need:["Name","Wofür"],steps:STEPS});
  }
  apply();
  setTimeout(apply,400);
})();
