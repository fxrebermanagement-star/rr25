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
    "nav{position:fixed!important;left:50%;bottom:0;transform:translateX(-50%);width:100%;max-width:28rem;margin:0!important;z-index:40;display:flex!important;flex-direction:column;gap:.18rem;border-radius:1.15rem 1.15rem 0 0;padding:.34rem .28rem calc(.42rem + env(safe-area-inset-bottom));background:rgba(12,6,20,.97)!important;backdrop-filter:blur(16px);border:1px solid rgba(232,160,255,.22);border-bottom:0;box-sizing:border-box;grid-template-columns:none!important}",
    "nav .navR{display:grid;gap:.18rem}",
    "nav .navR:first-child{grid-template-columns:repeat(4,1fr)}",
    "nav .navR:last-child{grid-template-columns:repeat(3,1fr);padding:0 8%}",
    "nav button{font-size:.6rem!important;padding:.42rem .04rem .34rem!important;min-height:2.55rem}",
    "nav button svg{width:18px!important;height:18px!important}",
    "main{padding-bottom:8.2rem!important}",
    "header nav{display:none}"
  ].join("");
  document.head.appendChild(s);
})();
