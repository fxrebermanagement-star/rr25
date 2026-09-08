(function(){
  var box=document.createElement("div");
  box.id="lb";
  box.innerHTML='<img alt="">';
  document.body.appendChild(box);
  var st=document.createElement("style");
  st.textContent="#lb{display:none;position:fixed;inset:0;z-index:80;background:rgba(4,2,8,.92);align-items:center;justify-content:center;padding:1.2rem}#lb.on{display:flex}#lb img{max-width:100%;max-height:100%;border-radius:1rem;object-fit:contain}";
  document.head.appendChild(st);
  document.addEventListener("click",function(e){
    var img=e.target.closest(".shots img");
    if(!img||!img.src) return;
    e.preventDefault();
    e.stopPropagation();
    box.querySelector("img").src=img.src;
    box.classList.add("on");
  },true);
  box.onclick=function(){ box.classList.remove("on"); box.querySelector("img").src=""; };
})();
