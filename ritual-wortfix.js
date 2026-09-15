(function(){
  function fix(s){
    return String(s||"")
      .replace(/Eigenes Feld zuerst hart schliessen\.?/g, "Sprich:\nIch schliesse mein Feld hart.\nNichts Fremdes hat Zutritt.")
      .replace(/Eigenes Feld zuerst hart\.?/g, "Sprich:\nIch schliesse mein Feld hart.")
      .replace(/Ohne geschlossenes Feld kein Fluch\.?/g, "Sprich:\nIch schliesse mein Feld hart.\nOhne dieses Feld öffne ich nicht.")
      .replace(/Eigenes Feld zuerst\.?/g, "Sprich:\nIch schliesse mein Feld.")
      .replace(/Feld zuerst hart\.?/g, "Sprich:\nIch schliesse mein Feld hart.")
      .replace(/Erst das eigene Feld schliessen\.?/g, "Sprich:\nIch schliesse mein Feld.")
      .replace(/Erst das eigene Feld schließen\.?/g, "Sprich:\nIch schliesse mein Feld.");
  }
  (R||[]).forEach(function(r){
    if(!r || !r.steps) return;
    r.steps.forEach(function(st){
      if(st && st[1]) st[1]=fix(st[1]);
    });
  });
})();
