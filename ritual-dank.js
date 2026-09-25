(function(){
  var KEY="rr25_dank";
  var STEPS=[
    ["Vorbereitung",
      "Tu:\nVier Kerzen anzünden.\nSalz bereit.\nGlocke bereit.\nWasser danach.\n\nSprich:\nDie vier stehen:\nGesundheit und Glück.\nLiebe.\nGeld.\nSchutz."],
    ["Standort",
      "Tu:\nFüsse auf den Boden. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage."],
    ["Danke",
      "Sprich dreimal:\nDanke Gott.\nDanke Universum.\nDanke Energien.\nDanke Feld.\n\nTu:\nGlocke dreimal."],
    ["So ist es",
      "Sprich dreimal:\nSo ist es.\n\nTu:\nGlocke dreimal."],
    ["Gesundheit und Glück",
      "Sprich dreimal:\nIch bin gesund.\nIch bin glücklich.\n\nTu:\nGlocke dreimal."],
    ["Liebe",
      "Sprich dreimal:\nIch bin geliebt.\n\nTu:\nGlocke dreimal."],
    ["Geld",
      "Sprich dreimal:\nIch bin versorgt.\n\nTu:\nGlocke dreimal."],
    ["Schutz",
      "Sprich dreimal:\nIch bin geschützt.\n\nTu:\nGlocke dreimal."],
    ["Es ist so",
      "Sprich dreimal:\nEs ist so.\n\nTu:\nGlocke dreimal."],
    ["Salz",
      "Tu:\nDreimal Salz auf jede Kerze.\n\nSprich:\nVersiegelt."],
    ["Schluss",
      "Sprich:\nDanke. Liebe.\nGott. Universum. Energien. Feld.\n\nTu:\nWasser. Alltag.\n\nSprich:\nIch bin hier.\nFeld zu."]
  ];
  function day(){
    var n=new Date();
    return n.getFullYear()+"-"+String(n.getMonth()+1).padStart(2,"0")+"-"+String(n.getDate()).padStart(2,"0");
  }
  function done(){ try{ return localStorage.getItem(KEY)===day(); }catch(e){ return false; } }
  function setDone(){ try{ localStorage.setItem(KEY, day()); }catch(e){} mark(); }
  if(!document.getElementById("dankCss")){
    var css=document.createElement("style");
    css.id="dankCss";
    css.textContent='#pinDank{position:relative}#pinDank .ok{position:absolute;right:.7rem;top:.7rem;font-size:1.35rem;color:#7ef0e6;font-weight:700}#pinDank.done{border-color:rgba(126,240,230,.55)}#pinDank.done b:after{content:" ✓";color:#7ef0e6}';
    document.head.appendChild(css);
  }
  if(typeof R!=="undefined"){
    for(var i=R.length-1;i>=0;i--) if(R[i].id==="dank") R.splice(i,1);
    R.unshift({
      id:"dank",
      t:"Tägliches Dankesritual",
      s:"Gesundheit und Glück · Liebe · Geld · Schutz",
      tag:"Alltag",
      steps:STEPS
    });
  }
  function mark(){
    var pin=document.getElementById("pinDank");
    if(!pin) return;
    pin.classList.toggle("done", done());
    var ok=pin.querySelector(".ok");
    if(ok) ok.textContent=done()?"\u2713":"";
  }
  function pin(){
    var home=document.getElementById("home");
    if(!home) return;
    var el=document.getElementById("pinDank");
    if(!el){
      el=document.createElement("button");
      el.type="button";
      el.id="pinDank";
      el.className="card";
      el.innerHTML="<b>Tägliches Dankesritual</b><small>Gesundheit und Glück · Liebe · Geld · Schutz</small><span class=\"ok\"></span>";
      el.onclick=function(){ if(typeof fromPlan!=="undefined") fromPlan=null; if(typeof openR==="function") openR("dank"); };
      var kast=document.getElementById("kasten");
      var cats=document.getElementById("cats");
      if(kast && kast.nextSibling) home.insertBefore(el, kast.nextSibling);
      else if(cats) home.insertBefore(el, cats);
      else home.appendChild(el);
    }
    mark();
  }
  function maybeDone(id){
    if((id==="after"||id==="bye"||id==="home") && (window._rid==="dank"||window._lastRid==="dank")) setDone();
  }
  if(typeof show==="function" && !show._dank2){
    var _s=show;
    show=function(id){
      var r=_s.apply(this,arguments);
      if(id==="home") pin();
      maybeDone(id);
      return r;
    };
    show._dank2=1;
  }
  if(typeof openR==="function" && !openR._dank2){
    var _o=openR;
    openR=function(id){
      window._rid=id;
      if(id==="dank") window._lastRid="dank";
      return _o.apply(this,arguments);
    };
    openR._dank2=1;
  }
  document.addEventListener("click", function(e){
    var t=e.target && e.target.closest && e.target.closest("#afterGo,#next");
    if(!t) return;
    if(window._rid==="dank" || window._lastRid==="dank"){
      var n=document.getElementById("next");
      var last=n && /fertig|schluss|so sei es/i.test(n.textContent||"");
      if(t.id==="afterGo" || last) setTimeout(setDone, 80);
    }
  }, true);
  pin();
  setTimeout(pin,400);
  setTimeout(pin,1200);
})();
