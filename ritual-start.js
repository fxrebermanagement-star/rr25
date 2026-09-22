(function(){
  function quiet(){
    try{ if(!cat || cat==="Alle" || cat==="Alltag") cat=""; }catch(e){}
    var cats=document.getElementById("cats");
    var list=document.getElementById("list");
    var on=cats && cats.querySelector(".chip.on");
    if(on && (on.getAttribute("data-cat")==="Alle" || on.getAttribute("data-cat")==="Alltag")){
      on.classList.remove("on");
      on=null;
      try{ cat=""; }catch(e){}
    }
    if(!on && list) list.innerHTML="";
    var home=document.getElementById("home");
    var sk=document.getElementById("skizze");
    if(home && sk && cats) home.insertBefore(sk, cats);
    if(sk) sk.style.display=on?"none":"block";
  }
  var css=document.createElement("style");
  css.textContent=[
    "#home:not(:has(#cats .chip.on)) #skizze{display:block!important}",
    "#home:not(:has(#cats .chip.on)) #list{display:none!important}",
    "#home:has(#cats .chip.on) #skizze{display:none!important}",
    "#home:has(#cats .chip.on) #list{display:block!important}"
  ].join("");
  document.head.appendChild(css);
  if(typeof renderList==="function" && !renderList._boot){
    var rl=renderList;
    renderList=function(){ rl(); quiet(); };
    renderList._boot=1;
  }
  if(typeof show==="function" && !show._boot){
    var sh=show;
    show=function(id){
      if(id==="home") try{ cat=""; }catch(e){}
      var r=sh.apply(this,arguments);
      if(id==="home") setTimeout(quiet,0);
      return r;
    };
    show._boot=1;
  }
  quiet();
  setTimeout(quiet,80);
  setTimeout(quiet,240);
})();
