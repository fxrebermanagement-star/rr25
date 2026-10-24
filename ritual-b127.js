/* ritual-b127.js — Build 127: Geplant mit Datum, Zeit und Erinnerung.
   Jedes vorgemerkte Ritual kann ein Datum (due, ms) und eine Vorwarnung (lead, Min.) tragen. Gruppen: Verpasst, Heute,
   Diese Woche, Später, Ohne Datum. Erinnerung: .ics mit Alarm oder Google-Kalender-Link, Hinweis auf Heute,
   Benachrichtigung nur solange die App offen ist. Speichert nur in rr25_ritual_v1.planned. */
(function(){
  if(window.RR25_B127) return; window.RR25_B127=1;
  var DAY=86400000, WD=["So","Mo","Di","Mi","Do","Fr","Sa"];
  function esc(s){ return String(s==null?"":s).replace(/[&<>"]/g,function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
  function p2(n){ return (n<10?"0":"")+n; }
  function d0(ms){ var d=new Date(ms); d.setHours(0,0,0,0); return d.getTime(); }
  function hm(ms){ var d=new Date(ms); return p2(d.getHours())+":"+p2(d.getMinutes()); }
  function dl(ms){ var d=new Date(ms); return WD[d.getDay()]+" "+d.getDate()+"."+(d.getMonth()+1)+"."; }
  function rel(ms){ var t=d0(Date.now()), x=d0(ms), n=Math.round((x-t)/DAY);
    return n===0?"Heute":n===1?"Morgen":n===-1?"Gestern":n>1&&n<7?WD[new Date(ms).getDay()]+" "+new Date(ms).getDate()+".":dl(ms); }
  function L(){ return typeof load==="function"?load():{log:[],planned:[]}; }
  function S(d){ if(typeof save==="function") save(d); }
  function group(p){
    if(!p.due) return "ohne";
    var now=Date.now(), t=d0(now);
    if(p.due<t||(p.due<now-3*3600000&&d0(p.due)===t&&false)) return "verpasst";
    if(d0(p.due)===t) return "heute";
    if(p.due<t+7*DAY) return "woche";
    return "spaeter";
  }
  var GN={verpasst:"Verpasst",heute:"Heute",woche:"Diese Woche",spaeter:"Später",ohne:"Ohne Datum"};
  var ORD=["verpasst","heute","woche","spaeter","ohne"];
  function ritOf(p){ var RL=(typeof R!=="undefined"&&R)||[]; return RL.filter(function(r){ return r.id===p.id; })[0]; }
  function toneOf(p){ var r=ritOf(p); return r?(r.hard?"hard":(r.tone||"soft")):(String(p.id).indexOf("rz:")===0?"feld":"soft"); }
  function item(p){
    var g=group(p), when=p.due?rel(p.due)+" · "+hm(p.due):"Datum setzen";
    var fenster=p.fenster&&!p.id;
    return '<article class="gpItem gp-'+toneOf(p)+(g==="verpasst"?" gpLate":"")+(g==="heute"?" gpToday":"")+'" data-pid="'+esc(p.pid)+'">'+
      '<div class="gpTop"><div class="gpTx"><b>'+esc(p.titel)+'</b>'+(p.wer?'<span class="gpWer">'+esc(p.wer)+'</span>':'')+'</div>'+
      '<button type="button" class="gpWhen'+(p.due?'':' gpNo')+'" data-pid="'+esc(p.pid)+'" aria-label="Datum und Erinnerung">'+
      '<span class="gpBell">'+(p.due?'🔔':'＋')+'</span>'+esc(when)+'</button></div>'+
      '<div class="gpAct"><button type="button" class="btn primary gpGo" data-pid="'+esc(p.pid)+'">'+(fenster?'Ritual wählen':g==="verpasst"?'Nachholen':'Ausführen')+'</button>'+
      '<button type="button" class="btn ghost gpDone" data-pid="'+esc(p.pid)+'">Erledigt</button>'+
      '<button type="button" class="gpDel" data-pid="'+esc(p.pid)+'" aria-label="Zurückziehen">✕</button></div></article>';
  }
  function paint(){
    var sel=document.getElementById("plR"), RL=(typeof R!=="undefined"&&R)||[];
    if(sel&&sel.options.length!==RL.length){ sel.innerHTML=""; RL.forEach(function(r){ var o=document.createElement("option"); o.value=r.id; o.textContent=r.t; sel.appendChild(o); }); }
    var list=document.getElementById("plList"); if(!list) return;
    var d=L(), P=(d.planned||[]).slice();
    if(!P.length){ list.innerHTML="<p class='sub rrLeer'>Noch nichts vorgemerkt. Wähl oben ein Ritual und ein Datum, dann erinnert dich die App.</p>"; return; }
    P.sort(function(a,b){ return (a.due||9e15)-(b.due||9e15); });
    var out=[];
    ORD.forEach(function(g){ var A=P.filter(function(p){ return group(p)===g; }); if(!A.length) return;
      out.push('<p class="gpGroup gpg-'+g+'">'+GN[g]+' <span>'+A.length+'</span></p>'+A.map(item).join("")); });
    list.innerHTML=out.join("");
    list.querySelectorAll(".gpWhen").forEach(function(b){ b.onclick=function(){ dialog(b.getAttribute("data-pid")); }; });
    list.querySelectorAll(".gpGo").forEach(function(b){ b.onclick=function(){ go(b.getAttribute("data-pid")); }; });
    list.querySelectorAll(".gpDone").forEach(function(b){ b.onclick=function(){ done(b.getAttribute("data-pid")); }; });
    list.querySelectorAll(".gpDel").forEach(function(b){ b.onclick=function(){ if(confirm("Dieses Vormerken löschen?")) del(b.getAttribute("data-pid")); }; });
  }
  function find(pid){ return (L().planned||[]).filter(function(p){ return String(p.pid)===String(pid); })[0]; }
  function del(pid){ var d=L(); d.planned=(d.planned||[]).filter(function(p){ return String(p.pid)!==String(pid); }); S(d); paint(); home(); }
  function go(pid){
    var p=find(pid); if(!p) return;
    if(p.fenster&&!p.id){ var w=document.getElementById("plW"); if(w) w.value=p.titel||""; var s=document.getElementById("plR"); if(s) s.focus(); return; }
    try{ fromPlan=p.pid; }catch(e){}
    if(typeof openR==="function") openR(p.id,p.wer);
  }
  function done(pid){
    var p=find(pid); if(!p) return;
    var d=L(); d.planned=(d.planned||[]).filter(function(x){ return String(x.pid)!==String(pid); }); S(d); paint(); home();
    toast("Erledigt. Danke.");
  }
  function toast(t){ var e=document.createElement("div"); e.className="gpToast"; e.textContent=t; document.body.appendChild(e); setTimeout(function(){ e.remove(); },2200); }
  /* ---- Dialog: Datum, Zeit, Vorwarnung, Kalender ---- */
  function iso(ms){ var d=new Date(ms); return d.getFullYear()+"-"+p2(d.getMonth()+1)+"-"+p2(d.getDate()); }
  function parse(dv,tv){ if(!dv) return null; var a=dv.split("-"), b=(tv||"20:00").split(":"); return new Date(+a[0],+a[1]-1,+a[2],+b[0],+b[1]).getTime(); }
  function dialog(pid){
    var p=find(pid); if(!p) return;
    var due=p.due||(function(){ var x=new Date(); x.setHours(20,0,0,0); if(x<Date.now()) x=new Date(x.getTime()+DAY); return x.getTime(); })();
    var lead=p.lead!=null?p.lead:15;
    var bg=document.createElement("div"); bg.className="gpDlgBg";
    bg.innerHTML='<div class="gpDlg" role="dialog" aria-label="Datum und Erinnerung"><p class="gpDlgK">Datum und Erinnerung</p><h3>'+esc(p.titel)+(p.wer?' <small>· '+esc(p.wer)+'</small>':'')+'</h3>'+
      '<div class="gpQuick"><button type="button" data-q="0">Heute</button><button type="button" data-q="1">Morgen</button><button type="button" data-q="vm">Vollmond</button><button type="button" data-q="7">In 1 Woche</button></div>'+
      '<div id="gpFen" class="gpFen"></div>'+
      '<label class="gpF"><span>Datum</span><input type="date" id="gpD" value="'+iso(due)+'"></label>'+
      '<label class="gpF"><span>Zeit</span><input type="time" id="gpT" value="'+hm(due)+'"></label>'+
      '<label class="gpF"><span>Erinnern</span><select id="gpL">'+[[0,"zur Zeit"],[10,"10 Min. vorher"],[15,"15 Min. vorher"],[30,"30 Min. vorher"],[60,"1 Std. vorher"],[1440,"1 Tag vorher"]].map(function(o){ return '<option value="'+o[0]+'"'+(o[0]===lead?' selected':'')+'>'+o[1]+'</option>'; }).join("")+'</select></label>'+
      '<p class="gpHint" id="gpHint"></p>'+
      '<div class="gpCal"><button type="button" class="btn ghost" id="gpIcs">In Handy-Kalender (.ics)</button><button type="button" class="btn ghost" id="gpGc">Google Kalender</button></div>'+
      '<p class="gpSmall">Der Handy-Kalender erinnert auch bei geschlossener App. Solange die App offen ist, meldet sie sich selbst.</p>'+
      '<div class="gpBtns">'+(p.due?'<button type="button" class="btn ghost" id="gpClr">Datum entfernen</button>':'')+'<button type="button" class="btn ghost" id="gpX">Abbrechen</button><button type="button" class="btn primary" id="gpOk">Speichern</button></div></div>';
    document.body.appendChild(bg);
    var $=function(id){ return bg.querySelector("#"+id); };
    function hint(){ var t=parse($("gpD").value,$("gpT").value); if(!t){ $("gpHint").textContent=""; return; }
      var r0=rel(t), s=(r0===dl(t)?r0:r0+", "+dl(t))+" um "+hm(t)+" Uhr";
      try{ var M=window.RR25_MOND; if(M){ var m=M.day(t); s+=" · "+m.name; } var K=window.RR25_KAL; if(K){ var st=K.state(t); var k=st&&(st.tone||st.kind); if(k) s+=" · "+({SOFT:"Soft",HARD:"Hard",ECHO:"Echo",STILL:"Still"}[k]||k); } }catch(e){}
      $("gpHint").textContent=s; }
    hint(); $("gpD").oninput=hint;
    try{ if(window.RR25_FENSTER) window.RR25_FENSTER.fill($("gpFen"),p,function(t){ $("gpD").value=iso(t); $("gpT").value=hm(t); if(+$("gpL").value===0) $("gpL").value="15"; hint(); }); }catch(e){} $("gpT").oninput=hint;
    bg.querySelectorAll("[data-q]").forEach(function(b){ b.onclick=function(){ var q=b.getAttribute("data-q"), t;
      if(q==="vm"){ var M=window.RR25_MOND; t=M?M.next(2,Date.now()):null; if(!t) return; }
      else t=Date.now()+(+q)*DAY;
      $("gpD").value=iso(t); hint(); }; });
    function close(){ bg.remove(); }
    function cur(){ return {due:parse($("gpD").value,$("gpT").value),lead:+$("gpL").value}; }
    bg.onclick=function(e){ if(e.target===bg) close(); };
    $("gpX").onclick=close;
    if($("gpClr")) $("gpClr").onclick=function(){ upd(pid,{due:null,lead:null}); close(); };
    $("gpOk").onclick=function(){ var c=cur(); if(!c.due) return; upd(pid,c); close(); askNotify(); toast("Gespeichert · "+rel(c.due)+" "+hm(c.due)); };
    $("gpIcs").onclick=function(){ var c=cur(); if(!c.due) return; upd(pid,c); ics(find(pid)); };
    $("gpGc").onclick=function(){ var c=cur(); if(!c.due) return; upd(pid,c); var q=find(pid); window.open(gcal(q),"_blank","noopener"); };
  }
  function upd(pid,o){ var d=L(); (d.planned||[]).forEach(function(p){ if(String(p.pid)===String(pid)){ p.due=o.due||undefined; p.lead=o.lead==null?undefined:o.lead; delete p.notified; } }); S(d); paint(); home(); arm(); }
  function utc(ms){ var d=new Date(ms); return d.getUTCFullYear()+p2(d.getUTCMonth()+1)+p2(d.getUTCDate())+"T"+p2(d.getUTCHours())+p2(d.getUTCMinutes())+"00Z"; }
  var APP="https://fxrebermanagement-star.github.io/rr25/";
  function txt(p){ return (p.titel||"Ritual")+(p.wer?" · "+p.wer:""); }
  function ics(p){
    if(!p||!p.due) return;
    var lead=p.lead||0, s=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//rr25//Geplant//DE","BEGIN:VEVENT","UID:rr25-plan-"+p.pid+"@rr25","DTSTAMP:"+utc(Date.now()),
      "DTSTART:"+utc(p.due),"DTEND:"+utc(p.due+30*60000),"SUMMARY:"+txt(p).replace(/[,;]/g," "),"DESCRIPTION:Geplant in RR25. Öffnen: "+APP,"URL:"+APP,
      "BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:"+txt(p).replace(/[,;]/g," "),"TRIGGER:-PT"+lead+"M","END:VALARM","END:VEVENT","END:VCALENDAR"].join("\r\n");
    var a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([s],{type:"text/calendar"})); a.download="rr25-"+String(p.titel||"ritual").toLowerCase().replace(/[^a-z0-9]+/g,"-")+".ics";
    document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); },1500);
  }
  function gcal(p){ return "https://calendar.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(txt(p))+"&dates="+utc(p.due)+"/"+utc(p.due+30*60000)+"&details="+encodeURIComponent("Geplant in RR25: "+APP); }
  /* ---- Benachrichtigung, solange die App offen ist ---- */
  function askNotify(){ try{ if(window.Notification&&Notification.permission==="default") Notification.requestPermission(); }catch(e){} }
  var timers=[];
  function arm(){
    timers.forEach(clearTimeout); timers=[];
    var now=Date.now();
    (L().planned||[]).forEach(function(p){ if(!p.due||p.notified) return; var at=p.due-(p.lead||0)*60000, w=at-now;
      if(w>-60000&&w<12*3600000) timers.push(setTimeout(function(){ fire(p); },Math.max(0,w))); });
  }
  function fire(p){
    var d=L(); (d.planned||[]).forEach(function(x){ if(x.pid===p.pid) x.notified=1; }); S(d);
    try{ if(window.Notification&&Notification.permission==="granted"){ var n=new Notification("Geplant: "+txt(p),{body:rel(p.due)+" um "+hm(p.due)+" Uhr. Antippen zum Öffnen.",icon:"icon.svg",tag:"rr25-plan-"+p.pid}); n.onclick=function(){ window.focus(); if(typeof show==="function") show("geplant"); n.close(); }; } }catch(e){}
    home();
  }
  /* ---- Hinweis auf Heute ---- */
  function home(){
    var host=document.getElementById("home"); if(!host) return;
    var el=document.getElementById("gpHeute");
    var t=d0(Date.now()), P=(L().planned||[]).filter(function(p){ return p.due&&p.due<t+DAY&&p.due>=t-2*DAY; }).sort(function(a,b){ return a.due-b.due; });
    if(!P.length){ if(el) el.remove(); return; }
    if(!el){ el=document.createElement("div"); el.id="gpHeute"; }
    var ref=document.getElementById("kasten"); if(ref&&ref.parentNode===host&&el.nextElementSibling!==ref) host.insertBefore(el,ref); else if(!ref&&el.parentNode!==host) host.appendChild(el);
    var p=P[0], late=p.due<t;
    el.innerHTML='<span class="gphI">🔔</span><span class="gphT"><b>'+(late?'Verpasst':'Heute geplant')+'</b> '+esc(txt(p))+' · '+(late?rel(p.due)+' ':'')+hm(p.due)+(P.length>1?' <small>· und '+(P.length-1)+' weitere</small>':'')+'</span>'+
      '<button type="button" class="gphGo">'+(late?'Nachholen':'Ausführen')+'</button>';
    el.querySelector(".gphGo").onclick=function(){ go(p.pid); };
    el.querySelector(".gphT").onclick=function(){ if(typeof show==="function") show("geplant"); };
  }
  /* ---- Formular: Datum und Zeit beim Vormerken ---- */
  function form(){
    var add=document.getElementById("plAdd"); if(!add||document.getElementById("plD")) return;
    var row=document.createElement("div"); row.className="gpForm";
    var x=new Date(); x.setHours(20,0,0,0); if(x<Date.now()) x=new Date(x.getTime()+DAY);
    row.innerHTML='<label class="gpF"><span>Datum</span><input type="date" id="plD" value="'+iso(x.getTime())+'"></label><label class="gpF"><span>Zeit</span><input type="time" id="plTm" value="20:00"></label>';
    add.parentNode.parentNode.insertBefore(row,add.parentNode);
    add.textContent="Vormerken mit Erinnerung";
    add.onclick=function(){
      var RL=(typeof R!=="undefined"&&R)||[], r=RL.filter(function(z){ return z.id===document.getElementById("plR").value; })[0]; if(!r) return;
      var d=L(); d.planned=d.planned||[];
      var due=parse(document.getElementById("plD").value,document.getElementById("plTm").value);
      d.planned.unshift({pid:(typeof uid==="function"?uid():Date.now().toString(36)),id:r.id,titel:r.t,wer:(document.getElementById("plW").value||"").trim(),t:(typeof now==="function"?now():""),due:due||undefined,lead:due?15:undefined});
      S(d); document.getElementById("plW").value=""; paint(); home(); arm(); askNotify(); if(due) toast("Vorgemerkt · "+rel(due)+" "+hm(due));
    };
  }
  var css=document.createElement("style");
  css.textContent=[
    ".gpForm{display:grid;grid-template-columns:1fr 1fr;gap:.5rem;margin:.5rem 0 .2rem}",
    ".gpF{display:flex;flex-direction:column;gap:.2rem;font-size:.72rem;color:#c9b3ee;letter-spacing:.06em}",
    ".gpF input,.gpF select{width:100%;box-sizing:border-box;padding:.6rem .7rem;border-radius:12px;border:1px solid rgba(190,140,255,.35);background:rgba(25,10,45,.7);color:#f3e8ff;font:inherit;font-size:.95rem;color-scheme:dark}",
    ".gpGroup{margin:1rem .2rem .45rem;font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:#cdb6ff}",
    ".gpGroup span{display:inline-block;margin-left:.35rem;padding:0 .45rem;border-radius:9px;background:rgba(190,140,255,.18);color:#efe3ff;letter-spacing:0}",
    ".gpg-verpasst{color:#ffb3a8}.gpg-heute{color:#ff9fe6}",
    ".gpItem{margin:0 0 .6rem;padding:.75rem .8rem .7rem;border-radius:18px;border:1px solid rgba(190,140,255,.28);border-left:3px solid #7dffb0;background:linear-gradient(140deg,rgba(70,30,120,.38),rgba(25,10,45,.55));box-shadow:0 0 16px rgba(170,100,255,.12)}",
    ".gpItem.gp-hard{border-left-color:#ff6b6b}.gpItem.gp-grenze{border-left-color:#ffb86b}.gpItem.gp-feld{border-left-color:#b49bff}",
    ".gpItem.gpToday{border-color:rgba(255,140,230,.55);box-shadow:0 0 22px rgba(255,110,220,.22)}",
    ".gpItem.gpLate{opacity:.9;border-color:rgba(255,150,140,.4)}",
    ".gpTop{display:flex;align-items:flex-start;justify-content:space-between;gap:.6rem}",
    ".gpTx{min-width:0}.gpTx b{display:block;font-size:1.02rem;color:#fff}.gpWer{display:block;color:#c9b3ee;font-size:.8rem;margin-top:.1rem}",
    ".gpWhen{flex:0 0 auto;display:flex;align-items:center;gap:.3rem;padding:.35rem .6rem;border-radius:999px;border:1px solid rgba(255,150,230,.45);background:rgba(255,110,220,.1);color:#ffd9f4;font-size:.8rem;white-space:nowrap}",
    ".gpWhen.gpNo{border-style:dashed;border-color:rgba(190,140,255,.5);background:transparent;color:#cdb6ff}",
    ".gpBell{font-size:.85rem}",
    ".gpAct{display:flex;gap:.45rem;margin-top:.6rem;align-items:center}",
    ".gpAct .btn{flex:1;min-height:2.4rem;padding:.4rem .6rem;font-size:.88rem}",
    ".gpAct .gpDone{flex:0 0 auto;padding:.4rem .8rem}",
    ".gpDel{flex:0 0 2.4rem;height:2.4rem;border-radius:50%;border:1px solid rgba(190,140,255,.3);background:transparent;color:#bfa6e6;font-size:.9rem}",
    ".gpDlgBg{position:fixed;inset:0;z-index:9000;background:rgba(8,3,18,.72);backdrop-filter:blur(4px);display:flex;align-items:flex-end;justify-content:center}",
    ".gpDlg{width:100%;max-width:520px;box-sizing:border-box;padding:1.1rem 1rem 1.3rem;border-radius:22px 22px 0 0;border:1px solid rgba(214,170,255,.4);background:linear-gradient(160deg,#2a1148,#140824);box-shadow:0 -10px 40px rgba(170,90,255,.3);color:#f3e8ff}",
    ".gpDlg h3{margin:.1rem 0 .7rem;font-size:1.15rem}.gpDlg h3 small{color:#c9b3ee;font-weight:400}",
    ".gpDlgK{margin:0;font-size:.7rem;letter-spacing:.18em;text-transform:uppercase;color:#ff9fe6}",
    ".gpDlg .gpF{margin:.45rem 0}",
    ".gpQuick{display:flex;flex-wrap:wrap;gap:.4rem;margin-bottom:.3rem}",
    ".gpQuick button{padding:.35rem .7rem;border-radius:999px;border:1px solid rgba(190,140,255,.45);background:rgba(120,60,200,.18);color:#efe3ff;font-size:.82rem}",
    ".gpHint{min-height:1.1rem;margin:.4rem 0 .6rem;color:#ffd9f4;font-size:.85rem}",
    ".gpCal{display:grid;grid-template-columns:1fr 1fr;gap:.45rem}.gpCal .btn{font-size:.82rem;min-height:2.4rem}",
    ".gpSmall{margin:.5rem 0 .8rem;color:#a995cc;font-size:.74rem}",
    ".gpBtns{display:flex;gap:.45rem;flex-wrap:wrap}.gpBtns .btn{flex:1}",
    "#gpHeute{display:flex;align-items:center;gap:.6rem;margin:.2rem 0 .6rem;padding:.6rem .7rem;border-radius:16px;border:1px solid rgba(255,140,230,.5);background:linear-gradient(135deg,rgba(255,90,210,.16),rgba(120,60,200,.2));box-shadow:0 0 18px rgba(255,110,220,.2)}",
    ".gphI{font-size:1.2rem}.gphT{flex:1;min-width:0;color:#f3e8ff;font-size:.88rem}.gphT b{color:#ff9fe6;margin-right:.25rem}.gphT small{color:#c9b3ee}",
    ".gphGo{flex:0 0 auto;padding:.45rem .8rem;border-radius:999px;border:0;background:linear-gradient(90deg,#ff5fd2,#a98bff);color:#1a0b2e;font-weight:600;font-size:.84rem}",
    ".gpToast{position:fixed;left:50%;bottom:6.5rem;transform:translateX(-50%);z-index:9500;padding:.55rem 1rem;border-radius:999px;background:rgba(40,15,70,.95);border:1px solid rgba(214,170,255,.5);color:#f3e8ff;font-size:.88rem;box-shadow:0 0 18px rgba(190,110,255,.35)}"
  ].join("");
  document.head.appendChild(css);
  try{ paintPlan=paint; }catch(e){ window.paintPlan=paint; }
  if(typeof show==="function"&&!show._b127){ var sh=show; show=function(id){ var r=sh.apply(this,arguments); if(id==="geplant") setTimeout(paint,60); if(id==="home") home(); return r; }; show._b127=1; }
  form(); paint(); home(); arm();
  setInterval(function(){ home(); },5*60000);
  document.addEventListener("visibilitychange",function(){ if(!document.hidden){ home(); arm(); } });
  window.RR25_PLAN={paint:paint,dialog:dialog,ics:ics,gcal:gcal};
})();
