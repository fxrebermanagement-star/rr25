(function(){
  var BAK="rr25_pack_bak";
  var IDB_NAME="rr25_db";
  var IDB_STORE="pack";

  function allKeys(){
    var keys=[], i;
    for(i=0;i<localStorage.length;i++){
      var k=localStorage.key(i);
      if(k && k.indexOf("rr25")===0) keys.push(k);
    }
    ["rr25_ritual_v1","rr25_notiz_v1","rr25_wer","rr25_personen","rr25_369","rr25_dank","rr25_kleid"].forEach(function(k){
      if(keys.indexOf(k)<0 && localStorage.getItem(k)!=null) keys.push(k);
    });
    return keys;
  }

  function pack(){
    var p={v:3,t:new Date().toISOString()};
    allKeys().forEach(function(k){
      if(k===BAK) return;
      var v=localStorage.getItem(k);
      if(v!=null) p[k]=v;
    });
    return p;
  }

  function apply(p){
    if(!p||typeof p!=="object") return false;
    if(p.rr25 && !p.rr25_ritual_v1) p.rr25_ritual_v1=typeof p.rr25==="string"?p.rr25:JSON.stringify(p.rr25);
    if(p.wer && !p.rr25_wer) p.rr25_wer=typeof p.wer==="string"?p.wer:JSON.stringify(p.wer);
    if(p.dank && !p.rr25_dank) p.rr25_dank=p.dank;
    if(p.z && !p.rr25_369) p.rr25_369=typeof p.z==="string"?p.z:JSON.stringify(p.z);
    var n=0;
    Object.keys(p).forEach(function(k){
      if(k==="v"||k==="t"||k==="rr25"||k==="wer"||k==="dank"||k==="z") return;
      var v=p[k];
      if(v==null) return;
      localStorage.setItem(k, typeof v==="string"?v:JSON.stringify(v));
      n++;
    });
    return n>0;
  }

  function snap(){
    try{
      var p=pack();
      localStorage.setItem(BAK, JSON.stringify(p));
      idbPut(p);
    }catch(e){}
  }

  function idbOpen(){
    return new Promise(function(ok,fail){
      if(!window.indexedDB) return fail();
      var req=indexedDB.open(IDB_NAME,1);
      req.onupgradeneeded=function(){ req.result.createObjectStore(IDB_STORE); };
      req.onsuccess=function(){ ok(req.result); };
      req.onerror=function(){ fail(); };
    });
  }
  function idbPut(p){
    idbOpen().then(function(db){
      var tx=db.transaction(IDB_STORE,"readwrite");
      tx.objectStore(IDB_STORE).put(p,"last");
    }).catch(function(){});
  }
  function idbGet(){
    return idbOpen().then(function(db){
      return new Promise(function(ok){
        var tx=db.transaction(IDB_STORE,"readonly");
        var q=tx.objectStore(IDB_STORE).get("last");
        q.onsuccess=function(){ ok(q.result||null); };
        q.onerror=function(){ ok(null); };
      });
    }).catch(function(){ return null; });
  }

  function emptyRitual(){
    try{
      var raw=localStorage.getItem("rr25_ritual_v1");
      if(!raw) return true;
      var d=JSON.parse(raw);
      return !(d && ((d.log&&d.log.length)||(d.planned&&d.planned.length)));
    }catch(e){ return true; }
  }
  function emptyNotes(){
    try{
      var a=JSON.parse(localStorage.getItem("rr25_notiz_v1")||"[]");
      return !Array.isArray(a)||!a.length;
    }catch(e){ return true; }
  }

  function restoreIfNeeded(p){
    if(!p) return false;
    var need=emptyRitual()||emptyNotes()||!localStorage.getItem("rr25_ritual_v1");
    if(!need) return false;
    return apply(p);
  }

  try{
    var raw=localStorage.getItem(BAK)||localStorage.getItem("rr25_bak");
    if(raw){ try{ restoreIfNeeded(JSON.parse(raw)); }catch(e){} }
  }catch(e){}
  idbGet().then(function(p){ if(restoreIfNeeded(p)) location.reload(); });

  if(typeof save==="function"){
    var _s=save;
    save=function(d){ _s(d); snap(); };
  }
  if(typeof saveNotes==="function"){
    var _n=saveNotes;
    saveNotes=function(a){ _n(a); snap(); };
  }
  snap();
  setInterval(snap,20000);
  document.addEventListener("visibilitychange",function(){ if(document.hidden) snap(); });

  function dump(){
    snap();
    var blob=new Blob([JSON.stringify(pack(),null,2)],{type:"application/json"});
    var a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="rr25-sicherung.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function(){ URL.revokeObjectURL(a.href); },800);
  }
  function take(file){
    var r=new FileReader();
    r.onload=function(){
      try{
        var p=JSON.parse(r.result);
        if(!apply(p)) throw new Error("leer");
        snap();
        location.reload();
      }catch(e){ alert("Datei nicht lesbar"); }
    };
    r.readAsText(file);
  }
  function bar(host){
    if(!host||host.querySelector(".bakBar")) return;
    var box=document.createElement("div");
    box.className="row bakBar";
    box.style.margin=".15rem 0 .7rem";
    box.innerHTML='<button type="button" class="btn ghost bakOut">Sichern</button>'+
      '<button type="button" class="btn ghost bakIn">Holen</button>'+
      '<input class="bakFile" type="file" accept="application/json,.json" hidden>';
    var hero=host.querySelector(".hero");
    if(hero&&hero.nextSibling) host.insertBefore(box, hero.nextSibling);
    else host.insertBefore(box, host.firstChild);
    box.querySelector(".bakOut").onclick=dump;
    box.querySelector(".bakIn").onclick=function(){ box.querySelector(".bakFile").click(); };
    box.querySelector(".bakFile").onchange=function(){ if(this.files[0]) take(this.files[0]); };
  }
  function place(){
    bar(document.getElementById("log"));
    bar(document.getElementById("notiz"));
  }
  if(typeof show==="function"){
    var _show=show;
    show=function(id){ var r=_show.apply(this,arguments); if(id==="log"||id==="notiz") place(); return r; };
  }
  place();
})();
