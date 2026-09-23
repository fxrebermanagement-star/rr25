(function(){
  var HARD={fluch:1,ueber:1,liebe2:1,trenn2:1};
  var LOCK="rr25_hard24";
  function locked(){
    try{
      var t=parseInt(localStorage.getItem(LOCK)||"0",10);
      return t && (Date.now()-t)<24*60*60*1000;
    }catch(e){ return false; }
  }
  function lockNow(){ try{ localStorage.setItem(LOCK, String(Date.now())); }catch(e){} }
  function left(){
    try{
      var t=parseInt(localStorage.getItem(LOCK)||"0",10);
      var ms=24*60*60*1000-(Date.now()-t);
      var h=Math.max(1, Math.ceil(ms/3600000));
      return h;
    }catch(e){ return 24; }
  }
  function pane(html){
    var run=document.getElementById("run");
    if(!run) return;
    if(typeof show==="function") show("run");
    run.innerHTML=html;
  }
  if(typeof openR!=="function") return;
  var _o=openR;
  openR=function(id,wer){
    var hard=!!HARD[id];
    function start(){ _o(id,wer); }
    function timing(){
      pane(
        '<div class="hero"><p class="sub">Timing</p><h2>Zieht · Steht · Still</h2></div>'+
        '<p class="words">Hör hin. Ein Zug. Nicht aus Hunger setzen.</p>'+
        '<div class="row"><button type="button" class="btn ghost" id="tZieht">Zieht</button>'+
        '<button type="button" class="btn primary" id="tSteht">Steht</button></div>'+
        '<div class="row"><button type="button" class="btn ghost" id="tStill">Still</button></div>'+
        '<div class="row"><button type="button" class="btn ghost" id="tBack">Liste</button></div>'
      );
      document.getElementById("tBack").onclick=function(){ show("home"); };
      document.getElementById("tStill").onclick=function(){
        pane('<div class="hero"><h2>Nicht heute</h2></div><p class="words">Reine 9. Buch zu. Still lassen.</p><div class="row"><button type="button" class="btn primary" id="tHome">Zurück</button></div>');
        document.getElementById("tHome").onclick=function(){ show("home"); };
      };
      document.getElementById("tZieht").onclick=function(){
        pane('<div class="hero"><h2>Erst Mitte</h2></div><p class="words">Atem. Feld schliessen. Nicht setzen, solange es zieht. Dann neu prüfen.</p><div class="row"><button type="button" class="btn ghost" id="tHome2">Liste</button><button type="button" class="btn primary" id="tNeu">Neu prüfen</button></div>');
        document.getElementById("tHome2").onclick=function(){ show("home"); };
        document.getElementById("tNeu").onclick=timing;
      };
      document.getElementById("tSteht").onclick=function(){
        if(hard) gate(); else start();
      };
    }
    function gate(){
      if(locked()){
        pane('<div class="hero"><p class="sub">24 Stunden</p><h2>Nicht nachladen</h2></div><p class="words">Hard war gesetzt. Noch etwa '+left()+' Stunden stehen lassen. Abbruch gilt.</p><div class="row"><button type="button" class="btn primary" id="tHome3">Liste</button></div>');
        document.getElementById("tHome3").onclick=function(){ show("home"); };
        return;
      }
      pane(
        '<div class="hero"><p class="sub">Hard · Gate</p><h2>Preis · Gegenseite · Rückkehr</h2></div>'+
        '<p class="words">Ich nenne den Preis. Ich sehe die Gegenseite. Ich kehre zurück. Ohne das kein Zug.</p>'+
        '<div class="row"><button type="button" class="btn ghost" id="tNein">Nicht heute</button>'+
        '<button type="button" class="btn primary" id="tJa">Steht. Setzen</button></div>'
      );
      document.getElementById("tNein").onclick=function(){ show("home"); };
      document.getElementById("tJa").onclick=function(){
        window._hardLock=1;
        start();
      };
    }
    timing();
  };
  if(typeof show==="function" && !show._tor){
    var sh=show;
    show=function(id){
      if(id==="after" && window._hardLock){
        lockNow();
        window._hardLock=0;
        setTimeout(function(){
          var run=document.getElementById("after");
          if(!run) return;
          if(run.querySelector("#hard24")) return;
          var p=document.createElement("p");
          p.id="hard24";
          p.className="meta";
          p.style.textAlign="center";
          p.textContent="24 Stunden nicht nachladen.";
          var hero=run.querySelector(".hero");
          if(hero&&hero.nextSibling) run.insertBefore(p, hero.nextSibling);
          else run.appendChild(p);
        }, 40);
      }
      return sh.apply(this,arguments);
    };
    show._tor=1;
  }
})();
