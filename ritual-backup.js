(function(){
  if(window.__rr25bak) return;
  window.__rr25bak=1;
  var BAK="rr25_pack_bak";
  var WHEN="rr25_bak_at";
  var WEEK=7*24*60*60*1000;

  function get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
  function mark(){ set(WHEN, String(Date.now())); }

  function pack(){
    var p={v:4,t:new Date().toISOString()};
    var names=["rr25_ritual_v1","rr25_notiz_v1","rr25_wer","rr25_personen","rr25_369","rr25_dank","rr25_kleid"];
    var i,k;
    for(i=0;i<localStorage.length;i++){
      k=localStorage.key(i);
      if(k && k.indexOf("rr25")===0 && k!==BAK && names.indexOf(k)<0) names.push(k);
    }
    names.forEach(function(key){
      var v=get(key);
      if(v!=null && v!=="") p[key]=v;
    });
    if(typeof load==="function" && !p.rr25_ritual_v1){
      try{ p.rr25_ritual_v1=JSON.stringify(load()); }catch(e){}
    }
    if(typeof loadNotes==="function" && !p.rr25_notiz_v1){
      try{ p.rr25_notiz_v1=JSON.stringify(loadNotes()); }catch(e){}
    }
    return p;
  }
  function counts(p){
    var log=0, notes=0, plan=0;
    try{ var d=JSON.parse(p.rr25_ritual_v1||"{}"); log=(d.log||[]).length; plan=(d.planned||[]).length; }catch(e){}
    try{ var n=JSON.parse(p.rr25_notiz_v1||"[]"); notes=Array.isArray(n)?n.length:0; }catch(e){}
    return {log:log,notes:notes,plan:plan};
  }
  function apply(p){
    if(!p||typeof p!=="object") return false;
    if(p.rr25 && !p.rr25_ritual_v1) p.rr25_ritual_v1=typeof p.rr25==="string"?p.rr25:JSON.stringify(p.rr25);
    var n=0;
    Object.keys(p).forEach(function(k){
      if(k==="v"||k==="t"||k==="rr25") return;
      if(p[k]==null) return;
      set(k, typeof p[k]==="string"?p[k]:JSON.stringify(p[k]));
      n++;
    });
    return n>0;
  }
  function snap(){ try{ set(BAK, JSON.stringify(pack())); }catch(e){} }
  try{ if(!get("rr25_ritual_v1")){ var raw=get(BAK); if(raw) apply(JSON.parse(raw)); } }catch(e){}
  if(typeof save==="function"){ var _s=save; save=function(d){ _s(d); snap(); }; }
  if(typeof saveNotes==="function"){ var _n=saveNotes; saveNotes=function(a){ _n(a); snap(); }; }
  snap();

  function stale(){
    var t=parseInt(get(WHEN)||"0",10);
    if(!t) return true;
    return (Date.now()-t)>WEEK;
  }
  function hint(host){
    if(!host) return;
    var old=host.querySelector("#bakHint");
    if(old) old.remove();
    if(!stale()) return;
    var p=document.createElement("p");
    p.id="bakHint";
    p.className="meta";
    p.textContent="Sicherung steht an.";
    p.style.margin="0 0 .45rem";
    var bar=host.querySelector(".bakBar");
    if(bar&&bar.nextSibling) host.insertBefore(p, bar.nextSibling);
    else if(bar) bar.parentNode.appendChild(p);
  }
  function fname(){
    var n=new Date();
    var m=String(n.getMonth()+1).padStart(2,"0");
    var d=String(n.getDate()).padStart(2,"0");
    return "RR25-Sicherung-"+n.getFullYear()+"-"+m+"-"+d+".json";
  }
  function linkOut(raw){
    var blob=new Blob([raw],{type:"application/json"});
    var a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download=fname();
    a.rel="noopener";
    document.body.appendChild(a);
    a.click();
    setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 1200);
  }
  function fileOut(){
    snap();
    mark();
    var raw=JSON.stringify(pack());
    var name=fname();
    try{
      var file=new File([raw], name, {type:"application/json"});
      if(navigator.canShare && navigator.canShare({files:[file]}) && navigator.share){
        navigator.share({files:[file], title:name}).catch(function(){ linkOut(raw); });
        hint(document.getElementById("log"));
        hint(document.getElementById("notiz"));
        return;
      }
    }catch(e){}
    try{ linkOut(raw); }catch(e2){ pane(raw, counts(pack()), "out"); }
    hint(document.getElementById("log"));
    hint(document.getElementById("notiz"));
  }
  function fileIn(){
    var inp=document.createElement("input");
    inp.type="file"; inp.accept="application/json,.json,text/plain";
    inp.onchange=function(ev){
      var f=ev.target.files && ev.target.files[0];
      if(!f) return;
      var r=new FileReader();
      r.onload=function(){
        try{
          var p=JSON.parse(String(r.result||"").trim());
          if(!apply(p)) throw new Error("leer");
          snap(); mark();
          var k=counts(p);
          alert("Drin: Chronik "+k.log+", Notizen "+k.notes);
          if(typeof paintLog==="function") paintLog();
          if(typeof paintNotes==="function") paintNotes();
          hint(document.getElementById("log"));
          hint(document.getElementById("notiz"));
        }catch(err){ alert("Datei nicht lesbar."); }
      };
      r.readAsText(f);
    };
    inp.click();
  }

  function pane(raw,c,mode){
    var old=document.getElementById("bakPane");
    if(old) old.remove();
    var box=document.createElement("div");
    box.id="bakPane";
    box.className="card";
    if(mode==="out"){
      box.innerHTML='<p class="sub">Sicherung · Chronik '+c.log+' · Notizen '+c.notes+'</p>'+
        '<textarea id="bakTx" readonly></textarea>'+
        '<div class="row"><button type="button" class="btn primary" id="bakCopy">Kopieren</button>'+
        '<button type="button" class="btn ghost" id="bakClose">Zu</button></div>';
    } else {
      box.innerHTML='<p class="sub">Sicherung hier einfügen</p>'+
        '<textarea id="bakTx" placeholder="Text hier rein"></textarea>'+
        '<div class="row"><button type="button" class="btn primary" id="bakGo">Übernehmen</button>'+
        '<button type="button" class="btn ghost" id="bakClose">Zu</button></div>';
    }
    var host=document.getElementById("log")||document.getElementById("notiz");
    if(!host) return;
    var bar=host.querySelector(".bakBar");
    if(bar&&bar.nextSibling) host.insertBefore(box, bar.nextSibling);
    else host.insertBefore(box, host.firstChild);
    var tx=box.querySelector("#bakTx");
    if(mode==="out") tx.value=raw||"";
    var copy=box.querySelector("#bakCopy");
    if(copy) copy.onclick=function(){
      tx.focus(); tx.select();
      var ok=false;
      try{ if(navigator.clipboard){ navigator.clipboard.writeText(tx.value); ok=true; } }catch(e){}
      try{ if(!ok) ok=document.execCommand("copy"); }catch(e){}
      if(ok) mark();
      copy.textContent=ok?"Kopiert":"Markieren und kopieren";
      hint(document.getElementById("log"));
      hint(document.getElementById("notiz"));
    };
    var go=box.querySelector("#bakGo");
    if(go) go.onclick=function(){
      try{
        var p=JSON.parse((tx.value||"").trim());
        if(!apply(p)) throw new Error("leer");
        snap();
        mark();
        var k=counts(p);
        alert("Drin: Chronik "+k.log+", Notizen "+k.notes);
        box.remove();
        if(typeof paintLog==="function") paintLog();
        if(typeof paintNotes==="function") paintNotes();
        hint(document.getElementById("log"));
        hint(document.getElementById("notiz"));
      }catch(e){ alert("Text nicht lesbar. Ganzen Sicherungstext einfügen."); }
    };
    box.querySelector("#bakClose").onclick=function(){ box.remove(); };
  }

  function dump(){
    snap();
    mark();
    var p=pack();
    var c=counts(p);
    pane(JSON.stringify(p), c, "out");
    hint(document.getElementById("log"));
    hint(document.getElementById("notiz"));
  }
  function openIn(){ pane("", {log:0,notes:0,plan:0}, "in"); }

  function bar(host){
    if(!host||host.querySelector(".bakBar")) return;
    var box=document.createElement("div");
    box.className="bakBar";
    box.style.margin=".15rem 0 .55rem";
    box.innerHTML='<div class="row" style="margin:0">'+
      '<button type="button" class="btn ghost bakOut">Text</button>'+
      '<button type="button" class="btn ghost bakFile">Datei</button>'+
      '<button type="button" class="btn ghost bakIn">Einfügen</button></div>';
    var hero=host.querySelector(".hero");
    if(hero&&hero.nextSibling) host.insertBefore(box, hero.nextSibling);
    else host.insertBefore(box, host.firstChild);
    box.querySelector(".bakOut").onclick=dump;
    box.querySelector(".bakFile").onclick=fileOut;
    box.querySelector(".bakIn").onclick=function(){
      if(confirm("Datei vom Handy nehmen?")) fileIn();
      else openIn();
    };
  }
  function place(){
    bar(document.getElementById("log"));
    bar(document.getElementById("notiz"));
    hint(document.getElementById("log"));
    hint(document.getElementById("notiz"));
  }
  var st=document.createElement("style");
  st.textContent="#bakPane{margin:.2rem 0 .8rem}#bakTx{min-height:8rem;font-size:.68rem}#bakHint{color:#c4a4d6}";
  document.head.appendChild(st);
  if(typeof show==="function"){
    var _show=show;
    show=function(id){ var r=_show.apply(this,arguments); if(id==="log"||id==="notiz") place(); return r; };
  }
  place();
})();
