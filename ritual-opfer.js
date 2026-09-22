(function(){
  var s=document.createElement("style");
  s.textContent=[
    "#under{display:none!important}",
    "#kasten{display:block!important;visibility:visible!important;height:auto!important;overflow:visible!important;margin:0 0 .35rem!important}",
    "#home .duo{display:grid!important;grid-template-columns:1fr 1fr!important;gap:.4rem!important}",
    "#kOut,#sigilBox{display:block!important;aspect-ratio:1/1!important;max-height:none!important;min-height:9.2rem!important}",
    "#tools{display:grid!important;grid-template-columns:repeat(4,1fr)!important;margin-top:.4rem!important}",
    "#sigRow{display:grid!important}",
    "#list:empty{display:none}"
  ].join("");
  document.head.appendChild(s);
  var home=document.getElementById("home");
  var kast=document.getElementById("kasten");
  if(home && kast && home.firstChild!==kast) home.insertBefore(kast, home.firstChild);
  try{ cat=""; }catch(e){}
  if(typeof renderList==="function" && !renderList._start){
    var rl=renderList;
    renderList=function(){
      var list=document.getElementById("list");
      var cats=document.getElementById("cats");
      if(!cat || cat==="Alle" || cat==="Alltag"){
        cat="";
        rl();
        if(list) list.innerHTML="";
        if(cats) cats.querySelectorAll(".chip").forEach(function(b){ b.classList.remove("on"); });
      } else rl();
    };
    renderList._start=1;
  }
  if(typeof renderList==="function") try{ renderList(); }catch(e){}
})();
(function(){
  var pic="";
  var persist=typeof save==="function"?save:function(){};
  var read=typeof load==="function"?load:function(){ return {log:[]}; };
  function nid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,6); }
  function when(){
    if(typeof now==="function") return now();
    return new Date().toLocaleString("de-CH");
  }
  function isGabe(e){
    if(!e) return false;
    if(e.kind==="gabe") return true;
    var t=String(e.titel||"").toLowerCase();
    return t==="gabe" || t==="opfer" || t==="opfergabe";
  }
  window._isGabe=isGabe;
  function takePic(done){
    if(typeof openPicPicker==="function"){ openPicPicker(done); return; }
    var inp=document.createElement("input");
    inp.type="file"; inp.accept="image/*";
    inp.style.cssText="position:fixed;left:-9999px;opacity:0";
    document.body.appendChild(inp);
    inp.onchange=function(ev){
      var f=ev.target.files && ev.target.files[0];
      try{ inp.remove(); }catch(e){}
      if(!f) return;
      var go=function(data){ if(data) done(data); };
      if(typeof compressPic==="function") compressPic(f).then(function(d){
        if(d) go(d);
        else {
          var r=new FileReader();
          r.onload=function(){ go(String(r.result||"")); };
          r.readAsDataURL(f);
        }
      });
      else {
        var r=new FileReader();
        r.onload=function(){ go(String(r.result||"")); };
        r.readAsDataURL(f);
      }
    };
    setTimeout(function(){ inp.click(); }, 30);
  }
  function form(){
    var box=document.getElementById("opfer");
    if(!box) return;
    if(!box.querySelector("#opferTitel")){
      box.innerHTML=
        '<div class="hero"><h2>Gabe</h2></div>'+
        '<div id="gabeNew" class="card">'+
        '<input id="opferTitel" placeholder="Titel" autocomplete="off">'+
        '<textarea id="opferT" placeholder="Was du gibst. Für wen. Warum."></textarea>'+
        '<div id="opferPrev" class="shots"></div>'+
        '<div class="row">'+
        '<button type="button" class="btn ghost" id="opferList">Liste</button>'+
        '<button type="button" class="btn primary" id="opferGo">Speichern</button>'+
        '</div>'+
        '</div>'+
        '<div class="row" id="gabeFotoRow"><button type="button" class="btn ghost" id="opferFoto">Foto dazu</button></div>'+
        '<p class="msg" id="opferMsg"></p>'+
        '<div id="gabeList"></div>'+
        '<div id="gabeOpen"></div>';
    }
    if(!box.querySelector("#gabeList")){
      var hold=document.createElement("div"); hold.id="gabeList"; box.appendChild(hold);
    }
    if(!box.querySelector("#gabeOpen")){
      var op=document.createElement("div"); op.id="gabeOpen"; box.appendChild(op);
    }
    paintGabe();
  }
  function preview(){
    var el=document.getElementById("opferPrev");
    if(!el) return;
    el.innerHTML=pic?'<img alt="" src="'+pic+'">':'';
  }
  function wipe(){
    pic="";
    var t=document.getElementById("opferTitel"); if(t) t.value="";
    var a=document.getElementById("opferT"); if(a) a.value="";
    preview();
  }
  function showList(){
    var n=document.getElementById("gabeNew"); if(n) n.style.display="block";
    var r=document.getElementById("gabeFotoRow"); if(r) r.style.display="flex";
    var l=document.getElementById("gabeList"); if(l) l.style.display="block";
    var o=document.getElementById("gabeOpen"); if(o){ o.style.display="none"; o.innerHTML=""; }
    paintGabe();
  }
  function paintGabe(){
    var hold=document.getElementById("gabeList");
    if(!hold) return;
    var rows=[];
    try{ rows=(read().log||[]).filter(isGabe); }catch(e){ rows=[]; }
    if(!rows.length){ hold.innerHTML="<p class='meta'>Noch keine Gabe.</p>"; return; }
    hold.innerHTML=rows.map(function(e){
      var note=String(e.note||"");
      if(note.toLowerCase()==="gabe" || note===String(e.titel||"")) note="";
      return '<div class="logrow" data-gid="'+e.id+'">'+ 
        '<div><b>'+String(e.titel||"Gabe").replace(/</g,"")+'</b>'+
        '<div class="meta">'+String(e.t||"")+'</div>'+
        (note?'<p style="margin:.35rem 0 0;white-space:pre-wrap">'+note.replace(/</g,"")+'</p>':'')+
        '<button type="button" class="logact" data-gopen="'+e.id+'">Öffnen</button></div>'+
        '<div class="logpic" data-gpic="'+e.id+'"></div></div>';
    }).join("");
    hold.querySelectorAll("[data-gopen]").forEach(function(b){
      b.onclick=function(ev){ ev.preventDefault(); openGabe(b.getAttribute("data-gopen")); };
    });
    rows.forEach(function(e){
      var cell=hold.querySelector('[data-gpic="'+e.id+'"]');
      if(!cell) return;
      function put(src){
        if(!src||cell.querySelector("img")) return;
        var img=document.createElement("img");
        img.src=src;
        img.onclick=function(){ openGabe(e.id); };
        cell.appendChild(img);
      }
      if(e.img) put(e.img);
      if((window._picMemo||{})[e.id]) put(window._picMemo[e.id]);
      if(typeof fotoGet==="function") fotoGet(e.id).then(function(a){ if(a&&a[0]) put(a[0]); });
    });
  }
  function find(id){
    try{ return (read().log||[]).filter(function(x){ return String(x.id)===String(id); })[0]; }catch(e){ return null; }
  }
  function openGabe(id){
    var e=find(id);
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
      function add(src){
        if(!src) return;
        var img=document.createElement("img"); img.src=src; sh.appendChild(img);
      }
      if(e.img) add(e.img);
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
      takePic(function(data){
        if(!data) return;
        var d=read();
        var x=(d.log||[]).filter(function(z){ return String(z.id)===String(id); })[0];
        if(x){ x.img=data; x.kind="gabe"; persist(d); e=x; }
        if(typeof fotoPut==="function") fotoPut(id,[data]);
        window._picMemo=window._picMemo||{}; window._picMemo[id]=data;
        shots();
      });
    };
  }
  function pick(){
    takePic(function(data){
      pic=data||"";
      preview();
    });
  }
  function ablegen(){
    var titel=((document.getElementById("opferTitel")||{}).value||"").trim();
    var t=((document.getElementById("opferT")||{}).value||"").trim();
    var msg=document.getElementById("opferMsg");
    if(!titel && !t && !pic){
      if(msg) msg.textContent="Titel, Wort oder Foto.";
      return;
    }
    var d=read();
    if(!d || typeof d!=="object") d={log:[],planned:[]};
    d.log=d.log||[]; d.planned=d.planned||[];
    var id=nid();
    var e={id:id,t:when(),titel:titel||"Gabe",wer:"",note:t,wesen:false,kind:"gabe"};
    if(pic) e.img=pic;
    d.log.unshift(e);
    try{ persist(d); }catch(err){
      if(pic){ delete e.img; try{ persist(d); }catch(e2){ if(msg) msg.textContent="Speicher voll."; return; } }
      else { if(msg) msg.textContent="Speicher voll."; return; } }
    }
    if(pic){
      window._picMemo=window._picMemo||{};
      window._picMemo[id]=pic;
      if(typeof fotoPut==="function") fotoPut(id,[pic]);
    }
    wipe();
    if(msg) msg.textContent="Abgelegt.";
    showList();
    setTimeout(function(){ if(msg && msg.textContent==="Abgelegt.") msg.textContent=""; }, 2200);
  }
  form();
  document.addEventListener("click", function(e){
    if(!e.target.closest) return;
    if(e.target.closest("#opferFoto")){ e.preventDefault(); pick(); }
    if(e.target.closest("#opferGo")){ e.preventDefault(); ablegen(); }
    if(e.target.closest("#opferList")){
      e.preventDefault();
      showList();
      var list=document.getElementById("gabeList");
      if(list) list.scrollIntoView({behavior:"smooth",block:"start"});
    }
  });
  if(typeof show==="function" && !show._gabe){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="opfer"){ form(); showList(); }
      return r;
    };
    show._gabe=1;
  }
})();
