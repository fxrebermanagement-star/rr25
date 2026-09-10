(function(){
  document.documentElement.setAttribute("data-kleid","neon");
  try{ localStorage.setItem("rr25_kleid","neon"); }catch(e){}

  var css=document.createElement("style");
  css.id="feinCss";
  css.textContent=[
    "#kleidBtn,nav [data-v=person]{display:none!important}",
    "nav{grid-template-columns:repeat(5,1fr)!important;padding:.42rem .22rem calc(.48rem + env(safe-area-inset-bottom))!important}",
    "nav button{font-size:.64rem!important;padding:.62rem .06rem .52rem!important;min-height:3.15rem}",
    "nav button svg{width:20px!important;height:20px!important}",
    "body{background:radial-gradient(120% 80% at 50% -10%,#2a1240 0%,#090614 55%) fixed}",
    ".doll{box-shadow:0 0 18px rgba(255,122,217,.35);border-color:rgba(255,122,217,.7)!important}",
    ".brand{text-shadow:0 0 18px rgba(255,122,217,.45)}",
    "#kOut,#sigilBox{box-shadow:0 0 22px rgba(126,200,255,.08);position:relative}",
    "#kOut:empty::after{content:'Karte';position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#6a547c;letter-spacing:.16em;font-size:.68rem;text-transform:uppercase}",
    "#sigilBox:has(#sigilC)::before{content:'';}",
    "#tools .tile{box-shadow:0 0 14px rgba(255,122,217,.08);transition:transform .12s ease,box-shadow .12s ease}",
    "#tools .tile:active{transform:scale(.97)}",
    "#cats{gap:.4rem;padding:.08rem 0 .1rem}",
    "#cats .chip{box-shadow:0 0 10px rgba(255,122,217,.06)}",
    "#cats .chip.on{box-shadow:0 0 16px rgba(255,122,217,.28)}",
    "#list .card{border-color:rgba(232,160,255,.16)!important;box-shadow:0 8px 22px rgba(0,0,0,.22);transition:transform .12s ease}",
    "#list .card:active{transform:scale(.99)}",
    ".group{letter-spacing:.2em;color:#ff9ae4!important}",
    "#pinDank{border:1px solid rgba(126,240,230,.28)!important}",
    "input,textarea,select{border-color:rgba(126,200,255,.22)!important}",
    "input:focus,textarea:focus{outline:0;border-color:#ff7ad9!important;box-shadow:0 0 0 3px rgba(255,122,217,.15)}",
    ".btn.primary{box-shadow:0 0 18px rgba(255,122,217,.28)}",
    ".pbar{height:4px!important;background:rgba(255,122,217,.12)!important}",
    "#run .words{font-size:1.2rem;line-height:1.78}",
    "#page{line-height:1.7}",
    ".entry{padding:.9rem 0}",
    "#sigRow #sigilSave{background:linear-gradient(135deg,#ff7ad9,#7ec8ff);color:#14081c;font-weight:650;border:0}"
  ].join("");
  document.head.appendChild(css);

  function clean(){
    var k=document.getElementById("kleidBtn");
    if(k) k.remove();
    document.querySelectorAll('nav [data-v="person"]').forEach(function(n){ n.remove(); });
    var cats=document.getElementById("cats");
    if(cats && !cats.querySelector('[data-cat="Person X"]')){
      var b=document.createElement("button");
      b.className="chip"+(typeof cat!=="undefined"&&cat==="Person X"?" on":"");
      b.setAttribute("data-cat","Person X");
      b.textContent="Person X";
      b.onclick=function(){ cat="Person X"; if(typeof renderList==="function") renderList(); };
      cats.appendChild(b);
    }
  }
  clean();
  setTimeout(clean,300);
  setTimeout(clean,900);
})();
