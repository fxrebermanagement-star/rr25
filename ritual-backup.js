(function(){
  if(window.__rr25bak) return;
  window.__rr25bak=1;
  var BAK="rr25_pack_bak";

  function allKeys(){
    var keys=[], i;
    for(i=0;i<localStorage.length;i++){
      var k=localStorage.key(i);
      if(k && k.indexOf("rr25")===0 && k!==BAK) keys.push(k);
    }
    return keys;
  }
  function pack(){
    var p={v:3,t:new Date().toISOString()};
    allKeys().forEach(function(k){
      var v=localStorage.getItem(k);
      if(v!=null) p[k]=v;
    });
    return p;
  }
  function apply(p){
    if(!p||typeof p!=="object") return false;
    if(p.rr25 && !p.rr25_ritual_v1) p.rr25_ritual_v1=typeof p.rr25==="string"?p.rr25:JSON.stringify(p.rr25);
    var n=0;
    Object.keys(p).forEach(function(k){
      if(k==="v"||k==="t"||k==="rr25"||k==="wer"||k==="dank"||k==="z") return;
      if(p[k]==null) return;
      localStorage.setItem(k, typeof p[k]==="string"?p[k]:JSON.stringify(p[k]));
      n++;
    });
    return n>0;
  }
  function snap(){
    try{ localStorage.setItem(BAK, JSON.stringify(pack())); }catch(e){}
  }

  try{
    if(!localStorage.getItem("rr25_ritual_v1")){
      var raw=localStorage.getItem(BAK);
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

  function dump(){
    snap();
    var blob=new Blob([JSON.stringify(pack(),null,2)],{type:"application/json"});
    var a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="rr25-sicherung.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function(){ URL.revokeObjectURL(a.href); },800);
  }
  function take(file){
    var r=new FileReader();
    r.onload=function(){
      try{
        var p=JSON.parse(r.result);
        if(!apply(p)) throw new Error("leer");
        snap();
        alert("Sicherung geholt. App neu öffnen.");
      }catch(e){ alert("Datei nicht lesbar"); }
    };
    r.readAsText(file);
  }
  function bar(host){
    if(!host||host.querySelector(".bakBar")) return;
    var box=document.createElement("div");
    box.className="row bakBar";
    box.style.margin=".15rem 0 .7rem";
    box.innerHTML='<button type="button" class="btn ghost bakOut">Sichern</button>'+
      '<button type="button" class="btn ghost bakIn">Holen</button>'+
      '<input class="bakFile" type="file" accept="application/json,.json" hidden>';
    var hero=host.querySelector(".hero");
    if(hero&&hero.nextSibling) host.insertBefore(box, hero.nextSibling);
    else host.insertBefore(box, host.firstChild);
    box.querySelector(".bakOut").onclick=dump;
    box.querySelector(".bakIn").onclick=function(){ box.querySelector(".bakFile").click(); };
    box.querySelector(".bakFile").onchange=function(){ if(this.files[0]) take(this.files[0]); };
  }
  function place(){
    bar(document.getElementById("log"));
    bar(document.getElementById("notiz"));
  }
  if(typeof show==="function"){
    var _show=show;
    show=function(id){ var r=_show.apply(this,arguments); if(id==="log"||id==="notiz") place(); return r; };
  }
  place();
})();
