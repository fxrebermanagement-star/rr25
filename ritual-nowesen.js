(function(){
  var NO={dank:1,schutz:1,schutzweg:1};
  function skip(){
    var h=document.querySelector("#run h2");
    if(!h || !/Wesenheit/.test(h.textContent||"")) return;
    if(!NO[window._rid]) return;
    var o=document.getElementById("wOhne");
    if(o) o.click();
  }
  if(typeof openR==="function" && !openR._nowesen){
    var _o=openR;
    openR=function(id,wer){
      window._rid=id;
      var r=_o(id,wer);
      setTimeout(skip,0);
      setTimeout(skip,50);
      return r;
    };
    openR._nowesen=1;
  }
  var run=document.getElementById("run");
  if(run && window.MutationObserver){
    new MutationObserver(skip).observe(run,{childList:true});
  }
})();
