try{
/* Echo (9) bei Personen-Ritualen: «Was kam zurück?» im Chronik-Eintrag (e.echo), jederzeit nachtragbar. Nur Chronik, kein Home-Element. */
(function(){
  if(typeof load!=="function"||typeof save!=="function") return;
  /* Build 112: «Was kam zurück?» ausgefüllt = Merker «Echo» (rr25_tags_v1). So stimmen Liste, Rückblick und Absichten überein.
     Gilt auch für bestehende Einträge mit Echo-Text. */
  window.RR25_ECHOSYNC=function(){
    try{
      var T=JSON.parse(localStorage.getItem("rr25_tags_v1")||"{}"); if(!T||typeof T!=="object"||Array.isArray(T)) T={};
      var ch=false;
      (load().log||[]).forEach(function(e){
        if(!e||!String(e.echo||"").trim()) return;
        var k=String(e.id), a=T[k]||[]; if(a.indexOf("Echo")<0){ T[k]=a.concat("Echo"); ch=true; }
      });
      if(ch) localStorage.setItem("rr25_tags_v1",JSON.stringify(T));
      return ch;
    }catch(err){ return false; }
  };
  window.RR25_ECHOSYNC();
  function esc2(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function find(d,id){ return (d.log||[]).filter(function(x){ return String(x.id)===String(id); })[0]; }
  if(typeof openLog==="function"){
    var _o=openLog;
    openLog=function(id){
      _o.apply(this,arguments);
      var e=find(load(),id), box=document.getElementById("entries");
      if(!e||!box||!(e.person||e.echo)) return;
      var w=document.createElement("label"); w.className="absLab echoNach";
      w.innerHTML=(e.richtung?'<span class="meta">Richtung: '+esc2(e.richtung)+(e.zugang?' · Zugang: '+esc2(e.zugang):'')+'</span>':'')+
        'Was kam zurück?<textarea id="logEcho" placeholder="Anruf, Gefühl, Zufall · später nachtragen geht immer">'+esc2(e.echo||"")+'</textarea>';
      var card=box.querySelector(".card")||box; card.appendChild(w);
      var t=document.getElementById("logEcho");
      t.onchange=t.onblur=function(){ var d=load(), x=find(d,id); if(!x) return; x.echo=t.value.trim().slice(0,800); x.echoT=x.echo?Date.now():0; save(d); window.RR25_ECHOSYNC(); };
    };
  }
  if(typeof paintLog==="function"){
    var _p=paintLog;
    paintLog=function(){
      window.RR25_ECHOSYNC();
      _p.apply(this,arguments);
      var d=load(), box=document.getElementById("entries"); if(!box) return;
      (d.log||[]).forEach(function(e){
        if(!(e.person||e.echo)) return;
        var row=box.querySelector('[data-eid="'+e.id+'"]'); if(!row||row.querySelector(".echoTag")) return;
        var p=document.createElement("p"); p.className="meta echoTag";
        p.textContent=e.echo?"Echo: "+e.echo:"Echo offen · Was kam zurück?";
        (row.firstElementChild||row).appendChild(p);
      });
    };
  }
})();
}catch(e){ console.warn("rr25 echo-nachtrag",e); }