/* rr25 · Paket 2/7 · Build 47 · erzeugt mit tools/bundle.py. Nicht von Hand bearbeiten:
   Quelldatei ändern und neu erzeugen. Inhalt in dieser Reihenfolge: ritual-runner-v2.js, ritual-karten.js */
/* ==== ritual-runner-v2.js ==== */
try{
/* ritual-runner-v2.js — ein einziger Ablauf für alle Rituale (Daten: rituals-v2.js).
   Hard:  Diagnose -> Ethik-Gate (drei Ja) -> Tor -> Härte -> (optional Wesenheit) -> Schritte
   Soft:  Tor -> Schritte
   Schritte: ... Absicht -> 3·6·9 -> So sei es (Siegel) -> Rückkehr (Pflicht) -> Status «Es ist so» (optional, einmal) -> Echo-Notiz
   Abbruch in jedem Schritt: kurze Rückkehr, Eintrag «abgebrochen» in der Chronik.
   Speichert nur in rr25_ritual_v1 (log/planned) und rr25_dank. */
(function(){
  if(typeof R==="undefined") return;
  var CATS=window.RR_CATS||["Schutz","Energie","Liebe","Trennung","Person X","Feld"];
  var DAYS=["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];
  var PLANET=["Sonne · Kraft, Sichtbarkeit","Mond · Gefühl, Traum","Mars · Grenze, Mut","Merkur · Wort, Kontakt","Jupiter · Fülle","Venus · Liebe","Saturn · Grenze, Trennung"];
  var TONE_NAME={soft:"Soft",hard:"Hard",grenze:"Grenze",feld:"Feld",neutral:"Abbruch"};
  var ANKER="Anker: Daumen und Zeigefinger zusammen. Eigener Vorname laut.";
  var ABBR_TXT="Ich stoppe jetzt. Die Arbeit ist nicht gesetzt.\nIch kehre vollständig in mich zurück.\nDas Feld ist geschlossen. So ist es.";
  var LV={weich:"Weich",mittel:"Mittel",nagel:"Nagelhart"};

  R.forEach(function(r){ r.tag=r.cat; if(!r.steps) r.steps=r.flow; });
  function byId(id){
    var map={liebezw:"liebe2",fremd:"wesen",fil:"wesen",finst:"vollmond",schaden:"stopp"};
    id=map[id]||id;
    for(var i=0;i<R.length;i++) if(R[i].id===id) return R[i];
    return null;
  }
  function h(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function run(){ return document.getElementById("run"); }
  function ymd(){ var n=new Date(); return n.getFullYear()+"-"+String(n.getMonth()+1).padStart(2,"0")+"-"+String(n.getDate()).padStart(2,"0"); }

  /* ---------- Wetter ----------
     Gemeinsame Regel mit dem Kalender-Tab (ritual-zeit.js): Bänder von Start bis Ende, Hard nur im offenen Feintakt,
     nie aus künftigen Terminen. Ohne Kalender-Daten rechnet ritual-zeit.js nach der Mondregel. */
  var KZ=window.RR25_KAL;
  function two(n){ return String(n).padStart(2,"0"); }
  function hm(ms){ var d=new Date(ms); return two(d.getHours())+":"+two(d.getMinutes()); }
  function relDay(ms){
    var a=new Date(ms), b=new Date(); a.setHours(0,0,0,0); b.setHours(0,0,0,0);
    var n=Math.round((a-b)/86400000), dn=["So","Mo","Di","Mi","Do","Fr","Sa"];
    return n===0?"heute":(n===1?"morgen":dn[a.getDay()]+" "+a.getDate()+"."+(a.getMonth()+1)+".");
  }
  function loadKal(){
    if(!KZ||loadKal.on) return;
    loadKal.on=1;
    KZ.onReady(function(){ var w=document.getElementById("wetter"); if(w) w.innerHTML=wetterHtml(cur&&cur.r); });
  }
  function wetter(){
    if(!KZ) return {kind:"SOFT",txt:"SOFT",s:null};
    var s=KZ.state(), txt;
    if(s.open) txt=s.open.t;
    else if(s.src==="tag"&&s.single) txt=s.single.t;
    else if(s.src==="band"&&s.band) txt=s.band.t;
    else if(s.src==="mondtag"&&s.marker) txt=s.marker.t;
    else txt=s.kind+" · "+(window.RR25_MOND?window.RR25_MOND.day().name:"");
    return {kind:s.kind,txt:txt,s:s};
  }
  function fensterZeile(now){
    if(!KZ) return "";
    var L=KZ.list(now), d0=new Date(now); d0.setHours(0,0,0,0); d0=d0.getTime();
    var soft=[], hard=[];
    L.forEach(function(x){
      if(x.all||x.e<=now||x.s>=d0+86400000) return;
      if(x.k==="HARD") hard.push(x);
      else if(x.k==="SOFT") soft.push(x);
    });
    var bits=[];
    if(soft.length) bits.push('Soft-Fenster: '+soft.map(function(x){ return hm(x.s)+(x.s<=now&&now<x.e?' (offen)':''); }).join(' · '));
    if(hard.length) bits.push('Hard-Feintakte: '+hard.map(function(x){ return hm(x.s)+(x.anker?' Anker':'')+(x.s<=now&&now<x.e?' (offen)':''); }).join(' · '));
    if(!bits.length) bits.push('Heute kein Soft-Fenster und kein Hard-Feintakt mehr.');
    return '<br><span class="meta fenLine">'+bits.join('<br>')+'</span>';
  }
  function wetterHtml(r){
    var w=wetter(), s=w.s, d=new Date().getDay(), now=Date.now();
    var say={SOFT:"Soft-Fenster. Weiche Arbeit trägt.",HARD:"Hard-Feintakt offen. Scharf. Nur mit Gate und Rückkehr.",ECHO:"Echo. Nicht nachsetzen. Schliessen, danken, ernten.",STILL:"Still. Heute eher nichts setzen."}[w.kind];
    var extra="";
    if(s&&s.open){
      var m=Math.max(1,Math.ceil((s.open.e-now)/60000));
      extra+='<br><span class="meta">Offen bis '+hm(s.open.e)+' · noch '+(m<60?m+' Min.':Math.floor(m/60)+' Std. '+(m%60?m%60+' Min.':''))+'</span>';
      if(s.band) extra+='<br><span class="meta">Band '+({SOFT:"Soft",STILL:"Still",ECHO:"Echo",HARD:"Hard"}[s.band.k])+' bis '+relDay(s.band.e-1)+'</span>';
    }
    var warn="";
    if(r && r.hard && w.kind!=="HARD" && KZ){
      var n=KZ.next("HARD",now);
      warn='<br><b>Jetzt nicht.</b> Hard-Fenster zu.'+(n?' Nächstes: '+relDay(n.x.s)+' '+hm(n.x.s)+'–'+hm(n.x.e)+'.':' Kein Feintakt im Kalender.');
      if((w.kind==="ECHO"||w.kind==="STILL") && !(n&&relDay(n.x.s)==="heute")) warn+='<br><b>Für Hard eher nicht heute.</b>';
    } else if(r && !r.hard && !r.skipTiming && (w.kind==="STILL"||w.kind==="ECHO") && KZ){
      var n2=KZ.next("SOFT",now);
      warn='<br><b>Jetzt nicht.</b> '+(w.kind==="STILL"?'Still-Band.':'Echo-Tag.')+(n2?' Nächstes Soft-Fenster: '+relDay(n2.x.s)+' '+hm(n2.x.s)+'.':'');
    }
    return '<span class="wk wk-'+w.kind.toLowerCase()+'">'+h(w.txt)+'</span><br>'+say+extra+warn+fensterZeile(now)+'<br><span class="meta">'+DAYS[d]+' · '+PLANET[d]+'</span>';
  }
  setInterval(function(){ var w=document.getElementById("wetter"); if(w&&cur){ var x=wetterHtml(cur.r); if(x!==w.innerHTML) w.innerHTML=x; } },30000);

  /* ---------- Ablauf ---------- */
  var cur=null;
  function sigilAbsicht(){
    try{ var d=JSON.parse(localStorage.getItem("rr25_sigil")||"{}"); return String(d.t||"").trim(); }catch(e){ return ""; }
  }
  function fillT(s){
    var r=cur.r, m=cur.mem;
    var keys=["Name","A","B","Auftrag","AuftragW","Wofür","Absicht"];
    var lines=String(s).split("\n").filter(function(line){
      if(r.needOpt && !m.Name && line.indexOf("[Name]")>=0) return false;
      return true;
    });
    s=lines.join("\n");
    keys.forEach(function(k){ s=s.split("["+k+"]").join(m[k]?m[k]:"["+k+"]"); });
    return s;
  }
  function isStep(t,rx){ return rx.test(t); }
  function build(){
    var r=cur.r, lv=cur.lvl, out=[];
    r.flow.forEach(function(st){ out.push([st[0],st[1]]); });
    function idx(rx){ for(var i=0;i<out.length;i++) if(rx.test(out[i][0])) return i; return -1; }
    if(r.haerte && lv){
      var a=idx(/^Absicht$/);
      if(a>=0){
        if(lv==="weich") out[a][1]+="\nNur so weit, wie es für alle stimmig ist. Der freie Wille bleibt.";
        if(lv==="nagel") out[a][1]+="\nKein Ausweg im Satz. Keine Hintertür.";
      }
      if(lv==="nagel" && r.ichHart){
        var a2=idx(/^Absicht$/);
        out.splice(a2+1,0,
          ["Versetzen","Tu:\nName laut.\n\nSprich:\nIch bin [Name]. Nur für diesen einen Satz.\nVon innen setze ich die Bahn."],
          ["Zurück aus [Name]","Sprich sofort:\nIch bin nicht mehr [Name].\nIch bin wieder ich. Der Beobachter hält."]);
      }
      if(lv!=="weich"){
        var z=idx(/^369$/);
        out.splice(z,0,["Anker","Tu:\nDen Satz auf Papier. Unter die Kerze oder zum Foto.\n\nSprich:\nDer Satz hat Körper."+(lv==="nagel"?"\nEr bleibt, bis er erfüllt ist.":"")]);
      }
      var z2=idx(/^369$/);
      if(lv==="nagel" && z2>=0) out[z2][1]=out[z2][1].replace("Tu:\nJede Zeile laut. Antippen zählt.","Tu:\nHand auf den Anker. Laut, ohne Pause.");
      if(lv==="weich" && z2>=0) out[z2][1]=out[z2][1].replace("Tu:\nJede Zeile laut. Antippen zählt.","Tu:\nLeise, ohne Druck.");
      var s=idx(/^So sei es$/);
      if(s>=0){
        if(lv==="weich") out[s][1]="Sprich:\nSo sei es.";
        if(lv==="nagel") out[s][1]="Tu:\nKerze mit Salz löschen, nicht blasen.\n\nSprich:\nVersiegelt. Übergeben. So sei es.";
      }
      var k=idx(/^Rückkehr$/);
      if(lv==="nagel" && k>=0){
        var who=r.need&&r.need.indexOf("A")>=0?"Ich bin nicht [A]. Ich bin nicht [B].":((r.ichHart||r.ich)?"Ich bin nicht mehr [Name].":"Ich bin nicht [Name].");
        out[k][1]="Drei Schritte.\n\n1 Benennen:\n"+who+"\n\n2 Trennen:\nIch kehre vollständig in mich zurück. Meine Energie gehört nur mir. Alles Fremde löst sich und geht.\n\n3 Körper:\nFüsse. Atem. Hände. Raum.\nIch bin ganz bei mir. So ist es.";
      }
      var e=idx(/^Schluss$/);
      if(e>=0 && lv==="nagel") out[e][1]=/\nTu:\n[^\n]*$/.test(out[e][1])?out[e][1].replace(/\nTu:\n[^\n]*$/,"\nTu:\nWasser. Alltag.\nFrist: nicht nachladen, nicht nachschauen. Die Arbeit läuft."):out[e][1]+"\n\nFrist: nicht nachladen, nicht nachschauen. Die Arbeit läuft.";
    }
    if(cur.wesen && !r.wesenSelf){
      var a3=idx(/^369$/); if(r.haerte&&lv!=="weich") a3=idx(/^Anker$/);
      out.splice(a3,0,
        ["Wesenheit · Filter","Sprich:\nNur klare, stimmige Präsenz. Was drängt, bleibt draussen.\nWer bereit und geeignet ist, möge sich zeigen."],
        ["Wesenheit · Auftrag","Sprich:\nDein Auftrag ist: "+(ownAuf()?"[AuftragW]":"[Auftrag]")+". Nur in diesem Rahmen.\nOhne unnötigen Schaden. Der Auftrag endet, wenn er erfüllt ist."]);
      var k2=idx(/^Rückkehr$/);
      out.splice(k2,0,["Wesenheit · Entlassen","Sprich:\nDer Auftrag ist beendet, wenn er erfüllt ist. Ich danke dir.\nDu bist frei. Löse alle Verbindungen. Ich schliesse den Kontakt."]);
    }
    var kk=idx(/^Rückkehr$/);
    if(kk>=0 && r.id!=="schlaf") out[kk][1]+="\n\n"+ANKER;
    cur.steps=out;
  }
  /* Ritual hat ein eigenes Auftragsfeld (z. B. Person übernehmen): die Wesenheit bekommt dann ein eigenes Feld */
  function ownAuf(){ return (cur.r.need||[]).indexOf("Auftrag")>=0 && !cur.r.wesenSelf; }
  function needs(){
    var n=(cur.r.need||[]).slice();
    if(cur.wesen && !cur.r.wesenSelf) n.push(ownAuf()?"AuftragW":"Auftrag");
    return n;
  }
  var NEED_LAB={AuftragW:"Auftrag der Wesenheit"};

  function frame(opt){
    var r=cur.r, el=run();
    el.setAttribute("data-tone", r.tone||"soft");
    var sub=h(r.t)+(cur.lvl?" · "+LV[cur.lvl]:"")+(cur.wesen&&!r.wesenSelf?" · Mit Wesenheit":"")+(opt.n?" · "+opt.n:"");
    var abortBtn=(opt.noAbort||r.id==="abbr")?"":'<div class="row"><button type="button" class="btn abortBtn" id="abortR">Abbruch</button></div>';
    el.innerHTML='<div class="hero"><p class="sub">'+sub+'</p><p class="tonetag">'+(TONE_NAME[r.tone]||"")+'</p><h2>'+opt.title+'</h2></div>'+
      (opt.body||"")+
      '<div class="row">'+(opt.prev?'<button type="button" class="btn ghost" id="prev">'+opt.prev+'</button>':'')+
      (opt.next?'<button type="button" class="btn primary" id="next">'+opt.next+'</button>':'')+'</div>'+
      '<p class="msg" id="msg"></p>'+abortBtn;
    var a=document.getElementById("abortR");
    if(a) a.onclick=function(){ abortScreen(opt.stepName||opt.title); };
    window.scrollTo(0,0);
  }
  function msg(t){ var m=document.getElementById("msg"); if(m) m.textContent=t; }
  /* Start aus einem Kalender-Eintrag: Fenster und Restzeit oben einblenden (nur Anzeige, die Regel bleibt die des Tors) */
  function ctxHtml(){
    var c=cur&&cur.ctx; if(!c||!c.s) return "";
    var now=Date.now(), when;
    if(c.all) when="ganzer Tag";
    else if(now<c.s) when=relDay(c.s)+" · beginnt "+hm(c.s);
    else if(now<c.e){ var m=Math.max(1,Math.ceil((c.e-now)/60000)); when="offen bis "+hm(c.e)+" · noch "+(m<60?m+" Min.":Math.floor(m/60)+" Std. "+(m%60?m%60+" Min.":"")); }
    else when="vorbei seit "+hm(c.e);
    var k=String(c.kind||"soft").toLowerCase();
    return '<p class="ctxLine"><span class="wk wk-'+h(k)+'">Aus Kalender</span> '+h(c.title||"")+(c.all?"":" · "+hm(c.s)+"–"+hm(c.e))+'<br><span class="meta">'+when+'</span></p>';
  }

  function diagnose(){
    var r=cur.r, soft=r.soft&&byId(r.soft);
    var body='<p class="words">'+(r.wesenSelf
      ?"Nur wenn der einfache Faden nicht reicht.\nHartes Ende. Danach zurück.\n\nWas genau soll getragen werden? Reicht die Arbeit ohne Wesenheit?"
      :"Was genau ist das Problem? Wen betrifft es?\nWas ist die weichste Lösung, die reicht?\n\nSoft vor Hard, wenn Soft reicht.")+'</p>'+
      '<div class="row"><button type="button" class="btn ghost" id="dSoft">'+(soft?"Soft reicht · "+h(soft.t):"Faden reicht · zurück")+'</button></div>';
    frame({title:"Diagnose",body:body,prev:"Liste",next:"Hard nötig",noAbort:true});
    document.getElementById("prev").onclick=function(){ show("home"); };
    document.getElementById("dSoft").onclick=function(){ if(soft) openV2(soft.id, cur.wer); else show("home"); };
    document.getElementById("next").onclick=gate;
  }
  function gate(){
    var r=cur.r;
    var body='<p class="words">Feldgesetz: Jede Arbeit hat einen Preis.\nDrei Ja, sonst Soft oder Abbruch.</p>'+
      '<label class="gchk"><input type="checkbox" class="g3"><span>Ich kenne den Preis und trage ihn.<br><small>'+h(r.preis||"")+'</small></span></label>'+
      '<label class="gchk"><input type="checkbox" class="g3"><span>Ich kenne die Gegenseite.<br><small>'+h(r.gegen||"")+'</small></span></label>'+
      '<label class="gchk"><input type="checkbox" class="g3"><span>Ich kehre vollständig zurück.</span></label>';
    frame({title:"Ethik-Gate",body:body,prev:"Zurück",next:"Drei Ja",noAbort:true});
    document.getElementById("prev").onclick=diagnose;
    document.getElementById("next").onclick=function(){
      var ok=[].slice.call(document.querySelectorAll("#run .g3")).every(function(c){ return c.checked; });
      if(!ok){ msg("Drei Ja, sonst Soft oder Abbruch."); return; }
      cur.gate=true; tor();
    };
  }
  function tor(){
    loadKal();
    var body=ctxHtml()+'<div class="wetter" id="wetter">'+wetterHtml(cur.r)+'</div>'+
      '<p class="words">Zwei Atemzüge. Dann hinhören:\nZieht es · Steht es · Ist es still?</p>'+
      '<div class="row tor3"><button type="button" class="btn ghost" id="tStill">Still</button><button type="button" class="btn ghost" id="tZieht">Zieht</button><button type="button" class="btn primary" id="tSteht">Steht</button></div>';
    frame({title:"Tor",body:body,prev:cur.r.hard?"Zurück":"Liste",noAbort:true});
    document.getElementById("prev").onclick=function(){ if(cur.r.hard) gate(); else show("home"); };
    document.getElementById("tStill").onclick=function(){
      frame({title:"Still",body:'<p class="words">Heute nicht. Buch zu.\nNichts gesetzt, nichts offen.\n\nLäuft noch ein alter Zug? Abbruch geht auch bei Still.</p><div class="row"><button type="button" class="btn ghost" id="toAbbr">Abbruch-Ritual</button></div>',next:"Zur Liste",noAbort:true});
      document.getElementById("next").onclick=function(){ show("home"); };
      document.getElementById("toAbbr").onclick=function(){ openV2("abbr"); };
    };
    document.getElementById("tZieht").onclick=function(){
      frame({title:"Zieht",body:'<p class="words">Es zieht stark. Erst Mitte.\nFüsse. Drei Atemzüge. Dann noch einmal hinhören.</p>',next:"Nochmal prüfen",noAbort:true});
      document.getElementById("next").onclick=tor;
    };
    document.getElementById("tSteht").onclick=afterTor;
  }
  function afterTor(){ if(cur.r.haerte) haerte(); else if(cur.r.hard && !cur.r.wesenSelf) wesenQ(); else startSteps(); }
  function haerte(){
    var body='<p class="words">Wie viel Dosis trägt die Sache?</p>'+
      '<button type="button" class="card lv" data-lv="weich"><b>Weich</b><small>Absicht mit freiem Willen. Leise 3 · 6 · 9. Einfaches So sei es.</small></button>'+
      '<button type="button" class="card lv" data-lv="mittel"><b>Mittel</b><small>Mit Anker auf Papier. Voller Siegelsatz.</small></button>'+
      '<button type="button" class="card lv" data-lv="nagel"><b>Nagelhart</b><small>Anker, Satz ohne Hintertür, Siegel mit Salz, Rückkehr in drei Schritten, Frist.'+(cur.r.ichHart?" Kurz hinein, sofort zurück.":"")+'</small></button>';
    frame({title:"Härte",body:body,prev:"Tor",noAbort:true});
    document.getElementById("prev").onclick=tor;
    [].slice.call(document.querySelectorAll("#run .lv")).forEach(function(b){
      b.onclick=function(){ cur.lvl=b.getAttribute("data-lv"); if(cur.r.hard && !cur.r.wesenSelf) wesenQ(); else startSteps(); };
    });
  }
  function wesenQ(){
    var pk=cur.wesenPick, on0=pk===0, on1=pk===1;
    var body='<p class="words wqInfo">Eine fremde Präsenz trägt einen klar begrenzten Auftrag und wird danach entlassen. Standard: ohne.</p>'+
      '<button type="button" class="card wq'+(on0?' sel':'')+'" data-w="0" aria-pressed="'+on0+'"><b>Ohne Wesenheit</b><small>Der eigene Faden trägt.</small></button>'+
      '<button type="button" class="card wq'+(on1?' sel':'')+'" data-w="1" aria-pressed="'+on1+'"><b>Mit Wesenheit</b><small>Nur wenn der Faden nicht reicht. Hartes Ende. Danach zurück.</small><small class="wqPlus">+3 Schritte: Filter, Auftrag, Entlassen · dazu ein Feld für den Auftrag</small></button>';
    frame({title:"Wesenheit?",body:body,prev:"Zurück",noAbort:true});
    document.getElementById("prev").onclick=function(){ if(cur.r.haerte) haerte(); else tor(); };
    [].slice.call(document.querySelectorAll("#run .wq")).forEach(function(b){
      b.onclick=function(){ cur.wesen=b.getAttribute("data-w")==="1"; cur.wesenPick=cur.wesen?1:0; startSteps(); };
    });
  }
  function startSteps(){ build(); cur.i=0; cur.started=true; step(); }

  function counter(text){
    var rows=[], rest=[];
    String(text).split("\n").forEach(function(l){
      var m=l.match(/^(Drei|Sechs|Neun):\s*(.*)$/);
      if(m) rows.push({n:{Drei:3,Sechs:6,Neun:9}[m[1]],t:m[2]});
      else if(!/^Kurz:$/.test(l)) rest.push(l);
    });
    var lab={3:"stehen",6:"tragen",9:"siegeln"};
    var head=rest.join("\n").replace(/\n+$/,"");
    return '<p class="words">'+h(head)+'</p><div class="z369v2">'+rows.map(function(x){
      return '<button type="button" class="zrow" data-max="'+x.n+'" data-c="0"><span class="zn">'+x.n+'×</span><span class="zt">'+h(x.t)+'</span><span class="zc">0/'+x.n+'</span><small>'+lab[x.n]+'</small></button>';
    }).join("")+'</div>';
  }
  function sealHtml(){
    var src="";
    try{
      var d=JSON.parse(localStorage.getItem("rr25_sigil")||"{}");
      var c=document.getElementById("sigilC");
      if(d.l && c) src=c.toDataURL("image/png");
    }catch(e){}
    return '<div class="seal">'+(src?'<img alt="" src="'+src+'">':'<span>✽</span>')+'</div>';
  }
  function step(){
    var r=cur.r, st=cur.steps[cur.i], last=cur.i===cur.steps.length-1;
    var t=fillT(st[0]), raw=st[1];
    var n=needs(), inputs="";
    if(cur.i===0 && n.length){
      inputs=n.map(function(k){
        var ph=k+((r.needOpt&&k==="Name")?" (optional)":"");
        if(k==="AuftragW" || (k==="Auftrag" && !ownAuf() && (cur.wesen||r.wesenSelf))){
          var aq="Was genau soll die Wesenheit tun? Ein Satz.";
          return '<label class="absLab wAuf">'+(k==="AuftragW"?"Auftrag der Wesenheit":"Auftrag")+'<input class="nm" data-n="'+k+'" placeholder="'+aq+'" aria-label="'+aq+'" value="'+h(cur.mem[k]||"")+'" autocomplete="off" maxlength="200"></label>';
        }
        return '<input class="nm" data-n="'+h(k)+'" placeholder="'+h(ph)+'" value="'+h(cur.mem[k]||"")+'" autocomplete="off" autocapitalize="words">';
      }).join("");
    }
    var body, title=t, nextTxt=last?"Weiter":"Weiter";
    if(/^369$/.test(st[0])){
      title="3 · 6 · 9";
      body=(cur.mem.Absicht?'<p class="meta absOnce">Absicht: '+h(cur.mem.Absicht)+'</p>':'')+counter(fillT(raw));
    }
    else if(/^So sei es$/.test(st[0])){ body=sealHtml()+(cur.mem.Absicht?'<p class="meta absOnce">Absicht: '+h(cur.mem.Absicht)+'</p>':'')+'<p class="words">'+h(fillT(raw))+'</p>'; nextTxt="So sei es"; }
    else if(/^Rückkehr$/.test(st[0])){ body='<p class="words">'+h(fillT(raw))+'</p><label class="gchk rk"><input type="checkbox" id="rkOk"><span>Ich bin zurück. Ganz bei mir.</span></label>'; }
    else if(/^Ein Satz$/.test(st[0])){
      body='<p class="words" id="w0">'+h(fillT(raw))+'</p>'+
        '<label class="absLab">Ein Satz<input class="nm" id="echoSatz" data-n="Echo" placeholder="Was sich gezeigt hat" value="'+h(cur.mem.Echo||'')+'" autocomplete="off" maxlength="200"></label>';
    }
    else if(/^Absicht$/.test(st[0])){
      if(!cur.mem.Absicht){ var sg=sigilAbsicht(); if(sg) cur.mem.Absicht=sg; }
      body='<p class="words" id="w0">'+h(fillT(raw))+'</p>'+
        '<label class="absLab">Absicht · einmal<input class="nm" id="absT" data-n="Absicht" placeholder="Ein Satz" value="'+h(cur.mem.Absicht||'')+'" autocomplete="off" maxlength="200"></label>'+
        (sigilAbsicht()?'<button type="button" class="btn ghost" id="absFromZ">Von Zeichen übernehmen</button>':'');
    }
    else body='<p class="words" id="w0">'+h(fillT(raw))+'</p>';
    if(cur.i===0 && r.skipTiming) inputs=ctxHtml()+inputs;
    frame({title:h(title),body:inputs+body,prev:"Zurück",next:nextTxt,n:(cur.i+1)+"/"+cur.steps.length,stepName:t});
    [].slice.call(document.querySelectorAll("#run .nm")).forEach(function(inp){
      inp.oninput=function(){
        cur.mem[inp.getAttribute("data-n")]=inp.value.trim();
        var w=document.getElementById("w0"); if(w) w.innerHTML=h(fillT(raw));
      };
    });
    var az=document.getElementById("absFromZ");
    if(az) az.onclick=function(){ var v=sigilAbsicht(); if(!v) return; cur.mem.Absicht=v; var i=document.getElementById("absT"); if(i) i.value=v; };
    [].slice.call(document.querySelectorAll("#run .zrow")).forEach(function(b){
      b.onclick=function(){
        var c=+b.getAttribute("data-c"), m=+b.getAttribute("data-max");
        c=c>=m?0:c+1; b.setAttribute("data-c",c); b.classList.toggle("full",c>=m);
        b.querySelector(".zc").textContent=c+"/"+m;
        if(navigator.vibrate) try{ navigator.vibrate(c>=m?60:15); }catch(e){}
      };
    });
    document.getElementById("prev").onclick=function(){
      if(cur.i>0){ cur.i--; step(); return; }
      if(r.haerte && cur.lvl) haerte(); else if(r.hard && !r.wesenSelf) wesenQ(); else if(!r.skipTiming) tor(); else show("home");
    };
    document.getElementById("next").onclick=function(){
      if(cur.i===0){
        var miss=needs().filter(function(k){ return !(r.needOpt&&k==="Name") && !cur.mem[k]; });
        if(miss.length){ msg(miss.map(function(k){ return NEED_LAB[k]||k; }).join(", ")+" fehlt."); return; }
      }
      if(/^Rückkehr$/.test(st[0])){
        var ok=document.getElementById("rkOk");
        if(!ok||!ok.checked){ msg("Erst zurückkehren."); return; }
        cur.back=true;
      }
      if(!last){ cur.i++; step(); return; }
      if(r.noStatus){ if(r.echoRead) finish((cur.mem.Echo||"").trim(),false); else echo(); } else status();
    };
  }
  function status(){
    var body='<p class="words">Optional, einmal. Feststellung statt Bitte. Nie Ersatz für So sei es.</p>'+
      '<div class="row"><button type="button" class="btn ghost" id="stSet">Es ist so</button></div>';
    frame({title:"Status",body:body,next:"Weiter",noAbort:true});
    document.getElementById("stSet").onclick=function(){
      if(cur.status) return;
      cur.status=true; this.textContent="Es ist so. Gesetzt."; this.disabled=true;
    };
    document.getElementById("next").onclick=echo;
  }
  function echo(){
    var w=wetter();
    if(cur.r.anker||cur.r.neutral){
      frame({title:"Status kurz",body:'<p class="words">Ein Satz: Wie bin ich jetzt da?\nDann Buch zu. Heute nichts mehr.</p><input id="echoT" class="nm" placeholder="Status · ein Satz für die Chronik" autocomplete="off" maxlength="160">',next:"In die Chronik",noAbort:true});
      document.getElementById("next").onclick=function(){ finish(((document.getElementById("echoT")||{}).value||"").trim(),false); };
      return;
    }
    var body='<p class="words">Was klingt nach? Ein Satz genügt.\nNicht nachladen.'+(w.kind==="ECHO"?"\nHeute ist Echo: nur schauen.":"")+'</p>'+
      '<textarea id="echoT" placeholder="Echo · Notiz für die Chronik (optional)"></textarea>';
    frame({title:"Echo",body:body,next:"In die Chronik",noAbort:true});
    document.getElementById("next").onclick=function(){
      var note=((document.getElementById("echoT")||{}).value||"").trim();
      finish(note,false);
    };
  }
  function werTxt(){ var m=cur.mem; return [m.Name,m.A,m.B].filter(Boolean).join(" · "); }
  function finish(note,aborted){
    var r=cur.r, d=load();
    var titel=r.t+(cur.lvl?" · "+LV[cur.lvl]:"")+(aborted?" · abgebrochen":"");
    var e={id:uid(),t:now(),titel:titel,wer:werTxt(),wesen:!!(cur.wesen||r.wesenSelf)};
    if(note) e.note=note;
    if(cur.mem.Absicht) e.absicht=cur.mem.Absicht;
    d.log=d.log||[]; d.log.unshift(e);
    if(!aborted && fromPlan){ d.planned=(d.planned||[]).filter(function(p){ return p.pid!==fromPlan; }); fromPlan=null; }
    save(d);
    if(r.id==="dank" && !aborted){ try{ localStorage.setItem("rr25_dank", ymd()); }catch(x){} }
    window._rid=r.id;
    window._rr25Absicht=cur.mem.Absicht||"";
    window._rr25Hard=!!(r.hard && !aborted);
    window._rr25Wesen=!!((cur.wesen||r.wesenSelf) && !aborted);
    var done=cur; cur=null;
    if(aborted) show("home"); else show("after");
  }
  function abortScreen(where){
    var r=cur.r, lines=[];
    if(cur.started){
      if(cur.mem.Name && (r.ich||r.ichHart||r.need)) lines.push("Ich bin nicht [Name].");
      if(cur.mem.A) lines.push("Ich bin nicht [A]. Ich bin nicht [B].");
      if(cur.wesen||r.wesenSelf) lines.push("Wesenheit: Danke. Du bist frei. Löse alle Verbindungen. Ich schliesse den Kontakt.");
    }
    var body='<p class="words">'+h(fillT(ABBR_TXT+(lines.length?"\n\n"+lines.join("\n"):"")))+'\n\nFüsse. Atem. Raum.</p>'+
      '<label class="gchk rk"><input type="checkbox" id="abOk"><span>Ich bin zurück.</span></label>';
    var prevI=cur.i;
    frame({title:"Abbruch",body:body,prev:"Weiter im Ritual",next:"Schliessen",noAbort:true});
    document.getElementById("run").setAttribute("data-tone","neutral");
    document.getElementById("prev").onclick=function(){ if(cur.started){ cur.i=prevI; step(); } else openV2(r.id,cur.wer); };
    document.getElementById("next").onclick=function(){
      if(!document.getElementById("abOk").checked){ msg("Erst zurückkehren."); return; }
      finish("abgebrochen bei: "+where, true);
    };
  }

  function openV2(id,wer,ctx){
    var r=byId(id); if(!r) return;
    var mem={};
    if(wer){ mem.Name=wer; var p=String(wer).split(/\s*·\s*/); mem.A=p[0]||wer; mem.B=p[1]||""; }
    cur={r:r,mem:mem,wer:wer||"",i:0,lvl:null,wesen:false,steps:[],started:false,ctx:ctx||null};
    window._rid=r.id;
    show("run");
    if(r.hard) diagnose();
    else if(r.skipTiming) startSteps();
    else tor();
  }
  openR=openV2;
  window.RR25_OPEN=function(id,ctx){ try{ fromPlan=null; }catch(e){} openV2(id,"",ctx); };

  renderList=function(){
    var cats=document.getElementById("cats"), list=document.getElementById("list");
    if(!cats||!list) return;
    if(!cat || CATS.indexOf(cat)<0) cat="";
    cats.innerHTML=CATS.map(function(x){ return '<button type="button" class="chip'+(x===cat?" on":"")+'" data-cat="'+x+'">'+x+'</button>'; }).join("");
    [].slice.call(cats.querySelectorAll("[data-cat]")).forEach(function(b){
      b.onclick=function(){ cat=(cat===b.getAttribute("data-cat"))?"":b.getAttribute("data-cat"); renderList(); };
    });
    if(!cat){ list.innerHTML=""; pinDank(); return; }
    var items=R.filter(function(r){ return r.cat===cat; });
    list.innerHTML=items.map(function(r){
      return '<button type="button" class="card rcard tone-'+(r.tone||"soft")+'" data-id="'+r.id+'"><b>'+h(r.t)+'</b><small>'+h(r.s)+'</small><i>'+(TONE_NAME[r.tone]||"")+'</i></button>';
    }).join("")||"<p class='meta'>Nichts in dieser Reihe.</p>";
    [].slice.call(list.querySelectorAll("[data-id]")).forEach(function(b){
      b.onclick=function(){ fromPlan=null; openR(b.getAttribute("data-id")); };
    });
    pinDank();
  };

  function pinDank(){
    var home=document.getElementById("home"); if(!home) return;
    var el=document.getElementById("pinDank");
    if(!el){
      el=document.createElement("button");
      el.type="button"; el.id="pinDank"; el.className="card tone-soft";
      el.innerHTML="<b>Tägliches Dankesritual</b><small>Gesundheit und Glück · Liebe · Geld · Schutz</small><span class=\"ok\"></span>";
      el.onclick=function(){ fromPlan=null; openR("dank"); };
      var kast=document.getElementById("kasten"), cats=document.getElementById("cats");
      if(cats) home.insertBefore(el, cats); else home.appendChild(el);
    }
    var on=false; try{ on=localStorage.getItem("rr25_dank")===ymd(); }catch(e){}
    el.classList.toggle("done",on);
    el.querySelector(".ok").textContent=on?"\u2713":"";
  }

  var sh=show;
  show=function(id){
    var r=sh.apply(this,arguments);
    if(id==="after"){
      var g=document.getElementById("afterGo");
      if(g){ g.textContent="Fertig"; g.onclick=function(){ show("home"); }; }
      var af=document.getElementById("after"), old=document.getElementById("afterAnker");
      if(old) old.remove();
      if(af && window._rr25Hard){
        var st=KZ?KZ.state():null, a=st&&st.anker&&st.anker.e>Date.now()?st.anker:null;
        var p=document.createElement("p"); p.id="afterAnker"; p.className="ankerHint";
        p.innerHTML='<a href="#anker">'+(a?"Heute "+hm(a.s)+" Rückkehr · Anker":"Rückkehr · Anker")+'</a>';
        p.querySelector("a").onclick=function(ev){ ev.preventDefault(); window.RR25_OPEN("anker",a?{title:a.t,s:a.s,e:a.e,kind:a.k}:null); };
        af.appendChild(p);
      }
      var oldE=document.getElementById("afterEcho"); if(oldE) oldE.remove();
      if(af && window._rr25Wesen){
        var pe=document.createElement("p"); pe.id="afterEcho"; pe.className="ankerHint";
        pe.innerHTML='<a href="#echo">Danach: Echo lesen · nur beobachten</a>';
        pe.querySelector("a").onclick=function(ev){ ev.preventDefault(); if(window.RR25_OPEN) window.RR25_OPEN("echo"); };
        af.appendChild(pe);
      }
    }
    if(id==="home") pinDank();
    return r;
  };

  var css=document.createElement("style");
  css.textContent=[
    "#run{--tone:#5fe0a0}",
    "#run[data-tone=hard]{--tone:#ff5470}#run[data-tone=grenze]{--tone:#ffb86b}#run[data-tone=feld]{--tone:#b98cff}#run[data-tone=neutral]{--tone:#9a96a8}",
    "#run .tonetag{margin:.2rem 0 0;font-size:.62rem;letter-spacing:.2em;text-transform:uppercase;color:var(--tone)}",
    "#run .hero h2{border-left:3px solid var(--tone);padding-left:.55rem}",
    "#run .gchk{display:flex!important;gap:.6rem;align-items:flex-start;margin:.55rem 0;padding:.65rem .7rem;border:1px solid rgba(126,200,255,.2);border-radius:.9rem;background:rgba(20,10,34,.7);font-size:.92rem}",
    "#run .gchk input{width:1.25rem;height:1.25rem;margin:.1rem 0 0;flex:none;accent-color:#ff7ad9}",
    "#run .gchk small{color:#c4b4e0;font-size:.78rem}",
    "#run .abortBtn{flex:none;margin:0 auto;background:transparent;border:1px solid rgba(154,150,168,.45);color:#b8b3c6;font-weight:500;padding:.4rem 1.2rem;min-height:2rem}",
    "#run .wetter{margin:.3rem 0 .6rem;padding:.6rem .75rem;border-radius:.9rem;background:rgba(20,10,34,.7);border:1px solid rgba(126,200,255,.18);font-size:.86rem;line-height:1.5}",
    "#run .wk{font-size:.66rem;letter-spacing:.16em;text-transform:uppercase;font-weight:650}",
    ".wk-soft{color:#5fe0a0}.wk-hard{color:#ff5470}.wk-echo{color:#c99bff}.wk-still{color:#b8b3c6}",
    "#run .lv,#run .wq{display:block}",
    "#run .card.wq[data-w='0']{border-left:3px solid #5fe0a0}#run .card.wq[data-w='1']{border-left:3px solid #ff5470}",
    "#run .card.wq.sel{border-color:rgba(232,160,255,.85);box-shadow:0 0 0 1px rgba(232,160,255,.55),0 0 18px rgba(201,155,255,.28)}#run .card.wq.sel[data-w='0']{border-left-color:#5fe0a0}#run .card.wq.sel[data-w='1']{border-left-color:#ff5470}",
    "#run .wq .wqPlus{display:block;margin-top:.35rem;color:#ff8aa0;font-size:.74rem}",
    "#run .wqInfo{font-size:.92rem}#run .card.wq~.v3push{margin-top:1.2rem!important}",
    "#run .wAuf{display:block}",
    "#run .card.lv[data-lv=weich]{border-left:3px solid #5fe0a0}#run .card.lv[data-lv=mittel]{border-left:3px solid #ffb86b}#run .card.lv[data-lv=nagel]{border-left:3px solid #ff5470}",
    ".z369v2{display:grid;gap:.4rem;margin:.6rem 0}",
    ".z369v2 .zrow{display:grid;grid-template-columns:2.4rem 1fr auto;grid-template-rows:auto auto;column-gap:.5rem;align-items:center;text-align:left;border:1px solid rgba(232,160,255,.25);background:rgba(28,12,44,.8);color:#f6f0ff;border-radius:.95rem;padding:.6rem .7rem;font:inherit}",
    ".z369v2 .zn{grid-row:1/3;font-family:Georgia,serif;font-size:1.3rem;color:#ff7ad9}",
    ".z369v2 .zt{font-family:Georgia,serif;font-size:1rem}",
    ".z369v2 .zc{font-size:.8rem;color:#c4b4e0}",
    ".z369v2 small{grid-column:2/4;font-size:.62rem;letter-spacing:.16em;text-transform:uppercase;color:#8e7aa8}",
    ".z369v2 .zrow.full{border-color:#ff7ad9;box-shadow:0 0 14px rgba(255,122,217,.35)}",
    "#run .seal{display:flex;justify-content:center;margin:.4rem 0 .6rem}",
    "#run .seal img{width:7.5rem;height:7.5rem;border-radius:1rem;border:1px solid rgba(255,122,217,.4);background:#08040e}",
    "#run .seal span{font-size:4rem;line-height:1;color:#ff7ad9;text-shadow:0 0 18px rgba(255,122,217,.7)}",
    "#run .tor3 .btn{min-height:2.8rem}",
    "#run .nm{text-transform:none!important;letter-spacing:normal!important}",
    "#run .ctxLine{margin:.2rem 0 .5rem;padding:.5rem .7rem;border-radius:.8rem;background:rgba(20,10,34,.55);border:1px dashed rgba(126,200,255,.22);font-size:.82rem;line-height:1.45}",
    ".ankerHint{margin:.9rem 0 0;text-align:center;font-size:.8rem}.ankerHint a{color:#cdb6ff;text-decoration:none;border-bottom:1px dotted rgba(205,182,255,.6)}",
    "#list .rcard{position:relative;border-left:3px solid #5fe0a0;padding-right:3.6rem}",
    "#list .rcard.tone-hard{border-left-color:#ff5470}#list .rcard.tone-grenze{border-left-color:#ffb86b}#list .rcard.tone-feld{border-left-color:#b98cff}#list .rcard.tone-neutral{border-left-color:#9a96a8}",
    "#list .rcard i{position:absolute;right:.8rem;top:.8rem;font-style:normal;font-size:.58rem;letter-spacing:.16em;text-transform:uppercase;color:#5fe0a0}",
    "#list .rcard.tone-hard i{color:#ff5470}#list .rcard.tone-grenze i{color:#ffb86b}#list .rcard.tone-feld i{color:#b98cff}#list .rcard.tone-neutral i{color:#9a96a8}",
    "#run .absLab{display:block;margin:.55rem 0 .2rem;font-size:.72rem;color:#c4b4e0}#run .absLab .nm{margin-top:.3rem}#run .absOnce{color:#e7c9ff!important;margin:.2rem 0 .45rem}#run #absFromZ{margin:.2rem 0 .4rem;min-height:2rem;font-size:.74rem}",
    "#run .fenLine{color:#bfb2da!important}",
    "#pinDank{position:relative;padding-right:3.1rem}",
    "#pinDank .ok{position:absolute;right:.85rem;top:50%;transform:translateY(-50%);width:1.55rem;height:1.55rem;border-radius:50%;border:2px solid rgba(255,122,217,.45);display:flex;align-items:center;justify-content:center}",
    "#pinDank.done .ok{background:linear-gradient(165deg,#ff7ad9,#7ef0e6);border:0;color:#14081c;font-weight:700}"
  ].join("");
  document.head.appendChild(css);
  try{ cat=""; }catch(e){}
  renderList();
  loadKal();
})();

}catch(e){setTimeout(function(){throw e;});}
/* ==== ritual-karten.js ==== */
try{
/* rr25 · Karten: ein Stapel für die Heute-Kachel, «Karte» (ziehen) und «Drei» (Legung).
   k: soft | feld | echo | hard · m: Mondphasen, zu denen die Karte besonders passt (neu, zu, voll, ab).
   Heute-Karte: pro Tag stabil, ohne Wiederholung, bis der Stapel durch ist (feste Reihenfolge aus dem Datum,
   sanft nach Mondphase gewichtet). Kein Speicher nötig: Die Reihenfolge wird aus dem Datum berechnet. */
(function(){
  var DECK=[
    {"id":"s01","k":"soft","t":"Morgendank","z":"☼","x":"Bevor das Telefon dran ist: drei Dinge nennen, für die du dankbar bist. Laut, nicht im Kopf. So beginnt der Tag bei dir."},
    {"id":"s02","k":"soft","t":"Wasserglas","z":"◡","x":"Ein Glas Wasser mit beiden Händen halten und einen guten Satz hineinsprechen. Dann langsam trinken. Was du trinkst, trägst du."},
    {"id":"s03","k":"soft","t":"Schwelle","z":"⊓","x":"Beim Heimkommen einen Moment an der Tür stehen bleiben. Der Tag draussen bleibt draussen. Erst dann die Schuhe aus."},
    {"id":"s04","k":"soft","t":"Venus","z":"♀\uFE0E","x":"Zeig heute, was du magst: ein Wort, ein Blick, eine kleine Aufmerksamkeit. Venus wirkt über Wärme, nie über Druck.","m":["zu","voll"]},
    {"id":"s05","k":"soft","t":"Stiller Segen","z":"✥","x":"Einem Menschen still Gutes wünschen, ohne es ihm zu sagen. Ein Satz genügt. Dann weitergehen und nicht zurückschauen."},
    {"id":"s06","k":"soft","t":"Schutzmantel","z":"⛨","x":"Spür, wie sich dein Feld eine Armlänge um dich schliesst. Was nicht zu dir gehört, gleitet ab. Einmal am Morgen reicht."},
    {"id":"s07","k":"soft","t":"Salz an der Tür","z":"⊡","x":"Eine Prise Salz auf die Schwelle. So weiss das Haus, wo es anfängt. Am nächsten Morgen wegwischen.","m":["ab"]},
    {"id":"s08","k":"soft","t":"Kerze","z":"✧","x":"Eine Kerze anzünden und nichts wollen. Nur schauen, bis der Atem ruhig wird. Auch das Auspusten ist ein Abschluss."},
    {"id":"s09","k":"soft","t":"Erster Bissen","z":"◒","x":"Den ersten Bissen heute bewusst nehmen und kurz danken, auch den Händen, die es gemacht haben. Fülle beginnt am Tisch."},
    {"id":"s10","k":"soft","t":"Geld ordnen","z":"⊚","x":"Das Portemonnaie aufräumen, die Scheine ordnen, einmal zählen. Ohne Sorge, nur wissen. Was geachtet wird, bleibt gern.","m":["zu"]},
    {"id":"s11","k":"soft","t":"Offene Hand","z":"☌","x":"Heute etwas geben, das nichts kostet: Zeit, ein Lob, den Vortritt. Eine Hand, die gibt, bleibt offen für das, was kommt."},
    {"id":"s12","k":"soft","t":"Barfuss","z":"▽","x":"Fünf Minuten barfuss stehen, auf Holz, Wiese oder Stein. Spüren, wo das Gewicht liegt. Erdung ist Fusssohle, kein Bild."},
    {"id":"s13","k":"soft","t":"Vier Atemzüge","z":"○","x":"Vier Takte ein, vier halten, vier aus. Das dreimal. Erst danach antworten oder entscheiden."},
    {"id":"s14","k":"soft","t":"Eine Schublade","z":"▦","x":"Eine Schublade, eine Ecke, ein Tisch: nur eins davon aufräumen, aber ganz. Wo Ordnung ist, fliesst es leichter."},
    {"id":"s15","k":"soft","t":"Schlafsegen","z":"☾","x":"Vor dem Einschlafen: Danke für heute. Was war, darf ruhen. Leg den Tag ab, bevor du das Licht löschst."},
    {"id":"s16","k":"soft","t":"Körper fragen","z":"☤","x":"Frag den Körper, was er braucht, und nimm die erste Antwort: trinken, gehen, ruhen. Der Arzt bleibt dabei."},
    {"id":"s17","k":"soft","t":"Freier Stuhl","z":"❀","x":"Liebe lädt man ein, man holt sie nicht. Mach Platz: ein freier Abend, ein offenes Ohr. Wer kommt, kommt freiwillig.","m":["neu","zu"]},
    {"id":"s18","k":"soft","t":"Eine Nachricht","z":"☍","x":"Schreib einem Menschen, der dir guttut. Ohne Anliegen, einfach so. Nähe wächst durch Kontakt, nicht durch Grübeln."},
    {"id":"s19","k":"soft","t":"Laut sprechen","z":"❝","x":"Sprich deinen Satz heute einmal in normaler Stimme. Nicht geflüstert, nicht gerufen. Was gesprochen ist, steht im Raum."},
    {"id":"s20","k":"soft","t":"Lüften","z":"☴","x":"Fenster auf, zehn Minuten. Alte Luft und alte Stimmung gehen zusammen hinaus. Danach tief einatmen: Das hier ist jetzt.","m":["ab"]},
    {"id":"s21","k":"soft","t":"Licht tanken","z":"☉","x":"Einmal heute ins Licht treten, Gesicht nach oben, drei Atemzüge. Kraft kommt nicht nur von innen."},
    {"id":"s22","k":"soft","t":"Zwei Minuten","z":"✲","x":"Das, was du aufschiebst: zwei Minuten davon, jetzt gleich. Nicht fertig machen, nur beginnen. Der Rest geht dann leichter.","m":["neu"]},
    {"id":"s23","k":"soft","t":"Freundliches Nein","z":"⬡","x":"Ein ruhiges Nein ist auch Schutz. Kurz, freundlich, ohne lange Begründung. Wer dich achtet, versteht es."},
    {"id":"s24","k":"soft","t":"Wie ein Freund","z":"♡","x":"Sei heute mit dir so geduldig wie mit einem guten Freund. Ein Fehler ist ein Schritt, kein Urteil."},
    {"id":"s25","k":"soft","t":"Fülle zählen","z":"✺","x":"Schreib auf, was schon da ist: Dach, Essen, Menschen, gesunde Hände. Fülle wächst, wenn du sie zählst, nicht wenn du sie jagst.","m":["voll"]},
    {"id":"s26","k":"soft","t":"Gute Fahrt","z":"⇝","x":"Vor dem Losfahren die Hand kurz aufs Lenkrad legen: Ich komme gut an. Dann fahren und nicht mehr daran denken."},
    {"id":"s27","k":"soft","t":"Haussegen","z":"⌂","x":"Geh durch jedes Zimmer und sag dort: Hier wohnt Frieden. Zuletzt an der Wohnungstür. Das Haus hört mit."},
    {"id":"s28","k":"soft","t":"Ein Lied","z":"♪","x":"Ein Lied, das dich aufrichtet, ganz hören. Nichts nebenher tun. Klang ist auch Arbeit, nur leichter."},
    {"id":"s29","k":"soft","t":"Zeigerpflanze","z":"✿","x":"Eine Pflanze giessen und ihr sagen, was bei dir wachsen soll. Nur diese eine. Sie wird dein Zeiger.","m":["zu"]},
    {"id":"s30","k":"soft","t":"Warme Hände","z":"❂","x":"Reib die Hände warm und leg sie dorthin, wo es zieht oder schmerzt. Eine Minute, ruhig atmen. Wärme ist die älteste Heilung."},
    {"id":"s31","k":"soft","t":"Bei dir bleiben","z":"⊕","x":"Zieht dich jemand in seine Geschichte, tritt innerlich einen Schritt zurück. Zuhören ja, mittragen nein."},
    {"id":"s32","k":"soft","t":"Nur zur Freude","z":"✶","x":"Tu heute eine Sache nur, weil sie dir Freude macht. Ohne Nutzen, ohne Plan. Freude hält das Feld weit."},
    {"id":"s33","k":"soft","t":"Gern gesehen","z":"❦","x":"Zieh heute etwas an, in dem du dich gern siehst. Wer sich selbst mag, strahlt es aus. Das ist schon Anziehung.","m":["zu","voll"]},
    {"id":"s34","k":"soft","t":"Still versöhnen","z":"∽","x":"Ein offener Streit? Du musst nicht anrufen. Wünsch dem anderen still das Gute. Für heute ist das genug."},
    {"id":"s35","k":"soft","t":"Stille Minuten","z":"▢","x":"Zehn Minuten ohne Bildschirm, Musik und Gespräch. Nur sitzen. In der Stille hörst du, was wirklich ansteht."},
    {"id":"s36","k":"soft","t":"Ernte aufschreiben","z":"❁","x":"Was hat sich seit dem letzten Vollmond gefügt? Schreib es auf, auch das Kleine. Ernte, die man nicht zählt, vergisst man.","m":["voll"]},
    {"id":"s37","k":"soft","t":"Samen im Dunkeln","z":"✱","x":"Ein neuer Wunsch, ein Satz, auf Papier. In eine Schublade legen und nicht täglich nachsehen. Samen keimen im Dunkeln.","m":["neu"]},
    {"id":"s38","k":"soft","t":"Weglassen","z":"◐","x":"Eine Gewohnheit, die dich Kraft kostet, heute einfach weglassen. Nur heute. Der abnehmende Mond nimmt sie gern mit.","m":["ab"]},
    {"id":"s39","k":"soft","t":"Kreis ziehen","z":"◎","x":"Mit dem Finger einen Kreis um dich zeichnen, im Uhrzeigersinn. Drinnen bist du, draussen der Lärm. Fünf Sekunden genügen."},
    {"id":"s40","k":"soft","t":"Gute Ahnen","z":"☥","x":"Denk an einen Menschen aus deiner Linie, der es gut mit dir meinte. Sag Danke. Seine Kraft darf helfen, seine Last bleibt bei ihm."},
    {"id":"s41","k":"soft","t":"Draussen gehen","z":"⚘","x":"Geh ein Stück ohne Ziel und schau, was blüht, was fällt, was ruht. Die Natur zeigt dir, welche Zeit gerade ist."},
    {"id":"s42","k":"soft","t":"Kleines Geschenk","z":"❖","x":"Bring heute jemandem eine Kleinigkeit mit: Kaffee, eine Blume, Schokolade. Venus liebt das Unerwartete.","m":["zu"]},
    {"id":"s43","k":"soft","t":"Aufrecht","z":"⇑","x":"Steh einen Moment ganz aufrecht, Scheitel zum Himmel, Füsse in den Boden. So sieht Vertrauen von aussen aus. Innen folgt es nach."},
    {"id":"s44","k":"soft","t":"Abenddank","z":"☆","x":"Am Abend einen Menschen nennen, der dir heute gutgetan hat. Vielleicht weiss er es nicht. Du darfst es ihm morgen sagen."},
    {"id":"s45","k":"soft","t":"Geld segnen","z":"✤","x":"Beim Bezahlen still sagen: Geh gut und komm vermehrt zurück. Geld fliesst lieber, wo es nicht festgehalten wird.","m":["zu"]},
    {"id":"s46","k":"soft","t":"Salzbad","z":"≋","x":"Abends eine Handvoll Salz ins Badewasser oder ins Fussbad. Was fremd war, fliesst ab. Danach ein Glas frisches Wasser.","m":["ab"]},
    {"id":"s47","k":"soft","t":"Freundlicher Blick","z":"❃","x":"Schau heute jemandem freundlich in die Augen, einen Moment länger als sonst. Ohne Absicht. Wärme spricht sich herum."},
    {"id":"s48","k":"soft","t":"Teepause","z":"∪","x":"Einen Tee kochen und ihn ohne Telefon trinken. Die Wärme in den Händen spüren. Kleine Pausen sind auch Schutz."},
    {"id":"s49","k":"soft","t":"Früh schlafen","z":"☽","x":"Heute eine halbe Stunde früher ins Bett. Der Körper arbeitet nachts für dich. Ausgeschlafen trägst du alles leichter.","m":["ab"]},
    {"id":"s50","k":"soft","t":"Stein in der Tasche","z":"⬢","x":"Einen kleinen Stein morgens bewusst einstecken. Wenn du ihn in der Tasche spürst, bist du wieder bei dir."},
    {"id":"s51","k":"soft","t":"Lachen","z":"❉","x":"Such dir heute einen Grund zu lachen, notfalls einen alten Film. Lachen löst, was Grübeln festhält."},
    {"id":"s52","k":"soft","t":"Um Hilfe bitten","z":"⋈","x":"Bitte heute jemanden um einen kleinen Gefallen. Nehmen gehört zum Fluss wie Geben. Wer nur gibt, staut."},
    {"id":"s53","k":"soft","t":"Namen segnen","z":"✾","x":"Sprich den Namen eines geliebten Menschen und häng einen Segen daran: Geh behütet. Mehr braucht es nicht."},
    {"id":"s54","k":"soft","t":"Schöner Tisch","z":"❧","x":"Deck heute den Tisch schön, auch wenn du allein isst. Eine Kerze, ein richtiger Teller. Du bist es wert.","m":["zu","voll"]},
    {"id":"f01","k":"feld","t":"Ein Satz","z":"✦","x":"Deine Absicht: ein Satz, in der Gegenwart, ohne »nicht«. Wenn du ihn nicht in einem Atemzug sagen kannst, ist er zu lang."},
    {"id":"f02","k":"feld","t":"Enter","z":"▷","x":"Enter ist der Moment, in dem du aufhörst zu planen und setzt. Ein Atemzug, ein innerer Klick. Ab da gilt es."},
    {"id":"f03","k":"feld","t":"Drei stehen","z":"∴","x":"Die ersten drei stellen den Satz auf. Langsam sprechen, jedes Wort mit Gewicht. Wer hier hetzt, baut auf Sand."},
    {"id":"f04","k":"feld","t":"Sechs tragen","z":"☷","x":"Die sechs tragen den Satz durch dich hindurch. Nicht mehr nachdenken, nur sprechen. Der Körper lernt mit."},
    {"id":"f05","k":"feld","t":"Neun siegeln","z":"⁂","x":"Mit der neunten Wiederholung ist der Satz aus deinen Händen. Kein zehntes Mal. Das Siegel hält von selbst."},
    {"id":"f06","k":"feld","t":"Der Beobachter","z":"◉","x":"Die Neun ist der, der zuschaut. Du sprichst, und ein Teil von dir sieht ruhig zu. Dieser Teil setzt nie nach."},
    {"id":"f07","k":"feld","t":"So sei es","z":"⊙","x":"Drei Worte, danach nichts mehr. Kein Nachsatz, kein Vielleicht. Das Feld braucht einen klaren Schluss."},
    {"id":"f08","k":"feld","t":"Es ist so","z":"≡","x":"Nicht »es wird«, sondern »es ist«. Wer in der Zukunft spricht, hält den Wunsch auf Abstand."},
    {"id":"f09","k":"feld","t":"Rückkehr","z":"↩\uFE0E","x":"Die Rückkehr ist der Riegel: Energie zurück zu dir, Hände waschen, etwas essen. Ohne sie bleibt eine Tür offen."},
    {"id":"f10","k":"feld","t":"Name und Datum","z":"▣","x":"Nach jeder Arbeit laut sagen: deinen Namen, das Datum, den Ort. Du bist hier, heute, ganz du. Damit ist zu."},
    {"id":"f11","k":"feld","t":"Nicht nachsetzen","z":"⊘","x":"Sprich den Satz nicht noch einmal, nur weil Zweifel kommt. Zweifel ist Wetter, keine Nachricht."},
    {"id":"f12","k":"feld","t":"Timing","z":"◔","x":"Nicht jede Stunde trägt gleich. Morgens setzen, abends danken, nachts ruhen. Wer den Moment wählt, braucht weniger Kraft."},
    {"id":"f13","k":"feld","t":"Brief einwerfen","z":"⇥","x":"Übergib den Auftrag wie einen Brief: einwerfen, loslassen, weitergehen. Niemand holt einen Brief zurück, um ihn nachzulesen."},
    {"id":"f14","k":"feld","t":"Einer zur Zeit","z":"Ⅰ","x":"Heute nur eine Arbeit. Zwei Wünsche in einem Ritual schwächen beide. Wähl den, der jetzt am meisten zählt."},
    {"id":"f15","k":"feld","t":"Stiller Tag","z":"◌","x":"Manche Tage sind zum Setzen da, andere zum Ruhen. Heute darf leer bleiben. Leere sammelt Kraft."},
    {"id":"f16","k":"feld","t":"Der Spieler","z":"♙","x":"Du bist der Spieler, nicht die Figur. Wird es eng, tritt heraus und schau aufs Brett. Von oben ist der nächste Zug klar."},
    {"id":"f17","k":"feld","t":"Der Schritt danach","z":"➶","x":"Nach dem Ritual einen kleinen Schritt im Alltag tun, der zum Satz passt. Das Feld öffnet die Tür, gehen musst du selbst."},
    {"id":"f18","k":"feld","t":"Ofen zu","z":"▯","x":"Was du gesetzt hast, braucht Zeit wie Brot im Ofen. Wer dauernd die Tür öffnet, lässt die Hitze hinaus."},
    {"id":"f19","k":"feld","t":"Neumond setzen","z":"●","x":"Neumond ist Aussaat. Absicht klar, Satz kurz, dann 3·6·9. Was jetzt gesetzt wird, wächst mit dem Licht.","m":["neu"]},
    {"id":"f20","k":"feld","t":"Vollmond ernten","z":"❍","x":"Vollmond ist Ernte, nicht Aussaat. Danken, zählen, abschliessen. Neues wartet auf den nächsten Neumond.","m":["voll"]},
    {"id":"e01","k":"echo","t":"Tag drei","z":"Ⅲ","x":"Am dritten Tag nur schauen: ein Anruf, ein Gefühl, ein Zufall? Aufschreiben, nicht deuten. Deuten kommt später."},
    {"id":"e02","k":"echo","t":"Tag neun","z":"Ⅸ","x":"Am neunten Tag die ehrliche Bilanz: wirkt, teilweise oder offen. Auch »offen« ist eine Antwort, mit der du arbeiten kannst."},
    {"id":"e03","k":"echo","t":"Eigene Augen","z":"◍","x":"Glaub nicht, was man dir erzählt, glaub, was du siehst. Notier heute ein Zeichen, das du selbst bemerkt hast."},
    {"id":"e04","k":"echo","t":"Leise Wirkung","z":"∿","x":"Wirkung kommt oft leise: besser geschlafen, weniger Streit, ein Weg wird frei. Achte heute auf das Kleine."},
    {"id":"e05","k":"echo","t":"Kein Echo","z":"◇","x":"Kam nichts zurück? Nicht lauter rufen. Prüf, ob der Satz klar war, und setz ihn beim nächsten passenden Mond neu."},
    {"id":"e06","k":"echo","t":"Chronik lesen","z":"▤","x":"Blättere in der Chronik zurück. Welche Arbeit hat bei dir am deutlichsten gewirkt? Dort liegt deine Stärke."},
    {"id":"e07","k":"echo","t":"Dazwischen","z":"∷","x":"Echo prüft man, man ruft es nicht herbei. Nur an Tag 3 und 9 hinschauen. Dazwischen einfach leben."},
    {"id":"e08","k":"echo","t":"Ein Satz ins Heft","z":"✎","x":"Schreib heute in einem Satz auf, wie es dir geht. In drei Wochen liest du nach und siehst, was sich wirklich verändert hat."},
    {"id":"e09","k":"echo","t":"Seitenweg","z":"↳","x":"Manchmal antwortet das Feld an anderer Stelle, als du gefragt hast. Schau auch daneben. Auch das ist Echo."},
    {"id":"e10","k":"echo","t":"Kreis schliessen","z":"↻","x":"Hat etwas gewirkt, dann einmal bewusst und laut danken. Dank schliesst den Kreis und macht den nächsten leichter.","m":["voll"]},
    {"id":"e11","k":"echo","t":"Vorher, nachher","z":"⇄","x":"Bevor du etwas setzt, schreib auf, wie es jetzt ist. Nur so erkennst du später, was sich bewegt hat."},
    {"id":"e12","k":"echo","t":"Muster erkennen","z":"※","x":"Wirkt es bei dir eher bei Neumond oder Vollmond, morgens oder abends? Die Chronik zeigt es dir nach ein paar Wochen."},
    {"id":"h01","k":"hard","t":"Feldgesetz","z":"⚖\uFE0E","x":"Jede harte Arbeit hat einen Preis, auch für dich. Frag vorher: gerecht, nötig, trage ich die Folgen? Drei Ja, sonst weich."},
    {"id":"h02","k":"hard","t":"Mit Mass","z":"⊞","x":"Hart heisst nicht masslos. Ein klarer Satz, eine Frist, ein Ende. Was ohne Mass gesetzt wird, kehrt ohne Mass zurück."},
    {"id":"h03","k":"hard","t":"Sauber schneiden","z":"⚔\uFE0E","x":"Vor dem Trennen genau benennen, was geht und was bleibt. Unscharf geschnitten wächst es wieder zusammen.","m":["ab"]},
    {"id":"h04","k":"hard","t":"Nicht im Zorn","z":"ϟ","x":"Wut ist Treibstoff, aber kein Steuer. Hartes nie am Tag des Streits. Eine Nacht schlafen, dann entscheiden."},
    {"id":"h05","k":"hard","t":"Zurück nach Hard","z":"↺","x":"Nach harter Arbeit: Salzwasser über die Hände, Name, Datum, etwas essen. Zurückkommen ist Pflicht, nicht Kür."},
    {"id":"h06","k":"hard","t":"Erst das eigene Feld","z":"△","x":"Bevor du nach aussen wirkst, schliess dein eigenes Feld. Wer offen wirkt, wird offen getroffen."},
    {"id":"h07","k":"hard","t":"Frist setzen","z":"⊠","x":"Harte Arbeit braucht ein Ablaufdatum, etwa bis zum nächsten Vollmond. Dann endet sie. Ohne Frist hängt sie an dir.","m":["voll"]},
    {"id":"h08","k":"hard","t":"Der Mond nimmt","z":"◑","x":"Abnehmender Mond trägt das Wegnehmen: Bänder lösen, Schaden stoppen. Gemessen, mit Gate und Rückkehr.","m":["ab"]},
    {"id":"h09","k":"hard","t":"Freier Wille","z":"☿","x":"Nichts über den freien Willen eines Menschen hinweg. Was nur mit Zwang hält, bricht und kommt zurück."},
    {"id":"h10","k":"hard","t":"Erst Diagnose","z":"◈","x":"Erst prüfen, dann handeln: Zieht es, steht es, ist es still? Wer ohne Diagnose hart arbeitet, trifft das Falsche."},
    {"id":"h11","k":"hard","t":"Gast mit Auftrag","z":"✵","x":"Eine Wesenheit bekommt Auftrag, Frist und Abschied. Danken und entlassen. Kein Gast bleibt über Nacht."},
    {"id":"h12","k":"hard","t":"Kurz und klar","z":"↯","x":"Hartes wirkt am besten kurz: hinein, setzen, heraus. Nicht darin verweilen und nicht nachsehen, ob es trifft."},
    {"id":"h13","k":"hard","t":"Wall statt Pfeil","z":"▥","x":"Läuft Schaden, zuerst stoppen, nicht strafen. Ein Wall, kein Pfeil. Meist reicht das schon."},
    {"id":"h14","k":"hard","t":"Keine Rache","z":"≠","x":"Ausgleich heisst: Was genommen wurde, kehrt zurück. Wie es den anderen trifft, ist nicht deine Sache."}
  ];
  var KIND={soft:"Soft",feld:"Feld",echo:"Echo",hard:"Hard"};
  var N=DECK.length, DAY=86400000;
  var A=new Date(2026,8,1,12).getTime();           /* Anker: 1. Sept. 2026, Mittag (sommerzeitfest) */

  function noon(ms){ var d=new Date(ms); return new Date(d.getFullYear(),d.getMonth(),d.getDate(),12).getTime(); }
  function dayIdx(ms){ return Math.round((noon(ms)-A)/DAY); }
  function dateOf(i){ return new Date(2026,8,1+i,12).getTime(); }
  function moonKey(ms){ try{ return window.RR25_MOND?window.RR25_MOND.day(ms).key:null; }catch(e){ return null; } }
  function rng(seed){ var a=seed>>>0; return function(){ a=(a+0x6D2B79F5)>>>0; var t=a; t=Math.imul(t^t>>>15,t|1); t^=t+Math.imul(t^t>>>7,t|61); return ((t^t>>>14)>>>0)/4294967296; }; }
  function weight(c,mk){ return (mk&&c.m&&c.m.indexOf(mk)>=0)?3:1; }
  function wpick(pool,mk,r){
    var sum=0,i; for(i=0;i<pool.length;i++) sum+=weight(pool[i],mk);
    var x=r()*sum; for(i=0;i<pool.length;i++){ x-=weight(pool[i],mk); if(x<0) return pool[i]; }
    return pool[pool.length-1];
  }

  /* Reihenfolge eines Durchgangs (N Tage): jede Karte genau einmal, Mondphase des Tages gewichtet.
     Auch über die Grenze zweier Durchgänge liegen mindestens N/3 Tage zwischen zwei gleichen Karten. */
  var cyc={};
  function cycle(c){
    if(cyc[c]) return cyc[c];
    var prev=null, G=Math.floor(N/3);
    if(c>0){ for(var k=Math.max(0,c-400);k<c;k++) cycle(k); prev=cyc[c-1]; }
    var r=rng(c*2654435761+0x2525), rest=DECK.slice(), out=[];
    for(var i=0;i<N;i++){
      var mk=moonKey(dateOf(c*N+i)), pool=rest;
      if(prev&&i<G){ /* Karten vom Ende des letzten Durchgangs frühestens nach G Tagen wieder */
        var late=prev.slice(N-G+i+1);
        var f=rest.filter(function(x){ return late.indexOf(x)<0; });
        if(f.length) pool=f;
      }
      var p=wpick(pool,mk,r); out.push(p); rest.splice(rest.indexOf(p),1);
    }
    return cyc[c]=out;
  }
  function todayCard(ms){
    var i=dayIdx(ms==null?Date.now():ms), c=Math.floor(i/N), pos=i-c*N;
    return cycle(c)[pos];
  }

  /* Ziehen und Legen: keine Doppelten in einer Legung, nie die Heute-Karte, kürzlich Gezogenes wird ausgelassen */
  var recent=[];
  function draw(n){
    var mk=moonKey(Date.now()), t=todayCard(), got=[];
    var avoid=recent.slice(-Math.floor(N/2));
    for(var j=0;j<n;j++){
      var pool=DECK.filter(function(c){ return c!==t && got.indexOf(c)<0 && avoid.indexOf(c)<0; });
      if(!pool.length) pool=DECK.filter(function(c){ return c!==t && got.indexOf(c)<0; });
      got.push(wpick(pool,mk,Math.random));
    }
    recent=recent.concat(got).slice(-N);
    return got;
  }

  function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;"); }
  function html(c,label){
    return '<div class="kcard ktone-'+c.k+'" data-kid="'+c.id+'"><span class="group">'+esc(label)+'</span><div class="kz">'+c.z+'</div><b>'+esc(c.t)+'</b><small>'+esc(c.x)+'</small></div>';
  }
  function go(id){
    document.querySelectorAll(".screen").forEach(function(s){ s.classList.toggle("on", s.id===id); });
    document.querySelectorAll("nav button").forEach(function(b){ b.classList.toggle("on", b.getAttribute("data-v")===id); });
    if(id==="drei") document.querySelectorAll("nav button").forEach(function(b){ b.classList.remove("on"); });
    try{ window.scrollTo(0,0); }catch(e){}
  }
  var shownDay=null;
  function showOne(){
    var out=document.getElementById("kOut"); if(!out) return;
    var c=todayCard(); shownDay=dayIdx(Date.now());
    out.innerHTML=html(c,"Heute");
    fit(out);
  }
  /* Sehr schmale Bildschirme oder grosse Systemschrift: Text in der Kachel etwas kleiner, nie abgeschnitten */
  function fit(out){
    var kc=out.querySelector(".kcard"), sm=kc&&kc.querySelector("small"); if(!sm) return;
    sm.style.fontSize="";
    var sizes=[.66,.62,.58,.54];
    for(var i=0;i<sizes.length&&over(kc);i++) sm.style.fontSize=sizes[i]+"rem";
  }
  function over(kc){
    if(!kc.clientHeight) return false;
    var r=kc.getBoundingClientRect(), a=kc.firstElementChild.getBoundingClientRect(), z=kc.lastElementChild.getBoundingClientRect();
    return kc.scrollHeight>kc.clientHeight+1||a.top<r.top+3||z.bottom>r.bottom-3;
  }
  window.addEventListener("resize",function(){ var o=document.getElementById("kOut"); if(o) fit(o); });
  var mode="drei";
  function frame(title,again){
    var sec=document.getElementById("drei"); if(!sec) return;
    var h=sec.querySelector(".hero h2"); if(h) h.textContent=title;
    var back=document.getElementById("dreiBack");
    var neu=document.getElementById("kNeu");
    if(!neu&&back&&back.parentNode){
      neu=document.createElement("button"); neu.type="button"; neu.id="kNeu"; neu.className="btn primary";
      back.parentNode.insertBefore(neu,back);
    }
    if(neu) neu.textContent=again;
  }
  function showZug(){
    mode="eine";
    var c=draw(1)[0], box=document.getElementById("dreiList");
    if(box) box.innerHTML=html(c,"Gezogen · "+KIND[c.k]);
    frame("Karte","Noch eine");
    go("drei");
  }
  function showDrei(){
    mode="drei";
    var d=draw(3), box=document.getElementById("dreiList");
    var pos=["Lage · steht","Block · zieht","Weg · still"];
    if(box) box.innerHTML=d.map(function(c,i){ return html(c,pos[i]+" · "+KIND[c.k]); }).join("");
    frame("Drei","Neu legen");
    go("drei");
  }
  document.addEventListener("click",function(e){
    var t=e.target; if(!t||!t.closest) return;
    if(t.closest("#kTag")) showZug();
    else if(t.closest("#kDrei")) showDrei();
    else if(t.closest("#kNeu")){ if(mode==="eine") showZug(); else showDrei(); }
    else if(t.closest("#dreiBack")) go("home");
  });
  document.addEventListener("visibilitychange",function(){
    if(document.visibilityState==="visible"&&shownDay!==dayIdx(Date.now())) showOne();
  });
  window.RR25_KARTEN={deck:DECK,today:todayCard,draw:draw,cycle:cycle,dayIdx:dayIdx,html:html,moon:moonKey,fit:fit};

  var s=document.createElement("style");
  s.textContent=[
    ".kcard{display:block;background:linear-gradient(185deg,rgba(70,24,90,.62),rgba(12,8,28,.92));border:1px solid rgba(255,122,217,.2);border-radius:1.15rem;padding:.9rem .85rem 1rem;margin:.48rem 0;text-align:center}",
    ".kcard .group{display:block;margin:0 0 .2rem}",
    ".kcard b{display:block;font-family:Georgia,serif;font-size:1.18rem;margin:.1rem 0 .35rem}",
    ".kcard small{display:block;color:#c4b4e0;line-height:1.4;font-size:.8rem}",
    ".kz{font-size:2.15rem;line-height:1;margin:.12rem 0 .32rem;color:#ff9ad8;text-shadow:0 0 14px rgba(255,122,217,.55),0 0 24px rgba(126,240,230,.25)}",
    "#kOut .kcard{height:100%;margin:0;padding:.5rem .42rem;display:flex;flex-direction:column;align-items:center;justify-content:center}",
    "#kOut .kcard b{font-size:1.02rem}",
    "#kOut .kcard small{font-size:.7rem;line-height:1.35}",
    "#dreiList .kcard{padding:1.05rem .95rem;border-left:5px solid transparent}",
    "#dreiList .kz{font-size:2.5rem}",
    "#dreiList .kcard small{font-size:.9rem;line-height:1.5}",
    ".ktone-soft{border-color:rgba(46,204,113,.45)}",
    ".ktone-soft .group,.ktone-soft b{color:#7dffb0}",
    ".ktone-hard{border-color:rgba(231,76,60,.5)}",
    ".ktone-hard .group,.ktone-hard b{color:#ff8a7a}",
    ".ktone-echo{border-color:rgba(93,173,226,.5)}",
    ".ktone-echo .group,.ktone-echo b{color:#8fd4ff}",
    ".ktone-feld{border-color:rgba(176,132,255,.5)}",
    ".ktone-feld .group,.ktone-feld b{color:#c9a8ff}",
    "#dreiList .ktone-soft{border-left-color:rgba(46,204,113,.75)}",
    "#dreiList .ktone-hard{border-left-color:rgba(231,76,60,.8)}",
    "#dreiList .ktone-echo{border-left-color:rgba(93,173,226,.8)}",
    "#dreiList .ktone-feld{border-left-color:rgba(176,132,255,.8)}",
    "#kasten{margin-bottom:.15rem}"
  ].join("");
  document.head.appendChild(s);
  showOne();
})();

}catch(e){setTimeout(function(){throw e;});}
