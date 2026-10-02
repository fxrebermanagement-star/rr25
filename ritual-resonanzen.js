(function(){
  var DATA=[];
  var CAT_LAB={kraeuter:"Kräuter",hausmittel:"Hausmittel",steine:"Steine"};
  var TAB_ORDER=["kraeuter","hausmittel","steine"];
  var tab="kraeuter", q="", toneF="", ready=0;
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
      return '<article class="rzRow">'+
        "<b>"+esc(e.name)+"</b>"+
        '<span class="rzTone" data-t="'+esc(e.tone)+'">'+esc(e.tone)+"</span>"+
        '<p class="rzTxt">'+esc(e.text)+"</p>"+
      "</article>";
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
      one("resonanzen-a.json?v=20"),
      one("resonanzen-b.json?v=20")
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
