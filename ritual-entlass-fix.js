(function(){
  var GO=
    "Tu:\nNicht nachwinken. Nicht offen lassen. Tor zu.\n\n"+
    "Sprich:\nDer Auftrag ist beendet.\nIch danke dir.\nDu bist frei.\nAlle Verbindungen lösen sich.\nDu bleibst nicht.\nIch schliesse das Tor.";
  (R||[]).forEach(function(r){
    if(!r || !r.steps) return;
    r.steps.forEach(function(s){
      if(!s || !s[1]) return;
      if(/Entlassen/i.test(s[0])) s[1]=GO;
      s[1]=String(s[1])
        .replace(/Tu:\nNur wenn jemand da war\.\n*/g,"")
        .replace(/Nur wenn jemand da war\.?\n*/g,"")
        .replace(/Falls eine Wesenheit da war:?\n*/gi,"")
        .replace(/Ohne Wesenheit: weiter zur Rückkehr\.?\n*/gi,"");
    });
  });
  if(window.MutationObserver){
    var run=document.getElementById("run");
    if(run) new MutationObserver(function(){
      var h=run.querySelector("h2");
      var w=run.querySelector(".words");
      if(!h || !w) return;
      if(/Entlassen/i.test(h.textContent||"") && /Nur wenn|Falls eine Wesenheit/i.test(w.textContent||"")){
        w.textContent=GO;
      }
    }).observe(run,{childList:true,subtree:true});
  }
})();
