(function(){
  var nav=document.querySelector("nav");
  var app=document.querySelector(".app");
  if(nav&&app) app.appendChild(nav);
  if(nav && !nav.querySelector(".navR")){
    var map={};
    [].slice.call(nav.querySelectorAll("button")).forEach(function(b){ map[b.getAttribute("data-v")]=b; });
    function row(ids){
      var d=document.createElement("div");
      d.className="navR";
      ids.forEach(function(id){ if(map[id]) d.appendChild(map[id]); });
      return d;
    }
    nav.innerHTML="";
    nav.appendChild(row(["home","geplant","kal","log"]));
    nav.appendChild(row(["notiz","opfer","buch"]));
  }
  var s=document.createElement("style");
  s.textContent=[
    "main{padding-bottom:8.2rem!important}"
  ].join("");
  document.head.appendChild(s);
})();
