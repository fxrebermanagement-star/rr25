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
  var chip=document.getElementById("toneChip"), link=document.getElementById("toneAnker");
  if(chip) chip.onclick=function(){ if(typeof show==="function") show("kal"); };
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
