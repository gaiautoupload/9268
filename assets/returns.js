fetch("./data/snapshot.json",{cache:"no-store"}).then(r=>r.json()).then(data=>{
  const byId=new Map(data.core_stocks.map(row=>[String(row.stock_id),row]));
  const formatMoney=value=>{const n=Number(value||0),a=Math.abs(n);return`${n>=0?"+":"−"}${a>=1e8?(a/1e8).toFixed(2)+" 億":a>=1e4?(a/1e4).toFixed(1)+" 萬":Math.round(a).toLocaleString()}`};
  const formatPct=value=>value==null?"資料不足":`${Number(value)>=0?"+":""}${(Number(value)*100).toFixed(2)}%`;
  function renderReturns(){
    const summary=document.querySelector("#summary"),totals=data.portfolio_totals||{};
    if(summary&&!summary.querySelector("[data-inventory-return]"))summary.insertAdjacentHTML("afterbegin",`<article data-inventory-return><small>總庫存報酬</small><strong class="${Number(totals.inventory_return)>=0?"up":"down"}">${formatPct(totals.inventory_return)}</strong><span>未實現損益 ${formatMoney(totals.inventory_profit)}</span></article>`);
    document.querySelectorAll(".stock").forEach(card=>{
      const id=card.querySelector(".stock-title small")?.textContent.trim(),row=byId.get(id),grid=card.querySelector(".grid");
      if(!row||!grid||grid.querySelector("[data-stock-return]"))return;
      grid.insertAdjacentHTML("beforeend",`<span data-stock-return><small>庫存報酬</small><b class="${Number(row.inventory_return)>=0?"up":"down"}">${formatPct(row.inventory_return)}</b></span><span><small>未實現損益</small><b class="${Number(row.inventory_profit)>=0?"up":"down"}">${formatMoney(row.inventory_profit)}</b></span>`);
    });
  }
  new MutationObserver(renderReturns).observe(document.querySelector("#core-list"),{childList:true});
  new MutationObserver(renderReturns).observe(document.querySelector("#summary"),{childList:true});
  renderReturns();
});
