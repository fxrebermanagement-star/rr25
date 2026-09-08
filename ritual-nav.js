(function(){
  var nav=document.querySelector("nav");
  var app=document.querySelector(".app");
  if(nav&&app) app.appendChild(nav);
  var s=document.createElement("style");
  s.textContent=[
    "nav{position:fixed!important;left:50%;bottom:0;transform:translateX(-50%);width:100%;max-width:28rem;margin:0!important;z-index:40;border-radius:1.05rem 1.05rem 0 0;padding:.32rem .32rem calc(.4rem + env(safe-area-inset-bottom));background:rgba(12,6,20,.97)!important;backdrop-filter:blur(16px);border:1px solid rgba(232,160,255,.22);border-bottom:0;box-sizing:border-box}",
    "main{padding-bottom:6rem!important}",
    "header nav{display:none}"
  ].join("");
  document.head.appendChild(s);
})();
