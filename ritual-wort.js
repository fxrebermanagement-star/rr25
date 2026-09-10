(function(){
  var u=R.find(function(x){return x.id==="ueber"});
  if(u){ u.tag="Wort"; u.s="Person X übernehmen"; }
  function add(r){ if(!R.some(function(x){return x.id===r.id})) R.push(r); }
  add({id:"segen",t:"Segen",s:"Wort legen. Heil halten.",tag:"Wort",need:["Name"],steps:[
    ["Vorbereitung","Name klar. Eigenes Feld zuerst.\nKein Hass im Mund. Wasser danach."],
    ["Raum","Füsse. Drei Atemzüge.\nIch bin der Spieler. Der Beobachter ist wach.\nIch öffne nur für Segen auf [Name]."],
    ["Wort","Ich lege Segen auf [Name].\nSchutz, Klarheit, Weg.\nWas stimmig ist, darf wachsen.\nWas zieht, bleibt draussen."],
    ["369","3× [Name] ist gesegnet.\n6× Der Segen hält und wirkt.\n9× Es ist gelegt. Es ist so."],
    ["Rückkehr","Ich bin nicht [Name].\nIch kehre vollständig zurück.\nMeine Energie gehört mir.\nSo sei es. Erden."]
  ]});
  add({id:"fluch",t:"Fluch",s:"Wort setzen. Bahn begrenzen.",tag:"Wort",need:["Name"],steps:[
    ["Vorbereitung","Name klar. Eigenes Feld zuerst.\nDu weisst, dass dies ein Fluch ist.\nKein Theater. Wasser danach."],
    ["Raum","Füsse. Drei Atemzüge.\nIch bin der Spieler. Der Beobachter ist wach.\nIch öffne nur für dieses Wort auf [Name]."],
    ["Wort","Ich setze den Fluch auf [Name].\nDie Bahn von [Name] gegen mich und meine Leute bricht.\nWas von [Name] als Schaden ausgeht, kehrt zur Quelle.\nNur [Name]. Kein Unbeteiligter."],
    ["369","3× Das Wort sitzt auf [Name].\n6× Die Bahn von [Name] ist begrenzt.\n9× Der Fluch ist gesetzt. Es ist so."],
    ["Siegel","Einmal setzen. Abgeben.\nNicht aus Wut wiederholen."],
    ["Rückkehr","Ich bin nicht [Name].\nIch kehre vollständig zurück.\nMeine Energie gehört mir. Der Auftrag endet hier.\nSo sei es. Erden."]
  ]});
  var old=renderList;
  if(typeof old==="function"){
    renderList=function(){
      var prev=cat;
      old();
      var cats=document.getElementById("cats");
      if(cats && !cats.querySelector('[data-cat="Wort"]')){
        var b=document.createElement("button");
        b.className="chip"+(prev==="Wort"?" on":"");
        b.setAttribute("data-cat","Wort");
        b.textContent="Wort";
        b.onclick=function(){ cat="Wort"; renderList(); };
        cats.appendChild(b);
      }
    };
  }
  if(typeof renderList==="function") renderList();
})();
