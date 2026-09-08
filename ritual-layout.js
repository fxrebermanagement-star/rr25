(function(){
  var k=document.getElementById("kasten");
  if(!k) return;
  var duo=k.querySelector(".duo");
  var row=k.querySelector(".row");
  var tools=document.getElementById("sigilTools");
  var grid=document.getElementById("under");
  if(!grid){
    grid=document.createElement("div");
    grid.id="under";
    if(duo) k.insertBefore(grid, duo.nextSibling);
    else k.appendChild(grid);
  }
  var left=document.getElementById("underL");
  if(!left){
    left=document.createElement("div");
    left.id="underL";
    grid.appendChild(left);
  }
  var right=document.getElementById("underR");
  if(!right){
    right=document.createElement("div");
    right.id="underR";
    grid.appendChild(right);
  }
  var kTag=document.getElementById("kTag");
  var kDrei=document.getElementById("kDrei");
  if(kTag) left.appendChild(kTag);
  if(kDrei) left.appendChild(kDrei);
  if(tools){
    var inp=document.getElementById("sigilT");
    var go=document.getElementById("sigilGo");
    if(inp) right.appendChild(inp);
    if(go) right.appendChild(go);
    tools.remove();
  }
  if(row&&!row.children.length) row.remove();
  var s=document.createElement("style");
  s.textContent=[
    "#under{display:grid;grid-template-columns:1fr 1fr;gap:.4rem;margin-top:.4rem}",
    "#underL,#underR{display:flex;flex-direction:column;gap:.35rem}",
    "#under .btn{width:100%;margin:0}",
    "#under input{margin:0;width:100%}"
  ].join("");
  document.head.appendChild(s);
})();
