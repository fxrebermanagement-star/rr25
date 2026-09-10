(function(){
  var KEY="rr25_369";
  function ymd(){
    var n=new Date();
    return n.getFullYear()+"-"+String(n.getMonth()+1).padStart(2,"0")+"-"+String(n.getDate()).padStart(2,"0");
  }
  function load(){
    try{
      var x=JSON.parse(localStorage.getItem(KEY)||"{}");
      if(x.d!==ymd()) return {d:ymd(),n3:0,n6:0,n9:0};
      return {d:x.d,n3:x.n3|0,n6:x.n6|0,n9:x.n9|0};
    }catch(e){ return {d:ymd(),n3:0,n6:0,n9:0}; }
  }
  function save(z){ localStorage.setItem(KEY, JSON.stringify(z)); }
  function paint(){
    var el=document.getElementById("zahlBox");
    if(!el) return;
    var z=load();
    el.innerHTML=
      '<button type="button" class="zbtn" data-z="n3">3<span>'+z.n3+'/3</span></button>'+
      '<button type="button" class="zbtn" data-z="n6">6<span>'+z.n6+'/6</span></button>'+
      '<button type="button" class="zbtn" data-z="n9">9<span>'+z.n9+'/9</span></button>';
  }
  function tap(key){
    var max={n3:3,n6:6,n9:9};
    var z=load();
    z[key]++;
    if(z[key]>=max[key]) z[key]=0;
    save(z);
    paint();
  }
  var css=document.createElement("style");
  css.textContent=[
    "#zahlBox{display:grid;grid-template-columns:1fr 1fr 1fr;gap:.45rem;margin:1.1rem 0 .4rem}",
    "#zahl .zbtn{border:1px solid rgba(255,122,217,.22);background:rgba(28,14,48,.55);color:#f6f0ff;border-radius:1.15rem;padding:1.15rem .2rem .95rem;font:inherit}",
    "#zahl .zbtn span{display:block;margin-top:.35rem;font-size:.72rem;color:#c4b4e0}"
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
  paint();
})();
