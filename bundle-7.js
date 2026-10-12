/* rr25 · Paket 7/7 · Build 51 · erzeugt mit tools/bundle.py. Nicht von Hand bearbeiten:
   Quelldatei ändern und neu erzeugen. Inhalt in dieser Reihenfolge: ritual-sichern.js, ritual-gerechnet.js, ritual-rueckblick.js, ritual-erinnern.js, ritual-mondhinweis.js, ritual-zaehler.js, ritual-danksatz.js, ritual-sterne.js, ritual-mondbild.js, ritual-tippen.js */
/* ==== ritual-sichern.js ==== */
try{
/* ritual-sichern.js — «Sichern» und «Wiederherstellen» in «Mehr».
   Sichern: alle App-Daten (alle localStorage-Schlüssel mit rr25…, dazu Fotos aus dem Gerätespeicher) als JSON-Datei,
   Dateiname mit Build und Datum. Wiederherstellen: Datei wählen, Vorschau mit Zahlen, dann «Zusammenführen» oder
   «Ersetzen». Nie wird still gelöscht: Ersetzen überschreibt nur Schlüssel aus der Datei, vorher wird der jetzige
   Stand als rr25_vorher_wiederherstellen abgelegt. */
(function(){
  if(window.__rr25sichern) return; window.__rr25sichern=1;
  var WHEN="rr25_bak_at", PRE="rr25_vorher_wiederherstellen";
  var SKIP=[PRE,"rr25_pack_bak"];
  function build(){ var m=document.querySelector('meta[name="rr25-build"]'); return m?m.content:"?"; }
  function get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function set(k,v){ try{ localStorage.setItem(k,v); return true; }catch(e){ return false; } }
  function keys(){ var a=[],i,k; for(i=0;i<localStorage.length;i++){ k=localStorage.key(i); if(k&&k.indexOf("rr25")===0&&SKIP.indexOf(k)<0) a.push(k); } return a.sort(); }
  function pad(n){ return String(n).padStart(2,"0"); }
  function stamp(d){ return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate()); }
  function fotosAll(){
    if(typeof idb!=="function") return Promise.resolve([]);
    return idb().then(function(db){ return new Promise(function(ok){
      var out=[], st=db.transaction("pics").objectStore("pics"), q=st.openCursor();
      q.onsuccess=function(){ var c=q.result; if(c){ if(Array.isArray(c.value)) out.push([c.key,c.value]); c.continue(); } else ok(out); };
      q.onerror=function(){ ok(out); };
    }); }).catch(function(){ return []; });
  }
  function fotoHas(id){ return (typeof fotoGet==="function")?fotoGet(id).then(function(a){ return a&&a.length>0; }):Promise.resolve(false); }
  function pack(){
    var data={}; keys().forEach(function(k){ var v=get(k); if(v!=null) data[k]=v; });
    return fotosAll().then(function(f){ return {app:"rr25",format:5,build:build(),t:new Date().toISOString(),keys:data,fotos:f}; });
  }
  /* alte Sicherungen (flach, v4) wie neue lesen */
  function norm(p){
    if(!p||typeof p!=="object") return null;
    if(p.keys&&typeof p.keys==="object") return {keys:p.keys,fotos:Array.isArray(p.fotos)?p.fotos:[],build:p.build||"?",t:p.t||""};
    var k={}; Object.keys(p).forEach(function(n){ if(n.indexOf("rr25")===0&&n!=="rr25"&&p[n]!=null) k[n]=typeof p[n]==="string"?p[n]:JSON.stringify(p[n]); });
    if(p.rr25&&!k.rr25_ritual_v1) k.rr25_ritual_v1=typeof p.rr25==="string"?p.rr25:JSON.stringify(p.rr25);
    return {keys:k,fotos:Array.isArray(p.fotos)?p.fotos:[],build:"alt",t:p.t||""};
  }
  function js(s,d){ try{ return JSON.parse(s); }catch(e){ return d; } }
  function count(keysObj,fotos){
    var r=js(keysObj.rr25_ritual_v1,{})||{}, n=js(keysObj.rr25_notiz_v1,[]), s=js(keysObj.rr25_sigil,{});
    var sig=Array.isArray(s)?s.length:(s&&typeof s==="object"?(Array.isArray(s.list)?s.list.length:Object.keys(s).length):0);
    return {chronik:(r.log||[]).length,geplant:(r.planned||[]).length,notizen:Array.isArray(n)?n.length:0,sigillen:sig,schluessel:Object.keys(keysObj).length,fotos:(fotos||[]).length};
  }
  function line(c){ return "Chronik "+c.chronik+" · Geplant "+c.geplant+" · Notizen "+c.notizen+" · Sigillen "+c.sigillen+" · Fotos "+c.fotos+" · Schlüssel "+c.schluessel; }
  function uniq(a,b){
    var seen={}, out=[];
    a.concat(b).forEach(function(x){ var id=(x&&typeof x==="object"&&x.id!=null)?"i:"+x.id:"j:"+JSON.stringify(x); if(!seen[id]){ seen[id]=1; out.push(x); } });
    return out;
  }
  function mergeVal(local,file){
    if(local==null) return file;
    var L=js(local,undefined), F=js(file,undefined);
    if(Array.isArray(L)&&Array.isArray(F)) return JSON.stringify(uniq(L,F));
    if(L&&F&&typeof L==="object"&&typeof F==="object"&&!Array.isArray(L)&&!Array.isArray(F)){
      var o=Object.assign({},F,L);
      Object.keys(F).forEach(function(k){ if(Array.isArray(L[k])&&Array.isArray(F[k])) o[k]=uniq(L[k],F[k]); });
      if(Array.isArray(o.log)) o.log.sort(function(x,y){ return String(y.t||"")<String(x.t||"")?-1:String(y.t||"")>String(x.t||"")?1:0; });
      return JSON.stringify(o);
    }
    return local; /* einfache Werte: das Gerät behält seinen Wert */
  }
  function restore(n,mode){
    var cur={}; keys().forEach(function(k){ cur[k]=get(k); });
    set(PRE, JSON.stringify({t:new Date().toISOString(),keys:cur}));
    var done=0;
    Object.keys(n.keys).forEach(function(k){
      if(k.indexOf("rr25")!==0||SKIP.indexOf(k)>=0) return;
      var v=mode==="ersetzen"?n.keys[k]:mergeVal(get(k),n.keys[k]);
      if(v!=null&&set(k,v)) done++;
    });
    var list=n.fotos.filter(function(x){ return Array.isArray(x)&&x.length===2&&Array.isArray(x[1]); });
    var p=list.reduce(function(pr,x){ return pr.then(function(){
      if(typeof fotoPut!=="function") return;
      return (mode==="ersetzen"?Promise.resolve(false):fotoHas(x[0])).then(function(has){ if(!has) return fotoPut(x[0],x[1]); });
    }); }, Promise.resolve());
    return p.then(function(){ return done; });
  }
  function fileName(){ return "RR25-Sicherung-Build"+build()+"-"+stamp(new Date())+".json"; }
  function out(){
    var b=document.getElementById("sxOut"); if(b) b.disabled=true;
    pack().then(function(p){
      var raw=JSON.stringify(p), name=fileName();
      var blob=new Blob([raw],{type:"application/json"}), a=document.createElement("a");
      a.href=URL.createObjectURL(blob); a.download=name; a.rel="noopener"; document.body.appendChild(a); a.click();
      setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); },1500);
      set(WHEN,String(Date.now()));
      say("Gesichert: "+name+" · "+line(count(p.keys,p.fotos)));
      hint();
    }).catch(function(){ say("Sichern ging nicht."); }).then(function(){ if(b) b.disabled=false; });
  }
  function say(t){ var s=document.getElementById("sxSay"); if(s){ s.textContent=t; s.hidden=!t; } }
  function pick(){
    var inp=document.createElement("input"); inp.type="file"; inp.accept="application/json,.json,text/plain";
    inp.onchange=function(){ var f=inp.files&&inp.files[0]; if(!f) return;
      var r=new FileReader(); r.onload=function(){ var n=norm(js(String(r.result||"").trim(),null)); if(!n||!Object.keys(n.keys).length){ say("Datei nicht lesbar oder leer."); return; } preview(n); }; r.readAsText(f); };
    inp.click();
  }
  function preview(n){
    var box=document.getElementById("sxPrev"); if(!box) return;
    var now={}; keys().forEach(function(k){ now[k]=get(k); });
    var d=n.t?new Date(n.t):null;
    box.innerHTML='<p class="sxH">Datei'+(d&&!isNaN(d)?" vom "+d.toLocaleDateString("de-CH"):"")+' · Build '+n.build+'</p>'+
      '<p class="sxL">'+line(count(n.keys,n.fotos))+'</p><p class="sxH">Jetzt auf dem Gerät</p><p class="sxL">'+line(count(now,[]))+'</p>'+
      '<p class="sxL sxN">Zusammenführen: Vorhandenes bleibt, Neues aus der Datei kommt dazu. Ersetzen: Werte aus der Datei gelten. Gelöscht wird nichts, der jetzige Stand wird vorher abgelegt.</p>'+
      '<div class="sxRow"><button type="button" class="btn primary" data-m="zusammen">Zusammenführen</button><button type="button" class="btn ghost" data-m="ersetzen">Ersetzen</button><button type="button" class="btn ghost" data-m="">Abbrechen</button></div>';
    box.hidden=false;
    box.querySelectorAll("button").forEach(function(b){ b.onclick=function(){
      var m=b.getAttribute("data-m"); if(!m){ box.hidden=true; box.innerHTML=""; return; }
      if(!confirm(m==="ersetzen"?"Wirklich ersetzen? Werte aus der Datei überschreiben die jetzigen.":"Zusammenführen und übernehmen?")) return;
      restore(n,m).then(function(k){ box.hidden=true; box.innerHTML=""; say("Wiederhergestellt ("+(m==="ersetzen"?"ersetzt":"zusammengeführt")+"): "+k+" Schlüssel. App lädt neu …"); setTimeout(function(){ location.reload(); },1400); });
    }; });
  }
  function hint(){
    var h=document.getElementById("sxHint"); if(!h) return;
    var t=+get(WHEN)||0, n=t?Math.floor((Date.now()-t)/86400000):-1;
    h.textContent=n<0?"Noch keine Sicherung":n===0?"Letzte Sicherung heute":"Letzte Sicherung vor "+n+(n===1?" Tag":" Tagen");
    h.className="sxHint"+((n<0||n>=30)?" alt":"");
  }
  function mount(){
    var sh=document.getElementById("mehrSheet"); if(!sh||document.getElementById("sxBox")) return !!sh;
    var box=document.createElement("div"); box.id="sxBox";
    box.innerHTML='<div class="sxRow"><button type="button" class="btn ghost" id="sxOut">Sichern</button><button type="button" class="btn ghost" id="sxIn">Wiederherstellen</button></div><p id="sxHint" class="sxHint"></p><p id="sxSay" class="sxL" hidden></p><div id="sxPrev" hidden></div>';
    sh.appendChild(box);
    box.addEventListener("click",function(e){ e.stopPropagation(); });
    document.getElementById("sxOut").onclick=out;
    document.getElementById("sxIn").onclick=pick;
    hint();
    return true;
  }
  var css=document.createElement("style");
  css.textContent="#sxBox{margin:.55rem .1rem 0;padding-top:.5rem;border-top:1px solid rgba(232,160,255,.14)}"+
    "#sxBox .sxRow{display:flex;gap:.4rem;flex-wrap:wrap}#sxBox .sxRow .btn{flex:1;min-height:2.5rem!important;height:auto!important;padding:.5rem .6rem!important;display:flex!important;align-items:center;justify-content:center;font-size:.8rem!important;border-radius:.9rem!important;border:1px solid rgba(232,160,255,.25)!important;background:rgba(160,90,255,.1)!important;color:#f1dcff!important}#sxBox .sxRow .btn.primary{background:linear-gradient(160deg,#7b3fb0,#4a1f72)!important}"+
    "#sxBox .sxHint{margin:.35rem .2rem 0;font-size:.62rem;color:#8e7aa8}#sxBox .sxHint.alt{color:#ff9ae4}"+
    "#sxBox .sxL{margin:.3rem .2rem;font-size:.64rem;color:#d9c8f0;line-height:1.35}#sxBox .sxN{color:#8e7aa8}"+
    "#sxBox .sxH{margin:.45rem .2rem 0;font-size:.58rem;letter-spacing:.14em;text-transform:uppercase;color:#e7b8ff}"+
    "#sxPrev{margin-top:.4rem;padding:.4rem;border-radius:.8rem;background:rgba(160,90,255,.08);border:1px solid rgba(232,160,255,.2)}";
  document.head.appendChild(css);
  if(!mount()){ var tries=0, iv=setInterval(function(){ if(mount()||++tries>40) clearInterval(iv); },250); }
  window.RR25_SICHERN={pack:pack,norm:norm,count:count,restore:restore,fileName:fileName};
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-gerechnet.js ==== */
try{
/* ritual-gerechnet.js — Build 35: Hinweise im Kalender-Tab, seit die App nach dem Ende der Daten auch Hard-Tage,
   Hard-Phase und Feintakte selbst rechnet (ritual-zeit.js). Nur Anzeige: alte Texte «ohne Hard» werden angepasst,
   an gerechneten Tagen steht ein kleiner Hinweis, dass Rückläufe und Finsternisse nur aus den Daten kommen. */
(function(){
  var K=window.RR25_KAL; if(!K) return;
  function dstr(ms){ var d=new Date(ms); return d.getDate()+"."+(d.getMonth()+1)+"."+d.getFullYear(); }
  var FIX=[["gerechnet (ohne Hard)","gerechnet"],
    ["Die App rechnet Bänder und Mondtage selbst (ohne Hard).","Die App rechnet Bänder, Mondtage und Hard-Tage selbst."],
    ["Die App rechnet selbst, ohne Hard.","Die App rechnet selbst (ohne Rückläufe und Finsternisse)."],
    ["danach rechnet die App selbst (ohne Hard).","danach rechnet die App selbst (ohne Rückläufe und Finsternisse)."]];
  function fix(root){
    var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null), n;
    while((n=w.nextNode())){ var v=n.nodeValue, o=v; FIX.forEach(function(f){ if(v.indexOf(f[0])>=0) v=v.split(f[0]).join(f[1]); }); if(v!==o) n.nodeValue=v; }
    var day=root.querySelector("#kalDay"), sel=root.querySelector(".kmDay.sel");
    if(day&&sel&&sel.classList.contains("calc")&&!day.querySelector(".kalCalcNote")){
      var c=K.coverage(), p=document.createElement("p"); p.className="kalCalcNote";
      p.textContent="Gerechnet für Bern. Rückläufe und Finsternisse stehen nur in den Daten"+(c?" (bis "+dstr(c.to-1)+")":"")+".";
      var g=day.querySelector(".group"); if(g&&g.nextSibling) day.insertBefore(p,g.nextSibling); else day.appendChild(p);
    }
  }
  var busy=false;
  function run(){ var b=document.getElementById("kalList"); if(!b||busy) return; busy=true; try{ fix(b); }finally{ busy=false; } }
  var css=document.createElement("style");
  css.textContent=".kalCalcNote{margin:.1rem .2rem .45rem!important;font-size:.62rem!important;color:#a996c4!important;border-left:2px dashed rgba(179,107,255,.55);padding-left:.45rem}";
  document.head.appendChild(css);
  function hook(){
    var b=document.getElementById("kalList"); if(!b||!window.MutationObserver) return;
    new MutationObserver(function(){ if(!busy) run(); }).observe(b,{childList:true,subtree:true});
    run();
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",hook); else hook();
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-rueckblick.js ==== */
try{
/* ritual-rueckblick.js — Build 36: «Rückblick» in der Chronik (Monat für Monat) und kleine Merker «Wirkung»/«Echo».
   Zählt Einträge je Ton (Soft, Grenze, Hard, Feld, Grau), je Mondphase, je Tageszeit und die Merker.
   Ton: RR25_TONE (ritual-fein.js), Grau = Tagesziel, Sigille, Gabe. Mondphase: RR25_MOND zur Eintragszeit.
   Merker liegen getrennt in rr25_tags_v1 ({Eintrags-ID: ["Wirkung","Echo"]}); bestehende Einträge bleiben unverändert.
   Beantwortete Echo-Tage (rr25_echo_v1, Tag 3/9) werden nur gelesen. */
(function(){
  if(window.__rr25rb) return; window.__rr25rb=1;
  var TK="rr25_tags_v1", TAGS=["Wirkung","Echo"], MON=null, OPEN=false;
  var MN=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
  function js(k,d){ try{ var v=JSON.parse(localStorage.getItem(k)||"null"); return v==null?d:v; }catch(e){ return d; } }
  function tags(){ var t=js(TK,{}); return t&&typeof t==="object"&&!Array.isArray(t)?t:{}; }
  function setTags(t){ try{ localStorage.setItem(TK,JSON.stringify(t)); }catch(e){} }
  function h(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function when(e){
    var s=String(e&&e.t||""), m=s.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})(?:,?\s*(\d{1,2}):(\d{2}))?/);
    if(m) return new Date(+m[3],+m[2]-1,+m[1],+(m[4]||12),+(m[5]||0)).getTime();
    var p=Date.parse(s); return isNaN(p)?null:p;
  }
  function rows(){ try{ return (typeof load==="function"?load().log:js("rr25_ritual_v1",{}).log)||[]; }catch(e){ return []; } }
  function tone(e){
    var t=window.RR25_TONE?window.RR25_TONE(e):"soft";
    return t==="neutral"?"grau":t;
  }
  function moon(ms){
    var M=window.RR25_MOND; if(!M) return "";
    var k=M.day(ms).key; return {neu:"Neumond",zu:"Zunehmend",voll:"Vollmond",ab:"Abnehmend"}[k]||"";
  }
  function daytime(ms){ var hr=new Date(ms).getHours(); return hr>=5&&hr<11?"Morgen":hr<17&&hr>=11?"Tag":hr>=17&&hr<22?"Abend":"Nacht"; }
  function stats(y,m){
    var T=tags(), S={n:0,ton:{soft:0,grenze:0,hard:0,feld:0,grau:0},mond:{Neumond:0,Zunehmend:0,Vollmond:0,Abnehmend:0},zeit:{Morgen:0,Tag:0,Abend:0,Nacht:0},Wirkung:0,Echo:0,echoAnt:0};
    rows().forEach(function(e){
      var ms=when(e); if(ms==null) return; var d=new Date(ms); if(d.getFullYear()!==y||d.getMonth()!==m) return;
      S.n++; S.ton[tone(e)]=(S.ton[tone(e)]||0)+1;
      var mo=moon(ms); if(mo) S.mond[mo]++;
      S.zeit[daytime(ms)]++;
      (T[String(e.id)]||[]).forEach(function(t){ if(t in S) S[t]++; });
    });
    try{ (js("rr25_echo_v1",{}).items||[]).forEach(function(it){ ["3","9"].forEach(function(k){ var c=it.checks&&it.checks[k]; if(c&&c.a&&c.due){ var d=new Date(c.due); if(d.getFullYear()===y&&d.getMonth()===m) S.echoAnt++; } }); }); }catch(e){}
    return S;
  }
  function bars(obj,cls,lab){
    var max=1; Object.keys(obj).forEach(function(k){ max=Math.max(max,obj[k]); });
    return '<div class="rbBars">'+Object.keys(obj).map(function(k){
      var v=obj[k], w=Math.round(v/max*100);
      return '<div class="rbRow"><span class="rbL">'+h(lab?lab[k]:k)+'</span><span class="rbT"><i class="rbF '+(cls?k:"")+'" style="width:'+(v?Math.max(w,4):0)+'%"></i></span><b>'+v+'</b></div>';
    }).join("")+'</div>';
  }
  function sentence(S){
    if(!S.n) return "In diesem Monat noch nichts in der Chronik.";
    var best=Object.keys(S.ton).sort(function(a,b){ return S.ton[b]-S.ton[a]; })[0];
    var LAB={soft:"Soft",grenze:"Grenze",hard:"Hard",feld:"Feld",grau:"Grau"};
    return S.n+(S.n===1?" Eintrag":" Einträge")+". Am meisten "+LAB[best]+(S.Wirkung?", "+S.Wirkung+"× Wirkung gespürt":"")+".";
  }
  function panel(){
    var now=new Date(); if(!MON) MON={y:now.getFullYear(),m:now.getMonth()};
    var S=stats(MON.y,MON.m);
    var LAB={soft:"Soft",grenze:"Grenze",hard:"Hard",feld:"Feld",grau:"Grau"};
    var fut=MON.y>now.getFullYear()||(MON.y===now.getFullYear()&&MON.m>=now.getMonth());
    return '<div class="rbHead"><button type="button" class="rbNav" data-d="-1" aria-label="Monat zurück">‹</button><b>'+MN[MON.m]+' '+MON.y+'</b><button type="button" class="rbNav" data-d="1" aria-label="Monat vor"'+(fut?' disabled':'')+'>›</button></div>'+
      '<p class="rbSay">'+h(sentence(S))+'</p>'+
      '<p class="rbH">Ton</p>'+bars(S.ton,true,LAB)+
      '<p class="rbH">Mondphase</p>'+bars(S.mond)+
      '<p class="rbH">Tageszeit</p>'+bars(S.zeit)+
      '<p class="rbH">Merker</p><div class="rbPills"><span class="rbP on">Wirkung <b>'+S.Wirkung+'</b></span><span class="rbP on">Echo <b>'+S.Echo+'</b></span><span class="rbP">Echo-Tage beantwortet <b>'+S.echoAnt+'</b></span></div>'+
      '<p class="rbNote">Merker setzt du direkt an einem Eintrag: «Wirkung» oder «Echo» antippen.</p>';
  }
  function paintPanel(){
    var p=document.getElementById("rbPanel"); if(!p) return;
    p.hidden=!OPEN; if(!OPEN) return;
    p.innerHTML=panel();
    p.querySelectorAll(".rbNav").forEach(function(b){ b.onclick=function(){ var d=+b.getAttribute("data-d"), m=MON.m+d, y=MON.y; if(m<0){ m=11; y--; } if(m>11){ m=0; y++; } MON={y:y,m:m}; paintPanel(); }; });
  }
  function mount(){
    var sec=document.getElementById("log"), ent=document.getElementById("entries"); if(!sec||!ent) return;
    if(!document.getElementById("rbBtn")){
      var bar=document.createElement("div"); bar.id="rbBar";
      bar.innerHTML='<button type="button" class="btn ghost" id="rbBtn">Rückblick</button>';
      var p=document.createElement("div"); p.id="rbPanel"; p.className="card"; p.hidden=true;
      sec.insertBefore(bar,ent); sec.insertBefore(p,ent);
      bar.querySelector("#rbBtn").onclick=function(){ OPEN=!OPEN; this.classList.toggle("on",OPEN); this.textContent=OPEN?"Rückblick zu":"Rückblick"; paintPanel(); };
    }
    chips();
  }
  function chips(){
    var box=document.getElementById("entries"); if(!box) return;
    var T=tags();
    box.querySelectorAll(".logrow[data-eid]").forEach(function(row){
      var id=row.getAttribute("data-eid"), have=T[id]||[], c=row.querySelector(".rbTags");
      if(!c){ c=document.createElement("span"); c.className="rbTags"; var host=row.querySelector(".meta")||row; host.appendChild(c); }
      var html=TAGS.map(function(t){ return '<button type="button" class="rbTag'+(have.indexOf(t)>=0?' on':'')+'" data-tag="'+t+'">'+t+'</button>'; }).join("");
      if(c.innerHTML!==html) c.innerHTML=html;
    });
  }
  document.addEventListener("click",function(ev){
    var b=ev.target.closest&&ev.target.closest(".rbTag"); if(!b) return;
    ev.stopPropagation(); ev.preventDefault();
    var row=b.closest(".logrow[data-eid]"); if(!row) return;
    var id=row.getAttribute("data-eid"), t=b.getAttribute("data-tag"), T=tags(), a=(T[id]||[]).slice(), i=a.indexOf(t);
    if(i>=0) a.splice(i,1); else a.push(t);
    if(a.length) T[id]=a; else delete T[id];
    setTags(T); b.classList.toggle("on",i<0); paintPanel();
  },true);
  var css=document.createElement("style");
  css.textContent=[
    "#rbBar{display:flex;justify-content:flex-end;margin:-.2rem 0 .5rem}",
    "#rbBtn{min-height:2.1rem!important;padding:.35rem 1rem!important;font-size:.76rem!important;border-radius:999px!important;border:1px solid rgba(232,160,255,.35)!important;background:rgba(160,90,255,.1)!important;color:#f1dcff!important}",
    "#rbBtn.on{box-shadow:0 0 14px rgba(200,120,255,.35)}",
    "#rbPanel{margin:0 0 .8rem;padding:.75rem .8rem .7rem;background:linear-gradient(180deg,rgba(40,18,62,.78),rgba(14,8,24,.92))!important;border:1px solid rgba(232,160,255,.22)!important;border-radius:1.1rem!important}",
    "#rbPanel[hidden]{display:none!important}",
    ".rbHead{display:flex;align-items:center;justify-content:space-between}.rbHead b{font-family:Georgia,serif;font-weight:400;font-size:1rem;color:#f1dcff}",
    ".rbNav{width:2rem;height:2rem;border-radius:999px;border:1px solid rgba(232,160,255,.3);background:rgba(160,90,255,.08);color:#e7b8ff;font-size:1.05rem;padding:0}.rbNav[disabled]{opacity:.3}",
    ".rbSay{margin:.45rem 0 .2rem;font-size:.8rem;color:#e6d4ff;line-height:1.4}",
    ".rbH{margin:.65rem 0 .25rem;font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:#ff9ae4}",
    ".rbRow{display:grid;grid-template-columns:5.6rem 1fr 1.6rem;align-items:center;gap:.45rem;margin:.18rem 0;font-size:.72rem;color:#cdbbe8}.rbRow b{text-align:right;font-weight:600;color:#f1dcff}",
    ".rbT{height:.5rem;border-radius:999px;background:rgba(255,255,255,.05);overflow:hidden}",
    ".rbF{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#7b3fb0,#d58bff);box-shadow:0 0 8px rgba(213,139,255,.45)}",
    ".rbF.soft{background:linear-gradient(90deg,#1f8a52,#2ecc71)}.rbF.grenze{background:linear-gradient(90deg,#b8661f,#ff9f43)}.rbF.hard{background:linear-gradient(90deg,#9e2b22,#e74c3c)}.rbF.feld{background:linear-gradient(90deg,#5b2a99,#b36bff)}.rbF.grau{background:linear-gradient(90deg,#5e5a6b,#9a96a6);box-shadow:none}",
    ".rbPills{display:flex;flex-wrap:wrap;gap:.35rem}.rbP{display:inline-flex;align-items:center;white-space:nowrap;font-size:.7rem;padding:.2rem .6rem;border-radius:999px;border:1px solid rgba(232,160,255,.25);color:#cdbbe8}.rbP.on{color:#f1dcff;background:rgba(160,90,255,.12)}.rbP b{margin-left:.2rem;color:#fff}",
    ".rbNote{margin:.55rem 0 0;font-size:.62rem;color:#8e7aa8}",
    ".rbTags{display:inline-flex;gap:.25rem;margin-left:.4rem;vertical-align:middle}",
    ".rbTag{font-size:.54rem;letter-spacing:.06em;padding:.05rem .42rem;min-height:0;line-height:1.5;border-radius:999px;border:1px dashed rgba(232,160,255,.3);background:transparent;color:#8e7aa8}",
    ".rbTag.on{border-style:solid;border-color:rgba(232,160,255,.7);color:#f6e6ff;background:rgba(160,90,255,.22);box-shadow:0 0 8px rgba(200,120,255,.35)}"
  ].join("");
  document.head.appendChild(css);
  if(typeof paintLog==="function"&&!paintLog._rb){ var pl=paintLog; paintLog=function(){ var r=pl.apply(this,arguments); setTimeout(function(){ chips(); paintPanel(); },80); return r; }; paintLog._rb=1; }
  if(typeof show==="function"&&!show._rb){ var sh=show; show=function(id){ var r=sh.apply(this,arguments); if(id==="log") setTimeout(mount,160); return r; }; show._rb=1; }
  var mo=window.MutationObserver&&document.getElementById("entries")?new MutationObserver(function(){ clearTimeout(mo.t); mo.t=setTimeout(chips,60); }):null;
  if(mo) mo.observe(document.getElementById("entries"),{childList:true,subtree:false});
  mount();
  window.RR25_RUECKBLICK={stats:stats};
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-erinnern.js ==== */
try{
/* ritual-erinnern.js — Build 37: Erinnerungen so gut es ohne Server geht.
   GitHub Pages hat keinen Push-Server: eine echte Push-Nachricht bei geschlossener App ist ohne Backend nicht möglich,
   und es wird bewusst kein fremder Push-Dienst eingebunden.
   1. Kalenderdatei (.ics): Hard-Feintakte und Rückkehr · Anker der nächsten 30 Tage, je mit Alarm 10 Min. vorher.
      Einmal ins Handy-Kalender übernehmen, dann erinnert der Kalender auch bei geschlossener App.
   2. Geplante Nachricht (Notification Triggers / TimestampTrigger), nur wenn der Browser das kann und die Erinnerung
      in «Mehr» eingeschaltet ist. Chrome hat das nur als Test angeboten; im normalen Android-Chrome fehlt es, dann bleibt es aus.
   3. In der App (offen oder im Hintergrund aktiv): ritual-ton.js erinnert an Datei-Fenster, hier zusätzlich an
      gerechnete Fenster nach dem Datenende (gleiche Regel: 10 Min. vorher, nur mit Opt-in). */
(function(){
  if(window.__rr25er) return; window.__rr25er=1;
  var K=window.RR25_KAL, DAY=86400000, MIN=60000, APP=location.origin+location.pathname;
  var TRIG=typeof window.TimestampTrigger==="function"&&typeof Notification!=="undefined"&&"showTrigger" in Notification.prototype;
  function two(n){ return String(n).padStart(2,"0"); }
  function hm(ms){ var d=new Date(ms); return two(d.getHours())+":"+two(d.getMinutes()); }
  function utc(ms){ var d=new Date(ms); return d.getUTCFullYear()+two(d.getUTCMonth()+1)+two(d.getUTCDate())+"T"+two(d.getUTCHours())+two(d.getUTCMinutes())+"00Z"; }
  function esc(s){ return String(s).replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\n/g,"\\n"); }
  function optOn(){ return !!(window.RR25_OPT&&window.RR25_OPT.get("notify"))&&"Notification" in window&&Notification.permission==="granted"; }
  function upcoming(days){
    if(!K) return [];
    var now=Date.now(), end=now+days*DAY, seen={}, out=[];
    [now, now+30*DAY].forEach(function(ref){
      K.list(ref).forEach(function(x){
        if(x.all||x.k!=="HARD"||x.e<=now||x.s>=end) return;
        var id=x.s+"|"+x.t; if(seen[id]) return; seen[id]=1; out.push(x);
      });
    });
    return out.sort(function(a,b){ return a.s-b.s; });
  }
  function ics(){
    var L=upcoming(30), st=utc(Date.now());
    var lines=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//RR25//Hard und Anker//DE","CALSCALE:GREGORIAN","METHOD:PUBLISH","X-WR-CALNAME:RR25 Hard und Anker","X-WR-TIMEZONE:Europe/Zurich"];
    L.forEach(function(x){
      var title=x.anker?"Rückkehr · Anker":x.t.replace(/^HARD · /,"Hard · ");
      lines.push("BEGIN:VEVENT","UID:rr25-"+x.s+"-"+(x.anker?"anker":"hard")+"@rr25","DTSTAMP:"+st,"DTSTART:"+utc(x.s),"DTEND:"+utc(x.e),
        "SUMMARY:"+esc(title),"DESCRIPTION:"+esc(x.t+(x.src==="calc"?" (gerechnet)":"")+" · Nur mit Gate und Rückkehr · Anker."),"URL:"+APP+(x.anker?"#anker":""),
        "BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:"+esc(title+" in 10 Min."),"TRIGGER:-PT10M","END:VALARM","END:VEVENT");
    });
    lines.push("END:VCALENDAR");
    return {text:lines.map(fold).join("\r\n")+"\r\n",n:L.length};
  }
  function fold(l){ var out="", b=0, cur=""; for(var i=0;i<l.length;i++){ var c=l[i], len=unescape(encodeURIComponent(c)).length; if(b+len>73){ out+=cur+"\r\n "; cur=""; b=1; } cur+=c; b+=len; } return out+cur; }
  function say(t){ var s=document.getElementById("erSay"); if(s){ s.textContent=t; s.hidden=!t; } }
  function download(){
    var r=ics(), d=new Date(), name="RR25-Hard-Anker-"+d.getFullYear()+"-"+two(d.getMonth()+1)+"-"+two(d.getDate())+".ics";
    if(!r.n){ say("In den nächsten 30 Tagen keine Hard-Feintakte."); return; }
    var blob=new Blob([r.text],{type:"text/calendar"});
    try{
      var f=new File([blob],name,{type:"text/calendar"});
      if(navigator.canShare&&navigator.canShare({files:[f]})&&navigator.share){
        navigator.share({files:[f],title:name}).then(function(){ say(r.n+" Termine geteilt. Im Kalender übernehmen."); }).catch(function(){ link(blob,name,r.n); });
        return;
      }
    }catch(e){}
    link(blob,name,r.n);
  }
  function link(blob,name,n){
    var a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click();
    setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); },1500);
    say(n+" Termine in "+name+". Datei öffnen und im Kalender übernehmen (Alarm 10 Min. vorher).");
  }
  /* geplante Nachrichten, wo der Browser es kann */
  function schedule(){
    if(!TRIG||!optOn()||!navigator.serviceWorker) return;
    navigator.serviceWorker.getRegistration().then(function(reg){
      if(!reg) return;
      return reg.getNotifications({includeTriggered:true}).then(function(old){ old.forEach(function(n){ if(n.tag&&n.tag.indexOf("rr25t-")===0) n.close(); }); }).catch(function(){}).then(function(){
        upcoming(14).forEach(function(x){
          var at=x.s-10*MIN; if(at<=Date.now()) return;
          var title=x.anker?"22:30 Rückkehr · Anker in 10 Min.":"Hard-Feintakt "+hm(x.s)+" in 10 Min.";
          try{ reg.showNotification(title,{body:x.t+" · "+hm(x.s)+"–"+hm(x.e),tag:"rr25t-"+x.s,icon:"icon.svg",data:{url:APP+(x.anker?"#anker":"")},showTrigger:new window.TimestampTrigger(at)}); }catch(e){}
        });
      });
    }).catch(function(){});
  }
  /* In der App: gerechnete Fenster (Datei-Fenster erinnert ritual-ton.js) */
  var fired={};
  function tick(){
    if(!K||!optOn()) return;
    var now=Date.now();
    K.list(now).forEach(function(x){
      if(x.all||x.k!=="HARD"||x.src!=="calc") return;
      var id=x.s+":"+(x.anker?"a":"h");
      if(now>=x.s-10*MIN&&now<x.s&&!fired[id]){
        fired[id]=1;
        var title=x.anker?"22:30 Rückkehr · Anker in 10 Min.":"Hard-Feintakt "+hm(x.s)+" in 10 Min.", opt={body:x.t+" · gerechnet",tag:"rr25-"+x.s,icon:"icon.svg",data:{url:APP+(x.anker?"#anker":"")}};
        if(navigator.serviceWorker) navigator.serviceWorker.getRegistration().then(function(reg){ if(reg) reg.showNotification(title,opt); else new Notification(title,opt); }).catch(function(){});
      }
    });
  }
  function status(){
    var s=document.getElementById("erInfo"); if(!s) return;
    s.textContent=TRIG?(optOn()?"Geplante Nachrichten aktiv (dieser Browser kann es).":"Dieser Browser kann geplante Nachrichten. Dafür oben die Erinnerung einschalten.")
      :"Bei geschlossener App erinnert nur der Handy-Kalender. Dafür die Kalenderdatei übernehmen.";
  }
  function mount(){
    var sh=document.getElementById("mehrSheet"); if(!sh) return false; if(document.getElementById("erBox")) return true;
    var box=document.createElement("div"); box.id="erBox";
    box.innerHTML='<button type="button" class="btn ghost" id="erIcs">Hard und Anker in den Kalender<small>.ics · nächste 30 Tage · Alarm 10 Min. vorher</small></button><p id="erInfo" class="erL"></p><p id="erSay" class="erL erOk" hidden></p>';
    var sx=document.getElementById("sxBox"); if(sx) sh.insertBefore(box,sx); else sh.appendChild(box);
    box.addEventListener("click",function(e){ e.stopPropagation(); });
    document.getElementById("erIcs").onclick=download;
    var cb=document.getElementById("optNotify"); if(cb) cb.addEventListener("change",function(){ setTimeout(function(){ status(); schedule(); },600); });
    status();
    return true;
  }
  var css=document.createElement("style");
  css.textContent="#erBox{margin:.55rem .1rem 0;padding-top:.5rem;border-top:1px solid rgba(232,160,255,.14)}"+
    "#erIcs{width:100%;min-height:2.6rem!important;height:auto!important;padding:.45rem .7rem!important;display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:.1rem;font-size:.8rem!important;border-radius:.9rem!important;border:1px solid rgba(232,160,255,.25)!important;background:rgba(160,90,255,.1)!important;color:#f1dcff!important}"+
    "#erIcs small{font-size:.56rem;color:#a996c4;font-weight:400}"+
    "#erBox .erL{margin:.35rem .2rem 0;font-size:.6rem;color:#8e7aa8;line-height:1.35}#erBox .erOk{color:#d9c8f0}";
  document.head.appendChild(css);
  if(!mount()){ var n=0, iv=setInterval(function(){ if(mount()||++n>40) clearInterval(iv); },250); }
  if(K) K.onReady(function(){ schedule(); tick(); });
  setInterval(tick,30000);
  window.RR25_ERINNERN={ics:ics,upcoming:upcoming,triggers:TRIG};
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-mondhinweis.js ==== */
try{
/* ritual-mondhinweis.js — Build 49: Mondphasen-Hinweis auf der Startseite.
   Am Vortag eines Neumonds oder Vollmonds und am Tag selbst eine kleine Karte unter der Ton-Zeile.
   Zeitpunkte: RR25_MOND (ritual-mondphase.js, Gerätezeit = Bern/Europe/Zurich). Hard-Phase: RR25_KAL (ritual-zeit.js).
   Keine neuen Schlüssel im Speicher. */
(function(){
  if(window.__rr25mh) return; window.__rr25mh=1;
  var DAY=86400000;
  function two(n){ return String(n).padStart(2,"0"); }
  function hm(ms){ var d=new Date(ms); return two(d.getHours())+":"+two(d.getMinutes()); }
  function h(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function day0(ms){ var d=new Date(ms); return new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime(); }
  function hardPhaseToday(now){
    try{ var K=window.RR25_KAL, s=K&&K.state(now), hd=s&&s.hardDay; return !!(hd&&/Vollmond/.test(String(hd.t||""))); }catch(e){ return false; }
  }
  /* Was gilt heute? null = keine Karte */
  function info(now){
    var M=window.RR25_MOND; if(!M) return null;
    var today=M.day(now), tom=M.day(day0(now)+DAY+12*3600000);
    if(today.key==="voll") return {k:"voll",head:"Heute Vollmond · Hard-Phase",sub:"Vollmond um "+hm(today.at)+". Ladung am stärksten. Ernten und danken, nicht nachsetzen. Abends Rückkehr · Anker."};
    if(today.key==="neu") return {k:"neu",head:"Heute Neumond · Neubeginn",sub:"Neumond um "+hm(today.at)+". Eine Absicht neu setzen. Klein anfangen."};
    if(tom.key==="voll") return {k:"voll",head:"Morgen Vollmond · Hard-Phase "+(hardPhaseToday(now)?"läuft":"beginnt"),sub:"Vollmond morgen um "+hm(tom.at)+"."+(hardPhaseToday(now)?" Die Hard-Phase hat heute begonnen. Abends Rückkehr · Anker.":" Ab morgen Hard-Phase. Heute vorbereiten.")};
    if(tom.key==="neu") return {k:"neu",head:"Morgen Neumond · Neubeginn",sub:"Neumond morgen um "+hm(tom.at)+". Heute abgeben und leeren, morgen neu setzen."};
    return null;
  }
  function anchor(){
    var home=document.getElementById("home"); if(!home) return null;
    var a=document.getElementById("bakCard");
    if(!a||a.parentNode!==home) a=document.getElementById("ankerHintCard");
    if(!a||a.parentNode!==home) a=document.getElementById("toneRow");
    return a&&a.parentNode===home?a:null;
  }
  function paint(){
    var el=document.getElementById("mondHint"), x=info(Date.now()), a=anchor();
    if(!x||!a){ if(el) el.remove(); return; }
    if(!el){ el=document.createElement("div"); el.id="mondHint"; el.className="card"; }
    var html='<p class="mhTag">Mondphase</p><b class="mhHead">'+h(x.head)+'</b><small class="mhSub">'+h(x.sub)+'</small>';
    if(el.getAttribute("data-k")!==x.k) el.setAttribute("data-k",x.k);
    if(el.innerHTML!==html) el.innerHTML=html;
    if(el.previousElementSibling!==a) a.parentNode.insertBefore(el,a.nextSibling);
  }
  var css=document.createElement("style");
  css.textContent=[
    "#home>#mondHint{margin:.55rem 0 .6rem;padding:.65rem .9rem .6rem;border-radius:1.1rem;border:1px solid rgba(232,160,255,.32);background:linear-gradient(160deg,rgba(48,20,78,.75),rgba(16,8,30,.92));box-shadow:0 0 16px rgba(201,155,255,.14)}",
    "#mondHint[data-k=voll]{border-color:rgba(255,84,112,.45);box-shadow:0 0 16px rgba(255,84,112,.14)}",
    "#mondHint .mhTag{margin:0 0 .12rem;font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:#c9a8ff}",
    "#mondHint[data-k=voll] .mhTag{color:#ff8aa0}",
    "#mondHint .mhHead{display:block;font-family:Georgia,serif;font-weight:500;font-size:1rem;color:#f6f0ff}",
    "#mondHint .mhSub{display:block;margin:.18rem 0 0;font-size:.74rem;color:#c4b4e0;line-height:1.4}"
  ].join("");
  document.head.appendChild(css);
  if(typeof show==="function"&&!show._mh){ var sh=show; show=function(id){ var r=sh.apply(this,arguments); if(id==="home") setTimeout(paint,60); return r; }; show._mh=1; }
  var home=document.getElementById("home");
  if(home&&window.MutationObserver){ var mo=new MutationObserver(function(){ clearTimeout(mo.t); mo.t=setTimeout(paint,80); }); mo.observe(home,{childList:true}); }
  setInterval(paint,60000);
  paint(); setTimeout(paint,1200);
  window.RR25_MONDHINWEIS={info:info,paint:paint};
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-zaehler.js ==== */
try{
/* ritual-zaehler.js — Build 49: «Zähler» in der Chronik. Wie oft wurde welches Ritual gemacht?
   Liest nur die bestehende Chronik (load().log bzw. rr25_ritual_v1). Abgebrochene Einträge zählen nicht.
   Zuordnung über den Titel (Ritualname am Anfang, längster Treffer), Härte-Stufe im Titel wird ignoriert.
   Einträge ohne Ritual (Tagesziel, Sigille, Gabe, Notizen) zählen nicht. Keine neuen Schlüssel im Speicher. */
(function(){
  if(window.__rr25rz) return; window.__rr25rz=1;
  var OPEN=false;
  function h(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function rows(){ try{ return (typeof load==="function"?load().log:JSON.parse(localStorage.getItem("rr25_ritual_v1")||"{}").log)||[]; }catch(e){ return []; } }
  function rlist(){ try{ return (typeof R!=="undefined"&&R)||window.RR_RITUALS||[]; }catch(e){ return window.RR_RITUALS||[]; } }
  function ritOf(titel){
    var t=String(titel||"").trim(), best=null;
    rlist().forEach(function(r){ if(r&&r.t&&(t===r.t||t.indexOf(r.t+" · ")===0)&&(!best||r.t.length>best.t.length)) best=r; });
    if(!best) best=(function(T){ return (function(){ var A=window.RR_ALT_TITEL||{}, L=window.RR_RITUALS||[]; for(var k in A){ if(T===k||T.indexOf(k+" · ")===0){ for(var q=0;q<L.length;q++) if(L[q].id===A[k]) return L[q]; } } return null; })(); })(t);
    return best;
  }
  function counts(){
    var m={}, list=[];
    rows().forEach(function(e){
      if(!e||e.kind==="gabe") return;
      var t=String(e.titel||"");
      if(/ · abgebrochen$/.test(t)) return;
      var r=ritOf(t); if(!r) return;
      if(!m[r.id]){ m[r.id]={id:r.id,t:r.t,tone:r.hard?"hard":(r.tone||"soft"),n:0}; list.push(m[r.id]); }
      m[r.id].n++;
    });
    return list.sort(function(a,b){ return b.n-a.n||a.t.localeCompare(b.t,"de"); });
  }
  function panel(){
    var L=counts(), sum=L.reduce(function(s,x){ return s+x.n; },0);
    if(!L.length) return '<p class="zlH">Ritual-Zähler</p><p class="zlSay">Noch kein Ritual in der Chronik.</p>';
    return '<p class="zlH">Ritual-Zähler</p><p class="zlSay">'+sum+(sum===1?" Ritual":" Rituale")+' · '+L.length+(L.length===1?" Art":" Arten")+'</p>'+
      '<ol class="zlList">'+L.map(function(x){ return '<li class="zlRow tone-'+h(x.tone)+'"><span>'+h(x.t)+'</span><b>'+x.n+'×</b></li>'; }).join("")+'</ol>';
  }
  function paintPanel(){
    var p=document.getElementById("zlPanel"); if(!p) return;
    p.hidden=!OPEN; if(!OPEN) return;
    var html=panel(); if(p.innerHTML!==html) p.innerHTML=html;
  }
  function mount(){
    var sec=document.getElementById("log"), ent=document.getElementById("entries"), bar=document.getElementById("rbBar");
    if(!sec||!ent) return;
    if(!document.getElementById("zlBtn")){
      if(!bar){ bar=document.createElement("div"); bar.id="rbBar"; sec.insertBefore(bar,ent); }
      var b=document.createElement("button"); b.type="button"; b.className="btn ghost"; b.id="zlBtn"; b.textContent="Zähler";
      bar.insertBefore(b,bar.firstChild);
      var p=document.createElement("div"); p.id="zlPanel"; p.className="card"; p.hidden=true;
      sec.insertBefore(p,ent);
      b.onclick=function(){ OPEN=!OPEN; b.classList.toggle("on",OPEN); b.textContent=OPEN?"Zähler zu":"Zähler"; paintPanel(); };
    }
    paintPanel();
  }
  var css=document.createElement("style");
  css.textContent=[
    "#rbBar{gap:.45rem}",
    "#zlBtn{min-height:2.1rem!important;padding:.35rem 1rem!important;font-size:.76rem!important;border-radius:999px!important;border:1px solid rgba(232,160,255,.35)!important;background:rgba(160,90,255,.1)!important;color:#f1dcff!important}",
    "#zlBtn.on{box-shadow:0 0 14px rgba(200,120,255,.35)}",
    "#zlPanel{margin:0 0 .8rem;padding:.7rem .8rem .6rem;background:linear-gradient(180deg,rgba(40,18,62,.78),rgba(14,8,24,.92))!important;border:1px solid rgba(232,160,255,.22)!important;border-radius:1.1rem!important}",
    "#zlPanel[hidden]{display:none!important}",
    ".zlH{margin:0 0 .15rem;font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:#ff9ae4}",
    ".zlSay{margin:0 0 .35rem;font-size:.76rem;color:#e6d4ff}",
    ".zlList{list-style:none;margin:0;padding:0}",
    ".zlRow{display:flex;align-items:baseline;justify-content:space-between;gap:.6rem;padding:.22rem 0 .22rem .55rem;border-left:2px solid #2ecc71;margin:.12rem 0;font-size:.78rem;color:#e6dcff;line-height:1.3}",
    ".zlRow span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.zlRow b{flex:none;font-weight:600;color:#f1dcff;font-variant-numeric:tabular-nums}",
    ".zlRow.tone-hard{border-left-color:#ff5470}.zlRow.tone-grenze{border-left-color:#ffb86b}.zlRow.tone-feld{border-left-color:#b98cff}.zlRow.tone-neutral{border-left-color:#9a96a8}"
  ].join("");
  document.head.appendChild(css);
  if(typeof paintLog==="function"&&!paintLog._rz){ var pl=paintLog; paintLog=function(){ var r=pl.apply(this,arguments); setTimeout(paintPanel,90); return r; }; paintLog._rz=1; }
  if(typeof show==="function"&&!show._rz){ var sh=show; show=function(id){ var r=sh.apply(this,arguments); if(id==="log") setTimeout(mount,200); return r; }; show._rz=1; }
  mount();
  window.RR25_ZAEHLER={counts:counts};
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-danksatz.js ==== */
try{
/* ritual-danksatz.js — Build 49: «Dank-Satz des Tages» am Ende von «Dank ans Feld» (dankfeld).
   30 kurze Sätze, pro Kalendertag fest (gleicher Tag = gleicher Satz), zum Mitnehmen und Kopieren.
   Erscheint auf dem Schluss-Bildschirm (#after) nur nach dankfeld. Keine neuen Schlüssel im Speicher. */
(function(){
  if(window.__rr25ds) return; window.__rr25ds=1;
  var S=[
    "Danke für das, was heute schon getragen hat.",
    "Ich danke für den Boden unter meinen Füssen.",
    "Danke, dass ich nicht alles allein halten muss.",
    "Ich danke für jedes Zeichen, das ich gesehen habe.",
    "Danke für die kleinen Wege, die sich geöffnet haben.",
    "Ich danke für Atem, Licht und einen klaren Moment.",
    "Danke für die Menschen, die mir guttun.",
    "Ich danke für das, was still gewachsen ist.",
    "Danke für Schutz, auch wo ich ihn nicht bemerkt habe.",
    "Ich danke dem Feld. Es hat gehört.",
    "Danke für die Kraft, die zurückgekommen ist.",
    "Ich danke für Wärme im Haus und Ruhe im Herzen.",
    "Danke für das Geld, das fliesst, und für das, was reicht.",
    "Ich danke für die Liebe, die schon da ist.",
    "Danke für den Mut, heute einen Schritt zu gehen.",
    "Ich danke für das, was sich gefügt hat.",
    "Danke für Gesundheit in jedem Atemzug.",
    "Ich danke für Grenzen, die gehalten haben.",
    "Danke für das Lachen zwischendurch.",
    "Ich danke für Wasser, Brot und einen sicheren Ort.",
    "Danke für jede Antwort, auch für die leisen.",
    "Ich danke für das, was ich loslassen durfte.",
    "Danke für Geduld mit mir selbst.",
    "Ich danke für den Mond, der mitgeht.",
    "Danke für das Glück, das ich heute bemerke.",
    "Ich danke für Klarheit, wo vorher Nebel war.",
    "Danke für das, was kommt. Ich bin bereit.",
    "Ich danke für meine Hände und was sie heute geben.",
    "Danke für die Stille, in der alles ankommt.",
    "Ich habe es gesehen. Danke, Feld."
  ];
  function dayNo(d){ d=d||new Date(); return Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000); }
  function satz(d){ var n=dayNo(d); return S[((n*7)%S.length+S.length)%S.length]; }
  function h(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function copy(txt,btn){
    function ok(){ btn.textContent="Kopiert"; btn.classList.add("on"); setTimeout(function(){ btn.textContent="Kopieren"; btn.classList.remove("on"); },1800); }
    function alt(){
      try{ var ta=document.createElement("textarea"); ta.value=txt; ta.setAttribute("readonly",""); ta.style.position="fixed"; ta.style.opacity="0"; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); ok(); }
      catch(e){ btn.textContent="Bitte markieren"; }
    }
    try{ if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(txt).then(ok,alt); return; } }catch(e){}
    alt();
  }
  function paint(){
    var af=document.getElementById("after"), old=document.getElementById("dsCard");
    if(old) old.remove();
    if(!af||window._rid!=="dankfeld") return;
    var t=satz(), el=document.createElement("div");
    el.id="dsCard"; el.className="card";
    el.innerHTML='<p class="dsTag">Dank-Satz des Tages · zum Mitnehmen</p><p class="dsTxt" id="dsTxt">«'+h(t)+'»</p><button type="button" class="btn ghost" id="dsCopy">Kopieren</button>';
    var go=document.getElementById("afterGo"), row=go&&go.closest(".row");
    if(row&&row.parentNode===af) af.insertBefore(el,row); else af.appendChild(el);
    el.querySelector("#dsCopy").onclick=function(){ copy(t,this); };
  }
  var css=document.createElement("style");
  css.textContent=[
    "#after>#dsCard{margin:.4rem 0 1rem;padding:.85rem 1rem .8rem;text-align:center;border-radius:1.1rem;border:1px solid rgba(46,204,113,.4);background:linear-gradient(160deg,rgba(40,20,70,.8),rgba(14,8,26,.94));box-shadow:0 0 18px rgba(95,224,160,.14)}",
    "#dsCard .dsTag{margin:0 0 .35rem;font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:#7dffb0}",
    "#dsCard .dsTxt{margin:0 0 .6rem;font-family:Georgia,serif;font-size:1.12rem;line-height:1.45;color:#f6f0ff;-webkit-user-select:text;user-select:text}",
    "#dsCopy{min-height:2.1rem!important;padding:.35rem 1.1rem!important;font-size:.78rem!important;border-radius:999px!important;border:1px solid rgba(232,160,255,.35)!important;background:rgba(160,90,255,.1)!important;color:#f1dcff!important}",
    "#dsCopy.on{border-color:rgba(46,204,113,.6)!important;color:#7dffb0!important}"
  ].join("");
  document.head.appendChild(css);
  if(typeof show==="function"&&!show._ds){ var sh=show; show=function(id){ var r=sh.apply(this,arguments); if(id==="after") paint(); else { var o=document.getElementById("dsCard"); if(o) o.remove(); } return r; }; show._ds=1; }
  window.RR25_DANKSATZ={satz:satz,alle:S};
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-sterne.js ==== */
try{
/* ritual-sterne.js — Build 50: Sternenhimmel und Tageston-Schimmer.
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
    var sg=sigDoc(), w=document.documentElement.clientWidth, h=window.innerHeight, t=tone;
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
    if(sg) c.clearRect(sg.x-4,sg.y-4,sg.w+8,sg.h+8);
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

  var css=document.createElement("style");
  css.textContent=".app{isolation:isolate}"+
    "#sternFeld,#sternRest{position:absolute;left:0;top:0;width:100%;z-index:-1;pointer-events:none;background-repeat:no-repeat}"+
    "#sternRest{background-repeat:repeat-y}"+
    "#sternFunkeln{position:fixed;left:0;top:0;width:100vw;height:100vh;z-index:2147483000;pointer-events:none;display:block}";
  document.head.appendChild(css);
  window.RR25_STERNE={
    tone:function(){ return tone; },
    off:function(){ on=false; if(raf) cancelAnimationFrame(raf); raf=0; drawTw(0); feld.style.display="none"; rest.style.display="none"; cv.style.display="none"; },
    on:function(){ on=true; feld.style.display=""; rest.style.display=""; cv.style.display=""; paintFeld(true); now(); kick(); }
  };
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-mondbild.js ==== */
try{
/* ritual-mondbild.js — Build 50: Mond in der Kopfzeile als kleines SVG mit der echten Phase (statt Emoji).
   Phase: RR25_MOND.phase() (ritual-mondphase.js, Gerätezeit = Bern). Licht rechts = zunehmend, links = abnehmend.
   Text unter dem Mond bleibt wie bisher. Keine Schlüssel im Speicher. */
(function(){
  if(window.RR25_MONDBILD) return;
  function path(p){
    var k=Math.cos(2*Math.PI*p), rx=Math.abs(k)*10, wax=p<.5;
    var outer=wax?1:0, term=wax?(k>0?0:1):(k>0?1:0);
    return "M12 2A10 10 0 0 "+outer+" 12 22A"+rx.toFixed(2)+" 10 0 0 "+term+" 12 2Z";
  }
  function svg(p){
    var lit=(1-Math.cos(2*Math.PI*p))/2, d=lit>.995?"M12 2A10 10 0 1 1 12 22A10 10 0 1 1 12 2Z":(lit<.005?"":path(p));
    return '<svg class="mbSvg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">'+
      '<defs><radialGradient id="mbLit" cx="40%" cy="38%" r="70%"><stop offset="0" stop-color="#fff8ff"/><stop offset=".65" stop-color="#eadcff"/><stop offset="1" stop-color="#c9b2f2"/></radialGradient></defs>'+
      '<circle cx="12" cy="12" r="10" fill="#1d1430" stroke="rgba(214,180,255,.45)" stroke-width=".7"/>'+
      (d?'<path d="'+d+'" fill="url(#mbLit)"/>':'')+
      '<circle cx="12" cy="12" r="10" fill="none" stroke="rgba(255,255,255,.12)" stroke-width=".35"/></svg>';
  }
  var busy=false, lastKey="";
  function paint(){
    var el=document.getElementById("moonSym"), M=window.RR25_MOND; if(!el||!M) return;
    var p=M.phase(Date.now()), key=p.toFixed(3);
    if(key===lastKey && el.querySelector(".mbSvg")) return;
    busy=true; lastKey=key;
    var m=M.day(); el.setAttribute("aria-label","Mond: "+m.name+", "+Math.round((1-Math.cos(2*Math.PI*p))*50)+" % beleuchtet");
    el.setAttribute("role","img"); el.innerHTML=svg(p); busy=false;
  }
  var el=document.getElementById("moonSym");
  if(el&&window.MutationObserver) new MutationObserver(function(){ if(busy) return; if(!el.querySelector(".mbSvg")){ lastKey=""; paint(); } }).observe(el,{childList:true,characterData:true,subtree:true});
  var css=document.createElement("style");
  css.textContent="#moonSym .mbSvg{display:block;width:2rem;height:2rem;margin:.02rem auto .03rem;filter:drop-shadow(0 0 6px rgba(201,155,255,.45)) drop-shadow(0 0 2px rgba(255,255,255,.25))}";
  document.head.appendChild(css);
  paint(); setTimeout(paint,400); setInterval(paint,10*60*1000);
  window.RR25_MONDBILD={svg:svg,paint:paint};
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-tippen.js ==== */
try{
/* ritual-tippen.js — Build 50: sanftes Neon-Violett-Leuchten, solange eine Karte gedrückt wird.
   Nur :active, kurzer Übergang; bei «Bewegung reduzieren» ohne Übergang und ohne Verkleinern.
   Die Zeichen-Kachel (#sigilBox) ist keine Karte und bleibt unberührt. */
(function(){
  if(window.__rr25tip) return; window.__rr25tip=1;
  var css=document.createElement("style");
  css.textContent=[
    ".card,.kcard,.msItem{-webkit-tap-highlight-color:transparent;transition:box-shadow .16s ease-out,border-color .16s ease-out,transform .12s ease-out}",
    "html .card:active,html .kcard:active,html .msItem:active{border-color:rgba(214,160,255,.75)!important;box-shadow:0 0 0 1px rgba(214,160,255,.55),0 0 6px rgba(190,120,255,.5),inset 0 0 14px rgba(200,130,255,.28)!important;transition-duration:.06s}",
    "html button.card:active,html .kcard:active,html .msItem:active{transform:scale(.985)}",
    "@media (prefers-reduced-motion:reduce){.card,.kcard,.msItem{transition:none}html button.card:active,html .kcard:active,html .msItem:active{transform:none}}"
  ].join("");
  document.head.appendChild(css);
})();

}catch(e){setTimeout(function(){throw e;});}
