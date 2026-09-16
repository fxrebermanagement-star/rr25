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
  function wanted(){
    var run=document.getElementById("run");
    if(!run || !run.classList.contains("on")) return false;
    var h=run.querySelector("h2");
    var w=run.querySelector(".words");
    var t=((h&&h.textContent)||"")+" "+((w&&w.textContent)||"");
    return /369|zähler|zaehler/i.test(t);
  }
  function paint(){
    var run=document.getElementById("run");
    document.querySelectorAll("#home #z369").forEach(function(n){ n.remove(); });
    if(!run) return;
    var el=run.querySelector("#z369");
    if(!wanted()){ if(el) el.remove(); return; }
    if(!el){
      el=document.createElement("div");
      el.id="z369";
      var words=run.querySelector(".words");
      if(words && words.parentNode) words.parentNode.insertBefore(el, words.nextSibling);
      else run.appendChild(el);
    }
    var z=loadZ();
    el.innerHTML=
      '<button type="button" data-z="n3">3<span>'+z.n3+'/3</span></button>'+
      '<button type="button" data-z="n6">6<span>'+z.n6+'/6</span></button>'+
      '<button type="button" data-z="n9">9<span>'+z.n9+'/9</span></button>';
  }
  function tap(key){
    var max={n3:3,n6:6,n9:9};
    var z=loadZ();
    z[key]++;
    if(z[key]>=max[key]) z[key]=0;
    if(z.n3>=3 && z.n6>=6 && z.n9>=9){ z.n3=0; z.n6=0; z.n9=0; }
    saveZ(z);
    paint();
  }
  var css=document.createElement("style");
  css.textContent=[
    "#run #z369{display:grid!important;grid-template-columns:1fr 1fr 1fr;gap:.4rem;margin:.85rem 0 .25rem}",
    "#run #z369 button{border:1px solid rgba(255,122,217,.28);background:rgba(40,16,64,.55);color:#f6f0ff;border-radius:.95rem;padding:.7rem .15rem .55rem;font:inherit}",
    "#run #z369 button span{display:block;margin-top:.2rem;font-size:.7rem;color:#c4b4e0}",
    "#home #z369{display:none!important}"
  ].join("");
  document.head.appendChild(css);
  document.addEventListener("click", function(e){
    var b=e.target.closest && e.target.closest("#run #z369 [data-z]");
    if(b){ e.preventDefault(); e.stopPropagation(); tap(b.getAttribute("data-z")); }
    setTimeout(paint, 30);
  }, true);
  var run=document.getElementById("run");
  if(run && window.MutationObserver){
    new MutationObserver(function(){ setTimeout(paint, 20); }).observe(run,{childList:true,subtree:true});
  }
  if(typeof show==="function" && !show._zfix){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      setTimeout(paint, 40);
      return r;
    };
    show._zfix=1;
  }
})();
