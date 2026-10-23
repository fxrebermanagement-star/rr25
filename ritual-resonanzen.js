(function(){
  var DATA=[];
  /* Build 114: Opfergaben und Werkzeuge als eigene Gruppen, Einträge können zusätzlich in einer zweiten Gruppe stehen (e.also) */
  var CAT_LAB={kraeuter:"Kräuter",hausmittel:"Hausmittel",werkzeuge:"Werkzeuge",opfer:"Opfergaben",steine:"Steine",kerzen:"Kerzen",farben:"Farben",rauch:"Räucherwerk",zahlen:"Zahlen",fav:"★ Favoriten"};
  var TAB_ORDER=["kraeuter","hausmittel","werkzeuge","opfer","steine","kerzen","farben","rauch","zahlen","fav"];
  var INTRO={kraeuter:"Pflanzen als Helfer: als Tee, Duft oder Bild. Tradition und Erfahrung, kein Heilversprechen.",hausmittel:"Alltägliches aus Küche und Haus. Klein anwenden und klar bleiben.",steine:"Steine als Begleiter und Symbol: in die Hand nehmen, bei sich tragen oder hinlegen.",kerzen:"Eine Flamme, eine Absicht. Kerzen nie unbeaufsichtigt brennen lassen.",farben:"Farben als Stimmung: in Kleidung, Kerze, Tuch oder Blick.",zahlen:"Zahlen als Symbol, aus der Tradition. Sie zeigen eine Stimmung und sagen nichts voraus. Die Planeten folgen den magischen Quadraten (Agrippa).",rauch:"Räuchern ist ein alter Brauch. Immer kurz, mit Mass und bei offenem Fenster.",werkzeuge:"Dinge aus dem Haus, die im Ritual etwas zeigen: öffnen, binden, fegen, trennen. Meist reicht das Bild davon.",opfer:"Kleine Gaben zum Danken und Teilen. Was draussen liegt, soll Tieren und Natur gut tun, darum lieber wenig und unverarbeitet.",fav:"Deine gemerkten Einträge."};
  var PL_DAY={Sonne:"Sonntag",Mond:"Montag",Mars:"Dienstag",Merkur:"Mittwoch",Jupiter:"Donnerstag",Venus:"Freitag",Saturn:"Samstag"};
  var DAY_PL=["Sonne","Mond","Mars","Merkur","Jupiter","Venus","Saturn"];
  var TH_LAB={schutz:"Schutz",ruhe:"Ruhe",herz:"Herz",klaerung:"Klärung",mut:"Mut",heilung:"Heilung",fuelle:"Fülle",traum:"Traum und Schwelle",ende:"Abschluss"};
  var LINKS={}, lf=null, MEHR={}, openMore={};
  var KFAV="rr25_rz_fav", KNOTE="rr25_rz_note";
  /* Build 114: zusammengelegte Einträge, alte IDs zeigen auf den neuen (Favoriten, Notizen, gespeicherte Rituale) */
  var MERGE={kranewitt:"wacholder","raeucher-beifuss":"beifuss",lavendelbluete:"lavendel",rosenbluete:"rose"};
  function migrate(){
    try{
      var f=JSON.parse(localStorage.getItem(KFAV)||"[]"), ch=0;
      if(Array.isArray(f)){ var out=[]; f.forEach(function(id){ var n=MERGE[id]||id; if(n!==id) ch=1; if(out.indexOf(n)<0) out.push(n); else ch=1; }); if(ch) localStorage.setItem(KFAV,JSON.stringify(out)); }
      var no=JSON.parse(localStorage.getItem(KNOTE)||"{}"), cn=0;
      if(no&&typeof no==="object"&&!Array.isArray(no)){ Object.keys(MERGE).forEach(function(o){ if(no[o]==null) return; var n=MERGE[o], v=String(no[o]); no[n]=no[n]?(String(no[n]).indexOf(v)>=0?no[n]:(no[n]+"\n"+v).slice(0,600)):v; delete no[o]; cn=1; }); if(cn) localStorage.setItem(KNOTE,JSON.stringify(no)); }
      var rz=JSON.parse(localStorage.getItem("rr25_rezepte")||"[]"), cr=0;
      if(Array.isArray(rz)){ rz.forEach(function(r){ if(r&&Array.isArray(r.zut)){ var z=[]; r.zut.forEach(function(id){ var n=MERGE[id]||id; if(n!==id) cr=1; if(z.indexOf(n)<0) z.push(n); }); r.zut=z; } }); if(cr) localStorage.setItem("rr25_rezepte",JSON.stringify(rz)); }
    }catch(e){}
  }
  migrate();
  function lsGet(k,d){ try{ var v=JSON.parse(localStorage.getItem(k)); return v==null?d:v; }catch(e){ return d; } }
  function lsSet(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
  var favs=lsGet(KFAV,[]); if(!Array.isArray(favs)) favs=[];
  var notes=lsGet(KNOTE,{}); if(!notes||typeof notes!=="object"||Array.isArray(notes)) notes={};
  var openNote="", flash="";
  var tab="kraeuter", q="", toneF="", ready=0;

  var ICO={};
  /* Build 114: Töne wie im Kalender und im Ritualbauer. Tippen wählt, nochmals tippen hebt auf. */
  var TONE_CHIPS=[["Soft","Soft"],["Grenze","Grenze"],["Hard","Hard"],["Feld","Feld"]];
  /* Ton des heutigen Tages aus dem Kalender (RR25_KAL.state), für «Heute passend» */
  function dayKind(){ var k="SOFT"; try{ var S=window.RR25_KAL&&window.RR25_KAL.state&&window.RR25_KAL.state(Date.now()); if(S&&(S.tone||S.kind)) k=S.tone||S.kind; }catch(e){} return k; }
  function pathTones(k){ return k==="HARD"?["Soft","Grenze","Hard","Feld"]:k==="GRENZE"?["Soft","Grenze"]:(k==="ECHO"||k==="STILL")?["Soft","Feld"]:["Soft"]; }
  var KIND_LAB={SOFT:"Soft",HARD:"Hard",GRENZE:"Grenze",ECHO:"Echo",STILL:"Still"};
  function inCat(e,c){ return e.cat===c||(e.also||[]).indexOf(c)>=0; }
  function norm(x){ return String(x||"").toLowerCase().replace(/ä/g,"a").replace(/ö/g,"o").replace(/ü/g,"u"); }
  function wordStart(text,qq){ return (" "+norm(text)).replace(/[^a-z0-9]+/g," ").indexOf(" "+qq)>=0; }
  /* Suche: Name und Alias am Wortanfang, ab 3 Zeichen auch Wortanfänge im Text. Rang 0 = Name genau, 1 = Name beginnt so, 2 = Wort im Namen/Alias/Gruppe, 3 = Text */
  function rank(e){
    var qq=norm(q).replace(/[^a-z0-9 ]+/g," ").trim(); if(!qq) return 0;
    var nm=[e.name].concat(e.alias||[]);
    if(nm.some(function(n){ return norm(n)===qq; })) return 0;
    if(nm.some(function(n){ return norm(n).indexOf(qq)===0; })) return 1;
    var cl=[CAT_LAB[e.cat]].concat((e.also||[]).map(function(c){ return CAT_LAB[c]; })).join(" ");
    if(nm.some(function(n){ return wordStart(n,qq); })||wordStart(cl,qq)) return 2;
    if(qq.length>=3&&wordStart(e.text+" "+(notes[e.id]||"")+" "+moreText(e.id)+" "+e.tone,qq)) return 3;
    return -1;
  }

  var css=document.createElement("style");
  css.id="rr25-resonanzen";
  css.textContent=[
    "#mehrSheet .msGrid{grid-template-columns:repeat(2,1fr)!important}",
    "#mehrSheet .msItem[data-v=resonanzen] .ic{background:linear-gradient(160deg,#4a1f6a,#1e1030);color:#cfa8ff}",
    "#resonanzen .hero{margin:0 0 .2rem!important;padding:0!important;min-height:0!important}#resonanzen .hero h2{margin:0!important;font-size:1.35rem!important}#resonanzen>.rzHint{display:none}",
    "#resonanzen .rzTop{display:flex;flex-wrap:nowrap;gap:.4rem;align-items:center;margin:.1rem 0 .4rem}",
    "#resonanzen .rzSearch{margin:0;flex:1 1 auto;min-width:0;width:auto;min-height:2.6rem;font-size:.9rem}",
    "#resonanzen .rzFil{display:flex;flex-wrap:wrap;gap:.3rem;align-items:center;margin:0 0 .4rem}",
        "#resonanzen .rzTones{display:flex;flex-wrap:wrap;gap:.3rem;margin:0}",
    "#resonanzen .rzToneF{display:inline-flex;align-items:center;gap:.3rem;min-height:2rem;padding:0 .6rem;border-radius:999px;border:1px solid rgba(154,150,166,.45);background:rgba(20,10,34,.45);color:#d9d0e6;font:500 .74rem system-ui,sans-serif;letter-spacing:.01em}",
    "#resonanzen .rzToneF i{width:.42rem;height:.42rem;border-radius:50%;background:#9a96a6;flex:none}",
    "#resonanzen .rzToneF[data-tn=Soft]{border-color:rgba(46,204,113,.55)}#resonanzen .rzToneF[data-tn=Soft] i{background:#2ecc71}",
    "#resonanzen .rzToneF[data-tn=Grenze]{border-color:rgba(255,196,92,.6)}#resonanzen .rzToneF[data-tn=Grenze] i{background:#ffc45c}",
    "#resonanzen .rzToneF[data-tn=Feld]{border-color:rgba(179,107,255,.6)}#resonanzen .rzToneF[data-tn=Feld] i{background:#9a4dff}",
    "#resonanzen .rzToneF[data-tn=Hard]{border-color:rgba(255,84,112,.65)}#resonanzen .rzToneF[data-tn=Hard] i{background:#ff5470}",
    "#resonanzen .rzToneF.on{color:#eaf2ff;background:rgba(255,255,255,.06)}",
    "#resonanzen .rzTabs{display:flex;flex-wrap:wrap;gap:.28rem;margin:0 0 .45rem;overflow:visible!important;max-width:100%}",
    "#resonanzen .rzTabs .chip{min-height:2.15rem;padding:.2rem .62rem;font-size:.74rem;flex:0 0 auto;margin:0}",
    "#resonanzen .rzList{display:flex;flex-direction:column;gap:.4rem}",
    "#resonanzen .rzRow{position:relative;display:block;width:100%;text-align:left;border:1px solid rgba(200,120,255,.18);background:linear-gradient(180deg,rgba(48,18,72,.62),rgba(14,8,24,.9));border-radius:1.05rem;padding:.72rem .85rem .78rem;color:#eaf2ff}",
    "#resonanzen .rzRow.rzHas{display:flex;gap:.62rem;align-items:flex-start}",
    "#resonanzen .rzHas .rzMain{flex:1;min-width:0}",
    "#resonanzen .rzIco{flex:none;width:32px;height:32px;margin-top:.06rem;color:#cfa8ff;filter:drop-shadow(0 0 5px rgba(231,184,255,.7))}",
    "#resonanzen .rzIco svg{width:32px;height:32px;display:block;stroke:currentColor;fill:none;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round}",
    "#resonanzen .rzRow b{display:block;font-family:Georgia,serif;font-size:1.02rem;font-weight:500}",
    "#resonanzen .rzTone{display:inline-block;margin-top:.28rem;font-size:.64rem;letter-spacing:.1em;text-transform:uppercase;color:#cfa8ff;border:1px solid rgba(231,184,255,.35);border-radius:999px;padding:.12rem .5rem}",
    "#resonanzen .rzTone[data-t=Soft]{color:#9eecc0;border-color:rgba(158,236,192,.35)}",
    "#resonanzen .rzTone[data-t=Hard]{color:#ff8aa0;border-color:rgba(255,138,160,.4)}",
    "#resonanzen .rzTone[data-t=Grenze]{color:#ffd2a0;border-color:rgba(255,210,160,.4)}#resonanzen .rzTone[data-t=Feld]{color:#d7b8ff;border-color:rgba(179,107,255,.5)}",
    "#resonanzen .rzEmpty b{color:#f1e8ff;font-weight:500}#resonanzen .rzTry{display:flex;flex-wrap:wrap;gap:.3rem;margin:.45rem 0 0}#resonanzen .rzTry button{min-height:2.2rem;padding:0 .75rem;border-radius:999px;border:1px solid rgba(200,160,255,.35);background:rgba(160,90,255,.1);color:#f1e8ff;font:inherit;font-size:.8rem}",
    "#resonanzen .rzAka{display:block;margin-top:.15rem;font-size:.68rem;color:#a08cba}",
    "#resonanzen .rzTxt{display:block;margin:.42rem 0 0;font-size:.88rem;line-height:1.45;color:#e6dcff}",
    "#resonanzen .rzHint{margin:.2rem 0 .1rem;font-size:.72rem;color:#a08cba}",
    "#resonanzen .rzEmpty{margin:.8rem .2rem;color:#a08cba;font-size:.86rem;line-height:1.45}",
    "#resonanzen .rzCount{margin:0 .2rem .4rem;font-size:.7rem;color:#a08cba}",
    "#resonanzen .rzHas .rzMain,#resonanzen .rzRow:not(.rzHas) .rzMain{padding-right:2.4rem}",
    "#resonanzen .rzStar{position:absolute;top:.2rem;right:.2rem;width:2.75rem;height:2.75rem;border:0;background:none;padding:0;color:#8e7aa8;font-size:1.35rem;line-height:1;cursor:pointer;-webkit-tap-highlight-color:transparent}",
    "#resonanzen .rzStar.on{color:#ffd77a;text-shadow:0 0 10px rgba(255,200,90,.55)}",
    "#resonanzen .rzCat{margin-left:.4rem;font-size:.64rem;letter-spacing:.06em;color:#a08cba}",
    "#resonanzen .rzMine{margin:.5rem 0 0;padding:.4rem .6rem;border-left:2px solid var(--ueberschrift,#d6a6ff);font-family:Georgia,serif;font-style:italic;font-size:.84rem;line-height:1.4;color:#f1e8ff;white-space:pre-wrap}",
    "#resonanzen .rzNoteBtn{margin:.35rem 0 0 -.5rem;min-height:2.75rem;padding:0 .5rem;border:0;background:none;font:inherit;font-size:.76rem;color:var(--ueberschrift,#d6a6ff);text-decoration:underline;text-underline-offset:.2em;text-decoration-color:rgba(200,120,255,.4);cursor:pointer}",
    "#resonanzen .rzNoteTa{display:block;width:100%;box-sizing:border-box;margin:.5rem 0 0;min-height:4.6rem;padding:.55rem .65rem;border-radius:.8rem;border:1px solid rgba(200,120,255,.3);background:rgba(10,4,24,.6);color:#f1e8ff;font:inherit;font-size:.9rem;line-height:1.4;resize:vertical}",
    "#resonanzen .rzNoteHint{margin:.25rem 0 0;font-size:.66rem;color:#a08cba}",
    "#resonanzen .rzRow.rzFlash{box-shadow:0 0 0 1px var(--ueberschrift,#d6a6ff),0 0 18px var(--glow,rgba(200,120,255,.4))}",
    "#resonanzen .rzMoreBtn{margin:.2rem 0 0 -.5rem;min-height:2.75rem;padding:0 .5rem;border:0;background:none;font:inherit;font-size:.78rem;color:var(--ueberschrift,#d6a6ff);cursor:pointer}",
    "#resonanzen .rzMoreBtn::after{content:' ▾';font-size:.7em}#resonanzen .rzMoreBtn[aria-expanded=true]::after{content:' ▴'}",
    "#resonanzen .rzMore{margin:.1rem 0 .3rem;padding:.55rem .7rem .6rem;border-left:2px solid rgba(200,160,255,.35);background:rgba(10,4,24,.35);border-radius:0 .7rem .7rem 0}",
    "#resonanzen .rzMore dt{margin:.45rem 0 0;font-size:.62rem;letter-spacing:.14em;text-transform:uppercase;color:var(--ueberschrift,#d6a6ff)}#resonanzen .rzMore dt:first-child{margin-top:0}",
    "#resonanzen .rzMore dd{margin:.1rem 0 0;font-size:.84rem;line-height:1.5;color:#e6dcff}",
    "#resonanzen .rzMore .rzHk{color:#ffd2a0}#resonanzen .rzMore dd.rzHk{font-size:.8rem}",
    "#resonanzen .rzLinks{display:flex;flex-wrap:wrap;margin:.1rem 0 0 -.3rem}",
    "#resonanzen .rzLk{min-height:2.75rem;padding:0 .3rem;border:0;background:none;font:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent;display:inline-flex;align-items:center}",
    "#resonanzen .rzLk span{display:inline-block;padding:.18rem .6rem;border-radius:999px;border:1px solid rgba(200,160,255,.3);font-size:.7rem;color:#d9c8f0;background:rgba(160,90,255,.08)}",
    "#resonanzen .rzLk[data-lk=t] span{border-style:dashed}",
    "#resonanzen .rzLf{display:flex;align-items:center;gap:.5rem;margin:0 0 .4rem;padding:.5rem .7rem;border:1px solid rgba(200,160,255,.3);border-radius:.9rem;background:rgba(20,8,48,.5);font-size:.8rem;color:#f1e8ff}",
    "#resonanzen .rzLf[hidden]{display:none}",
    "#resonanzen .rzLf b{font-weight:500}#resonanzen .rzLf small{display:block;font-size:.66rem;color:#a08cba;margin-top:.1rem}",
    "#resonanzen .rzLf button{margin-left:auto;min-width:2.75rem;min-height:2.75rem;border:0;background:none;color:#d9c8f0;font-size:1.1rem}",
    "#resonanzen .rzIntro{margin:0 .2rem .5rem;font-size:.76rem;line-height:1.45;color:#a08cba}",
    "#resonanzen .rzNum{font-family:Georgia,serif;font-size:1.7rem;line-height:32px;text-align:center;width:32px;height:32px;display:block;color:#cfa8ff;text-shadow:0 0 8px rgba(231,184,255,.6)}",
    "#rzToday{margin:0 0 .45rem;padding:.45rem .7rem .5rem;border:1px solid rgba(200,160,255,.25);border-left:3px solid var(--rzc,#5fe0a0);border-radius:1rem;background:rgba(20,8,48,.5)}",
    "#rzToday[hidden]{display:none}",
    "#rzToday .rtH{margin:0;font-size:.64rem;letter-spacing:.16em;text-transform:uppercase;color:var(--ueberschrift,#d6a6ff)}",
    "#rzToday .rtH{display:flex;justify-content:space-between;gap:.4rem}#rzToday .rtH span{letter-spacing:.04em;text-transform:none;color:#a08cba}",
    "#rzToday .rtT{display:none}",
    "#rzToday .rtL{display:flex;flex-wrap:wrap;gap:.3rem;margin-top:.3rem}",
    "#rzToday .rtB{min-height:2.2rem;padding:0 .7rem;border-radius:999px;border:1px solid rgba(200,160,255,.35);background:rgba(160,90,255,.1);color:#f1e8ff;font:inherit;font-size:.82rem}",
    "#rzToday .rtB small{margin-left:.35rem;font-size:.62rem;color:#a08cba}",
    "/* Build 114: kompakter Kopf */",
    "#resonanzen .rzFil{flex-wrap:wrap;gap:.25rem}#resonanzen .rzFil .rzToneF{min-height:2rem!important;height:2rem!important;padding:0 .5rem!important;font-size:.68rem!important;gap:.25rem}",
    "#resonanzen .rzTabs{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr));gap:.25rem}",
    "#resonanzen .rzTabs .chip{min-height:2.1rem!important;height:auto!important;padding:.15rem .1rem!important;font-size:.66rem!important;letter-spacing:0!important;white-space:nowrap;text-align:center;justify-content:center;min-width:0;overflow:hidden;text-overflow:ellipsis}",
    "#rzToday .rtB{min-height:2rem!important;height:2rem!important;padding:0 .6rem!important;font-size:.76rem!important}#rzToday .rtB small{margin-left:.25rem}",
    "#rzToday .rtL{flex-wrap:wrap}",
    "#resonanzen .rzCount{display:inline;margin:0 .2rem 0 .2rem}#resonanzen .rzIntro{margin:.1rem .2rem .45rem;font-size:.72rem;line-height:1.35}",
    "#rzRezBtn{min-height:2.6rem!important}#rzRezBtn svg{display:inline-block!important}"
  ].join("\n");
  document.head.appendChild(css);

  function esc(s){
    return String(s||"").replace(/[&<>"']/g,function(c){
      return ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c];
    });
  }
  function isFav(id){ return favs.indexOf(id)>=0; }
  function moreText(id){ var m=MEHR[id]; return m?(m.w+" "+m.n+" "+m.a+" "+(m.h||"")):""; }
  function wann(e){
    var t=e.tone, a=[];
    var m0=MEHR[e.id]||{};
    if(m0.zw){ a.push(m0.zw); }
    else a.push(t==="Hard"?"Nur an Hard-Tagen oder ganz bewusst, immer mit Ethik und Anker, nie aus Impuls.":t==="Feld"?"Für Feld-Arbeit, Traum und Schwelle: an ruhigen Tagen, immer mit Rückkehr ins Hier.":t==="Grenze"?"Passt an Soft- und Grenze-Tagen, kurz und bewusst.":"Passt an Soft-Tagen und im Alltag.");
    var l=LINKS[e.id]||{}, ps=l.p||[];
    if(ps.length) a.push("Tradition: am "+ps.map(function(p){ return PL_DAY[p]+" ("+p+")"; }).join(" oder ")+".");
    var th=l.t||[], mo="";
    if(th.indexOf("ende")>=0||th.indexOf("klaerung")>=0) mo="Mond (Tradition): abnehmend zum Loslassen und Klären.";
    else if(th.indexOf("fuelle")>=0||th.indexOf("mut")>=0||th.indexOf("herz")>=0||th.indexOf("heilung")>=0) mo="Mond (Tradition): zunehmend zum Wachsen lassen.";
    else if(th.indexOf("traum")>=0) mo="Mond (Tradition): Neumond und stille Nächte.";
    if(mo) a.push(mo);
    return a.join(" ");
  }
  function moreHtml(e){
    var m=MEHR[e.id]; if(!m) return "";
    var op=!!openMore[e.id];
    var h='<button type="button" class="rzMoreBtn" data-more="'+esc(e.id)+'" aria-expanded="'+op+'">'+(op?"Weniger":"Mehr lesen")+"</button>";
    if(!op) return h;
    return h+'<dl class="rzMore"><dt>Was es ist</dt><dd>'+esc(m.w)+"</dd><dt>Wofür</dt><dd>"+esc(m.n)+"</dd><dt>Anwenden</dt><dd>"+esc(m.a)+"</dd><dt>Wann</dt><dd>"+esc(wann(e))+"</dd>"+(e.saison?"<dt>Saison</dt><dd>Hinweis: "+esc(e.saison)+"</dd>":"")+(m.h?'<dt class="rzHk">Hinweis</dt><dd class="rzHk">'+esc(m.h)+"</dd>":"")+"</dl>";
  }
  function hasLink(id){ var l=LINKS[id]; if(!l||!lf) return false; return lf.k==="p"?(l.p||[]).indexOf(lf.v)>=0:(l.t||[]).indexOf(lf.v)>=0; }
  function match(e){
    if(!e) return false;
    if(lf){ if(!hasLink(e.id)) return false; }
    else if(q){}
    else if(tab==="fav"){ if(!isFav(e.id)) return false; }
    else if(!inCat(e,tab)) return false;
    if(toneF && e.tone!==toneF) return false;
    if(!q) return true;
    return rank(e)>=0;
  }
  /* Heute passend: nach dem Ton des Tages, täglich stabile Auswahl (Berner Datum) */
  function todayKey(){
    try{ var p=new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Zurich",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date()).split("-"); return +p[0]*372+(+p[1])*31+(+p[2]); }catch(e){ return Math.floor(Date.now()/864e5); }
  }
  function paintToday(){
    var box=document.getElementById("rzToday"); if(!box) return;
    if(ready!==2){ box.hidden=true; return; }
    var kind=dayKind();
    var txt=kind==="HARD"?"Heute ist ein Hard-Tag. Diese Einträge gelten nur mit Rückkehr und Anker.":(kind==="GRENZE"?"Heute ist ein Grenze-Tag. Diese Einträge passen, kurz und bewusst.":"Heute ist ein Soft-Tag. Diese weichen Einträge passen.");
    var col=kind==="HARD"?"#ff5470":(kind==="GRENZE"?"#ffb86b":"#5fe0a0");
    var okT=kind==="HARD"?["Grenze","Feld","Hard"]:pathTones(kind);
    var pool=DATA.filter(function(e){ return okT.indexOf(e.tone)>=0&&e.cat!=="farben"; });
    var wd=0; try{ var wn=new Intl.DateTimeFormat("en-US",{timeZone:"Europe/Zurich",weekday:"short"}).format(new Date()); wd=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].indexOf(wn); }catch(e){ wd=new Date().getDay(); }
    var dp=DAY_PL[wd<0?0:wd], hp=null, hint="";
    try{ if(window.RR25_OPT&&window.RR25_OPT.get("planet")&&window.RR25_KAL&&window.RR25_KAL.planetAt){ var pa=window.RR25_KAL.planetAt(Date.now()); if(pa&&pa.cur&&pa.cur.p!==dp) hp=pa.cur.p; } }catch(e){}
    function byP(pl){ return pool.filter(function(e){ var l=LINKS[e.id]; return l&&(l.p||[]).indexOf(pl)>=0; }); }
    var k=todayKey(), pick=[], used={};
    function take(arr,n,seed){ for(var i=0;i<arr.length*2&&n>0;i++){ var e=arr[(seed*7+i*5+i)%arr.length]; if(!e||used[e.id]) continue; if(pick.some(function(x){ return x.cat===e.cat; })&&i<arr.length) continue; used[e.id]=1; pick.push(e); n--; } }
    take(byP(dp),hp?2:3,k);
    if(hp) take(byP(hp),1,k+3);
    if(pick.length<3) take(pool,3-pick.length,k+1);
    txt+=" Es ist "+PL_DAY[dp]+", der Tag "+({Sonne:"der Sonne",Mond:"des Mondes",Mars:"des Mars",Merkur:"des Merkur",Jupiter:"des Jupiter",Venus:"der Venus",Saturn:"des Saturn"})[dp]+" (Tradition)."+(hp?" Jetzt läuft die Stunde des Planeten "+hp+".":"");
    box.style.setProperty("--rzc",col); box.hidden=false;
    box.innerHTML='<p class="rtH">Heute passend<span>'+esc((KIND_LAB[kind]||"Soft")+" · "+PL_DAY[dp])+'</span></p><p class="rtT">'+esc(txt)+'</p><div class="rtL">'+pick.map(function(e){ return '<button type="button" class="rtB" data-go="'+esc(e.id)+'">'+esc(e.name)+'<small>'+esc(CAT_LAB[e.cat])+'</small></button>'; }).join("")+'</div>';
  }
  function fallbackIco(e){
    if(e.cat==="zahlen") return '<b class="rzNum">'+esc(e.num||"")+"</b>";
    if(e.cat==="rauch") return '<svg viewBox="0 0 24 24"><path d="M9 21h6M10 21c-1-3 0-4 0-6M14 21c1-3 0-4 0-6"/><path d="M12 14c-3-2 2-4-1-6s2-4 0-6M16 12c-2-1 1-3-1-4"/></svg>';
    return "";
  }
  function linkRow(id){
    var l=LINKS[id]; if(!l) return "";
    var h=(l.p||[]).map(function(p){ return '<button type="button" class="rzLk" data-lk="p" data-v="'+esc(p)+'" aria-label="Verbindung '+esc(p)+'"><span>'+esc(p)+" · "+PL_DAY[p].slice(0,2)+"</span></button>"; }).join("")+
      (l.t||[]).map(function(t){ return '<button type="button" class="rzLk" data-lk="t" data-v="'+esc(t)+'" aria-label="Verbindung '+esc(TH_LAB[t])+'"><span>'+esc(TH_LAB[t])+"</span></button>"; }).join("");
    return h?'<div class="rzLinks">'+h+"</div>":"";
  }
  function paint(){
    var root=document.getElementById("resonanzen");
    if(!root) return;
    var tabs=document.getElementById("rzTabs");
    var tones=document.getElementById("rzTones");
    var list=document.getElementById("rzList");
    if(tones){
      tones.innerHTML=TONE_CHIPS.map(function(c){
        return '<button type="button" class="rzToneF'+(toneF===c[0]?" on":"")+'" data-tn="'+c[0]+'" aria-pressed="'+(toneF===c[0])+'"><i></i>'+c[1]+"</button>";
      }).join("");
      tones.querySelectorAll("[data-tn]").forEach(function(b){
        b.onclick=function(){ var v=b.getAttribute("data-tn")||""; toneF=toneF===v?"":v; paint(); };
      });
    }
    if(tabs){
      tabs.innerHTML=TAB_ORDER.map(function(c){
        return '<button type="button" class="chip'+(tab===c?" on":"")+'" data-rz="'+c+'">'+CAT_LAB[c]+"</button>";
      }).join("");
      tabs.querySelectorAll("[data-rz]").forEach(function(b){
        b.onclick=function(){ tab=b.getAttribute("data-rz")||"kraeuter"; lf=null; paint(); };
      });
    }
    paintToday();
    if(!list) return;
    if(ready!==2){
      list.innerHTML='<p class="rzEmpty">Lädt…</p>';
      return;
    }
    var rows=DATA.filter(match);
    if(q){ var rk={}; rows.forEach(function(e){ rk[e.id]=rank(e); }); rows=rows.map(function(e,i){ return [e,i]; }).sort(function(a,b){ return rk[a[0].id]-rk[b[0].id]||a[1]-b[1]; }).map(function(x){ return x[0]; }); }
    var cnt=document.getElementById("rzCount");
    if(cnt) cnt.textContent=lf?(rows.length+" mit dieser Verbindung, alle Gruppen"):q?(rows.length+(rows.length===1?" Treffer":" Treffer")+" in allen Gruppen"):(rows.length+(rows.length===1?" Eintrag":" Einträge"));
    var bar=document.getElementById("rzLf");
    if(bar){
      if(lf){ bar.hidden=false; bar.innerHTML='<div><b>Verbindung: '+esc(lf.k==="p"?lf.v+" · "+PL_DAY[lf.v]:TH_LAB[lf.v])+'</b><small>Tradition, die Quellen unterscheiden sich.</small></div><button type="button" id="rzLfX" aria-label="Verbindung aufheben">✕</button>'; var x=document.getElementById("rzLfX"); if(x) x.onclick=function(){ lf=null; paint(); }; }
      else{ bar.hidden=true; bar.innerHTML=""; }
    }
    var intro=document.getElementById("rzIntro");
    if(intro){ intro.textContent=(!lf&&!q&&INTRO[tab])?INTRO[tab]:""; intro.hidden=!intro.textContent; }
    if(!rows.length){
      if(q){
        var tr=["Salbei","Schutz","Kerze","Opfergaben"].filter(function(x){ return norm(x).indexOf(norm(q))<0; }).slice(0,3);
        list.innerHTML='<div class="rzEmpty"><b>Nichts gefunden für «'+esc(q)+'»</b> – versuch es mit einem anderen Wortanfang, zum Beispiel:'+'<div class="rzTry">'+tr.map(function(x){ return '<button type="button" data-try="'+esc(x)+'">'+esc(x)+'</button>'; }).join("")+'</div>'+(toneF?'<p style="margin:.4rem 0 0">Ein Ton-Filter ist aktiv und blendet einiges aus.</p>':"")+'</div>';
        list.querySelectorAll("[data-try]").forEach(function(b){ b.onclick=function(){ var f=document.getElementById("rzFind"); q=norm(b.getAttribute("data-try")); if(f) f.value=b.getAttribute("data-try"); q=(f?f.value:q).trim().toLowerCase(); paint(); }; });
        return;
      }
      list.innerHTML='<p class="rzEmpty">'+(tab==="fav"&&!toneF?"Noch keine Favoriten. Tippe den Stern an einem Eintrag, dann liegt er hier.":"Hier passt gerade nichts zu diesem Ton. Tippe den Ton nochmals an, dann siehst du wieder alles.")+"</p>";
      return;
    }
    list.innerHTML=rows.map(function(e){
      var fv=isFav(e.id), nt=notes[e.id]||"", op=openNote===e.id;
      var inner="<b>"+esc(e.name)+"</b>"+(e.alias&&e.alias.length?'<span class="rzAka">auch: '+esc(e.alias.join(", "))+"</span>":"")+
        '<span class="rzTone" data-t="'+esc(e.tone)+'">'+esc(e.tone)+"</span>"+((q||tab==="fav")?'<span class="rzCat">'+esc(CAT_LAB[e.cat].replace("★ ",""))+"</span>":"")+
        '<p class="rzTxt">'+esc(e.text)+"</p>"+moreHtml(e)+
        (nt&&!op?'<p class="rzMine">'+esc(nt)+"</p>":"")+
        (op?'<textarea class="rzNoteTa" data-note="'+esc(e.id)+'" maxlength="600" rows="3" placeholder="Eigene Notiz">'+esc(nt)+'</textarea><p class="rzNoteHint">Nur auf diesem Gerät gespeichert, auch in der Sicherung.</p>':"")+
        linkRow(e.id)+
        '<button type="button" class="rzNoteBtn" data-nb="'+esc(e.id)+'">'+(op?"Fertig":(nt?"Notiz bearbeiten":"Eigene Notiz"))+"</button>";
      var star='<button type="button" class="rzStar'+(fv?" on":"")+'" data-fav="'+esc(e.id)+'" aria-pressed="'+fv+'" aria-label="'+(fv?"Favorit entfernen":"Als Favorit merken")+'">'+(fv?"★":"☆")+"</button>";
      var ico=ICO[e.id]||fallbackIco(e), fl=flash===e.id?" rzFlash":"";
      if(!ico) return '<article class="rzRow'+fl+'" data-id="'+esc(e.id)+'">'+star+'<div class="rzMain">'+inner+"</div></article>";
      return '<article class="rzRow rzHas'+fl+'" data-id="'+esc(e.id)+'">'+star+'<span class="rzIco" aria-hidden="true">'+ico+'</span><div class="rzMain">'+inner+"</div></article>";
    }).join("");
    if(flash){ var f=list.querySelector('[data-id="'+flash+'"]'); flash=""; if(f&&f.scrollIntoView) setTimeout(function(){ f.scrollIntoView({block:"center",behavior:"smooth"}); },30); }
    if(openNote){ var ta=list.querySelector("textarea.rzNoteTa"); if(ta&&!ta._f){ ta._f=1; ta.focus(); } }
  }
  function load(){
    if(ready===2){ paint(); return; }
    if(ready===1) return;
    ready=1;
    paint();
    function one(url){
      return fetch(url,{cache:"no-store"}).then(function(r){
        if(!r.ok) throw new Error("lex");
        return r.json();
      });
    }
    Promise.all([
      one("resonanzen-a.json?v=114"),
      one("resonanzen-b.json?v=114"),
      one("resonanzen-c.json?v=114"),
      one("resonanzen-ico-a.json?v=114"),
      one("resonanzen-ico-b.json?v=114"),
      one("resonanzen-ico-c.json?v=114"),
      one("resonanzen-d.json?v=114"),
      one("resonanzen-links.json?v=114"),
      one("resonanzen-mehr.json?v=114")
    ]).then(function(ps){
      DATA=(ps[0]||[]).concat(ps[1]||[], ps[2]||[], ps[6]||[]);
      LINKS=ps[7]||{}; MEHR=ps[8]||{};
      ICO=Object.assign({}, ps[3]||{}, ps[4]||{}, ps[5]||{});
      ready=2;
      paint();
    }).catch(function(){
      ready=0;
      var list=document.getElementById("rzList");
      if(list) list.innerHTML='<p class="rzEmpty">Lexikon nicht geladen.</p>';
    });
  }
  function goTo(e){ tab=e.cat; q=""; toneF=""; lf=null; var f=document.getElementById("rzFind"); if(f) f.value=""; flash=e.id; openMore[e.id]=true; paint(); }
  /* Build 114: Sprung aus dem Ritualbauer («Im Lexikon ansehen») */
  window.RR25_RESO={open:function(id){ id=MERGE[id]||id; if(typeof show==="function") show("resonanzen"); boot(); var t=0; (function w(){ var e=DATA.filter(function(x){ return x.id===id; })[0]; if(e){ goTo(e); return; } if(++t<40) setTimeout(w,100); })(); }};
  function boot(){
    var find=document.getElementById("rzFind");
    if(find && !find._rz){
      find._rz=1;
      find.addEventListener("input",function(){
        q=(find.value||"").trim().toLowerCase();
        paint();
      });
    }
    var list=document.getElementById("rzList");
    if(list&&!list._rz){
      list._rz=1;
      list.addEventListener("click",function(ev){
        var t=ev.target&&ev.target.closest?ev.target.closest("[data-fav],[data-nb],[data-lk],[data-more]"):null; if(!t) return;
        if(t.getAttribute("data-more")){ var mid=t.getAttribute("data-more"); openMore[mid]=!openMore[mid]; paint(); return; }
        if(t.getAttribute("data-lk")){ lf={k:t.getAttribute("data-lk"),v:t.getAttribute("data-v")}; openNote=""; paint(); try{ window.scrollTo({top:0,behavior:"smooth"}); }catch(e){} return; }
        var id=t.getAttribute("data-fav");
        if(id){ var i=favs.indexOf(id); if(i>=0) favs.splice(i,1); else favs.push(id); lsSet(KFAV,favs); paint(); return; }
        id=t.getAttribute("data-nb"); openNote=(openNote===id)?"":id; paint();
      });
      list.addEventListener("input",function(ev){
        var t=ev.target; if(!t||!t.getAttribute||t.getAttribute("data-note")==null) return;
        var id=t.getAttribute("data-note"), v=t.value.trim();
        if(v) notes[id]=t.value.slice(0,600); else delete notes[id];
        lsSet(KNOTE,notes);
      });
    }
    var tb=document.getElementById("rzToday");
    if(tb&&!tb._rz){
      tb._rz=1;
      tb.addEventListener("click",function(ev){
        var t=ev.target&&ev.target.closest?ev.target.closest("[data-go]"):null; if(!t) return;
        var id=t.getAttribute("data-go"), e=DATA.filter(function(x){ return x.id===id; })[0]; if(!e) return;
        goTo(e);
      });
    }
    load();
  }
  if(typeof show==="function" && !show._rz){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="resonanzen") boot();
      var m=document.getElementById("navMehr");
      if(m && id==="resonanzen") m.classList.add("on");
      return r;
    };
    show._rz=1;
  }
  boot();
})();
