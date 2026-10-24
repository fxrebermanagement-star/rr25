/* ritual-x.js — Build 119: «Ritual X» ersetzt den Ritualbauer (ehemals ritual-b83.js). Ein Satz oben formt das Ritual, alles bleibt einstellbar.
   Speicher unveraendert (rr25_rezepte, rr25_zugang_v1), alte Rituale sind sofort da.
   Vorher: ritual-b83.js — Ritualbauer (Build 83, Build 86 ausgebaut): eigene Vollseite «Ritualbauer».
   Ablauf: Absicht (freier Satz, Themen als Vorschläge) · Für wen (mich, Person, Situation) · Ton Soft/Hard · Zutaten (Favoriten zuerst)
   · Hinweis, wann es passt (Tradition) -> Schritte: Vorbereitung, Standort, Absicht, Ich, Spiel, Quelle (Hard: Rückkehr, Anker).
   Danach Echo/Wirkung (rr25_tags_v1, fliesst ins Absicht-Tagebuch) und Chronik-Eintrag mit Absicht und «für wen».
   Build 113: 3·6·9 wie die festen Rituale (Absicht 3×, Zugang bzw. Spiel 6×, Vollendung 9×), Zugang pro Person (rr25_zugang_v1),
   Ton Soft/Grenze/Hard/Feld, Richtung Segen/Fluch, Wesenheit mit/ohne, Sätze folgen der Wahl, Bearbeiten, Löschen mit Rückfrage,
   Chronik-Eintrag mit Ton (e.tone) und Kalenderfarbe (e.kal).
   Speicher: rr25_rezepte (abwärtskompatibel, Präfix rr25: in Sichern/Wiederherstellen). Daten aus dem Lexikon (nur lesen). */
