/* ritual-b112.js — Build 112: Chronik-Feinschliff.
   - Eintrag offen: «Foto dazu» und Fotos in der Karte, «Löschen» klein und abgesetzt ganz unten. Datum, Mondphase, Wesenheit gut lesbar.
   - Liste: kleines Mondsymbol pro Eintrag (Mondfenster: Neumond/Vollmond je ±1 Tag).
   - Kopf: die fünf Ansichten in einer ruhigen, seitlich wischbaren Reihe «Ansichten».
   Nur Darstellung, keine neuen Schlüssel im Speicher. */
(function(){
  if(window.__rr25b112) return; window.__rr25b112=1;
  function h(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function tidyDetail(){
    var box=document.getElementById("entries"); if(!box) return;
    var card=box.querySelector(".card"), del=card&&card.querySelector(".logDelRow"); if(!card||!del) return;
    var fb=box.querySelector("#logFoto"), row=fb&&fb.closest(".row"), sh=box.querySelector("#logShots");
    if(row&&row.parentNode!==card){ row.classList.add("logFotoRow"); card.appendChild(row); }
    if(sh&&sh.parentNode!==card) card.appendChild(sh);
    card.appendChild(del); /* Löschen immer zuletzt, auch nach «Was kam zurück?» */
  }
  if(typeof openLog==="function"&&!openLog._b112){
    var ol=openLog;
    openLog=function(id){ var r=ol.apply(this,arguments); tidyDetail(); setTimeout(tidyDetail,60); setTimeout(tidyDetail,400); return r; };
    openLog._b112=1;
  }
  function moons(){
    var box=document.getElementById("entries"), M=window.RR25_MOND; if(!box||!M||!M.fenster||typeof load!=="function") return;
    var by={}; (load().log||[]).forEach(function(e){ if(e) by[String(e.id)]=e; });
    [].slice.call(box.querySelectorAll(".logrow[data-eid]")).forEach(function(row){
      var e=by[row.getAttribute("data-eid")], top=row.querySelector(".v3top")||row.querySelector("b"); if(!e||!top||row.querySelector(".lgMo")) return;
      var ms=typeof logWannMs==="function"?logWannMs(e):null; if(ms==null) return;
      var f=M.fenster(ms), sp=document.createElement("span");
      sp.className="lgMo"; sp.textContent=f.sym; sp.title=f.name; sp.setAttribute("aria-label",f.name);
      top.appendChild(sp);
    });
  }
  function header(){
    var bar=document.getElementById("rbBar"); if(!bar) return;
    var wrap=document.getElementById("lgViews");
    if(!wrap){
      wrap=document.createElement("div"); wrap.id="lgViews";
      wrap.innerHTML='<span class="lgViewsL">Ansichten</span>';
      bar.parentNode.insertBefore(wrap,bar); wrap.appendChild(bar);
    }
    /* feste Reihenfolge: Mondzyklus, Absichten, Zähler, Rückblick, Wochenbild */
    ["mzBtn","abBtn","zlBtn","rbBtn","wbBtn"].forEach(function(id){ var b=document.getElementById(id); if(b&&b.parentNode===bar) bar.appendChild(b); });
  }
  function go(){ try{ header(); moons(); }catch(err){ console.warn("rr25 b112",err); } }
  if(typeof paintLog==="function"&&!paintLog._b112){ var pl=paintLog; paintLog=function(){ var r=pl.apply(this,arguments); setTimeout(go,180); return r; }; paintLog._b112=1; }
  if(typeof show==="function"&&!show._b112){ var sh=show; show=function(id){ var r=sh.apply(this,arguments); if(id==="log"){ setTimeout(go,700); setTimeout(go,1200); } return r; }; show._b112=1; }
  setTimeout(go,900);
  var css=document.createElement("style");
  css.textContent=[
    "#lgViews{margin:-.1rem 0 .55rem}",
    "#lgViews .lgViewsL{display:block;font-size:.56rem;letter-spacing:.18em;text-transform:uppercase;color:#a994c4;margin:0 0 .3rem .2rem}",
    "html body #lgViews #rbBar{display:flex!important;flex-wrap:nowrap!important;justify-content:flex-start!important;gap:.4rem;overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:none;margin:0!important;padding:.1rem .1rem .3rem;scroll-snap-type:x proximity;width:100%!important;max-width:none!important;box-sizing:border-box}",
    "#lgViews #rbBar::-webkit-scrollbar{display:none}",
    "html body #lgViews #rbBar>button{flex:0 0 auto;scroll-snap-align:start;white-space:nowrap;min-height:2rem!important;padding:.3rem .9rem!important;font-size:.74rem!important;border-radius:999px!important;border:1px solid rgba(200,120,255,.3)!important;background:rgba(160,90,255,.08)!important;color:#e4ecff!important;margin:0!important}",
    "html body #lgViews #rbBar>button.on{background:rgba(160,90,255,.24)!important;box-shadow:0 0 12px rgba(200,120,255,.35)}",
    ".lgMo{font-size:.78rem;margin-left:.4rem;opacity:.9;filter:drop-shadow(0 0 3px rgba(200,140,255,.45));vertical-align:middle}",
    "#entries .card .logWann{display:block;margin:0;font-size:.86rem;letter-spacing:.04em;color:#f1e1ff}",
    "#entries .card .logMond{display:block;margin:.15rem 0 .2rem;font-size:.76rem;color:#cdbbe8}",
    "#entries .card .logWesen{display:block;margin:0 0 .5rem;font-size:.72rem;color:#a994c4}",
    "#entries .card .logFotoRow{margin-top:.5rem}",
    "#entries .card #logShots{margin-top:.4rem}",
    "#entries .card .logDelRow{display:flex;justify-content:center;margin-top:1.4rem;padding-top:.7rem;border-top:1px solid rgba(200,120,255,.12)}",
    "#entries .card .logDel{min-height:0!important;padding:.25rem .8rem!important;font-size:.68rem!important;letter-spacing:.06em;background:transparent!important;border:0!important;color:#9a86b5!important;text-decoration:underline;text-underline-offset:3px;box-shadow:none!important}"
  ].join("");
  document.head.appendChild(css);
})();
