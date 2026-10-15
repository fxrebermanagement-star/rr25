/* ritual-b66.js — Build 66: fünf stille Ergänzungen. Alles nur Anzeige, nichts davon schreibt in den Speicher.
   1) Mondfarbe: kaum sichtbarer Farbhauch hinter dem Inhalt je Mondphase (Vollmond etwas heller, Neumond tiefer).
   2) «Aus dem Feld»: ein kurzer Satz pro Tag auf Heute (nach Berner Datum, immer derselbe am selben Tag).
   3) Jahresrad: Ansicht im Kalender mit dem nächsten Fest und den Tagen bis dahin (Berner Datum).
   4) Serien-Zeichen: leises «N Tage in Folge», nur solange eine Serie besteht; Zählregel RR25_ZAEHLREGEL.isRitual.
   5) Mini-Skizzen: kleine Neon-Zeichen auf den Ritual-Karten und im Kopf des Rituals.
   Die Zeichen-Kachel wird nicht berührt. Texte und Zeichnungen sind neu und gehören nur zu dieser App. */
(function(){
  if(window.__rr25b66) return; window.__rr25b66=1;
  var mq=window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):null;
  function h(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }

  /* ---------- Berner Datum ---------- */
  function bern(ms){
    var d=new Date(ms==null?Date.now():ms);
    try{
      var p=new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Zurich",year:"numeric",month:"2-digit",day:"2-digit"}).formatToParts(d), o={};
      p.forEach(function(x){ o[x.type]=x.value; });
      return {y:+o.year,m:+o.month,d:+o.day};
    }catch(e){ return {y:d.getFullYear(),m:d.getMonth()+1,d:d.getDate()}; }
  }
  function dn(y,m,d){ return Math.round(Date.UTC(y,m-1,d)/86400000); }
  function todayN(){ var b=bern(); return dn(b.y,b.m,b.d); }

  /* ---------- 1) Mondfarbe ---------- */
  var mt=null;
  function moonTint(){
    var app=document.querySelector(".app"); if(!app) return;
    if(!mt){
      mt=document.createElement("div"); mt.id="mondTon"; mt.setAttribute("aria-hidden","true");
      var after=document.getElementById("sternSchnuppe")||document.getElementById("sternRest")||document.getElementById("sternFeld");
      if(after&&after.parentNode===app) app.insertBefore(mt,after.nextSibling); else app.insertBefore(mt,app.firstChild);
    }
    var p=0.5;
    try{ var M=window.RR25_MOND; if(M&&M.day) p=M.day(Date.now()).p; }catch(e){}
    var ill=(1-Math.cos(2*Math.PI*p))/2;           /* 0 Neumond … 1 Vollmond */
    var bg;
    if(ill>=0.5){ var a=((ill-0.5)*2*0.075).toFixed(3); bg="radial-gradient(120% 70% at 50% 0%,rgba(190,150,255,"+a+"),rgba(190,150,255,0) 70%)"; }
    else { var b=((0.5-ill)*2*0.2).toFixed(3); bg="linear-gradient(180deg,rgba(2,1,14,"+b+"),rgba(2,1,14,"+(b*0.6).toFixed(3)+"))"; }
    mt.style.background=bg;
  }

  /* ---------- 2) Aus dem Feld ---------- */
  var SPRUCH=[
    "Ich bin der Spieler. Heute darf das Spiel leicht sein.",
    "Die Quelle fragt nichts. Sie ist einfach da.",
    "Ein Atemzug reicht, um wieder in der Mitte zu stehen.",
    "Was du heute beginnst, darf klein anfangen.",
    "Zeit ist ein Fluss, kein Takt. Du darfst darin treiben.",
    "Kehr zurück, wann immer du magst. Die Tür steht offen.",
    "Das Ich schaut zu, das Spiel läuft, die Quelle trägt.",
    "Manches klärt sich erst, wenn du aufhörst zu drehen.",
    "Ein ruhiger Moment ist auch ein Zug im Spiel.",
    "Die Füsse wissen, wo der Boden ist.",
    "Was gestern schwer war, ist heute oft nur noch ein Schatten.",
    "Ein Satz genügt. Mehr braucht die Absicht nicht.",
    "Wer zurückkehrt, war nie weg.",
    "Die Quelle zählt nicht mit. Das Spiel auch nicht.",
    "Heute zeigt sich etwas Kleines. Schau hin, wenn es kommt.",
    "Zwischen zwei Gedanken liegt ein stiller Raum. Dort bist du.",
    "Du musst nichts festhalten, damit es dir gehört.",
    "Der Tag hat Platz für dich, so wie du heute bist.",
    "Ein Ritual ist ein Atemzug mit Absicht.",
    "Das Spiel wird leichter, wenn du die Figur loslässt.",
    "Die Zeit trägt dich. Du musst sie nicht schieben.",
    "Ich spüre meine Hände. Das genügt für den Anfang.",
    "Nichts muss heute fertig werden. Manches darf reifen.",
    "Das Feld antwortet leise. Hör auf die Pausen.",
    "Zurück bei mir. Das ist immer ein guter Ort.",
    "Ein warmer Gedanke wiegt mehr als zehn kluge.",
    "Die Quelle ist weder fern noch laut. Sie ist unter allem.",
    "Heute darf ein Anfang auch nur ein Blick aus dem Fenster sein.",
    "Wer das Spiel erkennt, spielt freier.",
    "Es gibt Tage zum Setzen und Tage zum Halten. Beide zählen.",
    "Du darfst langsam sein. Das Feld wartet gern.",
    "Ein Wort, ein Atem, ein Schritt. Mehr ist nicht nötig.",
    "Die Mitte liegt nicht weit weg. Sie liegt unter dem Brustbein.",
    "Was du dankbar ansiehst, wird weicher.",
    "Der Mond kommt und geht, und du bleibst Gast und Gastgeber zugleich.",
    "Ich bin hier. Das Spiel ist da. Die Quelle ist wach.",
    "Eine Grenze darf freundlich sein.",
    "Zeit lässt sich nicht sparen, nur verbringen. Verbring sie wohl.",
    "Heute ist ein guter Tag, um still zu werden.",
    "Rückkehr heisst: ankommen, ohne etwas mitzubringen.",
    "Kleine Rituale tragen weit, weil sie oft wiederkommen.",
    "Das Leichte ist nicht das Flache. Es ist das Getragene.",
    "Der Schleier ist dünn, wo Aufmerksamkeit ist.",
    "Du bist der Ort, an dem das Feld sich zeigt.",
    "Jeder Morgen ist ein unbeschriebener Zug.",
    "Wenn es eng wird, tritt einen Schritt zurück und schau aufs Brett.",
    "Atem rein, Atem raus. Das Spiel kann warten.",
    "Eine Kerze, ein Glas Wasser, ein Satz. Fertig ist die Schwelle.",
    "Nicht alles braucht eine Deutung. Manches darf einfach sein.",
    "Das Ich ist klein und das Spiel gross. Die Quelle umfasst beides.",
    "Schau, was heute schon gut ist. Dort fängt es an.",
    "Zeit verwandelt, wenn du ihr Raum gibst.",
    "Das Feld liest nicht deine Worte, es spürt deine Richtung.",
    "Du darfst abgeben, was dir nicht gehört.",
    "Zwischen Tun und Lassen liegt ein weiter Garten.",
    "Heute reicht es, zu bemerken, dass du da bist.",
    "Die Quelle schweigt freundlich. Du darfst es ihr gleichtun.",
    "Ein Tag ist ein kleines Leben. Beginn ihn mit Ruhe.",
    "Rückkehr ist ein Weg, den man jeden Tag neu findet.",
    "Spiel mit Ernst und lass den Ernst im Spiel nicht gewinnen.",
    "Am Abend darf der Tag zur Ruhe gehen, auch wenn nicht alles gelang."
  ];
  function spruch(){
    var n=todayN(), i=(((n*37+11)%SPRUCH.length)+SPRUCH.length)%SPRUCH.length;
    return SPRUCH[i];
  }
  function zeile(){
    var home=document.getElementById("home"); if(!home) return null;
    var z=document.getElementById("feldZeile");
    if(!z){
      z=document.createElement("div"); z.id="feldZeile";
      z.innerHTML='<p id="feldSpruch"><small>Aus dem Feld</small><span></span></p><p id="serieZ" hidden><i></i><span></span></p>';
    }
    var ms=document.getElementById("mondSag"), kast=document.getElementById("kasten");
    var anchor=ms||kast;
    if(anchor&&anchor.parentNode===home){ if(z.previousSibling!==anchor||z.parentNode!==home) home.insertBefore(z,anchor.nextSibling); }
    else if(!z.parentNode) home.appendChild(z);
    return z;
  }
  function paintSpruch(){
    var z=zeile(); if(!z) return;
    var s=z.querySelector("#feldSpruch span"), t=spruch();
    if(s.textContent!==t) s.textContent=t;
  }

  /* ---------- 4) Serien-Zeichen ---------- */
  function rows(){ try{ return (typeof load==="function"?load().log:JSON.parse(localStorage.getItem("rr25_ritual_v1")||"{}").log)||[]; }catch(e){ return []; } }
  function dayOf(e){
    var s=String(e&&e.t||""), m=s.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
    if(m) return dn(+m[3],+m[2],+m[1]);
    var p=Date.parse(s); if(isNaN(p)) return null; var b=bern(p); return dn(b.y,b.m,b.d);
  }
  function streak(){
    var Z=window.RR25_ZAEHLREGEL; if(!Z||!Z.isRitual) return 0;
    var set={}; rows().forEach(function(e){ try{ if(Z.isRitual(e)){ var d=dayOf(e); if(d!=null) set[d]=1; } }catch(x){} });
    var n=todayN(), c=set[n]?n:(set[n-1]?n-1:null); if(c==null) return 0;
    var k=0; while(set[c-k]) k++;
    return k;
  }
  function paintSerie(){
    var z=zeile(); if(!z) return;
    var el=z.querySelector("#serieZ"), k=streak();
    if(k>=2){ el.querySelector("span").textContent=k+" Tage in Folge"; el.hidden=false; } else el.hidden=true;
  }

  /* ---------- 3) Jahresrad ---------- */
  var FEST=[
    {n:"Yule",m:12,d:21},{n:"Imbolc",m:2,d:1},{n:"Ostara",m:3,d:20},{n:"Beltane",m:5,d:1},
    {n:"Litha",m:6,d:21},{n:"Lughnasadh",m:8,d:1},{n:"Mabon",m:9,d:22},{n:"Samhain",m:10,d:31}
  ];
  function nextFest(){
    var b=bern(), t=dn(b.y,b.m,b.d), best=null;
    FEST.forEach(function(f){
      [b.y,b.y+1].forEach(function(y){ var d=dn(y,f.m,f.d)-t; if(d>=0&&(!best||d<best.tage)) best={f:f,tage:d}; });
    });
    return best;
  }
  function rad(){
    var b=bern(), y=b.y, t=dn(b.y,b.m,b.d), y0=dn(y,1,1), len=dn(y+1,1,1)-y0, nx=nextFest();
    function pos(doy,r){ var a=(doy/len)*2*Math.PI-Math.PI/2; return [150+r*Math.cos(a),150+r*Math.sin(a),a]; }
    var s='<svg viewBox="0 0 300 300" class="jrSvg" aria-hidden="true"><circle cx="150" cy="150" r="92" class="jrRing"/><circle cx="150" cy="150" r="3" class="jrMid"/>';
    FEST.forEach(function(f){
      var doy=dn(y,f.m,f.d)-y0, p=pos(doy,92), q=pos(doy,112), on=nx&&nx.f===f;
      var cos=Math.cos(q[2]), anc=cos>0.3?"start":(cos<-0.3?"end":"middle");
      s+='<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="'+(on?7:4.5)+'" class="jrDot'+(on?" next":"")+'"/>'+
         '<text x="'+q[0].toFixed(1)+'" y="'+(q[1]+3.5).toFixed(1)+'" text-anchor="'+anc+'" class="jrTxt'+(on?" next":"")+'">'+f.n+'</text>';
    });
    var tp=pos(t-y0,92);
    s+='<circle cx="'+tp[0].toFixed(1)+'" cy="'+tp[1].toFixed(1)+'" r="3" class="jrHeute"/></svg>';
    var say=nx?(nx.tage===0?nx.f.n+" ist heute":(nx.tage===1?nx.f.n+" ist morgen":nx.f.n+" in "+nx.tage+" Tagen")):"";
    var sorted=FEST.slice().sort(function(a,c){ return a.m*100+a.d-(c.m*100+c.d); });
    var list=sorted.map(function(f){ return '<li'+(nx&&nx.f===f?' class="next"':'')+'><span>'+f.n+'</span><b>'+f.d+"."+f.m+".</b></li>"; }).join("");
    return '<p class="jrH">Jahresrad</p>'+s+'<p class="jrSay">'+h(say)+'</p><ul class="jrList">'+list+'</ul><p class="jrNote">Daten ungefähr, die Sonnenwenden schwanken um einen Tag. Berner Zeit.</p>';
  }
  function mountRad(){
    var sec=document.getElementById("kal"), row=sec&&sec.querySelector(".row"); if(!sec||!row) return;
    if(!document.getElementById("jrBtn")){
      var bt=document.createElement("button"); bt.type="button"; bt.className="btn ghost"; bt.id="jrBtn"; bt.textContent="Jahresrad";
      row.appendChild(bt);
      var p=document.createElement("div"); p.id="jrPanel"; p.className="card"; p.hidden=true;
      row.parentNode.insertBefore(p,row.nextSibling);
      bt.onclick=function(){ p.hidden=!p.hidden; bt.classList.toggle("on",!p.hidden); bt.textContent=p.hidden?"Jahresrad":"Jahresrad zu"; if(!p.hidden) p.innerHTML=rad(); };
    }
    var pn=document.getElementById("jrPanel"); if(pn&&!pn.hidden) pn.innerHTML=rad();
  }

  /* ---------- 5) Mini-Skizzen ---------- */
  var IC={
    schutz:'<path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6z"/><path d="M9 12l2 2 4-4"/>',
    dank:'<circle cx="12" cy="12" r="3.4"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/>',
    energie:'<path d="M13 3L6 13h5l-1 8 8-11h-5z"/>',
    liebe:'<path d="M12 20s-7-4.4-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.6-7 10-7 10z"/>',
    trennung:'<path d="M9 4c-3 3-3 13 0 16"/><path d="M15 4c3 3 3 13 0 16"/><path d="M12 9v1.5M12 13.5V15" stroke-dasharray="1 2"/>',
    hard:'<path d="M12 3l2.4 6 5.6 1-4.4 4 1.4 6.2L12 17l-5 3.2 1.4-6.2L4 10l5.6-1z"/>',
    feld:'<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
    rueck:'<path d="M19 12a7 7 0 11-3-5.7"/><path d="M16.5 3v3.6h-3.6"/>',
    mond:'<path d="M15 4a8 8 0 100 16 6.5 6.5 0 010-16z"/>'
  };
  var THEMA={dank:"dank",segen:"dank",schutz:"schutz",schutz2:"schutz",weg:"schutz",kreis:"schutz",raum:"schutz",stopp:"schutz",
    heil:"energie",karma:"energie",fuelle:"energie",zur:"rueck",anker:"rueck",abbr:"rueck",schlaf:"mond",
    anz:"liebe",einladen:"liebe",liebe:"liebe",liebe2:"liebe",trenn:"trennung",band:"trennung",trenn2:"trennung",
    fluch:"hard",ueber:"hard",wesen:"hard",ahn:"feld",neumond:"feld",vollmond:"feld",echo:"feld"};
  function themaOf(id){
    if(THEMA[id]) return THEMA[id];
    var r=null; try{ (window.RR_RITUALS||[]).forEach(function(x){ if(x.id===id) r=x; }); }catch(e){}
    if(r){ if(r.hard) return "hard"; var c={Schutz:"schutz",Energie:"energie",Liebe:"liebe",Trennung:"trennung",Feld:"feld",Alltag:"dank"}[r.cat]; if(c) return c; }
    return "feld";
  }
  function svg(id,cls){ var t=themaOf(id); return '<svg class="rIc '+(cls||"")+'" viewBox="0 0 24 24" aria-hidden="true">'+IC[t]+'</svg>'; }
  function decorate(){
    [].slice.call(document.querySelectorAll("#list .rcard[data-id], #pinDank")).forEach(function(c){
      if(c.querySelector(".rIc")) return;
      var id=c.getAttribute("data-id")||"dank";
      c.insertAdjacentHTML("afterbegin",svg(id)); c.classList.add("hasIc");
    });
    var run=document.getElementById("run"), hero=run&&run.querySelector(".hero");
    if(hero&&!hero.querySelector(".rIc")&&window._rid){ hero.insertAdjacentHTML("afterbegin",svg(window._rid,"big")); }
  }

  /* ---------- Stil ---------- */
  var css=document.createElement("style");
  css.textContent=[
    "#mondTon{position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:-1;pointer-events:none}",
    "#feldZeile{margin:.1rem 0 .45rem}",
    "#feldSpruch{margin:0;font-family:Georgia,serif;font-size:.86rem;line-height:1.4;font-style:italic;color:var(--dim)}",
    "#feldSpruch small{display:block;font-family:system-ui,sans-serif;font-style:normal;font-size:.56rem;letter-spacing:.18em;text-transform:uppercase;color:var(--ueberschrift);margin:0 0 .1rem}",
    "#serieZ{display:flex;align-items:center;gap:.4rem;margin:.3rem 0 0;font-size:.68rem;letter-spacing:.05em;color:var(--ueberschrift)}",
    "#serieZ[hidden]{display:none!important}",
    "#serieZ i{width:.42rem;height:.42rem;border-radius:50%;background:var(--akzent);box-shadow:0 0 8px 2px var(--glow)}",
    "#jrBtn{min-height:2.1rem!important;padding:.35rem 1rem!important;font-size:.76rem!important;border-radius:999px!important;border:1px solid rgba(200,120,255,.35)!important;background:rgba(160,90,255,.1)!important;color:var(--zahl)!important}",
    "#jrBtn.on{box-shadow:0 0 14px var(--glow)}",
    "#jrPanel{margin:0 0 .8rem;padding:.7rem .8rem .8rem;text-align:center}",
    "#jrPanel[hidden]{display:none!important}",
    ".jrH{margin:0 0 .1rem;font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:var(--ueberschrift)}",
    ".jrSvg{display:block;width:100%;max-width:19rem;margin:.2rem auto}",
    ".jrRing{fill:none;stroke:rgba(200,120,255,.35);stroke-width:1.2}.jrMid{fill:var(--glow)}",
    ".jrDot{fill:var(--ueberschrift);filter:drop-shadow(0 0 3px var(--glow))}.jrDot.next{fill:var(--akzent);filter:drop-shadow(0 0 7px var(--akzent))}",
    ".jrTxt{font-size:10px;fill:var(--dim)}.jrTxt.next{fill:var(--zahl);font-weight:600}",
    ".jrHeute{fill:#fff;opacity:.9}",
    ".jrSay{margin:.2rem 0 .4rem;font-family:Georgia,serif;font-size:1.02rem;color:var(--zahl)}",
    ".jrList{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:.1rem .9rem;text-align:left}",
    ".jrList li{display:flex;justify-content:space-between;font-size:.72rem;color:var(--dim);padding:.12rem 0}.jrList li.next{color:var(--zahl)}.jrList b{font-weight:500}",
    ".jrNote{margin:.5rem 0 0;font-size:.6rem;color:var(--dim);opacity:.8}",
    ".rIc{width:1.35rem;height:1.35rem;flex:none;fill:none;stroke:var(--ueberschrift);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 3px var(--glow))}",
    "#list .rcard.hasIc,#pinDank.hasIc{padding-left:2.9rem!important}",
    "#list .rcard>.rIc,#pinDank>.rIc{position:absolute!important;left:.85rem;top:50%;transform:translateY(-50%)}",
    "#pinDank{position:relative!important}",
    "#list .rcard.tone-hard>.rIc{stroke:#ff5470}#list .rcard.tone-grenze>.rIc{stroke:#ffb86b}#list .rcard.tone-soft>.rIc,#pinDank>.rIc{stroke:#5fe0a0}",
    ".hero .rIc.big{display:block;width:2.1rem;height:2.1rem;margin:0 auto .3rem}"
  ].join("");
  document.head.appendChild(css);

  /* ---------- Verdrahtung ---------- */
  function all(){ try{ moonTint(); paintSpruch(); paintSerie(); mountRad(); decorate(); }catch(e){} }
  if(typeof show==="function"&&!show._b66){ var sh=show; show=function(id){ var r=sh.apply(this,arguments); setTimeout(all,120); return r; }; show._b66=1; }
  if(typeof paintLog==="function"&&!paintLog._b66){ var pl=paintLog; paintLog=function(){ var r=pl.apply(this,arguments); setTimeout(paintSerie,120); return r; }; paintLog._b66=1; }
  document.addEventListener("click",function(){ setTimeout(function(){ paintSerie(); decorate(); },400); },true);
  document.addEventListener("visibilitychange",function(){ if(!document.hidden) all(); });
  [["list"],["run"],["home"]].forEach(function(a){
    var el=document.getElementById(a[0]);
    if(el&&window.MutationObserver) new MutationObserver(function(){ decorate(); if(a[0]==="home") paintSpruch(); }).observe(el,{childList:true,subtree:a[0]==="run"});
  });
  setInterval(function(){ if(!document.hidden) all(); },30*60*1000);
  all(); setTimeout(all,500); setTimeout(all,2000);
  window.RR25_B66={spruch:spruch,streak:streak,nextFest:nextFest,bern:bern};
})();
