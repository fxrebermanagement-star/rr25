function openPicPicker(done){
  var inp=document.createElement("input");
  inp.type="file";
  inp.accept="image/*";
  inp.setAttribute("capture","environment");
  inp.style.cssText="position:fixed;left:0;bottom:0;width:1px;height:1px;opacity:0";
  document.body.appendChild(inp);
  inp.onchange=async function(ev){
    var f=ev.target.files&&ev.target.files[0];
    try{ inp.remove(); }catch(e){}
    if(!f) return;
    var data="";
    try{ if(typeof compressPic==="function") data=await compressPic(f); }catch(e){}
    if(!data && typeof readRaw==="function") data=await readRaw(f);
    if(!data){
      data=await new Promise(function(ok){
        var r=new FileReader();
        r.onload=function(){ ok(String(r.result||"")); };
        r.onerror=function(){ ok(""); };
        r.readAsDataURL(f);
      });
    }
    if(data && done) done(data);
  };
  inp.click();
}
