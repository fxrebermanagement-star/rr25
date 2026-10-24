/* ritual-b66.js — Build 66: fünf stille Ergänzungen. Alles nur Anzeige, nichts davon schreibt in den Speicher.
   1) Mondfarbe: kaum sichtbarer Farbhauch hinter dem Inhalt je Mondphase (Vollmond etwas heller, Neumond tiefer).
   2) «Aus dem Feld»: ein kurzer Satz pro Tag auf Heute (nach Berner Datum, immer derselbe am selben Tag).
   3) Jahresrad (Build 68-71): ruhiges Rad mit Soft/Hard-Band, Mondmarkern und Finsternissen im Kalender mit Festkarten, Mondphase in der Mitte, Berner Datum.
   4) (Serien-Zeichen in Build 67 entfernt)
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
      z.innerHTML='<p id="feldSpruch"><small>Aus dem Feld</small><span></span></p>';
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

  /* ---------- 3) Jahresrad (Build 68: lebendiges Rad) ----------
     Acht Feste als leuchtende Knoten auf einem Ring in Saisonfarben (Violett bis Gold). Das Rad lässt sich seitlich wischen oder ziehen,
     rastet auf dem nächsten Fest ein und dreht beim Öffnen sanft dorthin. Antippen eines Festes zeigt eine kleine Karte.
     In der Mitte steht die aktuelle Mondphase. Bewegung nur solange das Panel offen ist; bei «Bewegung reduzieren» steht alles still. */
  var NS="http://www.w3.org/2000/svg";
  var FEST=[
    {n:"Yule",m:12,d:21,s:3,z:"Mittwinter",c:"#8f7bff",t:"Längste Nacht des Jahres. Danach kehrt das Licht Schritt für Schritt zurück.",f:"Das Licht beginnt klein. Du darfst es auch."},
    {n:"Imbolc",m:2,d:1,z:"Spätwinter",c:"#b48cff",t:"Erste Regung unter der Erde. Noch ist es kalt, aber etwas wacht auf.",f:"Unter dem Schnee regt sich schon etwas. Es braucht keine Eile."},
    {n:"Ostara",m:3,d:20,s:0,z:"Frühling",c:"#e58cff",t:"Tag und Nacht halten sich die Waage. Der Frühling beginnt.",f:"Gleichgewicht ist kein Stillstand, nur ein sanftes Pendeln."},
    {n:"Beltane",m:5,d:1,z:"Frühsommer",c:"#ff8ad8",t:"Blüte und Fülle. Das Leben zeigt sich nach aussen.",f:"Was blüht, darf gesehen werden."},
    {n:"Litha",m:6,d:21,s:1,z:"Hochsommer",c:"#ffd27a",t:"Längster Tag. Das Licht steht ganz oben.",f:"Heute reicht es, im Licht zu stehen."},
    {n:"Lughnasadh",m:8,d:1,z:"Spätsommer",c:"#ffbe6b",t:"Erste Ernte. Zeit, zu sammeln, was reif ist.",f:"Sammle, was reif ist, und lass dem Rest seine Zeit."},
    {n:"Mabon",m:9,d:22,s:2,z:"Herbst",c:"#ff9ec0",t:"Wieder Gleichgewicht von Tag und Nacht. Die Ernte wird eingeholt.",f:"Dank macht das Volle noch voller."},
    {n:"Samhain",m:10,d:31,z:"Spätherbst",c:"#c07cff",t:"Das Jahr wendet sich nach innen. Der Schleier gilt als dünn.",f:"Die Dunkelheit ist ein weiches Tuch. Du darfst dich hineinlegen."}
  ];
  /* Build 111: Sonnwenden und Tagundnachtgleichen exakt (Ephemeriden, UTC-Millisekunden) 2026-2030: Ostara, Litha, Mabon, Yule */
  var SOLT={2026:[1774017953449,1782030271360,1790121909386,1797886199830],2027:[1805574272012,1813587050420,1821679292808,1829443313493],2028:[1837131417675,1845144120081,1853235916611,1860999563753],2029:[1868688111603,1876700897055,1884793098354,1892556829160],2030:[1900245106942,1908257477807,1916350010453,1924114158159]};
  window.RR25_SOLT=SOLT;
  function fdate(f,y){ if(f.s!=null&&SOLT[y]){ var t=SOLT[y][f.s], b=bern(t); return {m:b.m,d:b.d,t:t,exakt:true}; } return {m:f.m,d:f.d,exakt:false}; }
  var MONAT=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"], WTAG=["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];
  function nextFest(){
    var b=bern(), t=dn(b.y,b.m,b.d), best=null;
    FEST.forEach(function(f){
      [b.y,b.y+1].forEach(function(y){ var fd=fdate(f,y), d=dn(y,fd.m,fd.d)-t; if(d>=0&&(!best||d<best.tage)) best={f:f,tage:d,y:y}; });
    });
    return best;
  }
  function still(){ return !!(mq&&mq.matches); }
  function el(tag,attrs,parent){ var e=document.createElementNS(NS,tag); for(var k in attrs) e.setAttribute(k,attrs[k]); if(parent) parent.appendChild(e); return e; }
  var JR=null;
  function moonPath(p,r){
    var k=Math.cos(2*Math.PI*p), wax=p<0.5, rx=Math.abs(k)*r;
    var o=wax?1:0, t=wax?(k>0?0:1):(k>0?1:0);
    return "M0,"+(-r)+" A"+r+","+r+" 0 0 "+o+" 0,"+r+" A"+rx.toFixed(2)+","+r+" 0 0 "+t+" 0,"+(-r)+"Z";
  }
  /* Build 69/70: Soft/Hard-Band, Mondmarker, Zeiträume und Finsternisse aus den vorhandenen Kalenderdaten (RR25_KAL, RR25_MOND) */
  var TONF={SAISON:{c:"#e0b45a",n:"Saison"},HARD:{c:"#ff5470",n:"Hard"},GRENZE:{c:"#ffb86b",n:"Grenze"},ECHO:{c:"#b98cff",n:"Echo"},STILL:{c:"#9a96a8",n:"Still"},SOFT:{c:"#5fe0a0",n:"Soft"}};
  var GRUND={
    "Venus rückläufig":"Venus läuft scheinbar rückwärts. Saison: nur Hinweis, ändert den Ton nicht.",
    "Merkur rückläufig":"Merkur läuft scheinbar rückwärts. Saison: nur Hinweis, ändert den Ton nicht.",
    "Mars rückläufig":"Mars läuft scheinbar rückwärts. Saison: nur Hinweis, ändert den Ton nicht.",
    "Rauhnächte":"Die Zeit zwischen den Jahren. Im Kalender als Still-Zeitraum geführt.",
    "Finsternis":"Sonnen- oder Mondfinsternis."
  };
  /* Finsternisse 2026 (NASA Five Millennium Catalog, grösste Phase in UT; hier in Berner Zeit angezeigt). Nur als Ergänzung, falls die Kalenderdaten das Jahr nicht abdecken. */
  var FINS_TAB={2026:[
    {t:Date.UTC(2026,1,17,12,12),art:"Ringförmige Sonnenfinsternis",sonne:1,sicht:"In Europa nicht sichtbar (Antarktis, Südspitze Südamerikas, südliches Afrika)."},
    {t:Date.UTC(2026,2,3,11,34),art:"Totale Mondfinsternis",sonne:0,sicht:"In Europa nicht sichtbar (Amerikas, Asien, Pazifik)."},
    {t:Date.UTC(2026,7,12,17,46),art:"Totale Sonnenfinsternis",sonne:1,sicht:"Total in Island und Spanien, in weiten Teilen Europas teilweise sichtbar."},
    {t:Date.UTC(2026,7,28,4,13),art:"Teilweise Mondfinsternis",sonne:0,sicht:"In Bern am frühen Morgen sichtbar, der Mond geht während der Finsternis unter."}
  ],
  /* Build 111: 2027 und 2028 (grösste Phase in UT, Sicht aus Bern) */
  2027:[
    {t:Date.UTC(2027,1,6,16,0),art:"Ringförmige Sonnenfinsternis",sonne:1,sicht:"In Bern nicht sichtbar (Südamerika, Atlantik, Westafrika)."},
    {t:Date.UTC(2027,1,20,23,13),art:"Halbschatten-Mondfinsternis",sonne:0,sicht:"In Bern sichtbar, aber kaum zu erkennen (nur Halbschatten)."},
    {t:Date.UTC(2027,6,18,16,3),art:"Halbschatten-Mondfinsternis",sonne:0,sicht:"In Bern nicht sichtbar (Mond unter dem Horizont)."},
    {t:Date.UTC(2027,7,2,10,7),art:"Totale Sonnenfinsternis",sonne:1,sicht:"Total in Südspanien, Nordafrika und Ägypten. In Bern teilweise, Maximum etwa 11:06 Uhr, rund 65 % bedeckt (nur mit Schutzbrille)."},
    {t:Date.UTC(2027,7,17,7,14),art:"Halbschatten-Mondfinsternis",sonne:0,sicht:"In Bern nicht sichtbar (Mond unter dem Horizont)."}
  ],
  2028:[
    {t:Date.UTC(2028,0,12,4,13),art:"Teilweise Mondfinsternis",sonne:0,sicht:"In Bern sichtbar, am frühen Morgen im Westen."},
    {t:Date.UTC(2028,0,26,15,8),art:"Ringförmige Sonnenfinsternis",sonne:1,sicht:"Ringförmig in Südamerika, Portugal und Spanien. In Bern gering teilweise kurz vor Sonnenuntergang."},
    {t:Date.UTC(2028,6,6,18,20),art:"Teilweise Mondfinsternis",sonne:0,sicht:"In Bern höchstens das Ende, tief im Südosten nach Mondaufgang."},
    {t:Date.UTC(2028,6,22,2,56),art:"Totale Sonnenfinsternis",sonne:1,sicht:"In Bern nicht sichtbar (Australien, Neuseeland)."},
    {t:Date.UTC(2028,11,31,16,52),art:"Totale Mondfinsternis",sonne:0,sicht:"In Bern sichtbar, kurz nach Mondaufgang am frühen Abend."}
  ]};
  /* Build 111: Rückläufigkeiten 2026 vor Beginn der Kalenderdaten (27.9.2026) */
  var RETRO_TAB=[{sz:"Merkur rückläufig",start:"2026-02-26",end:"2026-03-21"},{sz:"Merkur rückläufig",start:"2026-06-29",end:"2026-07-24"}];
  var WT2=["So","Mo","Di","Mi","Do","Fr","Sa"];
  function dstr(n){ var d=new Date(n*86400000); return WT2[d.getUTCDay()]+" "+d.getUTCDate()+"."+(d.getUTCMonth()+1)+"."; }
  function zeitBern(ms){
    try{ return new Intl.DateTimeFormat("de-CH",{timeZone:"Europe/Zurich",hour:"2-digit",minute:"2-digit"}).format(new Date(ms)); }catch(e){ var d=new Date(ms); return d.getHours()+":"+String(d.getMinutes()).padStart(2,"0"); }
  }
  function dayFromStr(s){ var p=String(s).slice(0,10).split("-"); return dn(+p[0],+p[1],+p[2]); }
  function yearData(y,y0,len){
    var out={moons:[],hard:[],lanes:[],eclipses:[],saison:[],left:[],tabUsed:false}, M=window.RR25_MOND, K=window.RR25_KAL;
    if(M&&M.events){
      var a=Date.UTC(y,0,1)-2*86400000, b=Date.UTC(y+1,0,1)+2*86400000;
      M.events(a,b).forEach(function(e){
        if(e.q!==0&&e.q!==2) return;
        var bd=bern(e.t), dd=dn(bd.y,bd.m,bd.d);
        if(dd<y0||dd>=y0+len) return;
        out.moons.push({q:e.q,t:e.t,d:dd});
        if(e.q===2) out.hard.push({s:dd-1,e:dd+2,full:e.t,d:dd});
      });
    }
    var ev=[]; try{ var D=K&&K.data&&K.data(); ev=(D&&D.events)||[]; }catch(x){}
    var lanesEnd=[], cov0=null; try{ cov0=K&&K.coverage&&K.coverage(); }catch(x){}
    var fromD=cov0&&cov0.from?(function(){ var c=bern(cov0.from); return dn(c.y,c.m,c.d); })():Infinity;
    RETRO_TAB.forEach(function(r){ if(dayFromStr(r.start)<fromD) ev=ev.concat([{t:"Saison · "+r.sz,start:r.start,end:r.end,sz:r.sz,tab:1}]); });
    ev.filter(function(e){ return e.sz&&GRUND[e.sz]&&e.sz!=="Finsternis"; }).sort(function(p,q){ return String(p.start).localeCompare(String(q.start)); }).forEach(function(e){
      var s=dayFromStr(e.start), en=e.end?dayFromStr(e.end):s+1;
      if(en<=y0||s>=y0+len) return;
      var k=String(e.t).split("·")[0].trim().toUpperCase(); if(/rückläufig/.test(String(e.sz))) k="SAISON"; if(!TONF[k]) k="SOFT";
      var ls=Math.max(s,y0), le=Math.min(en,y0+len), lane=0;
      while(lanesEnd[lane]!=null&&lanesEnd[lane]>ls) lane++;
      lanesEnd[lane]=le;
      out.lanes.push({s:ls,e:le,rs:s,re:en,k:k,lane:lane,sz:e.sz,t:e.t,tab:e.tab});
    });
    /* Finsternisse: erst Kalenderdaten, dann die Tabelle für fehlende */
    ev.filter(function(e){ return /Finsternis/.test(e.t)&&/HARD/.test(e.t)&&String(e.start).length<=10; }).forEach(function(e){
      var s=dayFromStr(e.start); if(s<y0||s>=y0+len) return;
      var sonne=/Sonne/.test(e.t);
      out.eclipses.push({d:s,sonne:sonne,art:sonne?"Sonnenfinsternis":"Mondfinsternis",src:"kal"});
    });
    (FINS_TAB[y]||[]).forEach(function(f){
      var bd=bern(f.t), dd=dn(bd.y,bd.m,bd.d), dup=out.eclipses.some(function(x){ return Math.abs(x.d-dd)<=1&&x.sonne===!!f.sonne; });
      if(dup){ out.eclipses.forEach(function(x){ if(Math.abs(x.d-dd)<=1&&x.sonne===!!f.sonne){ x.t=f.t; x.sicht=f.sicht; x.art=f.art; } }); out.tabUsed=true; return; }
      out.tabUsed=true;
      out.eclipses.push({d:dd,t:f.t,sonne:!!f.sonne,art:f.art,sicht:f.sicht,src:"tab"});
    });
    out.eclipses.sort(function(p,q){ return p.d-q.d; });
    /* Finsternis-Saison: Datei-Bänder, sonst etwa 2 Wochen vor und nach jeder Finsternis, überlappende zusammengefasst */
    var fileSeas=[];
    ev.filter(function(e){ return /^FINSTERNIS/i.test(e.t); }).forEach(function(e){ var s=dayFromStr(e.start), en=e.end?dayFromStr(e.end):s+1; if(en>y0&&s<y0+len) fileSeas.push({s:s,e:en}); });
    var iv=fileSeas.slice();
    out.eclipses.forEach(function(x){
      if(fileSeas.some(function(f){ return x.d>=f.s&&x.d<f.e; })) return;
      iv.push({s:x.d-14,e:x.d+15});
    });
    iv.sort(function(p,q){ return p.s-q.s; });
    iv.forEach(function(v){ var l=out.saison[out.saison.length-1]; if(l&&v.s<=l.e){ l.e=Math.max(l.e,v.e); } else out.saison.push({s:v.s,e:v.e}); });
    var cov=null; try{ cov=K&&K.coverage&&K.coverage(); }catch(x){}
    if(cov&&cov.from>Date.UTC(y,0,1)&&y!==2026){ var cd=bern(cov.from); out.left.push("Rückläufigkeiten sind erst ab "+cd.d+"."+cd.m+"."+cd.y+" eingetragen (Beginn der Kalenderdaten)"); }
    if(cov&&cov.to<Date.UTC(y+1,0,1)-864e5){ var ce=bern(cov.to-1); out.left.push("Rückläufigkeiten sind nur bis "+ce.d+"."+ce.m+"."+ce.y+" eingetragen (Ende der Kalenderdaten)"); }
    if(!FINS_TAB[y]&&!out.eclipses.length) out.left.push("Finsternisse "+y+" (weder in den Kalenderdaten noch in der Tabelle)");
    return out;
  }
  var MON3=["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];
  var RADMIN=2026, RADMAX=2030;
  function buildRad(box,yy){
    var b=bern(), cy=b.y, y=yy||b.y, t=dn(b.y,b.m,b.d), y0=dn(y,1,1), len=dn(y+1,1,1)-y0, nx=nextFest(), W=440, C=220, R=130, LR=154, isNow=(y===cy);
    var YD=yearData(y,y0,len);
    function ang(doy){ return doy/len*360; }
    function xy(a,r){ var q=a*Math.PI/180; return [C+r*Math.sin(q),C-r*Math.cos(q)]; }
    function arc(a0,a1,r){ var p0=xy(a0,r), p1=xy(a1,r); return "M"+p0[0].toFixed(1)+","+p0[1].toFixed(1)+" A"+r+","+r+" 0 "+((a1-a0)>180?1:0)+" 1 "+p1[0].toFixed(1)+","+p1[1].toFixed(1); }
    box.setAttribute("data-y",y);
    /* Build 111: Jahr wählen, Legende aus dem Gezeichneten, kurzer Hinweis mit «Mehr» */
    box.innerHTML='<div class="jrNav"><button type="button" class="jrY" data-d="-1" aria-label="Jahr zurück"'+(y<=RADMIN?' disabled':'')+'>‹</button><p class="jrH">Jahresrad '+y+'</p><button type="button" class="jrY" data-d="1" aria-label="Jahr vor"'+(y>=RADMAX?' disabled':'')+'>›</button></div>'+
      (isNow?'':'<p class="jrBackY"><button type="button" class="jrY" data-d="0">Zurück zu '+cy+'</button></p>')+
      '<div class="jrStage"></div><div class="jrCard"></div><div class="jrLeg"></div><p class="jrNote"></p><div class="jrMore" hidden></div>';
    [].forEach.call(box.querySelectorAll(".jrY"),function(bt){ bt.onclick=function(){ var d=+bt.getAttribute("data-d"), ny=d===0?cy:Math.max(RADMIN,Math.min(RADMAX,y+d)); if(JR){ JR.stop(); JR=null; } buildRad(box,ny); }; });
    var stage=box.querySelector(".jrStage"), card=box.querySelector(".jrCard"), note=box.querySelector(".jrNote"), more=box.querySelector(".jrMore");
    var hasStill=YD.lanes.some(function(l){ return l.k==="STILL"; }), hasRet=YD.lanes.some(function(l){ return l.k==="SAISON"; });
    var lg='<div><b>Ton</b><span><i class="d" style="background:#5fe0a0"></i>Soft</span><span><i class="l" style="background:#ff5470;height:5px"></i>Hard-Phase</span>'+(hasStill?'<span><i class="l" style="background:#9a96a8"></i>Still (Rauhnächte)</span>':'')+'</div>'+
      '<div><b>Mond</b><span><i class="d mv"></i>Vollmond</span><span><i class="d mn"></i>Neumond</span></div>'+
      '<div><b>Zeiten</b>'+(hasRet?'<span><i class="l"></i>Saison (rückläufig)</span>':'')+(YD.saison.length?'<span><i class="s"></i>Saison (Finsternis)</span>':'')+(YD.eclipses.length?'<span><i class="r"></i>Finsternis</span>':'')+(isNow?'<span><i class="h"></i>Heute</span>':'')+'</div>';
    box.querySelector(".jrLeg").innerHTML=lg;
    note.innerHTML='Hard: 3 Tage um jeden Vollmond. Gold = Saison, nur Hinweis. Berner Zeit. <button type="button" class="jrMoreB">Mehr</button>';
    more.textContent="Soft gilt ausserhalb der Hard-Phasen, ausser in den Still-Zeiten (Rauhnächte). Echo und Grenze zeigt der Kalender pro Tag. Rückläufigkeiten (Venus, Merkur, Mars) und die Finsternis-Saison sind Saison: nur Hinweis, sie ändern den Ton nicht. Finsternistage haben den Ton, den der Kalender für den Tag nennt. Dienstag (Mars) und Samstag (Saturn) sind keine Hard-Tage im Rad, Hard gilt dort nur in den Feintakten. Ostara, Litha, Mabon und Yule sind exakt gerechnet; Imbolc, Beltane, Lughnasadh und Samhain stehen auf ihren überlieferten Daten (ungefähr). "+
      (YD.tabUsed?"Finsternisdaten ergänzt nach NASA (grösste Phase, Berner Zeit), Sicht aus Bern. ":"")+(YD.left.length?"Hinweis: "+YD.left.join("; ")+".":"");
    note.querySelector(".jrMoreB").onclick=function(){ more.hidden=!more.hidden; this.textContent=more.hidden?"Mehr":"Weniger"; };
    var svg=el("svg",{viewBox:"-16 20 "+(W+32)+" 376","class":"jrSvg","aria-hidden":"true"},stage);
    var defs=el("defs",{},svg);
    var g=el("filter",{id:"jrGlow",x:"-60%",y:"-60%",width:"220%",height:"220%"},defs); el("feGaussianBlur",{stdDeviation:"2.2",result:"b"},g);
    var mg=el("feMerge",{},g); el("feMergeNode",{"in":"b"},mg); el("feMergeNode",{"in":"SourceGraphic"},mg);
    var rot=el("g",{"class":"jrRot"},svg);
    var infos=[];
    function info(o){ infos.push(o); return infos.length-1; }
    /* Ringe: gleichmässige Abstände (130 Feste, 116 Mond, 90 Soft/Hard, 78/71/64 Zeiträume, 54 Finsternis) */
    [130,90,54].forEach(function(r){ el("circle",{cx:C,cy:C,r:r,"class":"jrBase"},rot); });
    /* Monate: feine Teilstriche auf dem Festring, Namen auf r=104 */
    var mon=[];
    for(var m=1;m<=12;m++){
      var s0=dn(y,m,1)-y0, s1=dn(y,m+1,1)-y0, a0=ang(s0), a1=ang(s1), p=xy(a0,R-3), q=xy(a0,R+3);
      el("line",{x1:p[0].toFixed(1),y1:p[1].toFixed(1),x2:q[0].toFixed(1),y2:q[1].toFixed(1),"class":"jrTick"},rot);
      var tx=el("text",{"class":"jrMon","text-anchor":"middle"},svg); tx.textContent=MON3[m-1];
      mon.push({a:(a0+a1)/2,tx:tx});
    }
    var seas=[["Samhain","Imbolc","#7d6bff"],["Imbolc","Beltane","#c590ff"],["Beltane","Lughnasadh","#e8c46a"],["Lughnasadh","Samhain","#e89ab4"]];
    function fa(n){ for(var i=0;i<FEST.length;i++) if(FEST[i].n===n){ var f=FEST[i], fd=fdate(f,y); return ang(dn(y,fd.m,fd.d)-y0); } }
    seas.forEach(function(s){
      var a0=fa(s[0]), a1=fa(s[1]); if(a1<=a0) a1+=360;
      el("path",{d:arc(a0+1.2,a1-1.2,R),"class":"jrArc",stroke:s[2]},rot);
    });
    /* Soft/Hard */
    var soft=el("circle",{cx:C,cy:C,r:90,"class":"jrSoft","data-x":info({title:"Soft",when:"übriges Jahr",tag:"Soft",c:TONF.SOFT.c,text:"Ausserhalb der eingezeichneten Hard-Zeiten ist Soft. Weiche Arbeit trägt."})},rot);
    YD.hard.forEach(function(h){
      var a0=ang(h.s-y0), a1=ang(h.e-y0), d=arc(a0,a1,90);
      var id=info({title:"Hard-Phase",when:dstr(h.s)+" bis "+dstr(h.e-1)+" · 3 Tage",tag:"Hard",c:TONF.HARD.c,
        text:"Rund um den Vollmond ("+dstr(h.d)+" um "+zeitBern(h.full)+" Uhr, Berner Zeit): Ladung am stärksten. Jeden Abend Rückkehr · Anker."});
      el("path",{d:d,"class":"jrHardArc"},rot); el("path",{d:d,"class":"jrHit2","data-x":id},rot);
    });
    /* Zeiträume */
    YD.lanes.forEach(function(l){
      var r=78-7*l.lane, f=TONF[l.k]||TONF.SOFT, a0=ang(l.s-y0), a1=ang(l.e-y0); if(a1-a0<1.2) a1=a0+1.2;
      var id=info({title:l.sz,when:dstr(l.rs)+" bis "+dstr(l.re-1),tag:f.n,c:f.c,text:GRUND[l.sz]+(l.tab?" (vor Beginn der Kalenderdaten, aus Astronomiedaten ergänzt)":"")});
      el("path",{d:arc(a0,a1,r),"class":"jrLane",stroke:f.c},rot);
      el("path",{d:arc(a0,a1,r),"class":"jrHit2","data-x":id},rot);
    });
    /* Finsternis-Saison und Finsternisse (r=54) */
    YD.saison.forEach(function(v){
      var s=Math.max(v.s,y0), e=Math.min(v.e,y0+len), a0=ang(s-y0), a1=ang(e-y0);
      var id=info({title:"Finsternis-Saison",when:dstr(s)+(s!==v.s?" (Fortsetzung)":"")+" bis "+dstr(e-1)+(e<v.e?" (geht weiter)":""),tag:"Saison",c:TONF.SAISON.c,text:"Etwa zwei Wochen vor und nach einer Finsternis. Saison: nur Hinweis, ändert den Ton nicht. Beobachten und Echo lesen."});
      el("path",{d:arc(a0,a1,54),"class":"jrSais"},rot); el("path",{d:arc(a0,a1,54),"class":"jrHit2","data-x":id},rot);
    });
    YD.eclipses.forEach(function(e){
      var p=xy(ang(e.d-y0),54);
      var when=dstr(e.d)+(e.t?" um "+zeitBern(e.t)+" Uhr (grösste Phase, Berner Zeit)":"");
      var et="SOFT"; try{ var S0=window.RR25_KAL&&window.RR25_KAL.state(Date.UTC(1970,0,1)+e.d*86400000+11*3600000); var k0=S0&&(S0.tone||S0.kind); if(k0&&TONF[k0]) et=k0; }catch(x){}
      var id=info({title:e.art,when:when,tag:TONF[et].n,c:TONF[et].c,text:(e.sicht?e.sicht+" ":"")+"Ton an diesem Tag laut Kalender: "+TONF[et].n+". Die Finsternis-Saison davor und danach ist nur Hinweis."});
      el("path",{d:"M"+p[0].toFixed(1)+","+(p[1]-6).toFixed(1)+" l5,6 l-5,6 l-5,-6z","class":"jrEcl",filter:"url(#jrGlow)"},rot);
      el("circle",{cx:p[0].toFixed(1),cy:p[1].toFixed(1),r:"12","class":"jrHit","data-x":id},rot);
    });
    /* Mondmarker (r=116) */
    YD.moons.forEach(function(m){
      var p=xy(ang(m.d-y0),116), full=m.q===2;
      var id=info({title:full?"Vollmond":"Neumond",when:dstr(m.d)+" um "+zeitBern(m.t)+" Uhr (Berner Zeit)",tag:full?"Hard":"Mond",c:full?TONF.HARD.c:"#cdb6ff",
        text:full?"Um den Vollmond gilt eine Hard-Phase von 3 Tagen: der Tag davor, der Vollmondtag und der Tag danach.":"Neumond ist Aussaat. Neu setzen, still halten."});
      el("circle",{cx:p[0].toFixed(1),cy:p[1].toFixed(1),r:full?"5":"4.4","class":full?"jrMv":"jrMn"},rot);
      el("circle",{cx:p[0].toFixed(1),cy:p[1].toFixed(1),r:"10","class":"jrHit","data-x":id},rot);
    });
    var nodes=[];
    FEST.forEach(function(f,i){
      var fd=fdate(f,y), a=ang(dn(y,fd.m,fd.d)-y0), p=xy(a,R);
      var ring=el("circle",{cx:p[0].toFixed(1),cy:p[1].toFixed(1),r:"9","class":"jrHalo",fill:f.c},rot);
      var n=el("circle",{cx:p[0].toFixed(1),cy:p[1].toFixed(1),r:"4.6","class":"jrNode",fill:f.c},rot);
      el("circle",{cx:p[0].toFixed(1),cy:p[1].toFixed(1),r:"14","class":"jrHit","data-i":i},rot);
      var lab=el("text",{"class":"jrLab","text-anchor":"middle"},svg); lab.textContent=f.n;
      nodes.push({a:a,halo:ring,node:n,lab:lab});
    });
    /* heute */
    var tone="SOFT"; try{ var S=window.RR25_KAL&&window.RR25_KAL.state&&window.RR25_KAL.state(Date.now()); var tk=S&&(S.tone||S.kind); if(tk&&TONF[tk]) tone=tk; }catch(e){}
    var tf=TONF[tone], ta=ang(t-y0), tm=el("g",{"class":"jrToday"},rot); if(!isNow) tm.setAttribute("display","none");
    var tp=xy(0,R); el("circle",{cx:tp[0],cy:tp[1],r:"7","class":"jrPulse",fill:tf.c},tm); el("circle",{cx:tp[0],cy:tp[1],r:"3.8","class":"jrHeute",stroke:tf.c},tm);
    el("path",{d:"M"+C+","+(C-LR-24)+" l-5,-8 h10z","class":"jrPtr"},svg);
    var M=null; try{ M=window.RR25_MOND&&window.RR25_MOND.day(Date.now()); }catch(e){}
    var mgrp=el("g",{transform:"translate("+C+","+(C-12)+")","class":"jrMoon"},svg);
    if(M&&window.RR25_ICO&&window.RR25_ICO.moonArt){ var ma=el("g",{transform:"scale(2.05) translate(-12,-12)"},mgrp); ma.innerHTML=window.RR25_ICO.moonArt(M.p); } /* Build 123 */
    else { el("circle",{r:"22","class":"jrMoonBg"},mgrp); if(M) el("path",{d:moonPath(M.p,19.5),"class":"jrMoonLit"},mgrp); }
    var mt=el("text",{x:C,y:C+24,"text-anchor":"middle","class":"jrMoonT"},svg); mt.textContent=isNow&&M?M.name:"";
    var tt=el("text",{x:C,y:C+38,"text-anchor":"middle","class":"jrToneT"},svg); tt.textContent=isNow?"heute "+tf.n:String(y); tt.setAttribute("fill",isNow?tf.c:"#cdb6ff");
    if(!isNow) mgrp.setAttribute("display","none");
    var st={rot:0,mark:0,sel:-1,raf:0,anim:null};
    function norm(a){ a%=360; if(a<0) a+=360; return a; }
    function apply(){
      rot.setAttribute("transform","rotate("+st.rot.toFixed(2)+" "+C+" "+C+")");
      tm.setAttribute("transform","rotate("+st.mark.toFixed(2)+" "+C+" "+C+")");
      nodes.forEach(function(n){
        var aa=n.a+st.rot, q=xy(aa,LR-8), sn=Math.sin(aa*Math.PI/180), cs=Math.cos(aa*Math.PI/180); n.lab.setAttribute("text-anchor",sn>0.35?"start":(sn<-0.35?"end":"middle")); n.lab.setAttribute("x",(q[0]+(sn>0.35?8:(sn<-0.35?-8:0))).toFixed(1)); n.lab.setAttribute("y",(q[1]+(Math.abs(sn)<=0.35?(cs>0?-3:12):4)).toFixed(1));
      });
      mon.forEach(function(m){ var q=xy(m.a+st.rot,103); m.tx.setAttribute("x",q[0].toFixed(1)); m.tx.setAttribute("y",(q[1]+3).toFixed(1)); });
    }
    function nearest(){
      var best=0,bd=999; nodes.forEach(function(n,i){ var d=Math.abs(((norm(n.a+st.rot)+180)%360)-180); if(d<bd){ bd=d; best=i; } }); return best;
    }
    function days(i){
      var f=FEST[i], bb=bern(), tt=dn(bb.y,bb.m,bb.d), fd=fdate(f,y), d=dn(y,fd.m,fd.d)-tt;
      return {tage:d,y:y,fd:fd};
    }
    function buzzNow(){ try{ if(navigator.vibrate) navigator.vibrate(12); }catch(e){} }
    function cardHtml(name,when,tag,text,extra){
      return '<div class="jrHd"><b class="jrName">'+h(name)+'</b><span class="jrSea">'+h(tag)+'</span></div><span class="jrWhen">'+h(when)+'</span><p class="jrT">'+h(text)+'</p>'+(extra||"");
    }
    function showInfo(o,buzz){
      st.sel=-1; nodes.forEach(function(n){ n.halo.setAttribute("class","jrHalo"); n.lab.setAttribute("class","jrLab"); });
      card.style.setProperty("--jc",o.c);
      card.innerHTML=cardHtml(o.title,o.when,o.tag,o.text);
      if(buzz) buzzNow();
    }
    function show(i,buzz){
      st.sel=i; var f=FEST[i], dd=days(i), fd=dd.fd, dt=new Date(Date.UTC(dd.y,fd.m-1,fd.d));
      nodes.forEach(function(n,k){ n.halo.setAttribute("class","jrHalo"+(k===i?" on":"")); n.lab.setAttribute("class","jrLab"+(k===i?" on":"")); });
      var say=dd.tage===0?"heute":(dd.tage===1?"morgen":(dd.tage===-1?"gestern":(dd.tage<0?"vor "+(-dd.tage)+" Tagen":"in "+dd.tage+" Tagen")));
      var exakt=fd.exakt?" · "+zeitBern(fd.t)+" Uhr (Berner Zeit, exakt)":" · Datum ungefähr (überliefert)";
      card.style.setProperty("--jc",f.c);
      card.innerHTML=cardHtml(f.n,WTAG[dt.getUTCDay()]+", "+fd.d+". "+MONAT[fd.m-1]+" "+dd.y+exakt+" · "+say,f.z,f.t,'<p class="jrF"><small>Aus dem Feld</small>'+h(f.f)+'</p>');
      if(buzz) buzzNow();
    }
    function ease(x){ return 1-Math.pow(1-x,3); }
    function go(toRot,toMark,dur,done){
      cancelAnimationFrame(st.raf); st.anim=null;
      if(still()||dur<=0){ st.rot=toRot; if(toMark!=null) st.mark=toMark; apply(); if(done) done(); return; }
      var r0=st.rot, m0=st.mark, t0=performance.now();
      (function step(now){
        if(!document.body.contains(svg)) return;
        var x=Math.min(1,(now-t0)/dur), e=ease(x);
        st.rot=r0+(toRot-r0)*e; if(toMark!=null) st.mark=m0+(toMark-m0)*e; apply();
        if(x<1) st.raf=requestAnimationFrame(step); else if(done) done();
      })(t0);
    }
    function target(i){ var cur=st.rot, want=-nodes[i].a, d=((want-cur)%360+540)%360-180; return cur+d; }
    function pick(i,buzz){ show(i,buzz); go(target(i),null,600); }
    var drag=null, moved=false;
    svg.addEventListener("pointerdown",function(ev){ drag={x:ev.clientX,rot:st.rot,id:ev.pointerId}; moved=false; });
    svg.addEventListener("pointermove",function(ev){
      if(!drag) return; var dx=ev.clientX-drag.x;
      if(!moved&&Math.abs(dx)>6){ moved=true; try{ svg.setPointerCapture(drag.id); }catch(e){} cancelAnimationFrame(st.raf); }
      if(moved){ st.rot=drag.rot+dx*0.45; apply(); var s=nearest(); if(s!==st.sel) show(s,false); }
    });
    function end(){ if(!drag) return; var was=moved; drag=null; if(was){ var s=nearest(); show(s,true); go(target(s),null,450); } }
    svg.addEventListener("pointerup",end); svg.addEventListener("pointercancel",end);
    svg.addEventListener("click",function(ev){
      if(moved){ moved=false; return; }
      var t=ev.target; if(!t||!t.getAttribute) return;
      var onArc=t.getAttribute("data-x")!=null&&t.getAttribute("class")!=="jrHit", lim=onArc?15:24, bd=lim+1, bn=null;
      [].forEach.call(svg.querySelectorAll(".jrHit"),function(n){ var r=n.getBoundingClientRect(), d=Math.hypot(ev.clientX-(r.left+r.width/2),ev.clientY-(r.top+r.height/2)); if(d<bd){ bd=d; bn=n; } });
      if(bn&&bd<=lim) t=bn;
      if(t.getAttribute("data-i")!=null) pick(+t.getAttribute("data-i"),true);
      else if(t.getAttribute("data-x")!=null) showInfo(infos[+t.getAttribute("data-x")],true);
    });
    var ni=isNow?0:1; if(isNow) FEST.forEach(function(f,i){ if(nx&&nx.f===f) ni=i; });
    st.rot=-nodes[ni].a-70; st.mark=0; apply(); show(ni,false);
    go(-nodes[ni].a,isNow?ta:0,isNow?1400:500);
    JR={stop:function(){ cancelAnimationFrame(st.raf); }};
  }
  function mountRad(){
    var sec=document.getElementById("kal"), row=sec&&sec.querySelector(".row"); if(!sec||!row) return;
    if(!document.getElementById("jrBtn")){
      var bt=document.createElement("button"); bt.type="button"; bt.className="btn ghost"; bt.id="jrBtn"; bt.textContent="Jahresrad";
      row.appendChild(bt);
      var p=document.createElement("div"); p.id="jrPanel"; p.className="card"; p.hidden=true;
      row.parentNode.insertBefore(p,row.nextSibling);
      bt.onclick=function(){
        p.hidden=!p.hidden; bt.classList.toggle("on",!p.hidden); bt.textContent=p.hidden?"Jahresrad":"\u2715"; bt.setAttribute("aria-label",p.hidden?"Jahresrad öffnen":"Jahresrad schliessen");
        if(JR){ JR.stop(); JR=null; }
        if(!p.hidden) buildRad(p); else p.innerHTML="";
      };
    }
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
    "#feldZeile{margin:-.45rem 0 -.2rem;position:relative}",
    "#feldSpruch{margin:0;font-family:Georgia,serif;font-size:.78rem;line-height:1.3;font-style:italic;color:var(--dim)}",
    "#feldSpruch small{display:inline;font-family:system-ui,sans-serif;font-style:normal;font-size:.5rem;letter-spacing:.16em;text-transform:uppercase;color:var(--ueberschrift);margin:0 .45rem 0 0;vertical-align:.08em}",
    "#jrBtn{min-height:2.1rem!important;padding:.35rem 1rem!important;font-size:.76rem!important;border-radius:999px!important;border:1px solid rgba(200,120,255,.35)!important;background:rgba(160,90,255,.1)!important;color:var(--zahl)!important}",
    "#jrBtn.on{box-shadow:0 0 14px var(--glow)}",
    "#jrPanel{margin:0 0 .8rem;padding:.8rem .7rem .9rem;overflow:hidden}",
    "#jrPanel[hidden]{display:none!important}",
    ".jrH{margin:0 0 .2rem;text-align:center;font-size:.66rem;letter-spacing:.18em;text-transform:uppercase;color:var(--ueberschrift)}",
    ".jrSvg{display:block;width:100%;max-width:27rem;margin:0 auto;touch-action:pan-y;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;cursor:grab}",
    ".jrBase{fill:none;stroke:rgba(200,160,255,.22);stroke-width:1}",
    ".jrTick{stroke:rgba(200,160,255,.45);stroke-width:1}",
    ".jrMon{font-size:13px;fill:var(--dim);opacity:.95;letter-spacing:.04em}",
    ".jrArc{fill:none;stroke-width:2.6;stroke-linecap:round;opacity:.7}",
    ".jrSoft{fill:none;stroke:#5fe0a0;stroke-width:5;opacity:.22;cursor:pointer}",
    ".jrHardArc{fill:none;stroke:#ff5470;stroke-width:9;stroke-linecap:butt;opacity:.9}",
    ".jrHit2{fill:none;stroke:transparent;stroke-width:13;cursor:pointer}",
    ".jrLane{fill:none;stroke-width:3;stroke-linecap:round;opacity:.8}",
    ".jrSais{fill:none;stroke:#e0b45a;stroke-width:3;stroke-dasharray:4 4;stroke-linecap:butt;opacity:.8}",
    ".jrEcl{fill:#ff5470}",
    ".jrMv{fill:#fff3d8}.jrMn{fill:#0a0426;stroke:#cdb6ff;stroke-width:1.2}",
    ".jrNode{stroke:rgba(255,255,255,.5);stroke-width:1}",
    ".jrHalo{opacity:.14}.jrHalo.on{opacity:.34;animation:jrBeat 2.6s ease-in-out infinite;transform-box:fill-box;transform-origin:center}",
    ".jrHit{fill:transparent;cursor:pointer}",
    ".jrLab{font-size:14px;fill:var(--dim);pointer-events:none}.jrLab.on{fill:var(--zahl);font-weight:600}",
    ".jrHeute{fill:#fff;stroke-width:1.5}.jrPulse{opacity:.5;animation:jrBeat 2.2s ease-in-out infinite;transform-box:fill-box;transform-origin:center}",
    ".jrPtr{fill:var(--ueberschrift)}",
    ".jrMoonBg{fill:rgba(40,20,80,.7);stroke:rgba(200,160,255,.3);stroke-width:1}.jrMoonLit{fill:#f1e8ff}.jrMoonT{font-size:11px;fill:var(--dim);letter-spacing:.05em}.jrToneT{font-size:11.5px;letter-spacing:.05em;font-weight:600}",
    "@keyframes jrBeat{0%,100%{transform:scale(1);opacity:.4}50%{transform:scale(1.5);opacity:.12}}",
    "@media (prefers-reduced-motion:reduce){.jrHalo.on,.jrPulse{animation:none!important}}",
    ".jrLeg{display:grid;gap:.3rem;margin:.7rem .2rem .1rem;font-size:.72rem;color:var(--dim)}",
    ".jrLeg div{display:flex;flex-wrap:wrap;align-items:center;gap:.2rem .7rem}",
    ".jrLeg b{flex:0 0 3.4rem;font-weight:500;font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:var(--ueberschrift)}",
    ".jrLeg span{display:inline-flex;align-items:center;gap:.35rem}.jrLeg i{display:inline-block;flex:none}",
    ".jrLeg i.d{width:.55rem;height:.55rem;border-radius:50%}.jrLeg i.mv{background:#fff3d8}.jrLeg i.mn{background:#0a0426;border:1.2px solid #cdb6ff}",
    ".jrLeg i.l{width:.9rem;height:3px;border-radius:2px;background:#e0b45a}.jrLeg i.r{width:.5rem;height:.5rem;background:#ff5470;transform:rotate(45deg)}.jrLeg i.h{width:.55rem;height:.55rem;border-radius:50%;background:#fff;border:1.5px solid #5fe0a0;box-sizing:border-box}.jrLeg i.s{width:.9rem;height:0;border-top:3px dashed #e0b45a}",
    ".jrNav{display:flex;align-items:center;justify-content:center;gap:.6rem}.jrNav .jrH{margin:0;min-width:9rem}.jrY{min-width:2.6rem;min-height:2.6rem;border-radius:999px;border:1px solid rgba(200,160,255,.35);background:rgba(40,20,80,.5);color:var(--zahl);font-size:1.1rem;cursor:pointer}.jrY:disabled{opacity:.3}.jrBackY{text-align:center;margin:.3rem 0 0}.jrBackY .jrY{font-size:.8rem;padding:0 .9rem}",
    ".jrMoreB{background:none;border:0;padding:.2rem .3rem;color:var(--ueberschrift);text-decoration:underline;font-size:inherit;cursor:pointer}.jrMore{margin:.3rem .1rem 0;font-size:.74rem;line-height:1.5;color:var(--dim);text-align:left}",
    ".jrCard{margin:.5rem .1rem 0;min-height:6.2rem;padding:.7rem .85rem .75rem;border:1px solid rgba(200,160,255,.25);border-left:3px solid var(--jc,var(--ueberschrift));border-radius:.9rem;background:rgba(20,8,48,.5);text-align:left}",
    ".jrHd{display:flex;align-items:center;justify-content:space-between;gap:.6rem}",
    ".jrName{font-family:Georgia,serif;font-weight:400;font-size:1.1rem;color:var(--zahl)}",
    ".jrSea{flex:none;font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;padding:.12rem .5rem;border-radius:999px;border:1px solid var(--jc,var(--ueberschrift));color:var(--zahl)}",
    ".jrWhen{display:block;font-size:.78rem;color:var(--ueberschrift);margin:.15rem 0 .4rem}",
    ".jrT{margin:0;font-size:.85rem;line-height:1.45;color:var(--dim)}",
    ".jrF{margin:.5rem 0 0;padding-top:.45rem;border-top:1px solid rgba(200,160,255,.15);font-family:Georgia,serif;font-style:italic;font-size:.84rem;line-height:1.35;color:var(--zahl)}.jrF small{display:block;font-family:system-ui,sans-serif;font-style:normal;font-size:.5rem;letter-spacing:.16em;text-transform:uppercase;color:var(--ueberschrift);margin-bottom:.1rem}",
    ".jrNote{margin:.7rem .1rem 0;font-size:.78rem;line-height:1.5;color:var(--dim);opacity:.9;text-align:left}",
    ".rIc{width:1.35rem;height:1.35rem;flex:none;fill:none;stroke:var(--ueberschrift);stroke-width:1.5;stroke-linecap:round;stroke-linejoin:round;filter:drop-shadow(0 0 3px var(--glow))}",
    "#list .rcard.hasIc,#pinDank.hasIc{padding-left:2.9rem!important}",
    "#list .rcard>.rIc,#pinDank>.rIc{position:absolute!important;left:.85rem;top:50%;transform:translateY(-50%)}",
    "#pinDank{position:relative!important}",
    "#list .rcard.tone-hard>.rIc{stroke:#ff5470}#list .rcard.tone-grenze>.rIc{stroke:#ffb86b}#list .rcard.tone-soft>.rIc,#pinDank>.rIc{stroke:#5fe0a0}",
    ".hero .rIc.big{display:block;width:2.1rem;height:2.1rem;margin:0 auto .3rem}"
  ].join("");
  document.head.appendChild(css);

  /* ---------- Verdrahtung ---------- */
  function yearCheck(){
    var p=document.getElementById("jrPanel");
    if(p&&!p.hidden&&p.getAttribute("data-y")&&+p.getAttribute("data-y")!==bern().y){ if(JR){ JR.stop(); JR=null; } buildRad(p); }
  }
  function all(){ try{ moonTint(); paintSpruch(); mountRad(); decorate(); yearCheck(); }catch(e){} }
  if(typeof show==="function"&&!show._b66){ var sh=show; show=function(id){ var r=sh.apply(this,arguments); setTimeout(all,120); return r; }; show._b66=1; }
  document.addEventListener("click",function(){ setTimeout(function(){ decorate(); },400); },true);
  document.addEventListener("visibilitychange",function(){ if(!document.hidden) all(); });
  [["list"],["run"],["home"]].forEach(function(a){
    var el=document.getElementById(a[0]);
    if(el&&window.MutationObserver) new MutationObserver(function(){ decorate(); if(a[0]==="home") paintSpruch(); }).observe(el,{childList:true,subtree:a[0]==="run"});
  });
  setInterval(function(){ if(!document.hidden) all(); },30*60*1000);
  all(); setTimeout(all,500); setTimeout(all,2000);
  window.RR25_B66={spruch:spruch,nextFest:nextFest,bern:bern};
})();
