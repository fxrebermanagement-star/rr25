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
      el.className="meta";
      el.style.textAlign="center";
      el.style.margin=".15rem 0 .35rem";
      kast.parentNode.insertBefore(el, kast.nextSibling);
    }
    if(p>0.47&&p<0.53) el.textContent="Vollmond · Echo. Nicht nachsetzen.";
    else if(p>0.72) el.textContent="Abnehmend · Still. Buch zu.";
    else if(p<0.04||p>0.96) el.textContent="Neumond · Soft setzen erlaubt.";
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
    n.style.display="flex";
    n.style.gap=".35rem";
    n.style.margin=".2rem 0 .5rem";
    n.style.flexWrap="wrap";
    ["alle","soft","hard","feld"].forEach(function(k){
      var b=document.createElement("button");
      b.type="button";
      b.className="chip"+(FILT===k?" on":"");
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
      var items=d.planned||[];
      var p=items[i];
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
            var m=document.createElement("p");
            m.className="msg";
            m.textContent="Fenster merken. Ritual oben wählen, dann Vormerken.";
            el.appendChild(m);
          };
        }
      }
    });
  }
  if(typeof paintPlan==="function" && !paintPlan._fein){
    var pp=paintPlan;
    paintPlan=function(){
      pp();
      setTimeout(planFix,40);
    };
    paintPlan._fein=1;
  }
  var css=document.createElement("style");
  css.textContent="#kHint{color:#7ec8ff;letter-spacing:.08em;font-size:.68rem}";
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
