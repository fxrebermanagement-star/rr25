/* ritual-danksatz.js — Build 49: «Dank-Satz des Tages» am Ende von «Dank ans Feld» (dankfeld).
   30 kurze Sätze, pro Kalendertag fest (gleicher Tag = gleicher Satz), zum Mitnehmen und Kopieren.
   Erscheint auf dem Schluss-Bildschirm (#after) nur nach dankfeld. Keine neuen Schlüssel im Speicher. */
(function(){
  if(window.__rr25ds) return; window.__rr25ds=1;
  var S=[
    "Danke für das, was heute schon getragen hat.",
    "Ich danke für den Boden unter meinen Füssen.",
    "Danke, dass ich nicht alles allein halten muss.",
    "Ich danke für jedes Zeichen, das ich gesehen habe.",
    "Danke für die kleinen Wege, die sich geöffnet haben.",
    "Ich danke für Atem, Licht und einen klaren Moment.",
    "Danke für die Menschen, die mir guttun.",
    "Ich danke für das, was still gewachsen ist.",
    "Danke für Schutz, auch wo ich ihn nicht bemerkt habe.",
    "Ich danke dem Feld. Es hat gehört.",
    "Danke für die Kraft, die zurückgekommen ist.",
    "Ich danke für Wärme im Haus und Ruhe im Herzen.",
    "Danke für das Geld, das fliesst, und für das, was reicht.",
    "Ich danke für die Liebe, die schon da ist.",
    "Danke für den Mut, heute einen Schritt zu gehen.",
    "Ich danke für das, was sich gefügt hat.",
    "Danke für Gesundheit in jedem Atemzug.",
    "Ich danke für Grenzen, die gehalten haben.",
    "Danke für das Lachen zwischendurch.",
    "Ich danke für Wasser, Brot und einen sicheren Ort.",
    "Danke für jede Antwort, auch für die leisen.",
    "Ich danke für das, was ich loslassen durfte.",
    "Danke für Geduld mit mir selbst.",
    "Ich danke für den Mond, der mitgeht.",
    "Danke für das Glück, das ich heute bemerke.",
    "Ich danke für Klarheit, wo vorher Nebel war.",
    "Danke für das, was kommt. Ich bin bereit.",
    "Ich danke für meine Hände und was sie heute geben.",
    "Danke für die Stille, in der alles ankommt.",
    "Ich habe es gesehen. Danke, Feld."
  ];
  function dayNo(d){ d=d||new Date(); return Math.floor(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())/86400000); }
  function satz(d){ var n=dayNo(d); return S[((n*7)%S.length+S.length)%S.length]; }
  function h(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
  function copy(txt,btn){
    function ok(){ btn.textContent="Kopiert"; btn.classList.add("on"); setTimeout(function(){ btn.textContent="Kopieren"; btn.classList.remove("on"); },1800); }
    function alt(){
      try{ var ta=document.createElement("textarea"); ta.value=txt; ta.setAttribute("readonly",""); ta.style.position="fixed"; ta.style.opacity="0"; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove(); ok(); }
      catch(e){ btn.textContent="Bitte markieren"; }
    }
    try{ if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(txt).then(ok,alt); return; } }catch(e){}
    alt();
  }
  function paint(){
    var af=document.getElementById("after"), old=document.getElementById("dsCard");
    if(old) old.remove();
    if(!af||window._rid!=="dankfeld") return;
    var t=satz(), el=document.createElement("div");
    el.id="dsCard"; el.className="card";
    el.innerHTML='<p class="dsTag">Dank-Satz des Tages · zum Mitnehmen</p><p class="dsTxt" id="dsTxt">«'+h(t)+'»</p><button type="button" class="btn ghost" id="dsCopy">Kopieren</button>';
    var go=document.getElementById("afterGo"), row=go&&go.closest(".row");
    if(row&&row.parentNode===af) af.insertBefore(el,row); else af.appendChild(el);
    el.querySelector("#dsCopy").onclick=function(){ copy(t,this); };
  }
  var css=document.createElement("style");
  css.textContent=[
    "#after>#dsCard{margin:.4rem 0 1rem;padding:.85rem 1rem .8rem;text-align:center;border-radius:1.1rem;border:1px solid rgba(46,204,113,.4);background:linear-gradient(160deg,rgba(40,20,70,.8),rgba(14,8,26,.94));box-shadow:0 0 18px rgba(95,224,160,.14)}",
    "#dsCard .dsTag{margin:0 0 .35rem;font-size:.58rem;letter-spacing:.18em;text-transform:uppercase;color:#7dffb0}",
    "#dsCard .dsTxt{margin:0 0 .6rem;font-family:Georgia,serif;font-size:1.12rem;line-height:1.45;color:#eaf2ff;-webkit-user-select:text;user-select:text}",
    "#dsCopy{min-height:2.1rem!important;padding:.35rem 1.1rem!important;font-size:.78rem!important;border-radius:999px!important;border:1px solid rgba(200,120,255,.35)!important;background:rgba(160,90,255,.1)!important;color:#e4ecff!important}",
    "#dsCopy.on{border-color:rgba(46,204,113,.6)!important;color:#7dffb0!important}"
  ].join("");
  document.head.appendChild(css);
  if(typeof show==="function"&&!show._ds){ var sh=show; show=function(id){ var r=sh.apply(this,arguments); if(id==="after") paint(); else { var o=document.getElementById("dsCard"); if(o) o.remove(); } return r; }; show._ds=1; }
  window.RR25_DANKSATZ={satz:satz,alle:S};
})();
