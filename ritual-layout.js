(function(){
  var k=document.getElementById("kasten");
  if(!k) return;
  var row=k.querySelector(".row");
  var duo=k.querySelector(".duo");
  var tools=document.getElementById("sigilTools");
  if(duo) k.insertBefore(duo, k.firstChild);
  if(row&&duo) k.insertBefore(row, duo.nextSibling);
  if(tools) k.appendChild(tools);
  var s=document.createElement("style");
  s.textContent="#kasten .row{margin-top:.4rem}#sigilTools{margin-top:.35rem}";
  document.head.appendChild(s);
})();
