(function(){
  var STEPS=[
    ["Vorbereitung",
      "Name oben eingeben, wenn der Kontakt eine Person war. Sonst den Namen leer lassen.\n\nTu:\nEine Kerze nur am Platz. Unterwegs ohne.\nWasser danach — das gehört zur Arbeit.\n\nSprich:\nNur zurück.\nNichts rufen.\nWas mein ist, kommt.\nWas nicht mein ist, geht."],
    ["Ankommen",
      "Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin der Spieler.\nDer Beobachter ist wach.\nIch bin in mir."],
    ["Feld hart",
      "Tu:\nGrenze um den Körper. Einmal feststehen.\n\nSprich:\nIch schliesse mein Feld hart.\nNichts Fremdes hat Zutritt.\nMeine Energie gehört mir."],
    ["Wort",
      "Sprich:\nAlles, was von mir genommen wurde oder an mir hängt, kehrt jetzt rein und vollständig zu mir zurück.\nWas von [Name] an mir hängt, löst sich und kehrt zum Ursprung.\nFremde Energie geht.\nFeld und Energien tragen die Rückkehr.\nIch hole nicht nach. Ich empfange."],
    ["369",
      "Tu:\nZähler. Halte das Wort. Nicht neu setzen.\n\nDrei:\nDie Energie kehrt rein zurück.\n\nSechs:\nFremdes löst sich und geht.\n\nNeun:\nIch bin vollständig bei mir."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so."],
    ["Siegel",
      "Tu:\nHand flach aufs Herz. Einen Atem.\n\nSprich:\nVersiegelt.\nDas Feld hat es."],
    ["Rückkehr",
      "Tu:\nHaut. Atem. Füsse. Raum.\n\nSprich:\nIch bin zurück in mir.\nMeine Energie gehört mir."],
    ["Schluss",
      "Sprich dreimal:\nDanke Gott.\nDanke Universum.\nDanke Energien.\nDanke Feld.\n\nTu:\nWasser. Körper. Alltag.\nNicht nachkontrollieren."]
  ];
  if(typeof R==="undefined") return;
  var found=false;
  for(var i=0;i<R.length;i++){
    if(R[i].id==="zur"){
      R[i].t="Energie zurückholen";
      R[i].s="Nach Kontakt. Nur holen, nichts rufen.";
      R[i].tag="Energie";
      R[i].need=["Name"];
      R[i].steps=STEPS;
      found=true;
    }
  }
  if(!found){
    R.push({id:"zur",t:"Energie zurückholen",s:"Nach Kontakt. Nur holen, nichts rufen.",tag:"Energie",need:["Name"],steps:STEPS});
  }
})();
