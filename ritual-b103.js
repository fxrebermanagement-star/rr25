/* ritual-b103.js — Build 103: Feld-Wetter-Zeile auf der Heute-Seite (7 Tage, schlank).
   Pro Tag ein kleiner Chip: Wochentag und Mondbild (wie in der Kalenderleiste, RR25_MOND), Tonfarbe als Ring und Unterstrich (Soft/Grenze/Hard/Echo/Still), heute hervorgehoben.
   Daten aus RR25_FELDWETTER (ritual-b81.js). Tipp öffnet den Kalender-Tab mit diesem Tag. Reine Anzeige, speichert nichts. */
(function(){
  if(window.__rr25b103) return; window.__rr25b103=1;
  var COL={Soft:"95,224,160",Hard:"255,84,112",Grenze:"255,184,107",Echo:"200,150,255",Still:"200,150,255"};
  function h(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function paint(){
    var W=window.RR25_FELDWETTER, K=window.RR25_KAL, tr=document.getElementById("toneRow"); if(!W||!K||!tr) return;
    var box=document.getElementById("wkHome");
    if(!box){ box=document.createElement("div"); box.id="wkHome"; box.setAttribute("role","group"); box.setAttribute("aria-label","Feld-Wetter, 7 Tage"); }
    /* Platz: vor Sicherungskarte bzw. Mondzeile, also unter Ton-Zeile und Anker-Hinweis; andere Skripte ordnen die Kinder von #home um */
    var ref=document.getElementById("bakCard")||document.getElementById("mondSag");
    if(ref&&ref.parentNode===tr.parentNode){ if(box.nextElementSibling!==ref) ref.parentNode.insertBefore(box,ref); }
    else if(box.previousElementSibling!==tr&&!box.parentNode.contains(box.previousElementSibling&&box.previousElementSibling.id==="ankerHintCard"?box:null)) tr.parentNode.insertBefore(box,tr.nextSibling);
    var t0=new Date(); t0=new Date(t0.getFullYear(),t0.getMonth(),t0.getDate()).getTime();
    var html="";
    for(var n=0;n<7;n++){
      var x; try{ x=W.info(W.addDays(t0,n)); }catch(e){ return; }
      var c=COL[x.ton]||COL.Soft;
      html+='<button type="button" class="wkh'+(n===0?' on':'')+'" data-n="'+n+'" style="--tc:'+c+';--pc:'+x.pl[1]+'" aria-label="'+W.DL[x.wd]+', '+h(x.ton)+(n===0?', heute':'')+'"><span class="wkW">'+(n===0?'Heute':W.DN[x.wd])+'</span><span class="wkM" aria-hidden="true">'+(x.moon?h(x.moon.sym):'')+'</span><i></i></button>';
    }
    if(box.getAttribute("data-k")===html.length+":"+t0) return;
    box.setAttribute("data-k",html.length+":"+t0); box.innerHTML=html;
    [].slice.call(box.querySelectorAll(".wkh")).forEach(function(b){ b.onclick=function(){ window.__wkSel=+b.getAttribute("data-n"); if(typeof show==="function") show("kal"); }; });
  }
  function go(){ try{ paint(); }catch(e){} }
  if(window.RR25_KAL&&RR25_KAL.onReady) RR25_KAL.onReady(function(){ setTimeout(go,60); });
  setTimeout(go,500); setTimeout(go,1800);
  setTimeout(go,3500);
  document.addEventListener("visibilitychange",function(){ if(!document.hidden) go(); });
  if(typeof show==="function"&&!show._b103){ var sh=show; show=function(id){ var r=sh.apply(this,arguments); if(id==="home") setTimeout(go,150); return r; }; show._b103=1; }
  var css=document.createElement("style");
  css.textContent=[
    "html body #home #wkHome{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin:calc(2px + 7px * var(--f,.5)) 0 calc(2px + 6px * var(--f,.5))}",
    "html body #home #wkHome .wkh{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;height:calc(28px + 18px * var(--f,.5));min-height:0;padding:0 1px 3px;border-radius:.8rem;border:1px solid rgba(var(--tc),.5);background:rgba(var(--tc),.07);color:#cdbbe8;line-height:1;overflow:visible}",
    "html body #home #wkHome .wkh::after{content:'';position:absolute;left:-1px;right:-1px;top:-4px;bottom:-4px}",
    "html body #home #wkHome .wkW{font-size:calc(8.6px + 1.4px * var(--f,.5));letter-spacing:.03em}",
    "html body #home #wkHome .wkM{font-size:calc(12px + 7px * var(--f,.5));line-height:1.1;margin-top:1px}",
    "html body #home #wkHome .wkh i{position:absolute;left:30%;right:30%;bottom:3px;height:2px;border-radius:2px;background:rgb(var(--tc));opacity:.85}",
    "html body #home #wkHome .wkh.on{border-color:rgba(var(--pc),.9);background:rgba(var(--pc),.17);color:#fff;font-weight:600;box-shadow:0 0 10px rgba(var(--pc),.3)}",
    /* Build 104: Tagessatz-Zeilen (HALTEN/SETZEN und AUS DEM FELD) von der Startseite genommen */
    "html body #home #mondSag,html body #home #feldZeile{display:none!important}",
    "html body #home:has(#cats .chip.on) #wkHome{display:none}",
    /* Anker-Hinweiskarte: bei knappem Platz (--f klein) schlanker, bei grosszügigem Platz unverändert (Mass wie zuvor) */
    "html body #home #bakCard{margin-top:calc(1px + 8px * var(--f,.5))!important;padding-top:calc(1px + 8px * var(--f,.5))!important;padding-bottom:calc(1px + 8px * var(--f,.5))!important}",
    "html body #home #ankerHintCard{margin:calc(2px + 7.6px * var(--f,.5)) 0!important;padding:calc(2px + 7.6px * var(--f,.5)) .8rem!important}"
  ].join("");
  document.head.appendChild(css);
})();
