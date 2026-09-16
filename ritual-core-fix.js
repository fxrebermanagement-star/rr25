function openR(id,wer){
  var r=R.find(function(x){ return x.id===id; });
  if(!r) return;
  var i=0, mit=false;
  var steps=(r.steps||[]).map(function(s){ return s.slice(); });
  mem={};
  if(wer){
    mem.Name=wer;
    var p=wer.split(/\s*·\s*/);
    mem.A=p[0]||wer; mem.B=p[1]||"";
  }
  var kurz={dank:1,schutzweg:1,fremd:1};
  function draw(){
    var titel=steps[i][0], text=steps[i][1], last=i===steps.length-1;
    var names=(i===0?(r.need||[]):[]).map(function(n){ return '<input data-k="'+n+'" placeholder="'+n+'">'; }).join("");
    document.getElementById("run").innerHTML=
      '<div class="hero"><p class="sub">'+r.t+' · '+(i+1)+'/'+steps.length+'</p><h2>'+titel+'</h2></div>'+
      names+'<p class="words">'+fill(text,mem)+'</p>'+
      (last && !kurz[id] ? '<label class="check"><input type="checkbox" id="back"><span>Ich kehre zurück.</span></label>' : '')+
      '<div class="row"><button type="button" class="btn ghost" id="prev">'+(i?"Zurück":"Liste")+'</button>'+
      '<button type="button" class="btn primary" id="next">'+(last?"So sei es":"Weiter")+'</button></div><p class="msg" id="msg"></p>';
    document.querySelectorAll("#run [data-k]").forEach(function(inp){
      inp.value=mem[inp.dataset.k]||"";
      inp.oninput=function(){ mem[inp.dataset.k]=inp.value.trim(); };
    });
    document.getElementById("prev").onclick=function(){ if(!i){ show("home"); return; } i--; draw(); };
    document.getElementById("next").onclick=function(){
      if(i<steps.length-1){ i++; draw(); return; }
      if(!kurz[id]){
        var box=document.getElementById("back");
        if(!box || !box.checked){
          var msg=document.getElementById("msg");
          if(msg) msg.textContent="Erst zurückkehren.";
          return;
        }
      }
      var d=load();
      d.log.unshift({id:uid(),t:now(),titel:r.t,wer:[mem.Name,mem.A,mem.B].filter(Boolean).join(" · "),wesen:!!mit});
      if(fromPlan){ d.planned=d.planned.filter(function(p){ return p.pid!==fromPlan; }); fromPlan=null; }
      save(d); show("after");
    };
  }
  show("run"); draw();
}
