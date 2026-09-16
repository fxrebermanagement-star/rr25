(function(){
  function lock(el){
    if(!el || el._af) return;
    el._af=1;
    el.setAttribute("autocomplete","off");
    el.setAttribute("autocorrect","off");
    el.setAttribute("autocapitalize","characters");
    el.setAttribute("spellcheck","false");
    el.setAttribute("name","absicht-"+Date.now());
  }
  function clearSigil(){
    var el=document.getElementById("sigilT")||document.querySelector("#sigRow input,#underR input");
    if(!el) return;
    lock(el);
    el.value="";
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
    document.querySelectorAll("#run [data-k], #sigilT, #plW, #noteT").forEach(function(inp){
      lock(inp);
    });
  }
  try{ localStorage.removeItem("rr25_wer"); }catch(e){}
  clearSigil();
  clearInputs();
  if(typeof openR==="function" && !openR._fresh){
    var _o=openR;
    openR=function(id){
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
  if(save) save.addEventListener("click", function(){ setTimeout(clearSigil, 220); });
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
