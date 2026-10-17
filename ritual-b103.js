/* ritual-b103.js — Build 103: Feld-Wetter-Zeile auf der Heute-Seite (7 Tage, schlank).
   Pro Tag ein kleiner Chip: Wochentag und Tonpunkt (Soft/Grenze/Hard/Echo/Still), heute hervorgehoben.
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
      html+='<button type="button" class="wkh'+(n===0?' on':'')+'" data-n="'+n+'" style="--tc:'+c+';--pc:'+x.pl[1]+'" aria-label="'+W.DL[x.wd]+', '+h(x.ton)+(n===0?', heute':'')+'"><span>'+(n===0?'Heute':W.DN[x.wd])+'</span><i></i></button>';
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
    "html body #home #wkHome{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;margin:calc(3px + 5px * var(--f,.5)) 0 calc(2px + 3px * var(--f,.5))}",
    "html body #home #wkHome .wkh{position:relative;display:flex;align-items:center;justify-content:center;gap:4px;height:calc(21px + 5px * var(--f,.5));min-height:0;padding:0 2px;border-radius:999px;border:1px solid rgba(var(--tc),.38);background:rgba(var(--tc),.07);color:#cdbbe8;font-size:calc(9px + 1.2px * var(--f,.5));line-height:1;white-space:nowrap}",
    "html body #home #wkHome .wkh::after{content:'';position:absolute;left:-1px;right:-1px;top:-9px;bottom:-9px}",
    "html body #home #wkHome .wkh i{display:block;width:5px;height:5px;border-radius:50%;background:rgb(var(--tc));box-shadow:0 0 5px rgba(var(--tc),.7);flex:none}",
    "html body #home #wkHome .wkh.on{border-color:rgba(var(--pc),.85);background:rgba(var(--pc),.16);color:#fff;font-weight:600;box-shadow:0 0 10px rgba(var(--pc),.3)}",
    "html body #home #wkHome .wkh.on span{letter-spacing:0}",
    "html body #home:has(#cats .chip.on) #wkHome{display:none}",
    /* Anker-Hinweiskarte: bei knappem Platz (--f klein) schlanker, bei grosszügigem Platz unverändert (Mass wie zuvor) */
    "html body #home #ankerHintCard{margin:calc(4px + 5.6px * var(--f,.5)) 0!important;padding:calc(4px + 5.6px * var(--f,.5)) .8rem!important}"
  ].join("");
  document.head.appendChild(css);
})();
