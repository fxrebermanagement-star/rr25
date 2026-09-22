(function(){
  var css=document.createElement("style");
  css.textContent=[
    "html,body{background:#070510;overscroll-behavior:none}",
    ".app{background:radial-gradient(110% 70% at 50% -12%,rgba(255,122,217,.16),transparent 46%),radial-gradient(80% 40% at 100% 0,rgba(126,200,255,.08),transparent 40%),#070510}",
    "header{padding:calc(.28rem + env(safe-area-inset-top)) .75rem .28rem!important;background:rgba(7,5,16,.9)!important;border-bottom:1px solid rgba(255,122,217,.12)}",
    "#headRow{min-height:50px}",
    ".doll{width:50px;height:50px;border-radius:16px;border-color:rgba(255,122,217,.5);box-shadow:0 0 18px rgba(255,122,217,.2)}",
    ".brand{margin:.08rem 0 0;letter-spacing:.36em;font-size:.66rem;color:#ff8adf;text-shadow:0 0 16px rgba(255,122,217,.3)}",
    "#moonTxt,#sunTxt{font-size:.56rem;color:#b9a8d0}",
    "main{padding:0 .75rem 9.3rem!important}",
    "#home{padding-bottom:.1rem}",
    "#kasten{margin:0 0 .22rem!important;padding:.08rem 0 .12rem!important}",
    "#home .duo{gap:.38rem!important}",
    "#kOut,#sigilBox{border-radius:1.15rem!important;min-height:8.6rem!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.05),0 10px 24px rgba(0,0,0,.2)}",
    "#tools{gap:.32rem!important;margin-top:.36rem!important}",
    "#tools .tile{border-radius:1rem!important;background:rgba(14,8,24,.78)!important;min-height:2.95rem;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06)}",
    "#tools .tile:active{transform:scale(.97)}",
    "#sigRow{margin-top:.32rem!important;gap:.28rem!important}",
    "#sigRow input,#sigilT{min-height:2.2rem;border-radius:.9rem;background:#120a1e;border-color:rgba(255,122,217,.22)}",
    "#sigilSave{border-radius:.9rem;background:linear-gradient(165deg,#5a2a68,#24102c);color:#f4e8ff;border:1px solid rgba(255,122,217,.28);font-size:.72rem}",
    "#mondSag{margin:.08rem 0 .22rem!important;font-size:.88rem!important;color:#e6d6ff}",
    "#mondSag span{letter-spacing:.18em;font-size:.58rem!important}",
    "#pinDank{margin:.18rem 0 .22rem!important;padding:.68rem .8rem!important;border-radius:1.15rem;background:linear-gradient(180deg,rgba(72,28,88,.55),rgba(18,10,28,.88));border:1px solid rgba(255,122,217,.2)}",
    "#pinDank b{font-size:1.02rem}",
    "#cats{margin:.18rem 0 .08rem!important;gap:.32rem!important}",
    ".chip{border-radius:999px;background:rgba(18,10,28,.75);border-color:rgba(255,255,255,.1)}",
    "#skizze{margin:.18rem auto 0!important;width:96%!important;max-width:26rem!important}",
    "#skizze svg{height:12.6rem!important}",
    ".card{border-radius:1.15rem;background:linear-gradient(180deg,rgba(48,20,68,.55),rgba(14,8,24,.88));border:1px solid rgba(255,122,217,.14)}",
    "#list .card{margin:.2rem 0}",
    ".hero h2{font-size:1.22rem;letter-spacing:.02em}",
    "#run .words{font-size:1.12rem;line-height:1.68}",
    ".btn.primary{box-shadow:0 6px 18px rgba(255,122,217,.2)}",
    ".btn.ghost{border:1px solid rgba(255,255,255,.08)}",
    ".kalcard{border-radius:1.05rem;overflow:hidden}",
    "#buchPdfWrap{box-shadow:0 10px 28px rgba(0,0,0,.28)}",
    "input,textarea,select{border-radius:.9rem}",
    "#home{overflow:hidden}"
  ].join("");
  document.head.appendChild(css);

  var home=document.getElementById("home");
  if(home){
    home.style.overflow="hidden";
  }
})();
