(function(){
  var SKIP={dank:1,stopp:1,schutz:1,schutz2:1,heil:1,zur:1,karma:1,liebe:1,liebezw:1,anz:1,trenn:1,trenn2:1,wesen:1,fremd:1,ahn:1,finst:1,schaden:1,segen:1,fluch:1,ueber:1,fil:1};
  if(typeof openR!=="function") return;
  var _open=openR;
  openR=function(id,wer){
    if(!SKIP[id]) return _open(id,wer);
    var r=R.find(function(x){return x.id===id});
    if(!r) return;
    var i=0, mem={mit:false};
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
    function draw(){
      var titel=steps[i][0], text=steps[i][1], last=i===steps.length-1;
      var names=(i===0?need:[]).map(function(n){return '<input data-k="'+n+'" placeholder="'+n+'">'}).join("");
      var extra="";
      if(/Wesenheit/i.test(titel)){
        extra='<div class="row"><button type="button" class="btn ghost" id="wOhne">Ohne</button><button type="button" class="btn primary" id="wMit">Mit</button></div><p class="meta" id="wWahl">jetzt: '+(mem.mit?"mit Wesenheit":"ohne Wesenheit")+'</p>';
      }
      if(last){
        extra+='<label class="check" style="display:flex;gap:.5rem;align-items:center;margin:.8rem 0 .2rem"><input type="checkbox" id="feldCheck"><span>Feld-Check: Ich bin zurück in mir.</span></label>';
      }
      document.getElementById("run").innerHTML=
        '<div class="hero"><p class="sub">'+r.t+' · '+(i+1)+'/'+steps.length+'</p><h2>'+titel+'</h2></div>'+
        names+'<p class="words">'+fill(text,mem)+'</p>'+extra+
        '<div class="row"><button type="button" class="btn ghost" id="prev">'+(i?"Zurück":"Liste")+'</button>'+
        '<button type="button" class="btn primary" id="next">'+(last?"So sei es":"Weiter")+'</button></div><p class="msg" id="msg"></p>';
      document.querySelectorAll("#run [data-k]").forEach(function(inp){
        inp.value=mem[inp.dataset.k]||"";
        inp.oninput=function(){ mem[inp.dataset.k]=inp.value.trim(); };
      });
      var wo=document.getElementById("wOhne");
      var wm=document.getElementById("wMit");
      if(wo) wo.onclick=function(){ mem.mit=false; var w=document.getElementById("wWahl"); if(w) w.textContent="jetzt: ohne Wesenheit"; };
      if(wm) wm.onclick=function(){ mem.mit=true; var w=document.getElementById("wWahl"); if(w) w.textContent="jetzt: mit Wesenheit"; };
      document.getElementById("prev").onclick=function(){ if(!i){show("home");return;} i--; draw(); };
      document.getElementById("next").onclick=function(){
        if(i<steps.length-1){ i++; draw(); return; }
        var box=document.getElementById("feldCheck");
        if(!box || !box.checked){
          var msg=document.getElementById("msg");
          if(msg) msg.textContent="Erst Feld-Check: bist du zurück?";
          return;
        }
        var d=load();
        var who=[mem.Name,mem.Auftrag,mem.A,mem.B].filter(function(x,idx,arr){ return x && arr.indexOf(x)===idx; }).join(" · ");
        d.log.unshift({
          id:uid(),
          t:now(),
          titel:r.t,
          wer:who,
          wesen: !!(mem.mit || id==="wesen" || id==="fremd")
        });
        if(fromPlan){ d.planned=d.planned.filter(function(p){return p.pid!==fromPlan}); fromPlan=null; }
        save(d); show("after");
      };
    }
    show("run"); draw();
  };
})();
