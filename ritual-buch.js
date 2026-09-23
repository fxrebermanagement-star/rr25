(function(){
  var ID="1ddPNShv1NKKxTcV5j4Xj0P_S_9QZJAHr";
  var PREVIEW="https://drive.google.com/file/d/"+ID+"/preview";
  var OPEN="https://drive.google.com/file/d/"+ID+"/view";
  var css=document.createElement("style");
  css.textContent=[
    "#buch .hero h2{margin-bottom:.2rem}",
    "#buchPdfWrap{margin:.15rem 0 .4rem;border-radius:1rem;overflow:hidden;border:1px solid rgba(126,200,255,.2);background:#0a0612}",
    "#buchPdf{width:100%;height:min(78vh,38rem);border:0;display:block;background:#111}",
    "#page .pdfbook{white-space:pre-wrap;font-family:Georgia,serif;font-size:1.02rem;line-height:1.65;margin-top:.6rem}"
  ].join("");
  document.head.appendChild(css);
  paintBuch=async function(){
    var page=document.getElementById("page");
    if(!page) return;
    page.innerHTML=
      '<p class="meta">So sei es · gestraffte Auflage · 23 Seiten</p>'+
      '<div class="row" style="margin:.2rem 0 .45rem">'+
      '<button type="button" class="btn primary" id="buchOpen">Ganzes PDF öffnen</button>'+
      '</div>'+
      '<div id="buchPdfWrap"><iframe id="buchPdf" title="So sei es" src="'+PREVIEW+'" allow="fullscreen"></iframe></div>'+
      '<p class="meta" id="buchWait"></p>'+
      '<div class="words pdfbook" id="buchTxt"></div>';
    var btn=document.getElementById("buchOpen");
    if(btn) btn.onclick=function(){ window.open(OPEN,"_blank"); };
    var box=document.getElementById("buchTxt");
    var wait=document.getElementById("buchWait");
    try{
      var tx=await fetch("pdfpart0.txt?v=2026d",{cache:"reload"}).then(function(r){ return r.ok?r.text():""; });
      if(box && tx && tx.length>80 && tx.indexOf("PLACEHOLDER")<0) box.textContent=tx;
      if(wait) wait.textContent="";
    }catch(e){
      if(wait) wait.textContent="";
    }
  };
  if(typeof show==="function" && !show._buchneu){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="buch") paintBuch();
      return r;
    };
    show._buchneu=1;
  }
})();
