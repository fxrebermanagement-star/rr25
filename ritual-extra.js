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
    if(p<0.28) return ["🌓","Viertel","Form geben. Grenze halten."];
    if(p<0.47) return ["🌔","Zunehmend","Kraft sammeln. Klar bleiben."];
    if(p<0.53) return ["🌕","Vollmond","Sichtbar. Nicht nachsetzen."];
    if(p<0.72) return ["🌖","Abnehmend","Abgeben. Was fällt, darf fallen."];
    if(p<0.78) return ["🌗","Viertel","Lösen. Zurück zur Mitte."];
    return ["🌘","Abnehmend","Leeren. Schlafen lassen."];
  }
  function moon(){
    var ph=phase();
    var el=document.getElementById("moonSym");
    var tx=document.getElementById("moonTxt");
    if(el) el.textContent=ph[0];
    if(tx) tx.textContent=ph[1];
    var wrap=document.getElementById("moonWrap");
    if(wrap) wrap.title=ph[1]+" · "+ph[2];
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
    "header{position:relative}",
    "#headRow{position:relative;min-height:52px;margin:0 0 .2rem}",
    "#moonWrap{position:absolute;left:0;top:0;text-align:center;width:3.2rem}",
    "#moonSym{display:block;font-size:1.55rem;line-height:1;border:0;background:none;width:auto;height:auto;padding:0}",
    "#moonTxt{display:block;margin-top:.18rem;font-size:.52rem;letter-spacing:.04em;color:#c4a4d6;line-height:1.15}",
    "#headRow .doll{margin:0 auto;display:block}"
  ].join("");
  document.head.appendChild(s);
  document.addEventListener("click",function(e){
    if(e.target&&e.target.id==="sigilSave") saveSigil();
  });
  moon();
})();
