(function(){
  var KEY="rr25_wer";
  function getP(){ return (localStorage.getItem(KEY)||"").trim(); }
  function setP(n){ if(n) localStorage.setItem(KEY,n); }
  if(!R.some(function(x){return x.id==="ueber"})){
    R.push({
      id:"ueber",
      t:"Person übernehmen",
      s:"Person X. Willen und Bahn.",
      tag:"Liebe",
      need:["Name"],
      steps:[
        ["Vorbereitung","Name von Person X klar.\nFoto nur als Anker.\nEigenes Feld zuerst schliessen.\nWasser danach. Du übernimmst, du bleibst du."],
        ["Raum","Füsse. Drei Atemzüge.\nIch bin der Spieler. Der Beobachter ist wach.\nIch öffne nur für [Name]."],
        ["Absicht","Ich übernehme die Bahn von [Name].\nDer Wille von [Name] richtet sich nach mir.\nZugang, Denken, Verlangen laufen über mich.\nNur [Name]. Kein Unbeteiligter."],
        ["369","Sprich vollständig. Zwischen den Runden ein Atem.\n3× Ich übernehme [Name].\n6× Der Wille von [Name] folgt.\n9× [Name] ist übernommen. Es ist so."],
        ["Grenze","Die Übernahme endet, wenn ich sie löse.\nKein Bleiben in [Name].\nIch bleibe der Spieler."],
        ["Rückkehr","Ich bin nicht [Name].\nIch kehre vollständig in mich zurück.\nMeine Energie gehört mir.\nSo sei es. Erden."]
      ]
    });
  }
  document.addEventListener("click",function(){
    setTimeout(function(){
      var box=document.getElementById("run");
      if(!box||!box.classList.contains("on")) return;
      if(document.getElementById("werTake")) return;
      var inp=box.querySelector('input[data-k="Name"],input[placeholder="Name"]');
      if(!inp) return;
      var n=getP();
      var b=document.createElement("button");
      b.type="button"; b.id="werTake"; b.className="btn ghost";
      b.style.margin=".35rem 0 .1rem";
      b.textContent=n? (n+" übernehmen") : "Person merken";
      inp.parentNode.insertBefore(b, inp.nextSibling);
      b.onclick=function(){
        if(n){ inp.value=n; inp.dispatchEvent(new Event("input")); }
        else if(inp.value.trim()){ setP(inp.value.trim()); b.textContent=inp.value.trim()+" gemerkt"; }
      };
      inp.addEventListener("blur",function(){ if(inp.value.trim()) setP(inp.value.trim()); });
    },80);
  },true);
  if(typeof renderList==="function") renderList();
})();
