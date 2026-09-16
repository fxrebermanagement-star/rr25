(function(){
  var go=document.getElementById("sigilSave");
  if(!go) return;
  go.addEventListener("click", function(){
    setTimeout(function(){
      var c=document.getElementById("sigilC");
      if(!c || typeof load!=="function") return;
      var img="";
      try{ img=c.toDataURL("image/png"); }catch(e){}
      if(!img || img.length<80) return;
      var d=load();
      var e=(d.log||[])[0];
      if(!e || !/sigil/i.test(e.titel||"")) return;
      e.img=img;
      save(d);
      if(typeof fotoPut==="function") fotoPut(e.id, [img]);
    }, 80);
  });
})();
