(function(){
  var s=document.createElement("style");
  s.textContent=[
    ":root{--bg:#090614;--elev:rgba(48,18,72,.7);--line:rgba(126,200,255,.2);--ink:#f6f0ff;--dim:#c4b4e0;--pink:#ff7ad9}",
    "html,body{background:#090614;color:#f6f0ff}",
    ".app{background:radial-gradient(115% 70% at 20% -8%,rgba(255,122,217,.2),transparent 50%),radial-gradient(90% 60% at 100% 0%,rgba(46,230,214,.12),transparent 46%),#090614}",
    "header{background:rgba(10,6,20,.8)}",
    ".doll{box-shadow:0 0 26px rgba(255,122,217,.4);border-color:rgba(255,122,217,.55)}",
    ".brand{color:#ff7ad9;text-shadow:0 0 18px rgba(255,122,217,.35)}",
    ".sub{color:#9fd6ff}",
    "#moonTxt{color:#c9a0ff}",
    "#sunTxt{color:#7ef0e6}",
    "nav{background:rgba(8,4,18,.97)!important;border-color:rgba(126,200,255,.12)!important}",
    "nav button{color:#8e7aa8!important}",
    "nav button.on{color:#14081c!important;background:linear-gradient(165deg,#ff7ad9,#7ec8ff)!important;box-shadow:0 8px 20px rgba(255,122,217,.35)}",
    "#cats .chip{border-color:rgba(126,200,255,.18);background:rgba(30,16,50,.55);color:#c4b4e0}",
    "#cats .chip.on{background:linear-gradient(165deg,#ff7ad9,#7ef0e6)!important;color:#14081c!important}",
    "#list .card,#pinDank,.card{border-color:rgba(255,122,217,.16);background:linear-gradient(180deg,rgba(70,24,90,.5),rgba(12,8,28,.82))}",
    "#kOut{border-color:rgba(255,122,217,.38);box-shadow:0 0 22px rgba(255,122,217,.12)}",
    "#sigilBox{border-color:rgba(46,230,214,.28);box-shadow:0 0 22px rgba(46,230,214,.1)}",
    ".primary{background:linear-gradient(135deg,#ff7ad9,#7ec8ff);color:#14081c;box-shadow:0 8px 18px rgba(255,122,217,.28)}",
    ".ghost{background:rgba(30,16,50,.55);color:#f6f0ff}",
    "input,textarea,select{background:#140a22;border-color:rgba(126,200,255,.2);color:#f6f0ff}",
    ".group,.msg{color:#ff7ad9}",
    ".kz{color:#7ef0e6}",
    ".pbar::before{background:linear-gradient(90deg,#ff7ad9,#7ec8ff,#7dffa3)}"
  ].join("");
  document.head.appendChild(s);
})();
