const KEY="rr25_ritual_v1";
const NOTEKEY="rr25_notiz_v1";
let BOOKTEXT="";
/* Ritual-Daten kommen aus rituals-v2.js (füllt R beim Laden). */
const R=[];
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const now=()=>new Date().toLocaleString("de-CH");
const fill=(s,m)=>s.replaceAll("[Name]",m.Name||"[Name]").replaceAll("[A]",m.A||"[A]").replaceAll("[B]",m.B||"[B]");
const esc=s=>String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
function load(){try{return Object.assign({log:[],planned:[]},JSON.parse(localStorage.getItem(KEY)||"{}"))}catch(e){return{log:[],planned:[]}}}
function save(d){localStorage.setItem(KEY,JSON.stringify(d))}
function loadNotes(){try{const x=JSON.parse(localStorage.getItem(NOTEKEY)||"[]");return Array.isArray(x)?x:[]}catch(e){return[]}}
function saveNotes(a){localStorage.setItem(NOTEKEY,JSON.stringify(a))}
let cat="Alle",mem={},fromPlan=null;
function show(id){$$(".screen").forEach(s=>s.classList.toggle("on",s.id===id));$$("nav button").forEach(b=>b.classList.toggle("on",b.dataset.v===id||((id==="run"||id==="after"||id==="bye")&&b.dataset.v==="home")));if(id==="home")renderList();if(id==="geplant")paintPlan();if(id==="notiz")paintNotes();if(id==="log")paintLog();if(id==="buch")paintBuch();window.scrollTo(0,0)}
/* openR: alter Ablauf entfernt; ritual-runner-v2.js setzt openR=openV2 */
function openR(id,wer){}
function renderList(){const order=["Alltag","Schutz","Energie","Liebe","Trennung","Feld"];$("#cats").innerHTML=["Alle",...order].map(x=>`<button class="chip${x===cat?" on":""}" data-cat="${x}">${x}</button>`).join("");$$("#cats [data-cat]").forEach(b=>b.onclick=()=>{cat=b.dataset.cat;renderList()});const items=R.filter(r=>cat==="Alle"||r.tag===cat);const g={};items.forEach(r=>{(g[r.tag]=g[r.tag]||[]).push(r)});$("#list").innerHTML=Object.keys(g).sort((a,b)=>order.indexOf(a)-order.indexOf(b)).map(k=>`<p class="group">${k}</p>`+g[k].map(r=>`<button class="card" data-id="${r.id}"><b>${r.t}</b><small>${r.s}</small></button>`).join("")).join("");$$("#list .card").forEach(b=>b.onclick=()=>{fromPlan=null;openR(b.dataset.id)})}
function paintPlan(){const d=load(),sel=$("#plR");if(sel&&sel.options.length!==R.length){sel.innerHTML="";R.forEach(r=>{const o=document.createElement("option");o.value=r.id;o.textContent=r.t;sel.appendChild(o)})}$("#plList").innerHTML=d.planned.length?d.planned.map(x=>`<div class="entry"><b>${esc(x.titel)}</b><div class="meta">${esc(x.wer||"")}</div><button class="btn primary" data-go="${x.pid}">Setzen</button></div>`).join(""):"<p class='sub'>Nichts geplant.</p>";$$("#plList [data-go]").forEach(b=>b.onclick=()=>{const x=load().planned.find(p=>p.pid===b.dataset.go);if(x){fromPlan=x.pid;openR(x.id,x.wer)}})}
function paintNotes(){const notes=loadNotes();$("#notesOnly").innerHTML=notes.length?notes.map(n=>`<div class="entry"><div class="meta">${esc(n.t)}</div><p>${esc(n.note)}</p></div>`).join(""):"<p class='sub'>Keine Notiz.</p>"}
function paintLog(){const rows=load().log||[];$("#entries").innerHTML=rows.length?rows.map(e=>`<div class="entry"><b>${esc(e.titel)}</b><div class="meta">${esc(e.t)} ${esc(e.wer||"")}</div></div>`).join(""):"<p class='sub'>Noch leer.</p>"}
async function paintBuch(){
  const page=$("#page"); if(!page) return;
  page.innerHTML="<p class='sub'>Buch lädt …</p>";
  if(!BOOKTEXT){
    try{
      const parts=await Promise.all([0,1,2,3,4].map(n=>fetch("pdfpart"+n+".txt",{cache:"reload"}).then(r=>{if(!r.ok)throw new Error(n);return r.text()})));
      BOOKTEXT=parts.join("\n\n");
    }catch(e){
      page.innerHTML="<p class='sub'>Buchdateien kommen. Neu laden.</p>";
      return;
    }
  }
  page.innerHTML="";
  const pre=document.createElement("div");
  pre.style.whiteSpace="pre-wrap";
  pre.style.fontFamily="Georgia,serif";
  pre.style.lineHeight="1.65";
  pre.style.fontSize="1.02rem";
  pre.textContent=BOOKTEXT;
  page.appendChild(pre);
}
document.addEventListener("click",e=>{const n=e.target.closest("nav button");if(n)show(n.dataset.v)});
$("#plAdd").onclick=()=>{const r=R.find(x=>x.id===$("#plR").value);if(!r)return;const d=load();d.planned.unshift({pid:uid(),id:r.id,titel:r.t,wer:($("#plW").value||"").trim(),t:now()});save(d);paintPlan()};
$("#noteAdd").onclick=()=>{const tx=($("#noteT").value||"").trim();if(!tx)return;const n=loadNotes();n.unshift({id:uid(),t:now(),note:tx});saveNotes(n);$("#noteT").value="";paintNotes()};
$("#quick").onclick=()=>{const d=load();d.log.unshift({id:uid(),t:now(),titel:"Feld zu"});save(d);show("after")};
$("#afterStay").onclick=()=>show("home");$("#afterGo").onclick=()=>show("bye");$("#stay").onclick=()=>show("home");
renderList();
