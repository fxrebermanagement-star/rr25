(function(){
  var KEY="rr25_wer";
  function getP(){ return (localStorage.getItem(KEY)||"").trim(); }
  function setP(n){ if(n) localStorage.setItem(KEY,n); }
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
})();
