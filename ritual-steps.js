fetch("https://cdn.jsdelivr.net/gh/fxrebermanagement-star/rr25@2ed9a8298d20f9c2f64b7019162d671a1d4a7d9c/ritual-steps.js").then(function(r){return r.text()}).then(function(code){
  (0,eval)(code);
  if(typeof PREP==="object"){
    R.forEach(function(rit){
      if(!rit||!rit.steps)return;
      if(rit.steps[0]&&rit.steps[0][0]==="Vorbereitung")return;
      var t=PREP[rit.id]; if(!t)return;
      rit.steps.unshift(["Vorbereitung",t]);
    });
    if(typeof renderList==="function") renderList();
  }
}).catch(function(){if(typeof renderList==="function")renderList()});
