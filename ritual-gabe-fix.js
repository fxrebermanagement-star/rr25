(function(){
  window._picMemo=window._picMemo||{};
  var hold="";
  var fileInp=null;

  function read(){
    try{ return (typeof load==="function"?load():JSON.parse(localStorage.getItem("rr25_ritual_v1")||"{}"))||{}; }
    catch(e){ return {log:[],planned:[]}; }
  }
  function slim(d){
    d=d||{}; d.log=d.log||[]; d.planned=d.planned||[];
    d.log=d.log.map(function(e){
      if(!e||!e.img) return e;
      var id=e.id;
      if(id && e.img){
        window._picMemo[id]=e.img;
        if(typeof fotoPut==="function") fotoPut(id,[e.img]);
      }
      var x={};
      Object.keys(e).forEach(function(k){ if(k!=="img") x[k]=e[k]; });
      x.pics=x.pics||1;
      return x;
    });
    return d;
  }
  function persist(d){
    d=slim(d);
    try{
      if(typeof save==="function") save(d);
      else localStorage.setItem("rr25_ritual_v1", JSON.stringify(d));
      return true;
    }catch(e){
      try{
        localStorage.setItem("rr25_ritual_v1", JSON.stringify(d));
        return true;
      }catch(e2){ return false; }
    }
  }
  function nid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,6); }
  function when(){
    try{ return new Date().toLocaleString("de-CH"); }catch(e){ return ""; }
  }
  function isGabe(e){
    if(!e) return false;
    if(e.kind==="gabe") return true;
    var t=String(e.titel||"").toLowerCase();
    return t==="gabe"||t==="opfer"||t==="opfergabe";
  }
  window._isGabe=isGabe;

  function ensureFile(){
    if(fileInp && document.body.contains(fileInp)) return fileInp;
    fileInp=document.createElement("input");
    fileInp.type="file";
    fileInp.accept="image/*";
    fileInp.id="gabeFile";
    fileInp.style.cssText="position:fixed;left:0;bottom:0;width:1px;height:1px;opacity:0;z-index:-1";
    document.body.appendChild(fileInp);
    fileInp.onchange=function(){
      var f=fileInp.files && fileInp.files[0];
      fileInp.value="";
      if(!f) return;
      var go=function(data){
        if(!data) return;
        hold=data;
        var prev=document.getElementById("opferPrev");
        if(prev) prev.innerHTML='<img alt="" src="'+data+'">';
        var msg=document.getElementById("opferMsg");
        if(msg) msg.textContent="Foto bereit.";
      };
      if(typeof compressPic==="function"){
        Promise.resolve(compressPic(f)).then(function(d){
          if(d) go(d);
          else {
            var r=new FileReader();
            r.onload=function(){ go(String(r.result||"")); };
            r.readAsDataURL(f);
          }
        });
      } else {
        var r=new FileReader();
        r.onload=function(){ go(String(r.result||"")); };
        r.readAsDataURL(f);
      }
    };
    return fileInp;
  }

  function pick(){
    var inp=ensureFile();
    try{ inp.click(); }catch(e){}
  }

  function preview(){
    var el=document.getElementById("opferPrev");
    if(!el) return;
    el.innerHTML=hold?'<img alt="" src="'+hold+'">':'';
  }

  function wipe(){
    hold="";
    var t=document.getElementById("opferTitel"); if(t) t.value="";
    var a=document.getElementById("opferT"); if(a) a.value="";
    preview();
  }

  function putShot(cell, src){
    if(!cell||!src||cell.querySelector("img")) return;
    var img=document.createElement("img");
    img.src=src;
    cell.appendChild(img);
  }

  function paintList(){
    var holdEl=document.getElementById("gabeList");
    if(!holdEl) return;
    var rows=[];
    try{ rows=(read().log||[]).filter(isGabe); }catch(e){ rows=[]; }
    if(!rows.length){ holdEl.innerHTML="<p class='meta'>Noch keine Gabe.</p>"; return; }
    holdEl.innerHTML=rows.map(function(e){
      var note=String(e.note||"");
      if(note.toLowerCase()==="gabe"||note===String(e.titel||"")) note="";
      return '<div class="logrow" data-gid="'+e.id+'">'+ 
        '<div><b>'+String(e.titel||"Gabe").replace(/</g,"")+'</b>'+
        '<div class="meta">'+String(e.t||"")+'</div>'+
        (note?'<p style="margin:.35rem 0 0;white-space:pre-wrap">'+note.replace(/</g,"")+'</p>':'')+
        '<button type="button" class="logact" data-gopen="'+e.id+'">Öffnen</button></div>'+
        '<div class="logpic" data-gpic="'+e.id+'"></div></div>';
    }).join("");
    holdEl.querySelectorAll("[data-gopen]").forEach(function(b){
      b.onclick=function(ev){ ev.preventDefault(); ev.stopPropagation(); openOne(b.getAttribute("data-gopen")); };
    });
    rows.forEach(function(e){
      var cell=holdEl.querySelector('[data-gpic="'+e.id+'"]');
      if(!cell) return;
      if(e.img) putShot(cell,e.img);
      if(window._picMemo[e.id]) putShot(cell,window._picMemo[e.id]);
      if(typeof fotoGet==="function"){
        fotoGet(e.id).then(function(a){ if(a&&a[0]) putShot(cell,a[0]); });
      }
    });
  }

  function showList(){
    var n=document.getElementById("gabeNew"); if(n) n.style.display="block";
    var r=document.getElementById("gabeFotoRow"); if(r) r.style.display="flex";
    var l=document.getElementById("gabeList"); if(l) l.style.display="block";
    var o=document.getElementById("gabeOpen"); if(o){ o.style.display="none"; o.innerHTML=""; }
    paintList();
  }

  function openOne(id){
    var e=(read().log||[]).filter(function(x){ return String(x.id)===String(id); })[0];
    if(!e){ showList(); return; }
    var n=document.getElementById("gabeNew"); if(n) n.style.display="none";
    var r=document.getElementById("gabeFotoRow"); if(r) r.style.display="none";
    var l=document.getElementById("gabeList"); if(l) l.style.display="none";
    var o=document.getElementById("gabeOpen");
    if(!o) return;
    o.style.display="block";
    o.innerHTML=
      '<div class="card">'+
      '<p class="meta">'+String(e.t||"")+'</p>'+
      '<input id="gTitel" value="'+String(e.titel||"").replace(/"/g,"")+'">'+
      '<textarea id="gNote">'+String(e.note||"").replace(/</g,"")+'</textarea>'+
      '<div id="gShots" class="shots"></div>'+
      '<div class="row">'+
      '<button type="button" class="btn ghost" id="gBack">Liste</button>'+
      '<button type="button" class="btn primary" id="gSave">Speichern</button>'+
      '</div>'+
      '<div class="row"><button type="button" class="btn ghost" id="gDel">Löschen</button></div>'+
      '</div>'+
      '<div class="row"><button type="button" class="btn ghost" id="gFoto">Foto dazu</button></div>';
    function shots(){
      var sh=document.getElementById("gShots"); if(!sh) return;
      sh.innerHTML="";
      function add(src){ if(!src) return; var img=document.createElement("img"); img.src=src; sh.appendChild(img); }
      if(e.img) add(e.img);
      if(window._picMemo[id]) add(window._picMemo[id]);
      if(typeof fotoGet==="function") fotoGet(id).then(function(a){ (a||[]).forEach(add); });
    }
    shots();
    document.getElementById("gBack").onclick=function(){ showList(); };
    document.getElementById("gSave").onclick=function(){
      var d=read();
      var x=(d.log||[]).filter(function(z){ return String(z.id)===String(id); })[0];
      if(x){
        x.titel=((document.getElementById("gTitel")||{}).value||"Gabe").trim()||"Gabe";
        x.note=((document.getElementById("gNote")||{}).value||"").trim();
        x.kind="gabe";
        persist(d);
      }
      showList();
    };
    document.getElementById("gDel").onclick=function(){
      if(!confirm("Diese Gabe löschen?")) return;
      var d=read();
      d.log=(d.log||[]).filter(function(z){ return String(z.id)!==String(id); });
      persist(d);
      showList();
    };
    document.getElementById("gFoto").onclick=function(){
      var inp=ensureFile();
      var old=inp.onchange;
      inp.onchange=function(){
        var f=inp.files && inp.files[0];
        inp.value="";
        inp.onchange=old;
        if(!f) return;
        var use=function(data){
          if(!data) return;
          window._picMemo[id]=data;
          if(typeof fotoPut==="function") fotoPut(id,[data]);
          var d=read();
          var x=(d.log||[]).filter(function(z){ return String(z.id)===String(id); })[0];
          if(x){ x.kind="gabe"; x.pics=1; persist(d); e=x; }
          shots();
        };
        if(typeof compressPic==="function") Promise.resolve(compressPic(f)).then(function(d){ if(d) use(d); });
        else {
          var r=new FileReader();
          r.onload=function(){ use(String(r.result||"")); };
          r.readAsDataURL(f);
        }
      };
      try{ inp.click(); }catch(err){}
    };
  }

  function ablegen(){
    var titel=((document.getElementById("opferTitel")||{}).value||"").trim();
    var t=((document.getElementById("opferT")||{}).value||"").trim();
    var msg=document.getElementById("opferMsg");
    if(!titel && !t && !hold){
      if(msg) msg.textContent="Titel, Wort oder Foto.";
      return;
    }
    var d=read();
    if(!d || typeof d!=="object") d={log:[],planned:[]};
    d.log=d.log||[]; d.planned=d.planned||[];
    var id=nid();
    var e={id:id,t:when(),titel:titel||"Gabe",wer:"",note:t,wesen:false,kind:"gabe"};
    if(hold) e.pics=1;
    d.log.unshift(e);
    var ok=persist(d);
    if(!ok){
      if(msg) msg.textContent="Speicher voll. Text ohne Foto nochmals versuchen.";
      return;
    }
    if(hold){
      window._picMemo[id]=hold;
      if(typeof fotoPut==="function"){
        Promise.resolve(fotoPut(id,[hold])).catch(function(){});
      }
    }
    wipe();
    if(msg) msg.textContent="Gespeichert.";
    showList();
    setTimeout(function(){ if(msg && msg.textContent==="Gespeichert.") msg.textContent=""; }, 2200);
  }

  function mount(){
    var box=document.getElementById("opfer");
    if(!box) return;
    if(!box.querySelector("#gabeFix")){
      box.innerHTML=
        '<div class="hero"><h2>Gabe</h2></div>'+
        '<div id="gabeNew" class="card" data-id="gabeFix">'+
        '<input id="opferTitel" placeholder="Titel" autocomplete="off">'+
        '<textarea id="opferT" placeholder="Was du gibst. Für wen. Warum."></textarea>'+
        '<div id="opferPrev" class="shots"></div>'+
        '<div class="row">'+
        '<button type="button" class="btn ghost" id="opferFoto">Foto</button>'+
        '<button type="button" class="btn primary" id="opferGo">Speichern</button>'+
        '</div>'+
        '</div>'+
        '<p class="msg" id="opferMsg"></p>'+
        '<div id="gabeList"></div>'+
        '<div id="gabeOpen"></div>'+
        '<span id="gabeFix" hidden></span>';
    }
    ensureFile();
    preview();
    paintList();
    var foto=document.getElementById("opferFoto");
    var go=document.getElementById("opferGo");
    if(foto) foto.onclick=function(ev){ ev.preventDefault(); pick(); };
    if(go) go.onclick=function(ev){ ev.preventDefault(); ablegen(); };
  }

  document.addEventListener("click", function(e){
    if(!e.target || !e.target.closest) return;
    if(e.target.closest("#opferFoto")){ e.preventDefault(); pick(); }
    if(e.target.closest("#opferGo")){ e.preventDefault(); ablegen(); }
  }, true);

  if(typeof show==="function" && !show._gabefix){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="opfer") setTimeout(mount, 0);
      return r;
    };
    show._gabefix=1;
  }
  mount();
  setTimeout(mount, 80);
})();
