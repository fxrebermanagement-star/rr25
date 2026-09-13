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
