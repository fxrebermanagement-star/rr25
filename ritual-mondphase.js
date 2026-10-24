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
  /* Build 112: Mondphase als Fenster. Neumond und Vollmond gelten je ±1 Kalendertag (Berner Zeit), dazwischen zu- oder abnehmend.
     {key,name,sym,say}: say z. B. «zunehmend · 3 Tage vor Vollmond» oder «Vollmond-Fenster · 1 Tag nach Vollmond». */
  function fenster(ms){
    if(ms==null) ms=Date.now();
    var s=dayStart(ms), d=day(ms), win=null;
    events(s-2*DAY, s+3*DAY).forEach(function(x){
      if(x.q!==0&&x.q!==2) return;
      var dd=dayDiff(x.t,s); if(Math.abs(dd)<=1&&(!win||Math.abs(dd)<Math.abs(win.dd))) win={q:x.q,dd:dd};
    });
    function tage(n){ return n===1?"1 Tag":n+" Tage"; }
    if(win){
      var nm=win.q===2?"Vollmond":"Neumond";
      return {key:win.q===2?"voll":"neu",name:nm,sym:win.q===2?SYM[4]:"\ud83c\udf11",
        say:win.dd===0?nm:nm+"-Fenster · "+tage(1)+(win.dd<0?" vor ":" nach ")+nm};
    }
    var zu=d.p<0.5, nf=next(2,s+DAY), nn=next(0,s+DAY);
    return {key:zu?"zu":"ab",name:zu?"Zunehmend":"Abnehmend",sym:d.sym,
      say:zu?"zunehmend"+(nf?" · "+tage(dayDiff(s,nf))+" vor Vollmond":""):"abnehmend"+(nn?" · "+tage(dayDiff(s,nn))+" vor Neumond":"")};
  }

  /* Build 126: Vollmondnamen mit Tierkreiszeichen (tropisch). Mond bei Vollmond = Sonne + 180°. */
  var VMN=["Wolfsmond","Schneemond","Wurmmond","Pinkmond","Blumenmond","Erdbeermond","Hirschmond","Störmond","Erntemond","Jägermond","Bibermond","Kältemond"];
  var ZD=["Widder","Stier","Zwillinge","Krebs","Löwe","Jungfrau","Waage","Skorpion","Schütze","Steinbock","Wassermann","Fische"];
  var WAS={Widder:"Wasser für Mut und Neustart. Gut zum Waschen der Hände vor einem ersten Schritt.",
    Stier:"Wasser für Fülle, Erdung und Selbstwert. Gut für Pflanzen, Geldschale und Körperpflege.",
    Zwillinge:"Wasser für klare Worte und Austausch. Gut vor Gesprächen, Briefen und Lernen.",
    Krebs:"Wasser für Geborgenheit und Heilen. Gut fürs Zuhause, Bad und Herzarbeit.",
    "Löwe":"Wasser für Strahlkraft und Selbstvertrauen. Gut für Auftritte und Kreatives.",
    Jungfrau:"Wasser für Ordnung, Reinigung und Gesundheit. Gut zum Putzen und für den Alltag.",
    Waage:"Wasser für Harmonie und Liebe. Gut für Beziehungen, Schönheit und Ausgleich.",
    Skorpion:"Wasser für Tiefe, Schutz und Loslassen. Gut zum Reinigen alter Lasten.",
    "Schütze":"Wasser für Glück, Weite und Zuversicht. Gut für Reisen und grosse Ziele.",
    Steinbock:"Wasser für Ausdauer und Struktur. Gut für Beruf, Pläne und Grenzen.",
    Wassermann:"Wasser für Freiheit und neue Ideen. Gut für Wandel und Freundschaft.",
    Fische:"Wasser für Intuition und Träume. Gut für Meditation, Schlaf und Mitgefühl."};
  function sunLon(ms){ var n=ms/DAY+2440587.5-2451545, g=(357.528+0.9856003*n)*rad; return ((280.460+0.9856474*n+1.915*Math.sin(g)+0.020*Math.sin(2*g))%360+360)%360; }
  function vollName(t){
    var d=new Date(t), m=d.getMonth(), p=prev(2,t-5*DAY), blau=p&&new Date(p).getMonth()===m&&new Date(p).getFullYear()===d.getFullYear();
    var z=ZD[Math.floor(((sunLon(t)+180)%360)/30)];
    return {name:blau?"Blauer Mond":VMN[m],zeichen:z,t:t,wasser:WAS[z],laden:"Wasser laden: Vorabend bis Nacht danach, 3 Nächte."};
  }
  window.RR25_MOND={vollName:vollName,events:events,phase:phase,day:day,next:next,prev:prev,phaseMs:phaseMs,fenster:fenster};
})();
