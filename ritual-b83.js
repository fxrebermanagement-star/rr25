/* ritual-b83.js — Build 83: Ritual-Rezept (in den Resonanzen).
   Absicht und Ton wählen, Zutaten aus dem Lexikon (Favoriten zuerst), daraus ein kurzes eigenes Ritual in Schritten.
   Speicher: rr25_rezepte (Präfix rr25: Sichern und Wiederherstellen gelten). Hard nur mit Rückkehr und Anker (Schritte fest).
   Tradition und Erfahrung, kein Heilversprechen. Daten aus den vorhandenen Lexikon-Dateien (nur lesen). */
(function(){
  if(window.__rr25b83) return; window.__rr25b83=1;
  var KR="rr25_rezepte", KFAV="rr25_rz_fav";
  var TH=[["schutz","Schutz"],["ruhe","Ruhe"],["herz","Herz"],["klaerung","Klärung"],["mut","Mut"],["heilung","Heilung"],["fuelle","Fülle"],["traum","Traum und Schwelle"],["ende","Abschluss"]];
  var SATZ={schutz:"Ich bin geschützt. Mein Feld ist geschlossen.",ruhe:"Ich bin ruhig. Ich lasse los.",herz:"Mein Herz ist offen und klar.",klaerung:"Ich sehe klar.",mut:"Ich bin mutig und ruhig.",heilung:"Ich lasse Heilung zu, in meinem Tempo.",fuelle:"Ich bin versorgt. Genug ist da.",traum:"Ich gehe sanft über die Schwelle.",ende:"Es ist gut. Ich schliesse ab."};
  var TU={kraeuter:"Lege %s bereit (Duft, Tee oder Bild).",hausmittel:"Stelle %s bereit. Klein anwenden.",steine:"Nimm %s in die Hand.",kerzen:"Zünde %s an. Sicher stellen.",farben:"Lass die Farbe %s sehen (Tuch, Licht).",zahlen:"Halte die Zahl %s im Atem.",rauch:"Räuchere %s. Fenster einen Spalt offen."};
  var DATA=null, LINKS={}, st=0, S={th:"",ton:"Soft",txt:"",sel:[],name:""}, VIEW=null, OPEN=false, SAVED=false;
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
  function passt(e,ton){
    var t=String(e.tone||"Soft");
    if(ton==="Hard") return true;
    return t==="Soft"||t==="Soft/Grenze";
  }
  function vorschlag(){
    if(!DATA||!S.th) return [];
    var F=favs(), pool=DATA.filter(function(e){ var l=LINKS[e.id]; return l&&(l.t||[]).indexOf(S.th)>=0&&passt(e,S.ton); });
    pool.sort(function(a,b){ return (F.indexOf(b.id)>=0)-(F.indexOf(a.id)>=0)||String(a.name).localeCompare(String(b.name),"de"); });
    return pool.slice(0,9);
  }
  function build(){
    var hard=S.ton==="Hard", ab=(S.txt||"").trim()||SATZ[S.th]||"So sei es.";
    var z=S.sel.map(function(id){ return DATA.filter(function(e){ return e.id===id; })[0]; }).filter(Boolean);
    var steps=[];
    steps.push(["Vorbereitung","Tu:|Ruhiger Ort. Wasser bereit."+(z.length?" "+z.map(function(e){ return e.name; }).join(", ")+" liegt bereit.":"")+(hard?"|Zeit für die Rückkehr einplanen. Anker bereithalten (Wasser, Salz).":"")]);
    steps.push(["Standort","Tu:|Füsse. Drei Atemzüge.||Sprich:|Ich bin hier. Ich bin klar."]);
    steps.push(["Absicht","Sprich dreimal, leise:|"+ab]);
    z.forEach(function(e){ steps.push([e.name,"Tu:|"+(TU[e.cat]||"Stelle %s bereit.").replace("%s",e.name)+(e.text?"||Tradition:|"+e.text:"")]); });
    steps.push(["So sei es","Sprich:|So sei es.||Tu:|Ein Atemzug. Hände auf die Brust."]);
    if(hard){ steps.push(["Rückkehr","Sprich:|Ich bin hier. Ich bin ganz bei mir.||Tu:|Füsse. Atem. Raum."]); steps.push(["Anker","Tu:|Wasser trinken. Salz kurz berühren. Etwas Alltägliches tun.||Sprich:|Anker gesetzt. Ich bin zurück."]); }
    else steps.push(["Schluss","Tu:|Wasser. Alltag."]);
    return steps;
  }
  function stepHtml(t){
    return String(t).split("||").map(function(b){ var L=b.split("|"); var head=L.shift(); return '<p class="rzRh">'+h(head)+'</p>'+L.map(function(x){ return '<p class="rzRl">'+h(x)+'</p>'; }).join(""); }).join("");
  }
  function defName(){ var t=TH.filter(function(x){ return x[0]===S.th; })[0]; return (t?t[1]:"Eigenes")+" · "+S.ton; }
  function viewer(r,i){
    var s=r.steps[i], last=i===r.steps.length-1;
    return '<div class="rzV"><p class="rzVk">'+h(r.name)+' · '+(i+1)+' von '+r.steps.length+'</p><h4>'+h(s[0])+'</h4>'+stepHtml(s[1])+
      '<div class="rzVb"><button type="button" class="btn ghost" data-a="vb"'+(i===0?" disabled":"")+'>Zurück</button><button type="button" class="btn primary" data-a="vn">'+(last?"Abschliessen":"Weiter")+'</button></div></div>';
  }
  function panel(){
    if(VIEW) return viewer(VIEW.r,VIEW.i)+'<button type="button" class="rzLink" data-a="vx">Beenden</button>';
    var sv=rez(), out='';
    out+='<p class="rzRn">Aus Tradition und Erfahrung, kein Heilversprechen. Bei Beschwerden zählt ärztlicher Rat.</p>';
    out+='<p class="rzRh">1 · Absicht</p><div class="rzCh">'+TH.map(function(t){ return '<button type="button" data-th="'+t[0]+'" class="'+(S.th===t[0]?"on":"")+'">'+t[1]+'</button>'; }).join("")+'</div>';
    out+='<input id="rzRt" class="rzRi" maxlength="120" placeholder="Eigener Satz (sonst ein ruhiger Standardsatz)" value="'+h(S.txt)+'" autocomplete="off">';
    out+='<p class="rzRh">2 · Ton</p><div class="rzCh"><button type="button" data-ton="Soft" class="tS'+(S.ton==="Soft"?" on":"")+'">Soft</button><button type="button" data-ton="Hard" class="tH'+(S.ton==="Hard"?" on":"")+'">Hard</button></div>';
    if(S.ton==="Hard"){ var k=""; try{ k=window.RR25_KAL.state().kind; }catch(e){} out+='<p class="rzRn">Hard nur mit Rückkehr und Anker: beide Schritte sind fest eingebaut.'+(k&&k!=="HARD"?' Im Kalender ist gerade kein Hard-Fenster offen.':'')+'</p>'; }
    out+='<p class="rzRh">3 · Zutaten (bis 3, Favoriten zuerst)</p>';
    if(!S.th) out+='<p class="rzRn">Wähle zuerst eine Absicht.</p>';
    else if(!DATA) out+='<p class="rzRn">Lexikon lädt…</p>';
    else { var F=favs(), v=vorschlag(); out+=v.length?'<div class="rzCh">'+v.map(function(e){ return '<button type="button" data-z="'+h(e.id)+'" class="'+(S.sel.indexOf(e.id)>=0?"on":"")+'">'+(F.indexOf(e.id)>=0?"★ ":"")+h(e.name)+'</button>'; }).join("")+'</div>':'<p class="rzRn">Dazu passt hier nichts. Das Ritual geht auch ohne Zutat.</p>'; }
    if(S.th){
      var steps=build();
      out+='<p class="rzRh">Vorschau · '+steps.length+' Schritte</p><p class="rzRn">'+steps.map(function(s){ return h(s[0]); }).join(" → ")+'</p>';
      out+='<input id="rzRname" class="rzRi" maxlength="40" placeholder="Name" value="'+h((S._dn=defName(),S.name||S._dn))+'" autocomplete="off">';
      out+='<div class="rzVb"><button type="button" class="btn ghost" data-a="start">Jetzt durchgehen</button><button type="button" class="btn primary" data-a="save">Speichern</button></div>';
    }
    if(sv.length){
      out+='<p class="rzRh">Meine Rezepte</p><ul class="rzSv">'+sv.map(function(r,i){ return '<li><button type="button" class="rzOpen" data-r="'+i+'"><b>'+h(r.name)+'</b><small>'+h(r.ton)+' · '+r.steps.length+' Schritte</small></button><button type="button" class="rzDel" data-d="'+i+'" aria-label="Rezept löschen">×</button></li>'; }).join("")+'</ul>';
    }
    return out;
  }
  function cur(){ return {id:"rz"+Date.now().toString(36),name:(S.name||defName()).trim()||defName(),th:S.th,ton:S.ton,absicht:(S.txt||"").trim(),zut:S.sel.slice(),steps:build(),made:Date.now()}; }
  function bind(p){
    [].slice.call(p.querySelectorAll("[data-th]")).forEach(function(b){ b.onclick=function(){ keep(); S.th=b.getAttribute("data-th"); S.sel=[]; paint(); }; });
    [].slice.call(p.querySelectorAll("[data-ton]")).forEach(function(b){ b.onclick=function(){ keep(); S.ton=b.getAttribute("data-ton"); S.sel=[]; paint(); }; });
    [].slice.call(p.querySelectorAll("[data-z]")).forEach(function(b){ b.onclick=function(){ keep(); var id=b.getAttribute("data-z"), i=S.sel.indexOf(id); if(i>=0) S.sel.splice(i,1); else if(S.sel.length<3) S.sel.push(id); paint(); }; });
    [].slice.call(p.querySelectorAll("[data-r]")).forEach(function(b){ b.onclick=function(){ var r=rez()[+b.getAttribute("data-r")]; if(r){ VIEW={r:r,i:0}; paint(); } }; });
    [].slice.call(p.querySelectorAll("[data-d]")).forEach(function(b){ b.onclick=function(){ var a=rez(); a.splice(+b.getAttribute("data-d"),1); setRez(a); paint(); }; });
    [].slice.call(p.querySelectorAll("[data-a]")).forEach(function(b){ b.onclick=function(){
      var a=b.getAttribute("data-a");
      if(a==="start"){ keep(); VIEW={r:cur(),i:0}; }
      else if(a==="save"){ keep(); var r=rez(); r.unshift(cur()); setRez(r.slice(0,30)); S={th:"",ton:"Soft",txt:"",sel:[],name:""}; }
      else if(a==="vb"){ VIEW.i=Math.max(0,VIEW.i-1); }
      else if(a==="vn"){ if(VIEW.i<VIEW.r.steps.length-1) VIEW.i++; else { fin(VIEW.r); VIEW=null; } }
      else if(a==="vx"){ VIEW=null; }
      paint();
    }; });
  }
  function keep(){ var t=document.getElementById("rzRt"), n=document.getElementById("rzRname"); if(t) S.txt=t.value; if(n) S.name=(n.value===S._dn)?"":n.value; }
  function fin(r){
    try{
      if(typeof load==="function"&&typeof save==="function"){ var d=load(); d.log=d.log||[]; d.log.unshift({id:typeof uid==="function"?uid():("r"+Date.now().toString(36)),t:typeof now==="function"?now():new Date().toLocaleString("de-CH"),titel:"Rezept · "+r.name,wer:"",note:r.absicht||""}); save(d); if(typeof paintLog==="function") paintLog(); }
    }catch(e){}
  }
  function paint(){
    var p=document.getElementById("rzRezept"); if(!p) return;
    var b=document.getElementById("rzRezBtn"); if(b){ b.classList.toggle("on",OPEN); b.textContent=OPEN?"Rezept zu":"Rezept bauen"; }
    var body=document.getElementById("rzRezBody"); if(!body) return;
    body.hidden=!OPEN; if(!OPEN) return;
    body.innerHTML=panel(); bind(body);
  }
  function mount(){
    var root=document.getElementById("resonanzen"); if(!root||document.getElementById("rzRezept")) return;
    var top=root.querySelector(".rzTop"); if(!top) return;
    var w=document.createElement("div"); w.id="rzRezept";
    w.innerHTML='<button type="button" class="btn ghost" id="rzRezBtn">Rezept bauen</button><div id="rzRezBody" class="card" hidden></div>';
    root.insertBefore(w,top);
    w.querySelector("#rzRezBtn").onclick=function(){ OPEN=!OPEN; if(OPEN) loadLex(); paint(); };
  }
  mount(); setTimeout(mount,500);
  if(typeof show==="function"&&!show._b83){ var sh=show; show=function(id){ var r=sh.apply(this,arguments); if(id==="resonanzen"){ setTimeout(mount,200); setTimeout(paint,260); } return r; }; show._b83=1; }
  var css=document.createElement("style");
  css.textContent=[
    "#rzRezept{margin:.1rem 0 .55rem}#rzRezBtn{min-height:2.4rem;padding:.35rem 1rem;font-size:.78rem;border-radius:999px;border:1px solid rgba(200,120,255,.35);background:rgba(160,90,255,.1);color:#e4ecff}#rzRezBtn.on{box-shadow:0 0 14px rgba(200,120,255,.35)}",
    "#rzRezBody{margin:.5rem 0 0;padding:.75rem .8rem .8rem;background:linear-gradient(180deg,rgba(40,18,62,.78),rgba(14,8,24,.92))!important;border:1px solid rgba(200,120,255,.22)!important;border-radius:1.1rem!important}#rzRezBody[hidden]{display:none!important}",
    ".rzRh{margin:.7rem 0 .3rem;font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:#d6a6ff}.rzRh:first-child{margin-top:0}",
    ".rzRl{margin:.12rem 0;font-size:.86rem;line-height:1.4;color:#f1e1ff}.rzRn{margin:.35rem 0;font-size:.7rem;line-height:1.4;color:#a994c4}",
    ".rzCh{display:flex;flex-wrap:wrap;gap:.3rem}.rzCh button{min-height:0;padding:.28rem .75rem;font-size:.74rem;border-radius:999px;border:1px solid rgba(200,120,255,.25);background:transparent;color:#cdbbe8}.rzCh button.on{background:rgba(160,90,255,.24);color:#f6e6ff;border-color:rgba(200,120,255,.65);box-shadow:0 0 8px rgba(200,120,255,.28)}",
    ".rzCh .tS.on{background:rgba(46,204,113,.14);border-color:rgba(95,224,160,.6);color:#5fe0a0}.rzCh .tH.on{background:rgba(231,76,60,.14);border-color:rgba(255,84,112,.6);color:#ff7a8e}",
    ".rzRi{display:block;width:100%;margin:.5rem 0 0;min-height:2.4rem;font-size:.86rem}",
    ".rzVb{display:flex;gap:.5rem;margin-top:.7rem}.rzVb .btn{flex:1;min-height:2.6rem}",
    ".rzV h4{margin:.1rem 0 .4rem;font-family:Georgia,serif;font-weight:400;font-size:1.2rem;color:#f1e1ff}.rzVk{margin:0;font-size:.62rem;letter-spacing:.12em;color:#a994c4}",
    ".rzLink{display:block;margin:.6rem auto 0;background:none;border:0;color:#a994c4;font-size:.72rem;text-decoration:underline;min-height:0}",
    ".rzSv{list-style:none;margin:0;padding:0}.rzSv li{display:flex;gap:.3rem;align-items:center;border-top:1px solid rgba(200,120,255,.12)}.rzOpen{flex:1;text-align:left;background:none;border:0;padding:.5rem 0;min-height:0;color:#f1e1ff}.rzOpen b{display:block;font-weight:500;font-size:.88rem}.rzOpen small{font-size:.66rem;color:#a994c4}.rzDel{min-height:0;width:2rem;height:2rem;border-radius:50%;border:1px solid rgba(200,120,255,.25);background:transparent;color:#a994c4;padding:0}"
  ].join("");
  document.head.appendChild(css);
  window.RR25_REZEPT={list:rez,open:function(){ OPEN=true; loadLex(); mount(); paint(); }};
})();
