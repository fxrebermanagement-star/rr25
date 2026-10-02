(function(){
  var DATA=[
    {id:"rosmarin",name:"Rosmarin",tone:"Soft",cat:"kraeuter",text:"Klarheit und Schutz am Rand, nicht hart."},
    {id:"salbei",name:"Salbei",tone:"Soft/Grenze",cat:"kraeuter",text:"Raum reinigen, Rauch kurz und bewusst."},
    {id:"lavendel",name:"Lavendel",tone:"Soft",cat:"kraeuter",text:"Nerven und Nacht, Feld weich halten."},
    {id:"beifuss",name:"Beifuß",tone:"Soft→Hard",cat:"kraeuter",text:"Traum/Schwelle, nur mit Rückkehr."},
    {id:"wermut",name:"Wermut",tone:"Hard",cat:"kraeuter",text:"Scharfes Trennen, Ethik und Anker Pflicht."},
    {id:"salz",name:"Salz",tone:"Soft",cat:"hausmittel",text:"Grenze ziehen, Kreis schließen."},
    {id:"zucker",name:"Zucker / Honig",tone:"Soft",cat:"hausmittel",text:"Anziehen und Süßen, nicht erzwingen."},
    {id:"zimt",name:"Zimt",tone:"Soft",cat:"hausmittel",text:"Wärme, Tempo, Geld/Fluss anstupsen."},
    {id:"obsidian",name:"Schwarzer Obsidian",tone:"Soft/Grenze",cat:"steine",text:"Spiegel und Absaugen, danach erden."},
    {id:"bergkristall",name:"Bergkristall",tone:"Soft",cat:"steine",text:"Verstärken was schon klar ist, nicht ersetzen."}
  ];
  var CAT_LAB={kraeuter:"Kräuter",hausmittel:"Hausmittel",steine:"Steine"};
  var TAB_ORDER=["kraeuter","hausmittel","steine"];
  var tab="kraeuter", q="", openId=null;

  var css=document.createElement("style");
  css.id="rr25-resonanzen";
  css.textContent=[
    "#mehrSheet .msGrid{grid-template-columns:repeat(2,1fr)!important}",
    "#mehrSheet .msItem[data-v=resonanzen] .ic{background:linear-gradient(160deg,#4a1f6a,#1e1030);color:#e7b8ff}",
    "#resonanzen .rzSearch{margin:.1rem 0 .45rem}",
    "#resonanzen .rzTabs{display:flex;flex-wrap:wrap;gap:.32rem;margin:0 0 .55rem}",
    "#resonanzen .rzList{display:flex;flex-direction:column;gap:.35rem}",
    "#resonanzen .rzRow{display:block;width:100%;text-align:left;border:1px solid rgba(232,160,255,.18);background:linear-gradient(180deg,rgba(48,18,72,.62),rgba(14,8,24,.9));border-radius:1.05rem;padding:.72rem .8rem;color:#f6f0ff;font:inherit;cursor:pointer}",
    "#resonanzen .rzRow:active{transform:scale(.99)}",
    "#resonanzen .rzRow b{display:block;font-family:Georgia,serif;font-size:1.02rem;font-weight:500}",
    "#resonanzen .rzTone{display:inline-block;margin-top:.28rem;font-size:.58rem;letter-spacing:.12em;text-transform:uppercase;color:#e7b8ff;border:1px solid rgba(231,184,255,.35);border-radius:999px;padding:.1rem .45rem}",
    "#resonanzen .rzTone[data-t=Soft]{color:#9eecc0;border-color:rgba(158,236,192,.35)}",
    "#resonanzen .rzTone[data-t=Hard]{color:#ff8aa0;border-color:rgba(255,138,160,.4)}",
    "#resonanzen .rzTone[data-t=\"Soft/Grenze\"],#resonanzen .rzTone[data-t=\"Soft→Hard\"]{color:#ffd2a0;border-color:rgba(255,210,160,.4)}",
    "#resonanzen .rzHint{margin:.2rem 0 .1rem;font-size:.68rem;color:#8e7aa8}",
    "#resonanzen .rzEmpty{margin:.8rem .2rem;color:#8e7aa8;font-size:.84rem}",
    "#rzCard{position:fixed;inset:0;z-index:50;display:flex;align-items:flex-end;justify-content:center;padding:0 .7rem calc(.7rem + env(safe-area-inset-bottom));background:rgba(4,2,10,.62);backdrop-filter:blur(4px)}",
    "#rzCard[hidden]{display:none!important}",
    "#rzCard .rzPanel{width:100%;max-width:26rem;border-radius:1.25rem 1.25rem 1.05rem 1.05rem;background:linear-gradient(180deg,rgba(42,16,66,.98),rgba(12,6,22,.99));border:1px solid rgba(232,160,255,.28);box-shadow:0 -12px 40px rgba(0,0,0,.55),0 0 28px rgba(255,122,217,.1);padding:.95rem .95rem 1rem;animation:rzUp .18s ease-out}",
    "#rzCard .rzPanel h3{margin:0 0 .2rem;font-family:Georgia,serif;font-weight:500;font-size:1.28rem;color:#fff}",
    "#rzCard .rzPanel .rzBody{margin:.55rem 0 .85rem;font-size:.95rem;line-height:1.5;color:#e6dcff}",
    "#rzCard .rzPanel .rzMeta{margin:0 0 .55rem;font-size:.68rem;color:#8e7aa8}",
    "@keyframes rzUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}"
  ].join("\n");
  document.head.appendChild(css);

  function esc(s){
    return String(s||"").replace(/[&<>"']/g,function(c){
      return ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c];
    });
  }
  function match(e){
    if(e.cat!==tab) return false;
    if(!q) return true;
    var hay=(e.name+" "+e.tone+" "+e.text+" "+(CAT_LAB[e.cat]||"")).toLowerCase();
    return hay.indexOf(q)>=0;
  }
  function closeCard(){
    openId=null;
    var el=document.getElementById("rzCard");
    if(el) el.hidden=true;
  }
  function openCard(id){
    var e=null;
    for(var i=0;i<DATA.length;i++){ if(DATA[i].id===id){ e=DATA[i]; break; } }
    if(!e) return;
    openId=id;
    var host=document.getElementById("rzCard");
    if(!host){
      host=document.createElement("div");
      host.id="rzCard";
      host.hidden=true;
      document.body.appendChild(host);
      host.addEventListener("click",function(ev){
        if(ev.target===host) closeCard();
      });
    }
    host.innerHTML=
      '<div class="rzPanel" role="dialog" aria-modal="true">'+
        "<h3>"+esc(e.name)+"</h3>"+
        '<span class="rzTone" data-t="'+esc(e.tone)+'">'+esc(e.tone)+"</span>"+
        '<p class="rzMeta">'+esc(CAT_LAB[e.cat]||e.cat)+"</p>"+
        '<p class="rzBody">'+esc(e.text)+"</p>"+
        '<div class="row"><button type="button" class="btn ghost" id="rzClose">Schließen</button></div>'+
      "</div>";
    host.hidden=false;
    var btn=document.getElementById("rzClose");
    if(btn) btn.onclick=function(){ closeCard(); };
  }
  function paint(){
    var root=document.getElementById("resonanzen");
    if(!root) return;
    var tabs=document.getElementById("rzTabs");
    var list=document.getElementById("rzList");
    var find=document.getElementById("rzFind");
    if(find && find.value.toLowerCase()!==q){ /* keep */ }
    if(tabs){
      tabs.innerHTML=TAB_ORDER.map(function(c){
        return '<button type="button" class="chip'+(tab===c?" on":"")+'" data-rz="'+c+'">'+CAT_LAB[c]+"</button>";
      }).join("");
      tabs.querySelectorAll("[data-rz]").forEach(function(b){
        b.onclick=function(){ tab=b.getAttribute("data-rz")||"kraeuter"; paint(); };
      });
    }
    if(!list) return;
    var rows=DATA.filter(match);
    if(!rows.length){
      list.innerHTML='<p class="rzEmpty">Nichts gefunden.</p>';
      return;
    }
    list.innerHTML=rows.map(function(e){
      return '<button type="button" class="rzRow" data-id="'+esc(e.id)+'">'+
        "<b>"+esc(e.name)+"</b>"+
        '<span class="rzTone" data-t="'+esc(e.tone)+'">'+esc(e.tone)+"</span>"+
      "</button>";
    }).join("");
    list.querySelectorAll("[data-id]").forEach(function(b){
      b.onclick=function(){ openCard(b.getAttribute("data-id")); };
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
    paint();
  }
  if(typeof show==="function" && !show._rz){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="resonanzen"){ closeCard(); boot(); }
      else closeCard();
      var m=document.getElementById("navMehr");
      if(m && id==="resonanzen") m.classList.add("on");
      return r;
    };
    show._rz=1;
  }
  document.addEventListener("keydown",function(ev){
    if(ev.key==="Escape") closeCard();
  });
  boot();
})();
