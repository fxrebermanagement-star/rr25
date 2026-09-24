(function(){
  var KEY="rr25_skizze";
  var ZIEL=[
    "Heute stehen. Ein Satz. Nicht vermehren.",
    "Feld zu. Dann erst öffnen.",
    "Die 9 halten. Nicht nachladen.",
    "Wasser. Körper. Alltag. Das ist das Siegel.",
    "Nur den Faden. Kein Urteil.",
    "Setzen und weg. Der Beobachter bleibt wach.",
    "Soft reicht. Hard nur mit Gate.",
    "Was steht, steht. Nicht nachschauen.",
    "Heimkehren bevor du fragst, ob es wirkt.",
    "Dank zuerst. Saat danach.",
    "Grenze spüren. Der Raum bleibt deiner.",
    "Ein Ziel. Kein Theater.",
    "Still, wenn es still ist. Nicht aus Pflicht zünden.",
    "Die Karte rät. Das Ritual setzt du getrennt.",
    "Bei den Deinen bleiben. Nicht die Geschichte des anderen werden.",
    "Echo-Tag: sichtbar lassen. Nicht nachsetzen.",
    "Versorgt. Geschützt. Es ist so.",
    "Die Bahn trägt. Du musst nicht schieben.",
    "Drei Atemzüge. Ich bin der Spieler.",
    "Loslassen ist auch Arbeit."
  ];
  var A=
    '<svg viewBox="0 0 360 190" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'+
    '<line x1="96" y1="62" x2="138" y2="62" stroke="#8a7aa0" stroke-width="1.6"/>'+
    '<line x1="222" y1="62" x2="264" y2="62" stroke="#8a7aa0" stroke-width="1.6"/>'+
    '<circle cx="64" cy="62" r="30" fill="#0b0812" stroke="#c0aad8" stroke-width="1.8"/>'+
    '<circle cx="180" cy="62" r="30" fill="#0b0812" stroke="#7ec8c0" stroke-width="1.8"/>'+
    '<circle cx="296" cy="62" r="30" fill="#0b0812" stroke="#d89ac0" stroke-width="1.8"/>'+
    '<text x="64" y="70" text-anchor="middle" font-size="24" fill="#f0e6fa" font-family="Georgia,serif">3</text>'+
    '<text x="180" y="70" text-anchor="middle" font-size="24" fill="#e4faf6" font-family="Georgia,serif">6</text>'+
    '<text x="296" y="70" text-anchor="middle" font-size="24" fill="#fadcea" font-family="Georgia,serif">9</text>'+
    '<text x="64" y="112" text-anchor="middle" font-size="13" fill="#b0a0c4" font-family="system-ui,sans-serif">stehen</text>'+
    '<text x="180" y="112" text-anchor="middle" font-size="13" fill="#8cbcb6" font-family="system-ui,sans-serif">tragen</text>'+
    '<text x="296" y="112" text-anchor="middle" font-size="13" fill="#d0a0b8" font-family="system-ui,sans-serif">siegeln</text>'+
    '<path d="M280 138 C 180 172, 180 172, 80 138" fill="none" stroke="#a8889c" stroke-width="1.5"/>'+
    '<polyline points="90,146 80,138 92,134" fill="none" stroke="#a8889c" stroke-width="1.5"/>'+
    '</svg>';
  var B=
    '<svg viewBox="0 0 360 190" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'+
    '<line x1="96" y1="62" x2="138" y2="62" stroke="#8a7aa0" stroke-width="1.6"/>'+
    '<line x1="222" y1="62" x2="264" y2="62" stroke="#8a7aa0" stroke-width="1.6"/>'+
    '<circle cx="64" cy="62" r="30" fill="#0b0812" stroke="#7ec8a0" stroke-width="1.8"/>'+
    '<circle cx="180" cy="62" r="30" fill="#0b0812" stroke="#c0aad8" stroke-width="1.8"/>'+
    '<circle cx="296" cy="62" r="30" fill="#0b0812" stroke="#e8c070" stroke-width="1.8"/>'+
    '<text x="64" y="68" text-anchor="middle" font-size="13" fill="#d8f0e4" font-family="Georgia,serif">Erde</text>'+
    '<text x="180" y="68" text-anchor="middle" font-size="13" fill="#eee4f8" font-family="Georgia,serif">Mensch</text>'+
    '<text x="296" y="68" text-anchor="middle" font-size="12" fill="#f8e8c0" font-family="Georgia,serif">Universum</text>'+
    '<text x="64" y="112" text-anchor="middle" font-size="13" fill="#b0a0c4" font-family="system-ui,sans-serif">stehen</text>'+
    '<text x="180" y="112" text-anchor="middle" font-size="13" fill="#8cbcb6" font-family="system-ui,sans-serif">tragen</text>'+
    '<text x="296" y="112" text-anchor="middle" font-size="13" fill="#c8b080" font-family="system-ui,sans-serif">siegeln</text>'+
    '<path d="M280 138 C 180 172, 180 172, 80 138" fill="none" stroke="#a8889c" stroke-width="1.5"/>'+
    '<polyline points="90,146 80,138 92,134" fill="none" stroke="#a8889c" stroke-width="1.5"/>'+
    '</svg>';
  function mode(){
    try{ return localStorage.getItem(KEY)==="emu"?"emu":"369"; }catch(e){ return "369"; }
  }
  function setMode(m){ try{ localStorage.setItem(KEY,m); }catch(e){} }
  function startOnly(){
    return !document.querySelector("#cats .chip.on");
  }
  function dayZiel(){
    var n=new Date();
    var key=n.getFullYear()+"-"+n.getMonth()+"-"+n.getDate();
    var h=0;
    for(var i=0;i<key.length;i++) h=(h*33+key.charCodeAt(i))%ZIEL.length;
    return ZIEL[h];
  }
  function draw(el){
    var z=dayZiel();
    el.innerHTML=(mode()==="emu"?B:A)+'<p class="skZiel"><span>Tagesziel</span>'+z+'</p>';
  }
  function mount(){
    var home=document.getElementById("home");
    var list=document.getElementById("list");
    if(!home) return null;
    var el=document.getElementById("skizze");
    if(!el){
      el=document.createElement("div");
      el.id="skizze";
      if(list) home.insertBefore(el, list);
      else home.appendChild(el);
      el.addEventListener("click", function(ev){
        if(ev.target.closest && ev.target.closest(".skZiel")) return;
        ev.stopPropagation();
        setMode(mode()==="emu"?"369":"emu");
        draw(el);
      });
    }
    draw(el);
    return el;
  }
  function paint(){
    var el=mount();
    if(!el) return;
    el.style.display=startOnly()?"block":"none";
  }
  var css=document.createElement("style");
  css.textContent=[
    "#skizze{display:block;margin:.15rem auto .2rem;width:92%;max-width:24rem;cursor:pointer}",
    "#skizze svg{display:block;width:100%;height:10.6rem}",
    "#skizze .skZiel{margin:.05rem 0 .15rem;text-align:center;font-family:Georgia,serif;font-size:.92rem;line-height:1.4;color:#ead8ff;cursor:default}",
    "#skizze .skZiel span{display:block;margin-bottom:.12rem;letter-spacing:.16em;text-transform:uppercase;font-size:.58rem;font-family:system-ui,sans-serif;color:#ff7ad9}",
    "#home:has(#cats .chip.on) #skizze{display:none!important}"
  ].join("");
  document.head.appendChild(css);
  mount(); paint();
  setTimeout(paint, 80);
  setTimeout(paint, 240);
  document.addEventListener("click", function(e){
    if(e.target.closest && e.target.closest("#skizze")) return;
    setTimeout(paint, 0); setTimeout(paint, 80);
  });
  if(typeof renderList==="function" && !renderList._sk){
    var rl=renderList;
    renderList=function(){ rl(); paint(); };
    renderList._sk=1;
  }
  if(typeof show==="function" && !show._sk){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="home") setTimeout(paint, 30);
      return r;
    };
    show._sk=1;
  }
})();
