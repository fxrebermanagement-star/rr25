(function(){
  function hintOf(p){
    if(p<0.03||p>0.97) return "Neu setzen";
    if(p<0.22) return "Wachsen lassen";
    if(p<0.28) return "Form geben";
    if(p<0.47) return "Kraft sammeln";
    if(p<0.53) return "Nicht nachsetzen";
    if(p<0.72) return "Abgeben, lösen";
    if(p<0.78) return "Zurück zur Mitte";
    return "Leeren, schlafen";
  }
  function phase(){
    var syn=29.53058867;
    var nm=Date.UTC(2000,0,6,18,14)/1000;
    var age=((Date.now()/1000-nm)/86400)%syn;
    if(age<0) age+=syn;
    return age/syn;
  }
  function line(){
    var tx=document.getElementById("moonTxt");
    if(!tx) return;
    var p=phase();
    var h=hintOf(p);
    var html=tx.innerHTML||"";
    if(html.indexOf(h)>=0) return;
    html=html.replace(/<br>Neu setzen|<br>Wachsen lassen|<br>Form geben|<br>Kraft sammeln|<br>Nicht nachsetzen|<br>Abgeben, lösen|<br>Zurück zur Mitte|<br>Leeren, schlafen/g,"");
    tx.innerHTML=html+"<br>"+h;
  }
  var s=document.createElement("style");
  s.textContent="#moonTxt{font-size:.58rem;line-height:1.3}";
  document.head.appendChild(s);
  line();
  setTimeout(line,400);
  setTimeout(line,1200);
})();
