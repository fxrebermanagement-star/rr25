(function(){
  var DAYS=["So","Mo","Di","Mi","Do","Fr","Sa"];
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
  function sunInfo(){
    var n=day();
    var h=n.getHours();
    var sym=(h>=6&&h<20)?"☀️":"🌙";
    var dat=DAYS[n.getDay()]+" "+n.getDate()+"."+(n.getMonth()+1)+".";
    return {sym:sym,dat:dat};
  }
  function paintHead(){
    var m=moonInfo();
    var s=sunInfo();
    var el=document.getElementById("moonSym");
    var tx=document.getElementById("moonTxt");
    if(el) el.textContent=m.sym;
    if(tx) tx.innerHTML=m.name+"<br>"+(m.tage===0?"Vollmond":"Vollmond "+m.wait);
    var wrap=document.getElementById("moonWrap");
    if(wrap) wrap.title=m.name+" · "+m.satz;
    var se=document.getElementById("sunSym");
    var st=document.getElementById("sunTxt");
    if(se) se.textContent=s.sym;
    if(st) st.textContent=s.dat;
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
  var css=document.createElement("style");
  css.textContent=[
    "#moonWrap,#sunWrap{width:4.4rem}",
    "#sunWrap{position:absolute;right:0;top:0;text-align:center}",
    "#sunSym,#moonSym{display:block;font-size:2.05rem;line-height:1}",
    "#sunTxt,#moonTxt{display:block;margin-top:.22rem;font-size:.68rem;letter-spacing:.02em;color:#c4a4d6;line-height:1.25}"
  ].join("");
  document.head.appendChild(css);
  document.addEventListener("click",function(e){
    if(e.target&&e.target.id==="sigilSave") saveSigil();
  });
  paintHead();
})();
