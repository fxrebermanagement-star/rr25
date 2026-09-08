(function(){
  function day(){ return new Date(); }
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
    var el=document.getElementById("moonLine");
    if(!el) return;
    var ph=phase();
    el.textContent=ph[0]+" · "+ph[1];
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
  document.addEventListener("click",function(e){
    if(e.target&&e.target.id==="sigilSave") saveSigil();
  });
  moon();
})();
