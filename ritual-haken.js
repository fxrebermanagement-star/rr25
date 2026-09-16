(function(){
  var KEY="rr25_dank";
  function day(){
    var n=new Date();
    return n.getFullYear()+"-"+String(n.getMonth()+1).padStart(2,"0")+"-"+String(n.getDate()).padStart(2,"0");
  }
  function done(){ try{ return localStorage.getItem(KEY)===day(); }catch(e){ return false; } }
  function setDone(){ try{ localStorage.setItem(KEY, day()); }catch(e){} mark(); }
  function mark(){
    var pin=document.getElementById("pinDank");
    if(!pin) return;
    pin.classList.toggle("done", done());
    var ok=pin.querySelector(".ok");
    if(!ok){
      ok=document.createElement("span");
      ok.className="ok";
      pin.appendChild(ok);
    }
    ok.textContent=done()?"\u2713":"";
  }
  var css=document.createElement("style");
  css.textContent=[
    "#pinDank{position:relative;padding-right:3.1rem}",
    "#pinDank .ok{position:absolute;right:.85rem;top:50%;transform:translateY(-50%);width:1.55rem;height:1.55rem;border-radius:50%;border:2px solid rgba(255,122,217,.45);display:flex;align-items:center;justify-content:center;font-size:.95rem;color:#14081c}",
    "#pinDank.done .ok{background:linear-gradient(165deg,#ff7ad9,#7ef0e6);border-color:transparent;font-weight:700}"
  ].join("");
  document.head.appendChild(css);
  if(typeof openR==="function" && !openR._hak){
    var _o=openR;
    openR=function(id){ window._rid=id; return _o.apply(this,arguments); };
    openR._hak=1;
  }
  if(typeof show==="function" && !show._hak){
    var _s=show;
    show=function(id){
      var r=_s.apply(this,arguments);
      if(id==="after"||id==="bye"||id==="home"){
        if(window._rid==="dank") setDone();
        if(id==="home") mark();
      }
      return r;
    };
    show._hak=1;
  }
  document.addEventListener("click", function(e){
    var n=e.target && e.target.closest && e.target.closest("#run #next");
    if(!n) return;
    if(window._rid==="dank" && /So sei es/i.test(n.textContent||"")) setDone();
  }, true);
  mark();
  setTimeout(mark,300);
})();
