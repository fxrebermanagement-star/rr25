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
