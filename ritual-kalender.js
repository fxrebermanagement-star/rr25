/* ritual-kalender.js — Kalender-Tab «Magie so sei es».
   Regel und Daten: ritual-zeit.js (RR25_KAL), dieselbe Regel wie im Tor. Bänder gelten von Start bis Ende,
   Hard nur solange ein Feintakt offen ist, nie aus künftigen Terminen. Liest rr25_echo_v1 nur (Echo-Tag 3/9), speichert
   wie bisher nur beim Antippen einer Karte nach «Geplant» (rr25_ritual_v1.planned). */
(function(){
  var LINK="https://calendar.google.com/calendar/r?cid=47c369013814767dea03adb95f43c3b7b64174e10565af9fbe6799f0a8eb0e3a@group.calendar.google.com";
  var K=window.RR25_KAL;
  if(!K) return;
  var DAY=86400000, OPENALL=false, MONTH=null, SEL=null;
  var DN=["So","Mo","Di","Mi","Do","Fr","Sa"], WD=["Mo","Di","Mi","Do","Fr","Sa","So"];
  var MN=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
  var NAME={SOFT:"Soft",HARD:"Hard",ECHO:"Echo",STILL:"Still"};
  function h(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function two(n){ return String(n).padStart(2,"0"); }
  function tstr(ms){ var d=new Date(ms); return two(d.getHours())+":"+two(d.getMinutes()); }
  function dstr(ms){ var d=new Date(ms); return DN[d.getDay()]+" "+d.getDate()+"."+(d.getMonth()+1)+"."; }
  function day0(ms){ var d=new Date(ms); return new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime(); }
  function addDays(ms,n){ var d=new Date(ms); return new Date(d.getFullYear(),d.getMonth(),d.getDate()+n).getTime(); }
  function ymd(ms){ var d=new Date(ms); return d.getFullYear()+"-"+two(d.getMonth()+1)+"-"+two(d.getDate()); }
  function rel(ms,now){ var n=Math.round((day0(ms)-day0(now))/DAY); return n===0?"heute":(n===1?"morgen":dstr(ms)); }
  function rest(ms,now){ var m=Math.max(1,Math.ceil((ms-now)/60000)); return m<60?"noch "+m+" Min.":"noch "+Math.floor(m/60)+" Std. "+(m%60?m%60+" Min.":""); }
  function moonLabel(ms){
    var M=window.RR25_MOND; if(!M) return "";
    var m=M.day(ms), q=m.p;
    if(m.key==="neu") return "Neumond · setzen";
    if(m.key==="voll") return "Vollmond · nicht nachsetzen";
    if(m.key==="zu") return m.viertel===1?"Zunehmend · Form":(q<0.22?"Zunehmend · wachsen":(q<0.28?"Zunehmend · Form":"Zunehmend · Kraft"));
    return m.viertel===3?"Abnehmend · lösen":(q<0.72?"Abnehmend · abgeben":(q<0.78?"Abnehmend · lösen":"Abnehmend · leeren"));
  }
  function suggest(k){
    if(k==="soft") return {id:"segen",label:"Segen"};
    if(k==="echo") return {id:"zur",label:"Energie zurück"};
    return {id:"",label:""};
  }
  function when(x){
    if(x.all) return x.band?dstr(x.s)+" – "+dstr(x.e-1):dstr(x.s);
    return dstr(x.s)+" · "+tstr(x.s)+"–"+tstr(x.e);
  }
  function card(x,now){
    var k=x.k.toLowerCase(), sug=suggest(k), live=!x.all&&x.s<=now&&now<x.e;
    var hint=k==="hard"?"Nur vormerken. Nicht automatisch setzen.":(sug.id?"Tippen legt nach Geplant.":"Nur lesen.");
    return '<article class="card kalcard '+k+(live?' kallive':'')+'" data-kal="1" data-kind="'+k+'" data-title="'+h(x.t).replace(/"/g,"")+'" data-sid="'+sug.id+'" data-slabel="'+sug.label+'">'+
      '<b>'+h(x.t)+'</b>'+
      '<div class="meta">'+when(x)+(live?' · <span class="kalOn">läuft, '+rest(x.e,now)+'</span>':'')+(x.band&&x.s<=now&&now<x.e?' · noch '+left(x,now):'')+(x.src==="calc"?" · gerechnet":"")+'</div>'+
      '<p class="meta">'+hint+'</p>'+
      '</article>';
  }
  function left(b,now){ var n=Math.round((b.e-day0(now))/DAY); return n<=1?"letzter Tag":n+" Tage"; }

  /* Echo-Tag 3/9 aus der Chronik (nur lesen) */
  function echoChecks(){
    var out=[];
    try{
      var d=JSON.parse(localStorage.getItem("rr25_echo_v1")||"{}"), log=[];
      try{ log=(JSON.parse(localStorage.getItem("rr25_ritual_v1")||"{}").log)||[]; }catch(e){}
      (d.items||[]).forEach(function(it){
        if(log.length&&!log.some(function(x){ return String(x.id)===String(it.eid); })) return;
        ["3","9"].forEach(function(k){
          var c=it.checks&&it.checks[k]; if(!c||c.a||!c.due) return;
          var r=null; try{ r=(R||[]).find(function(x){ return x.id===it.rid; }); }catch(e){}
          out.push({due:c.due,k:k,name:r?r.t:String(it.titel||"Ritual")});
        });
      });
    }catch(e){}
    return out.sort(function(a,b){ return a.due-b.due; });
  }

  function todayCard(now){
    var s=K.state(now), tone=s.kind.toLowerCase(), title;
    if(s.open) title=s.open.t;
    else if(s.src==="tag"&&s.single) title=s.single.t;
    else if(s.src==="band"&&s.band) title=s.band.t;
    else if(s.src==="mondtag"&&s.marker) title=s.marker.t;
    else title=NAME[s.kind]+" · "+moonLabel(now);
    var sag={
      HARD:"Feintakt offen. Nur mit Gate und Rückkehr.",
      STILL:"Heute still. Buch zu. Keine Kerze aus Pflicht.",
      ECHO:s.open?"Echo-Fenster. Lesen, nicht nachladen.":"Heute Nachlauf. Lesen, nicht nachladen.",
      SOFT:s.open?"Soft-Fenster offen. Öffnen erlaubt. Halten nicht.":"Heute soft. Öffnen erlaubt. Halten nicht."
    }[s.kind];
    var L=[];
    if(s.open) L.push('<p class="kalNow"><span class="kalOn">offen</span> bis '+tstr(s.open.e)+' · '+rest(s.open.e,now)+'</p>');
    L.push('<p>'+sag+'</p>');
    if(s.band) L.push('<p class="kalBand"><i class="kb '+s.band.k.toLowerCase()+'"></i>Band '+NAME[s.band.k]+' · '+dstr(s.band.s)+' – '+dstr(s.band.e-1)+' · noch '+left(s.band,now)+(s.band.src==="calc"?' · gerechnet':'')+'</p>');
    var nh=K.next("HARD",now), later=s.hard.filter(function(x){ return x.s>now; });
    if(s.kind!=="HARD"||later.length){
      if(nh) L.push('<p class="kalNext">Nächster Hard-Feintakt: <span class="kalEm">'+rel(nh.x.s,now)+' · '+tstr(nh.x.s)+'–'+tstr(nh.x.e)+'</span>'+(nh.more.length?'<br><span>dann '+nh.more.map(function(y){ return tstr(y.s)+(y.anker?' (Anker)':''); }).join(" · ")+'</span>':'')+'</p>');
      else L.push('<p class="kalNext">Kein Hard-Feintakt mehr im Kalender.</p>');
    }
    var hints=[];
    if(s.anker&&s.anker.e>now) hints.push(s.anker.s<=now?"Rückkehr-Anker jetzt: Körper · Raum · Atem · Feld zu":"Rückkehr-Anker heute "+tstr(s.anker.s));
    var tm=K.dayParts(addDays(now,1));
    if(tm.single&&tm.single.k==="ECHO"&&tm.src==="tag") hints.push("Morgen Echo-Nachlauf: lesen, kein neues Portal");
    var ec=echoChecks(), end=addDays(day0(now),1), soon=addDays(day0(now),3);
    ec.filter(function(x){ return x.due<end; }).slice(0,2).forEach(function(x){ hints.push("Echo · Tag "+x.k+": «"+h(x.name)+"» ist dran"); });
    ec.filter(function(x){ return x.due>=end&&x.due<soon; }).slice(0,1).forEach(function(x){ hints.push("Echo · Tag "+x.k+" für «"+h(x.name)+"» "+rel(x.due,now)); });
    if(hints.length) L.push('<p class="kalHint">'+hints.join("<br>")+'</p>');
    var mn=K.moonNext(now), mm=[];
    if(mn.neu) mm.push([mn.neu,"○ Neumond "+rel(mn.neu,now)+" "+tstr(mn.neu)]);
    if(mn.voll) mm.push([mn.voll,"● Vollmond "+rel(mn.voll,now)+" "+tstr(mn.voll)]);
    mm.sort(function(a,b){ return a[0]-b[0]; });
    L.push('<p class="meta">'+moonLabel(now)+' · '+K.ORT+'</p>');
    if(mm.length) L.push('<p class="meta kalMoon">'+mm.map(function(x){ return x[1]; }).join(" · ")+'</p>');
    return '<article class="card kalcard '+tone+' kaltoday" data-tone="'+tone+'"><p class="meta">Heute · '+tstr(now)+'</p><b>'+h(title)+'</b>'+L.join("")+'</article>';
  }

  function month(now){
    var m0=MONTH||new Date(new Date(now).getFullYear(),new Date(now).getMonth(),1).getTime();
    var d=new Date(m0), first=(d.getDay()+6)%7, start=addDays(m0,-first), ec={};
    echoChecks().forEach(function(x){ ec[ymd(x.due)]=1; });
    var M=window.RR25_MOND, cells=WD.map(function(w){ return '<span class="kmWd">'+w+'</span>'; });
    for(var i=0;i<42;i++){
      var dm=addDays(start,i), dd=new Date(dm);
      if(i>=35&&dd.getMonth()!==d.getMonth()) break;
      var p=K.dayParts(dm+12*3600000), dots="";
      if(p.items.some(function(x){ return !x.all&&x.k==="HARD"; })) dots+='<i class="dh"></i>';
      if(p.items.some(function(x){ return x.k==="ECHO"&&(x.all||!x.moon); })&&p.kind!=="ECHO"||(p.single&&p.single.k==="ECHO")) dots+='<i class="de"></i>';
      if(ec[ymd(dm)]) dots+='<i class="dc"></i>';
      var mk=M?M.day(dm+12*3600000).key:"", moon=mk==="voll"?"●":(mk==="neu"?"○":"");
      var calc=!p.items.some(function(x){ return x.src==="kal"; });
      cells.push('<button type="button" class="kmDay '+p.kind.toLowerCase()+(dd.getMonth()!==d.getMonth()?' out':'')+(dm===day0(now)?' today':'')+(dm===SEL?' sel':'')+(calc?' calc':'')+'" data-day="'+dm+'" aria-label="'+dstr(dm)+' '+NAME[p.kind]+'">'+
        (moon?'<span class="kmMoon">'+moon+'</span>':'')+'<span>'+dd.getDate()+'</span><span class="kmDots">'+dots+'</span></button>');
    }
    return '<div class="kalMonth"><div class="kmHead"><button type="button" class="kmNav" data-m="-1" aria-label="Monat zurück">‹</button><b>'+MN[d.getMonth()]+' '+d.getFullYear()+'</b><button type="button" class="kmNav" data-m="1" aria-label="Monat vor">›</button></div>'+
      '<div class="kmGrid">'+cells.join("")+'</div>'+
      '<p class="kmLeg"><i class="kl soft"></i>Soft <i class="kl still"></i>Still <i class="kl echo"></i>Echo <i class="dh"></i>Hard-Feintakt <i class="de"></i>Nachlauf ● Voll ○ Neu</p></div>';
  }
  function dayDetail(dm,now){
    var p=K.dayParts(dm+12*3600000), hard=p.items.filter(function(x){ return !x.all&&x.k==="HARD"; }).length;
    var head=dstr(dm)+' · '+NAME[p.kind]+(p.band?'-Band':'')+(hard?' · '+hard+' Hard-Feintakte':'');
    var items=p.items.slice().sort(function(a,b){ return (b.band-a.band)||(a.s-b.s); });
    return '<div id="kalDay"><p class="group">'+head+'</p>'+(items.length?items.map(function(x){ return card(x,now); }).join(""):'<p class="meta">Keine Einträge. Mondregel: '+NAME[p.kind]+'.</p>')+'</div>';
  }
  function covLine(now){
    var c=K.coverage(), stt=K.status();
    if(stt==="fail"||!c) return '<p class="kalCov warn">Kalender nicht geladen. Die App rechnet Bänder und Mondtage selbst (ohne Hard).</p>';
    var gen=(K.data()||{}).generated, days=Math.round((c.to-day0(now))/DAY);
    var txt='Kalender reicht bis '+dstr(c.to-1)+new Date(c.to-1).getFullYear()+(gen?' · Stand '+dstr(Date.parse(gen)):'');
    if(days<=0) return '<p class="kalCov warn">Kalender-Daten sind ausgelaufen ('+dstr(c.to-1)+'). Die App rechnet selbst, ohne Hard. Bitte Kalender-Sync laufen lassen.</p>';
    if(days<21) return '<p class="kalCov warn">'+txt+'. Nur noch '+days+' Tage, danach rechnet die App selbst (ohne Hard). Bitte Kalender-Sync laufen lassen.</p>';
    return '<p class="kalCov">'+txt+'</p>';
  }
  function paint(){
    var box=document.getElementById("kalList");
    if(!box) return;
    var T=Date.now(), L=K.list(T), wkEnd=T+7*DAY;
    var up=L.filter(function(x){ return x.e>T&&!(x.band&&x.s<=T); });
    var week=up.filter(function(x){ return x.s<wkEnd; }), rest=up.filter(function(x){ return x.s>=wkEnd; });
    var html=todayCard(T)+month(T)+(SEL!=null?dayDetail(SEL,T):'');
    html+='<p class="group">7 Tage</p>';
    html+=week.length?week.map(function(x){ return card(x,T); }).join(""):"<p class='meta'>Keine Fenster in 7 Tagen.</p>";
    if(rest.length){
      html+='<div class="row"><button type="button" class="btn ghost" id="kalMore">'+(OPENALL?"Woche":"Weiter · "+rest.length)+'</button></div>';
      if(OPENALL) html+='<p class="group">Weiter</p>'+rest.map(function(x){ return card(x,T); }).join("");
    }
    html+=covLine(T);
    box.innerHTML=html;
    var more=document.getElementById("kalMore");
    if(more) more.onclick=function(){ OPENALL=!OPENALL; paint(); };
    box.querySelectorAll(".kmNav").forEach(function(b){
      b.onclick=function(){ var base=MONTH||new Date(new Date(T).getFullYear(),new Date(T).getMonth(),1).getTime(), d=new Date(base);
        MONTH=new Date(d.getFullYear(),d.getMonth()+(+b.getAttribute("data-m")),1).getTime(); paint(); };
    });
    box.querySelectorAll(".kmDay").forEach(function(b){
      b.onclick=function(){ var dm=+b.getAttribute("data-day"); SEL=SEL===dm?null:dm; paint();
        var el=document.getElementById("kalDay"); if(el&&el.scrollIntoView) el.scrollIntoView({block:"nearest",behavior:"smooth"}); };
    });
    box.querySelectorAll("[data-kal]").forEach(function(el){
      el.onclick=function(){
        var k=el.getAttribute("data-kind");
        var sid=el.getAttribute("data-sid")||"";
        var title=el.getAttribute("data-title")||"Fenster";
        if(typeof load!=="function"||typeof save!=="function"||typeof uid!=="function") return;
        if(k==="hard"||k==="still"||!sid){
          var d=load();
          d.planned=d.planned||[];
          d.planned.unshift({pid:uid(),id:"",titel:title,wer:"Fenster · nicht automatisch setzen",t:now(),fenster:1});
          save(d);
          if(el.querySelector(".kalok")) return;
          var p=document.createElement("p"); p.className="msg kalok"; p.textContent="In Geplant. Nicht gestartet.";
          el.appendChild(p);
          return;
        }
        var r=(typeof R!=="undefined"?R:[]).find(function(x){ return x.id===sid; });
        var d2=load();
        d2.planned=d2.planned||[];
        d2.planned.unshift({pid:uid(),id:sid,titel:(r?r.t:title),wer:title,t:now(),fenster:1});
        save(d2);
        if(el.querySelector(".kalok")) return;
        var p2=document.createElement("p"); p2.className="msg kalok"; p2.textContent="In Geplant: "+(r?r.t:title);
        el.appendChild(p2);
      };
    });
  }
  /* Restzeit im Heute-Kasten frisch halten, solange der Kalender offen ist (nur dieser Kasten wird ersetzt) */
  setInterval(function(){
    var sc=document.getElementById("kal"); if(!sc||!sc.classList.contains("on")) return;
    var old=document.querySelector("#kalList .kaltoday"); if(!old) return;
    var tmp=document.createElement("div"); tmp.innerHTML=todayCard(Date.now());
    var neu=tmp.firstChild; if(neu&&neu.outerHTML!==old.outerHTML){ if(neu.getAttribute("data-tone")!==old.getAttribute("data-tone")) paint(); else old.replaceWith(neu); }
  },30000);
  var css=document.createElement("style");
  css.textContent=[
    ".kalcard{border-left:5px solid transparent;padding-left:.72rem}",
    ".kalcard p{margin:.35rem 0 0;color:#c4b4e0;font-size:.78rem;line-height:1.45}",
    ".kalcard.soft{border-color:#2ecc71;background:rgba(46,204,113,.14)}",
    ".kalcard.soft b{color:#7dffb0}",
    ".kalcard.hard{border-color:#e74c3c;background:rgba(231,76,60,.16)}",
    ".kalcard.hard b{color:#ff8a7a}",
    ".kalcard.echo{border-color:#b36bff;background:rgba(179,107,255,.14)}",
    ".kalcard.echo b{color:#dcb8ff}",
    ".kalcard.still{border-color:#9a96a6;background:rgba(154,150,166,.12)}",
    ".kalcard.still b{color:#dcd8e4}",
    ".kalcard.kallive{box-shadow:0 0 0 1px rgba(255,122,217,.35),0 0 18px rgba(255,84,112,.12)}",
    ".kalOn{color:#ff7ad9;font-weight:650}",
    ".kaltoday{margin-bottom:.6rem}",
    ".kaltoday b{font-size:1.05rem}",
    ".kaltoday .kalNow{font-size:.8rem;color:#ffd0e8}",
    ".kaltoday .kalOn{display:inline-block;margin-right:.3rem;padding:0 .4rem;border-radius:999px;background:rgba(255,122,217,.18);letter-spacing:.08em;text-transform:uppercase;font-size:.62rem;vertical-align:1px}",
    ".kalBand .kb,.kmLeg .kl{display:inline-block;width:.7rem;height:.28rem;border-radius:2px;margin-right:.35rem;vertical-align:middle}",
    ".kb.soft,.kl.soft{background:#2ecc71}.kb.still,.kl.still{background:#9a96a6}.kb.echo,.kl.echo{background:#b36bff}.kb.hard{background:#e74c3c}",
    ".kalNext .kalEm{color:#ffb3a8;font-weight:600}.kalNext span{color:#a996cf}",
    ".kalHint{color:#e7c9ff!important}",
    ".kalMoon{color:#cdbfe8!important}",
    ".kalMonth{margin:.1rem 0 .75rem;padding:.55rem .5rem .45rem;border-radius:14px;background:rgba(22,14,44,.6);border:1px solid rgba(155,140,255,.2)}",
    ".kmHead{display:flex;align-items:center;justify-content:space-between;margin:0 .1rem .4rem}",
    ".kmHead b{font-family:Georgia,serif;font-size:.95rem;font-weight:400;color:#ead8ff;letter-spacing:.02em}",
    ".kmNav{width:2rem;height:2rem;border-radius:999px;border:1px solid rgba(155,140,255,.35);background:rgba(155,140,255,.08);color:#cbb8ff;font-size:1.05rem;line-height:1;padding:0}",
    ".kmGrid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px}",
    ".kmWd{font-size:.56rem;letter-spacing:.12em;text-transform:uppercase;color:#8f80b8;text-align:center;padding-bottom:1px}",
    ".kmDay{position:relative;height:2.4rem;min-width:0;border:0;border-bottom:3px solid transparent;border-radius:8px;background:rgba(255,255,255,.03);color:#e6dcff;font:500 .8rem system-ui,sans-serif;padding:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px}",
    ".kmDay.soft{border-bottom-color:#2ecc71;background:rgba(46,204,113,.10)}",
    ".kmDay.still{border-bottom-color:#9a96a6;background:rgba(154,150,166,.10)}",
    ".kmDay.echo{border-bottom-color:#b36bff;background:rgba(179,107,255,.14)}",
    ".kmDay.calc{border-bottom-style:dashed}",
    ".kmDay.out{opacity:.32}",
    ".kmDay.today{box-shadow:inset 0 0 0 1.5px #ff7ad9}",
    ".kmDay.sel{box-shadow:inset 0 0 0 2px #cbb8ff;background:rgba(155,140,255,.22)}",
    ".kmDay.today.sel{box-shadow:inset 0 0 0 2px #ff7ad9;background:rgba(155,140,255,.22)}",
    ".kmMoon{position:absolute;top:1px;right:3px;font-size:.55rem;line-height:1;color:#fff1c2}",
    ".kmDots{display:flex;gap:2px;height:5px}",
    ".kmDots i,.kmLeg i.dh,.kmLeg i.de{display:inline-block;width:5px;height:5px;border-radius:50%}",
    "i.dh{background:#ff5470}i.de{background:#c77dff}i.dc{box-sizing:border-box;border:1.2px solid #ff7ad9}",
    ".kmLeg{margin:.45rem .1rem 0;font-size:.62rem;color:#a996cf;line-height:1.6}",
    ".kmLeg i.dh,.kmLeg i.de{margin:0 .2rem 0 .35rem}",
    ".kalCov{margin:.8rem .1rem .2rem;font-size:.7rem;color:#8f80b8}",
    ".kalCov.warn{color:#ffb86b}"
  ].join("");
  document.head.appendChild(css);
  if(typeof show==="function" && !show._kal){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="kal") paint();
      return r;
    };
    show._kal=1;
  }
  var open=document.getElementById("kalOpen");
  if(open) open.onclick=function(){ window.open(LINK,"_blank"); };
  K.onReady(paint);
})();
