(function(){
  var s=document.createElement("style");
  s.textContent=[
    "html,body{background:#090614;color:#f6f0ff}",
    ".app{background:radial-gradient(115% 70% at 18% -8%,rgba(255,122,217,.18),transparent 50%),radial-gradient(90% 58% at 100% 0,rgba(46,230,214,.1),transparent 48%),#090614}",
    "header{padding:calc(.38rem + env(safe-area-inset-top)) .8rem .42rem;background:rgba(10,6,20,.78)}",
    "#headRow{min-height:54px;margin:0 0 .08rem}",
    ".doll{width:54px;height:54px;border-radius:17px;box-shadow:0 0 24px rgba(255,122,217,.32)}",
    ".brand{font-size:.7rem;letter-spacing:.32em;margin:.14rem 0 0;color:#ff7ad9}",
    "#moonTxt,#sunTxt{font-size:.6rem;line-height:1.25}",
    "main{padding:0 .8rem 6.8rem!important}",
    "nav{background:rgba(8,4,18,.97)!important;border-color:rgba(126,200,255,.12)!important;padding:.28rem .2rem calc(.34rem + env(safe-area-inset-bottom))!important}",
    "nav button{font-size:.6rem!important;padding:.48rem .04rem .4rem!important;color:#8e7aa8!important}",
    "nav button.on{background:linear-gradient(165deg,#ff7ad9,#7ec8ff)!important;color:#14081c!important;box-shadow:0 8px 18px rgba(255,122,217,.3)}",
    "#cats{gap:.36rem;margin:.55rem 0 .45rem}",
    "#cats .chip{min-height:2.05rem;padding:.42rem .72rem;font-size:.76rem;border-color:rgba(126,200,255,.16);background:rgba(28,14,48,.55);color:#c4b4e0}",
    "#cats .chip.on{background:linear-gradient(165deg,#ff7ad9,#7ef0e6)!important;color:#14081c!important}",
    "#list .card,.card,#pinDank{border-radius:1.15rem;border-color:rgba(255,122,217,.14);background:linear-gradient(180deg,rgba(66,22,86,.5),rgba(14,8,26,.8));box-shadow:0 10px 22px rgba(0,0,0,.2)}",
    "#list .card{padding:1rem 1.05rem;margin:.42rem 0}",
    "#list .card b{font-size:1.08rem}",
    "#list .card small{font-size:.8rem;line-height:1.4}",
    ".hero h2{letter-spacing:.02em;margin:.45rem 0 .28rem}",
    "#run .words{font-size:1.18rem;line-height:1.76}",
    "#run .hero h2{font-size:1.26rem}",
    ".btn{min-height:2.4rem}",
    ".primary{background:linear-gradient(135deg,#ff7ad9,#7ec8ff);color:#14081c}",
    "input,textarea,select{border-radius:.85rem}",
    "#dreiList .kcard{border-radius:1.15rem;padding:1.05rem .95rem}",
    "#pendel .hero h2,#drei .hero h2{text-align:center}",
    "#festHint{border-radius:999px!important;padding:.4rem .8rem!important}",
    ".entry{padding:.8rem 0}",
    ".shots img{border-radius:.7rem}"
  ].join("");
  document.head.appendChild(s);
})();
