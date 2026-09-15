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
    "#quickFlip{margin:.1rem 0 .55rem}",
    "#quickFlip .tabs{display:grid;grid-template-columns:1fr 1fr;gap:.32rem;margin:0 0 .32rem}",
    "#quickFlip .tabs button{border:1px solid rgba(255,122,217,.22);background:rgba(18,10,32,.7);color:#c4b4e0;border-radius:999px;padding:.42rem .4rem;font:inherit;font-size:.78rem;min-height:2.1rem}",
    "#quickFlip .tabs button.on{color:#14081c;background:linear-gradient(165deg,#ff7ad9,#7ef0e6);border-color:transparent;font-weight:650}",
    "#quickGo{position:relative;padding-right:2.6rem;margin:0;text-align:left;width:100%}",
    "#quickGo .ok{position:absolute;right:.75rem;top:50%;transform:translateY(-50%);width:1.45rem;height:1.45rem;border-radius:50%;border:1px solid rgba(232,160,255,.35);display:flex;align-items:center;justify-content:center;font-size:.85rem}",
    "#quickGo.done .ok{background:linear-gradient(165deg,#ff7ad9,#7ef0e6);border:0;color:#14081c;font-weight:700}",
    "#pinDank,#pinWeg,#quickRow{display:none!important}",
    "#list .card .len{display:inline-block;margin-top:.28rem;font-size:.62rem;letter-spacing:.12em;text-transform:uppercase;color:#7ef0e6}",
    "#list .card .len.voll{color:#ffb3ea}",
    "#werChips{display:flex;flex-wrap:wrap;gap:.32rem;margin:.35rem 0 .1rem}",
    "#werChips button{border:1px solid rgba(255,122,217,.28);background:rgba(28,14,48,.55);color:#f6f0ff;border-radius:999px;padding:.28rem .7rem;font:inherit;font-size:.78rem}",
    "#afterNote{margin:.55rem 0 .2rem}",
    "#buchJump{display:flex;flex-wrap:wrap;gap:.32rem;margin:.2rem 0 .7rem}",
    "#buchJump button{border:1px solid rgba(126,200,255,.22);background:rgba(18,10,32,.7);color:#f6f0ff;border-radius:999px;padding:.32rem .7rem;font:inherit;font-size:.72rem}",
    "#runBuch{margin:.15rem 0 .35rem}",
    "#list .card[data-id=dank],#list .card[data-id=schutzweg]{display:none}"
  ].join("");
  document.head.appendChild(css);

  var face=localStorage.getItem("rr25_face")||"dank";

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

  function paintFace(){
    var go=document.getElementById("quickGo");
    var t1=document.getElementById("faceDank");
    var t2=document.getElementById("faceWeg");
    if(!go) return;
    if(t1) t1.classList.toggle("on", face==="dank");
    if(t2) t2.classList.toggle("on", face==="weg");
    if(face==="dank"){
      go.classList.toggle("done", dankDone());
      go.innerHTML="<b>Tägliches Dankesritual</b><small>Gesundheit · Liebe · Geld · Schutz</small><span class=\"ok\">"+(dankDone()?"\u2713":"")+"</span>";
    } else {
      go.classList.remove("done");
      go.innerHTML="<b>Schutz unterwegs</b><small>Kurz. Stehen oder gehen.</small><span class=\"ok\">→</span>";
    }
  }

  function pin(){
    var home=document.getElementById("home");
    if(!home) return;
    var box=document.getElementById("quickFlip");
    if(!box){
      box=document.createElement("div");
      box.id="quickFlip";
      box.innerHTML=
        '<div class="tabs">'+
          '<button type="button" id="faceDank">Täglich</button>'+
          '<button type="button" id="faceWeg">Schutz</button>'+
        '</div>'+
        '<button type="button" class="card" id="quickGo"></button>';
      var kast=document.getElementById("kasten");
      var cats=document.getElementById("cats");
      if(kast && kast.nextSibling) home.insertBefore(box, kast.nextSibling);
      else if(cats) home.insertBefore(box, cats);
      else home.appendChild(box);
      document.getElementById("faceDank").onclick=function(){
        face="dank"; localStorage.setItem("rr25_face","dank"); paintFace();
      };
      document.getElementById("faceWeg").onclick=function(){
        face="weg"; localStorage.setItem("rr25_face","weg"); paintFace();
      };
      document.getElementById("quickGo").onclick=function(){
        if(typeof fromPlan!=="undefined") fromPlan=null;
        openR(face==="dank"?"dank":"schutzweg");
      };
    } else if(box.parentNode!==home){
      var kast2=document.getElementById("kasten");
      if(kast2 && kast2.nextSibling) home.insertBefore(box, kast2.nextSibling);
    }
    document.querySelectorAll("#pinDank,#pinWeg,#quickRow").forEach(function(n){
      if(n && n.id!=="quickFlip") n.remove();
    });
    paintFace();
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
    var ok=h && (h.textContent||"").trim()==="369";
    if(!ok) document.querySelectorAll("#run #z369").forEach(function(n){ n.remove(); });
  }

  function chips(){
    var run=document.getElementById("run");
    if(!run || !run.classList.contains("on")) return;
    var inp=run.querySelector("input[data-k]");
    if(!inp) return;
    if(run.querySelector("#werChips")) return;
    var list=names();
    if(!list.length) return;
    var row=document.createElement("div");
    row.id="werChips";
    list.forEach(function(n){
      var b=document.createElement("button");
      b.type="button";
      b.textContent=n;
      b.onclick=function(){
        inp.value=n;
        inp.dispatchEvent(new Event("input",{bubbles:true}));
      };
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

  function bookBtn(){
    var run=document.getElementById("run");
    if(!run || !run.classList.contains("on")) return;
    if(run.querySelector("#runBuch")) return;
    var hero=run.querySelector(".hero");
    if(!hero) return;
    var b=document.createElement("button");
    b.type="button";
    b.id="runBuch";
    b.className="btn ghost";
    b.textContent="Im Buch";
    b.onclick=function(){ if(typeof show==="function") show("buch"); };
    hero.appendChild(b);
  }

  function bookJump(){
    var page=document.getElementById("page");
    var buch=document.getElementById("buch");
    if(!page || !buch) return;
    var bar=document.getElementById("buchJump");
    if(!bar){
      bar=document.createElement("div");
      bar.id="buchJump";
      buch.insertBefore(bar, page);
    }
    bar.innerHTML=(R||[]).map(function(r){
      return '<button type="button" data-rid="'+r.id+'">'+r.t+'</button>';
    }).join("");
    bar.querySelectorAll("[data-rid]").forEach(function(b){
      b.onclick=function(){
        if(typeof fromPlan!=="undefined") fromPlan=null;
        openR(b.getAttribute("data-rid"));
      };
    });
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
    if(d.log && d.log[0]){
      d.log[0].note=tx.slice(0,800);
      save(d);
    }
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
        bookBtn();
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
        if(window._rid==="dank"){
          try{ localStorage.setItem("rr25_dank", day()); }catch(e){}
        }
        try{
          var d=load();
          if(d.log && d.log[0]) remember(d.log[0].wer);
        }catch(e){}
      }
      if(id==="buch") setTimeout(bookJump, 80);
      setTimeout(z369only, 40);
      return r;
    };
  }

  pin();
  setTimeout(pin, 500);
})();
