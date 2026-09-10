(function(){
  try{ localStorage.setItem("rr25_kleid","neon"); }catch(e){}
  document.documentElement.setAttribute("data-kleid","neon");
  var b=document.getElementById("kleidBtn");
  if(b) b.remove();
  var s=document.createElement("style");
  s.textContent=[
    "#kleidBtn{display:none!important}",
    "html[data-kleid=neon] #cats .chip.on{background:linear-gradient(165deg,#ff7ad9,#7ef0e6)!important;color:#14081c!important}"
  ].join("");
  document.head.appendChild(s);
  setTimeout(function(){
    var x=document.getElementById("kleidBtn");
    if(x) x.remove();
  },400);
})();
