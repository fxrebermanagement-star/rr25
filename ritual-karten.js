(function(){
  var KEY="rr25_karte_v1";
  var DECK=[
    {t:"Der Spieler",z:"☉",x:"Du bist nicht die Figur. Beobachter wach. Aus der Mitte handeln."},
    {t:"Die 9",z:"∴",x:"Nicht vermehren. Vollenden. Was gesetzt ist, darf stehen."},
    {t:"Feld zu",z:"⛨",x:"Grenze spüren. Nichts Fremdes hat Zutritt. Der Raum bleibt deiner."},
    {t:"Faden",z:"ᛅ",x:"Nur den Faden. Kein Urteil. Kein Nachsetzen."},
    {t:"Rückkehr",z:"↩",x:"Ich bin nicht der andere. Energie zurück. Wasser, Körper, Alltag."},
    {t:"Segen",z:"☥",x:"Setzen, nicht bitten. Danke. Es ist so. Abgeben."},
    {t:"Grenze",z:"⬡",x:"So weit öffnen, wie es stimmig ist. Unklares bleibt draußen."},
    {t:"369",z:"⋮",x:"Dreimal setzen. Sechsmal halten. Neunmal vollenden. Dann loslassen."},
    {t:"Halt",z:"▣",x:"Heute nicht mehr Arbeit. Was steht, steht. Nicht nachkontrollieren."},
    {t:"Erden",z:"▽",x:"Füße. Atem. Wasser. Der Auftrag endet im Körper."},
    {t:"Schutz",z:"⛤",x:"Feld geschlossen. Fremdes prallt ab oder geht in die Erde."},
    {t:"Liebe ohne Zwang",z:"❦",x:"Nähe nur wenn sie wahr ist. Jeder bleibt frei."},
    {t:"Trennung",z:"⚔",x:"Was zieht, darf gehen. Was stimmig ist, bleibt."},
    {t:"Ausgleich",z:"⚖",x:"Nicht Rache. Was genommen wurde, kehrt rein zurück."},
    {t:"Ahnen",z:"ᛟ",x:"Ehren und begrenzen. Nähe ja. Verschmelzung nein."},
    {t:"Wesenheit",z:"◈",x:"Nur wenn der Faden nicht reicht. Hartes Ende. Danach zurück."},
    {t:"Filter",z:"⬢",x:"Nur klare Präsenz. Was drängt, bleibt draußen."},
    {t:"Saat",z:"✱",x:"Ein Satz. Setzen. Nicht wässern aus Angst."},
    {t:"Loslassen",z:"☾",x:"Die Arbeit ist übergeben. So sei es."},
    {t:"Mitte",z:"⊕",x:"Nicht die Geschichte des anderen werden. Bei dir bleiben."},
    {t:"Klarheit",z:"◇",x:"Nebelig? Druck? Theater? Dann schliessen, nicht vertiefen."},
    {t:"Versorgung",z:"☼",x:"Ich bin versorgt. Es ist so. Ohne zu hetzen."},
    {t:"Gesundheit",z:"☤",x:"Der Körper erinnert sich. Arzt parallel. Kein Erzwingen."},
    {t:"Nacht",z:"☽",x:"Nichts Neues setzen. Feld halten. Schlafen lassen."}
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
    return '<div class="kcard"><span class="group">'+label+'</span><div class="kz">'+(c.z||"☉")+'</div><b>'+c.t+'</b><small>'+c.x+'</small></div>';
  }
  function go(id){
    document.querySelectorAll(".screen").forEach(function(s){ s.classList.toggle("on", s.id===id); });
    document.querySelectorAll("nav button").forEach(function(b){ b.classList.toggle("on", b.getAttribute("data-v")===id); });
    if(id==="drei") document.querySelectorAll("nav button").forEach(function(b){ b.classList.remove("on"); });
  }
  function drawDay(){
    var d=loadK();
    if(d.day!==today()||!d.one){ d.day=today(); d.one=pick([]); saveK(d); }
    var fresh=DECK.filter(function(c){return c.t===d.one.t})[0];
    return fresh||d.one;
  }
  function showOne(){
    var out=document.getElementById("kOut");
    if(out) out.innerHTML=html(drawDay(),"Heute");
  }
  function showDrei(){
    var a=pick([]),b=pick([a.t]),c=pick([a.t,b.t]);
    var box=document.getElementById("dreiList");
    if(box) box.innerHTML=html(a,"Lage")+html(b,"Block")+html(c,"Weg");
    go("drei");
  }
  document.addEventListener("click",function(e){
    var t=e.target; if(!t) return;
    if(t.id==="kTag"||(t.closest&&t.closest("#kTag"))) showOne();
    if(t.id==="kDrei"||(t.closest&&t.closest("#kDrei"))) showDrei();
    if(t.id==="dreiBack"||(t.closest&&t.closest("#dreiBack"))) go("home");
  });
  var s=document.createElement("style");
  s.textContent=[
    "#kOut .kz,.kcard .kz{font-size:2.15rem;line-height:1;margin:.15rem 0 .35rem;color:#ff9ad8;text-shadow:0 0 14px rgba(255,122,217,.55),0 0 24px rgba(126,240,230,.25)}",
    "#kOut .kcard{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;height:100%;padding:.4rem .45rem}",
    "#kOut .kcard b{font-size:.95rem}",
    "#kOut .kcard small{font-size:.68rem;line-height:1.35}",
    "#dreiList .kz{font-size:2.4rem;margin:.2rem 0 .4rem}"
  ].join("");
  document.head.appendChild(s);
  showOne();
})();
