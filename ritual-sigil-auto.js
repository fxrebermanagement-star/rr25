(function(){
  var css=document.createElement("style");
  css.textContent="#sigilSave,.sigSave{display:none!important}#sigRow{grid-template-columns:1fr!important}#sigilT,#sigRow input{width:100%!important}";
  document.head.appendChild(css);
  function put(){
    var c=document.getElementById("sigilC");
    var el=document.getElementById("sigilT")||document.querySelector("#sigRow input,#underR input");
    var t=((el&&el.value)||"").trim().toUpperCase();
    if(!c||!t||typeof load!=="function"||typeof save!=="function") return;
    var img="";
    try{ img=c.toDataURL("image/jpeg",0.78); }catch(e){}
    if(!img||img.length<80) return;
    var d=load();
    d.log=d.log||[];
    var top=d.log[0];
    if(top&&top.titel==="Sigille"&&String(top.wer||"").toUpperCase()===t){
      if(typeof fotoPut==="function") fotoPut(top.id,[img]);
      return;
    }
    var id=typeof uid==="function"?uid():String(Date.now());
    d.log.unshift({
      id:id,
      t:typeof now==="function"?now():new Date().toLocaleString("de-CH"),
      titel:"Sigille",
      wer:t,
      pics:1
    });
    save(d);
    if(typeof fotoPut==="function") fotoPut(id,[img]);
  }
  document.addEventListener("click",function(e){
    var t=e.target; if(!t) return;
    var go=t.id==="sigilGo"||(t.closest&&(t.closest("#sigilGo")||t.closest("#tools [data-go=sigilGo]")));
    if(!go && t.closest){
      var tile=t.closest("#tools .tile");
      if(tile&&/Zeichen/i.test(tile.textContent||"")) go=true;
    }
    if(!go) return;
    setTimeout(function(){
      if(typeof window._sigilGo==="function") window._sigilGo();
      setTimeout(put,60);
    },20);
  },true);
  var b=document.getElementById("sigilSave");
  if(b) b.remove();
})();
