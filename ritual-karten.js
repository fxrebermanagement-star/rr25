(function(){
  var KEY="rr25_karte_v2";
  var DECK=[
    {t:"Der Spieler",z:"☉",x:"Du bist nicht die Figur. Beobachter wach. Karte rät. Ritual setzt du getrennt."},
    {t:"Die 9",z:"∴",x:"Nicht vermehren. Vollenden. Was gesetzt ist, darf stehen. Aufstehen vom Tisch."},
    {t:"Feld zu",z:"⛨",x:"Grenze spüren. Nichts Fremdes hat Zutritt. Soft-Schutz. Kein Name als Auftrag."},
    {t:"Faden",z:"ᛅ",x:"Nur den Faden. Kein Urteil. Kein Nachsetzen. Soft-Trennung, nicht Hard aus der Karte."},
    {t:"Rückkehr",z:"↩",x:"Ich bin nicht der andere. Energie zurück. Wasser, Körper, Alltag. Die 9."},
    {t:"Segen",z:"☥",x:"Setzen, nicht bitten. Ein Satz. Danke. Es ist so. Soft. Abgeben."},
    {t:"Grenze",z:"⬡",x:"So weit öffnen, wie es stimmig ist. Unklares bleibt draußen. Hard braucht Gate, nicht diese Karte."},
    {t:"369",z:"⋮",x:"Dreimal setzen. Sechsmal halten. Neunmal vollenden. Dann loslassen. Ohne 9 bleibt die 6."},
    {t:"Halt",z:"▣",x:"Heute nicht mehr Arbeit. Was steht, steht. Nicht nachladen. Nicht nachschauen."},
    {t:"Erden",z:"▽",x:"Füße. Atem. Wasser. Der Auftrag endet im Körper. Handy weg."},
    {t:"Schutz",z:"⛤",x:"Feld geschlossen. Fremdes prallt ab oder geht in die Erde. Soft. Kein Nachschlagen."},
    {t:"Liebe ohne Zwang",z:"❦",x:"Nähe nur wenn sie wahr ist. Jeder bleibt frei. Halten wollen ist Bindung — anderes Ritual."},
    {t:"Trennung",z:"⚔",x:"Der Faden zu dir darf gehen. Zwei andere schneiden ist Hard. Hier nur dein Faden."},
    {t:"Ausgleich",z:"⚖",x:"Nicht Rache. Was genommen wurde, kehrt rein zurück. Kein Blick auf den Fall des anderen."},
    {t:"Ahnen",z:"ᛟ",x:"Ehren und begrenzen. Nähe ja. Verschmelzung nein. Last bleibt draußen."},
    {t:"Wesenheit",z:"◈",x:"Nur wenn der Faden nicht reicht. Hartes Ende. Danach zurück. Kein Alltagskontakt."},
    {t:"Filter",z:"⬢",x:"Nur klare Präsenz. Was drängt, bleibt draußen. Nebel? Schliessen."},
    {t:"Saat",z:"✱",x:"Ein Satz. Setzen. Nicht wässern aus Angst. Soft öffnet. Hard startest du nicht von hier."},
    {t:"Loslassen",z:"☾",x:"Die Arbeit ist übergeben. Nicht nachladen. So sei es."},
    {t:"Mitte",z:"⊕",x:"Nicht die Geschichte des anderen werden. Bei dir bleiben. Spieler, nicht Spiegel."},
    {t:"Klarheit",z:"◇",x:"Zieht? Steht? Still? Nebelig oder Druck: schliessen, nicht vertiefen."},
    {t:"Versorgung",z:"☼",x:"Ich bin versorgt. Es ist so. Ohne zu hetzen. Soft."},
    {t:"Gesundheit",z:"☤",x:"Der Körper erinnert sich. Arzt parallel. Kein Erzwingen. Soft."},
    {t:"Nacht",z:"☽",x:"Nichts Neues setzen. Feld halten. Schlafen lassen. Still."}
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
    if(box) box.innerHTML=html(a,"Lage · steht")+html(b,"Block · zieht")+html(c,"Weg · still");
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
    ".kcard{display:block;background:linear-gradient(185deg,rgba(70,24,90,.62),rgba(12,8,28,.92));border:1px solid rgba(255,122,217,.2);border-radius:1.15rem;padding:.9rem .85rem 1rem;margin:.48rem 0;text-align:center}",
    ".kcard .group{display:block;margin:0 0 .2rem}",
    ".kcard b{display:block;font-family:Georgia,serif;font-size:1.12rem;margin:.1rem 0 .35rem}",
    ".kcard small{display:block;color:#c4b4e0;line-height:1.45;font-size:.82rem}",
    ".kz{font-size:2.15rem;line-height:1;margin:.12rem 0 .32rem;color:#ff9ad8;text-shadow:0 0 14px rgba(255,122,217,.55),0 0 24px rgba(126,240,230,.25)}",
    "#kOut .kcard{height:100%;margin:0;padding:.45rem .4rem;display:flex;flex-direction:column;align-items:center;justify-content:center}",
    "#kOut .kcard b{font-size:.95rem}",
    "#kOut .kcard small{font-size:.68rem}",
    "#dreiList .kcard{padding:1.05rem .95rem}",
    "#dreiList .kz{font-size:2.5rem}"
  ].join("");
  document.head.appendChild(s);
  showOne();
})();
