(function(){
  function put(r){
    for(var i=R.length-1;i>=0;i--) if(R[i].id===r.id) R.splice(i,1);
    R.push(r);
  }
  put({id:"ueber",t:"Person übernehmen",s:"Person X für Aufgabe X",tag:"Person X",need:["Name","Auftrag"],steps:[
    ["Vorbereitung","Name und Aufgabe klar. Feld zuerst schliessen."],
    ["Ankommen","Füsse. Drei Atemzüge. Ich bin der Spieler."],
    ["Rahmen","Nur [Name]. Nur [Auftrag]."],
    ["Absicht","Ich übernehme [Name] für [Auftrag]."],
    ["369","3× Ich übernehme [Name] für die Aufgabe.\n6× Der Wille hält bei [Auftrag].\n9× Die Aufgabe läuft. Es ist so."],
    ["Rückkehr","Ich bin nicht [Name]. Ich kehre zurück. So sei es."]
  ]});
  put({id:"segen",t:"Segen",s:"Für Person X",tag:"Person X",need:["Name"],steps:[
    ["Rahmen","Nur Segen auf [Name]."],["Wort","Ich lege Segen auf [Name]."],
    ["369","3× [Name] ist gesegnet.\n6× Der Segen bleibt rein.\n9× Das Wort ist gelegt."],
    ["Rückkehr","Ich kehre zurück. Der Segen bleibt bei [Name]."]
  ]});
  put({id:"fluch",t:"Fluch",s:"Gegen Person X",tag:"Person X",need:["Name"],steps:[
    ["Rahmen","Nur [Name]."],["Wort","Ich setze den Fluch auf [Name]."],
    ["369","3× Das Wort sitzt auf [Name].\n6× Die Bahn kehrt zurück.\n9× Der Fluch ist gesetzt."],
    ["Rückkehr","Ich kehre zurück."]
  ]});
  if(typeof fill==="function"){
    var _f=fill;
    fill=function(s,m){ return _f(s,m).split("[Auftrag]").join((m&&m.Auftrag)||"[Auftrag]"); };
  }
  renderList=function(){
    var order=["Alltag","Schutz","Energie","Liebe","Trennung","Person X","Feld"];
    var cats=document.getElementById("cats");
    var list=document.getElementById("list");
    if(!cats||!list) return;
    cats.innerHTML=["Alle"].concat(order).map(function(x){
      return '<button class="chip'+(x===cat?' on':'')+'" data-cat="'+x+'">'+x+'</button>';
    }).join("");
    cats.querySelectorAll("[data-cat]").forEach(function(b){
      b.onclick=function(){ cat=b.getAttribute("data-cat"); renderList(); };
    });
    var items=R.filter(function(r){ return cat==="Alle"||r.tag===cat; });
    var g={};
    items.forEach(function(r){ (g[r.tag]=g[r.tag]||[]).push(r); });
    list.innerHTML=Object.keys(g).sort(function(a,b){ return order.indexOf(a)-order.indexOf(b); }).map(function(k){
      return '<p class="group">'+k+'</p>'+g[k].map(function(r){
        return '<button class="card" data-id="'+r.id+'"><b>'+r.t+'</b><small>'+r.s+'</small></button>';
      }).join("");
    }).join("");
    list.querySelectorAll(".card").forEach(function(b){
      b.onclick=function(){ fromPlan=null; openR(b.getAttribute("data-id")); };
    });
    cats.querySelectorAll('[data-cat="Alle"],[data-cat="Alltag"]').forEach(function(n){ n.remove(); });
  };
  renderList();
})();
