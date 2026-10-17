/* ritual-b99.js — Build 99: Wochenbild in der Chronik.
   Kleine ruhige Wochenkarte (Mo bis So, Berner Zeit): Rituale (RR25_ZAEHLREGEL.isRitual), Mondphase der Woche (RR25_MOND),
   Echo/Wirkung (rr25_tags_v1), Wochenfarben und Saison, ein Satz aus «Dank ans Feld». Nur lesen, keine neuen Schlüssel.
   «Als Bild speichern/teilen»: Canvas, PNG, Web Share mit Datei oder Download. Das Bild bleibt auf dem Handy. Kein Streak, kein Vergleich. */
(function(){
  if(window.__rr25b99) return; window.__rr25b99=1;
  var TZ="Europe/Zurich", OPEN=false, OFF=0, DAYMS=86400000;
  var WD=["Mo","Di","Mi","Do","Fr","Sa","So"];
  var PL=[["Mond","170,196,255"],["Mars","255,90,74"],["Merkur","79,214,224"],["Jupiter","143,123,255"],["Venus","255,122,217"],["Saturn","154,160,181"],["Sonne","255,200,87"]]; /* Mo..So */
  function js(k,d){ try{ var v=JSON.parse(localStorage.getItem(k)||"null"); return v==null?d:v; }catch(e){ return d; } }
  function h(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function when(e){
    var s=String(e&&e.t||""), m=s.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})(?:,?\s*(\d{1,2}):(\d{2}))?/);
    if(m) return new Date(+m[3],+m[2]-1,+m[1],+(m[4]||12),+(m[5]||0)).getTime();
    var p=Date.parse(s); return isNaN(p)?null:p;
  }
  function rows(){ try{ return (typeof load==="function"?load().log:js("rr25_ritual_v1",{}).log)||[]; }catch(e){ return []; } }
  function zday(ms){
    try{ var p=new Intl.DateTimeFormat("en-CA",{timeZone:TZ,year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date(ms)).split("-"); return Math.round(Date.UTC(+p[0],+p[1]-1,+p[2])/DAYMS); }catch(e){ return Math.floor(ms/DAYMS); }
  }
  function dlabel(dn){ var d=new Date(dn*DAYMS); return d.getUTCDate()+"."+(d.getUTCMonth()+1)+"."; }
  /* Woche k: 0 = laufende, -1 = vorige ... ; ws = Tagesnummer des Montags */
  function week(k){
    var d=zday(Date.now()), wd=((d+3)%7+7)%7, ws=d-wd+7*k;
    return {ws:ws,we:ws+6,now:k===0,today:d};
  }
  function noon(dn){ return dn*DAYMS+12*3600*1000; }
  function stats(W){
    var R=window.RR25_ZAEHLREGEL, T=js("rr25_tags_v1",{}), per=[0,0,0,0,0,0,0], rit=0, echo=0, wirk=0, first=Infinity;
    rows().forEach(function(e){
      var t=when(e); if(t==null) return; if(t<first) first=t;
      var dn=zday(t); if(dn<W.ws||dn>W.we) return;
      var tg=(T[String(e.id)]||[]);
      if(tg.indexOf("Echo")>=0) echo++; if(tg.indexOf("Wirkung")>=0) wirk++;
      if(R&&R.isRitual(e)){ rit++; per[dn-W.ws]++; }
    });
    return {per:per,rit:rit,echo:echo,wirk:wirk,first:first};
  }
  function moon(W){
    var M=window.RR25_MOND; if(!M) return null;
    var a=M.day(noon(W.ws)), b=M.day(noon(W.we)), ev=null;
    try{ M.events(noon(W.ws)-12*3600000,noon(W.we)+12*3600000).forEach(function(e){ if(e.q===2||e.q===0){ var dn=zday(e.t); if(dn>=W.ws&&dn<=W.we) ev={q:e.q,dn:dn,t:e.t}; } }); }catch(e){}
    var txt;
    if(ev) txt=(ev.q===2?"Vollmond":"Neumond")+" am "+WD[ev.dn-W.ws];
    else if(a.key===b.key) txt=({zu:"Zunehmender Mond",ab:"Abnehmender Mond"})[a.key]||a.name;
    else txt=(a.name+" bis "+b.name);
    var m=ev?M.day(ev.t):b;
    return {sym:m.sym,txt:txt,p:m.p,key:m.key};
  }
  function saison(W){
    try{ var K=window.RR25_KAL, s=K&&K.seasons?K.seasons(noon(W.ws+3)):[]; if(s&&s[0]) return String(s[0].sz||s[0].t||"").replace(/\s*\(.*$/,"").slice(0,40); }catch(e){}
    return "";
  }
  function satz(W){ try{ var D=window.RR25_DANKSATZ; if(D) return D.satz(new Date(new Date(W.ws*DAYMS).getUTCFullYear(),new Date(W.ws*DAYMS).getUTCMonth(),new Date(W.ws*DAYMS).getUTCDate())); }catch(e){} return "Ich habe es gesehen. Danke, Feld."; }
  function say(S){
    if(!S.rit) return "Eine stille Woche. Auch das gehört dazu.";
    if(S.rit===1) return "Ein Ritual in dieser Woche. Es hat gereicht.";
    return S.rit+" Rituale in dieser Woche. Schön, wie es geflossen ist.";
  }
  function data(){
    var W=week(OFF), S=stats(W); return {W:W,S:S,M:moon(W),sz:saison(W),sa:satz(W),txt:say(S),
      title:(W.now?"Diese Woche":"Woche")+" · "+dlabel(W.ws)+" bis "+dlabel(W.we)};
  }
  function panel(D){
    var mx=Math.max(1,Math.max.apply(null,D.S.per));
    var bars=D.S.per.map(function(n,i){
      var c=PL[i][1], hh=n?Math.max(14,Math.round(n/mx*46)):4;
      return '<div class="wbD'+(D.W.ws+i===D.W.today?" on":"")+'"><i style="height:'+hh+'px;background:rgba('+c+','+(n?.85:.28)+');box-shadow:0 0 '+(n?8:0)+'px rgba('+c+',.45)"></i><b>'+(n||"")+'</b><span>'+WD[i]+'</span></div>';
    }).join("");
    var dots=PL.map(function(p){ return '<s style="background:rgb('+p[1]+')" title="'+p[0]+'"></s>'; }).join("");
    return '<div class="wbHead"><button type="button" class="wbNav" id="wbPrev" aria-label="Eine Woche zurück">‹</button><div><b>'+h(D.title)+'</b><small>Berner Zeit</small></div><button type="button" class="wbNav" id="wbNext" aria-label="Eine Woche weiter"'+(D.W.now?' disabled':'')+'>›</button></div>'+
      '<p class="wbSay">'+h(D.txt)+'</p><div class="wbBars">'+bars+'</div>'+
      '<div class="wbRow"><span>Mond</span><b>'+(D.M?h(D.M.sym+" "+D.M.txt):"–")+'</b></div>'+
      '<div class="wbRow"><span>Echo · Wirkung</span><b>'+D.S.echo+' · '+D.S.wirk+'</b></div>'+
      '<div class="wbRow"><span>Wochenfarben</span><b class="wbDots">'+dots+'</b></div>'+
      (D.sz?'<div class="wbRow"><span>Saison</span><b>'+h(D.sz)+'</b></div>':'')+
      '<p class="wbSatz">«'+h(D.sa)+'»</p>'+
      '<button type="button" class="btn" id="wbSave">Als Bild speichern oder teilen</button><p class="wbNote" id="wbMsg">Das Bild bleibt auf deinem Handy.</p>';
  }
  function paint(){
    var p=document.getElementById("wbPanel"); if(!p) return; p.hidden=!OPEN; if(!OPEN) return;
    var D=data(); p.innerHTML=panel(D);
    document.getElementById("wbPrev").onclick=function(){ OFF--; paint(); };
    var nx=document.getElementById("wbNext"); nx.onclick=function(){ if(OFF<0){ OFF++; paint(); } };
    document.getElementById("wbSave").onclick=function(){ save(D); };
  }
  /* ---------- Bild ---------- */
  function wrap(c,t,x,y,w,lh,max){
    var words=String(t).split(" "), line="", n=0;
    for(var i=0;i<words.length;i++){
      var tt=line?line+" "+words[i]:words[i];
      if(c.measureText(tt).width>w&&line){ c.fillText(line,x,y); y+=lh; line=words[i]; if(++n>=max) return y; } else line=tt;
    }
    if(line){ c.fillText(line,x,y); y+=lh; } return y;
  }
  function moonDraw(c,cx,cy,r,p){
    c.save(); c.beginPath(); c.arc(cx,cy,r,0,7); c.fillStyle="rgba(40,20,70,.9)"; c.fill(); c.strokeStyle="rgba(200,160,255,.6)"; c.lineWidth=3; c.stroke(); c.clip();
    /* beleuchteter Anteil: p 0..1 (0 neu, .5 voll); Terminator als Ellipse */
    var k=Math.cos(p*2*Math.PI), waxing=p<0.5; c.fillStyle="#efe3ff";
    c.beginPath();
    if(waxing){ c.arc(cx,cy,r,-Math.PI/2,Math.PI/2,false); c.ellipse(cx,cy,Math.abs(r*k),r,0,Math.PI/2,-Math.PI/2,k<0?false:true); }
    else { c.arc(cx,cy,r,Math.PI/2,-Math.PI/2,false); c.ellipse(cx,cy,Math.abs(r*k),r,0,-Math.PI/2,Math.PI/2,k<0?false:true); }
    c.fill(); c.restore();
  }
  function render(D){
    var cv=document.createElement("canvas"); cv.width=1080; cv.height=1350; var c=cv.getContext("2d");
    var g=c.createLinearGradient(0,0,0,1350); g.addColorStop(0,"#2a1148"); g.addColorStop(1,"#0b0614"); c.fillStyle=g; c.fillRect(0,0,1080,1350);
    var rg=c.createRadialGradient(540,380,40,540,380,700); rg.addColorStop(0,"rgba(190,110,255,.25)"); rg.addColorStop(1,"rgba(190,110,255,0)"); c.fillStyle=rg; c.fillRect(0,0,1080,1350);
    c.strokeStyle="rgba(200,120,255,.45)"; c.lineWidth=3; c.strokeRect(40,40,1000,1270);
    c.textAlign="center"; c.fillStyle="#caa8ff"; c.font="500 34px Georgia,serif"; c.fillText("W O C H E N B I L D",540,130);
    c.fillStyle="#f1e7ff"; c.font="400 60px Georgia,serif"; c.fillText(D.title.replace(" bis "," – "),540,215);
    c.fillStyle="#e6d4ff"; c.font="italic 40px Georgia,serif"; wrap(c,D.txt,540,300,860,52,2);
    /* Balken */
    var mx=Math.max(1,Math.max.apply(null,D.S.per)), bx=140, bw=100, gap=(800-7*bw)/6+bw, base=700;
    D.S.per.forEach(function(n,i){
      var col=PL[i][1], x=bx+i*(bw+ (800-7*bw)/6), hh=n?Math.max(40,Math.round(n/mx*230)):10;
      c.fillStyle="rgba("+col+","+(n?.9:.3)+")"; c.shadowColor="rgba("+col+",.6)"; c.shadowBlur=n?24:0;
      var r=18; c.beginPath(); c.moveTo(x,base); c.lineTo(x,base-hh+r); c.quadraticCurveTo(x,base-hh,x+r,base-hh); c.lineTo(x+bw-r,base-hh); c.quadraticCurveTo(x+bw,base-hh,x+bw,base-hh+r); c.lineTo(x+bw,base); c.closePath(); c.fill(); c.shadowBlur=0;
      c.fillStyle="#cdbbe8"; c.font="400 32px Georgia,serif"; c.fillText(WD[i],x+bw/2,base+48);
      if(n){ c.fillStyle="#fff"; c.font="500 34px Georgia,serif"; c.fillText(String(n),x+bw/2,base-hh-16); }
    });
    /* Mond und Zeilen */
    if(D.M) moonDraw(c,200,900,62,D.M.p);
    c.textAlign="left"; c.fillStyle="#f1e7ff"; c.font="400 44px Georgia,serif";
    c.fillText(D.M?D.M.txt:"",300,895,700);
    c.fillStyle="#cdbbe8"; c.font="400 36px Georgia,serif"; c.fillText("Echo "+D.S.echo+"  ·  Wirkung "+D.S.wirk,300,950);
    if(D.sz){ c.fillText("Saison: "+D.sz,300,1000,700); }
    D.W&&PL.forEach(function(p,i){ c.fillStyle="rgb("+p[1]+")"; c.beginPath(); c.arc(318+i*46,1060,14,0,7); c.fill(); });
    c.textAlign="center"; c.fillStyle="#e6d4ff"; c.font="italic 42px Georgia,serif"; wrap(c,"«"+D.sa+"»",540,1150,860,56,3);
    c.fillStyle="rgba(200,160,255,.7)"; c.font="400 28px Georgia,serif"; c.fillText("Rolf Reber 25",540,1275);
    return cv;
  }
  function msg(t){ var m=document.getElementById("wbMsg"); if(m) m.textContent=t; }
  function save(D){
    var cv=render(D), name="wochenbild-"+dlabel(D.W.ws).replace(/\./g,"-").replace(/-$/,"")+".png";
    cv.toBlob(function(b){
      if(!b){ msg("Das Bild konnte nicht erstellt werden."); return; }
      var f=null; try{ f=new File([b],name,{type:"image/png"}); }catch(e){}
      if(f&&navigator.canShare&&navigator.share&&navigator.canShare({files:[f]})){
        navigator.share({files:[f],title:"Wochenbild"}).then(function(){ msg("Geteilt. Das Bild bleibt auf deinem Handy."); },function(e){ if(e&&e.name==="AbortError") msg("Nichts geteilt. Alles in Ordnung."); else dl(b,name); });
        return;
      }
      dl(b,name);
    },"image/png");
  }
  function dl(b,name){
    try{ var u=URL.createObjectURL(b), a=document.createElement("a"); a.href=u; a.download=name; a.style.display="none"; document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(u); a.remove(); },4000); msg("Gespeichert als "+name+". Das Bild bleibt auf deinem Handy."); }
    catch(e){ msg("Speichern ging nicht. Mach einen Screenshot der Karte."); }
  }
  /* ---------- Einbau ---------- */
  function mount(){
    var sec=document.getElementById("log"), ent=document.getElementById("entries"); if(!sec||!ent||document.getElementById("wbBtn")) return;
    var bar=document.getElementById("rbBar"); if(!bar){ bar=document.createElement("div"); bar.id="rbBar"; sec.insertBefore(bar,ent); }
    var btn=document.createElement("button"); btn.type="button"; btn.className="btn ghost"; btn.id="wbBtn"; btn.textContent="Wochenbild"; bar.appendChild(btn);
    var p=document.createElement("div"); p.id="wbPanel"; p.className="card"; p.hidden=true;
    var ref=document.getElementById("mzPanel")||document.getElementById("abPanel")||document.getElementById("rbPanel"); sec.insertBefore(p,ref&&ref.nextSibling?ref.nextSibling:ent);
    btn.onclick=function(){ OPEN=!OPEN; btn.classList.toggle("on",OPEN); btn.textContent=OPEN?"Wochenbild zu":"Wochenbild"; paint(); };
  }
  if(typeof show==="function"&&!show._b99){ var sh=show; show=function(id){ var r=sh.apply(this,arguments); if(id==="log") setTimeout(mount,700); return r; }; show._b99=1; }
  setTimeout(mount,800);
  var css=document.createElement("style");
  css.textContent=[
    "#wbBtn{min-height:40px!important;padding:.35rem 1rem!important;font-size:.76rem!important;border-radius:999px!important;border:1px solid rgba(200,120,255,.35)!important;background:rgba(160,90,255,.1)!important;color:#e6d4ff!important}",
    "#wbBtn.on{background:rgba(160,90,255,.28)!important;box-shadow:0 0 14px rgba(190,110,255,.3)}",
    "#wbPanel{margin:0 0 .8rem;padding:.75rem .8rem .8rem;background:linear-gradient(180deg,rgba(40,18,62,.78),rgba(14,8,24,.92))!important;border:1px solid rgba(200,120,255,.22)!important;border-radius:1.1rem!important}",
    "#wbPanel[hidden]{display:none!important}",
    ".wbHead{display:flex;align-items:center;justify-content:space-between;text-align:center}.wbHead b{display:block;font-family:Georgia,serif;font-weight:400;font-size:1.02rem;color:#e4ecff}.wbHead small{font-size:.62rem;color:#9f8fc0}",
    ".wbNav{min-width:40px;min-height:40px;border-radius:999px;border:1px solid rgba(200,120,255,.3);background:rgba(160,90,255,.1);color:#e6d4ff;font-size:1.2rem;line-height:1}.wbNav:disabled{opacity:.3}",
    ".wbSay{margin:.5rem 0 .3rem;font-size:.8rem;color:#e6d4ff;line-height:1.4;text-align:center}",
    ".wbBars{display:grid;grid-template-columns:repeat(7,1fr);gap:.3rem;align-items:end;margin:.3rem 0 .6rem;padding:.2rem 0}",
    ".wbD{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:2px;min-height:78px}.wbD i{display:block;width:62%;max-width:26px;border-radius:7px}.wbD b{font-size:.7rem;color:#fff;min-height:.9rem;font-weight:500}.wbD span{font-size:.64rem;color:#a995c9}.wbD.on span{color:#e6d4ff;font-weight:700}",
    ".wbRow{display:flex;justify-content:space-between;gap:.6rem;padding:.38rem 0;border-top:1px solid rgba(200,120,255,.1);font-size:.78rem;color:#cdbbe8}.wbRow b{font-weight:400;color:#f1e7ff;text-align:right}",
    ".wbDots{display:inline-flex;gap:5px;align-items:center}.wbDots s{display:inline-block;width:11px;height:11px;border-radius:50%;text-decoration:none}",
    ".wbSatz{margin:.6rem 0 .6rem;font-family:Georgia,serif;font-style:italic;font-size:.86rem;color:#e6d4ff;text-align:center;line-height:1.4}",
    "#wbSave{width:100%;min-height:44px}.wbNote{margin:.4rem 0 0;font-size:.66rem;color:#9f8fc0;text-align:center}"
  ].join("");
  document.head.appendChild(css);
  window.RR25_WOCHENBILD={data:data,render:render};
})();
