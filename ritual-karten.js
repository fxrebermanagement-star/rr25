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
  function today(){
    var n=new Date();
    return n.getFullYear()+"-"+String(n.getMonth()+1).padStart(2,"0")+"-"+String(n.getDate()).padStart(2,"0");
  }
  function pick(used){
    var pool=DECK.filter(function(c){return used.indexOf(c.t)<0});
    if(!pool.length) pool=DECK.slice();
    return pool[Math.floor(Math.random()*pool.length)];
  }
  function html(c,label){
    return '<div class="kcard"><span class="group">'+label+'</span><b>'+c.t+'</b><small>'+c.x+'</small></div>';
  }
  function drawDay(){
    var d=loadK();
    if(d.day!==today()||!d.one){ d.day=today(); d.one=pick([]); saveK(d); }
    return d.one;
  }
  function showOne(){
    var out=document.getElementById("kOut");
    if(!out) return;
    var c=drawDay();
    out.innerHTML=html(c,"Heute");
  }
  function showDrei(){
    var out=document.getElementById("kOut");
    if(!out) return;
    var a=pick([]),b=pick([a.t]),c=pick([a.t,b.t]);
    out.innerHTML=html(a,"Lage")+html(b,"Block")+html(c,"Weg");
  }
  var st=document.createElement("style");
  st.textContent=".kcard{background:rgba(56,24,86,.55);border:1px solid rgba(232,160,255,.2);border-radius:1.05rem;padding:.9rem 1rem;margin:.32rem 0}.kcard b{display:block;font-family:Georgia,serif;font-size:1.12rem;margin:.15rem 0 .25rem}.kcard small{display:block;color:#c4a4d6;line-height:1.45}";
  document.head.appendChild(st);
  var tag=document.getElementById("kTag");
  var drei=document.getElementById("kDrei");
  if(tag) tag.onclick=showOne;
  if(drei) drei.onclick=showDrei;
  var d=loadK();
  if(d.day===today()&&d.one){
    var out=document.getElementById("kOut");
    if(out) out.innerHTML=html(d.one,"Heute");
  }
})();
