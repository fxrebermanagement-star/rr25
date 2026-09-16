(function(){
  var css=document.createElement("style");
  css.textContent=[
    "#entries .shots{display:flex!important;gap:.4rem;flex-wrap:wrap;margin:.35rem 0}",
    "#entries .logpic img,#entries .shots img,#logShots img{width:4.8rem;height:4.8rem;object-fit:cover;border-radius:.85rem;border:1px solid rgba(126,200,255,.2);background:#0a0612}",
    "#entries .logpic img.sig,#logShots img.sig{object-fit:contain}"
  ].join("");
  document.head.appendChild(css);

  function zoom(src){
    var old=document.getElementById("picZoom"); if(old) old.remove();
    var w=document.createElement("div");
    w.id="picZoom";
    w.style.cssText="position:fixed;inset:0;background:rgba(4,2,10,.92);z-index:80;display:flex;align-items:center;justify-content:center;padding:1.2rem";
    w.innerHTML='<img alt="" src="'+src+'" style="max-width:100%;max-height:92%;border-radius:1rem;background:#0a0612">';
    w.onclick=function(){ w.remove(); };
    document.body.appendChild(w);
  }
  function add(hold, src, sig){
    if(!hold || !src || hold.querySelector('img[src="'+src.slice(0,40)+'"]')) return;
    if(hold.querySelector("img") && hold.className.indexOf("logpic")>=0) return;
    var img=document.createElement("img");
    img.src=src;
    if(sig) img.className="sig";
    img.onclick=function(){ zoom(src); };
    hold.appendChild(img);
  }
  function fillList(){
    var box=document.getElementById("entries");
    if(!box) return;
    var rows=(typeof load==="function"?load().log:null)||[];
    rows.forEach(function(e){
      var hold=box.querySelector('[data-pic="'+e.id+'"]');
      if(!hold){
        var row=box.querySelector('[data-eid="'+e.id+'"]');
        if(row){
          hold=document.createElement("div");
          hold.className="logpic";
          hold.setAttribute("data-pic", e.id);
          row.appendChild(hold);
        }
      }
      if(!hold) return;
      var sig=/sigil/i.test(e.titel||"");
      if(e.img) add(hold, e.img, sig);
      if(typeof fotoGet==="function"){
        fotoGet(e.id).then(function(arr){
          if(arr && arr[0]) add(hold, arr[0], sig);
        });
      }
    });
  }
  if(typeof paintLog==="function" && !paintLog._foto){
    var pl=paintLog;
    paintLog=function(){
      pl();
      setTimeout(fillList, 40);
    };
    paintLog._foto=1;
  }
  if(typeof openLog==="function" && !openLog._foto){
    var ol=openLog;
    openLog=function(id){
      ol(id);
      var box=document.getElementById("entries");
      if(!box) return;
      var sh=box.querySelector("#logShots");
      if(!sh){
        sh=document.createElement("div");
        sh.id="logShots";
        sh.className="shots";
        box.appendChild(sh);
      }
      function paint(){
        sh.innerHTML="";
        var e=((typeof load==="function"?load().log:[])||[]).filter(function(x){ return x.id===id; })[0];
        if(e && e.img) add(sh, e.img, /sigil/i.test(e.titel||""));
        if(typeof fotoGet==="function"){
          fotoGet(id).then(function(arr){
            (arr||[]).forEach(function(src){ add(sh, src, /sigil/i.test((e&&e.titel)||"")); });
          });
        }
      }
      paint();
    };
    openLog._foto=1;
  }
  if(typeof show==="function" && !show._foto){
    var sh=show;
    show=function(id){
      var r=sh.apply(this,arguments);
      if(id==="log") setTimeout(fillList, 80);
      return r;
    };
    show._foto=1;
  }
})();
