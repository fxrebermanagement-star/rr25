(function(){
  var STEPS=[
    ["Vorbereitung",
      "Tu:\nEine Kerze anzünden.\nWasser danach bereitstellen.\nFüsse können den Boden.\n\nSprich:\nNur Schutz. Nur ich.\nKein Auftrag nach aussen."],
    ["Ankommen",
      "Tu:\nFüsse auf den Boden. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler.\nDer Beobachter ist wach.\nIch handle aus klarer Mitte."],
    ["Feld hart",
      "Tu:\nGrenze um den Körper spüren. Einmal feststehen.\n\nSprich:\nIch schliesse mein Feld hart.\nNichts Fremdes hat Zutritt.\nMeine Energie gehört mir."],
    ["Wort",
      "Sprich:\nIch schütze mich jetzt vollständig.\nFeld und Energien tragen die Grenze.\nFremdes prallt ab oder geht in die Erde.\nMeine Energie gehört allein mir."],
    ["369",
      "Tu:\nZähler. Halte das Wort. Nicht neu setzen.\n\nDrei:\nMein Schutz ist aktiv und stark.\n\nSechs:\nAlles Fremde prallt ab und findet keinen Halt.\n\nNeun:\nIch bin klar, geschützt und bei mir."],
    ["Siegel",
      "Tu:\nZur Kerze stehen. Einen Atem.\n\nSprich:\nVersiegelt.\nDas Feld hat es."],
    ["Schluss",
      "Sprich:\nDanke Gott.\nDanke Universum.\nDanke Energien.\nDanke Feld.\nIch schliesse.\n\nTu:\nWasser. Alltag."]
  ];
  if(typeof R==="undefined") return;
  var found=false;
  for(var i=0;i<R.length;i++){
    if(R[i].id==="schutz"){
      R[i].t="Schutz selbst";
      R[i].s="Feld schliessen. Kerze. Feld und Energien.";
      R[i].tag="Schutz";
      R[i].steps=STEPS;
      delete R[i].need;
      found=true;
    }
  }
  if(!found){
    R.push({id:"schutz",t:"Schutz selbst",s:"Feld schliessen. Kerze. Feld und Energien.",tag:"Schutz",steps:STEPS});
  }
})();
