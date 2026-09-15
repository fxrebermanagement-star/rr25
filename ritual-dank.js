(function(){
  var KEY="rr25_dank";
  function day(){
    var n=new Date();
    return n.getFullYear()+"-"+String(n.getMonth()+1).padStart(2,"0")+"-"+String(n.getDate()).padStart(2,"0");
  }
  function done(){ return localStorage.getItem(KEY)===day(); }
  function setDone(){ localStorage.setItem(KEY, day()); mark(); }
  if(typeof R!=="undefined"){
    for(var i=R.length-1;i>=0;i--) if(R[i].id==="dank") R.splice(i,1);
    R.unshift({
      id:"dank",t:"Tägliches Dankesritual",s:"Gesundheit · Liebe · Geld · Schutz",tag:"Alltag",
      steps:[
        ["Ankommen","Füsse auf den Boden. Drei Atemzüge.\nIch bin der Spieler. Der Beobachter ist wach.\nHeute danke ich, ohne zu handeln."],
        ["Gesundheit","Dreimal: Danke für Gesundheit.\nDer Körper darf sich erinnern."],
        ["Liebe","Dreimal: Danke für Liebe.\nWärme darf sein."],
        ["Geld","Dreimal: Danke für Geld und Versorgung.\nEs fliesst, ohne Hetze."],
        ["Schutz","Dreimal: Danke für Schutz durch das Feld.\nDie Grenze hält."],
        ["Setzen","Ich bin gesund. Es ist so.\nIch bin geliebt. Es ist so.\nIch bin versorgt. Es ist so.\nIch bin geschützt. Es ist so."],
        ["Abschluss","Dreimal: Danke für alles.\nDie Arbeit ist dem Feld übergeben.\nWasser, Alltag."]
      ]
    });
  }
  function mark(){
    var pin=document.getElementById("pinDank");
    if(!pin) return;
    pin.classList.toggle("done", done());
    var ok=pin.querySelector(".ok");
    if(ok) ok.textContent=done()?"\u2713":"";
  }
  function pin(){
    var home=document.getElementById("home");
    if(!home) return;
    var el=document.getElementById("pinDank");
    if(!el){
      el=document.createElement("button");
      el.type="button";
      el.id="pinDank";
      el.className="card";
      el.innerHTML="<b>Tägliches Dankesritual</b><small>Gesundheit · Liebe · Geld · Schutz</small><span class=\"ok\"></span>";
      el.onclick=function(){ if(typeof fromPlan!=="undefined") fromPlan=null; if(typeof openR==="function") openR("dank"); };
      var cats=document.getElementById("cats");
      if(cats) home.insertBefore(el, cats);
      else home.appendChild(el);
    }
    mark();
  }
  if(typeof show==="function"){
    var _s=show;
    show=function(id){
      var r=_s.apply(this,arguments);
      if(id==="home") pin();
      if((id==="after"||id==="bye") && window._rid==="dank") setDone();
      return r;
    };
  }
  pin();
})();
