(function(){
  var s=document.createElement("style");
  s.textContent=".check{display:none!important}#stay{display:none!important}";
  document.head.appendChild(s);
  document.addEventListener("click",function(e){
    if(!e.target.closest("#next")) return;
    var c=document.querySelector("#back");
    if(c) c.checked=true;
  },true);
  var go=document.querySelector("#afterGo");
  if(go) go.onclick=function(){ show("home"); };
})();
