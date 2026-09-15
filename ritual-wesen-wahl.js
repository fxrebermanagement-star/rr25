(function(){
  var FELD =
    "Tu:\n"+
    "Stehen. Füsse in den Boden. Feld hart halten.\n"+
    "Handy bleibt weg. Kein Suchen. Kein Ziehen.\n"+
    "Ein Atem. Nur entscheiden.\n\n"+
    "Sprich:\n"+
    "Ich behalte den Raum.\n"+
    "Ich rufe nichts, bevor ich wähle.\n"+
    "Klarheit vor Kontakt.";

  (R||[]).forEach(function(r){
    if(!r || !r.steps) return;
    r.steps.forEach(function(s){
      if(!s || !s[0]) return;
      if(/Wesenheit/i.test(s[0])){
        s[0] = "Wesenheit";
        s[1] = FELD;
      }
    });
  });

  if(typeof openR !== "function") return;
  var _open = openR;
  openR = function(id, wer){
    var ret = _open(id, wer);
    fixWahl();
    return ret;
  };

  function fixWahl(){
    var run = document.getElementById("run");
    if(!run || !run.classList.contains("on")) return;
    var h = run.querySelector("h2");
    if(!h || !/Wesenheit/i.test(h.textContent||"")) return;

    var words = run.querySelector(".words");
    if(words) words.textContent = FELD;

    var old = run.querySelector("#wWahl");
    if(old) old.textContent = "eine Wahl — nicht zwei";

    var wo = document.getElementById("wOhne");
    var wm = document.getElementById("wMit");
    if(wo) wo.textContent = "Ohne — zum Wort";
    if(wm) wm.textContent = "Mit — rufen";
  }

  var run = document.getElementById("run");
  if(run && window.MutationObserver){
    new MutationObserver(function(){ setTimeout(fixWahl, 20); }).observe(run, {childList:true});
  }
})();
