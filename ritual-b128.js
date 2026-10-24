/* Build 128: passende Fenster im Geplant-Dialog. Nutzt Überlieferung (Ritual X), Planetenstunden, Ton und Mond aus RR25_KAL / RR25_MOND. */
(function(){
  var DAY=864e5, PN=["Sonne","Mond","Mars","Merkur","Jupiter","Venus","Saturn"], WD=["So","Mo","Di","Mi","Do","Fr","Sa"];
  var TRAD0={schutz:{d:[2,6],m:["ab","neu"]},ruhe:{d:[1],m:["ab","neu"]},herz:{d:[5],m:["zu","voll"]},klaerung:{d:[3],m:["zu","voll"]},mut:{d:[2],m:["zu"]},heilung:{d:[0,1],m:["zu"]},fuelle:{d:[4],m:["zu","voll"]},traum:{d:[1],m:["voll","neu"]},ende:{d:[6],m:["ab","neu"]}};
  var TH={schutz:"schutz",schutz2:"schutz",stopp:"schutz",kreis:"schutz",raum:"schutz",heil:"heilung",karma:"heilung",zur:"heilung",segen:"heilung",fuelle:"fuelle",schlaf:"traum",
    anz:"herz",einladen:"herz",liebe:"herz",liebe2:"herz",trenn:"ende",band:"ende",trenn2:"ende",fluch:"ende",ueber:"mut",wesen:"mut",ahn:"traum",
    neumond:{d:[],m:["neu"]},vollmond:{d:[],m:["voll"]}};
  var TNAME={schutz:"Schutz",ruhe:"Ruhe",herz:"Liebe",klaerung:"Klärung",mut:"Mut",heilung:"Heilung",fuelle:"Fülle",traum:"Traum",ende:"Ende"};
  function trad(){ var X=window.RR25_RITUALX; return (X&&X.trad)||TRAD0; }
  function rit(id){ var L=window.RR_RITUALS||[]; for(var i=0;i<L.length;i++) if(L[i].id===id) return L[i]; return null; }
  function hardOk(p){ var r=rit(p.id); if(r) return !!(r.hard||r.tone==="hard"); return /^hard$/i.test(p.ton||p.tone||""); }
  function regel(p){
    var k=p.th||TH[p.id]; if(!k&&p.titel){ var t=p.titel.toLowerCase(); for(var x in TNAME) if(t.indexOf(TNAME[x].toLowerCase())>=0){ k=x; break; } }
    if(!k) return null; if(typeof k==="object") return {k:"mond",r:k};
    var r=trad()[k]; return r?{k:k,r:r}:null;
  }
  function p2(n){ return (n<10?"0":"")+n; }
  function d0(t){ var d=new Date(t); d.setHours(0,0,0,0); return d.getTime(); }
  var TN={SOFT:"Soft",HARD:"Hard",ECHO:"Echo",STILL:"Still"};
  function fenster(p,n){
    var K=window.RR25_KAL, M=window.RR25_MOND; if(!K||!K.planetDay) return [];
    var g=regel(p), hard=hardOk(p), now=Date.now()+20*60000, out=[];
    for(var i=0;i<28;i++){
      var day=d0(now)+i*DAY+12*3600000, wd=new Date(day).getDay(), mk="";
      try{ mk=M?M.fenster(day).key:""; }catch(e){}
      var dOk=g&&g.r.d.indexOf(wd)>=0, mOk=g&&g.r.m.indexOf(mk)>=0, sc=0;
      if(g){ if(!dOk&&!mOk) continue; sc=(dOk?3:0)+(mOk?2:0)+((mk==="voll"||mk==="neu")&&mOk?1:0); }
      else sc=(mk==="voll"||mk==="neu")?2:1;
      /* Planet: Tagesherrscher bei passendem Tag, sonst der Planet des Überlieferungstags */
      var pl=PN[dOk||!g||!g.r.d.length?wd:g.r.d[0]];
      var hrs=K.planetDay(day).filter(function(h){ return h.p===pl&&h.s>now; });
      if(!hrs.length) continue;
      /* am liebsten abends 17-23 Uhr, sonst die erste freie Stunde */
      var best=null;
      hrs.forEach(function(h){ var hh=new Date(h.s).getHours(), ev=hh>=17&&hh<=23; var st=null; try{ st=K.state(h.s+60000); }catch(e){}
        var tone=st?st.tone:"SOFT"; if(tone==="HARD"&&!hard) return;
        var s=sc+(ev?1:0)+(hard&&tone==="HARD"?2:0)+(!hard&&tone==="SOFT"?1:0);
        if(!best||s>best.s||(s===best.s&&ev&&!best.ev)) best={t:h.s,p:pl,tone:tone,s:s,ev:ev,mk:mk,dOk:dOk,mOk:mOk}; });
      if(best) out.push(best);
    }
    out.sort(function(a,b){ return b.s-a.s||a.t-b.t; });
    return out.slice(0,n||5).sort(function(a,b){ return a.t-b.t; });
  }
  function chip(w){ var d=new Date(w.t), MN={voll:"Vollmond",neu:"Neumond"};
    return WD[d.getDay()]+" "+p2(d.getDate())+"."+p2(d.getMonth()+1)+". · "+p2(d.getHours())+":"+p2(d.getMinutes())+" "+w.p+"-Stunde · "+(TN[w.tone]||w.tone)+(MN[w.mk]?" · "+MN[w.mk]:""); }
  function css(){ if(document.getElementById("gpFenCss")) return; var s=document.createElement("style"); s.id="gpFenCss";
    s.textContent=".gpFen{display:flex;flex-direction:column;gap:6px;margin:10px 0 4px}.gpFen .gpFenK{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#c9a6ff;margin:0}.gpFen .gpFenS{font-size:12px;color:#bfb3d9;margin:0 0 2px}"+
    ".gpFen button{display:block;width:100%;text-align:left;padding:9px 12px;border-radius:12px;border:1px solid rgba(190,120,255,.45);background:rgba(120,60,200,.18);color:#f1e8ff;font-size:13.5px;box-shadow:0 0 10px rgba(180,90,255,.18);white-space:normal}"+
    ".gpFen button.on{border-color:#ff6bd5;background:rgba(255,80,200,.2);box-shadow:0 0 14px rgba(255,90,210,.45)}.gpFen button .h{color:#ff8ad8}.gpFen button.hard .h{color:#ff6b8a}";
    document.head.appendChild(s); }
  function fill(box,p,set){
    if(!box) return; css();
    var g=regel(p), W=fenster(p,5), hard=hardOk(p);
    var head='<p class="gpFenK">Passende Fenster</p><p class="gpFenS">'+(g?(g.k==="mond"?"Nach Mondphase":"Für "+TNAME[g.k]+": "+g.r.d.map(function(d){ return WD[d]+" "+PN[d]; }).join(", "))+(hard?"":" · nur ohne Hard"):"Allgemein gute Zeiten · ohne Hard")+'</p>';
    if(!W.length){ box.innerHTML=head+'<p class="gpFenS">In den nächsten 4 Wochen kein passendes Fenster.</p>'; return; }
    box.innerHTML=head+W.map(function(w,i){ return '<button type="button" data-i="'+i+'" class="'+(w.tone==="HARD"?"hard":"")+'">'+chip(w).replace(/ · (Hard|Soft|Echo|Still)/,' · <span class="h">$1</span>')+'</button>'; }).join("");
    box.querySelectorAll("button").forEach(function(b){ b.onclick=function(){ box.querySelectorAll("button").forEach(function(x){ x.classList.remove("on"); }); b.classList.add("on"); set(W[+b.getAttribute("data-i")].t); }; });
  }
  window.RR25_FENSTER={fill:fill,list:fenster,chip:chip};
})();
