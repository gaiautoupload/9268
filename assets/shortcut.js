document.querySelector("#today-jump").addEventListener("click",()=>{
  const daily=document.querySelector('[data-period="1"]');
  if(daily&&!daily.classList.contains("active"))daily.click();
  document.querySelector("#today-flow").scrollIntoView({behavior:"smooth",block:"start"});
});
