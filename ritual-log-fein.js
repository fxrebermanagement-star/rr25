(function(){
  var prev=typeof paintLog==="function"?paintLog:null;
  function polish(){
    var box=document.getElementById("entries");
    if(!box) return;
    var detail=!!box.querySelector("#logNote, #logSave, [data-cmt]");
    box.querySelectorAll(".meta").forEach(function(el){
      var t=el.textContent||"";
      if(/ohne Namen/i.test(t) || /^Ohne Wesenheit$/i.test(t.trim())) el.style.display="none";
    });
    if(!detail){
      box.querySelectorAll("button").forEach(function(b){
        if(/Löschen/i.test(b.textContent||"")) b.remove();
      });
    }
    box.querySelectorAll(".btn.primary").forEach(function(b){
      if(/Bearbeiten/i.test(b.textContent||"")) b.className="btn ghost";
    });
    box.querySelectorAll(".shots img, #entries img").forEach(function(img){
      if(img.closest("header")) return;
      img.onclick=function(ev){
        ev.stopPropagation();
        var old=document.getElementById("picZoom");
        if(old) old.remove();
        var w=document.createElement("div");
        w.id="picZoom";
        w.style.cssText="position:fixed;inset:0;background:rgba(4,2,10,.92);z-index:80;display:flex;align-items:center;justify-content:center;padding:1rem";
        w.innerHTML='<img alt="" src="'+img.src+'" style="max-width:100%;max-height:100%;border-radius:1rem">';
        w.onclick=function(){ w.remove(); };
        document.body.appendChild(w);
      };
    });
  }
  paintLog=function(){
    if(prev) prev();
    polish();
  };
  if(typeof openLog==="function" && !openLog._fein){
    var op=openLog;
    openLog=function(id){
      op(id);
      setTimeout(polish,0);
    };
    openLog._fein=1;
  }
  if(typeof show==="function" && !show._logfein){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="log") setTimeout(function(){ if(typeof paintLog==="function") paintLog(); },0);
      return r;
    };
    show._logfein=1;
  }
})();
