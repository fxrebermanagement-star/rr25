(function(){
  function kill(){
    document.querySelectorAll('nav [data-v="person"]').forEach(function(n){ n.remove(); });
    var nav=document.querySelector("nav");
    if(nav) nav.style.gridTemplateColumns="repeat(5,1fr)";
    var s=document.createElement("style");
    s.textContent='nav{grid-template-columns:repeat(5,1fr)!important}nav [data-v="person"]{display:none!important}';
    document.head.appendChild(s);
  }
  kill();
  setTimeout(kill,200);
  setTimeout(kill,800);
})();