(function(){
  if(window.__rr25b83) return; window.__rr25b83=1;
  var KR="rr25_rezepte", KFAV="rr25_rz_fav", KT="rr25_tags_v1";
  var TH=[["schutz","Schutz"],["ruhe","Ruhe"],["herz","Herz"],["klaerung","Klärung"],["mut","Mut"],["heilung","Heilung"],["fuelle","Fülle"],["traum","Traum und Schwelle"],["ende","Abschluss"]];
  var SATZ={schutz:"Ich bin geschützt. Mein Feld ist geschlossen.",ruhe:"Ich bin ruhig. Ich lasse los.",herz:"Mein Herz ist offen und klar.",klaerung:"Ich sehe klar.",mut:"Ich bin mutig und ruhig.",heilung:"Ich lasse Heilung zu, in meinem Tempo.",fuelle:"Ich bin versorgt. Genug ist da.",traum:"Ich gehe sanft über die Schwelle.",ende:"Es ist gut. Ich schliesse ab."};
  /* Build 113: Sätze für eine Person (Segen) und als Fluch, [N] = Name */
  var SATZP={schutz:"[N] ist geschützt. Das Feld um [N] ist geschlossen.",ruhe:"[N] ist ruhig. [N] darf loslassen.",herz:"Das Herz von [N] ist offen und klar.",klaerung:"[N] sieht klar.",mut:"[N] ist mutig und ruhig.",heilung:"Heilung findet den Weg zu [N], im eigenen Tempo.",fuelle:"[N] ist versorgt. Genug ist da.",traum:"[N] geht sanft über die Schwelle.",ende:"Es ist gut. Für [N] ist es abgeschlossen."};
  var SATZF={schutz:"Was von [N] kommt, prallt ab und geht zurück zu [N].",ruhe:"[N] findet keine Ruhe, bis es gut ist.",herz:"Das Herz von [N] zeigt sich, wie es ist.",klaerung:"Was [N] verbirgt, kommt ans Licht.",mut:"Der Mut von [N] trägt nicht weiter als bis hier.",heilung:"Was [N] gesetzt hat, kehrt zu [N] zurück.",fuelle:"Was [N] genommen hat, geht dahin zurück, wo es hingehört.",traum:"[N] trägt die eigenen Träume, nicht meine.",ende:"Zwischen [N] und mir ist es zu Ende."};
  var SATZG={schutz:"Meine Grenze steht. Bis hierher und nicht weiter.",ruhe:"Meine Ruhe gehört mir. Die Grenze steht.",ende:"Es ist zu Ende. Die Grenze steht."};
  var TONS=[["Soft","tS"],["Grenze","tG"],["Hard","tH"],["Feld","tF"]];
  /* Überlieferung: Wochentag (0 So … 6 Sa) und Mondphase, in eigenen Worten, als Tradition */
  var TRAD={schutz:{d:[2,6],m:["ab","neu"]},ruhe:{d:[1],m:["ab","neu"]},herz:{d:[5],m:["zu","voll"]},klaerung:{d:[3],m:["zu","voll"]},mut:{d:[2],m:["zu"]},heilung:{d:[0,1],m:["zu"]},fuelle:{d:[4],m:["zu","voll"]},traum:{d:[1],m:["voll","neu"]},ende:{d:[6],m:["ab","neu"]}};
  var DL=["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"], PN=["Sonne","Mond","Mars","Merkur","Jupiter","Venus","Saturn"];
  var MK={neu:"Neumond",zu:"zunehmender Mond",voll:"Vollmond",ab:"abnehmender Mond"};
  var ZA={"1":"den Anfang","2":"das Gegenüber","3":"das Wachstum","4":"den Boden","5":"die Bewegung","6":"den Ausgleich","7":"den Rückzug","8":"den Fluss","9":"den Abschluss"};
  var HM={"Wasser":"Stelle ein Glas Wasser bereit.","Kerze":"Zünde eine Kerze an und stell sie sicher hin.","Weihrauch":"Räuchere ein wenig Weihrauch, Fenster einen Spalt offen.","Myrrhe":"Räuchere ein wenig Myrrhe, Fenster einen Spalt offen.","Messer":"Lege das Messer bereit, nur zum Zeigen, nicht zum Schneiden.","Nagel":"Lege einen Nagel bereit.","Schlüssel":"Nimm einen Schlüssel in die Hand.","Spiegel":"Stelle den Spiegel bereit, Spiegelseite nach aussen.","Glocke":"Läute die Glocke einmal zum Anfang.","Faden":"Halte einen Faden bereit.","Besen":"Stelle den Besen bereit.","Schwefel":"Schwefel nur als Wort: schreib ihn auf, verbrenne nichts.","Kreide":"Nimm die Kreide zur Hand.","Salz":"Stelle eine Prise Salz bereit.","Wein":"Stelle ein Glas Wein bereit, ein Schluck genügt."};
  function low(x){ return x.charAt(0).toLowerCase()+x.slice(1); }
  function kurz(e){ return e.cat==="zahlen"&&e.num?"Zahl "+e.num:String(e.name).replace(" / "," oder "); }
  function zSatz(e){
    var n=String(e.name).replace(" / "," oder ");
    switch(e.cat){
      case "zahlen": return e.num&&ZA[e.num]?"Atme in die Zahl "+e.num+", "+ZA[e.num]+".":"Atme ruhig in die Zahl "+n+".";
      case "kraeuter": return "Nimm "+n+" dazu, als Duft, Tee oder Bild.";
      case "steine": return "Nimm einen Stein in die Hand: "+n+".";
      case "kerzen": return e.id==="kerze"?"Zünde eine Kerze an und stell sie sicher hin.":"Zünde die "+low(n)+" an und stell sie sicher hin.";
      case "werkzeuge": return HM[n]||"Lege "+n+" bereit, als Zeichen für deine Absicht.";
      case "opfer": return "Stelle als Gabe bereit: "+n+". Ein wenig reicht, mit einem Danke.";
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
  var S0=function(){ return {th:"",ton:"Soft",txt:"",fm:"ich",fw:"",sel:[],name:"",_txtAuto:"",rt:"Segen",wes:false,eid:"",xs:""}; };
  var MSG="", ASK=-1, UNDO=null;
  var S=S0(), VIEW=null;
  function js(k,d){ try{ var v=JSON.parse(localStorage.getItem(k)); return v==null?d:v; }catch(e){ return d; } }
  function buzz(full){ try{ if(navigator.vibrate) navigator.vibrate(full?[40,50,80,50,140]:[55]); }catch(e){} }
  /* alte gespeicherte Rezepte mit Quelle 9x: heute Quelle 3x «So sei es» */
  function repOf(st){ var x=st&&st[2]&&st[2].rep?st[2]:null; return x&&x.rep>=9&&/^Quelle/.test(st[0])?{rep:3,txt:x.txt||"So sei es.",full:1}:x; }
  /* Build 113: Zugang pro Person, gleicher Speicher wie die festen Rituale (Build 109: «*|name») */
  function zgGet(n){ try{ var d=JSON.parse(localStorage.getItem("rr25_zugang_v1")||"{}"); return d["rz|"+String(n||"").toLowerCase()]||d["*|"+String(n||"").toLowerCase()]||""; }catch(e){ return ""; } }
  function zgPut(n,v){ if(!n) return; try{ var d=JSON.parse(localStorage.getItem("rr25_zugang_v1")||"{}"), k=String(n).toLowerCase(); if(v){ d["rz|"+k]=v; d["*|"+k]=v; } localStorage.setItem("rr25_zugang_v1",JSON.stringify(d)); }catch(e){} }
  function h(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function favs(){ var f=js(KFAV,[]); return Array.isArray(f)?f:[]; }
  function rez(){ var r=js(KR,[]); return Array.isArray(r)?r:[]; }
  function setRez(r){ try{ localStorage.setItem(KR,JSON.stringify(r)); }catch(e){} }
  function loadLex(){
    if(DATA||st) return; st=1;
    function one(u){ return fetch(u,{cache:"no-store"}).then(function(r){ if(!r.ok) throw 0; return r.json(); }); }
    Promise.all([one("resonanzen-a.json?v=114"),one("resonanzen-b.json?v=114"),one("resonanzen-c.json?v=114"),one("resonanzen-d.json?v=114"),one("resonanzen-links.json?v=114")]).then(function(p){
      DATA=[].concat(p[0]||[],p[1]||[],p[2]||[],p[3]||[]); LINKS=p[4]||{}; paint();
    }).catch(function(){ st=0; });
  }
  /* Build 114: Lexikon-Töne Soft, Grenze, Hard, Feld (wie Kalender). Hard erlaubt alles, Grenze und Feld je ihren Ton plus Soft. */
  function toneOk(e,ton){ if(ton==="Hard") return true; var t=String(e.tone||"Soft"); return t==="Soft"||(ton==="Soft"&&t==="Grenze")||(ton==="Grenze"&&t==="Grenze")||(ton==="Feld"&&t==="Feld"); }
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
  function fuerTxt(s){ return s.fm!=="ich"&&s.fw.trim()?s.fw.trim():""; }
  function isP(s){ return s.fm==="person"&&!!fuerTxt(s); }
  /* Satz nach Wahl: Person (Segen/Fluch), Situation, ich; Grenze mit eigenem Satz */
  function autoSatz(s){
    var n=fuerTxt(s), th=s.th;
    if(isP(s)){ var M=s.rt==="Fluch"?SATZF:SATZP; return (M[th]||(s.rt==="Fluch"?"Was [N] gesetzt hat, kehrt zu [N] zurück.":"[N] ist gut begleitet. Das Gute findet den Weg.")).replace(/\[N\]/g,n); }
    var b=(s.ton==="Grenze"&&SATZG[th])||SATZ[th]||"";
    if(s.fm==="situation"&&n) return n+": "+(b?b.replace(/^Ich bin /,"Es ist ").replace(/^Ich /,"Es "):"Es wird gut.");
    return b;
  }
  function fuerLab(s){ var w=fuerTxt(s); return s.fm==="ich"||!w?"für mich":"für "+w; }
  /* Build 119: Ich · Spiel · Quelle wie bei den festen Ritualen (Ich 3×, Spiel 6×, Quelle 3× «So sei es» plus ein Satz einmal) */
  var X369={heilung:["Die Heilung sitzt.","Alles Störende löst sich.","Ich sehe es. Die Heilung ist gesetzt."],schutz:["Der Schutz ist stark.","Alles Fremde prallt ab.","Ich sehe es. Der Schutz steht."],
    herz:["Ich bin offen.","Liebe findet den Weg.","Ich sehe es. Es ist gesetzt."],klaerung:["Es wird klar.","Der Nebel löst sich.","Ich sehe es. Es ist klar."],mut:["Die Kraft ist da.","Die Energie fliesst.","Ich sehe es. Ich bin in der Kraft."],
    fuelle:["Ich bin versorgt.","Der Weg öffnet sich.","Ich sehe es. Es ist gesetzt."],ruhe:["Die Ruhe sitzt.","Alles Unruhige legt sich.","Ich sehe es. Es ist still und gut."],
    traum:["Die Schwelle ist offen.","Der Weg ist sanft.","Ich sehe es. Es ist getragen."],ende:["Die Verbindung löst sich.","Die Fäden fallen ab.","Ich sehe es. Es ist zu Ende."]};
  function x369(){ if(isP(S)&&S.rt==="Fluch") return ["Es sitzt.","Was gesetzt wurde, kehrt zurück.","Ich sehe es. Es ist gesetzt."]; return X369[S.th]||["Es sitzt.","Es findet den Weg.","Ich sehe es. Es ist gesetzt."]; }
  function build(){
    var hard=S.ton==="Hard", ab=(S.txt||"").trim()||autoSatz(S)||"So sei es.", w=fuerTxt(S), P=isP(S), fl=P&&S.rt==="Fluch";
    var z=S.sel.map(function(id){ return DATA&&DATA.filter(function(e){ return e.id===id; })[0]; }).filter(Boolean);
    var steps=[];
    steps.push(["Vorbereitung","Tu:|Ruhiger Ort. Wasser bereit."+(z.length?" Bereit: "+z.map(kurz).join(", ")+".":"")+(hard?"|Zeit für die Rückkehr einplanen. Anker bereithalten (Wasser, Salz).":"")+(S.wes?"|Für die Wesenheit: ein Licht oder ein Platz, der nur ihr gehört.":"")]);
    steps.push(["Standort","Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin der Spieler. Die Quelle ist wach."]);
    if(S.wes) steps.push(["Wesenheit · Einladung","Sprich:|Ich lade die Wesenheit ein, die mir wohlgesinnt ist. Nur für diesen Auftrag, nur für diese Zeit."]);
    steps.push(["Absicht","Sprich:|"+ab+(P&&!fl?"|Nur zum Guten.":"")]);
    var tu=z.length?z.map(zSatz):["Ein kleiner Schritt von mir, hier und jetzt: Kerze, Atem oder Wasser."];
    var tr=z.filter(function(e){ return e.text; }).map(function(e){ return kurz(e)+": "+e.text; });
    var spiel="Tu:|"+tu.join("|")+(tr.length?"||Aus der Tradition:|"+tr.join("|"):"");
    if(P){
      steps.push(["Zugang 🙏","Der Zugang ist dein Draht zu "+w+": der Name laut, ein Foto oder etwas, das du in der Hand hältst. Wähl, was "+w+" dir am nächsten bringt.",{rep:1,zg:1,txt:"Mein Zugang ist [Zugang], und ich weiss: Hier steht "+w+(fl?", und hier trifft es.":", und das trägt."),name:w}]);
      steps.push(["Spiel","Was tue ich für "+w+"?||"+spiel]);
    } else {
      steps.push(["Spiel","Was tue ich dafür?||"+spiel]);
    }
    var q=x369(); steps.push(["Ich ❤️","Jede Zeile laut. Antippen zählt.||Sprich dreimal:",{rep:3,txt:q[0]}]); steps.push(["Spiel 🙏","Sprich sechsmal:",{rep:6,txt:q[1]}]);
    steps.push(["Quelle 👁","Sprich dreimal «So sei es.» und tippe. Danach einmal den Quelle-Satz:|«"+q[2]+"»",{rep:3,txt:"So sei es.",full:1}]);
    steps.push(["So sei es","Sprich:|Versiegelt. Übergeben. So sei es."]);
    if(S.wes) steps.push(["Wesenheit · Dank","Sprich:|Danke. Der Auftrag ist bei dir. Du gehst deinen Weg, ich bleibe in meinem."]);
    var los=P?(fl?"Es ist gesetzt. Ich gehe raus. Nichts davon klebt an mir.":"Das Gute gehört "+w+". Die Last bleibt nicht bei mir. Ich bin wieder ich."):"Der Faden ist gelegt. Ich lasse los, er wirkt.";
    steps.push(["Lösen","Tu:|"+(P?"Zugang weglegen. Hände unter kaltes Wasser.":"Hände unter kaltes Wasser.")+"||Sprich:|"+los]);
    steps.push(["Rückkehr","Sprich:|"+(P?"Ich bin nicht "+w+". Ich kehre vollständig zurück.|":"Ich bin ganz bei mir.|")+"Meine Energie gehört mir.|Füsse. Atem. Raum.||Anker: Daumen und Zeigefinger zusammen. Eigener Vorname laut."]);
    if(hard) steps.push(["Anker","Tu:|Wasser trinken. Salz kurz berühren. Etwas Alltägliches tun.||Sprich:|Anker gesetzt. Ich bin zurück."]);
    steps.push(["Schluss","Sprich:|Danke, Feld.||Tu:|Wasser. Alltag."]);
    return steps;
  }
  /* Build 113: «Tu:»/«Sprich:» als kleine Marke, Fragen und Erklärungen als ruhiger Text */
  function stepHtml(t){
    return String(t).split("||").map(function(b){ var L=b.split("|"); var head=L.shift(); return (/:$/.test(head)?'<p class="rzRh">':'<p class="rzRq">')+h(head)+'</p>'+L.map(function(x){ return '<p class="rzRl">'+h(x)+'</p>'; }).join(""); }).join("");
  }
  function defName(){ var t=TH.filter(function(x){ return x[0]===S.th; })[0]; return (t?t[1]:"Eigenes")+" · "+S.ton+(isP(S)?" · "+fuerTxt(S):""); }
  function cur(){ return {id:S.eid||"rz"+Date.now().toString(36),v:3,rt:isP(S)?S.rt:"",wes:!!S.wes,name:(S.name||defName()).trim()||defName(),th:S.th,ton:S.ton,absicht:(S.txt||"").trim(),fuer:{m:S.fm,w:fuerTxt(S)},zut:S.sel.slice(),steps:build(),made:Date.now()}; }
  function viewer(r,i){
    var s=r.steps[i], last=i===r.steps.length-1, x=repOf(s), c=VIEW.c||0, n=x?x.rep:0;
    var zgi="", qt=x?x.txt:"";
    if(x&&x.zg){ if(VIEW.zg==null) VIEW.zg=zgGet(x.name); qt=x.txt.replace("[Zugang]",VIEW.zg||"…");
      zgi='<label class="rzZl">Mein Zugang ist …<input id="rzZg" class="rzRi" maxlength="160" placeholder="Name, Foto, Gegenstand, Ort, Gefühl" value="'+h(VIEW.zg||"")+'" autocomplete="off"></label>'+(VIEW.zg&&zgGet(x.name)===VIEW.zg?'<p class="rzRn">Gemerkt für '+h(x.name)+'. Du kannst es ändern.</p>':''); }
    var cnt=x?zgi+'<div class="rzCnt"><p class="rzCq" id="rzCq">'+h("«"+qt+"»")+'</p><button type="button" class="rzCb'+(c>=n?" fertig":"")+'" data-a="cnt" aria-live="polite"><span class="rzCn">'+c+' von '+n+'</span><small>'+(c>=n?"Geschafft":(c?"Weiter sprechen und tippen":(/^Absicht/.test(s[0])?"Sprich die Absicht und tippe":"Sprich den Satz und tippe")))+'</small></button></div>':'';
    return '<div class="rzV"><p class="rzVk">'+h(r.name)+' · '+(i+1)+' von '+r.steps.length+'</p><h4>'+h(s[0])+'</h4>'+stepHtml(s[1])+cnt+
      '<div class="rzVb"><button type="button" class="btn ghost" data-a="vb"'+(i===0?" disabled":"")+'>Zurück</button><button type="button" class="btn primary" data-a="vn">'+(last?"Abschliessen":"Weiter")+'</button></div></div><button type="button" class="rzLink" data-a="vx">Beenden</button>';
  }
  /* Status «Es ist so»: wie im Ritual-Runner (status() in ritual-runner-v2.js): nach dem letzten Schritt, optional, einmal */
  function status(){
    var on=!!VIEW.status;
    return '<div class="rzV"><h4>Status</h4><p class="rzRn">Optional, einmal. Feststellung statt Bitte. Nie Ersatz für So sei es.</p>'+
      '<div class="rzVb"><button type="button" class="btn ghost" data-a="stset"'+(on?" disabled":"")+'>'+(on?"Es ist so. Gesetzt.":"Es ist so")+'</button></div>'+
      '<div class="rzVb"><button type="button" class="btn primary" data-a="stnext">Weiter</button></div></div>';
  }
  function danach(){
    var E=VIEW.echo, W=VIEW.wirk, P=VIEW.pic;
    return '<div class="rzV"><h4>So sei es.</h4><p class="rzRn">Eine Zeile für später, nur wenn du magst: Echo ist, was zurückkommt. Wirkung ist, was sich bewegt.</p>'+
      '<div class="rzCh"><button type="button" data-tg="echo" class="'+(E?"on":"")+'" aria-pressed="'+!!E+'">Echo</button><button type="button" data-tg="wirk" class="'+(W?"on":"")+'" aria-pressed="'+!!W+'">Wirkung</button><button type="button" data-a="foto" class="'+(P?"on":"")+'">'+(P?"Foto neu":"Foto")+'</button></div>'+
      (P?'<div class="rzPic"><img alt="Foto zum Ritual" src="'+P+'"><button type="button" class="rzPicX" data-a="fotox" aria-label="Foto entfernen">Entfernen</button></div>':'')+
      '<input id="rzZeile" class="rzRi" maxlength="140" placeholder="Eine Zeile dazu (optional)" value="'+h(VIEW.zeile||"")+'" autocomplete="off">'+
      '<p class="rzRn">Das Foto bleibt nur auf diesem Gerät.</p>'+
      '<div class="rzVb"><button type="button" class="btn primary" data-a="done">Fertig</button></div></div>';
  }
  /* Foto: Kamera direkt, auf max. 1024 px verkleinert, JPEG 0.7, nur lokal (IndexedDB über fotoPut) */
  function shrink(file){
    return new Promise(function(res){
      var url=URL.createObjectURL(file), img=new Image();
      img.onload=function(){
        var w=img.naturalWidth||img.width, hh=img.naturalHeight||img.height, m=1024;
        if(w>m){ hh=Math.round(hh*m/w); w=m; } if(hh>m){ w=Math.round(w*m/hh); hh=m; }
        try{ var c=document.createElement("canvas"); c.width=w; c.height=hh; c.getContext("2d").drawImage(img,0,0,w,hh); URL.revokeObjectURL(url); res(c.toDataURL("image/jpeg",0.7)); }catch(e){ URL.revokeObjectURL(url); res(""); }
      };
      img.onerror=function(){ URL.revokeObjectURL(url); res(""); };
      img.src=url;
    });
  }
  function kamera(){
    var z=document.getElementById("rzZeile"); if(z) VIEW.zeile=z.value;
    var inp=document.createElement("input"); inp.type="file"; inp.accept="image/*"; inp.setAttribute("capture","environment");
    inp.style.cssText="position:fixed;left:-9999px;opacity:0"; document.body.appendChild(inp);
    inp.onchange=function(){
      var f=inp.files&&inp.files[0]; try{ inp.remove(); }catch(e){} if(!f) return;
      var v=VIEW; shrink(f).then(function(d){ if(d&&VIEW===v){ v.pic=d; paint(); } });
    };
    setTimeout(function(){ inp.click(); },30);
  }
  /* ===== Ritual X (Build 119): ein Satz oben, daraus wird das Ritual geformt. Alles bleibt darunter einstellbar. ===== */
  function xn(s){ return String(s||"").toLowerCase().replace(/ä/g,"ae").replace(/ö/g,"oe").replace(/ü/g,"ue").replace(/ß/g,"ss").replace(/[^a-z0-9 ]+/g," ").replace(/\s+/g," ").trim(); }
  var XTH=[["heilung",/heil|gesund|krank|schmerz|genes|operation|erholen|fieber/],["schutz",/schutz|schuetz|sicher|bewahr|abschirm|boese blick|neid/],["herz",/liebe|lieb |anzieh|herz|partner|beziehung|verlieb|freundschaft|dank|segen|segne/],
    ["ende",/trenn|loes|abschluss|beend|abschied|loslass|ende /],["mut",/energie|kraft|mut|power|antrieb|motivation|staerke/],["fuelle",/geld|fuelle|wohlstand|reich|finanz|job|arbeit|erfolg|kunden/],
    ["klaerung",/klar|klaer|entscheid|wahrheit|erkenn|verstehen/],["ruhe",/ruhe|ruhig|schlaf|angst|stress|frieden|entspann|sorge/],["traum",/traum|schwelle|ahnen|vorfahren|jenseits/]];
  var XTIER=["katze","kater","hund","huendin","pferd","vogel","hase","kaninchen","meerschweinchen","hamster","fisch","pony","esel","ziege","schaf","kuh","welpe","kaetzchen","tier"];
  var XPERS=["mama","mutter","papa","vater","sohn","tochter","bruder","schwester","oma","grossmutter","opa","grossvater","freundin","freund","partnerin","partner","mann","frau","kind","chef","chefin","nachbarin","nachbar","kollegin","kollege","tante","onkel","ex"];
  function cap(w){ return w.charAt(0).toUpperCase()+w.slice(1); }
  function xParse(raw){
    var t=" "+xn(raw)+" ", r={th:"",ton:"Soft",rt:"Segen",fm:"ich",fw:"",wes:false,tier:"",pers:""};
    var th=XTH.filter(function(x){ return x[1].test(t); }).map(function(x){ return x[0]; });
    /* Heilung und Schutz gehen vor dem allgemeinen Segen/Herz */
    r.th=th.indexOf("heilung")>=0?"heilung":th.indexOf("schutz")>=0?"schutz":th[0]||"";
    if(r.th==="herz"&&th.length>1&&!/liebe|anzieh|partner|beziehung|verlieb/.test(t)) r.th=th[1];
    if(/fluch|verfluch|rache|bestraf|heimzahl|zurueckschlag|soll leiden/.test(t)){ r.rt="Fluch"; r.ton="Hard"; }
    if(/ hard | hart | scharf/.test(t)) r.ton="Hard"; else if(/grenze|abgrenz|nein sagen/.test(t)) r.ton="Grenze"; else if(/ feld |feldarbeit/.test(t)) r.ton="Feld";
    else if(r.th==="ende"&&r.rt!=="Fluch") r.ton="Grenze";
    if(/wesen|engel|geist|krafttier|schutzgeist/.test(t)) r.wes=true;
    var nm=/(heisst|namens|name ist)\s+([a-z]+)/.exec(t), nameO=nm?String(raw).match(new RegExp("\\b("+nm[2]+")\\b","i")):null;
    XTIER.some(function(w){ if(new RegExp(" "+w+"[a-z]{0,2} ").test(t)){ r.tier=w; return true; } return false; });
    if(!r.tier) XPERS.some(function(w){ if(new RegExp(" (mein|meine|meinen|meinem|meiner|unser|unsere|fuer) "+w+"[a-z]{0,2} ").test(t)){ r.pers=w; return true; } return false; });
    if(!r.tier&&!r.pers){ var m=/\bf(?:ü|ue)r\s+([A-ZÄÖÜ][a-zäöüé]+)/.exec(String(raw)); if(m&&!/^(Mich|Uns|Heute|Morgen|Ruhe|Liebe|Geld|Schutz|Heilung)$/.test(m[1])) r.pers=m[1]; }
    if(r.tier||r.pers){ r.fm="person"; r.fw=nameO?cap(nameO[1]):(r.tier?cap(r.tier==="kaetzchen"?"Kätzchen":r.tier==="huendin"?"Hündin":r.tier):cap(r.pers)); }
    return r;
  }
  function xSatz(r){
    var tmp={fm:r.fm,fw:r.fw,th:r.th,rt:r.rt,ton:r.ton}, s=autoSatz(tmp);
    if(r.tier&&r.rt!=="Fluch"){ var fem=/^(katze|huendin|kuh|ziege|maus)$/.test(r.tier), wer=(r.fw.toLowerCase()===r.tier||/^(Kätzchen|Hündin)$/.test(r.fw))?(fem?"Meine ":"Mein ")+r.fw:r.fw;
      var XS={heilung:"Heilung findet den Weg, sanft und im eigenen Tempo.",schutz:"Ein warmer Schutz liegt um "+(fem?"sie":"ihn")+".",herz:"Liebe umhüllt "+(fem?"sie":"ihn")+".",ruhe:"Ruhe kehrt ein, tief und weich.",mut:"Neue Kraft fliesst, Schritt für Schritt."};
      s=wer+" ist gesegnet. "+(XS[r.th]||"Das Gute findet den Weg."); }
    return s;
  }
  function xMaterial(){
    if(!DATA) return [];
    var pool=vorschlag(), out=[];
    ["kerzen","kraeuter","steine","farben"].forEach(function(c){ if(out.length>=3) return; var e=pool.filter(function(x){ return x.cat===c&&out.indexOf(x.id)<0; })[0];
      if(!e) e=DATA.filter(function(x){ var l=LINKS[x.id]; return x.cat===c&&toneOk(x,S.ton)&&l&&(l.t||[]).indexOf(S.th)>=0; })[0];
      if(e) out.push(e.id); });
    return out;
  }
  function xFarbe(){ if(!DATA) return null; return DATA.filter(function(x){ var l=LINKS[x.id]; return x.cat==="farben"&&l&&(l.t||[]).indexOf(S.th)>=0; })[0]||null; }
  function xT(ms){ var d=new Date(ms); return DL[d.getDay()]+" "+d.getDate()+"."+(d.getMonth()+1)+"., "+String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0"); }
  /* Beste Zeit: Tradition (Wochentag und Mond) + Planetenstunde des Tagesplaneten + Ton-Fenster aus dem Kalender (Bern) */
  function xZeit(){
    var K=window.RR25_KAL, M=window.RR25_MOND, T=TRAD[S.th], out=[], now=Date.now(), best=null;
    try{
      if(T&&M){ for(var n=0;n<30&&!best;n++){ var d=new Date(); d=new Date(d.getFullYear(),d.getMonth(),d.getDate()+n,12).getTime(); var wd=new Date(d).getDay(), mk=""; try{ mk=M.day(d).key; }catch(e){}
        if(T.d.indexOf(wd)>=0&&T.m.indexOf(mk)>=0){ var pd=K?K.planetDay(d):[], hit=pd.filter(function(x){ return x.p===PN[wd]&&!x.nacht&&x.e>now; })[0]; best={d:d,ph:hit,mond:MK[mk]}; } } }
      if(best) out.push((best.ph?xT(best.ph.s)+" · Stunde von "+best.ph.p:DL[new Date(best.d).getDay()]+" "+new Date(best.d).getDate()+"."+(new Date(best.d).getMonth()+1)+".")+" · "+best.mond+".");
      else if(T) out.push("Als Tradition: "+T.d.map(function(i){ return DL[i]; }).join(" oder ")+", "+T.m.map(function(k){ return MK[k]; }).join(" oder ")+". In den naechsten 30 Tagen passt nicht beides, es geht auch so.".replace("naechsten","nächsten"));
      if(K&&S.ton==="Hard"){ var nx=K.next("HARD",now); out.push(nx?"Hard-Fenster: "+xT(nx.x.s)+" bis "+String(new Date(nx.x.e).getHours()).padStart(2,"0")+":"+String(new Date(nx.x.e).getMinutes()).padStart(2,"0")+".":"Im Kalender ist bald kein Hard-Fenster offen."); }
      else if(K&&(S.ton==="Soft"||S.ton==="Grenze")){ var ns=K.state(now); if(ns&&ns.tone==="SOFT") out.push("Jetzt ist ein Soft-Feld offen, es geht auch sofort."); }
      if(K){ var sz=K.seasons(best?best.d:now).map(function(x){ return String(x.sz||x.t||""); }).filter(function(x){ return /rückläufig/.test(x); });
        sz.forEach(function(x){ if(/Merkur/.test(x)) out.push("Merkur rückläufig: Worte vorher in Ruhe aufschreiben, langsam sprechen."); else if(/Venus/.test(x)) out.push("Venus rückläufig: bei Herz und Fülle lieber sanft, nichts erzwingen."); else out.push(x+": nur ein Hinweis."); }); }
    }catch(e){}
    return out;
  }
  function xHtml(){
    var o='<div class="rxTop"><label class="rxQ" for="rzX">Was liegt dir am Herzen?</label><textarea id="rzX" class="rzRi rzTa rxIn" maxlength="200" rows="2" placeholder="Zum Beispiel: Meine Katze ist krank, ich möchte für sie Segen und Heilung">'+h(S.xs||"")+'</textarea>'+
      '<button type="button" class="rxGo" data-a="xgo"><span class="rzhIc" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3.2l1.5 5.3 5.3 1.5-5.3 1.5L12 16.8l-1.5-5.3L5.2 10l5.3-1.5z"/></svg></span>Ritual formen</button></div>';
    if(S.xs&&!S.th){ o+='<div class="rxCard"><p class="rxH">Magst du mir noch sagen, worum es geht?</p><div class="rzCh">'+TH.map(function(t){ return '<button type="button" data-xth="'+t[0]+'">'+t[1]+'</button>'; }).join("")+'</div></div>'; }
    else if(S.xs&&S.th){
      var st=build(), P=isP(S), w=fuerTxt(S), thn=(TH.filter(function(x){ return x[0]===S.th; })[0]||["",""])[1], ab=(S.txt||"").trim()||autoSatz(S);
      var z=S.sel.map(function(id){ return DATA&&DATA.filter(function(e){ return e.id===id; })[0]; }).filter(Boolean), fb=xFarbe();
      var zt=xZeit(), los=st.filter(function(s){ return /^(Lösen|Anker|Schluss|Rückkehr)/.test(s[0]); });
      o+='<div class="rxCard"><p class="rxK">Dein Ritual</p><h3 class="rxT">'+h(thn)+' · '+h(S.ton)+(P?' · '+h(S.rt):'')+'</h3><p class="rxF">'+h(fuerLab(S))+(S.wes?' · mit Wesenheit':'')+'</p>'+
        '<p class="rxH">Beste Zeit</p>'+(zt.length?zt.map(function(x){ return '<p class="rxL">'+h(x)+'</p>'; }).join(""):'<p class="rxL">Jederzeit, in Ruhe.</p>')+
        (function(){ var q=x369(); return '<p class="rxH">Ablauf</p><p class="rxL"><b>Absicht</b> einmal: «'+h(ab)+'»</p>'+(P?'<p class="rxL"><b>Zugang</b> zu '+h(w)+': Name, Foto oder etwas in der Hand.</p>':'')+
        '<p class="rxH">Ich · Spiel · Quelle</p><p class="rxL"><b>❤️ 3×</b> «'+h(q[0])+'»</p><p class="rxL"><b>🙏 6×</b> «'+h(q[1])+'»</p><p class="rxL"><b>👁 3×</b> «So sei es.» und einmal «'+h(q[2])+'»</p>'+
        '<p class="rxL"><b>Siegel:</b> «Versiegelt. Übergeben. So sei es.»</p>'; })()+
        '<p class="rxH">Material</p><p class="rxL">'+(z.length?z.map(function(e){ return h(kurz(e)); }).join(" · "):"Kerze, Atem oder Wasser.")+(fb&&S.sel.indexOf(fb.id)<0?' · Farbe '+h(fb.name):'')+'</p>'+
        '<p class="rxH">Lösen und Anker</p>'+los.map(function(s){ var L=String(s[1]).split("|").filter(function(x){ return x&&!/:$/.test(x); }); return '<p class="rxL"><b>'+h(s[0])+':</b> '+h(L.join(" "))+'</p>'; }).join("")+
        '<div class="rzVb"><button type="button" class="btn ghost" data-a="start">Jetzt durchgehen</button><button type="button" class="btn primary" data-a="save">'+(S.eid?"Änderung speichern":"Speichern")+'</button></div>'+
        '<div class="rzVb"><button type="button" class="btn ghost" data-a="xplan">Vormerken</button></div>'+
        '<p class="rzRn">Nach dem Durchgehen steht es in der Chronik. Unten kannst du alles anpassen.</p></div>';
    }
    return o;
  }
  function xRun(){
    var i=document.getElementById("rzX"); var v=i?i.value.trim():""; S.xs=v; if(!v) return;
    var r=xParse(v); var keepTh=S.th;
    S.th=r.th; S.ton=r.ton; S.rt=r.rt; S.fm=r.fm; S.fw=r.fw; S.wes=r.wes; S.name=""; S.sel=[];
    S.txt=r.th?xSatz(r):""; S._txtAuto=""; S.sel=r.th?xMaterial():[]; S._x=r;
  }
  function xPlan(){
    var r=rez(), c0=cur(), ix=-1; r.forEach(function(x,j){ if(x.id===c0.id) ix=j; }); if(ix>=0) r[ix]=c0; else r.unshift(c0); setRez(r.slice(0,30));
    try{ var d=load(); d.planned=d.planned||[]; d.planned.unshift({pid:(typeof uid==="function"?uid():"p"+Date.now().toString(36)),id:"rz:"+c0.id,titel:"Ritual X · "+c0.name,wer:c0.fuer&&c0.fuer.w||""}); save(d); }catch(e){}
    S=S0(); MSG="Vorgemerkt ✦ Du findest es unter Geplant.";
  }
  function builderHtml(){
    var sv=rez(), out=xHtml()+'<p class="rxAnp">Anpassen</p>';
    if(!S.txt.trim()||S.txt===S._txtAuto){ S.txt=autoSatz(S); S._txtAuto=S.txt; }
    if(S.eid) out+='<p class="rzRn rzEd">Du bearbeitest «'+h(S.name||defName())+'».</p>';
    out+='<p class="rzRh">1 · Für wen</p><div class="rzCh"><button type="button" data-fm="ich" class="'+(S.fm==="ich"?"on":"")+'">Für mich</button><button type="button" data-fm="person" class="'+(S.fm==="person"?"on":"")+'">Für eine Person</button><button type="button" data-fm="situation" class="'+(S.fm==="situation"?"on":"")+'">Für eine Situation</button></div>';
    if(S.fm!=="ich") out+='<input id="rzFw" class="rzRi" maxlength="'+(S.fm==="person"?40:80)+'" placeholder="'+(S.fm==="person"?"Name":"Kurz beschrieben")+'" value="'+h(S.fw)+'" autocomplete="off">';
    if(S.fm==="person") out+='<div class="rzCh rzSub"><button type="button" data-rt="Segen" class="'+(S.rt!=="Fluch"?"on":"")+'">als Segen</button><button type="button" data-rt="Fluch" class="'+(S.rt==="Fluch"?"on":"")+'">als Fluch</button></div>';
    out+='<p class="rzRh">2 · Thema</p><div class="rzCh">'+TH.map(function(t){ return '<button type="button" data-th="'+t[0]+'" class="'+(S.th===t[0]?"on":"")+'">'+t[1]+'</button>'; }).join("")+'</div>';
    out+='<p class="rzRh">3 · Absicht</p><textarea id="rzRt" class="rzRi rzTa" maxlength="160" rows="2" placeholder="Dein eigener Satz …">'+h(S.txt)+'</textarea><p class="rzRn">Der Satz folgt deiner Wahl. Du kannst ihn frei ändern.</p>';
    out+='<p class="rzRh">4 · Ton</p><div class="rzCh">'+TONS.map(function(t){ return '<button type="button" data-ton="'+t[0]+'" class="'+t[1]+(S.ton===t[0]?" on":"")+'">'+t[0]+'</button>'; }).join("")+'</div>';
    out+='<div class="rzCh rzSub"><button type="button" data-wes="0" class="'+(!S.wes?"on":"")+'">ohne Wesenheit</button><button type="button" data-wes="1" class="'+(S.wes?"on":"")+'">mit Wesenheit</button></div>';
    if(S.ton==="Hard"){ var k=""; try{ k=window.RR25_KAL.state().kind; }catch(e){} out+='<p class="rzRn">Hard nur mit Rückkehr und Anker: beide Schritte sind fest eingebaut.'+(k&&k!=="HARD"?' Im Kalender ist gerade kein Hard-Fenster offen.':'')+'</p>'; }
    out+='<p class="rzRh">5 · Zutaten (bis 3, Favoriten zuerst)</p>';
    if(!DATA) out+='<p class="rzRn">Lexikon lädt…</p>';
    else { var F=favs(), v=vorschlag(); out+=v.length?'<div class="rzCh">'+v.map(function(e){ return '<button type="button" data-z="'+h(e.id)+'" class="'+(S.sel.indexOf(e.id)>=0?"on":"")+'">'+(F.indexOf(e.id)>=0?"★ ":"")+h(e.name)+'</button>'; }).join("")+'</div>':'<p class="rzRn">'+(S.th?"Dazu passt hier nichts. Das Ritual geht auch ohne Zutat.":"Wähle ein Thema, dann erscheinen passende Zutaten. Favoriten stehen immer zuerst.")+'</p>'; }
    if(DATA&&S.info){ var ie=DATA.filter(function(e){ return e.id===S.info; })[0]; if(ie) out+='<div class="rzZi" role="status"><b>'+h(ie.name)+'</b><span>'+h(ie.text)+'</span><button type="button" class="rzZiGo" data-lex="'+h(ie.id)+'">Im Lexikon ansehen</button></div>'; }
    var wn=wann(); if(wn) out+='<p class="rzRn rzWann">'+h(wn)+'</p>';
    var steps=build();
    out+='<p class="rzRh">Vorschau · '+steps.length+' Schritte</p><p class="rzRn">'+steps.map(function(s){ var x=repOf(s); return h(s[0].replace(/ [^\wÄÖÜäöü·]+$/,""))+(x?" "+x.rep+"×":""); }).join(" → ")+'</p>';
    out+='<input id="rzRname" class="rzRi" maxlength="40" placeholder="Name" value="'+h((S._dn=defName(),S.name||S._dn))+'" autocomplete="off">';
    out+='<div class="rzVb"><button type="button" class="btn ghost" data-a="start">Jetzt durchgehen</button><button type="button" class="btn primary" data-a="save">'+(S.eid?"Änderung speichern":"Speichern")+'</button></div>';
    if(S.eid) out+='<button type="button" class="rzLink" data-a="neu">Abbrechen, neues Ritual</button>';
    if(MSG) out+='<p class="rzMsg" role="status">'+h(MSG)+'</p>';
    if(UNDO) out+='<p class="rzMsg" role="status">Gelöscht. <button type="button" class="rzUndo" data-a="undo">Rückgängig</button></p>';
    if(sv.length){
      out+='<p class="rzRh">Meine Rituale</p><ul class="rzSv">'+sv.map(function(r,i){ var f=r.fuer&&r.fuer.w?" · für "+h(r.fuer.w):"";
        if(ASK===i) return '<li class="rzAsk"><span>Wirklich löschen?</span><button type="button" class="rzYes" data-dy="'+i+'">Löschen</button><button type="button" class="rzNo" data-a="dno">Nein</button></li>';
        return '<li><button type="button" class="rzOpen" data-r="'+i+'"><b>'+h(r.name)+'</b><small>'+h(r.ton)+(r.rt?' · '+h(r.rt):'')+' · '+r.steps.length+' Schritte'+f+'</small></button><button type="button" class="rzEdit" data-e="'+i+'" aria-label="Ritual bearbeiten">Bearbeiten</button><button type="button" class="rzDel" data-d="'+i+'" aria-label="Ritual löschen">×</button></li>'; }).join("")+'</ul>';
    }
    return out;
  }
  function keep(){
    var t=document.getElementById("rzRt"), n=document.getElementById("rzRname"), w=document.getElementById("rzFw");
    if(t) S.txt=t.value; if(n) S.name=(n.value===S._dn)?"":n.value; if(w) S.fw=w.value;
  }
  function bind(p){
    function all(sel,fn){ [].slice.call(p.querySelectorAll(sel)).forEach(fn); }
    MSG="";
    all("[data-th]",function(b){ b.onclick=function(){ keep(); S.th=b.getAttribute("data-th"); S.sel=[]; paint(); }; });
    all("[data-xth]",function(b){ b.onclick=function(){ var r=xParse(S.xs||""); r.th=b.getAttribute("data-xth"); S.th=r.th; S.ton=r.ton; S.rt=r.rt; S.fm=r.fm; S.fw=r.fw; S.wes=r.wes; S.txt=xSatz(r); S._txtAuto=""; S.sel=xMaterial(); paint(); }; });
    var xi=document.getElementById("rzX"); if(xi) xi.addEventListener("input",function(){ S.xs=xi.value; });
    all("[data-rt]",function(b){ b.onclick=function(){ keep(); S.rt=b.getAttribute("data-rt"); paint(); }; });
    all("[data-wes]",function(b){ b.onclick=function(){ keep(); S.wes=b.getAttribute("data-wes")==="1"; paint(); }; });
    all("[data-e]",function(b){ b.onclick=function(){ var r=rez()[+b.getAttribute("data-e")]; if(!r) return; var f=r.fuer||{};
      S={th:r.th||"",ton:r.ton||"Soft",txt:r.absicht||"",fm:f.m||"ich",fw:f.w||"",sel:(r.zut||[]).slice(),name:r.name||"",_txtAuto:"",rt:r.rt||"Segen",wes:!!r.wes,eid:r.id};
      if(S.name===defName()) S.name=""; ASK=-1; UNDO=null; paint(); window.scrollTo(0,0); }; });
    all("[data-dy]",function(b){ b.onclick=function(){ var a=rez(), i=+b.getAttribute("data-dy"); UNDO={i:i,r:a[i]}; a.splice(i,1); setRez(a); ASK=-1; paint(); }; });
    var fwi=document.getElementById("rzFw"); if(fwi) fwi.addEventListener("input",function(){ var auto=S.txt===S._txtAuto, t=document.getElementById("rzRt"); if(t&&t.value!==S.txt) auto=false; S.fw=fwi.value; if(auto&&t){ S.txt=autoSatz(S); S._txtAuto=S.txt; t.value=S.txt; } });
    var zgi=document.getElementById("rzZg"); if(zgi) zgi.addEventListener("input",function(){ VIEW.zg=zgi.value.trim(); var x=repOf(VIEW.r.steps[VIEW.i]), q=document.getElementById("rzCq"); if(q&&x) q.textContent="«"+x.txt.replace("[Zugang]",VIEW.zg||"…")+"»"; });
    all("[data-fm]",function(b){ b.onclick=function(){ keep(); S.fm=b.getAttribute("data-fm"); paint(); if(S.fm!=="ich"){ var i=document.getElementById("rzFw"); if(i) i.focus(); } }; });
    all("[data-ton]",function(b){ b.onclick=function(){ keep(); S.ton=b.getAttribute("data-ton"); S.sel=[]; paint(); }; });
    all("[data-z]",function(b){ b.onclick=function(){ keep(); var id=b.getAttribute("data-z"), i=S.sel.indexOf(id); if(i>=0) S.sel.splice(i,1); else if(S.sel.length<3) S.sel.push(id); S.info=id; paint(); }; });
    all("[data-lex]",function(b){ b.onclick=function(){ var id=b.getAttribute("data-lex"); VIEW=null; if(window.RR25_RESO) window.RR25_RESO.open(id); }; });
    all("[data-r]",function(b){ b.onclick=function(){ var r=rez()[+b.getAttribute("data-r")]; if(r){ VIEW={r:r,i:0}; paint(); } }; });
    all("[data-d]",function(b){ b.onclick=function(){ ASK=+b.getAttribute("data-d"); paint(); }; });
    all("[data-tg]",function(b){ b.onclick=function(){ var z=document.getElementById("rzZeile"); if(z) VIEW.zeile=z.value; var k=b.getAttribute("data-tg"); VIEW[k]=!VIEW[k]; paint(); }; });
    all("[data-a]",function(b){ b.onclick=function(){
      var a=b.getAttribute("data-a");
      if(a==="start"){ keep(); VIEW={r:cur(),i:0}; }
      else if(a==="save"){ keep(); var r=rez(), c0=cur(), ix=-1; r.forEach(function(x,j){ if(x.id===c0.id) ix=j; }); if(ix>=0) r[ix]=c0; else r.unshift(c0); setRez(r.slice(0,30)); S=S0(); UNDO=null; ASK=-1; paint(); MSG="Gespeichert ✦"; var mm=document.createElement("p"); mm.className="rzMsg"; mm.setAttribute("role","status"); mm.textContent=MSG; var bb=document.getElementById("rezBody"), sv0=bb&&bb.querySelector(".rzSv"); if(bb){ if(sv0) bb.insertBefore(mm,sv0.previousElementSibling); else bb.appendChild(mm); } MSG=""; setTimeout(function(){ try{ mm.remove(); }catch(e){} },2600); return; }
      else if(a==="neu"){ S=S0(); }
      else if(a==="xgo"){ xRun(); }
      else if(a==="xplan"){ keep(); xPlan(); }
      else if(a==="undo"){ if(UNDO){ var ru=rez(); ru.splice(Math.min(UNDO.i,ru.length),0,UNDO.r); setRez(ru); } UNDO=null; }
      else if(a==="dno"){ ASK=-1; }
      else if(a==="cnt"){ var st=VIEW.r.steps[VIEW.i], x=repOf(st); if(x&&x.zg){ if(!VIEW.zg){ var zi=document.getElementById("rzZg"); if(zi) zi.focus(); return; } zgPut(x.name,VIEW.zg); VIEW.zgUsed=VIEW.zg; } if(x&&(VIEW.c||0)<x.rep){ VIEW.c=(VIEW.c||0)+1; if(VIEW.c>=x.rep){ buzz(!!x.full); var v=VIEW, ii=v.i; setTimeout(function(){ if(VIEW===v&&v.i===ii&&!v.fin){ v.c=0; if(v.i<v.r.steps.length-1) v.i++; else v.fin=true; paint(); } },900); } } }
      else if(a==="vb"){ VIEW.i=Math.max(0,VIEW.i-1); VIEW.c=0; }
      else if(a==="vn"){ var xs=repOf(VIEW.r.steps[VIEW.i]); if(xs&&xs.zg&&VIEW.zg){ zgPut(xs.name,VIEW.zg); VIEW.zgUsed=VIEW.zg; } VIEW.c=0; if(VIEW.i<VIEW.r.steps.length-1) VIEW.i++; else VIEW.fin=true; }
      else if(a==="stset"){ VIEW.status=true; }
      else if(a==="stnext"){ VIEW.sdone=true; }
      else if(a==="vx"){ VIEW=null; }
      else if(a==="foto"){ kamera(); return; }
      else if(a==="fotox"){ var z0=document.getElementById("rzZeile"); if(z0) VIEW.zeile=z0.value; VIEW.pic=""; }
      else if(a==="done"){ var z=document.getElementById("rzZeile"); if(z) VIEW.zeile=z.value; fin(VIEW); VIEW=null; S=S0(); close(); return; }
      paint();
    }; });
    var pi=p.querySelector(".rzPic img"); if(pi) pi.onclick=function(){ if(window._zoomPic) window._zoomPic(pi.src); };
    var ta=document.getElementById("rzRt"); if(ta) ta.addEventListener("input",function(){ S.txt=ta.value; });
  }
  function fin(V){
    var r=V.r;
    try{
      var fw=r.fuer&&r.fuer.w?r.fuer.w:"", pers=!!(r.fuer&&r.fuer.m==="person"&&fw), fl=r.fuer&&r.fuer.m==="ich"?"für mich":(fw?"für "+fw:"");
      var id=typeof uid==="function"?uid():("r"+Date.now().toString(36));
      var tone=String(r.ton||"Soft").toLowerCase(); if(!/^(soft|hard|grenze|feld)$/.test(tone)) tone="soft";
      var kal=""; try{ kal=String(window.RR25_KAL.state().kind||""); }catch(e){}
      if(typeof load==="function"&&typeof save==="function"){
        var d=load(); d.log=d.log||[];
        var zl=(V.zeile||"").trim(), ab=r.absicht||"";
        var e={id:id,t:typeof now==="function"?now():new Date().toLocaleString("de-CH"),ms:Date.now(),titel:"Ritual X · "+r.name,wer:pers?fw:(r.fuer&&r.fuer.m==="situation"?fw:""),note:zl||ab,absicht:ab,fuer:fl,zeile:zl,tone:tone,kal:kal,wesen:!!r.wes,bauer:r.id};
        if(pers){ e.person=true; e.richtung=r.rt||"Segen"; if(V.zgUsed) e.zugang=V.zgUsed; if(V.echo&&zl){ e.echo=zl; e.echoT=Date.now(); e.note=ab; } }
        d.log.unshift(e);
        if(V.pic){ d.log[0].pics=1; }
        save(d);
        if(V.pic&&typeof fotoPut==="function") fotoPut(id,[V.pic]).then(function(){ if(typeof paintLog==="function") paintLog(); });
        var tg=[]; if(V.echo) tg.push("Echo"); if(V.wirk) tg.push("Wirkung");
        if(tg.length){ var T=js(KT,{}); if(!T||typeof T!=="object"||Array.isArray(T)) T={}; T[String(id)]=tg; try{ localStorage.setItem(KT,JSON.stringify(T)); }catch(e){} }
        if(typeof paintLog==="function") paintLog();
      }
    }catch(e){ console.warn("rr25 ritualbauer fin",e); }
  }
  function paint(){
    var body=document.getElementById("rezBody"); if(!body) return;
    body.innerHTML=VIEW?(VIEW.fin?(VIEW.sdone?danach():status()):viewer(VIEW.r,VIEW.i)):builderHtml(); bind(body);
  }
  function ensure(){
    if(document.getElementById("rezept")) return;
    var main=document.querySelector("main"); if(!main) return;
    var s=document.createElement("section"); s.className="screen"; s.id="rezept";
    s.innerHTML='<div class="hero rezHero"><button type="button" id="rezBack" class="rezBackBtn" aria-label="Zurück">‹</button><h2>Ritual X</h2></div><div id="rezBody" class="card"></div>';
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
    /* Build 114: kompakt neben der Suche */
    var slot=document.getElementById("rzBauSlot");
    var w=document.createElement(slot?"span":"div"); w.id="rzRezept";
    w.innerHTML='<button type="button" class="btn ghost" id="rzRezBtn" aria-label="Ritual X öffnen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 19.4h10M8.4 19.4c-.6-3.4 0-6 3.6-8.4 3.6 2.4 4.2 5 3.6 8.4"/><path d="M12 11V8.6M12 6.2l.01 0M9.2 5.2l.01 0M14.8 5.2l.01 0"/></svg>Ritual X</button>';
    if(slot) slot.appendChild(w); else root.insertBefore(w,top); w.querySelector("#rzRezBtn").onclick=open;
  }
  ensure(); mount(); setTimeout(mount,500);
  if(typeof show==="function"&&!show._b83){ var sh=show; show=function(id){ var r=sh.apply(this,arguments); if(id==="resonanzen") setTimeout(mount,200); return r; }; show._b83=1; }
  var css=document.createElement("style");
  css.textContent=[
    "#rzRezept{margin:.1rem 0 .55rem}#rzBauSlot{flex:none}#rzBauSlot #rzRezept{margin:0;display:block}#rzRezBtn{display:inline-flex;align-items:center;gap:.3rem;white-space:nowrap;min-height:2.6rem;padding:.3rem .8rem;font-size:.78rem}",
    "#rzRezBtn svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}",
    ".rzZi{margin:.45rem 0 .2rem;padding:.55rem .7rem;border-left:2px solid #d6a6ff;border-radius:0 .7rem .7rem 0;background:rgba(10,4,24,.45)}.rzZi b{display:block;font-family:Georgia,serif;font-weight:500;color:#f1e8ff}.rzZi span{display:block;margin:.15rem 0 0;font-size:.82rem;line-height:1.45;color:#e6dcff}",
    ".rzZiGo{margin:.2rem 0 0 -.4rem;min-height:2.6rem;padding:0 .4rem;border:0;background:none;font:inherit;font-size:.78rem;color:#d6a6ff;text-decoration:underline;text-underline-offset:.2em}",
    "#rzRezBtn{border-radius:999px;border:1px solid rgba(200,120,255,.35);background:rgba(160,90,255,.1);color:#e4ecff}",
    ".rezHero{display:flex;align-items:center;gap:.5rem}.rezHero h2{margin:0}.rezBackBtn{width:2.75rem;height:2.75rem;min-height:2.75rem;padding:0;border-radius:50%;border:1px solid rgba(200,120,255,.35);background:rgba(160,90,255,.1);color:#e4ecff;font-size:1.4rem;line-height:1}",
    "#rezBody{margin:.3rem 0 .8rem;padding:.8rem .85rem .9rem;background:linear-gradient(180deg,rgba(40,18,62,.78),rgba(14,8,24,.92))!important;border:1px solid rgba(200,120,255,.22)!important;border-radius:1.1rem!important}",
    ".rzRh{margin:.8rem 0 .3rem;font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:#d6a6ff}.rzRh:first-child{margin-top:0}",
    ".rzRq{margin:.6rem 0 .35rem;font-family:Georgia,serif;font-size:1rem;line-height:1.45;color:#f1e1ff}.rzRq:first-child{margin-top:0}.rzRl{margin:.12rem 0;font-size:.9rem;line-height:1.45;color:#f1e1ff}.rzRn{margin:.35rem 0;font-size:.72rem;line-height:1.4;color:#a994c4}.rzWann{color:#cdbbe8}",
    ".rzCh{display:flex;flex-wrap:wrap;gap:.35rem}.rzCh button{min-height:2.75rem;padding:.3rem .85rem;font-size:.78rem;border-radius:999px;border:1px solid rgba(200,120,255,.25);background:transparent;color:#cdbbe8}.rzCh button.on{background:rgba(160,90,255,.24);color:#f6e6ff;border-color:rgba(200,120,255,.65);box-shadow:0 0 8px rgba(200,120,255,.28)}",
    ".rzCh .tS.on{background:rgba(46,204,113,.14);border-color:rgba(95,224,160,.6);color:#5fe0a0}.rzCh .tH.on{background:rgba(231,76,60,.14);border-color:rgba(255,84,112,.6);color:#ff7a8e}.rzCh .tG.on{background:rgba(255,159,67,.14);border-color:rgba(255,184,107,.6);color:#ffb86b}.rzCh .tF.on{background:rgba(166,107,255,.16);border-color:rgba(166,107,255,.65);color:#c9a6ff}.rzSub{margin-top:.45rem}.rzSub button{font-size:.72rem}",
    ".rzZl{display:block;margin:.6rem 0 0;font-size:.72rem;color:#cdbbe8}.rzMsg{margin:.6rem 0 0;text-align:center;font-size:.85rem;color:#5fe0a0}.rzUndo{background:none;border:0;color:#d6a6ff;text-decoration:underline;min-height:2.75rem;font-size:.85rem}.rzEd{color:#d6a6ff}",
    ".rzEdit{min-height:2.75rem;padding:0 .7rem;border-radius:999px;border:1px solid rgba(200,120,255,.25);background:transparent;color:#cdbbe8;font-size:.7rem}.rzSv li.rzAsk{justify-content:flex-end;padding:.3rem 0;color:#f1e1ff;font-size:.85rem}.rzAsk span{flex:1}.rzYes,.rzNo{min-height:2.75rem;padding:0 .9rem;border-radius:999px;border:1px solid rgba(255,84,112,.5);background:rgba(255,84,112,.12);color:#ff9aa8;font-size:.76rem}.rzNo{border-color:rgba(200,120,255,.3);background:transparent;color:#cdbbe8}",
    ".rzRi{display:block;width:100%;margin:.5rem 0 0;min-height:2.75rem;font-size:.9rem}.rzTa{min-height:4rem;resize:vertical;font-family:inherit}",
    ".rzVb{display:flex;gap:.5rem;margin-top:.8rem}.rzVb .btn{flex:1;min-height:2.75rem}",
    ".rzV h4{margin:.1rem 0 .4rem;font-family:Georgia,serif;font-weight:400;font-size:1.25rem;color:#f1e1ff}.rzVk{margin:0;font-size:.62rem;letter-spacing:.12em;color:#a994c4}",
    ".rzCnt{margin:.9rem 0 0;text-align:center}.rzCq{margin:0 0 .6rem;font-family:Georgia,serif;font-size:1rem;line-height:1.4;color:#f1e1ff}",
    ".rzCb{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.2rem;width:100%;min-height:7.5rem;border-radius:1.4rem;border:1px solid rgba(200,120,255,.5);background:radial-gradient(circle at 50% 40%,rgba(160,90,255,.28),rgba(20,10,34,.6));color:#f6e6ff;box-shadow:0 0 18px rgba(160,90,255,.25)}.rzCb:active{box-shadow:0 0 28px rgba(200,120,255,.55);transform:scale(.99)}",
    ".rzCn{font-family:Georgia,serif;font-size:2.4rem;line-height:1.1}.rzCb small{font-size:.7rem;color:#cdbbe8}.rzCb.fertig{border-color:rgba(95,224,160,.6);box-shadow:0 0 22px rgba(95,224,160,.25)}",
    "@media (prefers-reduced-motion:reduce){.rzCb:active{transform:none}}",
    ".rzPic{position:relative;margin:.7rem 0 0;display:flex;align-items:flex-end;gap:.7rem}.rzPic img{width:7rem;height:7rem;object-fit:cover;border-radius:1rem;border:1px solid rgba(200,120,255,.4);box-shadow:0 0 14px rgba(160,90,255,.25)}",
    ".rzPicX{min-height:2.75rem;padding:.3rem .9rem;border-radius:999px;border:1px solid rgba(200,120,255,.3);background:transparent;color:#cdbbe8;font-size:.76rem}",
    ".rzLink{display:block;margin:.7rem auto 0;background:none;border:0;color:#a994c4;font-size:.76rem;text-decoration:underline;min-height:2.75rem}",
    ".rzSv{list-style:none;margin:0;padding:0}.rzSv li{display:flex;gap:.3rem;align-items:center;border-top:1px solid rgba(200,120,255,.12)}.rzOpen{flex:1;text-align:left;background:none;border:0;padding:.5rem 0;min-height:2.75rem;color:#f1e1ff}.rzOpen b{display:block;font-weight:500;font-size:.9rem}.rzOpen small{font-size:.68rem;color:#a994c4}.rzDel{min-height:2.75rem;width:2.75rem;height:2.75rem;border-radius:50%;border:1px solid rgba(200,120,255,.25);background:transparent;color:#a994c4;padding:0}"
  ].join("");
  document.head.appendChild(css);
  /* Vormerken: Geplant-Eintrag mit id «rz:…» oeffnet das Ritual X direkt */
  if(typeof openR==="function"&&!openR._rx){ var o0=openR; openR=function(id,wer){ if(/^rz:/.test(String(id))){ var rid=String(id).slice(3), r=rez().filter(function(x){ return x.id===rid; })[0];
      try{ var d=load(); d.planned=(d.planned||[]).filter(function(p){ return p.id!==id; }); save(d); }catch(e){}
      if(r){ open(); VIEW={r:r,i:0}; paint(); } return; } return o0.apply(this,arguments); }; openR._rx=1; }
  window.RR25_RITUALX={open:open,close:close};
  window.RR25_REZEPT={list:rez,open:open,close:close,satz:zSatz};
})();
