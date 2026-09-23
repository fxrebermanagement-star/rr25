(function(){
  var HARD={fluch:1,ueber:1,liebe:1,liebe2:1,trenn2:1};
  var STUFE={fluch:1,liebe:1,liebe2:1};
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
        if(hard) diagnose(); else start();
      };
    }
    function diagnose(){
      pane(
        '<div class="hero"><p class="sub">Diagnose</p><h2>Anteil · Gegenwille · Mass</h2></div>'+
        '<p class="words">Eigener Anteil gesehen. Gegenwille der anderen Person gesehen. Mass klar. Sonst nicht setzen.</p>'+
        '<div class="row"><button type="button" class="btn ghost" id="tNeinD">Nicht heute</button>'+
        '<button type="button" class="btn primary" id="tOkD">Gesehen</button></div>'
      );
      document.getElementById("tNeinD").onclick=function(){ show("home"); };
      document.getElementById("tOkD").onclick=gate;
    }
    function gate(){
      var extra=id==="fluch"
        ? '<textarea id="tGrund" placeholder="Grund"></textarea><p class="meta">Ohne Grund kein Fluch.</p>'
        : '';
      var stufe=STUFE[id]
        ? '<p class="meta">Härte</p><div class="row"><button type="button" class="chip" id="h1">Weich</button><button type="button" class="chip on" id="h2">Mittel</button><button type="button" class="chip" id="h3">Nagelhart</button></div>'
        : '';
      pane(
        '<div class="hero"><p class="sub">Hard · Gate</p><h2>Preis · Gegenseite · Rückkehr</h2></div>'+
        '<p class="words">Ich nenne den Preis. Ich sehe die Gegenseite. Ich kehre zurück. Ohne das kein Zug.</p>'+
        extra+stufe+
        '<div class="row"><button type="button" class="btn ghost" id="tNein">Nicht heute</button>'+
        '<button type="button" class="btn primary" id="tJa">Steht. Setzen</button></div>'+
        '<p class="msg" id="tMsg"></p>'
      );
      var mass="Mittel";
      function pick(which){
        mass=which;
        ["h1","h2","h3"].forEach(function(x){ var el=document.getElementById(x); if(el) el.classList.toggle("on", el.textContent===which); });
      }
      var a=document.getElementById("h1"),b=document.getElementById("h2"),c=document.getElementById("h3");
      if(a) a.onclick=function(){ pick("Weich"); };
      if(b) b.onclick=function(){ pick("Mittel"); };
      if(c) c.onclick=function(){ pick("Nagelhart"); };
      document.getElementById("tNein").onclick=function(){ show("home"); };
      document.getElementById("tJa").onclick=function(){
        if(id==="fluch"){
          var g=((document.getElementById("tGrund")||{}).value||"").trim();
          if(!g){
            var m=document.getElementById("tMsg");
            if(m) m.textContent="Grund zuerst.";
            return;
          }
          window._grund=g;
        }
        window._mass=mass;
        start();
        setTimeout(function(){
          try{
            if(typeof mem==="object"){
              if(window._grund) mem.Grund=window._grund;
              if(window._mass) mem.Mass=window._mass;
            }
          }catch(e){}
        }, 80);
      };
    }
    timing();
  };
})();
