(function(){
  var SHORT={dank:1,schutzweg:1,fremd:1};
  var WESEN=
    "Ohne Wesenheit weiter zum Wort.\n"+
    "Mit Wesenheit nur so:\n"+
    "Eigenes Feld bleibt geschlossen.\n"+
    "Nur klare, begrenzbare Präsenz.\n"+
    "Prüfen: Mitte da? Klar oder Nebel? Druck oder Ruhe?\n"+
    "Bei Druck, Theater, Sog: sofort schliessen, ohne Auftrag.\n"+
    "Auftrag nur in einem Satz. Dann vollständig gehen.";

  var css=document.createElement("style");
  css.textContent=[
    "#quickFlip,.tabs,#faceDank,#faceWeg,#pinWeg,#quickRow{display:none!important}",
    "#pinDank,#quickGo{position:relative;padding-right:2.6rem;margin:.1rem 0 .55rem;text-align:left;width:100%}",
    "#pinDank .ok,#quickGo .ok{position:absolute;right:.75rem;top:50%;transform:translateY(-50%);width:1.45rem;height:1.45rem;border-radius:50%;border:1px solid rgba(232,160,255,.35);display:flex;align-items:center;justify-content:center;font-size:.85rem}",
    "#pinDank.done .ok,#quickGo.done .ok{background:linear-gradient(165deg,#ff7ad9,#7ef0e6);border:0;color:#14081c;font-weight:700}",
    "#list .card .len{display:inline-block;margin-top:.28rem;font-size:.62rem;letter-spacing:.12em;text-transform:uppercase;color:#7ef0e6}",
    "#list .card .len.voll{color:#ffb3ea}",
    "#werChips{display:flex;flex-wrap:wrap;gap:.32rem;margin:.35rem 0 .1rem}",
    "#werChips button{border:1px solid rgba(255,122,217,.28);background:rgba(28,14,48,.55);color:#f6f0ff;border-radius:999px;padding:.28rem .7rem;font:inherit;font-size:.78rem}",
    "#afterNote{margin:.55rem 0 .2rem}",
    "#runBuch,#buchJump{display:none!important}",
    "#list .card[data-id=dank]{display:none}"
  ].join("");
  document.head.appendChild(css);

  function day(){
    var n=new Date();
    return n.getFullYear()+"-"+String(n.getMonth()+1).padStart(2,"0")+"-"+String(n.getDate()).padStart(2,"0");
  }
  function dankDone(){ try{ return localStorage.getItem("rr25_dank")===day(); }catch(e){ return false; } }

  function names(){
    try{ return JSON.parse(localStorage.getItem("rr25_wer_list")||"[]"); }catch(e){ return []; }
  }
  function remember(wer){
    var s=String(wer||"").trim();
    if(!s || s.length<2) return;
    var parts=s.split(/·/).map(function(x){ return x.trim(); }).filter(Boolean);
    var list=names();
    parts.forEach(function(p){
      list=list.filter(function(x){ return x.toLowerCase()!==p.toLowerCase(); });
      list.unshift(p);
    });
    localStorage.setItem("rr25_wer_list", JSON.stringify(list.slice(0,5)));
  }

  function pin(){
    var home=document.getElementById("home");
    if(!home) return;
    var flip=document.getElementById("quickFlip");
    if(flip) flip.remove();
    var bar=document.getElementById("buchJump");
    if(bar) bar.remove();
    var rb=document.getElementById("runBuch");
    if(rb) rb.remove();
    var el=document.getElementById("pinDank") || document.getElementById("quickGo");
    if(!el){
      el=document.createElement("button");
      el.type="button";
      el.id="pinDank";
      el.className="card";
    }
    el.id="pinDank";
    el.className="card"+(dankDone()?" done":"");
    el.innerHTML="<b>Tägliches Dankesritual</b><small>Gesundheit · Liebe · Geld · Schutz</small><span class=\"ok\">"+(dankDone()?"\u2713":"")+"</span>";
    el.onclick=function(){ if(typeof fromPlan!=="undefined") fromPlan=null; openR("dank"); };
    var kast=document.getElementById("kasten");
    var cats=document.getElementById("cats");
    if(el.parentNode!==home){
      if(kast && kast.nextSibling) home.insertBefore(el, kast.nextSibling);
      else if(cats) home.insertBefore(el, cats);
      else home.appendChild(el);
    }
  }

  function badgeList(){
    document.querySelectorAll("#list .card[data-id]").forEach(function(b){
      if(b.querySelector(".len")) return;
      var id=b.getAttribute("data-id");
      var r=R.find(function(x){ return x.id===id; });
      var n=r && r.steps ? r.steps.length : 0;
      var kurz=!!SHORT[id] || n<=6;
      var em=document.createElement("em");
      em.className="len"+(kurz?"":" voll");
      em.textContent=kurz?"kurz":"voll";
      b.appendChild(em);
    });
  }

  if(typeof renderList==="function"){
    var _rl=renderList;
    renderList=function(){
      _rl.apply(this,arguments);
      badgeList();
      pin();
    };
  }

  function z369only(){
    var run=document.getElementById("run");
    if(!run) return;
    var h=run.querySelector("h2");
    if(!h || (h.textContent||"").trim()!=="369"){
      document.querySelectorAll("#run #z369").forEach(function(n){ n.remove(); });
    }
  }

  function chips(){
    var run=document.getElementById("run");
    if(!run || !run.classList.contains("on")) return;
    var inp=run.querySelector("input[data-k]");
    if(!inp || run.querySelector("#werChips")) return;
    var list=names();
    if(!list.length) return;
    var row=document.createElement("div");
    row.id="werChips";
    list.forEach(function(n){
      var b=document.createElement("button");
      b.type="button"; b.textContent=n;
      b.onclick=function(){ inp.value=n; inp.dispatchEvent(new Event("input",{bubbles:true})); };
      row.appendChild(b);
    });
    inp.parentNode.insertBefore(row, inp.nextSibling);
  }

  function unifyWesen(){
    var run=document.getElementById("run");
    if(!run) return;
    var h=run.querySelector("h2");
    if(!h || !/Wesenheit/i.test(h.textContent||"")) return;
    var w=run.querySelector(".words");
    if(w) w.textContent=WESEN;
  }

  function afterNote(){
    var box=document.getElementById("after");
    if(!box) return;
    var ta=document.getElementById("afterNote");
    if(!ta){
      ta=document.createElement("textarea");
      ta.id="afterNote";
      ta.placeholder="Was war da — eine Zeile in die Chronik";
      var row=box.querySelector(".row");
      if(row) box.insertBefore(ta, row);
      else box.appendChild(ta);
    }
    ta.value="";
  }
  function flushNote(){
    var ta=document.getElementById("afterNote");
    var tx=ta && ta.value ? ta.value.trim() : "";
    if(!tx || typeof load!=="function") return;
    var d=load();
    if(d.log && d.log[0]){ d.log[0].note=tx.slice(0,800); save(d); }
  }

  document.addEventListener("click", function(e){
    if(e.target && (e.target.id==="afterGo" || e.target.id==="afterStay")) flushNote();
  }, true);

  var run=document.getElementById("run");
  if(run && window.MutationObserver){
    new MutationObserver(function(){
      setTimeout(function(){
        z369only();
        chips();
        unifyWesen();
        var b=document.getElementById("runBuch");
        if(b) b.remove();
      }, 30);
    }).observe(run,{childList:true,subtree:true});
  }

  if(typeof show==="function"){
    var _s=show;
    show=function(id){
      var r=_s.apply(this, arguments);
      if(id==="home") pin();
      if(id==="after"){
        afterNote();
        if(window._rid==="dank"){ try{ localStorage.setItem("rr25_dank", day()); }catch(e){} }
        try{ var d=load(); if(d.log && d.log[0]) remember(d.log[0].wer); }catch(e){}
      }
      if(id==="buch"){
        var bar=document.getElementById("buchJump");
        if(bar) bar.remove();
      }
      setTimeout(z369only, 40);
      return r;
    };
  }

  pin();
  setTimeout(pin, 400);
})();
