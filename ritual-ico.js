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
  var P={
    sonne:'<circle cx="12" cy="12" r="4.4" class="icF"/><path d="M12 2.6v2.6M12 18.8v2.6M2.6 12h2.6M18.8 12h2.6M5.4 5.4l1.8 1.8M16.8 16.8l1.8 1.8M5.4 18.6l1.8-1.8M16.8 7.2l1.8-1.8"/>',
    herz:'<path class="icF" d="M12 19.6s-7.2-4.4-7.2-9.4A3.9 3.9 0 0112 7.9a3.9 3.9 0 017.2 2.3c0 5-7.2 9.4-7.2 9.4z"/>',
    haende:'<path d="M11.4 20V9.6L9.6 4.8c-.5-1.2-2.1-.8-1.9.5l.9 5.1-2.7 4.4c-.5.8-.4 1.8.2 2.5L8.6 20"/><path d="M12.6 20V9.6l1.8-4.8c.5-1.2 2.1-.8 1.9.5l-.9 5.1 2.7 4.4c.5.8.4 1.8-.2 2.5L15.4 20"/>',
    auge:'<path d="M2.8 12s3.4-5.6 9.2-5.6S21.2 12 21.2 12s-3.4 5.6-9.2 5.6S2.8 12 2.8 12z"/><circle cx="12" cy="12" r="2.6" class="icF"/>'
  };
  var MP={"\ud83c\udf11":0,"\ud83c\udf12":.125,"\ud83c\udf13":.25,"\ud83c\udf14":.375,"\ud83c\udf15":.5,"\ud83c\udf16":.625,"\ud83c\udf17":.75,"\ud83c\udf18":.875};
  var NM={"\ud83c\udf11":"Neumond","\ud83c\udf12":"zunehmende Sichel","\ud83c\udf13":"erstes Viertel","\ud83c\udf14":"zunehmender Mond","\ud83c\udf15":"Vollmond","\ud83c\udf16":"abnehmender Mond","\ud83c\udf17":"letztes Viertel","\ud83c\udf18":"abnehmende Sichel"};
  function svg(name){
    var body=P[name]; if(name in MP) body=moon(MP[name]); else if(typeof name==="number") body=moon(name);
    if(!body) return "";
    var cls=typeof name==="string"&&P[name]?name:"mond";
    return '<svg class="rrIco rrIco-'+cls+'" viewBox="0 0 24 24" aria-hidden="true" focusable="false">'+body+'</svg>';
  }
  var MAP={"\u2600\ufe0f":"sonne","\u2600":"sonne","\u2764\ufe0f":"herz","\u2764":"herz","\ud83d\ude4f":"haende","\ud83d\udc41\ufe0f":"auge","\ud83d\udc41":"auge"};
  for(var m in MP) MAP[m]=m;
  var LAB={sonne:"Sonne",herz:"Ich",haende:"Spiel",auge:"Quelle"};
  var RE=/\u2600\ufe0f?|\u2764\ufe0f?|\ud83d\ude4f|\ud83d\udc41\ufe0f?|\ud83c[\udf11-\udf18]/g;
  var SKIP="#sigilBox,#sigilBox *,[data-go=sigilGo],#sigilGo,input,textarea,select,option,svg,canvas,script,style,title";
  function skipEl(el){
    if(!el||el.nodeType!==1) return true;
    if(el.closest&&el.closest("#sigilBox,#sunWrap,svg,canvas,select,textarea,script,style,.tile.t4,[data-go=sigilGo]")) return true;
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
  window.RR25_ICO={svg:svg,scan:scan,moon:function(p){ return svg(+p); }};
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",start); else start();
})();
