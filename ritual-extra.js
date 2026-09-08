(function(){
  var DAYS=["So","Mo","Di","Mi","Do","Fr","Sa"];
  var ZKEY="rr25_369";
  var FEST=[
    [2,1,"Imbolc","Licht zurück. Samen innen. Nicht hetzen. Still halten und wärmen."],
    [3,20,"Ostara","Tag und Nacht gleich. Neu setzen. Was keimt, darf wachsen."],
    [5,1,"Beltane","Feuer und Tür. Leben nach aussen. Grenze trotzdem halten."],
    [6,21,"Litha","Höhe. Kraft ist da. Nicht nachsetzen. Danken und stehen."],
    [8,1,"Lughnasadh","Erste Ernte. Nehmen was reif ist. Den Rest stehen lassen."],
    [9,22,"Mabon","Wieder Gleichstand. Abgeben. Was fällt, darf fallen."],
    [10,31,"Samhain","Schleier dünn. Ahnen ehren. Kontakt kurz. Dann schliessen."],
    [12,21,"Jul","Tiefste Nacht. Licht hüten. Innen bleiben. Neu beginnen."]
  ];
  function day(){ return new Date(); }
  function ymd(){
    var n=day();
    return n.getFullYear()+"-"+String(n.getMonth()+1).padStart(2,"0")+"-"+String(n.getDate()).padStart(2,"0");
  }
  function zLoad(){
    try{
      var x=JSON.parse(localStorage.getItem(ZKEY)||"{}");
      if(x.d!==ymd()) return {d:ymd(),n3:0,n6:0,n9:0};
      return {d:x.d,n3:x.n3|0,n6:x.n6|0,n9:x.n9|0};
    }catch(e){ return {d:ymd(),n3:0,n6:0,n9:0}; }
  }
  function zSave(z){ localStorage.setItem(ZKEY, JSON.stringify(z)); }
  function zClearHome(){
    var home=document.getElementById("home");
    if(!home) return;
    home.querySelectorAll("#z369").forEach(function(n){ n.remove(); });
  }
  function zBox(){
    var run=document.getElementById("run");
    if(!run||!run.classList.contains("on")) return null;
    var el=run.querySelector("#z369");
    if(!el){
      el=document.createElement("div");
      el.id="z369";
      run.appendChild(el);
    }
    return el;
  }
  function zPaint(){
    zClearHome();
    var el=zBox();
    if(!el) return;
    var z=zLoad();
    el.innerHTML=
      '<button type="button" data-z="n3" class="'+(z.n3>=3?"on":"")+'">3 <span>'+z.n3+'/3</span></button>'+
      '<button type="button" data-z="n6" class="'+(z.n6>=6?"on":"")+'">6 <span>'+z.n6+'/6</span></button>'+
      '<button type="button" data-z="n9" class="'+(z.n9>=9?"on":"")+'">9 <span>'+z.n9+'/9</span></button>';
  }
  function zTap(key){
    var max={n3:3,n6:6,n9:9};
    var z=zLoad();
    if(z[key]>=max[key]) z[key]=0;
    else z[key]++;
    zSave(z);
    zPaint();
  }
  function nextFest(n){
    var y=n.getFullYear();
    var list=[];
    for(var k=0;k<2;k++){
      FEST.forEach(function(f){
        list.push({d:new Date(y+k,f[0]-1,f[1]), name:f[2], text:f[3]});
      });
    }
    var now=new Date(n.getFullYear(),n.getMonth(),n.getDate()).getTime();
    for(var i=0;i<list.length;i++){
      var t=new Date(list[i].d.getFullYear(),list[i].d.getMonth(),list[i].d.getDate()).getTime();
      var diff=Math.round((t-now)/86400000);
      if(diff>=0) return {name:list[i].name, tage:diff, text:list[i].text};
    }
    return {name:"Imbolc",tage:0,text:FEST[0][3]};
  }
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
    var f=nextFest(n);
    var dat=DAYS[n.getDay()]+" "+n.getDate()+"."+(n.getMonth()+1)+".";
    var wait=f.tage===0?"heute":(f.tage===1?"1 Tag":f.tage+" Tage");
    return {sym:"☀️", dat:dat, fest:f.name, wait:wait, tage:f.tage, text:f.text};
  }
  function box(){
    var el=document.getElementById("festHint");
    if(el) return el;
    el=document.createElement("div");
    el.id="festHint";
    var home=document.getElementById("home");
    if(home) home.insertBefore(el, home.firstChild);
    else document.body.appendChild(el);
    return el;
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
    if(st) st.innerHTML=s.dat+"<br>"+s.fest+" "+(s.tage===0?"heute":s.wait);
    window._fest=s;
  }
  function toggleFest(){
    var s=window._fest||sunInfo();
    var el=box();
    if(el.classList.contains("on")){ el.classList.remove("on"); el.innerHTML=""; return; }
    el.className="on";
    el.innerHTML="<b>"+s.fest+"</b><small>"+(s.tage===0?"heute":s.wait)+"</small><p>"+s.text+"</p>";
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
    "#sunWrap{cursor:pointer}",
    "#festHint{display:none;margin:.35rem 0 .55rem;padding:.7rem .8rem;border:1px solid rgba(232,160,255,.22);border-radius:.9rem;background:rgba(56,24,86,.45)}",
    "#festHint.on{display:block}",
    "#festHint b{display:block;font-family:Georgia,serif;font-size:1rem}",
    "#festHint small{display:block;color:#c4a4d6;margin:.12rem 0 .35rem}",
    "#festHint p{margin:0;font-family:Georgia,serif;line-height:1.5}",
    "#run #z369{display:grid;grid-template-columns:1fr 1fr 1fr;gap:.35rem;margin:.7rem 0 .2rem}",
    "#run #z369 button{border:1px solid rgba(232,160,255,.22);background:rgba(56,24,86,.4);color:#f6eaff;border-radius:.85rem;padding:.45rem .2rem;font:inherit}",
    "#run #z369 button span{display:block;font-size:.68rem;color:#c4a4d6;margin-top:.08rem}",
    "#run #z369 button.on{background:linear-gradient(165deg,#9650d2,#e6aaff);color:#14081c;border-color:transparent}",
    "#run #z369 button.on span{color:#14081c}",
    "#home #z369{display:none!important}"
  ].join("");
  document.head.appendChild(css);
  document.addEventListener("click",function(e){
    if(!e.target) return;
    if(e.target.id==="sigilSave") saveSigil();
    if(e.target.id==="sunWrap"||(e.target.closest&&e.target.closest("#sunWrap"))) toggleFest();
    var z=e.target.closest&&e.target.closest("#z369 [data-z]");
    if(z){ e.stopPropagation(); zTap(z.getAttribute("data-z")); }
    setTimeout(zPaint,40);
  });
  var run=document.getElementById("run");
  if(run&&window.MutationObserver){
    new MutationObserver(function(){ setTimeout(zPaint,20); }).observe(run,{childList:true});
  }
  if(typeof show==="function"){
    var _show=show;
    show=function(id){
      var r=_show.apply(this,arguments);
      zClearHome();
      if(id==="run") setTimeout(zPaint,30);
      return r;
    };
  }
  paintHead();
  zClearHome();
})();
