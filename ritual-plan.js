(function(){
  function del(pid){
    if(typeof load!=="function"||typeof save!=="function") return;
    var d=load();
    d.planned=(d.planned||[]).filter(function(p){ return String(p.pid)!==String(pid); });
    save(d);
    if(typeof paintPlan==="function") paintPlan();
  }
  function enhance(){
    var list=document.getElementById("plList");
    if(!list) return;
    list.querySelectorAll("[data-go]").forEach(function(btn){
      var wrap=btn.parentElement;
      if(!wrap || wrap.querySelector("[data-pldel]")) return;
      var pid=btn.getAttribute("data-go");
      var row=document.createElement("div");
      row.className="row";
      row.style.marginTop=".45rem";
      var a=document.createElement("button");
      a.type="button"; a.className="btn primary"; a.textContent="Setzen";
      a.onclick=function(){ btn.click(); };
      var b=document.createElement("button");
      b.type="button"; b.className="btn ghost"; b.textContent="Zurückziehen";
      b.setAttribute("data-pldel", pid);
      b.onclick=function(ev){
        ev.preventDefault();
        if(!confirm("Dieses Vormerken löschen?")) return;
        del(pid);
      };
      row.appendChild(a);
      row.appendChild(b);
      btn.style.display="none";
      wrap.appendChild(row);
    });
  }
  if(typeof paintPlan==="function" && !paintPlan._del){
    var pp=paintPlan;
    paintPlan=function(){
      pp();
      enhance();
    };
    paintPlan._del=1;
  }
  if(typeof show==="function" && !show._pldel){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="geplant") setTimeout(enhance, 20);
      return r;
    };
    show._pldel=1;
  }
  enhance();
})();
