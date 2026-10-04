(function(){
  /* Chronik: graues Kennzeichen ZIEL/ZEICHEN fuer Tagesziel und Sigille.
     Kante und Label in #8f8aa0. Soft/Grenze/Hard/Feld unangetastet. Kein Filter-Chip. Kein Mehr-Menue. */
  if(window.__rr25grauZiel) return;
  window.__rr25grauZiel=1;
  var KIND={Tagesziel:"Ziel",Sigille:"Zeichen"};
  var GREY="#8f8aa0";
  function paint(){
    var box=document.getElementById("entries"); if(!box) return;
    var rows=[]; try{ rows=(typeof load==="function"?(load().log||[]):[]); }catch(e){}
    var by={}; rows.forEach(function(e){ by[String(e.id)]=e; });
    [].slice.call(box.querySelectorAll(".logrow[data-eid]")).forEach(function(row){
      var e=by[row.getAttribute("data-eid")]; if(!e) return;
      var t=String(e.titel||"").trim();
      var lab=KIND[t]; if(!lab) return;
      if(!row.classList.contains("v3c")) row.classList.add("v3c");
      row.classList.add("tone-neutral");
      row.style.setProperty("--t", GREY);
      var tone=row.querySelector(".v3tone");
      if(tone){
        if(tone.textContent!==lab) tone.textContent=lab;
      } else {
        var meta=row.querySelector(".meta");
        if(meta){
          var sp=document.createElement("span");
          sp.className="v3tone";
          sp.textContent=lab;
          meta.insertBefore(sp, meta.firstChild);
        }
      }
    });
  }
  var css=document.createElement("style");
  css.textContent=[
    "#entries .v3c.tone-neutral{--t:"+GREY+"}",
    "#entries .v3c.tone-neutral .v3tone{color:var(--t);font-size:.56rem;letter-spacing:.16em;text-transform:uppercase;margin-right:.4rem}"
  ].join("");
  document.head.appendChild(css);
  if(typeof paintLog==="function" && !paintLog._grau){
    var pl=paintLog;
    paintLog=function(){ var r=pl.apply(this,arguments); setTimeout(paint,40); return r; };
    paintLog._grau=1;
  }
  if(typeof show==="function" && !show._grau){
    var sh=show;
    show=function(id){ var r=sh.apply(this,arguments); if(id==="log") setTimeout(paint,120); return r; };
    show._grau=1;
  }
  setTimeout(paint,250);
})();
