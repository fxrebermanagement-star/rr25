(function(){
  var nav=document.querySelector("nav");
  var app=document.querySelector(".app");
  if(nav&&app) app.appendChild(nav);
  var s=document.createElement("style");
  s.textContent=[
    "nav{position:sticky;bottom:0;margin:0;z-index:8;border-radius:1.05rem 1.05rem 0 0;padding:.3rem .3rem calc(.34rem + env(safe-area-inset-bottom));background:rgba(12,6,20,.96);backdrop-filter:blur(16px);border:1px solid rgba(232,160,255,.22);border-bottom:0}",
    "main{padding-bottom:5.4rem}",
    ".app.runmode nav{margin:0;padding:.22rem .22rem calc(.28rem + env(safe-area-inset-bottom))}"
  ].join("");
  document.head.appendChild(s);
})();
