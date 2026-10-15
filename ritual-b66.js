/* ritual-b66.js — Build 66: fünf stille Ergänzungen. Alles nur Anzeige, nichts davon schreibt in den Speicher.
   1) Mondfarbe: kaum sichtbarer Farbhauch hinter dem Inhalt je Mondphase (Vollmond etwas heller, Neumond tiefer).
   2) «Aus dem Feld»: ein kurzer Satz pro Tag auf Heute (nach Berner Datum, immer derselbe am selben Tag).
   3) Jahresrad (Build 68): lebendiges Rad im Kalender mit Festkarten, Mondphase in der Mitte, Berner Datum.
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
    {n:"Yule",m:12,d:21,z:"Mittwinter",c:"#8f7bff",t:"Längste Nacht des Jahres. Danach kehrt das Licht Schritt für Schritt zurück.",f:"Das Licht beginnt klein. Du darfst es auch."},
    {n:"Imbolc",m:2,d:1,z:"Spätwinter",c:"#b48cff",t:"Erste Regung unter der Erde. Noch ist es kalt, aber etwas wacht auf.",f:"Unter dem Schnee regt sich schon etwas. Es braucht keine Eile."},
    {n:"Ostara",m:3,d:20,z:"Frühling",c:"#e58cff",t:"Tag und Nacht halten sich die Waage. Der Frühling beginnt.",f:"Gleichgewicht ist kein Stillstand, nur ein sanftes Pendeln."},
    {n:"Beltane",m:5,d:1,z:"Frühsommer",c:"#ff8ad8",t:"Blüte und Fülle. Das Leben zeigt sich nach aussen.",f:"Was blüht, darf gesehen werden."},
    {n:"Litha",m:6,d:21,z:"Hochsommer",c:"#ffd27a",t:"Längster Tag. Das Licht steht ganz oben.",f:"Heute reicht es, im Licht zu stehen."},
    {n:"Lughnasadh",m:8,d:1,z:"Spätsommer",c:"#ffbe6b",t:"Erste Ernte. Zeit, zu sammeln, was reif ist.",f:"Sammle, was reif ist, und lass dem Rest seine Zeit."},
    {n:"Mabon",m:9,d:22,z:"Herbst",c:"#ff9ec0",t:"Wieder Gleichgewicht von Tag und Nacht. Die Ernte wird eingeholt.",f:"Dank macht das Volle noch voller."},
    {n:"Samhain",m:10,d:31,z:"Spätherbst",c:"#c07cff",t:"Das Jahr wendet sich nach innen. Der Schleier gilt als dünn.",f:"Die Dunkelheit ist ein weiches Tuch. Du darfst dich hineinlegen."}
  ];
  var MONAT=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"], WTAG=["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];
  function nextFest(){
    var b=bern(), t=dn(b.y,b.m,b.d), best=null;
    FEST.forEach(function(f){
      [b.y,b.y+1].forEach(function(y){ var d=dn(y,f.m,f.d)-t; if(d>=0&&(!best||d<best.tage)) best={f:f,tage:d,y:y}; });
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
  function buildRad(box){
    var b=bern(), y=b.y, t=dn(b.y,b.m,b.d), y0=dn(y,1,1), len=dn(y+1,1,1)-y0, nx=nextFest(), C=170, R=100, LR=130;
    function ang(doy){ return doy/len*360; }
    function xy(a,r){ var q=a*Math.PI/180; return [C+r*Math.sin(q),C-r*Math.cos(q)]; }
    box.innerHTML='<p class="jrH">Jahresrad</p><div class="jrStage"></div><div class="jrCard"></div><p class="jrNote">Daten ungefähr, die Sonnenwenden schwanken um einen Tag. Berner Zeit. Wischen oder tippen.</p>';
    var stage=box.querySelector(".jrStage"), card=box.querySelector(".jrCard");
    var svg=el("svg",{viewBox:"0 0 340 340","class":"jrSvg","aria-hidden":"true"},stage);
    var defs=el("defs",{},svg);
    var g=el("filter",{id:"jrGlow",x:"-60%",y:"-60%",width:"220%",height:"220%"},defs); el("feGaussianBlur",{stdDeviation:"3.2",result:"b"},g);
    var mg=el("feMerge",{},g); el("feMergeNode",{"in":"b"},mg); el("feMergeNode",{"in":"SourceGraphic"},mg);
    /* Funkeln */
    var sp=el("g",{"class":"jrSpark"},svg), seed=7, rn=function(){ seed=(seed*16807)%2147483647; return (seed-1)/2147483646; };
    for(var i=0;i<16;i++){ var c=el("circle",{cx:(8+rn()*324).toFixed(1),cy:(8+rn()*324).toFixed(1),r:(0.5+rn()*1.1).toFixed(2),"class":"jrTw"},sp); c.style.animationDelay=(rn()*4).toFixed(2)+"s"; c.style.animationDuration=(2.4+rn()*3).toFixed(2)+"s"; }
    var shoot=el("line",{x1:"0",y1:"0",x2:"-46",y2:"-18","class":"jrShoot",opacity:"0"},svg);
    var rot=el("g",{"class":"jrRot"},svg);
    /* Saisonbogen: vier Abschnitte zwischen den Festen */
    var seas=[["Samhain","Imbolc","#7d6bff"],["Imbolc","Beltane","#d98cff"],["Beltane","Lughnasadh","#ffd27a"],["Lughnasadh","Samhain","#ff9ec0"]];
    function fa(n){ for(var i=0;i<FEST.length;i++) if(FEST[i].n===n){ var f=FEST[i]; return ang(dn(y,f.m,f.d)-y0); } }
    seas.forEach(function(s){
      var a0=fa(s[0]), a1=fa(s[1]); if(a1<=a0) a1+=360;
      var p0=xy(a0+1.5,R), p1=xy(a1-1.5,R);
      el("path",{d:"M"+p0[0].toFixed(1)+","+p0[1].toFixed(1)+" A"+R+","+R+" 0 "+((a1-a0)>180?1:0)+" 1 "+p1[0].toFixed(1)+","+p1[1].toFixed(1),"class":"jrArc",stroke:s[2]},rot);
    });
    var nodes=[];
    FEST.forEach(function(f,i){
      var a=ang(dn(y,f.m,f.d)-y0), p=xy(a,R);
      var ring=el("circle",{cx:p[0].toFixed(1),cy:p[1].toFixed(1),r:"11","class":"jrHalo",fill:f.c},rot);
      var n=el("circle",{cx:p[0].toFixed(1),cy:p[1].toFixed(1),r:"6","class":"jrNode",fill:f.c,filter:"url(#jrGlow)"},rot);
      var hit=el("circle",{cx:p[0].toFixed(1),cy:p[1].toFixed(1),r:"17","class":"jrHit","data-i":i},rot);
      var lab=el("text",{"class":"jrLab","text-anchor":"middle"},svg); lab.textContent=f.n;
      nodes.push({a:a,halo:ring,node:n,lab:lab});
    });
    /* heute */
    var ta=ang(t-y0), tm=el("g",{"class":"jrToday"},rot);
    var tp=xy(0,R); var pu=el("circle",{cx:tp[0],cy:tp[1],r:"4","class":"jrPulse"},tm); el("circle",{cx:tp[0],cy:tp[1],r:"3","class":"jrHeute"},tm);
    /* Zeiger oben */
    el("path",{d:"M170,52 l-6,-10 h12z","class":"jrPtr"},svg);
    /* Mond in der Mitte */
    var M=null; try{ M=window.RR25_MOND&&window.RR25_MOND.day(Date.now()); }catch(e){}
    var mgrp=el("g",{transform:"translate(170,170)","class":"jrMoon"},svg);
    el("circle",{r:"26","class":"jrMoonBg"},mgrp);
    if(M) el("path",{d:moonPath(M.p,23),"class":"jrMoonLit"},mgrp);
    var mt=el("text",{y:"44","text-anchor":"middle","class":"jrMoonT"},svg); mt.setAttribute("x","170"); mt.setAttribute("y","214"); mt.textContent=M?M.name:"";
    var st={rot:0,mark:0,sel:-1,raf:0,anim:null};
    function norm(a){ a%=360; if(a<0) a+=360; return a; }
    function apply(){
      rot.setAttribute("transform","rotate("+st.rot.toFixed(2)+" "+C+" "+C+")");
      tm.setAttribute("transform","rotate("+st.mark.toFixed(2)+" "+C+" "+C+")");
      nodes.forEach(function(n,i){
        var aa=n.a+st.rot, q=xy(aa,LR-12), sn=Math.sin(aa*Math.PI/180); n.lab.setAttribute("text-anchor",sn>0.35?"start":(sn<-0.35?"end":"middle")); n.lab.setAttribute("x",(q[0]+(sn>0.35?10:(sn<-0.35?-10:0))).toFixed(1)); n.lab.setAttribute("y",(q[1]+(Math.abs(sn)<=0.35?(Math.cos(aa*Math.PI/180)>0?-2:12):3.5)).toFixed(1));
      });
    }
    function nearest(){
      var best=0,bd=999; nodes.forEach(function(n,i){ var d=Math.abs(((norm(n.a+st.rot)+180)%360)-180); if(d<bd){ bd=d; best=i; } }); return best;
    }
    function days(i){
      var f=FEST[i], bb=bern(), tt=dn(bb.y,bb.m,bb.d), yy=bb.y, d=dn(yy,f.m,f.d)-tt; if(d<0){ yy++; d=dn(yy,f.m,f.d)-tt; }
      return {tage:d,y:yy};
    }
    function show(i,buzz){
      st.sel=i; var f=FEST[i], dd=days(i), dt=new Date(Date.UTC(dd.y,f.m-1,f.d));
      nodes.forEach(function(n,k){ n.halo.setAttribute("class","jrHalo"+(k===i?" on":"")); n.lab.setAttribute("class","jrLab"+(k===i?" on":"")); });
      var say=dd.tage===0?"heute":(dd.tage===1?"morgen":"in "+dd.tage+" Tagen");
      card.style.borderColor=f.c; card.style.setProperty("--jc",f.c);
      card.innerHTML='<b class="jrName">'+h(f.n)+'</b><span class="jrWhen">'+WTAG[dt.getUTCDay()]+', '+f.d+'. '+MONAT[f.m-1]+' '+dd.y+' · '+say+'</span>'+
        '<span class="jrSea">'+h(f.z)+'</span><p class="jrT">'+h(f.t)+'</p><p class="jrF"><small>Aus dem Feld</small>'+h(f.f)+'</p>';
      if(buzz){ try{ if(navigator.vibrate) navigator.vibrate(12); }catch(e){} }
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
    /* Eingaben */
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
      var t=ev.target; if(t&&t.getAttribute&&t.getAttribute("data-i")!=null) pick(+t.getAttribute("data-i"),true);
    });
    /* Start: Rad dreht zum nächsten Fest, Marker für heute läuft zum Platz auf dem Ring */
    var ni=0; FEST.forEach(function(f,i){ if(nx&&nx.f===f) ni=i; });
    st.rot=-nodes[ni].a-70; st.mark=0; apply(); show(ni,false);
    go(-nodes[ni].a,ta,1400);
    /* gelegentliche Sternschnuppe im Panel */
    var timer=0;
    function schnuppe(){
      timer=setTimeout(schnuppe,5000+Math.random()*5000);
      if(still()||document.hidden||!shoot.animate||!document.body.contains(svg)) return;
      var x=40+Math.random()*260, yy=20+Math.random()*90;
      shoot.setAttribute("transform","translate("+x.toFixed(0)+","+yy.toFixed(0)+")");
      shoot.animate([{opacity:0,transform:"translate("+x.toFixed(0)+"px,"+yy.toFixed(0)+"px)"},{opacity:.95,offset:.2},{opacity:0,transform:"translate("+(x+70).toFixed(0)+"px,"+(yy+28).toFixed(0)+"px)"}],{duration:900,easing:"ease-out"});
    }
    if(!still()) timer=setTimeout(schnuppe,2500);
    JR={stop:function(){ cancelAnimationFrame(st.raf); clearTimeout(timer); }};
  }
  function mountRad(){
    var sec=document.getElementById("kal"), row=sec&&sec.querySelector(".row"); if(!sec||!row) return;
    if(!document.getElementById("jrBtn")){
      var bt=document.createElement("button"); bt.type="button"; bt.className="btn ghost"; bt.id="jrBtn"; bt.textContent="Jahresrad";
      row.appendChild(bt);
      var p=document.createElement("div"); p.id="jrPanel"; p.className="card"; p.hidden=true;
      row.parentNode.insertBefore(p,row.nextSibling);
      bt.onclick=function(){
        p.hidden=!p.hidden; bt.classList.toggle("on",!p.hidden); bt.textContent=p.hidden?"Jahresrad":"Jahresrad zu";
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
    "#jrPanel{margin:0 0 .8rem;padding:.7rem .7rem .8rem;text-align:center;overflow:hidden}",
    "#jrPanel[hidden]{display:none!important}",
    ".jrH{margin:0;font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:var(--ueberschrift)}",
    ".jrSvg{display:block;width:100%;max-width:21rem;margin:0 auto;touch-action:pan-y;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;cursor:grab}",
    ".jrArc{fill:none;stroke-width:5;stroke-linecap:round;opacity:.78}",
    ".jrNode{stroke:rgba(255,255,255,.55);stroke-width:1}",
    ".jrHalo{opacity:.16}.jrHalo.on{opacity:.38;animation:jrBeat 2.2s ease-in-out infinite;transform-box:fill-box;transform-origin:center}",
    ".jrHit{fill:transparent;cursor:pointer}",
    ".jrLab{font-size:10.5px;fill:var(--dim);pointer-events:none}.jrLab.on{fill:var(--zahl);font-weight:600}",
    ".jrHeute{fill:#fff}.jrPulse{fill:var(--akzent);opacity:.7;animation:jrBeat 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:center}",
    ".jrPtr{fill:var(--akzent);filter:drop-shadow(0 0 4px var(--akzent))}",
    ".jrMoonBg{fill:rgba(40,20,80,.8);stroke:rgba(200,120,255,.4);stroke-width:1}.jrMoonLit{fill:#f1e8ff;filter:drop-shadow(0 0 5px var(--glow))}.jrMoonT{font-size:9px;fill:var(--dim);letter-spacing:.06em}",
    ".jrTw{fill:#fff;opacity:.15;animation:jrTw 3s ease-in-out infinite}",
    ".jrShoot{stroke:var(--zahl);stroke-width:1.4;stroke-linecap:round}",
    "@keyframes jrBeat{0%,100%{transform:scale(1);opacity:.45}50%{transform:scale(1.7);opacity:.12}}",
    "@keyframes jrTw{0%,100%{opacity:.12}50%{opacity:.85}}",
    "@media (prefers-reduced-motion:reduce){.jrHalo.on,.jrPulse,.jrTw{animation:none!important}}",
    ".jrCard{margin:.3rem .1rem 0;padding:.6rem .8rem .65rem;border:1px solid var(--jc,rgba(200,120,255,.4));border-radius:1rem;background:rgba(20,8,48,.55);box-shadow:0 0 14px -4px var(--jc,var(--glow));text-align:left}",
    ".jrName{display:block;font-family:Georgia,serif;font-weight:400;font-size:1.15rem;color:var(--zahl)}",
    ".jrWhen{display:block;font-size:.72rem;color:var(--ueberschrift);margin:.05rem 0 .3rem}",
    ".jrSea{display:inline-block;font-size:.58rem;letter-spacing:.14em;text-transform:uppercase;padding:.1rem .5rem;border-radius:999px;border:1px solid var(--jc);color:var(--zahl);margin-bottom:.35rem}",
    ".jrT{margin:0 0 .3rem;font-size:.8rem;line-height:1.4;color:var(--dim)}",
    ".jrF{margin:0;font-family:Georgia,serif;font-style:italic;font-size:.84rem;line-height:1.35;color:var(--zahl)}.jrF small{display:block;font-family:system-ui,sans-serif;font-style:normal;font-size:.5rem;letter-spacing:.16em;text-transform:uppercase;color:var(--ueberschrift)}",
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
  function all(){ try{ moonTint(); paintSpruch(); mountRad(); decorate(); }catch(e){} }
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
