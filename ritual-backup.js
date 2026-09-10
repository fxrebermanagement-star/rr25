(function(){
  if(window.__rr25bak) return;
  window.__rr25bak=1;
  var BAK="rr25_pack_bak";

  function get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }
  function set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }

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
    try{
      var d=JSON.parse(p.rr25_ritual_v1||"{}");
      log=(d.log||[]).length;
      plan=(d.planned||[]).length;
    }catch(e){}
    try{
      var n=JSON.parse(p.rr25_notiz_v1||"[]");
      notes=Array.isArray(n)?n.length:0;
    }catch(e){}
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

  function snap(){
    try{ set(BAK, JSON.stringify(pack())); }catch(e){}
  }

  try{
    if(!get("rr25_ritual_v1")){
      var raw=get(BAK);
      if(raw) apply(JSON.parse(raw));
    }
  }catch(e){}

  if(typeof save==="function"){
    var _s=save;
    save=function(d){ _s(d); snap(); };
  }
  if(typeof saveNotes==="function"){
    var _n=saveNotes;
    saveNotes=function(a){ _n(a); snap(); };
  }
  snap();

  function textOf(){
    return JSON.stringify(pack());
  }

  function dump(){
    snap();
    var p=pack();
    var c=counts(p);
    var raw=JSON.stringify(p);
    if(c.log+c.notes+c.plan===0){
      alert("Noch nichts zum Sichern.\nErst ein Ritual oder eine Notiz ablegen.");
      return;
    }
    var file;
    try{ file=new File([raw],"rr25-sicherung.json",{type:"application/json"}); }catch(e){ file=null; }
    if(navigator.share && file && navigator.canShare && navigator.canShare({files:[file]})){
      navigator.share({title:"RR25 Sicherung",text:"Chronik "+c.log+" · Notizen "+c.notes, files:[file]}).catch(function(){ showBox(raw,c); });
      return;
    }
    if(navigator.share){
      navigator.share({title:"RR25 Sicherung",text:raw}).catch(function(){ showBox(raw,c); });
      return;
    }
    showBox(raw,c);
  }

  function showBox(raw,c){
    var old=document.getElementById("bakPane");
    if(old) old.remove();
    var pane=document.createElement("div");
    pane.id="bakPane";
    pane.innerHTML='<p class="sub">Chronik '+c.log+' · Geplant '+c.plan+' · Notizen '+c.notes+'</p>'+
      '<textarea id="bakTx" readonly></textarea>'+
      '<div class="row"><button type="button" class="btn primary" id="bakCopy">Kopieren</button>'+
      '<button type="button" class="btn ghost" id="bakClose">Zu</button></div>';
    var host=document.getElementById("log")||document.getElementById("notiz")||document.body;
    host.insertBefore(pane, host.firstChild);
    var tx=pane.querySelector("#bakTx");
    tx.value=raw;
    pane.querySelector("#bakCopy").onclick=function(){
      tx.select();
      try{ navigator.clipboard.writeText(raw); }catch(e){ document.execCommand("copy"); }
      this.textContent="Kopiert";
    };
    pane.querySelector("#bakClose").onclick=function(){ pane.remove(); };
  }

  function take(file){
    var r=new FileReader();
    r.onload=function(){
      try{
        var p=JSON.parse(String(r.result||""));
        if(!apply(p)) throw new Error("leer");
        snap();
        var c=counts(p);
        alert("Geholt: Chronik "+c.log+", Notizen "+c.notes+".\nSeite einmal neu öffnen.");
      }catch(e){ alert("Datei nicht lesbar"); }
    };
    r.readAsText(file);
  }

  function pasteIn(){
    var raw=prompt("Sicherung hier einfügen");
    if(!raw) return;
    try{
      var p=JSON.parse(raw);
      if(!apply(p)) throw new Error("leer");
      snap();
      alert("Geholt. Seite einmal neu öffnen.");
    }catch(e){ alert("Text nicht lesbar"); }
  }

  function bar(host){
    if(!host||host.querySelector(".bakBar")) return;
    var box=document.createElement("div");
    box.className="row bakBar";
    box.style.margin=".15rem 0 .7rem";
    box.innerHTML='<button type="button" class="btn ghost bakOut">Sichern</button>'+
      '<button type="button" class="btn ghost bakIn">Holen</button>'+
      '<input class="bakFile" type="file" accept="application/json,.json,text/plain" hidden>';
    var hero=host.querySelector(".hero");
    if(hero&&hero.nextSibling) host.insertBefore(box, hero.nextSibling);
    else host.insertBefore(box, host.firstChild);
    box.querySelector(".bakOut").onclick=dump;
    box.querySelector(".bakIn").onclick=function(){
      if(confirm("Datei wählen?\nAbbrechen = Text einfügen")) box.querySelector(".bakFile").click();
      else pasteIn();
    };
    box.querySelector(".bakFile").onchange=function(){ if(this.files[0]) take(this.files[0]); };
  }
  function place(){
    bar(document.getElementById("log"));
    bar(document.getElementById("notiz"));
  }
  var st=document.createElement("style");
  st.textContent="#bakPane{margin:.4rem 0 .8rem}#bakTx{min-height:7rem;font-size:.7rem}";
  document.head.appendChild(st);
  if(typeof show==="function"){
    var _show=show;
    show=function(id){ var r=_show.apply(this,arguments); if(id==="log"||id==="notiz") place(); return r; };
  }
  place();
})();
