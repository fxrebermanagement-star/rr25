(function(){
  var KEY="rr25_369";
  function ymd(){
    var n=new Date();
    return n.getFullYear()+"-"+String(n.getMonth()+1).padStart(2,"0")+"-"+String(n.getDate()).padStart(2,"0");
  }
  function loadZ(){
    try{
      var x=JSON.parse(localStorage.getItem(KEY)||"{}");
      if(x.d!==ymd()) return {d:ymd(),n3:0,n6:0,n9:0};
      return {d:x.d,n3:x.n3|0,n6:x.n6|0,n9:x.n9|0};
    }catch(e){ return {d:ymd(),n3:0,n6:0,n9:0}; }
  }
  function saveZ(z){ localStorage.setItem(KEY, JSON.stringify(z)); }
  function buzz(){
    try{
      if(navigator.vibrate) navigator.vibrate([40,50,80,50,140]);
    }catch(e){}
  }
  function paint(){
    var el=document.getElementById("zahlBox");
    if(!el) return;
    var z=loadZ();
    el.innerHTML=
      '<button type="button" class="zbtn" data-z="n3">3<span>'+z.n3+'/3</span></button>'+
      '<button type="button" class="zbtn" data-z="n6">6<span>'+z.n6+'/6</span></button>'+
      '<button type="button" class="zbtn" data-z="n9">9<span>'+z.n9+'/9</span></button>';
    var msg=document.getElementById("zahlMsg");
    if(!msg){
      msg=document.createElement("p");
      msg.id="zahlMsg";
      msg.className="sub";
      el.parentNode.insertBefore(msg, el.nextSibling);
    }
    msg.textContent=window._zVoll?"Voll. Zurück auf null.":"";
  }
  function tap(key){
    var max={n3:3,n6:6,n9:9};
    var z=loadZ();
    if(z[key]<max[key]) z[key]++;
    if(z.n3>=3 && z.n6>=6 && z.n9>=9){
      buzz();
      z.n3=0; z.n6=0; z.n9=0;
      window._zVoll=true;
      setTimeout(function(){ window._zVoll=false; paint(); },1800);
    }
    saveZ(z);
    paint();
  }
  var css=document.createElement("style");
  css.textContent=[
    "#zahlBox{display:grid;grid-template-columns:1fr 1fr 1fr;gap:.45rem;margin:1.1rem 0 .4rem}",
    "#zahl .zbtn{border:1px solid rgba(255,122,217,.22);background:rgba(28,14,48,.55);color:#f6f0ff;border-radius:1.15rem;padding:1.15rem .2rem .95rem;font:inherit}",
    "#zahl .zbtn span{display:block;margin-top:.35rem;font-size:.72rem;color:#c4b4e0}",
    "#zahlMsg{text-align:center;min-height:1.2rem}"
  ].join("");
  document.head.appendChild(css);
  document.addEventListener("click",function(e){
    if(!e.target) return;
    if(e.target.id==="zahlGo"||(e.target.closest&&e.target.closest("#tools [data-go=zahlGo]"))){
      paint();
      if(typeof show==="function") show("zahl");
    }
    if(e.target.id==="zahlBack"&&typeof show==="function") show("home");
    var b=e.target.closest&&e.target.closest("#zahl [data-z]");
    if(b) tap(b.getAttribute("data-z"));
  });
  window._zTap=tap;
  window._zPaint=paint;
  paint();
})();
