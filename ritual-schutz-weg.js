(function(){
  var r={
    id:"schutzweg",
    t:"Schutz unterwegs",
    s:"Kurz. Stehen oder gehen.",
    tag:"Schutz",
    steps:[
      ["Jetzt","Tu:\nStehen bleiben oder weitergehen. Füsse spüren. Einen Atem. Schultern fallen lassen.\nHandy bleibt in der Tasche.\n\nSprich innen:\nIch bin hier."],
      ["Feld","Tu:\nEinen Atem länger hinaus.\n\nSprich innen:\nIch bin der Spieler.\nIch schliesse mein Feld hart.\nWas nicht meins ist, bleibt draussen."],
      ["Wort","Tu:\nLeise oder nur innen.\n\nSprich:\nIch bin geschützt.\nIch gehe klar.\nNichts Fremdes hat Halt an mir."],
      ["369","Tu:\nZähler oder Finger.\n\nSprich und zähle:\n3  Mein Feld ist zu.\n6  Fremdes findet keinen Halt.\n9  Ich gehe geschützt. Es ist so."],
      ["Fertig","Tu:\nEin Atem. Weitergehen. Nicht stehen bleiben und grübeln.\n\nSprich:\nSo sei es."]
    ]
  };
  for(var i=R.length-1;i>=0;i--) if(R[i].id==="schutzweg") R.splice(i,1);
  var at=R.findIndex(function(x){ return x.id==="schutz2" || x.id==="schutz"; });
  if(at>=0) R.splice(at+1,0,r);
  else R.push(r);
  if(typeof renderList==="function") renderList();
})();
