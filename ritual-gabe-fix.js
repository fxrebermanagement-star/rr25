(function(){
  window._picMemo=window._picMemo||{};
  var hold="";
  var bound=false;

  function read(){
    try{ return (typeof load==="function"?load():JSON.parse(localStorage.getItem("rr25_ritual_v1")||"{}"))||{}; }
    catch(e){ return {log:[],planned:[]}; }
  }
  function persist(d){
    d=d||{}; d.log=d.log||[]; d.planned=d.planned||[];
    d.log=d.log.map(function(e){
      if(!e) return e;
      if(e.img){
        window._picMemo[e.id]=e.img;
        if(typeof fotoPut==="function") try{ fotoPut(e.id,[e.img]); }catch(err){}
        var x={}; Object.keys(e).forEach(function(k){ if(k!=="img") x[k]=e[k]; });
        x.pics=1; return x;
      }
      return e;
    });
    try{
      localStorage.setItem("rr25_ritual_v1", JSON.stringify(d));
      if(typeof save==="function") try{ save(d); }catch(e){}
      return true;
    }catch(e){
      try{ localStorage.setItem("rr25_ritual_v1", JSON.stringify({log:d.log,planned:d.planned})); return true; }
      catch(e2){ return false; }
    }
  }
  function nid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,6); }
  function when(){ try{ return new Date().toLocaleString("de-CH"); }catch(e){ return ""; } }
  function isGabe(e){
    if(!e) return false;
    if(e.kind==="gabe") return true;
    var t=String(e.titel||"").toLowerCase();
    return t==="gabe"||t==="opfer"||t==="opfergabe";
  }
  window._isGabe=isGabe;
  function raw(f,go){
    var r=new FileReader();
    r.onload=function(){ go(String(r.result||"")); };
    r.readAsDataURL(f);
  }
  function say(t){ var m=document.getElementById("opferMsg"); if(m) m.textContent=t||""; }

  function pick(done){
    var inp=document.createElement("input");
    inp.type="file";
    inp.accept="image/*";
    inp.setAttribute("capture","environment");
    inp.style.cssText="position:fixed;left:0;bottom:0;width:1px;height:1px;opacity:0";
    document.body.appendChild(inp);
    inp.onchange=function(){
      var f=inp.files && inp.files[0];
      try{ inp.remove(); }catch(e){}
      if(!f) return;
      var go=function(data){
        if(!data) return;
        if(done) done(data);
        else {
          hold=data;
          var prev=document.getElementById("opferPrev");
          if(prev) prev.innerHTML='<img alt="" src="'+data+'">';
          say("Foto bereit.");
        }
      };
      if(typeof compressPic==="function"){
        Promise.resolve(compressPic(f)).then(function(d){ if(d) go(d); else raw(f,go); });
      } else raw(f,go);
    };
    inp.click();
  }

  function layout(){
    var box=document.getElementById("opfer");
    if(!box) return;
    if(!document.getElementById("opferTitel")){
      var card=box.querySelector(".card")||box;
      var inp=document.createElement("input");
      inp.id="opferTitel";
      inp.placeholder="Titel";
      inp.autocomplete="off";
      var ta=document.getElementById("opferT");
      if(ta && ta.parentNode) ta.parentNode.insertBefore(inp, ta);
      else card.insertBefore(inp, card.firstChild);
    }
    if(!document.getElementById("opferPrev")){
      var p=document.createElement("div"); p.id="opferPrev"; p.className="shots";
      var ta=document.getElementById("opferT");
      if(ta&&ta.parentNode) ta.parentNode.insertBefore(p, ta.nextSibling);
    }
    if(!document.getElementById("opferMsg")){
      var msg=document.createElement("p"); msg.className="msg"; msg.id="opferMsg"; box.appendChild(msg);
    }
    if(!document.getElementById("gabeList")){
      var list=document.createElement("div"); list.id="gabeList"; box.appendChild(list);
    }
    if(!document.getElementById("gabeOpen")){
      var op=document.createElement("div"); op.id="gabeOpen"; box.appendChild(op);
    }
    var go=document.getElementById("opferGo");
    if(go) go.textContent="Ablegen";
    paintList();
  }

  function wipe(){
    hold="";
    var t=document.getElementById("opferTitel"); if(t) t.value="";
    var a=document.getElementById("opferT"); if(a) a.value="";
    var prev=document.getElementById("opferPrev"); if(prev) prev.innerHTML="";
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
      function put(src){
        if(!src||cell.querySelector("img")) return;
        var img=document.createElement("img"); img.src=src; cell.appendChild(img);
      }
      if(e.img) put(e.img);
      if(window._picMemo[e.id]) put(window._picMemo[e.id]);
      if(typeof fotoGet==="function") fotoGet(e.id).then(function(a){ if(a&&a[0]) put(a[0]); });
    });
  }

  function showList(){
    var n=document.getElementById("gabeNew")||document.querySelector("#opfer .card");
    if(n) n.style.display="block";
    var l=document.getElementById("gabeList"); if(l) l.style.display="block";
    var o=document.getElementById("gabeOpen"); if(o){ o.style.display="none"; o.innerHTML=""; }
    paintList();
  }

  function openOne(id){
    var e=(read().log||[]).filter(function(x){ return String(x.id)===String(id); })[0];
    if(!e){ showList(); return; }
    var n=document.querySelector("#opfer .card"); if(n) n.style.display="none";
    var l=document.getElementById("gabeList"); if(l) l.style.display="none";
    var o=document.getElementById("gabeOpen"); if(!o) return;
    o.style.display="block";
    o.innerHTML='<div class="card"><p class="meta">'+String(e.t||"")+'</p>'+
      '<input id="gTitel" value="'+String(e.titel||"").replace(/"/g,"")+'">'+
      '<textarea id="gNote">'+String(e.note||"").replace(/</g,"")+'</textarea>'+
      '<div id="gShots" class="shots"></div>'+
      '<div class="row"><button type="button" class="btn ghost" id="gBack">Liste</button>'+
      '<button type="button" class="btn primary" id="gSave">Ablegen</button></div>'+
      '<div class="row"><button type="button" class="btn ghost" id="gDel">Löschen</button></div></div>'+
      '<div class="row"><button type="button" class="btn ghost" id="gFoto">Foto dazu</button></div>';
    function shots(){
      var sh=document.getElementById("gShots"); if(!sh) return; sh.innerHTML="";
      function add(src){ if(!src) return; var img=document.createElement("img"); img.src=src; sh.appendChild(img); }
      if(e.img) add(e.img);
      if(window._picMemo[id]) add(window._picMemo[id]);
      if(typeof fotoGet==="function") fotoGet(id).then(function(a){ (a||[]).forEach(add); });
    }
    shots();
    document.getElementById("gBack").onclick=showList;
    document.getElementById("gSave").onclick=function(){
      var d=read();
      var x=(d.log||[]).filter(function(z){ return String(z.id)===String(id); })[0];
      if(x){
        x.titel=((document.getElementById("gTitel")||{}).value||"Gabe").trim()||"Gabe";
        x.note=((document.getElementById("gNote")||{}).value||"").trim();
        x.kind="gabe"; persist(d);
      }
      showList();
    };
    document.getElementById("gDel").onclick=function(){
      if(!confirm("Diese Gabe löschen?")) return;
      var d=read(); d.log=(d.log||[]).filter(function(z){ return String(z.id)!==String(id); }); persist(d); showList();
    };
    document.getElementById("gFoto").onclick=function(){
      pick(function(data){
        window._picMemo[id]=data;
        if(typeof fotoPut==="function") try{ fotoPut(id,[data]); }catch(err){}
        var d=read();
        var x=(d.log||[]).filter(function(z){ return String(z.id)===String(id); })[0];
        if(x){ x.kind="gabe"; x.pics=1; persist(d); e=x; }
        shots();
      });
    };
  }

  function ablegen(){
    var titel=((document.getElementById("opferTitel")||{}).value||"").trim();
    var t=((document.getElementById("opferT")||{}).value||"").trim();
    if(!titel && !t && !hold){ say("Titel, Wort oder Foto."); return; }
    var d=read();
    d.log=d.log||[]; d.planned=d.planned||[];
    var id=nid();
    d.log.unshift({id:id,t:when(),titel:titel||"Gabe",wer:"",note:t,wesen:false,kind:"gabe",pics:hold?1:0});
    if(!persist(d)){ say("Speicher voll."); return; }
    if(hold){
      window._picMemo[id]=hold;
      if(typeof fotoPut==="function") try{ fotoPut(id,[hold]); }catch(e){}
    }
    wipe();
    say("Abgelegt.");
    showList();
    setTimeout(function(){ say(""); }, 2200);
  }

  if(!bound){
    bound=true;
    document.addEventListener("click", function(e){
      if(!e.target || !e.target.closest) return;
      if(e.target.closest("#opferFoto")){ e.preventDefault(); e.stopPropagation(); pick(); }
      if(e.target.closest("#opferGo")){ e.preventDefault(); e.stopPropagation(); ablegen(); }
    }, true);
  }

  if(typeof show==="function" && !show._gabefix2){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="opfer") layout();
      return r;
    };
    show._gabefix2=1;
  }
  layout();
})();
