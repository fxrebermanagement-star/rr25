(function(){
  function day(){
    return new Date();
  }
  function phase(){
    var syn=29.53058867;
    var nm=Date.UTC(2000,0,6,18,14)/1000;
    var age=((day().getTime()/1000-nm)/86400)%syn;
    if(age<0) age+=syn;
    var p=age/syn;
    if(p<0.03||p>0.97) return ["Neumond","Neu setzen. Still halten."];
    if(p<0.22) return ["Zunehmend","Wachsen lassen. Nicht hetzen."];
    if(p<0.28) return ["Erstes Viertel","Form geben. Grenze halten."];
    if(p<0.47) return ["Zunehmend","Kraft sammeln. Klar bleiben."];
    if(p<0.53) return ["Vollmond","Sichtbar. Nicht nachsetzen."];
    if(p<0.72) return ["Abnehmend","Abgeben. Was fällt, darf fallen."];
    if(p<0.78) return ["Letztes Viertel","Lösen. Zurück zur Mitte."];
    return ["Abnehmend","Leeren. Schlafen lassen."];
  }
  function moon(){
    var home=document.getElementById("home");
    if(!home) return;
    var el=document.getElementById("moonLine");
    if(!el){
      el=document.createElement("p");
      el.id="moonLine";
      el.className="sub";
      var kast=document.getElementById("kasten");
      if(kast) home.insertBefore(el, kast);
      else home.insertBefore(el, home.firstChild);
    }
    var ph=phase();
    el.textContent=ph[0]+" · "+ph[1];
    el.style.textAlign="center";
    el.style.letterSpacing=".06em";
    el.style.margin=".15rem 0 .35rem";
  }
  function ensureSave(){
    var box=document.getElementById("underR");
    if(!box||document.getElementById("sigilSave")) return;
    var b=document.createElement("button");
    b.type="button";
    b.id="sigilSave";
    b.className="btn ghost";
    b.textContent="Ablegen";
    box.appendChild(b);
  }
  function saveSigil(){
    var c=document.getElementById("sigilC");
    var t=(document.getElementById("sigilT")||{}).value||"";
    if(!c) return;
    var img="";
    try{ img=c.toDataURL("image/jpeg",.72); }catch(e){}
    if(typeof load!=="function"||typeof save!=="function") return;
    var d=load();
    d.log=d.log||[];
    d.log.unshift({
      id:(typeof uid==="function"?uid():String(Date.now())),
      t:(typeof now==="function"?now():new Date().toLocaleString("de-CH")),
      titel:"Sigille",
      wer:t.trim(),
      img:img
    });
    save(d);
    var b=document.getElementById("sigilSave");
    if(b){ b.textContent="Abgelegt"; setTimeout(function(){ b.textContent="Ablegen"; },1200); }
  }
  var old=typeof paintLog==="function"?paintLog:null;
  if(old){
    paintLog=function(){
      old();
      var rows=(typeof load==="function"?load().log:null)||[];
      var box=document.getElementById("entries");
      if(!box) return;
      var nodes=box.querySelectorAll(".entry");
      rows.forEach(function(e,i){
        if(!e.img||!nodes[i]) return;
        if(nodes[i].querySelector(".shots")) return;
        var sh=document.createElement("div");
        sh.className="shots";
        var im=document.createElement("img");
        im.src=e.img;
        sh.appendChild(im);
        nodes[i].appendChild(sh);
      });
    };
  }
  document.addEventListener("click",function(e){
    if(e.target&&e.target.id==="sigilSave") saveSigil();
  });
  var st=document.createElement("style");
  st.textContent="#moonLine{color:#c4a4d6;font-size:.72rem}#sigilSave{min-height:2.45rem}";
  document.head.appendChild(st);
  moon();
  ensureSave();
  setTimeout(ensureSave,200);
})();
