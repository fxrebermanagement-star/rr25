/* rr25 — Ritual-Ton-Chip, Deep-Links, Einstellungen (v13)
   Soft+Hard in einer App; Neon-Violett; keine Gendersprache.
   Zeichen-Kachel unberührt. */
(function(){
'use strict';
var KEY='rr25_einst_v1';

function load(){
  try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{};}catch(e){return {};}
}
function save(o){
  try{localStorage.setItem(KEY,JSON.stringify(o||{}));}catch(e){}
}
function get(){
  var o=load();
  return {
    planeten: !!o.planeten,
    notify: !!o.notify
  };
}
function set(k,v){
  var o=load();
  o[k]=!!v;
  save(o);
  return get();
}

/* —— Deep-Links #anker / #echo —— */
function hashRitual(){
  var h=(location.hash||'').replace(/^#/,'').toLowerCase().split('?')[0];
  if(h==='anker'||h==='echo') return h;
  return '';
}
function clearHash(){
  try{
    if(history.replaceState) history.replaceState(null,'',location.pathname+location.search);
    else location.hash='';
  }catch(e){}
}
function openFromHash(){
  var id=hashRitual();
  if(!id) return false;
  clearHash();
  setTimeout(function(){
    try{
      if(window.RR25_OPEN) RR25_OPEN(id,{force:true,fromHash:true});
    }catch(e){}
  },80);
  return true;
}

/* —— Ton-Chip unter Zeichen-Kachel —— */
function toneLabel(){
  try{
    if(window.RR25_KAL && RR25_KAL.todayStatus){
      var s=RR25_KAL.todayStatus();
      if(s && s.hard) return {kind:'hard',text:'Heute Hard · Feintakt'};
      if(s && s.soft) return {kind:'soft',text:'Heute Soft · Fenster'};
      if(s && s.echo) return {kind:'echo',text:'Echo-Nachlauf'};
    }
  }catch(e){}
  return {kind:'ruhe',text:'Ruhe · Kalender'};
}
function renderChip(){
  var row=document.getElementById('toneRow');
  if(!row) return;
  var t=toneLabel();
  row.innerHTML='';
  var chip=document.createElement('button');
  chip.type='button';
  chip.className='tone-chip tone-'+t.kind;
  chip.id='toneChip';
  chip.setAttribute('aria-label',t.text);
  chip.innerHTML='<span class="tone-dot"></span><span class="tone-txt">'+t.text+'</span>';
  chip.onclick=function(){
    try{
      if(window.RR25_OPEN_KAL) RR25_OPEN_KAL();
      else if(window.showKal) showKal();
    }catch(e){}
  };
  row.appendChild(chip);
  var a=document.createElement('button');
  a.type='button';
  a.className='tone-anker';
  a.id='ankerLink';
  a.textContent='Rückkehr · Anker';
  a.onclick=function(){
    try{ if(window.RR25_OPEN) RR25_OPEN('anker',{force:true}); }catch(e){}
  };
  row.appendChild(a);
}

/* —— Einstellungen (Planeten / Notify) —— */
function bindEinst(){
  var p=document.getElementById('einstPlaneten');
  var n=document.getElementById('einstNotify');
  var g=get();
  if(p){ p.checked=g.planeten; p.onchange=function(){ set('planeten',p.checked); try{ if(window.RR25_PLANETEN_REFRESH) RR25_PLANETEN_REFRESH(); }catch(e){} }; }
  if(n){ n.checked=g.notify; n.onchange=function(){
    set('notify',n.checked);
    if(n.checked && window.Notification && Notification.permission==='default'){
      try{ Notification.requestPermission(); }catch(e){}
    }
  }; }
}

function boot(){
  renderChip();
  bindEinst();
  openFromHash();
  window.addEventListener('hashchange',function(){ openFromHash(); });
  try{
    if(window.RR25_KAL && RR25_KAL.onChange) RR25_KAL.onChange(renderChip);
  }catch(e){}
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot);
else boot();

window.RR25_EINST={get:get,set:set,renderChip:renderChip,KEY:KEY};
})();
