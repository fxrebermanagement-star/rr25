(function(){
  function day(){ return new Date(); }
  function phase(){
    var syn=29.53058867;
    var nm=Date.UTC(2000,0,6,18,14)/1000;
    var age=((day().getTime()/1000-nm)/86400)%syn;
    if(age<0) age+=syn;
    var p=age/syn;
    if(p<0.03||p>0.97) return ["○","Neumond","Neu setzen. Still halten."];
    if(p<0.22) return ["🌒","Zunehmend","Wachsen lassen. Nicht hetzen."];
    if(p<0.28) return ["🌓","Erstes Viertel","Form geben. Grenze halten."];
    if(p<0.47) return ["🌔","Zunehmend","Kraft sammeln. Klar bleiben."];
    if(p<0.53) return ["🌕","Vollmond","Sichtbar. Nicht nachsetzen."];
    if(p<0.72) return ["🌖","Abnehmend","Abgeben. Was fällt, darf fallen."];
    if(p<0.78) return ["🌗","Letztes Viertel","Lösen. Zurück zur Mitte."];
    return ["🌘","Abnehmend","Leeren. Schlafen lassen."];
  }
  function moon(){
    var ph=phase();
    var el=document.getElementById("moonSym");
    if(!el){
      var head=document.querySelector("header");
      var doll=document.querySelector("header .doll");
      if(!head||!doll) return;
      var row=document.getElementById("headRow");
      if(!row){
        row=document.createElement("div");
        row.id="headRow";
        head.insertBefore(row, doll);
        row.appendChild(doll);
      }
      el=document.createElement("span");
      el.id="moonSym";
      row.insertBefore(el, row.firstChild);
    }
    el.textContent=ph[0];
    el.title=ph[1]+" · "+ph[2];
    var line=document.getElementById("moonLine");
    if(line) line.style.display="none";
  }
  function saveSigil(){
    var c=document.getElementById("sigilC");
    var t=((document.getElementById("sigilT")||{}).value||"").trim();
    if(!c||typeof load!=="function") return;
    var img="";
    try{ img=c.toDataURL("image/jpeg",0.72); }catch(e){}
    if(!img||img.length<80) return;
    var id=typeof uid==="function"?uid():String(Date.now());
    var d=load();
    d.log=d.log||[];
    d.log.unshift({
      id:id,
      t:typeof now==="function"?now():new Date().toLocaleString("de-CH"),
      titel:"Sigille",
      wer:t,
      pics:1
    });
    save(d);
    if(typeof fotoPut==="function") fotoPut(id,[img]);
    var b=document.getElementById("sigilSave");
    if(b){ b.textContent="Abgelegt"; setTimeout(function(){ b.textContent="Ablegen"; },1400); }
  }
  var s=document.createElement("style");
  s.textContent=[
    "#headRow{display:flex;align-items:center;justify-content:center;gap:.55rem;margin:0 auto .2rem}",
    "#headRow .doll{margin:0}",
    "#moonSym{width:52px;height:52px;display:flex;align-items:center;justify-content:center;font-size:1.55rem;line-height:1;border-radius:16px;border:1px solid rgba(232,160,255,.28);background:#12081c}"
  ].join("");
  document.head.appendChild(s);
  document.addEventListener("click",function(e){
    if(e.target&&e.target.id==="sigilSave") saveSigil();
  });
  moon();
})();
