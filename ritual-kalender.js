(function(){
  var LINK="https://calendar.google.com/calendar/r?cid=47c369013814767dea03adb95f43c3b7b64174e10565af9fbe6799f0a8eb0e3a@group.calendar.google.com";
  var DATA=null, OPENALL=false;
  var LAT=46.948, LON=7.447;
  function pad(n){ return String(n).padStart(2,"0"); }
  function dayKey(d){ return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate()); }
  function parseWhen(s){
    if(!s) return null;
    var d=new Date(s.length<=10?s+"T12:00:00":s);
    return isNaN(d.getTime())?null:d;
  }
  function when(s, all){
    var d=parseWhen(s); if(!d) return s||"";
    var days=["So","Mo","Di","Mi","Do","Fr","Sa"];
    var day=days[d.getDay()]+" "+d.getDate()+"."+(d.getMonth()+1)+".";
    if(all || (s&&s.length<=10)) return day;
    return day+" · "+pad(d.getHours())+":"+pad(d.getMinutes());
  }
  function kind(t){
    t=String(t||"").toUpperCase();
    if(t.indexOf("HARD")===0) return "hard";
    if(t.indexOf("ECHO")===0) return "echo";
    if(t.indexOf("STILL")===0) return "still";
    if(t.indexOf("SOFT")===0) return "soft";
    return "soft";
  }
  function moonAge(ms){
    var syn=29.53058867;
    var nm=Date.UTC(2000,0,6,18,14)/1000;
    var age=(((ms/1000)-nm)/86400)%syn;
    if(age<0) age+=syn;
    return age;
  }
  function moonLabel(ms){
    var p=moonAge(ms)/29.53058867;
    if(p<0.03||p>0.97) return "Neumond · setzen";
    if(p<0.22) return "Zunehmend · wachsen";
    if(p<0.28) return "Zunehmend · Form";
    if(p<0.47) return "Zunehmend · Kraft";
    if(p<0.53) return "Vollmond · nicht nachsetzen";
    if(p<0.72) return "Abnehmend · abgeben";
    if(p<0.78) return "Abnehmend · lösen";
    return "Abnehmend · leeren";
  }
  function sunTimes(date){
    var start=new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0));
    var J2000=(Date.UTC(2000,0,1,12)-Date.UTC(1970,0,1))/86400000;
    function hours(h){
      var d=new Date(start.getTime()+h*3600000+(2*3600000));
      return d;
    }
    var day=((start-Date.UTC(date.getFullYear(),0,0))/86400000);
    var decl=23.44*Math.sin((Math.PI/180)*(360/365)*(day-81));
    var latr=LAT*Math.PI/180, decr=decl*Math.PI/180;
    var ha=Math.acos(Math.max(-1,Math.min(1,(-Math.sin(latr)*Math.sin(decr))/(Math.cos(latr)*Math.cos(decr)))));
    var noon=12-(LON/15);
    var rise=noon-(ha*180/Math.PI)/15;
    var set=noon+(ha*180/Math.PI)/15;
    return {rise:hours(rise-2), noon:hours(noon-2), set:hours(set-2)};
  }
  function suggest(k){
    if(k==="soft") return {id:"segen",label:"Segen"};
    if(k==="echo") return {id:"zur",label:"Energie zurück"};
    return {id:"",label:""};
  }
  function computedFrom(from, days){
    var out=[];
    for(var i=0;i<days;i++){
      var d=new Date(from.getFullYear(), from.getMonth(), from.getDate()+i, 12);
      var sun=sunTimes(d);
      var age=moonAge(d.getTime());
      var p=age/29.53058867;
      var k="soft", tag="SOFT · Tag";
      if(p<0.04||p>0.96){ k="soft"; tag="SOFT · Neumond"; }
      else if(p>0.47&&p<0.53){ k="echo"; tag="ECHO · Vollmond"; }
      else if(p>0.72){ k="still"; tag="STILL · abnehmend"; }
      out.push({t:tag+" · "+moonLabel(d.getTime()), start:dayKey(d), all:true, src:"calc"});
      out.push({t:"SOFT · Aufgang", start:sun.rise.toISOString(), all:false, src:"calc"});
      out.push({t:"SOFT · Mittag", start:sun.noon.toISOString(), all:false, src:"calc"});
      out.push({t:"SOFT · Untergang", start:sun.set.toISOString(), all:false, src:"calc"});
    }
    return out;
  }
  function merged(){
    var file=(DATA&&DATA.events)||[];
    var last=0;
    file.forEach(function(e){ var t=Date.parse(e.end||e.start||""); if(t>last) last=t; });
    var now=new Date();
    var extra=[];
    if(!last || last < now.getTime()+20*86400000){
      extra=computedFrom(now, 45);
    }
    return file.concat(extra);
  }
  function upcoming(){
    var now=Date.now()-3*3600*1000;
    return merged().filter(function(e){
      var t=Date.parse(e.end||e.start||"");
      return !t || t>=now;
    }).sort(function(a,b){ return Date.parse(a.start||"")-Date.parse(b.start||""); });
  }
  function todayEvents(ev){
    var key=dayKey(new Date());
    return ev.filter(function(e){
      var d=parseWhen(e.start); if(!d) return false;
      return dayKey(d)===key;
    });
  }
  function weekEvents(ev){
    var end=Date.now()+7*86400000;
    return ev.filter(function(e){
      var t=Date.parse(e.start||"");
      return t && t<=end;
    });
  }
  function card(e){
    var k=kind(e.t);
    var sug=suggest(k);
    var hint=k==="hard"?"Nur vormerken. Nicht automatisch setzen.":(sug.id?"Tippen legt nach Geplant.":"Nur lesen.");
    return '<article class="card kalcard '+k+'" data-kal="1" data-kind="'+k+'" data-title="'+String(e.t||"").replace(/"/g,"")+'" data-sid="'+sug.id+'" data-slabel="'+sug.label+'">'+ 
      '<b>'+String(e.t||"").replace(/</g,"")+'</b>'+
      '<div class="meta">'+when(e.start,e.all)+(e.src==="calc"?" · gerechnet":"")+'</div>'+
      (e.txt?'<p>'+String(e.txt).replace(/</g,"").slice(0,180)+'</p>':'')+
      '<p class="meta">'+hint+'</p>'+
      '</article>';
  }
  function toneOf(list){
    var rank={hard:4,still:3,echo:2,soft:1};
    var best="soft", n=0;
    list.forEach(function(e){
      var k=kind(e.t);
      if((rank[k]||0)>n){ n=rank[k]; best=k; }
    });
    return best;
  }
  function paint(){
    var box=document.getElementById("kalList");
    if(!box) return;
    var ev=upcoming();
    var tod=todayEvents(ev);
    var week=weekEvents(ev);
    var rest=ev.filter(function(e){ return week.indexOf(e)<0; });
    var tone=toneOf(tod.length?tod:week.slice(0,3));
    var sag={
      hard:"Heute hart. Reibung. Gate bevor du setzt.",
      still:"Heute still. Buch zu. Keine Kerze aus Pflicht.",
      echo:"Heute Nachlauf. Nicht nachladen.",
      soft:"Heute soft. Öffnen erlaubt. Halten nicht."
    }[tone];
    var html='<article class="card kalcard '+tone+' kaltoday"><p class="meta">Heute</p><b>'+(tod.length?tod[0].t.replace(/</g,""):"Kein Eintrag · "+moonLabel(Date.now()))+'</b><p>'+sag+'</p><p class="meta">'+moonLabel(Date.now())+' · Bern</p></article>';
    html+='<p class="group">7 Tage</p>';
    html+=week.length?week.map(card).join(""):"<p class='meta'>Keine Fenster in 7 Tagen.</p>";
    if(rest.length){
      html+='<div class="row"><button type="button" class="btn ghost" id="kalMore">'+(OPENALL?"Woche":"Weiter · "+rest.length)+'</button></div>';
      if(OPENALL) html+='<p class="group">Weiter</p>'+rest.map(card).join("");
    }
    box.innerHTML=html;
    var more=document.getElementById("kalMore");
    if(more) more.onclick=function(){ OPENALL=!OPENALL; paint(); };
    box.querySelectorAll("[data-kal]").forEach(function(el){
      el.onclick=function(){
        var k=el.getAttribute("data-kind");
        var sid=el.getAttribute("data-sid")||"";
        var title=el.getAttribute("data-title")||"Fenster";
        if(typeof load!=="function"||typeof save!=="function"||typeof uid!=="function") return;
        if(k==="hard"||k==="still"||!sid){
          var d=load();
          d.planned=d.planned||[];
          d.planned.unshift({pid:uid(),id:"",titel:title,wer:"Fenster · nicht automatisch setzen",t:now(),fenster:1});
          save(d);
          if(el.querySelector(".kalok")) return;
          var p=document.createElement("p"); p.className="msg kalok"; p.textContent="In Geplant. Nicht gestartet.";
          el.appendChild(p);
          return;
        }
        var r=(typeof R!=="undefined"?R:[]).find(function(x){ return x.id===sid; });
        var d=load();
        d.planned=d.planned||[];
        d.planned.unshift({pid:uid(),id:sid,titel:(r?r.t:title),wer:title,t:now(),fenster:1});
        save(d);
        if(el.querySelector(".kalok")) return;
        var p=document.createElement("p"); p.className="msg kalok"; p.textContent="In Geplant: "+(r?r.t:title);
        el.appendChild(p);
      };
    });
  }
  function loadKal(){
    fetch("kalender.json?v="+Date.now(),{cache:"reload"}).then(function(r){ return r.json(); }).then(function(d){
      DATA=d; paint();
    }).catch(function(){ DATA={events:[]}; paint(); });
  }
  var css=document.createElement("style");
  css.textContent=[
    ".kalcard{border-left:5px solid transparent;padding-left:.72rem}",
    ".kalcard p{margin:.35rem 0 0;color:#c4b4e0;font-size:.78rem;line-height:1.45}",
    ".kalcard.soft{border-color:#2ecc71;background:rgba(46,204,113,.14)}",
    ".kalcard.soft b{color:#7dffb0}",
    ".kalcard.hard{border-color:#e74c3c;background:rgba(231,76,60,.16)}",
    ".kalcard.hard b{color:#ff8a7a}",
    ".kalcard.echo{border-color:#5dade2;background:rgba(93,173,226,.12)}",
    ".kalcard.still{border-color:#9b8bb8;background:rgba(155,139,184,.12)}",
    ".kaltoday{margin-bottom:.6rem}",
    ".kaltoday b{font-size:1.05rem}"
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
  loadKal();
})();
