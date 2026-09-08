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
