(function(){
  var r={
    id:"schaden",
    t:"Schadenszauber",
    s:"Vorhanden. Nicht Pflicht.",
    tag:"Feld",
    need:["Name"],
    steps:[
      ["Halt","Dies ist die Gegenseite. Du musst es nicht tun.\nNur wenn du die Verantwortung voll übernimmst.\nKein Theater. Keine Wut als Steuer.\nFüße. Atem. Ich bin der Spieler. Der Beobachter ist wach."],
      ["Schutz zuerst","Erst das eigene Feld schließen.\nNichts Fremdes hat Zutritt. Ich öffne nur für diese eine Arbeit.\nIch bleibe in meiner Mitte. Ich werde nicht zum Werkzeug."],
      ["Rahmen","Nur [Name]. Nur das gesetzte Maß.\nKein Nachsetzen ins Leben von Unbeteiligten.\nKein unendlicher Auftrag. Die Arbeit hat ein Ende."],
      ["Absicht","Was von [Name] als Schaden ausgeht, kehrt in stimmiger Form zur Quelle.\nDer Zugriff auf mich, mein Haus und meine Leute endet.\nWas gesetzt wird, ist Begrenzung und Rückgabe — nicht blinder Hass."],
      ["369","3× Der Schaden kehrt zur Quelle.\n6× Der Zugriff von [Name] fällt ab und findet keinen Halt.\n9× Die Arbeit ist gesetzt und begrenzt. Es ist so."],
      ["Siegel","Optional Salz oder Siegelzeichen. Die Arbeit ist geschlossen.\nKein Wiederholen aus Wut. Einmal setzen, abgeben."],
      ["Rückkehr","Ich bin nicht [Name]. Ich kehre vollständig in mich zurück.\nMeine Energie gehört mir. Der Auftrag endet hier.\nSo sei es. Erden. Wasser, Körper, Alltag."]
    ]
  };
  if(!R.some(function(x){return x.id==="schaden"})) R.push(r);
  if(typeof PREP==="object" && !PREP.schaden){
    PREP.schaden="Raum schließen. Eigenes Feld zuerst.\nName von [Name] bereit. Foto nur als Anker, nicht als Fessel.\nKerze optional. Salz. Wasser zum Erden danach.\nNur setzen, wenn du es wirklich willst. Sonst zurück.";
  }
  if(r.steps[0][0]!=="Vorbereitung" && PREP && PREP.schaden){
    r.steps.unshift(["Vorbereitung",PREP.schaden]);
  }
  if(typeof renderList==="function") renderList();
})();
