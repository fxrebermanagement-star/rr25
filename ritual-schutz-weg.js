(function(){
  var r={
    id:"schutzweg",
    t:"Schutz unterwegs",
    s:"Kurz. Stehen oder gehen.",
    tag:"Schutz",
    steps:[
      ["Jetzt","Stehen bleiben oder weitergehen — beides geht.\nFüsse spüren. Einen Atem. Schultern fallen lassen.\nHandy bleibt in der Tasche."],
      ["Feld","Ich bin der Spieler.\nMein Feld ist zu.\nWas nicht meins ist, bleibt draussen."],
      ["Wort","Sprich leise oder nur innen:\nIch bin geschützt.\nIch gehe klar.\nNichts Fremdes hat Halt an mir."],
      ["369","Zähler unten, oder nur mit den Fingern.\n\n3  Mein Feld ist zu.\n6  Fremdes findet keinen Halt.\n9  Ich gehe geschützt. Es ist so."],
      ["Fertig","Ein Atem. Weitergehen.\nNicht nachprüfen. Nicht stehen bleiben und grübeln.\nSo sei es."]
    ]
  };
  for(var i=R.length-1;i>=0;i--) if(R[i].id==="schutzweg") R.splice(i,1);
  var at=R.findIndex(function(x){ return x.id==="schutz2" || x.id==="schutz"; });
  if(at>=0) R.splice(at+1,0,r);
  else R.push(r);
  if(typeof renderList==="function") renderList();
})();
