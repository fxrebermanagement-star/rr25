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
paintBuch=async function(){
  const page=$("#page"); if(!page)return;
  page.innerHTML="<p class='sub'>Buch lädt …</p>";
  if(!BOOKTEXT){
    try{
      const parts=await Promise.all([0,1,2,3,4].map(n=>fetch("pdfpart"+n+".txt",{cache:"reload"}).then(r=>{if(!r.ok)throw new Error(n);return r.text()})));
      BOOKTEXT=parts.join("\n\n");
    }catch(e){
      page.innerHTML="<p class='sub'>Buchdateien kommen. Neu laden.</p>";
      return;
    }
  }
  page.innerHTML="<div class='words pdfbook'>"+esc(BOOKTEXT)+"</div>";
};
