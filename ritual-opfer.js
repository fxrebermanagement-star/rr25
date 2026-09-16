(function(){
  var pic="";
  var persist=typeof save==="function"?save:function(){};
  var read=typeof load==="function"?load:function(){ return {log:[]}; };
  function nid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,6); }
  function when(){
    if(typeof now==="function") return now();
    return new Date().toLocaleString("de-CH");
  }
  function label(){
    var h=document.querySelector("#opfer h2");
    if(h) h.textContent="Gabe";
    var sub=document.querySelector("#opfer .sub");
    if(sub) sub.textContent="Foto und Wort. Dann Chronik.";
    var bar=document.querySelector("nav");
    var btn=bar && bar.querySelector('[data-v="opfer"]');
    var buch=bar && bar.querySelector('[data-v="buch"]');
    if(btn){
      var lab=btn.childNodes[btn.childNodes.length-1];
      if(lab && lab.nodeType===3) lab.textContent="Gabe";
      else {
        var t=document.createTextNode("Gabe");
        btn.appendChild(t);
      }
      btn.innerHTML='<svg viewBox="0 0 24 24"><path d="M12 4l2.2 4.6L19 10l-4.8 1.8L12 17l-2.2-5.2L5 10l4.8-1.4z"/><path d="M7 19h10"/></svg>Gabe';
      if(buch) bar.insertBefore(btn, buch);
    }
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
    var e={id:id,t:when(),titel:"Gabe",wer:"",note:t,wesen:false};
    if(pic) e.img=pic;
    d.log.unshift(e);
    try{ persist(d); }
catch(err){
      if(pic){ delete e.img; try{ persist(d); }catch(e2){ if(msg) msg.textContent="Speicher voll."; return; } }
      else { if(msg) msg.textContent="Speicher voll."; return; }
    }
    if(pic && typeof fotoPut==="function") fotoPut(id,[pic]);
    pic="";
    var ta=document.getElementById("opferT"); if(ta) ta.value="";
    preview();
    if(msg) msg.textContent="In der Chronik.";
    setTimeout(function(){ if(typeof show==="function") show("log"); }, 200);
  }
  label();
  document.addEventListener("click", function(e){
    if(e.target.closest && e.target.closest("#opferFoto")){ e.preventDefault(); pick(); }
    if(e.target.closest && e.target.closest("#opferGo")){ e.preventDefault(); ablegen(); }
  });
})();
