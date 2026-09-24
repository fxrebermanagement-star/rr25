(function(){
  var ICO={
    home:'<svg viewBox="0 0 24 24"><path d="M8 19c0-2 1.6-4 4-5.2C14.4 15 16 17 16 19"/><path d="M12 4.2l1.1 3.2 3.4.1-2.7 2.1.9 3.3L12 11.2 9.3 12.9l.9-3.3-2.7-2.1 3.4-.1z"/></svg>',
    geplant:'<svg viewBox="0 0 24 24"><rect x="5" y="6" width="14" height="13" rx="2.2"/><path d="M8 4v3M16 4v3M5 10h14"/><path d="M8 14h3M13 17h3"/></svg>',
    kal:'<svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="6.2"/><path d="M12 9.4v3.8l2.4 1.4"/><path d="M9 4.6h6"/></svg>',
    log:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="7"/><path d="M12 8v4.4l2.8 1.6"/></svg>',
    notiz:'<svg viewBox="0 0 24 24"><path d="M7.2 5.2h8.2L19 8.8V19H7.2z"/><path d="M15.2 5.2V9H19M9 12.5h6M9 15.6h4"/></svg>',
    opfer:'<svg viewBox="0 0 24 24"><path d="M12 4.2l2.4 4.8 5.2 1.1-4 3.4 1.2 5.1L12 16.4 7.2 18.6l1.2-5.1-4-3.4 5.2-1.1z"/></svg>',
    buch:'<svg viewBox="0 0 24 24"><path d="M6 5.4h10.2A2.6 2.6 0 0119 8v11.2H8.4A2.4 2.4 0 016 16.8V5.4z"/><path d="M8.2 19.2A2.4 2.4 0 016 16.8"/></svg>'
  };
  var LAB={home:"Rituale",geplant:"Geplant",kal:"Kalender",log:"Chronik",notiz:"Notiz",opfer:"Gabe",buch:"Buch"};
  function paint(){
    document.querySelectorAll("nav button[data-v]").forEach(function(b){
      var v=b.getAttribute("data-v");
      if(!ICO[v] || b.querySelector(".ic")) return;
      b.innerHTML='<span class="ic">'+ICO[v]+'</span><span class="lb">'+(LAB[v]||v)+'</span>';
    });
  }
  var css=document.createElement("style");
  css.textContent=[
    "nav{background:rgba(10,6,18,.94)!important;border-color:rgba(255,122,217,.16)!important;box-shadow:0 -10px 28px rgba(0,0,0,.35)}",
    "nav .navR{gap:.28rem!important}",
    "nav button{background:transparent!important;color:#d7c6ee!important;font-weight:550!important;font-size:.58rem!important;letter-spacing:.02em;min-height:3.55rem!important;padding:.18rem .04rem .1rem!important;gap:.22rem!important;border-radius:1rem!important}",
    "nav button .ic{width:2.55rem;height:2.55rem;border-radius:1.05rem;display:grid;place-items:center;box-shadow:inset 0 0 0 1px rgba(255,255,255,.08),0 6px 14px rgba(0,0,0,.22)}",
    "nav button .ic svg{width:22px!important;height:22px!important;stroke:currentColor;fill:none;stroke-width:1.85;stroke-linecap:round;stroke-linejoin:round}",
    "nav button[data-v=home] .ic{background:linear-gradient(160deg,#5a1848,#2a1238);color:#ff9ae4}",
    "nav button[data-v=geplant] .ic{background:linear-gradient(160deg,#5a221c,#2a1214);color:#ff9a8a}",
    "nav button[data-v=kal] .ic{background:linear-gradient(160deg,#2c2460,#16122e);color:#b8a8ff}",
    "nav button[data-v=log] .ic{background:linear-gradient(160deg,#163a3a,#0e1c22);color:#7ef0e6}",
    "nav button[data-v=notiz] .ic{background:linear-gradient(160deg,#3a2460,#1a1230);color:#d2b6ff}",
    "nav button[data-v=opfer] .ic{background:linear-gradient(160deg,#1c3a28,#101c16);color:#9eecc0}",
    "nav button[data-v=buch] .ic{background:linear-gradient(160deg,#16324a,#101820);color:#8fd4ff}",
    "nav button.on{background:rgba(255,255,255,.06)!important;color:#fff!important}",
    "nav button.on .ic{transform:translateY(-1px);box-shadow:0 0 16px currentColor,inset 0 0 0 1px rgba(255,255,255,.2)}",
    "nav button[data-v=home].on{background:rgba(255,122,217,.16)!important}",
    "nav button[data-v=geplant].on{background:rgba(255,139,122,.16)!important}",
    "nav button[data-v=kal].on{background:rgba(155,140,255,.16)!important}",
    "nav button[data-v=log].on{background:rgba(126,240,230,.14)!important}",
    "nav button[data-v=notiz].on{background:rgba(201,166,255,.16)!important}",
    "nav button[data-v=opfer].on{background:rgba(142,230,168,.14)!important}",
    "nav button[data-v=buch].on{background:rgba(126,200,255,.14)!important}",
    "nav button .lb{line-height:1.1}",
    "main{padding-bottom:9.1rem!important}"
  ].join("");
  document.head.appendChild(css);
  paint();
  setTimeout(paint,80);
})();
