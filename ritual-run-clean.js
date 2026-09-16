(function(){
  openR=function(id){
    var r=(R||[]).find(function(x){ return x.id===id; });
    if(!r) return;
    window._rid=id;
    var i=0;
    var steps=(r.steps||[]).map(function(s){ return s.slice(); });
    if(!steps.length){
      steps=[["Leer","Dieses Ritual hat noch keinen Text."]];
    }
    mem={};
    function draw(){
      var titel=steps[i][0], text=steps[i][1], last=i===steps.length-1;
      var names=(i===0?(r.need||[]):[]).map(function(n){
        return '<input data-k="'+n+'" placeholder="'+n+'" autocomplete="off" autocorrect="off" spellcheck="false">';
      }).join("");
      var run=document.getElementById("run");
      if(!run) return;
      run.innerHTML=
        '<div class="hero"><p class="sub">'+r.t+' · '+(i+1)+'/'+steps.length+'</p>'+
        '<h2>'+titel+'</h2></div>'+
        names+
        '<p class="words">'+(typeof fill==="function"?fill(text,mem):text)+'</p>'+
        '<div class="row">'+
        '<button type="button" class="btn ghost" id="prev">'+(i?"Zurück":"Liste")+'</button>'+
        '<button type="button" class="btn primary" id="next">'+(last?"So sei es":"Weiter")+'</button>'+
        '</div><p class="msg" id="msg"></p>';
      document.querySelectorAll("#run [data-k]").forEach(function(inp){
        inp.value=mem[inp.dataset.k]||"";
        inp.oninput=function(){ mem[inp.dataset.k]=inp.value.trim(); };
      });
      document.getElementById("prev").onclick=function(){
        if(!i){ if(typeof show==="function") show("home"); return; }
        i--; draw();
      };
      document.getElementById("next").onclick=function(){
        if(i<steps.length-1){ i++; draw(); return; }
        var d=typeof load==="function"?load():{log:[]};
        d.log=d.log||[];
        d.log.unshift({
          id:typeof uid==="function"?uid():String(Date.now()),
          t:typeof now==="function"?now():new Date().toLocaleString("de-CH"),
          titel:r.t,
          wer:[mem.Name,mem.A,mem.B,mem.Auftrag,mem.Mass].filter(Boolean).join(" · "),
          wesen:false
        });
        if(typeof fromPlan!=="undefined" && fromPlan){
          d.planned=(d.planned||[]).filter(function(p){ return p.pid!==fromPlan; });
          fromPlan=null;
        }
        if(typeof save==="function") save(d);
        if(typeof show==="function") show("after");
      };
    }
    if(typeof show==="function") show("run");
    draw();
  };
})();
