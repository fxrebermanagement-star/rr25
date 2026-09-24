(function(){
  function order(){
    var home=document.getElementById("home");
    if(!home) return;
    var kast=document.getElementById("kasten");
    var hint=document.getElementById("kHint");
    var mond=document.getElementById("mondSag");
    var dank=document.getElementById("pinDank");
    var cats=document.getElementById("cats");
    var sk=document.getElementById("skizze");
    var list=document.getElementById("list");
    function after(ref, el){
      if(!el) return;
      if(ref && ref.nextSibling) home.insertBefore(el, ref.nextSibling);
      else if(ref) home.appendChild(el);
    }
    if(kast){
      if(hint) after(kast, hint);
      if(sk) after(hint||kast, sk);
      if(mond) after(sk||hint||kast, mond);
      if(dank) after(mond||sk||kast, dank);
      if(cats) after(dank||mond||sk||kast, cats);
      if(list) after(cats||sk, list);
    }
  }
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
    order();
    var sk=document.getElementById("skizze");
    if(sk) sk.style.display=on?"none":"block";
  }
  var css=document.createElement("style");
  css.textContent=[
    "#cats{margin:.2rem 0 .1rem!important}",
    "#skizze{margin:.05rem auto .1rem!important}",
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
