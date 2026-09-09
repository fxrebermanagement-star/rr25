(function(){
  var on=false, raf=0;
  var th=0.18, om=0, ph=0.05, pd=0, spin=0, spinV=0;
  var ax=0, ay=0, rot=0;
  var hist=[], last="";
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
    var w=c.width,h=c.height;
    ctx.clearRect(0,0,w,h);
    var cx=w/2, top=Math.round(h*0.12), L=Math.min(w,h)*0.58;
    var x=cx+Math.sin(th)*L;
    var y=top+Math.cos(th)*Math.cos(ph)*L;
    ctx.strokeStyle="rgba(232,160,255,.38)";
    ctx.lineWidth=Math.max(2,w/180);
    ctx.beginPath(); ctx.moveTo(cx,top); ctx.lineTo(x,y); ctx.stroke();
    ctx.fillStyle="rgba(232,160,255,.22)";
    ctx.beginPath(); ctx.arc(cx,top,5,0,Math.PI*2); ctx.fill();
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(spin);
    var r=Math.max(14,w/22);
    var g=ctx.createRadialGradient(-r*0.3,-r*0.3,2,0,0,r);
    g.addColorStop(0,"#ffd0f0"); g.addColorStop(1,"#ff6b82");
    ctx.fillStyle=g;
    ctx.beginPath(); ctx.arc(0,0,r,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle="#14081c"; ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,-r*0.7); ctx.stroke();
    ctx.restore();
  }

  function step(){
    var g=2.6, damp=0.992, dt=1/60;
    om += (-Math.sin(th)*g + ax*3.2)*dt;
    pd += (-Math.sin(ph)*g + ay*3.2)*dt;
    om*=damp; pd*=damp;
    th += om*dt; ph += pd*dt;
    if(th>1.1){th=1.1;om*=-0.3} if(th<-1.1){th=-1.1;om*=-0.3}
    if(ph>0.9){ph=0.9;pd*=-0.3} if(ph<-0.9){ph=-0.9;pd*=-0.3}
    spinV += rot*0.045;
    spinV *= 0.985;
    spin += spinV;
    hist.push({t:th,p:ph,s:spinV});
    if(hist.length>90) hist.shift();
  }

  function read(){
    if(hist.length<40) return;
    var s=hist.slice(-50), at=0, ap=0, as=0;
    s.forEach(function(q){ at+=Math.abs(q.t); ap+=Math.abs(q.p); as+=q.s; });
    at/=s.length; ap/=s.length; as/=s.length;
    var el=document.getElementById("pendelAns");
    if(!el) return;
    var ans="Unklar";
    if(Math.abs(as)>0.012 && Math.abs(as)>=at*0.04 && Math.abs(as)>=ap*0.04){
      ans=as>0?"Ja":"Nein";
    } else if(ap>0.10 && ap>=at*0.85){
      ans="Ja";
    } else if(at>0.10){
      ans="Nein";
    }
    if(ans!==last){ last=ans; el.textContent=ans; }
  }

  function loop(){
    if(!on) return;
    step(); draw(); read();
    raf=requestAnimationFrame(loop);
  }

  function onOri(e){
    ax=(e.gamma||0)/45;
    ay=((e.beta||50)-50)/40;
    if(ax>1)ax=1; if(ax<-1)ax=-1;
    if(ay>1)ay=1; if(ay<-1)ay=-1;
  }
  function onMot(e){
    var r=e.rotationRate;
    if(!r) return;
    var a=r.alpha;
    if(typeof a==="number") rot=a/180;
  }

  function bind(){
    window.removeEventListener("deviceorientation", onOri, true);
    window.removeEventListener("devicemotion", onMot, true);
    window.addEventListener("deviceorientation", onOri, true);
    window.addEventListener("devicemotion", onMot, true);
    var h=document.getElementById("pendelHint");
    if(h) h.textContent="Schwingt selbst. Vor/zurück oder rechts drehen = Ja. Seitlich oder links drehen = Nein.";
  }
  function startSensor(){
    var need=0, got=0;
    function done(){ got++; if(got>=need) bind(); }
    if(typeof DeviceOrientationEvent!=="undefined" && DeviceOrientationEvent.requestPermission){
      need++; DeviceOrientationEvent.requestPermission().then(function(){done()}).catch(done);
    }
    if(typeof DeviceMotionEvent!=="undefined" && DeviceMotionEvent.requestPermission){
      need++; DeviceMotionEvent.requestPermission().then(function(){done()}).catch(done);
    }
    if(!need) bind();
  }

  function openP(){
    if(typeof show==="function") show("pendel");
    c=document.getElementById("pendelC");
    if(c){
      var r=c.getBoundingClientRect();
      c.width=Math.max(300, Math.round((r.width||180)*2));
      c.height=Math.round(c.width*1.18);
      ctx=c.getContext("2d");
    }
    th=0.22; om=0.15; ph=0.08; pd=-0.05; spin=0; spinV=0.04;
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
  css.textContent="#pendelC{width:100%;height:auto;display:block;margin:.2rem 0;border-radius:1.1rem;background:radial-gradient(circle at 50% 16%,rgba(150,80,210,.2),#080510 72%);border:1px solid rgba(232,160,255,.2)}#pendelAns{font-size:1.4rem;color:#ffb3ea}";
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
