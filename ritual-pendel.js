(function(){
  var on=false, ang=0, tgt=0, betaT=0, samples=[], last="";
  var c, ctx, raf;

  function ready(){
    if(document.getElementById("pendelGo")) return;
    var kast=document.getElementById("kasten");
    if(!kast) return;
    var b=document.createElement("button");
    b.type="button"; b.id="pendelGo"; b.className="btn ghost";
    b.textContent="Pendel";
    b.style.marginTop=".45rem";
    b.style.width="100%";
    kast.appendChild(b);
    if(!document.getElementById("pendel")){
      var sec=document.createElement("section");
      sec.className="screen"; sec.id="pendel";
      sec.innerHTML='<div class="hero"><h2>Pendel</h2><p class="sub">Frage stellen. Handy locker halten.</p></div>'+
        '<canvas id="pendelC" width="360" height="420"></canvas>'+
        '<p id="pendelAns" class="words" style="text-align:center;margin:.4rem 0 0"></p>'+
        '<p id="pendelHint" class="sub">Vor / zurück = Ja · Links / rechts = Nein</p>'+
        '<div class="row"><button type="button" class="btn ghost" id="pendelBack">Zurück</button>'+
        '<button type="button" class="btn primary" id="pendelStart">Sensor</button></div>';
      var main=document.querySelector("main");
      if(main) main.appendChild(sec);
    }
  }

  function draw(){
    if(!c||!ctx) return;
    var w=c.width,h=c.height;
    ctx.clearRect(0,0,w,h);
    var cx=w/2, top=56, len=Math.min(w,h)*0.62;
    var x=cx+Math.sin(ang)*len;
    var y=top+Math.cos(ang)*len;
    ctx.strokeStyle="rgba(232,160,255,.35)";
    ctx.lineWidth=2;
    ctx.beginPath(); ctx.moveTo(cx,top); ctx.lineTo(x,y); ctx.stroke();
    ctx.fillStyle="#ff7ad9";
    ctx.beginPath(); ctx.arc(x,y,16,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="rgba(255,122,217,.18)";
    ctx.beginPath(); ctx.arc(x,y,28,0,Math.PI*2); ctx.fill();
    ctx.fillStyle="rgba(232,160,255,.2)";
    ctx.beginPath(); ctx.arc(cx,top,5,0,Math.PI*2); ctx.fill();
  }

  function loop(){
    if(!on) return;
    ang+=(tgt-ang)*0.12;
    draw();
    read();
    raf=requestAnimationFrame(loop);
  }

  function read(){
    var a=Math.abs(ang), b=Math.abs(betaT);
    var el=document.getElementById("pendelAns");
    if(!el) return;
    var ans="Unklar";
    if(b>0.18 && b>=a) ans="Ja";
    else if(a>0.18) ans="Nein";
    if(ans!==last){ last=ans; el.textContent=ans; }
  }

  function onOri(e){
    var g=(e.gamma||0)/38;
    var b=((e.beta||0)-55)/50;
    if(g>1)g=1; if(g<-1)g=-1;
    if(b>1)b=1; if(b<-1)b=-1;
    tgt=g*0.7;
    betaT=b;
  }

  function startSensor(){
    function go(){
      window.removeEventListener("deviceorientation", onOri);
      window.addEventListener("deviceorientation", onOri, true);
      var h=document.getElementById("pendelHint");
      if(h) h.textContent="Sensor aktiv. Frage stellen, dann halten.";
    }
    if(typeof DeviceOrientationEvent!=="undefined" && DeviceOrientationEvent.requestPermission){
      DeviceOrientationEvent.requestPermission().then(function(s){ if(s==="granted") go(); }).catch(function(){});
    } else go();
  }

  function openP(){
    if(typeof show==="function") show("pendel");
    c=document.getElementById("pendelC");
    if(c){
      var r=c.getBoundingClientRect();
      c.width=Math.max(280, Math.round(r.width*2)||360);
      c.height=Math.round(c.width*1.15);
      ctx=c.getContext("2d");
    }
    on=true; last=""; tgt=0; ang=0;
    loop();
  }
  function closeP(){
    on=false;
    if(raf) cancelAnimationFrame(raf);
    window.removeEventListener("deviceorientation", onOri, true);
    if(typeof show==="function") show("home");
  }

  var css=document.createElement("style");
  css.textContent=["#pendelC{width:100%;height:auto;display:block;margin:.2rem 0;border-radius:1.1rem;background:radial-gradient(circle at 50% 18%,rgba(150,80,210,.18),#080510 70%);border:1px solid rgba(232,160,255,.2)}","#pendelAns{font-size:1.35rem;color:#ffb3ea}","#pendelGo{min-height:2.45rem}"].join("");
  document.head.appendChild(css);

  document.addEventListener("click",function(e){
    if(!e.target) return;
    if(e.target.id==="pendelGo") openP();
    if(e.target.id==="pendelBack") closeP();
    if(e.target.id==="pendelStart") startSensor();
  });
  ready();
  setTimeout(ready,200);
})();
