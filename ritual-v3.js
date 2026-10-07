/* ritual-v3.js — Echo-Rückblick (Tag 3 und 9), nächstes passendes Fenster im Tor, Sichern.
   Neue Schlüssel: rr25_echo_v1 (Rückblicke und Antworten, verknüpft über die Chronik-ID),
   rr25_sicherung_at (letzte Sicherung). Bestehende Schlüssel bleiben unverändert. */
(function(){
  if(window.__rr25v3) return;
  window.__rr25v3=1;
  var DAY=86400000;
  var EKEY="rr25_echo_v1", SKEY="rr25_sicherung_at";
  var DN=["So","Mo","Di","Mi","Do","Fr","Sa"];
  var NO_ECHO={dank:1,kreis:1,weg:1,schlaf:1,abbr:1,anker:1,echo:1};
  var ALIAS={liebezw:"liebe2",fremd:"wesen",fil:"wesen",finst:"vollmond",schaden:"stopp"};
  var ANS={wirkt:"wirkt",teilweise:"teilweise",offen:"noch offen"};

  function h(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
  function rit(id){
    id=ALIAS[id]||id;
    try{ for(var i=0;i<R.length;i++) if(R[i].id===id) return R[i]; }catch(e){}
    return null;
  }
  function two(n){ return String(n).padStart(2,"0"); }
  function dstr(d){ return DN[d.getDay()]+" "+d.getDate()+"."+(d.getMonth()+1)+"."; }
  function tstr(d){ return two(d.getHours())+":"+two(d.getMinutes()); }
  function ymdOf(d){ return d.getFullYear()+"-"+two(d.getMonth()+1)+"-"+two(d.getDate()); }
  function dayStart(ms){ var d=new Date(ms); d.setHours(0,0,0,0); return d.getTime(); }
  function rel(ms){
    var n=Math.round((dayStart(ms)-dayStart(Date.now()))/DAY);
    return n===0?"heute, ":n===1?"morgen, ":"";
  }

  /* ================= 1 · Echo-Rückblick ================= */
  function eLoad(){
    try{ var d=JSON.parse(get(EKEY)||"{}"); if(!d||typeof d!=="object") d={}; if(!Array.isArray(d.items)) d.items=[]; return d; }
    catch(e){ return {items:[]}; }
  }
  function eSave(d){ set(EKEY, JSON.stringify(d)); }
  function absicht(){
    try{ var s=JSON.parse(get("rr25_sigil")||"{}"); return String(s.t||"").trim(); }catch(e){ return ""; }
  }
  function schedule(){
    var e=null;
    try{ e=(load().log||[])[0]; }catch(x){}
    if(!e||!e.id) return;
    if(/abgebrochen/.test(String(e.titel||""))) return;
    var rid=window._rid||"";
    if(NO_ECHO[rid]) return;
    var d=eLoad();
    for(var i=0;i<d.items.length;i++) if(d.items[i].eid===e.id) return;
    var t=Date.now();
    d.items.push({eid:e.id,rid:rid,titel:String(e.titel||""),wer:String(e.wer||""),note:String(e.note||""),absicht:(window._rr25Absicht||absicht()),done:t,
      checks:{"3":{due:t+3*DAY,snooze:0},"9":{due:t+9*DAY,snooze:0}}});
    eSave(d);
  }
  function exists(eid){
    try{ return (load().log||[]).some(function(x){ return String(x.id)===String(eid); }); }catch(e){ return true; }
  }
  function dueList(){
    var d=eLoad(), n=Date.now(), out=[];
    d.items.forEach(function(it){
      ["3","9"].forEach(function(k){
        var c=it.checks&&it.checks[k];
        if(!c||c.a) return;
        if(c.due<=n && (c.snooze||0)<=n && exists(it.eid)) out.push({it:it,k:k,due:c.due});
      });
    });
    out.sort(function(a,b){ return a.due-b.due; });
    return out;
  }
  function answer(eid,k,a,txt){
    var d=eLoad();
    d.items.forEach(function(it){
      if(it.eid!==eid||!it.checks||!it.checks[k]) return;
      if(a==="later"){ it.checks[k].snooze=Date.now()+DAY; return; }
      it.checks[k].a=a; it.checks[k].at=Date.now();
      if(txt) it.checks[k].txt=txt;
    });
    eSave(d);
  }
  function homeBox(){
    var home=document.getElementById("home"); if(!home) return null;
    var box=document.getElementById("v3Home");
    if(!box){
      box=document.createElement("div"); box.id="v3Home";
      var kast=document.getElementById("kasten");
      if(kast) home.insertBefore(box, kast); else home.insertBefore(box, home.firstChild);
    }
    return box;
  }
  function paintEcho(thanks){
    var box=homeBox(); if(!box) return;
    var el=document.getElementById("echoCard");
    var list=dueList();
    if(!list.length){
      if(el){
        if(thanks){ el.innerHTML='<p class="ecThanks">Danke. Im Echo vermerkt.</p>'; setTimeout(function(){ var x=document.getElementById("echoCard"); if(x&&!dueList().length) x.remove(); },2200); }
        else el.remove();
      }
      return;
    }
    if(!el){ el=document.createElement("div"); el.id="echoCard"; el.className="card"; box.insertBefore(el, box.firstChild); }
    var x=list[0], it=x.it, r=rit(it.rid);
    var name=r?r.t:String(it.titel||"Ritual");
    var when=new Date(it.done);
    el.setAttribute("data-eid",it.eid); el.setAttribute("data-k",x.k);
    el.innerHTML='<p class="ecTag">Echo · Tag '+x.k+(list.length>1?' <span>· noch '+(list.length-1)+'</span>':'')+'</p>'+
      '<b>'+h(name)+'</b>'+
      '<small>'+dstr(when)+(it.wer?' · '+h(it.wer):'')+'</small>'+
      (it.absicht?'<p class="ecAbs">Absicht: '+h(it.absicht)+'</p>':'')+
      (it.note?'<p class="ecAbs">Deine Notiz: '+h(it.note)+'</p>':'')+
      '<p class="ecQ">Was hat sich gezeigt?</p>'+
      '<textarea id="ecTxt" placeholder="Ein Satz genügt (optional)"></textarea>'+
      '<div class="row ecRow"><button type="button" class="btn ghost" data-a="wirkt">wirkt</button><button type="button" class="btn ghost" data-a="teilweise">teilweise</button><button type="button" class="btn ghost" data-a="offen">noch offen</button></div>'+
      '<button type="button" class="btn ghost ecRead" id="ecRead">Echo lesen</button>'+
      '<button type="button" class="ecLater" data-a="later">später</button>';
    [].slice.call(el.querySelectorAll("[data-a]")).forEach(function(b){
      b.onclick=function(){
        var a=b.getAttribute("data-a"), txt=((document.getElementById("ecTxt")||{}).value||"").trim();
        answer(it.eid, x.k, a, a==="later"?"":txt);
        paintEcho(a!=="later");
      };
    });
    var er=document.getElementById("ecRead");
    if(er) er.onclick=function(){ if(window.RR25_OPEN) window.RR25_OPEN("echo",{title:"Echo · Tag "+x.k,kind:"ECHO"}); };
  }

  /* Chronik: Marker an den Einträgen und Bilanz je Ritual */
  function answersBy(){
    var m={};
    eLoad().items.forEach(function(it){ m[it.eid]=it; });
    return m;
  }
  function markRows(){
    var box=document.getElementById("entries"); if(!box) return;
    var m=answersBy();
    [].slice.call(box.querySelectorAll("[data-eid]")).forEach(function(row){
      var it=m[row.getAttribute("data-eid")];
      if(!it||row.querySelector(".echoMark")) return;
      var parts=[];
      ["3","9"].forEach(function(k){
        var c=it.checks&&it.checks[k]; if(!c) return;
        if(c.a) parts.push('<span class="em-'+c.a+'">Echo T'+k+': '+ANS[c.a]+'</span>'+(c.txt?' <i>'+h(c.txt)+'</i>':''));
        else if(c.due && c.due<=Date.now()) parts.push('<span class="echoDue"><a href="#echo" data-echo="1">Echo T'+k+' · lesen</a></span>');
      });
      if(!parts.length) return;
      var d=document.createElement("div"); d.className="echoMark"; d.innerHTML=parts.join("<br>");
      var host=row.firstElementChild||row;
      var meta=host.querySelector(".meta");
      if(meta&&meta.nextSibling) host.insertBefore(d, meta.nextSibling); else host.appendChild(d);
      d.querySelectorAll("[data-echo]").forEach(function(a){ a.onclick=function(ev){ ev.preventDefault(); if(window.RR25_OPEN) window.RR25_OPEN("echo"); }; });
    });
    summary();
  }
  function summary(){
    var log=document.getElementById("log"), ent=document.getElementById("entries");
    if(!log||!ent) return;
    var g={}, order=[], total=0;
    eLoad().items.forEach(function(it){
      var r=rit(it.rid), key=r?r.id:(it.titel||"?"), name=r?r.t:(it.titel||"Ritual");
      ["3","9"].forEach(function(k){
        var c=it.checks&&it.checks[k]; if(!c||!c.a) return;
        if(!g[key]){ g[key]={n:name,wirkt:0,teilweise:0,offen:0}; order.push(key); }
        g[key][c.a]++; total++;
      });
    });
    var el=document.getElementById("echoSum");
    if(!total){ if(el) el.remove(); return; }
    if(!el){ el=document.createElement("details"); el.id="echoSum"; }
    if(el.parentNode!==log || el.nextSibling!==ent) log.insertBefore(el, ent);
    var open=el.open;
    el.innerHTML='<summary>Echo-Bilanz · '+total+(total===1?' Antwort':' Antworten')+'</summary>'+
      order.map(function(k){ var x=g[k]; return '<p><b>'+h(x.n)+'</b><span>wirkt '+x.wirkt+' · teilweise '+x.teilweise+' · offen '+x.offen+'</span></p>'; }).join("");
    el.open=open;
  }

  /* ================= 2 · Nächstes passendes Fenster ================= */
  /* Kalender: gemeinsame Regel und Daten aus ritual-zeit.js (RR25_KAL), dieselbe wie Kalender-Tab und Wetter im Tor */
  var KZ=window.RR25_KAL, kalState="load";
  function loadKal(){
    if(!KZ){ kalState="fail"; return; }
    KZ.onReady(function(){ kalState=KZ.status()==="ok"?"ok":"fail"; paintWin(true); });
  }
  function kindNow(){
    var s=KZ.state();
    kindNow.src=s.src==="mond"?"mond":"kal";
    kindNow.st=s;
    return s.kind;
  }
  function nextKal(K){
    var n=KZ.next(K,Date.now());
    if(!n||n.x.s>Date.now()+30*DAY) return null;
    return {t:n.x.s,all:n.x.all,end:n.x.all?null:n.x.e,bandEnd:n.x.all?n.x.e:null,more:n.more.map(function(y){ return tstr(new Date(y.s)); }),calc:n.x.src==="calc"};
  }
  function laterToday(K){
    var n=Date.now(), s=KZ.state(n), out=[];
    s.items.forEach(function(x){ if(!x.all&&x.k===K&&x.s>n) out.push(tstr(new Date(x.s))); });
    return out;
  }
  /* Mondphasen: gemeinsame Quelle ritual-mondphase.js (Meeus) */
  function moonEvents(full,from,to){
    return window.RR25_MOND.events(from,to).filter(function(e){ return e.q===(full?2:0); }).map(function(e){ return e.t; });
  }
  window.RR25_MOON=moonEvents;
  function feldLine(rid){
    var n=Date.now(), types=rid==="vollmond"?[["Vollmond",true]]:rid==="neumond"?[["Neumond",false]]:[["Neumond",false],["Vollmond",true]];
    var after={Vollmond:2*DAY,Neumond:3*DAY}, now=null, next=null;
    types.forEach(function(ty){
      moonEvents(ty[1], n-after[ty[0]], n+0.6*DAY).forEach(function(t){ if(!now||t>now.t) now={n:ty[0],t:t}; });
      var nx=moonEvents(ty[1], n+0.6*DAY, n+31*DAY)[0];
      if(nx && (!next||nx<next.t)) next={n:ty[0],t:nx};
    });
    var name=rid==="vollmond"?"Vollmond":rid==="neumond"?"Neumond":"Mondtor";
    if(now) return '<b>Jetzt ist ein gutes Fenster.</b> '+now.n+' '+rel(now.t)+dstr(new Date(now.t))+', '+tstr(new Date(now.t))+'.';
    if(next) return 'Nächstes Fenster · '+next.n+': <b>'+rel(next.t)+dstr(new Date(next.t))+', '+tstr(new Date(next.t))+'</b>';
    return 'In den nächsten 30 Tagen kein '+name+' gefunden.';
  }
  function winLine(r){
    if(!r) return "";
    if(r.tone==="feld") return feldLine(r.id);
    var K=r.hard?"HARD":"SOFT", nm=r.hard?"Hard":"Soft";
    if(kalState==="load") return "Nächstes "+nm+"-Fenster wird gesucht …";
    if(!KZ) return "Kalender nicht geladen. Kein Fenster berechnet.";
    var pre="", k=kindNow(), st=kindNow.st;
    if(k===K){
      if(st.open){
        var lt=laterToday(K);
        return '<b>Jetzt ist ein gutes Fenster.</b> Offen bis '+tstr(new Date(st.open.e))+'.'+(lt.length?' Später heute auch: '+lt.join(" · ")+'.':'');
      }
      if(kindNow.src==="kal") return '<b>Jetzt ist ein gutes Fenster.</b>'+(st.band?' Soft-Band bis '+dstr(new Date(st.band.e-1)).replace(/\.$/,"")+'.':'');
      pre='Heute kein Kalendereintrag, die Mondphase trägt '+nm+'.<br>';
    }
    if(kalState==="fail") pre+='Kalender nicht geladen, gerechnet nach Mondphase.<br>';
    var x=nextKal(K);
    if(!x) return pre+"Im Kalender steht in den nächsten 30 Tagen kein "+(r.hard?"Hard-Feintakt":"Soft-Fenster")+".";
    var d=new Date(x.t);
    var s=pre+(r.hard?'Nächster Hard-Feintakt':'Nächstes Soft-Fenster')+': <b>'+rel(x.t)+dstr(d)+', '+(x.all?(x.bandEnd&&x.bandEnd-x.t>DAY?'ab diesem Tag (Band bis '+dstr(new Date(x.bandEnd-1))+')':'ganzer Tag'):tstr(d)+(x.end?'–'+tstr(new Date(x.end)):''))+'</b>'+(x.calc?' <span class="meta">(gerechnet)</span>':'');
    if(x.more.length) s+='<br><span class="meta">Am selben Tag auch: '+x.more.join(" · ")+'</span>';
    return s;
  }
  function paintWin(force){
    var run=document.getElementById("run"); if(!run) return;
    var w=run.querySelector("#wetter");
    if(!w) return;
    var el=document.getElementById("nextWin");
    if(el && !force) return;
    if(!el){ el=document.createElement("p"); el.id="nextWin"; w.parentNode.insertBefore(el, w.nextSibling); }
    el.innerHTML=winLine(rit(window._rid));
  }

  /* ================= 3 · Sichern ================= */
  function pack(){
    var p={v:4,t:new Date().toISOString()};
    var names=["rr25_ritual_v1","rr25_notiz_v1","rr25_wer","rr25_personen","rr25_369","rr25_dank","rr25_kleid"];
    for(var i=0;i<localStorage.length;i++){
      var k=localStorage.key(i);
      if(k && k.indexOf("rr25")===0 && k!=="rr25_pack_bak" && k!==SKEY && names.indexOf(k)<0) names.push(k);
    }
    names.forEach(function(k){ var v=get(k); if(v!=null && v!=="") p[k]=v; });
    return p;
  }
  /* alle Fotos aus IndexedDB (rr25_fotos_v1 · pics) als [[id,[dataURL,…]],…] */
  function fotosAll(){
    return new Promise(function(res){
      if(typeof idb!=="function"){ res([]); return; }
      idb().then(function(db){
        var out=[], q;
        try{ q=db.transaction("pics").objectStore("pics").openCursor(); }catch(e){ res([]); return; }
        q.onsuccess=function(){
          var c=q.result;
          if(!c){ res(out); return; }
          if(Array.isArray(c.value) && c.value.length) out.push([c.key,c.value]);
          c.continue();
        };
        q.onerror=function(){ res(out); };
      }).catch(function(){ res([]); });
    });
  }
  function packAll(){
    var p=pack();
    return fotosAll().then(function(f){ if(f.length) p.fotos=f; return p; });
  }
  function fname(ext){ var n=new Date(); return "RR25-Sicherung-"+ymdOf(n)+"."+ext; }
  function lastBak(){
    if(window.RR25_BAK) return window.RR25_BAK.last();
    var a=parseInt(get(SKEY)||"0",10)||0, b=parseInt(get("rr25_bak_at")||"0",10)||0;
    return Math.max(a,b);
  }
  function bakStale(){
    if(window.RR25_BAK) return window.RR25_BAK.stale();
    var t=lastBak(); return !t||Date.now()-t>30*DAY;
  }
  function mb(n){ return n<1048576?Math.max(1,Math.round(n/1024))+" KB":(n/1048576).toFixed(1).replace(".",",")+" MB"; }
  function download(raw,name){
    var blob=new Blob([raw],{type:"application/json"});
    var a=document.createElement("a");
    a.href=URL.createObjectURL(blob); a.download=name; a.rel="noopener";
    document.body.appendChild(a); a.click();
    setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); },1500);
  }
  var busy=false;
  function sichern(cb){
    if(busy) return;
    busy=true;
    var b=document.getElementById("bakGoV3"); if(b){ b.disabled=true; b.textContent="…"; }
    packAll().then(function(p){ busy=false; sichern2(p,cb); }).catch(function(){ busy=false; sichern2(pack(),cb); });
  }
  function sichern2(p,cb){
    var raw=JSON.stringify(p), nf=(p.fotos||[]).reduce(function(a,x){ return a+x[1].length; },0);
    var info=mb(raw.length)+(nf?", "+nf+" Fotos":"");
    sichern2.last={bytes:raw.length,fotos:nf};
    function ok(){ var t=String(Date.now()); set(SKEY,t); set("rr25_bak_at",t); var hb=document.getElementById("bakHint"); if(hb) hb.remove(); paintBak("Gesichert. "+info+"."); if(cb) cb(true); }
    var files=[];
    try{
      files=[new File([raw],fname("json"),{type:"application/json"}), new File([raw],fname("txt"),{type:"text/plain"})];
    }catch(e){ files=[]; }
    for(var i=0;i<files.length;i++){
      try{
        if(navigator.share && navigator.canShare && navigator.canShare({files:[files[i]]})){
          navigator.share({files:[files[i]],title:"RR25 Sicherung"}).then(ok).catch(function(err){
            if(err && err.name==="AbortError"){ paintBak("Nicht gesichert. Nochmal?"); if(cb) cb(false); return; }
            try{ download(raw,fname("json")); ok(); }catch(x){ if(cb) cb(false); }
          });
          return;
        }
      }catch(e){}
    }
    try{ download(raw,fname("json")); ok(); }catch(e){ paintBak("Sichern ging nicht."); if(cb) cb(false); }
  }
  window.RR25_V3={pack:pack,packAll:packAll,fotosAll:fotosAll,sichern:sichern,sichern2:sichern2,schedule:schedule,paintEcho:paintEcho,paintWin:paintWin,winLine:function(id){ return winLine(rit(id)); },kindNow:kindNow,dueList:dueList};
  function paintBak(msg){
    var box=homeBox(); if(!box) return;
    var el=document.getElementById("bakCard");
    var t=lastBak(), days=t?Math.floor((Date.now()-t)/DAY):null;
    var stale=bakStale();
    if(!stale && !msg){ if(el) el.remove(); return; }
    if(!el){ el=document.createElement("div"); el.id="bakCard"; el.className="card"; box.appendChild(el); }
    if(!stale){
      el.innerHTML='<p class="bkMsg">'+h(msg)+'</p>';
      setTimeout(function(){ var x=document.getElementById("bakCard"); if(x && !bakStale()) x.remove(); },3500);
      return;
    }
    el.innerHTML='<div class="bkRow"><div><b>'+(t?'Letzte Sicherung: vor '+days+' Tagen':'Noch keine Sicherung')+'</b>'+
      '<small>'+(msg?h(msg):'Eine Datei mit Chronik, Notizen, Zeichen und allen Fotos.')+'</small></div>'+
      '<button type="button" class="btn primary" id="bakGoV3">Sichern</button></div>';
    document.getElementById("bakGoV3").onclick=function(){ sichern(); };
  }

  /* ================= Einhängen ================= */
  var css=document.createElement("style");
  css.textContent=[
    "#v3Home{margin:.1rem 0 .25rem}",
    "#echoCard{border-color:rgba(126,200,255,.35);background:rgba(28,14,50,.85)}",
    "#echoCard .ecTag{margin:0 0 .2rem;font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;color:#7ec8ff}",
    "#echoCard .ecTag span{color:#8e7aa8;letter-spacing:.08em;text-transform:none}",
    "#echoCard .ecAbs{margin:.35rem 0 0;font-size:.8rem;color:#c4b4e0}",
    "#echoCard .ecQ{margin:.55rem 0 .1rem;font-family:Georgia,serif;font-size:1.02rem}",
    "#echoCard textarea{min-height:3.2rem}",
    "#echoCard .ecRow{margin-top:.35rem}",
    "#echoCard .ecRow .btn{font-weight:550}",
    "#echoCard .ecLater{display:block;margin:.45rem auto 0;background:none;border:0;color:#8e7aa8;font:inherit;font-size:.74rem;text-decoration:underline;padding:.3rem .8rem}","#echoCard .ecRead{width:100%;margin:.35rem 0 0;min-height:2.1rem;font-size:.78rem;border-color:rgba(126,200,255,.35)}",".echoDue a{color:#7ec8ff;text-decoration:none;border-bottom:1px dotted rgba(126,200,255,.55)}",
    "#echoCard .ecThanks,#bakCard .bkMsg{margin:.1rem 0;font-family:Georgia,serif;color:#9ee8e0}",
    "#bakCard .bkRow{display:flex;gap:.6rem;align-items:center}",
    "#bakCard .bkRow>div{flex:1}",
    "#bakCard .btn{flex:none;padding:.5rem 1.1rem}",
    "#run #nextWin{margin:-.3rem 0 .6rem;padding:.5rem .75rem;border-radius:.9rem;background:rgba(20,10,34,.55);border:1px dashed rgba(126,200,255,.22);font-size:.84rem;line-height:1.45;color:#e6dcf7}",
    "#run #nextWin b{color:#fff;font-weight:600}",
    ".echoMark{margin:.3rem 0 0;font-size:.74rem;color:#c4b4e0;line-height:1.4}",
    ".echoMark span{display:inline-block;padding:.05rem .45rem;border-radius:999px;border:1px solid rgba(126,200,255,.3)}",
    ".echoMark .em-wirkt{color:#5fe0a0;border-color:rgba(95,224,160,.45)}",
    ".echoMark .em-teilweise{color:#ffb86b;border-color:rgba(255,184,107,.45)}",
    ".echoMark .em-offen{color:#b8b3c6}",
    "#echoSum{margin:0 0 .55rem;padding:.5rem .75rem;border:1px solid rgba(126,200,255,.2);border-radius:.9rem;background:rgba(20,10,34,.6);font-size:.8rem}",
    "#echoSum summary{cursor:pointer;color:#7ec8ff;font-size:.72rem;letter-spacing:.08em}",
    "#echoSum p{margin:.35rem 0 0;display:flex;justify-content:space-between;gap:.5rem}",
    "#echoSum p b{font-family:Georgia,serif;font-weight:500}",
    "#echoSum p span{color:#c4b4e0;white-space:nowrap}"
  ].join("");
  document.head.appendChild(css);

  if(typeof show==="function" && !show._v3){
    var sh=show;
    show=function(id){
      if(id==="after"){ try{ schedule(); }catch(e){} }
      var r=sh.apply(this,arguments);
      if(id==="home"){ paintEcho(); paintBak(); }
      if(id==="log"||id==="notiz"){ setTimeout(markRows,60); }
      return r;
    };
    show._v3=1;
  }
  function watch(id,fn){
    var el=document.getElementById(id);
    if(el && window.MutationObserver) new MutationObserver(fn).observe(el,{childList:true});
  }
  watch("run", function(){ paintWin(false); });
  watch("entries", markRows);
  loadKal();
  paintEcho(); paintBak();
  setTimeout(function(){ paintEcho(); paintBak(); },700);
})();
