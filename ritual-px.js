(function(){
  var css=document.createElement("style");
  css.textContent='#cats .chip.on{background:linear-gradient(165deg,#ff7ad9,#7ef0e6)!important;color:#14081c!important;border-color:transparent!important;font-weight:650}';
  document.head.appendChild(css);
  function grab(id){
    if(typeof R==="undefined") return null;
    for(var i=0;i<R.length;i++) if(R[i].id===id) return R[i];
    return null;
  }
  function mark(){
    var cats=document.getElementById("cats");
    if(!cats) return;
    var now=String(cat||"");
    cats.querySelectorAll(".chip").forEach(function(b){
      b.classList.toggle("on", b.getAttribute("data-cat")===now);
    });
  }
  function ensure(){
    if(typeof R==="undefined") return;
    var s=grab("segen");
    if(s){ s.t="Segen"; s.s="Ein Name. Ein Satz Wofür."; s.tag="Person X"; }
    else R.push({id:"segen",t:"Segen",s:"Ein Name. Ein Satz Wofür.",tag:"Person X",need:["Name","Wofür"],steps:[]});
    var f=grab("fluch");
    if(f){ f.t="Fluch"; f.s="Hart. Wort auf Person X."; f.tag="Person X"; }
    var u=grab("ueber");
    if(u){ u.t="Person übernehmen"; u.s="Hart. Ich bin [Name]."; u.tag="Person X"; }
  }
  function cards(){
    var list=document.getElementById("list");
    if(!list || typeof cat==="undefined" || cat!=="Person X") return;
    ["segen","fluch","ueber"].forEach(function(id){
      if(list.querySelector('[data-id="'+id+'"]')) return;
      var r=grab(id); if(!r) return;
      var b=document.createElement("button");
      b.type="button"; b.className="card"; b.setAttribute("data-id",id);
      b.innerHTML="<b>"+r.t+"</b><small>"+(r.s||"")+"</small>";
      b.onclick=function(){ fromPlan=null; if(typeof openR==="function") openR(id); };
      list.appendChild(b);
    });
  }
  ensure();
  if(typeof renderList==="function" && !renderList._px){
    var rl=renderList;
    renderList=function(){
      ensure();
      rl();
      cards();
      mark();
    };
    renderList._px=1;
  }
  document.addEventListener("click", function(e){
    var b=e.target && e.target.closest && e.target.closest("#cats .chip");
    if(!b) return;
    setTimeout(mark, 0);
    setTimeout(mark, 40);
  });
  if(typeof renderList==="function") try{ renderList(); }catch(e){}
  mark();
})();
