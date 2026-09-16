(function(){
  var DROP={finst:1,fremd:1,fil:1,schaden:1};
  function grab(id){
    for(var i=0;i<(R||[]).length;i++) if(R[i].id===id) return R[i];
    return null;
  }
  function lock(){
    if(typeof R==="undefined") return;
    for(var i=R.length-1;i>=0;i--) if(DROP[R[i].id]) R.splice(i,1);
    var w=grab("wesen"); if(w){ w.t="Wesenheit für Auftrag"; w.s="Kontakt mit Auftrag."; w.tag="Feld"; }
    var a=grab("ahn"); if(a){ a.t="Ahnen rufen"; a.s="Ehren, begrenzen, Auftrag."; a.tag="Feld"; }
    ["ueber","segen","fluch"].forEach(function(id){ var r=grab(id); if(r) r.tag="Person X"; });
  }
  function chip(){
    var cats=document.getElementById("cats");
    if(!cats || cats.querySelector('[data-cat="Person X"]')) return;
    var b=document.createElement("button");
    b.type="button"; b.className="chip"; b.setAttribute("data-cat","Person X"); b.textContent="Person X";
    b.onclick=function(){ cat="Person X"; if(typeof renderList==="function") renderList(); };
    var feld=cats.querySelector('[data-cat="Feld"]');
    if(feld) cats.insertBefore(b, feld); else cats.appendChild(b);
  }
  if(typeof renderList==="function" && !renderList._ed){
    var rl=renderList;
    renderList=function(){ lock(); rl(); chip(); };
    renderList._ed=1;
  }
  lock(); if(typeof renderList==="function") try{ renderList(); }catch(e){}

  var css=document.createElement("style");
  css.textContent=[
    "#pinDank{position:relative;padding-right:3.1rem}",
    "#pinDank .ok{position:absolute;right:.85rem;top:50%;transform:translateY(-50%);width:1.55rem;height:1.55rem;border-radius:50%;border:2px solid rgba(255,122,217,.45);display:flex;align-items:center;justify-content:center}",
    "#pinDank.done .ok{background:linear-gradient(165deg,#ff7ad9,#7ef0e6);border:0;color:#14081c;font-weight:700}",
    "#afterStay,#stay{display:none!important}",
    ".bakBar .btn{min-height:2rem;font-size:.72rem;font-weight:500}",
    "#entries .logrow{display:grid;grid-template-columns:1fr auto;gap:.7rem;align-items:start;padding:.85rem 0;border-top:1px solid rgba(126,200,255,.16)}",
    "#entries .logrow b{font-family:Georgia,serif;font-weight:500;font-size:1.02rem}",
    "#entries .logrow .meta{margin-top:.2rem}",
    "#entries .logrow .logact{margin-top:.45rem;border:0;background:none;color:#ff7ad9;padding:0;font:inherit;font-size:.78rem;letter-spacing:.04em}",
    "#entries .logrow img{width:4.6rem;height:4.6rem;object-fit:cover;border-radius:.85rem;border:1px solid rgba(126,200,255,.2);background:#0a0612}",
    "#entries .logrow img.sig{object-fit:contain}"
  ].join("");
  document.head.appendChild(css);

  function zoom(src){
    var old=document.getElementById("picZoom"); if(old) old.remove();
    var w=document.createElement("div");
    w.id="picZoom";
    w.style.cssText="position:fixed;inset:0;background:rgba(4,2,10,.92);z-index:80;display:flex;align-items:center;justify-content:center;padding:1.2rem";
    w.innerHTML='<img alt="" src="'+src+'" style="max-width:100%;max-height:92%;border-radius:1rem;background:#0a0612">';
    w.onclick=function(){ w.remove(); };
    document.body.appendChild(w);
  }

  paintLog=function(){
    var box=document.getElementById("entries");
    if(!box) return;
    var rows=(typeof load==="function"?load().log:null)||[];
    if(!rows.length){ box.innerHTML="<p class='meta'>Noch leer.</p>"; return; }
    box.innerHTML=rows.map(function(e){
      return '<div class="logrow" data-eid="'+e.id+'">'+ 
        '<div><b>'+(e.titel||"")+'</b>'+
        '<div class="meta">'+(e.t||"")+(e.wer?" · "+e.wer:"")+'</div>'+
        (e.note?'<p style="margin:.35rem 0 0;white-space:pre-wrap">'+String(e.note).replace(/</g,"")+'</p>':'')+
        '<button type="button" class="logact" data-open="'+e.id+'">Öffnen</button></div>'+
        '<div class="logpic" data-pic="'+e.id+'"></div></div>';
    }).join("");
    box.querySelectorAll("[data-open]").forEach(function(b){
      b.onclick=function(){ if(typeof openLog==="function") openLog(b.getAttribute("data-open")); };
    });
    rows.forEach(function(e){
      var hold=box.querySelector('[data-pic="'+e.id+'"]');
      if(!hold) return;
      function put(src, sig){
        if(!src || hold.querySelector("img")) return;
        var img=document.createElement("img");
        img.src=src; if(sig) img.className="sig";
        img.onclick=function(){ zoom(src); };
        hold.appendChild(img);
      }
      if(e.img) put(e.img, /sigil/i.test(e.titel||""));
      if(typeof fotoGet==="function"){
        fotoGet(e.id).then(function(arr){
          if(arr && arr[0]) put(arr[0], /sigil/i.test(e.titel||""));
        });
      }
    });
  };

  if(typeof openLog==="function" && !openLog._ed){
    var op=openLog;
    openLog=function(id){
      op(id);
      var box=document.getElementById("entries");
      if(!box) return;
      box.querySelectorAll(".btn.primary").forEach(function(b){ b.className="btn ghost"; });
    };
    openLog._ed=1;
  }

  var KEY="rr25_dank";
  function day(){
    var n=new Date();
    return n.getFullYear()+"-"+String(n.getMonth()+1).padStart(2,"0")+"-"+String(n.getDate()).padStart(2,"0");
  }
  function mark(){
    var pin=document.getElementById("pinDank");
    if(!pin) return;
    var on=false; try{ on=localStorage.getItem(KEY)===day(); }catch(e){}
    pin.classList.toggle("done", on);
    var ok=pin.querySelector(".ok");
    if(!ok){ ok=document.createElement("span"); ok.className="ok"; pin.appendChild(ok); }
    ok.textContent=on?"\u2713":"";
  }
  if(typeof show==="function" && !show._ed){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="after" && window._rid==="dank"){ try{ localStorage.setItem(KEY, day()); }catch(e){} }
      if(id==="home") mark();
      if(id==="log") setTimeout(function(){ if(typeof paintLog==="function") paintLog(); },0);
      if(id==="after"){
        var g=document.getElementById("afterGo");
        if(g){ g.textContent="Fertig"; g.onclick=function(){ sh("home"); }; }
      }
      return r;
    };
    show._ed=1;
  }
  mark();
})();
