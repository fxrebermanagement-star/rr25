(function(){
  var KEY="rr25_karte_v1";
  var DECK=[
    {t:"Der Spieler",z:"✦",x:"Du bist nicht die Figur. Beobachter wach. Aus der Mitte handeln."},
    {t:"Die 9",z:"9",x:"Nicht vermehren. Vollenden. Was gesetzt ist, darf stehen."},
    {t:"Feld zu",z:"○",x:"Grenze spüren. Nichts Fremdes hat Zutritt. Der Raum bleibt deiner."},
    {t:"Faden",z:"〜",x:"Nur den Faden. Kein Urteil. Kein Nachsetzen."},
    {t:"Rückkehr",z:"↩",x:"Ich bin nicht der andere. Energie zurück. Wasser, Körper, Alltag."},
    {t:"Segen",z:"✧",x:"Setzen, nicht bitten. Danke. Es ist so. Abgeben."},
    {t:"Grenze",z:"□",x:"So weit öffnen, wie es stimmig ist. Unklares bleibt draußen."},
    {t:"369",z:"∴",x:"Dreimal setzen. Sechsmal halten. Neunmal vollenden. Dann loslassen."},
    {t:"Halt",z:"■",x:"Heute nicht mehr Arbeit. Was steht, steht. Nicht nachkontrollieren."},
    {t:"Erden",z:"▽",x:"Füße. Atem. Wasser. Der Auftrag endet im Körper."},
    {t:"Schutz",z:"⬢",x:"Feld geschlossen. Fremdes prallt ab oder geht in die Erde."},
    {t:"Liebe ohne Zwang",z:"♡",x:"Nähe nur wenn sie wahr ist. Jeder bleibt frei."},
    {t:"Trennung",z:"✕",x:"Was zieht, darf gehen. Was stimmig ist, bleibt."},
    {t:"Ausgleich",z:"⚖",x:"Nicht Rache. Was genommen wurde, kehrt rein zurück."},
    {t:"Ahnen",z:"⚘",x:"Ehren und begrenzen. Nähe ja. Verschmelzung nein."},
    {t:"Wesenheit",z:"◈",x:"Nur wenn der Faden nicht reicht. Hartes Ende. Danach zurück."},
    {t:"Filter",z:"▦",x:"Nur klare Präsenz. Was drängt, bleibt draußen."},
    {t:"Saat",z:"·",x:"Ein Satz. Setzen. Nicht wässern aus Angst."},
    {t:"Loslassen",z:"◦",x:"Die Arbeit ist übergeben. So sei es."},
    {t:"Mitte",z:"⊕",x:"Nicht die Geschichte des anderen werden. Bei dir bleiben."},
    {t:"Klarheit",z:"◇",x:"Nebelig? Druck? Theater? Dann schliessen, nicht vertiefen."},
    {t:"Versorgung",z:"◇",x:"Ich bin versorgt. Es ist so. Ohne zu hetzen."},
    {t:"Gesundheit",z:"+",x:"Der Körper erinnert sich. Arzt parallel. Kein Erzwingen."},
    {t:"Nacht",z:"☾",x:"Nichts Neues setzen. Feld halten. Schlafen lassen."}
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
    return '<div class="kcard"><span class="group">'+label+'</span><div class="kz">'+(c.z||"✦")+'</div><b>'+c.t+'</b><small>'+c.x+'</small></div>';
  }
  function drawDay(){
    var d=loadK();
    if(d.day!==today()||!d.one){ d.day=today(); d.one=pick([]); saveK(d); }
    return d.one;
  }
  function showOne(){
    var out=document.getElementById("kOut");
    if(!out) return;
    out.innerHTML=html(drawDay(),"Heute");
  }
  function showDrei(){
    var out=document.getElementById("kOut");
    if(!out) return;
    var a=pick([]),b=pick([a.t]),c=pick([a.t,b.t]);
    out.innerHTML=html(a,"Lage")+html(b,"Block")+html(c,"Weg");
  }
  var st=document.createElement("style");
  st.textContent=".kcard{background:linear-gradient(180deg,rgba(72,28,110,.7),rgba(28,10,42,.85));border:1px solid rgba(232,160,255,.28);border-radius:1.2rem;padding:1.15rem 1.1rem 1.2rem;margin:.45rem 0;text-align:center;box-shadow:0 10px 28px rgba(0,0,0,.28)}.kcard .group{display:block;margin:0 0 .35rem}.kz{font-size:2.1rem;line-height:1;color:#ffb3ea;margin:.15rem 0 .45rem;text-shadow:0 0 18px rgba(255,122,217,.35)}.kcard b{display:block;font-family:Georgia,serif;font-size:1.22rem;margin:0 0 .4rem;letter-spacing:.02em}.kcard small{display:block;color:#c4a4d6;line-height:1.5;font-size:.92rem}";
  document.head.appendChild(st);
  var tag=document.getElementById("kTag");
  var drei=document.getElementById("kDrei");
  if(tag) tag.onclick=showOne;
  if(drei) drei.onclick=showDrei;
  var d=loadK();
  if(d.day===today()&&d.one){
    var found=DECK.filter(function(c){return c.t===d.one.t})[0];
    var out=document.getElementById("kOut");
    if(out) out.innerHTML=html(found||d.one,"Heute");
  }
})();
