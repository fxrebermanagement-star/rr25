(function(){
  var LINK="https://calendar.google.com/calendar/r?cid=47c369013814767dea03adb95f43c3b7b64174e10565af9fbe6799f0a8eb0e3a@group.calendar.google.com";
  var DATA=null;
  function when(s, all){
    if(!s) return "";
    var d=new Date(s.length<=10?s+"T12:00:00":s);
    if(isNaN(d.getTime())) return s;
    var days=["So","Mo","Di","Mi","Do","Fr","Sa"];
    var day=days[d.getDay()]+" "+d.getDate()+"."+(d.getMonth()+1)+".";
    if(all || s.length<=10) return day;
    var h=String(d.getHours()).padStart(2,"0");
    var m=String(d.getMinutes()).padStart(2,"0");
    return day+" · "+h+":"+m;
  }
  function kind(t){
    t=String(t||"").toUpperCase();
    if(t.indexOf("HARD")===0) return "hard";
    if(t.indexOf("SOFT")===0) return "soft";
    if(t.indexOf("ECHO")===0) return "echo";
    if(t.indexOf("STILL")===0) return "still";
    return "soft";
  }
  function paint(){
    var box=document.getElementById("kalList");
    if(!box) return;
    var ev=(DATA&&DATA.events)||[];
    var now=Date.now()-6*3600*1000;
    ev=ev.filter(function(e){
      var t=Date.parse(e.end||e.start||"");
      return !t || t>=now;
    });
    if(!ev.length){ box.innerHTML="<p class='meta'>Keine nächsten Fenster.</p>"; return; }
    box.innerHTML=ev.map(function(e){
      var k=kind(e.t);
      return '<article class="card kalcard '+k+'">'+ 
        '<b>'+String(e.t||"").replace(/</g,"")+'</b>'+
        '<div class="meta">'+when(e.start,e.all)+'</div>'+
        (e.txt?'<p>'+String(e.txt).replace(/</g,"").slice(0,180)+'</p>':'')+
        '</article>';
    }).join("");
  }
  function load(){
    fetch("kalender.json?v="+Date.now(),{cache:"reload"}).then(function(r){ return r.json(); }).then(function(d){
      DATA=d; paint();
    }).catch(function(){ paint(); });
  }
  var css=document.createElement("style");
  css.textContent=[
    "nav{grid-template-columns:repeat(7,1fr)!important}",
    "nav button{font-size:.5rem!important}",
    ".kalcard{border-left:5px solid transparent;padding-left:.72rem}",
    ".kalcard p{margin:.35rem 0 0;color:#c4b4e0;font-size:.78rem;line-height:1.45}",
    ".kalcard.soft{border-color:#2ecc71;border-left-color:#2ecc71;background:rgba(46,204,113,.14)}",
    ".kalcard.soft b{color:#7dffb0}",
    ".kalcard.hard{border-color:#e74c3c;border-left-color:#e74c3c;background:rgba(231,76,60,.16)}",
    ".kalcard.hard b{color:#ff8a7a}",
    ".kalcard.echo{border-color:#5dade2;border-left-color:#5dade2;background:rgba(93,173,226,.12)}",
    ".kalcard.still{border-color:#9b8bb8;border-left-color:#9b8bb8;background:rgba(155,139,184,.12)}"
  ].join("");
  document.head.appendChild(css);
  if(typeof show==="function" && !show._kal){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="kal") paint();
      return r;
    };
    show._kal=1;
  }
  var open=document.getElementById("kalOpen");
  if(open) open.onclick=function(){ window.open(LINK,"_blank"); };
  load();
})();
