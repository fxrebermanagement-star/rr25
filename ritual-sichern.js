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
    "#sxBox .sxRow{display:flex;gap:.4rem;flex-wrap:wrap}#sxBox .sxRow .btn{flex:1;min-height:2.5rem!important;height:auto!important;padding:.5rem .6rem!important;display:flex!important;align-items:center;justify-content:center;font-size:.8rem!important;border-radius:.9rem!important;border:1px solid rgba(200,120,255,.25)!important;background:rgba(160,90,255,.1)!important;color:#e4ecff!important}#sxBox .sxRow .btn.primary{background:linear-gradient(160deg,#7b3fb0,#4a1f72)!important}"+
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
