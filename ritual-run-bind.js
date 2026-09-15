(function(){
  document.addEventListener("click", function(e){
    var t=e.target;
    if(!t || !t.closest) return;
    var card=t.closest("#list .card[data-id]");
    var pin=t.closest("#pinDank");
    if(!card && !pin) return;
    var id=pin?"dank":card.getAttribute("data-id");
    if(!id || typeof openR!=="function") return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if(typeof fromPlan!=="undefined") fromPlan=null;
    openR(id);
  }, true);
})();
