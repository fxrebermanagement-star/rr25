/* ritual-rueckblick.js — Build 36: «Rückblick» in der Chronik (Monat für Monat) und kleine Merker «Wirkung»/«Echo».
   Zählt Einträge je Ton (Soft, Grenze, Hard, Feld, Grau), je Mondphase, je Tageszeit und die Merker.
   Ton: RR25_TONE (ritual-fein.js), Grau = Tagesziel, Sigille, Gabe. Mondphase: RR25_MOND zur Eintragszeit.
   Merker liegen getrennt in rr25_tags_v1 ({Eintrags-ID: ["Wirkung","Echo"]}); bestehende Einträge bleiben unverändert.
   Beantwortete Echo-Tage (rr25_echo_v1, Tag 3/9) werden nur gelesen. */
(function(){
  if(window.__rr25rb) return; window.__rr25rb=1;
  var TK="rr25_tags_v1", TAGS=["Wirkung","Echo"], MON=null, OPEN=false, MODE="monat";
  var MN=["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
  function js(k,d){ try{ var v=JSON.parse(localStorage.getItem(k)||"null"); return v==null?d:v; }catch(e){ return d; } }
  function tags(){ var t=js(TK,{}); return t&&typeof t==="object"&&!Array.isArray(t)?t:{}; }
  function setTags(t){ try{ localStorage.setItem(TK,JSON.stringify(t)); }catch(e){} }
  function h(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function when(e){
    var s=String(e&&e.t||""), m=s.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})(?:,?\s*(\d{1,2}):(\d{2}))?/);
    if(m) return new Date(+m[3],+m[2]-1,+m[1],+(m[4]||12),+(m[5]||0)).getTime();
    var p=Date.parse(s); return isNaN(p)?null:p;
  }
  function rows(){ try{ return (typeof load==="function"?load().log:js("rr25_ritual_v1",{}).log)||[]; }catch(e){ return []; } }
  function tone(e){
    var t=window.RR25_TONE?window.RR25_TONE(e):"soft";
    return t==="neutral"?"grau":t;
  }
  function moon(ms){
    var M=window.RR25_MOND; if(!M) return "";
    var k=M.day(ms).key; return {neu:"Neumond",zu:"Zunehmend",voll:"Vollmond",ab:"Abnehmend"}[k]||"";
  }
  function daytime(ms){ var hr=new Date(ms).getHours(); return hr>=5&&hr<11?"Morgen":hr<17&&hr>=11?"Tag":hr>=17&&hr<22?"Abend":"Nacht"; }
  function stats(y,m){
    var T=tags(), S={n:0,rit:0,ziel:0,ton:{soft:0,grenze:0,hard:0,feld:0,grau:0},mond:{Neumond:0,Zunehmend:0,Vollmond:0,Abnehmend:0},zeit:{Morgen:0,Tag:0,Abend:0,Nacht:0},Wirkung:0,Echo:0,echoAnt:0};
    rows().forEach(function(e){
      var ms=when(e); if(ms==null) return; var d=new Date(ms); if(d.getFullYear()!==y||d.getMonth()!==m) return;
      S.n++; if(String(e.titel||'')==='Tagesziel') S.ziel++; else if(window.RR25_ZAEHLREGEL&&window.RR25_ZAEHLREGEL.isRitual(e)) S.rit++; S.ton[tone(e)]=(S.ton[tone(e)]||0)+1;
      var mo=moon(ms); if(mo) S.mond[mo]++;
      S.zeit[daytime(ms)]++;
      (T[String(e.id)]||[]).forEach(function(t){ if(t in S) S[t]++; });
    });
    try{ (js("rr25_echo_v1",{}).items||[]).forEach(function(it){ ["3","9"].forEach(function(k){ var c=it.checks&&it.checks[k]; if(c&&c.a&&c.due){ var d=new Date(c.due); if(d.getFullYear()===y&&d.getMonth()===m) S.echoAnt++; } }); }); }catch(e){}
    return S;
  }
  function bars(obj,cls,lab){
    var max=1; Object.keys(obj).forEach(function(k){ max=Math.max(max,obj[k]); });
    return '<div class="rbBars">'+Object.keys(obj).map(function(k){
      var v=obj[k], w=Math.round(v/max*100);
      return '<div class="rbRow"><span class="rbL">'+h(lab?lab[k]:k)+'</span><span class="rbT"><i class="rbF '+(cls?k:"")+'" style="width:'+(v?Math.max(w,4):0)+'%"></i></span><b>'+v+'</b></div>';
    }).join("")+'</div>';
  }
  function sentence(S){
    if(!S.n) return "In diesem Monat noch nichts in der Chronik.";
    var best=Object.keys(S.ton).sort(function(a,b){ return S.ton[b]-S.ton[a]; })[0];
    var LAB={soft:"Soft",grenze:"Grenze",hard:"Hard",feld:"Feld",grau:"Grau"};
    var rest=S.n-S.rit-S.ziel;
    return S.n+(S.n===1?" Eintrag":" Einträge")+": "+S.rit+(S.rit===1?" Ritual":" Rituale")+", "+S.ziel+(S.ziel===1?" Tagesziel":" Tagesziele")+(rest>0?", "+rest+" weitere":"")+". Am meisten "+LAB[best]+(S.Wirkung?", "+S.Wirkung+"× Wirkung gespürt":"")+".";
  }
  function yearStats(y){
    var T=tags(), Y={n:0,rit:0,monat:[0,0,0,0,0,0,0,0,0,0,0,0],ton:{soft:0,grenze:0,hard:0,feld:0,grau:0},mond:{Neumond:0,Zunehmend:0,Vollmond:0,Abnehmend:0},Wirkung:0,Echo:0,echoAnt:0,top:{}};
    rows().forEach(function(e){
      var ms=when(e); if(ms==null) return; var d=new Date(ms); if(d.getFullYear()!==y) return;
      Y.n++;
      var isR=String(e.titel||'')!=='Tagesziel'&&window.RR25_ZAEHLREGEL&&window.RR25_ZAEHLREGEL.isRitual(e);
      if(isR){ Y.rit++; Y.monat[d.getMonth()]++; var nm=String(e.titel||"").trim(); if(nm) Y.top[nm]=(Y.top[nm]||0)+1; }
      var tn=tone(e); Y.ton[tn]=(Y.ton[tn]||0)+1;
      var mo=moon(ms); if(mo) Y.mond[mo]++;
      (T[String(e.id)]||[]).forEach(function(t){ if(t in Y) Y[t]++; });
    });
    try{ (js("rr25_echo_v1",{}).items||[]).forEach(function(it){ ["3","9"].forEach(function(k){ var c=it.checks&&it.checks[k]; if(c&&c.a&&c.due){ var d=new Date(c.due); if(d.getFullYear()===y) Y.echoAnt++; } }); }); }catch(e){}
    return Y;
  }
  function yearPanel(){
    var now=new Date(); var y=MON.y, Y=yearStats(y), LAB={soft:"Soft",grenze:"Grenze",hard:"Hard",feld:"Feld",grau:"Grau"};
    var mo={}; MN.forEach(function(n,i){ mo[i]=Y.monat[i]; });
    var ml={}; MN.forEach(function(n,i){ ml[i]=n.slice(0,3); });
    var top=Object.keys(Y.top).sort(function(a,b){ return Y.top[b]-Y.top[a]||a.localeCompare(b); }).slice(0,5);
    var say=Y.n?(Y.rit+(Y.rit===1?" Ritual":" Rituale")+" in "+y+(Y.n>Y.rit?", dazu "+(Y.n-Y.rit)+" weitere Einträge":"")+"."):"In diesem Jahr noch nichts in der Chronik.";
    var wd=Y.Wirkung+Y.Echo, wp=wd?Math.round(Y.Wirkung/wd*100):50;
    var fut=y>=now.getFullYear();
    return '<div class="rbHead"><button type="button" class="rbNav" data-d="-12" aria-label="Jahr zurück">‹</button><b>'+y+'</b><button type="button" class="rbNav" data-d="12" aria-label="Jahr vor"'+(fut?' disabled':'')+'>›</button></div>'+
      '<p class="rbSay">'+h(say)+'</p>'+
      '<p class="rbH">Rituale pro Monat</p>'+bars(mo,false,ml)+
      '<p class="rbH">Ton · Soft und Hard</p>'+bars(Y.ton,true,LAB)+
      '<p class="rbH">Mondphase</p>'+bars(Y.mond)+
      '<p class="rbH">Wirkung und Echo</p>'+(wd?'<div class="rbBal" aria-label="Wirkung '+Y.Wirkung+', Echo '+Y.Echo+'"><i style="width:'+wp+'%"></i></div>':'')+
      '<div class="rbPills"><span class="rbP on">Wirkung <b>'+Y.Wirkung+'</b></span><span class="rbP on">Echo <b>'+Y.Echo+'</b></span><span class="rbP">Echo-Tage beantwortet <b>'+Y.echoAnt+'</b></span></div>'+
      '<p class="rbH">Meistgenutzte Rituale</p>'+(top.length?'<ol class="rbTop">'+top.map(function(k){ return '<li><span>'+h(k)+'</span><b>'+Y.top[k]+'×</b></li>'; }).join("")+'</ol>':'<p class="rbNote">Noch keine Rituale in diesem Jahr.</p>');
  }
  function modeBar(){
    return '<div class="rbMode" role="tablist"><button type="button" data-mode="monat" class="'+(MODE==="monat"?"on":"")+'">Monat</button><button type="button" data-mode="jahr" class="'+(MODE==="jahr"?"on":"")+'">Jahr</button></div>';
  }
  function panel(){
    var now=new Date(); if(!MON) MON={y:now.getFullYear(),m:now.getMonth()};
    if(MODE==='jahr') return modeBar()+yearPanel();
    var S=stats(MON.y,MON.m);
    var LAB={soft:"Soft",grenze:"Grenze",hard:"Hard",feld:"Feld",grau:"Grau"};
    var fut=MON.y>now.getFullYear()||(MON.y===now.getFullYear()&&MON.m>=now.getMonth());
    return modeBar()+'<div class="rbHead"><button type="button" class="rbNav" data-d="-1" aria-label="Monat zurück">‹</button><b>'+MN[MON.m]+' '+MON.y+'</b><button type="button" class="rbNav" data-d="1" aria-label="Monat vor"'+(fut?' disabled':'')+'>›</button></div>'+
      '<p class="rbSay">'+h(sentence(S))+'</p>'+
      '<p class="rbH">Ton · alle Einträge</p>'+bars(S.ton,true,LAB)+
      '<p class="rbH">Mondphase</p>'+bars(S.mond)+
      '<p class="rbH">Tageszeit</p>'+bars(S.zeit)+
      '<p class="rbH">Merker</p><div class="rbPills"><span class="rbP on">Wirkung <b>'+S.Wirkung+'</b></span><span class="rbP on">Echo <b>'+S.Echo+'</b></span><span class="rbP">Echo-Tage beantwortet <b>'+S.echoAnt+'</b></span></div>'+
      '<p class="rbNote">Merker setzt du direkt an einem Eintrag: «Wirkung» oder «Echo» antippen.</p>';
  }
  function paintPanel(){
    var p=document.getElementById("rbPanel"); if(!p) return;
    p.hidden=!OPEN; if(!OPEN) return;
    p.innerHTML=panel(); modeHook(p);
    p.querySelectorAll(".rbNav").forEach(function(b){ b.onclick=function(){ var d=+b.getAttribute("data-d"); if(MODE==="jahr"){ MON={y:MON.y+d/12,m:MON.m}; paintPanel(); return; } var m=MON.m+d, y=MON.y; if(m<0){ m=11; y--; } if(m>11){ m=0; y++; } MON={y:y,m:m}; paintPanel(); }; });
  }
  function modeHook(p){ p.querySelectorAll('.rbMode button').forEach(function(b){ b.onclick=function(){ MODE=b.getAttribute('data-mode'); paintPanel(); }; }); }
  function mount(){
    var sec=document.getElementById("log"), ent=document.getElementById("entries"); if(!sec||!ent) return;
    if(!document.getElementById("rbBtn")){
      var bar=document.createElement("div"); bar.id="rbBar";
      bar.innerHTML='<button type="button" class="btn ghost" id="rbBtn">Rückblick</button>';
      var p=document.createElement("div"); p.id="rbPanel"; p.className="card"; p.hidden=true;
      sec.insertBefore(bar,ent); sec.insertBefore(p,ent);
      bar.querySelector("#rbBtn").onclick=function(){ OPEN=!OPEN; this.classList.toggle("on",OPEN); this.textContent=OPEN?"Rückblick zu":"Rückblick"; paintPanel(); };
    }
    chips();
  }
  function chips(){
    var box=document.getElementById("entries"); if(!box) return;
    var T=tags();
    box.querySelectorAll(".logrow[data-eid]").forEach(function(row){
      var id=row.getAttribute("data-eid"), have=T[id]||[], c=row.querySelector(".rbTags");
      if(!c){ c=document.createElement("span"); c.className="rbTags"; var host=row.querySelector(".meta")||row; host.appendChild(c); }
      var html=TAGS.map(function(t){ return '<button type="button" class="rbTag'+(have.indexOf(t)>=0?' on':'')+'" data-tag="'+t+'">'+t+'</button>'; }).join("");
      if(c.innerHTML!==html) c.innerHTML=html;
    });
  }
  document.addEventListener("click",function(ev){
    var b=ev.target.closest&&ev.target.closest(".rbTag"); if(!b) return;
    ev.stopPropagation(); ev.preventDefault();
    var row=b.closest(".logrow[data-eid]"); if(!row) return;
    var id=row.getAttribute("data-eid"), t=b.getAttribute("data-tag"), T=tags(), a=(T[id]||[]).slice(), i=a.indexOf(t);
    if(i>=0) a.splice(i,1); else a.push(t);
    if(a.length) T[id]=a; else delete T[id];
    setTags(T); b.classList.toggle("on",i<0); paintPanel();
  },true);
  var css=document.createElement("style");
  css.textContent=[
    "#rbBar{display:flex;justify-content:flex-end;margin:-.2rem 0 .5rem}",
    "#rbBtn{min-height:2.1rem!important;padding:.35rem 1rem!important;font-size:.76rem!important;border-radius:999px!important;border:1px solid rgba(200,120,255,.35)!important;background:rgba(160,90,255,.1)!important;color:#e4ecff!important}",
    "#rbBtn.on{box-shadow:0 0 14px rgba(200,120,255,.35)}",
    "#rbPanel{margin:0 0 .8rem;padding:.75rem .8rem .7rem;background:linear-gradient(180deg,rgba(40,18,62,.78),rgba(14,8,24,.92))!important;border:1px solid rgba(200,120,255,.22)!important;border-radius:1.1rem!important}",
    "#rbPanel[hidden]{display:none!important}",
    ".rbHead{display:flex;align-items:center;justify-content:space-between}.rbHead b{font-family:Georgia,serif;font-weight:400;font-size:1rem;color:#e4ecff}",
    ".rbNav{width:2rem;height:2rem;border-radius:999px;border:1px solid rgba(200,120,255,.3);background:rgba(160,90,255,.08);color:#cfa8ff;font-size:1.05rem;padding:0}.rbNav[disabled]{opacity:.3}",
    ".rbSay{margin:.45rem 0 .2rem;font-size:.8rem;color:#e6d4ff;line-height:1.4}",
    ".rbH{margin:.65rem 0 .25rem;font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:#d6a6ff}",
    ".rbRow{display:grid;grid-template-columns:5.6rem 1fr 1.6rem;align-items:center;gap:.45rem;margin:.18rem 0;font-size:.72rem;color:#cdbbe8}.rbRow b{text-align:right;font-weight:600;color:#e4ecff}",
    ".rbT{height:.5rem;border-radius:999px;background:rgba(255,255,255,.05);overflow:hidden}",
    ".rbF{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#7b3fb0,#d58bff);box-shadow:0 0 8px rgba(213,139,255,.45)}",
    ".rbF.soft{background:linear-gradient(90deg,#1f8a52,#2ecc71)}.rbF.grenze{background:linear-gradient(90deg,#b8661f,#ff9f43)}.rbF.hard{background:linear-gradient(90deg,#9e2b22,#e74c3c)}.rbF.feld{background:linear-gradient(90deg,#5b2a99,#9a4dff)}.rbF.grau{background:linear-gradient(90deg,#5e5a6b,#9a96a6);box-shadow:none}",
    ".rbPills{display:flex;flex-wrap:wrap;gap:.35rem}.rbP{display:inline-flex;align-items:center;white-space:nowrap;font-size:.7rem;padding:.2rem .6rem;border-radius:999px;border:1px solid rgba(200,120,255,.25);color:#cdbbe8}.rbP.on{color:#e4ecff;background:rgba(160,90,255,.12)}.rbP b{margin-left:.2rem;color:#fff}",
    ".rbMode{display:flex;gap:.3rem;justify-content:center;margin:0 0 .5rem}.rbMode button{min-height:0;padding:.25rem .9rem;font-size:.7rem;border-radius:999px;border:1px solid rgba(200,120,255,.25);background:transparent;color:#cdbbe8}.rbMode button.on{background:rgba(160,90,255,.22);color:#f6e6ff;border-color:rgba(200,120,255,.6);box-shadow:0 0 10px rgba(200,120,255,.3)}",
    ".rbBal{height:.5rem;border-radius:999px;background:rgba(255,255,255,.07);overflow:hidden;margin:.2rem 0 .45rem}.rbBal i{display:block;height:100%;background:linear-gradient(90deg,#7b3fb0,#d58bff);box-shadow:0 0 8px rgba(213,139,255,.45)}",
    ".rbTop{list-style:none;margin:.2rem 0 0;padding:0}.rbTop li{display:flex;justify-content:space-between;gap:.6rem;font-size:.76rem;color:#e6d4ff;padding:.22rem 0;border-bottom:1px solid rgba(200,120,255,.1)}.rbTop li:last-child{border:0}.rbTop b{color:#fff;font-weight:600}",
    ".rbNote{margin:.55rem 0 0;font-size:.62rem;color:#8e7aa8}",
    ".rbTags{display:inline-flex;gap:.25rem;margin-left:.4rem;vertical-align:middle}",
    ".rbTag{font-size:.54rem;letter-spacing:.06em;padding:.05rem .42rem;min-height:0;line-height:1.5;border-radius:999px;border:1px dashed rgba(200,120,255,.3);background:transparent;color:#8e7aa8}",
    ".rbTag.on{border-style:solid;border-color:rgba(200,120,255,.7);color:#f6e6ff;background:rgba(160,90,255,.22);box-shadow:0 0 8px rgba(200,120,255,.35)}"
  ].join("");
  document.head.appendChild(css);
  if(typeof paintLog==="function"&&!paintLog._rb){ var pl=paintLog; paintLog=function(){ var r=pl.apply(this,arguments); setTimeout(function(){ chips(); paintPanel(); },80); return r; }; paintLog._rb=1; }
  if(typeof show==="function"&&!show._rb){ var sh=show; show=function(id){ var r=sh.apply(this,arguments); if(id==="log") setTimeout(mount,160); return r; }; show._rb=1; }
  var mo=window.MutationObserver&&document.getElementById("entries")?new MutationObserver(function(){ clearTimeout(mo.t); mo.t=setTimeout(chips,60); }):null;
  if(mo) mo.observe(document.getElementById("entries"),{childList:true,subtree:false});
  mount();
  window.RR25_RUECKBLICK={stats:stats};
})();
