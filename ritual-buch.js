/* Buch: kein Buchtext mehr in der App und im Repo. Knöpfe öffnen die privaten PDFs in Google Drive
   (nur für den Besitzer sichtbar, wenn er angemeldet ist): «Mein Buch» und «Urbuch». Nur Links, nie Inhalte. */
(function(){
  var OPEN="https://drive.google.com/file/d/1XMRksJwMBi4YyM0tpEfsa0-4BI9Z0Ass/view";
  var URBUCH="https://drive.google.com/file/d/1kDvCofm93JQVi1PJ4YR2iOdADWzt9Mhw/view?usp=drivesdk";
  function go(u){ window.open(u,"_blank","noopener"); }
  var css=document.createElement("style");
  css.textContent=[
    "#buch .hero h2{margin-bottom:.4rem}",
    "#page.book{background:none!important;border:0!important;box-shadow:none!important;padding:.4rem 0 0!important}",
    "#buchGo{display:flex;flex-direction:column;align-items:center;gap:.55rem;margin:1.2rem 0 0}",
    "#buchOpen{display:block;width:100%;min-height:3.3rem;border:0;border-radius:999px;font:inherit;font-size:1rem;font-weight:650;letter-spacing:.02em;color:#14081c;background:linear-gradient(165deg,#ff7ad9,#b98cff 55%,#7ec8ff);box-shadow:0 0 22px rgba(201,155,255,.45),0 0 0 1px rgba(232,160,255,.55);cursor:pointer}",
    "#buchOpen:active,#urbuchOpen:active{transform:scale(.98)}",
    "#urbuchOpen{display:block;width:100%;min-height:3.3rem;margin-top:.9rem;border:0;border-radius:999px;font:inherit;font-size:1rem;font-weight:650;letter-spacing:.02em;color:#14081c;background:linear-gradient(165deg,#b98cff,#ff7ad9 55%,#ffb3ec);box-shadow:0 0 22px rgba(201,155,255,.45),0 0 0 1px rgba(232,160,255,.55);cursor:pointer}",
    "#mehrSheet .msGrid>.msItem:last-child:nth-child(odd){grid-column:1/-1}",
    "#msUrbuch .ic{background:linear-gradient(160deg,#4a2266,#1a1026)!important;color:#e7b8ff!important;box-shadow:0 0 14px rgba(201,155,255,.35)}",
    "#buchGo small{font-size:.74rem;color:#c4b4e0;letter-spacing:.04em}"
  ].join("");
  document.head.appendChild(css);
  paintBuch=function(){
    var page=document.getElementById("page");
    if(!page) return;
    page.innerHTML='<div id="buchGo"><button type="button" id="buchOpen">Mein Buch öffnen</button><small>Privat · öffnet in Google Drive</small><button type="button" id="urbuchOpen">Urbuch öffnen</button><small>Privat · öffnet in Google Drive</small></div>';
    document.getElementById("buchOpen").onclick=function(){ go(OPEN); };
    document.getElementById("urbuchOpen").onclick=function(){ go(URBUCH); };
  };
  var ub=document.getElementById("msUrbuch");
  if(ub) ub.addEventListener("click",function(){ go(URBUCH); });
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
