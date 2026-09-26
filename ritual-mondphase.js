/* Mondphasen für die ganze App: echte Zeitpunkte nach Meeus (Astronomical Algorithms, Kap. 49).
   Eine Quelle für Kopfzeile, Tor, Kalender, Hinweise. Genauigkeit rund eine Minute. */
(function(){
  if(window.RR25_MOND) return;
  var DAY=86400000, SYN=29.530588861, rad=Math.PI/180;
  function phaseMs(k,q){ /* q: 0 neu, 1 erstes Viertel, 2 voll, 3 letztes Viertel */
    k=k+q/4;
    var T=k/1236.85;
    var jde=2451550.09766+SYN*k+0.00015437*T*T-0.00000015*T*T*T+0.00000000073*T*T*T*T;
    var E=1-0.002516*T-0.0000074*T*T;
    var M=(2.5534+29.1053567*k-0.0000014*T*T-0.00000011*T*T*T)*rad;
    var Mp=(201.5643+385.81693528*k+0.0107582*T*T+0.00001238*T*T*T-0.000000058*T*T*T*T)*rad;
    var F=(160.7108+390.67050284*k-0.0016118*T*T-0.00000227*T*T*T+0.000000011*T*T*T*T)*rad;
    var O=(124.7746-1.56375588*k+0.0020672*T*T+0.00000215*T*T*T)*rad;
    var s=Math.sin, cs=Math.cos, c;
    if(q===0||q===2){
      if(q===2) c=-0.40614*s(Mp)+0.17302*E*s(M)+0.01614*s(2*Mp)+0.01043*s(2*F)+0.00734*E*s(Mp-M)-0.00515*E*s(Mp+M)+0.00209*E*E*s(2*M);
      else c=-0.4072*s(Mp)+0.17241*E*s(M)+0.01608*s(2*Mp)+0.01039*s(2*F)+0.00739*E*s(Mp-M)-0.00514*E*s(Mp+M)+0.00208*E*E*s(2*M);
      c+=-0.00111*s(Mp-2*F)-0.00057*s(Mp+2*F)+0.00056*E*s(2*Mp+M)-0.00042*s(3*Mp)+0.00042*E*s(M+2*F)+0.00038*E*s(M-2*F)
        -0.00024*E*s(2*Mp-M)-0.00017*s(O)-0.00007*s(Mp+2*M)+0.00004*s(2*Mp-2*F)+0.00004*s(3*M)+0.00003*s(Mp+M-2*F)
        +0.00003*s(2*Mp+2*F)-0.00003*s(Mp+M+2*F)+0.00003*s(Mp-M+2*F)-0.00002*s(Mp-M-2*F)-0.00002*s(3*Mp+M)+0.00002*s(4*Mp);
    } else {
      c=-0.62801*s(Mp)+0.17172*E*s(M)-0.01183*E*s(Mp+M)+0.00862*s(2*Mp)+0.00804*s(2*F)+0.00454*E*s(Mp-M)+0.00204*E*E*s(2*M)
        -0.0018*s(Mp-2*F)-0.0007*s(Mp+2*F)-0.0004*s(3*Mp)-0.00034*E*s(2*Mp-M)+0.00032*E*s(M+2*F)+0.00032*E*s(M-2*F)
        -0.00028*E*E*s(Mp+2*M)+0.00027*E*s(2*Mp+M)-0.00017*s(O)-0.00005*s(Mp-M-2*F)+0.00004*s(2*Mp+2*F)-0.00004*s(Mp+M+2*F)
        +0.00004*s(Mp-2*M)+0.00003*s(Mp+M-2*F)+0.00003*s(3*M)+0.00002*s(2*Mp-2*F)+0.00002*s(Mp-M+2*F)-0.00002*s(3*Mp+M);
      var W=0.00306-0.00038*E*cs(M)+0.00026*cs(Mp)-0.00002*cs(Mp-M)+0.00002*cs(Mp+M)+0.00002*cs(2*F);
      c+=(q===1?W:-W);
    }
    return Math.round((jde+c-2440587.5)*DAY-69000);
  }
  var cache={};
  function ev(k,q){ var key=k+"/"+q; if(!(key in cache)) cache[key]=phaseMs(k,q); return cache[key]; }
  /* alle Phasen zwischen from und to, sortiert: {q,t} */
  function events(from,to){
    var k0=Math.floor((from-947182440000)/(SYN*DAY))-1, out=[];
    for(var k=k0;k<=k0+Math.ceil((to-from)/(SYN*DAY))+2;k++)
      for(var q=0;q<4;q++){ var t=ev(k,q); if(t>=from&&t<=to) out.push({q:q,t:t}); }
    return out.sort(function(a,b){ return a.t-b.t; });
  }
  /* Phase 0..1 (0 neu, .25 erstes Viertel, .5 voll, .75 letztes Viertel), zwischen echten Zeitpunkten */
  function phase(ms){
    if(ms==null) ms=Date.now();
    var e=events(ms-9*DAY,ms+9*DAY), a=null, b=null;
    for(var i=0;i<e.length;i++){ if(e[i].t<=ms) a=e[i]; else { b=e[i]; break; } }
    if(!a||!b) return 0;
    var p=(a.q+(ms-a.t)/(b.t-a.t))/4;
    return p>=1?p-1:p;
  }
  function dayStart(ms){ var d=new Date(ms); return new Date(d.getFullYear(),d.getMonth(),d.getDate()).getTime(); }
  function dayDiff(a,b){ return Math.round((dayStart(b)-dayStart(a))/DAY); }
  function next(q,ms){ var e=events(ms,ms+32*DAY); for(var i=0;i<e.length;i++) if(e[i].q===q) return e[i].t; return null; }
  function prev(q,ms){ var e=events(ms-32*DAY,ms); for(var i=e.length-1;i>=0;i--) if(e[i].q===q) return e[i].t; return null; }
  var SYM=["\u25cb","\ud83c\udf12","\ud83c\udf13","\ud83c\udf14","\ud83c\udf15","\ud83c\udf16","\ud83c\udf17","\ud83c\udf18"];
  /* Zustand eines Kalendertags: Neumond oder Vollmond gilt für den ganzen Tag, an dem er eintritt */
  function day(ms){
    if(ms==null) ms=Date.now();
    var s=dayStart(ms), e=events(s, s+DAY-1), hit={};
    e.forEach(function(x){ hit[x.q]=x.t; });
    var p=phase(ms), key, name;
    if(hit[2]!=null){ key="voll"; name="Vollmond"; }
    else if(hit[0]!=null){ key="neu"; name="Neumond"; }
    else if(p<0.5){ key="zu"; name="Zunehmend"; }
    else { key="ab"; name="Abnehmend"; }
    var si;
    if(key==="neu") si=0; else if(key==="voll") si=4;
    else if(hit[1]!=null) si=2; else if(hit[3]!=null) si=6;
    else if(key==="zu") si=p<0.25?1:3; else si=p<0.75?5:7;
    var nf=next(2,s+DAY), nn=next(0,s+DAY);
    return {key:key,name:name,p:p,waxing:p<0.5,sym:SYM[si],viertel:hit[1]!=null?1:(hit[3]!=null?3:0),at:hit[2]!=null?hit[2]:hit[0],
      fullIn:nf?dayDiff(s,nf):null,newIn:nn?dayDiff(s,nn):null,nextFull:nf,nextNew:nn,lastFull:prev(2,ms)};
  }
  window.RR25_MOND={events:events,phase:phase,day:day,next:next,prev:prev,phaseMs:phaseMs};
})();
