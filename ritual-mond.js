(function(){
  function phase(){
    var syn=29.53058867;
    var nm=Date.UTC(2000,0,6,18,14)/1000;
    var age=(((Date.now()/1000)-nm)/86400)%syn;
    if(age<0) age+=syn;
    var p=age/syn;
    if(p<0.03||p>0.97) return {wort:"Setzen",satz:"Neu setzen. Still halten."};
    if(p<0.22) return {wort:"Setzen",satz:"Wachsen lassen. Nicht hetzen."};
    if(p<0.28) return {wort:"Halten",satz:"Form geben. Grenze halten."};
    if(p<0.47) return {wort:"Halten",satz:"Kraft sammeln. Klar bleiben."};
    if(p<0.53) return {wort:"Halten",satz:"Sichtbar. Nicht nachsetzen."};
    if(p<0.72) return {wort:"Abgeben",satz:"Abgeben. Was fällt, darf fallen."};
    if(p<0.78) return {wort:"Abgeben",satz:"Lösen. Zurück zur Mitte."};
    return {wort:"Abgeben",satz:"Leeren. Schlafen lassen."};
  }
  function paint(){
    var home=document.getElementById("home");
    if(!home) return;
    var el=document.getElementById("mondSag");
    if(!el){
      el=document.createElement("p");
      el.id="mondSag";
      var kast=document.getElementById("kasten");
      if(kast) home.insertBefore(el, kast.nextSibling);
      else home.appendChild(el);
    }
    var m=phase();
    el.innerHTML="<span>"+m.wort+"</span>"+m.satz;
  }
  var css=document.createElement("style");
  css.textContent=[
    "#mondSag{margin:.15rem 0 .4rem;font-family:Georgia,serif;font-size:.95rem;line-height:1.4;color:#ead8ff}",
    "#mondSag span{display:inline-block;margin-right:.45rem;letter-spacing:.16em;text-transform:uppercase;font-size:.62rem;font-family:system-ui,sans-serif;color:#ff7ad9;vertical-align:middle}"
  ].join("");
  document.head.appendChild(css);
  paint();
  setTimeout(paint,500);
  if(typeof show==="function" && !show._mond){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="home") paint();
      return r;
    };
    show._mond=1;
  }
})();
