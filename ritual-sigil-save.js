(function(){
  function snap(){
    var c=document.getElementById("sigilC");
    if(!c) return "";
    try{
      var w=c.width, h=c.height;
      if(!w||!h) return "";
      var out=document.createElement("canvas");
      var s=Math.min(720, Math.max(w,h));
      out.width=s; out.height=s;
      var ctx=out.getContext("2d");
      ctx.fillStyle="#08040e";
      ctx.fillRect(0,0,s,s);
      ctx.drawImage(c,0,0,s,s);
      return out.toDataURL("image/jpeg",0.78);
    }catch(e){
      try{ return c.toDataURL("image/jpeg",0.78); }catch(err){ return ""; }
    }
  }
  function put(){
    var el=document.getElementById("sigilT");
    var t=((el&&el.value)||"").trim().toUpperCase();
    if(!t) return;
    var img=snap();
    if(!img||img.length<200) return;
    if(typeof load!=="function"||typeof save!=="function") return;
    var d=load();
    d.log=d.log||[];
    var id, e;
    var top=d.log[0];
    if(top && String(top.titel)==="Sigille" && String(top.wer||"").toUpperCase()===t){
      e=top; id=top.id;
    } else {
      id=(typeof uid==="function"?uid():Date.now().toString(36));
      e={id:id, t:typeof now==="function"?now():new Date().toLocaleString("de-CH"), titel:"Sigille", wer:t, pics:1, img:img};
      d.log.unshift(e);
    }
    e.pics=1;
    e.img=img;
    e.wer=t;
    var seen={};
    d.log=d.log.filter(function(x){
      if(String(x.titel)!=="Sigille") return true;
      var k=String(x.wer||"").toUpperCase()+"|"+String(x.t||"").slice(0,16);
      if(seen[k] && String(x.id)!==String(id)) return false;
      seen[k]=1;
      return true;
    });
    try{ save(d); }catch(err){}
    window._picMemo=window._picMemo||{};
    window._picMemo[id]=img;
    if(typeof fotoPut==="function"){
      Promise.resolve(fotoPut(id,[img])).catch(function(){});
    }
    var hold=document.querySelector('[data-pic="'+id+'"]');
    if(hold && !hold.querySelector("img")){
      var im=document.createElement("img");
      im.src=img; im.className="sig"; hold.appendChild(im);
    }
  }
  function afterDraw(){ setTimeout(put, 180); setTimeout(put, 500); }
  document.addEventListener("click", function(e){
    if(!e.target||!e.target.closest) return;
    if(e.target.closest("#sigilGo") || e.target.closest("#sigilSave")) afterDraw();
  }, true);
})();
