(function(){
  var s=document.createElement("style");
  s.textContent=[
    ".check{display:none!important}",
    "#stay{display:none!important}",
    ".app.runmode header .doll,.app.runmode header .brand,.app.runmode header .sub{display:none}",
    ".app.runmode #run .sub{display:block!important;letter-spacing:.08em;text-transform:uppercase;font-size:.72rem;color:#c4a4d6;margin:0 0 .2rem}"
  ].join("");
  document.head.appendChild(s);
  document.addEventListener("click",function(e){
    if(!e.target.closest("#next")) return;
    var c=document.querySelector("#back");
    if(c) c.checked=true;
  },true);
  var go=document.querySelector("#afterGo");
  if(go) go.onclick=function(){ show("home"); };
})();
