(function(){
  if(typeof enhanceLogFotos==="function") enhanceLogFotos=function(){};
  var prev=typeof paintLog==="function"?paintLog:null;
  paintLog=function(){
    if(prev) prev();
    var box=document.getElementById("entries");
    if(!box) return;
    box.querySelectorAll(".shots").forEach(function(s){ s.remove(); });
    box.querySelectorAll(".logrow").forEach(function(row){
      var pics=row.querySelectorAll("img");
      for(var i=1;i<pics.length;i++) pics[i].remove();
    });
  };
})();
