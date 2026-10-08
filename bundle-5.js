/* rr25 · Paket 5/7 · Build 46 · erzeugt mit tools/bundle.py. Nicht von Hand bearbeiten:
   Quelldatei ändern und neu erzeugen. Inhalt in dieser Reihenfolge: ritual-plan.js, ritual-hold.js, ritual-cam.js, ritual-sigil-save.js, ritual-more.js, ritual-fein.js, ritual-check.js, ritual-ui-v2.js, ritual-v3.js */
/* ==== ritual-plan.js ==== */
try{
(function(){
  function del(pid){
    if(typeof load!=="function"||typeof save!=="function") return;
    var d=load();
    d.planned=(d.planned||[]).filter(function(p){ return String(p.pid)!==String(pid); });
    save(d);
    if(typeof paintPlan==="function") paintPlan();
  }
  function enhance(){
    var list=document.getElementById("plList");
    if(!list) return;
    list.querySelectorAll("[data-go]").forEach(function(btn){
      var wrap=btn.parentElement;
      if(!wrap || wrap.querySelector("[data-pldel]")) return;
      var pid=btn.getAttribute("data-go");
      var row=document.createElement("div");
      row.className="row";
      row.style.marginTop=".45rem";
      var a=document.createElement("button");
      a.type="button"; a.className="btn primary"; a.textContent="Setzen";
      a.onclick=function(){ btn.click(); };
      var b=document.createElement("button");
      b.type="button"; b.className="btn ghost"; b.textContent="Zurückziehen";
      b.setAttribute("data-pldel", pid);
      b.onclick=function(ev){
        ev.preventDefault();
        if(!confirm("Dieses Vormerken löschen?")) return;
        del(pid);
      };
      row.appendChild(a);
      row.appendChild(b);
      btn.style.display="none";
      wrap.appendChild(row);
    });
  }
  if(typeof paintPlan==="function" && !paintPlan._del){
    var pp=paintPlan;
    paintPlan=function(){
      pp();
      enhance();
    };
    paintPlan._del=1;
  }
  if(typeof show==="function" && !show._pldel){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="geplant") setTimeout(enhance, 20);
      return r;
    };
    show._pldel=1;
  }
  enhance();
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-hold.js ==== */
try{
(function(){
  function buzz(pat){
    try{ if(navigator.vibrate) navigator.vibrate(pat||[45,40,90]); }catch(e){}
  }
  function cleanPlan(){
    if(typeof load!=="function"||typeof save!=="function") return;
    var d=load();
    var seen={};
    var out=[];
    (d.planned||[]).forEach(function(p){
      var k=String(p.id||"")+"|"+String(p.wer||"").trim().toLowerCase();
      if(seen[k]) return;
      seen[k]=1;
      if(!p.t) p.t=(typeof now==="function"?now():"");
      out.push(p);
    });
    if(out.length!==(d.planned||[]).length){
      d.planned=out;
      save(d);
    }
  }
  if(typeof paintPlan==="function" && !paintPlan._hold){
    var pp=paintPlan;
    paintPlan=function(){
      cleanPlan();
      pp();
      var list=document.getElementById("plList");
      if(!list) return;
      (load().planned||[]).forEach(function(p){
        var row=list.querySelector('[data-go="'+p.pid+'"]');
        if(!row) return;
        var meta=row.parentElement && row.parentElement.querySelector(".meta");
        if(meta && p.t && meta.textContent.indexOf(p.t)<0){
          meta.textContent=(p.wer?p.wer+" · ":"")+p.t;
        }
      });
    };
    paintPlan._hold=1;
  }
  var add=document.getElementById("plAdd");
  if(add && !add._hold){
    var old=add.onclick;
    add.onclick=function(){
      var sel=document.getElementById("plR");
      var wer=((document.getElementById("plW")||{}).value||"").trim();
      var id=sel && sel.value;
      var d=load();
      var dup=(d.planned||[]).some(function(p){
        return p.id===id && String(p.wer||"").trim().toLowerCase()===wer.toLowerCase();
      });
      if(dup){
        if(typeof paintPlan==="function") paintPlan();
        return;
      }
      if(typeof old==="function") old();
      else if(id && typeof R!=="undefined"){
        var r=R.find(function(x){ return x.id===id; });
        if(!r) return;
        d.planned.unshift({pid:Date.now().toString(36),id:r.id,titel:r.t,wer:wer,t:now()});
        save(d); paintPlan();
      }
    };
    add._hold=1;
  }
  document.addEventListener("click", function(e){
    if(!e.target || !e.target.closest) return;
    var n=e.target.closest("#next");
    if(!n) return;
    var h=((document.querySelector("#run h2")||{}).textContent||"");
    var w=((document.querySelector("#run .words")||{}).textContent||"");
    var all=(h+" "+w+" "+n.textContent).toLowerCase();
    if(/es ist so|so sei es|369/.test(all)) buzz([35,40,70,40,110]);
  }, true);
  if(typeof show==="function" && !show._hold){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="geplant") cleanPlan();
      return r;
    };
    show._hold=1;
  }
  cleanPlan();
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-cam.js ==== */
function openPicPicker(done){
  var inp=document.createElement("input");
  inp.type="file";
  inp.accept="image/*";
  inp.setAttribute("capture","environment");
  inp.style.cssText="position:fixed;left:0;bottom:0;width:1px;height:1px;opacity:0";
  document.body.appendChild(inp);
  inp.onchange=async function(ev){
    var f=ev.target.files&&ev.target.files[0];
    try{ inp.remove(); }catch(e){}
    if(!f) return;
    var data="";
    try{ if(typeof compressPic==="function") data=await compressPic(f); }catch(e){}
    if(!data && typeof readRaw==="function") data=await readRaw(f);
    if(!data){
      data=await new Promise(function(ok){
        var r=new FileReader();
        r.onload=function(){ ok(String(r.result||"")); };
        r.onerror=function(){ ok(""); };
        r.readAsDataURL(f);
      });
    }
    if(data && done) done(data);
  };
  inp.click();
}

;
/* ==== ritual-sigil-save.js ==== */
try{
(function(){
  function snap(){
    var c=document.getElementById("sigilC");
    if(!c) return "";
    try{
      var w=c.width, h=c.height;
      if(!w||!h) return "";
      var out=document.createElement("canvas");
      var s=Math.min(720, Math.max(w,h));
      out.width=s; out.height=s;
      var ctx=out.getContext("2d");
      ctx.fillStyle="#08040e";
      ctx.fillRect(0,0,s,s);
      ctx.drawImage(c,0,0,s,s);
      return out.toDataURL("image/jpeg",0.78);
    }catch(e){
      try{ return c.toDataURL("image/jpeg",0.78); }catch(err){ return ""; }
    }
  }
  function put(){
    var el=document.getElementById("sigilT");
    var t=((el&&el.value)||"").trim().toUpperCase();
    if(!t) return;
    var img=snap();
    if(!img||img.length<200) return;
    if(typeof load!=="function"||typeof save!=="function") return;
    var d=load();
    d.log=d.log||[];
    var id, e;
    var top=d.log[0];
    if(top && String(top.titel)==="Sigille" && String(top.wer||"").toUpperCase()===t){
      e=top; id=top.id;
    } else {
      id=(typeof uid==="function"?uid():Date.now().toString(36));
      e={id:id, t:typeof now==="function"?now():new Date().toLocaleString("de-CH"), titel:"Sigille", wer:t, pics:1, img:img};
      d.log.unshift(e);
    }
    e.pics=1;
    e.img=img;
    e.wer=t;
    var seen={};
    d.log=d.log.filter(function(x){
      if(String(x.titel)!=="Sigille") return true;
      var k=String(x.wer||"").toUpperCase()+"|"+String(x.t||"").slice(0,16);
      if(seen[k] && String(x.id)!==String(id)) return false;
      seen[k]=1;
      return true;
    });
    try{ save(d); }catch(err){}
    window._picMemo=window._picMemo||{};
    window._picMemo[id]=img;
    if(typeof fotoPut==="function"){
      Promise.resolve(fotoPut(id,[img])).catch(function(){});
    }
    var hold=document.querySelector('[data-pic="'+id+'"]');
    if(hold && !hold.querySelector("img")){
      var im=document.createElement("img");
      im.src=img; im.className="sig"; hold.appendChild(im);
    }
  }
  function afterDraw(){ setTimeout(put, 180); setTimeout(put, 500); }
  document.addEventListener("click", function(e){
    if(!e.target||!e.target.closest) return;
    if(e.target.closest("#sigilGo") || e.target.closest("#sigilSave")) afterDraw();
  }, true);
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-more.js ==== */
try{
(function(){
  var SYN=29.53058867;
  var NM=Date.UTC(2000,0,6,18,14)/1000;
  var lock=null;
  function ageAt(ms){
    var a=(((ms/1000)-NM)/86400)%SYN;
    if(a<0) a+=SYN;
    return a;
  }
  function lab(t){ return new Date(t).toLocaleDateString("de-CH",{day:"numeric",month:"short"}); }
  function nextFull(){
    var M=window.RR25_MOND;
    if(M){ var m=M.day(); if(m.key==="voll") return {days:0,label:lab(m.at)}; return {days:m.fullIn,label:lab(m.nextFull)}; }
    var now=Date.now()/1000;
    var age=((now-NM)/86400)%SYN;
    if(age<0) age+=SYN;
    var days=SYN/2-age;
    if(days<0) days+=SYN;
    var d=new Date(Date.now()+days*86400000);
    return {days:Math.max(0,Math.round(days)), label:d.toLocaleDateString("de-CH",{day:"numeric",month:"short"})};
  }
  function nextNew(){
    var M=window.RR25_MOND;
    if(M){ var m=M.day(); if(m.key==="neu") return {days:0,label:lab(m.at)}; return {days:m.newIn,label:lab(m.nextNew)}; }
    var now=Date.now()/1000;
    var age=((now-NM)/86400)%SYN;
    if(age<0) age+=SYN;
    var days=SYN-age;
    if(days>SYN-0.4) days=0;
    var d=new Date(Date.now()+days*86400000);
    return {days:Math.max(0,Math.round(days)), label:d.toLocaleDateString("de-CH",{day:"numeric",month:"short"})};
  }
  function isFullish(ms){
    var a=window.RR25_MOND?window.RR25_MOND.phase(ms+12*3600000):ageAt(ms)/SYN;
    return a>0.45 && a<0.55;
  }
  function parseT(s){
    if(!s) return Date.now();
    var m=String(s).match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
    if(!m) return Date.now();
    return new Date(+m[3], +m[2]-1, +m[1]).getTime();
  }

  function moonHint(){
    var host=document.getElementById("geplant");
    if(!host) return;
    var el=document.getElementById("plMond");
    if(!el){
      el=document.createElement("p");
      el.id="plMond";
      el.className="meta";
      var card=host.querySelector(".card");
      if(card) card.insertBefore(el, card.querySelector(".row"));
      else host.appendChild(el);
    }
    var f=nextFull(), n=nextNew();
    el.textContent="Nächster Vollmond "+f.label+(f.days?" · in "+f.days+" Tagen":" · heute")+
      " · Neumond "+n.label;
  }

  var filt="";
  function chips(){
    var log=document.getElementById("log");
    if(!log) return;
    var bar=document.getElementById("logFilt");
    if(!bar){
      bar=document.createElement("div");
      bar.id="logFilt";
      var find=document.getElementById("logFind");
      if(find) log.insertBefore(bar, find.nextSibling);
      else {
        var ent=document.getElementById("entries");
        if(ent) log.insertBefore(bar, ent);
        else log.appendChild(bar);
      }
    }
    var keys=[["","Alle"],["schutz","Schutz"],["liebe","Liebe"],["sigille","Sigille"],["mond","Vollmond"]];
    bar.innerHTML=keys.map(function(k){
      return '<button type="button" class="chip'+(filt===k[0]?" on":"")+'" data-lf="'+k[0]+'">'+k[1]+'</button>';
    }).join("");
    bar.querySelectorAll("[data-lf]").forEach(function(b){
      b.onclick=function(){ filt=b.getAttribute("data-lf")||""; if(typeof paintLog==="function") paintLog(); chips(); };
    });
  }
  if(typeof paintLog==="function" && !paintLog._more){
    var pl=paintLog;
    paintLog=function(){
      pl();
      if(!filt) return;
      var box=document.getElementById("entries");
      if(!box) return;
      box.querySelectorAll(".logrow").forEach(function(row){
        var b=(row.querySelector("b")||{}).textContent||"";
        var meta=(row.querySelector(".meta")||{}).textContent||"";
        var hay=(b+" "+meta).toLowerCase();
        var ok=true;
        if(filt==="schutz") ok=/schutz|stopp|schaden|grenze/.test(hay);
        if(filt==="liebe") ok=/liebe|anziehung/.test(hay);
        if(filt==="sigille") ok=/sigil/.test(hay);
        if(filt==="mond") ok=isFullish(parseT(meta));
        row.style.display=ok?"": "none";
      });
    };
    paintLog._more=1;
  }

  async function wake(on){
    try{
      if(on){
        if(navigator.wakeLock && !lock) lock=await navigator.wakeLock.request("screen");
      } else {
        if(lock){ try{ lock.release(); }catch(e){} lock=null; }
      }
    }catch(e){}
  }
  if(typeof show==="function" && !show._more){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      var app=document.querySelector(".app");
      var rest=id==="run"||id==="after";
      if(app) app.classList.toggle("runmode", rest);
      wake(rest);
      if(id==="geplant") moonHint();
      if(id==="log"){ chips(); if(typeof paintLog==="function") paintLog(); }
      return r;
    };
    show._more=1;
  }
  document.addEventListener("visibilitychange", function(){
    if(document.visibilityState==="visible" && document.querySelector(".app.runmode")) wake(true);
  });

  var css=document.createElement("style");
  css.textContent=[
    ".app.runmode nav{display:none!important}",
    ".app.runmode main{padding-bottom:1.4rem!important}",
    "#plMond{margin:.15rem 0 .35rem;line-height:1.35}",
    "#logFilt{display:flex;flex-wrap:wrap;gap:.32rem;margin:0 0 .55rem}"
  ].join("");
  document.head.appendChild(css);
  moonHint();
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-fein.js ==== */
try{
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

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-check.js ==== */
try{
(function(){
  var css=document.createElement("style");
  css.textContent=[
    ".kHintLine:empty{display:none}",
    "#sigilT{text-transform:uppercase}",
    "#logFilt + #logFilt{display:none!important}",
    "#home #kasten{margin-bottom:.1rem}",
    ".logrow b{word-break:break-word}",
    "#skizze{width:100%!important;max-width:none!important;margin:.1rem 0 .2rem!important}",
    "#skizze svg{height:12.6rem!important;width:100%!important}"
  ].join("");
  document.head.appendChild(css);
  function up(){
    var el=document.getElementById("sigilT");
    if(!el||el._up) return;
    el._up=1;
    el.addEventListener("input", function(){
      var s=el.selectionStart, e=el.selectionEnd;
      el.value=String(el.value||"").toUpperCase();
      try{ el.setSelectionRange(s,e); }catch(err){}
    });
  }
  function oneFilt(){
    var bars=document.querySelectorAll("#logFilt");
    if(bars.length>1){ for(var i=1;i<bars.length;i++) bars[i].remove(); }
  }
  if(typeof paintLog==="function" && !paintLog._chk){
    var pl=paintLog; paintLog=function(){ pl(); oneFilt(); }; paintLog._chk=1;
  }
  if(typeof show==="function" && !show._chk){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="home") up();
      if(id==="log") setTimeout(oneFilt,40);
      return r;
    };
    show._chk=1;
  }
  up();
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-ui-v2.js ==== */
try{
/* ritual-ui-v2.js — kleine UI-Hilfen: Hinweis auf der leeren Zeichen-Kachel. */
(function(){
  var css=document.createElement("style");
  css.textContent=[
    "#sigilBox{position:relative}",
    "#sigHint{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.35rem;text-align:center;padding:.8rem;pointer-events:none;color:#9ee8e0;font-size:.74rem;line-height:1.35}",
    "#sigHint b{font-size:1.6rem;font-weight:400;color:#7ef0e6;text-shadow:0 0 12px rgba(126,240,230,.55)}",
    "#sigHint[hidden]{display:none}",
    ".bakBar .btn{min-height:2rem;font-size:.72rem;font-weight:500}"
  ].join("");
  document.head.appendChild(css);
  function empty(){
    var t=document.getElementById("sigilT");
    var d={}; try{ d=JSON.parse(localStorage.getItem("rr25_sigil")||"{}"); }catch(e){}
    return !(d && d.l) && !(t && String(t.value||"").trim());
  }
  function paint(){
    var box=document.getElementById("sigilBox"); if(!box) return;
    var el=document.getElementById("sigHint");
    if(!el){
      el=document.createElement("div"); el.id="sigHint";
      el.innerHTML="<b>✽</b><span>Absicht eintippen,<br>dann «Zeichen».</span>";
      box.appendChild(el);
    }
    el.hidden=!empty();
  }
  document.addEventListener("click",function(e){
    if(e.target && e.target.closest && e.target.closest("#sigilGo,#sigilSave,[data-go=sigilGo]")) setTimeout(paint,120);
  });
  document.addEventListener("input",function(e){ if(e.target && e.target.id==="sigilT") paint(); });
  paint(); setTimeout(paint,600);

  /* Mond-Text in der Kopfzeile: heute / abnehmend / Tage bis Neu- bzw. Vollmond */
  function moonLine(){
    var syn=29.53058867, nm=Date.UTC(2000,0,6,18,14)/1000;
    var a=((Date.now()/1000-nm)/86400)%syn; if(a<0) a+=syn;
    var d=a-syn/2;
    function inT(n){ return n<=1?"morgen":"in "+n+" Tagen"; }
    if(Math.abs(d)<=0.6) return "Vollmond<br>heute";
    if(d>0){
      var n=Math.max(1,Math.round(syn-a));
      return (d<2?"Vollmond · abnehmend":"Abnehmend")+"<br>Neumond "+inT(n);
    }
    var z=Math.max(1,Math.round(-d));
    return (a<1.2?"Neumond":"Zunehmend")+"<br>Vollmond "+inT(z);
  }
  var SATZ={neu:"Neu setzen. Still halten.",zu:"Wachsen lassen. Nicht hetzen.",voll:"Sichtbar. Nicht nachsetzen.",ab:"Abgeben. Was fällt, darf fallen."};
  function moonLine2(m){
    function inT(n){ return n<=1?"morgen":"in "+n+" Tagen"; }
    if(m.key==="voll") return "Vollmond<br>heute";
    if(m.key==="ab") return "Abnehmend<br>Neumond "+inT(m.newIn);
    return m.name+"<br>Vollmond "+inT(m.fullIn);
  }
  function moon(){
    var tx=document.getElementById("moonTxt");
    var m=window.RR25_MOND?window.RR25_MOND.day():null;
    if(!m){ if(tx) tx.innerHTML=moonLine(); return; }
    if(tx) tx.innerHTML=moonLine2(m);
    var sy=document.getElementById("moonSym"); if(sy) sy.textContent=m.sym;
    var wr=document.getElementById("moonWrap"); if(wr) wr.title=m.name+" · "+SATZ[m.key];
  }
  moon(); setTimeout(moon,300); setInterval(moon,30*60*1000);
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-v3.js ==== */
try{
/* ritual-v3.js — Echo-Rückblick (Tag 3 und 9), nächstes passendes Fenster im Tor, Sichern.
   Neue Schlüssel: rr25_echo_v1 (Rückblicke und Antworten, verknüpft über die Chronik-ID),
   rr25_sicherung_at (letzte Sicherung). Bestehende Schlüssel bleiben unverändert. */
(function(){
  if(window.__rr25v3) return;
  window.__rr25v3=1;
  var DAY=86400000;
  var EKEY="rr25_echo_v1", SKEY="rr25_sicherung_at";
  var DN=["So","Mo","Di","Mi","Do","Fr","Sa"];
  var NO_ECHO={dank:1,kreis:1,weg:1,schlaf:1,abbr:1,anker:1,echo:1};
  var ALIAS={liebezw:"liebe2",fremd:"wesen",fil:"wesen",finst:"vollmond",schaden:"stopp"};
  var ANS={wirkt:"wirkt",teilweise:"teilweise",offen:"noch offen"};

  function h(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
  function rit(id){
    id=ALIAS[id]||id;
    try{ for(var i=0;i<R.length;i++) if(R[i].id===id) return R[i]; }catch(e){}
    return null;
  }
  function two(n){ return String(n).padStart(2,"0"); }
  function dstr(d){ return DN[d.getDay()]+" "+d.getDate()+"."+(d.getMonth()+1)+"."; }
  function tstr(d){ return two(d.getHours())+":"+two(d.getMinutes()); }
  function ymdOf(d){ return d.getFullYear()+"-"+two(d.getMonth()+1)+"-"+two(d.getDate()); }
  function dayStart(ms){ var d=new Date(ms); d.setHours(0,0,0,0); return d.getTime(); }
  function rel(ms){
    var n=Math.round((dayStart(ms)-dayStart(Date.now()))/DAY);
    return n===0?"heute, ":n===1?"morgen, ":"";
  }

  /* ================= 1 · Echo-Rückblick ================= */
  function eLoad(){
    try{ var d=JSON.parse(get(EKEY)||"{}"); if(!d||typeof d!=="object") d={}; if(!Array.isArray(d.items)) d.items=[]; return d; }
    catch(e){ return {items:[]}; }
  }
  function eSave(d){ set(EKEY, JSON.stringify(d)); }
  function absicht(){
    try{ var s=JSON.parse(get("rr25_sigil")||"{}"); return String(s.t||"").trim(); }catch(e){ return ""; }
  }
  function schedule(){
    var e=null;
    try{ e=(load().log||[])[0]; }catch(x){}
    if(!e||!e.id) return;
    if(/abgebrochen/.test(String(e.titel||""))) return;
    var rid=window._rid||"";
    if(NO_ECHO[rid]) return;
    var d=eLoad();
    for(var i=0;i<d.items.length;i++) if(d.items[i].eid===e.id) return;
    var t=Date.now();
    d.items.push({eid:e.id,rid:rid,titel:String(e.titel||""),wer:String(e.wer||""),note:String(e.note||""),absicht:(window._rr25Absicht||absicht()),done:t,
      checks:{"3":{due:t+3*DAY,snooze:0},"9":{due:t+9*DAY,snooze:0}}});
    eSave(d);
  }
  function exists(eid){
    try{ return (load().log||[]).some(function(x){ return String(x.id)===String(eid); }); }catch(e){ return true; }
  }
  function dueList(){
    var d=eLoad(), n=Date.now(), out=[];
    d.items.forEach(function(it){
      ["3","9"].forEach(function(k){
        var c=it.checks&&it.checks[k];
        if(!c||c.a) return;
        if(c.due<=n && (c.snooze||0)<=n && exists(it.eid)) out.push({it:it,k:k,due:c.due});
      });
    });
    out.sort(function(a,b){ return a.due-b.due; });
    return out;
  }
  function answer(eid,k,a,txt){
    var d=eLoad();
    d.items.forEach(function(it){
      if(it.eid!==eid||!it.checks||!it.checks[k]) return;
      if(a==="later"){ it.checks[k].snooze=Date.now()+DAY; return; }
      it.checks[k].a=a; it.checks[k].at=Date.now();
      if(txt) it.checks[k].txt=txt;
    });
    eSave(d);
  }
  function homeBox(){
    var home=document.getElementById("home"); if(!home) return null;
    var box=document.getElementById("v3Home");
    if(!box){
      box=document.createElement("div"); box.id="v3Home";
      var kast=document.getElementById("kasten");
      if(kast) home.insertBefore(box, kast); else home.insertBefore(box, home.firstChild);
    }
    return box;
  }
  function paintEcho(thanks){
    var box=homeBox(); if(!box) return;
    var el=document.getElementById("echoCard");
    var list=dueList();
    if(!list.length){
      if(el){
        if(thanks){ el.innerHTML='<p class="ecThanks">Danke. Im Echo vermerkt.</p>'; setTimeout(function(){ var x=document.getElementById("echoCard"); if(x&&!dueList().length) x.remove(); },2200); }
        else el.remove();
      }
      return;
    }
    if(!el){ el=document.createElement("div"); el.id="echoCard"; el.className="card"; box.insertBefore(el, box.firstChild); }
    var x=list[0], it=x.it, r=rit(it.rid);
    var name=r?r.t:String(it.titel||"Ritual");
    var when=new Date(it.done);
    el.setAttribute("data-eid",it.eid); el.setAttribute("data-k",x.k);
    el.innerHTML='<p class="ecTag">Echo · Tag '+x.k+(list.length>1?' <span>· noch '+(list.length-1)+'</span>':'')+'</p>'+
      '<b>'+h(name)+'</b>'+
      '<small>'+dstr(when)+(it.wer?' · '+h(it.wer):'')+'</small>'+
      (it.absicht?'<p class="ecAbs">Absicht: '+h(it.absicht)+'</p>':'')+
      (it.note?'<p class="ecAbs">Deine Notiz: '+h(it.note)+'</p>':'')+
      '<p class="ecQ">Was hat sich gezeigt?</p>'+
      '<textarea id="ecTxt" placeholder="Ein Satz genügt (optional)"></textarea>'+
      '<div class="row ecRow"><button type="button" class="btn ghost" data-a="wirkt">wirkt</button><button type="button" class="btn ghost" data-a="teilweise">teilweise</button><button type="button" class="btn ghost" data-a="offen">noch offen</button></div>'+
      '<button type="button" class="btn ghost ecRead" id="ecRead">Echo lesen</button>'+
      '<button type="button" class="ecLater" data-a="later">später</button>';
    [].slice.call(el.querySelectorAll("[data-a]")).forEach(function(b){
      b.onclick=function(){
        var a=b.getAttribute("data-a"), txt=((document.getElementById("ecTxt")||{}).value||"").trim();
        answer(it.eid, x.k, a, a==="later"?"":txt);
        paintEcho(a!=="later");
      };
    });
    var er=document.getElementById("ecRead");
    if(er) er.onclick=function(){ if(window.RR25_OPEN) window.RR25_OPEN("echo",{title:"Echo · Tag "+x.k,kind:"ECHO"}); };
  }

  /* Chronik: Marker an den Einträgen und Bilanz je Ritual */
  function answersBy(){
    var m={};
    eLoad().items.forEach(function(it){ m[it.eid]=it; });
    return m;
  }
  function markRows(){
    var box=document.getElementById("entries"); if(!box) return;
    var m=answersBy();
    [].slice.call(box.querySelectorAll("[data-eid]")).forEach(function(row){
      var it=m[row.getAttribute("data-eid")];
      if(!it||row.querySelector(".echoMark")) return;
      var parts=[];
      ["3","9"].forEach(function(k){
        var c=it.checks&&it.checks[k]; if(!c) return;
        if(c.a) parts.push('<span class="em-'+c.a+'">Echo T'+k+': '+ANS[c.a]+'</span>'+(c.txt?' <i>'+h(c.txt)+'</i>':''));
        else if(c.due && c.due<=Date.now()) parts.push('<span class="echoDue"><a href="#echo" data-echo="1">Echo T'+k+' · lesen</a></span>');
      });
      if(!parts.length) return;
      var d=document.createElement("div"); d.className="echoMark"; d.innerHTML=parts.join("<br>");
      var host=row.firstElementChild||row;
      var meta=host.querySelector(".meta");
      if(meta&&meta.nextSibling) host.insertBefore(d, meta.nextSibling); else host.appendChild(d);
      d.querySelectorAll("[data-echo]").forEach(function(a){ a.onclick=function(ev){ ev.preventDefault(); if(window.RR25_OPEN) window.RR25_OPEN("echo"); }; });
    });
    summary();
  }
  function summary(){
    var log=document.getElementById("log"), ent=document.getElementById("entries");
    if(!log||!ent) return;
    var g={}, order=[], total=0;
    eLoad().items.forEach(function(it){
      var r=rit(it.rid), key=r?r.id:(it.titel||"?"), name=r?r.t:(it.titel||"Ritual");
      ["3","9"].forEach(function(k){
        var c=it.checks&&it.checks[k]; if(!c||!c.a) return;
        if(!g[key]){ g[key]={n:name,wirkt:0,teilweise:0,offen:0}; order.push(key); }
        g[key][c.a]++; total++;
      });
    });
    var el=document.getElementById("echoSum");
    if(!total){ if(el) el.remove(); return; }
    if(!el){ el=document.createElement("details"); el.id="echoSum"; }
    if(el.parentNode!==log || el.nextSibling!==ent) log.insertBefore(el, ent);
    var open=el.open;
    el.innerHTML='<summary>Echo-Bilanz · '+total+(total===1?' Antwort':' Antworten')+'</summary>'+
      order.map(function(k){ var x=g[k]; return '<p><b>'+h(x.n)+'</b><span>wirkt '+x.wirkt+' · teilweise '+x.teilweise+' · offen '+x.offen+'</span></p>'; }).join("");
    el.open=open;
  }

  /* ================= 2 · Nächstes passendes Fenster ================= */
  /* Kalender: gemeinsame Regel und Daten aus ritual-zeit.js (RR25_KAL), dieselbe wie Kalender-Tab und Wetter im Tor */
  var KZ=window.RR25_KAL, kalState="load";
  function loadKal(){
    if(!KZ){ kalState="fail"; return; }
    KZ.onReady(function(){ kalState=KZ.status()==="ok"?"ok":"fail"; paintWin(true); });
  }
  function kindNow(){
    var s=KZ.state();
    kindNow.src=s.src==="mond"?"mond":"kal";
    kindNow.st=s;
    return s.kind;
  }
  function nextKal(K){
    var n=KZ.next(K,Date.now());
    if(!n||n.x.s>Date.now()+30*DAY) return null;
    return {t:n.x.s,all:n.x.all,end:n.x.all?null:n.x.e,bandEnd:n.x.all?n.x.e:null,more:n.more.map(function(y){ return tstr(new Date(y.s)); }),calc:n.x.src==="calc"};
  }
  function laterToday(K){
    var n=Date.now(), s=KZ.state(n), out=[];
    s.items.forEach(function(x){ if(!x.all&&x.k===K&&x.s>n) out.push(tstr(new Date(x.s))); });
    return out;
  }
  /* Mondphasen: gemeinsame Quelle ritual-mondphase.js (Meeus) */
  function moonEvents(full,from,to){
    return window.RR25_MOND.events(from,to).filter(function(e){ return e.q===(full?2:0); }).map(function(e){ return e.t; });
  }
  window.RR25_MOON=moonEvents;
  function feldLine(rid){
    var n=Date.now(), types=rid==="vollmond"?[["Vollmond",true]]:rid==="neumond"?[["Neumond",false]]:[["Neumond",false],["Vollmond",true]];
    var after={Vollmond:2*DAY,Neumond:3*DAY}, now=null, next=null;
    types.forEach(function(ty){
      moonEvents(ty[1], n-after[ty[0]], n+0.6*DAY).forEach(function(t){ if(!now||t>now.t) now={n:ty[0],t:t}; });
      var nx=moonEvents(ty[1], n+0.6*DAY, n+31*DAY)[0];
      if(nx && (!next||nx<next.t)) next={n:ty[0],t:nx};
    });
    var name=rid==="vollmond"?"Vollmond":rid==="neumond"?"Neumond":"Mondtor";
    if(now) return '<b>Jetzt ist ein gutes Fenster.</b> '+now.n+' '+rel(now.t)+dstr(new Date(now.t))+', '+tstr(new Date(now.t))+'.';
    if(next) return 'Nächstes Fenster · '+next.n+': <b>'+rel(next.t)+dstr(new Date(next.t))+', '+tstr(new Date(next.t))+'</b>';
    return 'In den nächsten 30 Tagen kein '+name+' gefunden.';
  }
  function winLine(r){
    if(!r) return "";
    if(r.tone==="feld") return feldLine(r.id);
    var K=r.hard?"HARD":"SOFT", nm=r.hard?"Hard":"Soft";
    if(kalState==="load") return "Nächstes "+nm+"-Fenster wird gesucht …";
    if(!KZ) return "Kalender nicht geladen. Kein Fenster berechnet.";
    var pre="", k=kindNow(), st=kindNow.st;
    if(k===K){
      if(st.open){
        var lt=laterToday(K);
        return '<b>Jetzt ist ein gutes Fenster.</b> Offen bis '+tstr(new Date(st.open.e))+'.'+(lt.length?' Später heute auch: '+lt.join(" · ")+'.':'');
      }
      if(kindNow.src==="kal") return '<b>Jetzt ist ein gutes Fenster.</b>'+(st.band?' Soft-Band bis '+dstr(new Date(st.band.e-1)).replace(/\.$/,"")+'.':'');
      pre='Heute kein Kalendereintrag, die Mondphase trägt '+nm+'.<br>';
    }
    if(kalState==="fail") pre+='Kalender nicht geladen, gerechnet nach Mondphase.<br>';
    var x=nextKal(K);
    if(!x) return pre+"Im Kalender steht in den nächsten 30 Tagen kein "+(r.hard?"Hard-Feintakt":"Soft-Fenster")+".";
    var d=new Date(x.t);
    var s=pre+(r.hard?'Nächster Hard-Feintakt':'Nächstes Soft-Fenster')+': <b>'+rel(x.t)+dstr(d)+', '+(x.all?(x.bandEnd&&x.bandEnd-x.t>DAY?'ab diesem Tag (Band bis '+dstr(new Date(x.bandEnd-1))+')':'ganzer Tag'):tstr(d)+(x.end?'–'+tstr(new Date(x.end)):''))+'</b>'+(x.calc?' <span class="meta">(gerechnet)</span>':'');
    if(x.more.length) s+='<br><span class="meta">Am selben Tag auch: '+x.more.join(" · ")+'</span>';
    return s;
  }
  function paintWin(force){
    var run=document.getElementById("run"); if(!run) return;
    var w=run.querySelector("#wetter");
    if(!w) return;
    var el=document.getElementById("nextWin");
    if(el && !force) return;
    if(!el){ el=document.createElement("p"); el.id="nextWin"; w.parentNode.insertBefore(el, w.nextSibling); }
    el.innerHTML=winLine(rit(window._rid));
  }

  /* ================= 3 · Sichern ================= */
  function pack(){
    var p={v:4,t:new Date().toISOString()};
    var names=["rr25_ritual_v1","rr25_notiz_v1","rr25_wer","rr25_personen","rr25_369","rr25_dank","rr25_kleid"];
    for(var i=0;i<localStorage.length;i++){
      var k=localStorage.key(i);
      if(k && k.indexOf("rr25")===0 && k!=="rr25_pack_bak" && k!==SKEY && names.indexOf(k)<0) names.push(k);
    }
    names.forEach(function(k){ var v=get(k); if(v!=null && v!=="") p[k]=v; });
    return p;
  }
  /* alle Fotos aus IndexedDB (rr25_fotos_v1 · pics) als [[id,[dataURL,…]],…] */
  function fotosAll(){
    return new Promise(function(res){
      if(typeof idb!=="function"){ res([]); return; }
      idb().then(function(db){
        var out=[], q;
        try{ q=db.transaction("pics").objectStore("pics").openCursor(); }catch(e){ res([]); return; }
        q.onsuccess=function(){
          var c=q.result;
          if(!c){ res(out); return; }
          if(Array.isArray(c.value) && c.value.length) out.push([c.key,c.value]);
          c.continue();
        };
        q.onerror=function(){ res(out); };
      }).catch(function(){ res([]); });
    });
  }
  function packAll(){
    var p=pack();
    return fotosAll().then(function(f){ if(f.length) p.fotos=f; return p; });
  }
  function fname(ext){ var n=new Date(); return "RR25-Sicherung-"+ymdOf(n)+"."+ext; }
  function lastBak(){
    if(window.RR25_BAK) return window.RR25_BAK.last();
    var a=parseInt(get(SKEY)||"0",10)||0, b=parseInt(get("rr25_bak_at")||"0",10)||0;
    return Math.max(a,b);
  }
  function bakStale(){
    if(window.RR25_BAK) return window.RR25_BAK.stale();
    var t=lastBak(); return !t||Date.now()-t>30*DAY;
  }
  function mb(n){ return n<1048576?Math.max(1,Math.round(n/1024))+" KB":(n/1048576).toFixed(1).replace(".",",")+" MB"; }
  function download(raw,name){
    var blob=new Blob([raw],{type:"application/json"});
    var a=document.createElement("a");
    a.href=URL.createObjectURL(blob); a.download=name; a.rel="noopener";
    document.body.appendChild(a); a.click();
    setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); },1500);
  }
  var busy=false;
  function sichern(cb){
    if(busy) return;
    busy=true;
    var b=document.getElementById("bakGoV3"); if(b){ b.disabled=true; b.textContent="…"; }
    packAll().then(function(p){ busy=false; sichern2(p,cb); }).catch(function(){ busy=false; sichern2(pack(),cb); });
  }
  function sichern2(p,cb){
    var raw=JSON.stringify(p), nf=(p.fotos||[]).reduce(function(a,x){ return a+x[1].length; },0);
    var info=mb(raw.length)+(nf?", "+nf+" Fotos":"");
    sichern2.last={bytes:raw.length,fotos:nf};
    function ok(){ var t=String(Date.now()); set(SKEY,t); set("rr25_bak_at",t); var hb=document.getElementById("bakHint"); if(hb) hb.remove(); paintBak("Gesichert. "+info+"."); if(cb) cb(true); }
    var files=[];
    try{
      files=[new File([raw],fname("json"),{type:"application/json"}), new File([raw],fname("txt"),{type:"text/plain"})];
    }catch(e){ files=[]; }
    for(var i=0;i<files.length;i++){
      try{
        if(navigator.share && navigator.canShare && navigator.canShare({files:[files[i]]})){
          navigator.share({files:[files[i]],title:"RR25 Sicherung"}).then(ok).catch(function(err){
            if(err && err.name==="AbortError"){ paintBak("Nicht gesichert. Nochmal?"); if(cb) cb(false); return; }
            try{ download(raw,fname("json")); ok(); }catch(x){ if(cb) cb(false); }
          });
          return;
        }
      }catch(e){}
    }
    try{ download(raw,fname("json")); ok(); }catch(e){ paintBak("Sichern ging nicht."); if(cb) cb(false); }
  }
  window.RR25_V3={pack:pack,packAll:packAll,fotosAll:fotosAll,sichern:sichern,sichern2:sichern2,schedule:schedule,paintEcho:paintEcho,paintWin:paintWin,winLine:function(id){ return winLine(rit(id)); },kindNow:kindNow,dueList:dueList};
  /* Wochen-Sicherung (Build 45): EINE Erinnerung auf der Startseite, unter der Ton-Zeile (nie über der Zeichen-Kachel).
     Fällig, wenn die letzte Sicherung älter als 7 Tage ist oder nie war. «später» schiebt 2 Tage auf.
     «Jetzt sichern» nutzt denselben Ablauf wie «Sichern» in «Mehr» (RR25_SICHERN, Datei-Download). */
  var SNOOZE="rr25_sicherung_spaeter", WEEK=7*DAY;
  function del(k){ try{ localStorage.removeItem(k); }catch(e){} }
  function bakDue(){
    var t=lastBak();
    if(t && Date.now()-t<WEEK) return false;
    var z=parseInt(get(SNOOZE)||"0",10)||0;
    return !(z>Date.now());
  }
  function bakAnchor(){
    var home=document.getElementById("home"); if(!home) return null;
    var a=document.getElementById("ankerHintCard");
    if(!a||a.parentNode!==home) a=document.getElementById("toneRow");
    if(!a||a.parentNode!==home) a=document.getElementById("kasten");
    return a&&a.parentNode===home?a:null;
  }
  function bakPlace(){
    var el=document.getElementById("bakCard"), a=bakAnchor();
    if(el && a && el.previousElementSibling!==a) a.parentNode.insertBefore(el, a.nextSibling);
  }
  var bakTimer=0;
  function paintBak(msg){
    var a=bakAnchor(); if(!a) return;
    var el=document.getElementById("bakCard");
    var good=msg && /^(Gesichert|Danke)/.test(msg);
    if(!msg && !bakDue()){ if(el && !el.classList.contains("bkDone")) el.remove(); return; }
    if(!el){ el=document.createElement("div"); el.id="bakCard"; el.className="card"; }
    bakWatch();
    if(el.parentNode!==a.parentNode || el.previousElementSibling!==a) a.parentNode.insertBefore(el, a.nextSibling);
    clearTimeout(bakTimer);
    if(good){
      el.classList.add("bkDone");
      el.innerHTML='<p class="bkThanks">Danke. Deine Sicherung ist gespeichert.</p>';
      bakTimer=setTimeout(function(){ var x=document.getElementById("bakCard"); if(x) x.remove(); },2600);
      return;
    }
    el.classList.remove("bkDone");
    var t=lastBak(), days=t?Math.floor((Date.now()-t)/DAY):null;
    var sub=msg?h(msg):(t?'Letzte Sicherung vor '+days+(days===1?' Tag':' Tagen'):'Noch keine Sicherung')+' · eine Datei mit allem, auch den Fotos.';
    el.innerHTML='<p class="bkTag">Sicherung</p><b class="bkHead">Zeit für deine Wochen-Sicherung</b><small class="bkSub">'+sub+'</small>'+
      '<div class="bkBtns"><button type="button" class="btn primary" id="bakGoV3">Jetzt sichern</button><button type="button" class="bkLater" id="bakLater">später</button></div>';
    document.getElementById("bakGoV3").onclick=function(){ bakNow(); };
    document.getElementById("bakLater").onclick=function(){ set(SNOOZE,String(Date.now()+2*DAY)); var x=document.getElementById("bakCard"); if(x) x.remove(); };
  }
  function bakNow(){
    var S=window.RR25_SICHERN;
    if(!(S && S.pack && S.fileName)){ sichern(); return; }
    var b=document.getElementById("bakGoV3"); if(b){ b.disabled=true; b.textContent="…"; }
    S.pack().then(function(p){
      download(JSON.stringify(p), S.fileName());
      var t=String(Date.now()); set(SKEY,t); set("rr25_bak_at",t); del(SNOOZE);
      var sh=document.getElementById("sxHint"); if(sh){ sh.textContent="Letzte Sicherung heute"; sh.className="sxHint"; }
      paintBak("Gesichert.");
    }).catch(function(){ paintBak("Sichern ging nicht. Nochmal?"); });
  }
  var bakObs=null;
  function bakWatch(){
    var home=document.getElementById("home");
    if(bakObs || !home || !window.MutationObserver) return;
    bakObs=new MutationObserver(bakPlace);
    bakObs.observe(home,{childList:true});
  }

  /* ================= Einhängen ================= */
  var css=document.createElement("style");
  css.textContent=[
    "#v3Home{margin:.1rem 0 .25rem}",
    "#echoCard{border-color:rgba(126,200,255,.35);background:rgba(28,14,50,.85)}",
    "#echoCard .ecTag{margin:0 0 .2rem;font-size:.6rem;letter-spacing:.18em;text-transform:uppercase;color:#7ec8ff}",
    "#echoCard .ecTag span{color:#8e7aa8;letter-spacing:.08em;text-transform:none}",
    "#echoCard .ecAbs{margin:.35rem 0 0;font-size:.8rem;color:#c4b4e0}",
    "#echoCard .ecQ{margin:.55rem 0 .1rem;font-family:Georgia,serif;font-size:1.02rem}",
    "#echoCard textarea{min-height:3.2rem}",
    "#echoCard .ecRow{margin-top:.35rem}",
    "#echoCard .ecRow .btn{font-weight:550}",
    "#echoCard .ecLater{display:block;margin:.45rem auto 0;background:none;border:0;color:#8e7aa8;font:inherit;font-size:.74rem;text-decoration:underline;padding:.3rem .8rem}","#echoCard .ecRead{width:100%;margin:.35rem 0 0;min-height:2.1rem;font-size:.78rem;border-color:rgba(126,200,255,.35)}",".echoDue a{color:#7ec8ff;text-decoration:none;border-bottom:1px dotted rgba(126,200,255,.55)}",
    "#echoCard .ecThanks{margin:.1rem 0;font-family:Georgia,serif;color:#9ee8e0}",
    "#home>#bakCard{margin:.55rem 0 .6rem;padding:.75rem .9rem .7rem;border-radius:1.1rem;border:1px solid rgba(232,160,255,.38);background:linear-gradient(160deg,rgba(58,24,88,.78),rgba(18,9,32,.92));box-shadow:0 0 18px rgba(201,155,255,.16)}",
    "#bakCard .bkTag{margin:0 0 .15rem;font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:#ff9ae4}",
    "#bakCard .bkHead{display:block;font-family:Georgia,serif;font-weight:500;font-size:1.02rem;color:#f6f0ff}",
    "#bakCard .bkSub{display:block;margin:.2rem 0 0;font-size:.74rem;color:#c4b4e0;line-height:1.4}",
    "#bakCard .bkBtns{display:flex;align-items:center;gap:.6rem;margin-top:.6rem}",
    "#bakCard .bkBtns .btn{flex:1;min-height:2.5rem}",
    "#bakCard .bkLater{flex:none;background:none;border:0;color:#8e7aa8;font:inherit;font-size:.78rem;text-decoration:underline;padding:.5rem .7rem;cursor:pointer}",
    "#bakCard .bkThanks{margin:.1rem 0;font-family:Georgia,serif;color:#9ee8e0;text-align:center}",
    "#run #nextWin{margin:-.3rem 0 .6rem;padding:.5rem .75rem;border-radius:.9rem;background:rgba(20,10,34,.55);border:1px dashed rgba(126,200,255,.22);font-size:.84rem;line-height:1.45;color:#e6dcf7}",
    "#run #nextWin b{color:#fff;font-weight:600}",
    ".echoMark{margin:.3rem 0 0;font-size:.74rem;color:#c4b4e0;line-height:1.4}",
    ".echoMark span{display:inline-block;padding:.05rem .45rem;border-radius:999px;border:1px solid rgba(126,200,255,.3)}",
    ".echoMark .em-wirkt{color:#5fe0a0;border-color:rgba(95,224,160,.45)}",
    ".echoMark .em-teilweise{color:#ffb86b;border-color:rgba(255,184,107,.45)}",
    ".echoMark .em-offen{color:#b8b3c6}",
    "#echoSum{margin:0 0 .55rem;padding:.5rem .75rem;border:1px solid rgba(126,200,255,.2);border-radius:.9rem;background:rgba(20,10,34,.6);font-size:.8rem}",
    "#echoSum summary{cursor:pointer;color:#7ec8ff;font-size:.72rem;letter-spacing:.08em}",
    "#echoSum p{margin:.35rem 0 0;display:flex;justify-content:space-between;gap:.5rem}",
    "#echoSum p b{font-family:Georgia,serif;font-weight:500}",
    "#echoSum p span{color:#c4b4e0;white-space:nowrap}"
  ].join("");
  document.head.appendChild(css);

  if(typeof show==="function" && !show._v3){
    var sh=show;
    show=function(id){
      if(id==="after"){ try{ schedule(); }catch(e){} }
      var r=sh.apply(this,arguments);
      if(id==="home"){ paintEcho(); paintBak(); setTimeout(bakPlace,30); }
      if(id==="log"||id==="notiz"){ setTimeout(markRows,60); }
      return r;
    };
    show._v3=1;
  }
  function watch(id,fn){
    var el=document.getElementById(id);
    if(el && window.MutationObserver) new MutationObserver(fn).observe(el,{childList:true});
  }
  watch("run", function(){ paintWin(false); });
  watch("entries", markRows);
  loadKal();
  paintEcho(); paintBak();
  setTimeout(function(){ paintEcho(); paintBak(); },700);
})();

}catch(e){setTimeout(function(){throw e;});}
