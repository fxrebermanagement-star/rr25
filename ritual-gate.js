(function(){
  var SKIP={dank:1,stopp:1,schutz:1,schutz2:1,schutzweg:1,heil:1,zur:1,karma:1,liebe:1,liebezw:1,anz:1,trenn:1,trenn2:1,wesen:1,fremd:1,ahn:1,finst:1,schaden:1,segen:1,fluch:1,ueber:1,fil:1};
  var SHORT={schutzweg:1,dank:1,fremd:1,schutz:1};
  var ALWAYS={wesen:1,fremd:1,ahn:1,stopp:1};
  var NOWESEN={dank:1,schutzweg:1,ahn:1,fremd:1,schutz:1};
  var FOTO={schutz2:1,liebe:1,liebezw:1,anz:1,fluch:1,segen:1,ueber:1,schaden:1};
  var MITSTEP=/Rufen|Prüfen|Auftrag geben/i;
  var HALT_O="Tu:\nEinen Atem stehen. Nichts nachschieben.\n\nSprich:\nGesetzt.\nIch trage allein.\nAbgegeben.";
  var HALT_M="Tu:\nEinen Atem stehen. Die Wesenheit trägt noch. Du hältst das Mass.\n\nSprich:\nGesetzt.\nDu trägst.\nIch führe.\nKein Mehr.";
  var SIEG_O="Tu:\nZur Kerze stehen. Einen Atem.\n\nSprich:\nVersiegelt.\nDas Feld hat es.";
  var SIEG_M="Tu:\nSiegelzeichen. Einmal.\n\nSprich:\nVersiegelt.\nDer Auftrag bleibt begrenzt.\nDanach gehst du.";
  var GO=
    "Tu:\nNicht nachwinken. Nicht offen lassen. Tor zu.\n\n"+
    "Sprich:\nDer Auftrag ist beendet.\nIch danke dir.\nDu bist frei.\nAlle Verbindungen lösen sich.\nDu bleibst nicht.\nIch schliesse das Tor.";
  var RUECK_O=
    "Tu:\nHaut. Atem. Füsse. Raum. Wasser.\n\n"+
    "Sprich:\nIch bin zurück in mir.\nMeine Energie gehört mir.\nSo sei es.";
  var RUECK_M=
    "Tu:\nTor zu. Haut. Atem. Füsse. Raum. Wasser.\n\n"+
    "Sprich:\nIch bin nicht die Wesenheit.\nIch bin zurück in mir.\nDer Raum gehört mir.\nMeine Energie gehört mir.\nSo sei es.";
  if(typeof openR!=="function") return;
  var _open=openR;
  openR=function(id,wer){
    if(!SKIP[id]) return _open(id,wer);
    var r=R.find(function(x){return x.id===id});
    if(!r) return;
    var i=0, mem={mit:!!ALWAYS[id],wahl:!!ALWAYS[id]};
    if(wer){
      mem.Name=wer; mem.Auftrag=wer;
      var p=wer.split(/\s*·\s*/);
      mem.A=p[0]||wer; mem.B=p[1]||"";
    }
    try{
      var n=(localStorage.getItem("rr25_wer")||"").trim();
      if(n && !mem.Name) mem.Name=n;
    }catch(e){}
    var steps=r.steps.map(function(s){return s.slice()});
    var need=r.need||[];
    function skipAt(n){
      var t=steps[n] && steps[n][0] || "";
      if(NOWESEN[id] && (/^Wesenheit$/i.test(t) || MITSTEP.test(t) || /Entlassen/i.test(t))) return true;
      if(!mem.mit && (MITSTEP.test(t) || /Entlassen/i.test(t))) return true;
      return false;
    }
    function vis(){
      var out=[];
      for(var n=0;n<steps.length;n++) if(!skipAt(n)) out.push(n);
      return out;
    }
    function reset369(){
      try{
        var d=new Date();
        var ymd=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
        localStorage.setItem("rr25_369", JSON.stringify({d:ymd,n3:0,n6:0,n9:0}));
      }catch(e){}
    }
    function fwd(){
      if(/369/i.test(steps[i][0])) reset369();
      i++; while(i<steps.length-1 && skipAt(i)) i++;
    }
    function back(){ i--; while(i>0 && skipAt(i)) i--; if(i<0) i=0; }
    function intent(){
      var n=mem.Name||"[Name]";
      var a=mem.A||"[A]", b=mem.B||"[B]";
      var auf=mem.Auftrag||"[Auftrag]";
      var map={
        dank:"Dank heute",stopp:"Stopp gegen "+n,schutz:"Feld schliessen",
        schutz2:"Schutz für "+n,schutzweg:"Schutz unterwegs",heil:"Heilung für "+n,
        zur:"Energie zurück",karma:"Ausgleich, nicht Rache",
        liebe:"Nähe mit "+n+" ohne Zwang",liebezw:"Bindung auf "+n,anz:"Kontakt zu "+n,
        trenn:"Faden zu "+n,trenn2:"Faden zwischen "+a+" und "+b",
        wesen:"Kontakt für: "+auf,fremd:"Nur zeigen, dann schliessen",ahn:"Ahnen: "+n,
        finst:"Festigen was wahr ist",schaden:"Rückgabe an "+n,
        segen:"Segen auf "+n,fluch:"Wort auf "+n,ueber:"Übernahme von "+n+" für "+auf
      };
      return map[id]||r.s||"";
    }
    function wortText(text){
      if(NOWESEN[id]) return text;
      if(mem.mit) return text;
      return "Kein Kontakt. Du trägst das Wort allein.\n\n"+text.replace(/Du trägst\. Ich führe\./g,"Feld und Energien tragen.");
    }
    function endText(titel, text){
      if(/Halten/i.test(titel)) return mem.mit?HALT_M:HALT_O;
      if(/Siegel/i.test(titel)) return String(text||"")|| (mem.mit?SIEG_M:SIEG_O);
      if(/Entlassen/i.test(titel)) return GO;
      if(/Feld-Check|Rückkehr|Fertig/i.test(titel)) return mem.mit?RUECK_M:RUECK_O;
      return String(text||"").replace(/Nur wenn jemand da war\.?\n*/g,"").replace(/Falls eine Wesenheit da war:?\n*/gi,"");
    }
    function choose(mit){
      mem.mit=mit; mem.wahl=true;
      fwd(); draw();
    }
    function pruef(ok){
      if(!ok) mem.mit=false;
      mem.wahl=true;
      fwd(); draw();
    }
    function draw(){
      if(skipAt(i) && i<steps.length-1) fwd();
      if(skipAt(i) && i===steps.length-1){ i--; while(i>0 && skipAt(i)) i--; }
      var titel=steps[i][0], text=endText(titel, steps[i][1]), last=i===steps.length-1;
      var wahl=/^Wesenheit$/i.test(titel) && !ALWAYS[id] && !NOWESEN[id];
      var pruefen=/^Prüfen$/i.test(titel) && !NOWESEN[id];
      if(/^Wort$/i.test(titel)) text=wortText(steps[i][1]);
      if(/369/i.test(titel) && text.indexOf("Halte das Wort")<0){
        text="Halte das Wort. Nicht neu setzen, was schon gesprochen ist.\n"+text;
      }
      var names=(i===0?need:[]).map(function(n){return '<input data-k="'+n+'" placeholder="'+n+'">'}).join("");
      var extra="";
      if(i===0 && FOTO[id]) extra+='<p class="meta">Foto nur als Anker, dann umdrehen.</p>';
      if(wahl){
        extra+='<div class="row" style="margin-top:.8rem"><button type="button" class="btn ghost" id="wOhne">Ohne — allein</button><button type="button" class="btn primary" id="wMit">Mit — rufen</button></div>';
      }
      if(pruefen){
        extra+='<div class="row" style="margin-top:.8rem"><button type="button" class="btn ghost" id="pNein">Nicht klar</button><button type="button" class="btn primary" id="pJa">Klar</button></div>';
      }
      if(last && !SHORT[id]){
        extra+='<label class="check" style="display:flex;gap:.5rem;align-items:center;margin:.8rem 0 .2rem"><input type="checkbox" id="feldCheck"><span>Feld-Check: Ich bin zurück in mir.</span></label>';
      }
      var v=vis();
      var nr=v.indexOf(i)+1;
      if(nr<1) nr=i+1;
      var hideNav=wahl||pruefen;
      document.getElementById("run").innerHTML=
        '<div class="hero"><p class="sub">'+r.t+' · '+nr+'/'+v.length+'</p>'+
        '<p class="meta" id="absicht">'+intent()+(mem.wahl?(mem.mit?" · mit Wesenheit":" · ohne Wesenheit"):"")+'</p>'+
        '<h2>'+titel+'</h2></div>'+
        names+'<p class="words">'+fill(text,mem)+'</p>'+extra+
        (hideNav?'':'<div class="row"><button type="button" class="btn ghost" id="prev">'+(i?"Zurück":"Liste")+'</button>'+
        '<button type="button" class="btn primary" id="next">'+(last?"So sei es":"Weiter")+'</button></div>')+
        '<p class="msg" id="msg"></p>';
      document.querySelectorAll("#run [data-k]").forEach(function(inp){
        inp.value=mem[inp.dataset.k]||"";
        inp.oninput=function(){
          mem[inp.dataset.k]=inp.value.trim();
          var a=document.getElementById("absicht");
          if(a) a.textContent=intent();
        };
      });
      var wo=document.getElementById("wOhne");
      var wm=document.getElementById("wMit");
      if(wo) wo.onclick=function(){ choose(false); };
      if(wm) wm.onclick=function(){ choose(true); };
      var pn=document.getElementById("pNein");
      var pj=document.getElementById("pJa");
      if(pn) pn.onclick=function(){ pruef(false); };
      if(pj) pj.onclick=function(){ pruef(true); };
      var pv=document.getElementById("prev");
      var nx=document.getElementById("next");
      if(pv) pv.onclick=function(){ if(!i){show("home");return;} back(); draw(); };
      if(nx) nx.onclick=function(){
        if(i<steps.length-1){ fwd(); draw(); return; }
        if(!SHORT[id]){
          var box=document.getElementById("feldCheck");
          if(!box || !box.checked){
            var msg=document.getElementById("msg");
            if(msg) msg.textContent="Erst Feld-Check: bist du zurück?";
            return;
          }
        }
        reset369();
        var d=load();
        var who=[mem.Name,mem.Auftrag,mem.A,mem.B].filter(function(x,idx,arr){ return x && arr.indexOf(x)===idx; }).join(" · ");
        d.log.unshift({id:uid(),t:now(),titel:r.t,wer:who,wesen:!!mem.mit});
        if(fromPlan){ d.planned=d.planned.filter(function(p){return p.pid!==fromPlan}); fromPlan=null; }
        save(d); show("after");
      };
    }
    show("run"); draw();
  };
})();
