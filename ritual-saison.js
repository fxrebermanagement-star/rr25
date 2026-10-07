/* ritual-saison.js — Jahresansicht: Saison-Tage mit kleiner Raute in Saisonfarbe markieren (wie in der Monatsansicht).
   Nur Anzeige. Liest RR25_KAL.seasons(), ändert Ton, Tor und Gate nie. */
(function(){
  var K=window.RR25_KAL; if(!K||!K.seasons||window.RR25_SZYEAR) return; window.RR25_SZYEAR=1;
  function deco(root){
    var ms=root.querySelectorAll(".kyM[data-ym]");
    for(var i=0;i<ms.length;i++){
      var m=ms[i]; if(m.getAttribute("data-sz")) continue; m.setAttribute("data-sz","1");
      var m0=+m.getAttribute("data-ym"), d=new Date(m0), cells=m.querySelectorAll(".kyD");
      for(var j=0;j<cells.length;j++){
        var t=new Date(d.getFullYear(),d.getMonth(),j+1,12).getTime(), z=K.seasons(t)[0];
        if(z&&!cells[j].querySelector(".kyS")){ var b=document.createElement("b"); b.className="kyS "+String(z.k).toLowerCase(); cells[j].appendChild(b); }
      }
    }
  }
  var st=document.createElement("style");
  st.textContent=".kyD{position:relative}.kyD b.kyS{position:absolute;right:-1px;top:-2px;width:4px;height:4px;display:block;box-sizing:border-box;border-radius:1px;transform:rotate(45deg);background:#ff5470}"+
    ".kyD b.kyS.soft{background:#2ecc71}.kyD b.kyS.echo{background:#b36bff}.kyD b.kyS.still{background:#c9c5d4}.kyD b.kyS.grenze{background:#ff9f43}";
  document.head.appendChild(st);
  var box=document.getElementById("kalList"); if(!box) return;
  function run(){ try{ deco(box); }catch(e){} }
  K.onReady(run);
  if(window.MutationObserver) new MutationObserver(run).observe(box,{childList:true,subtree:true});
})();
