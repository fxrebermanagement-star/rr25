/* ritual-zeit.js — eine gemeinsame Kalender-Regel für Kalender-Tab, Tor (Wetter) und «nächstes Fenster».
   Quelle: kalender.json = Export aus Google «Magie so sei es» mit Start und Ende (kalender-sync). Liest nur, speichert nichts.

   Ton zu einem Zeitpunkt t (gleiches Schema wie Google: Soft grün, Hard nur rote Feintakte, Echo violett, Still grau):
   1. offener Feintakt (Start ≤ t < Ende)            -> dessen Art (bei Überlappung HARD > ECHO > STILL > SOFT)
   2. ganztägiger Echo-/Still-Tageseintrag (Nachlauf)  -> ECHO bzw. STILL
   3. Band (mehrtägig), gilt von Start bis Ende        -> Art des Bandes
   4. Mondtag ohne Band: Vollmond -> ECHO, Neumond -> SOFT
   5. ganztägiger Soft-Tageseintrag (Segen, Feiertag)  -> SOFT
   6. keine Daten: Mondregel wie Google (Neumond Soft, Tag nach Vollmond bis vor Neumond Still, sonst Soft, Vollmond Echo)
   Nie aus künftigen Terminen. Hard gibt es nur, solange ein Feintakt offen ist.
   Nach dem Ende der Datei rechnet die App Bänder, Mondtage und Sonnen-Fenster selbst (ohne Hard, «gerechnet»),
   nie zusätzlich zu Datei-Terminen. Sonnenzeiten: NOAA-Formel mit Refraktion, Ort Zürich. */
