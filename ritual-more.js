(function(){
  var SYN=29.53058867;
  var NM=Date.UTC(2000,0,6,18,14)/1000;
  var lock=null;
  function ageAt(ms){
    var a=(((ms/1000)-NM)/86400)%SYN;
    if(a<0) a+=SYN;
    return a;
  }
  function nextFull(){
    var now=Date.now()/1000;
    var age=((now-NM)/86400)%SYN;
    if(age<0) age+=SYN;
    var days=SYN/2-age;
    if(days<0) days+=SYN;
    var d=new Date(Date.now()+days*86400000);
    return {days:Math.max(0,Math.round(days)), label:d.toLocaleDateString("de-CH",{day:"numeric",month:"short"})};
  }
  function nextNew(){
    var now=Date.now()/1000;
    var age=((now-NM)/86400)%SYN;
    if(age<0) age+=SYN;
    var days=SYN-age;
    if(days>SYN-0.4) days=0;
    var d=new Date(Date.now()+days*86400000);
    return {days:Math.max(0,Math.round(days)), label:d.toLocaleDateString("de-CH",{day:"numeric",month:"short"})};
  }
  function isFullish(ms){
    var a=ageAt(ms)/SYN;
    return a>0.45 && a<0.55;
  }
  function parseT(s){
    if(!s) return Date.now();
    var m=String(s).match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
    if(!m) return Date.now();
    return new Date(+m[3], +m[2]-1, +m[1]).getTime();
  }

  function moonHint(){
    var host=document.getElementById("geplant");
    if(!host) return;
    var el=document.getElementById("plMond");
    if(!el){
      el=document.createElement("p");
      el.id="plMond";
      el.className="meta";
      var card=host.querySelector(".card");
      if(card) card.insertBefore(el, card.querySelector(".row"));
      else host.appendChild(el);
    }
    var f=nextFull(), n=nextNew();
    el.textContent="Nächster Vollmond "+f.label+(f.days?" · in "+f.days+" Tagen":" · heute")+
      " · Neumond "+n.label;
  }

  var filt="";
  function chips(){
    var log=document.getElementById("log");
    if(!log) return;
    var bar=document.getElementById("logFilt");
    if(!bar){
      bar=document.createElement("div");
      bar.id="logFilt";
      var find=document.getElementById("logFind");
      if(find) log.insertBefore(bar, find.nextSibling);
      else {
        var ent=document.getElementById("entries");
        if(ent) log.insertBefore(bar, ent);
        else log.appendChild(bar);
      }
    }
    var keys=[["","Alle"],["schutz","Schutz"],["liebe","Liebe"],["sigille","Sigille"],["mond","Vollmond"]];
    bar.innerHTML=keys.map(function(k){
      return '<button type="button" class="chip'+(filt===k[0]?" on":"")+'" data-lf="'+k[0]+'">'+k[1]+'</button>';
    }).join("");
    bar.querySelectorAll("[data-lf]").forEach(function(b){
      b.onclick=function(){ filt=b.getAttribute("data-lf")||""; if(typeof paintLog==="function") paintLog(); chips(); };
    });
  }
  if(typeof paintLog==="function" && !paintLog._more){
    var pl=paintLog;
    paintLog=function(){
      pl();
      if(!filt) return;
      var box=document.getElementById("entries");
      if(!box) return;
      box.querySelectorAll(".logrow").forEach(function(row){
        var b=(row.querySelector("b")||{}).textContent||"";
        var meta=(row.querySelector(".meta")||{}).textContent||"";
        var hay=(b+" "+meta).toLowerCase();
        var ok=true;
        if(filt==="schutz") ok=/schutz|stopp|schaden|grenze/.test(hay);
        if(filt==="liebe") ok=/liebe|anziehung/.test(hay);
        if(filt==="sigille") ok=/sigil/.test(hay);
        if(filt==="mond") ok=isFullish(parseT(meta));
        row.style.display=ok?"": "none";
      });
    };
    paintLog._more=1;
  }

  async function wake(on){
    try{
      if(on){
        if(navigator.wakeLock && !lock) lock=await navigator.wakeLock.request("screen");
      } else {
        if(lock){ try{ lock.release(); }catch(e){} lock=null; }
      }
    }catch(e){}
  }
  if(typeof show==="function" && !show._more){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      var app=document.querySelector(".app");
      var rest=id==="run"||id==="after";
      if(app) app.classList.toggle("runmode", rest);
      wake(rest);
      if(id==="geplant") moonHint();
      if(id==="log"){ chips(); if(typeof paintLog==="function") paintLog(); }
      return r;
    };
    show._more=1;
  }
  document.addEventListener("visibilitychange", function(){
    if(document.visibilityState==="visible" && document.querySelector(".app.runmode")) wake(true);
  });

  var css=document.createElement("style");
  css.textContent=[
    ".app.runmode nav{display:none!important}",
    ".app.runmode main{padding-bottom:1.4rem!important}",
    "#plMond{margin:.15rem 0 .35rem;line-height:1.35}",
    "#logFilt{display:flex;flex-wrap:wrap;gap:.32rem;margin:0 0 .55rem}"
  ].join("");
  document.head.appendChild(css);
  moonHint();
})();
