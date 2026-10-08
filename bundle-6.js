/* rr25 · Paket 6/7 · Build 46 · erzeugt mit tools/bundle.py. Nicht von Hand bearbeiten:
   Quelldatei ändern und neu erzeugen. Inhalt in dieser Reihenfolge: design-v3.js, ritual-chronik-grau.js, ritual-ton.js, ritual-saison.js, ritual-resonanzen.js */
/* ==== design-v3.js ==== */
try{
/* design-v3.js — Design v3 über der bestehenden App. Wird zuletzt geladen.
   Nur Darstellung: keine neuen Speicher-Schlüssel, Ritual-Ablauf und Logik bleiben unverändert.
   1 Startseite: Echo-Rückblick und Sicherungs-Hinweis als eine kompakte «Heute»-Leiste.
   2 Chronik: Karten mit Farbkante je Ton, Foto-Vorschau, Echo-Abzeichen.
   3 Ritual-Schritte: Schrittanzeige, Mond/Zeichen im Hintergrund, Knöpfe im Daumenbereich.
   4 Untere Leiste: eine Reihe mit fünf Knöpfen, «Mehr» öffnet Notiz, Gabe, Buch.
   Die Zeichen-Kachel und die Absicht-Zeile («Ablegen») bleiben unberührt. Buch bleibt unberührt. */
(function(){
  if(window.__rr25design3) return;
  window.__rr25design3=1;
  var DAY=86400000;
  var DN=["So","Mo","Di","Mi","Do","Fr","Sa"];
  function $(s,r){ return (r||document).querySelector(s); }
  function $$(s,r){ return [].slice.call((r||document).querySelectorAll(s)); }
  function h(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function getJ(k,d){ try{ var v=JSON.parse(localStorage.getItem(k)||"null"); return v==null?d:v; }catch(e){ return d; } }
  function rituals(){ try{ return R; }catch(e){ return []; } }

  /* =============== 1 · Startseite: «Heute»-Leiste =============== */
  var open=false, syncing=false;
  function strip(){
    var box=document.getElementById("v3Home"); if(!box) return null;
    var el=document.getElementById("heuteStrip");
    if(!el){
      el=document.createElement("div"); el.id="heuteStrip";
      el.innerHTML=
        '<div class="hsHead"><span>Heute</span><small id="hsCount"></small></div>'+
        '<button type="button" class="hsRow" data-k="echo"><i class="hsDot hsEcho"></i><span class="hsTx"></span><em></em></button>'+
        '<div class="hsPanel" id="hsPanel"></div>'+
        '<div class="hsRow" data-k="bak"><i class="hsDot hsBak"></i><span class="hsTx"></span><button type="button" class="hsBtn" id="hsBak">Sichern</button></div>'+
        '<div class="hsRow hsMsg" data-k="msg"><i class="hsDot hsOk"></i><span class="hsTx"></span></div>';
      box.insertBefore(el, box.firstChild);
      $('.hsRow[data-k=echo]',el).onclick=function(){ open=!open; sync(); };
      $('#hsBak',el).onclick=function(ev){
        ev.stopPropagation();
        if(window.RR25_V3 && RR25_V3.sichern){ this.textContent="…"; RR25_V3.sichern(function(){ setTimeout(sync,50); }); }
      };
    }
    return el;
  }
  function sync(){
    if(syncing) return;
    syncing=true;
    if(hObs) hObs.disconnect();
    try{
      var el=strip(); if(!el) return;
      var panel=$("#hsPanel",el);
      var ec=document.getElementById("echoCard");
      if(ec && ec.parentNode!==panel) panel.appendChild(ec);
      var bc=document.getElementById("bakCard");
      var echoRow=$('.hsRow[data-k=echo]',el), bakRow=$('.hsRow[data-k=bak]',el), msgRow=$('.hsRow[data-k=msg]',el);
      var n=0;
      /* Echo */
      var due=(window.RR25_V3&&RR25_V3.dueList)?RR25_V3.dueList():[];
      var thanks=ec && ec.querySelector(".ecThanks");
      if(ec && (due.length||thanks)){
        var name=(($("b",ec)||{}).textContent)||"Ritual", k=ec.getAttribute("data-k")||"3";
        if(thanks){ $(".hsTx",echoRow).innerHTML='<b>Echo</b> · im Echo vermerkt'; $("em",echoRow).textContent="Danke"; }
        else{
          $(".hsTx",echoRow).innerHTML='<b>Echo:</b> '+h(name)+' · Tag '+h(k)+(due.length>1?' <span class="hsMore">+'+(due.length-1)+'</span>':'');
          $("em",echoRow).innerHTML=open?'zuklappen <span class="hsCh up">›</span>':'antworten <span class="hsCh">›</span>';
          n++;
        }
        echoRow.hidden=false; panel.hidden=!open && !thanks;
        echoRow.classList.toggle("on",open);
      } else { echoRow.hidden=true; panel.hidden=true; open=false; }
      /* Sicherung */
      var stale=window.RR25_BAK?RR25_BAK.stale():false;
      if(stale){
        var t=RR25_BAK.last(), d=t?Math.floor((Date.now()-t)/DAY):null;
        $(".hsTx",bakRow).innerHTML='<b>Sicherung fällig</b> · '+(t?'vor '+d+' Tagen':'noch nie');
        var b=$("#hsBak",bakRow); if(b.textContent!=="…") b.textContent="Sichern";
        bakRow.hidden=false; n++;
      } else bakRow.hidden=true;
      /* Rückmeldung nach dem Sichern */
      var m=bc && bc.querySelector(".bkMsg");
      if(m){ $(".hsTx",msgRow).textContent=m.textContent; msgRow.hidden=false; } else msgRow.hidden=true;
      $("#hsCount",el).textContent=n?(n===1?"1 fällig":n+" fällig"):"";
      el.hidden=echoRow.hidden && bakRow.hidden && msgRow.hidden;
    } finally {
      syncing=false;
      if(hObs && hBox){ hObs.takeRecords(); hObs.observe(hBox,{childList:true,subtree:true}); }
    }
  }
  var hObs=null, hBox=null;
  function watchHome(){
    var box=document.getElementById("v3Home");
    if(!box || box===hBox || !window.MutationObserver) return;
    hBox=box;
    if(hObs) hObs.disconnect();
    hObs=new MutationObserver(function(){ sync(); });
    hObs.observe(box,{childList:true,subtree:true});
  }
  /* Mondzeile: Hinweis aus #kHint in dieselbe Zeile wie #mondSag */
  function moonLine(){
    var ms=document.getElementById("mondSag"), kh=document.getElementById("kHint");
    if(!ms) return;
    var t=kh?String(kh.textContent||"").trim():"";
    if(t) ms.setAttribute("data-hint", t.split("·")[0].trim()); else ms.removeAttribute("data-hint");
  }
  function catLabel(){
    var cats=document.getElementById("cats"); if(!cats) return;
    var lab=document.getElementById("v3CatLab");
    if(!lab){ lab=document.createElement("p"); lab.id="v3CatLab"; lab.textContent="Rituale"; }
    if(lab.nextSibling!==cats) cats.parentNode.insertBefore(lab,cats);
  }
  function homeTidy(){ watchHome(); sync(); moonLine(); catLabel(); }

  /* =============== 2 · Chronik als Karten =============== */
  var TONE_LAB={soft:"Soft",hard:"Hard",grenze:"Grenze",feld:"Feld",neutral:""};
  function ritOf(titel){
    var t=String(titel||""), best=null;
    rituals().forEach(function(r){ if(r && r.t && t.indexOf(r.t)===0 && (!best || r.t.length>best.t.length)) best=r; });
    return best;
  }
  function toneOf(e){
    if(window.RR25_TONE) return window.RR25_TONE(e);
    var t=String(e.titel||"");
    if(e.kind==="gabe" || /^(Tagesziel|Sigille|Gabe|Opfer)$/i.test(t)) return "neutral";
    var r=ritOf(t.replace(/ · abgebrochen$/,""));
    return r?(r.hard?"hard":(r.tone||"soft")):"soft";
  }
  function fmtT(s){
    var m=String(s||"").match(/(\d{1,2})\.(\d{1,2})\.(\d{4}),?\s*(\d{1,2}):(\d{2})/);
    if(!m) return String(s||"");
    var d=new Date(+m[3],+m[2]-1,+m[1]);
    var today=new Date(); today.setHours(0,0,0,0);
    var diff=Math.round((today-d)/DAY);
    var day=diff===0?"heute":diff===1?"gestern":DN[d.getDay()]+" "+(+m[1])+"."+(+m[2])+"."+(+m[3]!==today.getFullYear()?m[3]:"");
    return day+" · "+m[4].padStart(2,"0")+":"+m[5];
  }
  function echoMap(){
    var m={};
    (getJ("rr25_echo_v1",{items:[]}).items||[]).forEach(function(it){ m[it.eid]=it; });
    return m;
  }
  function badge(it){
    if(!it||!it.checks) return "";
    var c9=it.checks["9"], c3=it.checks["3"], c=(c9&&c9.a)?c9:(c3&&c3.a)?c3:null;
    var LAB={wirkt:"wirkt",teilweise:"teilweise",offen:"offen"};
    if(c) return '<span class="v3b v3b-'+c.a+'" title="Echo Tag '+((c9&&c9.a)?9:3)+'">'+LAB[c.a]+'</span>';
    var n=Date.now();
    if((c3&&!c3.a&&c3.due<=n)||(c9&&!c9.a&&c9.due<=n)) return '<span class="v3b v3b-due">Echo fällig</span>';
    return "";
  }
  function cards(){
    var box=document.getElementById("entries"); if(!box) return;
    var rows=[]; try{ rows=load().log||[]; }catch(e){}
    var by={}; rows.forEach(function(e){ by[String(e.id)]=e; });
    var em=echoMap();
    $$(".logrow[data-eid]",box).forEach(function(row){
      if(row.classList.contains("v3c")) return;
      var e=by[row.getAttribute("data-eid")]; if(!e) return;
      var tone=toneOf(e);
      row.classList.add("v3c","tone-"+tone);
      var main=row.firstElementChild; if(!main) return;
      var b=$("b",main), meta=$(".meta",main), note=$("p",main), act=$(".logact",main);
      var top=document.createElement("div"); top.className="v3top";
      if(b){ main.insertBefore(top,b); top.appendChild(b); }
      var bd=badge(em[e.id]);
      if(bd) top.insertAdjacentHTML("beforeend",bd);
      if(meta){
        var wer=String(e.wer||""), nt=String(e.note||"");
        if(wer && (wer===nt || e.titel==="Tagesziel")) wer="";
        meta.innerHTML='<span class="v3tone">'+(TONE_LAB[tone]||(e.titel==="Sigille"?"Zeichen":e.titel==="Tagesziel"?"Ziel":""))+'</span>'+h(fmtT(e.t))+(wer?' · '+h(wer):'');
      }
      if(note){ note.className="v3note"; note.removeAttribute("style"); }
      if(act) act.setAttribute("aria-label","Öffnen");
      row.setAttribute("role","button");
      row.onclick=function(ev){
        if(ev.target && ev.target.tagName==="IMG") return;
        if(ev.target && ev.target.closest && ev.target.closest(".logact")) return;
        if(act) act.click();
      };
    });
  }

  /* =============== 3 · Ritual-Schritte =============== */
  var PH=["Tor","Absicht","3·6·9","So sei es","Rückkehr"];
  var PRE=/^(Vorbereitung|Standort|Rahmen|Mitte|Position|Prüfen|Schutz|Filter|Ankommen|Feld|Grenze)$/;
  function phaseOfName(n){
    n=String(n||"").trim();
    if(/^(369|3 · 6 · 9)$/.test(n)) return 2;
    if(/^(So sei es|Entlassen|Wesenheit · Entlassen|Siegel|Salz)$/.test(n)) return 3;
    if(/^(Rückkehr|Schluss|Abschluss|Ende|Status|Echo)$/.test(n)) return 4;
    if(/^(Absicht|Versetzen|Anker|Zurück aus|Wesenheit ·)/.test(n)) return 1;
    if(PRE.test(n)) return 0;
    return -1;
  }
  function curRit(sub){
    var id=window._rid||"", t=String(sub||"").split(" · ")[0].trim(), best=null;
    rituals().forEach(function(r){ if(id && r.id===id) best=r; });
    if(!best) rituals().forEach(function(r){ if(r.t===t || String(sub||"").indexOf(r.t)===0) best=r; });
    return best;
  }
  function phaseNow(run){
    var title=(($(".hero h2",run)||{}).textContent||"").trim();
    var sub=(($(".sub",run)||{}).textContent||"");
    var r=curRit(sub);
    var stepMode=/\d+\/\d+/.test(sub);
    var names=r&&r.flow?r.flow.map(function(x){ return x[0]; }):[];
    var has369=names.indexOf("369")>=0;
    var p;
    if(!stepMode){
      if(/^(Status|Echo)$/.test(title)) p=5; else p=0;
    } else {
      /* Phasen laufen nur vorwärts: ein spätes «Grenze» oder «Feld» fällt nicht auf «Tor» zurück */
      var seq=[], last=0;
      names.forEach(function(nm){ var x=phaseOfName(nm); if(x<0) x=Math.max(1,last); x=Math.max(x,last); seq.push(x); last=x; });
      var i=names.indexOf(title);
      if(i>=0) p=seq[i];
      else {
        p=phaseOfName(title);
        if(p<0){
          var q=-1;
          for(var j=names.length-1;j>=0;j--){ var x=phaseOfName(names[j]); if(x>=0){ q=x; break; } }
          p=Math.max(1,q<0?1:q);
        }
      }
    }
    return {p:p,has369:has369,title:title,r:r,step:stepMode,wes:/ · Mit Wesenheit/.test(sub)};
  }
  var sigSrc="";
  function sigil(){
    var d=getJ("rr25_sigil",{});
    if(!d||!d.l) return "";
    var c=document.getElementById("sigilC");
    try{ if(c) sigSrc=c.toDataURL("image/png"); }catch(e){}
    return sigSrc;
  }
  function bg(ph){
    var app=document.querySelector(".app"); if(!app) return;
    var el=document.getElementById("v3RunBg");
    if(!el){
      el=document.createElement("div"); el.id="v3RunBg"; el.setAttribute("aria-hidden","true");
      el.innerHTML='<div class="v3halo"></div><div class="v3moon"></div><img class="v3sig" alt="">';
      app.appendChild(el);
    }
    var img=$(".v3sig",el), src=sigil();
    if(src && img.getAttribute("src")!==src) img.setAttribute("src",src);
    el.setAttribute("data-p",ph);
    el.classList.toggle("nosig",!src);
  }
  function fit(run){
    if(!run || !run.classList.contains("on")) return;
    var top=run.getBoundingClientRect().top+window.scrollY;
    var pb=parseFloat(getComputedStyle(document.querySelector("main")).paddingBottom)||0;
    run.style.minHeight=Math.max(0,window.innerHeight-top-pb)+"px";
  }
  function decorate(){
    var run=document.getElementById("run"); if(!run) return;
    if(!run.querySelector(".hero")) return;
    if(run.querySelector(".v3step")){ fit(run); return; }
    var ph=phaseNow(run);
    var s=document.createElement("div"); s.className="v3step";
    var p=ph.p;
    s.innerHTML='<div class="v3seg">'+PH.map(function(n,i){
      var cls=i<p?"done":i===p?"now":"";
      if(i===2 && !ph.has369 && ph.r) cls+=" skip";
      if(ph.wes && (i===1||i===3)) cls+=" wes";
      return '<span class="'+cls+'"><i></i><em>'+n+'</em></span>';
    }).join("")+'</div>';
    /* Anker, Echo lesen, Abbruch: kein Fünf-Phasen-Ritual, darum keine Schrittleiste */
    if(ph.r && (ph.r.anker||ph.r.echoRead||ph.r.neutral)) s.classList.add("v3noseg");
    var hero=run.querySelector(".hero");
    run.insertBefore(s, hero);
    /* Aktionen in den Daumenbereich */
    var first=null;
    $$(":scope > .row, :scope > .tor3",run).some(function(r){
      if(r.querySelector("#prev,#next,.btn")){ first=r; return true; } return false;
    });
    var t3=run.querySelector(".tor3");
    if(t3) first=t3;
    if(first) first.classList.add("v3push");
    run.classList.add("v3run");
    bg(p>4?4:p);
    fit(run);
  }

  /* =============== 4 · Untere Leiste: fünf Knöpfe + «Mehr» =============== */
  var ICO_MEHR='<svg viewBox="0 0 24 24"><circle cx="6.5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="17.5" cy="12" r="1.6"/><path d="M12 3.8l.8 2.2M12 18l.8 2.2" opacity=".55"/></svg>';
  var MORE=["notiz","opfer","buch"];
  var SUB={notiz:"Gedanken, Träume",opfer:"Geben, mit Foto",buch:"Das ganze Buch"};
  function nav(){
    var nv=document.querySelector("nav"); if(!nv || nv._d3) return;
    /* Seit dem Ladefix steht die Leiste fertig in index.html: dann nur noch die Knöpfe verdrahten, nichts umbauen */
    var row=$("#navOne",nv), sheet=$("#mehrSheet",nv), mehr=$("#navMehr",nv);
    if(!(row&&sheet&&mehr)){ build(nv); row=$("#navOne",nv); sheet=$("#mehrSheet",nv); mehr=$("#navMehr",nv); }
    if(!(row&&sheet&&mehr)) return;
    nv._d3=1;
    var grid=$(".msGrid",sheet);
    var veil=document.createElement("div"); veil.id="mehrVeil"; veil.hidden=true;
    document.querySelector(".app").appendChild(veil);
    function toggle(on){
      sheet.hidden=!on; veil.hidden=!on;
      mehr.classList.toggle("open",on);
    }
    mehr.addEventListener("click",function(ev){ ev.stopPropagation(); toggle(sheet.hidden); });
    veil.onclick=function(){ toggle(false); };
    grid.addEventListener("click",function(){ setTimeout(function(){ toggle(false); },0); });
    row.addEventListener("click",function(ev){ if(ev.target.closest("button")!==mehr) toggle(false); });
    window.__rr25mehr=toggle;
  }
  /* Rückfall für eine ältere index.html ohne fertige Leiste: Leiste wie bisher aus den alten Knöpfen bauen */
  function build(nv){
    var btn={};
    $$("button[data-v]",nv).forEach(function(b){ btn[b.getAttribute("data-v")]=b; });
    if(!btn.home) return;
    var row=document.createElement("div"); row.className="navR"; row.id="navOne";
    ["home","geplant","kal","log"].forEach(function(v){ if(btn[v]) row.appendChild(btn[v]); });
    var mehr=document.createElement("button");
    mehr.type="button"; mehr.id="navMehr"; mehr.setAttribute("data-v","mehr");
    mehr.innerHTML='<span class="ic">'+ICO_MEHR+'</span><span class="lb">Mehr</span>';
    row.appendChild(mehr);
    var sheet=document.createElement("div"); sheet.id="mehrSheet"; sheet.hidden=true;
    sheet.innerHTML='<p class="msHead">Mehr</p><div class="msGrid"></div>';
    var grid=$(".msGrid",sheet);
    MORE.forEach(function(v){
      var b=btn[v]; if(!b) return;
      b.classList.add("msItem");
      var sm=document.createElement("small"); sm.className="msSub"; sm.textContent=SUB[v]||"";
      b.appendChild(sm);
      grid.appendChild(b);
    });
    nv.innerHTML="";
    nv.appendChild(sheet); nv.appendChild(row);
  }
  function navMark(id){
    var m=document.getElementById("navMehr");
    if(m) m.classList.toggle("on", MORE.indexOf(id)>=0);
  }

  /* =============== Einhängen =============== */
  var css=document.createElement("style");
  css.id="design-v3";
  css.textContent=[
    /* --- 1 Heute-Leiste --- */
    "#v3Home{margin:.35rem 0 .5rem!important}",
    "#v3Home>#bakCard{display:none!important}",
    "#heuteStrip{border-radius:1.1rem;background:linear-gradient(180deg,rgba(40,18,62,.72),rgba(14,8,24,.9));border:1px solid rgba(126,200,255,.22);padding:.42rem .5rem .38rem;box-shadow:0 8px 22px rgba(0,0,0,.22)}",
    "#heuteStrip[hidden],#heuteStrip [hidden]{display:none!important}",
    "#heuteStrip .hsHead{display:flex;justify-content:space-between;align-items:baseline;padding:.05rem .3rem .25rem}",
    "#heuteStrip .hsHead span{font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:#ff9ae4}",
    "#heuteStrip .hsHead small{font-size:.62rem;color:#8e7aa8}",
    "#heuteStrip .hsRow{display:flex;align-items:center;gap:.55rem;width:100%;min-height:2.55rem;padding:.3rem .35rem .3rem .4rem;border:0;border-top:1px solid rgba(255,255,255,.06);background:none;color:#f6f0ff;font:inherit;font-size:.84rem;text-align:left;border-radius:.7rem}",
    "#heuteStrip .hsHead+.hsRow{border-top:0}",
    "#heuteStrip .hsRow.on{background:rgba(126,200,255,.07)}",
    "#heuteStrip .hsTx{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#e6dcf7}",
    "#heuteStrip .hsTx b{font-weight:650;color:#fff}",
    "#heuteStrip .hsMore{font-size:.66rem;color:#8e7aa8;border:1px solid rgba(142,122,168,.45);border-radius:999px;padding:0 .35rem;margin-left:.2rem}",
    "#heuteStrip .hsDot{flex:none;width:.55rem;height:.55rem;border-radius:50%}",
    "#heuteStrip .hsEcho{background:#7ec8ff;box-shadow:0 0 10px rgba(126,200,255,.8)}",
    "#heuteStrip .hsBak{background:#ffb86b;box-shadow:0 0 10px rgba(255,184,107,.7)}",
    "#heuteStrip .hsOk{background:#5fe0a0;box-shadow:0 0 10px rgba(95,224,160,.7)}",
    "#heuteStrip em{flex:none;font-style:normal;font-size:.74rem;color:#7ec8ff;display:flex;align-items:center;gap:.25rem}",
    "#heuteStrip .hsCh{display:inline-block;transform:rotate(90deg);font-size:.9rem;line-height:1;transition:transform .2s}",
    "#heuteStrip .hsCh.up{transform:rotate(-90deg)}",
    "#heuteStrip .hsBtn{flex:none;border:1px solid rgba(255,184,107,.45);background:rgba(255,184,107,.1);color:#ffd2a0;border-radius:999px;padding:.32rem .85rem;font:inherit;font-size:.74rem;font-weight:600;min-height:1.95rem}",
    "#heuteStrip .hsMsg .hsTx{color:#9ee8e0;font-family:Georgia,serif}",
    "#hsPanel{padding:.1rem .15rem .25rem}",
    "#hsPanel #echoCard{margin:.1rem 0 .1rem!important;padding:.55rem .6rem .4rem!important;background:rgba(10,6,20,.55)!important;border:1px solid rgba(126,200,255,.16)!important;border-radius:.9rem!important;box-shadow:none}",
    "#hsPanel #echoCard .ecTag{display:none}",
    "#hsPanel #echoCard b{font-size:.98rem}",
    "#hsPanel #echoCard .ecAbs{margin-top:.25rem}",
    "#hsPanel #echoCard .ecQ{margin:.5rem 0 .1rem}",
    "#hsPanel #echoCard .ecRow .btn{min-height:2.2rem;font-size:.76rem}",
    "#hsPanel #echoCard .ecLater{margin-top:.25rem}",
    /* --- Startseite ruhiger --- */
    "#home #kasten{margin:0 0 .15rem!important}",
    "#mondSag{display:flex;align-items:center;gap:.45rem;margin:.55rem 0 .5rem!important;padding:0 .15rem;font-size:.86rem!important;color:#e0d0f6!important}",
    "#mondSag span{margin:0!important;flex:none}",
    "#mondSag[data-hint]::after{content:attr(data-hint);margin-left:auto;flex:none;font-family:system-ui,sans-serif;font-size:.56rem;letter-spacing:.16em;text-transform:uppercase;color:#7ec8ff;border:1px solid rgba(126,200,255,.3);border-radius:999px;padding:.12rem .5rem}",
    "#home>#kHint{display:none!important}",
    "#pinDank{margin:0 0 .15rem!important}",
    "#v3CatLab{margin:.95rem .15rem .35rem;font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:#ff9ae4}",
    "#home:has(#cats .chip.on) #v3CatLab{margin-top:.8rem}",
    "#cats{margin:0 0 .3rem!important}",
    "#skizze{margin:.55rem 0 0!important}",
    "#skizze svg{height:10.6rem!important}",
    "#skizze .skZiel,#skizze .skForm{margin-top:-.2rem!important}",
    /* --- 2 Chronik --- */
    "#log .hero h2{margin-bottom:.45rem}",
    "#log #bakHint{font-size:.66rem;margin:-.15rem .2rem .5rem!important}",
    "#echoSum{margin-bottom:.7rem!important}",
    "#entries{display:flex;flex-direction:column;gap:.5rem}",
    "#entries .logrow.v3c{position:relative;display:grid;grid-template-columns:1fr auto;gap:.65rem;align-items:center;padding:.62rem .7rem .62rem .95rem!important;border:1px solid rgba(255,255,255,.07)!important;border-radius:1rem;background:linear-gradient(180deg,rgba(38,18,58,.62),rgba(14,8,24,.88));overflow:hidden;cursor:pointer;min-height:3.9rem}",
    "#entries .logrow.v3c::before{content:'';position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--t);box-shadow:0 0 12px var(--t)}",
    "#entries .logrow.v3c:active{transform:scale(.99)}",
    "#entries .v3c.tone-soft{--t:#5fe0a0}#entries .v3c.tone-hard{--t:#ff5470}#entries .v3c.tone-grenze{--t:#ffb86b}#entries .v3c.tone-feld{--t:#b98cff}#entries .v3c.tone-neutral{--t:#8f8aa0}",
    "#entries .v3c>div:first-child{min-width:0}",
    "#entries .v3c .v3top{display:flex;align-items:center;gap:.45rem;min-width:0}",
    "#entries .v3c .v3top b{flex:0 1 auto;min-width:0;font-size:.98rem!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    "#entries .v3c .meta{margin-top:.12rem!important;font-size:.64rem;color:#9a88b4;letter-spacing:.01em}",
    "#entries .v3c .v3tone{color:var(--t);font-size:.56rem;letter-spacing:.16em;text-transform:uppercase;margin-right:.4rem}",
    "#entries .v3c .v3tone:empty{display:none}",
    "#entries .v3c .v3note{margin:.22rem 0 0!important;font-size:.8rem;color:#d6c8ec;white-space:nowrap!important;overflow:hidden;text-overflow:ellipsis}",
    "#entries .v3c .logact{display:none!important}",
    "#entries .v3c .echoMark{display:none!important}",
    "#entries .v3c .logpic:empty{display:none}",
    "#entries .v3c .logpic img{width:3.3rem!important;height:3.3rem!important;border-radius:.75rem!important}",
    ".v3b{flex:none;font-size:.58rem;letter-spacing:.06em;padding:.06rem .45rem;border-radius:999px;border:1px solid;line-height:1.5}",
    ".v3b-wirkt{color:#5fe0a0;border-color:rgba(95,224,160,.45);background:rgba(95,224,160,.08)}",
    ".v3b-teilweise{color:#ffb86b;border-color:rgba(255,184,107,.45);background:rgba(255,184,107,.08)}",
    ".v3b-offen{color:#b8b3c6;border-color:rgba(184,179,198,.35)}",
    ".v3b-due{color:#7ec8ff;border-color:rgba(126,200,255,.45);border-style:dashed}",
    /* --- 3 Ritual-Schritte --- */
    "#run.v3run.on{display:flex;flex-direction:column;position:relative;z-index:1}",
    "#run.v3run .pbar{display:none!important}",
    "#run .v3step{margin:.35rem 0 .7rem}",
    "#run .v3seg{display:grid;grid-template-columns:repeat(5,1fr);gap:.3rem}",
    "#run .v3seg span{display:flex;flex-direction:column;gap:.3rem;align-items:center;min-width:0}",
    "#run .v3seg i{display:block;width:100%;height:4px;border-radius:99px;background:rgba(255,255,255,.1)}",
    "#run .v3seg em{font-style:normal;font-size:.6rem;letter-spacing:.06em;color:#7d6c96;white-space:nowrap}",
    "#run .v3seg .done i{background:linear-gradient(90deg,#ff7ad9,#7ef0e6);opacity:.75}",
    "#run .v3seg .done em{color:#c4b4e0}",
    "#run .v3seg .now i{background:var(--tone);box-shadow:0 0 10px var(--tone)}",
    "#run .v3seg .now em{color:#fff;font-weight:650}",
    "#run .v3seg .skip i{background:repeating-linear-gradient(90deg,rgba(255,255,255,.12) 0 4px,transparent 4px 8px)}",
    "#run .v3seg .skip em{opacity:.5}",
    "#run .v3step.v3noseg{display:none}",
    "#run .v3seg .wes em::after{content:' ✦';color:#ff5470}",
    "#run .v3seg .wes i{outline:1px solid rgba(255,84,112,.55);outline-offset:1px}",
    "#run.v3run .hero .sub{margin-bottom:.1rem!important}",
    "#run.v3run .hero h2{font-size:1.5rem!important;margin:.35rem 0 .7rem}",
    "#run.v3run .v3push{margin-top:auto!important;padding-top:1.2rem}",
    "#run.v3run>.row{margin-top:.55rem}",
    "#run.v3run>.row .btn{min-height:3rem;font-size:.84rem}",
    "#run.v3run .tor3 .btn{min-height:3.1rem!important}",
    "#run.v3run .msg:empty{display:none}",
    "#run.v3run .abortBtn{margin-top:.2rem!important}",
    "#v3RunBg{display:none;position:fixed;left:50%;top:58%;width:min(80vw,20rem);aspect-ratio:1;transform:translate(-50%,-50%);pointer-events:none;z-index:0}",
    ".app.runmode #v3RunBg{display:block}",
    "#v3RunBg .v3halo{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle,rgba(255,122,217,.11) 0%,rgba(185,140,255,.06) 30%,rgba(126,200,255,.025) 48%,transparent 66%);animation:v3breath 7s ease-in-out infinite}",
    "#v3RunBg .v3moon{position:absolute;inset:27%;border-radius:50%;background:radial-gradient(circle at 38% 34%,rgba(255,246,255,.26),rgba(226,200,255,.13) 48%,rgba(190,150,240,.08) 100%);box-shadow:0 0 44px 10px rgba(255,190,245,.13),inset -10px -14px 30px rgba(20,8,40,.25);filter:blur(.3px)}",
    "#v3RunBg .v3sig{position:absolute;inset:25%;width:50%;height:50%;object-fit:contain;opacity:.2;mix-blend-mode:screen;border-radius:50%;-webkit-mask:radial-gradient(circle,#000 50%,transparent 70%);mask:radial-gradient(circle,#000 50%,transparent 70%);transition:opacity .4s}",
    "#v3RunBg[data-p='0'] .v3sig{opacity:0}",
    "#v3RunBg.nosig .v3sig{display:none}",
    "@keyframes v3breath{0%,100%{opacity:.85;transform:scale(1)}50%{opacity:1;transform:scale(1.03)}}",
    "@media (prefers-reduced-motion:reduce){#v3RunBg .v3halo{animation:none}}",
    /* --- 4 Untere Leiste --- */
    "nav{padding:.3rem .3rem calc(.38rem + env(safe-area-inset-bottom))!important}",
    "nav #navOne.navR{grid-template-columns:repeat(5,1fr)!important;padding:0!important;gap:.12rem!important}",
    "nav #navOne button{min-height:3.35rem!important}",
    "nav button[data-v=mehr] .ic{background:linear-gradient(160deg,#3c1f52,#1a1026);color:#e7b8ff}",
    "nav button[data-v=mehr].on,nav button[data-v=mehr].open{background:rgba(231,184,255,.13)!important;color:#fff!important}",
    "nav button[data-v=mehr].on .ic,nav button[data-v=mehr].open .ic{box-shadow:0 0 16px currentColor,inset 0 0 0 1px rgba(255,255,255,.2)}",
    "#mehrSheet{position:absolute;left:.5rem;right:.5rem;bottom:calc(100% + .5rem);padding:.6rem .6rem .65rem;border-radius:1.2rem;background:rgba(18,9,30,.98);border:1px solid rgba(232,160,255,.25);box-shadow:0 -12px 40px rgba(0,0,0,.55),0 0 24px rgba(255,122,217,.08);animation:v3up .18s ease-out}",
    "#mehrSheet[hidden]{display:none!important}",
    "#mehrSheet .msHead{margin:.05rem .3rem .45rem;font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:#ff9ae4}",
    "#mehrSheet .msGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:.4rem}",
    "#mehrSheet .msItem{min-height:5.6rem!important;border:1px solid rgba(255,255,255,.07)!important;background:rgba(255,255,255,.03)!important;border-radius:1rem!important;padding:.6rem .2rem .5rem!important;font-size:.72rem!important;gap:.3rem!important}",
    "#mehrSheet .msItem .ic{width:2.8rem;height:2.8rem}",
    "#mehrSheet .msSub{font-size:.54rem;color:#8e7aa8;font-weight:400;line-height:1.2}",
    "#mehrVeil{position:fixed;inset:0;z-index:39;background:rgba(4,2,10,.55);backdrop-filter:blur(2px)}",
    "#mehrVeil[hidden]{display:none}",
    "@keyframes v3up{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}",
    "main{padding-bottom:5.9rem!important}",
    ".app.runmode main{padding-bottom:1.1rem!important}"
  ].join("\n");
  document.head.appendChild(css);

  if(typeof paintLog==="function" && !paintLog._d3){
    var pl=paintLog;
    paintLog=function(){ var r=pl.apply(this,arguments); try{ cards(); }catch(e){} return r; };
    paintLog._d3=1;
  }
  if(typeof show==="function" && !show._d3){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      navMark(id);
      if(window.__rr25mehr) window.__rr25mehr(false);
      if(id==="home") setTimeout(homeTidy,40);
      if(id==="log") setTimeout(cards,80);
      return r;
    };
    show._d3=1;
  }
  var run=document.getElementById("run");
  if(run && window.MutationObserver) new MutationObserver(function(){ decorate(); }).observe(run,{childList:true});
  window.addEventListener("resize",function(){ fit(document.getElementById("run")); });
  nav();
  homeTidy();
  setTimeout(homeTidy,120);
  setTimeout(homeTidy,800);
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-chronik-grau.js ==== */
try{
(function(){
  /* Chronik: graues Kennzeichen ZIEL/ZEICHEN fuer Tagesziel und Sigille.
     Kante und Label in #8f8aa0. Soft/Grenze/Hard/Feld unangetastet. Kein Filter-Chip. Kein Mehr-Menue. */
  if(window.__rr25grauZiel) return;
  window.__rr25grauZiel=1;
  var KIND={Tagesziel:"Ziel",Sigille:"Zeichen"};
  var GREY="#8f8aa0";
  function paint(){
    var box=document.getElementById("entries"); if(!box) return;
    var rows=[]; try{ rows=(typeof load==="function"?(load().log||[]):[]); }catch(e){}
    var by={}; rows.forEach(function(e){ by[String(e.id)]=e; });
    [].slice.call(box.querySelectorAll(".logrow[data-eid]")).forEach(function(row){
      var e=by[row.getAttribute("data-eid")]; if(!e) return;
      var t=String(e.titel||"").trim();
      var lab=KIND[t]; if(!lab) return;
      if(!row.classList.contains("v3c")) row.classList.add("v3c");
      row.classList.add("tone-neutral");
      row.style.setProperty("--t", GREY);
      var tone=row.querySelector(".v3tone");
      if(tone){
        if(tone.textContent!==lab) tone.textContent=lab;
      } else {
        var meta=row.querySelector(".meta");
        if(meta){
          var sp=document.createElement("span");
          sp.className="v3tone";
          sp.textContent=lab;
          meta.insertBefore(sp, meta.firstChild);
        }
      }
    });
  }
  var css=document.createElement("style");
  css.textContent=[
    "#entries .v3c.tone-neutral{--t:"+GREY+"}",
    "#entries .v3c.tone-neutral .v3tone{color:var(--t);font-size:.56rem;letter-spacing:.16em;text-transform:uppercase;margin-right:.4rem}"
  ].join("");
  document.head.appendChild(css);
  if(typeof paintLog==="function" && !paintLog._grau){
    var pl=paintLog;
    paintLog=function(){ var r=pl.apply(this,arguments); setTimeout(paint,40); return r; };
    paintLog._grau=1;
  }
  if(typeof show==="function" && !show._grau){
    var sh=show;
    show=function(id){ var r=sh.apply(this,arguments); if(id==="log") setTimeout(paint,120); return r; };
    show._grau=1;
  }
  setTimeout(paint,250);
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-ton.js ==== */
try{
/* ritual-ton.js — Ton-Chip auf der Startseite, Deep-Link #anker, Einstellungen in «Mehr» (Erinnerung, Planetenstunden).
   Regel und Daten: ritual-zeit.js (RR25_KAL). Platz für den Chip steht fest in index.html (#toneRow), hier wird nur Text gesetzt.
   Neuer Schlüssel: rr25_einst_v1 (nur die zwei Schalter). Bestehende Schlüssel bleiben unberührt.
   Erinnerung: nur nach Einschalten in «Mehr» (dann erst fragt der Browser nach der Erlaubnis), nur solange die App offen
   oder im Hintergrund aktiv ist. Verlässlich am Handy bleibt die Google-Erinnerung (Popup 10 Min. vorher). */
(function(){
  if(window.RR25_OPT) return;
  var K=window.RR25_KAL, OKEY="rr25_einst_v1", MIN=60000, APP="https://fxrebermanagement-star.github.io/rr25/";
  var NAME={SOFT:"Soft",HARD:"Hard",ECHO:"Echo",STILL:"Still"};
  function two(n){ return String(n).padStart(2,"0"); }
  function hm(ms){ var d=new Date(ms); return two(d.getHours())+":"+two(d.getMinutes()); }
  function rest(ms,now){ var m=Math.max(1,Math.ceil((ms-now)/MIN)); return m<60?m+" Min.":Math.floor(m/60)+" Std. "+(m%60?m%60+" Min.":""); }
  function oget(){ try{ var o=JSON.parse(localStorage.getItem(OKEY)||"{}"); return o&&typeof o==="object"?o:{}; }catch(e){ return {}; } }
  function oset(k,v){ var o=oget(); o[k]=!!v; try{ localStorage.setItem(OKEY,JSON.stringify(o)); }catch(e){} }
  window.RR25_OPT={get:function(k){ return !!oget()[k]; },set:oset};
  function ctxOf(x){ return x?{title:x.t,s:x.s,e:x.e,kind:x.k,anker:!!x.anker}:null; }
  function openAnker(){ var a=K?K.state().anker:null; if(window.RR25_OPEN) window.RR25_OPEN("anker",ctxOf(a)); }

  /* ---------- Ton-Chip ---------- */
  function paintChip(){
    var chip=document.getElementById("toneChip"), link=document.getElementById("toneAnker");
    if(!chip||!K) return;
    var now=Date.now(), s=K.state(now), txt=NAME[s.kind]||"Soft";
    if(s.open) txt+=" · noch "+rest(s.open.e,now);
    else if(s.band&&s.src==="band") txt+=" · Band";
    var tone=s.kind.toLowerCase(), sp=chip.querySelector("span");
    if(chip.getAttribute("data-tone")!==tone) chip.setAttribute("data-tone",tone);
    if(sp&&sp.textContent!==txt) sp.textContent=txt;
    chip.setAttribute("aria-label","Ton jetzt: "+txt+". Kalender öffnen");
    if(link){
      var a=s.anker&&s.anker.e>now?s.anker:null, lt=a?(a.s<=now?"Jetzt Rückkehr · Anker":"Heute "+hm(a.s)+" Rückkehr · Anker"):"";
      if(link.textContent!==lt) link.textContent=lt;
      if(link.hidden!==!a) link.hidden=!a;
    }
  }
  /* ---------- Saison-Chip neben dem Ton-Chip (nur Anzeige, ändert den Ton nie) ----------
     Wichtigste zuerst: Finsternis > Rauhnächte > rückläufig > Jahreskreisfest > Hard-Phase/-Tag. Keine Saison: ausgeblendet. */
  var FEST=/Samhain|Imbolc|Yule|Wintersonnenwende|Sonnenwende|Tagundnacht|Ostara|Beltane|Litha|Lammas|Mabon/;
  function seasonNow(now){
    var Z=K.seasons?K.seasons(now):[], s=K.state(now), best=null;
    Z.forEach(function(z){ var r=z.rank; if(!best||r>best.r) best={r:r,sz0:z.sz,txt:z.sz==="Finsternis"&&!z.band?z.t.split("·").slice(1).join("·").trim():z.sz,tone:z.k.toLowerCase(),e:z.band?z.e:0}; });
    /* Build 33: Finsternis-Tag (kein Band) zeigt die Restdauer der umgebenden Finsternis-Saison */
    if(best&&!best.e){ var en=Z.filter(function(z){ return z.sz===best.sz0&&z.band; })[0]; if(en&&best.sz0==="Finsternis"){ best.e=en.e; best.txt=best.txt+" · Saison"; } }
    if(best) return best;
    var f=(s.items||[]).filter(function(x){ return x.all&&FEST.test(x.t); })[0];
    if(f){ var m=f.t.match(FEST); return {txt:m?m[0]:f.t,tone:f.k.toLowerCase()}; }
    var hd=s.hardDay;
    if(hd){ var p=hd.t.split("·").map(function(q){ return q.trim(); }); return {txt:hd.band?(p.slice(2).join(" ")||"Hard")+"-Phase":"Hard-Tag "+(p[2]||""),tone:"hard"}; }
    return null;
  }
  function paintSeason(){
    var c=document.getElementById("seasonChip"); if(!c||!K) return;
    var z=seasonNow(Date.now()), sp=c.querySelector("span");
    if(!z){ if(!c.hidden) c.hidden=true; return; }
    var txt=z.txt.trim();
    if(z.e){ /* Restdauer der Saison: «noch 38 Tage» / «noch 1 Tag» / «leletzter Tag» */
      var t0=new Date(), d0=new Date(t0.getFullYear(),t0.getMonth(),t0.getDate()).getTime();
      var left=Math.round((z.e-d0)/86400000)-1;
      if(left>=0) txt+=" · "+(left===0?"letzter Tag":"noch "+left+(left===1?" Tag":" Tage"));
    }
    if(c.getAttribute("data-tone")!==z.tone) c.setAttribute("data-tone",z.tone);
    if(sp&&sp.textContent!==txt) sp.textContent=txt;
    c.setAttribute("aria-label","Saison: "+txt+". Kalender öffnen");
    if(c.hidden) c.hidden=false;
  }
  (function(){
    var st=document.createElement("style");
    st.textContent="html #seasonChip{flex:0 1 auto;min-width:0;display:inline-flex;align-items:center;gap:.4rem;height:1.7rem;min-height:0;padding:0 .75rem;border-radius:999px;border:1px solid rgba(154,150,166,.45);background:rgba(20,10,34,.6);color:#e6dcff;font:500 .72rem system-ui,sans-serif;letter-spacing:.04em;box-shadow:none;overflow:hidden}"+
      "html #seasonChip span{overflow:visible;white-space:normal;line-height:1.2}"+
      "html #toneRow{flex-wrap:wrap;height:auto;min-height:2rem;row-gap:.35rem;overflow:visible;white-space:normal}html #toneRow>#toneChip{flex:none}html #seasonChip{height:auto;min-height:1.7rem;padding:.2rem .75rem}"+
      "html #toneAnker{flex:1 0 100%;margin-left:.15rem;overflow:visible;white-space:normal}html #toneAnker[hidden]{display:none}"+
      "html #ankerHintCard{position:relative;z-index:1;margin:.6rem 0 1.15rem}html #home:has(#ankerHintCard) #toneAnker{display:none}html #seasonChip[hidden]{display:none}"+
      "html #seasonChip i{flex:none;width:.5rem;height:.5rem;border-radius:1px;transform:rotate(45deg);background:#9a96a6}"+
      "html #seasonChip[data-tone=soft]{border-color:rgba(46,204,113,.55)}html #seasonChip[data-tone=soft] i{background:#2ecc71}"+
      "html #seasonChip[data-tone=hard]{border-color:rgba(255,84,112,.6)}html #seasonChip[data-tone=hard] i{background:#ff5470}"+
      "html #seasonChip[data-tone=echo]{border-color:rgba(179,107,255,.6)}html #seasonChip[data-tone=echo] i{background:#b36bff}"+
      "html #seasonChip[data-tone=still]{border-color:rgba(154,150,166,.55)}"+
      "html #seasonChip[data-tone=grenze]{border-color:rgba(255,159,67,.6)}html #seasonChip[data-tone=grenze] i{background:#ff9f43}";
    document.head.appendChild(st);
  })();
  var _pc=paintChip; paintChip=function(){ _pc(); try{ paintSeason(); }catch(e){} };
  var chip=document.getElementById("toneChip"), link=document.getElementById("toneAnker");
  if(chip) chip.onclick=function(){ if(typeof show==="function") show("kal"); };
  var szc=document.getElementById("seasonChip"); if(szc) szc.onclick=function(){ if(typeof show==="function") show("kal"); };
  if(link) link.onclick=function(ev){ ev.preventDefault(); openAnker(); };
  if(K){ paintChip(); K.onReady(paintChip); }
  setInterval(function(){ var h=document.getElementById("home"); if(h&&h.classList.contains("on")) paintChip(); tick(); },30000);
  if(typeof show==="function" && !show._ton){
    var sh=show;
    show=function(id){ var r=sh.apply(this,arguments); if(id==="home") paintChip(); return r; };
    show._ton=1;
  }

  /* ---------- Deep-Link #anker (aus der Google-Beschreibung der 22:30-Einträge) ---------- */
  function hash(){
    var h=location.hash;
    if(h!=="#anker" && h!=="#echo") return;
    try{ history.replaceState(null,"",location.pathname+location.search); }catch(e){}
    if(h==="#echo"){ if(window.RR25_OPEN) window.RR25_OPEN("echo"); return; }
    if(K) K.onReady(openAnker); else openAnker();
  }
  window.addEventListener("hashchange",hash);
  hash();

  /* ---------- Erinnerung 10 Min. vorher (nur mit Opt-in) ---------- */
  var SKEY="rr25_hinweis_s";
  function fired(id){ try{ return (sessionStorage.getItem(SKEY)||"").indexOf("|"+id+"|")>=0; }catch(e){ return false; } }
  function mark(id){ try{ sessionStorage.setItem(SKEY,((sessionStorage.getItem(SKEY)||"|")+id+"|").slice(-2000)); }catch(e){} }
  function notify(x){
    var title=x.anker?"22:30 Rückkehr · Anker in 10 Min.":"Hard-Feintakt "+hm(x.s)+" in 10 Min.";
    var opt={body:x.t+" · "+hm(x.s)+"–"+hm(x.e),tag:"rr25-"+x.s,icon:"icon.svg",data:{url:APP+(x.anker?"#anker":"")}};
    if(navigator.serviceWorker&&navigator.serviceWorker.getRegistration){
      navigator.serviceWorker.getRegistration().then(function(reg){
        if(reg&&reg.showNotification) return reg.showNotification(title,opt);
        try{ new Notification(title,opt); }catch(e){}
      }).catch(function(){});
    } else { try{ new Notification(title,opt); }catch(e){} }
  }
  function tick(){
    if(!K||!window.RR25_OPT.get("notify")||!("Notification" in window)||Notification.permission!=="granted") return;
    var now=Date.now();
    K.list(now).forEach(function(x){
      if(x.all||x.k!=="HARD"||x.src!=="kal") return;
      var id=x.s+":"+(x.anker?"a":"h");
      if(now>=x.s-10*MIN&&now<x.s&&!fired(id)){ mark(id); notify(x); }
    });
  }
  if(K) K.onReady(tick);

  /* ---------- Anker-Hinweis an Hard-Tagen (Build 32) ----------
     Hard-Tag/-Phase oder Tag mit Hard-Feintakt: ab Sonnenuntergang sanfte Karte auf Heute/Rituale,
     pro Tag wegklickbar (localStorage rr25_ankerhint_JJJJ-MM-TT). Mit eingeschalteter Erinnerung zusätzlich
     um 21:30 eine Meldung (nur solange die App offen/aktiv ist). Ändert Ton, Tor und Gate nicht. */
  function ymdK(ms){ var d=new Date(ms); return d.getFullYear()+"-"+two(d.getMonth()+1)+"-"+two(d.getDate()); }
  function hardToday(now){
    var s=K.state(now);
    return !!(s.hardDay||(s.hard&&s.hard.length));
  }
  function hintOff(now){ try{ return localStorage.getItem("rr25_ankerhint_"+ymdK(now))==="1"; }catch(e){ return false; } }
  function paintHint(){
    if(!K) return;
    var now=Date.now(), box=document.getElementById("ankerHintCard"), row=document.getElementById("toneRow");
    var show1=false;
    try{ show1=hardToday(now)&&now>=K.sun(now).set&&!hintOff(now); }catch(e){}
    if(!show1){ if(box) box.remove(); return; }
    if(box&&row&&row.nextElementSibling!==box) row.parentNode.insertBefore(box,row.nextSibling); /* Build 33: direkt unter der Ton-Zeile */
    if(box||!row) return;
    box=document.createElement("article"); box.id="ankerHintCard"; box.className="card ankerHintCard";
    box.innerHTML='<p>Heute Hard gearbeitet? <a href="#anker">Rückkehr · Anker</a> nicht vergessen</p><button type="button" aria-label="Hinweis für heute ausblenden">×</button>';
    box.querySelector("a").onclick=function(ev){ ev.preventDefault(); openAnker(); };
    box.querySelector("button").onclick=function(){ try{ localStorage.setItem("rr25_ankerhint_"+ymdK(Date.now()),"1"); }catch(e){} box.remove(); };
    row.parentNode.insertBefore(box,row.nextSibling);
  }
  (function(){
    var st=document.createElement("style");
    st.textContent=".ankerHintCard{display:flex;align-items:center;gap:.6rem;margin:.6rem 0;padding:.6rem .8rem;border:1px solid rgba(255,84,112,.35);background:rgba(40,10,30,.55);border-radius:14px}"+
      ".ankerHintCard p{flex:1;margin:0;font-size:.8rem;color:#e6dcff}.ankerHintCard a{color:#cdb6ff;text-decoration:none;border-bottom:1px dotted rgba(205,182,255,.6)}"+
      ".ankerHintCard button{flex:none;width:1.8rem;height:1.8rem;min-height:0;padding:0;border-radius:999px;border:1px solid rgba(155,140,255,.35);background:transparent;color:#cbb8ff;font-size:1rem;line-height:1}";
    document.head.appendChild(st);
  })();
  function tickAnker(){
    if(!K||!window.RR25_OPT.get("notify")||!("Notification" in window)||Notification.permission!=="granted") return;
    var now=Date.now(), d=new Date(now), t=new Date(d.getFullYear(),d.getMonth(),d.getDate(),21,30).getTime();
    if(now<t||now>=t+15*MIN||!hardToday(now)||hintOff(now)) return;
    var id="ah"+ymdK(now); if(fired(id)) return; mark(id);
    var title="Heute Hard gearbeitet?", opt={body:"Rückkehr · Anker nicht vergessen",tag:"rr25-anker-"+ymdK(now),icon:"icon.svg",data:{url:APP+"#anker"}};
    if(navigator.serviceWorker&&navigator.serviceWorker.getRegistration){
      navigator.serviceWorker.getRegistration().then(function(reg){
        if(reg&&reg.showNotification) return reg.showNotification(title,opt);
        try{ new Notification(title,opt); }catch(e){}
      }).catch(function(){});
    } else { try{ new Notification(title,opt); }catch(e){} }
  }
  var _pc2=paintChip; paintChip=function(){ _pc2(); try{ paintHint(); }catch(e){} };
  var _tk=tick; tick=function(){ _tk(); try{ tickAnker(); }catch(e){} };
  if(K) K.onReady(function(){ paintChip(); tick(); });

  /* ---------- Schalter in «Mehr» ---------- */
  var on=document.getElementById("optNotify"), pl=document.getElementById("optPlanet"), msg=document.getElementById("optMsg");
  function say(t){ if(msg) msg.textContent=t||""; }
  if(on){
    on.checked=window.RR25_OPT.get("notify")&&("Notification" in window)&&Notification.permission==="granted";
    on.onchange=function(){
      if(!on.checked){ oset("notify",false); say(""); return; }
      if(!("Notification" in window)){ on.checked=false; say("Dieses Gerät kann das in der App nicht. Die Google-Erinnerung gilt."); return; }
      Promise.resolve(Notification.requestPermission()).then(function(p){
        if(p==="granted"){ oset("notify",true); say("Ein. Nur solange die App offen ist."); tick(); }
        else { on.checked=false; oset("notify",false); say("Nicht erlaubt. Die Google-Erinnerung gilt."); }
      }).catch(function(){ on.checked=false; say("Nicht möglich. Die Google-Erinnerung gilt."); });
    };
  }
  if(pl){
    pl.checked=window.RR25_OPT.get("planet");
    pl.onchange=function(){
      oset("planet",pl.checked);
      var kal=document.getElementById("kal");
      if(kal&&kal.classList.contains("on")&&typeof show==="function") show("kal");
    };
  }
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-saison.js ==== */
try{
/* ritual-saison.js — Jahresansicht: Saison-Tage mit kleiner Raute in Saisonfarbe markieren (wie in der Monatsansicht).
   Nur Anzeige. Liest RR25_KAL.seasons(), ändert Ton, Tor und Gate nie. */
(function(){
  var K=window.RR25_KAL; if(!K||!K.seasons||window.RR25_SZYEAR) return; window.RR25_SZYEAR=1;
  function deco(root){
    var ms=root.querySelectorAll(".kyM[data-ym]");
    for(var i=0;i<ms.length;i++){
      var m=ms[i]; if(m.getAttribute("data-sz")) continue; m.setAttribute("data-sz","1");
      var m0=+m.getAttribute("data-ym"), d=new Date(m0), cells=m.querySelectorAll(".kyD");
      for(var j=0;j<cells.length;j++){
        var t=new Date(d.getFullYear(),d.getMonth(),j+1,12).getTime(), z=K.seasons(t)[0];
        if(z&&!cells[j].querySelector(".kyS")){ var b=document.createElement("b"); b.className="kyS "+String(z.k).toLowerCase(); cells[j].appendChild(b); }
      }
    }
  }
  var st=document.createElement("style");
  st.textContent=".kyD{position:relative}.kyD b.kyS{position:absolute;right:-1px;top:-2px;width:4px;height:4px;display:block;box-sizing:border-box;border-radius:1px;transform:rotate(45deg);background:#ff5470}"+
    ".kyD b.kyS.soft{background:#2ecc71}.kyD b.kyS.echo{background:#b36bff}.kyD b.kyS.still{background:#c9c5d4}.kyD b.kyS.grenze{background:#ff9f43}";
  document.head.appendChild(st);
  var box=document.getElementById("kalList"); if(!box) return;
  function run(){ try{ deco(box); }catch(e){} }
  K.onReady(run);
  if(window.MutationObserver) new MutationObserver(run).observe(box,{childList:true,subtree:true});
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-resonanzen.js ==== */
try{
(function(){
  var DATA=[];
  var CAT_LAB={kraeuter:"Kräuter",hausmittel:"Hausmittel",steine:"Steine",kerzen:"Kerzen",farben:"Farben"};
  var TAB_ORDER=["kraeuter","hausmittel","steine","kerzen","farben"];
  var tab="kraeuter", q="", toneF="", ready=0;

  var ICO={};
  var TONE_CHIPS=[["","Alle"],["Soft","Soft"],["Soft/Grenze","Grenze"],["Soft→Hard","Soft→Hard"],["Hard","Hard"]];

  var css=document.createElement("style");
  css.id="rr25-resonanzen";
  css.textContent=[
    "#mehrSheet .msGrid{grid-template-columns:repeat(2,1fr)!important}",
    "#mehrSheet .msItem[data-v=resonanzen] .ic{background:linear-gradient(160deg,#4a1f6a,#1e1030);color:#e7b8ff}",
    "#resonanzen .rzTop{display:flex;flex-wrap:wrap;gap:.4rem;align-items:center;margin:.1rem 0 .45rem}",
    "#resonanzen .rzSearch{margin:0;flex:1 1 9rem;min-width:8.5rem}",
    "#resonanzen .rzTones{display:flex;flex-wrap:wrap;gap:.28rem;margin:0 0 .38rem}",
    "#resonanzen .rzToneF{display:inline-flex;align-items:center;gap:.28rem;height:1.32rem;padding:0 .48rem;border-radius:999px;border:1px solid rgba(154,150,166,.45);background:rgba(20,10,34,.45);color:#d9d0e6;font:500 .62rem system-ui,sans-serif;letter-spacing:.01em}",
    "#resonanzen .rzToneF i{width:.38rem;height:.38rem;border-radius:50%;background:#9a96a6;flex:none}",
    "#resonanzen .rzToneF[data-tn=Soft]{border-color:rgba(46,204,113,.55)}#resonanzen .rzToneF[data-tn=Soft] i{background:#2ecc71}",
    "#resonanzen .rzToneF[data-tn='Soft/Grenze']{border-color:rgba(255,196,92,.6)}#resonanzen .rzToneF[data-tn='Soft/Grenze'] i{background:#ffc45c}",
    "#resonanzen .rzToneF[data-tn='Soft→Hard']{border-color:rgba(179,107,255,.6)}#resonanzen .rzToneF[data-tn='Soft→Hard'] i{background:#b36bff}",
    "#resonanzen .rzToneF[data-tn=Hard]{border-color:rgba(255,84,112,.65)}#resonanzen .rzToneF[data-tn=Hard] i{background:#ff5470}",
    "#resonanzen .rzToneF.on{color:#f6f0ff;background:rgba(255,255,255,.06)}",
    "#resonanzen .rzTabs{display:flex;flex-wrap:wrap;gap:.32rem;margin:0 0 .55rem}",
    "#resonanzen .rzList{display:flex;flex-direction:column;gap:.4rem}",
    "#resonanzen .rzRow{display:block;width:100%;text-align:left;border:1px solid rgba(232,160,255,.18);background:linear-gradient(180deg,rgba(48,18,72,.62),rgba(14,8,24,.9));border-radius:1.05rem;padding:.72rem .85rem .78rem;color:#f6f0ff}",
    "#resonanzen .rzRow.rzHas{display:flex;gap:.62rem;align-items:flex-start}",
    "#resonanzen .rzHas .rzMain{flex:1;min-width:0}",
    "#resonanzen .rzIco{flex:none;width:32px;height:32px;margin-top:.06rem;color:#e7b8ff;filter:drop-shadow(0 0 5px rgba(231,184,255,.7))}",
    "#resonanzen .rzIco svg{width:32px;height:32px;display:block;stroke:currentColor;fill:none;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round}",
    "#resonanzen .rzRow b{display:block;font-family:Georgia,serif;font-size:1.02rem;font-weight:500}",
    "#resonanzen .rzTone{display:inline-block;margin-top:.28rem;font-size:.58rem;letter-spacing:.12em;text-transform:uppercase;color:#e7b8ff;border:1px solid rgba(231,184,255,.35);border-radius:999px;padding:.1rem .45rem}",
    "#resonanzen .rzTone[data-t=Soft]{color:#9eecc0;border-color:rgba(158,236,192,.35)}",
    "#resonanzen .rzTone[data-t=Hard]{color:#ff8aa0;border-color:rgba(255,138,160,.4)}",
    "#resonanzen .rzTone[data-t=\"Soft/Grenze\"],#resonanzen .rzTone[data-t=\"Soft→Hard\"]{color:#ffd2a0;border-color:rgba(255,210,160,.4)}",
    "#resonanzen .rzTxt{display:block;margin:.42rem 0 0;font-size:.88rem;line-height:1.45;color:#e6dcff}",
    "#resonanzen .rzHint{margin:.2rem 0 .1rem;font-size:.68rem;color:#8e7aa8}",
    "#resonanzen .rzEmpty{margin:.8rem .2rem;color:#8e7aa8;font-size:.84rem}"
  ].join("\n");
  document.head.appendChild(css);

  function esc(s){
    return String(s||"").replace(/[&<>"']/g,function(c){
      return ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c];
    });
  }
  function match(e){
    if(!e || e.cat!==tab) return false;
    if(toneF && e.tone!==toneF) return false;
    if(!q) return true;
    var hay=(e.name+" "+e.tone+" "+e.text+" "+(CAT_LAB[e.cat]||"")).toLowerCase();
    return hay.indexOf(q)>=0;
  }
  function paint(){
    var root=document.getElementById("resonanzen");
    if(!root) return;
    var tabs=document.getElementById("rzTabs");
    var tones=document.getElementById("rzTones");
    var list=document.getElementById("rzList");
    if(tones){
      tones.innerHTML=TONE_CHIPS.map(function(c){
        return '<button type="button" class="rzToneF'+(toneF===c[0]?" on":"")+'" data-tn="'+c[0]+'"><i></i>'+c[1]+"</button>";
      }).join("");
      tones.querySelectorAll("[data-tn]").forEach(function(b){
        b.onclick=function(){ toneF=b.getAttribute("data-tn")||""; paint(); };
      });
    }
    if(tabs){
      tabs.innerHTML=TAB_ORDER.map(function(c){
        return '<button type="button" class="chip'+(tab===c?" on":"")+'" data-rz="'+c+'">'+CAT_LAB[c]+"</button>";
      }).join("");
      tabs.querySelectorAll("[data-rz]").forEach(function(b){
        b.onclick=function(){ tab=b.getAttribute("data-rz")||"kraeuter"; paint(); };
      });
    }
    if(!list) return;
    if(ready!==2){
      list.innerHTML='<p class="rzEmpty">Lädt…</p>';
      return;
    }
    var rows=DATA.filter(match);
    if(!rows.length){
      list.innerHTML='<p class="rzEmpty">Nichts gefunden.</p>';
      return;
    }
    list.innerHTML=rows.map(function(e){
      var inner="<b>"+esc(e.name)+"</b>"+
        '<span class="rzTone" data-t="'+esc(e.tone)+'">'+esc(e.tone)+"</span>"+
        '<p class="rzTxt">'+esc(e.text)+"</p>";
      var ico=ICO[e.id];
      if(!ico) return '<article class="rzRow">'+inner+"</article>";
      return '<article class="rzRow rzHas"><span class="rzIco" aria-hidden="true">'+ico+'</span><div class="rzMain">'+inner+"</div></article>";
    }).join("");
  }
  function load(){
    if(ready===2){ paint(); return; }
    if(ready===1) return;
    ready=1;
    paint();
    function one(url){
      return fetch(url,{cache:"no-store"}).then(function(r){
        if(!r.ok) throw new Error("lex");
        return r.json();
      });
    }
    Promise.all([
      one("resonanzen-a.json?v=22"),
      one("resonanzen-b.json?v=22"),
      one("resonanzen-c.json?v=22"),
      one("resonanzen-ico-a.json?v=22"),
      one("resonanzen-ico-b.json?v=22"),
      one("resonanzen-ico-c.json?v=22")
    ]).then(function(ps){
      DATA=(ps[0]||[]).concat(ps[1]||[], ps[2]||[]);
      ICO=Object.assign({}, ps[3]||{}, ps[4]||{}, ps[5]||{});
      ready=2;
      paint();
    }).catch(function(){
      ready=0;
      var list=document.getElementById("rzList");
      if(list) list.innerHTML='<p class="rzEmpty">Lexikon nicht geladen.</p>';
    });
  }
  function boot(){
    var find=document.getElementById("rzFind");
    if(find && !find._rz){
      find._rz=1;
      find.addEventListener("input",function(){
        q=(find.value||"").trim().toLowerCase();
        paint();
      });
    }
    load();
  }
  if(typeof show==="function" && !show._rz){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="resonanzen") boot();
      var m=document.getElementById("navMehr");
      if(m && id==="resonanzen") m.classList.add("on");
      return r;
    };
    show._rz=1;
  }
  boot();
})();

}catch(e){setTimeout(function(){throw e;});}
