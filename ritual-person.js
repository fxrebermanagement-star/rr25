(function(){
  var KEY="rr25_wer";
  var PKEY="rr25_personen";
  function getP(){ return (localStorage.getItem(KEY)||"").trim(); }
  function setP(n){ if(n) localStorage.setItem(KEY,n); else localStorage.removeItem(KEY); }
  function list(){
    try{
      var a=JSON.parse(localStorage.getItem(PKEY)||"[]");
      return Array.isArray(a)?a:[];
    }catch(e){ return []; }
  }
  function store(a){ localStorage.setItem(PKEY, JSON.stringify(a)); }
  function add(n){
    n=(n||"").trim();
    if(!n) return;
    setP(n);
    var a=list().filter(function(x){ return x.toLowerCase()!==n.toLowerCase(); });
    a.unshift(n);
    store(a.slice(0,24));
    paint();
  }
  function drop(n){
    store(list().filter(function(x){ return x!==n; }));
    if(getP()===n) setP("");
    paint();
  }
  function paint(){
    var box=document.getElementById("personList");
    var cur=document.getElementById("personCur");
    if(cur) cur.textContent=getP()||"noch niemand gemerkt";
    if(!box) return;
    var a=list();
    if(!a.length){ box.innerHTML="<p class='sub'>Keine Person gespeichert.</p>"; return; }
    box.innerHTML=a.map(function(n){
      return '<div class="entry"><b>'+String(n).replace(/</g,"&lt;")+"</b>"+
        '<div class="row" style="margin-top:.4rem">'+
        '<button type="button" class="btn primary" data-take="'+encodeURIComponent(n)+'">Aktiv</button>'+
        '<button type="button" class="btn ghost" data-del="'+encodeURIComponent(n)+'">Löschen</button>'+
        '</div></div>';
    }).join("");
  }
  function fillInputs(){
    var n=getP();
    if(!n) return;
    document.querySelectorAll('#run input[data-k="Name"],#run input[placeholder="Name"],#plW').forEach(function(inp){
      if(!inp.value.trim()){
        inp.value=n;
        inp.dispatchEvent(new Event("input"));
      }
    });
  }
  function screen(){
    if(document.getElementById("person")) return;
    var main=document.querySelector("main");
    if(!main) return;
    var s=document.createElement("section");
    s.className="screen"; s.id="person";
    s.innerHTML=
      '<div class="hero"><h2>Person X</h2><p class="sub">Anker merken und übernehmen</p></div>'+
      '<div class="card"><p class="meta">Aktiv</p><p id="personCur"></p>'+
      '<input id="personIn" placeholder="Name / Person X">'+
      '<div class="row"><button type="button" class="btn primary" id="personAdd">Merken</button></div></div>'+
      '<div id="personList"></div>';
    main.appendChild(s);
  }
  function nav(){
    var nav=document.querySelector("nav");
    if(!nav||nav.querySelector('[data-v="person"]')) return;
    var b=document.createElement("button");
    b.type="button"; b.setAttribute("data-v","person");
    b.innerHTML='<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="3.2"/><path d="M6 19c.8-3.2 3-5 6-5s5.2 1.8 6 5"/></svg>Person';
    var first=nav.querySelector('[data-v="geplant"]');
    if(first) nav.insertBefore(b, first);
    else nav.appendChild(b);
    var st=document.createElement("style");
    st.textContent="nav{grid-template-columns:repeat(6,1fr)!important}";
    document.head.appendChild(st);
  }
  document.addEventListener("click",function(e){
    var t=e.target;
    if(!t) return;
    if(t.id==="personAdd"){
      var inp=document.getElementById("personIn");
      add(inp&&inp.value);
      if(inp) inp.value="";
    }
    var take=t.closest&&t.closest("[data-take]");
    if(take){ add(decodeURIComponent(take.getAttribute("data-take"))); }
    var del=t.closest&&t.closest("[data-del]");
    if(del){ drop(decodeURIComponent(del.getAttribute("data-del"))); }
    setTimeout(function(){
      var box=document.getElementById("run");
      if(!box||!box.classList.contains("on")) return;
      if(document.getElementById("werTake")) return;
      var inp=box.querySelector('input[data-k="Name"],input[placeholder="Name"]');
      if(!inp) return;
      var n=getP();
      var b=document.createElement("button");
      b.type="button"; b.id="werTake"; b.className="btn ghost";
      b.style.margin=".35rem 0 .1rem";
      b.textContent=n? (n+" übernehmen") : "Person merken";
      inp.parentNode.insertBefore(b, inp.nextSibling);
      b.onclick=function(){
        if(n){ inp.value=n; inp.dispatchEvent(new Event("input")); }
        else if(inp.value.trim()){ add(inp.value.trim()); b.textContent=inp.value.trim()+" gemerkt"; }
      };
      inp.addEventListener("blur",function(){ if(inp.value.trim()) add(inp.value.trim()); });
      fillInputs();
    },80);
  },true);
  if(typeof show==="function"){
    var _show=show;
    show=function(id){
      var r=_show.apply(this,arguments);
      if(id==="person") paint();
      if(id==="run"||id==="geplant") fillInputs();
      return r;
    };
  }
  screen();
  nav();
  paint();
})();
