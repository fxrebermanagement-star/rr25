(function(){
  var on=false, raf=0;
  var x=0, y=0, vx=0, vy=0, spin=0, spinV=0;
  var gx=0, gy=0, gz=9.8, primed=false;
  var trail=[], c, ctx;

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
      ctx.strokeStyle="rgba(255,122,217,.26)";
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
    ctx.rotate(spin);
    var grd=ctx.createRadialGradient(-r*0.32,-r*0.36,2,0,0,r);
    grd.addColorStop(0,"#ffe6f6");
    grd.addColorStop(0.4,"#ff7ad9");
    grd.addColorStop(1,"#6a2478");
    ctx.fillStyle=grd;
    ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle="rgba(255,230,246,.65)";
    ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(0,0,r*0.7,-2.3,-0.35); ctx.stroke();
    ctx.strokeStyle="#14081c";
    ctx.lineWidth=2.4;
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-r*0.72); ctx.stroke();
    ctx.restore();
  }

  function step(){
    var k=1.7, damp=0.991, dt=1/60;
    vx += -x*k*dt;
    vy += -y*k*dt;
    var amp=Math.sqrt(vx*vx+vy*vy);
    if(amp>0.01){
      vx += vx/amp*0.0007;
      vy += vy/amp*0.0007;
    }
    vx*=damp; vy*=damp;
    x += vx; y += vy;
    var m=Math.sqrt(x*x+y*y);
    if(m>0.9){ x*=0.9/m; y*=0.9/m; vx*=-0.28; vy*=-0.28; }
    spinV *= 0.985;
    spin += spinV;
    trail.push({x:x,y:y});
    if(trail.length>70) trail.shift();
  }

  function loop(){
    if(!on) return;
    step(); draw();
    raf=requestAnimationFrame(loop);
  }

  function pulse(px,py){
    var s=Math.sqrt(px*px+py*py);
    if(s<0.045) return;
    vx += px*0.007;
    vy += py*0.007;
    if(Math.abs(px)>Math.abs(py)*1.4) spinV += (px>0?0.006:-0.006);
  }

  function onMot(e){
    var a=e.acceleration;
    var g=e.accelerationIncludingGravity;
    var px=0, py=0;
    if(a && typeof a.x==="number"){
      px=a.x; py=a.y;
    } else if(g && typeof g.x==="number"){
      gx=gx*0.94+g.x*0.06;
      gy=gy*0.94+g.y*0.06;
      gz=gz*0.94+(g.z||9.8)*0.06;
      px=g.x-gx; py=g.y-gy;
    }
    if(!primed){ primed=true; return; }
    pulse(px, py);
    var r=e.rotationRate;
    if(r && typeof r.alpha==="number" && Math.abs(r.alpha)>22){
      spinV += r.alpha/1400;
    }
  }

  function bind(){
    window.removeEventListener("devicemotion", onMot, true);
    window.addEventListener("devicemotion", onMot, true);
    var h=document.getElementById("pendelHint");
    if(h) h.textContent="Flach halten. Nicht kippen. Die Hand darf zittern.";
  }
  function startSensor(){
    primed=false; gx=0; gy=0; gz=9.8;
    if(typeof DeviceMotionEvent!=="undefined" && DeviceMotionEvent.requestPermission){
      DeviceMotionEvent.requestPermission().then(bind).catch(bind);
    } else bind();
  }

  function openP(){
    if(typeof show==="function") show("pendel");
    var ans=document.getElementById("pendelAns");
    if(ans) ans.style.display="none";
    c=document.getElementById("pendelC");
    if(c){
      var r=c.getBoundingClientRect();
      var w=Math.max(340, Math.round((r.width||200)*2));
      c.width=w; c.height=w;
      ctx=c.getContext("2d");
    }
    x=0; y=0; vx=0; vy=0; spin=0; spinV=0; trail=[]; on=true;
    startSensor();
    loop();
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
    if(e.target.id==="pendelStart") startSensor();
  });
  ready();
  setTimeout(ready,250);
})();
