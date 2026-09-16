(function(){
  var st=document.createElement("style");
  st.textContent="#run label.check,#run #feldCheck,#run #back,.check{display:none!important}";
  document.head.appendChild(st);
  var run=document.getElementById("run");
  if(!run || !window.MutationObserver) return;
  function hide(){
    ["feldCheck","back"].forEach(function(id){
      var box=document.getElementById(id);
      if(box) box.checked=true;
    });
    run.querySelectorAll("label.check").forEach(function(lab){
      lab.style.setProperty("display","none","important");
    });
  }
  hide();
  new MutationObserver(hide).observe(run,{childList:true,subtree:true});
})();
