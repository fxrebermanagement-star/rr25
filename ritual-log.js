function escAttr(s){
  return String(s||"").replace(/&/g,"\u0026amp;").replace(/</g,"\u0026lt;").replace(/>/g,"\u0026gt;").replace(/"/g,"\u0026quot;");
}
function wesenTxt(e){
  return (e && e.wesen) ? "Mit Wesenheit" : "Ohne Wesenheit";
}
/* Build 112: Datum und Zeit oben im Eintrag, z. B. «Mo 19.10.2026 · 15:34», dazu die Mondphase. (.sub ist global versteckt.) */
function logWannMs(e){
  var m=String(e&&e.t||"").match(/(\d{1,2})\.(\d{1,2})\.(\d{4})(?:,?\s*(\d{1,2}):(\d{2}))?/);
  if(m) return new Date(+m[3],+m[2]-1,+m[1],+(m[4]||12),+(m[5]||0)).getTime();
  var p=Date.parse(String(e&&e.t||"")); return isNaN(p)?null:p;
}
function logWann(e){
  var ms=logWannMs(e); if(ms==null) return String(e&&e.t||"");
  var d=new Date(ms), W=["So","Mo","Di","Mi","Do","Fr","Sa"];
  function z(n){ return (n<10?"0":"")+n; }
  return W[d.getDay()]+" "+d.getDate()+"."+(d.getMonth()+1)+"."+d.getFullYear()+" \u00b7 "+z(d.getHours())+":"+z(d.getMinutes());
}
function logMond(e){
  var ms=logWannMs(e), M=window.RR25_MOND; if(ms==null||!M||!M.fenster) return "";
  var f=M.fenster(ms); return f.sym+" "+f.say;
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
    '<p class="logWann">'+esc(logWann(e))+'</p>'+
    (logMond(e)?'<p class="logMond">'+esc(logMond(e))+'</p>':'')+
    '<h2 style="font-family:Georgia,serif;font-weight:500;margin:.2rem 0">'+esc(window.RR_ANZEIGE?window.RR_ANZEIGE(e.titel):e.titel)+'</h2>'+
    '<p class="logWesen">'+wesenTxt(e)+'</p>'+
    '<input id="logWer" placeholder="Name / Person X" value="'+escAttr(e.wer||"")+'">'+
    '<textarea id="logNote" placeholder="Kommentar">'+esc(e.note||"")+'</textarea>'+
    '<div class="row">'+
    '<button type="button" class="btn ghost" id="logBack">Liste</button>'+
    '<button type="button" class="btn primary" id="logSave">Speichern</button>'+
    '</div>'+
    '<div class="logDelRow"><button type="button" class="logDel" id="logDel">Löschen</button></div>'+
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
  if(!rows.length){ box.innerHTML="<p class='logLeer'>Noch nichts abgelegt. Dein erstes Ritual erscheint hier.</p>"; return; }
  box.innerHTML=rows.map(function(e){
    return '<div class="entry" data-eid="'+e.id+'">'+
      '<b>'+esc(window.RR_ANZEIGE?window.RR_ANZEIGE(e.titel):e.titel)+'</b>'+
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
