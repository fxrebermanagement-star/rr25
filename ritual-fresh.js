(function(){
  function clearSigil(){
    var el=document.getElementById("sigilT")||document.querySelector("#sigRow input,#underR input");
    if(el) el.value="";
    try{
      var raw=localStorage.getItem("rr25_sigil");
      if(raw){
        var d=JSON.parse(raw);
        d.t="";
        localStorage.setItem("rr25_sigil", JSON.stringify(d));
      }
    }catch(e){}
  }
  function clearInputs(){
    document.querySelectorAll("#run [data-k]").forEach(function(inp){
      if(!inp._fresh){
        inp._fresh=1;
        inp.value="";
        inp.placeholder=inp.getAttribute("placeholder")||inp.dataset.k;
      }
    });
  }
  try{ localStorage.removeItem("rr25_wer"); }catch(e){}
  clearSigil();
  if(typeof openR==="function" && !openR._fresh){
    var _o=openR;
    openR=function(id,wer){
      try{ localStorage.removeItem("rr25_wer"); }catch(e){}
      if(typeof mem==="object" && mem){
        mem.Name=""; mem.A=""; mem.B=""; mem.Auftrag=""; mem.Mass=""; mem["Wofür"]="";
      }
      var r=_o(id, null);
      setTimeout(clearInputs,0);
      return r;
    };
    openR._fresh=1;
  }
  var save=document.getElementById("sigilSave");
  if(save) save.addEventListener("click", function(){ setTimeout(clearSigil, 200); });
  var go=document.getElementById("sigilGo");
  if(go) go.addEventListener("click", function(){ /* Absicht bleibt bis Ablegen */ });
  if(typeof show==="function" && !show._fresh){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="home") setTimeout(clearSigil,0);
      if(id==="run") setTimeout(clearInputs,0);
      return r;
    };
    show._fresh=1;
  }
})();
