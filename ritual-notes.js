function openNote(id){
  const n=loadNotes().find(x=>x.id===id);
  if(!n){paintNotes();return;}
  const box=$("#notesOnly");
  box.innerHTML=`<div class="card"><p class="sub">${esc(n.t)}</p><p class="words">${esc(n.note)}</p><div class="row"><button type="button" class="btn ghost" id="nBack">Liste</button><button type="button" class="btn primary" id="nDel">Löschen</button></div></div>`;
  $("#nBack").onclick=paintNotes;
  $("#nDel").onclick=()=>{if(!confirm("Diese Notiz löschen?"))return;saveNotes(loadNotes().filter(x=>x.id!==id));paintNotes();};
}
function paintNotes(){
  const notes=loadNotes();
  const box=$("#notesOnly");
  if(!box)return;
  box.innerHTML=notes.length?notes.map(n=>`<button type="button" class="card" data-nid="${n.id}"><small>${esc(n.t)}</small><b>${esc((n.note||"").slice(0,80))}${(n.note||"").length>80?"…":""}</b></button>`).join(""):"<p class='sub'>Keine Notiz.</p>";
  $$("#notesOnly [data-nid]").forEach(b=>b.onclick=()=>openNote(b.dataset.nid));
}
