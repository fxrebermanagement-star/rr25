(function(){
  if(R.some(function(x){return x.id==="liebezw"})) return;
  R.push({
    id:"liebezw",
    t:"Liebesritual mit Zwang",
    s:"Bindung. Du trägst die Verantwortung.",
    tag:"Liebe",
    need:["Name"],
    steps:[
      ["Vorbereitung","Name klar. Foto nur als Anker.\nKerze optional. Wasser danach.\nDu weisst, dass dies Zwang ist. Kein Spiel. Eigenes Feld zuerst zu."],
      ["Halt","Füße. Drei Atemzüge.\nIch bin der Spieler. Der Beobachter ist wach.\nIch öffne nur für diese eine Bindung auf [Name].\nIch werde nicht zum Werkzeug."],
      ["Rahmen","Nur [Name]. Nur das gesetzte Mass.\nKein Auftrag auf Unbeteiligte.\nDie Arbeit hat ein Ende."],
      ["Absicht","[Name] denkt an mich.\n[Name] fühlt Zug und Verlangen nach mir.\nDer Wille richtet sich auf Kontakt und Nähe zu mir.\nDie Bahn bleibt offen, bis ich sie schliesse."],
      ["369","Sprich vollständig. Zwischen den Runden ein Atem.\n3× [Name] kommt zu mir.\n6× Der Wille von [Name] hält bei mir.\n9× Die Bindung ist gesetzt. Es ist so."],
      ["Siegel","Optional Salz oder Siegelzeichen.\nEinmal setzen. Nicht aus Unruhe wiederholen.\nDie Arbeit wirkt, auch wenn du loslässt."],
      ["Rückkehr","Ich bin nicht [Name].\nIch kehre vollständig in mich zurück.\nMeine Energie gehört mir.\nSo sei es. Erden. Wasser, Alltag."]
    ]
  });
  if(typeof renderList==="function") renderList();
})();
