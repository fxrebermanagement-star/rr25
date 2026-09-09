(function(){
  var on=false, raf=0, t0=0;
  var x=0, y=0, vx=0, vy=0;
  var gx=0, gy=0, primed=false, lock=null;
  var trail=[], c, ctx;
  var W=Math.PI*2/1.05;

  function ready(){
    if(document.getElementById("pendelGo")) return;
    var kast=document.getElementById("kasten");
    if(!kast) return;
    var b=document.createElement("button");
    b.type="button"; b.id="pendelGo"; b.className="btn ghost";
    b.textContent="Pendel";
    b.style.cssText="margin-top:.45rem;width:100%;min-height:2.45rem";
    kast.appendChild(b);
  }
  function hint(t){
    var h=document.getElementById("pendelHint");
    if(h) h.textContent=t;
  }

  function draw(){
    if(!c||!ctx) return;
    var w=c.width, h=c.height;
    ctx.clearRect(0,0,w,h);
    var cx=w/2, cy=h/2, R=Math.min(w,h)*0.36;
    var glow=ctx.createRadialGradient(cx,cy,8,cx,cy,R*1.25);
    glow.addColorStop(0,"rgba(150,80,210,.2)");
    glow.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle=glow;
    ctx.beginPath(); ctx.arc(cx,cy,R*1.2,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle="rgba(232,160,255,.18)";
    ctx.lineWidth=Math.max(1.2,w/220);
    ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx,cy,R*0.55,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy-R); ctx.lineTo(cx, cy+R); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx-R, cy); ctx.lineTo(cx+R, cy); ctx.stroke();
    ctx.fillStyle="rgba(230,170,255,.85)";
    ctx.font=(w*0.042)+"px Georgia,serif";
    ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillText("JA", cx, cy-R-w*0.038);
    ctx.fillText("JA", cx, cy+R+w*0.038);
    ctx.fillStyle="rgba(196,164,214,.8)";
    ctx.fillText("NEIN", cx-R-w*0.078, cy);
    ctx.fillText("NEIN", cx+R+w*0.078, cy);
    if(trail.length>1){
      ctx.strokeStyle="rgba(255,122,217,.28)";
      ctx.lineWidth=2;
      ctx.beginPath();
      trail.forEach(function(p,i){
        var px=cx+p.x*R, py=cy-p.y*R;
        if(i) ctx.lineTo(px,py); else ctx.moveTo(px,py);
      });
      ctx.stroke();
    }
    var px=cx+x*R, py=cy-y*R;
    ctx.save();
    ctx.translate(px+5, py+8);
    ctx.scale(1,0.32);
    ctx.fillStyle="rgba(0,0,0,.3)";
    ctx.beginPath(); ctx.arc(0,0,20,0,Math.PI*2); ctx.fill();
    ctx.restore();
    var r=Math.max(15,w/18);
    ctx.save();
    ctx.translate(px,py);
    var grd=ctx.createRadialGradient(-r*0.32,-r*0.36,2,0,0,r);
    grd.addColorStop(0,"#ffe6f6");
    grd.addColorStop(0.4,"#ff7ad9");
    grd.addColorStop(1,"#6a2478");
    ctx.fillStyle=grd;
    ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle="rgba(255,230,246,.65)";
    ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(0,0,r*0.7,-2.3,-0.35); ctx.stroke();
    ctx.restore();
  }

  function step(){
    var dt=1/60;
    vx += -W*W*x*dt;
    vy += -W*W*y*dt;
    vx*=0.9992; vy*=0.9992;
    if(lock==="ja"){ vx*=0.96; x*=0.96; }
    if(lock==="nein"){ vy*=0.96; y*=0.96; }
    x += vx*dt*60*0.016;
    y += vy*dt*60*0.016;
    x += vx*dt; y += vy*dt;
    var m=Math.sqrt(x*x+y*y);
    if(m>0.82){ x*=0.82/m; y*=0.82/m; vx*=0.7; vy*=0.7; }
    if(!lock){
      var ax=Math.abs(x), ay=Math.abs(y);
      var phase=x*vy-y*vx;
      if(Math.abs(phase)>0.004 && ax>0.12 && ay>0.12) lock="kreis";
      else if(ay>0.22 && ay>ax*1.6) lock="ja";
      else if(ax>0.22 && ax>ay*1.6) lock="nein";
      if(lock==="ja") hint("Bahn: Ja");
      if(lock==="nein") hint("Bahn: Nein");
      if(lock==="kreis") hint("Bahn: Kreis");
    }
    trail.push({x:x,y:y});
    if(trail.length>90) trail.shift();
  }

  function loop(){
    if(!on) return;
    step(); draw();
    raf=requestAnimationFrame(loop);
  }

  function onMot(e){
    var a=e.acceleration, g=e.accelerationIncludingGravity;
    var px=0, py=0;
    if(a && typeof a.x==="number"){ px=a.x; py=a.y; }
    else if(g && typeof g.x==="number"){
      gx=gx*0.97+g.x*0.03;
      gy=gy*0.97+g.y*0.03;
      px=g.x-gx; py=g.y-gy;
    }
    if(!primed){ primed=true; return; }
    if(Math.sqrt(px*px+py*py)<0.08) return;
    vx += px*0.0018;
    vy += py*0.0018;
    var r=e.rotationRate||{};
    var yaw=typeof r.alpha==="number"?r.alpha:(r.gamma||0);
    if(Math.abs(yaw)>10){
      var rad=Math.max(0.18, Math.sqrt(x*x+y*y));
      var ang=Math.atan2(y,x)+yaw/4000;
      x=Math.cos(ang)*rad; y=Math.sin(ang)*rad;
    }
  }

  function bind(){
    window.removeEventListener("devicemotion", onMot, true);
    window.addEventListener("devicemotion", onMot, true);
  }
  function stabilize(){
    x=0; y=0.16; vx=0.012; vy=0;
    trail=[]; lock=null; primed=false; gx=0; gy=0;
    hint("Es schwingt. Die Bahn kommt von allein.");
    bind();
  }
  function startSensor(){
    stabilize();
    if(typeof DeviceMotionEvent!=="undefined" && DeviceMotionEvent.requestPermission){
      DeviceMotionEvent.requestPermission().then(bind).catch(bind);
    } else bind();
  }
  function openP(){
    if(typeof show==="function") show("pendel");
    var ans=document.getElementById("pendelAns");
    if(ans) ans.style.display="none";
    var st=document.getElementById("pendelStart");
    if(st) st.textContent="Stabilisieren";
    c=document.getElementById("pendelC");
    if(c){
      var r=c.getBoundingClientRect();
      var w=Math.max(340, Math.round((r.width||200)*2));
      c.width=w; c.height=w;
      ctx=c.getContext("2d");
    }
    on=true; startSensor(); loop();
  }
  function closeP(){
    on=false;
    if(raf) cancelAnimationFrame(raf);
    window.removeEventListener("devicemotion", onMot, true);
    if(typeof show==="function") show("home");
  }

  var css=document.createElement("style");
  css.textContent=[
    "#pendel .hero h2{text-align:center;letter-spacing:.08em}",
    "#pendel .hero .sub{text-align:center}",
    "#pendelC{width:100%;aspect-ratio:1/1;height:auto;display:block;margin:.2rem 0;border-radius:1.3rem;background:radial-gradient(circle at 50% 42%,rgba(86,34,128,.32),#07040d 70%);border:1px solid rgba(232,160,255,.2);box-shadow:0 18px 40px rgba(0,0,0,.35)}",
    "#pendelAns{display:none!important}",
    "#pendelHint{text-align:center;line-height:1.4;margin:.25rem auto .45rem}"
  ].join("");
  document.head.appendChild(css);
  document.addEventListener("click",function(e){
    if(!e.target) return;
    if(e.target.id==="pendelGo") openP();
    if(e.target.id==="pendelBack") closeP();
    if(e.target.id==="pendelStart") stabilize();
  });
  ready();
  setTimeout(ready,250);
})();
