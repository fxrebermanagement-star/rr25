(function(){
  var DATA=[];
  var CAT_LAB={kraeuter:"Kräuter",hausmittel:"Hausmittel",steine:"Steine",kerzen:"Kerzen",farben:"Farben",fav:"★ Favoriten"};
  var TAB_ORDER=["kraeuter","hausmittel","steine","kerzen","farben","fav"];
  var KFAV="rr25_rz_fav", KNOTE="rr25_rz_note";
  function lsGet(k,d){ try{ var v=JSON.parse(localStorage.getItem(k)); return v==null?d:v; }catch(e){ return d; } }
  function lsSet(k,v){ try{ localStorage.setItem(k,JSON.stringify(v)); }catch(e){} }
  var favs=lsGet(KFAV,[]); if(!Array.isArray(favs)) favs=[];
  var notes=lsGet(KNOTE,{}); if(!notes||typeof notes!=="object"||Array.isArray(notes)) notes={};
  var openNote="", flash="";
  var tab="kraeuter", q="", toneF="", ready=0;

  var ICO={};
  var TONE_CHIPS=[["","Alle"],["Soft","Soft"],["Soft/Grenze","Grenze"],["Soft→Hard","Soft→Hard"],["Hard","Hard"]];

  var css=document.createElement("style");
  css.id="rr25-resonanzen";
  css.textContent=[
    "#mehrSheet .msGrid{grid-template-columns:repeat(2,1fr)!important}",
    "#mehrSheet .msItem[data-v=resonanzen] .ic{background:linear-gradient(160deg,#4a1f6a,#1e1030);color:#cfa8ff}",
    "#resonanzen .rzTop{display:flex;flex-wrap:wrap;gap:.5rem;align-items:center;margin:.1rem 0 .55rem}",
    "#resonanzen .rzSearch{margin:0;flex:1 1 100%;min-width:8.5rem;min-height:2.6rem;font-size:.9rem}",
        "#resonanzen .rzTones{display:flex;flex-wrap:wrap;gap:.3rem;margin:0}",
    "#resonanzen .rzToneF{display:inline-flex;align-items:center;gap:.32rem;min-height:2.75rem;padding:0 .8rem;border-radius:999px;border:1px solid rgba(154,150,166,.45);background:rgba(20,10,34,.45);color:#d9d0e6;font:500 .74rem system-ui,sans-serif;letter-spacing:.01em}",
    "#resonanzen .rzToneF i{width:.42rem;height:.42rem;border-radius:50%;background:#9a96a6;flex:none}",
    "#resonanzen .rzToneF[data-tn=Soft]{border-color:rgba(46,204,113,.55)}#resonanzen .rzToneF[data-tn=Soft] i{background:#2ecc71}",
    "#resonanzen .rzToneF[data-tn='Soft/Grenze']{border-color:rgba(255,196,92,.6)}#resonanzen .rzToneF[data-tn='Soft/Grenze'] i{background:#ffc45c}",
    "#resonanzen .rzToneF[data-tn='Soft→Hard']{border-color:rgba(179,107,255,.6)}#resonanzen .rzToneF[data-tn='Soft→Hard'] i{background:#9a4dff}",
    "#resonanzen .rzToneF[data-tn=Hard]{border-color:rgba(255,84,112,.65)}#resonanzen .rzToneF[data-tn=Hard] i{background:#ff5470}",
    "#resonanzen .rzToneF.on{color:#eaf2ff;background:rgba(255,255,255,.06)}",
    "#resonanzen .rzTabs{display:flex;flex-wrap:wrap;gap:.3rem;margin:0 0 .55rem}",
    "#resonanzen .rzTabs .chip{min-height:2.75rem;padding:.4rem .85rem;font-size:.8rem}",
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
    "#resonanzen .rzTone[data-t=\"Soft/Grenze\"],#resonanzen .rzTone[data-t=\"Soft→Hard\"]{color:#ffd2a0;border-color:rgba(255,210,160,.4)}",
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
    "#rzToday{margin:0 0 .6rem;padding:.7rem .85rem .75rem;border:1px solid rgba(200,160,255,.25);border-left:3px solid var(--rzc,#5fe0a0);border-radius:1rem;background:rgba(20,8,48,.5)}",
    "#rzToday[hidden]{display:none}",
    "#rzToday .rtH{margin:0;font-size:.64rem;letter-spacing:.16em;text-transform:uppercase;color:var(--ueberschrift,#d6a6ff)}",
    "#rzToday .rtT{margin:.25rem 0 .45rem;font-size:.84rem;line-height:1.4;color:#e6dcff}",
    "#rzToday .rtL{display:flex;flex-wrap:wrap;gap:.35rem}",
    "#rzToday .rtB{min-height:2.75rem;padding:0 .85rem;border-radius:999px;border:1px solid rgba(200,160,255,.35);background:rgba(160,90,255,.1);color:#f1e8ff;font:inherit;font-size:.82rem}",
    "#rzToday .rtB small{margin-left:.35rem;font-size:.62rem;color:#a08cba}"
  ].join("\n");
  document.head.appendChild(css);

  function esc(s){
    return String(s||"").replace(/[&<>"']/g,function(c){
      return ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c];
    });
  }
  function isFav(id){ return favs.indexOf(id)>=0; }
  function match(e){
    if(!e) return false;
    if(q){}
    else if(tab==="fav"){ if(!isFav(e.id)) return false; }
    else if(e.cat!==tab) return false;
    if(toneF && e.tone!==toneF) return false;
    if(!q) return true;
    var hay=(e.name+" "+e.tone+" "+e.text+" "+(CAT_LAB[e.cat]||"")+" "+(notes[e.id]||"")).toLowerCase();
    return hay.indexOf(q)>=0;
  }
  /* Heute passend: nach dem Ton des Tages, täglich stabile Auswahl (Berner Datum) */
  function todayKey(){
    try{ var p=new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/Zurich",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date()).split("-"); return +p[0]*372+(+p[1])*31+(+p[2]); }catch(e){ return Math.floor(Date.now()/864e5); }
  }
  function paintToday(){
    var box=document.getElementById("rzToday"); if(!box) return;
    if(ready!==2){ box.hidden=true; return; }
    var kind="SOFT"; try{ var S=window.RR25_KAL&&window.RR25_KAL.state&&window.RR25_KAL.state(Date.now()); if(S&&S.kind) kind=S.kind; }catch(e){}
    var want=kind==="HARD"?"Soft→Hard":(kind==="GRENZE"?"Soft/Grenze":"Soft");
    var txt=kind==="HARD"?"Heute ist ein Hard-Tag. Diese Einträge gelten nur mit Rückkehr und Anker.":(kind==="GRENZE"?"Heute ist ein Grenze-Tag. Diese Einträge passen, kurz und bewusst.":"Heute ist ein Soft-Tag. Diese weichen Einträge passen.");
    var col=kind==="HARD"?"#ff5470":(kind==="GRENZE"?"#ffb86b":"#5fe0a0");
    var pool=DATA.filter(function(e){ return e.tone===want&&e.cat!=="farben"; });
    if(!pool.length){ box.hidden=true; return; }
    var k=todayKey(), pick=[], used={}, step=7;
    for(var i=0;i<pool.length*2&&pick.length<3;i++){
      var e=pool[(k*step+i*step*3+i)%pool.length]; if(!e||used[e.id]) continue;
      if(pick.length&&pick.some(function(x){ return x.cat===e.cat; })&&i<pool.length) continue;
      used[e.id]=1; pick.push(e);
    }
    box.style.setProperty("--rzc",col); box.hidden=false;
    box.innerHTML='<p class="rtH">Heute passend</p><p class="rtT">'+esc(txt)+'</p><div class="rtL">'+pick.map(function(e){ return '<button type="button" class="rtB" data-go="'+esc(e.id)+'">'+esc(e.name)+'<small>'+esc(CAT_LAB[e.cat])+'</small></button>'; }).join("")+'</div>';
  }
  function paint(){
    var root=document.getElementById("resonanzen");
    if(!root) return;
    var tabs=document.getElementById("rzTabs");
    var tones=document.getElementById("rzTones");
    var list=document.getElementById("rzList");
    if(tones){
      tones.innerHTML=TONE_CHIPS.map(function(c){
        return '<button type="button" class="rzToneF'+(toneF===c[0]?" on":"")+'" data-tn="'+c[0]+'"><i></i>'+c[1]+"</button>";
      }).join("");
      tones.querySelectorAll("[data-tn]").forEach(function(b){
        b.onclick=function(){ toneF=b.getAttribute("data-tn")||""; paint(); };
      });
    }
    if(tabs){
      tabs.innerHTML=TAB_ORDER.map(function(c){
        return '<button type="button" class="chip'+(tab===c?" on":"")+'" data-rz="'+c+'">'+CAT_LAB[c]+"</button>";
      }).join("");
      tabs.querySelectorAll("[data-rz]").forEach(function(b){
        b.onclick=function(){ tab=b.getAttribute("data-rz")||"kraeuter"; paint(); };
      });
    }
    paintToday();
    if(!list) return;
    if(ready!==2){
      list.innerHTML='<p class="rzEmpty">Lädt…</p>';
      return;
    }
    var rows=DATA.filter(match);
    var cnt=document.getElementById("rzCount");
    if(cnt) cnt.textContent=q?(rows.length+(rows.length===1?" Treffer":" Treffer")+" in allen Gruppen"):(rows.length+(rows.length===1?" Eintrag":" Einträge"));
    if(!rows.length){
      list.innerHTML='<p class="rzEmpty">'+(tab==="fav"&&!q&&!toneF?"Noch keine Favoriten. Tippe den Stern an einem Eintrag, dann liegt er hier.":(toneF&&!q?"Hier gibt es keinen Eintrag mit diesem Ton. Der Filter «Alle» zeigt alles.":"Nichts gefunden. Eine andere Schreibweise oder der Filter «Alle» hilft."))+"</p>";
      return;
    }
    list.innerHTML=rows.map(function(e){
      var fv=isFav(e.id), nt=notes[e.id]||"", op=openNote===e.id;
      var inner="<b>"+esc(e.name)+"</b>"+
        '<span class="rzTone" data-t="'+esc(e.tone)+'">'+esc(e.tone)+"</span>"+((q||tab==="fav")?'<span class="rzCat">'+esc(CAT_LAB[e.cat].replace("★ ",""))+"</span>":"")+
        '<p class="rzTxt">'+esc(e.text)+"</p>"+
        (nt&&!op?'<p class="rzMine">'+esc(nt)+"</p>":"")+
        (op?'<textarea class="rzNoteTa" data-note="'+esc(e.id)+'" maxlength="600" rows="3" placeholder="Eigene Notiz">'+esc(nt)+'</textarea><p class="rzNoteHint">Nur auf diesem Gerät gespeichert, auch in der Sicherung.</p>':"")+
        '<button type="button" class="rzNoteBtn" data-nb="'+esc(e.id)+'">'+(op?"Fertig":(nt?"Notiz bearbeiten":"Eigene Notiz"))+"</button>";
      var star='<button type="button" class="rzStar'+(fv?" on":"")+'" data-fav="'+esc(e.id)+'" aria-pressed="'+fv+'" aria-label="'+(fv?"Favorit entfernen":"Als Favorit merken")+'">'+(fv?"★":"☆")+"</button>";
      var ico=ICO[e.id], fl=flash===e.id?" rzFlash":"";
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
      one("resonanzen-a.json?v=47"),
      one("resonanzen-b.json?v=47"),
      one("resonanzen-c.json?v=47"),
      one("resonanzen-ico-a.json?v=22"),
      one("resonanzen-ico-b.json?v=22"),
      one("resonanzen-ico-c.json?v=22")
    ]).then(function(ps){
      DATA=(ps[0]||[]).concat(ps[1]||[], ps[2]||[]);
      ICO=Object.assign({}, ps[3]||{}, ps[4]||{}, ps[5]||{});
      ready=2;
      paint();
    }).catch(function(){
      ready=0;
      var list=document.getElementById("rzList");
      if(list) list.innerHTML='<p class="rzEmpty">Lexikon nicht geladen.</p>';
    });
  }
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
        var t=ev.target&&ev.target.closest?ev.target.closest("[data-fav],[data-nb]"):null; if(!t) return;
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
        tab=e.cat; q=""; toneF=""; var f=document.getElementById("rzFind"); if(f) f.value=""; flash=id; paint();
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
