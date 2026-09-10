(function(){
  var css=document.createElement("style");
  css.textContent="#sigilSave,.sigSave{display:none!important}#sigRow{grid-template-columns:1fr!important}#sigRow input,#sigilT{width:100%!important}";
  document.head.appendChild(css);
  var last="", timer=null;
  function put(){
    var c=document.getElementById("sigilC");
    var el=document.getElementById("sigilT")||document.querySelector("#sigRow input,#underR input");
    var t=((el&&el.value)||"").trim().toUpperCase();
    if(!c||!t||typeof load!=="function"||typeof save!=="function") return;
    if(t===last) return;
    var img="";
    try{ img=c.toDataURL("image/jpeg",0.78); }catch(e){}
    if(!img||img.length<80) return;
    var d=load();
    d.log=d.log||[];
    var top=d.log[0];
    if(top&&top.titel==="Sigille"&&String(top.wer||"").toUpperCase()===t){
      if(typeof fotoPut==="function") fotoPut(top.id,[img]);
      last=t;
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
    last=t;
  }
  function later(){
    clearTimeout(timer);
    timer=setTimeout(put,900);
  }
  if(typeof window._sigilGo==="function"){
    var g=window._sigilGo;
    window._sigilGo=function(){ g(); later(); };
  }
  document.addEventListener("input",function(e){
    if(e.target&&(e.target.id==="sigilT"||e.target.closest&&e.target.closest("#sigRow"))) later();
  });
  function hide(){
    var b=document.getElementById("sigilSave");
    if(b) b.remove();
  }
  hide();
  setTimeout(hide,400);
})();
