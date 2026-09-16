(function(){
  var under=document.getElementById("under");
  var tools=document.getElementById("tools");
  if(tools && under) under.style.display="none";
  var s=document.createElement("style");
  s.textContent=[
    "html,body{overflow-x:hidden}",
    "#home.screen.on{padding-top:.05rem}",
    "#kasten{margin:0 0 .28rem}",
    "#home .duo{gap:.32rem;margin:0}",
    "#kOut,#sigilBox{aspect-ratio:1/1;max-height:38vw}",
    "#tools{margin-top:.32rem!important;gap:.28rem!important}",
    "#tools .tile{padding:.38rem .04rem .32rem!important}",
    "#sigRow{margin-top:.28rem!important}",
    "#pinDank{margin:.28rem 0 .2rem;padding:.58rem .7rem}",
    "#cats{margin:.28rem 0 .2rem}",
    "#list .card{margin:.16rem 0;padding:.72rem .8rem}",
    "header{padding-bottom:.2rem}",
    "#headRow{min-height:48px}",
    ".doll{width:48px;height:48px}",
    "nav{padding-top:.22rem!important}"
  ].join("");
  document.head.appendChild(s);
})();
