(function(){
  var KEY="rr25_karte_v1";
  var DECK=[
    {t:"Der Spieler",x:"Du bist nicht die Figur. Beobachter wach. Aus der Mitte handeln."},
    {t:"Die 9",x:"Nicht vermehren. Vollenden. Was gesetzt ist, darf stehen."},
    {t:"Feld zu",x:"Grenze spüren. Nichts Fremdes hat Zutritt. Der Raum bleibt deiner."},
    {t:"Faden",x:"Nur den Faden. Kein Urteil. Kein Nachsetzen."},
    {t:"Rückkehr",x:"Ich bin nicht der andere. Energie zurück. Wasser, Körper, Alltag."},
    {t:"Segen",x:"Setzen, nicht bitten. Danke. Es ist so. Abgeben."},
    {t:"Grenze",x:"So weit öffnen, wie es stimmig ist. Unklares bleibt draußen."},
    {t:"369",x:"Dreimal setzen. Sechsmal halten. Neunmal vollenden. Dann loslassen."},
    {t:"Halt",x:"Heute nicht mehr Arbeit. Was steht, steht. Nicht nachkontrollieren."},
    {t:"Erden",x:"Füße. Atem. Wasser. Der Auftrag endet im Körper."},
    {t:"Schutz",x:"Feld geschlossen. Fremdes prallt ab oder geht in die Erde."},
    {t:"Liebe ohne Zwang",x:"Nähe nur wenn sie wahr ist. Jeder bleibt frei."},
    {t:"Trennung",x:"Was zieht, darf gehen. Was stimmig ist, bleibt."},
    {t:"Ausgleich",x:"Nicht Rache. Was genommen wurde, kehrt rein zurück."},
    {t:"Ahnen",x:"Ehren und begrenzen. Nähe ja. Verschmelzung nein."},
    {t:"Wesenheit",x:"Nur wenn der Faden nicht reicht. Hartes Ende. Danach zurück."},
    {t:"Filter",x:"Nur klare Präsenz. Was drängt, bleibt draußen."},
    {t:"Saat",x:"Ein Satz. Setzen. Nicht wässern aus Angst."},
    {t:"Loslassen",x:"Die Arbeit ist übergeben. So sei es."},
    {t:"Mitte",x:"Nicht die Geschichte des anderen werden. Bei dir bleiben."},
    {t:"Klarheit",x:"Nebelig? Druck? Theater? Dann schliessen, nicht vertiefen."},
    {t:"Versorgung",x:"Ich bin versorgt. Es ist so. Ohne zu hetzen."},
    {t:"Gesundheit",x:"Der Körper erinnert sich. Arzt parallel. Kein Erzwingen."},
    {t:"Nacht",x:"Nichts Neues setzen. Feld halten. Schlafen lassen."}
  ];
  function loadK(){try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){return{}}}
  function saveK(d){localStorage.setItem(KEY,JSON.stringify(d))}
  function today(){return new Date().toISOString().slice(0,10)}
  function pick(used){
    var pool=DECK.filter(function(c){return used.indexOf(c.t)<0});
    if(!pool.length) pool=DECK.slice();
    return pool[Math.floor(Math.random()*pool.length)];
  }
  function cardHtml(c,label){
    return '<div class="kcard"><span class="group">'+label+'</span><b>'+c.t+'</b><small>'+c.x+'</small></div>';
  }
  function mount(){
    var home=document.getElementById("home");
    if(!home||document.getElementById("kasten")) return;
    var box=document.createElement("div");
    box.id="kasten";
    var cats=document.getElementById("cats");
    if(cats) home.insertBefore(box, cats);
    else home.appendChild(box);
    var d=loadK();
    if(d.day===today()&&d.one) paint([d.one],["Heute"]);
    else paint([],[]);
  }
  function paint(cards,labels){
    var box=document.getElementById("kasten"); if(!box) return;
    box.innerHTML=cards.map(function(c,i){return cardHtml(c,labels[i]||"")}).join("")+
      '<div class="row"><button type="button" class="btn primary" id="kTag">Karte des Tages</button><button type="button" class="btn ghost" id="kDrei">Drei ziehen</button></div>';
    document.getElementById("kTag").onclick=function(){
      var d=loadK();
      if(d.day!==today()||!d.one){ d.day=today(); d.one=pick([]); saveK(d); }
      paint([d.one],["Heute"]);
    };
    document.getElementById("kDrei").onclick=function(){
      var a=pick([]), b=pick([a.t]), c=pick([a.t,b.t]);
      paint([a,b,c],["Lage","Block","Weg"]);
    };
  }
  var st=document.createElement("style");
  st.textContent=".kcard{background:var(--elev);border:1px solid var(--line);border-radius:1.05rem;padding:.9rem 1rem;margin:.32rem 0}.kcard b{display:block;font-family:Georgia,serif;font-size:1.12rem;margin:.15rem 0 .25rem}.kcard small{display:block;color:var(--dim);line-height:1.45}";
  document.head.appendChild(st);
  mount();
  var _s=show;
  show=function(id){ _s(id); if(id==="home") mount(); };
})();
