(function(){
  var on=false, raf=0;
  var th=0.2, om=0.12, ph=0.06, pd=0, spin=0, spinV=0.03;
  var ax=0, ay=0, rot=0;
  var hist=[], last="", t0=0;
  var c, ctx;

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
    var cx=w/2, cy=h*0.52, R=Math.min(w,h)*0.38;
    var top=cy-R-8;

    var glow=ctx.createRadialGradient(cx,cy,R*0.2,cx,cy,R*1.15);
    glow.addColorStop(0,"rgba(150,80,210,.16)");
    glow.addColorStop(1,"rgba(0,0,0,0)");
    ctx.fillStyle=glow;
    ctx.beginPath(); ctx.arc(cx,cy,R*1.2,0,Math.PI*2); ctx.fill();

    ctx.strokeStyle="rgba(232,160,255,.16)";
    ctx.lineWidth=Math.max(1,w/260);
    ctx.beginPath(); ctx.arc(cx,cy,R,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx,cy,R*0.62,0,Math.PI*2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy-R); ctx.lineTo(cx, cy+R); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx-R, cy); ctx.lineTo(cx+R, cy); ctx.stroke();

    ctx.fillStyle="#e6aaff";
    ctx.font=(w*0.045)+"px Georgia,serif";
    ctx.textAlign="center"; ctx.textBaseline="middle";
    ctx.fillText("JA", cx, cy-R-w*0.04);
    ctx.fillText("JA", cx, cy+R+w*0.04);
    ctx.fillStyle="#c4a4d6";
    ctx.fillText("NEIN", cx-R-w*0.08, cy);
    ctx.fillText("NEIN", cx+R+w*0.08, cy);

    ctx.strokeStyle="rgba(255,122,217,.22)";
    ctx.beginPath(); ctx.arc(cx,cy,R*0.22, -1.1, 1.1); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx,cy,R*0.22, Math.PI-1.1, Math.PI+1.1); ctx.stroke();

    var L=R*1.05;
    var x=cx+Math.sin(th)*L;
    var y=top+Math.cos(th)*Math.cos(ph)*L + (cy-top-L*0.15);
    y=top+Math.cos(th)*L*0.92 + Math.sin(ph)*L*0.25;

    ctx.strokeStyle="rgba(246,234,255,.45)";
    ctx.lineWidth=Math.max(2,w/160);
    ctx.beginPath(); ctx.moveTo(cx, top); ctx.lineTo(x,y); ctx.stroke();
    ctx.fillStyle="#f6eaff";
    ctx.beginPath(); ctx.arc(cx,top,4,0,Math.PI*2); ctx.fill();

    ctx.save();
    ctx.translate(x+6, y+10);
    ctx.scale(1,0.35);
    ctx.fillStyle="rgba(0,0,0,.28)";
    ctx.beginPath(); ctx.arc(0,0,22,0,Math.PI*2); ctx.fill();
    ctx.restore();

    var r=Math.max(16,w/20);
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(spin);
    var grd=ctx.createRadialGradient(-r*0.35,-r*0.4,2,0,0,r);
    grd.addColorStop(0,"#ffe6f6");
    grd.addColorStop(0.45,"#ff7ad9");
    grd.addColorStop(1,"#7a2a88");
    ctx.fillStyle=grd;
    ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle="rgba(255,230,246,.7)";
    ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(0,0,r*0.72, -2.2, -0.4); ctx.stroke();
    ctx.strokeStyle="#14081c";
    ctx.lineWidth=2.2;
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-r*0.78); ctx.stroke();
    ctx.fillStyle="#14081c";
    ctx.beginPath(); ctx.arc(0,-r*0.78,2.2,0,Math.PI*2); ctx.fill();
    ctx.restore();
  }

  function step(){
    var g=3.15, damp=0.994, dt=1/60;
    om += (-Math.sin(th)*g + ax*2.8)*dt;
    pd += (-Math.sin(ph)*g + ay*2.8)*dt;
    om*=damp; pd*=damp;
    th += om*dt; ph += pd*dt;
    if(th>1.05){th=1.05;om*=-0.35}
    if(th<-1.05){th=-1.05;om*=-0.35}
    if(ph>0.85){ph=0.85;pd*=-0.35}
    if(ph<-0.85){ph=-0.85;pd*=-0.35}
    spinV += rot*0.055;
    spinV *= 0.988;
    spin += spinV;
    hist.push({t:th,p:ph,s:spinV,n:performance.now()});
    if(hist.length>120) hist.shift();
  }

  function read(){
    if(hist.length<48) return;
    var s=hist.slice(-60), at=0, ap=0, as=0;
    s.forEach(function(q){ at+=Math.abs(q.t); ap+=Math.abs(q.p); as+=q.s; });
    at/=s.length; ap/=s.length; as/=s.length;
    var el=document.getElementById("pendelAns");
    if(!el) return;
    var ans="Unklar";
    if(Math.abs(as)>0.014 && Math.abs(as)>=Math.max(at,ap)*0.035){
      ans=as>0?"Ja":"Nein";
    } else if(ap>0.11 && ap>=at*0.8){
      ans="Ja";
    } else if(at>0.11){
      ans="Nein";
    }
    if(ans!==last){
      last=ans;
      el.textContent=ans;
      el.dataset.k=ans.toLowerCase();
    }
  }

  function loop(){
    if(!on) return;
    step(); draw(); read();
    raf=requestAnimationFrame(loop);
  }

  function onOri(e){
    ax=(e.gamma||0)/42;
    ay=((e.beta||48)-48)/38;
    ax=Math.max(-1,Math.min(1,ax));
    ay=Math.max(-1,Math.min(1,ay));
  }
  function onMot(e){
    var r=e.rotationRate;
    if(r && typeof r.alpha==="number") rot=r.alpha/160;
  }

  function bind(){
    window.removeEventListener("deviceorientation", onOri, true);
    window.removeEventListener("devicemotion", onMot, true);
    window.addEventListener("deviceorientation", onOri, true);
    window.addEventListener("devicemotion", onMot, true);
    var h=document.getElementById("pendelHint");
    if(h) h.textContent="Vor / zurück oder rechts drehen = Ja. Seitlich oder links drehen = Nein.";
  }
  function startSensor(){
    var n=0,g=0,fin=function(){ g++; if(g>=n) bind(); };
    if(typeof DeviceOrientationEvent!=="undefined" && DeviceOrientationEvent.requestPermission){
      n++; DeviceOrientationEvent.requestPermission().then(fin).catch(fin);
    }
    if(typeof DeviceMotionEvent!=="undefined" && DeviceMotionEvent.requestPermission){
      n++; DeviceMotionEvent.requestPermission().then(fin).catch(fin);
    }
    if(!n) bind();
  }

  function openP(){
    if(typeof show==="function") show("pendel");
    c=document.getElementById("pendelC");
    if(c){
      var r=c.getBoundingClientRect();
      var w=Math.max(320, Math.round((r.width||200)*2));
      c.width=w; c.height=Math.round(w*1.22);
      ctx=c.getContext("2d");
    }
    th=0.26; om=0.18; ph=0.07; pd=-0.04; spin=0; spinV=0.05;
    hist=[]; last=""; on=true;
    startSensor();
    loop();
  }
  function closeP(){
    on=false;
    if(raf) cancelAnimationFrame(raf);
    window.removeEventListener("deviceorientation", onOri, true);
    window.removeEventListener("devicemotion", onMot, true);
    if(typeof show==="function") show("home");
  }

  var css=document.createElement("style");
  css.textContent=[
    "#pendel .hero h2{text-align:center;letter-spacing:.08em}",
    "#pendel .hero .sub{text-align:center}",
    "#pendelC{width:100%;height:auto;display:block;margin:.15rem 0 .1rem;border-radius:1.25rem;background:radial-gradient(circle at 50% 30%,rgba(86,34,128,.35),#07040d 72%);border:1px solid rgba(232,160,255,.2);box-shadow:0 18px 40px rgba(0,0,0,.35)}",
    "#pendelAns{font-family:Georgia,serif;font-size:1.7rem;letter-spacing:.18em;text-transform:uppercase;text-align:center;margin:.55rem 0 .1rem;color:#f6eaff;min-height:2.1rem}",
    "#pendelAns[data-k=\"ja\"]{color:#e6aaff}",
    "#pendelAns[data-k=\"nein\"]{color:#c4a4d6}",
    "#pendelHint{text-align:center;line-height:1.4;max-width:22rem;margin:.2rem auto .4rem}"
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
