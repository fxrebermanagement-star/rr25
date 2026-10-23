try{
/* Echo (9) bei Personen-Ritualen: «Was kam zurück?» im Chronik-Eintrag (e.echo), jederzeit nachtragbar. Nur Chronik, kein Home-Element. */
(function(){
  if(typeof load!=="function"||typeof save!=="function") return;
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
      t.onchange=t.onblur=function(){ var d=load(), x=find(d,id); if(!x) return; x.echo=t.value.trim().slice(0,800); x.echoT=x.echo?Date.now():0; save(d); };
    };
  }
  if(typeof paintLog==="function"){
    var _p=paintLog;
    paintLog=function(){
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