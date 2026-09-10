fetch("./data/snapshot.json",{cache:"no-store"}).then(r=>r.json()).then(data=>{
  const byId=new Map(data.core_stocks.map(row=>[String(row.stock_id),row]));
  const pct=value=>value==null?"尚無足夠後續資料":`${Number(value)>=0?"+":""}${(Number(value)*100).toFixed(2)}%`;
  const money=value=>{const n=Math.abs(Number(value||0));return`${Number(value)>=0?"+":"−"}${n>=1e8?(n/1e8).toFixed(2)+" 億":n>=1e4?(n/1e4).toFixed(1)+" 萬":Math.round(n).toLocaleString()}`};
  const influenceLabel=profile=>{if(!profile||profile.event_count<3)return"樣本不足";if(profile.directional_hit_rate_5d>=.6&&profile.average_directional_return_5d>0)return"較強";if(profile.directional_hit_rate_5d>=.5)return"中等";return"偏弱"};
  function decorate(){document.querySelectorAll(".stock").forEach(card=>{
    if(card.querySelector(".impact-toggle"))return;
    const id=card.querySelector(".stock-title small")?.textContent.trim(),row=byId.get(id);if(!row)return;
    const events=row.major_events||[],profile=row.behavior_influence||{};
    const rows=events.length?events.map(event=>`<tr><td>${event.date}</td><td><span class="event ${event.action}">${event.action_label}</span></td><td class="${event.net_amount>=0?"up":"down"}">${money(event.net_amount)}</td><td>${pct(event.return_1d)}</td><td>${pct(event.return_5d)}</td><td>${pct(event.return_20d)}</td></tr>`).join(""):`<tr><td colspan="6">目前沒有達重大門檻的加減碼事件。</td></tr>`;
    card.querySelector(".stock-main").insertAdjacentHTML("beforeend",`<button class="impact-toggle" type="button" aria-expanded="false">查看建倉與價格影響分析 <span>＋</span></button><section class="impact-detail" hidden><div class="impact-summary"><span><small>本輪建倉</small><b>${row.position_start_date||"資料不足"}</b></span><span><small>重大事件</small><b>${profile.event_count||0} 次</b></span><span><small>5 日方向命中</small><b>${profile.directional_hit_rate_5d==null?"—":(profile.directional_hit_rate_5d*100).toFixed(0)+"%"}</b></span><span><small>行為影響力</small><b>${influenceLabel(profile)}</b></span></div><div class="impact-table"><table><thead><tr><th>日期</th><th>動作</th><th>淨額</th><th>後 1 日</th><th>後 5 日</th><th>後 20 日</th></tr></thead><tbody>${rows}</tbody></table></div><p>${profile.note||"價格反應只代表統計關聯。"}</p></section>`);
    const button=card.querySelector(".impact-toggle"),detail=card.querySelector(".impact-detail");button.onclick=()=>{const open=button.getAttribute("aria-expanded")==="true";button.setAttribute("aria-expanded",String(!open));button.querySelector("span").textContent=open?"＋":"−";detail.hidden=open};
  })}
  new MutationObserver(decorate).observe(document.querySelector("#core-list"),{childList:true});decorate();
});
