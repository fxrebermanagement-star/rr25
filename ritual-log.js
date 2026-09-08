function delLog(id){
  const d=load();
  d.log=(d.log||[]).filter(x=>x.id!==id);
  save(d);
}
function openLog(id){
  const e=(load().log||[]).find(x=>x.id===id);
  if(!e){paintLog();return;}
  const box=$("#entries");
  box.innerHTML=`<div class="card"><p class="sub">${esc(e.t)}</p><h2 style="font-family:Georgia,serif;font-weight:500">${esc(e.titel)}</h2><p class="words">${esc(e.wer||"ohne Namen")}</p><p class="sub">${e.wesen?"Mit Wesenheit":"Ohne Wesenheit"}</p><div class="row"><button type="button" class="btn ghost" id="logBack">Liste</button><button type="button" class="btn primary" id="logDel">Löschen</button></div></div>`;
  $("#logBack").onclick=paintLog;
  $("#logDel").onclick=()=>{if(confirm("Diesen Eintrag löschen?")){delLog(id);paintLog();}};
}
function paintLog(){
  const rows=load().log||[];
  const box=$("#entries");
  if(!box)return;
  box.innerHTML=rows.length?rows.map(e=>`<button type="button" class="card" data-open="${e.id}"><b>${esc(e.titel)}</b><small>${esc(e.t)} ${esc(e.wer||"")} ${e.wesen?"· Wesenheit":""}</small></button>`).join("")+`<div class="row" style="margin-top:1rem"><button type="button" class="btn ghost" id="logClear">Alles löschen</button></div>`:"<p class='sub'>Noch leer.</p>";
  $$("#entries [data-open]").forEach(b=>b.onclick=()=>openLog(b.dataset.open));
  const c=$("#logClear");
  if(c)c.onclick=()=>{if(confirm("Ganze Chronik löschen?")){const d=load();d.log=[];save(d);paintLog();}};
}
