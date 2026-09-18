(function(){
  window._picMemo=window._picMemo||{};
  function fill(){
    var list=document.getElementById("gabeList");
    if(!list) return;
    list.querySelectorAll("[data-gpic]").forEach(function(cell){
      if(cell.querySelector("img")) return;
      var id=cell.getAttribute("data-gpic");
      var src=(window._picMemo||{})[id];
      if(!src && typeof fotoGet==="function"){
        fotoGet(id).then(function(a){
          if(a&&a[0]&&!cell.querySelector("img")){
            var img=document.createElement("img"); img.src=a[0]; cell.appendChild(img);
          }
        });
        return;
      }
      if(!src) return;
      var img=document.createElement("img");
      img.src=src;
      cell.appendChild(img);
    });
  }
  document.addEventListener("click", function(e){
    if(!e.target || !e.target.closest) return;
    if(e.target.closest("#opferGo") || e.target.closest("#opferFoto")){
      var prev=document.querySelector("#opferPrev img");
      if(prev && prev.src) window._lastGabePic=prev.src;
    }
    if(e.target.closest("#opferGo")){
      setTimeout(function(){
        var first=document.querySelector("#gabeList [data-gpic]");
        if(first && window._lastGabePic){
          window._picMemo[first.getAttribute("data-gpic")]=window._lastGabePic;
        }
        fill();
      }, 60);
      setTimeout(fill, 350);
    }
  }, true);
  if(typeof show==="function" && !show._gpic){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="opfer") setTimeout(fill, 50);
      return r;
    };
    show._gpic=1;
  }
})();
