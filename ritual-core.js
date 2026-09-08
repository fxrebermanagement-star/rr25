const KEY="rr25_ritual_v1";
const NOTEKEY="rr25_notiz_v1";
let BOOK=[];
const R=[{id:"dank",t:"Tägliches Dankesritual",s:"Gesundheit · Liebe · Geld · Schutz",tag:"Alltag",steps:[["Ankommen","Füße. Atem. Ich bin der Spieler."],["Dank","Dreimal Danke für Gesundheit, Liebe, Geld, Schutz."],["Setzen","Ich bin gesund. Geliebt. Versorgt. Geschützt. Es ist so."],["Abschluss","Übergeben. So sei es."]]},{id:"stopp",t:"Schaden stoppen",s:"Angriff endet. Feld zu.",tag:"Schutz",need:["Name"],steps:[["Schutz","Mein Feld ist geschlossen."],["Absicht","Jeder Angriff von [Name] stoppt. Ohne Hass."],["369","3× Der Schaden stoppt. 6× Zugriff fällt ab. 9× Ich bin frei."],["Rückkehr","Ich bin nicht [Name]."]]},{id:"schutz",t:"Schutz selbst",s:"Feld schliessen",tag:"Schutz",steps:[["Absicht","Mein Feld ist geschlossen. Alles Fremde prallt ab."],["369","3× Schutz aktiv. 6× Fremdes prallt ab. 9× Ich bin klar."]]},{id:"schutz2",t:"Schutz für eine andere Person",s:"Vor Arbeit oder Tag",tag:"Schutz",need:["Name"],steps:[["Mitte","Ich richte mich auf [Name] aus, ohne mich zu verlieren."],["Absicht","Das Feld von [Name] ist klar und geschützt."],["Rückkehr","Ich bin nicht [Name]."]]},{id:"heil",t:"Heilung",s:"Ergänzung zur Medizin",tag:"Energie",need:["Name"],steps:[["Absicht","Heilung für [Name]. Alles Störende löst sich."],["Rückkehr","Ich bin nicht [Name]."]]},{id:"trenn",t:"Trennung — selbst",s:"Nur der Faden",tag:"Trennung",need:["Name"],steps:[["Absicht","Die Verbindung zu [Name] löst sich."],["Grenze","Kein Wesen. Kein Nachsetzen."],["Rückkehr","Ich kehre zurück."]]},{id:"trenn2",t:"Trennung zweier anderer",s:"Nur der Faden",tag:"Trennung",need:["A","B"],steps:[["Absicht","Der Faden zwischen [A] und [B] löst sich."],["Rückkehr","Ich bin nicht [A], nicht [B]."]]},{id:"wesen",t:"Nur wenn nötig — Wesenheit",s:"Fragen, begrenzen, entlassen",tag:"Feld",need:["A","B"],steps:[["Fragen","Wer bereit ist, die Verbindung zwischen [A] und [B] zu lösen, darf sich zeigen."],["Auftrag","Nur Trennung. Dann Ende."],["Entlassen","Danke. Du gehst."],["Rückkehr","Ich kehre zurück."]]},{id:"liebe",t:"Liebesritual",s:"Ohne Zwang",tag:"Liebe",need:["Name"],steps:[["Absicht","Stimmige Nähe mit [Name], nur wenn wahr."],["Rückkehr","Ich kehre zurück."]]},{id:"anz",t:"Anziehung und Kontakt",s:"Nur wenn stimmig",tag:"Liebe",need:["Name"],steps:[["Absicht","[Name] fühlt die Anziehung. Nur wenn stimmig."]]},{id:"karma",t:"Karma-Ausgleich",s:"Nicht Rache",tag:"Energie",steps:[["Absicht","Was genommen wurde, kehrt stimmig zurück."]]},{id:"finst",t:"Finsternis",s:"Verstärken und versiegeln",tag:"Feld",steps:[["Absicht","Unstimmiges fällt ab. Wahres wird gestärkt."]]},{id:"ahn",t:"Ahnenkontakt",s:"Ehren und begrenzen",tag:"Feld",need:["Name"],steps:[["Einladung","[Name], wenn du bereit bist, zeige dich."],["Schluss","Danke. Kontakt beendet."]]},{id:"fremd",t:"Fremde Wesenheit",s:"Kurz. Hartes Ende",tag:"Feld",steps:[["Rahmen","Nur klare Präsenz."],["Ende","Kontakt beendet. Der Raum gehört mir."]]},{id:"zur",t:"Energie zurückholen",s:"Nach Kontakt",tag:"Energie",steps:[["Absicht","Alles von mir kehrt rein zurück. Fremdes geht."]]},{id:"fil",t:"Filterübung",s:"Kein Auftrag",tag:"Feld",steps:[["Filter","Nur klare Präsenz."],["Schliessen","Kontakt beendet."]]}];
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const now=()=>new Date().toLocaleString("de-CH");
const fill=(s,m)=>s.replaceAll("[Name]",m.Name||"[Name]").replaceAll("[A]",m.A||"[A]").replaceAll("[B]",m.B||"[B]");
const esc=s=>String(s||"").replace(/&/g,"&").replace(/</g,"<").replace(/>/g,">");
function load(){try{return Object.assign({log:[],planned:[]},JSON.parse(localStorage.getItem(KEY)||"{}"))}catch(e){return {log:[],planned:[]}}}
function save(d){localStorage.setItem(KEY,JSON.stringify(d))}
function loadNotes(){try{const x=JSON.parse(localStorage.getItem(NOTEKEY)||"[]");return Array.isArray(x)?x:[]}catch(e){return[]}}
function saveNotes(a){localStorage.setItem(NOTEKEY,JSON.stringify(a))}
let cat="Alle",mem={},fromPlan=null;
function show(id){
  $$(".screen").forEach(s=>s.classList.toggle("on",s.id===id));
  $$("nav button").forEach(b=>b.classList.toggle("on",b.dataset.v===id||((id==="run"||id==="after"||id==="bye")&&b.dataset.v==="home")));
  if(id==="home") renderList();
  if(id==="geplant") paintPlan();
  if(id==="notiz") paintNotes();
  if(id==="log") paintLog();
  if(id==="buch") paintBuch();
  window.scrollTo(0,0);
}
function stepsFor(r,mit){const b=r.steps.map(s=>s.slice());if(mit){const i=b.findIndex(s=>/Rückkehr|Abschluss|Ende|Schluss/.test(s[0]));const w=[["Wesenheit","Nur stimmig öffnen."],["Entlassen","Danke. Du gehst."]];if(i>=0)b.splice(i,0,...w);else b.push(...w)}return b}
function openR(id,wer){
  const r=R.find(x=>x.id===id);if(!r)return;
  let i=0,mit=null,steps=[];mem={};
  if(wer){mem.Name=wer;const p=wer.split(/\s*·\s*/);mem.A=p[0]||wer;mem.B=p[1]||""}
  const gate=()=>{$("#run").innerHTML=`<div class="hero"><p class="sub">${r.t}</p><h2>Wesenheit?</h2></div><div class="row"><button class="btn ghost" id="wOhne">Ohne</button><button class="btn primary" id="wMit">Mit</button></div><div class="row"><button class="btn ghost" id="wBack">Liste</button></div>`;$("#wOhne").onclick=()=>{mit=false;steps=stepsFor(r,false);i=0;draw()};$("#wMit").onclick=()=>{mit=true;steps=stepsFor(r,true);i=0;draw()};$("#wBack").onclick=()=>show("home")};
  const draw=()=>{const [titel,text]=steps[i],last=i===steps.length-1;const names=(i===0?(r.need||[]):[]).map(n=>`<input data-k="${n}" placeholder="${n}">`).join("");$("#run").innerHTML=`<div class="hero"><p class="sub">${r.t} · ${i+1}/${steps.length}</p><h2>${titel}</h2></div>${names||""}<p class="words">${fill(text,mem)}</p>${last?`<label class="check"><input type="checkbox" id="back"><span>Ich kehre zurück.</span></label>`:""}<div class="row"><button class="btn ghost" id="prev">${i?"Zurück":"Wahl"}</button><button class="btn primary" id="next">${last?"So sei es":"Weiter"}</button></div><p class="msg" id="msg"></p>`;$$("#run [data-k]").forEach(inp=>inp.oninput=()=>{mem[inp.dataset.k]=inp.value.trim()});$("#prev").onclick=()=>{if(!i){gate();return}i--;draw()};$("#next").onclick=()=>{if(i<steps.length-1){i++;draw();return}if(!$("#back")||!$("#back").checked){$("#msg").textContent="Erst zurückkehren.";return}const d=load();d.log.unshift({id:uid(),t:now(),titel:r.t,wer:[mem.Name,mem.A,mem.B].filter(Boolean).join(" · "),wesen:!!mit});if(fromPlan){d.planned=d.planned.filter(p=>p.pid!==fromPlan);fromPlan=null}save(d);show("after")}};
  show("run");gate();
}
function renderList(){const order=["Alltag","Schutz","Energie","Liebe","Trennung","Feld"];$("#cats").innerHTML=["Alle",...order].map(x=>`<button class="chip${x===cat?" on":""}" data-cat="${x}">${x}</button>`).join("");$$("#cats [data-cat]").forEach(b=>b.onclick=()=>{cat=b.dataset.cat;renderList()});const items=R.filter(r=>cat==="Alle"||r.tag===cat);const g={};items.forEach(r=>{(g[r.tag]=g[r.tag]||[]).push(r)});$("#list").innerHTML=Object.keys(g).sort((a,b)=>order.indexOf(a)-order.indexOf(b)).map(k=>`<p class="group">${k}</p>`+g[k].map(r=>`<button class="card" data-id="${r.id}"><b>${r.t}</b><small>${r.s}</small></button>`).join("")).join("");$$("#list .card").forEach(b=>b.onclick=()=>{fromPlan=null;openR(b.dataset.id)})}
function paintPlan(){const d=load(),sel=$("#plR");if(sel&&sel.options.length!==R.length){sel.innerHTML="";R.forEach(r=>{const o=document.createElement("option");o.value=r.id;o.textContent=r.t;sel.appendChild(o)})}$("#plList").innerHTML=d.planned.length?d.planned.map(x=>`<div class="entry"><b>${esc(x.titel)}</b><div class="meta">${esc(x.wer||"")}</div><button class="btn primary" data-go="${x.pid}">Setzen</button></div>`).join(""):"<p class='sub'>Nichts geplant.</p>";$$("#plList [data-go]").forEach(b=>b.onclick=()=>{const x=load().planned.find(p=>p.pid===b.dataset.go);if(x){fromPlan=x.pid;openR(x.id,x.wer)}})}
function paintNotes(){const notes=loadNotes();$("#notesOnly").innerHTML=notes.length?notes.map(n=>`<div class="entry"><div class="meta">${esc(n.t)}</div><p>${esc(n.note)}</p></div>`).join(""):"<p class='sub'>Keine Notiz.</p>"}
function paintLog(){const rows=load().log||[];$("#entries").innerHTML=rows.length?rows.map(e=>`<div class="entry"><b>${esc(e.titel)}</b><div class="meta">${esc(e.t)} ${esc(e.wer||"")}</div></div>`).join(""):"<p class='sub'>Noch leer.</p>"}
async function paintBuch(){
  const page=$("#page"); if(!page) return;
  page.innerHTML="<p class='sub'>Buch lädt …</p>";
  if(!BOOK.length){
    try{
      const t=await fetch("https://raw.githubusercontent.com/fxrebermanagement-star/universum/6e38ecac7a98859505ac47575dd905e6e47ab274/index.html").then(r=>r.text());
      const a=t.indexOf("const BOOK=");
      const b=t.indexOf("\nconst KEY=\"universum_buch_ritual_v3\";");
      if(a<0||b<0) throw new Error("kein Buch");
      BOOK=JSON.parse(t.slice(a+11,b));
    }catch(e){
      page.innerHTML="<p class='sub'>Buch gerade nicht erreichbar. Seite neu laden.</p>";
      return;
    }
  }
  page.innerHTML=BOOK.map((c,i)=>"<sec id='c"+i+"'><h3>"+esc(c.t)+"</h3><div>"+esc(c.b).replaceAll("\n","<br>")+"</div></sec>").join("");
}
document.addEventListener("click",e=>{const n=e.target.closest("nav button");if(n)show(n.dataset.v)});
$("#plAdd").onclick=()=>{const r=R.find(x=>x.id===$("#plR").value);if(!r)return;const d=load();d.planned.unshift({pid:uid(),id:r.id,titel:r.t,wer:($("#plW").value||"").trim(),t:now()});save(d);paintPlan()};
$("#noteAdd").onclick=()=>{const tx=($("#noteT").value||"").trim();if(!tx)return;const n=loadNotes();n.unshift({id:uid(),t:now(),note:tx});saveNotes(n);$("#noteT").value="";paintNotes()};
$("#quick").onclick=()=>{const d=load();d.log.unshift({id:uid(),t:now(),titel:"Feld zu"});save(d);show("after")};
$("#afterStay").onclick=()=>show("home");$("#afterGo").onclick=()=>show("bye");$("#stay").onclick=()=>show("home");
renderList();
