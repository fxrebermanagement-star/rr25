(function(){
  if(typeof fill==="function"){
    var _f=fill;
    fill=function(s,m){
      return _f(s,m).split("[Auftrag]").join((m&&m.Auftrag)||"[Auftrag]");
    };
  }
  for(var i=R.length-1;i>=0;i--) if(R[i].id==="ueber") R.splice(i,1);
  R.push({
    id:"ueber",
    t:"Person übernehmen",
    s:"Person X für Aufgabe X",
    tag:"Person X",
    need:["Name","Auftrag"],
    steps:[
      ["Vorbereitung","Name von Person X. Aufgabe in einem Satz.\nHandy weg. Eigenes Feld zuerst schliessen.\nFoto nur als Anker. Wasser danach.\nDu übernimmst für die Aufgabe, nicht für immer."],
      ["Ankommen","Füsse. Drei Atemzüge.\nIch bin der Spieler, nicht die Spielfigur.\nDer Beobachter ist wach.\nIch bleibe ich. [Name] bleibt [Name]."],
      ["Rahmen","Nur [Name]. Nur diese Aufgabe:\n[Auftrag]\nKein Auftrag darüber hinaus.\nKein Unbeteiligter. Die Übernahme endet mit der Aufgabe."],
      ["Absicht","Ich übernehme [Name] für die Aufgabe.\nWille, Bahn und Handeln von [Name] richten sich auf:\n[Auftrag]\nZugang nur so weit, wie die Aufgabe braucht."],
      ["369","Sprich vollständig. Zwischen den Runden ein Atem.\n3× Ich übernehme [Name] für die Aufgabe.\n6× Der Wille von [Name] hält bei der Aufgabe.\n9× Die Aufgabe läuft. Es ist so."],
      ["Grenze","Kein Bleiben in [Name].\nKein Mehr als die Aufgabe.\nWenn die Aufgabe erfüllt ist, fällt die Übernahme."],
      ["Rückkehr","Ich bin nicht [Name].\nIch kehre vollständig in mich zurück.\nMeine Energie gehört mir.\nSo sei es. Erden. Wasser, Alltag."]
    ]
  });
  if(typeof renderList==="function") renderList();
})();
