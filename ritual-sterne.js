/* ritual-sterne.js — Build 50 (63: Sternschnuppen, Abschnitt 3): Sternenhimmel und Tageston-Schimmer.
   Zwei Ebenen, damit kein Inhalt anders gezeichnet wird (die Zeichen-Kachel #sigilBox bleibt pixelgleich):
   1) #sternFeld: ruhiges Bild hinter dem Inhalt (div mit Hintergrundbild, kein eigener Grafik-Layer):
      schwache Sterne und der Tageston (Hard-Tag = Hauch Rot, Soft-Tag = Hauch Pink, Regel aus RR25_KAL).
      Um die Zeichen-Kachel bleibt eine Lücke, dort sieht man den bisherigen Hintergrund.
   2) #sternFunkeln: wenige funkelnde Sterne über allem, aber nur an leeren Stellen (nie über Text, Karten, Kachel),
      klickt nicht mit. Rund 10 Bilder pro Sekunde, Pause wenn die Seite verborgen ist,
      bei «Bewegung reduzieren» stehen die Sterne still. Keine Schlüssel im Speicher. */
(function(){
  if(window.RR25_STERNE) return;
  var app=document.querySelector(".app"); if(!app||!document.createElement("canvas").getContext) return;
  var mq=window.matchMedia?window.matchMedia("(prefers-reduced-motion: reduce)"):null;
  function still(){ return !!(mq&&mq.matches); }
  function rnd(seed){ return function(){ seed=(seed*16807)%2147483647; return (seed-1)/2147483646; }; }
  var COL=["255,255,255","226,210,255","255,200,240","200,225,255"];
  var on=true, tone="", W=0, H=0;

  /* ---------- 1) ruhiges Feld hinter dem Inhalt ---------- */
  var feld=document.createElement("div"); feld.id="sternFeld"; feld.setAttribute("aria-hidden","true");
  var rest=document.createElement("div"); rest.id="sternRest"; rest.setAttribute("aria-hidden","true");
  app.insertBefore(rest,app.firstChild); app.insertBefore(feld,app.firstChild);
  var feldKey="", tileUrl="";
  function dayTone(){
    try{
      var K=window.RR25_KAL; if(!K||!K.state) return "";
      var s=K.state(Date.now());
      if(s.hardDay||s.dayKind==="HARD") return "hard";
      if(s.dayKind==="SOFT") return "soft";
    }catch(e){}
    return "";
  }
  function sigDoc(){
    var b=document.getElementById("sigilBox"); if(!b||!b.offsetParent) return null;
    var r=b.getBoundingClientRect(); if(!r.width) return null;
    return {x:r.left+window.scrollX,y:r.top+window.scrollY,w:r.width,h:r.height};
  }
  /* Höhe des Inhalts ohne die eigenen Ebenen (absolute Kinder zählen bei .app nicht mit) */
  function appH(){ var r=app.getBoundingClientRect(); return Math.floor(r.bottom+window.scrollY); }
  function stars(c,w,h,seed,n,amax){
    var r=rnd(seed);
    for(var i=0;i<n;i++){
      var x=r()*w, y=r()*h, s=.35+r()*r()*.9, a=.08+r()*amax, col=COL[Math.floor(r()*COL.length)];
      c.fillStyle="rgba("+col+","+a.toFixed(3)+")"; c.beginPath(); c.arc(x,y,s,0,6.283); c.fill();
    }
  }
  function paintFeld(force){
    var sg=null, w=document.documentElement.clientWidth, h=window.innerHeight, t=tone;
    var key=[w,h,t,sg?[Math.round(sg.x),Math.round(sg.y),Math.round(sg.w),Math.round(sg.h)].join(":"):"-"].join("|");
    if(!force&&key===feldKey) return; feldKey=key;
    var d=Math.min(2,window.devicePixelRatio||1), cv=document.createElement("canvas"), c;
    cv.width=Math.round(w*d); cv.height=Math.round(h*d); c=cv.getContext("2d"); c.setTransform(d,0,0,d,0,0);
    if(t){
      var col=t==="hard"?"255,64,96":"255,122,217", g=c.createRadialGradient(w/2,h*.12,0,w/2,h*.12,h*.85);
      g.addColorStop(0,"rgba("+col+","+(t==="hard"?.2:.16)+")"); g.addColorStop(.6,"rgba("+col+","+(t==="hard"?.07:.055)+")"); g.addColorStop(1,"rgba("+col+",0)");
      c.fillStyle=g; c.fillRect(0,0,w,h);
    }
    stars(c,w,h,250125,Math.min(110,Math.round(w*h/4200)),.26);
    /* Build 57: keine Lücke mehr um die Zeichen-Kachel; sie ist durchscheinend wie die Heute-Karte */
    feld.style.backgroundImage="url("+cv.toDataURL("image/png")+")";
    feld.style.backgroundSize=w+"px "+h+"px";
    feld.style.height=h+"px";
    if(!tileUrl||force){
      var tv=document.createElement("canvas"); tv.width=Math.round(w*d); tv.height=Math.round(h*d);
      var tc=tv.getContext("2d"); tc.setTransform(d,0,0,d,0,0); stars(tc,w,h,90731,Math.min(110,Math.round(w*h/4200)),.26);
      tileUrl=tv.toDataURL("image/png");
      rest.style.backgroundImage="url("+tileUrl+")"; rest.style.backgroundSize=w+"px "+h+"px";
    }
    rest.style.top=h+"px";
    rest.style.height=Math.max(0,appH()-h)+"px";
  }

  /* ---------- 2) Funkeln über allem, nur an leeren Stellen ---------- */
  var cv=document.createElement("canvas"); cv.id="sternFunkeln"; cv.setAttribute("aria-hidden","true");
  document.body.appendChild(cv);
  var ctx=cv.getContext("2d"), DPR=1, tw=[], raf=0, last=0, chk=0;
  var LEER={HTML:1,BODY:1,MAIN:1};
  function leer(x,y){
    var e=document.elementFromPoint(x,y); if(!e) return false;
    if(LEER[e.tagName]) return true;
    if(e===app||e.id==="sternFeld"||e.id==="sternRest") return true;
    if(e.tagName==="SECTION"&&e.classList.contains("screen")) return true;
    return false;
  }
  function sizeTw(){
    DPR=Math.min(2,window.devicePixelRatio||1); W=window.innerWidth; H=window.innerHeight;
    cv.width=Math.round(W*DPR); cv.height=Math.round(H*DPR);
    var r=rnd(4711), n=Math.min(34,Math.round(W*H/12000)); tw=[];
    for(var i=0;i<n;i++) tw.push({x:r()*W,y:r()*H,s:.6+r()*.8,a:.35+r()*.4,p:r()*6.283,f:.35+r()*.6,c:COL[Math.floor(r()*COL.length)],ok:false});
    check();
  }
  function check(){ for(var i=0;i<tw.length;i++){ var s=tw[i]; s.ok=leer(s.x,s.y)&&leer(Math.min(W-1,s.x+3),s.y)&&leer(Math.max(0,s.x-3),s.y); } }
  function drawTw(t){
    ctx.setTransform(DPR,0,0,DPR,0,0); ctx.clearRect(0,0,W,H); if(!on) return;
    var sec=(t||0)/1000, mv=!still();
    for(var i=0;i<tw.length;i++){
      var s=tw[i]; if(!s.ok) continue;
      var k=mv?(.5+.5*Math.sin(sec*s.f+s.p)):.6, a=s.a*k;
      if(a<.02) continue;
      ctx.fillStyle="rgba("+s.c+","+a.toFixed(3)+")"; ctx.beginPath(); ctx.arc(s.x,s.y,s.s,0,6.283); ctx.fill();
      if(k>.8){ ctx.fillStyle="rgba("+s.c+","+(a*.18).toFixed(3)+")"; ctx.beginPath(); ctx.arc(s.x,s.y,s.s*2.6,0,6.283); ctx.fill(); }
    }
  }
  function loop(t){
    raf=0; if(!on||document.hidden) return;
    if(t-last>=100||!last){ last=t; if(t-chk>=250){ chk=t; check(); } drawTw(t); }
    if(!still()) raf=requestAnimationFrame(loop);
  }
  function kick(){ if(!raf&&on&&!document.hidden) raf=requestAnimationFrame(loop); }
  function now(){ check(); drawTw(performance.now()); }

  function setTone(){ var t=dayTone(); if(t!==tone){ tone=t; if(t) document.documentElement.setAttribute("data-tagton",t); else document.documentElement.removeAttribute("data-tagton"); return true; } return false; }
  var scrollT=0;
  function onScroll(){ if(scrollT) return; scrollT=setTimeout(function(){ scrollT=0; now(); },120); }
  setTone(); paintFeld(true); sizeTw(); drawTw(performance.now()); kick();
  window.addEventListener("resize",function(){ tileUrl=""; paintFeld(true); sizeTw(); drawTw(performance.now()); });
  window.addEventListener("scroll",onScroll,{passive:true});
  document.addEventListener("scroll",onScroll,{passive:true,capture:true});
  document.addEventListener("click",function(){ setTimeout(now,350); },true);
  document.addEventListener("visibilitychange",function(){ if(document.hidden){ if(raf) cancelAnimationFrame(raf); raf=0; } else { now(); kick(); } });
  if(mq&&mq.addEventListener) mq.addEventListener("change",function(){ now(); kick(); });
  /* Lage der Kachel und Höhe der Seite ändern sich mit dem Bildschirm: ruhig nachziehen */
  setInterval(function(){ if(!document.hidden){ paintFeld(false); rest.style.height=Math.max(0,appH()-window.innerHeight)+"px"; if(still()) now(); } },700);
  setInterval(function(){ if(setTone()) paintFeld(true); },60000);
  if(window.RR25_KAL&&window.RR25_KAL.onReady) try{ window.RR25_KAL.onReady(function(){ if(setTone()) paintFeld(true); }); }catch(e){}
  setTimeout(function(){ if(setTone()) paintFeld(true); },1500);

  /* ---------- 3) Build 63: gelegentliche Sternschnuppen ----------
     Ein kurzer Strich in Neon-Violett oder Gold alle 15 bis 40 s, ca. 1 s lang, an zufälliger Stelle und mit zufälligem Winkel.
     Reine CSS-Animation (Web Animations, nur transform und opacity), kein Dauer-Loop: dazwischen läuft nichts ausser einem Timer.
     Liegt hinter dem Inhalt (wie #sternFeld), klickt nicht mit, kein Ton. Bei «Bewegung reduzieren» und bei verborgener Seite aus. */
  var sch=document.createElement("div"); sch.id="sternSchnuppe"; sch.setAttribute("aria-hidden","true");
  app.insertBefore(sch,rest.nextSibling);
  var schT=0;
  function schNext(){ clearTimeout(schT); schT=setTimeout(schGo,15000+Math.random()*25000); }
  function schGo(){
    schNext();
    if(!on||still()||document.hidden||!sch.animate) return;
    var w=window.innerWidth, h=window.innerHeight, len=110+Math.random()*90;
    var ang=(20+Math.random()*50)*(Math.random()<.5?1:-1)*Math.PI/180; /* Richtung: nach unten, links oder rechts */
    var dir=ang>0?1:-1, dx=Math.cos(Math.abs(ang))*dir, dy=Math.sin(Math.abs(ang));
    var gold=Math.random()<.4, x0=w*(.1+Math.random()*.8), y0=h*(.05+Math.random()*.5), dist=len*2.2;
    var el=document.createElement("i"); el.className="sch"+(gold?" au":"");
    el.style.cssText="left:"+x0+"px;top:"+y0+"px;width:"+len+"px";
    var rot=Math.atan2(dy,dx)*180/Math.PI;
    sch.appendChild(el);
    var a=el.animate([
      {transform:"translate(0,0) rotate("+rot+"deg)",opacity:0},
      {transform:"translate("+dx*dist*.15+"px,"+dy*dist*.15+"px) rotate("+rot+"deg)",opacity:1,offset:.15},
      {transform:"translate("+dx*dist+"px,"+dy*dist+"px) rotate("+rot+"deg)",opacity:0}
    ],{duration:900+Math.random()*300,easing:"ease-out"});
    a.onfinish=a.oncancel=function(){ if(el.parentNode) el.parentNode.removeChild(el); };
  }
  schNext();
  document.addEventListener("visibilitychange",function(){ if(document.hidden) clearTimeout(schT); else schNext(); });

  var css=document.createElement("style");
  css.textContent=".app{isolation:isolate}"+
    "#sternFeld,#sternRest{position:absolute;left:0;top:0;width:100%;z-index:-1;pointer-events:none;background-repeat:no-repeat}"+
    "#sternRest{background-repeat:repeat-y}"+
    "#sternSchnuppe{position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:-1;pointer-events:none;overflow:hidden}"+
    "#sternSchnuppe .sch{position:absolute;height:2px;border-radius:2px;transform-origin:100% 50%;margin-left:0;opacity:0;pointer-events:none;background:linear-gradient(90deg,rgba(190,120,255,0),rgba(200,140,255,.55) 60%,#f3e2ff);box-shadow:0 0 8px 1px rgba(190,120,255,.6);will-change:transform,opacity}"+
    "#sternSchnuppe .sch.au{background:linear-gradient(90deg,rgba(255,200,100,0),rgba(255,210,120,.55) 60%,#fff3d0);box-shadow:0 0 8px 1px rgba(255,200,100,.6)}"+
    "@media (prefers-reduced-motion:reduce){#sternSchnuppe{display:none}}"+
    "#sternFunkeln{position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:2147483000;pointer-events:none;display:block}";
  document.head.appendChild(css);
  window.RR25_STERNE={
    tone:function(){ return tone; },
    off:function(){ on=false; sch.style.display="none"; if(raf) cancelAnimationFrame(raf); raf=0; drawTw(0); feld.style.display="none"; rest.style.display="none"; cv.style.display="none"; },
    on:function(){ on=true; sch.style.display=""; feld.style.display=""; rest.style.display=""; cv.style.display=""; paintFeld(true); now(); kick(); }
  };
})();
