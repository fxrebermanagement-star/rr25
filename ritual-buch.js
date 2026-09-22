(function(){
  var PDF="https://drive.google.com/file/d/1qQJ4jg87ZcHqtIGLQZ-VXto_zKy9vZKN/preview";
  var OPEN="https://drive.google.com/file/d/1qQJ4jg87ZcHqtIGLQZ-VXto_zKy9vZKN/view";
  var css=document.createElement("style");
  css.textContent=[
    "#buchPdf{width:100%;height:72vh;border:0;border-radius:1rem;background:#0a0612;margin:.2rem 0 .6rem}",
    "#page .pdfbook{white-space:pre-wrap;font-family:Georgia,serif;font-size:1.02rem;line-height:1.65}"
  ].join("");
  document.head.appendChild(css);
  paintBuch=async function(){
    var page=document.getElementById("page");
    if(!page) return;
    page.innerHTML=
      '<div class="row" style="margin:0 0 .45rem">'+
      '<button type="button" class="btn ghost" id="buchOpen">PDF 1:1 öffnen</button>'+
      '</div>'+
      '<iframe id="buchPdf" title="So sei es" src="'+PDF+'" allow="autoplay"></iframe>'+
      '<p class="meta" id="buchWait">Text lädt …</p>'+
      '<div class="words pdfbook" id="buchTxt"></div>';
    var btn=document.getElementById("buchOpen");
    if(btn) btn.onclick=function(){ window.open(OPEN,"_blank"); };
    var box=document.getElementById("buchTxt");
    var wait=document.getElementById("buchWait");
    try{
      if(!window.BOOKTEXT){
        var nums=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
        var parts=await Promise.all(nums.map(function(n){
          return fetch("pdfpart"+n+".txt?v=2026b",{cache:"reload"}).then(function(r){ return r.ok?r.text():""; });
        }));
        window.BOOKTEXT=parts.filter(Boolean).join("\n\n");
      }
      if(box) box.textContent=window.BOOKTEXT||"";
      if(wait) wait.textContent=window.BOOKTEXT?"Textfassung darunter.":"PDF oben ist das neue Buch.";
    }catch(e){
      if(wait) wait.textContent="PDF oben ist das neue Buch.";
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
