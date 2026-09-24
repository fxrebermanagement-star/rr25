(function(){
  var css=document.createElement("style");
  css.textContent=[
    ".kHintLine:empty{display:none}",
    "#sigilT{text-transform:uppercase}",
    "#logFilt + #logFilt{display:none!important}",
    "#home #kasten{margin-bottom:.1rem}",
    ".logrow b{word-break:break-word}",
    "#skizze{width:100%!important;max-width:none!important;margin:.1rem 0 .2rem!important}",
    "#skizze svg{height:12.6rem!important;width:100%!important}"
  ].join("");
  document.head.appendChild(css);
  function up(){
    var el=document.getElementById("sigilT");
    if(!el||el._up) return;
    el._up=1;
    el.addEventListener("input", function(){
      var s=el.selectionStart, e=el.selectionEnd;
      el.value=String(el.value||"").toUpperCase();
      try{ el.setSelectionRange(s,e); }catch(err){}
    });
  }
  function oneFilt(){
    var bars=document.querySelectorAll("#logFilt");
    if(bars.length>1){ for(var i=1;i<bars.length;i++) bars[i].remove(); }
  }
  if(typeof paintLog==="function" && !paintLog._chk){
    var pl=paintLog; paintLog=function(){ pl(); oneFilt(); }; paintLog._chk=1;
  }
  if(typeof show==="function" && !show._chk){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="home") up();
      if(id==="log") setTimeout(oneFilt,40);
      return r;
    };
    show._chk=1;
  }
  up();
})();
