(function(){
  var HARD=/fluch|bindung|person|schaden|übernehm|hart|nagel/i;
  var SOFT=/dank|schutz|segen|heil|anzieh|liebe(?!.*zwang)|trenn.*selbst|energie|zurück|karma|ahn|filter|gabe|karte/i;
  function moonP(){
    var syn=29.53058867;
    var nm=Date.UTC(2000,0,6,18,14)/1000;
    var age=(((Date.now()/1000)-nm)/86400)%syn;
    if(age<0) age+=syn;
    return age/syn;
  }
  function hint(){
    var p=moonP();
    var el=document.getElementById("kHint");
    if(!el){
      var kast=document.getElementById("kasten");
      if(!kast) return;
      el=document.createElement("p");
      el.id="kHint";
      kast.parentNode.insertBefore(el, kast.nextSibling);
    }
    el.className="kHintLine";
    if(p>0.47&&p<0.53) el.textContent="Vollmond \u00b7 Echo. Nicht nachsetzen.";
    else if(p>0.72) el.textContent="Abnehmend \u00b7 Still. Buch zu.";
    else if(p<0.04||p>0.96) el.textContent="Neumond \u00b7 Soft setzen erlaubt.";
    else el.textContent="";
  }
  function toneOf(e){
    var t=String((e&&e.titel)||"");
    var id=String((e&&e.id)||"");
    if(HARD.test(t)||HARD.test(id)||/fluch|bind|px|trenn2|liebe2/.test(id)) return "hard";
    if(SOFT.test(t)) return "soft";
    return "feld";
  }
  var FILT="alle";
  function bar(){
    var box=document.getElementById("entries");
    if(!box) return;
    var old=document.getElementById("logFilt");
    if(old) old.remove();
    var n=document.createElement("div");
    n.id="logFilt";
    ["alle","soft","hard","feld"].forEach(function(k){
      var b=document.createElement("button");
      b.type="button";
      b.className="chip logchip log-"+k+(FILT===k?" on":"");
      b.textContent=k==="alle"?"Alle":k==="soft"?"Soft":k==="hard"?"Hard":"Feld";
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
      var map={};
      rows.forEach(function(e){ map[e.id]=toneOf(e); });
      box.querySelectorAll("[data-eid]").forEach(function(el){
        var id=el.getAttribute("data-eid");
        if(map[id]!==FILT) el.style.display="none";
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
    "#logFilt .log-hard{border-color:#e74c3c;color:#ff8a7a}",
    "#logFilt .log-hard.on{background:rgba(231,76,60,.22);color:#ffc4bc}",
    "#logFilt .log-feld{border-color:#9b8cff;color:#c9b8ff}",
    "#logFilt .log-feld.on{background:rgba(155,140,255,.22);color:#e4dcff}",
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
