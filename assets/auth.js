const allowedHashes=new Set(["44db4e7dd7d675378fce1f9272c0fe44d428b75eb16101d53b88155a39d4aaf8","b84157a321d9ef8d3d234ff8a9a6cab672779c0cb8efbd54ea9007c2dd0b3361"]);
async function sha256(value){const bytes=new TextEncoder().encode(value),digest=await crypto.subtle.digest("SHA-256",bytes);return[...new Uint8Array(digest)].map(byte=>byte.toString(16).padStart(2,"0")).join("")}
function unlock(){document.body.classList.remove("locked");document.querySelector("#auth-gate").hidden=true;sessionStorage.setItem("kgi9268-unlocked","1")}
if(sessionStorage.getItem("kgi9268-unlocked")==="1")unlock();
document.querySelector("#auth-form").addEventListener("submit",async event=>{event.preventDefault();const input=document.querySelector("#access-password"),error=document.querySelector("#auth-error");if(allowedHashes.has(await sha256(input.value))){input.value="";error.textContent="";unlock()}else{error.textContent="密碼不正確";input.select()}});
