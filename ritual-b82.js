/* ritual-b82.js — Build 82: Absicht-Tagebuch in der Chronik.
   Zeigt gesetzte Absichten (Tagesziel und Sigille/Zeichen) mit Verlauf: gesetzt, Echo, Wirkung.
   Echo und Wirkung sind dieselben Merker wie am Eintrag (rr25_tags_v1), keine neuen Schlüssel: Sichern und Wiederherstellen gelten schon.
   Kein Druck: keine Serien, kein «offen seit». */
(function(){
  if(window.__rr25b82) return; window.__rr25b82=1;
  var TK="rr25_tags_v1", OPEN=false, FILT="alle", MAXN=30, MORE=false;
  var DN=["So","Mo","Di","Mi","Do","Fr","Sa"];
  function js(k,d){ try{ var v=JSON.parse(localStorage.getItem(k)||"null"); return v==null?d:v; }catch(e){ return d; } }
  function tags(){ var t=js(TK,{}); return t&&typeof t==="object"&&!Array.isArray(t)?t:{}; }
  function setTags(t){ try{ localStorage.setItem(TK,JSON.stringify(t)); }catch(e){} }
  function h(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
  function when(e){
    var s=String(e&&e.t||""), m=s.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})(?:,?\s*(\d{1,2}):(\d{2}))?/);
    if(m) return new Date(+m[3],+m[2]-1,+m[1],+(m[4]||12),+(m[5]||0)).getTime();
    var p=Date.parse(s); return isNaN(p)?null:p;
  }
  function rows(){ try{ return (typeof load==="function"?load().log:js("rr25_ritual_v1",{}).log)||[]; }catch(e){ return []; } }
  function absichten(){
    var T=tags(), out=[];
    rows().forEach(function(e){
      var ti=String(e&&e.titel||"").trim(); if(ti!=="Tagesziel"&&ti!=="Sigille") return;
      var txt=String(e.note||e.wer||"").trim(); if(!txt) return;
      var ms=when(e); if(ms==null) return;
      var tg=T[String(e.id)]||[];
      out.push({id:String(e.id),kind:ti==="Sigille"?"Zeichen":"Tagesziel",txt:txt,ms:ms,wirk:tg.indexOf("Wirkung")>=0,echo:tg.indexOf("Echo")>=0});
    });
    out.sort(function(a,b){ return b.ms-a.ms; });
    return out;
  }
  function ago(ms){
    var n=Math.round((new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate())-new Date(new Date(ms).getFullYear(),new Date(ms).getMonth(),new Date(ms).getDate()))/86400000);
    return n<=0?"heute":n===1?"gestern":"vor "+n+" Tagen";
  }
  function dstr(ms){ var d=new Date(ms); return DN[d.getDay()]+" "+d.getDate()+"."+(d.getMonth()+1)+"."+d.getFullYear(); }
  function panel(){
    var all=absichten();
    var f=all.filter(function(a){ return FILT==="alle"||(FILT==="wirkung"&&a.wirk)||(FILT==="echo"&&a.echo)||(FILT==="ruhig"&&!a.wirk&&!a.echo); });
    var nW=all.filter(function(a){ return a.wirk; }).length, nE=all.filter(function(a){ return a.echo; }).length;
    var say=all.length?all.length+(all.length===1?" Absicht":" Absichten")+" gesetzt · "+nW+" mit Wirkung · "+nE+" mit Echo.":"Noch keine Absicht gesetzt. Ein Tagesziel oder ein Zeichen erscheint hier von selbst.";
    var FL=[["alle","Alle"],["wirkung","Mit Wirkung"],["echo","Mit Echo"],["ruhig","Noch ohne Merker"]];
    var shown=MORE?f:f.slice(0,MAXN);
    return '<p class="abSay">'+h(say)+'</p>'+(all.length?'<div class="abF">'+FL.map(function(x){ return '<button type="button" data-f="'+x[0]+'" class="'+(FILT===x[0]?"on":"")+'">'+x[1]+'</button>'; }).join("")+'</div>':'')+
      (shown.length?'<ul class="abL">'+shown.map(function(a){
        return '<li><div class="abT"><span class="abK">'+a.kind+'</span><span class="abD">'+dstr(a.ms)+' · '+ago(a.ms)+'</span></div><p class="abX">'+h(a.txt)+'</p>'+
          '<div class="abV"><span class="abDot on">gesetzt</span><button type="button" class="abDot'+(a.echo?" on":"")+'" data-id="'+h(a.id)+'" data-t="Echo" aria-pressed="'+a.echo+'">Echo</button><button type="button" class="abDot'+(a.wirk?" on":"")+'" data-id="'+h(a.id)+'" data-t="Wirkung" aria-pressed="'+a.wirk+'">Wirkung</button></div></li>';
      }).join("")+'</ul>':(all.length?'<p class="abNote">Nichts in dieser Auswahl.</p>':""))+
      (f.length>MAXN&&!MORE?'<button type="button" class="abMore">Ältere zeigen ('+(f.length-MAXN)+')</button>':'');
  }
  function paintPanel(){
    var p=document.getElementById("abPanel"); if(!p) return;
    p.hidden=!OPEN; if(!OPEN) return;
    p.innerHTML=panel();
    [].slice.call(p.querySelectorAll(".abF button")).forEach(function(b){ b.onclick=function(){ FILT=b.getAttribute("data-f"); paintPanel(); }; });
    var mo=p.querySelector(".abMore"); if(mo) mo.onclick=function(){ MORE=true; paintPanel(); };
    [].slice.call(p.querySelectorAll("button[data-id]")).forEach(function(b){ b.onclick=function(){
      var id=b.getAttribute("data-id"), t=b.getAttribute("data-t"), T=tags(), a=(T[id]||[]).slice(), i=a.indexOf(t);
      if(i>=0) a.splice(i,1); else a.push(t);
      if(a.length) T[id]=a; else delete T[id];
      setTags(T); paintPanel(); try{ if(typeof paintLog==="function") paintLog(); }catch(e){}
    }; });
  }
  function mount(){
    var sec=document.getElementById("log"), ent=document.getElementById("entries"); if(!sec||!ent) return;
    if(document.getElementById("abBtn")) return;
    var bar=document.getElementById("rbBar");
    if(!bar){ bar=document.createElement("div"); bar.id="rbBar"; sec.insertBefore(bar,ent); }
    var btn=document.createElement("button"); btn.type="button"; btn.className="btn ghost"; btn.id="abBtn"; btn.textContent="Absichten";
    bar.insertBefore(btn,bar.firstChild);
    var p=document.createElement("div"); p.id="abPanel"; p.className="card"; p.hidden=true;
    var rp=document.getElementById("rbPanel"); sec.insertBefore(p,rp&&rp.nextSibling?rp.nextSibling:ent);
    btn.onclick=function(){ OPEN=!OPEN; btn.classList.toggle("on",OPEN); btn.textContent=OPEN?"Absichten zu":"Absichten"; paintPanel(); };
  }
  if(typeof show==="function"&&!show._b82){ var sh=show; show=function(id){ var r=sh.apply(this,arguments); if(id==="log") setTimeout(mount,400); return r; }; show._b82=1; }
  if(typeof paintLog==="function"&&!paintLog._b82){ var pl=paintLog; paintLog=function(){ var r=pl.apply(this,arguments); setTimeout(paintPanel,120); return r; }; paintLog._b82=1; }
  setTimeout(mount,500);
  var css=document.createElement("style");
  css.textContent=[
    "#rbBar{gap:.4rem}",
    "#abBtn{min-height:2.1rem!important;padding:.35rem 1rem!important;font-size:.76rem!important;border-radius:999px!important;border:1px solid rgba(200,120,255,.35)!important;background:rgba(160,90,255,.1)!important;color:#e4ecff!important}",
    "#abBtn.on{box-shadow:0 0 14px rgba(200,120,255,.35)}",
    "#abPanel{margin:0 0 .8rem;padding:.75rem .8rem .7rem;background:linear-gradient(180deg,rgba(40,18,62,.78),rgba(14,8,24,.92))!important;border:1px solid rgba(200,120,255,.22)!important;border-radius:1.1rem!important}",
    "#abPanel[hidden]{display:none!important}",
    ".abSay{margin:0 0 .5rem;font-size:.8rem;color:#e6d4ff;line-height:1.4}",
    ".abF{display:flex;flex-wrap:wrap;gap:.3rem;margin:0 0 .5rem}.abF button{min-height:0;padding:.2rem .65rem;font-size:.66rem;border-radius:999px;border:1px solid rgba(200,120,255,.25);background:transparent;color:#cdbbe8}.abF button.on{background:rgba(160,90,255,.22);color:#f6e6ff;border-color:rgba(200,120,255,.6)}",
    ".abL{list-style:none;margin:0;padding:0}.abL li{padding:.55rem 0;border-top:1px solid rgba(200,120,255,.12)}",
    ".abT{display:flex;justify-content:space-between;gap:.5rem;align-items:baseline}.abK{font-size:.56rem;letter-spacing:.16em;text-transform:uppercase;color:#d6a6ff}.abD{font-size:.64rem;color:#a994c4}",
    ".abX{margin:.2rem 0 .35rem;font-family:Georgia,serif;font-size:.92rem;line-height:1.35;color:#f1e1ff}",
    ".abV{display:flex;gap:.3rem;flex-wrap:wrap}.abDot{min-height:0;font-size:.62rem;line-height:1.5;padding:.05rem .6rem;border-radius:999px;border:1px dashed rgba(200,120,255,.3);background:transparent;color:#8e7aa8}.abDot.on{border-style:solid;border-color:rgba(200,120,255,.65);color:#f6e6ff;background:rgba(160,90,255,.2);box-shadow:0 0 8px rgba(200,120,255,.3)}",
    ".abNote{margin:.4rem 0 0;font-size:.7rem;color:#8e7aa8}",
    ".abMore{margin:.4rem auto 0;display:block;min-height:0;padding:.25rem .9rem;font-size:.68rem;border-radius:999px;border:1px solid rgba(200,120,255,.25);background:transparent;color:#cdbbe8}"
  ].join("");
  document.head.appendChild(css);
  window.RR25_ABSICHT={list:absichten};
})();
