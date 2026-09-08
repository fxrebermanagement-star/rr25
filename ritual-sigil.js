(function(){
  var L={
    B:[[.3,.15],[.3,.85],[.3,.15],[.7,.28],[.3,.5],[.7,.72],[.3,.85]],
    C:[[.72,.22],[.3,.2],[.28,.8],[.72,.78]],
    D:[[.3,.15],[.3,.85],[.3,.15],[.72,.5],[.3,.85]],
    F:[[.3,.85],[.3,.15],[.72,.15],[.3,.15],[.3,.5],[.62,.5]],
    G:[[.7,.22],[.3,.22],[.28,.78],[.7,.78],[.7,.52],[.5,.52]],
    H:[[.28,.15],[.28,.85],[.28,.5],[.72,.5],[.72,.15],[.72,.85]],
    J:[[.68,.15],[.68,.7],[.5,.85],[.32,.7]],
    K:[[.3,.15],[.3,.85],[.3,.5],[.72,.15],[.3,.5],[.72,.85]],
    L:[[.32,.15],[.32,.85],[.7,.85]],
    M:[[.22,.85],[.22,.15],[.5,.55],[.78,.15],[.78,.85]],
    N:[[.28,.85],[.28,.15],[.72,.85],[.72,.15]],
    P:[[.3,.85],[.3,.15],[.68,.15],[.7,.38],[.3,.48]],
    Q:[[.5,.2],[.28,.38],[.28,.7],[.5,.85],[.72,.7],[.72,.38],[.5,.2],[.55,.7],[.78,.88]],
    R:[[.3,.85],[.3,.15],[.68,.15],[.7,.38],[.3,.48],[.7,.85]],
    S:[[.7,.22],[.32,.2],[.3,.48],[.7,.52],[.7,.8],[.3,.82]],
    T:[[.22,.18],[.78,.18],[.5,.18],[.5,.85]],
    V:[[.22,.15],[.5,.85],[.78,.15]],
    W:[[.18,.15],[.32,.85],[.5,.4],[.68,.85],[.82,.15]],
    X:[[.25,.18],[.75,.82],[.75,.18],[.25,.82]],
    Y:[[.22,.15],[.5,.5],[.78,.15],[.5,.5],[.5,.85]],
    Z:[[.25,.18],[.75,.18],[.25,.82],[.75,.82]]
  };
  function red(s){
    s=String(s||"").toUpperCase().replace(/[AEIOUÄÖÜ\s0-9.,;:!?'"\-]/g,"");
    var o="",seen={};
    for(var i=0;i<s.length;i++){var c=s[i]; if(!seen[c]){seen[c]=1;o+=c}}
    return o;
  }
  function canvas(){
    var c=document.getElementById("sigilC");
    if(!c) return null;
    var r=c.getBoundingClientRect();
    var w=Math.max(220, Math.round(r.width*2)||220);
    var h=Math.max(220, Math.round(r.height*2)||220);
    if(c.width!==w||c.height!==h){ c.width=w; c.height=h; }
    return c;
  }
  function draw(letters){
    var c=canvas(); if(!c) return;
    var ctx=c.getContext("2d"),w=c.width,h=c.height;
    ctx.fillStyle="#07040d"; ctx.fillRect(0,0,w,h);
    if(!letters) letters="X";
    ctx.strokeStyle="#ff6b82"; ctx.lineWidth=Math.max(3,w/80); ctx.lineCap="round"; ctx.lineJoin="round";
    var n=letters.length;
    for(var i=0;i<n;i++){
      var pts=L[letters[i]]||L.X;
      ctx.save();
      ctx.translate(w/2,h/2);
      ctx.rotate((i/Math.max(n,1))*Math.PI*0.7);
      ctx.beginPath();
      pts.forEach(function(p,k){
        var x=(p[0]-.5)*w*0.7, y=(p[1]-.5)*h*0.7;
        if(k) ctx.lineTo(x,y); else ctx.moveTo(x,y);
      });
      ctx.stroke();
      ctx.restore();
    }
  }
  function text(){
    var el=document.getElementById("sigilT")||document.querySelector("#sigilTools input")||document.querySelector("#sigilBox input");
    return el?el.value:"";
  }
  function go(){ draw(red(text())); }
  window._sigilGo=go;
  document.addEventListener("click",function(e){
    if(e.target&&(e.target.id==="sigilGo"||e.target.id==="sigilGo2"||(e.target.closest&&e.target.closest("#sigilGo,#sigilGo2,#sigilTools button")))){
      e.preventDefault();
      go();
    }
  },true);
  document.addEventListener("keydown",function(e){
    if(e.key==="Enter"&&e.target&&(e.target.id==="sigilT"||e.target.id==="sigilT2")) go();
  });
})();
