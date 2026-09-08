(function(){
  var s=document.createElement("style");
  s.textContent=[
    "html,body{background:#06030c}",
    ".app{background:radial-gradient(120% 80% at 50% -10%,rgba(150,80,210,.18),transparent 55%),#06030c}",
    "header{background:rgba(8,4,16,.78);border-bottom:1px solid rgba(232,160,255,.08)}",
    ".doll{width:52px;height:52px;border-radius:16px;box-shadow:0 0 22px rgba(255,107,130,.18);border-color:rgba(255,122,217,.4)}",
    ".brand{letter-spacing:.38em;font-size:.6rem}",
    ".sub{opacity:.85}",
    "nav{background:rgba(10,5,18,.97)!important;box-shadow:0 -10px 30px rgba(0,0,0,.35);border-color:rgba(232,160,255,.16)!important}",
    "nav button{padding:.42rem .08rem .36rem;font-size:.55rem}",
    "nav button svg{width:15px;height:15px}",
    "nav button.on{box-shadow:0 6px 16px rgba(150,80,210,.28)}",
    ".duo{gap:.5rem}",
    "#kOut,#sigilBox{border-radius:1.15rem;box-shadow:0 12px 28px rgba(0,0,0,.28)}",
    "#sigilBox{background:radial-gradient(circle at 50% 40%,rgba(255,107,130,.08),#0a0612 70%)}",
    ".kcard{background:linear-gradient(185deg,rgba(86,34,128,.72),rgba(22,8,36,.92));box-shadow:0 10px 24px rgba(0,0,0,.22);border-color:rgba(232,160,255,.22)}",
    "#kOut .kcard{border:0;box-shadow:none;background:transparent}",
    "#dreiList .kcard{padding:1rem .9rem 1.05rem;margin:.5rem 0}",
    "#dreiList .kz{font-size:1.7rem;margin:.2rem 0 .35rem}",
    "#dreiList .kcard b{font-size:1.15rem}",
    "#drei .hero h2{text-align:center;margin-top:.2rem}",
    "#drei .hero .sub{letter-spacing:.18em}",
    ".btn{letter-spacing:.02em}",
    ".primary{box-shadow:0 8px 18px rgba(150,80,210,.22)}",
    ".chip{backdrop-filter:blur(8px)}",
    ".card{box-shadow:0 8px 20px rgba(0,0,0,.16)}",
    "#list .card{padding:.8rem .85rem}",
    "#cats{margin:.35rem 0 .45rem}",
    "#under{margin-top:.48rem}",
    "input,textarea,select{background:#1b0f28}",
    "#sigilGo,#kDrei,#kTag{min-height:2.4rem}"
  ].join("");
  document.head.appendChild(s);
})();
