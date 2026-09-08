function escAttr(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
function delLog(id){
  const d=load();
  d.log=(d.log||[]).filter(x=>x.id!==id);
  save(d);
}
function saveLogNote(id,tx){
  const d=load();
  const e=(d.log||[]).find(x=>x.id===id);
  if(e){e.note=String(tx||"").slice(0,800); save(d);}
}
function openLog(id){
  const e=(load().log||[]).find(x=>x.id===id);
  if(!e){paintLog();return;}
  $("#entries").innerHTML=`<div class="card"><p class="sub">${esc(e.t)}</p><h2 style="font-family:Georgia,serif;font-weight:500;margin:.2rem 0">${esc(e.titel)}</h2><p class="words">${esc(e.wer||"ohne Namen")}</p><p class="sub">${e.wesen?"Mit Wesenheit":"Ohne Wesenheit"}</p><textarea id="logNote" placeholder="Kommentar für später">${esc(e.note||"")}</textarea><div class="row"><button type="button" class="btn ghost" id="logBack">Liste</button><button type="button" class="btn primary" id="logDel">Löschen</button></div></div>`;
  $("#logNote").onchange=()=>saveLogNote(id,$("#logNote").value);
  $("#logNote").onblur=()=>saveLogNote(id,$("#logNote").value);
  $("#logBack").onclick=()=>{saveLogNote(id,$("#logNote").value);paintLog();};
  $("#logDel").onclick=()=>{if(confirm("Diesen Eintrag löschen?")){delLog(id);paintLog();}};
}
function paintLog(){
  const rows=load().log||[];
  const box=$("#entries"); if(!box) return;
  box.innerHTML=rows.length?rows.map(e=>`<div class="card"><button type="button" class="card" data-open="${e.id}" style="margin:0;border:0;padding:0;background:transparent"><b>${esc(e.titel)}</b><small>${esc(e.t)} ${esc(e.wer||"")} ${e.wesen?"· Wesenheit":""}</small></button>${e.note?`<p class="sub" style="text-align:left;margin:.4rem 0 0">${esc(e.note)}</p>`:""}<input data-note="${e.id}" placeholder="Kommentar für später" value="${escAttr(e.note||"")}"></div>`).join("")+`<div class="row"><button type="button" class="btn ghost" id="logClear">Alles löschen</button></div>`:"<p class='sub'>Noch leer.</p>";
  $$("#entries [data-open]").forEach(b=>b.onclick=()=>openLog(b.dataset.open));
  $$("#entries [data-note]").forEach(inp=>{
    const store=()=>saveLogNote(inp.dataset.note,inp.value);
    inp.onchange=store; inp.onblur=store;
  });
  const c=$("#logClear");
  if(c)c.onclick=()=>{if(confirm("Ganze Chronik löschen?")){const d=load();d.log=[];save(d);paintLog();}};
}
