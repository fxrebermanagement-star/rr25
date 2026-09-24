(function(){
  var SKIP={fluch:1,segen:1,ueber:1,liebe:1,liebe2:1,weg:1};
  var NOVER={segen:1,liebe:1,liebe2:1,weg:1,schutz:1};
  var STAND=["Standort","Tu:\nFüsse. Drei Atemzüge.\n\nSprich:\nIch bin hier.\nIch bin klar.\nIch trage."];
  function hasName(r){
    var n=r.need||[];
    if(n.indexOf("Name")>=0||n.indexOf("A")>=0) return true;
    return JSON.stringify(r.steps||[]).indexOf("[Name]")>=0;
  }
  function patch(r){
    if(!r||!r.steps||!r.steps.length||SKIP[r.id]) return;
    if(r._ich) return;
    var steps=r.steps.slice();
    var first=String(steps[0][0]||"");
    var txt=String(steps[0][1]||"");
    if(JSON.stringify(steps).indexOf("Ich bin hier")<0){
      if(first==="Ankommen") steps[0]=STAND;
      else if(first==="Vorbereitung") steps.splice(1,0,STAND);
      else steps.splice(0,0,STAND);
    }
    if(hasName(r) && !NOVER[r.id]){
      var joined=JSON.stringify(steps);
      if(joined.indexOf("Ich bin [Name]")<0){
        var ix=1;
        for(var i=0;i<steps.length;i++){
          if(String(steps[i][0])==="Standort"||String(steps[i][0])==="Feld hart") ix=i+1;
        }
        steps.splice(ix,0,["Versetzen","Tu:\nFoto umdrehen. Name laut. Einmal stehen.\n\nSprich:\nIch bin [Name].\nNur für diesen Auftrag."]);
      }
    }
    var end=steps[steps.length-1];
    if(end && String(end[1]||"").indexOf("Feld zu")<0){
      end[1]=String(end[1]||"")+"\n\nSprich:\nIch bin hier.\nFeld zu.";
    }
    r.steps=steps;
    r._ich=1;
  }
  function all(){
    if(typeof R==="undefined") return;
    for(var i=0;i<R.length;i++) patch(R[i]);
  }
  all();
  setTimeout(all,400);
  setTimeout(all,1200);
  if(typeof openR==="function" && !openR._ich){
    var o=openR;
    openR=function(id){ all(); return o.apply(this,arguments); };
    openR._ich=1;
  }
})();
