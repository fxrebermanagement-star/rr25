(function(){
  function moonP(){
    var syn=29.53058867;
    var nm=Date.UTC(2000,0,6,18,14)/1000;
    var age=(((Date.now()/1000)-nm)/86400)%syn;
    if(age<0) age+=syn;
    return age/syn;
  }
  function hint(){
    var p=moonP(), md=window.RR25_MOND?window.RR25_MOND.day():null;
    var el=document.getElementById("kHint");
    if(!el){
      var kast=document.getElementById("kasten");
      if(!kast) return;
      el=document.createElement("p");
      el.id="kHint";
      kast.parentNode.insertBefore(el, kast.nextSibling);
    }
    el.className="kHintLine";
    if(md){
      if(md.key==="voll") el.textContent="Vollmond \u00b7 Echo. Nicht nachsetzen.";
      else if(md.key==="neu") el.textContent="Neumond \u00b7 Soft setzen erlaubt.";
      else if(md.key==="ab"&&md.p>0.72) el.textContent="Abnehmend \u00b7 Still. Buch zu.";
      else el.textContent="";
    }
    else if(p>0.47&&p<0.53) el.textContent="Vollmond \u00b7 Echo. Nicht nachsetzen.";
    else if(p>0.72) el.textContent="Abnehmend \u00b7 Still. Buch zu.";
    else if(p<0.04||p>0.96) el.textContent="Neumond \u00b7 Soft setzen erlaubt.";
    else el.textContent="";
  }
  /* Ton eines Chronik-Eintrags über Ritual-ID/Typ (rituals-v2.js), nicht über Textsuche.
     Reihenfolge: rid aus dem Echo-Rückblick -> Titel = Ritualname (ohne « · Härte» / « · abgebrochen»)
     -> ältere Ritualnamen -> Tagesziel/Sigille/Gabe sind neutral (nur unter «Alle»; Grau zeigt nur Tagesziel und Sigille). */
  var ALIAS={liebezw:"liebe2",fremd:"wesen",fil:"wesen",finst:"vollmond",schaden:"stopp"};
  var OLD={"Trennung — selbst":"soft","Trennung zweier anderer":"hard","Nur wenn nötig — Wesenheit":"hard","Liebesritual":"soft","Anziehung und Kontakt":"soft","Finsternis":"feld","Ahnenkontakt":"feld","Fremde Wesenheit":"hard","Filterübung":"feld","Feld zu":"soft"};
  function rlist(){ try{ return R; }catch(e){ return []; } }
  function rById(id){ id=ALIAS[id]||id; var L=rlist(); for(var i=0;i<L.length;i++) if(L[i].id===id) return L[i]; return null; }
  function rTone(r){ return r.hard?"hard":(r.tone==="hard"||r.tone==="grenze"||r.tone==="feld"||r.tone==="neutral")?r.tone:"soft"; }
  var ridMemo=null, ridAt=0;
  function ridOf(id){
    if(!ridMemo || Date.now()-ridAt>1500){
      ridMemo={}; ridAt=Date.now();
      try{ (JSON.parse(localStorage.getItem("rr25_echo_v1")||"{}").items||[]).forEach(function(it){ if(it&&it.eid&&it.rid) ridMemo[it.eid]=it.rid; }); }catch(e){}
    }
    return ridMemo[id]||"";
  }
  function toneOf(e){
    if(!e) return "neutral";
    var t=String(e.titel||"").trim();
    if(e.kind==="gabe" || /^(Tagesziel|Sigille|Gabe|Opfer|Opfergabe)$/i.test(t)) return "neutral";
    var r=rById(ridOf(e.id));
    if(!r){
      var base=t.replace(/ · abgebrochen$/,""), best=null;
      rlist().forEach(function(x){ if(x&&x.t&&(base===x.t||base.indexOf(x.t+" · ")===0)&&(!best||x.t.length>best.t.length)) best=x; });
      r=best;
    }
    if(r) return rTone(r);
    var base2=t.replace(/ · .*$/,"");
    if(OLD[base2]) return OLD[base2];
    if(/fluch|bindung|übernehm|nagelhart|wesenheit/i.test(t)) return "hard";
    if(/trennung|band lösen|grenze/i.test(t)) return "grenze";
    if(/mond|ahnen|finsternis|echo lesen/i.test(t)) return "feld";
    return "soft";
  }
  window.RR25_TONE=toneOf;
  var FILT="alle";
  function bar(){
    var box=document.getElementById("entries");
    if(!box) return;
    var old=document.getElementById("logFilt");
    if(old) old.remove();
    var n=document.createElement("div");
    n.id="logFilt";
    var LAB={alle:"Alle",soft:"Soft",grenze:"Grenze",hard:"Hard",feld:"Feld",grau:"Grau"};
    ["alle","soft","grenze","hard","feld","grau"].forEach(function(k){
      var b=document.createElement("button");
      b.type="button";
      b.className="chip logchip log-"+k+(FILT===k?" on":"");
      b.textContent=LAB[k];
      b.onclick=function(){ FILT=k; if(typeof paintLog==="function") paintLog(); };
      n.appendChild(b);
    });
    box.parentNode.insertBefore(n, box);
  }
  if(typeof paintLog==="function" && !paintLog._fein){
    var pl=paintLog;
    paintLog=function(){
      pl();
      bar();
      if(FILT==="alle") return;
      var box=document.getElementById("entries");
      if(!box) return;
      var rows=typeof load==="function"?(load().log||[]):[];
      var by={};
      rows.forEach(function(e){ if(e) by[e.id]=e; });
      box.querySelectorAll("[data-eid]").forEach(function(el){
        var e=by[el.getAttribute("data-eid")];
        var ok=FILT==="grau"?/^(Tagesziel|Sigille)$/i.test(String(e&&e.titel||"").trim()):toneOf(e)===FILT;
        if(!ok) el.style.display="none";
      });
    };
    paintLog._fein=1;
  }
  function planFix(){
    var list=document.getElementById("plList");
    if(!list||typeof load!=="function") return;
    var d=load();
    list.querySelectorAll(".entry").forEach(function(el,i){
      var p=(d.planned||[])[i];
      if(!p) return;
      if(p.fenster && !p.id){
        var setBtn=el.querySelector(".btn.primary");
        if(setBtn && setBtn.textContent==="Setzen"){
          setBtn.textContent="Ritual wählen";
          setBtn.onclick=function(ev){
            ev.preventDefault();
            var sel=document.getElementById("plR");
            var w=document.getElementById("plW");
            if(w) w.value=p.titel||"";
            if(sel) sel.focus();
          };
        }
      }
    });
  }
  if(typeof paintPlan==="function" && !paintPlan._fein){
    var pp=paintPlan;
    paintPlan=function(){ pp(); setTimeout(planFix,40); };
    paintPlan._fein=1;
  }
  var css=document.createElement("style");
  css.textContent=[
    ".kHintLine{margin:.08rem 0 .22rem;text-align:center;color:#7ec8ff;letter-spacing:.12em;font-size:.62rem;text-transform:uppercase;min-height:.7rem}",
    "#logFilt{display:flex;gap:.35rem;margin:.15rem 0 .55rem;flex-wrap:wrap}",
    "#logFilt .log-soft{border-color:#2ecc71;color:#7dffb0}",
    "#logFilt .log-soft.on{background:rgba(46,204,113,.25);color:#b6ffd4}",
    "#logFilt .log-grenze{border-color:#ffb86b;color:#ffd19a}","#logFilt .log-grenze.on{background:rgba(255,184,107,.22);color:#ffe2bd}","#logFilt .log-hard{border-color:#e74c3c;color:#ff8a7a}",
    "#logFilt .log-hard.on{background:rgba(231,76,60,.22);color:#ffc4bc}",
    "#logFilt .log-feld{border-color:#9b8cff;color:#c9b8ff}",
    "#logFilt .log-feld.on{background:rgba(155,140,255,.22);color:#e4dcff}",
    "#logFilt .logchip.log-grau{border-color:#8f8aa0;color:#8f8aa0;background:transparent;font-size:.64rem;padding:.16rem .48rem;min-height:1.45rem;letter-spacing:.06em}",
    "#logFilt .logchip.log-grau.on{background:rgba(143,138,160,.2);color:#bdb8c8;border-color:#8f8aa0;box-shadow:none}",
    ".kaltoday{padding:1.05rem .95rem!important}",
    ".kaltoday b{font-size:1.18rem!important}",
    "#kalList .kalcard:not(.kaltoday){padding:.55rem .7rem;opacity:.92}",
    "#cats{margin-top:.15rem!important}"
  ].join("");
  document.head.appendChild(css);
  hint();
  if(typeof show==="function" && !show._fein){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="home") hint();
      if(id==="log") setTimeout(function(){ if(typeof paintLog==="function") paintLog(); },20);
      if(id==="geplant") setTimeout(planFix,50);
      return r;
    };
    show._fein=1;
  }
})();
