/* ritual-b81.js — Build 81: Feld-Wetter-Wochenleiste im Kalender-Tab (7 Tage ab heute).
   Pro Tag: Wochentag, Ton (Soft/Hard/Grenze/Echo/Still aus RR25_KAL), Mondphase (RR25_MOND), Planetenfarbe des Wochentags.
   Tipp auf einen Tag zeigt Details darunter. Reine Anzeige, speichert nichts. */
(function(){
  if(window.__rr25b81) return; window.__rr25b81=1;
  var K=window.RR25_KAL, M=window.RR25_MOND; if(!K) return;
  var DN=["So","Mo","Di","Mi","Do","Fr","Sa"], DL=["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];
  var PL=[["Sonne","255,200,87"],["Mond","170,196,255"],["Mars","255,90,74"],["Merkur","79,214,224"],["Jupiter","143,123,255"],["Venus","255,122,217"],["Saturn","154,160,181"]];
  var SEL=0;
  function h(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function two(n){ return String(n).padStart(2,"0"); }
  function addDays(ms,n){ var d=new Date(ms); return new Date(d.getFullYear(),d.getMonth(),d.getDate()+n).getTime(); }
  function tstr(ms){ var d=new Date(ms); return two(d.getHours())+":"+two(d.getMinutes()); }
  function info(d0){
    var noon=d0+12*3600000, p=K.dayParts(noon), kind=p.kind, ton, hardFenster=false;
    p.items.forEach(function(x){ if(!x.all&&x.k==="HARD") hardFenster=true; });
    if(kind==="HARD") ton="Hard";
    else if(hardFenster) ton="Grenze";
    else ton={SOFT:"Soft",ECHO:"Echo",STILL:"Still"}[kind]||"Soft";
    var m=M?M.day(noon):null, wd=new Date(d0).getDay();
    return {d0:d0,wd:wd,ton:ton,p:p,moon:m,pl:PL[wd]};
  }
  function details(i){
    var d=new Date(i.d0), t=i.p.items.filter(function(x){ return !x.all; }).slice(0,3), a=i.p.items.filter(function(x){ return x.all&&!x.band&&x.k!=="SOFT"; }).slice(0,2);
    var rows=[];
    rows.push('<div class="wlH"><b>'+DL[i.wd]+' '+d.getDate()+'.'+(d.getMonth()+1)+'.</b><span class="wlT t'+i.ton+'">'+i.ton+'</span></div>');
    rows.push('<p class="wlP">Tag des Planeten <span style="color:rgb('+i.pl[1]+');font-weight:600">'+i.pl[0]+'</span>'+(i.moon?' · '+h(i.moon.name)+' '+h(i.moon.sym):'')+'</p>');
    var lines=a.concat(t).map(function(x){ return '<li><span>'+(x.all?"Tag":tstr(x.s)+"–"+tstr(x.e))+'</span>'+h(x.t||x.title||x.k)+'</li>'; });
    if(lines.length) rows.push('<ul class="wlL">'+lines.join("")+'</ul>');
    else rows.push('<p class="wlN">Nichts Besonderes eingetragen. Ein ruhiger Tag.</p>');
    return rows.join("");
  }
  function paint(){
    var sec=document.getElementById("kal"), list=document.getElementById("kalList"); if(!sec||!list) return;
    var box=document.getElementById("wkLeiste");
    if(!box){ box=document.createElement("div"); box.id="wkLeiste"; box.className="card"; sec.insertBefore(box,list); }
    var t0=new Date(); t0=new Date(t0.getFullYear(),t0.getMonth(),t0.getDate()).getTime();
    var days=[]; for(var n=0;n<7;n++) days.push(info(addDays(t0,n)));
    if(SEL>6) SEL=0;
    box.innerHTML='<p class="wlK">Feld-Wetter · 7 Tage</p><div class="wlRow" role="tablist">'+days.map(function(x,n){
      return '<button type="button" class="wlD'+(n===SEL?' on':'')+'" data-n="'+n+'" style="--pc:'+x.pl[1]+'" aria-label="'+DL[x.wd]+', '+x.ton+'" aria-pressed="'+(n===SEL)+'">'+
        '<span class="wlW">'+(n===0?'Heute':DN[x.wd])+'</span><span class="wlM">'+(x.moon?h(x.moon.sym):'')+'</span><span class="wlB t'+x.ton+'">'+x.ton+'</span><i></i></button>';
    }).join("")+'</div><div class="wlDet">'+details(days[SEL])+'</div>';
    [].slice.call(box.querySelectorAll(".wlD")).forEach(function(b){ b.onclick=function(){ SEL=+b.getAttribute("data-n"); paint(); }; });
  }
  function go(){ try{ paint(); }catch(e){} }
  if(typeof show==="function"&&!show._b81){ var sh=show; show=function(id){ var r=sh.apply(this,arguments); if(id==="kal"){ SEL=0; setTimeout(go,120); } return r; }; show._b81=1; }
  if(K.onReady) K.onReady(function(){ setTimeout(go,50); });
  setTimeout(go,600);
  var css=document.createElement("style");
  css.textContent=[
    "#wkLeiste{margin:0 0 .7rem;padding:.65rem .6rem .6rem;background:linear-gradient(180deg,rgba(40,18,62,.7),rgba(14,8,24,.9))!important;border:1px solid rgba(200,120,255,.22)!important;border-radius:1.1rem!important}",
    ".wlK{margin:0 0 .45rem .2rem;font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:#d6a6ff}",
    ".wlRow{display:grid;grid-template-columns:repeat(7,1fr);gap:.28rem}",
    ".wlD{position:relative;display:flex;flex-direction:column;align-items:center;gap:.18rem;padding:.4rem .1rem .5rem;min-height:0;border-radius:.8rem;border:1px solid rgba(var(--pc),.28);background:rgba(var(--pc),.06);color:#e6d4ff}",
    ".wlD.on{border-color:rgba(var(--pc),.75);background:rgba(var(--pc),.14);box-shadow:0 0 12px rgba(var(--pc),.28)}",
    ".wlD i{position:absolute;left:30%;right:30%;bottom:.22rem;height:2px;border-radius:2px;background:rgb(var(--pc));opacity:.7}",
    ".wlW{font-size:.62rem;letter-spacing:.04em;color:#cdbbe8}.wlM{font-size:1.05rem;line-height:1.2}",
    ".wlB{font-size:.54rem;padding:.04rem .3rem;border-radius:999px;border:1px solid;line-height:1.4}",
    ".tSoft{color:#5fe0a0;border-color:rgba(95,224,160,.45)}.tHard{color:#ff7a8e;border-color:rgba(255,84,112,.55)}.tGrenze{color:#ffb86b;border-color:rgba(255,184,107,.5)}.tEcho,.tStill{color:#e6d4ff;border-color:rgba(200,120,255,.5)}",
    ".wlDet{margin:.6rem .2rem 0;padding-top:.5rem;border-top:1px solid rgba(200,120,255,.14)}",
    ".wlH{display:flex;justify-content:space-between;align-items:center}.wlH b{font-family:Georgia,serif;font-weight:400;font-size:.98rem;color:#f1e1ff}.wlT{font-size:.68rem;padding:.08rem .6rem;border-radius:999px;border:1px solid}",
    ".wlP{margin:.3rem 0 .2rem;font-size:.74rem;color:#cdbbe8}.wlN{margin:.3rem 0 0;font-size:.74rem;color:#8e7aa8}",
    ".wlL{list-style:none;margin:.2rem 0 0;padding:0}.wlL li{font-size:.74rem;color:#e6d4ff;padding:.16rem 0}.wlL li span{display:inline-block;min-width:4.6rem;color:#a994c4;font-size:.66rem}"
  ].join("");
  document.head.appendChild(css);
})();
