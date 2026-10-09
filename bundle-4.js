/* rr25 · Paket 4/7 · Build 48 · erzeugt mit tools/bundle.py. Nicht von Hand bearbeiten:
   Quelldatei ändern und neu erzeugen. Inhalt in dieser Reihenfolge: ritual-fotos.js, ritual-gpic.js, ritual-kalender.js, ritual-start.js, ritual-buch.js, ritual-navlove.js, ritual-final.js, ritual-gabe-fix.js */
/* ==== ritual-fotos.js ==== */
try{
(function(){
  var css=document.createElement("style");
  css.textContent=[
    "#logFind{width:100%;margin:.15rem 0 .55rem}",
    "#entries .logrow,#gabeList .logrow{display:grid;grid-template-columns:1fr auto;gap:.7rem;align-items:start;padding:.9rem 0;border-top:1px solid rgba(126,200,255,.16)}",
    "#entries .logrow b,#gabeList .logrow b{font-family:Georgia,serif;font-weight:500;font-size:1.02rem}",
    "#entries .logrow .meta,#gabeList .logrow .meta{margin-top:.2rem}",
    "#entries .logact,#gabeList .logact{margin-top:.4rem;border:0;background:none;color:#ff7ad9;padding:0;font:inherit;font-size:.78rem}",
    "#entries .logpic img,#gabeList .logpic img,#logShots img,#gShots img,#opferPrev img,#afterShots img{width:4.8rem;height:4.8rem;object-fit:cover;border-radius:.85rem;border:1px solid rgba(126,200,255,.22);background:#0a0612;display:block}",
    "#entries .logpic img.sig,#logShots img.sig{object-fit:contain}",
    "#entries .shots,#gShots,#opferPrev,#afterShots,#logShots{display:flex!important;gap:.4rem;flex-wrap:wrap;margin:.4rem 0}",
    "#picZoom{position:fixed;inset:0;background:rgba(4,2,10,.94);z-index:120;display:flex;align-items:center;justify-content:center;padding:1rem}",
    "#picZoom img{max-width:100%;max-height:94%;border-radius:1rem;object-fit:contain}"
  ].join("");
  document.head.appendChild(css);

  function isGabe(e){
    if(typeof window._isGabe==="function") return window._isGabe(e);
    if(!e) return false;
    if(e.kind==="gabe") return true;
    var t=String(e.titel||"").toLowerCase();
    return t==="gabe" || t==="opfer" || t==="opfergabe";
  }
  function qbox(){
    var log=document.getElementById("log");
    if(!log || log.querySelector("#logFind")) return;
    var inp=document.createElement("input");
    inp.id="logFind";
    inp.type="search";
    inp.placeholder="Suchen · Name, Ritual, Datum";
    inp.autocomplete="off";
    var entries=document.getElementById("entries");
    if(entries) log.insertBefore(inp, entries);
    else log.appendChild(inp);
    inp.addEventListener("input", function(){ paintLog(); });
  }
  function zoom(src){
    if(!src) return;
    var old=document.getElementById("picZoom"); if(old) old.remove();
    var w=document.createElement("div");
    w.id="picZoom";
    w.innerHTML='<img alt="" src="'+src+'">';
    w.onclick=function(){ w.remove(); };
    document.body.appendChild(w);
  }
  window._zoomPic=zoom;
  document.addEventListener("click", function(e){
    if(!e.target || e.target.tagName!=="IMG") return;
    if(e.target.closest("#picZoom")){ var z=document.getElementById("picZoom"); if(z) z.remove(); e.preventDefault(); return; }
    if(!e.target.closest(".shots,.logpic,#opferPrev,#gShots,#logShots,#afterShots,#gabeOpen")) return;
    e.preventDefault();
    e.stopPropagation();
    zoom(e.target.src);
  }, true);
  function putImg(hold, src, sig){
    if(!hold||!src||hold.querySelector("img")) return;
    var img=document.createElement("img");
    img.src=src;
    if(sig) img.className="sig";
    hold.appendChild(img);
  }
  function attach(id, hold, titel, fallback){
    if(fallback) putImg(hold, fallback, /sigil/i.test(titel||""));
    if(typeof fotoGet!=="function") return;
    fotoGet(id).then(function(arr){
      if(arr && arr[0]) putImg(hold, arr[0], /sigil/i.test(titel||""));
    }).catch(function(){});
  }

  paintLog=function(){
    qbox();
    var box=document.getElementById("entries");
    if(!box) return;
    var rows=[];
    try{ rows=(load().log)||[]; }catch(e){ rows=[]; }
    rows=rows.filter(function(e){ return !isGabe(e); });
    var q=((document.getElementById("logFind")||{}).value||"").trim().toLowerCase();
    if(q){
      rows=rows.filter(function(e){
        var hay=((e.titel||"")+" "+(e.wer||"")+" "+(e.note||"")+" "+(e.t||"")).toLowerCase();
        return hay.indexOf(q)>=0;
      });
    }
    if(!rows.length){
      box.innerHTML=q?"<p class='meta'>Nichts gefunden.</p>":"<p class='meta'>Noch leer.</p>";
      return;
    }
    box.innerHTML=rows.map(function(e){
      var note=String(e.note||"");
      if(note && note===String(e.titel||"")) note="";
      return '<div class="logrow" data-eid="'+e.id+'">'+ 
        '<div><b>'+String(e.titel||"").replace(/</g,"")+'</b>'+
        '<div class="meta">'+String(e.t||"")+(e.wer?" · "+String(e.wer).replace(/</g,""):"")+'</div>'+
        (note?'<p style="margin:.35rem 0 0;white-space:pre-wrap">'+note.replace(/</g,"")+'</p>':'')+
        '<button type="button" class="logact" data-open="'+e.id+'">Öffnen</button></div>'+
        '<div class="logpic" data-pic="'+e.id+'"></div></div>';
    }).join("");
    box.querySelectorAll("[data-open]").forEach(function(b){
      b.onclick=function(){ if(typeof openLog==="function") openLog(b.getAttribute("data-open")); };
    });
    rows.forEach(function(e){
      attach(e.id, box.querySelector('[data-pic="'+e.id+'"]'), e.titel, e.img);
    });
  };

  if(typeof openLog==="function" && !openLog._foto2){
    var ol=openLog;
    openLog=function(id){
      ol(id);
      var box=document.getElementById("entries");
      if(!box) return;
      var sh=box.querySelector("#logShots");
      if(!sh){
        sh=document.createElement("div");
        sh.id="logShots";
        sh.className="shots";
        box.appendChild(sh);
      }
      sh.innerHTML="";
      var e=null;
      try{ e=((load().log)||[]).filter(function(x){ return String(x.id)===String(id); })[0]; }catch(err){}
      attach(id, sh, e&&e.titel, e&&e.img);
    };
    openLog._foto2=1;
  }

  if(typeof show==="function" && !show._foto2){
    var shw=show;
    show=function(id){
      var r=shw.apply(this,arguments);
      if(id==="log") setTimeout(function(){ qbox(); paintLog(); }, 30);
      return r;
    };
    show._foto2=1;
  }
  qbox();
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-gpic.js ==== */
try{
(function(){
  window._picMemo=window._picMemo||{};
  function fill(){
    var list=document.getElementById("gabeList");
    if(!list) return;
    list.querySelectorAll("[data-gpic]").forEach(function(cell){
      if(cell.querySelector("img")) return;
      var id=cell.getAttribute("data-gpic");
      var src=(window._picMemo||{})[id];
      if(!src && typeof fotoGet==="function"){
        fotoGet(id).then(function(a){
          if(a&&a[0]&&!cell.querySelector("img")){
            var img=document.createElement("img"); img.src=a[0]; cell.appendChild(img);
          }
        });
        return;
      }
      if(!src) return;
      var img=document.createElement("img");
      img.src=src;
      cell.appendChild(img);
    });
  }
  document.addEventListener("click", function(e){
    if(!e.target || !e.target.closest) return;
    if(e.target.closest("#opferGo") || e.target.closest("#opferFoto")){
      var prev=document.querySelector("#opferPrev img");
      if(prev && prev.src) window._lastGabePic=prev.src;
    }
    if(e.target.closest("#opferGo")){
      setTimeout(function(){
        var first=document.querySelector("#gabeList [data-gpic]");
        if(first && window._lastGabePic){
          window._picMemo[first.getAttribute("data-gpic")]=window._lastGabePic;
        }
        fill();
      }, 60);
      setTimeout(fill, 350);
    }
  }, true);
  if(typeof show==="function" && !show._gpic){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="opfer") setTimeout(fill, 50);
      return r;
    };
    show._gpic=1;
  }
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-kalender.js ==== */
try{
/* ritual-kalender.js — Kalender-Tab «Magie so sei es».
   Regel und Daten: ritual-zeit.js (RR25_KAL), dieselbe Regel wie im Tor. Bänder gelten von Start bis Ende,
   Hard nur solange ein Feintakt offen ist, nie aus künftigen Terminen. Liest rr25_echo_v1 nur (Echo-Tag 3/9), speichert
   wie bisher nur beim Antippen einer Karte nach «Geplant» (rr25_ritual_v1.planned). */
(function(){
  var LINK="https://calendar.google.com/calendar/r?cid=47c369013814767dea03adb95f43c3b7b64174e10565af9fbe6799f0a8eb0e3a@group.calendar.google.com";
  var K=window.RR25_KAL;
  if(!K) return;
  var DAY=86400000, OPENALL=false, MONTH=null, SEL=null, YEAR=false, CTX=[];
  var DN=["So","Mo","Di","Mi","Do","Fr","Sa"], WD=["Mo","Di","Mi","Do","Fr","Sa","So"];
  var MN=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
  var NAME={SOFT:"Soft",HARD:"Hard",ECHO:"Echo",STILL:"Still",GRENZE:"Grenze"};
  function seas(t){ return K.seasons?K.seasons(t):[]; } /* Saisons: nur Anzeige, ändern den Ton nie */
  /* Build 33: Datumsbereiche einheitlich mit Jahr («3.10. (…) – 14.11.2026» -> «3.10.2026 (…) – 14.11.2026», «30.1.–28.2.2027» -> «30.1.2027 – 28.2.2027») */
  function yr(s){ return String(s==null?"":s).replace(/(\b\d{1,2})\.(\d{1,2})\.(?!\d)((?:\s*\([^)]*\))?)\s*–\s*(\d{1,2})\.(\d{1,2})\.(\d{4})/g,function(m,d1,m1,p,d2,m2,y){ return d1+"."+m1+"."+(+m1>+m2?y-1:y)+p+" – "+d2+"."+m2+"."+y; }); }
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
    if(k==="echo") return {id:"echo",label:"Echo lesen"};
    return {id:"",label:""};
  }
  function when(x){
    if(x.all) return x.band?dstr(x.s)+" – "+dstr(x.e-1):dstr(x.s);
    return dstr(x.s)+" · "+tstr(x.s)+"–"+tstr(x.e);
  }
  /* Ritual-Start aus einem Feintakt (nur heute, nur solange das Fenster nicht vorbei ist). Hard bleibt Hard:
     Diagnose, Ethik-Gate, Tor, Pflicht-Rückkehr und Abbruch laufen wie immer; ist das Fenster zu, gilt die Regel im Tor. */
  function startBtn(x,now){
    if(x.all||x.e<=now||day0(x.s)!==day0(now)||!window.RR25_OPEN||x.k==="STILL") return "";
    var i=CTX.push({title:x.t,s:x.s,e:x.e,kind:x.k,anker:x.anker})-1, lab;
    if(x.anker) lab="Rückkehr · Anker starten";
    else if(x.k==="HARD") lab="Hard-Ritual wählen";
    else if(x.k==="ECHO") lab="Echo lesen";
    else lab="Segen starten";
    return '<div class="row kalGo"><button type="button" class="btn ghost kalStart" data-ctx="'+i+'">'+lab+'</button></div>';
  }
  function hardPick(i){
    var L=(typeof R!=="undefined"?R:[]).filter(function(r){ return r.hard; });
    return '<div class="kalPick">'+L.map(function(r){ return '<button type="button" class="btn ghost kalPickR" data-ctx="'+i+'" data-rid="'+h(r.id)+'">'+h(r.t)+'</button>'; }).join("")+'</div>';
  }
  function card(x,now){
    var k=x.k.toLowerCase(), sug=suggest(k), live=!x.all&&x.s<=now&&now<x.e;
    var sz=x.src==="saison";
    var hint=sz?"Saison · nur lesen. Ändert Ton und Tor nicht.":k==="hard"?"Nur vormerken. Nicht automatisch setzen.":(sug.id?"Tippen legt nach Geplant.":"Nur lesen.");
    return '<article class="card kalcard '+k+(sz?' saison':'')+(live?' kallive':'')+'"'+(sz?'':' data-kal="1"')+' data-kind="'+k+'" data-title="'+h(x.t).replace(/"/g,"")+'" data-sid="'+sug.id+'" data-slabel="'+sug.label+'">'+
      '<b>'+h(x.t)+'</b>'+
      '<div class="meta">'+when(x)+(live?' · <span class="kalOn">läuft, '+rest(x.e,now)+'</span>':'')+(x.band&&x.s<=now&&now<x.e?' · '+left(x,now):'')+(x.src==="calc"?" · gerechnet":"")+'</div>'+
      (x.d?'<p class="kalD">'+h(yr(x.d))+'</p>':'')+(x.all&&k==="hard"&&!sz&&/Rückkehr · Anker/.test(x.d)?'':'<p class="meta">'+(x.all&&k==="hard"&&!sz?"Hard-Tag. Arbeit nur im Feintakt, abends Rückkehr · Anker.":hint)+'</p>')+startBtn(x,now)+
      '</article>';
  }
  function left(b,now){ var n=Math.round((b.e-day0(now))/DAY); return n<=1?"letzter Tag":"noch "+n+" Tage"; }

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
    /* Build 33: nur Anzeige. Hard-Tag/-Phase ohne offenen Feintakt: Kopf zeigt Hard wie die Tagesansicht (Ton/Gate unverändert). */
    var dp=K.dayParts(now), hov=s.kind!=="HARD"&&dp.kind==="HARD";
    if(hov){ tone="hard"; title=s.hardDay?s.hardDay.t:(dp.band&&dp.band.k==="HARD"?dp.band.t:(dp.single&&dp.single.k==="HARD"?dp.single.t:"HARD · Tag")); }
    var sag={
      HARD:"Feintakt offen. Nur mit Gate und Rückkehr.",
      STILL:"Heute still. Buch zu. Keine Kerze aus Pflicht.",
      ECHO:s.open?"Echo-Fenster. Lesen, nicht nachladen.":"Heute Nachlauf. Lesen, nicht nachladen.",
      SOFT:s.open?"Soft-Fenster offen. Öffnen erlaubt. Halten nicht.":"Heute soft. Öffnen erlaubt. Halten nicht."
    }[s.kind];
    if(hov) sag="Hard-Tag. Arbeit nur im Feintakt, abends Rückkehr · Anker.";
    var L=[];
    if(s.open) L.push('<p class="kalNow"><span class="kalOn">offen</span> bis '+tstr(s.open.e)+' · '+rest(s.open.e,now)+'</p>');
    L.push('<p>'+sag+'</p>');
    if(s.band) L.push('<p class="kalBand"><i class="kb '+s.band.k.toLowerCase()+'"></i>Band '+NAME[s.band.k]+' · '+dstr(s.band.s)+' – '+dstr(s.band.e-1)+' · '+left(s.band,now)+(s.band.src==="calc"?' · gerechnet':'')+'</p>');
    var nh=K.next("HARD",now), later=s.hard.filter(function(x){ return x.s>now; });
    if(s.kind!=="HARD"||later.length){
      if(nh) L.push('<p class="kalNext">Nächster Hard-Feintakt: <span class="kalEm">'+rel(nh.x.s,now)+' · '+tstr(nh.x.s)+'–'+tstr(nh.x.e)+'</span>'+(nh.more.length?'<br><span>dann '+nh.more.map(function(y){ return tstr(y.s)+(y.anker?' (Anker)':''); }).join(" · ")+'</span>':'')+'</p>');
      else L.push('<p class="kalNext">Kein Hard-Feintakt mehr im Kalender.</p>');
    }
    var hints=[];
    if(s.anker&&s.anker.e>now){
      var ai=CTX.push({title:s.anker.t,s:s.anker.s,e:s.anker.e,kind:s.anker.k,anker:true})-1;
      hints.push('<a href="#anker" class="kalAnker" data-ctx="'+ai+'">'+(s.anker.s<=now?"Jetzt Rückkehr · Anker":"Heute "+tstr(s.anker.s)+" Rückkehr · Anker")+'</a>'+(s.anker.s<=now?" · Körper · Raum · Atem · Feld zu":""));
    }
    var tm=K.dayParts(addDays(now,1));
    if(tm.single&&tm.single.k==="ECHO"&&tm.src==="tag") hints.push("Morgen Echo-Nachlauf: lesen, kein neues Portal");
    var ec=echoChecks(), end=addDays(day0(now),1), soon=addDays(day0(now),3);
    ec.filter(function(x){ return x.due<end; }).slice(0,2).forEach(function(x){ hints.push("Echo · Tag "+x.k+": «"+h(x.name)+"» ist dran"); });
    ec.filter(function(x){ return x.due>=end&&x.due<soon; }).slice(0,1).forEach(function(x){ hints.push("Echo · Tag "+x.k+" für «"+h(x.name)+"» "+rel(x.due,now)); });
    seas(now).slice(0,2).reverse().forEach(function(z){ hints.unshift('<span class="kalSz '+z.k.toLowerCase()+'">'+h(z.t)+'</span> · '+h(yr(z.d))); });
    if(s.hardDay) hints.unshift((hov&&title===s.hardDay.t?'':'<span class="kalHd">'+h(s.hardDay.t)+'</span> · ')+h(s.hardDay.d||"Abends Rückkehr · Anker."));
    if(hints.length) L.push('<p class="kalHint">'+hints.join("<br>")+'</p>');
    var mn=K.moonNext(now), mm=[];
    if(mn.neu) mm.push([mn.neu,"○ Neumond "+rel(mn.neu,now)+" "+tstr(mn.neu)]);
    if(mn.voll) mm.push([mn.voll,"● Vollmond "+rel(mn.voll,now)+" "+tstr(mn.voll)]);
    mm.sort(function(a,b){ return a[0]-b[0]; });
    var pl=planetLine(now); if(pl) L.push(pl);
    L.push('<p class="meta">'+moonLabel(now)+' · '+K.ORT+'</p>');
    if(mm.length) L.push('<p class="meta kalMoon">'+mm.map(function(x){ return x[1]; }).join(" · ")+'</p>');
    return '<article class="card kalcard '+tone+' kaltoday" data-tone="'+tone+'"><p class="meta">Heute · '+tstr(now)+'</p><b>'+h(title)+'</b>'+L.join("")+'</article>';
  }

  function planetOn(){ try{ return !!(window.RR25_OPT&&window.RR25_OPT.get("planet")); }catch(e){ return false; } }
  function planetLine(now){
    if(!planetOn()||!K.planetAt) return "";
    var a=K.planetAt(now), v=K.venusNext(now), c=a.cur;
    if(!c) return "";
    var vt=v?(v.s<=now?"jetzt Venus-Stunde bis "+tstr(v.e):"nächste Venus-Stunde "+rel(v.s,now)+" "+tstr(v.s)+"–"+tstr(v.e)):"";
    return '<p class="kalPlan"><span class="kpTag">Planetenstunde</span> '+(c.p==="Mars"||c.p==="Saturn"?'<b class="kpHard">'+c.p+'</b>':c.p)+(c.p==="Venus"?' ♀':'')+' · bis '+tstr(c.e)+(vt&&c.p!=="Venus"?' · '+vt:'')+'<br><span>Nur Info. Der Ton oben gilt.</span></p>';
  }
  function yearView(now){
    var n=new Date(now), y0=n.getMonth()>=8?n.getFullYear():n.getFullYear()-1, out=[];
    for(var m=0;m<12;m++){
      var m0=new Date(y0,8+m,1).getTime(), d=new Date(m0), L=K.list(m0+15*DAY), first=(d.getDay()+6)%7, cells=[], calcAll=true;
      for(var j=0;j<first;j++) cells.push('<i class="kyE"></i>');
      for(var dm=m0;new Date(dm).getMonth()===d.getMonth();dm=addDays(dm,1)){
        var p=K.dayPartsIn(dm+12*3600000,L), calc=!p.items.some(function(x){ return x.src==="kal"; }), hard=p.items.some(function(x){ return !x.all&&x.k==="HARD"; });
        if(!calc) calcAll=false;
        cells.push('<i class="kyD '+p.kind.toLowerCase()+(calc?' calc':'')+(hard?' hd':'')+(dm===day0(now)?' today':'')+'"></i>');
      }
      out.push('<button type="button" class="kyM'+(calcAll?' calc':'')+'" data-ym="'+m0+'"><b>'+MN[d.getMonth()].slice(0,3)+' '+String(d.getFullYear()).slice(2)+'</b><span class="kyG">'+cells.join("")+'</span></button>');
    }
    return '<div class="kalMonth kalYear"><div class="kmHead"><button type="button" class="kmNav" id="kyBack" aria-label="Zurück zum Monat">‹</button><b>Jahr · Sep '+y0+' – Aug '+(y0+1)+'</b><span class="kmNav kmGhost"></span></div>'+
      '<div class="kyGrid">'+out.join("")+'</div>'+
      LEG(true)+'</div>';
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
      var zz=seas(dm+12*3600000)[0]; if(zz) dots+='<i class="ds '+zz.k.toLowerCase()+'"></i>';
      var mk=M?M.day(dm+12*3600000).key:"", moon=mk==="voll"?"●":(mk==="neu"?"○":"");
      var calc=!p.items.some(function(x){ return x.src==="kal"; });
      cells.push('<button type="button" class="kmDay '+p.kind.toLowerCase()+(dd.getMonth()!==d.getMonth()?' out':'')+(dm===day0(now)?' today':'')+(dm===SEL?' sel':'')+(calc?' calc':'')+'" data-day="'+dm+'" aria-label="'+dstr(dm)+' '+NAME[p.kind]+'">'+
        (moon?'<span class="kmMoon">'+moon+'</span>':'')+'<span>'+dd.getDate()+'</span><span class="kmDots">'+dots+'</span></button>');
    }
    return '<div class="kalMonth"><div class="kmHead"><button type="button" class="kmNav" data-m="-1" aria-label="Monat zurück">‹</button><b>'+MN[d.getMonth()]+' '+d.getFullYear()+'</b><span class="kmR"><button type="button" class="kmYear" id="kmYear">Jahr</button><button type="button" class="kmNav" data-m="1" aria-label="Monat vor">›</button></span></div>'+
      '<div class="kmGrid">'+cells.join("")+'</div>'+
      LEG(false)+'</div>';
  }
  /* Legende (Build 33): Symbol+Text bleiben zusammen (nowrap je Eintrag, Zeile bricht zwischen Einträgen) */
  function LEG(yr){
    var a=['<i class="kl soft"></i>Soft','<i class="kl still"></i>Still','<i class="kl echo"></i>Echo','<i class="kl hard"></i>Hard-Tag/Phase','<i class="dh"></i>Hard-Feintakt'];
    if(!yr) a.push('<i class="de"></i>Nachlauf');
    a.push('<i class="ds hard"></i>Saison','● Voll','○ Neu');
    if(yr) a.push('gestrichelt = gerechnet (ohne Hard)');
    return '<p class="kmLeg">'+a.map(function(x){ return '<span class="kmLi">'+x+'</span>'; }).join("")+'</p>';
  }
  function dayDetail(dm,now){
    var p=K.dayParts(dm+12*3600000), hard=p.items.filter(function(x){ return !x.all&&x.k==="HARD"; }).length;
    var head=dstr(dm)+' · '+NAME[p.kind]+(p.band?'-Band':'')+(hard?' · '+hard+' Hard-Feintakte':'');
    var items=p.items.concat(seas(dm+12*3600000)).sort(function(a,b){ return (b.band-a.band)||(a.s-b.s); });
    var vh="";
    if(planetOn()&&K.planetDay){ var V=K.planetDay(dm).filter(function(x){ return x.p==="Venus"; }); if(V.length) vh='<p class="kalPlan"><span class="kpTag">Venus-Stunden</span> '+V.map(function(x){ return tstr(x.s)+"–"+tstr(x.e)+(x.nacht?" (Nacht)":""); }).join(" · ")+'<br><span>Nur Info. Der Ton gilt.</span></p>'; }
    return '<div id="kalDay"><p class="group">'+head+'</p>'+vh+(items.length?items.map(function(x){ return card(x,now); }).join(""):'<p class="meta">Keine Einträge. Mondregel: '+NAME[p.kind]+'.</p>')+'</div>';
  }
  function covLine(now){
    var c=K.coverage(), stt=K.status();
    if(stt==="fail"||!c) return '<p class="kalCov warn">Kalender nicht geladen. Die App rechnet Bänder und Mondtage selbst (ohne Hard).</p>';
    var gen=(K.data()||{}).generated, days=Math.round((c.to-day0(now))/DAY);
    var txt='Kalender reicht bis '+dstr(c.to-1)+new Date(c.to-1).getFullYear()+(gen?' · Stand '+dstr(Date.parse(gen)):'');
    if(days<=0) return '<p class="kalCov warn">Kalender-Daten sind ausgelaufen ('+dstr(c.to-1)+'). Die App rechnet selbst, ohne Hard. Bitte Kalender-Sync laufen lassen.</p>';
    if(days<21) return '<p class="kalCov warn">'+txt+(/\.$/.test(txt)?'':'.')+' Nur noch '+days+' Tage, danach rechnet die App selbst (ohne Hard). Bitte Kalender-Sync laufen lassen.</p>';
    return '<p class="kalCov">'+txt+'</p>';
  }
  function bindAnker(root){
    root.querySelectorAll(".kalAnker").forEach(function(a){ a.onclick=function(ev){ ev.preventDefault(); var c=CTX[+a.getAttribute("data-ctx")]; if(c&&window.RR25_OPEN) window.RR25_OPEN("anker",c); }; });
  }
  function paint(){
    var box=document.getElementById("kalList");
    if(!box) return;
    var T=Date.now(), L=K.list(T), wkEnd=T+7*DAY;
    var up=L.filter(function(x){ return x.e>T&&!(x.band&&x.s<=T); });
    var week=up.filter(function(x){ return x.s<wkEnd; }), rest=up.filter(function(x){ return x.s>=wkEnd; });
    CTX=[];
    var html=todayCard(T)+(YEAR?yearView(T):month(T))+(SEL!=null&&!YEAR?dayDetail(SEL,T):'');
    html+='<p class="group">7 Tage</p>';
    html+=week.length?week.map(function(x){ return card(x,T); }).join(""):"<p class='meta'>Keine Fenster in 7 Tagen.</p>";
    if(rest.length){
      html+='<div class="row"><button type="button" class="btn ghost" id="kalMore">'+(OPENALL?"Woche":"Weitere "+rest.length+" Einträge")+'</button></div>';
      if(OPENALL) html+='<p class="group">Weitere</p>'+rest.map(function(x){ return card(x,T); }).join("");
    }
    html+=covLine(T);
    box.innerHTML=html;
    var more=document.getElementById("kalMore");
    if(more) more.onclick=function(){ OPENALL=!OPENALL; paint(); };
    box.querySelectorAll(".kmNav").forEach(function(b){
      b.onclick=function(){ var base=MONTH||new Date(new Date(T).getFullYear(),new Date(T).getMonth(),1).getTime(), d=new Date(base);
        MONTH=new Date(d.getFullYear(),d.getMonth()+(+b.getAttribute("data-m")),1).getTime(); paint(); };
    });
    var yb=document.getElementById("kmYear"); if(yb) yb.onclick=function(){ YEAR=true; paint(); };
    var yk=document.getElementById("kyBack"); if(yk) yk.onclick=function(){ YEAR=false; paint(); };
    box.querySelectorAll(".kyM").forEach(function(b){ b.onclick=function(){ MONTH=+b.getAttribute("data-ym"); YEAR=false; SEL=null; paint(); }; });
    function go(el,rid){ var c=CTX[+el.getAttribute("data-ctx")]; if(c&&window.RR25_OPEN) window.RR25_OPEN(rid,c); }
    bindAnker(box);
    box.querySelectorAll(".kalStart").forEach(function(b){
      b.onclick=function(ev){
        ev.stopPropagation();
        var c=CTX[+b.getAttribute("data-ctx")]; if(!c) return;
        if(c.anker) return go(b,"anker");
        if(c.kind==="HARD"){
          var host=b.closest(".kalGo"), ex=host.nextElementSibling;
          if(ex&&ex.classList.contains("kalPick")){ ex.remove(); return; }
          host.insertAdjacentHTML("afterend",hardPick(b.getAttribute("data-ctx")));
          host.nextElementSibling.querySelectorAll(".kalPickR").forEach(function(r){ r.onclick=function(e2){ e2.stopPropagation(); go(r,r.getAttribute("data-rid")); }; });
          return;
        }
        go(b,c.kind==="ECHO"?"echo":"segen");
      };
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
    var neu=tmp.firstChild; if(neu&&neu.outerHTML!==old.outerHTML){ if(neu.getAttribute("data-tone")!==old.getAttribute("data-tone")) paint(); else { old.replaceWith(neu); bindAnker(neu); } }
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
    ".kmDay.hard{border-bottom-color:#e74c3c;background:rgba(231,76,60,.14)}",
    ".kmDay.calc{border-bottom-style:dashed}",
    ".kmDay.out{opacity:.32}",
    ".kmDay.today{box-shadow:inset 0 0 0 1.5px #ff7ad9}",
    ".kmDay.sel{box-shadow:inset 0 0 0 2px #cbb8ff;background:rgba(155,140,255,.22)}",
    ".kmDay.today.sel{box-shadow:inset 0 0 0 2px #ff7ad9;background:rgba(155,140,255,.22)}",
    ".kmMoon{position:absolute;top:1px;right:3px;font-size:.55rem;line-height:1;color:#fff1c2}",
    ".kmDots{display:flex;gap:2px;height:5px}",
    ".kmDots i,.kmLeg i.dh,.kmLeg i.de{display:inline-block;width:5px;height:5px;border-radius:50%}",
    "i.dh{background:#ff5470}i.de{background:#c77dff}i.dc{box-sizing:border-box;border:1.2px solid #ff7ad9}",
    ".kmLeg{margin:.45rem .1rem 0;font-size:.62rem;color:#a996cf;line-height:1.6;display:flex;flex-wrap:wrap;column-gap:.55rem;row-gap:0}.kmLeg .kmLi{white-space:nowrap}.kmLeg .kmLi>i:first-child{margin-left:0}",
    ".kmLeg i.dh,.kmLeg i.de{margin:0 .2rem 0 .35rem}",
    ".kalCov{margin:.8rem .1rem .2rem;font-size:.7rem;color:#8f80b8}",
    ".kalGo{margin:.45rem 0 0!important}.kalGo .btn{min-height:2.1rem;font-size:.78rem;padding:.35rem .9rem}",
    ".kalPick{display:flex;flex-wrap:wrap;gap:.35rem;margin:.4rem 0 0}.kalPick .btn{flex:1 1 45%;min-height:2rem;font-size:.74rem;padding:.3rem .5rem;border-color:rgba(255,84,112,.4)}",
    ".kalAnker{color:#e7c9ff;text-decoration:none;border-bottom:1px dotted rgba(231,201,255,.6)}",
    ".kalPlan{color:#bfb2da!important;font-size:.72rem!important}.kalPlan span{color:#8f80b8}.kalPlan .kpHard{color:#ff5470!important;font-weight:600}.kalPlan .kpTag{color:#f0b8ff;letter-spacing:.08em;text-transform:uppercase;font-size:.6rem;margin-right:.25rem}",
    ".kmR{display:flex;gap:.35rem;align-items:center}.kmYear{height:2rem;padding:0 .7rem;border-radius:999px;border:1px solid rgba(155,140,255,.35);background:rgba(155,140,255,.08);color:#cbb8ff;font-size:.7rem;letter-spacing:.06em}",
    ".kmGhost{visibility:hidden;border:0;background:none}",
    ".kyGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:.4rem}",
    ".kyM{border:1px solid rgba(155,140,255,.18);background:rgba(255,255,255,.02);border-radius:10px;padding:.3rem .3rem .35rem;color:#e6dcff;text-align:left}",
    ".kyM.calc{border-style:dashed;opacity:.8}.kyM b{display:block;font:500 .66rem system-ui,sans-serif;letter-spacing:.06em;margin:0 0 .2rem .1rem;color:#d9c8ff}",
    ".kyG{display:grid;grid-template-columns:repeat(7,1fr);gap:1.5px}",
    ".kyD,.kyE{display:block;height:7px;border-radius:1.5px}.kyD{background:rgba(255,255,255,.06);box-sizing:border-box}",
    ".kyD.soft{background:rgba(46,204,113,.55)}.kyD.still{background:rgba(154,150,166,.5)}.kyD.echo{background:rgba(179,107,255,.65)}",
    ".kyD.calc{background:transparent!important;border:1px dashed rgba(200,190,230,.45)}.kyD.calc.soft{border-color:rgba(46,204,113,.7)}.kyD.calc.still{border-color:rgba(154,150,166,.7)}.kyD.calc.echo{border-color:rgba(179,107,255,.8)}",
    ".kyD.hard{background:rgba(231,76,60,.6)}.kyD.calc.hard{border-color:rgba(231,76,60,.8)}.kl.hard{background:#e74c3c}.kalcard p.kalD{color:#ffb3a8}.kalHd{color:#ff8a7a;font-weight:600}",
    ".kyD.hd{box-shadow:inset 0 -2px 0 #ff5470}.kyD.today{outline:1.5px solid #ff7ad9;outline-offset:0}",
    ".kalCov.warn{color:#ffb86b}",
    ".kalcard.grenze{border-color:#ff9f43;background:rgba(255,159,67,.13)}.kalcard.grenze b{color:#ffc58a}",
    ".kalcard.saison{border-left-style:double}.kalcard.saison.soft p.kalD{color:#9dffc4}.kalcard.saison.echo p.kalD{color:#dcb8ff}.kalcard.saison.still p.kalD{color:#dcd8e4}.kalcard.saison.grenze p.kalD{color:#ffc58a}",
    ".kalSz{font-weight:600}.kalSz.hard{color:#ff8a7a}.kalSz.soft{color:#7dffb0}.kalSz.echo{color:#dcb8ff}.kalSz.still{color:#dcd8e4}.kalSz.grenze{color:#ffc58a}",
    "i.ds{display:inline-block;width:5px;height:5px;box-sizing:border-box;border-radius:1px;transform:rotate(45deg);background:#ff5470}.kmLeg i.ds{margin:0 .25rem 0 .35rem}",
    "i.ds.soft{background:#2ecc71}i.ds.echo{background:#b36bff}i.ds.still{background:#c9c5d4}i.ds.grenze{background:#ff9f43}"
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

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-start.js ==== */
try{
(function(){
  function order(){
    var home=document.getElementById("home");
    if(!home) return;
    var kast=document.getElementById("kasten");
    var mond=document.getElementById("mondSag");
    var dank=document.getElementById("pinDank");
    var cats=document.getElementById("cats");
    var lab=document.getElementById("v3CatLab"); /* «Rituale»-Überschrift bleibt direkt über den Chips (kein Nachrutschen) */
    var sk=document.getElementById("skizze");
    var list=document.getElementById("list");
    function after(ref, el){
      if(!el) return;
      if(ref && ref.nextSibling) home.insertBefore(el, ref.nextSibling);
      else if(ref) home.appendChild(el);
    }
    var tone=document.getElementById("toneRow"); /* Ton-Chip (v13) direkt unter dem Kasten, Platz steht fest in index.html */
    if(kast){
      if(tone) after(kast, tone);
      var hint=document.getElementById("ankerHintCard"); /* Build 33: Anker-Hinweis direkt unter der Ton-Zeile */
      if(hint&&tone) after(tone, hint);
      var base=(tone&&hint)||tone||kast;
      if(mond) after(base, mond);
      if(dank) after(mond||base, dank);
      if(lab) after(dank||mond||base, lab);
      if(cats) after(lab||dank||mond||base, cats);
      if(sk) after(cats||dank||mond||base, sk);
      if(list) after(sk||cats, list);
    }
  }
  function quiet(){
    try{ if(!cat || cat==="Alle" || cat==="Alltag") cat=""; }catch(e){}
    var cats=document.getElementById("cats");
    var list=document.getElementById("list");
    var on=cats && cats.querySelector(".chip.on");
    if(on && (on.getAttribute("data-cat")==="Alle" || on.getAttribute("data-cat")==="Alltag")){
      on.classList.remove("on");
      on=null;
      try{ cat=""; }catch(e){}
    }
    if(!on && list) list.innerHTML="";
    order();
    var sk=document.getElementById("skizze");
    if(sk) sk.style.display=on?"none":"block";
  }
  var css=document.createElement("style");
  css.textContent=[
    "#cats{margin:.28rem 0 .2rem!important}",
    "#skizze{margin:.15rem auto .15rem!important}",
    "#home:not(:has(#cats .chip.on)) #skizze{display:block!important}",
    "#home:not(:has(#cats .chip.on)) #list{display:none!important}",
    "#home:has(#cats .chip.on) #skizze{display:none!important}",
    "#home:has(#cats .chip.on) #list{display:block!important}"
  ].join("");
  document.head.appendChild(css);
  if(typeof renderList==="function" && !renderList._boot){
    var rl=renderList;
    renderList=function(){ rl(); quiet(); };
    renderList._boot=1;
  }
  if(typeof show==="function" && !show._boot){
    var sh=show;
    show=function(id){
      if(id==="home") try{ cat=""; }catch(e){}
      var r=sh.apply(this,arguments);
      if(id==="home") setTimeout(quiet,0);
      return r;
    };
    show._boot=1;
  }
  quiet();
  setTimeout(quiet,80);
  setTimeout(quiet,240);
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-buch.js ==== */
try{
/* Buch: kein Buchtext mehr in der App und im Repo. Knöpfe öffnen die privaten PDFs in Google Drive
   (nur für den Besitzer sichtbar, wenn er angemeldet ist): «Mein Buch» und «Urbuch». Nur Links, nie Inhalte. */
(function(){
  var OPEN="https://drive.google.com/file/d/1XMRksJwMBi4YyM0tpEfsa0-4BI9Z0Ass/view";
  var URBUCH="https://drive.google.com/file/d/1kDvCofm93JQVi1PJ4YR2iOdADWzt9Mhw/view?usp=drivesdk";
  function go(u){ window.open(u,"_blank","noopener"); }
  var css=document.createElement("style");
  css.textContent=[
    "#buch .hero h2{margin-bottom:.4rem}",
    "#page.book{background:none!important;border:0!important;box-shadow:none!important;padding:.4rem 0 0!important}",
    "#buchGo{display:flex;flex-direction:column;align-items:center;gap:.55rem;margin:1.2rem 0 0}",
    "#buchOpen{display:block;width:100%;min-height:3.3rem;border:0;border-radius:999px;font:inherit;font-size:1rem;font-weight:650;letter-spacing:.02em;color:#14081c;background:linear-gradient(165deg,#ff7ad9,#b98cff 55%,#7ec8ff);box-shadow:0 0 22px rgba(201,155,255,.45),0 0 0 1px rgba(232,160,255,.55);cursor:pointer}",
    "#buchOpen:active,#urbuchOpen:active{transform:scale(.98)}",
    "#urbuchOpen{display:block;width:100%;min-height:3.3rem;margin-top:.9rem;border:0;border-radius:999px;font:inherit;font-size:1rem;font-weight:650;letter-spacing:.02em;color:#14081c;background:linear-gradient(165deg,#b98cff,#ff7ad9 55%,#ffb3ec);box-shadow:0 0 22px rgba(201,155,255,.45),0 0 0 1px rgba(232,160,255,.55);cursor:pointer}",
    "#buchGo small{font-size:.74rem;color:#c4b4e0;letter-spacing:.04em}"
  ].join("");
  document.head.appendChild(css);
  paintBuch=function(){
    var page=document.getElementById("page");
    if(!page) return;
    page.innerHTML='<div id="buchGo"><button type="button" id="buchOpen">Mein Buch öffnen</button><small>Privat · öffnet in Google Drive</small><button type="button" id="urbuchOpen">Urbuch öffnen</button><small>Privat · öffnet in Google Drive</small></div>';
    document.getElementById("buchOpen").onclick=function(){ go(OPEN); };
    document.getElementById("urbuchOpen").onclick=function(){ go(URBUCH); };
  };
  if(typeof show==="function" && !show._buchneu){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="buch") paintBuch();
      return r;
    };
    show._buchneu=1;
  }
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-navlove.js ==== */
try{
(function(){
  var ICO={
    home:'<svg viewBox="0 0 24 24"><path d="M8 19c0-2 1.6-4 4-5.2C14.4 15 16 17 16 19"/><path d="M12 4.2l1.1 3.2 3.4.1-2.7 2.1.9 3.3L12 11.2 9.3 12.9l.9-3.3-2.7-2.1 3.4-.1z"/></svg>',
    geplant:'<svg viewBox="0 0 24 24"><rect x="5" y="6" width="14" height="13" rx="2.2"/><path d="M8 4v3M16 4v3M5 10h14"/><path d="M8 14h3M13 17h3"/></svg>',
    kal:'<svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="6.2"/><path d="M12 9.4v3.8l2.4 1.4"/><path d="M9 4.6h6"/></svg>',
    log:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"/><path d="M12 8v4.4l2.8 1.6"/></svg>',
    notiz:'<svg viewBox="0 0 24 24"><path d="M7.2 5.2h8.2L19 8.8V19H7.2z"/><path d="M15.2 5.2V9H19M9 12.5h6M9 15.6h4"/></svg>',
    opfer:'<svg viewBox="0 0 24 24"><path d="M12 4.2l2.4 4.8 5.2 1.1-4 3.4 1.2 5.1L12 16.4 7.2 18.6l1.2-5.1-4-3.4 5.2-1.1z"/></svg>',
    buch:'<svg viewBox="0 0 24 24"><path d="M6 5.4h10.2A2.6 2.6 0 0119 8v11.2H8.4A2.4 2.4 0 016 16.8V5.4z"/><path d="M8.2 19.2A2.4 2.4 0 016 16.8"/></svg>'
  };
  var LAB={home:"Rituale",geplant:"Geplant",kal:"Kalender",log:"Chronik",notiz:"Notiz",opfer:"Gabe",buch:"Buch"};
  function paint(){
    document.querySelectorAll("nav button[data-v]").forEach(function(b){
      var v=b.getAttribute("data-v");
      if(!ICO[v] || b.querySelector(".ic")) return;
      b.innerHTML='<span class="ic">'+ICO[v]+'</span><span class="lb">'+(LAB[v]||v)+'</span>';
    });
  }
  var css=document.createElement("style");
  css.textContent=[
    "nav{background:rgba(10,6,18,.94)!important;border-color:rgba(255,122,217,.16)!important;box-shadow:0 -10px 28px rgba(0,0,0,.35)}",
    "nav .navR{gap:.28rem!important}",
    "nav button{background:transparent!important;color:#d7c6ee!important;font-weight:550!important;font-size:.58rem!important;letter-spacing:.02em;min-height:3.55rem!important;padding:.18rem .04rem .1rem!important;gap:.22rem!important;border-radius:1rem!important}",
    "nav button .ic{width:2.55rem;height:2.55rem;border-radius:1.05rem;display:grid;place-items:center;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08),0 6px 14px rgba(0,0,0,.22)}",
    "nav button .ic svg{width:22px!important;height:22px!important;stroke:currentColor;fill:none;stroke-width:1.85;stroke-linecap:round;stroke-linejoin:round}",
    "nav button[data-v=home] .ic{background:linear-gradient(160deg,#5a1848,#2a1238);color:#ff9ae4}",
    "nav button[data-v=geplant] .ic{background:linear-gradient(160deg,#5a221c,#2a1214);color:#ff9a8a}",
    "nav button[data-v=kal] .ic{background:linear-gradient(160deg,#2c2460,#16122e);color:#b8a8ff}",
    "nav button[data-v=log] .ic{background:linear-gradient(160deg,#163a3a,#0e1c22);color:#7ef0e6}",
    "nav button[data-v=notiz] .ic{background:linear-gradient(160deg,#3a2460,#1a1230);color:#d2b6ff}",
    "nav button[data-v=opfer] .ic{background:linear-gradient(160deg,#1c3a28,#101c16);color:#9eecc0}",
    "nav button[data-v=buch] .ic{background:linear-gradient(160deg,#16324a,#101820);color:#8fd4ff}",
    "nav button.on{background:rgba(255,255,255,.06)!important;color:#fff!important}",
    "nav button.on .ic{transform:translateY(-1px);box-shadow:0 0 16px currentColor,inset 0 0 0 1px rgba(255,255,255,.2)}",
    "nav button[data-v=home].on{background:rgba(255,122,217,.16)!important}",
    "nav button[data-v=geplant].on{background:rgba(255,139,122,.16)!important}",
    "nav button[data-v=kal].on{background:rgba(155,140,255,.16)!important}",
    "nav button[data-v=log].on{background:rgba(126,240,230,.14)!important}",
    "nav button[data-v=notiz].on{background:rgba(201,166,255,.16)!important}",
    "nav button[data-v=opfer].on{background:rgba(142,230,168,.14)!important}",
    "nav button[data-v=buch].on{background:rgba(126,200,255,.14)!important}",
    "nav button .lb{line-height:1.1}",
    "main{padding-bottom:9.1rem!important}"
  ].join("");
  document.head.appendChild(css);
  paint();
  setTimeout(paint,80);
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-final.js ==== */
try{
(function(){
  var css=document.createElement("style");
  css.textContent=[
    "html,body{background:#070510;overscroll-behavior:none}",
    ".app{background:radial-gradient(110% 70% at 50% -12%,rgba(255,122,217,.16),transparent 46%),radial-gradient(80% 40% at 100% 0,rgba(126,200,255,.08),transparent 40%),#070510}",
    "header{padding:calc(.28rem + env(safe-area-inset-top)) .75rem .28rem!important;background:rgba(7,5,16,.9)!important;border-bottom:1px solid rgba(255,122,217,.12)}",
    "#headRow{min-height:50px}",
    ".doll{width:50px;height:50px;border-radius:16px;border-color:rgba(255,122,217,.5);box-shadow:0 0 18px rgba(255,122,217,.2)}",
    ".brand{margin:.08rem 0 0;letter-spacing:.36em;font-size:.66rem;color:#ff8adf;text-shadow:0 0 16px rgba(255,122,217,.3)}",
    "#moonTxt,#sunTxt{font-size:.56rem;color:#b9a8d0}",
    "main{padding:0 .75rem 9.3rem!important}",
    "#home{padding-bottom:.1rem}",
    "#kasten{margin:0 0 .22rem!important;padding:.08rem 0 .12rem!important}",
    "#home .duo{gap:.38rem!important}",
    "#kOut,#sigilBox{border-radius:1.15rem!important;min-height:8.6rem!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.05),0 10px 24px rgba(0,0,0,.2)}",
    "#tools{gap:.32rem!important;margin-top:.36rem!important}",
    "#tools .tile{border-radius:1rem!important;background:rgba(14,8,24,.78)!important;min-height:2.95rem;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06)}",
    "#tools .tile:active{transform:scale(.97)}",
    "#sigRow{margin-top:.32rem!important;gap:.28rem!important}",
    "#sigRow input,#sigilT{min-height:2.2rem;border-radius:.9rem;background:#120a1e;border-color:rgba(255,122,217,.22)}",
    "#sigilSave{border-radius:.9rem;background:linear-gradient(165deg,#5a2a68,#24102c);color:#f4e8ff;border:1px solid rgba(255,122,217,.28);font-size:.72rem}",
    "#mondSag{margin:.08rem 0 .22rem!important;font-size:.88rem!important;color:#e6d6ff}",
    "#mondSag span{letter-spacing:.18em;font-size:.58rem!important}",
    "#pinDank{margin:.18rem 0 .22rem!important;padding:.68rem .8rem!important;border-radius:1.15rem;background:linear-gradient(180deg,rgba(72,28,88,.55),rgba(18,10,28,.88));border:1px solid rgba(255,122,217,.2)}",
    "#pinDank b{font-size:1.02rem}",
    "#cats{display:flex!important;flex-wrap:nowrap!important;gap:.22rem!important;margin:.18rem 0 .08rem!important;overflow:hidden}",
    "#cats .chip{flex:1 1 0;min-width:0;padding:.38rem .12rem!important;font-size:.64rem!important;min-height:1.95rem!important;white-space:nowrap;text-align:center}",
    ".chip{border-radius:999px;background:rgba(18,10,28,.75);border-color:rgba(255,255,255,.1)}",
    "#skizze{margin:.18rem auto 0!important;width:96%!important;max-width:26rem!important}",
    "#skizze svg{height:12.6rem!important}",
    ".card{border-radius:1.15rem;background:linear-gradient(180deg,rgba(48,20,68,.55),rgba(14,8,24,.88));border:1px solid rgba(255,122,217,.14)}",
    "#list .card{margin:.2rem 0}",
    ".hero h2{font-size:1.22rem;letter-spacing:.02em}",
    "#run .words{font-size:1.12rem;line-height:1.68}",
    ".btn.primary{box-shadow:0 6px 18px rgba(255,122,217,.2)}",
    ".btn.ghost{border:1px solid rgba(255,255,255,.08)}",
    ".kalcard{border-radius:1.05rem;overflow:hidden}",
    "#buchPdfWrap{box-shadow:0 10px 28px rgba(0,0,0,.28)}",
    "input,textarea,select{border-radius:.9rem}",
    "#home{overflow:hidden}"
  ].join("");
  document.head.appendChild(css);
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-gabe-fix.js ==== */
try{
(function(){
  window._picMemo=window._picMemo||{};
  var hold="";
  var bound=false;

  function read(){
    try{ return (typeof load==="function"?load():JSON.parse(localStorage.getItem("rr25_ritual_v1")||"{}"))||{}; }
    catch(e){ return {log:[],planned:[]}; }
  }
  function persist(d){
    d=d||{}; d.log=d.log||[]; d.planned=d.planned||[];
    d.log=d.log.map(function(e){
      if(!e) return e;
      if(e.img){
        window._picMemo[e.id]=e.img;
        if(typeof fotoPut==="function") try{ fotoPut(e.id,[e.img]); }catch(err){}
        var x={}; Object.keys(e).forEach(function(k){ if(k!=="img") x[k]=e[k]; });
        x.pics=1; return x;
      }
      return e;
    });
    try{
      localStorage.setItem("rr25_ritual_v1", JSON.stringify(d));
      if(typeof save==="function") try{ save(d); }catch(e){}
      return true;
    }catch(e){
      try{ localStorage.setItem("rr25_ritual_v1", JSON.stringify({log:d.log,planned:d.planned})); return true; }
      catch(e2){ return false; }
    }
  }
  function nid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,6); }
  function when(){ try{ return new Date().toLocaleString("de-CH"); }catch(e){ return ""; } }
  function isGabe(e){
    if(!e) return false;
    if(e.kind==="gabe") return true;
    var t=String(e.titel||"").toLowerCase();
    return t==="gabe"||t==="opfer"||t==="opfergabe";
  }
  window._isGabe=isGabe;
  function raw(f,go){
    var r=new FileReader();
    r.onload=function(){ go(String(r.result||"")); };
    r.readAsDataURL(f);
  }
  function say(t){ var m=document.getElementById("opferMsg"); if(m) m.textContent=t||""; }

  function pick(done){
    var inp=document.createElement("input");
    inp.type="file";
    inp.accept="image/*";
    inp.setAttribute("capture","environment");
    inp.style.cssText="position:fixed;left:0;bottom:0;width:1px;height:1px;opacity:0";
    document.body.appendChild(inp);
    inp.onchange=function(){
      var f=inp.files && inp.files[0];
      try{ inp.remove(); }catch(e){}
      if(!f) return;
      var go=function(data){
        if(!data) return;
        if(done) done(data);
        else {
          hold=data;
          var prev=document.getElementById("opferPrev");
          if(prev) prev.innerHTML='<img alt="" src="'+data+'">';
          say("Foto bereit.");
        }
      };
      if(typeof compressPic==="function"){
        Promise.resolve(compressPic(f)).then(function(d){ if(d) go(d); else raw(f,go); });
      } else raw(f,go);
    };
    inp.click();
  }

  function layout(){
    var box=document.getElementById("opfer");
    if(!box) return;
    if(!document.getElementById("opferTitel")){
      var card=box.querySelector(".card")||box;
      var inp=document.createElement("input");
      inp.id="opferTitel";
      inp.placeholder="Titel";
      inp.autocomplete="off";
      var ta=document.getElementById("opferT");
      if(ta && ta.parentNode) ta.parentNode.insertBefore(inp, ta);
      else card.insertBefore(inp, card.firstChild);
    }
    if(!document.getElementById("opferPrev")){
      var p=document.createElement("div"); p.id="opferPrev"; p.className="shots";
      var ta=document.getElementById("opferT");
      if(ta&&ta.parentNode) ta.parentNode.insertBefore(p, ta.nextSibling);
    }
    if(!document.getElementById("opferMsg")){
      var msg=document.createElement("p"); msg.className="msg"; msg.id="opferMsg"; box.appendChild(msg);
    }
    if(!document.getElementById("gabeList")){
      var list=document.createElement("div"); list.id="gabeList"; box.appendChild(list);
    }
    if(!document.getElementById("gabeOpen")){
      var op=document.createElement("div"); op.id="gabeOpen"; box.appendChild(op);
    }
    var go=document.getElementById("opferGo");
    if(go) go.textContent="Ablegen";
    paintList();
  }

  function wipe(){
    hold="";
    var t=document.getElementById("opferTitel"); if(t) t.value="";
    var a=document.getElementById("opferT"); if(a) a.value="";
    var prev=document.getElementById("opferPrev"); if(prev) prev.innerHTML="";
  }

  function paintList(){
    var holdEl=document.getElementById("gabeList");
    if(!holdEl) return;
    var rows=[];
    try{ rows=(read().log||[]).filter(isGabe); }catch(e){ rows=[]; }
    if(!rows.length){ holdEl.innerHTML="<p class='meta'>Noch keine Gabe.</p>"; return; }
    holdEl.innerHTML=rows.map(function(e){
      var note=String(e.note||"");
      if(note.toLowerCase()==="gabe"||note===String(e.titel||"")) note="";
      return '<div class="logrow" data-gid="'+e.id+'">'+ 
        '<div><b>'+String(e.titel||"Gabe").replace(/</g,"")+'</b>'+
        '<div class="meta">'+String(e.t||"")+'</div>'+
        (note?'<p style="margin:.35rem 0 0;white-space:pre-wrap">'+note.replace(/</g,"")+'</p>':'')+
        '<button type="button" class="logact" data-gopen="'+e.id+'">Öffnen</button></div>'+
        '<div class="logpic" data-gpic="'+e.id+'"></div></div>';
    }).join("");
    holdEl.querySelectorAll("[data-gopen]").forEach(function(b){
      b.onclick=function(ev){ ev.preventDefault(); ev.stopPropagation(); openOne(b.getAttribute("data-gopen")); };
    });
    rows.forEach(function(e){
      var cell=holdEl.querySelector('[data-gpic="'+e.id+'"]');
      if(!cell) return;
      function put(src){
        if(!src||cell.querySelector("img")) return;
        var img=document.createElement("img"); img.src=src; cell.appendChild(img);
      }
      if(e.img) put(e.img);
      if(window._picMemo[e.id]) put(window._picMemo[e.id]);
      if(typeof fotoGet==="function") fotoGet(e.id).then(function(a){ if(a&&a[0]) put(a[0]); });
    });
  }

  function showList(){
    var n=document.getElementById("gabeNew")||document.querySelector("#opfer .card");
    if(n) n.style.display="block";
    var l=document.getElementById("gabeList"); if(l) l.style.display="block";
    var o=document.getElementById("gabeOpen"); if(o){ o.style.display="none"; o.innerHTML=""; }
    paintList();
  }

  function openOne(id){
    var e=(read().log||[]).filter(function(x){ return String(x.id)===String(id); })[0];
    if(!e){ showList(); return; }
    var n=document.querySelector("#opfer .card"); if(n) n.style.display="none";
    var l=document.getElementById("gabeList"); if(l) l.style.display="none";
    var o=document.getElementById("gabeOpen"); if(!o) return;
    o.style.display="block";
    o.innerHTML='<div class="card"><p class="meta">'+String(e.t||"")+'</p>'+
      '<input id="gTitel" value="'+String(e.titel||"").replace(/"/g,"")+'">'+
      '<textarea id="gNote">'+String(e.note||"").replace(/</g,"")+'</textarea>'+
      '<div id="gShots" class="shots"></div>'+
      '<div class="row"><button type="button" class="btn ghost" id="gBack">Liste</button>'+
      '<button type="button" class="btn primary" id="gSave">Ablegen</button></div>'+
      '<div class="row"><button type="button" class="btn ghost" id="gDel">Löschen</button></div></div>'+
      '<div class="row"><button type="button" class="btn ghost" id="gFoto">Foto dazu</button></div>';
    function shots(){
      var sh=document.getElementById("gShots"); if(!sh) return; sh.innerHTML="";
      function add(src){ if(!src) return; var img=document.createElement("img"); img.src=src; sh.appendChild(img); }
      if(e.img) add(e.img);
      if(window._picMemo[id]) add(window._picMemo[id]);
      if(typeof fotoGet==="function") fotoGet(id).then(function(a){ (a||[]).forEach(add); });
    }
    shots();
    document.getElementById("gBack").onclick=showList;
    document.getElementById("gSave").onclick=function(){
      var d=read();
      var x=(d.log||[]).filter(function(z){ return String(z.id)===String(id); })[0];
      if(x){
        x.titel=((document.getElementById("gTitel")||{}).value||"Gabe").trim()||"Gabe";
        x.note=((document.getElementById("gNote")||{}).value||"").trim();
        x.kind="gabe"; persist(d);
      }
      showList();
    };
    document.getElementById("gDel").onclick=function(){
      if(!confirm("Diese Gabe löschen?")) return;
      var d=read(); d.log=(d.log||[]).filter(function(z){ return String(z.id)!==String(id); }); persist(d); showList();
    };
    document.getElementById("gFoto").onclick=function(){
      pick(function(data){
        window._picMemo[id]=data;
        if(typeof fotoPut==="function") try{ fotoPut(id,[data]); }catch(err){}
        var d=read();
        var x=(d.log||[]).filter(function(z){ return String(z.id)===String(id); })[0];
        if(x){ x.kind="gabe"; x.pics=1; persist(d); e=x; }
        shots();
      });
    };
  }

  function ablegen(){
    var titel=((document.getElementById("opferTitel")||{}).value||"").trim();
    var t=((document.getElementById("opferT")||{}).value||"").trim();
    if(!titel && !t && !hold){ say("Titel, Wort oder Foto."); return; }
    var d=read();
    d.log=d.log||[]; d.planned=d.planned||[];
    var id=nid();
    d.log.unshift({id:id,t:when(),titel:titel||"Gabe",wer:"",note:t,wesen:false,kind:"gabe",pics:hold?1:0});
    if(!persist(d)){ say("Speicher voll."); return; }
    if(hold){
      window._picMemo[id]=hold;
      if(typeof fotoPut==="function") try{ fotoPut(id,[hold]); }catch(e){}
    }
    wipe();
    say("Abgelegt.");
    showList();
    setTimeout(function(){ say(""); }, 2200);
  }

  if(!bound){
    bound=true;
    document.addEventListener("click", function(e){
      if(!e.target || !e.target.closest) return;
      if(e.target.closest("#opferFoto")){ e.preventDefault(); e.stopPropagation(); pick(); }
      if(e.target.closest("#opferGo")){ e.preventDefault(); e.stopPropagation(); ablegen(); }
    }, true);
  }

  if(typeof show==="function" && !show._gabefix2){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="opfer") layout();
      return r;
    };
    show._gabefix2=1;
  }
  layout();
})();

}catch(e){setTimeout(function(){throw e;});}
