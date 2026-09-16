(function(){
  function has(id){
    for(var i=0;i<R.length;i++) if(R[i].id===id) return R[i];
    return null;
  }
  function ensure(){
    if(typeof R==="undefined") return;
    if(!has("segen")){
      R.push({id:"segen",t:"Segen",s:"Ein Name. Ein Satz Wofür.",tag:"Person X",need:["Name","Wofür"],steps:[]});
    } else {
      var s=has("segen");
      s.t="Segen"; s.s="Ein Name. Ein Satz Wofür."; s.tag="Person X";
      if(!s.need) s.need=["Name","Wofür"];
    }
    if(!has("fluch")){
      R.push({id:"fluch",t:"Fluch",s:"Ein Name. Ein Satz Mass.",tag:"Person X",need:["Name","Mass"],steps:[]});
    } else {
      var f=has("fluch");
      f.t="Fluch"; f.s="Ein Name. Ein Satz Mass."; f.tag="Person X";
    }
  }
  function paint(){
    ensure();
    var list=document.getElementById("list");
    if(!list || typeof cat==="undefined" || cat!=="Person X") return;
    if(!list.querySelector('[data-id="segen"]')){
      var b=document.createElement("button");
      b.type="button"; b.className="card"; b.setAttribute("data-id","segen");
      b.innerHTML="<b>Segen</b><small>Ein Name. Ein Satz Wofür.</small>";
      b.onclick=function(){ fromPlan=null; openR("segen"); };
      var fl=list.querySelector('[data-id="fluch"]');
      if(fl) list.insertBefore(b, fl);
      else list.appendChild(b);
    }
  }
  if(typeof renderList==="function"){
    var prev=renderList;
    renderList=function(){
      ensure();
      prev();
      paint();
    };
  }
  ensure();
  setTimeout(function(){ if(typeof renderList==="function") renderList(); }, 300);
  setTimeout(function(){ if(typeof renderList==="function") renderList(); }, 1200);
})();
