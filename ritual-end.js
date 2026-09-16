(function(){
  var st=document.createElement("style");
  st.textContent="#afterStay,#stay{display:none!important}#run label.check,#run #back{display:none!important}";
  document.head.appendChild(st);

  document.addEventListener("click", function(e){
    var btn=e.target && e.target.closest && e.target.closest("#run #next");
    if(!btn) return;
    var back=document.getElementById("back");
    if(back) back.checked=true;
  }, true);

  function goHome(){
    if(typeof show==="function") show("home");
  }

  function bindAfter(){
    var go=document.getElementById("afterGo");
    if(go && !go._end){
      go._end=1;
      go.textContent="Fertig";
      go.onclick=function(){ goHome(); };
    }
    var stay=document.getElementById("afterStay");
    if(stay) stay.onclick=goHome;
  }
  bindAfter();

  if(typeof show==="function" && !show._end){
    var prev=show;
    show=function(id){
      var r=prev.apply(this,arguments);
      if(id==="after"){
        bindAfter();
        setTimeout(function(){
          var go=document.getElementById("afterGo");
          if(go) go.focus();
        }, 30);
      }
      return r;
    };
    show._end=1;
  }
})();
