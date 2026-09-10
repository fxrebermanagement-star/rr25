(function(){
  for(var i=R.length-1;i>=0;i--) if(R[i].id==="ueber") R.splice(i,1);
  function put(r){
    var old=R.find(function(x){return x.id===r.id});
    if(old){ old.t=r.t; old.s=r.s; old.tag=r.tag; old.need=r.need; old.steps=r.steps; }
    else R.push(r);
  }
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
  var old=renderList;
  if(typeof old==="function"){
    renderList=function(){
      old();
      var cats=document.getElementById("cats");
      if(!cats) return;
      var w=cats.querySelector('[data-cat="Wort"]');
      if(w){ w.setAttribute("data-cat","Person X"); w.textContent="Person X"; }
      if(!cats.querySelector('[data-cat="Person X"]')){
        var b=document.createElement("button");
        b.className="chip"+(cat==="Person X"?" on":"");
        b.setAttribute("data-cat","Person X");
        b.textContent="Person X";
        b.onclick=function(){ cat="Person X"; renderList(); };
        cats.appendChild(b);
      }
      document.querySelectorAll('#list [data-id="ueber"]').forEach(function(el){ el.remove(); });
    };
  }
  if(typeof renderList==="function") renderList();
})();
