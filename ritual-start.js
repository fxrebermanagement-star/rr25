(function(){
  if(typeof cat!=="undefined") cat="";
  if(typeof renderList==="function" && !renderList._start){
    var rl=renderList;
    renderList=function(){
      var list=document.getElementById("list");
      var cats=document.getElementById("cats");
      if(typeof cat==="undefined" || !cat || cat==="Alle" || cat==="Alltag"){
        try{ cat=""; }catch(e){}
        rl();
        if(list) list.innerHTML="";
        if(cats){
          cats.querySelectorAll(".chip").forEach(function(b){ b.classList.remove("on"); });
        }
      } else {
        rl();
      }
    };
    renderList._start=1;
  }
  var s=document.createElement("style");
  s.textContent=[
    "#list:empty{display:none}",
    "#cats{margin:.35rem 0 .15rem}",
    "#home{padding-bottom:.4rem}"
  ].join("");
  document.head.appendChild(s);
  if(typeof renderList==="function") try{ renderList(); }catch(e){}
})();
