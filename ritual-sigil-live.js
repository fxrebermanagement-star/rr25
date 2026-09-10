(function(){
  function bind(){
    var el=document.getElementById("sigilT")||document.querySelector("#sigRow input,#underR input");
    if(!el||el._sigLive) return;
    el._sigLive=1;
    el.addEventListener("input",function(){
      if(typeof window._sigilGo==="function") window._sigilGo();
    });
  }
  bind();
  setTimeout(bind,300);
  setTimeout(bind,900);
})();
