(function(){
  var DROP={finst:1,fremd:1,fil:1};
  function grab(id){
    for(var i=0;i<R.length;i++) if(R[i].id===id) return R[i];
    return null;
  }
  function ensure(id,t,s,need){
    var r=grab(id);
    if(!r){
      R.push({id:id,t:t,s:s,tag:"Person X",need:need,steps:[]});
      r=grab(id);
    }
    r.t=t; r.s=s; r.tag="Person X";
    if(need && !r.need) r.need=need;
  }
  function lock(){
    if(typeof R==="undefined") return;
    for(var i=R.length-1;i>=0;i--){
      if(DROP[R[i].id]) R.splice(i,1);
    }
    var w=grab("wesen");
    if(w){ w.t="Wesenheit für Auftrag"; w.s="Kontakt mit Auftrag. Mass halten."; w.tag="Feld"; }
    var a=grab("ahn");
    if(a){ a.t="Ahnen rufen"; a.s="Ehren, begrenzen, Auftrag."; a.tag="Feld"; }
    ensure("ueber","Person übernehmen","Hart. Ich bin [Name]. Bis ich schliesse.",["Name","Auftrag"]);
    ensure("segen","Segen","Ein Name. Ein Satz Wofür.",["Name","Wofür"]);
    ensure("fluch","Fluch","Ein Name. Ein Satz Mass.",["Name","Mass"]);
    ensure("schaden","Schadenszauber","Vorhanden. Nicht Pflicht.",["Name"]);
  }
  function chip(){
    var cats=document.getElementById("cats");
    if(!cats) return;
    if(cats.querySelector('[data-cat="Person X"]')) return;
    var b=document.createElement("button");
    b.type="button";
    b.className="chip"+(typeof cat!=="undefined"&&cat==="Person X"?" on":"");
    b.setAttribute("data-cat","Person X");
    b.textContent="Person X";
    b.onclick=function(){ cat="Person X"; if(typeof renderList==="function") renderList(); };
    var feld=cats.querySelector('[data-cat="Feld"]');
    if(feld) cats.insertBefore(b, feld);
    else cats.appendChild(b);
  }
  function go(){
    lock();
    chip();
  }
  go();
  if(typeof renderList==="function" && !renderList._lock){
    var prev=renderList;
    renderList=function(){ lock(); prev(); chip(); };
    renderList._lock=1;
  }
  if(typeof renderList==="function"){
    try{ renderList(); }catch(e){}
  }
})();
