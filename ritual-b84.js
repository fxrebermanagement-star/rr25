/* ritual-b84.js — Build 84: Mond-Rückblick in der Chronik.
   Eine Seite pro Mondzyklus (Neumond bis Neumond, Berner Zeit aus RR25_MOND) mit Ritualen und Einträgen der Chronik, blätterbar.
   Zählt Rituale mit RR25_ZAEHLREGEL.isRitual. Nur lesen, keine neuen Schlüssel. Kein Streak, kein Vergleich. */
(function(){
  if(window.__rr25b84) return; window.__rr25b84=1;
  var TZ="Europe/Zurich", OPEN=false, OFF=0;
  var DAY=86400000;
  function js(k,d){ try{ var v=JSON.parse(localStorage.getItem(k)||"null"); return v==null?d:v; }catch(e){ return d; } }
  function h(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function when(e){
    var s=String(e&&e.t||""), m=s.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})(?:,?\s*(\d{1,2}):(\d{2}))?/);
    if(m) return new Date(+m[3],+m[2]-1,+m[1],+(m[4]||12),+(m[5]||0)).getTime();
    var p=Date.parse(s); return isNaN(p)?null:p;
  }
  function rows(){ try{ return (typeof load==="function"?load().log:js("rr25_ritual_v1",{}).log)||[]; }catch(e){ return []; } }
  function fd(ms){ try{ return new Intl.DateTimeFormat("de-CH",{timeZone:TZ,day:"numeric",month:"numeric"}).format(new Date(ms)); }catch(e){ return ""; } }
  function fdw(ms){ try{ return new Intl.DateTimeFormat("de-CH",{timeZone:TZ,weekday:"short",day:"numeric",month:"numeric"}).format(new Date(ms)).replace(",",""); }catch(e){ return ""; } }
  function fdt(ms){ try{ return new Intl.DateTimeFormat("de-CH",{timeZone:TZ,weekday:"short",day:"numeric",month:"numeric",hour:"2-digit",minute:"2-digit"}).format(new Date(ms)).replace(",",""); }catch(e){ return ""; } }
  /* Zyklus Nummer k: 0 = laufender, -1 = voriger ... */
  function zyklus(k){
    var M=window.RR25_MOND; if(!M) return null;
    var now=Date.now(), start=M.prev(0,now), end=M.next(0,now); if(start==null||end==null) return null;
    for(var i=0;i<-k;i++){ end=start; start=M.prev(0,start-1); if(start==null) return null; }
    var full=null; M.events(start,end).forEach(function(e){ if(e.q===2) full=e.t; });
    return {s:start,e:end,full:full,now:now>=start&&now<end};
  }
  function earliest(){ var m=Infinity; rows().forEach(function(e){ var t=when(e); if(t!=null&&t<m) m=t; }); return m; }
  function tone(e){ var t=window.RR25_TONE?window.RR25_TONE(e):"soft"; return t; }
  function stats(z){
    var R=window.RR25_ZAEHLREGEL, items=[], rit=0, by={}, ton={soft:0,hard:0};
    rows().forEach(function(e){
      var t=when(e); if(t==null||t<z.s||t>=z.e) return;
      var ti=String(e.titel||"").trim(), isR=R&&R.isRitual(e);
      items.push({t:t,ti:ti,note:String(e.note||e.wer||"").trim(),r:!!isR});
      if(isR){ rit++; by[ti]=(by[ti]||0)+1; var tn=tone(e); if(tn==="hard") ton.hard++; else if(tn==="soft") ton.soft++; }
    });
    items.sort(function(a,b){ return a.t-b.t; });
    var top=Object.keys(by).sort(function(a,b){ return by[b]-by[a]||a.localeCompare(b); }).slice(0,4).map(function(k){ return k+(by[k]>1?" ×"+by[k]:""); });
    return {items:items,rit:rit,top:top,ton:ton};
  }
  function panel(){
    var z=zyklus(OFF); if(!z) return '<p class="mzSay">Mondzeiten sind noch nicht geladen.</p>';
    var S=stats(z), first=earliest(), hasOlder=isFinite(first)&&first<z.s;
    var say=S.items.length?S.rit+(S.rit===1?" Ritual":" Rituale")+(S.items.length>S.rit?" und "+(S.items.length-S.rit===1?"1 weiterer Eintrag":(S.items.length-S.rit)+" weitere Einträge"):"")+" in diesem Zyklus.":(z.now?"In diesem Zyklus noch nichts in der Chronik.":"In diesem Zyklus nichts eingetragen. Auch das ist ein Zyklus.");
    var vm=z.full?'<li class="mzV"><span></span><b>Vollmond · '+h(fdt(z.full))+'</b></li>':'';
    var inserted=false, list=S.items.map(function(x){
      var pre=''; if(!inserted&&z.full&&x.t>z.full){ pre=vm; inserted=true; }
      return pre+'<li class="'+(x.r?"mzR":"")+'"><span>'+h(fdw(x.t))+'</span><b>'+h(x.ti)+'</b>'+(x.note&&x.note!==x.ti?'<small>'+h(x.note.slice(0,90))+'</small>':'')+'</li>';
    });
    if(!inserted&&z.full) list.push(vm);
    return '<div class="mzHead"><button type="button" class="rbNav" data-d="-1" aria-label="Voriger Zyklus"'+(hasOlder?'':' disabled')+'>‹</button><div><b>'+h(fd(z.s))+' – '+h(fd(z.e))+'</b><small>'+(z.now?'laufender Zyklus':'Neumond bis Neumond')+'</small></div><button type="button" class="rbNav" data-d="1" aria-label="Nächster Zyklus"'+(OFF>=0?' disabled':'')+'>›</button></div>'+
      '<p class="mzSay">'+h(say)+'</p>'+
      (S.rit?'<div class="rbPills"><span class="rbP on">Soft <b>'+S.ton.soft+'</b></span><span class="rbP on">Hard <b>'+S.ton.hard+'</b></span></div>':'')+
      (S.top.length?'<p class="mzTop">'+h(S.top.join(" · "))+'</p>':'')+
      (list.length?'<ul class="mzL">'+list.join("")+'</ul>':'')+
      '<p class="rbNote">Neumond bis Neumond, Berner Zeit.</p>';
  }
  function paint(){
    var p=document.getElementById("mzPanel"); if(!p) return;
    p.hidden=!OPEN; if(!OPEN) return;
    p.innerHTML=panel();
    [].slice.call(p.querySelectorAll(".rbNav")).forEach(function(b){ b.onclick=function(){ OFF+=+b.getAttribute("data-d"); if(OFF>0) OFF=0; paint(); }; });
  }
  function mount(){
    var sec=document.getElementById("log"), ent=document.getElementById("entries"); if(!sec||!ent||document.getElementById("mzBtn")) return;
    var bar=document.getElementById("rbBar"); if(!bar){ bar=document.createElement("div"); bar.id="rbBar"; sec.insertBefore(bar,ent); }
    var btn=document.createElement("button"); btn.type="button"; btn.className="btn ghost"; btn.id="mzBtn"; btn.textContent="Mondzyklus";
    bar.insertBefore(btn,bar.firstChild);
    var p=document.createElement("div"); p.id="mzPanel"; p.className="card"; p.hidden=true;
    var ref=document.getElementById("abPanel")||document.getElementById("rbPanel"); sec.insertBefore(p,ref&&ref.nextSibling?ref.nextSibling:ent);
    btn.onclick=function(){ OPEN=!OPEN; btn.classList.toggle("on",OPEN); btn.textContent=OPEN?"Zyklus zu":"Mondzyklus"; paint(); };
  }
  if(typeof show==="function"&&!show._b84){ var sh=show; show=function(id){ var r=sh.apply(this,arguments); if(id==="log") setTimeout(mount,600); return r; }; show._b84=1; }
  if(typeof paintLog==="function"&&!paintLog._b84){ var pl=paintLog; paintLog=function(){ var r=pl.apply(this,arguments); setTimeout(paint,140); return r; }; paintLog._b84=1; }
  setTimeout(mount,700);
  var css=document.createElement("style");
  css.textContent=[
    "#rbBar{flex-wrap:wrap}",
    "#mzBtn{min-height:2.1rem!important;padding:.35rem 1rem!important;font-size:.76rem!important;border-radius:999px!important;border:1px solid rgba(200,120,255,.35)!important;background:rgba(160,90,255,.1)!important;color:#e4ecff!important}#mzBtn.on{box-shadow:0 0 14px rgba(200,120,255,.35)}",
    "#mzPanel{margin:0 0 .8rem;padding:.75rem .8rem .7rem;background:linear-gradient(180deg,rgba(40,18,62,.78),rgba(14,8,24,.92))!important;border:1px solid rgba(200,120,255,.22)!important;border-radius:1.1rem!important}#mzPanel[hidden]{display:none!important}",
    ".mzHead{display:flex;align-items:center;justify-content:space-between;text-align:center}.mzHead b{display:block;font-family:Georgia,serif;font-weight:400;font-size:1.02rem;color:#e4ecff}.mzHead small{font-size:.62rem;letter-spacing:.12em;color:#a994c4}",
    ".mzSay{margin:.5rem 0 .4rem;font-size:.8rem;color:#e6d4ff;line-height:1.4}.mzTop{margin:.5rem 0 0;font-size:.74rem;color:#cdbbe8}",
    ".mzL{list-style:none;margin:.6rem 0 0;padding:0}.mzL li{display:grid;grid-template-columns:4.3rem 1fr;gap:.1rem .5rem;padding:.35rem 0;border-top:1px solid rgba(200,120,255,.1);font-size:.8rem;color:#cdbbe8}.mzL li span{color:#a994c4;font-size:.66rem;padding-top:.15rem}.mzL li b{font-weight:500}.mzL li.mzR b{color:#f1e1ff}.mzL li small{grid-column:2;font-size:.68rem;color:#8e7aa8;line-height:1.35}",
    ".mzL li.mzV b{color:#d6a6ff;font-size:.72rem;letter-spacing:.04em}"
  ].join("");
  document.head.appendChild(css);
})();
