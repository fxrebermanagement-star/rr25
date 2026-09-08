(function(){
  var k=document.getElementById("kasten");
  if(!k) return;
  var row=k.querySelector(".row");
  var duo=k.querySelector(".duo");
  var tools=document.getElementById("sigilTools");
  if(row) k.insertBefore(row, k.firstChild);
  if(duo&&row) k.insertBefore(duo, row.nextSibling);
  if(tools) k.appendChild(tools);
  var nav=document.querySelector("nav");
  var app=document.querySelector(".app");
  if(nav&&app) app.appendChild(nav);
  var s=document.createElement("style");
  s.textContent="nav{position:fixed!important;left:50%;bottom:0;transform:translateX(-50%);width:100%;max-width:28rem;z-index:40;margin:0!important}";
  document.head.appendChild(s);
})();
