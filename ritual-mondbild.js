/* ritual-mondbild.js — Build 50: Mond in der Kopfzeile als kleines SVG mit der echten Phase (statt Emoji).
   Phase: RR25_MOND.phase() (ritual-mondphase.js, Gerätezeit = Bern). Licht rechts = zunehmend, links = abnehmend.
   Text unter dem Mond bleibt wie bisher. Keine Schlüssel im Speicher. */
(function(){
  if(window.RR25_MONDBILD) return;
  function path(p){
    var k=Math.cos(2*Math.PI*p), rx=Math.abs(k)*10, wax=p<.5;
    var outer=wax?1:0, term=wax?(k>0?0:1):(k>0?1:0);
    return "M12 2A10 10 0 0 "+outer+" 12 22A"+rx.toFixed(2)+" 10 0 0 "+term+" 12 2Z";
  }
  function svg(p){
    if(window.RR25_ICO&&window.RR25_ICO.moonSvg) return window.RR25_ICO.moonSvg(p,"mbSvg"); /* Build 123 */
    var lit=(1-Math.cos(2*Math.PI*p))/2, d=lit>.995?"M12 2A10 10 0 1 1 12 22A10 10 0 1 1 12 2Z":(lit<.005?"":path(p));
    return '<svg class="mbSvg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">'+
      '<defs><radialGradient id="mbLit" cx="40%" cy="38%" r="70%"><stop offset="0" stop-color="#fff8ff"/><stop offset=".65" stop-color="#eadcff"/><stop offset="1" stop-color="#c9b2f2"/></radialGradient></defs>'+
      '<circle cx="12" cy="12" r="10" fill="#1d1430" stroke="rgba(214,180,255,.45)" stroke-width=".7"/>'+
      (d?'<path d="'+d+'" fill="url(#mbLit)"/>':'')+
      '<circle cx="12" cy="12" r="10" fill="none" stroke="rgba(255,255,255,.12)" stroke-width=".35"/></svg>';
  }
  var busy=false, lastKey="";
  function paint(){
    var el=document.getElementById("moonSym"), M=window.RR25_MOND; if(!el||!M) return;
    var p=M.phase(Date.now()), key=p.toFixed(3);
    if(key===lastKey && el.querySelector(".mbSvg")) return;
    busy=true; lastKey=key;
    var m=M.day(); el.setAttribute("aria-label","Mond: "+m.name+", "+Math.round((1-Math.cos(2*Math.PI*p))*50)+" % beleuchtet");
    el.setAttribute("role","img"); el.innerHTML=svg(p); busy=false;
  }
  var el=document.getElementById("moonSym");
  if(el&&window.MutationObserver) new MutationObserver(function(){ if(busy) return; if(!el.querySelector(".mbSvg")){ lastKey=""; paint(); } }).observe(el,{childList:true,characterData:true,subtree:true});
  var css=document.createElement("style");
  css.textContent="#moonSym .mbSvg{display:block;width:2rem;height:2rem;margin:.02rem auto .03rem;filter:drop-shadow(0 0 6px rgba(170,100,255,.45)) drop-shadow(0 0 2px rgba(255,255,255,.25))}";
  document.head.appendChild(css);
  paint(); setTimeout(paint,400); setInterval(paint,10*60*1000);
  window.RR25_MONDBILD={svg:svg,paint:paint};
})();
