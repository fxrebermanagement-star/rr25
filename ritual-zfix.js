(function(){
  document.addEventListener("click",function(e){
    var z=e.target.closest&&e.target.closest("#z369 [data-z]");
    if(!z) return;
    e.stopImmediatePropagation();
    e.preventDefault();
    if(typeof window._zTap==="function") window._zTap(z.getAttribute("data-z"));
    var el=document.getElementById("z369");
    if(!el) return;
    try{
      var x=JSON.parse(localStorage.getItem("rr25_369")||"{}");
      el.innerHTML=
        '<button type="button" data-z="n3">3 <span>'+(x.n3|0)+'/3</span></button>'+
        '<button type="button" data-z="n6">6 <span>'+(x.n6|0)+'/6</span></button>'+
        '<button type="button" data-z="n9">9 <span>'+(x.n9|0)+'/9</span></button>';
    }catch(err){}
  },true);
})();
