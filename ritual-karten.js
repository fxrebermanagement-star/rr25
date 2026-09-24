(function(){
  var KEY="rr25_karte_v2";
  var DECK=[
    {t:"Der Spieler",z:"\u2609",x:"Du bist nicht die Figur. Beobachter wach. Karte rät. Ritual setzt du getrennt."},
    {t:"Die 9",z:"\u2234",x:"Nicht vermehren. Vollenden. Was gesetzt ist, darf stehen. Aufstehen vom Tisch."},
    {t:"Feld zu",z:"\u26e8",x:"Grenze spüren. Nichts Fremdes hat Zutritt. Soft-Schutz. Kein Name als Auftrag."},
    {t:"Faden",z:"\u16c5",x:"Nur den Faden. Kein Urteil. Kein Nachsetzen. Soft-Trennung, nicht Hard aus der Karte."},
    {t:"Rückkehr",z:"\u21a9",x:"Ich bin nicht der andere. Energie zurück. Wasser, Körper, Alltag. Die 9."},
    {t:"Segen",z:"\u2625",x:"Setzen, nicht bitten. Ein Satz. Danke. Es ist so. Soft. Abgeben."},
    {t:"Grenze",z:"\u2b21",x:"So weit öffnen, wie es stimmig ist. Unklares bleibt draußen. Hard braucht Gate, nicht diese Karte."},
    {t:"369",z:"\u22ee",x:"Dreimal setzen. Sechsmal halten. Neunmal vollenden. Dann loslassen. Ohne 9 bleibt die 6."},
    {t:"Halt",z:"\u25a3",x:"Heute nicht mehr Arbeit. Was steht, steht. Nicht nachladen. Nicht nachschauen."},
    {t:"Erden",z:"\u25bd",x:"Füße. Atem. Wasser. Der Auftrag endet im Körper. Handy weg."},
    {t:"Schutz",z:"\u26e4",x:"Feld geschlossen. Fremdes prallt ab oder geht in die Erde. Soft. Kein Nachschlagen."},
    {t:"Liebe ohne Zwang",z:"\u2766",x:"Nähe nur wenn sie wahr ist. Jeder bleibt frei. Halten wollen ist Bindung — anderes Ritual."},
    {t:"Trennung",z:"\u2694",x:"Der Faden zu dir darf gehen. Zwei andere schneiden ist Hard. Hier nur dein Faden."},
    {t:"Ausgleich",z:"\u2696",x:"Nicht Rache. Was genommen wurde, kehrt rein zurück. Kein Blick auf den Fall des anderen."},
    {t:"Ahnen",z:"\u16df",x:"Ehren und begrenzen. Nähe ja. Verschmelzung nein. Last bleibt draußen."},
    {t:"Wesenheit",z:"\u25c8",x:"Nur wenn der Faden nicht reicht. Hartes Ende. Danach zurück. Kein Alltagskontakt."},
    {t:"Filter",z:"\u2b22",x:"Nur klare Präsenz. Was drängt, bleibt draußen. Nebel? Schliessen."},
    {t:"Saat",z:"\u2731",x:"Ein Satz. Setzen. Nicht wässern aus Angst. Soft öffnet. Hard startest du nicht von hier."},
    {t:"Loslassen",z:"\u263e",x:"Die Arbeit ist übergeben. Nicht nachladen. So sei es."},
    {t:"Mitte",z:"\u2295",x:"Nicht die Geschichte des anderen werden. Bei dir bleiben. Spieler, nicht Spiegel."},
    {t:"Klarheit",z:"\u25c7",x:"Zieht? Steht? Still? Nebelig oder Druck: schliessen, nicht vertiefen."},
    {t:"Versorgung",z:"\u263c",x:"Ich bin versorgt. Es ist so. Ohne zu hetzen. Soft."},
    {t:"Gesundheit",z:"\u2624",x:"Der Körper erinnert sich. Arzt parallel. Kein Erzwingen. Soft."},
    {t:"Nacht",z:"\u263d",x:"Nichts Neues setzen. Feld halten. Schlafen lassen. Still."}
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
  function html(c,label,tone){
    return '<div class="kcard ktone-'+tone+'"><span class="group">'+label+'</span><div class="kz">'+(c.z||"\u2609")+'</div><b>'+c.t+'</b><small>'+c.x+'</small></div>';
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
    if(out) out.innerHTML=html(drawDay(),"Heute","soft");
  }
  function showDrei(){
    var a=pick([]),b=pick([a.t]),c=pick([a.t,b.t]);
    var box=document.getElementById("dreiList");
    if(box) box.innerHTML=html(a,"Lage \u00b7 steht","soft")+html(b,"Block \u00b7 zieht","hard")+html(c,"Weg \u00b7 still","echo");
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
    ".kcard b{display:block;font-family:Georgia,serif;font-size:1.18rem;margin:.1rem 0 .35rem}",
    ".kcard small{display:block;color:#c4b4e0;line-height:1.4;font-size:.8rem}",
    ".kz{font-size:2.15rem;line-height:1;margin:.12rem 0 .32rem;color:#ff9ad8;text-shadow:0 0 14px rgba(255,122,217,.55),0 0 24px rgba(126,240,230,.25)}",
    "#kOut .kcard{height:100%;margin:0;padding:.5rem .42rem;display:flex;flex-direction:column;align-items:center;justify-content:center}",
    "#kOut .kcard b{font-size:1.02rem}",
    "#kOut .kcard small{font-size:.7rem;line-height:1.35}",
    "#dreiList .kcard{padding:1.05rem .95rem;border-left:5px solid transparent}",
    "#dreiList .kz{font-size:2.5rem}",
    ".ktone-soft{border-color:rgba(46,204,113,.45)}",
    ".ktone-soft .group,.ktone-soft b{color:#7dffb0}",
    ".ktone-hard{border-color:rgba(231,76,60,.5)}",
    ".ktone-hard .group,.ktone-hard b{color:#ff8a7a}",
    ".ktone-echo{border-color:rgba(93,173,226,.5)}",
    ".ktone-echo .group,.ktone-echo b{color:#8fd4ff}",
    "#kasten{margin-bottom:.15rem}"
  ].join("");
  document.head.appendChild(s);
  showOne();
})();
