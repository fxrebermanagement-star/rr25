(function(){
  var prev=typeof paintLog==="function"?paintLog:null;
  function hostOf(id){
    return document.querySelector('#entries [data-eid="'+id+'"]') ||
      (document.querySelector('#entries [data-open="'+id+'"]')||{}).closest(".entry, .card");
  }
  function addShots(el, srcs){
    if(!el || !srcs || !srcs.length) return;
    var strip=el.querySelector(".shots");
    if(!strip){
      strip=document.createElement("div");
      strip.className="shots";
      var row=el.querySelector(".row");
      if(row) el.insertBefore(strip, row);
      else el.appendChild(strip);
    }
    strip.innerHTML=srcs.map(function(src){
      return '<img alt="" src="'+src+'">';
    }).join("");
    strip.querySelectorAll("img").forEach(function(img){
      img.onclick=function(ev){
        ev.stopPropagation();
        var old=document.getElementById("picZoom");
        if(old) old.remove();
        var w=document.createElement("div");
        w.id="picZoom";
        w.style.cssText="position:fixed;inset:0;background:rgba(4,2,10,.92);z-index:80;display:flex;align-items:center;justify-content:center;padding:1rem";
        w.innerHTML='<img alt="" src="'+img.src+'" style="max-width:100%;max-height:92%;border-radius:1rem;background:#0a0612">';
        w.onclick=function(){ w.remove(); };
        document.body.appendChild(w);
      };
    });
  }
  function pics(){
    if(typeof load!=="function") return;
    var rows=load().log||[];
    rows.forEach(function(e){
      var el=hostOf(e.id);
      if(!el) return;
      var local=[];
      if(e.img) local.push(e.img);
      if(Array.isArray(e.shots)) local=local.concat(e.shots);
      if(local.length) addShots(el, local);
      if(typeof fotoGet==="function"){
        fotoGet(e.id).then(function(arr){
          if(arr && arr.length) addShots(el, arr);
        });
      }
    });
  }
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
    pics();
    if(typeof enhanceLogFotos==="function") enhanceLogFotos();
  }
  paintLog=function(){
    if(prev) prev();
    polish();
  };
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
