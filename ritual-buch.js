/* Buch: kein Buchtext mehr in der App und im Repo. Knöpfe öffnen die privaten PDFs in Google Drive
   (nur für den Besitzer sichtbar, wenn er angemeldet ist): «Ich · Spiel · Quelle · Mein Grimoire» (Entwurf 3, ersetzt das alte Taschenbuch) und «Urbuch». Nur Links, nie Inhalte. */
(function(){
  var OPEN="https://drive.google.com/file/d/1uHTr7oeDPbao8HCfc2cMrQxgT1X_kosD/view";
  var URBUCH="https://drive.google.com/file/d/1kDvCofm93JQVi1PJ4YR2iOdADWzt9Mhw/view?usp=drivesdk";
  function go(u){ window.open(u,"_blank","noopener"); }
  var css=document.createElement("style");
  css.textContent=[
    "#buch .hero h2{margin-bottom:.4rem}",
    "#page.book{background:none!important;border:0!important;box-shadow:none!important;padding:.4rem 0 0!important}",
    "#buchGo{display:flex;flex-direction:column;align-items:center;gap:.55rem;margin:1.2rem 0 0}",
    "#buchOpen{display:block;width:100%;min-height:3.3rem;border:0;border-radius:999px;font:inherit;font-size:1rem;font-weight:650;letter-spacing:.02em;color:#14081c;background:linear-gradient(165deg,#ff4fe0,#a66bff 55%,#9fd0ff);box-shadow:0 0 22px rgba(170,100,255,.45),0 0 0 1px rgba(200,120,255,.55);cursor:pointer}",
    "#buchOpen:active,#urbuchOpen:active{transform:scale(.98)}",
    "#urbuchOpen{display:block;width:100%;min-height:3.3rem;margin-top:.9rem;border:0;border-radius:999px;font:inherit;font-size:1rem;font-weight:650;letter-spacing:.02em;color:#14081c;background:linear-gradient(165deg,#a66bff,#ff4fe0 55%,#ffb3ec);box-shadow:0 0 22px rgba(170,100,255,.45),0 0 0 1px rgba(200,120,255,.55);cursor:pointer}",
    "#buchGo small{font-size:.74rem;color:#b4c6f2;letter-spacing:.04em}"
  ].join("");
  document.head.appendChild(css);
  paintBuch=function(){
    var page=document.getElementById("page");
    if(!page) return;
    page.innerHTML='<div id="buchGo"><button type="button" id="buchOpen">Mein Grimoire</button><small>Ich · Spiel · Quelle · dein Arbeitsbuch, privat in Google Drive</small><button type="button" id="urbuchOpen" class="buchAlt">Urbuch</button><small>das ursprüngliche Buch · privat in Google Drive</small></div>';
    document.getElementById("buchOpen").onclick=function(){ go(OPEN); };
    document.getElementById("urbuchOpen").onclick=function(){ go(URBUCH); };
  };
  if(typeof show==="function" && !show._buchneu){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="buch") paintBuch();
      return r;
    };
    show._buchneu=1;
  }
})();
