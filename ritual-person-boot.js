(function(){
  function put(r){
    if(typeof R==="undefined") return;
    for(var i=R.length-1;i>=0;i--) if(R[i].id===r.id) R.splice(i,1);
    R.push(r);
  }
  put({id:"ueber",t:"Person übernehmen",s:"Person X für Aufgabe X",tag:"Person X",need:["Name","Auftrag"],steps:[
    ["Vorbereitung","Name und Aufgabe klar. Feld zuerst schliessen."],
    ["Ankommen","Füsse. Drei Atemzüge. Ich bin der Spieler."],
    ["Rahmen","Nur [Name]. Nur [Auftrag]. Danach Ende."],
    ["Absicht","Ich übernehme [Name] für [Auftrag]."],
    ["369","3× Ich übernehme [Name] für die Aufgabe.\n6× Der Wille hält bei [Auftrag].\n9× Die Aufgabe läuft. Es ist so."],
    ["Rückkehr","Ich bin nicht [Name]. Ich kehre zurück. So sei es."]
  ]});
  put({id:"segen",t:"Segen",s:"Für Person X",tag:"Person X",need:["Name"],steps:[
    ["Rahmen","Nur Segen auf [Name]."],
    ["Wort","Ich lege Segen auf [Name]. Schutz, Klarheit, Weg."],
    ["369","3× [Name] ist gesegnet.\n6× Der Segen bleibt rein.\n9× Das Wort ist gelegt."],
    ["Rückkehr","Ich kehre zurück. Der Segen bleibt bei [Name]."]
  ]});
  put({id:"fluch",t:"Fluch",s:"Gegen Person X",tag:"Person X",need:["Name"],steps:[
    ["Rahmen","Nur [Name]. Nur dieses Wort."],
    ["Wort","Ich setze den Fluch auf [Name]. Die Bahn gegen mich bricht."],
    ["369","3× Das Wort sitzt auf [Name].\n6× Die Bahn kehrt zurück.\n9× Der Fluch ist gesetzt."],
    ["Rückkehr","Ich kehre zurück. Der Auftrag endet hier."]
  ]});
  if(typeof fill==="function"){
    var _f=fill;
    fill=function(s,m){ return _f(s,m).split("[Auftrag]").join((m&&m.Auftrag)||"[Auftrag]"); };
  }
  if(document.getElementById("person")) return;
  var main=document.querySelector("main");
  if(!main) return;
  var s=document.createElement("section");
  s.id="person"; s.className="screen";
  s.innerHTML='<div class="hero"><h2>Person X</h2><p class="sub">Rituale</p></div>'+
    '<button type="button" class="card" data-rid="ueber"><b>Person übernehmen</b><small>Für Aufgabe X</small></button>'+
    '<button type="button" class="card" data-rid="segen"><b>Segen</b><small>Für Person X</small></button>'+
    '<button type="button" class="card" data-rid="fluch"><b>Fluch</b><small>Gegen Person X</small></button>';
  main.appendChild(s);
  var nav=document.querySelector("nav");
  if(nav && !nav.querySelector('[data-v="person"]')){
    var b=document.createElement("button");
    b.type="button"; b.setAttribute("data-v","person");
    b.innerHTML='<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.2"/><path d="M6 19c.8-3.2 3-5 6-5s5.2 1.8 6 5"/></svg>Person';
    var g=nav.querySelector('[data-v="geplant"]');
    if(g) nav.insertBefore(b,g); else nav.appendChild(b);
  }
  var st=document.createElement("style");
  st.textContent="nav{grid-template-columns:repeat(6,1fr)!important}#person .sub{display:block!important;letter-spacing:.12em;text-transform:uppercase;font-size:.64rem}";
  document.head.appendChild(st);
  document.addEventListener("click",function(e){
    var c=e.target.closest&&e.target.closest("#person [data-rid]");
    if(!c) return;
    fromPlan=null;
    openR(c.getAttribute("data-rid"));
  });
})();
