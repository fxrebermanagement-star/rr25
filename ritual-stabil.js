(function(){
  var css=document.createElement("style");
  css.textContent=[
    "#home{position:relative}",
    "#kasten{min-height:11.2rem}",
    "#pinDank{min-height:4.4rem;margin:.15rem 0 .55rem}",
    "#cats{min-height:2.4rem}",
    "#list{min-height:30vh}",
    "#quickFlip,#quickRow,#pinWeg,#faceDank,#faceWeg{display:none!important}",
    "#list .card[data-id=dank]{display:none!important}"
  ].join("");
  document.head.appendChild(css);

  var locked=false;
  function placeDank(){
    var home=document.getElementById("home");
    var kast=document.getElementById("kasten");
    var el=document.getElementById("pinDank");
    if(!home || !el || !kast) return;
    if(el.previousSibling===kast) return;
    if(kast.nextSibling!==el){
      if(kast.nextSibling) home.insertBefore(el, kast.nextSibling);
      else home.appendChild(el);
    }
  }
  function clean(){
    document.querySelectorAll("#quickFlip,#quickRow,#pinWeg").forEach(function(n){ n.remove(); });
    placeDank();
  }
  if(typeof renderList==="function"){
    var _rl=renderList;
    var timer=null;
    renderList=function(){
      if(timer) clearTimeout(timer);
      var args=arguments;
      timer=setTimeout(function(){
        _rl.apply(null,args);
        clean();
      },40);
    };
  }
  if(typeof show==="function"){
    var _s=show;
    show=function(id){
      var r=_s.apply(this,arguments);
      if(id==="home") setTimeout(clean,20);
      return r;
    };
  }
  clean();
  setTimeout(function(){ locked=true; clean(); }, 600);
})();
