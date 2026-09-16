(function(){
  function pics(e){
    var a=e.pics||e.shots||e.foto||e.photos||[];
    if(typeof a==="string") a=[a];
    return a.filter(Boolean);
  }
  function meta(e){
    var bits=[];
    if(e.wer) bits.push(e.wer);
    if(e.wesen) bits.push("Mit Wesenheit");
    return bits.join(" · ");
  }
  function zoom(src){
    var old=document.getElementById("picZoom");
    if(old) old.remove();
    var w=document.createElement("div");
    w.id="picZoom";
    w.style.cssText="position:fixed;inset:0;background:rgba(4,2,10,.92);z-index:80;display:flex;align-items:center;justify-content:center;padding:1rem";
    w.innerHTML='<img alt="" src="'+src+'" style="max-width:100%;max-height:100%;border-radius:1rem">';
    w.onclick=function(){ w.remove(); };
    document.body.appendChild(w);
  }
  function paint(){
    var box=document.getElementById("entries");
    if(!box) return;
    var rows=(typeof load==="function"?load().log:null)||[];
    if(!rows.length){ box.innerHTML="<p class='meta'>Noch leer.</p>"; return; }
    box.innerHTML=rows.map(function(e){
      var p=pics(e);
      var thumbs=p.map(function(src){
        return '<img class="logpic" alt="" src="'+src+'">';
      }).join("");
      var line=meta(e);
      return '<div class="entry" data-eid="'+e.id+'">'+ 
        '<b>'+(e.titel||"")+'</b>'+
        '<div class="meta">'+(e.t||"")+'</div>'+
        (line?'<div class="meta">'+line+'</div>':'')+
        (e.note?'<p style="margin:.3rem 0 0;white-space:pre-wrap">'+String(e.note).replace(/</g,"")+'</p>':'')+
        (thumbs?'<div class="shots">'+thumbs+'</div>':'')+
        '<div class="row" style="margin-top:.4rem">'+
        '<button type="button" class="btn ghost" data-open="'+e.id+'">Bearbeiten</button>'+
        '<button type="button" class="btn ghost" data-del="'+e.id+'">Löschen</button>'+
        '</div></div>';
    }).join("");
    box.querySelectorAll("[data-open]").forEach(function(b){
      b.onclick=function(ev){ ev.preventDefault(); ev.stopPropagation(); if(typeof openLog==="function") openLog(b.getAttribute("data-open")); };
    });
    box.querySelectorAll("[data-del]").forEach(function(b){
      b.onclick=function(ev){
        ev.preventDefault(); ev.stopPropagation();
        if(confirm("Diesen Eintrag löschen?")){
          if(typeof delLog==="function") delLog(b.getAttribute("data-del"));
          paint();
        }
      };
    });
    box.querySelectorAll(".logpic").forEach(function(img){
      img.style.cssText="width:5.2rem;height:5.2rem;object-fit:cover;border-radius:.8rem;border:1px solid rgba(126,200,255,.2)";
      img.onclick=function(ev){ ev.stopPropagation(); zoom(img.src); };
    });
  }
  paintLog=paint;
  if(typeof show==="function" && !show._logfein){
    var prev=show;
    show=function(id){
      var r=prev.apply(this,arguments);
      if(id==="log") setTimeout(paint,0);
      return r;
    };
    show._logfein=1;
  }
  var st=document.createElement("style");
  st.textContent="#entries .btn{min-height:2.1rem;font-size:.72rem}#entries .entry{padding:.7rem 0}";
  document.head.appendChild(st);
})();
