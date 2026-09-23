(function(){
  var ADD={
    Weich:
      "\n\nStufe weich.\nEin Satz. Kein Nachdrücken.\nKein Halten über das Mass.",
    Mittel:
      "\n\nStufe mittel.\nKlar setzen. Nicht nachladen.",
    Nagelhart:
      "\n\nStufe nagelhart.\nKein Ausweichen.\nDas Wort sitzt und bleibt.\nKein Nachsatz."
  };
  if(typeof fill==="function" && !fill._haerte){
    var _f=fill;
    fill=function(s,m){
      var out=_f(s,m);
      var mass=(m&&m.Mass)||window._mass||"Mittel";
      if(mass==="Weich"){
        out=out.split("Hart.").join("Weich.");
        out=out.split("hart.").join("weich.");
        out=out.split("Kein Ausweichen.").join("Ohne Druck darüber hinaus.");
      }
      if(mass==="Nagelhart"){
        out=out.split("Hart.").join("Nagelhart.");
        out=out.split("Das Feld hat es.").join("Das Feld hat es. Es bleibt.");
      }
      var hit=/Auftrag geben|Wort|369|Siegel/.test(String(s||"")) || /Du trägst\. Ich führe|Es ist gesetzt|Versiegelt/.test(out);
      if(hit && ADD[mass]) out+=ADD[mass];
      return out;
    };
    fill._haerte=1;
  }
  if(typeof openR==="function" && !openR._haerte){
    var _o=openR;
    openR=function(id,wer){
      var r=_o.apply(this,arguments);
      setTimeout(function(){
        try{
          if(typeof mem==="object" && window._mass) mem.Mass=window._mass;
          var sub=document.querySelector("#run .sub");
          if(sub && window._mass) sub.textContent=sub.textContent.replace(/ · (Weich|Mittel|Nagelhart)/,"")+" · "+window._mass;
        }catch(e){}
      }, 60);
      return r;
    };
    openR._haerte=1;
  }
})();
