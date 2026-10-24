/* ritual-ico.js — Build 115: eigene Neon-Violett-Zeichen statt Emoji (Sonne, Mondphasen, Herz, Hände, Auge).
   window.RR25_ICO.svg(name) liefert ein Inline-SVG. Ein Beobachter tauscht Emoji in sichtbarem Text gegen diese Zeichen.
   Ausgenommen: die Zeichen-Kachel (#sigilBox, Kachel «Zeichen»), die Sonne oben rechts (#sunWrap, Build 116: wieder Emoji), Eingabefelder, Auswahllisten, SVG und Canvas. */
(function(){
  if(window.RR25_ICO) return;
  var R=8.2, C=12;
  function moon(p){ /* p: 0 Neumond, .25 erstes Viertel, .5 Vollmond, .75 letztes Viertel */
    var wax=p<=.5, q=wax?p:1-p, k=Math.cos(2*Math.PI*q), rx=(Math.abs(k)*R).toFixed(2);
    var lit;
    if(q<.02) lit='';
    else if(q>.48) lit='<circle cx="12" cy="12" r="'+R+'" class="icF"/>';
    else lit='<path class="icF" d="M12 '+(C-R)+'A'+R+' '+R+' 0 0 1 12 '+(C+R)+'A'+rx+' '+R+' 0 0 '+(k>0?0:1)+' 12 '+(C-R)+'Z"'+(wax?'':' transform="matrix(-1 0 0 1 24 0)"')+'/>';
    return '<circle cx="12" cy="12" r="'+R+'" class="icO"/>'+lit;
  }
  /* Build 123: Mond als Bild. Perlmutt-Licht mit Krater, dunkle Seite schwach sichtbar, sanfter violett-rosa Schein.
     Ein gemeinsames <defs> im Dokument (rrMoDefs). p: 0 Neumond, .5 Vollmond, <.5 zunehmend (Licht rechts). */
  function defs(){
    if(document.getElementById("rrMoDefs")||!document.body) return;
    var d=document.createElement("div");
    d.innerHTML='<svg id="rrMoDefs" width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true" focusable="false"><defs>'+
      '<radialGradient id="rrMoLit" cx="36%" cy="32%" r="80%"><stop offset="0" stop-color="#fbfbfd"/><stop offset=".4" stop-color="#d9d9e0"/><stop offset=".78" stop-color="#a9a9b4"/><stop offset="1" stop-color="#7d7c8a"/></radialGradient>'+
      '<radialGradient id="rrMoDark" cx="42%" cy="38%" r="75%"><stop offset="0" stop-color="#3a3446"/><stop offset="1" stop-color="#17141f"/></radialGradient>'+
      '<radialGradient id="rrMoGlow" cx="50%" cy="50%" r="50%"><stop offset=".6" stop-color="#f4f2ff" stop-opacity=".5"/><stop offset=".8" stop-color="#cdbcff" stop-opacity=".18"/><stop offset="1" stop-color="#cdbcff" stop-opacity="0"/></radialGradient>'+
      '<radialGradient id="rrMoCr" cx="40%" cy="35%" r="65%"><stop offset="0" stop-color="#55525f" stop-opacity=".3"/><stop offset="1" stop-color="#3e3b48" stop-opacity=".55"/></radialGradient>'+
      '<radialGradient id="rrMoMa" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#6c6a78" stop-opacity=".55"/><stop offset=".7" stop-color="#76747f" stop-opacity=".4"/><stop offset="1" stop-color="#7a7884" stop-opacity="0"/></radialGradient>'+
      '<radialGradient id="rrMoHi" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff" stop-opacity=".8"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>'+
      '</defs></svg>';
    document.body.insertBefore(d.firstChild,document.body.firstChild);
  }
  var MR=9.2;
  function litPath(p){
    var wax=p<=.5, q=wax?p:1-p, k=Math.cos(2*Math.PI*q), rx=(Math.abs(k)*MR).toFixed(2), t=(12-MR).toFixed(2), b=(12+MR).toFixed(2);
    if(q<.02) return "";
    if(q>.485) return '<circle cx="12" cy="12" r="'+MR+'" fill="url(#rrMoLit)"/>';
    return '<path fill="url(#rrMoLit)" d="M12 '+t+'A'+MR+' '+MR+' 0 0 1 12 '+b+'A'+rx+' '+MR+' 0 0 '+(k>0?0:1)+' 12 '+t+'Z"'+(wax?'':' transform="matrix(-1 0 0 1 24 0)"')+'/>';
  }
  function art(p){
    defs(); p=((+p%1)+1)%1;
    var cr=[[9.2,9,1.7],[14.8,8.3,1.05],[13.4,14.4,2.05],[8.4,14.7,1.15],[16.4,12.7,.85],[11.3,11.7,.65],[6.6,11.4,.7]];
    var q=p<=.5?p:1-p, il=(1-Math.cos(2*Math.PI*q))/2, hx=12+6.5*(1-il)-2*il; if(p>.5) hx=24-hx;
    return '<circle cx="12" cy="12" r="11.9" fill="url(#rrMoGlow)" opacity="'+(.25+.75*il).toFixed(2)+'"/>'+
      '<circle cx="12" cy="12" r="'+MR+'" fill="url(#rrMoDark)"/>'+litPath(p)+
      '<ellipse cx="9.6" cy="9.4" rx="3.4" ry="2.6" fill="url(#rrMoMa)"/><ellipse cx="14.2" cy="10.6" rx="2.6" ry="3" fill="url(#rrMoMa)"/><ellipse cx="11.2" cy="15.2" rx="3.6" ry="2.2" fill="url(#rrMoMa)"/><ellipse cx="7.2" cy="13.2" rx="1.8" ry="2.4" fill="url(#rrMoMa)"/>'+
      cr.map(function(c){ return '<circle cx="'+c[0]+'" cy="'+c[1]+'" r="'+c[2]+'" fill="url(#rrMoCr)"/>'; }).join("")+
      (il>.04?'<ellipse cx="'+hx+'" cy="8" rx="'+(1.2+1.4*il).toFixed(2)+'" ry="1.6" fill="url(#rrMoHi)"/>':'')+
      '<circle cx="12" cy="12" r="'+MR+'" fill="none" stroke="#f2f0ff" stroke-opacity=".4" stroke-width=".4"/>';
  }
  var MOE=["\ud83c\udf11","\ud83c\udf12","\ud83c\udf13","\ud83c\udf14","\ud83c\udf15","\ud83c\udf16","\ud83c\udf17","\ud83c\udf18"];
  function moonEmoji(p){ p=((+p%1)+1)%1; /* Build 125: Haupt-Phasen nur um den echten Tag (±1 Tag), sonst Sichel/Dreiviertel */
    var T=.034, d=function(a){ return Math.abs(p-a)<T; };
    if(p<T||p>1-T) return MOE[0]; if(d(.25)) return MOE[2]; if(d(.5)) return MOE[4]; if(d(.75)) return MOE[6];
    return MOE[p<.25?1:p<.5?3:p<.75?5:7]; }
  /* Build 123: Mond als natives Phasen-Emoji, wie die Sonne */
  function moonSvg(p,cls){ var q=((+p%1)+1)%1, voll=Math.abs(q-.5)<.034; /* Build 125: Halo nur am echten Vollmond */
    return '<span class="rrMoon rrMoEmo'+(voll?" rrMoVoll":"")+(cls?" "+cls:"")+'" aria-hidden="true">'+moonEmoji(p)+'</span>'; }
  function moonArtSvg(p){ return '<text x="12" y="12" text-anchor="middle" dominant-baseline="central" font-size="22" font-family="Noto Color Emoji,Apple Color Emoji,Segoe UI Emoji,sans-serif">'+moonEmoji(p)+'</text>'; }
  function moonSvgOld(p,cls){ return '<svg class="rrMoon'+(cls?" "+cls:"")+'" viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+art(p)+'</svg>'; }
  var P={
    sonne:'<circle cx="12" cy="12" r="4.4" class="icF"/><path d="M12 2.6v2.6M12 18.8v2.6M2.6 12h2.6M18.8 12h2.6M5.4 5.4l1.8 1.8M16.8 16.8l1.8 1.8M5.4 18.6l1.8-1.8M16.8 7.2l1.8-1.8"/>',
    herz:'<path class="icF" d="M12 19.6s-7.2-4.4-7.2-9.4A3.9 3.9 0 0112 7.9a3.9 3.9 0 017.2 2.3c0 5-7.2 9.4-7.2 9.4z"/>',
    haende:'<path d="M11.4 20V9.6L9.6 4.8c-.5-1.2-2.1-.8-1.9.5l.9 5.1-2.7 4.4c-.5.8-.4 1.8.2 2.5L8.6 20"/><path d="M12.6 20V9.6l1.8-4.8c.5-1.2 2.1-.8 1.9.5l-.9 5.1 2.7 4.4c.5.8.4 1.8-.2 2.5L15.4 20"/>',
    auge:'<path d="M2.8 12s3.4-5.6 9.2-5.6S21.2 12 21.2 12s-3.4 5.6-9.2 5.6S2.8 12 2.8 12z"/><circle cx="12" cy="12" r="2.6" class="icF"/>'
  };
  var MP={"\ud83c\udf11":0,"\ud83c\udf12":.125,"\ud83c\udf13":.25,"\ud83c\udf14":.375,"\ud83c\udf15":.5,"\ud83c\udf16":.625,"\ud83c\udf17":.75,"\ud83c\udf18":.875};
  var NM={"\ud83c\udf11":"Neumond","\ud83c\udf12":"zunehmende Sichel","\ud83c\udf13":"erstes Viertel","\ud83c\udf14":"zunehmender Mond","\ud83c\udf15":"Vollmond","\ud83c\udf16":"abnehmender Mond","\ud83c\udf17":"letztes Viertel","\ud83c\udf18":"abnehmende Sichel"};
  function svg(name){
    if(name in MP) return moonSvg(MP[name],"rrIco rrIco-mondbild"); if(typeof name==="number") return moonSvg(name,"rrIco rrIco-mondbild");
    var body=P[name];
    if(!body) return "";
    var cls=typeof name==="string"&&P[name]?name:"mond";
    return '<svg class="rrIco rrIco-'+cls+'" viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+body+'</svg>';
  }
  var MAP={"\u2600\ufe0f":"sonne","\u2600":"sonne","\u2764\ufe0f":"herz","\u2764":"herz","\ud83d\ude4f":"haende","\ud83d\udc41\ufe0f":"auge","\ud83d\udc41":"auge"};
  for(var m in MP) MAP[m]=m;
  var LAB={sonne:"Sonne",herz:"Ich",haende:"Spiel",auge:"Quelle"};
  var RE=/\u2600\ufe0f?|\u2764\ufe0f?|\ud83d\ude4f|\ud83d\udc41\ufe0f?|\ud83c[\udf11-\udf18]/g;
  var SKIP=".rrMoEmo,.rrMoEmo *,#sigilBox,#sigilBox *,[data-go=sigilGo],#sigilGo,input,textarea,select,option,svg,canvas,script,style,title";
  function skipEl(el){
    if(!el||el.nodeType!==1) return true;
    if(el.closest&&el.closest(".rrMoEmo,#sigilBox,#sunWrap,svg,canvas,select,textarea,script,style,.tile.t4,[data-go=sigilGo]")) return true;
    return false;
  }
  function fix(node){
    var p=node.parentNode; if(!p||skipEl(p)) return;
    var t=node.nodeValue; RE.lastIndex=0; if(!RE.test(t)) return;
    RE.lastIndex=0;
    var frag=document.createDocumentFragment(), last=0, mm;
    while((mm=RE.exec(t))){
      if(mm.index>last) frag.appendChild(document.createTextNode(t.slice(last,mm.index)));
      var key=MAP[mm[0]]||MAP[mm[0].replace("\ufe0f","")], sp=document.createElement("span");
      sp.className="rrIcoW"; sp.innerHTML=svg(key);
      sp.setAttribute("role","img"); sp.setAttribute("aria-label",LAB[key]||NM[key]||"");
      frag.appendChild(sp); last=mm.index+mm[0].length;
    }
    if(last<t.length) frag.appendChild(document.createTextNode(t.slice(last)));
    p.replaceChild(frag,node);
  }
  function scan(root){
    if(!root) return;
    if(root.nodeType===3){ fix(root); return; }
    if(root.nodeType!==1||skipEl(root)) return;
    var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null), L=[], n;
    while((n=w.nextNode())){ RE.lastIndex=0; if(RE.test(n.nodeValue)) L.push(n); }
    L.forEach(fix);
  }
  function start(){
    var app=document.querySelector(".app")||document.body; scan(app);
    new MutationObserver(function(ms){
      ms.forEach(function(m){
        if(m.type==="characterData") fix(m.target);
        else m.addedNodes.forEach(scan);
      });
    }).observe(app,{childList:true,subtree:true,characterData:true});
  }
  window.RR25_ICO={svg:svg,scan:scan,moonArt:moonArtSvg,moonSvg:moonSvg,moonEmoji:moonEmoji,moon:function(p){ return svg(+p); }};
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",start); else start();
})();
