(function(){
  function snap(){
    var c=document.getElementById("sigilC");
    if(!c) return "";
    try{ return c.toDataURL("image/jpeg",0.82); }catch(e){ return ""; }
  }
  function put(){
    var el=document.getElementById("sigilT");
    var t=((el&&el.value)||"").trim().toUpperCase();
    if(!t) return;
    var img=snap();
    if(!img||img.length<80) return;
    if(typeof load!=="function"||typeof save!=="function") return;
    var d=load();
    d.log=d.log||[];
    var top=d.log[0];
    var id;
    if(top&&top.titel==="Sigille"&&String(top.wer||"").toUpperCase()===t){
      id=top.id;
      top.pics=1;
    } else {
      id=(typeof uid==="function"?uid():Date.now().toString(36));
      d.log.unshift({
        id:id,
        t:typeof now==="function"?now():new Date().toLocaleString("de-CH"),
        titel:"Sigille",
        wer:t,
        pics:1
      });
    }
    try{ save(d); }catch(e){}
    window._picMemo=window._picMemo||{};
    window._picMemo[id]=img;
    if(typeof fotoPut==="function") fotoPut(id,[img]);
  }
  document.addEventListener("click", function(e){
    if(!e.target||!e.target.closest) return;
    if(!e.target.closest("#sigilGo")) return;
    setTimeout(put, 120);
  }, true);
})();
