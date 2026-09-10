(function(){
  var WANT=["Schutz","Energie","Liebe","Trennung","Person X","Feld"];
  function sortCats(){
    var cats=document.getElementById("cats");
    if(!cats) return;
    WANT.forEach(function(name){
      var el=cats.querySelector('[data-cat="'+name+'"]');
      if(!el){
        el=document.createElement("button");
        el.className="chip"+(typeof cat!=="undefined"&&cat===name?" on":"");
        el.setAttribute("data-cat",name);
        el.textContent=name;
        el.onclick=function(){ cat=name; if(typeof renderList==="function") renderList(); };
      }
      cats.appendChild(el);
    });
    Array.prototype.slice.call(cats.querySelectorAll(".chip")).forEach(function(n){
      var name=n.getAttribute("data-cat")||"";
      if(WANT.indexOf(name)<0) n.remove();
    });
  }
  if(typeof renderList==="function"){
    var prev=renderList;
    renderList=function(){ prev(); sortCats(); };
  }
  sortCats();
  setTimeout(sortCats,250);
  setTimeout(sortCats,800);
})();
