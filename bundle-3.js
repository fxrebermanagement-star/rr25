/* rr25 · Paket 3/7 · Build 46 · erzeugt mit tools/bundle.py. Nicht von Hand bearbeiten:
   Quelldatei ändern und neu erzeugen. Inhalt in dieser Reihenfolge: ritual-sigil.js, ritual-log.js, ritual-notes.js, ritual-plus.js, ritual-nav.js, ritual-layout.js, ritual-look.js, ritual-extra.js, ritual-zahl.js, ritual-home.js, ritual-backup.js, pwa.js, ritual-log-fix.js, ritual-polish.js, ritual-mond.js, ritual-skizze.js */
/* ==== ritual-sigil.js ==== */
try{
(function(){
  var KEY="rr25_sigil";
  var L={B:[[.3,.15],[.3,.85],[.3,.15],[.7,.28],[.3,.5],[.7,.72],[.3,.85]],C:[[.72,.22],[.3,.2],[.28,.8],[.72,.78]],D:[[.3,.15],[.3,.85],[.3,.15],[.72,.5],[.3,.85]],F:[[.3,.85],[.3,.15],[.72,.15],[.3,.15],[.3,.5],[.62,.5]],G:[[.7,.22],[.3,.22],[.28,.78],[.7,.78],[.7,.52],[.5,.52]],H:[[.28,.15],[.28,.85],[.28,.5],[.72,.5],[.72,.15],[.72,.85]],J:[[.68,.15],[.68,.7],[.5,.85],[.32,.7]],K:[[.3,.15],[.3,.85],[.3,.5],[.72,.15],[.3,.5],[.72,.85]],L:[[.32,.15],[.32,.85],[.7,.85]],M:[[.22,.85],[.22,.15],[.5,.55],[.78,.15],[.78,.85]],N:[[.28,.85],[.28,.15],[.72,.85],[.72,.15]],P:[[.3,.85],[.3,.15],[.68,.15],[.7,.38],[.3,.48]],Q:[[.5,.2],[.28,.38],[.28,.7],[.5,.85],[.72,.7],[.72,.38],[.5,.2]],R:[[.3,.85],[.3,.15],[.68,.15],[.7,.38],[.3,.48],[.7,.85]],S:[[.7,.22],[.32,.2],[.3,.48],[.7,.52],[.7,.8],[.3,.82]],T:[[.22,.18],[.78,.18],[.5,.18],[.5,.85]],V:[[.22,.15],[.5,.85],[.78,.15]],W:[[.18,.15],[.32,.85],[.5,.4],[.68,.85],[.82,.15]],X:[[.25,.18],[.75,.82],[.75,.18],[.25,.82]],Y:[[.22,.15],[.5,.5],[.78,.15],[.5,.5],[.5,.85]],Z:[[.25,.18],[.75,.18],[.25,.82],[.75,.82]]};
  function red(s){
    s=String(s||"").toUpperCase().replace(/[ÄÖÜAEIOU\s0-9.,;:!?'"\-]/g,"");
    var o="",seen={};
    for(var i=0;i<s.length;i++){ var c=s[i]; if(!seen[c]){ seen[c]=1; o+=c; } }
    return o;
  }
  function loadS(){ try{ return JSON.parse(localStorage.getItem(KEY)||"{}"); }catch(e){ return{}; } }
  function saveS(d){ localStorage.setItem(KEY, JSON.stringify(d)); }
  function canvas(){
    var c=document.getElementById("sigilC"); if(!c) return null;
    var r=c.getBoundingClientRect();
    var w=Math.max(320, Math.round(r.width*2)||320);
    var h=Math.max(320, Math.round(r.height*2)||320);
    if(c.width!==w||c.height!==h){ c.width=w; c.height=h; }
    return c;
  }
  function draw(letters){
    var c=canvas(); if(!c) return;
    var ctx=c.getContext("2d"), w=c.width, h=c.height, m=Math.min(w,h);
    ctx.fillStyle="#08040e"; ctx.fillRect(0,0,w,h);
    var n=(letters||"").length;
    if(!n) return;
    ctx.save();
    ctx.translate(w/2,h/2);
    var lw=Math.max(7,m/28);
    for(var i=0;i<n;i++){
      var pts=L[letters[i]]||L.X;
      ctx.save();
      ctx.rotate((Math.PI*2*i)/n);
      ctx.lineCap="round"; ctx.lineJoin="round";
      ctx.shadowColor="#ff7ad9"; ctx.shadowBlur=m/10;
      ctx.strokeStyle="#ff9ad8"; ctx.lineWidth=lw;
      ctx.beginPath();
      pts.forEach(function(p,k){
        var x=(p[0]-.5)*m*0.92, y=(p[1]-.5)*m*0.92;
        if(k) ctx.lineTo(x,y); else ctx.moveTo(x,y);
      });
      ctx.stroke();
      ctx.shadowBlur=0;
      ctx.strokeStyle="#fff4fb"; ctx.lineWidth=lw*0.32;
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }
  function field(){ return document.getElementById("sigilT")||document.querySelector("#sigRow input,#underR input"); }
  function go(){
    var t=field()?field().value:"";
    var letters=red(t);
    draw(letters);
    saveS({t:t,l:letters});
  }
  function restore(){
    var d=loadS();
    var el=field();
    if(el&&d.t) el.value=String(d.t).toUpperCase();
    draw(d.l||"");
  }
  window._sigilGo=go;
  document.addEventListener("click",function(e){
    if(e.target&&(e.target.id==="sigilGo"||(e.target.closest&&e.target.closest("#sigilGo")))){
      e.preventDefault(); go();
    }
  },true);
  document.addEventListener("keydown",function(e){
    if(e.key==="Enter"&&e.target&&e.target.id==="sigilT") go();
  });
  setTimeout(restore,80);
  setTimeout(restore,500);
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-log.js ==== */
function escAttr(s){
  return String(s||"").replace(/&/g,"\u0026amp;").replace(/</g,"\u0026lt;").replace(/>/g,"\u0026gt;").replace(/"/g,"\u0026quot;");
}
function wesenTxt(e){
  return (e && e.wesen) ? "Mit Wesenheit" : "Ohne Wesenheit";
}
function delLog(id){
  var d=load();
  d.log=(d.log||[]).filter(function(x){ return x.id!==id; });
  save(d);
}
function saveLogNote(id,tx){
  var d=load();
  var e=(d.log||[]).find(function(x){ return x.id===id; });
  if(e){ e.note=String(tx||"").slice(0,800); save(d); }
}
function saveLogWer(id,tx){
  var d=load();
  var e=(d.log||[]).find(function(x){ return x.id===id; });
  if(e){ e.wer=String(tx||"").trim(); save(d); }
}
function openLog(id){
  var e=(load().log||[]).find(function(x){ return x.id===id; });
  if(!e){ paintLog(); return; }
  var box=document.getElementById("entries");
  if(!box) return;
  box.innerHTML=
    '<div class="card">'+
    '<p class="sub">'+esc(e.t)+'</p>'+
    '<h2 style="font-family:Georgia,serif;font-weight:500;margin:.2rem 0">'+esc(e.titel)+'</h2>'+
    '<p class="sub">'+wesenTxt(e)+'</p>'+
    '<input id="logWer" placeholder="Name / Person X" value="'+escAttr(e.wer||"")+'">'+
    '<textarea id="logNote" placeholder="Kommentar">'+esc(e.note||"")+'</textarea>'+
    '<div class="row">'+
    '<button type="button" class="btn ghost" id="logBack">Liste</button>'+
    '<button type="button" class="btn primary" id="logSave">Speichern</button>'+
    '</div>'+
    '<div class="row"><button type="button" class="btn ghost" id="logDel">Löschen</button></div>'+
    '</div>';
  function store(){
    saveLogWer(id, (document.getElementById("logWer")||{}).value||"");
    saveLogNote(id, (document.getElementById("logNote")||{}).value||"");
  }
  var n=document.getElementById("logNote");
  var w=document.getElementById("logWer");
  if(n){ n.onchange=store; n.onblur=store; }
  if(w){ w.onchange=store; w.onblur=store; }
  document.getElementById("logBack").onclick=function(){ store(); paintLog(); };
  document.getElementById("logSave").onclick=function(){ store(); paintLog(); };
  document.getElementById("logDel").onclick=function(){
    if(confirm("Diesen Eintrag löschen?")){ delLog(id); paintLog(); }
  };
}
function paintLog(){
  var rows=load().log||[];
  var box=document.getElementById("entries");
  if(!box) return;
  if(!rows.length){ box.innerHTML="<p class='sub'>Noch leer.</p>"; return; }
  box.innerHTML=rows.map(function(e){
    return '<div class="entry" data-eid="'+e.id+'">'+
      '<b>'+esc(e.titel)+'</b>'+
      '<div class="meta">'+esc(e.t)+'</div>'+
      '<div class="meta">'+esc(e.wer||"ohne Namen")+' \u00b7 '+wesenTxt(e)+'</div>'+
      (e.note?'<p style="margin:.35rem 0 0">'+esc(e.note)+'</p>':'')+
      '<div class="row" style="margin-top:.45rem">'+
      '<button type="button" class="btn primary" data-open="'+e.id+'">Bearbeiten</button>'+
      '<button type="button" class="btn ghost" data-del="'+e.id+'">Löschen</button>'+
      '</div></div>';
  }).join("");
  box.querySelectorAll("[data-open]").forEach(function(b){
    b.onclick=function(ev){ ev.preventDefault(); ev.stopPropagation(); openLog(b.getAttribute("data-open")); };
  });
  box.querySelectorAll("[data-del]").forEach(function(b){
    b.onclick=function(ev){
      ev.preventDefault(); ev.stopPropagation();
      if(confirm("Diesen Eintrag löschen?")){ delLog(b.getAttribute("data-del")); paintLog(); }
    };
  });
}

;
/* ==== ritual-notes.js ==== */
function openNote(id){
  const n=loadNotes().find(x=>x.id===id);
  if(!n){paintNotes();return;}
  $("#notesOnly").innerHTML=`<div class="card"><p class="sub">${esc(n.t)}</p><textarea id="noteEdit">${esc(n.note||"")}</textarea><div class="row"><button type="button" class="btn ghost" id="nBack">Liste</button><button type="button" class="btn primary" id="nSave">Speichern</button></div><div class="row"><button type="button" class="btn ghost" id="nDel">Löschen</button></div></div>`;
  $("#nBack").onclick=paintNotes;
  $("#nSave").onclick=()=>{
    const tx=($("#noteEdit").value||"").trim();
    saveNotes(loadNotes().map(x=>x.id===id?Object.assign({},x,{note:tx}):x));
    paintNotes();
  };
  $("#nDel").onclick=()=>{if(confirm("Diese Notiz löschen?")){saveNotes(loadNotes().filter(x=>x.id!==id));paintNotes();}};
}
function paintNotes(){
  const notes=loadNotes();
  const box=$("#notesOnly"); if(!box) return;
  box.innerHTML=notes.length?notes.map(n=>`<button type="button" class="card" data-nid="${n.id}"><small>${esc(n.t)}</small><b>${esc((n.note||"").slice(0,90))}${(n.note||"").length>90?"…":""}</b></button>`).join(""):"<p class='sub'>Keine Notiz.</p>";
  $$("#notesOnly [data-nid]").forEach(b=>b.onclick=()=>openNote(b.dataset.nid));
}

;
/* ==== ritual-plus.js ==== */
const FDB="rr25_fotos_v1";
function idb(){
  return new Promise((res,rej)=>{
    const r=indexedDB.open(FDB,1);
    r.onupgradeneeded=()=>r.result.createObjectStore("pics");
    r.onsuccess=()=>res(r.result);
    r.onerror=()=>rej(r.error);
  });
}
async function fotoGet(id){
  try{
    const db=await idb();
    return await new Promise(ok=>{
      const q=db.transaction("pics").objectStore("pics").get(id);
      q.onsuccess=()=>ok(Array.isArray(q.result)?q.result:[]);
      q.onerror=()=>ok([]);
    });
  }catch(e){return[]}
}
async function fotoPut(id,arr){
  try{
    const db=await idb();
    await new Promise((ok,bad)=>{
      const q=db.transaction("pics","readwrite").objectStore("pics").put(arr,id);
      q.onsuccess=()=>ok(); q.onerror=()=>bad(q.error);
    });
  }catch(e){}
}
function readRaw(file){
  return new Promise(resolve=>{
    const r=new FileReader();
    r.onload=()=>resolve(String(r.result||""));
    r.onerror=()=>resolve("");
    r.readAsDataURL(file);
  });
}
function compressPic(file){
  return new Promise(resolve=>{
    const finish=data=>resolve(data||"");
    const url=URL.createObjectURL(file);
    const img=new Image();
    img.onload=()=>{
      let w=img.width,h=img.height,max=1280;
      if(w>max){h=Math.round(h*max/w);w=max}
      if(h>max){w=Math.round(w*max/h);h=max}
      try{
        const c=document.createElement("canvas");
        c.width=w;c.height=h;
        c.getContext("2d").drawImage(img,0,0,w,h);
        URL.revokeObjectURL(url);
        finish(c.toDataURL("image/jpeg",0.72));
      }catch(e){
        URL.revokeObjectURL(url);
        readRaw(file).then(finish);
      }
    };
    img.onerror=()=>{
      URL.revokeObjectURL(url);
      readRaw(file).then(finish);
    };
    img.src=url;
  });
}
function openPicPicker(done){
  const inp=document.createElement("input");
  inp.type="file";
  inp.accept="image/*";
  inp.style.cssText="position:fixed;left:-9999px;opacity:0";
  document.body.appendChild(inp);
  inp.onchange=async ev=>{
    const f=ev.target.files&&ev.target.files[0];
    try{ inp.remove(); }catch(e){}
    if(!f) return;
    let data="";
    try{ data=await compressPic(f); }catch(e){}
    if(!data) data=await readRaw(f);
    if(data && done) done(data);
  };
  setTimeout(function(){ inp.click(); }, 30);
}
function pickFoto(id,done){
  openPicPicker(async data=>{
    if(!data) return;
    const pics=await fotoGet(id); pics.push(data); await fotoPut(id,pics);
    try{
      const d=load(); const e=(d.log||[]).find(x=>String(x.id)===String(id));
      if(e){ e.pics=pics.length; e.img=e.img||data; save(d); }
    }catch(err){}
    if(done) done(pics);
  });
}
function lastLogId(){const rows=(load().log||[]); return rows[0]&&rows[0].id}
function bindAfterFoto(){
  const box=$("#after"); if(!box)return;
  if(!box.querySelector("#fotoAdd")){
    const row=document.createElement("div");
    row.className="row";
    row.innerHTML='<button type="button" class="btn ghost" id="fotoAdd">Foto dazu</button>';
    const shots=document.createElement("div");
    shots.id="afterShots"; shots.className="shots";
    box.insertBefore(shots, box.querySelector(".row"));
    box.insertBefore(row, box.querySelector(".row"));
  }
  const id=lastLogId();
  const paint=async()=>{
    const el=$("#afterShots"); if(!el||!id)return;
    const pics=await fotoGet(id);
    el.innerHTML=pics.map(src=>'<img src="'+src+'" alt="">').join("")||"";
  };
  $("#fotoAdd").onclick=()=>{const id2=lastLogId(); if(!id2)return; pickFoto(id2,()=>paint());};
  paint();
}
const _show=show;
show=function(id){
  const app=document.querySelector(".app");
  if(app) app.classList.toggle("runmode", id==="run");
  _show(id);
  if(id==="after") bindAfterFoto();
  if(id==="log") enhanceLogFotos();
};
async function enhanceLogFotos(){
  const rows=load().log||[];
  for(const e of rows){
    const card=document.querySelector('[data-open="'+e.id+'"]');
    if(!card) continue;
    let strip=card.parentElement&&card.parentElement.querySelector(".shots");
    if(!strip){
      strip=document.createElement("div");
      strip.className="shots";
      card.parentElement&&card.parentElement.appendChild(strip);
    }
    const pics=await fotoGet(e.id);
    if(pics.length) strip.innerHTML=pics.map(src=>'<img src="'+src+'" alt="">').join("");
    else if(e.img) strip.innerHTML='<img src="'+e.img+'" alt="">';
  }
}
const _openLog=typeof openLog==="function"?openLog:null;
if(_openLog){
  openLog=function(id){
    _openLog(id);
    const box=$("#entries"); if(!box)return;
    if(!box.querySelector("#logFoto")){
      const r=document.createElement("div");
      r.className="row";
      r.innerHTML='<button type="button" class="btn ghost" id="logFoto">Foto dazu</button>';
      box.appendChild(r);
      const sh=document.createElement("div"); sh.id="logShots"; sh.className="shots"; box.appendChild(sh);
    }
    $("#logFoto").onclick=()=>pickFoto(id,async()=>{
      const pics=await fotoGet(id);
      $("#logShots").innerHTML=pics.map(s=>'<img src="'+s+'" alt="">').join("");
    });
    fotoGet(id).then(pics=>{
      const el=$("#logShots"); if(el) el.innerHTML=pics.map(s=>'<img src="'+s+'" alt="">').join("");
    });
  };
}

;
/* ==== ritual-nav.js ==== */
try{
(function(){
  var nav=document.querySelector("nav");
  var app=document.querySelector(".app");
  if(nav&&app) app.appendChild(nav);
  if(nav && !nav.querySelector(".navR")){
    var map={};
    [].slice.call(nav.querySelectorAll("button")).forEach(function(b){ map[b.getAttribute("data-v")]=b; });
    function row(ids){
      var d=document.createElement("div");
      d.className="navR";
      ids.forEach(function(id){ if(map[id]) d.appendChild(map[id]); });
      return d;
    }
    nav.innerHTML="";
    nav.appendChild(row(["home","geplant","kal","log"]));
    nav.appendChild(row(["notiz","opfer","buch"]));
  }
  var s=document.createElement("style");
  s.textContent=[
    "nav{position:fixed!important;left:50%;bottom:0;transform:translateX(-50%);width:100%;max-width:28rem;margin:0!important;z-index:40;display:flex!important;flex-direction:column;gap:.18rem;border-radius:1.15rem 1.15rem 0 0;padding:.34rem .28rem calc(.42rem + env(safe-area-inset-bottom));background:rgba(12,6,20,.97)!important;backdrop-filter:blur(16px);border:1px solid rgba(232,160,255,.22);border-bottom:0;box-sizing:border-box;grid-template-columns:none!important}",
    "nav .navR{display:grid;gap:.18rem}",
    "nav .navR:first-child{grid-template-columns:repeat(4,1fr)}",
    "nav .navR:last-child{grid-template-columns:repeat(3,1fr);padding:0 8%}",
    "nav button{font-size:.6rem!important;padding:.42rem .04rem .34rem!important;min-height:2.55rem}",
    "nav button svg{width:18px!important;height:18px!important}",
    "main{padding-bottom:8.2rem!important}",
    "header nav{display:none}"
  ].join("");
  document.head.appendChild(s);
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-layout.js ==== */
try{
(function(){
  var k=document.getElementById("kasten");
  if(!k) return;
  var duo=k.querySelector(".duo");
  var row=k.querySelector(".row");
  var tools=document.getElementById("sigilTools");
  var grid=document.getElementById("under");
  if(!grid){
    grid=document.createElement("div");
    grid.id="under";
    if(duo) k.insertBefore(grid, duo.nextSibling);
    else k.appendChild(grid);
  }
  var left=document.getElementById("underL");
  if(!left){
    left=document.createElement("div");
    left.id="underL";
    grid.appendChild(left);
  }
  var right=document.getElementById("underR");
  if(!right){
    right=document.createElement("div");
    right.id="underR";
    grid.appendChild(right);
  }
  var kTag=document.getElementById("kTag");
  var kDrei=document.getElementById("kDrei");
  if(kTag) left.appendChild(kTag);
  if(kDrei) left.appendChild(kDrei);
  if(tools){
    var inp=document.getElementById("sigilT");
    var go=document.getElementById("sigilGo");
    if(inp) right.appendChild(inp);
    if(go) right.appendChild(go);
    tools.remove();
  }
  if(row&&!row.children.length) row.remove();
  var s=document.createElement("style");
  s.textContent=[
    "#under{display:grid;grid-template-columns:1fr 1fr;gap:.4rem;margin-top:.4rem}",
    "#underL,#underR{display:flex;flex-direction:column;gap:.35rem}",
    "#under .btn{width:100%;margin:0}",
    "#under input{margin:0;width:100%}"
  ].join("");
  document.head.appendChild(s);
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-look.js ==== */
try{
(function(){
  try{ localStorage.setItem("rr25_kleid","neon"); }catch(e){}
  document.documentElement.setAttribute("data-kleid","neon");
  var b=document.getElementById("kleidBtn");
  if(b) b.remove();
  var s=document.createElement("style");
  s.textContent=[
    "#kleidBtn{display:none!important}",
    "html[data-kleid=neon] #cats .chip.on{background:linear-gradient(165deg,#ff7ad9,#7ef0e6)!important;color:#14081c!important}"
  ].join("");
  document.head.appendChild(s);
  setTimeout(function(){
    var x=document.getElementById("kleidBtn");
    if(x) x.remove();
  },400);
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-extra.js ==== */
try{
(function(){
  var DAYS=["So","Mo","Di","Mi","Do","Fr","Sa"];
  var ZKEY="rr25_369";
  var FEST=[
    [2,1,"Imbolc","Licht zurück. Samen innen. Nicht hetzen. Still halten und wärmen."],
    [3,20,"Ostara","Tag und Nacht gleich. Neu setzen. Was keimt, darf wachsen."],
    [5,1,"Beltane","Feuer und Tür. Leben nach aussen. Grenze trotzdem halten."],
    [6,21,"Litha","Höhe. Kraft ist da. Nicht nachsetzen. Danken und stehen."],
    [8,1,"Lughnasadh","Erste Ernte. Nehmen was reif ist. Den Rest stehen lassen."],
    [9,22,"Mabon","Wieder Gleichstand. Abgeben. Was fällt, darf fallen."],
    [10,31,"Samhain","Schleier dünn. Ahnen ehren. Kontakt kurz. Dann schliessen."],
    [12,21,"Jul","Tiefste Nacht. Licht hüten. Innen bleiben. Neu beginnen."]
  ];
  function day(){ return new Date(); }
  function ymd(){
    var n=day();
    return n.getFullYear()+"-"+String(n.getMonth()+1).padStart(2,"0")+"-"+String(n.getDate()).padStart(2,"0");
  }
  function zLoad(){
    try{
      var x=JSON.parse(localStorage.getItem(ZKEY)||"{}");
      if(x.d!==ymd()) return {d:ymd(),n3:0,n6:0,n9:0};
      return {d:x.d,n3:x.n3|0,n6:x.n6|0,n9:x.n9|0};
    }catch(e){ return {d:ymd(),n3:0,n6:0,n9:0}; }
  }
  function zSave(z){ localStorage.setItem(ZKEY, JSON.stringify(z)); }
  function buzz(full){
    try{ if(navigator.vibrate) navigator.vibrate(full?[40,50,80,50,140]:[55]); }catch(e){}
  }
  function zClearHome(){
    var home=document.getElementById("home");
    if(!home) return;
    home.querySelectorAll("#z369").forEach(function(n){ n.remove(); });
  }
  function zHas(){
    var run=document.getElementById("run");
    if(!run||!run.classList.contains("on")) return false;
    var h=run.querySelector("h2");
    var w=run.querySelector(".words");
    var t=((h&&h.textContent)||"")+" "+((w&&w.textContent)||"");
    return /369|zähler|zaehler/i.test(t);
  }
  function zBox(){
    var run=document.getElementById("run");
    if(!run||!run.classList.contains("on")||!zHas()){
      document.querySelectorAll("#z369").forEach(function(n){ n.remove(); });
      return null;
    }
    var el=run.querySelector("#z369");
    if(!el){
      el=document.createElement("div");
      el.id="z369";
      var words=run.querySelector(".words");
      if(words && words.parentNode) words.parentNode.insertBefore(el, words.nextSibling);
      else run.appendChild(el);
    }
    return el;
  }
  function zPaint(){
    zClearHome();
    var el=zBox();
    if(!el) return;
    var z=zLoad();
    el.innerHTML=
      '<button type="button" data-z="n3">3 <span>'+z.n3+'/3</span></button>'+
      '<button type="button" data-z="n6">6 <span>'+z.n6+'/6</span></button>'+
      '<button type="button" data-z="n9">9 <span>'+z.n9+'/9</span></button>';
  }
  function zTap(key){
    var max={n3:3,n6:6,n9:9};
    var z=zLoad();
    if(z[key]<max[key]) z[key]++;
    if(z.n9>=9){
      buzz(true);
      z.n3=0; z.n6=0; z.n9=0;
    } else if(z[key]>=max[key]){
      buzz(false);
    }
    zSave(z);
    zPaint();
  }
  function nextFest(n){
    var y=n.getFullYear();
    var list=[];
    for(var k=0;k<2;k++){
      FEST.forEach(function(f){
        list.push({d:new Date(y+k,f[0]-1,f[1]), name:f[2], text:f[3]});
      });
    }
    var now=new Date(n.getFullYear(),n.getMonth(),n.getDate()).getTime();
    for(var i=0;i<list.length;i++){
      var t=new Date(list[i].d.getFullYear(),list[i].d.getMonth(),list[i].d.getDate()).getTime();
      var diff=Math.round((t-now)/86400000);
      if(diff>=0) return {name:list[i].name, tage:diff, text:list[i].text};
    }
    return {name:"Imbolc",tage:0,text:FEST[0][3]};
  }
  function moonInfo(){
    var syn=29.53058867;
    var nm=Date.UTC(2000,0,6,18,14)/1000;
    var age=((day().getTime()/1000-nm)/86400)%syn;
    if(age<0) age+=syn;
    var p=age/syn;
    var left=(p<0.5)?(0.5-p)*syn:(1.5-p)*syn;
    var tage=Math.max(0, Math.round(left));
    var name,satz,sym;
    if(p<0.03||p>0.97){ sym="\u25cb"; name="Neumond"; satz="Neu setzen. Still halten."; }
    else if(p<0.22){ sym="\ud83c\udf12"; name="Zunehmend"; satz="Wachsen lassen. Nicht hetzen."; }
    else if(p<0.28){ sym="\ud83c\udf13"; name="Viertel"; satz="Form geben. Grenze halten."; }
    else if(p<0.47){ sym="\ud83c\udf14"; name="Zunehmend"; satz="Kraft sammeln. Klar bleiben."; }
    else if(p<0.53){ sym="\ud83c\udf15"; name="Vollmond"; satz="Sichtbar. Nicht nachsetzen."; }
    else if(p<0.72){ sym="\ud83c\udf16"; name="Abnehmend"; satz="Abgeben. Was fällt, darf fallen."; }
    else if(p<0.78){ sym="\ud83c\udf17"; name="Viertel"; satz="Lösen. Zurück zur Mitte."; }
    else { sym="\ud83c\udf18"; name="Abnehmend"; satz="Leeren. Schlafen lassen."; }
    var wait=tage===0?"heute":(tage===1?"1 Tag":tage+" Tage");
    return {sym:sym,name:name,satz:satz,wait:wait,tage:tage};
  }
  function sunInfo(){
    var n=day();
    var f=nextFest(n);
    var dat=DAYS[n.getDay()]+" "+n.getDate()+"."+(n.getMonth()+1)+".";
    var wait=f.tage===0?"heute":(f.tage===1?"1 Tag":f.tage+" Tage");
    return {sym:"\u2600\ufe0f", dat:dat, fest:f.name, wait:wait, tage:f.tage, text:f.text};
  }
  function box(){
    var el=document.getElementById("festHint");
    if(el) return el;
    el=document.createElement("div");
    el.id="festHint";
    var home=document.getElementById("home");
    if(home) home.insertBefore(el, home.firstChild);
    else document.body.appendChild(el);
    return el;
  }
  function paintHead(){
    var m=moonInfo();
    var s=sunInfo();
    var el=document.getElementById("moonSym");
    var tx=document.getElementById("moonTxt");
    if(el) el.textContent=m.sym;
    if(tx) tx.innerHTML=m.name+"<br>"+(m.tage===0?"Vollmond":"Vollmond "+m.wait);
    var wrap=document.getElementById("moonWrap");
    if(wrap) wrap.title=m.name+" · "+m.satz;
    var se=document.getElementById("sunSym");
    var st=document.getElementById("sunTxt");
    if(se) se.textContent=s.sym;
    if(st) st.innerHTML=s.dat+"<br>"+s.fest+" "+(s.tage===0?"heute":s.wait);
    window._fest=s;
  }
  function toggleFest(){
    var s=window._fest||sunInfo();
    var el=box();
    if(el.classList.contains("on")){ el.classList.remove("on"); el.innerHTML=""; return; }
    el.className="on";
    el.innerHTML="<b>"+s.fest+"</b><small>"+(s.tage===0?"heute":s.wait)+"</small><p>"+s.text+"</p>";
  }
  function saveSigil(){
    var c=document.getElementById("sigilC");
    var t=((document.getElementById("sigilT")||{}).value||"").trim();
    if(!c||typeof load!=="function") return;
    var img="";
    try{ img=c.toDataURL("image/jpeg",0.72); }catch(e){}
    if(!img||img.length<80) return;
    var id=typeof uid==="function"?uid():String(Date.now());
    var d=load();
    d.log=d.log||[];
    d.log.unshift({
      id:id,
      t:typeof now==="function"?now():new Date().toLocaleString("de-CH"),
      titel:"Sigille",
      wer:t,
      pics:1
    });
    save(d);
    if(typeof fotoPut==="function") fotoPut(id,[img]);
    var b=document.getElementById("sigilSave");
    if(b){ b.textContent="Abgelegt"; setTimeout(function(){ b.textContent="Ablegen"; },1400); }
  }
  var css=document.createElement("style");
  css.textContent=[
    "#sunWrap{cursor:pointer}",
    "#festHint{display:none;margin:.35rem 0 .55rem;padding:.7rem .8rem;border:1px solid rgba(232,160,255,.22);border-radius:.9rem;background:rgba(56,24,86,.45)}",
    "#festHint.on{display:block}",
    "#festHint b{display:block;font-family:Georgia,serif;font-size:1rem}",
    "#festHint small{display:block;color:#c4a4d6;margin:.12rem 0 .35rem}",
    "#festHint p{margin:0;font-family:Georgia,serif;line-height:1.5}",
    "#run #z369{display:grid;grid-template-columns:1fr 1fr 1fr;gap:.35rem;margin:.7rem 0 .2rem}",
    "#run #z369 button{border:1px solid rgba(232,160,255,.22);background:rgba(56,24,86,.4);color:#f6eaff;border-radius:.85rem;padding:.45rem .2rem;font:inherit}",
    "#run #z369 button span{display:block;font-size:.68rem;color:#c4a4d6;margin-top:.08rem}",
    "#home #z369{display:none!important}"
  ].join("");
  document.head.appendChild(css);
  document.addEventListener("click",function(e){
    if(!e.target) return;
    if(e.target.id==="sigilSave") saveSigil();
    if(e.target.id==="sunWrap"||(e.target.closest&&e.target.closest("#sunWrap"))) toggleFest();
    var z=e.target.closest&&e.target.closest("#z369 [data-z]");
    if(z){ e.stopPropagation(); zTap(z.getAttribute("data-z")); }
    setTimeout(zPaint,40);
  });
  var run=document.getElementById("run");
  if(run&&window.MutationObserver){
    new MutationObserver(function(){ setTimeout(zPaint,20); }).observe(run,{childList:true});
  }
  if(typeof show==="function"){
    var _show=show;
    show=function(id){
      var r=_show.apply(this,arguments);
      zClearHome();
      setTimeout(zPaint,30);
      return r;
    };
  }
  paintHead();
  zClearHome();
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-zahl.js ==== */
try{
(function(){
  var KEY="rr25_369";
  function ymd(){
    var n=new Date();
    return n.getFullYear()+"-"+String(n.getMonth()+1).padStart(2,"0")+"-"+String(n.getDate()).padStart(2,"0");
  }
  function loadZ(){
    try{
      var x=JSON.parse(localStorage.getItem(KEY)||"{}");
      if(x.d!==ymd()) return {d:ymd(),n3:0,n6:0,n9:0};
      return {d:x.d,n3:x.n3|0,n6:x.n6|0,n9:x.n9|0};
    }catch(e){ return {d:ymd(),n3:0,n6:0,n9:0}; }
  }
  function saveZ(z){ localStorage.setItem(KEY, JSON.stringify(z)); }
  function buzz(full){
    try{
      if(navigator.vibrate) navigator.vibrate(full?[40,50,80,50,140]:[55]);
    }catch(e){}
  }
  function paint(){
    var el=document.getElementById("zahlBox");
    if(!el) return;
    var z=loadZ();
    el.innerHTML=
      '<button type="button" class="zbtn" data-z="n3">3<span>'+z.n3+'/3</span></button>'+
      '<button type="button" class="zbtn" data-z="n6">6<span>'+z.n6+'/6</span></button>'+
      '<button type="button" class="zbtn" data-z="n9">9<span>'+z.n9+'/9</span></button>';
    var msg=document.getElementById("zahlMsg");
    if(!msg){
      msg=document.createElement("p");
      msg.id="zahlMsg";
      msg.className="sub";
      el.parentNode.insertBefore(msg, el.nextSibling);
    }
    msg.textContent=window._zVoll?"Voll. Zurück auf null.":"";
  }
  function tap(key){
    var max={n3:3,n6:6,n9:9};
    var z=loadZ();
    if(z[key]<max[key]) z[key]++;
    if(z.n9>=9){
      buzz(true);
      z.n3=0; z.n6=0; z.n9=0;
      window._zVoll=true;
      setTimeout(function(){ window._zVoll=false; paint(); },1800);
    } else if(z[key]>=max[key]){
      buzz(false);
    }
    saveZ(z);
    paint();
  }
  var css=document.createElement("style");
  css.textContent=[
    "#zahlBox{display:grid;grid-template-columns:1fr 1fr 1fr;gap:.45rem;margin:1.1rem 0 .4rem}",
    "#zahl .zbtn{border:1px solid rgba(255,122,217,.22);background:rgba(28,14,48,.55);color:#f6f0ff;border-radius:1.15rem;padding:1.15rem .2rem .95rem;font:inherit}",
    "#zahl .zbtn span{display:block;margin-top:.35rem;font-size:.72rem;color:#c4b4e0}",
    "#zahlMsg{text-align:center;min-height:1.2rem}"
  ].join("");
  document.head.appendChild(css);
  document.addEventListener("click",function(e){
    if(!e.target) return;
    if(e.target.id==="zahlGo"||(e.target.closest&&e.target.closest("#tools [data-go=zahlGo]"))){
      paint();
      if(typeof show==="function") show("zahl");
    }
    if(e.target.id==="zahlBack"&&typeof show==="function") show("home");
    var b=e.target.closest&&e.target.closest("#zahl [data-z]");
    if(b) tap(b.getAttribute("data-z"));
  });
  window._zTap=tap;
  window._zPaint=paint;
  paint();
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-home.js ==== */
try{
(function(){
  function build(){
    var kast=document.getElementById("kasten");
    if(!kast) return;
    var brand=document.querySelector("header .brand");
    var sub=document.querySelector("header .sub");
    if(brand) brand.textContent="ROLF REBER 25";
    if(sub) sub.textContent="";
    var tools=document.getElementById("tools");
    if(!tools){
      tools=document.createElement("div");
      tools.id="tools";
      kast.appendChild(tools);
    }
    tools.innerHTML=
      '<button type="button" class="tile t1" data-go="kTag"><b>✦</b><span>Karte</span></button>'+
      '<button type="button" class="tile t2" data-go="kDrei"><b>☰</b><span>Drei</span></button>'+
      '<button type="button" class="tile t3" data-go="zahlGo"><b>369</b><span>Zähler</span></button>'+
      '<button type="button" class="tile t4" data-go="sigilGo"><b>✽</b><span>Zeichen</span></button>';
    if(!document.getElementById("zahlGo")){
      var h=document.createElement("button");
      h.type="button"; h.id="zahlGo"; h.hidden=true;
      kast.appendChild(h);
    }
    if(!document.getElementById("sigRow")){
      var row=document.createElement("div");
      row.id="sigRow";
      var inp=document.getElementById("sigilT");
      var save=document.getElementById("sigilSave");
      if(inp) row.appendChild(inp);
      if(save) row.appendChild(save);
      kast.appendChild(row);
    }
  }
  var css=document.createElement("style");
  css.textContent=[
    "header .sub{display:none}",
    "#kasten{background:transparent;border:0;padding:.2rem 0 .35rem;margin:0 0 .4rem}",
    "#under,#pendelGo{display:none!important}",
    ".duo{gap:.42rem}",
    "#tools{display:grid;grid-template-columns:repeat(4,1fr);gap:.4rem;margin-top:.5rem}",
    "#tools .tile{border:1px solid rgba(255,255,255,.1);background:rgba(12,8,20,.7);border-radius:.95rem;padding:.5rem .08rem .42rem;font:inherit}",
    "#tools .tile b{display:block;font-size:1.05rem;line-height:1;margin:0 0 .22rem;font-weight:500}",
    "#tools .tile span{display:block;font-size:.6rem;letter-spacing:.05em}",
    "#tools .t1{border-color:rgba(255,122,217,.4);color:#ffb3ea}",
    "#tools .t2{border-color:rgba(126,200,255,.4);color:#9fd6ff}",
    "#tools .t3{border-color:rgba(46,230,214,.4);color:#7ef0e6}",
    "#tools .t4{border-color:rgba(125,255,163,.4);color:#a6ffc4}",
    "#sigRow{display:grid;grid-template-columns:1fr auto;gap:.32rem;margin-top:.42rem;align-items:center}",
    "#sigRow input{margin:0;border-radius:.85rem;min-height:2.3rem}",
    "#sigRow #sigilSave{margin:0;border-radius:.85rem;padding:.55rem .8rem;white-space:nowrap;min-height:2.3rem}"
  ].join("");
  document.head.appendChild(css);
  document.addEventListener("click",function(e){
    var t=e.target.closest&&e.target.closest("#tools [data-go]");
    if(!t) return;
    var id=t.getAttribute("data-go");
    if(id==="zahlGo"){
      var z=document.getElementById("zahlGo");
      if(z) z.click();
      return;
    }
    var el=document.getElementById(id);
    if(el) el.click();
  });
  build();
  setTimeout(build,280);
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-backup.js ==== */
try{
(function(){
  if(window.__rr25bak) return;
  window.__rr25bak=1;
  var BAK="rr25_pack_bak";
  var WHEN="rr25_bak_at";

  function get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
  function mark(){ set(WHEN, String(Date.now())); }

  function pack(){
    var p={v:4,t:new Date().toISOString()};
    var names=["rr25_ritual_v1","rr25_notiz_v1","rr25_wer","rr25_personen","rr25_369","rr25_dank","rr25_kleid"];
    var i,k;
    for(i=0;i<localStorage.length;i++){
      k=localStorage.key(i);
      if(k && k.indexOf("rr25")===0 && k!==BAK && names.indexOf(k)<0) names.push(k);
    }
    names.forEach(function(key){
      var v=get(key);
      if(v!=null && v!=="") p[key]=v;
    });
    if(typeof load==="function" && !p.rr25_ritual_v1){
      try{ p.rr25_ritual_v1=JSON.stringify(load()); }catch(e){}
    }
    if(typeof loadNotes==="function" && !p.rr25_notiz_v1){
      try{ p.rr25_notiz_v1=JSON.stringify(loadNotes()); }catch(e){}
    }
    return p;
  }
  function counts(p){
    var log=0, notes=0, plan=0;
    try{ var d=JSON.parse(p.rr25_ritual_v1||"{}"); log=(d.log||[]).length; plan=(d.planned||[]).length; }catch(e){}
    try{ var n=JSON.parse(p.rr25_notiz_v1||"[]"); notes=Array.isArray(n)?n.length:0; }catch(e){}
    return {log:log,notes:notes,plan:plan};
  }
  function apply(p){
    if(!p||typeof p!=="object") return false;
    if(p.rr25 && !p.rr25_ritual_v1) p.rr25_ritual_v1=typeof p.rr25==="string"?p.rr25:JSON.stringify(p.rr25);
    var n=0;
    Object.keys(p).forEach(function(k){
      if(k==="v"||k==="t"||k==="rr25"||k==="fotos") return;
      if(p[k]==null) return;
      set(k, typeof p[k]==="string"?p[k]:JSON.stringify(p[k]));
      n++;
    });
    apply.fotos=0;
    apply.wait=Promise.resolve(0);
    if(Array.isArray(p.fotos) && p.fotos.length && typeof fotoPut==="function"){
      var list=p.fotos.filter(function(x){ return Array.isArray(x) && x.length===2 && Array.isArray(x[1]); });
      apply.fotos=list.length;
      apply.wait=list.reduce(function(pr,x){ return pr.then(function(){ return fotoPut(x[0],x[1]); }); }, Promise.resolve()).then(function(){ return list.reduce(function(a,x){ return a+x[1].length; },0); });
      n+=list.length;
    }
    return n>0;
  }
  function snap(){ try{ set(BAK, JSON.stringify(pack())); }catch(e){} }
  try{ if(!get("rr25_ritual_v1")){ var raw=get(BAK); if(raw) apply(JSON.parse(raw)); } }catch(e){}
  if(typeof save==="function"){ var _s=save; save=function(d){ _s(d); snap(); }; }
  if(typeof saveNotes==="function"){ var _n=saveNotes; saveNotes=function(a){ _n(a); snap(); }; }
  snap();

  function fname(){
    var n=new Date();
    var m=String(n.getMonth()+1).padStart(2,"0");
    var d=String(n.getDate()).padStart(2,"0");
    return "RR25-Sicherung-"+n.getFullYear()+"-"+m+"-"+d+".json";
  }
  function linkOut(raw){
    var blob=new Blob([raw],{type:"application/json"});
    var a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download=fname();
    a.rel="noopener";
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 1200);
  }
  function fileOut(){
    snap();
    mark();
    var raw=JSON.stringify(pack());
    var name=fname();
    try{
      var file=new File([raw], name, {type:"application/json"});
      if(navigator.canShare && navigator.canShare({files:[file]}) && navigator.share){
        navigator.share({files:[file], title:name}).catch(function(){ linkOut(raw); });
        return;
      }
    }catch(e){}
    try{ linkOut(raw); }catch(e2){ pane(raw, counts(pack()), "out"); }
  }
  function fileIn(){
    var inp=document.createElement("input");
    inp.type="file"; inp.accept="application/json,.json,text/plain";
    inp.onchange=function(ev){
      var f=ev.target.files && ev.target.files[0];
      if(!f) return;
      var r=new FileReader();
      r.onload=function(){
        try{
          var p=JSON.parse(String(r.result||"").trim());
          if(!apply(p)) throw new Error("leer");
          snap(); mark();
          var k=counts(p);
          apply.wait.then(function(nf){
            alert("Drin: Chronik "+k.log+", Notizen "+k.notes+(nf?", Fotos "+nf:""));
            if(typeof paintLog==="function") paintLog();
            if(typeof paintNotes==="function") paintNotes();
          }).catch(function(){ alert("Chronik und Notizen drin. Fotos nicht ganz."); });
        }catch(err){ alert("Datei nicht lesbar."); }
      };
      r.readAsText(f);
    };
    inp.click();
  }

  function pane(raw,c,mode){
    var old=document.getElementById("bakPane");
    if(old) old.remove();
    var box=document.createElement("div");
    box.id="bakPane";
    box.className="card";
    if(mode==="out"){
      box.innerHTML='<p class="sub">Sicherung als Text · Chronik '+c.log+' · Notizen '+c.notes+' · ohne Fotos</p>'+
        '<textarea id="bakTx" readonly></textarea>'+
        '<div class="row"><button type="button" class="btn primary" id="bakCopy">Kopieren</button>'+
        '<button type="button" class="btn ghost" id="bakClose">Zu</button></div>';
    } else {
      box.innerHTML='<p class="sub">Sicherung hier einfügen</p>'+
        '<textarea id="bakTx" placeholder="Text hier rein"></textarea>'+
        '<div class="row"><button type="button" class="btn primary" id="bakGo">Übernehmen</button>'+
        '<button type="button" class="btn ghost" id="bakClose">Zu</button></div>';
    }
    var host=document.getElementById("log")||document.getElementById("notiz");
    if(!host) return;
    var bar=host.querySelector(".bakBar");
    if(bar&&bar.nextSibling) host.insertBefore(box, bar.nextSibling);
    else host.insertBefore(box, host.firstChild);
    var tx=box.querySelector("#bakTx");
    if(mode==="out") tx.value=raw||"";
    var copy=box.querySelector("#bakCopy");
    if(copy) copy.onclick=function(){
      tx.focus(); tx.select();
      var ok=false;
      try{ if(navigator.clipboard){ navigator.clipboard.writeText(tx.value); ok=true; } }catch(e){}
      try{ if(!ok) ok=document.execCommand("copy"); }catch(e){}
      if(ok) mark();
      copy.textContent=ok?"Kopiert":"Markieren und kopieren";
    };
    var go=box.querySelector("#bakGo");
    if(go) go.onclick=function(){
      try{
        var p=JSON.parse((tx.value||"").trim());
        if(!apply(p)) throw new Error("leer");
        snap();
        mark();
        var k=counts(p);
        box.remove();
        apply.wait.then(function(nf){ alert("Drin: Chronik "+k.log+", Notizen "+k.notes+(nf?", Fotos "+nf:"")); if(typeof paintLog==="function") paintLog(); });
        if(typeof paintLog==="function") paintLog();
        if(typeof paintNotes==="function") paintNotes();
      }catch(e){ alert("Text nicht lesbar. Ganzen Sicherungstext einfügen."); }
    };
    box.querySelector("#bakClose").onclick=function(){ box.remove(); };
  }

  function dump(){
    snap();
    mark();
    var p=pack();
    var c=counts(p);
    pane(JSON.stringify(p), c, "out");
  }
  function openIn(){ pane("", {log:0,notes:0,plan:0}, "in"); }

  function bar(host){
    if(!host) return;
    var exist=host.querySelector(".bakBar");
    if(exist){
      var f=exist.querySelector(".bakFile");
      if(f) f.textContent="Speichern";
      return;
    }
    var box=document.createElement("div");
    box.className="bakBar";
    box.style.margin=".15rem 0 .55rem";
    box.innerHTML='<div class="row" style="margin:0">'+
      '<button type="button" class="btn ghost bakOut">Text</button>'+
      '<button type="button" class="btn ghost bakFile">Speichern</button>'+
      '<button type="button" class="btn ghost bakIn">Einfügen</button></div>';
    var hero=host.querySelector(".hero");
    if(hero&&hero.nextSibling) host.insertBefore(box, hero.nextSibling);
    else host.insertBefore(box, host.firstChild);
    box.querySelector(".bakOut").onclick=dump;
    box.querySelector(".bakFile").onclick=fileOut;
    box.querySelector(".bakIn").onclick=function(){
      if(confirm("Datei vom Handy nehmen?")) fileIn();
      else openIn();
    };
  }
  /* Build 42: keine Leiste (Text / Einfügen) mehr in Chronik und Notiz. Sichern und Wiederherstellen leben in «Mehr». */
  function place(){}
  var st=document.createElement("style");
  st.textContent="#bakPane{margin:.2rem 0 .8rem}#bakTx{min-height:8rem;font-size:.68rem}";
  document.head.appendChild(st);
  if(typeof show==="function"){
    var _show=show;
    show=function(id){ var r=_show.apply(this,arguments); if(id==="log"||id==="notiz") place(); return r; };
  }
  place();
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== pwa.js ==== */
try{
(function(){
  if(!("serviceWorker" in navigator)) return;
  /* Stand dieser Datei. Muss zu <meta name="rr25-build"> in index.html passen (beide zusammen erhöhen).
     Kommt index.html noch aus einem alten Zwischenspeicher (älterer Stand), einmal frisch laden. Nutzerdaten bleiben unberührt. */
  var BUILD=46;
  var mb=document.querySelector('meta[name="rr25-build"]'), have=mb?+mb.getAttribute("content"):0;
  if(have<BUILD){
    try{
      if(sessionStorage.getItem("rr25_frisch")!==String(BUILD)){
        sessionStorage.setItem("rr25_frisch",String(BUILD));
        location.reload();
      }
    }catch(e){}
  }
  if(window.caches){
    /* Nur Zwischenspeicher alter Stände löschen. Den Offline-Vorrat dieses Stands ("rr25-v"+BUILD, legt sw.js an) behalten. */
    caches.keys().then(function(keys){
      keys.forEach(function(k){ if(k!=="rr25-v"+BUILD) caches.delete(k); });
    });
  }
  navigator.serviceWorker.getRegistrations().then(function(rs){
    rs.forEach(function(r){ r.update(); });
  });
  navigator.serviceWorker.register("./sw.js?v=46").then(function(reg){
    if(reg.waiting){
      try{ reg.waiting.postMessage("skip"); }catch(e){}
    }
    setTimeout(function(){ try{ reg.update(); }catch(e){} }, 4000);
  }).catch(function(){});
  /* Kein automatisches Neuladen mehr, wenn ein neuer Service-Worker übernimmt: sw.js holt jede Datei
     ohnehin frisch aus dem Netz (network-first, no-store), die Seite ist also schon aktuell.
     Das Neuladen hat die App nach jedem Update ein zweites Mal aufgebaut (Flackern beim Start). */
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-log-fix.js ==== */
try{
(function(){
  if(typeof enhanceLogFotos==="function") enhanceLogFotos=function(){};
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-polish.js ==== */
try{
(function(){
  var s=document.createElement("style");
  s.textContent=[
    "html,body{background:#070510;-webkit-tap-highlight-color:transparent}",
    "body{-webkit-font-smoothing:antialiased}",
    ".app{background:radial-gradient(120% 80% at 50% -8%,rgba(255,122,217,.13),transparent 50%),radial-gradient(90% 50% at 100% 0,rgba(126,200,255,.08),transparent 42%),#070510}",
    "header{background:rgba(7,5,16,.86)!important;border-bottom:1px solid rgba(255,122,217,.14)}",
    ".brand{letter-spacing:.34em;color:#ff8adf;text-shadow:0 0 18px rgba(255,122,217,.35)}",
    ".doll{box-shadow:0 0 16px rgba(255,122,217,.22)}",
    "#kasten{display:block!important;margin:0 0 .4rem!important}",
    "#home .duo{display:grid!important;grid-template-columns:1fr 1fr!important;gap:.45rem}",
    "#kOut,#sigilBox{border-radius:1.25rem!important;min-height:9.4rem!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.04)}",
    "#tools{display:grid!important;grid-template-columns:repeat(4,1fr)!important;margin-top:.48rem!important;gap:.38rem!important}",
    "#tools .tile{min-height:3.15rem;transition:transform .12s ease,box-shadow .12s ease}",
    "#tools .tile:active{transform:scale(.97)}",
    "#sigRow{display:grid!important}",
    "#under{display:none!important}",
    "#list:empty{display:none}",
    "#cats{gap:.4rem;margin:.62rem 0 .5rem}",
    ".chip{padding:.48rem .86rem;min-height:2.15rem;letter-spacing:.02em;transition:transform .12s ease,background .15s ease}",
    ".chip:active{transform:scale(.97)}",
    "#cats .chip.on{background:linear-gradient(165deg,#ff7ad9,#7ef0e6)!important;color:#14081c!important;box-shadow:0 0 16px rgba(255,122,217,.28)}",
    ".card{border-radius:1.2rem;padding:.82rem .88rem;transition:transform .12s ease,border-color .15s ease}",
    "#list .card:active{transform:scale(.99)}",
    "#list .card{border-color:rgba(255,122,217,.16)}",
    ".group{letter-spacing:.2em;color:#ff9ae4;margin:1.05rem 0 .28rem}",
    "#run .words{font-size:1.16rem;line-height:1.72}",
    "#run .sub{display:block!important;text-align:left;letter-spacing:.12em;text-transform:uppercase;font-size:.68rem;color:#c4b4e0;margin:0 0 .25rem}",
    "#run .pbar{display:block!important;height:3px;border-radius:99px;background:rgba(255,255,255,.08);margin:.1rem 0 .5rem;overflow:hidden}",
    "#run .pbar:after{content:\"\";display:block;height:100%;width:var(--p,8%);background:linear-gradient(90deg,#ff7ad9,#7ef0e6)}",
    ".kcard{background:linear-gradient(185deg,rgba(70,24,90,.7),rgba(12,8,28,.94));border:1px solid rgba(255,122,217,.22);border-radius:1.2rem;padding:1rem .95rem;margin:.5rem 0;text-align:center}",
    ".kcard b,.kcard small,.kcard .group{display:block}",
    "#sigilT{text-transform:uppercase}",
    "input:focus,textarea:focus,select:focus{outline:0;border-color:rgba(255,122,217,.55);box-shadow:0 0 0 3px rgba(255,122,217,.12)}",
    "nav{display:flex!important;flex-direction:column!important;grid-template-columns:none!important;gap:.16rem!important;padding:.32rem .22rem calc(.4rem + env(safe-area-inset-bottom))!important}",
    "nav .navR{display:grid!important;gap:.16rem}",
    "nav .navR:first-child{grid-template-columns:repeat(4,1fr)!important}",
    "nav .navR:last-child{grid-template-columns:repeat(3,1fr)!important;padding:0 7%}",
    "nav button{padding:.44rem .04rem .36rem!important;font-size:.6rem!important;gap:.14rem!important;min-height:2.5rem}",
    "nav button svg{width:18px!important;height:18px!important}",
    "nav button.on{box-shadow:0 0 18px rgba(255,122,217,.25)}",
    "main{padding-bottom:8.4rem!important}",
    ".bakBar .btn{min-height:2.15rem;font-size:.74rem;letter-spacing:.02em}",
    "#logFind{margin:.15rem 0 .55rem;min-height:2.25rem}",
    "#afterStay,#stay,.check{display:none!important}"
  ].join("");
  document.head.appendChild(s);

  var nav=document.querySelector("nav");
  if(nav && !nav.querySelector(".navR")){
    var map={};
    [].slice.call(nav.querySelectorAll("button")).forEach(function(b){ map[b.getAttribute("data-v")]=b; });
    function row(ids){
      var d=document.createElement("div");
      d.className="navR";
      ids.forEach(function(id){ if(map[id]) d.appendChild(map[id]); });
      return d;
    }
    nav.innerHTML="";
    nav.appendChild(row(["home","geplant","kal","log"]));
    nav.appendChild(row(["notiz","opfer","buch"]));
  }

  var run=document.getElementById("run");
  if(run){
    function bar(){
      var sub=run.querySelector(".sub");
      if(!sub) return;
      var m=String(sub.textContent||"").match(/(\d+)\s*[\/\u00b7]\s*(\d+)/);
      var el=run.querySelector(".pbar");
      if(!el){ el=document.createElement("div"); el.className="pbar"; run.insertBefore(el, run.firstChild); }
      if(m) el.style.setProperty("--p", Math.max(8, Math.round((+m[1])/(+m[2]||1)*100))+"%");
    }
    new MutationObserver(bar).observe(run,{childList:true,subtree:true});
  }
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-mond.js ==== */
try{
(function(){
  function phase(){
    var syn=29.53058867;
    var nm=Date.UTC(2000,0,6,18,14)/1000;
    var age=(((Date.now()/1000)-nm)/86400)%syn;
    if(age<0) age+=syn;
    var p=age/syn, md=window.RR25_MOND?window.RR25_MOND.day():null;
    if(md){
      p=md.p;
      if(md.key==="neu") return {wort:"Setzen",satz:"Neu setzen. Still halten."};
      if(md.key==="voll") return {wort:"Halten",satz:"Sichtbar. Nicht nachsetzen."};
      if(md.key==="zu") return p<0.22?{wort:"Setzen",satz:"Wachsen lassen. Nicht hetzen."}:(p<0.28||md.viertel===1?{wort:"Halten",satz:"Form geben. Grenze halten."}:{wort:"Halten",satz:"Kraft sammeln. Klar bleiben."});
      return (md.viertel===3||(p>=0.72&&p<0.78))?{wort:"Abgeben",satz:"Lösen. Zurück zur Mitte."}:(p<0.72?{wort:"Abgeben",satz:"Abgeben. Was fällt, darf fallen."}:{wort:"Abgeben",satz:"Leeren. Schlafen lassen."});
    }
    if(p<0.03||p>0.97) return {wort:"Setzen",satz:"Neu setzen. Still halten."};
    if(p<0.22) return {wort:"Setzen",satz:"Wachsen lassen. Nicht hetzen."};
    if(p<0.28) return {wort:"Halten",satz:"Form geben. Grenze halten."};
    if(p<0.47) return {wort:"Halten",satz:"Kraft sammeln. Klar bleiben."};
    if(p<0.53) return {wort:"Halten",satz:"Sichtbar. Nicht nachsetzen."};
    if(p<0.72) return {wort:"Abgeben",satz:"Abgeben. Was fällt, darf fallen."};
    if(p<0.78) return {wort:"Abgeben",satz:"Lösen. Zurück zur Mitte."};
    return {wort:"Abgeben",satz:"Leeren. Schlafen lassen."};
  }
  function paint(){
    var home=document.getElementById("home");
    if(!home) return;
    var el=document.getElementById("mondSag");
    if(!el){
      el=document.createElement("p");
      el.id="mondSag";
      var kast=document.getElementById("kasten");
      if(kast) home.insertBefore(el, kast.nextSibling);
      else home.appendChild(el);
    }
    var m=phase();
    el.innerHTML="<span>"+m.wort+"</span>"+m.satz;
  }
  var css=document.createElement("style");
  css.textContent=[
    "#mondSag{margin:.15rem 0 .4rem;font-family:Georgia,serif;font-size:.95rem;line-height:1.4;color:#ead8ff}",
    "#mondSag span{display:inline-block;margin-right:.45rem;letter-spacing:.16em;text-transform:uppercase;font-size:.62rem;font-family:system-ui,sans-serif;color:#ff7ad9;vertical-align:middle}"
  ].join("");
  document.head.appendChild(css);
  paint();
  setTimeout(paint,500);
  if(typeof show==="function" && !show._mond){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="home") paint();
      return r;
    };
    show._mond=1;
  }
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-skizze.js ==== */
try{
(function(){
  var KEY="rr25_skizze";
  var ZKEY="rr25_tagesziel_v1";
  var A='<svg viewBox="0 0 360 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><filter id="g3" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><line x1="108" y1="78" x2="148" y2="78" stroke="rgba(180,160,210,.55)" stroke-width="2"/><line x1="212" y1="78" x2="252" y2="78" stroke="rgba(180,160,210,.55)" stroke-width="2"/><circle cx="68" cy="78" r="42" fill="#0b0814" stroke="#d4b8ee" stroke-width="2.4" filter="url(#g3)"/><circle cx="180" cy="78" r="42" fill="#0b0814" stroke="#7ef0e6" stroke-width="2.6" filter="url(#g3)"/><circle cx="292" cy="78" r="42" fill="#0b0814" stroke="#ff7ad9" stroke-width="2.4" filter="url(#g3)"/><text x="68" y="90" text-anchor="middle" font-size="34" fill="#f6eefe" font-family="Georgia,serif">3</text><text x="180" y="90" text-anchor="middle" font-size="34" fill="#e8fff8" font-family="Georgia,serif">6</text><text x="292" y="90" text-anchor="middle" font-size="34" fill="#ffe6f6" font-family="Georgia,serif">9</text><text x="68" y="140" text-anchor="middle" font-size="13" fill="#c8b6dc" font-family="system-ui,sans-serif">stehen</text><text x="180" y="140" text-anchor="middle" font-size="13" fill="#9ee8e0" font-family="system-ui,sans-serif">tragen</text><text x="292" y="140" text-anchor="middle" font-size="13" fill="#f0b4d4" font-family="system-ui,sans-serif">siegeln</text><path d="M268 168 C 180 204, 180 204, 92 168" fill="none" stroke="rgba(200,160,190,.7)" stroke-width="1.8"/><polyline points="102,176 92,168 104,163" fill="none" stroke="rgba(200,160,190,.7)" stroke-width="1.8"/></svg>';
  var B='<svg viewBox="0 0 360 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><defs><filter id="gE" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="1.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><line x1="108" y1="78" x2="148" y2="78" stroke="rgba(180,160,210,.55)" stroke-width="2"/><line x1="212" y1="78" x2="252" y2="78" stroke="rgba(180,160,210,.55)" stroke-width="2"/><circle cx="68" cy="78" r="42" fill="#0b0814" stroke="#7ec8a0" stroke-width="2.4" filter="url(#gE)"/><circle cx="180" cy="78" r="42" fill="#0b0814" stroke="#c0aad8" stroke-width="2.4" filter="url(#gE)"/><circle cx="292" cy="78" r="42" fill="#0b0814" stroke="#e8c070" stroke-width="2.4" filter="url(#gE)"/><text x="68" y="84" text-anchor="middle" font-size="15" fill="#d8f0e4" font-family="Georgia,serif">Erde</text><text x="180" y="84" text-anchor="middle" font-size="15" fill="#eee4f8" font-family="Georgia,serif">Mensch</text><text x="292" y="84" text-anchor="middle" font-size="13" fill="#f8e8c0" font-family="Georgia,serif">Universum</text><text x="68" y="140" text-anchor="middle" font-size="13" fill="#c8b6dc" font-family="system-ui,sans-serif">stehen</text><text x="180" y="140" text-anchor="middle" font-size="13" fill="#9ee8e0" font-family="system-ui,sans-serif">tragen</text><text x="292" y="140" text-anchor="middle" font-size="13" fill="#c8b080" font-family="system-ui,sans-serif">siegeln</text><path d="M268 168 C 180 204, 180 204, 92 168" fill="none" stroke="rgba(200,160,190,.7)" stroke-width="1.8"/><polyline points="102,176 92,168 104,163" fill="none" stroke="rgba(200,160,190,.7)" stroke-width="1.8"/></svg>';
  function today(){
    var n=new Date();
    return n.getFullYear()+"-"+String(n.getMonth()+1).padStart(2,"0")+"-"+String(n.getDate()).padStart(2,"0");
  }
  function loadZ(){ try{ return JSON.parse(localStorage.getItem(ZKEY)||"{}"); }catch(e){ return {}; } }
  function saveZ(d){ try{ localStorage.setItem(ZKEY, JSON.stringify(d)); }catch(e){} }
  function locked(){
    var d=loadZ();
    return (d.day===today() && d.txt) ? d : null;
  }
  function esc(s){ return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;"); }
  function mode(){ try{ return localStorage.getItem(KEY)==="emu"?"emu":"369"; }catch(e){ return "369"; } }
  function setMode(m){ try{ localStorage.setItem(KEY,m); }catch(e){} }
  function startOnly(){ return !document.querySelector("#cats .chip.on"); }
  function toLog(txt){
    if(typeof load!=="function"||typeof save!=="function") return;
    var d=load(); d.log=d.log||[];
    var day=today();
    if(d.log.some(function(e){ return e.titel==="Tagesziel" && String(e.day||"")===day; })) return;
    d.log.unshift({
      id: typeof uid==="function"?uid():("z"+Date.now().toString(36)),
      t: typeof now==="function"?now():new Date().toLocaleString("de-CH"),
      titel:"Tagesziel", wer:txt, note:txt, day:day
    });
    try{ save(d); }catch(e){}
  }
  function bindForm(el){
    var go=el.querySelector("#skZielGo");
    var inp=el.querySelector("#skZielT");
    if(!go||!inp||go._on) return;
    go._on=1;
    go.onclick=function(ev){
      ev.preventDefault(); ev.stopPropagation();
      var t=String(inp.value||"").trim().slice(0,180);
      if(!t) return;
      saveZ({day:today(), txt:t});
      toLog(t);
      draw(el, true);
    };
  }
  function draw(el, force){
    if(!el) return;
    var z=locked();
    if(!force && !z && el.querySelector("#skZielT")) { bindForm(el); return; }
    var svg=mode()==="emu"?B:A;
    if(z){
      el.innerHTML=svg+'<div class="skZiel"><small>Tagesziel</small><b>'+esc(z.txt)+'</b></div>';
    } else {
      el.innerHTML=svg+'<div class="skForm"><small>Tagesziel</small><input id="skZielT" maxlength="180" placeholder="Ein Satz für heute" autocomplete="off"><button type="button" class="btn primary" id="skZielGo">Setzen</button></div>';
      bindForm(el);
    }
  }
  function mount(){
    var home=document.getElementById("home");
    var list=document.getElementById("list");
    if(!home) return null;
    var el=document.getElementById("skizze");
    if(!el){
      el=document.createElement("div");
      el.id="skizze";
      if(list) home.insertBefore(el, list); else home.appendChild(el);
      el.addEventListener("click", function(ev){
        if(ev.target.closest && (ev.target.closest(".skZiel")||ev.target.closest(".skForm"))) return;
        ev.stopPropagation();
        setMode(mode()==="emu"?"369":"emu");
        var keep=el.querySelector("#skZielT")?el.querySelector("#skZielT").value:"";
        var s=el.querySelector("svg");
        if(s) s.outerHTML=(mode()==="emu"?B:A);
        else draw(el,true);
        var inp=el.querySelector("#skZielT");
        if(inp) inp.value=keep;
      });
      draw(el,true);
    }
    return el;
  }
  function paint(){
    var el=mount();
    if(!el) return;
    el.style.display=startOnly()?"block":"none";
    if(!el.querySelector("svg")) draw(el,true);
    else if(locked() && el.querySelector("#skZielT")) draw(el,true);
    else if(!locked() && el.querySelector(".skZiel")) draw(el,true);
  }
  var css=document.createElement("style");
  css.textContent=[
    "#skizze{display:block;margin:.35rem auto .55rem;width:100%;max-width:26rem;cursor:pointer}",
    "#skizze svg{display:block;width:100%;height:13.2rem}",
    "#skizze .skZiel,#skizze .skForm{cursor:default;background:rgba(48,18,72,.7);border:1px solid rgba(126,200,255,.2);border-radius:1.15rem;padding:.62rem .8rem;margin:.05rem 0 0}",
    "#skizze .skZiel small,#skizze .skForm small{display:block;letter-spacing:.14em;text-transform:uppercase;font-size:.58rem;color:#ff7ad9;margin:0 0 .2rem}",
    "#skizze .skZiel b{display:block;font-family:Georgia,serif;font-weight:500;font-size:1.02rem;color:#f6f0ff}",
    "#skizze .skForm input{text-align:left;margin:.1rem 0 .35rem}",
    "#home:has(#cats .chip.on) #skizze{display:none!important}",
    "#skizze svg circle{animation:skNeon 6.5s ease-in-out infinite}",
    "@keyframes skNeon{0%,100%{opacity:.9}50%{opacity:1}}",
    "@media (prefers-reduced-motion:reduce){#skizze svg circle{animation:none}}"
  ].join("");
  document.head.appendChild(css);
  mount(); paint();
  if(typeof renderList==="function" && !renderList._sk){
    var rl=renderList; renderList=function(){ rl(); paint(); }; renderList._sk=1;
  }
  if(typeof show==="function" && !show._sk){
    var sh=show;
    show=function(id){ var r=sh.apply(this,arguments); if(id==="home") setTimeout(paint,30); return r; };
    show._sk=1;
  }
})();

}catch(e){setTimeout(function(){throw e;});}
