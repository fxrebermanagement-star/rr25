(function(){
  function put(r){
    for(var i=R.length-1;i>=0;i--) if(R[i].id===r.id) R.splice(i,1);
    R.push(r);
  }
  put({id:"ueber",t:"Person übernehmen",s:"Person X für Aufgabe X",tag:"Person X",need:["Name","Auftrag"],steps:[
    ["Vorbereitung","Name von Person X. Aufgabe in einem Satz.\nHandy weg. Eigenes Feld zuerst schliessen.\nFoto nur als Anker. Wasser danach.\nDu übernimmst für die Aufgabe, nicht für immer."],
    ["Ankommen","Füsse. Drei Atemzüge.\nIch bin der Spieler, nicht die Spielfigur.\nDer Beobachter ist wach.\nIch bleibe ich. [Name] bleibt [Name]."],
    ["Rahmen","Nur [Name]. Nur diese Aufgabe:\n[Auftrag]\nKein Auftrag darüber hinaus.\nKein Unbeteiligter. Die Übernahme endet mit der Aufgabe."],
    ["Absicht","Ich übernehme [Name] für die Aufgabe.\nWille, Bahn und Handeln von [Name] richten sich auf:\n[Auftrag]\nZugang nur so weit, wie die Aufgabe braucht."],
    ["369","Sprich vollständig. Zwischen den Runden ein Atem.\n3× Ich übernehme [Name] für die Aufgabe.\n6× Der Wille von [Name] hält bei der Aufgabe.\n9× Die Aufgabe läuft. Es ist so."],
    ["Grenze","Kein Bleiben in [Name].\nKein Mehr als die Aufgabe.\nWenn die Aufgabe erfüllt ist, fällt die Übernahme."],
    ["Rückkehr","Ich bin nicht [Name].\nIch kehre vollständig in mich zurück.\nMeine Energie gehört mir.\nSo sei es. Erden. Wasser, Alltag."]
  ]});
  put({id:"segen",t:"Segen",s:"Für Person X. Wort legen.",tag:"Person X",need:["Name"],steps:[
    ["Vorbereitung","Name von Person X klar. Handy weg.\nEigenes Feld zuerst schliessen.\nKerze optional. Wasser danach.\nKein Hass im Mund. Segen ist Gabe, nicht Handel."],
    ["Ankommen","Stelle dich oder setze dich. Füsse auf den Boden.\nDrei ruhige Atemzüge.\nIch bin der Spieler, nicht die Spielfigur.\nDer Beobachter ist wach. Ich handle aus klarer Mitte."],
    ["Rahmen","Ich öffne diesen Raum nur für Segen auf [Name].\nNur das Stimmige und Reine darf hier sein.\nIch gebe Wort, nicht mich."],
    ["Ausrichten","[Name] wahrnehmen, ohne [Name] zu werden.\nKein Verschmelzen. Kein Sog.\nIch bleibe in meiner Mitte."],
    ["Wort","Ich lege Segen auf [Name].\nSchutz um den Körper. Klarheit im Kopf. Weg unter den Füssen.\nWas stimmig ist, darf wachsen.\nWas zieht, Last und fremder Zugriff bleiben draussen."],
    ["369","Sprich vollständig. Zwischen den Runden ein Atem.\n3× [Name] ist gesegnet und gehalten.\n6× Der Segen sitzt, wirkt und bleibt rein.\n9× Das Wort ist gelegt. Es ist so."],
    ["Siegel","Optional Hand aufs Herz oder Salz.\nDer Segen ist gegeben. Nicht nachkontrollieren."],
    ["Rückkehr","Ich bin nicht [Name].\nIch kehre vollständig in mich zurück.\nMeine Energie gehört mir. Der Segen bleibt bei [Name].\nSo sei es. Erden. Wasser, Alltag."]
  ]});
  put({id:"fluch",t:"Fluch",s:"Gegen Person X. Wort setzen.",tag:"Person X",need:["Name"],steps:[
    ["Vorbereitung","Name von Person X klar. Handy weg.\nEigenes Feld zuerst schliessen.\nKerze optional. Salz. Wasser danach.\nDu weisst, dass dies ein Fluch ist. Kein Theater. Keine Wut als Steuer."],
    ["Ankommen","Füsse auf den Boden. Drei Atemzüge.\nIch bin der Spieler, nicht die Spielfigur.\nDer Beobachter ist wach.\nIch öffne nur für dieses eine Wort auf [Name]."],
    ["Rahmen","Nur [Name]. Nur das gesetzte Mass.\nKein Auftrag auf Unbeteiligte.\nKein unendliches Nachsetzen. Die Arbeit hat ein Ende."],
    ["Lage","[Name] steht im Wort.\nOhne mich zu verlieren. Ohne [Name] zu werden.\nIch bleibe der Spieler."],
    ["Wort","Ich setze den Fluch auf [Name].\nDie Bahn von [Name] gegen mich, mein Haus und meine Leute bricht.\nWas von [Name] als Schaden ausgeht, kehrt zur Quelle.\nDer Zugriff fällt ab und findet keinen Halt."],
    ["369","Sprich vollständig. Zwischen den Runden ein Atem.\n3× Das Wort sitzt auf [Name].\n6× Die Bahn von [Name] ist begrenzt und kehrt zurück.\n9× Der Fluch ist gesetzt und geschlossen. Es ist so."],
    ["Siegel","Optional Salz oder Siegelzeichen.\nEinmal setzen. Abgeben.\nNicht aus Unruhe wiederholen."],
    ["Rückkehr","Ich bin nicht [Name].\nIch kehre vollständig in mich zurück.\nMeine Energie gehört mir. Der Auftrag endet hier.\nSo sei es. Erden. Wasser, Alltag."]
  ]});
  if(typeof fill==="function"){
    var _f=fill;
    fill=function(s,m){ return _f(s,m).split("[Auftrag]").join((m&&m.Auftrag)||"[Auftrag]"); };
  }
  var prev=renderList;
  renderList=function(){
    prev();
    var cats=document.getElementById("cats");
    var list=document.getElementById("list");
    if(cats && !cats.querySelector('[data-cat="Person X"]')){
      var b=document.createElement("button");
      b.className="chip"+(cat==="Person X"?" on":"");
      b.setAttribute("data-cat","Person X");
      b.textContent="Person X";
      b.onclick=function(){ cat="Person X"; renderList(); };
      cats.appendChild(b);
    }
    if(list && cat==="Person X" && !list.querySelector('[data-id="ueber"]')){
      var c=document.createElement("button");
      c.type="button"; c.className="card"; c.setAttribute("data-id","ueber");
      c.innerHTML="<b>Person übernehmen</b><small>Person X für Aufgabe X</small>";
      c.onclick=function(){ fromPlan=null; openR("ueber"); };
      list.insertBefore(c, list.firstChild);
    }
  };
  renderList();
})();
