(function(){
  var css=document.createElement("style");
  css.textContent=[
    "#entries .logrow,#gabeList .logrow{display:grid;grid-template-columns:1fr auto;gap:.7rem;align-items:start;padding:.9rem 0;border-top:1px solid rgba(126,200,255,.16)}",
    "#entries .logrow b,#gabeList .logrow b{font-family:Georgia,serif;font-weight:500;font-size:1.02rem}",
    "#entries .logrow .meta,#gabeList .logrow .meta{margin-top:.2rem}",
    "#entries .logact,#gabeList .logact{margin-top:.4rem;border:0;background:none;color:#ff7ad9;padding:0;font:inherit;font-size:.78rem}",
    "#entries .logpic img,#gabeList .logpic img,#logShots img{width:4.8rem;height:4.8rem;object-fit:cover;border-radius:.85rem;border:1px solid rgba(126,200,255,.22);background:#0a0612;display:block}",
    "#entries .logpic img.sig,#logShots img.sig{object-fit:contain}",
    "#entries .shots{display:flex!important;gap:.4rem;flex-wrap:wrap;margin:.4rem 0}"
  ].join("");
  document.head.appendChild(css);

  function isGabe(e){
    if(typeof window._isGabe==="function") return window._isGabe(e);
    if(!e) return false;
    if(e.kind==="gabe") return true;
    var t=String(e.titel||"").toLowerCase();
    return t==="gabe" || t==="opfer" || t==="opfergabe";
  }
  function zoom(src){
    var old=document.getElementById("picZoom"); if(old) old.remove();
    var w=document.createElement("div");
    w.id="picZoom";
    w.style.cssText="position:fixed;inset:0;background:rgba(4,2,10,.92);z-index:80;display:flex;align-items:center;justify-content:center;padding:1.2rem";
    w.innerHTML='<img alt="" src="'+src+'" style="max-width:100%;max-height:92%;border-radius:1rem">';
    w.onclick=function(){ w.remove(); };
    document.body.appendChild(w);
  }
  function putImg(hold, src, sig){
    if(!hold||!src||hold.querySelector("img")) return;
    var img=document.createElement("img");
    img.src=src;
    if(sig) img.className="sig";
    img.onclick=function(ev){ ev.stopPropagation(); zoom(src); };
    hold.appendChild(img);
  }
  function attach(id, hold, titel, fallback){
    if(fallback) putImg(hold, fallback, /sigil/i.test(titel||""));
    if(typeof fotoGet!=="function") return;
    fotoGet(id).then(function(arr){
      if(arr && arr[0]) putImg(hold, arr[0], /sigil/i.test(titel||""));
    }).catch(function(){});
  }

  paintLog=function(){
    var box=document.getElementById("entries");
    if(!box) return;
    var rows=[];
    try{ rows=(load().log)||[]; }catch(e){ rows=[]; }
    rows=rows.filter(function(e){ return !isGabe(e); });
    if(!rows.length){ box.innerHTML="<p class='meta'>Noch leer.</p>"; return; }
    box.innerHTML=rows.map(function(e){
      var note=String(e.note||"");
      if(note && note===String(e.titel||"")) note="";
      return '<div class="logrow" data-eid="'+e.id+'">'+ 
        '<div><b>'+String(e.titel||"").replace(/</g,"")+'</b>'+
        '<div class="meta">'+String(e.t||"")+(e.wer?" · "+String(e.wer).replace(/</g,""):"")+'</div>'+
        (note?'<p style="margin:.35rem 0 0;white-space:pre-wrap">'+note.replace(/</g,"")+'</p>':'')+
        '<button type="button" class="logact" data-open="'+e.id+'">Öffnen</button></div>'+
        '<div class="logpic" data-pic="'+e.id+'"></div></div>';
    }).join("");
    box.querySelectorAll("[data-open]").forEach(function(b){
      b.onclick=function(){ if(typeof openLog==="function") openLog(b.getAttribute("data-open")); };
    });
    rows.forEach(function(e){
      attach(e.id, box.querySelector('[data-pic="'+e.id+'"]'), e.titel, e.img);
    });
  };

  if(typeof openLog==="function" && !openLog._foto2){
    var ol=openLog;
    openLog=function(id){
      ol(id);
      var box=document.getElementById("entries");
      if(!box) return;
      var sh=box.querySelector("#logShots");
      if(!sh){
        sh=document.createElement("div");
        sh.id="logShots";
        sh.className="shots";
        box.appendChild(sh);
      }
      sh.innerHTML="";
      var e=null;
      try{ e=((load().log)||[]).filter(function(x){ return String(x.id)===String(id); })[0]; }catch(err){}
      attach(id, sh, e&&e.titel, e&&e.img);
    };
    openLog._foto2=1;
  }

  if(typeof show==="function" && !show._foto2){
    var shw=show;
    show=function(id){
      var r=shw.apply(this,arguments);
      if(id==="log") setTimeout(function(){ paintLog(); }, 30);
      return r;
    };
    show._foto2=1;
  }
})();
