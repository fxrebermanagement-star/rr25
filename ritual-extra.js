(function(){
  function day(){ return new Date(); }
  function moonInfo(){
    var syn=29.53058867;
    var nm=Date.UTC(2000,0,6,18,14)/1000;
    var age=((day().getTime()/1000-nm)/86400)%syn;
    if(age<0) age+=syn;
    var p=age/syn;
    var left=(p<0.5)?(0.5-p)*syn:(1.5-p)*syn;
    var tage=Math.max(0, Math.round(left));
    var name,satz,sym;
    if(p<0.03||p>0.97){ sym="○"; name="Neumond"; satz="Neu setzen. Still halten."; }
    else if(p<0.22){ sym="🌒"; name="Zunehmend"; satz="Wachsen lassen. Nicht hetzen."; }
    else if(p<0.28){ sym="🌓"; name="Viertel"; satz="Form geben. Grenze halten."; }
    else if(p<0.47){ sym="🌔"; name="Zunehmend"; satz="Kraft sammeln. Klar bleiben."; }
    else if(p<0.53){ sym="🌕"; name="Vollmond"; satz="Sichtbar. Nicht nachsetzen."; }
    else if(p<0.72){ sym="🌖"; name="Abnehmend"; satz="Abgeben. Was fällt, darf fallen."; }
    else if(p<0.78){ sym="🌗"; name="Viertel"; satz="Lösen. Zurück zur Mitte."; }
    else { sym="🌘"; name="Abnehmend"; satz="Leeren. Schlafen lassen."; }
    var wait=tage===0?"heute":(tage===1?"1 Tag":tage+" Tage");
    return {sym:sym,name:name,satz:satz,wait:wait,tage:tage};
  }
  function moon(){
    var m=moonInfo();
    var el=document.getElementById("moonSym");
    var tx=document.getElementById("moonTxt");
    if(el) el.textContent=m.sym;
    if(tx) tx.innerHTML=m.name+"<br>"+(m.tage===0?"Vollmond":"Vollmond "+m.wait);
    var wrap=document.getElementById("moonWrap");
    if(wrap) wrap.title=m.name+" · "+m.satz;
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
    "#moonWrap{width:4.4rem!important}",
    "#moonSym{font-size:2.05rem!important;line-height:1!important}",
    "#moonTxt{font-size:.68rem!important;letter-spacing:.02em;line-height:1.25!important;margin-top:.22rem!important}"
  ].join("");
  document.head.appendChild(s);
  document.addEventListener("click",function(e){
    if(e.target&&e.target.id==="sigilSave") saveSigil();
  });
  moon();
})();
