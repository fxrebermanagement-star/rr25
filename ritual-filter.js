if(typeof cat!=="undefined" && cat==="Alle") cat="Alltag";
(function(){
  var old=renderList;
  renderList=function(){
    if(cat==="Alle") cat="Alltag";
    old();
    var a=document.querySelector('#cats [data-cat="Alle"]');
    if(a) a.remove();
  };
  renderList();
})();
