(function(){
  window._picMemo=window._picMemo||{};
  var hold=document.getElementById("gabeList");
  if(!hold) return;
  function fill(){
    var list=document.getElementById("gabeList");
    if(!list) return;
    list.querySelectorAll("[data-gpic]").forEach(function(cell){
      if(cell.querySelector("img")) return;
      var id=cell.getAttribute("data-gpic");
      var src=(window._picMemo||{})[id];
      if(!src) return;
      var img=document.createElement("img");
      img.src=src;
      img.onclick=function(){
        var b=list.querySelector('[data-gopen="'+id+'"]');
        if(b) b.click();
      };
      cell.appendChild(img);
    });
  }
  document.addEventListener("click", function(e){
    if(!e.target || !e.target.closest) return;
    if(e.target.closest("#opferGo")){
      var prev=document.querySelector("#opferPrev img");
      if(prev && prev.src) window._lastGabePic=prev.src;
      setTimeout(function(){
        var rows=document.querySelectorAll("#gabeList [data-gpic]");
        var first=rows[0];
        if(first && window._lastGabePic){
          var id=first.getAttribute("data-gpic");
          window._picMemo[id]=window._lastGabePic;
        }
        fill();
      }, 80);
      setTimeout(fill, 400);
    }
  }, true);
  if(window.MutationObserver && hold){
    new MutationObserver(fill).observe(hold,{childList:true,subtree:true});
  }
})();
