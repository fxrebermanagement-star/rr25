(function(){
  var DROP={finst:1,fremd:1,fil:1,schaden:1};
  function grab(id){
    for(var i=0;i<(R||[]).length;i++) if(R[i].id===id) return R[i];
    return null;
  }
  function lock(){
    if(typeof R==="undefined") return;
    for(var i=R.length-1;i>=0;i--) if(DROP[R[i].id]) R.splice(i,1);
    var w=grab("wesen");
    if(w){ w.t="Wesenheit für Auftrag"; w.s="Kontakt mit Auftrag. Mass halten."; w.tag="Feld"; }
    var a=grab("ahn");
    if(a){ a.t="Ahnen rufen"; a.s="Ehren, begrenzen, Auftrag."; a.tag="Feld"; }
    ["ueber","segen","fluch"].forEach(function(id){
      var r=grab(id);
      if(r) r.tag="Person X";
    });
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

  var stay=document.getElementById("afterStay"); if(stay) stay.remove();
  var go=document.getElementById("afterGo");
  if(go){ go.textContent="Fertig"; go.onclick=function(){ if(typeof show==="function") show("home"); }; }

  var KEY="rr25_dank";
  function day(){
    var n=new Date();
    return n.getFullYear()+"-"+String(n.getMonth()+1).padStart(2,"0")+"-"+String(n.getDate()).padStart(2,"0");
  }
  function mark(){
    var pin=document.getElementById("pinDank");
    if(!pin) return;
    var on=false;
    try{ on=localStorage.getItem(KEY)===day(); }catch(e){}
    pin.classList.toggle("done", on);
    var ok=pin.querySelector(".ok");
    if(!ok){ ok=document.createElement("span"); ok.className="ok"; pin.appendChild(ok); }
    ok.textContent=on?"\u2713":"";
  }
  var css=document.createElement("style");
  css.textContent="#pinDank{position:relative;padding-right:3.1rem}#pinDank .ok{position:absolute;right:.85rem;top:50%;transform:translateY(-50%);width:1.55rem;height:1.55rem;border-radius:50%;border:2px solid rgba(255,122,217,.45);display:flex;align-items:center;justify-content:center}#pinDank.done .ok{background:linear-gradient(165deg,#ff7ad9,#7ef0e6);border:0;color:#14081c;font-weight:700}#afterStay,#stay{display:none!important}";
  document.head.appendChild(css);

  if(typeof show==="function" && !show._ed){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="after" && window._rid==="dank"){
        try{ localStorage.setItem(KEY, day()); }catch(e){}
      }
      if(id==="home") mark();
      if(id==="after"){
        var s=document.getElementById("afterStay"); if(s) s.remove();
        var g=document.getElementById("afterGo");
        if(g){ g.textContent="Fertig"; g.onclick=function(){ sh("home"); }; }
      }
      return r;
    };
    show._ed=1;
  }
  mark();

  function lockField(el){
    if(!el||el._af) return;
    el._af=1;
    el.setAttribute("autocomplete","off");
    el.setAttribute("spellcheck","false");
    el.setAttribute("name","f-"+Math.random().toString(36).slice(2));
  }
  var sig=document.getElementById("sigilT");
  if(sig){ lockField(sig); sig.value=""; }
  document.querySelectorAll("input,textarea").forEach(lockField);

  var prevLog=typeof paintLog==="function"?paintLog:null;
  paintLog=function(){
    if(prevLog) prevLog();
    var box=document.getElementById("entries");
    if(!box) return;
    var detail=!!box.querySelector("#logNote,#logSave");
    box.querySelectorAll(".meta").forEach(function(el){
      if(/Wesenheit|ohne Namen/i.test(el.textContent||"")) el.style.display="none";
    });
    if(!detail){
      box.querySelectorAll("button").forEach(function(b){
        if(/Löschen/i.test(b.textContent||"")) b.remove();
      });
    }
    box.querySelectorAll(".entry, .card").forEach(function(card){
      var shots=card.querySelectorAll(".shots");
      for(var i=1;i<shots.length;i++) shots[i].remove();
    });
  };
})();