(function(){
  if(window.RR25_KAL) return;
  var ORT="Zürich", LAT=47.3769, LON=8.5417, DAY=86400000, MIN=60000;
  var RANK={HARD:4,ECHO:3,STILL:2,SOFT:1};
  var DATA=null, FILE=[], COV=null, st="load", waiters=[];
  function two(n){ return String(n).padStart(2,"0"); }
  function ymd(ms){ var d=new Date(ms); return d.getFullYear()+"-"+two(d.getMonth()+1)+"-"+two(d.getDate()); }
  function day0(ms){ var d=new Date(ms); return new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime(); }
  function addDays(ms,n){ var d=new Date(ms); return new Date(d.getFullYear(),d.getMonth(),d.getDate()+n).getTime(); }
  function parseDay(s){ var p=String(s).slice(0,10).split("-"); return new Date(+p[0],+p[1]-1,+p[2]).getTime(); }
  function kindOf(t){ var k=String(t||"").split("·")[0].trim().toUpperCase(); return RANK[k]?k:"SOFT"; }
  function tstr(ms){ var d=new Date(ms); return two(d.getHours())+":"+two(d.getMinutes()); }

  function norm(e,src){
    var s0=String(e.start||""), all=!!e.all||s0.length<=10, s, en;
    if(all){ s=parseDay(s0); en=e.end?parseDay(e.end):addDays(s,1); }
    else { s=Date.parse(s0); en=e.end?Date.parse(e.end):s+(/22:30/.test(e.t)?55:50)*MIN; } /* alte Dateien ohne Ende */
    if(isNaN(s)) return null;
    if(!(en>s)) en=all?addDays(s,1):s+50*MIN;
    var t=String(e.t||"");
    return {t:t,k:kindOf(t),s:s,e:en,all:all,band:all&&Math.round((en-s)/DAY)>1,src:src||"kal",
      moon:/Vollmond/.test(t)?"voll":(/Neumond/.test(t)?"neu":""),anker:/Anker/.test(t),start:e.start,end:e.end};
  }

  /* ---------- Sonne (NOAA, Refraktion −0,833°), Ergebnis in ms ---------- */
  var rad=Math.PI/180;
  function solar(jd){
    var T=(jd-2451545)/36525;
    var L0=(280.46646+T*(36000.76983+T*0.0003032))%360;
    var M=357.52911+T*(35999.05029-0.0001537*T);
    var e=0.016708634-T*(0.000042037+0.0000001267*T);
    var C=Math.sin(M*rad)*(1.914602-T*(0.004817+0.000014*T))+Math.sin(2*M*rad)*(0.019993-0.000101*T)+Math.sin(3*M*rad)*0.000289;
    var om=125.04-1934.136*T, lam=L0+C-0.00569-0.00478*Math.sin(om*rad);
    var eps=23+(26+(21.448-T*(46.815+T*(0.00059-T*0.001813)))/60)/60+0.00256*Math.cos(om*rad);
    var decl=Math.asin(Math.sin(eps*rad)*Math.sin(lam*rad));
    var y=Math.pow(Math.tan(eps*rad/2),2);
    var eq=4/rad*(y*Math.sin(2*L0*rad)-2*e*Math.sin(M*rad)+4*e*y*Math.sin(M*rad)*Math.cos(2*L0*rad)-0.5*y*y*Math.sin(4*L0*rad)-1.25*e*e*Math.sin(2*M*rad));
    return {decl:decl,eq:eq};
  }
  function sun(ms){
    var d=new Date(ms), base=Date.UTC(d.getFullYear(),d.getMonth(),d.getDate());
    function jdOf(min){ return (base+min*MIN)/DAY+2440587.5; }
    function ev(kind){
      var min=720-4*LON;
      for(var i=0;i<3;i++){
        var s=solar(jdOf(min)), ha=0;
        if(kind){ var c=Math.cos(90.833*rad)/(Math.cos(LAT*rad)*Math.cos(s.decl))-Math.tan(LAT*rad)*Math.tan(s.decl); ha=Math.acos(Math.max(-1,Math.min(1,c)))/rad; }
        min=720-4*(LON+kind*ha)-s.eq;
      }
      return base+min*MIN;
    }
    return {rise:ev(1),noon:ev(0),set:ev(-1)};
  }
  function floorMin(ms){ return Math.floor(ms/MIN)*MIN; }

  /* ---------- Ersatzrechnung ohne Datei-Daten (wie Google aufgebaut, ohne Hard) ---------- */
  function mk(t,s,e,all){ return {t:t,k:kindOf(t),s:s,e:e,all:all,band:all&&Math.round((e-s)/DAY)>1,src:"calc",moon:/Vollmond/.test(t)?"voll":(/Neumond/.test(t)?"neu":""),anker:false}; }
  function calc(from,to){
    var M=window.RR25_MOND, out=[]; if(!M||!(to>from)) return out;
    var ph=M.events(from-40*DAY,to+40*DAY).filter(function(x){ return x.q===0||x.q===2; });
    for(var i=0;i<ph.length;i++){
      var a=ph[i], b=ph[i+1], da=day0(a.t);
      if(da>=from && da<to){
        var S=sun(da), voll=a.q===2, t2=tstr(a.t);
        out.push(mk(voll?"ECHO · Mond · Vollmond · "+t2:"SOFT · Segen · Mond · Neumond · "+t2, floorMin(a.t), floorMin(a.t)+60*MIN, false));
        [["Aufgang",S.rise],["Mittag",S.noon],["Untergang",S.set]].forEach(function(w,j){
          var s=floorMin(w[1]), echo=voll&&j===2;
          out.push(mk((echo?"ECHO · ":"SOFT · Segen · ")+tstr(s)+" "+w[0], s, s+50*MIN, false));
        });
        var n=new Date(da); n.setHours(22,30,0,0);
        out.push(mk(voll?"ECHO · 22:30 Nacht · dichter":"SOFT · Segen · 22:30 Nacht · innen", n.getTime(), n.getTime()+55*MIN, false));
      }
      if(b){
        var s=Math.max(addDays(da,1),from), e=Math.min(day0(b.t),to);
        if(e>s) out.push(mk(a.q===2?"STILL · Abnehmend · reinigen":"SOFT · Wetter · Segen", s, e, true));
      }
    }
    return out;
  }

  /* ---------- Daten ---------- */
  function setData(d){
    DATA=d||{events:[]};
    FILE=(DATA.events||[]).map(function(e){ return norm(e,"kal"); }).filter(Boolean);
    var f=Infinity, t=-Infinity;
    FILE.forEach(function(x){ f=Math.min(f,day0(x.s)); t=Math.max(t,x.all?x.e:addDays(day0(x.e-1),1)); });
    if(DATA.from) f=parseDay(DATA.from);
    if(DATA.to) t=addDays(parseDay(DATA.to),1);
    COV=isFinite(f)&&isFinite(t)?{from:f,to:t}:null;
    LCACHE={};
  }
  var LCACHE={};
  function list(ref){
    ref=ref==null?Date.now():ref;
    var r0=day0(ref), lo=addDays(r0,-40), hi=addDays(r0,80), key=lo+"/"+hi;
    if(LCACHE.key===key&&LCACHE.data===DATA) return LCACHE.list;
    var extra=COV?calc(Math.max(COV.to,lo),hi).concat(calc(lo,Math.min(COV.from,hi))):calc(lo,hi); /* nur ausserhalb der Datei */
    var L=FILE.concat(extra).sort(function(a,b){ return a.s-b.s||(b.all-a.all); });
    LCACHE={key:key,data:DATA,list:L};
    return L;
  }
  function load(){
    if(st==="ok"||st==="fail") return Promise.resolve(DATA);
    if(load.p) return load.p;
    load.p=fetch("kalender.json?v="+ymd(Date.now())+"-"+Math.floor(Date.now()/3600000),{cache:"no-store"})
      .then(function(r){ if(!r.ok) throw 0; return r.json(); })
      .then(function(d){ setData(d); st="ok"; })
      .catch(function(){ setData({events:[]}); st="fail"; })
      .then(function(){ var w=waiters; waiters=[]; w.forEach(function(f){ try{ f(); }catch(e){} }); return DATA; });
    return load.p;
  }
  function onReady(f){ if(st==="ok"||st==="fail") f(); else { waiters.push(f); load(); } }

  function moonKind(t){
    var M=window.RR25_MOND; if(!M) return "SOFT";
    var m=M.day(t);
    return m.key==="voll"?"ECHO":(m.key==="neu"?"SOFT":(m.key==="ab"?"STILL":"SOFT"));
  }
  /* Tagesart ohne Feintakte (für Monatsübersicht und als Hintergrund) */
  function dayParts(t,L){
    var d0=day0(t), d1=addDays(d0,1), r={bands:[],singles:[],marker:null,items:[]};
    L.forEach(function(x){
      if(x.all){ if(x.s<=d0&&x.e>d0){ (x.band?r.bands:r.singles).push(x); r.items.push(x); } }
      else if(x.s<d1&&x.e>d0){ r.items.push(x); if(x.moon&&x.s>=d0) r.marker=x; }
    });
    var single=r.singles.filter(function(x){ return x.k==="ECHO"||x.k==="STILL"; })[0]||null;
    var soft=r.singles.filter(function(x){ return x.k==="SOFT"; })[0]||null;
    var band=r.bands.sort(function(a,b){ return b.s-a.s; })[0]||null;
    var kind, src;
    if(single){ kind=single.k; src="tag"; }
    else if(band){ kind=band.k; src="band"; }
    else if(r.marker){ kind=r.marker.moon==="voll"?"ECHO":"SOFT"; src="mondtag"; }
    else if(soft){ kind="SOFT"; src="tag"; }
    else { kind=moonKind(d0+12*3600000); src="mond"; }
    r.kind=kind; r.src=src; r.band=band; r.single=single||soft; r.day=d0;
    return r;
  }
  function state(t){
    t=t==null?Date.now():t;
    var L=list(t), p=dayParts(t,L), open=null;
    L.forEach(function(x){ if(!x.all&&x.s<=t&&t<x.e&&(!open||RANK[x.k]>RANK[open.k])) open=x; });
    var timed=p.items.filter(function(x){ return !x.all; });
    return {t:t,kind:open?open.k:p.kind,src:open?"fenster":p.src,open:open,dayKind:p.kind,daySrc:p.src,band:p.band,single:p.single,marker:p.marker,
      items:p.items,hard:timed.filter(function(x){ return x.k==="HARD"; }),anker:timed.filter(function(x){ return x.anker; })[0]||null,
      covered:!!COV&&t>=COV.from&&t<COV.to,calc:!COV||t>=COV.to||t<COV.from};
  }
  function next(K,t){
    t=t==null?Date.now():t;
    var L=list(t), hit=null;
    for(var i=0;i<L.length;i++){
      var x=L[i];
      if(x.k!==K||x.s<=t) continue;
      if(x.all&&K!=="SOFT") continue;
      if(x.all&&dayParts(x.s,L).kind!=="SOFT") continue; /* Soft-Feiertag im Still-Band ist kein Soft-Tag */
      if(!hit||x.s<hit.s) hit=x;
    }
    if(!hit) return null;
    var d=day0(hit.s), more=[];
    if(!hit.all) L.forEach(function(y){ if(y!==hit&&!y.all&&y.k===K&&day0(y.s)===d&&y.s>hit.s) more.push(y); });
    return {x:hit,more:more};
  }
  function moonNext(t){
    var M=window.RR25_MOND; t=t==null?Date.now():t;
    return M?{neu:M.next(0,t),voll:M.next(2,t)}:{};
  }
  /* ---------- Planetenstunden (nur Info, ändert nie den Ton) ----------
     Chaldäische Reihenfolge Saturn, Jupiter, Mars, Sonne, Venus, Merkur, Mond. Tag = Sonnenaufgang bis -untergang in 12 gleiche
     Stunden, Nacht = Untergang bis nächster Aufgang in 12. Die erste Tagesstunde gehört dem Tagesherrscher (So Sonne … Sa Saturn).
     Vor Sonnenaufgang gilt noch die Nacht des Vortags. Zeiten aus sun() (NOAA, Zürich). */
  var CHAL=["Saturn","Jupiter","Mars","Sonne","Venus","Merkur","Mond"], RULER=[3,6,2,5,1,4,0];
  function planetDay(ms){
    var d0=day0(ms), S=sun(d0+12*3600000), N=sun(addDays(d0,1)+12*3600000), wd=new Date(d0).getDay(), out=[];
    var dl=(S.set-S.rise)/12, nl=(N.rise-S.set)/12;
    for(var i=0;i<24;i++){
      var s=i<12?S.rise+i*dl:S.set+(i-12)*nl, e=i<12?s+dl:s+nl;
      out.push({p:CHAL[(RULER[wd]+i)%7],s:s,e:e,nacht:i>=12,n:i+1});
    }
    return out;
  }
  function planetAt(t){
    t=t==null?Date.now():t;
    var L=planetDay(t); if(t<L[0].s) L=planetDay(addDays(day0(t),-1));
    for(var i=0;i<L.length;i++) if(L[i].s<=t&&t<L[i].e) return {cur:L[i],list:L,i:i};
    return {cur:null,list:L,i:-1};
  }
  function venusNext(t){
    t=t==null?Date.now():t;
    for(var k=-1;k<3;k++){ var L=planetDay(addDays(day0(t),k)); for(var i=0;i<L.length;i++) if(L[i].p==="Venus"&&L[i].e>t) return L[i]; }
    return null;
  }
  window.RR25_KAL={load:load,onReady:onReady,state:state,next:next,list:list,dayParts:function(t){ return dayParts(t,list(t)); },dayPartsIn:dayParts,
    planetDay:planetDay,planetAt:planetAt,venusNext:venusNext,
    sun:sun,moonNext:moonNext,coverage:function(){ return COV; },status:function(){ return st; },data:function(){ return DATA; },
    kindOf:kindOf,ORT:ORT,RANK:RANK};
  load();
})();
