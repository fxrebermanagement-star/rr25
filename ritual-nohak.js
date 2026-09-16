(function(){
  var run=document.getElementById("run");
  if(!run || !window.MutationObserver) return;
  new MutationObserver(function(){
    ["feldCheck","back"].forEach(function(id){
      var box=document.getElementById(id);
      if(!box) return;
      box.checked=true;
      var lab=box.closest("label");
      if(lab) lab.style.display="none";
    });
  }).observe(run,{childList:true,subtree:true});
})();
