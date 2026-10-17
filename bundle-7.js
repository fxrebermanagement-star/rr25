/* rr25 · Paket 7/7 · Build 96 · erzeugt mit tools/bundle.py. Nicht von Hand bearbeiten:
   Quelldatei ändern und neu erzeugen. Inhalt in dieser Reihenfolge: ritual-sichern.js, ritual-gerechnet.js, ritual-rueckblick.js, ritual-erinnern.js, ritual-mondhinweis.js, ritual-zaehler.js, ritual-danksatz.js, ritual-sterne.js, ritual-mondbild.js, ritual-tippen.js, ritual-b66.js, ritual-b80.js, ritual-b81.js, ritual-b82.js, ritual-b83.js, ritual-b84.js, ritual-b85.js, ritual-b94.js, ritual-b95.js */
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
  function done(name,p,how){
    set(WHEN,String(Date.now()));
    say((how==="teilen"?"Geteilt: ":"Gesichert: ")+name+" · "+line(count(p.keys,p.fotos))+(how==="teilen"?". Am besten in dein Drive oder an dich selbst senden.":". Die Datei liegt in den Downloads."));
    hint();
  }
  function download(blob,name){
    var a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=name; a.rel="noopener"; document.body.appendChild(a); a.click();
    setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); },1500);
  }
  /* ein Tipp: Datei teilen (Teilen-Menü des Handys), sonst Download. Nichts verlässt das Gerät ohne dein Tippen im Teilen-Menü. */
  function out(mode){
    var b=document.getElementById("sxOut"), b2=document.getElementById("sxFile"); if(b) b.disabled=true; if(b2) b2.disabled=true;
    pack().then(function(p){
      var raw=JSON.stringify(p), name=fileName(), blob=new Blob([raw],{type:"application/json"});
      var file=null; try{ file=new File([blob],name,{type:"application/json"}); }catch(e){}
      var canShare=mode!=="datei"&&file&&navigator.share&&navigator.canShare&&navigator.canShare({files:[file]});
      if(canShare){
        return navigator.share({files:[file],title:name}).then(function(){ done(name,p,"teilen"); }).catch(function(err){
          if(err&&err.name==="AbortError"){ say("Teilen abgebrochen. Noch nicht gesichert."); return; }
          download(blob,name); done(name,p,"datei");
        });
      }
      download(blob,name); done(name,p,"datei");
    }).catch(function(){ say("Sichern ging nicht."); }).then(function(){ if(b) b.disabled=false; if(b2) b2.disabled=false; });
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
  function age(){ var t=+get(WHEN)||0; return t?Math.floor((Date.now()-t)/86400000):-1; }
  function hint(){
    var n=age(), due=(n<0||n>=7), h=document.getElementById("sxHint");
    if(h){
      var cls=n<0?"rot":(n>=30?"rot":(n>=7?"gelb":"gruen"));
      h.innerHTML='<i></i>'+(n<0?"Noch keine Sicherung. Tippe «Sichern», dann liegen deine Daten sicher ausserhalb der App.":n===0?"Letzte Sicherung: heute":"Letzte Sicherung: vor "+n+(n===1?" Tag":" Tagen")+(n>=7?". Zeit für eine neue Sicherung.":""));
      h.className="sxHint "+cls;
    }
    var nm=document.getElementById("navMehr"); if(nm) nm.classList.toggle("sxDue",due);
  }
  function mount(){
    var sh=document.getElementById("mehrSheet"); if(!sh||document.getElementById("sxBox")) return !!sh;
    var box=document.createElement("div"); box.id="sxBox";
    box.innerHTML='<div class="sxRow"><button type="button" class="btn ghost" id="sxOut">Sichern</button><button type="button" class="btn ghost" id="sxIn">Wiederherstellen</button></div><p id="sxHint" class="sxHint"></p><p class="sxL sxN"><button type="button" id="sxFile" class="sxLink">Nur als Datei speichern</button></p><p id="sxSay" class="sxL" hidden></p><div id="sxPrev" hidden></div>';
    sh.appendChild(box);
    box.addEventListener("click",function(e){ e.stopPropagation(); });
    document.getElementById("sxOut").onclick=function(){ out("teilen"); };
    document.getElementById("sxFile").onclick=function(){ out("datei"); };
    document.getElementById("sxIn").onclick=pick;
    hint();
    return true;
  }
  var css=document.createElement("style");
  css.textContent="#sxBox{margin:.55rem .1rem 0;padding-top:.5rem;border-top:1px solid rgba(200,120,255,.14)}"+
    "#sxBox .sxRow{display:flex;gap:.4rem;flex-wrap:wrap}#sxBox .sxRow .btn{flex:1;min-height:40px!important;height:auto!important;padding:.5rem .6rem!important;display:flex!important;align-items:center;justify-content:center;font-size:.8rem!important;border-radius:.9rem!important;border:1px solid rgba(200,120,255,.25)!important;background:rgba(160,90,255,.1)!important;color:#e4ecff!important}#sxBox .sxRow .btn.primary{background:linear-gradient(160deg,#7b3fb0,#4a1f72)!important}"+
    "#sxBox .sxHint{margin:.4rem .2rem 0;font-size:.7rem;line-height:1.4;color:#d9c8f0;display:flex;gap:.45rem;align-items:flex-start}#sxBox .sxHint i{flex:none;width:.55rem;height:.55rem;margin-top:.3rem;border-radius:50%;background:#5fe0a0}#sxBox .sxHint.gelb i{background:#ffb86b}#sxBox .sxHint.rot i{background:#ff5470}#sxBox .sxHint.gelb{color:#ffd2a0}#sxBox .sxHint.rot{color:#ffb4c0}"+
    "#sxBox .sxLink{min-height:2.75rem;padding:0 .2rem;border:0;background:none;font:inherit;font-size:.7rem;color:#d6a6ff;text-decoration:underline;text-underline-offset:.2em;text-decoration-color:rgba(200,120,255,.4)}"+
    "#navMehr.sxDue{position:relative}#navMehr.sxDue::after{content:'';position:absolute;top:.35rem;right:calc(50% - 1.5rem);width:.55rem;height:.55rem;border-radius:50%;background:#ffb86b;box-shadow:0 0 8px rgba(255,184,107,.7)}"+
    "#sxBox .sxL{margin:.3rem .2rem;font-size:.64rem;color:#d9c8f0;line-height:1.35}#sxBox .sxN{color:#8e7aa8}"+
    "#sxBox .sxH{margin:.45rem .2rem 0;font-size:.58rem;letter-spacing:.14em;text-transform:uppercase;color:#cfa8ff}"+
    "#sxPrev{margin-top:.4rem;padding:.4rem;border-radius:.8rem;background:rgba(160,90,255,.08);border:1px solid rgba(200,120,255,.2)}";
  document.head.appendChild(css);
  if(!mount()){ var tries=0, iv=setInterval(function(){ if(mount()||++tries>40) clearInterval(iv); },250); }
  document.addEventListener('visibilitychange',function(){ if(!document.hidden) hint(); }); setInterval(hint,60000); setTimeout(hint,600); setTimeout(hint,2500);
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
  var TK="rr25_tags_v1", TAGS=["Wirkung","Echo"], MON=null, OPEN=false, MODE="monat";
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
    var T=tags(), S={n:0,rit:0,ziel:0,ton:{soft:0,grenze:0,hard:0,feld:0,grau:0},mond:{Neumond:0,Zunehmend:0,Vollmond:0,Abnehmend:0},zeit:{Morgen:0,Tag:0,Abend:0,Nacht:0},Wirkung:0,Echo:0,echoAnt:0};
    rows().forEach(function(e){
      var ms=when(e); if(ms==null) return; var d=new Date(ms); if(d.getFullYear()!==y||d.getMonth()!==m) return;
      S.n++; if(String(e.titel||'')==='Tagesziel') S.ziel++; else if(window.RR25_ZAEHLREGEL&&window.RR25_ZAEHLREGEL.isRitual(e)) S.rit++; S.ton[tone(e)]=(S.ton[tone(e)]||0)+1;
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
    var rest=S.n-S.rit-S.ziel;
    return S.n+(S.n===1?" Eintrag":" Einträge")+": "+S.rit+(S.rit===1?" Ritual":" Rituale")+", "+S.ziel+(S.ziel===1?" Tagesziel":" Tagesziele")+(rest>0?", "+rest+" weitere":"")+". Am meisten "+LAB[best]+(S.Wirkung?", "+S.Wirkung+"× Wirkung gespürt":"")+".";
  }
  function yearStats(y){
    var T=tags(), Y={n:0,rit:0,monat:[0,0,0,0,0,0,0,0,0,0,0,0],ton:{soft:0,grenze:0,hard:0,feld:0,grau:0},mond:{Neumond:0,Zunehmend:0,Vollmond:0,Abnehmend:0},Wirkung:0,Echo:0,echoAnt:0,top:{}};
    rows().forEach(function(e){
      var ms=when(e); if(ms==null) return; var d=new Date(ms); if(d.getFullYear()!==y) return;
      Y.n++;
      var isR=String(e.titel||'')!=='Tagesziel'&&window.RR25_ZAEHLREGEL&&window.RR25_ZAEHLREGEL.isRitual(e);
      if(isR){ Y.rit++; Y.monat[d.getMonth()]++; var nm=String(e.titel||"").trim(); if(nm) Y.top[nm]=(Y.top[nm]||0)+1; }
      var tn=tone(e); Y.ton[tn]=(Y.ton[tn]||0)+1;
      var mo=moon(ms); if(mo) Y.mond[mo]++;
      (T[String(e.id)]||[]).forEach(function(t){ if(t in Y) Y[t]++; });
    });
    try{ (js("rr25_echo_v1",{}).items||[]).forEach(function(it){ ["3","9"].forEach(function(k){ var c=it.checks&&it.checks[k]; if(c&&c.a&&c.due){ var d=new Date(c.due); if(d.getFullYear()===y) Y.echoAnt++; } }); }); }catch(e){}
    return Y;
  }
  function yearPanel(){
    var now=new Date(); var y=MON.y, Y=yearStats(y), LAB={soft:"Soft",grenze:"Grenze",hard:"Hard",feld:"Feld",grau:"Grau"};
    var mo={}; MN.forEach(function(n,i){ mo[i]=Y.monat[i]; });
    var ml={}; MN.forEach(function(n,i){ ml[i]=n.slice(0,3); });
    var top=Object.keys(Y.top).sort(function(a,b){ return Y.top[b]-Y.top[a]||a.localeCompare(b); }).slice(0,5);
    var say=Y.n?(Y.rit+(Y.rit===1?" Ritual":" Rituale")+" in "+y+(Y.n>Y.rit?", dazu "+(Y.n-Y.rit)+" weitere Einträge":"")+"."):"In diesem Jahr noch nichts in der Chronik.";
    var wd=Y.Wirkung+Y.Echo, wp=wd?Math.round(Y.Wirkung/wd*100):50;
    var fut=y>=now.getFullYear();
    return '<div class="rbHead"><button type="button" class="rbNav" data-d="-12" aria-label="Jahr zurück">‹</button><b>'+y+'</b><button type="button" class="rbNav" data-d="12" aria-label="Jahr vor"'+(fut?' disabled':'')+'>›</button></div>'+
      '<p class="rbSay">'+h(say)+'</p>'+
      '<p class="rbH">Rituale pro Monat</p>'+bars(mo,false,ml)+
      '<p class="rbH">Ton · Soft und Hard</p>'+bars(Y.ton,true,LAB)+
      '<p class="rbH">Mondphase</p>'+bars(Y.mond)+
      '<p class="rbH">Wirkung und Echo</p>'+(wd?'<div class="rbBal" aria-label="Wirkung '+Y.Wirkung+', Echo '+Y.Echo+'"><i style="width:'+wp+'%"></i></div>':'')+
      '<div class="rbPills"><span class="rbP on">Wirkung <b>'+Y.Wirkung+'</b></span><span class="rbP on">Echo <b>'+Y.Echo+'</b></span><span class="rbP">Echo-Tage beantwortet <b>'+Y.echoAnt+'</b></span></div>'+
      '<p class="rbH">Meistgenutzte Rituale</p>'+(top.length?'<ol class="rbTop">'+top.map(function(k){ return '<li><span>'+h(k)+'</span><b>'+Y.top[k]+'×</b></li>'; }).join("")+'</ol>':'<p class="rbNote">Noch keine Rituale in diesem Jahr.</p>');
  }
  function modeBar(){
    return '<div class="rbMode" role="tablist"><button type="button" data-mode="monat" class="'+(MODE==="monat"?"on":"")+'">Monat</button><button type="button" data-mode="jahr" class="'+(MODE==="jahr"?"on":"")+'">Jahr</button></div>';
  }
  function panel(){
    var now=new Date(); if(!MON) MON={y:now.getFullYear(),m:now.getMonth()};
    if(MODE==='jahr') return modeBar()+yearPanel();
    var S=stats(MON.y,MON.m);
    var LAB={soft:"Soft",grenze:"Grenze",hard:"Hard",feld:"Feld",grau:"Grau"};
    var fut=MON.y>now.getFullYear()||(MON.y===now.getFullYear()&&MON.m>=now.getMonth());
    return modeBar()+'<div class="rbHead"><button type="button" class="rbNav" data-d="-1" aria-label="Monat zurück">‹</button><b>'+MN[MON.m]+' '+MON.y+'</b><button type="button" class="rbNav" data-d="1" aria-label="Monat vor"'+(fut?' disabled':'')+'>›</button></div>'+
      '<p class="rbSay">'+h(sentence(S))+'</p>'+
      '<p class="rbH">Ton · alle Einträge</p>'+bars(S.ton,true,LAB)+
      '<p class="rbH">Mondphase</p>'+bars(S.mond)+
      '<p class="rbH">Tageszeit</p>'+bars(S.zeit)+
      '<p class="rbH">Merker</p><div class="rbPills"><span class="rbP on">Wirkung <b>'+S.Wirkung+'</b></span><span class="rbP on">Echo <b>'+S.Echo+'</b></span><span class="rbP">Echo-Tage beantwortet <b>'+S.echoAnt+'</b></span></div>'+
      '<p class="rbNote">Merker setzt du direkt an einem Eintrag: «Wirkung» oder «Echo» antippen.</p>';
  }
  function paintPanel(){
    var p=document.getElementById("rbPanel"); if(!p) return;
    p.hidden=!OPEN; if(!OPEN) return;
    p.innerHTML=panel(); modeHook(p);
    p.querySelectorAll(".rbNav").forEach(function(b){ b.onclick=function(){ var d=+b.getAttribute("data-d"); if(MODE==="jahr"){ MON={y:MON.y+d/12,m:MON.m}; paintPanel(); return; } var m=MON.m+d, y=MON.y; if(m<0){ m=11; y--; } if(m>11){ m=0; y++; } MON={y:y,m:m}; paintPanel(); }; });
  }
  function modeHook(p){ p.querySelectorAll('.rbMode button').forEach(function(b){ b.onclick=function(){ MODE=b.getAttribute('data-mode'); paintPanel(); }; }); }
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
    "#rbBtn{min-height:2.1rem!important;padding:.35rem 1rem!important;font-size:.76rem!important;border-radius:999px!important;border:1px solid rgba(200,120,255,.35)!important;background:rgba(160,90,255,.1)!important;color:#e4ecff!important}",
    "#rbBtn.on{box-shadow:0 0 14px rgba(200,120,255,.35)}",
    "#rbPanel{margin:0 0 .8rem;padding:.75rem .8rem .7rem;background:linear-gradient(180deg,rgba(40,18,62,.78),rgba(14,8,24,.92))!important;border:1px solid rgba(200,120,255,.22)!important;border-radius:1.1rem!important}",
    "#rbPanel[hidden]{display:none!important}",
    ".rbHead{display:flex;align-items:center;justify-content:space-between}.rbHead b{font-family:Georgia,serif;font-weight:400;font-size:1rem;color:#e4ecff}",
    ".rbNav{width:2rem;height:2rem;border-radius:999px;border:1px solid rgba(200,120,255,.3);background:rgba(160,90,255,.08);color:#cfa8ff;font-size:1.05rem;padding:0}.rbNav[disabled]{opacity:.3}",
    ".rbSay{margin:.45rem 0 .2rem;font-size:.8rem;color:#e6d4ff;line-height:1.4}",
    ".rbH{margin:.65rem 0 .25rem;font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:#d6a6ff}",
    ".rbRow{display:grid;grid-template-columns:5.6rem 1fr 1.6rem;align-items:center;gap:.45rem;margin:.18rem 0;font-size:.72rem;color:#cdbbe8}.rbRow b{text-align:right;font-weight:600;color:#e4ecff}",
    ".rbT{height:.5rem;border-radius:999px;background:rgba(255,255,255,.05);overflow:hidden}",
    ".rbF{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#7b3fb0,#d58bff);box-shadow:0 0 8px rgba(213,139,255,.45)}",
    ".rbF.soft{background:linear-gradient(90deg,#1f8a52,#2ecc71)}.rbF.grenze{background:linear-gradient(90deg,#b8661f,#ff9f43)}.rbF.hard{background:linear-gradient(90deg,#9e2b22,#e74c3c)}.rbF.feld{background:linear-gradient(90deg,#5b2a99,#9a4dff)}.rbF.grau{background:linear-gradient(90deg,#5e5a6b,#9a96a6);box-shadow:none}",
    ".rbPills{display:flex;flex-wrap:wrap;gap:.35rem}.rbP{display:inline-flex;align-items:center;white-space:nowrap;font-size:.7rem;padding:.2rem .6rem;border-radius:999px;border:1px solid rgba(200,120,255,.25);color:#cdbbe8}.rbP.on{color:#e4ecff;background:rgba(160,90,255,.12)}.rbP b{margin-left:.2rem;color:#fff}",
    ".rbMode{display:flex;gap:.3rem;justify-content:center;margin:0 0 .5rem}.rbMode button{min-height:0;padding:.25rem .9rem;font-size:.7rem;border-radius:999px;border:1px solid rgba(200,120,255,.25);background:transparent;color:#cdbbe8}.rbMode button.on{background:rgba(160,90,255,.22);color:#f6e6ff;border-color:rgba(200,120,255,.6);box-shadow:0 0 10px rgba(200,120,255,.3)}",
    ".rbBal{height:.5rem;border-radius:999px;background:rgba(255,255,255,.07);overflow:hidden;margin:.2rem 0 .45rem}.rbBal i{display:block;height:100%;background:linear-gradient(90deg,#7b3fb0,#d58bff);box-shadow:0 0 8px rgba(213,139,255,.45)}",
    ".rbTop{list-style:none;margin:.2rem 0 0;padding:0}.rbTop li{display:flex;justify-content:space-between;gap:.6rem;font-size:.76rem;color:#e6d4ff;padding:.22rem 0;border-bottom:1px solid rgba(200,120,255,.1)}.rbTop li:last-child{border:0}.rbTop b{color:#fff;font-weight:600}",
    ".rbNote{margin:.55rem 0 0;font-size:.62rem;color:#8e7aa8}",
    ".rbTags{display:inline-flex;gap:.25rem;margin-left:.4rem;vertical-align:middle}",
    ".rbTag{font-size:.54rem;letter-spacing:.06em;padding:.05rem .42rem;min-height:0;line-height:1.5;border-radius:999px;border:1px dashed rgba(200,120,255,.3);background:transparent;color:#8e7aa8}",
    ".rbTag.on{border-style:solid;border-color:rgba(200,120,255,.7);color:#f6e6ff;background:rgba(160,90,255,.22);box-shadow:0 0 8px rgba(200,120,255,.35)}"
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
   (Build 72: der Knopf sitzt klein im Kalender-Tab über der Liste, nicht mehr in Mehr.)
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
    s.textContent="Nächste 30 Tage, Alarm 10 Min. vorher. Bei geschlossener App erinnert nur der Handy-Kalender."+(TRIG&&optOn()?" Geplante Nachrichten sind in diesem Browser aktiv.":"");
  }
  function mount(){
    var kal=document.getElementById("kal"), list=kal&&document.getElementById("kalList"); if(!kal||!list) return false;
    if(document.getElementById("erBox")) return true;
    var box=document.createElement("div"); box.id="erBox";
    box.innerHTML='<button type="button" id="erIcs">In den Handy-Kalender (.ics)</button><span id="erInfo" class="erL"></span><p id="erSay" class="erL erOk" hidden></p>';
    list.parentNode.insertBefore(box,list);
    document.getElementById("erIcs").onclick=download;
    var cb=document.getElementById("optNotify"); if(cb) cb.addEventListener("change",function(){ setTimeout(function(){ status(); schedule(); },600); });
    status();
    return true;
  }
  var css=document.createElement("style");
  css.textContent="#erBox{margin:.1rem .2rem .7rem;text-align:center}"+
    "#erIcs{display:inline-block;min-height:2.5rem;padding:.4rem .9rem;border:0;background:none;font:inherit;font-size:.74rem;color:var(--ueberschrift,#d6a6ff);text-decoration:underline;text-underline-offset:.2em;text-decoration-color:rgba(200,120,255,.4);cursor:pointer;-webkit-tap-highlight-color:transparent}"+
    "#erBox .erL{display:block;margin:-.2rem .4rem 0;font-size:.64rem;color:var(--dim,#8e7aa8);line-height:1.4}#erBox .erOk{color:#d9c8f0;margin-top:.2rem}";
  document.head.appendChild(css);
  if(!mount()){ var n=0, iv=setInterval(function(){ if(mount()||++n>40) clearInterval(iv); },250); }
  setInterval(function(){ if(!document.getElementById("erBox")) mount(); },3000);
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
    "#home>#mondHint{margin:.55rem 0 .6rem;padding:.65rem .9rem .6rem;border-radius:1.1rem;border:1px solid rgba(200,120,255,.32);background:linear-gradient(160deg,rgba(48,20,78,.75),rgba(16,8,30,.92));box-shadow:0 0 16px rgba(170,100,255,.14)}",
    "#mondHint[data-k=voll]{border-color:rgba(255,84,112,.45);box-shadow:0 0 16px rgba(255,84,112,.14)}",
    "#mondHint .mhTag{margin:0 0 .12rem;font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:#c9a8ff}",
    "#mondHint[data-k=voll] .mhTag{color:#ff8aa0}",
    "#mondHint .mhHead{display:block;font-family:Georgia,serif;font-weight:500;font-size:1rem;color:#eaf2ff}",
    "#mondHint .mhSub{display:block;margin:.18rem 0 0;font-size:.74rem;color:#b4c6f2;line-height:1.4}"
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
/* ritual-zaehler.js — Build 49 (61: nur gewählter Monat + Gesamt): «Zähler» in der Chronik. Wie oft wurde welches Ritual gemacht?
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
  /* Build 60: gleiche Zählregel wie der Rückblick: Rituale ohne Gabe-Einträge, ohne Abbrüche, nur bekannte Rituale */
  function isRitual(e){
    if(!e||e.kind==="gabe") return false;
    var t=String(e.titel||""); if(/ · abgebrochen$/.test(t)) return false;
    return !!ritOf(t);
  }
  window.RR25_ZAEHLREGEL={isRitual:isRitual};
  var MN=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
  function when(e){
    var s=String(e&&e.t||""), m=s.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})(?:,?\s*(\d{1,2}):(\d{2}))?/);
    if(m) return new Date(+m[3],+m[2]-1,+m[1],+(m[4]||12),+(m[5]||0)).getTime();
    var p=Date.parse(s); return isNaN(p)?null:p;
  }
  /* Build 61: Monat der Chronik-Monatsnavigation (Rückblick-Karte, z. B. «Oktober 2026»); sonst aktueller Monat */
  function curMon(){
    var el=document.querySelector("#rbPanel .rbHead b"), m=el&&String(el.textContent).match(/^\s*(\S+)\s+(\d{4})\s*$/);
    if(m){ var i=MN.indexOf(m[1]); if(i>=0) return {y:+m[2],m:i}; }
    var n=new Date(); return {y:n.getFullYear(),m:n.getMonth()};
  }
  function counts(mon){
    var m={}, list=[], total=0;
    rows().forEach(function(e){
      if(!isRitual(e)) return;
      total++;
      if(mon){ var ms=when(e); if(ms==null) return; var d=new Date(ms); if(d.getFullYear()!==mon.y||d.getMonth()!==mon.m) return; }
      var r=ritOf(String(e.titel||"")); if(!r) return;
      if(!m[r.id]){ m[r.id]={id:r.id,t:r.t,tone:r.hard?"hard":(r.tone||"soft"),n:0}; list.push(m[r.id]); }
      m[r.id].n++;
    });
    list.sort(function(a,b){ return b.n-a.n||a.t.localeCompare(b.t,"de"); });
    list.total=total; return list;
  }
  function panel(){
    var mon=curMon(), L=counts(mon), all=L.total, sum=L.reduce(function(s,x){ return s+x.n; },0), lab=MN[mon.m]+" "+mon.y;
    var tot='<p class="zlTot">Gesamt seit Beginn: '+all+'</p>';
    if(!L.length) return '<p class="zlH">Ritual-Zähler</p><p class="zlSay">Kein Ritual im '+h(lab)+'.</p>'+tot;
    return '<p class="zlH">Ritual-Zähler</p><p class="zlSay">'+sum+(sum===1?" Ritual":" Rituale")+' im '+h(lab)+' · '+L.length+(L.length===1?" Art":" Arten")+'</p>'+tot+
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
    "#zlBtn{min-height:2.1rem!important;padding:.35rem 1rem!important;font-size:.76rem!important;border-radius:999px!important;border:1px solid rgba(200,120,255,.35)!important;background:rgba(160,90,255,.1)!important;color:#e4ecff!important}",
    "#zlBtn.on{box-shadow:0 0 14px rgba(200,120,255,.35)}",
    "#zlPanel{margin:0 0 .8rem;padding:.7rem .8rem .6rem;background:linear-gradient(180deg,rgba(40,18,62,.78),rgba(14,8,24,.92))!important;border:1px solid rgba(200,120,255,.22)!important;border-radius:1.1rem!important}",
    "#zlPanel[hidden]{display:none!important}",
    ".zlH{margin:0 0 .15rem;font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:#d6a6ff}",
    ".zlSay{margin:0 0 .35rem;font-size:.76rem;color:#e6d4ff}",
    ".zlTot{margin:0 0 .4rem;font-size:.62rem;color:#a98fc9;letter-spacing:.04em}",
    ".zlList{list-style:none;margin:0;padding:0}",
    ".zlRow{display:flex;align-items:baseline;justify-content:space-between;gap:.6rem;padding:.22rem 0 .22rem .55rem;border-left:2px solid #2ecc71;margin:.12rem 0;font-size:.78rem;color:#e6dcff;line-height:1.3}",
    ".zlRow span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.zlRow b{flex:none;font-weight:600;color:#e4ecff;font-variant-numeric:tabular-nums}",
    ".zlRow.tone-hard{border-left-color:#ff5470}.zlRow.tone-grenze{border-left-color:#ffb86b}.zlRow.tone-feld{border-left-color:#a66bff}.zlRow.tone-neutral{border-left-color:#9a96a8}"
  ].join("");
  document.head.appendChild(css);
  if(typeof paintLog==="function"&&!paintLog._rz){ var pl=paintLog; paintLog=function(){ var r=pl.apply(this,arguments); setTimeout(paintPanel,90); return r; }; paintLog._rz=1; }
  if(typeof show==="function"&&!show._rz){ var sh=show; show=function(id){ var r=sh.apply(this,arguments); if(id==="log") setTimeout(mount,200); return r; }; show._rz=1; }
  /* Monatswechsel in der Rückblick-Navigation und Öffnen/Schliessen des Rückblicks: Zähler neu zeichnen */
  document.addEventListener("click",function(ev){ if(ev.target.closest&&ev.target.closest(".rbNav,#rbBtn")) setTimeout(paintPanel,30); },false);
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
    "#dsCard .dsTxt{margin:0 0 .6rem;font-family:Georgia,serif;font-size:1.12rem;line-height:1.45;color:#eaf2ff;-webkit-user-select:text;user-select:text}",
    "#dsCopy{min-height:2.1rem!important;padding:.35rem 1.1rem!important;font-size:.78rem!important;border-radius:999px!important;border:1px solid rgba(200,120,255,.35)!important;background:rgba(160,90,255,.1)!important;color:#e4ecff!important}",
    "#dsCopy.on{border-color:rgba(46,204,113,.6)!important;color:#7dffb0!important}"
  ].join("");
  document.head.appendChild(css);
  if(typeof show==="function"&&!show._ds){ var sh=show; show=function(id){ var r=sh.apply(this,arguments); if(id==="after") paint(); else { var o=document.getElementById("dsCard"); if(o) o.remove(); } return r; }; show._ds=1; }
  window.RR25_DANKSATZ={satz:satz,alle:S};
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-sterne.js ==== */
try{
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
  css.textContent="#moonSym .mbSvg{display:block;width:2rem;height:2rem;margin:.02rem auto .03rem;filter:drop-shadow(0 0 6px rgba(170,100,255,.45)) drop-shadow(0 0 2px rgba(255,255,255,.25))}";
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
/* ==== ritual-b66.js ==== */
try{
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
  /* Build 69/70: Soft/Hard-Band, Mondmarker, Zeiträume und Finsternisse aus den vorhandenen Kalenderdaten (RR25_KAL, RR25_MOND) */
  var TONF={HARD:{c:"#ff5470",n:"Hard"},GRENZE:{c:"#ffb86b",n:"Grenze"},ECHO:{c:"#b98cff",n:"Echo"},STILL:{c:"#9a96a8",n:"Still"},SOFT:{c:"#5fe0a0",n:"Soft"}};
  var GRUND={
    "Venus rückläufig":"Venus läuft scheinbar rückwärts. Im Kalender als Hard-Zeitraum geführt.",
    "Merkur rückläufig":"Merkur läuft scheinbar rückwärts. Im Kalender als Echo-Zeitraum geführt.",
    "Mars rückläufig":"Mars läuft scheinbar rückwärts. Im Kalender als Grenze-Zeitraum geführt.",
    "Rauhnächte":"Die Zeit zwischen den Jahren. Im Kalender als Still-Zeitraum geführt.",
    "Finsternis":"Sonnen- oder Mondfinsternis. Im Kalender als Hard-Tag geführt."
  };
  /* Finsternisse 2026 (NASA Five Millennium Catalog, grösste Phase in UT; hier in Berner Zeit angezeigt). Nur als Ergänzung, falls die Kalenderdaten das Jahr nicht abdecken. */
  var FINS_TAB={2026:[
    {t:Date.UTC(2026,1,17,12,12),art:"Ringförmige Sonnenfinsternis",sonne:1,sicht:"In Europa nicht sichtbar (Antarktis, Südspitze Südamerikas, südliches Afrika)."},
    {t:Date.UTC(2026,2,3,11,34),art:"Totale Mondfinsternis",sonne:0,sicht:"In Europa nicht sichtbar (Amerikas, Asien, Pazifik)."},
    {t:Date.UTC(2026,7,12,17,46),art:"Totale Sonnenfinsternis",sonne:1,sicht:"Total in Island und Spanien, in weiten Teilen Europas teilweise sichtbar."},
    {t:Date.UTC(2026,7,28,4,13),art:"Teilweise Mondfinsternis",sonne:0,sicht:""}
  ]};
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
    var lanesEnd=[];
    ev.filter(function(e){ return e.sz&&GRUND[e.sz]&&e.sz!=="Finsternis"; }).sort(function(p,q){ return String(p.start).localeCompare(String(q.start)); }).forEach(function(e){
      var s=dayFromStr(e.start), en=e.end?dayFromStr(e.end):s+1;
      if(en<=y0||s>=y0+len) return;
      var k=String(e.t).split("·")[0].trim().toUpperCase(); if(!TONF[k]) k="SOFT";
      var ls=Math.max(s,y0), le=Math.min(en,y0+len), lane=0;
      while(lanesEnd[lane]!=null&&lanesEnd[lane]>ls) lane++;
      lanesEnd[lane]=le;
      out.lanes.push({s:ls,e:le,rs:s,re:en,k:k,lane:lane,sz:e.sz,t:e.t});
    });
    /* Finsternisse: erst Kalenderdaten, dann die Tabelle für fehlende */
    ev.filter(function(e){ return /Finsternis/.test(e.t)&&/HARD/.test(e.t)&&String(e.start).length<=10; }).forEach(function(e){
      var s=dayFromStr(e.start); if(s<y0||s>=y0+len) return;
      var sonne=/Sonne/.test(e.t);
      out.eclipses.push({d:s,sonne:sonne,art:sonne?"Sonnenfinsternis":"Mondfinsternis",src:"kal"});
    });
    (FINS_TAB[y]||[]).forEach(function(f){
      var bd=bern(f.t), dd=dn(bd.y,bd.m,bd.d), dup=out.eclipses.some(function(x){ return Math.abs(x.d-dd)<=1&&x.sonne===!!f.sonne; });
      if(dup) return; out.tabUsed=true;
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
    if(cov&&cov.from>Date.UTC(y,0,1)){ var cd=bern(cov.from); out.left.push("Rückläufigkeiten (Venus, Merkur, Mars) vor dem "+cd.d+"."+cd.m+"."+cd.y+", die Kalenderdaten beginnen später"); }
    if(cov&&cov.to<Date.UTC(y+1,0,1)-864e5){ var ce=bern(cov.to-1); out.left.push("Rückläufigkeiten nach dem "+ce.d+"."+ce.m+"."+ce.y+", die Kalenderdaten enden früher"); }
    if(!FINS_TAB[y]&&!out.eclipses.length) out.left.push("Finsternisse "+y+" (weder in den Kalenderdaten noch in der Tabelle)");
    return out;
  }
  var MON3=["Jan","Feb","Mär","Apr","Mai","Jun","Jul","Aug","Sep","Okt","Nov","Dez"];
  function buildRad(box){
    var b=bern(), y=b.y, t=dn(b.y,b.m,b.d), y0=dn(y,1,1), len=dn(y+1,1,1)-y0, nx=nextFest(), W=440, C=220, R=130, LR=152;
    var YD=yearData(y,y0,len);
    function ang(doy){ return doy/len*360; }
    function xy(a,r){ var q=a*Math.PI/180; return [C+r*Math.sin(q),C-r*Math.cos(q)]; }
    function arc(a0,a1,r){ var p0=xy(a0,r), p1=xy(a1,r); return "M"+p0[0].toFixed(1)+","+p0[1].toFixed(1)+" A"+r+","+r+" 0 "+((a1-a0)>180?1:0)+" 1 "+p1[0].toFixed(1)+","+p1[1].toFixed(1); }
    box.setAttribute("data-y",y);
    box.innerHTML='<p class="jrH">Jahresrad '+y+'</p><div class="jrStage"></div><div class="jrCard"></div>'+
      '<div class="jrLeg">'+
        '<div><b>Ton</b><span><i class="d" style="background:#5fe0a0"></i>Soft</span><span><i class="d" style="background:#ff5470"></i>Hard</span><span><i class="d" style="background:#b98cff"></i>Echo</span><span><i class="d" style="background:#ffb86b"></i>Grenze</span></div>'+
        '<div><b>Mond</b><span><i class="d mv"></i>Vollmond</span><span><i class="d mn"></i>Neumond</span></div>'+
        '<div><b>Zeiten</b><span><i class="l"></i>Rückläufig</span><span><i class="r"></i>Finsternis</span><span><i class="s"></i>Finsternis-Saison</span><span><i class="h"></i>Heute</span></div>'+
      '</div><p class="jrNote"></p>';
    var stage=box.querySelector(".jrStage"), card=box.querySelector(".jrCard"), note=box.querySelector(".jrNote");
    note.textContent="Soft ist hier alles ausserhalb der Hard-Zeiten. Hard: je 3 Tage um den Vollmond sowie Finsternisse, Venus rückläufig und die Finsternis-Saison laut Kalender. Dienstag (Mars) und Samstag (Saturn) als Einzeltage sind nicht eingezeichnet. "+
      (YD.tabUsed?"Finsternisdaten 2026 ergänzt nach NASA (grösste Phase, Berner Zeit). ":"")+(YD.left.length?"Fehlt: "+YD.left.join("; ")+". ":"")+"Festdaten ungefähr. Berner Zeit.";
    var svg=el("svg",{viewBox:"0 24 "+W+" 368","class":"jrSvg","aria-hidden":"true"},stage);
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
    function fa(n){ for(var i=0;i<FEST.length;i++) if(FEST[i].n===n){ var f=FEST[i]; return ang(dn(y,f.m,f.d)-y0); } }
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
      var id=info({title:l.sz,when:dstr(l.rs)+" bis "+dstr(l.re-1),tag:f.n,c:f.c,text:GRUND[l.sz]});
      el("path",{d:arc(a0,a1,r),"class":"jrLane",stroke:f.c},rot);
      el("path",{d:arc(a0,a1,r),"class":"jrHit2","data-x":id},rot);
    });
    /* Finsternis-Saison und Finsternisse (r=54) */
    YD.saison.forEach(function(v){
      var s=Math.max(v.s,y0), e=Math.min(v.e,y0+len), a0=ang(s-y0), a1=ang(e-y0);
      var id=info({title:"Finsternis-Saison",when:dstr(s)+(s!==v.s?" (Fortsetzung)":"")+" bis "+dstr(e-1),tag:"Hard",c:TONF.HARD.c,text:"Etwa zwei Wochen vor und nach einer Finsternis. Mit Hard-Tönung: die Ladung ist höher."});
      el("path",{d:arc(a0,a1,54),"class":"jrSais"},rot); el("path",{d:arc(a0,a1,54),"class":"jrHit2","data-x":id},rot);
    });
    YD.eclipses.forEach(function(e){
      var p=xy(ang(e.d-y0),54);
      var when=dstr(e.d)+(e.t?" um "+zeitBern(e.t)+" Uhr (Berner Zeit, grösste Phase)":"");
      var id=info({title:e.art,when:when,tag:"Hard",c:TONF.HARD.c,text:(e.sicht?e.sicht+" ":"")+(e.src==="tab"?"Nach der Kalenderregel ein Hard-Tag (Eintrag aus Astronomiedaten ergänzt). ":"Im Kalender als Hard-Tag geführt. ")+"Dazu gehört die Finsternis-Saison von etwa zwei Wochen davor und danach."});
      el("path",{d:"M"+p[0].toFixed(1)+","+(p[1]-6).toFixed(1)+" l5,6 l-5,6 l-5,-6z","class":"jrEcl",filter:"url(#jrGlow)"},rot);
      el("circle",{cx:p[0].toFixed(1),cy:p[1].toFixed(1),r:"12","class":"jrHit","data-x":id},rot);
    });
    /* Mondmarker (r=116) */
    YD.moons.forEach(function(m){
      var p=xy(ang(m.d-y0),116), full=m.q===2;
      var id=info({title:full?"Vollmond":"Neumond",when:dstr(m.d)+" um "+zeitBern(m.t)+" Uhr (Berner Zeit)",tag:full?"Hard":"Soft",c:full?TONF.HARD.c:TONF.SOFT.c,
        text:full?"Um den Vollmond gilt eine Hard-Phase von 3 Tagen: der Tag davor, der Vollmondtag und der Tag danach.":"Neumond ist Aussaat. Neu setzen, still halten."});
      el("circle",{cx:p[0].toFixed(1),cy:p[1].toFixed(1),r:full?"3.6":"3.2","class":full?"jrMv":"jrMn"},rot);
      el("circle",{cx:p[0].toFixed(1),cy:p[1].toFixed(1),r:"10","class":"jrHit","data-x":id},rot);
    });
    var nodes=[];
    FEST.forEach(function(f,i){
      var a=ang(dn(y,f.m,f.d)-y0), p=xy(a,R);
      var ring=el("circle",{cx:p[0].toFixed(1),cy:p[1].toFixed(1),r:"9","class":"jrHalo",fill:f.c},rot);
      var n=el("circle",{cx:p[0].toFixed(1),cy:p[1].toFixed(1),r:"4.6","class":"jrNode",fill:f.c},rot);
      el("circle",{cx:p[0].toFixed(1),cy:p[1].toFixed(1),r:"14","class":"jrHit","data-i":i},rot);
      var lab=el("text",{"class":"jrLab","text-anchor":"middle"},svg); lab.textContent=f.n;
      nodes.push({a:a,halo:ring,node:n,lab:lab});
    });
    /* heute */
    var tone="SOFT"; try{ var S=window.RR25_KAL&&window.RR25_KAL.state&&window.RR25_KAL.state(Date.now()); if(S&&TONF[S.kind]) tone=S.kind; }catch(e){}
    var tf=TONF[tone], ta=ang(t-y0), tm=el("g",{"class":"jrToday"},rot);
    var tp=xy(0,R); el("circle",{cx:tp[0],cy:tp[1],r:"7","class":"jrPulse",fill:tf.c},tm); el("circle",{cx:tp[0],cy:tp[1],r:"3.8","class":"jrHeute",stroke:tf.c},tm);
    el("path",{d:"M"+C+","+(C-LR-24)+" l-5,-8 h10z","class":"jrPtr"},svg);
    var M=null; try{ M=window.RR25_MOND&&window.RR25_MOND.day(Date.now()); }catch(e){}
    var mgrp=el("g",{transform:"translate("+C+","+C+")","class":"jrMoon"},svg);
    el("circle",{r:"22","class":"jrMoonBg"},mgrp);
    if(M) el("path",{d:moonPath(M.p,19.5),"class":"jrMoonLit"},mgrp);
    var mt=el("text",{x:C,y:C+37,"text-anchor":"middle","class":"jrMoonT"},svg); mt.textContent=M?M.name:"";
    var tt=el("text",{x:C,y:C+47,"text-anchor":"middle","class":"jrToneT"},svg); tt.textContent="heute "+tf.n; tt.setAttribute("fill",tf.c);
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
      var f=FEST[i], bb=bern(), tt=dn(bb.y,bb.m,bb.d), yy=bb.y, d=dn(yy,f.m,f.d)-tt; if(d<0){ yy++; d=dn(yy,f.m,f.d)-tt; }
      return {tage:d,y:yy};
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
      st.sel=i; var f=FEST[i], dd=days(i), dt=new Date(Date.UTC(dd.y,f.m-1,f.d));
      nodes.forEach(function(n,k){ n.halo.setAttribute("class","jrHalo"+(k===i?" on":"")); n.lab.setAttribute("class","jrLab"+(k===i?" on":"")); });
      var say=dd.tage===0?"heute":(dd.tage===1?"morgen":"in "+dd.tage+" Tagen");
      card.style.setProperty("--jc",f.c);
      card.innerHTML=cardHtml(f.n,WTAG[dt.getUTCDay()]+", "+f.d+". "+MONAT[f.m-1]+" "+dd.y+" · "+say,f.z,f.t,'<p class="jrF"><small>Aus dem Feld</small>'+h(f.f)+'</p>');
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
    var ni=0; FEST.forEach(function(f,i){ if(nx&&nx.f===f) ni=i; });
    st.rot=-nodes[ni].a-70; st.mark=0; apply(); show(ni,false);
    go(-nodes[ni].a,ta,1400);
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
    "#jrPanel{margin:0 0 .8rem;padding:.8rem .7rem .9rem;overflow:hidden}",
    "#jrPanel[hidden]{display:none!important}",
    ".jrH{margin:0 0 .2rem;text-align:center;font-size:.66rem;letter-spacing:.18em;text-transform:uppercase;color:var(--ueberschrift)}",
    ".jrSvg{display:block;width:100%;max-width:27rem;margin:0 auto;touch-action:pan-y;user-select:none;-webkit-user-select:none;-webkit-tap-highlight-color:transparent;cursor:grab}",
    ".jrBase{fill:none;stroke:rgba(200,160,255,.22);stroke-width:1}",
    ".jrTick{stroke:rgba(200,160,255,.45);stroke-width:1}",
    ".jrMon{font-size:10px;fill:var(--dim);opacity:.95;letter-spacing:.04em}",
    ".jrArc{fill:none;stroke-width:2.6;stroke-linecap:round;opacity:.7}",
    ".jrSoft{fill:none;stroke:#5fe0a0;stroke-width:5;opacity:.22;cursor:pointer}",
    ".jrHardArc{fill:none;stroke:#ff5470;stroke-width:5;stroke-linecap:butt;opacity:.9}",
    ".jrHit2{fill:none;stroke:transparent;stroke-width:13;cursor:pointer}",
    ".jrLane{fill:none;stroke-width:3;stroke-linecap:round;opacity:.8}",
    ".jrSais{fill:none;stroke:#ff5470;stroke-width:4;stroke-linecap:round;opacity:.42}",
    ".jrEcl{fill:#ff5470}",
    ".jrMv{fill:#fff3d8}.jrMn{fill:#0a0426;stroke:#cdb6ff;stroke-width:1.2}",
    ".jrNode{stroke:rgba(255,255,255,.5);stroke-width:1}",
    ".jrHalo{opacity:.14}.jrHalo.on{opacity:.34;animation:jrBeat 2.6s ease-in-out infinite;transform-box:fill-box;transform-origin:center}",
    ".jrHit{fill:transparent;cursor:pointer}",
    ".jrLab{font-size:11.5px;fill:var(--dim);pointer-events:none}.jrLab.on{fill:var(--zahl);font-weight:600}",
    ".jrHeute{fill:#fff;stroke-width:1.5}.jrPulse{opacity:.5;animation:jrBeat 2.2s ease-in-out infinite;transform-box:fill-box;transform-origin:center}",
    ".jrPtr{fill:var(--ueberschrift)}",
    ".jrMoonBg{fill:rgba(40,20,80,.7);stroke:rgba(200,160,255,.3);stroke-width:1}.jrMoonLit{fill:#f1e8ff}.jrMoonT{font-size:10px;fill:var(--dim);letter-spacing:.05em}.jrToneT{font-size:10.5px;letter-spacing:.05em;font-weight:600}",
    "@keyframes jrBeat{0%,100%{transform:scale(1);opacity:.4}50%{transform:scale(1.5);opacity:.12}}",
    "@media (prefers-reduced-motion:reduce){.jrHalo.on,.jrPulse{animation:none!important}}",
    ".jrLeg{display:grid;gap:.3rem;margin:.7rem .2rem .1rem;font-size:.72rem;color:var(--dim)}",
    ".jrLeg div{display:flex;flex-wrap:wrap;align-items:center;gap:.2rem .7rem}",
    ".jrLeg b{flex:0 0 3.4rem;font-weight:500;font-size:.6rem;letter-spacing:.14em;text-transform:uppercase;color:var(--ueberschrift)}",
    ".jrLeg span{display:inline-flex;align-items:center;gap:.35rem}.jrLeg i{display:inline-block;flex:none}",
    ".jrLeg i.d{width:.55rem;height:.55rem;border-radius:50%}.jrLeg i.mv{background:#fff3d8}.jrLeg i.mn{background:#0a0426;border:1.2px solid #cdb6ff}",
    ".jrLeg i.l{width:.9rem;height:3px;border-radius:2px;background:#ff5470}.jrLeg i.r{width:.5rem;height:.5rem;background:#ff5470;transform:rotate(45deg)}.jrLeg i.h{width:.55rem;height:.55rem;border-radius:50%;background:#fff;border:1.5px solid #5fe0a0;box-sizing:border-box}.jrLeg i.s{width:.9rem;height:4px;border-radius:2px;background:rgba(255,84,112,.5)}",
    ".jrCard{margin:.5rem .1rem 0;min-height:6.2rem;padding:.7rem .85rem .75rem;border:1px solid rgba(200,160,255,.25);border-left:3px solid var(--jc,var(--ueberschrift));border-radius:.9rem;background:rgba(20,8,48,.5);text-align:left}",
    ".jrHd{display:flex;align-items:center;justify-content:space-between;gap:.6rem}",
    ".jrName{font-family:Georgia,serif;font-weight:400;font-size:1.1rem;color:var(--zahl)}",
    ".jrSea{flex:none;font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;padding:.12rem .5rem;border-radius:999px;border:1px solid var(--jc,var(--ueberschrift));color:var(--zahl)}",
    ".jrWhen{display:block;font-size:.78rem;color:var(--ueberschrift);margin:.15rem 0 .4rem}",
    ".jrT{margin:0;font-size:.85rem;line-height:1.45;color:var(--dim)}",
    ".jrF{margin:.5rem 0 0;padding-top:.45rem;border-top:1px solid rgba(200,160,255,.15);font-family:Georgia,serif;font-style:italic;font-size:.84rem;line-height:1.35;color:var(--zahl)}.jrF small{display:block;font-family:system-ui,sans-serif;font-style:normal;font-size:.5rem;letter-spacing:.16em;text-transform:uppercase;color:var(--ueberschrift);margin-bottom:.1rem}",
    ".jrNote{margin:.7rem .1rem 0;font-size:.68rem;line-height:1.5;color:var(--dim);opacity:.9;text-align:left}",
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

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-b80.js ==== */
try{
/* ritual-b80.js — Build 80: Mondkarte (Tipp aufs Mond-Symbol), Wochenfarbe am Heute-Rand, stilles «So sei es» nach dem Ritual.
   Alles Overlay oder Farbe: keine neue Zeile auf der Heute-Seite. Zeiten in Berner Zeit (Europe/Zurich). Kein Ton, keine Vibration. */
(function(){
  if(window.__rr25b80) return; window.__rr25b80=1;
  var TZ="Europe/Zurich";
  function h(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function fmt(ms){
    try{ return new Intl.DateTimeFormat("de-CH",{timeZone:TZ,weekday:"short",day:"numeric",month:"numeric",hour:"2-digit",minute:"2-digit"}).format(new Date(ms)).replace(",",""); }catch(e){ return ""; }
  }
  function zday(ms){
    try{ var p=new Intl.DateTimeFormat("en-CA",{timeZone:TZ,year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date(ms)).split("-"); return Date.UTC(+p[0],+p[1]-1,+p[2])/86400000; }catch(e){ return Math.floor(ms/86400000); }
  }
  function inTage(ms,now){ var d=zday(ms)-zday(now); return d<=0?"heute":d===1?"morgen":"in "+d+" Tagen"; }
  /* ---------- 2) Wochenfarbe ---------- */
  var WK={0:["Sonne","255,200,87"],1:["Mond","170,196,255"],2:["Mars","255,90,74"],3:["Merkur","79,214,224"],4:["Jupiter","143,123,255"],5:["Venus","255,122,217"],6:["Saturn","154,160,181"]};
  function wochentag(){
    try{ var w=new Intl.DateTimeFormat("en-US",{timeZone:TZ,weekday:"short"}).format(new Date()); return ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(w); }catch(e){ return new Date().getDay(); }
  }
  function farbe(){ var w=WK[wochentag()]||WK[5]; document.documentElement.style.setProperty("--wk",w[1]); document.documentElement.setAttribute("data-wk",w[0]); }
  farbe(); document.addEventListener("visibilitychange",function(){ if(!document.hidden) farbe(); }); setInterval(farbe,30*60*1000);
  /* ---------- 1) Mondkarte ---------- */
  var KEY={neu:"Neumond",zu:"Zunehmender Mond",voll:"Vollmond",ab:"Abnehmender Mond"};
  var SATZ={neu:"Neu setzen. Still halten.",zu:"Wachsen lassen. Nicht hetzen.",voll:"Sichtbar. Nicht nachsetzen.",ab:"Abgeben. Was fällt, darf fallen."};
  function ton(){
    var K=window.RR25_KAL, k=""; try{ k=K&&K.state?K.state().kind:""; }catch(e){}
    return k==="HARD"?"Hard":k==="ECHO"?"Echo":k==="STILL"?"Still":"Soft";
  }
  function karte(){
    var M=window.RR25_MOND, now=Date.now(); if(!M) return "";
    var m=M.day(now), nf=M.next(2,now), nn=M.next(0,now), name=m.viertel===1?"Erstes Viertel":m.viertel===3?"Letztes Viertel":(KEY[m.key]||m.name);
    var pct=Math.round((1-Math.cos(m.p*2*Math.PI))/2*100), t=ton();
    function zeile(l,ms){ return ms?'<div class="mkR"><span>'+l+'</span><b>'+inTage(ms,now)+'</b><small>'+h(fmt(ms))+'</small></div>':""; }
    return '<div class="mkHead"><span class="mkSym">'+h(m.sym)+'</span><div><b>'+h(name)+'</b><small>'+pct+' % beleuchtet</small></div></div>'+
      '<p class="mkSay">'+h(SATZ[m.key]||"")+'</p>'+zeile("Vollmond",nf)+zeile("Neumond",nn)+
      '<div class="mkTon"><span>Ton heute</span><b class="mk'+t+'">'+t+'</b></div>'+
      '<p class="mkNote">Berner Zeit · Tipp daneben schliesst</p>';
  }
  function zu(){
    var b=document.getElementById("mkBack"), c=document.getElementById("mkCard"), w=document.getElementById("moonWrap");
    if(b) b.remove(); if(c) c.remove(); if(w) w.setAttribute("aria-expanded","false");
  }
  function auf(){
    zu(); var w=document.getElementById("moonWrap"); if(!w) return; var html=karte(); if(!html) return;
    var b=document.createElement("div"); b.id="mkBack"; b.onclick=zu;
    var c=document.createElement("div"); c.id="mkCard"; c.setAttribute("role","dialog"); c.setAttribute("aria-label","Mond"); c.innerHTML=html;
    var hd=document.querySelector("header"), top=hd?hd.getBoundingClientRect().bottom:60;
    c.style.top=(top+4)+"px";
    document.body.appendChild(b); document.body.appendChild(c); w.setAttribute("aria-expanded","true");
  }
  function mondInit(){
    var w=document.getElementById("moonWrap"); if(!w||w.__mk) return; w.__mk=1;
    w.setAttribute("role","button"); w.setAttribute("tabindex","0"); w.setAttribute("aria-expanded","false"); w.setAttribute("aria-label","Mondkarte öffnen"); w.style.cursor="pointer";
    w.addEventListener("click",function(){ if(document.getElementById("mkCard")) zu(); else auf(); });
    w.addEventListener("keydown",function(e){ if(e.key==="Enter"||e.key===" "){ e.preventDefault(); w.click(); } });
  }
  mondInit();
  document.addEventListener("keydown",function(e){ if(e.key==="Escape") zu(); });
  /* ---------- 3) So sei es ---------- */
  var fertig=0;
  function soSeiEs(){
    var old=document.getElementById("soSeiEs"); if(old) old.remove();
    var t=document.createElement("div"); t.id="soSeiEs"; t.setAttribute("role","status"); t.textContent="So sei es";
    document.body.appendChild(t);
    var k=document.getElementById("kOut"); if(k){ k.classList.remove("swGlow"); void k.offsetWidth; k.classList.add("swGlow"); }
    setTimeout(function(){ t.classList.add("aus"); },1500);
    setTimeout(function(){ t.remove(); if(k) k.classList.remove("swGlow"); },2100);
  }
  if(typeof show==="function"&&!show._b80){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="after") fertig=Date.now();
      else if(id==="home"){ if(fertig&&Date.now()-fertig<10*60*1000){ fertig=0; setTimeout(soSeiEs,250); } }
      else fertig=0;
      zu();
      return r;
    };
    show._b80=1;
  }
  var css=document.createElement("style");
  css.textContent=[
    "html #kOut{border-color:rgba(var(--wk,255,122,217),.36)!important;transition:border-color .6s,box-shadow 1.6s}",
    "html #kOut.swGlow{animation:swGlow 2s ease-out 1}",
    "@keyframes swGlow{0%{box-shadow:inset 0 0 0 1px rgba(255,255,255,.05),0 10px 24px rgba(0,0,0,.2),0 0 0 rgba(200,120,255,0)}30%{box-shadow:inset 0 0 0 1px rgba(255,255,255,.08),0 10px 24px rgba(0,0,0,.2),0 0 22px rgba(200,120,255,.5)}100%{box-shadow:inset 0 0 0 1px rgba(255,255,255,.05),0 10px 24px rgba(0,0,0,.2),0 0 0 rgba(200,120,255,0)}}",
    "#soSeiEs{position:fixed;left:50%;bottom:calc(6.2rem + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:60;pointer-events:none;font-family:Georgia,serif;font-size:1.15rem;letter-spacing:.14em;color:#f1e1ff;padding:.45rem 1.3rem;border-radius:999px;background:rgba(24,10,40,.78);border:1px solid rgba(200,120,255,.35);text-shadow:0 0 12px rgba(200,120,255,.7);animation:swIn .5s ease-out both;transition:opacity .55s}",
    "#soSeiEs.aus{opacity:0}",
    "@keyframes swIn{from{opacity:0;transform:translateX(-50%) translateY(6px)}to{opacity:1;transform:translateX(-50%)}}",
    "@media (prefers-reduced-motion:reduce){html #kOut.swGlow{animation:none}#soSeiEs{animation:none}#soSeiEs,html #kOut{transition:none}}",
    "#moonWrap:focus-visible{outline:1px solid rgba(200,120,255,.6);border-radius:.8rem}",
    "#mkBack{position:fixed;inset:0;z-index:70;background:transparent}",
    "#mkCard{position:fixed;left:.6rem;z-index:71;width:min(17.5rem,calc(100vw - 1.2rem));padding:.85rem .95rem .7rem;border-radius:1.1rem;background:linear-gradient(180deg,rgba(44,20,68,.97),rgba(14,8,24,.98));border:1px solid rgba(200,120,255,.35);box-shadow:0 14px 34px rgba(0,0,0,.5),0 0 18px rgba(160,90,255,.22);color:#e6d4ff}",
    ".mkHead{display:flex;align-items:center;gap:.7rem}.mkSym{font-size:2rem;line-height:1;filter:drop-shadow(0 0 6px rgba(170,100,255,.5))}.mkHead b{display:block;font-family:Georgia,serif;font-weight:400;font-size:1.05rem;color:#f1e1ff}.mkHead small{font-size:.66rem;color:#a994c4}",
    ".mkSay{margin:.55rem 0 .4rem;font-size:.78rem;line-height:1.4;color:#e6d4ff}",
    ".mkR{display:grid;grid-template-columns:4.6rem auto 1fr;align-items:baseline;gap:.4rem;padding:.2rem 0;font-size:.76rem;border-top:1px solid rgba(200,120,255,.12)}.mkR span{color:#d6a6ff;font-size:.62rem;letter-spacing:.14em;text-transform:uppercase}.mkR b{font-weight:600;color:#fff}.mkR small{text-align:right;color:#a994c4;font-size:.66rem}",
    ".mkTon{display:flex;justify-content:space-between;align-items:center;margin-top:.35rem;padding-top:.4rem;border-top:1px solid rgba(200,120,255,.12);font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:#d6a6ff}.mkTon b{font-size:.74rem;letter-spacing:.04em;text-transform:none;padding:.12rem .7rem;border-radius:999px;border:1px solid}",
    ".mkSoft{color:#5fe0a0;border-color:rgba(95,224,160,.5);background:rgba(46,204,113,.1)}.mkHard{color:#ff7a8e;border-color:rgba(255,84,112,.55);background:rgba(231,76,60,.12)}.mkEcho,.mkStill{color:#e6d4ff;border-color:rgba(200,120,255,.5);background:rgba(160,90,255,.14)}",
    ".mkNote{margin:.5rem 0 0;font-size:.58rem;color:#8e7aa8}"
  ].join("");
  document.head.appendChild(css);
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-b81.js ==== */
try{
/* ritual-b81.js — Build 81: Feld-Wetter-Wochenleiste im Kalender-Tab (7 Tage ab heute).
   Pro Tag: Wochentag, Ton (Soft/Hard/Grenze/Echo/Still aus RR25_KAL), Mondphase (RR25_MOND), Planetenfarbe des Wochentags.
   Tipp auf einen Tag zeigt Details darunter. Reine Anzeige, speichert nichts. */
(function(){
  if(window.__rr25b81) return; window.__rr25b81=1;
  var K=window.RR25_KAL, M=window.RR25_MOND; if(!K) return;
  var DN=["So","Mo","Di","Mi","Do","Fr","Sa"], DL=["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];
  var PL=[["Sonne","255,200,87"],["Mond","170,196,255"],["Mars","255,90,74"],["Merkur","79,214,224"],["Jupiter","143,123,255"],["Venus","255,122,217"],["Saturn","154,160,181"]];
  var SEL=0;
  function h(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function two(n){ return String(n).padStart(2,"0"); }
  function addDays(ms,n){ var d=new Date(ms); return new Date(d.getFullYear(),d.getMonth(),d.getDate()+n).getTime(); }
  function tstr(ms){ var d=new Date(ms); return two(d.getHours())+":"+two(d.getMinutes()); }
  function info(d0){
    var noon=d0+12*3600000, p=K.dayParts(noon), kind=p.kind, ton, hardFenster=false;
    p.items.forEach(function(x){ if(!x.all&&x.k==="HARD") hardFenster=true; });
    if(kind==="HARD") ton="Hard";
    else if(hardFenster) ton="Grenze";
    else ton={SOFT:"Soft",ECHO:"Echo",STILL:"Still"}[kind]||"Soft";
    var m=M?M.day(noon):null, wd=new Date(d0).getDay();
    return {d0:d0,wd:wd,ton:ton,p:p,moon:m,pl:PL[wd]};
  }
  function details(i){
    var d=new Date(i.d0), t=i.p.items.filter(function(x){ return !x.all; }).slice(0,3), a=i.p.items.filter(function(x){ return x.all&&!x.band&&x.k!=="SOFT"; }).slice(0,2);
    var rows=[];
    rows.push('<div class="wlH"><b>'+DL[i.wd]+' '+d.getDate()+'.'+(d.getMonth()+1)+'.</b><span class="wlT t'+i.ton+'">'+i.ton+'</span></div>');
    rows.push('<p class="wlP">Tag des Planeten <span style="color:rgb('+i.pl[1]+');font-weight:600">'+i.pl[0]+'</span>'+(i.moon?' · '+h(i.moon.name)+' '+h(i.moon.sym):'')+'</p>');
    var lines=a.concat(t).map(function(x){ return '<li><span>'+(x.all?"Tag":tstr(x.s)+"–"+tstr(x.e))+'</span>'+h(x.t||x.title||x.k)+'</li>'; });
    if(lines.length) rows.push('<ul class="wlL">'+lines.join("")+'</ul>');
    else rows.push('<p class="wlN">Nichts Besonderes eingetragen. Ein ruhiger Tag.</p>');
    return rows.join("");
  }
  function paint(){
    var sec=document.getElementById("kal"), list=document.getElementById("kalList"); if(!sec||!list) return;
    var box=document.getElementById("wkLeiste");
    if(!box){ box=document.createElement("div"); box.id="wkLeiste"; box.className="card"; sec.insertBefore(box,list); }
    var t0=new Date(); t0=new Date(t0.getFullYear(),t0.getMonth(),t0.getDate()).getTime();
    var days=[]; for(var n=0;n<7;n++) days.push(info(addDays(t0,n)));
    if(SEL>6) SEL=0;
    box.innerHTML='<p class="wlK">Feld-Wetter · 7 Tage</p><div class="wlRow" role="tablist">'+days.map(function(x,n){
      return '<button type="button" class="wlD'+(n===SEL?' on':'')+'" data-n="'+n+'" style="--pc:'+x.pl[1]+'" aria-label="'+DL[x.wd]+', '+x.ton+'" aria-pressed="'+(n===SEL)+'">'+
        '<span class="wlW">'+(n===0?'Heute':DN[x.wd])+'</span><span class="wlM">'+(x.moon?h(x.moon.sym):'')+'</span><span class="wlB t'+x.ton+'">'+x.ton+'</span><i></i></button>';
    }).join("")+'</div><div class="wlDet">'+details(days[SEL])+'</div>';
    [].slice.call(box.querySelectorAll(".wlD")).forEach(function(b){ b.onclick=function(){ SEL=+b.getAttribute("data-n"); paint(); }; });
  }
  function go(){ try{ paint(); }catch(e){} }
  if(typeof show==="function"&&!show._b81){ var sh=show; show=function(id){ var r=sh.apply(this,arguments); if(id==="kal"){ SEL=0; setTimeout(go,120); } return r; }; show._b81=1; }
  if(K.onReady) K.onReady(function(){ setTimeout(go,50); });
  setTimeout(go,600);
  var css=document.createElement("style");
  css.textContent=[
    "#wkLeiste{margin:0 0 .7rem;padding:.65rem .6rem .6rem;background:linear-gradient(180deg,rgba(40,18,62,.7),rgba(14,8,24,.9))!important;border:1px solid rgba(200,120,255,.22)!important;border-radius:1.1rem!important}",
    ".wlK{margin:0 0 .45rem .2rem;font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:#d6a6ff}",
    ".wlRow{display:grid;grid-template-columns:repeat(7,1fr);gap:.28rem}",
    ".wlD{position:relative;display:flex;flex-direction:column;align-items:center;gap:.18rem;padding:.4rem .1rem .5rem;min-height:0;border-radius:.8rem;border:1px solid rgba(var(--pc),.28);background:rgba(var(--pc),.06);color:#e6d4ff}",
    ".wlD.on{border-color:rgba(var(--pc),.75);background:rgba(var(--pc),.14);box-shadow:0 0 12px rgba(var(--pc),.28)}",
    ".wlD i{position:absolute;left:30%;right:30%;bottom:.22rem;height:2px;border-radius:2px;background:rgb(var(--pc));opacity:.7}",
    ".wlW{font-size:.62rem;letter-spacing:.04em;color:#cdbbe8}.wlM{font-size:1.05rem;line-height:1.2}",
    ".wlB{font-size:.54rem;padding:.04rem .3rem;border-radius:999px;border:1px solid;line-height:1.4}",
    ".tSoft{color:#5fe0a0;border-color:rgba(95,224,160,.45)}.tHard{color:#ff7a8e;border-color:rgba(255,84,112,.55)}.tGrenze{color:#ffb86b;border-color:rgba(255,184,107,.5)}.tEcho,.tStill{color:#e6d4ff;border-color:rgba(200,120,255,.5)}",
    ".wlDet{margin:.6rem .2rem 0;padding-top:.5rem;border-top:1px solid rgba(200,120,255,.14)}",
    ".wlH{display:flex;justify-content:space-between;align-items:center}.wlH b{font-family:Georgia,serif;font-weight:400;font-size:.98rem;color:#f1e1ff}.wlT{font-size:.68rem;padding:.08rem .6rem;border-radius:999px;border:1px solid}",
    ".wlP{margin:.3rem 0 .2rem;font-size:.74rem;color:#cdbbe8}.wlN{margin:.3rem 0 0;font-size:.74rem;color:#8e7aa8}",
    ".wlL{list-style:none;margin:.2rem 0 0;padding:0}.wlL li{font-size:.74rem;color:#e6d4ff;padding:.16rem 0}.wlL li span{display:inline-block;min-width:4.6rem;color:#a994c4;font-size:.66rem}"
  ].join("");
  document.head.appendChild(css);
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-b82.js ==== */
try{
/* ritual-b82.js — Build 82: Absicht-Tagebuch in der Chronik.
   Zeigt gesetzte Absichten (Tagesziel und Sigille/Zeichen) mit Verlauf: gesetzt, Echo, Wirkung.
   Echo und Wirkung sind dieselben Merker wie am Eintrag (rr25_tags_v1), keine neuen Schlüssel: Sichern und Wiederherstellen gelten schon.
   Kein Druck: keine Serien, kein «offen seit». */
(function(){
  if(window.__rr25b82) return; window.__rr25b82=1;
  var TK="rr25_tags_v1", OPEN=false, FILT="alle", MAXN=30, MORE=false;
  var DN=["So","Mo","Di","Mi","Do","Fr","Sa"];
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
  function absichten(){
    var T=tags(), out=[];
    rows().forEach(function(e){
      var ti=String(e&&e.titel||"").trim(), rz=/^(Rezept|Ritualbauer) · /.test(ti); if(ti!=="Tagesziel"&&ti!=="Sigille"&&!rz) return;
      var txt=rz?String(e.absicht||e.note||"").trim():String(e.note||e.wer||"").trim(); if(!txt) return;
      var ms=when(e); if(ms==null) return;
      var tg=T[String(e.id)]||[];
      out.push({id:String(e.id),kind:rz?"Ritualbauer":(ti==="Sigille"?"Zeichen":"Tagesziel"),txt:txt,fuer:rz?String(e.fuer||""):"",zeile:rz?String(e.zeile||""):"",ms:ms,wirk:tg.indexOf("Wirkung")>=0,echo:tg.indexOf("Echo")>=0});
    });
    out.sort(function(a,b){ return b.ms-a.ms; });
    return out;
  }
  function ago(ms){
    var n=Math.round((new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate())-new Date(new Date(ms).getFullYear(),new Date(ms).getMonth(),new Date(ms).getDate()))/86400000);
    return n<=0?"heute":n===1?"gestern":"vor "+n+" Tagen";
  }
  function dstr(ms){ var d=new Date(ms); return DN[d.getDay()]+" "+d.getDate()+"."+(d.getMonth()+1)+"."+d.getFullYear(); }
  function panel(){
    var all=absichten();
    var f=all.filter(function(a){ return FILT==="alle"||(FILT==="wirkung"&&a.wirk)||(FILT==="echo"&&a.echo)||(FILT==="ruhig"&&!a.wirk&&!a.echo); });
    var nW=all.filter(function(a){ return a.wirk; }).length, nE=all.filter(function(a){ return a.echo; }).length;
    var say=all.length?all.length+(all.length===1?" Absicht":" Absichten")+" gesetzt · "+nW+" mit Wirkung · "+nE+" mit Echo.":"Noch keine Absicht gesetzt. Ein Tagesziel oder ein Zeichen erscheint hier von selbst.";
    var FL=[["alle","Alle"],["wirkung","Mit Wirkung"],["echo","Mit Echo"],["ruhig","Noch ohne Merker"]];
    var shown=MORE?f:f.slice(0,MAXN);
    return '<p class="abSay">'+h(say)+'</p>'+(all.length?'<div class="abF">'+FL.map(function(x){ return '<button type="button" data-f="'+x[0]+'" class="'+(FILT===x[0]?"on":"")+'">'+x[1]+'</button>'; }).join("")+'</div>':'')+
      (shown.length?'<ul class="abL">'+shown.map(function(a){
        return '<li><div class="abT"><span class="abK">'+a.kind+'</span><span class="abD">'+dstr(a.ms)+' · '+ago(a.ms)+'</span></div><p class="abX">'+h(a.txt)+'</p>'+(a.fuer?'<p class="abF2">'+h(a.fuer)+'</p>':'')+(a.zeile?'<p class="abF2 i">'+h(a.zeile)+'</p>':'')+
          '<div class="shots abPic" data-pic="'+h(a.id)+'"></div><div class="abV"><span class="abDot on">gesetzt</span><button type="button" class="abDot'+(a.echo?" on":"")+'" data-id="'+h(a.id)+'" data-t="Echo" aria-pressed="'+a.echo+'">Echo</button><button type="button" class="abDot'+(a.wirk?" on":"")+'" data-id="'+h(a.id)+'" data-t="Wirkung" aria-pressed="'+a.wirk+'">Wirkung</button></div></li>';
      }).join("")+'</ul>':(all.length?'<p class="abNote">Nichts in dieser Auswahl.</p>':""))+
      (f.length>MAXN&&!MORE?'<button type="button" class="abMore">Ältere zeigen ('+(f.length-MAXN)+')</button>':'');
  }
  function paintPanel(){
    var p=document.getElementById("abPanel"); if(!p) return;
    p.hidden=!OPEN; if(!OPEN) return;
    p.innerHTML=panel();
    [].slice.call(p.querySelectorAll(".abF button")).forEach(function(b){ b.onclick=function(){ FILT=b.getAttribute("data-f"); paintPanel(); }; });
    if(typeof fotoGet==="function") [].slice.call(p.querySelectorAll(".abPic[data-pic]")).forEach(function(w){ fotoGet(w.getAttribute("data-pic")).then(function(arr){ if(arr&&arr[0]&&!w.querySelector("img")){ var im=document.createElement("img"); im.src=arr[0]; im.alt="Foto"; w.appendChild(im); } }).catch(function(){}); });
    var mo=p.querySelector(".abMore"); if(mo) mo.onclick=function(){ MORE=true; paintPanel(); };
    [].slice.call(p.querySelectorAll("button[data-id]")).forEach(function(b){ b.onclick=function(){
      var id=b.getAttribute("data-id"), t=b.getAttribute("data-t"), T=tags(), a=(T[id]||[]).slice(), i=a.indexOf(t);
      if(i>=0) a.splice(i,1); else a.push(t);
      if(a.length) T[id]=a; else delete T[id];
      setTags(T); paintPanel(); try{ if(typeof paintLog==="function") paintLog(); }catch(e){}
    }; });
  }
  function mount(){
    var sec=document.getElementById("log"), ent=document.getElementById("entries"); if(!sec||!ent) return;
    if(document.getElementById("abBtn")) return;
    var bar=document.getElementById("rbBar");
    if(!bar){ bar=document.createElement("div"); bar.id="rbBar"; sec.insertBefore(bar,ent); }
    var btn=document.createElement("button"); btn.type="button"; btn.className="btn ghost"; btn.id="abBtn"; btn.textContent="Absichten";
    bar.insertBefore(btn,bar.firstChild);
    var p=document.createElement("div"); p.id="abPanel"; p.className="card"; p.hidden=true;
    var rp=document.getElementById("rbPanel"); sec.insertBefore(p,rp&&rp.nextSibling?rp.nextSibling:ent);
    btn.onclick=function(){ OPEN=!OPEN; btn.classList.toggle("on",OPEN); btn.textContent=OPEN?"Absichten zu":"Absichten"; paintPanel(); };
  }
  if(typeof show==="function"&&!show._b82){ var sh=show; show=function(id){ var r=sh.apply(this,arguments); if(id==="log") setTimeout(mount,400); return r; }; show._b82=1; }
  if(typeof paintLog==="function"&&!paintLog._b82){ var pl=paintLog; paintLog=function(){ var r=pl.apply(this,arguments); setTimeout(paintPanel,120); return r; }; paintLog._b82=1; }
  setTimeout(mount,500);
  var css=document.createElement("style");
  css.textContent=[
    "#rbBar{gap:.4rem}",
    "#abBtn{min-height:2.1rem!important;padding:.35rem 1rem!important;font-size:.76rem!important;border-radius:999px!important;border:1px solid rgba(200,120,255,.35)!important;background:rgba(160,90,255,.1)!important;color:#e4ecff!important}",
    "#abBtn.on{box-shadow:0 0 14px rgba(200,120,255,.35)}",
    "#abPanel{margin:0 0 .8rem;padding:.75rem .8rem .7rem;background:linear-gradient(180deg,rgba(40,18,62,.78),rgba(14,8,24,.92))!important;border:1px solid rgba(200,120,255,.22)!important;border-radius:1.1rem!important}",
    "#abPanel[hidden]{display:none!important}",
    ".abSay{margin:0 0 .5rem;font-size:.8rem;color:#e6d4ff;line-height:1.4}",
    ".abF{display:flex;flex-wrap:wrap;gap:.3rem;margin:0 0 .5rem}.abF button{min-height:0;padding:.2rem .65rem;font-size:.66rem;border-radius:999px;border:1px solid rgba(200,120,255,.25);background:transparent;color:#cdbbe8}.abF button.on{background:rgba(160,90,255,.22);color:#f6e6ff;border-color:rgba(200,120,255,.6)}",
    ".abL{list-style:none;margin:0;padding:0}.abL li{padding:.55rem 0;border-top:1px solid rgba(200,120,255,.12)}",
    ".abT{display:flex;justify-content:space-between;gap:.5rem;align-items:baseline}.abK{font-size:.56rem;letter-spacing:.16em;text-transform:uppercase;color:#d6a6ff}.abD{font-size:.64rem;color:#a994c4}",
    ".abX{margin:.2rem 0 .35rem;font-family:Georgia,serif;font-size:.92rem;line-height:1.35;color:#f1e1ff}",
    ".abV{display:flex;gap:.3rem;flex-wrap:wrap}.abDot{min-height:0;font-size:.62rem;line-height:1.5;padding:.05rem .6rem;border-radius:999px;border:1px dashed rgba(200,120,255,.3);background:transparent;color:#8e7aa8}.abDot.on{border-style:solid;border-color:rgba(200,120,255,.65);color:#f6e6ff;background:rgba(160,90,255,.2);box-shadow:0 0 8px rgba(200,120,255,.3)}",
    ".abF2{margin:-.15rem 0 .35rem;font-size:.7rem;color:#a994c4}.abF2.i{font-style:italic}",
    ".abPic:empty{display:none}.abPic img{width:3.6rem;height:3.6rem;object-fit:cover;border-radius:.8rem;border:1px solid rgba(200,120,255,.35)}",
    ".abNote{margin:.4rem 0 0;font-size:.7rem;color:#8e7aa8}",
    ".abMore{margin:.4rem auto 0;display:block;min-height:0;padding:.25rem .9rem;font-size:.68rem;border-radius:999px;border:1px solid rgba(200,120,255,.25);background:transparent;color:#cdbbe8}"
  ].join("");
  document.head.appendChild(css);
  window.RR25_ABSICHT={list:absichten};
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-b83.js ==== */
try{
/* ritual-b83.js — Ritualbauer (Build 83, Build 86 ausgebaut): eigene Vollseite «Ritualbauer».
   Ablauf: Absicht (freier Satz, Themen als Vorschläge) · Für wen (mich, Person, Situation) · Ton Soft/Hard · Zutaten (Favoriten zuerst)
   · Hinweis, wann es passt (Tradition) -> Schritte: Vorbereitung, Standort, Absicht, Ich, Spiel, Quelle (Hard: Rückkehr, Anker).
   Danach Echo/Wirkung (rr25_tags_v1, fliesst ins Absicht-Tagebuch) und Chronik-Eintrag mit Absicht und «für wen».
   Speicher: rr25_rezepte (abwärtskompatibel, Präfix rr25: in Sichern/Wiederherstellen). Daten aus dem Lexikon (nur lesen). */
(function(){
  if(window.__rr25b83) return; window.__rr25b83=1;
  var KR="rr25_rezepte", KFAV="rr25_rz_fav", KT="rr25_tags_v1";
  var TH=[["schutz","Schutz"],["ruhe","Ruhe"],["herz","Herz"],["klaerung","Klärung"],["mut","Mut"],["heilung","Heilung"],["fuelle","Fülle"],["traum","Traum und Schwelle"],["ende","Abschluss"]];
  var SATZ={schutz:"Ich bin geschützt. Mein Feld ist geschlossen.",ruhe:"Ich bin ruhig. Ich lasse los.",herz:"Mein Herz ist offen und klar.",klaerung:"Ich sehe klar.",mut:"Ich bin mutig und ruhig.",heilung:"Ich lasse Heilung zu, in meinem Tempo.",fuelle:"Ich bin versorgt. Genug ist da.",traum:"Ich gehe sanft über die Schwelle.",ende:"Es ist gut. Ich schliesse ab."};
  /* Überlieferung: Wochentag (0 So … 6 Sa) und Mondphase, in eigenen Worten, als Tradition */
  var TRAD={schutz:{d:[2,6],m:["ab","neu"]},ruhe:{d:[1],m:["ab","neu"]},herz:{d:[5],m:["zu","voll"]},klaerung:{d:[3],m:["zu","voll"]},mut:{d:[2],m:["zu"]},heilung:{d:[0,1],m:["zu"]},fuelle:{d:[4],m:["zu","voll"]},traum:{d:[1],m:["voll","neu"]},ende:{d:[6],m:["ab","neu"]}};
  var DL=["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"], PN=["Sonne","Mond","Mars","Merkur","Jupiter","Venus","Saturn"];
  var MK={neu:"Neumond",zu:"zunehmender Mond",voll:"Vollmond",ab:"abnehmender Mond"};
  var ZA={"1":"den Anfang","2":"das Gegenüber","3":"das Wachstum","4":"den Boden","5":"die Bewegung","6":"den Ausgleich","7":"den Rückzug","8":"den Fluss","9":"den Abschluss"};
  var HM={"Wasser":"Stelle ein Glas Wasser bereit.","Kerze":"Zünde eine Kerze an und stell sie sicher hin.","Weihrauch":"Räuchere ein wenig Weihrauch, Fenster einen Spalt offen.","Myrrhe":"Räuchere ein wenig Myrrhe, Fenster einen Spalt offen.","Messer":"Lege das Messer bereit, nur zum Zeigen, nicht zum Schneiden.","Nagel":"Lege einen Nagel bereit.","Schlüssel":"Nimm einen Schlüssel in die Hand.","Faden":"Halte einen Faden bereit.","Besen":"Stelle den Besen bereit.","Schwefel":"Schwefel nur als Wort: schreib ihn auf, verbrenne nichts.","Kreide":"Nimm die Kreide zur Hand.","Salz":"Stelle eine Prise Salz bereit.","Wein":"Stelle ein Glas Wein bereit, ein Schluck genügt."};
  function low(x){ return x.charAt(0).toLowerCase()+x.slice(1); }
  function kurz(e){ return e.cat==="zahlen"&&e.num?"Zahl "+e.num:String(e.name).replace(" / "," oder "); }
  function zSatz(e){
    var n=String(e.name).replace(" / "," oder ");
    switch(e.cat){
      case "zahlen": return e.num&&ZA[e.num]?"Atme in die Zahl "+e.num+", "+ZA[e.num]+".":"Atme ruhig in die Zahl "+n+".";
      case "kraeuter": return "Nimm "+n+" dazu, als Duft, Tee oder Bild.";
      case "steine": return "Nimm einen Stein in die Hand: "+n+".";
      case "kerzen": return "Zünde die "+low(n)+" an und stell sie sicher hin.";
      case "farben": return "Gib der Farbe "+n+" Raum: ein Tuch, ein Licht oder ein Blick darauf.";
      case "rauch":
        if(/^Räucherkohle/.test(n)) return "Lege die Räucherkohle bereit, mit Schale und Sand darunter.";
        if(/^Räucherschale/.test(n)) return "Stelle die "+n+" bereit.";
        if(/^Rauch mit Mass/.test(n)) return "Räuchere mit Mass: wenig Rauch, Fenster einen Spalt offen.";
        return "Räuchere mit "+n+": wenig Rauch, Fenster einen Spalt offen.";
      case "hausmittel": return HM[n]||"Als Hausmittel dabei: "+n+". Ein wenig reicht.";
      default: return "Nimm "+n+" dazu.";
    }
  }
  var DATA=null, LINKS={}, st=0, PREV="home";
  var S0=function(){ return {th:"",ton:"Soft",txt:"",fm:"ich",fw:"",sel:[],name:"",_txtAuto:""}; };
  var S=S0(), VIEW=null;
  function js(k,d){ try{ var v=JSON.parse(localStorage.getItem(k)); return v==null?d:v; }catch(e){ return d; } }
  function buzz(full){ try{ if(navigator.vibrate) navigator.vibrate(full?[40,50,80,50,140]:[55]); }catch(e){} }
  function h(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function favs(){ var f=js(KFAV,[]); return Array.isArray(f)?f:[]; }
  function rez(){ var r=js(KR,[]); return Array.isArray(r)?r:[]; }
  function setRez(r){ try{ localStorage.setItem(KR,JSON.stringify(r)); }catch(e){} }
  function loadLex(){
    if(DATA||st) return; st=1;
    function one(u){ return fetch(u,{cache:"no-store"}).then(function(r){ if(!r.ok) throw 0; return r.json(); }); }
    Promise.all([one("resonanzen-a.json?v=47"),one("resonanzen-b.json?v=47"),one("resonanzen-c.json?v=47"),one("resonanzen-d.json?v=74"),one("resonanzen-links.json?v=74")]).then(function(p){
      DATA=[].concat(p[0]||[],p[1]||[],p[2]||[],p[3]||[]); LINKS=p[4]||{}; paint();
    }).catch(function(){ st=0; });
  }
  function toneOk(e,ton){ if(ton==="Hard") return true; var t=String(e.tone||"Soft"); return t==="Soft"||t==="Soft/Grenze"; }
  function vorschlag(){
    if(!DATA) return [];
    var F=favs(), pool=DATA.filter(function(e){ if(!toneOk(e,S.ton)) return false; if(!S.th) return F.indexOf(e.id)>=0; var l=LINKS[e.id]; return l&&(l.t||[]).indexOf(S.th)>=0; });
    pool.sort(function(a,b){ return (F.indexOf(b.id)>=0)-(F.indexOf(a.id)>=0)||String(a.name).localeCompare(String(b.name),"de"); });
    return pool.slice(0,9);
  }
  function zWeekday(){ try{ var w=new Intl.DateTimeFormat("en-US",{timeZone:"Europe/Zurich",weekday:"short"}).format(new Date()); var i=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(w); return i<0?new Date().getDay():i; }catch(e){ return new Date().getDay(); } }
  function wann(){
    var T=TRAD[S.th]; if(!T) return "";
    var days=T.d.map(function(i){ return DL[i]+" ("+PN[i]+")"; }).join(" oder "), moons=T.m.map(function(k){ return MK[k]; }).join(" oder ");
    var wd=zWeekday(), mk=""; try{ mk=window.RR25_MOND.day().key; }catch(e){}
    var okD=T.d.indexOf(wd)>=0, okM=T.m.indexOf(mk)>=0;
    var heute=okD&&okM?"Heute passt beides.":okD?"Heute passt der Wochentag.":okM?"Heute passt der Mond.":"Heute passt es nicht genau. Es geht auch so.";
    return "Als Tradition: "+days+", "+moons+". "+heute;
  }
  function fuerTxt(s){ return s.fm==="person"&&s.fw.trim()?s.fw.trim():s.fm==="situation"&&s.fw.trim()?s.fw.trim():""; }
  function fuerLab(s){ var w=fuerTxt(s); return s.fm==="ich"||!w?"für mich":(s.fm==="person"?"für "+w:"für "+w); }
  function build(){
    var hard=S.ton==="Hard", ab=(S.txt||"").trim()||SATZ[S.th]||"So sei es.", w=fuerTxt(S), fm=S.fm;
    var z=S.sel.map(function(id){ return DATA&&DATA.filter(function(e){ return e.id===id; })[0]; }).filter(Boolean);
    var wo=fm==="person"&&w?" für "+w:fm==="situation"&&w?" für "+w:"";
    var steps=[];
    steps.push(["Vorbereitung","Tu:|Ruhiger Ort. Wasser bereit."+(z.length?" Bereit: "+z.map(kurz).join(", ")+".":"")+(hard?"|Zeit für die Rückkehr einplanen. Anker bereithalten (Wasser, Salz).":"")]);
    steps.push(["Standort","Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin hier. Ich bin klar."]);
    steps.push(["Absicht",(w?"Für "+w+".||":"")+"Sprich leise, einmal ganz bewusst:|"+ab]);
    steps.push(["Ich ❤️","Frag dich in Ruhe:|Was will ich wirklich"+wo+"?||Warte, bis ein einfacher Satz kommt.",{rep:3,txt:ab}]);
    var tu=z.length?z.map(zSatz):["Ein kleiner Schritt von mir, hier und jetzt: Kerze, Atem oder Wasser."];
    var tr=z.filter(function(e){ return e.text; }).map(function(e){ return kurz(e)+": "+e.text; });
    steps.push(["Spiel 🙏","Was tue ich dafür"+wo+"?||Tu:|"+tu.join("|")+(tr.length?"||Aus der Tradition:|"+tr.join("|"):"")+"||Sprich:|Ich tue meinen Teil. Ich tue ihn gern.",{rep:6,txt:ab}]);
    steps.push(["Quelle 👁","Lass los"+(w?": "+w:"")+".||Tu:|Ein langer Atemzug. Hände öffnen.||Sprich:|Ich gebe es ab. Es ist gesät.",{rep:9,txt:"So sei es."}]);
    if(hard){ steps.push(["Rückkehr","Sprich:|Ich bin hier. Ich bin ganz bei mir.||Tu:|Füsse. Atem. Raum."]); steps.push(["Anker","Tu:|Wasser trinken. Salz kurz berühren. Etwas Alltägliches tun.||Sprich:|Anker gesetzt. Ich bin zurück."]); }
    else steps.push(["Schluss","Tu:|Wasser. Alltag."]);
    return steps;
  }
  function stepHtml(t){
    return String(t).split("||").map(function(b){ var L=b.split("|"); var head=L.shift(); return '<p class="rzRh">'+h(head)+'</p>'+L.map(function(x){ return '<p class="rzRl">'+h(x)+'</p>'; }).join(""); }).join("");
  }
  function defName(){ var t=TH.filter(function(x){ return x[0]===S.th; })[0]; return (t?t[1]:"Eigenes")+" · "+S.ton; }
  function cur(){ return {id:"rz"+Date.now().toString(36),v:2,name:(S.name||defName()).trim()||defName(),th:S.th,ton:S.ton,absicht:(S.txt||"").trim(),fuer:{m:S.fm,w:fuerTxt(S)},zut:S.sel.slice(),steps:build(),made:Date.now()}; }
  function viewer(r,i){
    var s=r.steps[i], last=i===r.steps.length-1, x=s[2]&&s[2].rep?s[2]:null, c=VIEW.c||0, n=x?x.rep:0;
    var cnt=x?'<div class="rzCnt"><p class="rzCq">'+h("«"+x.txt+"»")+'</p><button type="button" class="rzCb'+(c>=n?" fertig":"")+'" data-a="cnt" aria-live="polite"><span class="rzCn">'+c+' von '+n+'</span><small>'+(c>=n?"Geschafft":(c?"Weiter sprechen und tippen":"Sprich die Absicht und tippe"))+'</small></button></div>':'';
    return '<div class="rzV"><p class="rzVk">'+h(r.name)+' · '+(i+1)+' von '+r.steps.length+'</p><h4>'+h(s[0])+'</h4>'+stepHtml(s[1])+cnt+
      '<div class="rzVb"><button type="button" class="btn ghost" data-a="vb"'+(i===0?" disabled":"")+'>Zurück</button><button type="button" class="btn primary" data-a="vn">'+(last?"Abschliessen":"Weiter")+'</button></div></div><button type="button" class="rzLink" data-a="vx">Beenden</button>';
  }
  /* Status «Es ist so»: wie im Ritual-Runner (status() in ritual-runner-v2.js): nach dem letzten Schritt, optional, einmal */
  function status(){
    var on=!!VIEW.status;
    return '<div class="rzV"><h4>Status</h4><p class="rzRn">Optional, einmal. Feststellung statt Bitte. Nie Ersatz für So sei es.</p>'+
      '<div class="rzVb"><button type="button" class="btn ghost" data-a="stset"'+(on?" disabled":"")+'>'+(on?"Es ist so. Gesetzt.":"Es ist so")+'</button></div>'+
      '<div class="rzVb"><button type="button" class="btn primary" data-a="stnext">Weiter</button></div></div>';
  }
  function danach(){
    var E=VIEW.echo, W=VIEW.wirk, P=VIEW.pic;
    return '<div class="rzV"><h4>So sei es.</h4><p class="rzRn">Eine Zeile für später, nur wenn du magst: Echo ist, was zurückkommt. Wirkung ist, was sich bewegt.</p>'+
      '<div class="rzCh"><button type="button" data-tg="echo" class="'+(E?"on":"")+'" aria-pressed="'+!!E+'">Echo</button><button type="button" data-tg="wirk" class="'+(W?"on":"")+'" aria-pressed="'+!!W+'">Wirkung</button><button type="button" data-a="foto" class="'+(P?"on":"")+'">'+(P?"Foto neu":"Foto")+'</button></div>'+
      (P?'<div class="rzPic"><img alt="Foto zum Ritual" src="'+P+'"><button type="button" class="rzPicX" data-a="fotox" aria-label="Foto entfernen">Entfernen</button></div>':'')+
      '<input id="rzZeile" class="rzRi" maxlength="140" placeholder="Eine Zeile dazu (optional)" value="'+h(VIEW.zeile||"")+'" autocomplete="off">'+
      '<p class="rzRn">Das Foto bleibt nur auf diesem Gerät.</p>'+
      '<div class="rzVb"><button type="button" class="btn primary" data-a="done">Fertig</button></div></div>';
  }
  /* Foto: Kamera direkt, auf max. 1024 px verkleinert, JPEG 0.7, nur lokal (IndexedDB über fotoPut) */
  function shrink(file){
    return new Promise(function(res){
      var url=URL.createObjectURL(file), img=new Image();
      img.onload=function(){
        var w=img.naturalWidth||img.width, hh=img.naturalHeight||img.height, m=1024;
        if(w>m){ hh=Math.round(hh*m/w); w=m; } if(hh>m){ w=Math.round(w*m/hh); hh=m; }
        try{ var c=document.createElement("canvas"); c.width=w; c.height=hh; c.getContext("2d").drawImage(img,0,0,w,hh); URL.revokeObjectURL(url); res(c.toDataURL("image/jpeg",0.7)); }catch(e){ URL.revokeObjectURL(url); res(""); }
      };
      img.onerror=function(){ URL.revokeObjectURL(url); res(""); };
      img.src=url;
    });
  }
  function kamera(){
    var z=document.getElementById("rzZeile"); if(z) VIEW.zeile=z.value;
    var inp=document.createElement("input"); inp.type="file"; inp.accept="image/*"; inp.setAttribute("capture","environment");
    inp.style.cssText="position:fixed;left:-9999px;opacity:0"; document.body.appendChild(inp);
    inp.onchange=function(){
      var f=inp.files&&inp.files[0]; try{ inp.remove(); }catch(e){} if(!f) return;
      var v=VIEW; shrink(f).then(function(d){ if(d&&VIEW===v){ v.pic=d; paint(); } });
    };
    setTimeout(function(){ inp.click(); },30);
  }
  function builderHtml(){
    var sv=rez(), out='';
    out+='<p class="rzRh">1 · Absicht</p><textarea id="rzRt" class="rzRi rzTa" maxlength="160" rows="2" placeholder="Dein eigener Satz …">'+h(S.txt)+'</textarea>';
    out+='<p class="rzRn">Oder ein Thema als Vorschlag:</p><div class="rzCh">'+TH.map(function(t){ return '<button type="button" data-th="'+t[0]+'" class="'+(S.th===t[0]?"on":"")+'">'+t[1]+'</button>'; }).join("")+'</div>';
    out+='<p class="rzRh">2 · Für wen</p><div class="rzCh"><button type="button" data-fm="ich" class="'+(S.fm==="ich"?"on":"")+'">Für mich</button><button type="button" data-fm="person" class="'+(S.fm==="person"?"on":"")+'">Für eine Person</button><button type="button" data-fm="situation" class="'+(S.fm==="situation"?"on":"")+'">Für eine Situation</button></div>';
    if(S.fm!=="ich") out+='<input id="rzFw" class="rzRi" maxlength="'+(S.fm==="person"?40:80)+'" placeholder="'+(S.fm==="person"?"Name":"Kurz beschrieben")+'" value="'+h(S.fw)+'" autocomplete="off">';
    out+='<p class="rzRh">3 · Ton</p><div class="rzCh"><button type="button" data-ton="Soft" class="tS'+(S.ton==="Soft"?" on":"")+'">Soft</button><button type="button" data-ton="Hard" class="tH'+(S.ton==="Hard"?" on":"")+'">Hard</button></div>';
    if(S.ton==="Hard"){ var k=""; try{ k=window.RR25_KAL.state().kind; }catch(e){} out+='<p class="rzRn">Hard nur mit Rückkehr und Anker: beide Schritte sind fest eingebaut.'+(k&&k!=="HARD"?' Im Kalender ist gerade kein Hard-Fenster offen.':'')+'</p>'; }
    out+='<p class="rzRh">4 · Zutaten (bis 3, Favoriten zuerst)</p>';
    if(!DATA) out+='<p class="rzRn">Lexikon lädt…</p>';
    else { var F=favs(), v=vorschlag(); out+=v.length?'<div class="rzCh">'+v.map(function(e){ return '<button type="button" data-z="'+h(e.id)+'" class="'+(S.sel.indexOf(e.id)>=0?"on":"")+'">'+(F.indexOf(e.id)>=0?"★ ":"")+h(e.name)+'</button>'; }).join("")+'</div>':'<p class="rzRn">'+(S.th?"Dazu passt hier nichts. Das Ritual geht auch ohne Zutat.":"Wähle ein Thema, dann erscheinen passende Zutaten. Favoriten stehen immer zuerst.")+'</p>'; }
    var wn=wann(); if(wn) out+='<p class="rzRn rzWann">'+h(wn)+'</p>';
    var steps=build();
    out+='<p class="rzRh">Vorschau · '+steps.length+' Schritte</p><p class="rzRn">'+steps.map(function(s){ return h(s[0]); }).join(" → ")+'</p>';
    out+='<input id="rzRname" class="rzRi" maxlength="40" placeholder="Name" value="'+h((S._dn=defName(),S.name||S._dn))+'" autocomplete="off">';
    out+='<div class="rzVb"><button type="button" class="btn ghost" data-a="start">Jetzt durchgehen</button><button type="button" class="btn primary" data-a="save">Speichern</button></div>';
    if(sv.length){
      out+='<p class="rzRh">Meine Rituale</p><ul class="rzSv">'+sv.map(function(r,i){ var f=r.fuer&&r.fuer.w?" · für "+h(r.fuer.w):""; return '<li><button type="button" class="rzOpen" data-r="'+i+'"><b>'+h(r.name)+'</b><small>'+h(r.ton)+' · '+r.steps.length+' Schritte'+f+(r.rep?' · '+r.rep+'×':'')+'</small></button><button type="button" class="rzDel" data-d="'+i+'" aria-label="Ritual löschen">×</button></li>'; }).join("")+'</ul>';
    }
    return out;
  }
  function keep(){
    var t=document.getElementById("rzRt"), n=document.getElementById("rzRname"), w=document.getElementById("rzFw");
    if(t) S.txt=t.value; if(n) S.name=(n.value===S._dn)?"":n.value; if(w) S.fw=w.value;
  }
  function bind(p){
    function all(sel,fn){ [].slice.call(p.querySelectorAll(sel)).forEach(fn); }
    all("[data-th]",function(b){ b.onclick=function(){ keep(); var id=b.getAttribute("data-th"); var auto=S.th&&SATZ[S.th]; if(!S.txt.trim()||S.txt===auto) S.txt=SATZ[id]; S.th=id; S.sel=[]; paint(); }; });
    all("[data-fm]",function(b){ b.onclick=function(){ keep(); S.fm=b.getAttribute("data-fm"); paint(); if(S.fm!=="ich"){ var i=document.getElementById("rzFw"); if(i) i.focus(); } }; });
    all("[data-ton]",function(b){ b.onclick=function(){ keep(); S.ton=b.getAttribute("data-ton"); S.sel=[]; paint(); }; });
    all("[data-z]",function(b){ b.onclick=function(){ keep(); var id=b.getAttribute("data-z"), i=S.sel.indexOf(id); if(i>=0) S.sel.splice(i,1); else if(S.sel.length<3) S.sel.push(id); paint(); }; });
    all("[data-r]",function(b){ b.onclick=function(){ var r=rez()[+b.getAttribute("data-r")]; if(r){ VIEW={r:r,i:0}; paint(); } }; });
    all("[data-d]",function(b){ b.onclick=function(){ var a=rez(); a.splice(+b.getAttribute("data-d"),1); setRez(a); paint(); }; });
    all("[data-tg]",function(b){ b.onclick=function(){ var z=document.getElementById("rzZeile"); if(z) VIEW.zeile=z.value; var k=b.getAttribute("data-tg"); VIEW[k]=!VIEW[k]; paint(); }; });
    all("[data-a]",function(b){ b.onclick=function(){
      var a=b.getAttribute("data-a");
      if(a==="start"){ keep(); VIEW={r:cur(),i:0}; }
      else if(a==="save"){ keep(); var r=rez(); r.unshift(cur()); setRez(r.slice(0,30)); S=S0(); }
      else if(a==="cnt"){ var st=VIEW.r.steps[VIEW.i], x=st[2]&&st[2].rep?st[2]:null; if(x&&(VIEW.c||0)<x.rep){ VIEW.c=(VIEW.c||0)+1; if(VIEW.c>=x.rep){ buzz(x.rep>=9); var v=VIEW, ii=v.i; setTimeout(function(){ if(VIEW===v&&v.i===ii&&!v.fin){ v.c=0; if(v.i<v.r.steps.length-1) v.i++; else v.fin=true; paint(); } },900); } } }
      else if(a==="vb"){ VIEW.i=Math.max(0,VIEW.i-1); VIEW.c=0; }
      else if(a==="vn"){ VIEW.c=0; if(VIEW.i<VIEW.r.steps.length-1) VIEW.i++; else VIEW.fin=true; }
      else if(a==="stset"){ VIEW.status=true; }
      else if(a==="stnext"){ VIEW.sdone=true; }
      else if(a==="vx"){ VIEW=null; }
      else if(a==="foto"){ kamera(); return; }
      else if(a==="fotox"){ var z0=document.getElementById("rzZeile"); if(z0) VIEW.zeile=z0.value; VIEW.pic=""; }
      else if(a==="done"){ var z=document.getElementById("rzZeile"); if(z) VIEW.zeile=z.value; fin(VIEW); VIEW=null; S=S0(); close(); return; }
      paint();
    }; });
    var pi=p.querySelector(".rzPic img"); if(pi) pi.onclick=function(){ if(window._zoomPic) window._zoomPic(pi.src); };
    var ta=document.getElementById("rzRt"); if(ta) ta.addEventListener("input",function(){ S.txt=ta.value; });
  }
  function fin(V){
    var r=V.r;
    try{
      var fw=r.fuer&&r.fuer.w?r.fuer.w:"", fl=r.fuer&&r.fuer.m==="ich"?"für mich":(fw?"für "+fw:"");
      var id=typeof uid==="function"?uid():("r"+Date.now().toString(36));
      if(typeof load==="function"&&typeof save==="function"){
        var d=load(); d.log=d.log||[];
        d.log.unshift({id:id,t:typeof now==="function"?now():new Date().toLocaleString("de-CH"),titel:"Ritualbauer · "+r.name,wer:fl,note:(r.absicht||"")+(r.absicht&&fl?" · ":"")+fl,absicht:r.absicht||"",fuer:fl,zeile:(V.zeile||"").trim()});
        if(V.pic){ d.log[0].pics=1; }
        save(d);
        if(V.pic&&typeof fotoPut==="function") fotoPut(id,[V.pic]).then(function(){ if(typeof paintLog==="function") paintLog(); });
        var tg=[]; if(V.echo) tg.push("Echo"); if(V.wirk) tg.push("Wirkung");
        if(tg.length){ var T=js(KT,{}); if(!T||typeof T!=="object"||Array.isArray(T)) T={}; T[String(id)]=tg; try{ localStorage.setItem(KT,JSON.stringify(T)); }catch(e){} }
        if(typeof paintLog==="function") paintLog();
      }
    }catch(e){}
  }
  function paint(){
    var body=document.getElementById("rezBody"); if(!body) return;
    body.innerHTML=VIEW?(VIEW.fin?(VIEW.sdone?danach():status()):viewer(VIEW.r,VIEW.i)):builderHtml(); bind(body);
  }
  function ensure(){
    if(document.getElementById("rezept")) return;
    var main=document.querySelector("main"); if(!main) return;
    var s=document.createElement("section"); s.className="screen"; s.id="rezept";
    s.innerHTML='<div class="hero rezHero"><button type="button" id="rezBack" class="rezBackBtn" aria-label="Zurück">‹</button><h2>Ritualbauer</h2></div><div id="rezBody" class="card"></div>';
    main.appendChild(s);
    s.querySelector("#rezBack").onclick=close;
  }
  function open(){
    ensure(); loadLex();
    var on=document.querySelector(".screen.on"); if(on&&on.id!=="rezept") PREV=on.id;
    if(typeof show==="function") show("rezept");
    paint(); window.scrollTo(0,0);
  }
  function close(){ VIEW=null; if(typeof show==="function") show(PREV&&PREV!=="rezept"?PREV:"home"); }
  function mount(){
    var root=document.getElementById("resonanzen"); if(!root||document.getElementById("rzRezept")) return;
    var top=root.querySelector(".rzTop"); if(!top) return;
    var w=document.createElement("div"); w.id="rzRezept";
    w.innerHTML='<button type="button" class="btn ghost" id="rzRezBtn">Ritualbauer öffnen</button>';
    root.insertBefore(w,top); w.querySelector("#rzRezBtn").onclick=open;
  }
  ensure(); mount(); setTimeout(mount,500);
  if(typeof show==="function"&&!show._b83){ var sh=show; show=function(id){ var r=sh.apply(this,arguments); if(id==="resonanzen") setTimeout(mount,200); return r; }; show._b83=1; }
  var css=document.createElement("style");
  css.textContent=[
    "#rzRezept{margin:.1rem 0 .55rem}#rzRezBtn{min-height:2.75rem;padding:.35rem 1rem;font-size:.78rem;border-radius:999px;border:1px solid rgba(200,120,255,.35);background:rgba(160,90,255,.1);color:#e4ecff}",
    ".rezHero{display:flex;align-items:center;gap:.5rem}.rezHero h2{margin:0}.rezBackBtn{width:2.75rem;height:2.75rem;min-height:2.75rem;padding:0;border-radius:50%;border:1px solid rgba(200,120,255,.35);background:rgba(160,90,255,.1);color:#e4ecff;font-size:1.4rem;line-height:1}",
    "#rezBody{margin:.3rem 0 .8rem;padding:.8rem .85rem .9rem;background:linear-gradient(180deg,rgba(40,18,62,.78),rgba(14,8,24,.92))!important;border:1px solid rgba(200,120,255,.22)!important;border-radius:1.1rem!important}",
    ".rzRh{margin:.8rem 0 .3rem;font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:#d6a6ff}.rzRh:first-child{margin-top:0}",
    ".rzRl{margin:.12rem 0;font-size:.9rem;line-height:1.45;color:#f1e1ff}.rzRn{margin:.35rem 0;font-size:.72rem;line-height:1.4;color:#a994c4}.rzWann{color:#cdbbe8}",
    ".rzCh{display:flex;flex-wrap:wrap;gap:.35rem}.rzCh button{min-height:2.75rem;padding:.3rem .85rem;font-size:.78rem;border-radius:999px;border:1px solid rgba(200,120,255,.25);background:transparent;color:#cdbbe8}.rzCh button.on{background:rgba(160,90,255,.24);color:#f6e6ff;border-color:rgba(200,120,255,.65);box-shadow:0 0 8px rgba(200,120,255,.28)}",
    ".rzCh .tS.on{background:rgba(46,204,113,.14);border-color:rgba(95,224,160,.6);color:#5fe0a0}.rzCh .tH.on{background:rgba(231,76,60,.14);border-color:rgba(255,84,112,.6);color:#ff7a8e}",
    ".rzRi{display:block;width:100%;margin:.5rem 0 0;min-height:2.75rem;font-size:.9rem}.rzTa{min-height:4rem;resize:vertical;font-family:inherit}",
    ".rzVb{display:flex;gap:.5rem;margin-top:.8rem}.rzVb .btn{flex:1;min-height:2.75rem}",
    ".rzV h4{margin:.1rem 0 .4rem;font-family:Georgia,serif;font-weight:400;font-size:1.25rem;color:#f1e1ff}.rzVk{margin:0;font-size:.62rem;letter-spacing:.12em;color:#a994c4}",
    ".rzCnt{margin:.9rem 0 0;text-align:center}.rzCq{margin:0 0 .6rem;font-family:Georgia,serif;font-size:1rem;line-height:1.4;color:#f1e1ff}",
    ".rzCb{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.2rem;width:100%;min-height:7.5rem;border-radius:1.4rem;border:1px solid rgba(200,120,255,.5);background:radial-gradient(circle at 50% 40%,rgba(160,90,255,.28),rgba(20,10,34,.6));color:#f6e6ff;box-shadow:0 0 18px rgba(160,90,255,.25)}.rzCb:active{box-shadow:0 0 28px rgba(200,120,255,.55);transform:scale(.99)}",
    ".rzCn{font-family:Georgia,serif;font-size:2.4rem;line-height:1.1}.rzCb small{font-size:.7rem;color:#cdbbe8}.rzCb.fertig{border-color:rgba(95,224,160,.6);box-shadow:0 0 22px rgba(95,224,160,.25)}",
    "@media (prefers-reduced-motion:reduce){.rzCb:active{transform:none}}",
    ".rzPic{position:relative;margin:.7rem 0 0;display:flex;align-items:flex-end;gap:.7rem}.rzPic img{width:7rem;height:7rem;object-fit:cover;border-radius:1rem;border:1px solid rgba(200,120,255,.4);box-shadow:0 0 14px rgba(160,90,255,.25)}",
    ".rzPicX{min-height:2.75rem;padding:.3rem .9rem;border-radius:999px;border:1px solid rgba(200,120,255,.3);background:transparent;color:#cdbbe8;font-size:.76rem}",
    ".rzLink{display:block;margin:.7rem auto 0;background:none;border:0;color:#a994c4;font-size:.76rem;text-decoration:underline;min-height:2.75rem}",
    ".rzSv{list-style:none;margin:0;padding:0}.rzSv li{display:flex;gap:.3rem;align-items:center;border-top:1px solid rgba(200,120,255,.12)}.rzOpen{flex:1;text-align:left;background:none;border:0;padding:.5rem 0;min-height:2.75rem;color:#f1e1ff}.rzOpen b{display:block;font-weight:500;font-size:.9rem}.rzOpen small{font-size:.68rem;color:#a994c4}.rzDel{min-height:2.75rem;width:2.75rem;height:2.75rem;border-radius:50%;border:1px solid rgba(200,120,255,.25);background:transparent;color:#a994c4;padding:0}"
  ].join("");
  document.head.appendChild(css);
  window.RR25_REZEPT={list:rez,open:open,close:close,satz:zSatz};
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-b84.js ==== */
try{
/* ritual-b84.js — Build 84: Mond-Rückblick in der Chronik.
   Eine Seite pro Mondzyklus (Neumond bis Neumond, Berner Zeit aus RR25_MOND) mit Ritualen und Einträgen der Chronik, blätterbar.
   Zählt Rituale mit RR25_ZAEHLREGEL.isRitual. Nur lesen, keine neuen Schlüssel. Kein Streak, kein Vergleich. */
(function(){
  if(window.__rr25b84) return; window.__rr25b84=1;
  var TZ="Europe/Zurich", OPEN=false, OFF=0;
  var DAY=86400000;
  function js(k,d){ try{ var v=JSON.parse(localStorage.getItem(k)||"null"); return v==null?d:v; }catch(e){ return d; } }
  function h(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function when(e){
    var s=String(e&&e.t||""), m=s.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})(?:,?\s*(\d{1,2}):(\d{2}))?/);
    if(m) return new Date(+m[3],+m[2]-1,+m[1],+(m[4]||12),+(m[5]||0)).getTime();
    var p=Date.parse(s); return isNaN(p)?null:p;
  }
  function rows(){ try{ return (typeof load==="function"?load().log:js("rr25_ritual_v1",{}).log)||[]; }catch(e){ return []; } }
  function fd(ms){ try{ return new Intl.DateTimeFormat("de-CH",{timeZone:TZ,day:"numeric",month:"numeric"}).format(new Date(ms)); }catch(e){ return ""; } }
  function fdw(ms){ try{ return new Intl.DateTimeFormat("de-CH",{timeZone:TZ,weekday:"short",day:"numeric",month:"numeric"}).format(new Date(ms)).replace(",",""); }catch(e){ return ""; } }
  function fdt(ms){ try{ return new Intl.DateTimeFormat("de-CH",{timeZone:TZ,weekday:"short",day:"numeric",month:"numeric",hour:"2-digit",minute:"2-digit"}).format(new Date(ms)).replace(",",""); }catch(e){ return ""; } }
  /* Zyklus Nummer k: 0 = laufender, -1 = voriger ... */
  function zyklus(k){
    var M=window.RR25_MOND; if(!M) return null;
    var now=Date.now(), start=M.prev(0,now), end=M.next(0,now); if(start==null||end==null) return null;
    for(var i=0;i<-k;i++){ end=start; start=M.prev(0,start-1); if(start==null) return null; }
    var full=null; M.events(start,end).forEach(function(e){ if(e.q===2) full=e.t; });
    return {s:start,e:end,full:full,now:now>=start&&now<end};
  }
  function earliest(){ var m=Infinity; rows().forEach(function(e){ var t=when(e); if(t!=null&&t<m) m=t; }); return m; }
  function tone(e){ var t=window.RR25_TONE?window.RR25_TONE(e):"soft"; return t; }
  function stats(z){
    var R=window.RR25_ZAEHLREGEL, items=[], rit=0, by={}, ton={soft:0,hard:0};
    rows().forEach(function(e){
      var t=when(e); if(t==null||t<z.s||t>=z.e) return;
      var ti=String(e.titel||"").trim(), isR=R&&R.isRitual(e);
      items.push({t:t,ti:ti,note:String(e.note||e.wer||"").trim(),r:!!isR});
      if(isR){ rit++; by[ti]=(by[ti]||0)+1; var tn=tone(e); if(tn==="hard") ton.hard++; else if(tn==="soft") ton.soft++; }
    });
    items.sort(function(a,b){ return a.t-b.t; });
    var top=Object.keys(by).sort(function(a,b){ return by[b]-by[a]||a.localeCompare(b); }).slice(0,4).map(function(k){ return k+(by[k]>1?" ×"+by[k]:""); });
    return {items:items,rit:rit,top:top,ton:ton};
  }
  function panel(){
    var z=zyklus(OFF); if(!z) return '<p class="mzSay">Mondzeiten sind noch nicht geladen.</p>';
    var S=stats(z), first=earliest(), hasOlder=isFinite(first)&&first<z.s;
    var say=S.items.length?S.rit+(S.rit===1?" Ritual":" Rituale")+(S.items.length>S.rit?" und "+(S.items.length-S.rit===1?"1 weiterer Eintrag":(S.items.length-S.rit)+" weitere Einträge"):"")+" in diesem Zyklus.":(z.now?"In diesem Zyklus noch nichts in der Chronik.":"In diesem Zyklus nichts eingetragen. Auch das ist ein Zyklus.");
    var vm=z.full?'<li class="mzV"><span></span><b>Vollmond · '+h(fdt(z.full))+'</b></li>':'';
    var inserted=false, list=S.items.map(function(x){
      var pre=''; if(!inserted&&z.full&&x.t>z.full){ pre=vm; inserted=true; }
      return pre+'<li class="'+(x.r?"mzR":"")+'"><span>'+h(fdw(x.t))+'</span><b>'+h(x.ti)+'</b>'+(x.note&&x.note!==x.ti?'<small>'+h(x.note.slice(0,90))+'</small>':'')+'</li>';
    });
    if(!inserted&&z.full) list.push(vm);
    return '<div class="mzHead"><button type="button" class="rbNav" data-d="-1" aria-label="Voriger Zyklus"'+(hasOlder?'':' disabled')+'>‹</button><div><b>'+h(fd(z.s))+' – '+h(fd(z.e))+'</b><small>'+(z.now?'laufender Zyklus':'Neumond bis Neumond')+'</small></div><button type="button" class="rbNav" data-d="1" aria-label="Nächster Zyklus"'+(OFF>=0?' disabled':'')+'>›</button></div>'+
      '<p class="mzSay">'+h(say)+'</p>'+
      (S.rit?'<div class="rbPills"><span class="rbP on">Soft <b>'+S.ton.soft+'</b></span><span class="rbP on">Hard <b>'+S.ton.hard+'</b></span></div>':'')+
      (S.top.length?'<p class="mzTop">'+h(S.top.join(" · "))+'</p>':'')+
      (list.length?'<ul class="mzL">'+list.join("")+'</ul>':'')+
      '<p class="rbNote">Neumond bis Neumond, Berner Zeit.</p>';
  }
  function paint(){
    var p=document.getElementById("mzPanel"); if(!p) return;
    p.hidden=!OPEN; if(!OPEN) return;
    p.innerHTML=panel();
    [].slice.call(p.querySelectorAll(".rbNav")).forEach(function(b){ b.onclick=function(){ OFF+=+b.getAttribute("data-d"); if(OFF>0) OFF=0; paint(); }; });
  }
  function mount(){
    var sec=document.getElementById("log"), ent=document.getElementById("entries"); if(!sec||!ent||document.getElementById("mzBtn")) return;
    var bar=document.getElementById("rbBar"); if(!bar){ bar=document.createElement("div"); bar.id="rbBar"; sec.insertBefore(bar,ent); }
    var btn=document.createElement("button"); btn.type="button"; btn.className="btn ghost"; btn.id="mzBtn"; btn.textContent="Mondzyklus";
    bar.insertBefore(btn,bar.firstChild);
    var p=document.createElement("div"); p.id="mzPanel"; p.className="card"; p.hidden=true;
    var ref=document.getElementById("abPanel")||document.getElementById("rbPanel"); sec.insertBefore(p,ref&&ref.nextSibling?ref.nextSibling:ent);
    btn.onclick=function(){ OPEN=!OPEN; btn.classList.toggle("on",OPEN); btn.textContent=OPEN?"Zyklus zu":"Mondzyklus"; paint(); };
  }
  if(typeof show==="function"&&!show._b84){ var sh=show; show=function(id){ var r=sh.apply(this,arguments); if(id==="log") setTimeout(mount,600); return r; }; show._b84=1; }
  if(typeof paintLog==="function"&&!paintLog._b84){ var pl=paintLog; paintLog=function(){ var r=pl.apply(this,arguments); setTimeout(paint,140); return r; }; paintLog._b84=1; }
  setTimeout(mount,700);
  var css=document.createElement("style");
  css.textContent=[
    "#rbBar{flex-wrap:wrap}",
    "#mzBtn{min-height:2.1rem!important;padding:.35rem 1rem!important;font-size:.76rem!important;border-radius:999px!important;border:1px solid rgba(200,120,255,.35)!important;background:rgba(160,90,255,.1)!important;color:#e4ecff!important}#mzBtn.on{box-shadow:0 0 14px rgba(200,120,255,.35)}",
    "#mzPanel{margin:0 0 .8rem;padding:.75rem .8rem .7rem;background:linear-gradient(180deg,rgba(40,18,62,.78),rgba(14,8,24,.92))!important;border:1px solid rgba(200,120,255,.22)!important;border-radius:1.1rem!important}#mzPanel[hidden]{display:none!important}",
    ".mzHead{display:flex;align-items:center;justify-content:space-between;text-align:center}.mzHead b{display:block;font-family:Georgia,serif;font-weight:400;font-size:1.02rem;color:#e4ecff}.mzHead small{font-size:.62rem;letter-spacing:.12em;color:#a994c4}",
    ".mzSay{margin:.5rem 0 .4rem;font-size:.8rem;color:#e6d4ff;line-height:1.4}.mzTop{margin:.5rem 0 0;font-size:.74rem;color:#cdbbe8}",
    ".mzL{list-style:none;margin:.6rem 0 0;padding:0}.mzL li{display:grid;grid-template-columns:4.3rem 1fr;gap:.1rem .5rem;padding:.35rem 0;border-top:1px solid rgba(200,120,255,.1);font-size:.8rem;color:#cdbbe8}.mzL li span{color:#a994c4;font-size:.66rem;padding-top:.15rem}.mzL li b{font-weight:500}.mzL li.mzR b{color:#f1e1ff}.mzL li small{grid-column:2;font-size:.68rem;color:#8e7aa8;line-height:1.35}",
    ".mzL li.mzV b{color:#d6a6ff;font-size:.72rem;letter-spacing:.04em}"
  ].join("");
  document.head.appendChild(css);
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-b85.js ==== */
try{
/* ritual-b85.js — Build 85: kleiner Knopf «Ritualbauer» auf der Startseite, direkt unter den Ritual-Chips.
   Öffnet den Ritualbauer (eigene Vollseite, Build 86). Tippfläche 40 px, sichtbar nur eine kleine Pille; Seitenhöhe bleibt. */
(function(){
  if(window.__rr25b85) return; window.__rr25b85=1;
  function place(){
    var home=document.getElementById("home"), cats=document.getElementById("cats"); if(!home||!cats) return;
    var b=document.getElementById("rezHome");
    if(!b){
      b=document.createElement("button"); b.type="button"; b.id="rezHome"; b.className="chip"; b.setAttribute("aria-label","Ritualbauer öffnen, eigenes Ritual zusammenstellen");
      b.textContent="✦ Ritualbauer";
      b.onclick=function(){
        try{ window.RR25_REZEPT&&window.RR25_REZEPT.open(); }catch(e){}
      };
    }
    if(cats.nextElementSibling!==b) home.insertBefore(b,cats.nextSibling);
  }
  place();
  var home=document.getElementById("home");
  if(home&&window.MutationObserver){ var t; new MutationObserver(function(){ clearTimeout(t); t=setTimeout(place,30); }).observe(home,{childList:true}); }
  var css=document.createElement("style");
  css.textContent=[
    "#rezHome{display:flex;width:fit-content;align-items:center;justify-content:center;margin:4px auto 0;position:relative;padding:.38rem .7rem!important;font-size:.64rem!important;min-height:33.8px!important;white-space:nowrap}",
    "#rezHome::after{content:'';position:absolute;left:-2px;right:-2px;top:-4px;bottom:-4px}",
    "html body main:has(#home.on){padding-bottom:3.95rem!important}",
    "html #home #cats{margin-bottom:0!important}",
    "html #home #skizze{margin-top:0!important}",
    "#rezHome:active,#rezHome:focus-visible{border-color:rgba(200,120,255,.7);box-shadow:0 0 10px rgba(200,120,255,.3);color:#f6e6ff}"
  ].join("");
  document.head.appendChild(css);
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-b94.js ==== */
try{
/* ritual-b94.js — Build 94: Feinschliff. Nur Abstände, Tippflächen und Grössen, keine Logik.
   Heute-Seite: Tippflächen nur unsichtbar vergrössert (::after), damit die Höhe 1088 px bleibt. */
(function(){
  if(window.__rr25b94) return; window.__rr25b94=1;
  var css=document.createElement("style");
  css.textContent=[
    /* Heute: unsichtbar auf mindestens 40 px */
    "#home #cats .chip,#home .toneChip,#home #rezHome,#home .bkLater,#home .btn:not(#sigilSave){position:relative}",
    "#home #cats .chip::after{content:'';position:absolute;left:0;right:0;top:-3.2px;bottom:-3.2px}",
    "#home .toneChip::after{content:'';position:absolute;left:0;right:0;top:-4.6px;bottom:-4.6px}",
    "#home .bkLater::after{content:'';position:absolute;left:0;right:0;top:-4px;bottom:-4px}",
    "#home .btn:not(#sigilSave)::after{content:'';position:absolute;left:0;right:0;top:-3px;bottom:-3px}",
    /* andere Seiten: echte Mindesthöhe 40 px */
    "main .screen:not(#home) button:not(.kmDay):not(.kmNav){min-height:40px}",
    "html #abBtn,html #mzBtn,html #zlBtn,html #rbBtn{min-height:40px!important}",
    "html #rbBar{display:grid!important;grid-template-columns:1fr 1fr;gap:.45rem}",
    "#mehrSheet button,html #sxOut,html #sxIn{min-height:40px}",
    "html #logFilt .logchip{min-height:40px}",
    "html #logFilt .logchip.log-grau{font-size:.76rem;padding:.42rem .72rem;letter-spacing:0}",
    "button.rbTag,button.rbNav,#abPanel button{min-width:40px}",
    ".kmNav{width:40px;height:40px}",
    "button.kmYear{min-height:40px;min-width:40px}",
    ".kmDay{height:40px}"
  ].join("");
  document.head.appendChild(css);
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-b95.js ==== */
try{
/* ritual-b95.js — Build 95/96: Heute ohne Scrollen, Höhe voll genutzt.
   Ein Verdichtungsfaktor --f (0 = eng, 1 = grosszügig wie vor Build 95) wird per JS so gewählt, dass die
   Startseite bis und mit Tagesziel genau zwischen Kopfzeile und Tab-Leiste passt (gemessene Container-Höhe,
   kein fester Abzug). Alle Masse sind Mischungen zwischen eng und grosszügig. Nur Abstände, Höhen, Schriften;
   die Zeichen-Kachel skaliert nur proportional. Tippflächen >= 40 px (unsichtbar per ::after). */
(function(){
  if(window.__rr25b95) return; window.__rr25b95=1;
  var P="html body #home ";
  function L(a,b){ return "calc("+a+"px + "+(b-a)+" * var(--f) * 1px)"; }
  function N(a,b){ return "calc("+a+" + "+(b-a)+" * var(--f))"; }
  var rules=[
    ":root{--f:0.5}",
    "html body main:has(#home.on),html body #home.on{padding-bottom:0!important}",
    /* Kachelzeile */
    P+".duo{grid-template-columns:minmax(0,1fr) "+L(104,181)+"!important;gap:"+L(6,8)+"!important}",
    P+"#kOut,"+P+"#sigilBox{height:"+L(104,181)+"!important;min-height:0!important}",
    P+"#kOut{aspect-ratio:auto!important}",
    P+"#kOut .kcard{padding:"+L(4,8)+" "+L(8,10)+"!important}",
    P+"#kOut .kcard .group{margin:0 0 "+L(1,3)+"!important;font-size:"+L(9.3,9.9)+"!important}",
    P+"#kOut .kcard .kz{margin:0 0 "+L(1,4)+"!important;font-size:"+L(18,32)+"!important;line-height:1.05!important}",
    P+"#kOut .kcard b{margin:0 0 "+L(2,5)+"!important;font-size:"+L(14.2,15.8)+"!important;line-height:1.15!important}",
    P+"#kOut .kcard small{font-size:"+L(10.4,11.6)+"!important;line-height:"+N(1.28,1.38)+"!important}",
    P+"#sigHint{padding:calc("+L(104,181)+" * .066)!important;gap:calc("+L(104,181)+" * .029)!important;font-size:calc("+L(104,181)+" * .0613)!important}",
    P+"#sigHint b{font-size:calc("+L(104,181)+" * .1326)!important}",
    P+"#kasten{padding:1px 0!important;margin-bottom:0!important}",
    P+"#tools{margin-top:"+L(4,6)+"!important}",
    P+"#tools .tile{height:"+L(40,50)+"!important;min-height:0!important;padding:"+L(3,7)+" 2px!important}",
    P+"#tools .tile b{margin:0 0 "+L(1,3)+"!important;font-size:"+L(14.2,15.8)+"!important;line-height:1.05!important}",
    P+"#tools .tile span{font-size:"+L(8.7,9.4)+"!important;line-height:1!important}",
    P+"#sigRow{margin-top:"+L(4,6)+"!important}",
    P+"#sigilT{height:"+L(40,44)+"!important;padding-top:0!important;padding-bottom:0!important}",
    P+"#sigilSave{height:"+L(40,44)+"!important;padding-top:0!important;padding-bottom:0!important}",
    /* Ton-Zeile */
    P+"#toneRow{margin-top:"+L(5,10)+"!important;gap:"+L(3,6)+" 6px!important}",
    P+"#toneRow .toneChip{height:"+L(26,32)+"!important;min-height:0!important}",
    P+"#toneRow .toneChip::after{top:-7px!important;bottom:-7px!important}",
    P+"#toneAnker{font-size:"+L(9.9,11)+"!important;line-height:"+N(1.1,1.4)+"!important;margin:0!important;padding:0!important}",
    /* Sicherungskarte kompakt */
    P+"#bakCard{display:grid!important;grid-template-columns:minmax(0,1fr) auto;column-gap:8px;align-items:center;margin:"+L(3,9)+" 0 0!important;padding:"+L(3,9)+" 10px!important}",
    P+"#bakCard .bkTag{grid-column:1;margin:0!important;font-size:"+L(7.8,8.7)+"!important;line-height:1.1!important}",
    P+"#bakCard .bkHead{grid-column:1;font-size:"+L(13.2,15.3)+"!important;line-height:1.15!important}",
    P+"#bakCard .bkSub{grid-column:1;margin:"+L(1,3)+" 0 0!important;font-size:"+L(9.6,11.1)+"!important;line-height:1.2!important}",
    P+"#bakCard .bkBtns{grid-column:2;grid-row:1/4;margin:0!important;display:flex!important;flex-direction:column;align-items:stretch;gap:2px}",
    P+"#bakCard .bkBtns .btn{height:"+L(32,38)+"!important;min-height:0!important;padding:0 12px!important;width:auto!important;flex:none!important}",
    P+"#bakCard .bkBtns .btn::after{top:-4px!important;bottom:-4px!important}",
    P+"#bakCard .bkLater{height:"+L(26,30)+"!important;text-align:center}",
    P+"#bakCard .bkLater::after{top:-7px!important;bottom:-7px!important}",
    /* Satzzeilen */
    P+"#mondSag{margin:"+L(3,10)+" 0 "+L(2,7)+"!important;font-size:"+L(11.4,12.9)+"!important;line-height:1.15!important}",
    P+"#feldZeile{margin:-4px 0 0!important;font-size:"+L(9.9,11.2)+"!important;line-height:1.15!important}",
    P+"#pinDank{margin:"+L(3,6)+" 0 0!important;padding-top:"+L(5,11)+"!important;padding-bottom:"+L(5,11)+"!important}",
    P+"#pinDank b{font-size:"+L(13.8,15.3)+"!important;line-height:1.15!important}",
    P+"#pinDank small{font-size:"+L(9.9,11.25)+"!important;line-height:1.15!important;margin-top:"+L(1,3)+"!important}",
    /* Chips */
    P+"#v3CatLab{margin:"+L(4,14)+" 0 "+L(2,6)+"!important;font-size:"+L(7.8,9)+"!important;line-height:1!important}",
    P+"#cats{overflow:visible!important}",
    P+"#cats .chip,"+P+"#rezHome{min-height:0!important;height:"+L(26,35)+"!important;padding-top:0!important;padding-bottom:0!important}",
    P+"#cats .chip::after,"+P+"#rezHome::after{top:-7px!important;bottom:-7px!important}",
    P+"#rezHome{margin-top:"+L(3,6)+"!important}",
    /* Skizze: Kreise und Tagesziel */
    P+"#skizze{margin-top:"+L(2,8)+"!important}",
    P+"#skizze > svg{display:block;height:"+L(46,159)+"!important;width:100%!important}",
    P+"#skizze .skForm{display:grid!important;grid-template-columns:minmax(0,1fr) auto;column-gap:6px;align-items:center;margin:0!important;padding:"+L(4,12)+" 8px "+L(5,13)+"!important}",
    P+"#skizze .skForm small{grid-column:1/3;margin:0 0 "+L(1,5)+"!important;font-size:"+L(7.8,8.7)+"!important;line-height:1.1!important}",
    P+"#skizze #skZielT{grid-column:1;height:"+L(40,44)+"!important;margin:0!important;padding-top:0!important;padding-bottom:0!important}",
    P+"#skizze #skZielGo{grid-column:2;position:relative;height:"+L(32,38)+"!important;min-height:0!important;margin:0!important;padding:0 12px!important;width:auto!important}",
    P+"#skizze #skZielGo::after{content:'';position:absolute;left:-4px;right:-4px;top:-4px;bottom:-4px}"
  ];
  var css=document.createElement("style"); css.textContent=rules.join("\n"); document.head.appendChild(css);

  /* Passung: grösstes f in [0,1], bei dem der Inhalt über der Tab-Leiste endet */
  var RES=8, busy=false, timer=0;
  function geom(){
    var hd=document.querySelector("header"), nv=document.querySelector("nav"), end=document.querySelector("#home #skizze .skForm")||document.getElementById("skizze");
    if(!hd||!end) return null;
    var vh=window.visualViewport?window.visualViewport.height:window.innerHeight;
    var nt=nv&&nv.getBoundingClientRect().height>0?nv.getBoundingClientRect().top:vh;
    return {nt:Math.min(nt,vh), end:end};
  }
  function fit(){
    var h=document.getElementById("home"); if(!h||!h.classList.contains("on")) return;
    var g=geom(); if(!g||!g.end.getBoundingClientRect().height) return;
    var root=document.documentElement, lo=0, hi=1, best=0, target=g.nt-RES;
    function bottom(f){ root.style.setProperty("--f",f); return g.end.getBoundingClientRect().bottom; }
    busy=true;
    if(bottom(1)<=target){ best=1; }
    else { for(var i=0;i<9;i++){ var m=(lo+hi)/2; if(bottom(m)<=target){ best=m; lo=m; } else hi=m; } }
    root.style.setProperty("--f",best.toFixed(4));
    window.RR25_HEUTE_FIT={f:best,bottom:g.end.getBoundingClientRect().bottom,navTop:g.nt};
    busy=false;
  }
  function later(){ if(busy) return; clearTimeout(timer); timer=setTimeout(fit,40); }
  window.addEventListener("resize",later);
  if(window.visualViewport) window.visualViewport.addEventListener("resize",later);
  window.addEventListener("load",function(){ later(); setTimeout(fit,600); setTimeout(fit,1800); });
  var home=document.getElementById("home");
  if(home&&window.MutationObserver){ new MutationObserver(later).observe(home,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:["class","hidden"]}); }
  if(document.fonts&&document.fonts.ready) document.fonts.ready.then(later);
  later();
})();

}catch(e){setTimeout(function(){throw e;});}
