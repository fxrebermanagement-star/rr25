try{
/* ritual-b109.js — Build 109: Echo-Erinnerung auf der Heute-Seite.
   Personen-Ritual (Chronik-Eintrag mit e.person) ohne «Was kam zurück?» und älter als 3 Tage: eine sanfte Karte
   «Was kam zurück von [Name]?». Eintragen schreibt e.echo/e.echoT in denselben Chronik-Eintrag, «Nicht mehr fragen» setzt e.echoSkip.
   Nur lokal (rr25_ritual_v1), kein Server. */
(function(){
  if(window.__rr25b109) return; window.__rr25b109=1;
  if(typeof load!=="function"||typeof save!=="function") return;
  var TAGE=3, DAY=86400000;
  function h(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function ms(e){
    if(e.ms) return +e.ms;
    var m=String(e.t||"").match(/(\d{1,2})\.(\d{1,2})\.(\d{4}),?\s*(\d{1,2}):(\d{2})/);
    return m?new Date(+m[3],+m[2]-1,+m[1],+m[4],+m[5]).getTime():0;
  }
  function wer(e){ return String(e.wer||"").split(" · ").filter(Boolean).join(" und ")||"der Person"; }
  function offen(){
    var d=load(), now=Date.now(), L=(d.log||[]).filter(function(e){
      var t=ms(e);
      return e.person && !e.echo && !e.echoSkip && !/abgebrochen/.test(e.titel||"") && t && now-t>=TAGE*DAY;
    });
    L.sort(function(a,b){ return ms(a)-ms(b); });
    return L[0]||null;
  }
  function paint(){
    var home=document.getElementById("home"); if(!home) return;
    var e=offen(), c=document.getElementById("echoErin");
    if(!e){ if(c) c.remove(); return; }
    if(c && c.getAttribute("data-id")===String(e.id)) return;
    if(!c){ c=document.createElement("div"); c.id="echoErin"; c.className="card echoErin"; }
    var tage=Math.floor((Date.now()-ms(e))/DAY);
    c.setAttribute("data-id",String(e.id));
    c.innerHTML='<p class="eeT">Was kam zurück von '+h(wer(e))+'?</p>'+
      '<p class="meta">'+h(String(e.titel||"").split(" · ")[0])+' · vor '+tage+' Tagen'+(e.richtung?' · als '+h(e.richtung):'')+'</p>'+
      '<textarea id="eeTxt" maxlength="800" placeholder="Anruf, Gefühl, Zufall · ein Satz genügt"></textarea>'+
      '<div class="row"><button type="button" class="btn ghost" id="eeNo">Nicht mehr fragen</button><button type="button" class="btn primary" id="eeOk">In die Chronik</button></div>';
    var ref=document.getElementById("wkHome");
    if(ref&&ref.parentNode===home) home.insertBefore(c,ref); else if(c.parentNode!==home) home.insertBefore(c,home.firstChild);
    function upd(f){ var d=load(), x=(d.log||[]).filter(function(y){ return String(y.id)===String(e.id); })[0]; if(!x) return; f(x); save(d); if(window.RR25_ECHOSYNC) window.RR25_ECHOSYNC(); c.remove(); setTimeout(paint,50); }
    document.getElementById("eeOk").onclick=function(){
      var v=(document.getElementById("eeTxt").value||"").trim().slice(0,800); if(!v){ document.getElementById("eeTxt").focus(); return; }
      upd(function(x){ x.echo=v; x.echoT=Date.now(); });
    };
    document.getElementById("eeNo").onclick=function(){ upd(function(x){ x.echoSkip=Date.now(); }); };
  }
  function go(){ try{ paint(); }catch(err){ console.warn("rr25 echo-erinnerung",err); } }
  setTimeout(go,600); setTimeout(go,2000);
  document.addEventListener("visibilitychange",function(){ if(!document.hidden) go(); });
  if(typeof show==="function"&&!show._b109){ var sh=show; show=function(id){ var r=sh.apply(this,arguments); if(id==="home") setTimeout(go,160); return r; }; show._b109=1; }
  var css=document.createElement("style");
  css.textContent="#home #echoErin{margin:.5rem 0;padding:.75rem .85rem;border:1px solid rgba(200,150,255,.45);background:rgba(200,150,255,.08);border-radius:1rem}"+
    "#home #echoErin .eeT{margin:0 0 .2rem;font-weight:600;color:#efe3ff}#home #echoErin textarea{width:100%;min-height:3.2rem;margin:.45rem 0 .3rem;box-sizing:border-box}"+
    "#home #echoErin .row{display:flex;gap:.5rem}#home #echoErin .row .btn{flex:1}";
  document.head.appendChild(css);
})();
}catch(e){ console.warn("rr25 b109",e); }
