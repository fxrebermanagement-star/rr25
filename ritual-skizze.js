(function(){
  var KEY="rr25_skizze";
  var ZKEY="rr25_tagesziel_v1";
  var A=
    '<svg viewBox="0 0 360 190" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'+
    '<line x1="96" y1="62" x2="138" y2="62" stroke="#8a7aa0" stroke-width="1.6"/>'+
    '<line x1="222" y1="62" x2="264" y2="62" stroke="#8a7aa0" stroke-width="1.6"/>'+
    '<circle cx="64" cy="62" r="30" fill="#0b0812" stroke="#c0aad8" stroke-width="1.8"/>'+
    '<circle cx="180" cy="62" r="30" fill="#0b0812" stroke="#7ec8c0" stroke-width="1.8"/>'+
    '<circle cx="296" cy="62" r="30" fill="#0b0812" stroke="#d89ac0" stroke-width="1.8"/>'+
    '<text x="64" y="70" text-anchor="middle" font-size="24" fill="#f0e6fa" font-family="Georgia,serif">3</text>'+
    '<text x="180" y="70" text-anchor="middle" font-size="24" fill="#e4faf6" font-family="Georgia,serif">6</text>'+
    '<text x="296" y="70" text-anchor="middle" font-size="24" fill="#fadcea" font-family="Georgia,serif">9</text>'+
    '<text x="64" y="112" text-anchor="middle" font-size="13" fill="#b0a0c4" font-family="system-ui,sans-serif">stehen</text>'+
    '<text x="180" y="112" text-anchor="middle" font-size="13" fill="#8cbcb6" font-family="system-ui,sans-serif">tragen</text>'+
    '<text x="296" y="112" text-anchor="middle" font-size="13" fill="#d0a0b8" font-family="system-ui,sans-serif">siegeln</text>'+
    '<path d="M280 138 C 180 172, 180 172, 80 138" fill="none" stroke="#a8889c" stroke-width="1.5"/>'+
    '<polyline points="90,146 80,138 92,134" fill="none" stroke="#a8889c" stroke-width="1.5"/>'+
    '</svg>';
  var B=
    '<svg viewBox="0 0 360 190" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">'+
    '<line x1="96" y1="62" x2="138" y2="62" stroke="#8a7aa0" stroke-width="1.6"/>'+
    '<line x1="222" y1="62" x2="264" y2="62" stroke="#8a7aa0" stroke-width="1.6"/>'+
    '<circle cx="64" cy="62" r="30" fill="#0b0812" stroke="#7ec8a0" stroke-width="1.8"/>'+
    '<circle cx="180" cy="62" r="30" fill="#0b0812" stroke="#c0aad8" stroke-width="1.8"/>'+
    '<circle cx="296" cy="62" r="30" fill="#0b0812" stroke="#e8c070" stroke-width="1.8"/>'+
    '<text x="64" y="68" text-anchor="middle" font-size="13" fill="#d8f0e4" font-family="Georgia,serif">Erde</text>'+
    '<text x="180" y="68" text-anchor="middle" font-size="13" fill="#eee4f8" font-family="Georgia,serif">Mensch</text>'+
    '<text x="296" y="68" text-anchor="middle" font-size="12" fill="#f8e8c0" font-family="Georgia,serif">Universum</text>'+
    '<text x="64" y="112" text-anchor="middle" font-size="13" fill="#b0a0c4" font-family="system-ui,sans-serif">stehen</text>'+
    '<text x="180" y="112" text-anchor="middle" font-size="13" fill="#8cbcb6" font-family="system-ui,sans-serif">tragen</text>'+
    '<text x="296" y="112" text-anchor="middle" font-size="13" fill="#c8b080" font-family="system-ui,sans-serif">siegeln</text>'+
    '<path d="M280 138 C 180 172, 180 172, 80 138" fill="none" stroke="#a8889c" stroke-width="1.5"/>'+
    '<polyline points="90,146 80,138 92,134" fill="none" stroke="#a8889c" stroke-width="1.5"/>'+
    '</svg>';
  function today(){
    var n=new Date();
    return n.getFullYear()+"-"+String(n.getMonth()+1).padStart(2,"0")+"-"+String(n.getDate()).padStart(2,"0");
  }
  function loadZ(){
    try{ return JSON.parse(localStorage.getItem(ZKEY)||"{}"); }catch(e){ return {}; }
  }
  function saveZ(d){ try{ localStorage.setItem(ZKEY, JSON.stringify(d)); }catch(e){} }
  function locked(){
    var d=loadZ();
    return (d.day===today() && d.txt) ? d : null;
  }
  function esc(s){ return String(s||"").replace(/&/g,"&").replace(/</g,"<").replace(/>/g,">"); }
  function mode(){
    try{ return localStorage.getItem(KEY)==="emu"?"emu":"369"; }catch(e){ return "369"; }
  }
  function setMode(m){ try{ localStorage.setItem(KEY,m); }catch(e){} }
  function startOnly(){
    return !document.querySelector("#cats .chip.on");
  }
  function toLog(txt){
    if(typeof load!=="function"||typeof save!=="function") return;
    var d=load();
    d.log=d.log||[];
    var day=today();
    var exists=d.log.some(function(e){
      return e.titel==="Tagesziel" && String(e.day||"")===day;
    });
    if(exists) return;
    d.log.unshift({
      id: typeof uid==="function"?uid():("z"+Date.now().toString(36)),
      t: typeof now==="function"?now():new Date().toLocaleString("de-CH"),
      titel:"Tagesziel",
      wer: txt,
      note: txt,
      day: day
    });
    try{ save(d); }catch(e){}
  }
  function bindForm(el){
    var go=el.querySelector("#skZielGo");
    var inp=el.querySelector("#skZielT");
    if(!go||!inp) return;
    go.onclick=function(ev){
      ev.preventDefault();
      ev.stopPropagation();
      var t=String(inp.value||"").trim();
      if(!t) return;
      t=t.slice(0,180);
      saveZ({day:today(), txt:t});
      toLog(t);
      draw(el);
    };
  }
  function draw(el){
    var z=locked();
    var svg=mode()==="emu"?B:A;
    if(z){
      el.innerHTML=svg+'<p class="skZiel"><span>Tagesziel</span>'+esc(z.txt)+'</p>';
    } else {
      el.innerHTML=svg+
        '<div class="skForm">'+
        '<span>Tagesziel</span>'+
        '<input id="skZielT" maxlength="180" placeholder="Ein Satz für heute" autocomplete="off">'+
        '<button type="button" class="btn primary" id="skZielGo">Setzen</button>'+
        '</div>';
      bindForm(el);
    }
  }
  function mount(){
    var home=document.getElementById("home");
    var list=document.getElementById("list");
    if(!home) return null;
    var el=document.getElementById("skizze");
    if(!el){
      el=document.createElement("div");
      el.id="skizze";
      if(list) home.insertBefore(el, list);
      else home.appendChild(el);
      el.addEventListener("click", function(ev){
        if(ev.target.closest && (ev.target.closest(".skZiel")||ev.target.closest(".skForm"))) return;
        ev.stopPropagation();
        setMode(mode()==="emu"?"369":"emu");
        draw(el);
      });
    } else {
      draw(el);
    }
    if(!el.querySelector("svg")) draw(el);
    return el;
  }
  function paint(){
    var el=mount();
    if(!el) return;
    el.style.display=startOnly()?"block":"none";
  }
  var css=document.createElement("style");
  css.textContent=[
    "#skizze{display:block;margin:.15rem auto .2rem;width:92%;max-width:24rem;cursor:pointer}",
    "#skizze svg{display:block;width:100%;height:10.6rem}",
    "#skizze .skZiel{margin:.05rem 0 .15rem;text-align:center;font-family:Georgia,serif;font-size:.92rem;line-height:1.4;color:#ead8ff;cursor:default}",
    "#skizze .skZiel span,#skizze .skForm span{display:block;margin-bottom:.12rem;letter-spacing:.16em;text-transform:uppercase;font-size:.58rem;font-family:system-ui,sans-serif;color:#ff7ad9}",
    "#skizze .skForm{margin:.1rem 0 .2rem;text-align:center;cursor:default}",
    "#skizze .skForm input{text-align:center;margin:.2rem 0}",
    "#home:has(#cats .chip.on) #skizze{display:none!important}"
  ].join("");
  document.head.appendChild(css);
  mount(); paint();
  setTimeout(paint, 80);
  setTimeout(paint, 240);
  document.addEventListener("click", function(e){
    if(e.target.closest && e.target.closest("#skizze")) return;
    setTimeout(paint, 0); setTimeout(paint, 80);
  });
  if(typeof renderList==="function" && !renderList._sk){
    var rl=renderList;
    renderList=function(){ rl(); paint(); };
    renderList._sk=1;
  }
  if(typeof show==="function" && !show._sk){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="home") setTimeout(paint, 30);
      return r;
    };
    show._sk=1;
  }
})();
