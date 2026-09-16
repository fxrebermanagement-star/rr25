(function(){
  if(typeof fill==="function"){
    var _f=fill;
    fill=function(s,m){
      var out=_f(s,m);
      out=out.split("[Auftrag]").join((m&&m.Auftrag)||"[Auftrag]");
      out=out.split("[Wofür]").join((m&&m["Wofür"])||"[Wofür]");
      return out;
    };
  }
})();
