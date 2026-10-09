/* rr25 · Paket 1/7 · Build 48 · erzeugt mit tools/bundle.py. Nicht von Hand bearbeiten:
   Quelldatei ändern und neu erzeugen. Inhalt in dieser Reihenfolge: doll.js, ritual-core.js, ritual-mondphase.js, ritual-zeit.js, rituals-v2.js */
/* ==== doll.js ==== */
try{
document.querySelectorAll("img.doll").forEach(function(el){el.src="rune.svg?v=6";});

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-core.js ==== */
const KEY="rr25_ritual_v1";
const NOTEKEY="rr25_notiz_v1";
/* Ritual-Daten kommen aus rituals-v2.js (füllt R beim Laden). */
const R=[];
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const now=()=>new Date().toLocaleString("de-CH");
const fill=(s,m)=>s.replaceAll("[Name]",m.Name||"[Name]").replaceAll("[A]",m.A||"[A]").replaceAll("[B]",m.B||"[B]");
const esc=s=>String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
function load(){try{return Object.assign({log:[],planned:[]},JSON.parse(localStorage.getItem(KEY)||"{}"))}catch(e){return{log:[],planned:[]}}}
function save(d){localStorage.setItem(KEY,JSON.stringify(d))}
function loadNotes(){try{const x=JSON.parse(localStorage.getItem(NOTEKEY)||"[]");return Array.isArray(x)?x:[]}catch(e){return[]}}
function saveNotes(a){localStorage.setItem(NOTEKEY,JSON.stringify(a))}
let cat="Alle",mem={},fromPlan=null;
function show(id){$$(".screen").forEach(s=>s.classList.toggle("on",s.id===id));$$("nav button").forEach(b=>b.classList.toggle("on",b.dataset.v===id||((id==="run"||id==="after"||id==="bye")&&b.dataset.v==="home")));if(id==="home")renderList();if(id==="geplant")paintPlan();if(id==="notiz")paintNotes();if(id==="log")paintLog();if(id==="buch")paintBuch();window.scrollTo(0,0)}
/* openR: alter Ablauf entfernt; ritual-runner-v2.js setzt openR=openV2 */
function openR(id,wer){}
function renderList(){const order=["Alltag","Schutz","Energie","Liebe","Trennung","Feld"];$("#cats").innerHTML=["Alle",...order].map(x=>`<button class="chip${x===cat?" on":""}" data-cat="${x}">${x}</button>`).join("");$$("#cats [data-cat]").forEach(b=>b.onclick=()=>{cat=b.dataset.cat;renderList()});const items=R.filter(r=>cat==="Alle"||r.tag===cat);const g={};items.forEach(r=>{(g[r.tag]=g[r.tag]||[]).push(r)});$("#list").innerHTML=Object.keys(g).sort((a,b)=>order.indexOf(a)-order.indexOf(b)).map(k=>`<p class="group">${k}</p>`+g[k].map(r=>`<button class="card" data-id="${r.id}"><b>${r.t}</b><small>${r.s}</small></button>`).join("")).join("");$$("#list .card").forEach(b=>b.onclick=()=>{fromPlan=null;openR(b.dataset.id)})}
function paintPlan(){const d=load(),sel=$("#plR");if(sel&&sel.options.length!==R.length){sel.innerHTML="";R.forEach(r=>{const o=document.createElement("option");o.value=r.id;o.textContent=r.t;sel.appendChild(o)})}$("#plList").innerHTML=d.planned.length?d.planned.map(x=>`<div class="entry"><b>${esc(x.titel)}</b><div class="meta">${esc(x.wer||"")}</div><button class="btn primary" data-go="${x.pid}">Setzen</button></div>`).join(""):"<p class='sub'>Nichts geplant.</p>";$$("#plList [data-go]").forEach(b=>b.onclick=()=>{const x=load().planned.find(p=>p.pid===b.dataset.go);if(x){fromPlan=x.pid;openR(x.id,x.wer)}})}
function paintNotes(){const notes=loadNotes();$("#notesOnly").innerHTML=notes.length?notes.map(n=>`<div class="entry"><div class="meta">${esc(n.t)}</div><p>${esc(n.note)}</p></div>`).join(""):"<p class='sub'>Keine Notiz.</p>"}
function paintLog(){const rows=load().log||[];$("#entries").innerHTML=rows.length?rows.map(e=>`<div class="entry"><b>${esc(e.titel)}</b><div class="meta">${esc(e.t)} ${esc(e.wer||"")}</div></div>`).join(""):"<p class='sub'>Noch leer.</p>"}
/* Buch: nur noch ein Knopf zur privaten Fassung in Google Drive (ritual-buch.js). Kein Buchtext in der App. */
function paintBuch(){}
document.addEventListener("click",e=>{const n=e.target.closest("nav button");if(n)show(n.dataset.v)});
$("#plAdd").onclick=()=>{const r=R.find(x=>x.id===$("#plR").value);if(!r)return;const d=load();d.planned.unshift({pid:uid(),id:r.id,titel:r.t,wer:($("#plW").value||"").trim(),t:now()});save(d);paintPlan()};
$("#noteAdd").onclick=()=>{const tx=($("#noteT").value||"").trim();if(!tx)return;const n=loadNotes();n.unshift({id:uid(),t:now(),note:tx});saveNotes(n);$("#noteT").value="";paintNotes()};
$("#quick").onclick=()=>{const d=load();d.log.unshift({id:uid(),t:now(),titel:"Feld zu"});save(d);show("after")};
$("#afterStay").onclick=()=>show("home");$("#afterGo").onclick=()=>show("bye");$("#stay").onclick=()=>show("home");
renderList();

;
/* ==== ritual-mondphase.js ==== */
try{
/* Mondphasen für die ganze App: echte Zeitpunkte nach Meeus (Astronomical Algorithms, Kap. 49).
   Eine Quelle für Kopfzeile, Tor, Kalender, Hinweise. Genauigkeit rund eine Minute. */
(function(){
  if(window.RR25_MOND) return;
  var DAY=86400000, SYN=29.530588861, rad=Math.PI/180;
  function phaseMs(k,q){ /* q: 0 neu, 1 erstes Viertel, 2 voll, 3 letztes Viertel */
    k=k+q/4;
    var T=k/1236.85;
    var jde=2451550.09766+SYN*k+0.00015437*T*T-0.00000015*T*T*T+0.00000000073*T*T*T*T;
    var E=1-0.002516*T-0.0000074*T*T;
    var M=(2.5534+29.1053567*k-0.0000014*T*T-0.00000011*T*T*T)*rad;
    var Mp=(201.5643+385.81693528*k+0.0107582*T*T+0.00001238*T*T*T-0.000000058*T*T*T*T)*rad;
    var F=(160.7108+390.67050284*k-0.0016118*T*T-0.00000227*T*T*T+0.000000011*T*T*T*T)*rad;
    var O=(124.7746-1.56375588*k+0.0020672*T*T+0.00000215*T*T*T)*rad;
    var s=Math.sin, cs=Math.cos, c;
    if(q===0||q===2){
      if(q===2) c=-0.40614*s(Mp)+0.17302*E*s(M)+0.01614*s(2*Mp)+0.01043*s(2*F)+0.00734*E*s(Mp-M)-0.00515*E*s(Mp+M)+0.00209*E*E*s(2*M);
      else c=-0.4072*s(Mp)+0.17241*E*s(M)+0.01608*s(2*Mp)+0.01039*s(2*F)+0.00739*E*s(Mp-M)-0.00514*E*s(Mp+M)+0.00208*E*E*s(2*M);
      c+=-0.00111*s(Mp-2*F)-0.00057*s(Mp+2*F)+0.00056*E*s(2*Mp+M)-0.00042*s(3*Mp)+0.00042*E*s(M+2*F)+0.00038*E*s(M-2*F)
        -0.00024*E*s(2*Mp-M)-0.00017*s(O)-0.00007*s(Mp+2*M)+0.00004*s(2*Mp-2*F)+0.00004*s(3*M)+0.00003*s(Mp+M-2*F)
        +0.00003*s(2*Mp+2*F)-0.00003*s(Mp+M+2*F)+0.00003*s(Mp-M+2*F)-0.00002*s(Mp-M-2*F)-0.00002*s(3*Mp+M)+0.00002*s(4*Mp);
    } else {
      c=-0.62801*s(Mp)+0.17172*E*s(M)-0.01183*E*s(Mp+M)+0.00862*s(2*Mp)+0.00804*s(2*F)+0.00454*E*s(Mp-M)+0.00204*E*E*s(2*M)
        -0.0018*s(Mp-2*F)-0.0007*s(Mp+2*F)-0.0004*s(3*Mp)-0.00034*E*s(2*Mp-M)+0.00032*E*s(M+2*F)+0.00032*E*s(M-2*F)
        -0.00028*E*E*s(Mp+2*M)+0.00027*E*s(2*Mp+M)-0.00017*s(O)-0.00005*s(Mp-M-2*F)+0.00004*s(2*Mp+2*F)-0.00004*s(Mp+M+2*F)
        +0.00004*s(Mp-2*M)+0.00003*s(Mp+M-2*F)+0.00003*s(3*M)+0.00002*s(2*Mp-2*F)+0.00002*s(Mp-M+2*F)-0.00002*s(3*Mp+M);
      var W=0.00306-0.00038*E*cs(M)+0.00026*cs(Mp)-0.00002*cs(Mp-M)+0.00002*cs(Mp+M)+0.00002*cs(2*F);
      c+=(q===1?W:-W);
    }
    return Math.round((jde+c-2440587.5)*DAY-69000);
  }
  var cache={};
  function ev(k,q){ var key=k+"/"+q; if(!(key in cache)) cache[key]=phaseMs(k,q); return cache[key]; }
  /* alle Phasen zwischen from und to, sortiert: {q,t} */
  function events(from,to){
    var k0=Math.floor((from-947182440000)/(SYN*DAY))-1, out=[];
    for(var k=k0;k<=k0+Math.ceil((to-from)/(SYN*DAY))+2;k++)
      for(var q=0;q<4;q++){ var t=ev(k,q); if(t>=from&&t<=to) out.push({q:q,t:t}); }
    return out.sort(function(a,b){ return a.t-b.t; });
  }
  /* Phase 0..1 (0 neu, .25 erstes Viertel, .5 voll, .75 letztes Viertel), zwischen echten Zeitpunkten */
  function phase(ms){
    if(ms==null) ms=Date.now();
    var e=events(ms-9*DAY,ms+9*DAY), a=null, b=null;
    for(var i=0;i<e.length;i++){ if(e[i].t<=ms) a=e[i]; else { b=e[i]; break; } }
    if(!a||!b) return 0;
    var p=(a.q+(ms-a.t)/(b.t-a.t))/4;
    return p>=1?p-1:p;
  }
  function dayStart(ms){ var d=new Date(ms); return new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime(); }
  function dayDiff(a,b){ return Math.round((dayStart(b)-dayStart(a))/DAY); }
  function next(q,ms){ var e=events(ms,ms+32*DAY); for(var i=0;i<e.length;i++) if(e[i].q===q) return e[i].t; return null; }
  function prev(q,ms){ var e=events(ms-32*DAY,ms); for(var i=e.length-1;i>=0;i--) if(e[i].q===q) return e[i].t; return null; }
  var SYM=["\u25cb","\ud83c\udf12","\ud83c\udf13","\ud83c\udf14","\ud83c\udf15","\ud83c\udf16","\ud83c\udf17","\ud83c\udf18"];
  /* Zustand eines Kalendertags: Neumond oder Vollmond gilt für den ganzen Tag, an dem er eintritt */
  function day(ms){
    if(ms==null) ms=Date.now();
    var s=dayStart(ms), e=events(s, s+DAY-1), hit={};
    e.forEach(function(x){ hit[x.q]=x.t; });
    var p=phase(ms), key, name;
    if(hit[2]!=null){ key="voll"; name="Vollmond"; }
    else if(hit[0]!=null){ key="neu"; name="Neumond"; }
    else if(p<0.5){ key="zu"; name="Zunehmend"; }
    else { key="ab"; name="Abnehmend"; }
    var si;
    if(key==="neu") si=0; else if(key==="voll") si=4;
    else if(hit[1]!=null) si=2; else if(hit[3]!=null) si=6;
    else if(key==="zu") si=p<0.25?1:3; else si=p<0.75?5:7;
    var nf=next(2,s+DAY), nn=next(0,s+DAY);
    return {key:key,name:name,p:p,waxing:p<0.5,sym:SYM[si],viertel:hit[1]!=null?1:(hit[3]!=null?3:0),at:hit[2]!=null?hit[2]:hit[0],
      fullIn:nf?dayDiff(s,nf):null,newIn:nn?dayDiff(s,nn):null,nextFull:nf,nextNew:nn,lastFull:prev(2,ms)};
  }
  window.RR25_MOND={events:events,phase:phase,day:day,next:next,prev:prev,phaseMs:phaseMs};
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-zeit.js ==== */
try{
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
   Nach dem Ende der Datei rechnet die App Bänder, Mondtage und Sonnen-Fenster selbst («gerechnet»), nie zusätzlich
   zu Datei-Terminen. Seit Build 35 nach denselben Regeln wie die Datei: Hard-Phase Vollmond (Vortag bis Folgetag),
   Hard-Tage Mars (Di) und Saturn (Sa) ausser in der Vollmond-Phase, mit vier Scharf-Fenstern (Aufgang, Mittag,
   Untergang abgerundet, je 50 Min.; 22:30–23:25 Anker) und Echo-Nachlauf am Folgetag; Sonntag 22:30 Segen innen.
   Rückläufe und Finsternisse rechnet die App nicht (nur aus der Datei). Sonnenzeiten: NOAA-Formel mit Refraktion, Ort Bern.
   Saisons (Einträge mit Feld "sz", z. B. Merkur rückläufig, Rauhnächte, Finsternis): nur Anzeige (Kalender, Chip).
   Sie stehen NICHT in list() und ändern Ton, Tor und Gate nie. */
(function(){
  if(window.RR25_KAL) return;
  var ORT="Bern", LAT=46.948, LON=7.447, DAY=86400000, MIN=60000;
  var RANK={HARD:4,ECHO:3,STILL:2,SOFT:1};
  var SZRANK={"Finsternis":5,"Rauhnächte":4,"Merkur rückläufig":3,"Venus rückläufig":3,"Mars rückläufig":3};
  var DATA=null, FILE=[], SEAS=[], COV=null, st="load", waiters=[];
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
      moon:/Vollmond/.test(t)?"voll":(/Neumond/.test(t)?"neu":""),anker:/Anker/.test(t),d:e.d?String(e.d):"",start:e.start,end:e.end};
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

  /* ---------- Ersatzrechnung ohne Datei-Daten (wie Google aufgebaut, Regeln wie die Datei) ---------- */
  function mk(t,s,e,all,d){ return {t:t,k:kindOf(t),s:s,e:e,all:all,band:all&&Math.round((e-s)/DAY)>1,src:"calc",moon:/Vollmond/.test(t)?"voll":(/Neumond/.test(t)?"neu":""),anker:/Anker/.test(t),d:d||""}; }
  function at(d0,h,m){ var n=new Date(d0); n.setHours(h,m,0,0); return n.getTime(); }
  var HD_D="Harter Planetentag. Nach Hard-Arbeit am Abend Rückkehr · Anker.";
  var PH_D="Hard-Phase rund um den Vollmond: Ladung am stärksten. Jeden Abend Rückkehr · Anker.";
  function calc(from,to){
    var M=window.RR25_MOND, out=[]; if(!M||!(to>from)) return out;
    var all=M.events(from-40*DAY,to+40*DAY), ph=all.filter(function(x){ return x.q===0||x.q===2; });
    var phase={}, moonDay={}, wax={}, quart={};
    all.forEach(function(x){ if(x.q===1) quart[day0(x.t)]=x.t; });
    for(var i=0;i<ph.length;i++){
      var a=ph[i], b=ph[i+1], da=day0(a.t);
      moonDay[da]=1;
      if(a.q===2){
        var p0=addDays(da,-1), p1=addDays(da,2);
        for(var q=p0;q<p1;q=addDays(q,1)) phase[q]=1;
        if(p1>from&&p0<to) out.push(mk("HARD · Phase · Vollmond", p0, p1, true, PH_D));
      }
      if(da>=from && da<to){
        var S=sun(da), voll=a.q===2, t2=tstr(a.t);
        out.push(mk(voll?"ECHO · Mond · Vollmond · "+t2:"SOFT · Segen · Mond · Neumond · "+t2, floorMin(a.t), floorMin(a.t)+60*MIN, false));
        [["Aufgang",S.rise],["Mittag",S.noon],["Untergang",S.set]].forEach(function(w,j){
          var s=floorMin(w[1]), echo=voll&&j===2;
          out.push(mk((echo?"ECHO · ":"SOFT · Segen · ")+tstr(s)+" "+w[0], s, s+50*MIN, false));
        });
        var n=at(da,22,30);
        out.push(mk(voll?"ECHO · 22:30 Nacht · dichter":"SOFT · Segen · 22:30 Nacht · innen", n, n+55*MIN, false));
      }
      if(b){
        var s=Math.max(addDays(da,1),from), e=Math.min(day0(b.t),to);
        if(e>s) out.push(mk(a.q===2?"STILL · Abnehmend · reinigen":"SOFT · Wetter · Segen", s, e, true));
        if(a.q===0) for(var w0=addDays(da,1);w0<day0(b.t);w0=addDays(w0,1)) wax[w0]=1;
      }
    }
    for(var d=day0(from); d<to; d=addDays(d,1)){
      var wd=new Date(d).getDay();
      if((wd===2||wd===6)&&!phase[d]){
        var S2=sun(d);
        out.push(mk("HARD · Tag · "+(wd===2?"Mars":"Saturn"), d, addDays(d,1), true, HD_D));
        if(!moonDay[d]){ /* am Mondtag gilt der Mondtag (wie in der Datei) */
          [["Aufgang",S2.rise],["Mittag",S2.noon],["Untergang",S2.set]].forEach(function(w){
            var s=floorMin(w[1]); out.push(mk("HARD · Scharf · "+tstr(s)+" "+w[0], s, s+50*MIN, false));
          });
          var a2=at(d,22,30); out.push(mk("HARD · Scharf · 22:30 Nacht · Anker", a2, a2+55*MIN, false));
          out.push(mk("ECHO · Nachlauf", addDays(d,1), addDays(d,2), true));
        }
      } else if(!phase[d]&&!moonDay[d]&&(quart[d]||(wd===0&&wax[d]))){
        if(quart[d]){ var qs=floorMin(quart[d]); out.push(mk("SOFT · Segen · "+tstr(qs)+" Viertel", qs, qs+50*MIN, false)); }
        var a3=at(d,22,30); out.push(mk("SOFT · Segen · 22:30 Nacht · innen", a3, a3+55*MIN, false));
      }
    }
    return out;
  }

  /* ---------- Daten ---------- */
  function setData(d){
    DATA=d||{events:[]};
    var ev=DATA.events||[];
    FILE=ev.filter(function(e){ return !e.sz; }).map(function(e){ return norm(e,"kal"); }).filter(Boolean);
    SEAS=ev.filter(function(e){ return e.sz; }).map(function(e){
      var x=norm(e,"saison"); if(!x) return null;
      var k=String(e.k||x.k).toUpperCase(); x.k=k; x.sz=String(e.sz); x.rank=SZRANK[x.sz]||(k==="SOFT"||x.sz==="Samhain"?2:1); return x;
    }).filter(Boolean);
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
    var bust=ymd(Date.now())+"-"+Math.floor(Date.now()/3600000);
    load.p=fetch("kalender.json?v="+bust,{cache:"no-store"})
      .then(function(r){ if(!r.ok) throw 0; return r.json(); })
      .then(function(d){
        if(!d||!d.more) return d;
        return fetch(String(d.more)+"?v="+bust,{cache:"no-store"}).then(function(r2){
          if(!r2.ok) return d;
          return r2.json().then(function(m){
            var extra=(m&&m.events)||[];
            d.events=(d.events||[]).concat(extra);
            return d;
          });
        });
      })
      .then(function(d){
        /* weitere Teile (Build 32: Mär–Dez 2027), Reihenfolge egal; fehlt ein Teil, bleibt der Rest */
        var parts=d&&Array.isArray(d.more2)?d.more2:[];
        if(!parts.length) return d;
        return Promise.all(parts.map(function(p){
          return fetch(String(p)+"?v="+bust,{cache:"no-store"}).then(function(r){ return r.ok?r.json():null; }).catch(function(){ return null; });
        })).then(function(ms){
          ms.forEach(function(m){ if(m&&m.events) d.events=(d.events||[]).concat(m.events); });
          return d;
        });
      })
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
    var band=r.bands.filter(function(x){ return x.k!=="HARD"; }).sort(function(a,b){ return b.s-a.s; })[0]||null;
    var kind, src;
    if(single){ kind=single.k; src="tag"; }
    else if(band){ kind=band.k; src="band"; }
    else if(r.marker){ kind=r.marker.moon==="voll"?"ECHO":"SOFT"; src="mondtag"; }
    else if(soft){ kind="SOFT"; src="tag"; }
    else { kind=moonKind(d0+12*3600000); src="mond"; }
    /* Hard-Tag/-Phase (ganztägig, z. B. Mars/Saturn, Vollmond-Phase): zeigt Hard über dem Ton des Tages.
       Der Grundton (base) bleibt für Tor/Wetter massgeblich: Hard-Arbeit weiter nur im offenen Feintakt, mit Gate und Rückkehr · Anker. */
    var hd=r.items.filter(function(x){ return x.all&&x.k==="HARD"; }).sort(function(a,b){ return (a.band-b.band)||(b.s-a.s); })[0]||null;
    r.base=kind; r.baseSrc=src; r.hardDay=hd;
    if(hd){ kind="HARD"; src=hd.band?"hardphase":"hardtag"; }
    r.kind=kind; r.src=src; r.band=band; r.single=single||soft; r.day=d0;
    return r;
  }
  function state(t){
    t=t==null?Date.now():t;
    var L=list(t), p=dayParts(t,L), open=null;
    L.forEach(function(x){ if(!x.all&&x.s<=t&&t<x.e&&(!open||RANK[x.k]>RANK[open.k])) open=x; });
    var timed=p.items.filter(function(x){ return !x.all; });
    return {t:t,kind:open?open.k:p.base,src:open?"fenster":p.baseSrc,open:open,dayKind:p.kind,daySrc:p.src,hardDay:p.hardDay,band:p.band,single:p.single,marker:p.marker,
      items:p.items,hard:timed.filter(function(x){ return x.k==="HARD"; }),anker:timed.filter(function(x){ return x.anker; })[0]||null,
      covered:!!COV&&t>=COV.from&&t<COV.to,calc:!COV||t>=COV.to||t<COV.from};
  }
  /* nächstes Fenster der Art K nach t: zeitgebundene Fenster; bei SOFT auch Soft-Bänder/-Tage, die später beginnen */
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
     Vor Sonnenaufgang gilt noch die Nacht des Vortags. Zeiten aus sun() (NOAA, Bern). */
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
  /* Saisons eines Tages (nur Anzeige), wichtigste zuerst: Finsternis > Rauhnächte > rückläufig > Jahreskreisfest */
  function seasons(t){
    var d0=day0(t==null?Date.now():t);
    return SEAS.filter(function(x){ return x.s<=d0&&x.e>d0; }).sort(function(a,b){ return (b.rank-a.rank)||(a.band-b.band)||(b.s-a.s); });
  }
  window.RR25_KAL={seasons:seasons,load:load,onReady:onReady,state:state,next:next,list:list,dayParts:function(t){ return dayParts(t,list(t)); },dayPartsIn:dayParts,
    planetDay:planetDay,planetAt:planetAt,venusNext:venusNext,
    sun:sun,moonNext:moonNext,coverage:function(){ return COV; },status:function(){ return st; },data:function(){ return DATA; },
    kindOf:kindOf,ORT:ORT,RANK:RANK,calc:calc};
  load();
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== rituals-v2.js ==== */
try{
/* rituals-v2.js — eine saubere Datenquelle für alle Rituale.
   Wird vom ritual-runner-v2.js gelesen. Kein Logik-Code hier, nur Texte.
   Reihenfolge im Ablauf folgt dem Buch: Timing -> (Hard: Diagnose -> Ethik-Gate)
   -> Rahmen -> Absicht -> (nur bei Identifikation: Ich bin [Name] und sofort zurück)
   -> 369 (3 stehen / 6 tragen / 9 siegeln) -> So sei es (Siegel) -> Rückkehr -> optional Es ist so -> Echo.
   Abbruch in jedem Schritt möglich (Runner). */
(function(){
  var CATS=['Schutz','Energie','Liebe','Trennung','Person X','Feld'];
  var L=[
  /* ---------- ALLTAG (auf der Startseite angeheftet) ---------- */
  {id:'dank',tone:'soft',t:'Tägliches Dankesritual',s:'Gesundheit und Glück · Liebe · Geld · Schutz',cat:'Alltag',hard:false,pin:true,skipTiming:true,flow:[
    ['Vorbereitung','Tu:|Vier Kerzen. Salz bereit. Glocke bereit. Wasser danach.||Sprich:|Die vier stehen:|Gesundheit und Glück. Liebe. Geld. Schutz.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin hier. Ich bin klar. Ich trage.'],
    ['Danke','Sprich je dreimal Danke:|Danke für Gesundheit und Glück.|Danke für Liebe.|Danke für Geld und Versorgung.|Danke für Schutz durch das Feld.||Tu:|Glocke dreimal.'],
    ['Ich bin','Sprich dreimal, noch ohne Enter:|Ich bin gesund und glücklich.|Ich bin geliebt.|Ich bin versorgt.|Ich bin geschützt.'],
    ['Salz','Tu:|Dreimal Salz auf jede Kerze.||Sprich:|Versiegelt.'],
    ['So sei es','Sprich dreimal:|Danke für alles.||Tu:|Glocke dreimal. Das ist So sei es.'],
    ['Rückkehr','Sprich:|Ich bin hier. Ich bin ganz bei mir.|Füsse. Atem. Raum.'],
    ['Schluss','Tu:|Wasser. Alltag.']
  ]},

  /* ---------- SCHUTZ ---------- */
  {id:'schutz',tone:'soft',t:'Schutz selbst',s:'Feld schliessen. Soft.',cat:'Schutz',hard:false,flow:[
    ['Vorbereitung','Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur Schutz. Nur ich.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.'],
    ['Absicht','Sprich:|Ich schütze mich jetzt vollständig.|Mein Feld ist geschlossen, klar und stabil.|Alles Fremde prallt ab oder geht in die Erde. Meine Energie gehört mir.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Mein Schutz ist stark.|Sechs: Alles Fremde prallt ab.|Neun: Ich bin klar und bei mir.'],
    ['So sei es','Tu:|Hand aufs Herz.||Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin ganz bei mir. Meine Energie gehört nur mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag. Nicht nachkontrollieren.']
  ]},
  {id:'schutz2',tone:'soft',t:'Schutz für eine andere Person',s:'Feld von Person X. Soft.',cat:'Schutz',hard:false,need:['Name'],flow:[
    ['Vorbereitung','Name oben. Foto nur als Anker, dann umdrehen. Sonst reicht der Name.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur Schutz für [Name]. Kein Mehr.|Ich bleibe ich. [Name] bleibt [Name].'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.|Ich richte mich auf [Name] aus, ohne mich zu verlieren.'],
    ['Feld','Tu:|Grenze um dich.||Sprich:|Ich schliesse mein Feld. Meine Energie gehört mir.|Wärme ja. Verschmelzen nein.'],
    ['Absicht','Sprich:|Das Feld von [Name] wird klar und geschützt.|Die Energie bleibt bei [Name]. Alles Ziehende prallt ab.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Das Feld von [Name] ist geschützt.|Sechs: Es bleibt klar und geschlossen.|Neun: [Name] ist in der Kraft.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin nicht [Name]. Ich kehre vollständig in mich zurück.|Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag. Nicht nachkontrollieren.']
  ]},
  {id:'stopp',tone:'soft',t:'Schaden stoppen',s:'Angriff endet. Feld zu. Soft.',cat:'Schutz',hard:false,need:['Name'],flow:[
    ['Vorbereitung','Name oben.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur Stopp. Nur Distanz. Nur [Name]. Kein Nachsetzen.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.|Ich bleibe ich. [Name] bleibt [Name].'],
    ['Feld','Tu:|Grenze um dich.||Sprich:|Ich schliesse mein Feld hart. Nichts Fremdes hat Zutritt.'],
    ['Absicht','Sprich:|Jeder Angriff von [Name] auf mich stoppt jetzt.|Die Bahn ist zu. Ohne Hass. Ohne mich zu verlieren.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Der Schaden stoppt.|Sechs: Der Zugriff fällt ab.|Neun: Ich bin frei und geschützt.'],
    ['So sei es','Tu:|Hand aufs Herz.||Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin nicht [Name]. Ich kehre vollständig zurück.|Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag. Nicht nachkontrollieren.']
  ]},
  {id:'weg',tone:'soft',t:'Schutz unterwegs',s:'Kurz. Soft.',cat:'Schutz',hard:false,skipTiming:true,flow:[
    ['Standort','Tu:|Füsse. Ein Atem.||Sprich:|Ich bin hier.'],
    ['Feld','Sprich:|Ich schliesse mein Feld. Ich bin geschützt unterwegs.'],
    ['369','Kurz:|Drei: Feld steht.|Sechs: Fremdes prallt ab.|Neun: Ich bin bei mir.'],
    ['So sei es','Sprich:|Versiegelt. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin bei mir. Meine Energie gehört mir. Weitergehen.']
  ]},
  {id:'kreis',tone:'soft',t:'Täglicher Schutzkreis',s:'Kurz, jeden Tag. Soft.',cat:'Schutz',hard:false,skipTiming:true,flow:[
    ['Standort','Tu:|Füsse. Ein Atem.||Sprich:|Ich bin hier.'],
    ['Kreis','Tu:|Einmal um dich zeigen.||Sprich:|Ich ziehe meinen Kreis. Nichts Fremdes hat Zutritt.|Meine Energie gehört mir.'],
    ['369','Kurz:|Drei: Der Kreis steht.|Sechs: Fremdes prallt ab.|Neun: Ich bin bei mir.'],
    ['So sei es','Sprich:|Versiegelt. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin bei mir. Ich gehe klar in den Tag.']
  ]},
  {id:'raum',tone:'soft',t:'Raum reinigen',s:'Ort klären. Soft.',cat:'Schutz',hard:false,flow:[
    ['Vorbereitung','Tu:|Fenster kurz auf. Eine Kerze oder Rauch. Salz und Wasser bereit.||Sprich:|Nur dieser Raum. Nur klar.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.'],
    ['Reinigen','Tu:|Durch den Raum gehen, Ecken zuerst.||Sprich:|Alles Schwere und Fremde löst sich und geht.|Dieser Raum wird klar, ruhig und rein.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Der Raum wird klar.|Sechs: Alles Fremde geht.|Neun: Der Raum ist rein und ruhig.'],
    ['So sei es','Tu:|Etwas Salz an die Schwelle.||Sprich:|Versiegelt. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin ganz bei mir. Der Raum gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Tu:|Wasser weg. Lüften. Alltag.']
  ]},

  /* ---------- ENERGIE ---------- */
  {id:'heil',tone:'soft',t:'Heilung',s:'Ergänzung zur Medizin. Soft.',cat:'Energie',hard:false,need:['Name'],flow:[
    ['Vorbereitung','Name oben.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Heilung für [Name]. Arzt bleibt parallel. Ich bleibe ich.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.'],
    ['Rahmen','Sprich:|Ich öffne nur für reine, stimmige Heilung.'],
    ['Absicht','Sprich:|Die Wunde von [Name] findet natürliche, vollständige Heilung.|Alles, was die Heilung behindert, löst sich. Zum höchsten Wohl.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Die Heilung sitzt.|Sechs: Alles Störende löst sich.|Neun: Die Heilung ist im Gange.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin nicht [Name]. Ich kehre vollständig zurück.|Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag. Nicht nachfragen.']
  ]},
  {id:'karma',tone:'soft',t:'Karma-Ausgleich',s:'Nicht Rache. Soft.',cat:'Energie',hard:false,need:['Name'],needOpt:true,flow:[
    ['Vorbereitung','Tu:|Eine Kerze. Wasser danach.||Sprich:|Ausgleich. Nicht Rache. Ohne Hass. Ich bleibe ich.'],
    ['Schutz','Tu:|Grenze um dich.||Sprich:|Ich schliesse zuerst mein eigenes Feld.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.'],
    ['Absicht','Sprich:|Was mir genommen oder aufgeladen wurde, kehrt in stimmiger Form zurück.|Der Ausgleich geschieht ohne Hass. Die Last darf gehen.|Ich schaue nicht auf den Fall des anderen.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Der Ausgleich geschieht.|Sechs: Die Energie kehrt rein zurück.|Neun: Es ist vollendet.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin ganz bei mir. Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag. Nicht nachkontrollieren.']
  ]},
  {id:'zur',tone:'soft',t:'Energie zurückholen',s:'Nach Kontakt. Nur holen. Soft.',cat:'Energie',hard:false,need:['Name'],needOpt:true,flow:[
    ['Vorbereitung','Name oben, wenn der Kontakt eine Person war.||Tu:|Eine Kerze am Platz. Wasser danach.||Sprich:|Nur zurück. Nichts rufen.|Was mein ist, kommt. Was nicht mein ist, geht.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach. Ich bin in mir.'],
    ['Feld','Tu:|Grenze um dich.||Sprich:|Ich schliesse mein Feld. Meine Energie gehört mir.'],
    ['Absicht','Sprich:|Alles, was von mir genommen wurde oder an mir hängt, kehrt jetzt rein und vollständig zu mir zurück.|Fremde Energie löst sich und geht. Ich hole nicht nach. Ich empfange.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Die Energie kehrt rein zurück.|Sechs: Fremdes löst sich und geht.|Neun: Ich bin vollständig bei mir.'],
    ['So sei es','Tu:|Hand aufs Herz.||Sprich:|Versiegelt. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin zurück in mir. Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Körper. Alltag.']
  ]},
  {id:'segen',tone:'soft',t:'Segen',s:'Ein Name. Ein Wofür. Soft.',cat:'Energie',hard:false,need:['Name','Wofür'],flow:[
    ['Vorbereitung','Name und Wofür oben.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Segen für [Name]. Nur [Wofür]. Ich bleibe ich.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.'],
    ['Absicht','Sprich:|Ich setze Segen für [Name]: [Wofür].|Nur zum Guten. Der freie Wille bleibt.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Der Segen sitzt.|Sechs: [Wofür] findet den Weg.|Neun: Es ist gesetzt.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin ganz bei mir. Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag.']
  ]},
  {id:'fuelle',tone:'soft',t:'Fülle und Geld',s:'Versorgung. Soft.',cat:'Energie',hard:false,flow:[
    ['Vorbereitung','Tu:|Eine Kerze. Etwas mit Wert vor dir. Wasser danach.||Sprich:|Nur Fülle. Ohne Hetze.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.'],
    ['Absicht','Sprich:|Ich bin versorgt. Die Fülle findet ihren Weg zu mir.|Geld kommt, bewegt sich und darf bleiben. Zum höchsten Wohl.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Ich bin versorgt.|Sechs: Der Weg öffnet sich.|Neun: Es ist im Gange.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin ganz bei mir. Ich klammere nicht.|Füsse. Atem. Raum.'],
    ['Schluss','Tu:|Wasser. Alltag. Nicht nachrechnen.']
  ]},
  {id:'schlaf',tone:'soft',t:'Schlaf und Traum',s:'Ruhe. Still.',cat:'Energie',hard:false,skipTiming:true,noStatus:true,flow:[
    ['Vorbereitung','Am Bett. Licht tief.||Tu:|Ein Atem. Handy lautlos, nur diese App offen.||Sprich:|Nichts Neues mehr. Nur Ruhe.'],
    ['Feld','Sprich:|Ich schliesse mein Feld. Nichts Fremdes hat Zutritt.|Der Raum ist ruhig und sicher.'],
    ['Absicht','Sprich:|Ich schlafe tief und ruhig.|Was mir dienen soll, darf im Traum klar werden.|Am Morgen erinnere ich, was wichtig ist.'],
    ['So sei es','Sprich leise:|So sei es.'],
    ['Rückkehr','Sprich:|Ich bin bei mir. Ich lasse los.|Atem. Schwer werden. Schlafen.']
  ]},

  /* ---------- LIEBE ---------- */
  {id:'anz',tone:'soft',t:'Anziehung',s:'Öffnen ohne Zwang. Soft.',cat:'Liebe',hard:false,need:['Name'],flow:[
    ['Vorbereitung','Name oben. Foto als Anker, dann umdrehen.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur Anziehung. Kein Halten. Kein Zwang. Ich bleibe ich.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.'],
    ['Absicht','Sprich:|[Name] fühlt sich zu mir hingezogen und spürt den Wunsch nach Kontakt.|Kontakt geschieht leicht und natürlich. Nur wenn es für beide stimmig ist.|Kein Festhalten. Kein Brechen des Willens.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Die Anziehung ist da.|Sechs: Der Kontakt findet den Weg.|Neun: Es ist im Gange.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin nicht [Name]. Ich kehre vollständig zurück.|Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag. Nicht täglich nachziehen.']
  ]},
  {id:'einladen',tone:'soft',t:'Liebe einladen',s:'Ohne Namen. Venus. Soft.',cat:'Liebe',hard:false,flow:[
    ['Vorbereitung','Wenn möglich Freitag, Venustag.||Tu:|Eine Kerze, rosa oder weiss. Wasser danach.||Sprich:|Ohne Namen. Ohne Zwang. Ich öffne mich.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.'],
    ['Absicht','Sprich:|Ich bin offen für Liebe, die mir guttut.|Die passende Liebe findet den Weg zu mir, frei und stimmig.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Ich bin offen.|Sechs: Liebe findet den Weg.|Neun: Es ist im Gange.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin ganz bei mir. Ich warte nicht, ich lebe.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag.']
  ]},
  {id:'liebe',tone:'hard',soft:'anz',t:'Bindung',s:'Hält den Faden. Hart.',cat:'Liebe',hard:true,haerte:true,need:['Name'],
    preis:'Zäher Faden — was du bindest, bindet dich mit.',gegen:'Beweglichkeit sinkt. Rückbindung möglich. Fehlende 9 kostet.',flow:[
    ['Vorbereitung','Name oben. Foto als Anker, dann umdrehen.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Das ist Bindung, nicht Anziehung. Ich kenne den Preis. Ich bleibe ich.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge. Grenze um dich.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.|Ich schliesse mein Feld hart.'],
    ['Rahmen','Sprich:|Ich öffne bewusst für Bindung. Ich kenne die Gegenseite.|Nur so weit, wie ich den Preis trage.'],
    ['Absicht','Sprich:|Zwischen mir und [Name] entsteht ein fester, spürbarer Faden.|Nähe hält. Aufmerksamkeit bleibt.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Der Faden hält.|Sechs: Die Bindung ist gesetzt.|Neun: Es ist gebunden.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin nicht [Name]. Ich kehre vollständig zurück.|Meine Energie gehört mir. Der Beobachter bleibt wach.|Alles Fremde löst sich und geht.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag. Nicht nachladen.']
  ]},
  {id:'liebe2',tone:'hard',soft:'anz',t:'Bindung zweier',s:'Faden zwischen A und B. Hart.',cat:'Liebe',hard:true,haerte:true,need:['A','B'],
    preis:'Zwei Willen — der Ausgleich sucht dich.',gegen:'Rückbindung möglich. Ohne 9 der Kreis aus Macht und Preis.',flow:[
    ['Vorbereitung','Beide Namen oben. Foto als Anker, dann umdrehen.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur der Faden zwischen [A] und [B]. Ich werde weder [A] noch [B].'],
    ['Standort','Tu:|Füsse. Drei Atemzüge. Grenze um dich.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.|Ich schliesse mein Feld hart.'],
    ['Rahmen','Sprich:|Ich greife bewusst in zwei Willen ein. Ich kenne den Preis und die Gegenseite.'],
    ['Absicht','Sprich:|Zwischen [A] und [B] entsteht ein fester Faden der Nähe.|Soweit Feld und Preis tragen.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Der Faden hält.|Sechs: Die Bindung ist gesetzt.|Neun: Es ist gebunden.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin nicht [A]. Ich bin nicht [B].|Ich kehre vollständig zurück. Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag. Nicht nachladen.']
  ]},

  /* ---------- TRENNUNG ---------- */
  {id:'trenn',tone:'grenze',t:'Trennung selbst',s:'Nur dein Faden. Grenze.',cat:'Trennung',hard:false,grenze:true,need:['Name'],flow:[
    ['Vorbereitung','Name oben. Foto als Anker, dann umdrehen.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur der Faden zu [Name]. Kein Urteil. Kein Nachsetzen. Ich bleibe ich.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.'],
    ['Absicht','Sprich:|Die Verbindung zwischen mir und [Name] löst sich jetzt.|Alle unstimmigen Fäden werden getrennt. Ich lasse frei und werde frei.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Die Verbindung löst sich.|Sechs: Die Fäden fallen ab.|Neun: Die Trennung ist im Gange.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin nicht [Name]. Ich kehre vollständig in mich zurück.|Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag.']
  ]},
  {id:'band',tone:'grenze',t:'Band lösen',s:'Sanft. Nur der Faden. Grenze.',cat:'Trennung',hard:false,grenze:true,need:['Name'],needOpt:true,flow:[
    ['Vorbereitung','Name oben, wenn es um eine Person geht.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur das Band. Kein Urteil. Kein Nachsetzen.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.'],
    ['Absicht','Sprich:|Das Band, das nicht mehr stimmt, darf sich lösen.|Das Band zwischen mir und [Name] löst sich.|Alle unstimmigen Fäden fallen ab. Ich lasse frei und werde frei.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Das Band löst sich.|Sechs: Die Fäden fallen ab.|Neun: Es ist im Gange.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin nicht [Name].|Ich bin ganz bei mir. Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag.']
  ]},
  {id:'trenn2',tone:'hard',soft:'trenn',haerte:true,t:'Trennung anderer',s:'Faden zwischen A und B. Hart.',cat:'Trennung',hard:true,need:['A','B'],
    preis:'Fremde Fäden schneiden — der Ausgleich sucht dich.',gegen:'Nur wenn klar und nötig. Sonst soft.',flow:[
    ['Vorbereitung','Beide Namen oben. Foto als Anker, dann umdrehen.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur der Faden zwischen [A] und [B]. Lösung, nicht Zerstörung.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge. Grenze um dich.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.|Ich schliesse mein Feld hart.'],
    ['Absicht','Sprich:|Die unstimmige Verbindung zwischen [A] und [B] löst sich.|Die Fäden fallen ab. Jeder gehört wieder sich selbst. Ohne unnötigen Schaden.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Die Verbindung löst sich.|Sechs: Die Fäden fallen ab.|Neun: Sie sind voneinander frei.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin nicht [A]. Ich bin nicht [B].|Ich kehre vollständig zurück. Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag.']
  ]},

  /* ---------- PERSON X ---------- */
  {id:'fluch',tone:'hard',soft:'karma',t:'Fluch',s:'Schadensbahn. Hart.',cat:'Person X',hard:true,haerte:true,ichHart:true,need:['Name'],
    preis:'Schaden kehrt zum Sender. Wer schaden will, zahlt fast immer.',gegen:'Rücklauf. Verlust der 9. Kreis aus Macht und Preis.',flow:[
    ['Vorbereitung','Name oben.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Soft-Karma zuerst, wenn es reicht. Sonst hier. Ich halte keinen Hass.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge. Grenze um dich.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.|Ich schliesse mein Feld hart.'],
    ['Absicht','Sprich:|Was [Name] gesät hat, kehrt in klarer Form.|Die Bahn ist gesetzt. Ich setze und lasse los.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Die Bahn ist gesetzt.|Sechs: Der Ausgleich läuft.|Neun: Übergeben.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin nicht [Name]. Ich kehre vollständig zurück.|Meine Energie gehört mir. Ich bleibe im Spiel. Ich bleibe ich.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag. Nicht nachladen.']
  ]},
  {id:'ueber',tone:'hard',soft:'segen',haerte:true,t:'Person übernehmen',s:'Hinein. Sofort raus. Hart.',cat:'Person X',hard:true,ich:true,need:['Name','Auftrag'],
    preis:'Hängen ohne Rückkehr.',gegen:'Qualitätswechsel, fremder Blick. Ohne Sofort-Rückkehr zahlst du.',flow:[
    ['Vorbereitung','Name und Auftrag oben.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur [Auftrag]. Ich bin noch ich.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge. Grenze um dich.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.|Ich schliesse mein Feld hart. Noch nicht [Name].'],
    ['Absicht','Sprich:|Ich setze: [Auftrag].|Ein Satz. Nur so weit, wie es stimmig ist.'],
    ['Versetzen','Tu:|Foto unten. Name laut.||Sprich:|Ich bin [Name]. Nur für [Auftrag].|Von innen setze ich die Absicht.'],
    ['Zurück aus [Name]','Sprich sofort:|Ich bin nicht mehr [Name].|Ich bin wieder ich. Der Beobachter hält.|Die Aufgabe läuft, ohne dass ich bleibe.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Saat gesetzt.|Sechs: Bewegung hält.|Neun: Ich bin zurück und klar.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Doppelt prüfen.||Sprich:|Ich bin nicht [Name]. Ich kehre vollständig zurück.|Meine Energie gehört nur mir. Alles Fremde geht.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag.']
  ]},

  /* ---------- FELD ---------- */
  {id:'wesen',tone:'hard',t:'Wesenheit für Auftrag',s:'Nur wenn der Faden nicht reicht. Hartes Ende.',cat:'Feld',hard:true,wesenSelf:true,need:['Name','Auftrag'],
    preis:'Ein Mitspieler mehr im Feld — du bleibst verantwortlich.',gegen:'Täuschung möglich. Filter und klares Ende sind Pflicht.',flow:[
    ['Vorbereitung','Name und Auftrag oben. Ein Satz.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur [Auftrag]. Für [Name] nur, wenn gesetzt. Ich bleibe ich.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge. Grenze um dich.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.|Ich schliesse mein Feld hart.'],
    ['Wesenheit · Filter','Sprich:|Ich behalte den Raum.|Nur klare, stimmige Präsenz. Was drängt, bleibt draussen.|Kein Verschmelzen. Kein Nachlaufen.'],
    ['Wesenheit · Rufen','Sprich:|Wer bereit und geeignet ist, [Auftrag] zu tragen, möge sich zeigen.'],
    ['Wesenheit · Auftrag','Sprich:|Dein Auftrag ist: [Auftrag]. Nur in diesem Rahmen.|Ohne unnötigen Schaden. Der Auftrag endet, wenn er erfüllt ist.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Gegeben.|Sechs: Getragen.|Neun: Gesetzt.'],
    ['So sei es','Sprich:|Versiegelt. So sei es.'],
    ['Wesenheit · Entlassen','Sprich:|Der Auftrag ist beendet, wenn er erfüllt ist. Ich danke dir.|Du bist frei. Löse alle Verbindungen. Ich schliesse den Kontakt.'],
    ['Rückkehr','Sprich:|Ich bin nicht die Wesenheit. Ich bin ganz bei mir.|Meine Energie gehört nur mir. Alles Fremde löst sich und geht.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag.']
  ]},
  {id:'ahn',tone:'feld',t:'Ahnen rufen',s:'Ehren, begrenzen, entlassen. Feld.',cat:'Feld',hard:false,need:['Name'],flow:[
    ['Vorbereitung','Name oben.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Nur [Name]. Ich bleibe ich.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.'],
    ['Einladung','Sprich:|[Name], wenn du bereit und willens bist, zeige dich.|Ich möchte verstehen, nicht übernehmen.'],
    ['Grenze','Sprich:|Ich ehre dich und die Linie.|Ich gehöre mir selbst. Ungesunde Muster lasse ich nicht in mein Leben.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Kontakt klar.|Sechs: Die Linie trägt.|Neun: Ich gehöre mir.'],
    ['So sei es','Sprich:|Versiegelt. So sei es.'],
    ['Entlassen','Sprich:|Danke. Du kannst in Frieden gehen.|Ich schliesse den Kontakt. Meine Energie gehört mir.'],
    ['Rückkehr','Sprich:|Ich bin nicht [Name]. Ich bin ganz bei mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Danke Feld.||Tu:|Wasser. Alltag.']
  ]},
  {id:'neumond',tone:'feld',t:'Neumond · Aussaat',s:'Neu setzen. Soft.',cat:'Feld',hard:false,flow:[
    ['Vorbereitung','Neumond oder zunehmender Mond.||Tu:|Eine Kerze. Papier und Stift.||Sprich:|Neu setzen. Still wachsen lassen.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Der Beobachter ist wach.'],
    ['Absicht','Tu:|Einen Satz aufschreiben.||Sprich:|Das setze ich als Saat: dein Satz.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Die Saat ist gelegt.|Sechs: Sie darf wachsen.|Neun: Es ist im Gange.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin ganz bei mir. Ich wässere nicht aus Angst.|Füsse. Atem. Raum.'],
    ['Schluss','Tu:|Zettel weglegen. Wasser. Alltag.']
  ]},
  {id:'vollmond',tone:'feld',t:'Vollmond · Ernte und Dank',s:'Ernten. Nicht nachsetzen. Soft.',cat:'Feld',hard:false,flow:[
    ['Vorbereitung','Vollmond oder kurz danach.||Tu:|Eine Kerze. Wasser danach.||Sprich:|Ernte und Dank. Nicht nachsetzen.'],
    ['Standort','Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin hier. Ich bin klar.'],
    ['Dank und Ernte','Sprich:|Danke für das, was reif geworden ist.|Was fällt, darf fallen. Ich halte nichts fest.'],
    ['369','Tu:|Jede Zeile laut. Antippen zählt.||Drei: Ich sehe die Ernte.|Sechs: Ich danke.|Neun: Ich lasse los.'],
    ['So sei es','Sprich:|Versiegelt. Übergeben. So sei es.'],
    ['Rückkehr','Sprich:|Ich bin ganz bei mir. Ich setze heute nichts nach.|Füsse. Atem. Raum.'],
    ['Schluss','Tu:|Wasser. Alltag.']
  ]},
  {id:'dankfeld',tone:'soft',t:'Dank ans Feld',s:'Nur danken. Keine Bitte, keine neue Ladung. Etwa 9 Minuten.',cat:'Feld',hard:false,skipTiming:true,noStatus:true,flow:[
    ['Ankommen','Tu:|Eine Kerze an. Drei ruhige Atemzüge.'],
    ['Erinnern','Tu:|Drei Dinge, die zuletzt gewirkt haben: eins für die 3, eins für die 6, eins für die 9.||Sprich:|Leise aussprechen.'],
    ['Danken','Tu:|Hände aufs Herz, dann öffnen.||Sprich:|Feld, ich danke dir. Ich habe es gesehen.'],
    ['Gabe','Tu:|Etwas Kleines geben: ein Schluck Wasser, eine Prise Salz oder Stille.'],
    ['Schliessen','Sprich:|So sei es.||Tu:|Kerze aus. Ein Satz in die Chronik.']
  ]},
  {id:'anker',tone:'feld',t:'Rückkehr · Anker',s:'Nach der Arbeit schliessen. Etwa 3 Minuten.',cat:'Schutz',hard:false,skipTiming:true,noStatus:true,anker:true,flow:[
    ['Körper','Tu:|Füsse auf den Boden. Hände spüren. Das Gewicht sinkt nach unten.||Sprich:|Ich bin in meinem Körper.'],
    ['Raum','Tu:|Bewusst umschauen. Ein, zwei Dinge laut benennen.||Sprich:|Ich bin hier, nicht mehr im Ritual.'],
    ['Atem','Tu:|Einige ruhige Atemzüge. Länger aus als ein.||Sprich:|Ich bin ruhig. Ich bin bei mir.'],
    ['Feld zu','Tu:|Abschlussgeste: Hände zusammen, dann lösen.||Sprich:|Das Feld ist zu. Es ist so.||Heute nicht weiterarbeiten.']
  ]},
  {id:'echo',tone:'feld',t:'Echo lesen',s:'Nur beobachten. Ein Satz. Kein neues Portal.',cat:'Feld',hard:false,skipTiming:true,noStatus:true,echoRead:true,flow:[
    ['Beobachten','Tu:|Still werden. Keine Kerze aus Pflicht.||Sprich:|Nur lesen. Nicht nachladen. Kein neues Portal.'],
    ['Ein Satz','Tu:|Was sich gezeigt hat, in einem Satz notieren.|Anruf, Gefühl, Zufall — nur Rohdaten.||Sprich:|Ich schaue. Ich deute nicht.'],
    ['Schluss','Sprich:|Danke Feld. Buch zu.||Tu:|Wasser. Alltag. Heute nichts nachsetzen.']
  ]},
  {id:'abbr',tone:'neutral',t:'Abbruch',s:'Laufenden Zug beenden. Heimkehren.',cat:'Feld',hard:false,neutral:true,skipTiming:true,noStatus:true,flow:[
    ['Lage','Sprich:|Ein Zug läuft noch. Ich breche ab. Kein neuer Auftrag.'],
    ['Feld','Sprich:|Ich schliesse mein Feld. Alles Offene geht zu.'],
    ['Abbruch','Sprich:|Der laufende Zug endet hier.|Alle Fäden, die ich gesetzt habe und die nicht halten sollen, fallen.|Ich rufe nichts nach. Die Arbeit ist nicht gesetzt.'],
    ['Rückkehr','Sprich:|Ich bin nicht die andere Person. Ich bin nicht die Wesenheit.|Ich kehre vollständig zurück. Meine Energie gehört mir.|Füsse. Atem. Raum.'],
    ['Schluss','Sprich:|Es ist so.||Tu:|Wasser. Alltag.']
  ]}
  ];
  L.forEach(function(r){ r.flow=r.flow.map(function(st){ return [st[0], st[1].split('|').join('\n')]; }); });
  if(typeof R!=='undefined' && Array.isArray(R)){ R.length=0; for(var i=0;i<L.length;i++) R.push(L[i]); }
  window.RR_RITUALS=L;
  window.RR_CATS=CATS;
})();

}catch(e){setTimeout(function(){throw e;});}
