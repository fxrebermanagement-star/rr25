(function(){
  var DATA=[];
  var CAT_LAB={kraeuter:"Kräuter",hausmittel:"Hausmittel",steine:"Steine"};
  var TAB_ORDER=["kraeuter","hausmittel","steine"];
  var tab="kraeuter", q="", toneF="", ready=0;

  var ICO={
    rosmarin:'<svg viewBox="0 0 24 24"><path d="M12 20.5V6.2"/><path d="M12 16.4 8.2 14.2M12 16.4l3.8-2.2M12 13 7.6 11M12 13l4.4-2M12 9.8 8.8 8.1M12 9.8l3.2-1.7"/><path d="M10.7 6.1C11.2 4.6 12 3.6 12 3.6s.8 1 1.3 2.5"/></svg>',
    salbei:'<svg viewBox="0 0 24 24"><path d="M12 19.6c-3.8-2.6-5.8-6.4-4-10.4 1.4 1.4 3 3.2 4 6.2"/><path d="M12 18.2c3.8-2.6 5.8-6.2 3.8-10.2-1.6 1.6-3 3.4-3.8 6.4"/><path d="M12 19.2V8.4"/></svg>',
    lavendel:'<svg viewBox="0 0 24 24"><path d="M12 21.2V9.2"/><circle cx="12" cy="6.6" r="1.15"/><circle cx="9.5" cy="8.8" r="1.15"/><circle cx="14.5" cy="8.8" r="1.15"/><circle cx="10.3" cy="11.5" r="1.05"/><circle cx="13.7" cy="11.5" r="1.05"/></svg>',
    beifuss:'<svg viewBox="0 0 24 24"><path d="M12 21V4.2"/><path d="M12 16.2 7.4 13.2M12 15.4 16.8 12.6"/><path d="M12 12.2 8 9.4M12 11.4 16.2 8.8"/><path d="M12 8.2 9.2 6.2M12 7.6 15 5.5"/><path d="M12 4.4 10.6 3.2"/></svg>',
    wermut:'<svg viewBox="0 0 24 24"><path d="M12 20.6V5"/><path d="M12 16.2c-3.4-.2-5.2 1.4-5.8-.8 1-1.4 3-1.2 5.8-.6"/><path d="M12 12.4c3.4-.2 5.2 1 5.6-.8-.8-1.2-2.8-1-5.6-.5"/><path d="M12 8.8c-2.6-.2-4.1.9-4.5-.7.7-1 2.3-.8 4.5-.3"/><path d="M12 5.2c.8-1.4 1.6-2 1.6-2"/></svg>',
    salz:'<svg viewBox="0 0 24 24"><path d="M6.8 13.4h10.4"/><path d="M7.8 13.4c-.3 3.4 1.5 5.2 4.2 5.2s4.5-1.8 4.2-5.2"/><path d="M9.2 11.2V9.4M12 10.2V7.2M14.8 11.2V9.4"/></svg>',
    zucker:'<svg viewBox="0 0 24 24"><path d="M8.6 9.4h6.8v7.4a1.7 1.7 0 0 1-1.7 1.7h-3.4a1.7 1.7 0 0 1-1.7-1.7Z"/><path d="M9.8 9.4V7.6h4.4v1.8"/><path d="M12 13v2.3"/><path d="M12 16.1c.8.55 1.15 1.15.55 1.7"/></svg>',
    zimt:'<svg viewBox="0 0 24 24"><path d="M7.4 16.8c2.4-2.3 5.4-5.2 7.6-7.3 1.3-1.2 2.8-.3 1.7 1.2-1.8 2.5-4.8 5.4-7.3 7.5-1.2 1-2.6.2-2-1.4Z"/><path d="M9.2 15.2c1.8-1.7 4-3.8 5.5-5.3"/></svg>',
    obsidian:'<svg viewBox="0 0 24 24"><path d="M8.1 16c-1.7-2.3-1.3-5.6 1.5-7.4 2.4-1.6 5.5-1.2 7.3 1.1 1.9 2.3 1.6 5.4-.5 7.2-2.1 1.9-6 1.7-8.3-.9Z"/><path d="M10 11.1c1.3-1.1 2.8-1.3 3.8-.3"/></svg>',
    bergkristall:'<svg viewBox="0 0 24 24"><path d="M12 3.2 16.3 10.2 15.3 20.4H8.7L7.7 10.2Z"/><path d="M12 3.2v17.2"/><path d="M7.7 10.2h8.6"/></svg>'
  };
  var TONE_CHIPS=[["","Alle"],["Soft","Soft"],["Soft/Grenze","Grenze"],["Soft→Hard","Soft→Hard"],["Hard","Hard"]];

  var css=document.createElement("style");
  css.id="rr25-resonanzen";
  css.textContent=[
    "#mehrSheet .msGrid{grid-template-columns:repeat(2,1fr)!important}",
    "#mehrSheet .msItem[data-v=resonanzen] .ic{background:linear-gradient(160deg,#4a1f6a,#1e1030);color:#e7b8ff}",
    "#resonanzen .rzTop{display:flex;flex-wrap:wrap;gap:.4rem;align-items:center;margin:.1rem 0 .45rem}",
    "#resonanzen .rzSearch{margin:0;flex:1 1 9rem;min-width:8.5rem}",
    "#resonanzen .rzTones{display:flex;flex-wrap:wrap;gap:.32rem}",
    "#resonanzen .rzTabs{display:flex;flex-wrap:wrap;gap:.32rem;margin:0 0 .55rem}",
    "#resonanzen .rzList{display:flex;flex-direction:column;gap:.4rem}",
    "#resonanzen .rzRow{display:block;width:100%;text-align:left;border:1px solid rgba(232,160,255,.18);background:linear-gradient(180deg,rgba(48,18,72,.62),rgba(14,8,24,.9));border-radius:1.05rem;padding:.72rem .85rem .78rem;color:#f6f0ff}",
    "#resonanzen .rzRow.rzHas{display:flex;gap:.62rem;align-items:flex-start}",
    "#resonanzen .rzHas .rzMain{flex:1;min-width:0}",
    "#resonanzen .rzIco{flex:none;width:32px;height:32px;margin-top:.06rem;color:#e7b8ff;filter:drop-shadow(0 0 5px rgba(231,184,255,.7))}",
    "#resonanzen .rzIco svg{width:32px;height:32px;display:block;stroke:currentColor;fill:none;stroke-width:1.65;stroke-linecap:round;stroke-linejoin:round}",
    "#resonanzen .rzRow b{display:block;font-family:Georgia,serif;font-size:1.02rem;font-weight:500}",
    "#resonanzen .rzTone{display:inline-block;margin-top:.28rem;font-size:.58rem;letter-spacing:.12em;text-transform:uppercase;color:#e7b8ff;border:1px solid rgba(231,184,255,.35);border-radius:999px;padding:.1rem .45rem}",
    "#resonanzen .rzTone[data-t=Soft]{color:#9eecc0;border-color:rgba(158,236,192,.35)}",
    "#resonanzen .rzTone[data-t=Hard]{color:#ff8aa0;border-color:rgba(255,138,160,.4)}",
    "#resonanzen .rzTone[data-t=\"Soft/Grenze\"],#resonanzen .rzTone[data-t=\"Soft→Hard\"]{color:#ffd2a0;border-color:rgba(255,210,160,.4)}",
    "#resonanzen .rzTxt{display:block;margin:.42rem 0 0;font-size:.88rem;line-height:1.45;color:#e6dcff}",
    "#resonanzen .rzHint{margin:.2rem 0 .1rem;font-size:.68rem;color:#8e7aa8}",
    "#resonanzen .rzEmpty{margin:.8rem .2rem;color:#8e7aa8;font-size:.84rem}"
  ].join("\n");
  document.head.appendChild(css);

  function esc(s){
    return String(s||"").replace(/[&<>"']/g,function(c){
      return ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c];
    });
  }
  function match(e){
    if(!e || e.cat!==tab) return false;
    if(toneF && e.tone!==toneF) return false;
    if(!q) return true;
    var hay=(e.name+" "+e.tone+" "+e.text+" "+(CAT_LAB[e.cat]||"")).toLowerCase();
    return hay.indexOf(q)>=0;
  }
  function paint(){
    var root=document.getElementById("resonanzen");
    if(!root) return;
    var tabs=document.getElementById("rzTabs");
    var tones=document.getElementById("rzTones");
    var list=document.getElementById("rzList");
    if(tones){
      tones.innerHTML=TONE_CHIPS.map(function(c){
        return '<button type="button" class="chip'+(toneF===c[0]?" on":"")+'" data-tn="'+c[0]+'">'+c[1]+"</button>";
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
    if(!list) return;
    if(ready!==2){
      list.innerHTML='<p class="rzEmpty">Lädt…</p>';
      return;
    }
    var rows=DATA.filter(match);
    if(!rows.length){
      list.innerHTML='<p class="rzEmpty">Nichts gefunden.</p>';
      return;
    }
    list.innerHTML=rows.map(function(e){
      var inner="<b>"+esc(e.name)+"</b>"+
        '<span class="rzTone" data-t="'+esc(e.tone)+'">'+esc(e.tone)+"</span>"+
        '<p class="rzTxt">'+esc(e.text)+"</p>";
      var ico=ICO[e.id];
      if(!ico) return '<article class="rzRow">'+inner+"</article>";
      return '<article class="rzRow rzHas"><span class="rzIco" aria-hidden="true">'+ico+'</span><div class="rzMain">'+inner+"</div></article>";
    }).join("");
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
      one("resonanzen-a.json?v=21"),
      one("resonanzen-b.json?v=21")
    ]).then(function(ps){
      DATA=(ps[0]||[]).concat(ps[1]||[]);
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
