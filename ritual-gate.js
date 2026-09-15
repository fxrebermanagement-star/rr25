(function(){
  var SKIP={dank:1,stopp:1,schutz:1,schutz2:1,schutzweg:1,heil:1,zur:1,karma:1,liebe:1,liebezw:1,anz:1,trenn:1,trenn2:1,wesen:1,fremd:1,ahn:1,finst:1,schaden:1,segen:1,fluch:1,ueber:1,fil:1};
  var SHORT={schutzweg:1,dank:1,fremd:1};
  var ALWAYS={wesen:1,fremd:1,ahn:1};
  var NOWESEN={dank:1,schutzweg:1,ahn:1,fremd:1};
  var FOTO={schutz2:1,liebe:1,liebezw:1,anz:1,fluch:1,segen:1,ueber:1,schaden:1};
  var MITSTEP=/Rufen|Prüfen|Auftrag an/i;
  var GO=
    "Der Auftrag ist beendet.\n"+
    "Ich danke dir.\n"+
    "Du bist frei.\n"+
    "Alle Verbindungen zu mir und zu dieser Arbeit lösen sich.\n"+
    "Du bleibst nicht.\n"+
    "Ich schliesse den Kontakt.";
  if(typeof openR!=="function") return;
  var _open=openR;
  openR=function(id,wer){
    if(!SKIP[id]) return _open(id,wer);
    var r=R.find(function(x){return x.id===id});
    if(!r) return;
    var i=0, mem={mit:!!ALWAYS[id]};
    if(wer){
      mem.Name=wer;
      mem.Auftrag=wer;
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
      if(NOWESEN[id] && (/Wesenheit/i.test(t) || MITSTEP.test(t))) return true;
      if(!ALWAYS[id] && !mem.mit && (MITSTEP.test(t) || /Entlassen/i.test(t))) return true;
      return false;
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
        dank:"Dank heute",
        stopp:"Stopp gegen "+n,
        schutz:"Feld schliessen",
        schutz2:"Schutz für "+n,
        schutzweg:"Schutz unterwegs",
        heil:"Heilung für "+n,
        zur:"Energie zurück",
        karma:"Ausgleich, nicht Rache",
        liebe:"Nähe mit "+n+" ohne Zwang",
        liebezw:"Bindung auf "+n,
        anz:"Kontakt zu "+n,
        trenn:"Faden zu "+n,
        trenn2:"Faden zwischen "+a+" und "+b,
        wesen:"Kontakt für: "+auf,
        fremd:"Nur zeigen, dann schliessen",
        ahn:"Ahnen: "+n,
        finst:"Festigen was wahr ist",
        schaden:"Rückgabe an "+n,
        segen:"Segen auf "+n,
        fluch:"Wort auf "+n,
        ueber:"Übernahme von "+n+" für "+auf
      };
      return map[id]||r.s||"";
    }
    function draw(){
      if(skipAt(i) && i<steps.length-1) fwd();
      if(skipAt(i) && i===steps.length-1){ i--; while(i>0 && skipAt(i)) i--; }
      var titel=steps[i][0], text=steps[i][1], last=i===steps.length-1;
      if(/Entlassen/i.test(titel)) text=GO;
      if(/369/i.test(titel) && text.indexOf("Halte das Wort")<0){
        text="Halte das Wort. Nicht neu setzen, was schon gesprochen ist.\n"+text;
      }
      var names=(i===0?need:[]).map(function(n){return '<input data-k="'+n+'" placeholder="'+n+'">'}).join("");
      var extra="";
      if(i===0 && FOTO[id]) extra+='<p class="meta">Foto nur als Anker, dann umdrehen.</p>';
      if(/Wesenheit/i.test(titel) && !ALWAYS[id] && !NOWESEN[id]){
        extra+='<div class="row"><button type="button" class="btn ghost" id="wOhne">Ohne</button><button type="button" class="btn primary" id="wMit">Mit</button></div><p class="meta" id="wWahl">jetzt: '+(mem.mit?"mit — als Nächstes kommt das Rufen":"ohne — weiter zum Wort")+'</p>';
      }
      if(last && !SHORT[id]){
        extra+='<label class="check" style="display:flex;gap:.5rem;align-items:center;margin:.8rem 0 .2rem"><input type="checkbox" id="feldCheck"><span>Feld-Check: Ich bin zurück in mir.</span></label>';
      }
      document.getElementById("run").innerHTML=
        '<div class="hero"><p class="sub">'+r.t+' · '+(i+1)+'/'+steps.length+'</p>'+
        '<p class="meta" id="absicht">'+intent()+'</p>'+
        '<h2>'+titel+'</h2></div>'+
        names+'<p class="words">'+fill(text,mem)+'</p>'+extra+
        '<div class="row"><button type="button" class="btn ghost" id="prev">'+(i?"Zurück":"Liste")+'</button>'+
        '<button type="button" class="btn primary" id="next">'+(last?"So sei es":"Weiter")+'</button></div><p class="msg" id="msg"></p>';
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
      if(wo) wo.onclick=function(){ mem.mit=false; var w=document.getElementById("wWahl"); if(w) w.textContent="jetzt: ohne — weiter zum Wort"; };
      if(wm) wm.onclick=function(){ mem.mit=true; var w=document.getElementById("wWahl"); if(w) w.textContent="jetzt: mit — als Nächstes kommt das Rufen"; };
      document.getElementById("prev").onclick=function(){ if(!i){show("home");return;} back(); draw(); };
      document.getElementById("next").onclick=function(){
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
        d.log.unshift({
          id:uid(),
          t:now(),
          titel:r.t,
          wer:who,
          wesen: !!(mem.mit || ALWAYS[id])
        });
        if(fromPlan){ d.planned=d.planned.filter(function(p){return p.pid!==fromPlan}); fromPlan=null; }
        save(d); show("after");
      };
    }
    show("run"); draw();
  };
})();
