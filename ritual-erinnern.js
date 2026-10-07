/* ritual-erinnern.js — Build 37: Erinnerungen so gut es ohne Server geht.
   GitHub Pages hat keinen Push-Server: eine echte Push-Nachricht bei geschlossener App ist ohne Backend nicht möglich,
   und es wird bewusst kein fremder Push-Dienst eingebunden.
   1. Kalenderdatei (.ics): Hard-Feintakte und Rückkehr · Anker der nächsten 30 Tage, je mit Alarm 10 Min. vorher.
      Einmal ins Handy-Kalender übernehmen, dann erinnert der Kalender auch bei geschlossener App.
   2. Geplante Nachricht (Notification Triggers / TimestampTrigger), nur wenn der Browser das kann und die Erinnerung
      in «Mehr» eingeschaltet ist. Chrome hat das nur als Test angeboten; im normalen Android-Chrome fehlt es, dann bleibt es aus.
   3. In der App (offen oder im Hintergrund aktiv): ritual-ton.js erinnert an Datei-Fenster, hier zusätzlich an
      gerechnete Fenster nach dem Datenende (gleiche Regel: 10 Min. vorher, nur mit Opt-in). */
(function(){
  if(window.__rr25er) return; window.__rr25er=1;
  var K=window.RR25_KAL, DAY=86400000, MIN=60000, APP=location.origin+location.pathname;
  var TRIG=typeof window.TimestampTrigger==="function"&&typeof Notification!=="undefined"&&"showTrigger" in Notification.prototype;
  function two(n){ return String(n).padStart(2,"0"); }
  function hm(ms){ var d=new Date(ms); return two(d.getHours())+":"+two(d.getMinutes()); }
  function utc(ms){ var d=new Date(ms); return d.getUTCFullYear()+two(d.getUTCMonth()+1)+two(d.getUTCDate())+"T"+two(d.getUTCHours())+two(d.getUTCMinutes())+"00Z"; }
  function esc(s){ return String(s).replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\n/g,"\\n"); }
  function optOn(){ return !!(window.RR25_OPT&&window.RR25_OPT.get("notify"))&&"Notification" in window&&Notification.permission==="granted"; }
  function upcoming(days){
    if(!K) return [];
    var now=Date.now(), end=now+days*DAY, seen={}, out=[];
    [now, now+30*DAY].forEach(function(ref){
      K.list(ref).forEach(function(x){
        if(x.all||x.k!=="HARD"||x.e<=now||x.s>=end) return;
        var id=x.s+"|"+x.t; if(seen[id]) return; seen[id]=1; out.push(x);
      });
    });
    return out.sort(function(a,b){ return a.s-b.s; });
  }
  function ics(){
    var L=upcoming(30), st=utc(Date.now());
    var lines=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//RR25//Hard und Anker//DE","CALSCALE:GREGORIAN","METHOD:PUBLISH","X-WR-CALNAME:RR25 Hard und Anker","X-WR-TIMEZONE:Europe/Zurich"];
    L.forEach(function(x){
      var title=x.anker?"Rückkehr · Anker":x.t.replace(/^HARD · /,"Hard · ");
      lines.push("BEGIN:VEVENT","UID:rr25-"+x.s+"-"+(x.anker?"anker":"hard")+"@rr25","DTSTAMP:"+st,"DTSTART:"+utc(x.s),"DTEND:"+utc(x.e),
        "SUMMARY:"+esc(title),"DESCRIPTION:"+esc(x.t+(x.src==="calc"?" (gerechnet)":"")+" · Nur mit Gate und Rückkehr · Anker."),"URL:"+APP+(x.anker?"#anker":""),
        "BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:"+esc(title+" in 10 Min."),"TRIGGER:-PT10M","END:VALARM","END:VEVENT");
    });
    lines.push("END:VCALENDAR");
    return {text:lines.map(fold).join("\r\n")+"\r\n",n:L.length};
  }
  function fold(l){ var out="", b=0, cur=""; for(var i=0;i<l.length;i++){ var c=l[i], len=unescape(encodeURIComponent(c)).length; if(b+len>73){ out+=cur+"\r\n "; cur=""; b=1; } cur+=c; b+=len; } return out+cur; }
  function say(t){ var s=document.getElementById("erSay"); if(s){ s.textContent=t; s.hidden=!t; } }
  function download(){
    var r=ics(), d=new Date(), name="RR25-Hard-Anker-"+d.getFullYear()+"-"+two(d.getMonth()+1)+"-"+two(d.getDate())+".ics";
    if(!r.n){ say("In den nächsten 30 Tagen keine Hard-Feintakte."); return; }
    var blob=new Blob([r.text],{type:"text/calendar"});
    try{
      var f=new File([blob],name,{type:"text/calendar"});
      if(navigator.canShare&&navigator.canShare({files:[f]})&&navigator.share){
        navigator.share({files:[f],title:name}).then(function(){ say(r.n+" Termine geteilt. Im Kalender übernehmen."); }).catch(function(){ link(blob,name,r.n); });
        return;
      }
    }catch(e){}
    link(blob,name,r.n);
  }
  function link(blob,name,n){
    var a=document.createElement("a"); a.href=URL.createObjectURL(blob); a.download=name; document.body.appendChild(a); a.click();
    setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); },1500);
    say(n+" Termine in "+name+". Datei öffnen und im Kalender übernehmen (Alarm 10 Min. vorher).");
  }
  /* geplante Nachrichten, wo der Browser es kann */
  function schedule(){
    if(!TRIG||!optOn()||!navigator.serviceWorker) return;
    navigator.serviceWorker.getRegistration().then(function(reg){
      if(!reg) return;
      return reg.getNotifications({includeTriggered:true}).then(function(old){ old.forEach(function(n){ if(n.tag&&n.tag.indexOf("rr25t-")===0) n.close(); }); }).catch(function(){}).then(function(){
        upcoming(14).forEach(function(x){
          var at=x.s-10*MIN; if(at<=Date.now()) return;
          var title=x.anker?"22:30 Rückkehr · Anker in 10 Min.":"Hard-Feintakt "+hm(x.s)+" in 10 Min.";
          try{ reg.showNotification(title,{body:x.t+" · "+hm(x.s)+"–"+hm(x.e),tag:"rr25t-"+x.s,icon:"icon.svg",data:{url:APP+(x.anker?"#anker":"")},showTrigger:new window.TimestampTrigger(at)}); }catch(e){}
        });
      });
    }).catch(function(){});
  }
  /* In der App: gerechnete Fenster (Datei-Fenster erinnert ritual-ton.js) */
  var fired={};
  function tick(){
    if(!K||!optOn()) return;
    var now=Date.now();
    K.list(now).forEach(function(x){
      if(x.all||x.k!=="HARD"||x.src!=="calc") return;
      var id=x.s+":"+(x.anker?"a":"h");
      if(now>=x.s-10*MIN&&now<x.s&&!fired[id]){
        fired[id]=1;
        var title=x.anker?"22:30 Rückkehr · Anker in 10 Min.":"Hard-Feintakt "+hm(x.s)+" in 10 Min.", opt={body:x.t+" · gerechnet",tag:"rr25-"+x.s,icon:"icon.svg",data:{url:APP+(x.anker?"#anker":"")}};
        if(navigator.serviceWorker) navigator.serviceWorker.getRegistration().then(function(reg){ if(reg) reg.showNotification(title,opt); else new Notification(title,opt); }).catch(function(){});
      }
    });
  }
  function status(){
    var s=document.getElementById("erInfo"); if(!s) return;
    s.textContent=TRIG?(optOn()?"Geplante Nachrichten aktiv (dieser Browser kann es).":"Dieser Browser kann geplante Nachrichten. Dafür oben die Erinnerung einschalten.")
      :"Bei geschlossener App erinnert nur der Handy-Kalender. Dafür die Kalenderdatei übernehmen.";
  }
  function mount(){
    var sh=document.getElementById("mehrSheet"); if(!sh) return false; if(document.getElementById("erBox")) return true;
    var box=document.createElement("div"); box.id="erBox";
    box.innerHTML='<button type="button" class="btn ghost" id="erIcs">Hard und Anker in den Kalender<small>.ics · nächste 30 Tage · Alarm 10 Min. vorher</small></button><p id="erInfo" class="erL"></p><p id="erSay" class="erL erOk" hidden></p>';
    var sx=document.getElementById("sxBox"); if(sx) sh.insertBefore(box,sx); else sh.appendChild(box);
    box.addEventListener("click",function(e){ e.stopPropagation(); });
    document.getElementById("erIcs").onclick=download;
    var cb=document.getElementById("optNotify"); if(cb) cb.addEventListener("change",function(){ setTimeout(function(){ status(); schedule(); },600); });
    status();
    return true;
  }
  var css=document.createElement("style");
  css.textContent="#erBox{margin:.55rem .1rem 0;padding-top:.5rem;border-top:1px solid rgba(232,160,255,.14)}"+
    "#erIcs{width:100%;min-height:2.6rem!important;height:auto!important;padding:.45rem .7rem!important;display:flex!important;flex-direction:column;align-items:center;justify-content:center;gap:.1rem;font-size:.8rem!important;border-radius:.9rem!important;border:1px solid rgba(232,160,255,.25)!important;background:rgba(160,90,255,.1)!important;color:#f1dcff!important}"+
    "#erIcs small{font-size:.56rem;color:#a996c4;font-weight:400}"+
    "#erBox .erL{margin:.35rem .2rem 0;font-size:.6rem;color:#8e7aa8;line-height:1.35}#erBox .erOk{color:#d9c8f0}";
  document.head.appendChild(css);
  if(!mount()){ var n=0, iv=setInterval(function(){ if(mount()||++n>40) clearInterval(iv); },250); }
  if(K) K.onReady(function(){ schedule(); tick(); });
  setInterval(tick,30000);
  window.RR25_ERINNERN={ics:ics,upcoming:upcoming,triggers:TRIG};
})();
