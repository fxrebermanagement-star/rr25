(function(){
  var s=document.createElement("style");
  s.textContent="#sigilT,#sigRow input,#underR input{text-transform:uppercase;font-size:1.05rem;letter-spacing:.06em}";
  document.head.appendChild(s);
  function up(){
    var el=document.getElementById("sigilT")||document.querySelector("#sigRow input,#underR input");
    if(!el||el._up) return;
    el._up=1;
    el.setAttribute("autocapitalize","characters");
    el.addEventListener("input",function(){
      var a=el.selectionStart, b=el.selectionEnd;
      var v=el.value.toUpperCase();
      if(el.value!==v){
        el.value=v;
        try{ el.setSelectionRange(a,b); }catch(err){}
      }
    });
  }
  up();
  setTimeout(up,400);
})();
