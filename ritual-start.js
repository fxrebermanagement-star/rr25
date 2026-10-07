(function(){
  function order(){
    var home=document.getElementById("home");
    if(!home) return;
    var kast=document.getElementById("kasten");
    var mond=document.getElementById("mondSag");
    var dank=document.getElementById("pinDank");
    var cats=document.getElementById("cats");
    var lab=document.getElementById("v3CatLab"); /* «Rituale»-Überschrift bleibt direkt über den Chips (kein Nachrutschen) */
    var sk=document.getElementById("skizze");
    var list=document.getElementById("list");
    function after(ref, el){
      if(!el) return;
      if(ref && ref.nextSibling) home.insertBefore(el, ref.nextSibling);
      else if(ref) home.appendChild(el);
    }
    var tone=document.getElementById("toneRow"); /* Ton-Chip (v13) direkt unter dem Kasten, Platz steht fest in index.html */
    if(kast){
      if(tone) after(kast, tone);
      var hint=document.getElementById("ankerHintCard"); /* Build 33: Anker-Hinweis direkt unter der Ton-Zeile */
      if(hint&&tone) after(tone, hint);
      var base=(tone&&hint)||tone||kast;
      if(mond) after(base, mond);
      if(dank) after(mond||base, dank);
      if(lab) after(dank||mond||base, lab);
      if(cats) after(lab||dank||mond||base, cats);
      if(sk) after(cats||dank||mond||base, sk);
      if(list) after(sk||cats, list);
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
    "#cats{margin:.28rem 0 .2rem!important}",
    "#skizze{margin:.15rem auto .15rem!important}",
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
