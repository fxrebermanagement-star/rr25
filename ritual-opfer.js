(function(){
  var pic="";
  function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,6); }
  function screen(){
    if(document.getElementById("opfer")) return;
    var main=document.querySelector("main");
    if(!main) return;
    var s=document.createElement("section");
    s.id="opfer"; s.className="screen";
    s.innerHTML=
      '<div class="hero"><h2>Opfergabe</h2><p class="sub">Foto und Wort. Dann Chronik.</p></div>'+
      '<div class="card">'+
      '<textarea id="opferT" placeholder="Was du gibst. Für wen. Warum."></textarea>'+
      '<div id="opferPrev" class="shots"></div>'+
      '<div class="row">'+
      '<button type="button" class="btn ghost" id="opferFoto">Foto</button>'+
      '<button type="button" class="btn primary" id="opferGo">Ablegen</button>'+
      '</div>'+
      '<p class="msg" id="opferMsg"></p>'+
      '</div>';
    main.appendChild(s);
  }
  function nav(){
    var bar=document.querySelector("nav");
    if(!bar || bar.querySelector('[data-v="opfer"]')) return;
    bar.style.gridTemplateColumns="repeat(6,1fr)";
    var b=document.createElement("button");
    b.type="button"; b.setAttribute("data-v","opfer");
    b.innerHTML='<svg viewBox="0 0 24 24"><path d="M12 4l2.2 4.6L19 10l-4.8 1.8L12 17l-2.2-5.2L5 10l4.8-1.4z"/><path d="M7 19h10"/></svg>Opfer';
    var chron=bar.querySelector('[data-v="log"]');
    if(chron) bar.insertBefore(b, chron);
    else bar.appendChild(b);
    b.onclick=function(){ if(typeof show==="function") show("opfer"); };
  }
  function preview(){
    var el=document.getElementById("opferPrev");
    if(!el) return;
    el.innerHTML=pic?'<img alt="" src="'+pic+'">':'';
  }
  function pick(){
    if(typeof pickFoto==="function" && typeof compressPic==="function"){
      var inp=document.createElement("input");
      inp.type="file"; inp.accept="image/*"; inp.capture="environment";
      inp.onchange=function(ev){
        var f=ev.target.files && ev.target.files[0];
        if(!f) return;
        compressPic(f).then(function(data){ pic=data||""; preview(); });
      };
      inp.click();
      return;
    }
    var inp=document.createElement("input");
    inp.type="file"; inp.accept="image/*"; inp.capture="environment";
    inp.onchange=function(ev){
      var f=ev.target.files && ev.target.files[0];
      if(!f) return;
      var r=new FileReader();
      r.onload=function(){ pic=String(r.result||""); preview(); };
      r.readAsDataURL(f);
    };
    inp.click();
  }
  function save(){
    var t=((document.getElementById("opferT")||{}).value||"").trim();
    var msg=document.getElementById("opferMsg");
    if(!t && !pic){
      if(msg) msg.textContent="Wort oder Foto.";
      return;
    }
    var d=typeof load==="function"?load():{log:[]};
    d.log=d.log||[];
    var id=uid();
    var e={id:id,t:typeof now==="function"?now():new Date().toLocaleString("de-CH"),titel:"Opfergabe",wer:"",note:t,wesen:false};
    if(pic) e.img=pic;
    d.log.unshift(e);
    if(typeof save==="function") save(d);
    if(pic && typeof fotoPut==="function") fotoPut(id,[pic]);
    pic="";
    var ta=document.getElementById("opferT"); if(ta) ta.value="";
    preview();
    if(msg) msg.textContent="In der Chronik.";
    setTimeout(function(){ if(typeof show==="function") show("log"); }, 280);
  }
  function bind(){
    var f=document.getElementById("opferFoto");
    var g=document.getElementById("opferGo");
    if(f) f.onclick=pick;
    if(g) g.onclick=save;
  }
  screen(); nav(); bind();
  if(typeof show==="function" && !show._opfer){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="opfer"){ screen(); bind(); }
      return r;
    };
    show._opfer=1;
  }
  document.addEventListener("click", function(e){
    var b=e.target.closest && e.target.closest('nav [data-v="opfer"]');
    if(!b) return;
    e.preventDefault();
    if(typeof show==="function") show("opfer");
  });
})();
