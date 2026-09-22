(function(){
  function buzz(pat){
    try{ if(navigator.vibrate) navigator.vibrate(pat||[45,40,90]); }catch(e){}
  }
  function cleanPlan(){
    if(typeof load!=="function"||typeof save!=="function") return;
    var d=load();
    var seen={};
    var out=[];
    (d.planned||[]).forEach(function(p){
      var k=String(p.id||"")+"|"+String(p.wer||"").trim().toLowerCase();
      if(seen[k]) return;
      seen[k]=1;
      if(!p.t) p.t=(typeof now==="function"?now():"");
      out.push(p);
    });
    if(out.length!==(d.planned||[]).length){
      d.planned=out;
      save(d);
    }
  }
  if(typeof paintPlan==="function" && !paintPlan._hold){
    var pp=paintPlan;
    paintPlan=function(){
      cleanPlan();
      pp();
      var list=document.getElementById("plList");
      if(!list) return;
      (load().planned||[]).forEach(function(p){
        var row=list.querySelector('[data-go="'+p.pid+'"]');
        if(!row) return;
        var meta=row.parentElement && row.parentElement.querySelector(".meta");
        if(meta && p.t && meta.textContent.indexOf(p.t)<0){
          meta.textContent=(p.wer?p.wer+" · ":"")+p.t;
        }
      });
    };
    paintPlan._hold=1;
  }
  var add=document.getElementById("plAdd");
  if(add && !add._hold){
    var old=add.onclick;
    add.onclick=function(){
      var sel=document.getElementById("plR");
      var wer=((document.getElementById("plW")||{}).value||"").trim();
      var id=sel && sel.value;
      var d=load();
      var dup=(d.planned||[]).some(function(p){
        return p.id===id && String(p.wer||"").trim().toLowerCase()===wer.toLowerCase();
      });
      if(dup){
        if(typeof paintPlan==="function") paintPlan();
        return;
      }
      if(typeof old==="function") old();
      else if(id && typeof R!=="undefined"){
        var r=R.find(function(x){ return x.id===id; });
        if(!r) return;
        d.planned.unshift({pid:Date.now().toString(36),id:r.id,titel:r.t,wer:wer,t:now()});
        save(d); paintPlan();
      }
    };
    add._hold=1;
  }
  document.addEventListener("click", function(e){
    if(!e.target || !e.target.closest) return;
    var n=e.target.closest("#next");
    if(!n) return;
    var h=((document.querySelector("#run h2")||{}).textContent||"");
    var w=((document.querySelector("#run .words")||{}).textContent||"");
    var all=(h+" "+w+" "+n.textContent).toLowerCase();
    if(/es ist so|so sei es|369/.test(all)) buzz([35,40,70,40,110]);
  }, true);
  if(typeof show==="function" && !show._hold){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="geplant") cleanPlan();
      return r;
    };
    show._hold=1;
  }
  cleanPlan();
})();
