(function(){
  var box=document.getElementById("sigilBox");
  var duo=document.querySelector(".duo");
  if(box&&duo){
    var tools=document.getElementById("sigilTools");
    if(!tools){
      tools=document.createElement("div");
      tools.id="sigilTools";
      tools.innerHTML='<input id="sigilT2" placeholder="Absicht"><button type="button" class="btn ghost" id="sigilGo2">Zeichen</button>';
      duo.parentNode.insertBefore(tools, duo.nextSibling);
    }
    var oldT=document.getElementById("sigilT");
    var oldG=document.getElementById("sigilGo");
    var lab=document.getElementById("sigilL");
    if(oldT) oldT.remove();
    if(oldG) oldG.remove();
    if(lab) lab.remove();
    var t2=document.getElementById("sigilT2");
    var g2=document.getElementById("sigilGo2");
    if(t2) t2.id="sigilT";
    if(g2){
      g2.id="sigilGo";
      g2.onclick=function(){
        var ev=document.createEvent("Event"); ev.initEvent("click",true,true);
        var b=document.getElementById("sigilGo");
      };
    }
  }
  var s=document.createElement("style");
  s.textContent=[
    ".duo{display:grid;grid-template-columns:1fr 1fr;gap:.4rem;align-items:stretch}",
    "#kOut,#sigilBox{aspect-ratio:1/1;height:auto;min-height:0;margin:0;padding:0}",
    "#kOut .kcard{height:100%;margin:0;border-radius:1rem;overflow:hidden;display:flex;flex-direction:column;justify-content:center;padding:.55rem .5rem}",
    "#sigilBox{background:#12081c;border:1px solid rgba(232,160,255,.28);border-radius:1rem;overflow:hidden}",
    "#sigilC{width:100%;height:100%;display:block;margin:0;border:0;border-radius:1rem}",
    "#sigilTools{display:flex;gap:.35rem;margin-top:.4rem}",
    "#sigilTools input{flex:1;margin:0;padding:.5rem .65rem}",
    "#sigilTools .btn{flex:0 0 auto;padding:.5rem .8rem}"
  ].join("");
  document.head.appendChild(s);
  function bind(){
    var go=document.getElementById("sigilGo");
    if(!go||go._ok) return;
    go._ok=1;
    go.onclick=function(){
      if(typeof window._sigilGo==="function") window._sigilGo();
    };
  }
  bind();
  setTimeout(bind,200);
})();
