(function(){
  function rows(){
    try{ return (load().log||[]); }catch(e){ return []; }
  }
  function wesen(e){ return e && e.wesen ? "Mit Wesenheit" : "Ohne Wesenheit"; }
  function putNote(id,tx){
    var d=load();
    var e=(d.log||[]).find(function(x){ return String(x.id)===String(id); });
    if(!e) return;
    e.note=String(tx||"").slice(0,800);
    save(d);
  }
  function putWer(id,tx){
    var d=load();
    var e=(d.log||[]).find(function(x){ return String(x.id)===String(id); });
    if(!e) return;
    e.wer=String(tx||"").trim();
    save(d);
  }
  function drop(id){
    var d=load();
    d.log=(d.log||[]).filter(function(x){ return String(x.id)!==String(id); });
    save(d);
  }
  function html(s){
    return String(s||"").replace(/&/g,"\u0026#38;").replace(/</g,"\u0026#60;").replace(/>/g,"\u0026#62;");
  }
  function paint(){
    var box=document.getElementById("entries");
    if(!box) return;
    var list=rows();
    if(!list.length){ box.innerHTML="<p class='meta'>Noch leer.</p>"; return; }
    box.innerHTML=list.map(function(e){
      return '<div class="card" data-eid="'+html(e.id)+'">'+
        '<b>'+html(e.titel)+'</b>'+
        '<div class="meta">'+html(e.t)+'</div>'+
        '<div class="meta">'+wesen(e)+'</div>'+
        '<input data-wer="'+html(e.id)+'" placeholder="Name / Person X">'+
        '<textarea data-cmt="'+html(e.id)+'" placeholder="Kommentar"></textarea>'+
        '<div class="row">'+
        '<button type="button" class="btn primary" data-save="'+html(e.id)+'">Speichern</button>'+
        '<button type="button" class="btn ghost" data-del="'+html(e.id)+'">Löschen</button>'+
        '</div></div>';
    }).join("");
    list.forEach(function(e){
      var w=box.querySelector('[data-wer="'+e.id+'"]');
      var c=box.querySelector('[data-cmt="'+e.id+'"]');
      if(w) w.value=e.wer||"";
      if(c) c.value=e.note||"";
    });
  }
  paintLog=paint;
  openLog=function(id){ paint(); };

  document.addEventListener("click", function(e){
    var saveBtn=e.target.closest("#entries [data-save]");
    var delBtn=e.target.closest("#entries [data-del]");
    if(saveBtn){
      e.preventDefault(); e.stopPropagation();
      var id=saveBtn.getAttribute("data-save");
      var w=document.querySelector('#entries [data-wer="'+id+'"]');
      var c=document.querySelector('#entries [data-cmt="'+id+'"]');
      putWer(id, w?w.value:"");
      putNote(id, c?c.value:"");
      saveBtn.textContent="Gespeichert";
      setTimeout(function(){ saveBtn.textContent="Speichern"; }, 900);
    }
    if(delBtn){
      e.preventDefault(); e.stopPropagation();
      if(confirm("Diesen Eintrag löschen?")){
        drop(delBtn.getAttribute("data-del"));
        paint();
      }
    }
  }, true);

  if(typeof show==="function"){
    var prev=show;
    show=function(id){
      var r=prev.apply(this, arguments);
      if(id==="log") setTimeout(paint, 0);
      return r;
    };
  }
  if(document.getElementById("log") && document.getElementById("log").classList.contains("on")) paint();
})();
