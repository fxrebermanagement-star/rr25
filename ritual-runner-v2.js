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
  var PLANET=["Sonne · Kraft, Sichtbarkeit","Mond · Gefühl, Traum","Mars · Grenze, Hard","Merkur · Wort, Kontakt","Jupiter · Fülle","Venus · Liebe","Saturn · Grenze, Trennung, Hard"];
  var TONE_NAME={soft:"Soft",hard:"Hard",feld:"Feld",neutral:"Abbruch"};
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

  /* ---------- Wetter ---------- */
  var KAL=null;
  function loadKal(){
    if(KAL!==null) return;
    KAL=[];
    try{
      fetch("kalender.json?v="+ymd(),{cache:"no-store"}).then(function(r){ return r.json(); })
        .then(function(d){ KAL=(d&&d.events)||[]; var w=document.getElementById("wetter"); if(w) w.innerHTML=wetterHtml(cur&&cur.r); })
        .catch(function(){});
    }catch(e){}
  }
  function moonP(){ var syn=29.53058867, nm=Date.UTC(2000,0,6,18,14)/1000; var a=((Date.now()/1000-nm)/86400)%syn; if(a<0)a+=syn; return a/syn; }
  function wetter(){
    var today=ymd(), nowT=Date.now(), best=null;
    (KAL||[]).forEach(function(e){
      var s=String(e.start||"");
      if(s.slice(0,10)!==today) return;
      var t=e.all?0:Date.parse(s);
      if(!best) best=e;
      else if(!e.all && t<=nowT) best=e;
    });
    var kind, txt;
    if(best){ kind=String(best.t||"").split("·")[0].trim().toUpperCase(); txt=String(best.t||""); }
    else{
      var p=moonP();
      if(p<0.04||p>0.96){ kind="SOFT"; txt="SOFT · Neumond"; }
      else if(p>0.47&&p<0.53){ kind="ECHO"; txt="ECHO · Vollmond"; }
      else if(p>0.72){ kind="STILL"; txt="STILL · Abnehmend"; }
      else { kind="SOFT"; txt="SOFT · Zunehmend"; }
    }
    if(!/^(SOFT|HARD|ECHO|STILL)$/.test(kind)) kind="SOFT";
    return {kind:kind,txt:txt};
  }
  function wetterHtml(r){
    var w=wetter(), d=new Date().getDay();
    var say={SOFT:"Soft-Fenster. Weiche Arbeit trägt.",HARD:"Hard-Fenster. Scharf. Nur mit Gate und Rückkehr.",ECHO:"Echo. Nicht nachsetzen. Schliessen, danken, ernten.",STILL:"Still. Heute eher nichts setzen."}[w.kind];
    var warn="";
    if(r && r.hard && (w.kind==="ECHO"||w.kind==="STILL")) warn="<br><b>Für Hard eher nicht heute.</b>";
    return '<span class="wk wk-'+w.kind.toLowerCase()+'">'+h(w.txt)+'</span><br>'+say+warn+'<br><span class="meta">'+DAYS[d]+' · '+PLANET[d]+'</span>';
  }

  /* ---------- Ablauf ---------- */
  var cur=null;
  function fillT(s){
    var r=cur.r, m=cur.mem;
    var keys=["Name","A","B","Auftrag","Wofür"];
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
        var who=r.need&&r.need.indexOf("A")>=0?"Ich bin nicht [A]. Ich bin nicht [B].":"Ich bin nicht mehr [Name].";
        out[k][1]="Drei Schritte.\n\n1 Benennen:\n"+who+"\n\n2 Trennen:\nIch kehre vollständig in mich zurück. Meine Energie gehört nur mir. Alles Fremde löst sich und geht.\n\n3 Körper:\nFüsse. Atem. Hände. Raum.\nIch bin ganz bei mir. So ist es.";
      }
      var e=idx(/^Schluss$/);
      if(e>=0 && lv==="nagel") out[e][1]+="\n\nFrist: nicht nachladen, nicht nachschauen. Die Arbeit läuft.";
    }
    if(cur.wesen && !r.wesenSelf){
      var a3=idx(/^369$/); if(r.haerte&&lv!=="weich") a3=idx(/^Anker$/);
      out.splice(a3,0,
        ["Wesenheit · Filter","Sprich:\nNur klare, stimmige Präsenz. Was drängt, bleibt draussen.\nWer bereit und geeignet ist, möge sich zeigen."],
        ["Wesenheit · Auftrag","Sprich:\nDein Auftrag ist: [Auftrag]. Nur in diesem Rahmen.\nOhne unnötigen Schaden. Der Auftrag endet, wenn er erfüllt ist."]);
      var k2=idx(/^Rückkehr$/);
      out.splice(k2,0,["Entlassen","Sprich:\nDer Auftrag ist beendet, wenn er erfüllt ist. Ich danke dir.\nDu bist frei. Löse alle Verbindungen. Ich schliesse den Kontakt."]);
    }
    var kk=idx(/^Rückkehr$/);
    if(kk>=0 && r.id!=="schlaf") out[kk][1]+="\n\n"+ANKER;
    cur.steps=out;
  }
  function needs(){
    var n=(cur.r.need||[]).slice();
    if(cur.wesen && !cur.r.wesenSelf && n.indexOf("Auftrag")<0) n.push("Auftrag");
    return n;
  }

  function frame(opt){
    var r=cur.r, el=run();
    el.setAttribute("data-tone", r.tone||"soft");
    var sub=h(r.t)+(cur.lvl?" · "+LV[cur.lvl]:"")+(opt.n?" · "+opt.n:"");
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
    var body='<div class="wetter" id="wetter">'+wetterHtml(cur.r)+'</div>'+
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
    var body='<p class="words">Standard: ohne Wesenheit.</p>'+
      '<button type="button" class="card wq" data-w="0"><b>Ohne Wesenheit</b><small>Der eigene Faden trägt.</small></button>'+
      '<button type="button" class="card wq" data-w="1"><b>Mit Wesenheit</b><small>Nur wenn der Faden nicht reicht. Hartes Ende. Danach zurück.</small></button>';
    frame({title:"Wesenheit?",body:body,prev:"Zurück",noAbort:true});
    document.getElementById("prev").onclick=function(){ if(cur.r.haerte) haerte(); else tor(); };
    [].slice.call(document.querySelectorAll("#run .wq")).forEach(function(b){
      b.onclick=function(){ cur.wesen=b.getAttribute("data-w")==="1"; startSteps(); };
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
        return '<input class="nm" data-n="'+h(k)+'" placeholder="'+h(ph)+'" value="'+h(cur.mem[k]||"")+'" autocomplete="off" autocapitalize="words">';
      }).join("");
    }
    var body, title=t, nextTxt=last?"Weiter":"Weiter";
    if(/^369$/.test(st[0])){ title="3 · 6 · 9"; body=counter(fillT(raw)); }
    else if(/^So sei es$/.test(st[0])){ body=sealHtml()+'<p class="words">'+h(fillT(raw))+'</p>'; nextTxt="So sei es"; }
    else if(/^Rückkehr$/.test(st[0])){ body='<p class="words">'+h(fillT(raw))+'</p><label class="gchk rk"><input type="checkbox" id="rkOk"><span>Ich bin zurück. Ganz bei mir.</span></label>'; }
    else body='<p class="words" id="w0">'+h(fillT(raw))+'</p>';
    frame({title:h(title),body:inputs+body,prev:"Zurück",next:nextTxt,n:(cur.i+1)+"/"+cur.steps.length,stepName:t});
    [].slice.call(document.querySelectorAll("#run .nm")).forEach(function(inp){
      inp.oninput=function(){
        cur.mem[inp.getAttribute("data-n")]=inp.value.trim();
        var w=document.getElementById("w0"); if(w) w.innerHTML=h(fillT(raw));
      };
    });
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
        if(miss.length){ msg(miss.join(", ")+" fehlt."); return; }
      }
      if(/^Rückkehr$/.test(st[0])){
        var ok=document.getElementById("rkOk");
        if(!ok||!ok.checked){ msg("Erst zurückkehren."); return; }
        cur.back=true;
      }
      if(!last){ cur.i++; step(); return; }
      if(r.noStatus) echo(); else status();
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
    d.log=d.log||[]; d.log.unshift(e);
    if(!aborted && fromPlan){ d.planned=(d.planned||[]).filter(function(p){ return p.pid!==fromPlan; }); fromPlan=null; }
    save(d);
    if(r.id==="dank" && !aborted){ try{ localStorage.setItem("rr25_dank", ymd()); }catch(x){} }
    window._rid=r.id;
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

  function openV2(id,wer){
    var r=byId(id); if(!r) return;
    var mem={};
    if(wer){ mem.Name=wer; var p=String(wer).split(/\s*·\s*/); mem.A=p[0]||wer; mem.B=p[1]||""; }
    cur={r:r,mem:mem,wer:wer||"",i:0,lvl:null,wesen:false,steps:[],started:false};
    window._rid=r.id;
    show("run");
    if(r.hard) diagnose();
    else if(r.skipTiming) startSteps();
    else tor();
  }
  openR=openV2;

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
    }
    if(id==="home") pinDank();
    return r;
  };

  var css=document.createElement("style");
  css.textContent=[
    "#run{--tone:#5fe0a0}",
    "#run[data-tone=hard]{--tone:#ff5470}#run[data-tone=feld]{--tone:#b98cff}#run[data-tone=neutral]{--tone:#9a96a8}",
    "#run .tonetag{margin:.2rem 0 0;font-size:.62rem;letter-spacing:.2em;text-transform:uppercase;color:var(--tone)}",
    "#run .hero h2{border-left:3px solid var(--tone);padding-left:.55rem}",
    "#run .gchk{display:flex!important;gap:.6rem;align-items:flex-start;margin:.55rem 0;padding:.65rem .7rem;border:1px solid rgba(126,200,255,.2);border-radius:.9rem;background:rgba(20,10,34,.7);font-size:.92rem}",
    "#run .gchk input{width:1.25rem;height:1.25rem;margin:.1rem 0 0;flex:none;accent-color:#ff7ad9}",
    "#run .gchk small{color:#c4b4e0;font-size:.78rem}",
    "#run .abortBtn{flex:none;margin:0 auto;background:transparent;border:1px solid rgba(154,150,168,.45);color:#b8b3c6;font-weight:500;padding:.4rem 1.2rem;min-height:2rem}",
    "#run .wetter{margin:.3rem 0 .6rem;padding:.6rem .75rem;border-radius:.9rem;background:rgba(20,10,34,.7);border:1px solid rgba(126,200,255,.18);font-size:.86rem;line-height:1.5}",
    "#run .wk{font-size:.66rem;letter-spacing:.16em;text-transform:uppercase;font-weight:650}",
    ".wk-soft{color:#5fe0a0}.wk-hard{color:#ff5470}.wk-echo{color:#7ec8ff}.wk-still{color:#b8b3c6}",
    "#run .lv,#run .wq{display:block}",
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
    "#list .rcard{position:relative;border-left:3px solid #5fe0a0;padding-right:3.6rem}",
    "#list .rcard.tone-hard{border-left-color:#ff5470}#list .rcard.tone-feld{border-left-color:#b98cff}#list .rcard.tone-neutral{border-left-color:#9a96a8}",
    "#list .rcard i{position:absolute;right:.8rem;top:.8rem;font-style:normal;font-size:.58rem;letter-spacing:.16em;text-transform:uppercase;color:#5fe0a0}",
    "#list .rcard.tone-hard i{color:#ff5470}#list .rcard.tone-feld i{color:#b98cff}#list .rcard.tone-neutral i{color:#9a96a8}",
    "#pinDank{position:relative;padding-right:3.1rem}",
    "#pinDank .ok{position:absolute;right:.85rem;top:50%;transform:translateY(-50%);width:1.55rem;height:1.55rem;border-radius:50%;border:2px solid rgba(255,122,217,.45);display:flex;align-items:center;justify-content:center}",
    "#pinDank.done .ok{background:linear-gradient(165deg,#ff7ad9,#7ef0e6);border:0;color:#14081c;font-weight:700}"
  ].join("");
  document.head.appendChild(css);
  try{ cat=""; }catch(e){}
  renderList();
  loadKal();
})();
