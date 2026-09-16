(function(){
  var pic="";
  var persist=typeof save==="function"?save:function(){};
  var read=typeof load==="function"?load:function(){ return {log:[]}; };
  function nid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,6); }
  function when(){
    if(typeof now==="function") return now();
    var d=new Date();
    return d.toLocaleString("de-CH");
  }
  function preview(){
    var el=document.getElementById("opferPrev");
    if(!el) return;
    el.innerHTML=pic?'<img alt="" src="'+pic+'">':'';
  }
  function pick(){
    var inp=document.createElement("input");
    inp.type="file"; inp.accept="image/*"; inp.capture="environment";
    inp.onchange=function(ev){
      var f=ev.target.files && ev.target.files[0];
      if(!f) return;
      if(typeof compressPic==="function"){
        compressPic(f).then(function(data){ pic=data||""; preview(); });
        return;
      }
      var r=new FileReader();
      r.onload=function(){ pic=String(r.result||""); preview(); };
      r.readAsDataURL(f);
    };
    inp.click();
  }
  function ablegen(){
    var t=((document.getElementById("opferT")||{}).value||"").trim();
    var msg=document.getElementById("opferMsg");
    if(!t && !pic){
      if(msg) msg.textContent="Wort oder Foto.";
      return;
    }
    var d=read();
    if(!d || typeof d!=="object") d={log:[],planned:[]};
    d.log=d.log||[];
    d.planned=d.planned||[];
    var id=nid();
    var e={id:id,t:when(),titel:"Opfergabe",wer:"",note:t,wesen:false};
    if(pic) e.img=pic;
    d.log.unshift(e);
    try{ persist(d); }
catch(err){
      if(msg) msg.textContent="Speicher voll. Nur Text versuchen.";
      if(pic){
        delete e.img;
        try{ persist(d); }catch(e2){ return; }
      } else return;
    }
    if(pic && typeof fotoPut==="function") fotoPut(id,[pic]);
    pic="";
    var ta=document.getElementById("opferT"); if(ta) ta.value="";
    preview();
    if(msg) msg.textContent="In der Chronik.";
    setTimeout(function(){ if(typeof show==="function") show("log"); }, 200);
  }
  document.addEventListener("click", function(e){
    if(e.target.closest && e.target.closest("#opferFoto")){ e.preventDefault(); pick(); }
    if(e.target.closest && e.target.closest("#opferGo")){ e.preventDefault(); ablegen(); }
  });
})();
