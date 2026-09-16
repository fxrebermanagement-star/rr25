(function(){
  var r={
    id:"schutzweg",
    t:"Schutz unterwegs",
    s:"Kurz. Ohne Kerze. Stehen oder gehen.",
    tag:"Schutz",
    steps:[
      ["Ankommen",
        "Tu:\nFüsse, wo du stehst oder gehst.\nDrei Atemzüge. Schultern fallen lassen.\n\nSprich innen:\nIch bin der Spieler.\nIch bin in mir."],
      ["Feld hart",
        "Tu:\nGrenze um den Körper, einmal fest.\n\nSprich innen:\nIch schliesse mein Feld hart.\nNichts Fremdes hat Zutritt."],
      ["Wort",
        "Sprich innen:\nFeld und Energien tragen die Grenze.\nFremdes prallt ab.\nMeine Energie gehört mir."],
      ["Es ist so",
        "Sprich dreimal:\nEs ist so."],
      ["Schluss",
        "Sprich:\nDanke Feld.\nIch gehe geschützt.\n\nTu:\nWeitergehen."]
    ]
  };
  for(var i=R.length-1;i>=0;i--) if(R[i].id==="schutzweg") R.splice(i,1);
  var at=-1;
  for(var j=0;j<R.length;j++) if(R[j].id==="schutz") at=j;
  if(at>=0) R.splice(at+1,0,r);
  else R.push(r);
  if(typeof renderList==="function") renderList();
})();
