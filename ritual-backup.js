(function(){
  var KEY="rr25", BAK="rr25_bak";
  if(typeof save==="function"){
    var _s=save;
    save=function(d){
      _s(d);
      try{ localStorage.setItem(BAK, localStorage.getItem(KEY)||""); }catch(e){}
    };
  }
  try{
    if(!localStorage.getItem(KEY) && localStorage.getItem(BAK)){
      localStorage.setItem(KEY, localStorage.getItem(BAK));
    }
  }catch(e){}
  function dump(){
    var pack={
      rr25: localStorage.getItem(KEY),
      dank: localStorage.getItem("rr25_dank"),
      wer: localStorage.getItem("rr25_wer"),
      z: localStorage.getItem("rr25_369")
    };
    var blob=new Blob([JSON.stringify(pack)],{type:"application/json"});
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
        if(p.rr25) localStorage.setItem(KEY, typeof p.rr25==="string"?p.rr25:JSON.stringify(p.rr25));
        if(p.dank) localStorage.setItem("rr25_dank", p.dank);
        if(p.wer) localStorage.setItem("rr25_wer", p.wer);
        if(p.z) localStorage.setItem("rr25_369", p.z);
        try{ localStorage.setItem(BAK, localStorage.getItem(KEY)||""); }catch(e){}
        location.reload();
      }catch(e){ alert("Datei nicht lesbar"); }
    };
    r.readAsText(file);
  }
  function bar(){
    var log=document.getElementById("log");
    if(!log||document.getElementById("bakBar")) return;
    var box=document.createElement("div");
    box.id="bakBar"; box.className="row"; box.style.margin=".2rem 0 .8rem";
    box.innerHTML='<button type="button" class="btn ghost" id="bakOut">Sichern</button>'+
      '<button type="button" class="btn ghost" id="bakIn">Holen</button>'+
      '<input id="bakFile" type="file" accept="application/json" hidden>';
    var hero=log.querySelector(".hero");
    if(hero&&hero.nextSibling) log.insertBefore(box, hero.nextSibling);
    else log.appendChild(box);
    document.getElementById("bakOut").onclick=dump;
    document.getElementById("bakIn").onclick=function(){ document.getElementById("bakFile").click(); };
    document.getElementById("bakFile").onchange=function(){ if(this.files[0]) take(this.files[0]); };
  }
  if(typeof show==="function"){
    var _show=show;
    show=function(id){ var r=_show.apply(this,arguments); if(id==="log") bar(); return r; };
  }
  bar();
})();
