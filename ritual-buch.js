(function(){
  var css=document.createElement("style");
  css.textContent=[
    "#buch .hero h2{margin-bottom:.2rem}",
    "#page .pdfbook{white-space:pre-wrap;font-family:Georgia,serif;font-size:1.02rem;line-height:1.65;margin-top:.6rem}"
  ].join("");
  document.head.appendChild(css);
  paintBuch=async function(){
    var page=document.getElementById("page");
    if(!page) return;
    page.innerHTML=
      '<p class="meta">So sei es</p>'+
      '<p class="meta" id="buchWait"></p>'+
      '<div class="words pdfbook" id="buchTxt"></div>';
    var box=document.getElementById("buchTxt");
    var wait=document.getElementById("buchWait");
    try{
      var nums=[0,1,2,3,4];
      var parts=await Promise.all(nums.map(function(n){
        return fetch("pdfpart"+n+".txt?v=2026d",{cache:"reload"}).then(function(r){ return r.ok?r.text():""; });
      }));
      var tx=parts.filter(function(t){ return t && t.indexOf("PLACEHOLDER")<0 && t.length>80; }).join("\n\n");
      if(box && tx.length>200) box.textContent=tx;
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
