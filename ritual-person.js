(function(){
  var KEY="rr25_wer";
  var PKEY="rr25_personen";
  function esc(s){ return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function uid(){ return Date.now().toString(36)+Math.random().toString(36).slice(2,6); }
  function norm(a){
    if(!Array.isArray(a)) return [];
    return a.map(function(x){
      if(typeof x==="string") return {id:uid(),name:x,born:"",note:"",pic:""};
      return {id:x.id||uid(),name:(x.name||"").trim(),born:x.born||"",note:x.note||"",pic:x.pic||""};
    }).filter(function(x){ return x.name; });
  }
  function list(){
    try{ return norm(JSON.parse(localStorage.getItem(PKEY)||"[]")); }
    catch(e){ return []; }
  }
  function store(a){ localStorage.setItem(PKEY, JSON.stringify(a.slice(0,24))); }
  function getP(){ return (localStorage.getItem(KEY)||"").trim(); }
  function setP(n){ if(n) localStorage.setItem(KEY,n); else localStorage.removeItem(KEY); }
  function active(){
    var n=getP();
    return list().find(function(p){ return p.name===n; })||(n?{id:"",name:n,born:"",note:"",pic:""}:null);
  }
  function saveOne(p){
    if(!p||!p.name) return;
    p.name=p.name.trim();
    setP(p.name);
    var a=list().filter(function(x){ return x.name.toLowerCase()!==p.name.toLowerCase() && x.id!==p.id; });
    if(!p.id) p.id=uid();
    a.unshift(p);
    store(a);
    paint();
  }
  function drop(id){
    var gone=list().find(function(x){ return x.id===id; });
    store(list().filter(function(x){ return x.id!==id; }));
    if(gone && getP()===gone.name) setP("");
    paint();
  }
  function shrink(file, cb){
    var r=new FileReader();
    r.onload=function(){
      var img=new Image();
      img.onload=function(){
        var c=document.createElement("canvas");
        var w=img.width,h=img.height,max=360;
        if(w>h && w>max){ h=Math.round(h*max/w); w=max; }
        else if(h>max){ w=Math.round(w*max/h); h=max; }
        c.width=w; c.height=h;
        c.getContext("2d").drawImage(img,0,0,w,h);
        cb(c.toDataURL("image/jpeg",0.62));
      };
      img.src=r.result;
    };
    r.readAsDataURL(file);
  }
  function readForm(){
    return {
      id:(document.getElementById("personId")||{}).value||"",
      name:((document.getElementById("personIn")||{}).value||"").trim(),
      born:((document.getElementById("personBorn")||{}).value||"").trim(),
      note:((document.getElementById("personNote")||{}).value||"").trim(),
      pic:((document.getElementById("personPicVal")||{}).value||"")
    };
  }
  function fillForm(p){
    p=p||{id:"",name:"",born:"",note:"",pic:""};
    var id=document.getElementById("personId");
    var n=document.getElementById("personIn");
    var b=document.getElementById("personBorn");
    var t=document.getElementById("personNote");
    var v=document.getElementById("personPicVal");
    var img=document.getElementById("personPic");
    if(id) id.value=p.id||"";
    if(n) n.value=p.name||"";
    if(b) b.value=p.born||"";
    if(t) t.value=p.note||"";
    if(v) v.value=p.pic||"";
    if(img){
      if(p.pic){ img.src=p.pic; img.style.display="block"; }
      else { img.removeAttribute("src"); img.style.display="none"; }
    }
  }
  function paint(){
    var cur=document.getElementById("personCur");
    var a=active();
    if(cur) cur.textContent=a?a.name:"noch niemand aktiv";
    var box=document.getElementById("personList");
    if(!box) return;
    var rows=list();
    if(!rows.length){ box.innerHTML="<p class='sub'>Keine Person gespeichert.</p>"; return; }
    box.innerHTML=rows.map(function(p){
      var meta=[p.born,p.note].filter(Boolean).join(" · ");
      return '<div class="entry">'+
        (p.pic?'<img alt="" src="'+p.pic+'" style="width:3.2rem;height:3.2rem;object-fit:cover;border-radius:.7rem;float:right;margin:0 0 .4rem .4rem;border:1px solid rgba(255,122,217,.35)">':'')+
        '<b>'+esc(p.name)+'</b>'+
        (meta?'<div class="meta">'+esc(meta)+'</div>':'')+
        '<div class="row" style="margin-top:.4rem;clear:both">'+
        '<button type="button" class="btn primary" data-take="'+p.id+'">Aktiv</button>'+
        '<button type="button" class="btn ghost" data-edit="'+p.id+'">Öffnen</button>'+
        '<button type="button" class="btn ghost" data-del="'+p.id+'">Löschen</button>'+
        '</div></div>';
    }).join("");
  }
  function fillInputs(){
    var n=getP();
    if(!n) return;
    document.querySelectorAll('#run input[data-k="Name"],#run input[placeholder="Name"],#plW').forEach(function(inp){
      if(!inp.value.trim()){
        inp.value=n;
        inp.dispatchEvent(new Event("input"));
      }
    });
  }
  function screen(){
    if(document.getElementById("person")) return;
    var main=document.querySelector("main");
    if(!main) return;
    var s=document.createElement("section");
    s.className="screen"; s.id="person";
    s.innerHTML=
      '<div class="hero"><h2>Person X</h2><p class="sub">Anker · Foto · Datum · Notiz</p></div>'+
      '<div class="card">'+
      '<p class="meta">Aktiv</p><p id="personCur"></p>'+
      '<input id="personId" type="hidden">'+
      '<input id="personPicVal" type="hidden">'+
      '<img id="personPic" alt="" style="display:none;width:5.2rem;height:5.2rem;object-fit:cover;border-radius:1rem;border:1px solid rgba(255,122,217,.45);margin:.2rem 0">'+
      '<input id="personIn" placeholder="Name">'+
      '<input id="personBorn" type="date">'+
      '<textarea id="personNote" placeholder="Anker / Notiz"></textarea>'+
      '<div class="row">'+
      '<button type="button" class="btn ghost" id="personFoto">Foto</button>'+
      '<button type="button" class="btn primary" id="personAdd">Merken</button>'+
      '</div>'+
      '<input id="personFile" type="file" accept="image/*" hidden>'+
      '</div>'+
      '<div id="personList"></div>';
    main.appendChild(s);
  }
  function nav(){
    var nav=document.querySelector("nav");
    if(!nav||nav.querySelector('[data-v="person"]')) return;
    var b=document.createElement("button");
    b.type="button"; b.setAttribute("data-v","person");
    b.innerHTML='<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.2"/><path d="M6 19c.8-3.2 3-5 6-5s5.2 1.8 6 5"/></svg>Person';
    var first=nav.querySelector('[data-v="geplant"]');
    if(first) nav.insertBefore(b, first); else nav.appendChild(b);
    var st=document.createElement("style");
    st.textContent="nav{grid-template-columns:repeat(6,1fr)!important}#person .sub{display:block!important;letter-spacing:.12em;text-transform:uppercase;font-size:.64rem}";
    document.head.appendChild(st);
  }
  document.addEventListener("click",function(e){
    var t=e.target;
    if(!t) return;
    if(t.id==="personFoto"){
      var f=document.getElementById("personFile");
      if(f) f.click();
    }
    if(t.id==="personAdd") saveOne(readForm());
    var take=t.closest&&t.closest("[data-take]");
    if(take){
      var p=list().find(function(x){ return x.id===take.getAttribute("data-take"); });
      if(p){ setP(p.name); fillForm(p); paint(); }
    }
    var ed=t.closest&&t.closest("[data-edit]");
    if(ed){
      var q=list().find(function(x){ return x.id===ed.getAttribute("data-edit"); });
      if(q) fillForm(q);
    }
    var del=t.closest&&t.closest("[data-del]");
    if(del) drop(del.getAttribute("data-del"));
    setTimeout(function(){
      var box=document.getElementById("run");
      if(!box||!box.classList.contains("on")) return;
      if(document.getElementById("werTake")) return;
      var inp=box.querySelector('input[data-k="Name"],input[placeholder="Name"]');
      if(!inp) return;
      var n=getP();
      var b=document.createElement("button");
      b.type="button"; b.id="werTake"; b.className="btn ghost";
      b.style.margin=".35rem 0 .1rem";
      b.textContent=n? (n+" übernehmen") : "Person merken";
      inp.parentNode.insertBefore(b, inp.nextSibling);
      b.onclick=function(){
        if(n){ inp.value=n; inp.dispatchEvent(new Event("input")); }
        else if(inp.value.trim()){ saveOne({name:inp.value.trim()}); b.textContent=inp.value.trim()+" gemerkt"; }
      };
      inp.addEventListener("blur",function(){ if(inp.value.trim()) saveOne({name:inp.value.trim(),id:"",born:"",note:"",pic:""}); });
      fillInputs();
    },80);
  },true);
  document.addEventListener("change",function(e){
    if(!e.target||e.target.id!=="personFile"||!e.target.files[0]) return;
    shrink(e.target.files[0], function(url){
      var v=document.getElementById("personPicVal");
      var img=document.getElementById("personPic");
      if(v) v.value=url;
      if(img){ img.src=url; img.style.display="block"; }
    });
  });
  if(typeof show==="function"){
    var _show=show;
    show=function(id){
      var r=_show.apply(this,arguments);
      if(id==="person"){ paint(); var a=active(); if(a) fillForm(a); }
      if(id==="run"||id==="geplant") fillInputs();
      return r;
    };
  }
  screen();
  nav();
  paint();
})();
