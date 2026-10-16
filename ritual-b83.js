/* ritual-b83.js — Ritualbauer (Build 83, Build 86 ausgebaut): eigene Vollseite «Ritualbauer».
   Ablauf: Absicht (freier Satz, Themen als Vorschläge) · Für wen (mich, Person, Situation) · Ton Soft/Hard · Zutaten (Favoriten zuerst)
   · Hinweis, wann es passt (Tradition) -> Schritte: Vorbereitung, Standort, Absicht, Ich, Spiel, Quelle (Hard: Rückkehr, Anker).
   Danach Echo/Wirkung (rr25_tags_v1, fliesst ins Absicht-Tagebuch) und Chronik-Eintrag mit Absicht und «für wen».
   Speicher: rr25_rezepte (abwärtskompatibel, Präfix rr25: in Sichern/Wiederherstellen). Daten aus dem Lexikon (nur lesen). */
(function(){
  if(window.__rr25b83) return; window.__rr25b83=1;
  var KR="rr25_rezepte", KFAV="rr25_rz_fav", KT="rr25_tags_v1";
  var TH=[["schutz","Schutz"],["ruhe","Ruhe"],["herz","Herz"],["klaerung","Klärung"],["mut","Mut"],["heilung","Heilung"],["fuelle","Fülle"],["traum","Traum und Schwelle"],["ende","Abschluss"]];
  var SATZ={schutz:"Ich bin geschützt. Mein Feld ist geschlossen.",ruhe:"Ich bin ruhig. Ich lasse los.",herz:"Mein Herz ist offen und klar.",klaerung:"Ich sehe klar.",mut:"Ich bin mutig und ruhig.",heilung:"Ich lasse Heilung zu, in meinem Tempo.",fuelle:"Ich bin versorgt. Genug ist da.",traum:"Ich gehe sanft über die Schwelle.",ende:"Es ist gut. Ich schliesse ab."};
  /* Überlieferung: Wochentag (0 So … 6 Sa) und Mondphase, in eigenen Worten, als Tradition */
  var TRAD={schutz:{d:[2,6],m:["ab","neu"]},ruhe:{d:[1],m:["ab","neu"]},herz:{d:[5],m:["zu","voll"]},klaerung:{d:[3],m:["zu","voll"]},mut:{d:[2],m:["zu"]},heilung:{d:[0,1],m:["zu"]},fuelle:{d:[4],m:["zu","voll"]},traum:{d:[1],m:["voll","neu"]},ende:{d:[6],m:["ab","neu"]}};
  var DL=["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"], PN=["Sonne","Mond","Mars","Merkur","Jupiter","Venus","Saturn"];
  var MK={neu:"Neumond",zu:"zunehmender Mond",voll:"Vollmond",ab:"abnehmender Mond"};
  var ZA={"1":"den Anfang","2":"das Gegenüber","3":"das Wachstum","4":"den Boden","5":"die Bewegung","6":"den Ausgleich","7":"den Rückzug","8":"den Fluss","9":"den Abschluss"};
  var HM={"Wasser":"Stelle ein Glas Wasser bereit.","Kerze":"Zünde eine Kerze an und stell sie sicher hin.","Weihrauch":"Räuchere ein wenig Weihrauch, Fenster einen Spalt offen.","Myrrhe":"Räuchere ein wenig Myrrhe, Fenster einen Spalt offen.","Messer":"Lege das Messer bereit, nur zum Zeigen, nicht zum Schneiden.","Nagel":"Lege einen Nagel bereit.","Schlüssel":"Nimm einen Schlüssel in die Hand.","Faden":"Halte einen Faden bereit.","Besen":"Stelle den Besen bereit.","Schwefel":"Schwefel nur als Wort: schreib ihn auf, verbrenne nichts.","Kreide":"Nimm die Kreide zur Hand.","Salz":"Stelle eine Prise Salz bereit.","Wein":"Stelle ein Glas Wein bereit, ein Schluck genügt."};
  function low(x){ return x.charAt(0).toLowerCase()+x.slice(1); }
  function kurz(e){ return e.cat==="zahlen"&&e.num?"Zahl "+e.num:String(e.name).replace(" / "," oder "); }
  function zSatz(e){
    var n=String(e.name).replace(" / "," oder ");
    switch(e.cat){
      case "zahlen": return e.num&&ZA[e.num]?"Atme in die Zahl "+e.num+", "+ZA[e.num]+".":"Atme ruhig in die Zahl "+n+".";
      case "kraeuter": return "Nimm "+n+" dazu, als Duft, Tee oder Bild.";
      case "steine": return "Nimm einen Stein in die Hand: "+n+".";
      case "kerzen": return "Zünde die "+low(n)+" an und stell sie sicher hin.";
      case "farben": return "Gib der Farbe "+n+" Raum: ein Tuch, ein Licht oder ein Blick darauf.";
      case "rauch":
        if(/^Räucherkohle/.test(n)) return "Lege die Räucherkohle bereit, mit Schale und Sand darunter.";
        if(/^Räucherschale/.test(n)) return "Stelle die "+n+" bereit.";
        if(/^Rauch mit Mass/.test(n)) return "Räuchere mit Mass: wenig Rauch, Fenster einen Spalt offen.";
        return "Räuchere mit "+n+": wenig Rauch, Fenster einen Spalt offen.";
      case "hausmittel": return HM[n]||"Als Hausmittel dabei: "+n+". Ein wenig reicht.";
      default: return "Nimm "+n+" dazu.";
    }
  }
  var DATA=null, LINKS={}, st=0, PREV="home";
  var S0=function(){ return {th:"",ton:"Soft",txt:"",fm:"ich",fw:"",rep:3,sel:[],name:"",_txtAuto:""}; };
  var S=S0(), VIEW=null;
  function js(k,d){ try{ var v=JSON.parse(localStorage.getItem(k)); return v==null?d:v; }catch(e){ return d; } }
  function h(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function favs(){ var f=js(KFAV,[]); return Array.isArray(f)?f:[]; }
  function rez(){ var r=js(KR,[]); return Array.isArray(r)?r:[]; }
  function setRez(r){ try{ localStorage.setItem(KR,JSON.stringify(r)); }catch(e){} }
  function loadLex(){
    if(DATA||st) return; st=1;
    function one(u){ return fetch(u,{cache:"no-store"}).then(function(r){ if(!r.ok) throw 0; return r.json(); }); }
    Promise.all([one("resonanzen-a.json?v=47"),one("resonanzen-b.json?v=47"),one("resonanzen-c.json?v=47"),one("resonanzen-d.json?v=74"),one("resonanzen-links.json?v=74")]).then(function(p){
      DATA=[].concat(p[0]||[],p[1]||[],p[2]||[],p[3]||[]); LINKS=p[4]||{}; paint();
    }).catch(function(){ st=0; });
  }
  function toneOk(e,ton){ if(ton==="Hard") return true; var t=String(e.tone||"Soft"); return t==="Soft"||t==="Soft/Grenze"; }
  function vorschlag(){
    if(!DATA) return [];
    var F=favs(), pool=DATA.filter(function(e){ if(!toneOk(e,S.ton)) return false; if(!S.th) return F.indexOf(e.id)>=0; var l=LINKS[e.id]; return l&&(l.t||[]).indexOf(S.th)>=0; });
    pool.sort(function(a,b){ return (F.indexOf(b.id)>=0)-(F.indexOf(a.id)>=0)||String(a.name).localeCompare(String(b.name),"de"); });
    return pool.slice(0,9);
  }
  function zWeekday(){ try{ var w=new Intl.DateTimeFormat("en-US",{timeZone:"Europe/Zurich",weekday:"short"}).format(new Date()); var i=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(w); return i<0?new Date().getDay():i; }catch(e){ return new Date().getDay(); } }
  function wann(){
    var T=TRAD[S.th]; if(!T) return "";
    var days=T.d.map(function(i){ return DL[i]+" ("+PN[i]+")"; }).join(" oder "), moons=T.m.map(function(k){ return MK[k]; }).join(" oder ");
    var wd=zWeekday(), mk=""; try{ mk=window.RR25_MOND.day().key; }catch(e){}
    var okD=T.d.indexOf(wd)>=0, okM=T.m.indexOf(mk)>=0;
    var heute=okD&&okM?"Heute passt beides.":okD?"Heute passt der Wochentag.":okM?"Heute passt der Mond.":"Heute passt es nicht genau. Es geht auch so.";
    return "Als Tradition: "+days+", "+moons+". "+heute;
  }
  function fuerTxt(s){ return s.fm==="person"&&s.fw.trim()?s.fw.trim():s.fm==="situation"&&s.fw.trim()?s.fw.trim():""; }
  function fuerLab(s){ var w=fuerTxt(s); return s.fm==="ich"||!w?"für mich":(s.fm==="person"?"für "+w:"für "+w); }
  function build(){
    var hard=S.ton==="Hard", ab=(S.txt||"").trim()||SATZ[S.th]||"So sei es.", w=fuerTxt(S), fm=S.fm;
    var z=S.sel.map(function(id){ return DATA&&DATA.filter(function(e){ return e.id===id; })[0]; }).filter(Boolean);
    var wo=fm==="person"&&w?" für "+w:fm==="situation"&&w?" für "+w:"";
    var steps=[];
    steps.push(["Vorbereitung","Tu:|Ruhiger Ort. Wasser bereit."+(z.length?" Bereit: "+z.map(kurz).join(", ")+".":"")+(hard?"|Zeit für die Rückkehr einplanen. Anker bereithalten (Wasser, Salz).":"")]);
    steps.push(["Standort","Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin hier. Ich bin klar."]);
    steps.push(["Absicht",(w?"Für "+w+".||":"")+"Sprich leise, einmal ganz bewusst:|"+ab]);
    steps.push(["Ich ❤️","Frag dich in Ruhe:|Was will ich wirklich"+wo+"?||Warte, bis ein einfacher Satz kommt.||Sprich:|Ich will …"+(w?" (für "+w+")":"")]);
    var tu=z.length?z.map(zSatz):["Ein kleiner Schritt von mir, hier und jetzt: Kerze, Atem oder Wasser."];
    var tr=z.filter(function(e){ return e.text; }).map(function(e){ return kurz(e)+": "+e.text; });
    steps.push(["Spiel 🙏","Was tue ich dafür"+wo+"?||Tu:|"+tu.join("|")+(tr.length?"||Aus der Tradition:|"+tr.join("|"):"")+"||Sprich:|Ich tue meinen Teil. Ich tue ihn gern.",{rep:S.rep,txt:ab}]);
    steps.push(["Quelle 👁","Lass los"+(w?": "+w:"")+".||Tu:|Ein langer Atemzug. Hände öffnen.||Sprich:|Ich gebe es ab. Es ist gesät.|So sei es."]);
    if(hard){ steps.push(["Rückkehr","Sprich:|Ich bin hier. Ich bin ganz bei mir.||Tu:|Füsse. Atem. Raum."]); steps.push(["Anker","Tu:|Wasser trinken. Salz kurz berühren. Etwas Alltägliches tun.||Sprich:|Anker gesetzt. Ich bin zurück."]); }
    else steps.push(["Schluss","Tu:|Wasser. Alltag."]);
    return steps;
  }
  function stepHtml(t){
    return String(t).split("||").map(function(b){ var L=b.split("|"); var head=L.shift(); return '<p class="rzRh">'+h(head)+'</p>'+L.map(function(x){ return '<p class="rzRl">'+h(x)+'</p>'; }).join(""); }).join("");
  }
  function defName(){ var t=TH.filter(function(x){ return x[0]===S.th; })[0]; return (t?t[1]:"Eigenes")+" · "+S.ton; }
  function cur(){ return {id:"rz"+Date.now().toString(36),v:2,name:(S.name||defName()).trim()||defName(),th:S.th,ton:S.ton,absicht:(S.txt||"").trim(),rep:S.rep,fuer:{m:S.fm,w:fuerTxt(S)},zut:S.sel.slice(),steps:build(),made:Date.now()}; }
  function viewer(r,i){
    var s=r.steps[i], last=i===r.steps.length-1, x=s[2]&&s[2].rep?s[2]:null, c=VIEW.c||0, n=x?x.rep:0;
    var cnt=x?'<div class="rzCnt"><p class="rzCq">'+h("«"+x.txt+"»")+'</p><button type="button" class="rzCb'+(c>=n?" fertig":"")+'" data-a="cnt" aria-live="polite"><span class="rzCn">'+c+' von '+n+'</span><small>'+(c>=n?"Geschafft":(c?"Weiter sprechen und tippen":"Sprich die Absicht und tippe"))+'</small></button></div>':'';
    return '<div class="rzV"><p class="rzVk">'+h(r.name)+' · '+(i+1)+' von '+r.steps.length+'</p><h4>'+h(s[0])+'</h4>'+stepHtml(s[1])+cnt+
      '<div class="rzVb"><button type="button" class="btn ghost" data-a="vb"'+(i===0?" disabled":"")+'>Zurück</button><button type="button" class="btn primary" data-a="vn">'+(last?"Abschliessen":"Weiter")+'</button></div></div><button type="button" class="rzLink" data-a="vx">Beenden</button>';
  }
  function danach(){
    var r=VIEW.r, E=VIEW.echo, W=VIEW.wirk;
    return '<div class="rzV"><h4>So sei es.</h4><p class="rzRn">Eine Zeile für später, nur wenn du magst: Echo ist, was zurückkommt. Wirkung ist, was sich bewegt.</p>'+
      '<div class="rzCh"><button type="button" data-tg="echo" class="'+(E?"on":"")+'" aria-pressed="'+!!E+'">Echo</button><button type="button" data-tg="wirk" class="'+(W?"on":"")+'" aria-pressed="'+!!W+'">Wirkung</button></div>'+
      '<input id="rzZeile" class="rzRi" maxlength="140" placeholder="Eine Zeile dazu (optional)" value="'+h(VIEW.zeile||"")+'" autocomplete="off">'+
      '<div class="rzVb"><button type="button" class="btn primary" data-a="done">Fertig</button></div></div>';
  }
  function builderHtml(){
    var sv=rez(), out='';
    out+='<p class="rzRh">1 · Absicht</p><textarea id="rzRt" class="rzRi rzTa" maxlength="160" rows="2" placeholder="Dein eigener Satz …">'+h(S.txt)+'</textarea>';
    out+='<p class="rzRn">Oder ein Thema als Vorschlag:</p><div class="rzCh">'+TH.map(function(t){ return '<button type="button" data-th="'+t[0]+'" class="'+(S.th===t[0]?"on":"")+'">'+t[1]+'</button>'; }).join("")+'</div>';
    out+='<p class="rzRh">Absicht sprechen</p><div class="rzCh">'+[1,3,6,9].map(function(n){ return '<button type="button" data-rep="'+n+'" class="'+(S.rep===n?"on":"")+'" aria-pressed="'+(S.rep===n)+'">'+n+'×</button>'; }).join("")+'</div>';
    out+='<p class="rzRh">2 · Für wen</p><div class="rzCh"><button type="button" data-fm="ich" class="'+(S.fm==="ich"?"on":"")+'">Für mich</button><button type="button" data-fm="person" class="'+(S.fm==="person"?"on":"")+'">Für eine Person</button><button type="button" data-fm="situation" class="'+(S.fm==="situation"?"on":"")+'">Für eine Situation</button></div>';
    if(S.fm!=="ich") out+='<input id="rzFw" class="rzRi" maxlength="'+(S.fm==="person"?40:80)+'" placeholder="'+(S.fm==="person"?"Name":"Kurz beschrieben")+'" value="'+h(S.fw)+'" autocomplete="off">';
    out+='<p class="rzRh">3 · Ton</p><div class="rzCh"><button type="button" data-ton="Soft" class="tS'+(S.ton==="Soft"?" on":"")+'">Soft</button><button type="button" data-ton="Hard" class="tH'+(S.ton==="Hard"?" on":"")+'">Hard</button></div>';
    if(S.ton==="Hard"){ var k=""; try{ k=window.RR25_KAL.state().kind; }catch(e){} out+='<p class="rzRn">Hard nur mit Rückkehr und Anker: beide Schritte sind fest eingebaut.'+(k&&k!=="HARD"?' Im Kalender ist gerade kein Hard-Fenster offen.':'')+'</p>'; }
    out+='<p class="rzRh">4 · Zutaten (bis 3, Favoriten zuerst)</p>';
    if(!DATA) out+='<p class="rzRn">Lexikon lädt…</p>';
    else { var F=favs(), v=vorschlag(); out+=v.length?'<div class="rzCh">'+v.map(function(e){ return '<button type="button" data-z="'+h(e.id)+'" class="'+(S.sel.indexOf(e.id)>=0?"on":"")+'">'+(F.indexOf(e.id)>=0?"★ ":"")+h(e.name)+'</button>'; }).join("")+'</div>':'<p class="rzRn">'+(S.th?"Dazu passt hier nichts. Das Ritual geht auch ohne Zutat.":"Wähle ein Thema, dann erscheinen passende Zutaten. Favoriten stehen immer zuerst.")+'</p>'; }
    var wn=wann(); if(wn) out+='<p class="rzRn rzWann">'+h(wn)+'</p>';
    var steps=build();
    out+='<p class="rzRh">Vorschau · '+steps.length+' Schritte</p><p class="rzRn">'+steps.map(function(s){ return h(s[0]); }).join(" → ")+'</p>';
    out+='<input id="rzRname" class="rzRi" maxlength="40" placeholder="Name" value="'+h((S._dn=defName(),S.name||S._dn))+'" autocomplete="off">';
    out+='<div class="rzVb"><button type="button" class="btn ghost" data-a="start">Jetzt durchgehen</button><button type="button" class="btn primary" data-a="save">Speichern</button></div>';
    if(sv.length){
      out+='<p class="rzRh">Meine Rezepte</p><ul class="rzSv">'+sv.map(function(r,i){ var f=r.fuer&&r.fuer.w?" · für "+h(r.fuer.w):""; return '<li><button type="button" class="rzOpen" data-r="'+i+'"><b>'+h(r.name)+'</b><small>'+h(r.ton)+' · '+r.steps.length+' Schritte'+f+(r.rep?' · '+r.rep+'×':'')+'</small></button><button type="button" class="rzDel" data-d="'+i+'" aria-label="Rezept löschen">×</button></li>'; }).join("")+'</ul>';
    }
    return out;
  }
  function keep(){
    var t=document.getElementById("rzRt"), n=document.getElementById("rzRname"), w=document.getElementById("rzFw");
    if(t) S.txt=t.value; if(n) S.name=(n.value===S._dn)?"":n.value; if(w) S.fw=w.value;
  }
  function bind(p){
    function all(sel,fn){ [].slice.call(p.querySelectorAll(sel)).forEach(fn); }
    all("[data-th]",function(b){ b.onclick=function(){ keep(); var id=b.getAttribute("data-th"); var auto=S.th&&SATZ[S.th]; if(!S.txt.trim()||S.txt===auto) S.txt=SATZ[id]; S.th=id; S.sel=[]; paint(); }; });
    all("[data-rep]",function(b){ b.onclick=function(){ keep(); S.rep=+b.getAttribute("data-rep"); paint(); }; });
    all("[data-fm]",function(b){ b.onclick=function(){ keep(); S.fm=b.getAttribute("data-fm"); paint(); if(S.fm!=="ich"){ var i=document.getElementById("rzFw"); if(i) i.focus(); } }; });
    all("[data-ton]",function(b){ b.onclick=function(){ keep(); S.ton=b.getAttribute("data-ton"); S.sel=[]; paint(); }; });
    all("[data-z]",function(b){ b.onclick=function(){ keep(); var id=b.getAttribute("data-z"), i=S.sel.indexOf(id); if(i>=0) S.sel.splice(i,1); else if(S.sel.length<3) S.sel.push(id); paint(); }; });
    all("[data-r]",function(b){ b.onclick=function(){ var r=rez()[+b.getAttribute("data-r")]; if(r){ VIEW={r:r,i:0}; paint(); } }; });
    all("[data-d]",function(b){ b.onclick=function(){ var a=rez(); a.splice(+b.getAttribute("data-d"),1); setRez(a); paint(); }; });
    all("[data-tg]",function(b){ b.onclick=function(){ var z=document.getElementById("rzZeile"); if(z) VIEW.zeile=z.value; var k=b.getAttribute("data-tg"); VIEW[k]=!VIEW[k]; paint(); }; });
    all("[data-a]",function(b){ b.onclick=function(){
      var a=b.getAttribute("data-a");
      if(a==="start"){ keep(); VIEW={r:cur(),i:0}; }
      else if(a==="save"){ keep(); var r=rez(); r.unshift(cur()); setRez(r.slice(0,30)); S=S0(); }
      else if(a==="cnt"){ var st=VIEW.r.steps[VIEW.i], x=st[2]&&st[2].rep?st[2]:null; if(x&&(VIEW.c||0)<x.rep){ VIEW.c=(VIEW.c||0)+1; if(VIEW.c>=x.rep){ var v=VIEW, ii=v.i; setTimeout(function(){ if(VIEW===v&&v.i===ii&&!v.fin){ v.c=0; if(v.i<v.r.steps.length-1) v.i++; else v.fin=true; paint(); } },900); } } }
      else if(a==="vb"){ VIEW.i=Math.max(0,VIEW.i-1); VIEW.c=0; }
      else if(a==="vn"){ VIEW.c=0; if(VIEW.i<VIEW.r.steps.length-1) VIEW.i++; else VIEW.fin=true; }
      else if(a==="vx"){ VIEW=null; }
      else if(a==="done"){ var z=document.getElementById("rzZeile"); if(z) VIEW.zeile=z.value; fin(VIEW); VIEW=null; S=S0(); close(); return; }
      paint();
    }; });
    var ta=document.getElementById("rzRt"); if(ta) ta.addEventListener("input",function(){ S.txt=ta.value; });
  }
  function fin(V){
    var r=V.r;
    try{
      var fw=r.fuer&&r.fuer.w?r.fuer.w:"", fl=r.fuer&&r.fuer.m==="ich"?"für mich":(fw?"für "+fw:"");
      var id=typeof uid==="function"?uid():("r"+Date.now().toString(36));
      if(typeof load==="function"&&typeof save==="function"){
        var d=load(); d.log=d.log||[];
        d.log.unshift({id:id,t:typeof now==="function"?now():new Date().toLocaleString("de-CH"),titel:"Rezept · "+r.name,wer:fl,note:(r.absicht||"")+(r.absicht&&fl?" · ":"")+fl+(r.rep?((r.absicht||fl)?" · ":"")+r.rep+"×":""),absicht:r.absicht||"",fuer:fl,zeile:(V.zeile||"").trim()});
        save(d);
        var tg=[]; if(V.echo) tg.push("Echo"); if(V.wirk) tg.push("Wirkung");
        if(tg.length){ var T=js(KT,{}); if(!T||typeof T!=="object"||Array.isArray(T)) T={}; T[String(id)]=tg; try{ localStorage.setItem(KT,JSON.stringify(T)); }catch(e){} }
        if(typeof paintLog==="function") paintLog();
      }
    }catch(e){}
  }
  function paint(){
    var body=document.getElementById("rezBody"); if(!body) return;
    body.innerHTML=VIEW?(VIEW.fin?danach():viewer(VIEW.r,VIEW.i)):builderHtml(); bind(body);
  }
  function ensure(){
    if(document.getElementById("rezept")) return;
    var main=document.querySelector("main"); if(!main) return;
    var s=document.createElement("section"); s.className="screen"; s.id="rezept";
    s.innerHTML='<div class="hero rezHero"><button type="button" id="rezBack" class="rezBackBtn" aria-label="Zurück">‹</button><h2>Ritualbauer</h2></div><div id="rezBody" class="card"></div>';
    main.appendChild(s);
    s.querySelector("#rezBack").onclick=close;
  }
  function open(){
    ensure(); loadLex();
    var on=document.querySelector(".screen.on"); if(on&&on.id!=="rezept") PREV=on.id;
    if(typeof show==="function") show("rezept");
    paint(); window.scrollTo(0,0);
  }
  function close(){ VIEW=null; if(typeof show==="function") show(PREV&&PREV!=="rezept"?PREV:"home"); }
  function mount(){
    var root=document.getElementById("resonanzen"); if(!root||document.getElementById("rzRezept")) return;
    var top=root.querySelector(".rzTop"); if(!top) return;
    var w=document.createElement("div"); w.id="rzRezept";
    w.innerHTML='<button type="button" class="btn ghost" id="rzRezBtn">Ritualbauer öffnen</button>';
    root.insertBefore(w,top); w.querySelector("#rzRezBtn").onclick=open;
  }
  ensure(); mount(); setTimeout(mount,500);
  if(typeof show==="function"&&!show._b83){ var sh=show; show=function(id){ var r=sh.apply(this,arguments); if(id==="resonanzen") setTimeout(mount,200); return r; }; show._b83=1; }
  var css=document.createElement("style");
  css.textContent=[
    "#rzRezept{margin:.1rem 0 .55rem}#rzRezBtn{min-height:2.75rem;padding:.35rem 1rem;font-size:.78rem;border-radius:999px;border:1px solid rgba(200,120,255,.35);background:rgba(160,90,255,.1);color:#e4ecff}",
    ".rezHero{display:flex;align-items:center;gap:.5rem}.rezHero h2{margin:0}.rezBackBtn{width:2.75rem;height:2.75rem;min-height:2.75rem;padding:0;border-radius:50%;border:1px solid rgba(200,120,255,.35);background:rgba(160,90,255,.1);color:#e4ecff;font-size:1.4rem;line-height:1}",
    "#rezBody{margin:.3rem 0 .8rem;padding:.8rem .85rem .9rem;background:linear-gradient(180deg,rgba(40,18,62,.78),rgba(14,8,24,.92))!important;border:1px solid rgba(200,120,255,.22)!important;border-radius:1.1rem!important}",
    ".rzRh{margin:.8rem 0 .3rem;font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:#d6a6ff}.rzRh:first-child{margin-top:0}",
    ".rzRl{margin:.12rem 0;font-size:.9rem;line-height:1.45;color:#f1e1ff}.rzRn{margin:.35rem 0;font-size:.72rem;line-height:1.4;color:#a994c4}.rzWann{color:#cdbbe8}",
    ".rzCh{display:flex;flex-wrap:wrap;gap:.35rem}.rzCh button{min-height:2.75rem;padding:.3rem .85rem;font-size:.78rem;border-radius:999px;border:1px solid rgba(200,120,255,.25);background:transparent;color:#cdbbe8}.rzCh button.on{background:rgba(160,90,255,.24);color:#f6e6ff;border-color:rgba(200,120,255,.65);box-shadow:0 0 8px rgba(200,120,255,.28)}",
    ".rzCh .tS.on{background:rgba(46,204,113,.14);border-color:rgba(95,224,160,.6);color:#5fe0a0}.rzCh .tH.on{background:rgba(231,76,60,.14);border-color:rgba(255,84,112,.6);color:#ff7a8e}",
    ".rzRi{display:block;width:100%;margin:.5rem 0 0;min-height:2.75rem;font-size:.9rem}.rzTa{min-height:4rem;resize:vertical;font-family:inherit}",
    ".rzVb{display:flex;gap:.5rem;margin-top:.8rem}.rzVb .btn{flex:1;min-height:2.75rem}",
    ".rzV h4{margin:.1rem 0 .4rem;font-family:Georgia,serif;font-weight:400;font-size:1.25rem;color:#f1e1ff}.rzVk{margin:0;font-size:.62rem;letter-spacing:.12em;color:#a994c4}",
    ".rzCnt{margin:.9rem 0 0;text-align:center}.rzCq{margin:0 0 .6rem;font-family:Georgia,serif;font-size:1rem;line-height:1.4;color:#f1e1ff}",
    ".rzCb{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.2rem;width:100%;min-height:7.5rem;border-radius:1.4rem;border:1px solid rgba(200,120,255,.5);background:radial-gradient(circle at 50% 40%,rgba(160,90,255,.28),rgba(20,10,34,.6));color:#f6e6ff;box-shadow:0 0 18px rgba(160,90,255,.25)}.rzCb:active{box-shadow:0 0 28px rgba(200,120,255,.55);transform:scale(.99)}",
    ".rzCn{font-family:Georgia,serif;font-size:2.4rem;line-height:1.1}.rzCb small{font-size:.7rem;color:#cdbbe8}.rzCb.fertig{border-color:rgba(95,224,160,.6);box-shadow:0 0 22px rgba(95,224,160,.25)}",
    "@media (prefers-reduced-motion:reduce){.rzCb:active{transform:none}}",
    ".rzLink{display:block;margin:.7rem auto 0;background:none;border:0;color:#a994c4;font-size:.76rem;text-decoration:underline;min-height:2.75rem}",
    ".rzSv{list-style:none;margin:0;padding:0}.rzSv li{display:flex;gap:.3rem;align-items:center;border-top:1px solid rgba(200,120,255,.12)}.rzOpen{flex:1;text-align:left;background:none;border:0;padding:.5rem 0;min-height:2.75rem;color:#f1e1ff}.rzOpen b{display:block;font-weight:500;font-size:.9rem}.rzOpen small{font-size:.68rem;color:#a994c4}.rzDel{min-height:2.75rem;width:2.75rem;height:2.75rem;border-radius:50%;border:1px solid rgba(200,120,255,.25);background:transparent;color:#a994c4;padding:0}"
  ].join("");
  document.head.appendChild(css);
  window.RR25_REZEPT={list:rez,open:open,close:close,satz:zSatz};
})();
