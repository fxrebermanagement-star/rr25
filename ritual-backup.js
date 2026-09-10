(function(){
  var KEYS=["rr25_ritual_v1","rr25_notiz_v1","rr25_wer","rr25_369","rr25_dank","rr25","rr25_bak"];
  var BAK="rr25_pack_bak";
  function pack(){
    var p={};
    KEYS.forEach(function(k){ var v=localStorage.getItem(k); if(v!=null) p[k]=v; });
    return p;
  }
  function apply(p){
    if(!p||typeof p!=="object") return false;
    if(p.rr25 && !p.rr25_ritual_v1) p.rr25_ritual_v1=typeof p.rr25==="string"?p.rr25:JSON.stringify(p.rr25);
    if(p.wer && !p.rr25_wer) p.rr25_wer=p.wer;
    if(p.dank && !p.rr25_dank) p.rr25_dank=p.dank;
    if(p.z && !p.rr25_369) p.rr25_369=p.z;
    Object.keys(p).forEach(function(k){
      if(k==="rr25"||k==="wer"||k==="dank"||k==="z") return;
      var v=p[k];
      if(v==null) return;
      localStorage.setItem(k, typeof v==="string"?v:JSON.stringify(v));
    });
    try{ localStorage.setItem(BAK, JSON.stringify(pack())); }catch(e){}
    return true;
  }
  if(typeof save==="function"){
    var _s=save;
    save=function(d){
      _s(d);
      try{ localStorage.setItem(BAK, JSON.stringify(pack())); }catch(e){}
    };
  }
  try{
    if(!localStorage.getItem("rr25_ritual_v1")){
      var raw=localStorage.getItem(BAK)||localStorage.getItem("rr25_bak")||localStorage.getItem("rr25");
      if(raw){
        try{ apply(JSON.parse(raw)); }catch(e){
          if(raw.charAt(0)==="{") localStorage.setItem("rr25_ritual_v1", raw);
        }
      }
    }
  }catch(e){}
  function dump(){
    var blob=new Blob([JSON.stringify(pack())],{type:"application/json"});
    var a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download="rr25-sicherung.json";
    a.click();
    setTimeout(function(){ URL.revokeObjectURL(a.href); },500);
  }
  function take(file){
    var r=new FileReader();
    r.onload=function(){
      try{
        var p=JSON.parse(r.result);
        if(!apply(p)) throw new Error("leer");
        location.reload();
      }catch(e){ alert("Datei nicht lesbar"); }
    };
    r.readAsText(file);
  }
  function bar(host){
    if(!host||host.querySelector("#bakBar")) return;
    var box=document.createElement("div");
    box.id="bakBar"; box.className="row"; box.style.margin=".2rem 0 .8rem";
    box.innerHTML='<button type="button" class="btn ghost" id="bakOut">Sichern</button>'+
      '<button type="button" class="btn ghost" id="bakIn">Holen</button>'+
      '<input id="bakFile" type="file" accept="application/json,.json" hidden>';
    var hero=host.querySelector(".hero");
    if(hero&&hero.nextSibling) host.insertBefore(box, hero.nextSibling);
    else host.insertBefore(box, host.firstChild);
    host.querySelector("#bakOut").onclick=dump;
    host.querySelector("#bakIn").onclick=function(){ host.querySelector("#bakFile").click(); };
    host.querySelector("#bakFile").onchange=function(){ if(this.files[0]) take(this.files[0]); };
  }
  function place(){
    bar(document.getElementById("log"));
    bar(document.getElementById("person"));
  }
  if(typeof show==="function"){
    var _show=show;
    show=function(id){ var r=_show.apply(this,arguments); if(id==="log"||id==="person") place(); return r; };
  }
  place();
})();
