(function(){
  var s=document.createElement("style");
  s.textContent=[
    "#kasten{display:block!important;visibility:visible!important;height:auto!important;overflow:visible!important;margin:0 0 .35rem!important}",
    "#home .duo{display:grid!important;grid-template-columns:1fr 1fr!important;gap:.4rem!important;margin:0!important}",
    "#kOut,#sigilBox{display:block!important;aspect-ratio:1/1!important;max-height:none!important;min-height:9.2rem!important;height:auto!important}",
    "#tools{display:grid!important;grid-template-columns:repeat(4,1fr)!important;margin-top:.4rem!important}",
    "#sigRow{display:grid!important}",
    "#under{display:none!important}"
  ].join("");
  document.head.appendChild(s);
  var kast=document.getElementById("kasten");
  var home=document.getElementById("home");
  if(kast && home && kast.parentNode!==home){
    home.insertBefore(kast, home.firstChild);
  }
  if(kast && home && home.firstChild!==kast){
    home.insertBefore(kast, home.firstChild);
  }
})();
