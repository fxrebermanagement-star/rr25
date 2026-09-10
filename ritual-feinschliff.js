(function(){
  document.documentElement.setAttribute("data-kleid","neon");
  try{ localStorage.setItem("rr25_kleid","neon"); }catch(e){}
  var css=document.getElementById("feinCss");
  if(!css){
    css=document.createElement("style");
    css.id="feinCss";
    document.head.appendChild(css);
  }
  css.textContent=[
    "#kleidBtn,nav [data-v=person]{display:none!important}",
    "nav{grid-template-columns:repeat(5,1fr)!important}"
  ].join("");
  function placeChip(){
    var cats=document.getElementById("cats");
    if(!cats) return;
    var px=cats.querySelector('[data-cat="Person X"]');
    if(!px){
      px=document.createElement("button");
      px.className="chip"+(typeof cat!=="undefined"&&cat==="Person X"?" on":"");
      px.setAttribute("data-cat","Person X");
      px.textContent="Person X";
      px.onclick=function(){ cat="Person X"; if(typeof renderList==="function") renderList(); };
    }
    var feld=cats.querySelector('[data-cat="Feld"]');
    if(feld) cats.insertBefore(px, feld);
    else cats.appendChild(px);
    document.querySelectorAll('nav [data-v="person"]').forEach(function(n){ n.remove(); });
    var k=document.getElementById("kleidBtn");
    if(k) k.remove();
  }
  placeChip();
  if(typeof renderList==="function"){
    var prev=renderList;
    renderList=function(){ prev(); placeChip(); };
  }
  setTimeout(placeChip,300);
})();
