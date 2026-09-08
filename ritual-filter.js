if(typeof cat!=="undefined" && (cat==="Alle"||cat==="Alltag")) cat="Schutz";
(function(){
  var KEY="rr25_dank";
  function day(){
    var n=new Date();
    return n.getFullYear()+"-"+String(n.getMonth()+1).padStart(2,"0")+"-"+String(n.getDate()).padStart(2,"0");
  }
  function done(){ return localStorage.getItem(KEY)===day(); }
  function setDone(){ localStorage.setItem(KEY, day()); paint(); }
  function paint(){
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
  if(typeof openR==="function"){
    var _open=openR;
    openR=function(id,wer){ window._rid=id; return _open(id,wer); };
  }
  var s=document.createElement("style");
  s.textContent=[
    '#cats [data-cat="Alle"],#cats [data-cat="Alltag"]{display:none!important}',
    "#cats .chip:empty{display:none!important}",
    "#pinDank{position:relative;padding-right:2.6rem}",
    "#pinDank .ok{position:absolute;right:.75rem;top:50%;transform:translateY(-50%);width:1.55rem;height:1.55rem;border-radius:50%;border:1px solid rgba(232,160,255,.35);display:flex;align-items:center;justify-content:center;font-size:.95rem;color:#14081c;background:transparent;pointer-events:none}",
    "#pinDank.done .ok{background:linear-gradient(165deg,#9650d2,#e6aaff);border-color:transparent;font-weight:700}"
  ].join("");
  document.head.appendChild(s);
  var old=renderList;
  renderList=function(){
    if(cat==="Alle"||cat==="Alltag"||!cat) cat="Schutz";
    old();
    document.querySelectorAll("#cats .chip").forEach(function(n){
      var name=String(n.getAttribute("data-cat")||n.textContent||"").trim();
      if(!name||name==="Alle"||name==="Alltag") n.remove();
    });
    document.querySelectorAll("#list .group").forEach(function(g){
      if(/Alltag/i.test(g.textContent)) g.remove();
    });
    document.querySelectorAll('#list [data-id="dank"],#list [data-id="fil"]').forEach(function(el){ el.remove(); });
    var home=document.getElementById("home");
    var cats=document.getElementById("cats");
    var pin=document.getElementById("pinDank");
    if(home&&cats&&!pin){
      pin=document.createElement("button");
      pin.type="button";
      pin.id="pinDank";
      pin.className="card";
      pin.innerHTML="<b>Tägliches Dankesritual</b><small>Gesundheit · Liebe · Geld · Schutz</small><span class=\"ok\"></span>";
      pin.onclick=function(){ fromPlan=null; openR("dank"); };
      home.insertBefore(pin, cats);
    }
    paint();
  };
  function maybe(){
    if(window._rid==="dank") setDone();
  }
  var _show=typeof show==="function"?show:null;
  if(_show){
    show=function(id){
      var r=_show.apply(this,arguments);
      if(id==="after"||id==="bye") maybe();
      return r;
    };
  }
  renderList();
})();
