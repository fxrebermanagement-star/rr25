(function(){
  var KEY="rr25_sigil";
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
    s=String(s||"").toUpperCase().replace(/[ÄÖÜAEIOU\s0-9.,;:!?'"\-]/g,"");
    var o="",seen={};
    for(var i=0;i<s.length;i++){var c=s[i]; if(!seen[c]){seen[c]=1;o+=c}}
    return o;
  }
  function loadS(){try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){return{}}}
  function saveS(d){localStorage.setItem(KEY,JSON.stringify(d))}
  function canvas(){
    var c=document.getElementById("sigilC");
    if(!c) return null;
    var r=c.getBoundingClientRect();
    var w=Math.max(280, Math.round(r.width*2)||280);
    var h=Math.max(280, Math.round(r.height*2)||280);
    if(c.width!==w||c.height!==h){ c.width=w; c.height=h; }
    return c;
  }
  function circle(ctx,x,y,r){
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.stroke();
  }
  function draw(letters){
    var c=canvas(); if(!c) return;
    var ctx=c.getContext("2d"),w=c.width,h=c.height,m=Math.min(w,h);
    var g=ctx.createRadialGradient(w*0.5,h*0.42,m*0.05,w*0.5,h*0.5,m*0.62);
    g.addColorStop(0,"#1a0a28");
    g.addColorStop(1,"#07040d");
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    ctx.save();
    ctx.translate(w/2,h/2);
    ctx.strokeStyle="rgba(126,240,230,.22)";
    ctx.lineWidth=Math.max(1.2,m/220);
    circle(ctx,0,0,m*0.42);
    ctx.strokeStyle="rgba(255,122,217,.2)";
    circle(ctx,0,0,m*0.36);
    ctx.strokeStyle="rgba(255,255,255,.08)";
    ctx.lineWidth=Math.max(1,m/260);
    for(var t=0;t<12;t++){
      var a=t*Math.PI/6;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a)*m*0.42, Math.sin(a)*m*0.42);
      ctx.lineTo(Math.cos(a)*m*0.39, Math.sin(a)*m*0.39);
      ctx.stroke();
    }
    if(letters){
      var n=letters.length;
      var lw=Math.max(2.6,m/70);
      for(var pass=0;pass<2;pass++){
        for(var i=0;i<n;i++){
          var pts=L[letters[i]]||L.X;
          ctx.save();
          ctx.rotate((i/Math.max(n,1))*Math.PI*0.42);
          var sc=0.62-i*0.012;
          ctx.lineCap="round"; ctx.lineJoin="round";
          if(pass===0){
            ctx.strokeStyle=i%2?"rgba(126,240,230,.55)":"rgba(255,122,217,.55)";
            ctx.shadowColor=i%2?"#7ef0e6":"#ff7ad9";
            ctx.shadowBlur=m/14;
            ctx.lineWidth=lw+2;
          } else {
            ctx.shadowBlur=0;
            ctx.strokeStyle=i%2?"#b8fff4":"#ffd1f2";
            ctx.lineWidth=lw*0.7;
          }
          ctx.beginPath();
          pts.forEach(function(p,k){
            var x=(p[0]-.5)*m*sc, y=(p[1]-.5)*m*sc;
            if(k) ctx.lineTo(x,y); else ctx.moveTo(x,y);
          });
          ctx.stroke();
          ctx.restore();
        }
      }
      ctx.fillStyle="#ff7ad9";
      ctx.shadowColor="#ff7ad9";
      ctx.shadowBlur=m/18;
      ctx.beginPath(); ctx.arc(0,0,Math.max(2.4,m/90),0,Math.PI*2); ctx.fill();
    }
    ctx.restore();
  }
  function field(){ return document.getElementById("sigilT")||document.querySelector("#underR input"); }
  function text(){ var el=field(); return el?el.value:""; }
  function go(){
    var t=text();
    var letters=red(t);
    draw(letters);
    saveS({t:t,l:letters});
  }
  function restore(){
    var d=loadS();
    var el=field();
    if(el&&d.t) el.value=d.t;
    if(d.l) draw(d.l);
    else draw("");
  }
  window._sigilGo=go;
  document.addEventListener("click",function(e){
    if(e.target&&(e.target.id==="sigilGo"||(e.target.closest&&e.target.closest("#sigilGo")))){
      e.preventDefault();
      go();
    }
  },true);
  document.addEventListener("keydown",function(e){
    if(e.key==="Enter"&&e.target&&e.target.id==="sigilT") go();
  });
  setTimeout(restore,80);
  setTimeout(restore,400);
})();
