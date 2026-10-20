(()=>{
'use strict';
const config=window.AI18_CONFIG||{};
// Trustworthy current time in explicitly labelled time zone (no external API required).
let utc=false;
const clock=document.getElementById('world-clock'),date=document.getElementById('world-date');
const switcher=document.getElementById('timezone-button');
function updateClock(){const now=new Date(),tz=utc?'UTC':'Asia/Kolkata';
 if(clock)clock.textContent=new Intl.DateTimeFormat('en-IN',{timeZone:tz,hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true}).format(now);
 if(date)date.textContent=new Intl.DateTimeFormat('en-IN',{timeZone:tz,weekday:'long',day:'numeric',month:'long',year:'numeric'}).format(now);
 const small=document.querySelector('.global-clock small');if(small)small.textContent=utc?'Coordinated Universal Time · UTC':'India Standard Time · Asia/Kolkata';
 if(switcher)switcher.textContent=utc?'Show India time ↗':'Show UTC instead ↗';}
updateClock();setInterval(updateClock,1000);if(switcher)switcher.addEventListener('click',()=>{utc=!utc;updateClock()});
const trusted=[
 {source:'OPENAI',topic:'research',title:'Research and model developments',copy:'Explore published work on language models, reasoning, multimodal intelligence and practical AI systems.',url:'https://openai.com/research/'},
 {source:'IBM RESEARCH',topic:'industry',title:'Enterprise AI, foundation models and governance',copy:'Discover ongoing research across enterprise AI, trust, data and applied industrial systems.',url:'https://research.ibm.com/'},
 {source:'NVIDIA',topic:'agents',title:'Accelerated AI and intelligent agents',copy:'Engineering perspectives on AI infrastructure, inference, robotics and agentic workflows.',url:'https://developer.nvidia.com/blog/'},
 {source:'GOOGLE DEEPMIND',topic:'research',title:'Frontier AI research and science',copy:'Research publications exploring advanced models, scientific discovery and AI safety.',url:'https://deepmind.google/research/'},
 {source:'MIT NEWS',topic:'research',title:'University AI research insights',copy:'Independent reporting on emerging research across machine learning and applications.',url:'https://news.mit.edu/topic/artificial-intelligence2'},
 {source:'NIST AI',topic:'industry',title:'AI safety, measurement and risk management',copy:'Frameworks and resources for evaluating and governing trustworthy AI in organizations.',url:'https://www.nist.gov/artificial-intelligence'}
];
let loaded=null,topic='all';const grid=document.getElementById('ai-news-grid'),status=document.getElementById('feed-status'),sync=document.getElementById('news-last-sync');
function render(){if(!grid)return;grid.replaceChildren();const arr=(loaded||trusted).filter(x=>topic==='all'||x.topic===topic);
 if(!arr.length){const p=document.createElement('p');p.textContent='No articles in this category yet. Try another topic.';grid.append(p);return;}
 for(const item of arr.slice(0,12)){
  const a=document.createElement('a');a.href=item.url;a.target='_blank';a.rel='noopener noreferrer';a.className='news-card';
  const src=document.createElement('span');src.className='source';src.textContent=item.source||'AI UPDATE';a.append(src);
  const h=document.createElement('h3');h.textContent=item.title;a.append(h);
  const p=document.createElement('p');p.textContent=item.copy||'Read the original article for full details and publication context.';a.append(p);
  const foot=document.createElement('div');foot.className='news-foot';const d=document.createElement('span');d.textContent=item.date||'Original source';const go=document.createElement('span');go.textContent='Explore ↗';foot.append(d,go);a.append(foot);grid.append(a);
 }
}
async function loadNews(){if(!config.newsFeedEndpoint){loaded=null;status.textContent='Trusted research publishers · Connect a feed for live headlines';sync.textContent='Publisher links · No live stories claimed';render();return;}
 status.textContent='Updating worldwide AI headlines…';
 try{const response=await fetch(config.newsFeedEndpoint,{signal:AbortSignal.timeout(9000)});if(!response.ok)throw new Error('feed unavailable');const payload=await response.json();if(!payload.items||!Array.isArray(payload.items)||!payload.items.length)throw new Error('empty feed');
 const allowed=['http:','https:'];loaded=payload.items.filter(x=>{try{return allowed.includes(new URL(x.url).protocol)}catch{return false}}).slice(0,30);status.textContent='Latest available feed · Times provided by publishers';sync.textContent='Fetched '+new Intl.DateTimeFormat('en-IN',{timeStyle:'short',dateStyle:'medium'}).format(new Date());}
 catch(e){loaded=null;status.textContent='Feed not reachable · Showing trusted source links';sync.textContent='Visit publishers directly for current news';}render();}
 document.querySelectorAll('.feed-tabs button').forEach(btn=>btn.addEventListener('click',()=>{topic=btn.dataset.topic;document.querySelectorAll('.feed-tabs button').forEach(b=>b.classList.toggle('active',b===btn));render()}));
 document.getElementById('refresh-news')?.addEventListener('click',loadNews);loadNews();
 const quick=document.getElementById('quick-menu'),toggle=document.getElementById('quick-toggle');
 function closeQuick(){quick.hidden=true;toggle.setAttribute('aria-expanded','false')};
 toggle?.addEventListener('click',()=>{quick.hidden=!quick.hidden;toggle.setAttribute('aria-expanded',String(!quick.hidden))});
 document.getElementById('quick-message')?.addEventListener('click',closeQuick);
 document.addEventListener('keydown',e=>{if(e.key==='Escape')closeQuick()});
 document.addEventListener('click',e=>{if(!document.getElementById('quick-connect')?.contains(e.target))closeQuick()});
 // Mailto fallback unless a real contact-form provider has been connected.
 const form=document.getElementById('thought-form'),formStatus=document.getElementById('thought-status');
 form?.addEventListener('submit',async e=>{e.preventDefault();if(!form.reportValidity())return;
 const fields=Object.fromEntries(new FormData(form)),btn=form.querySelector('button[type=submit]');
 if(config.messageFormEndpoint&&/^https:\/\//i.test(config.messageFormEndpoint)){
  btn.disabled=true;formStatus.textContent='Sending securely…';
  try{const response=await fetch(config.messageFormEndpoint,{method:'POST',body:JSON.stringify(fields),headers:{'Content-Type':'application/json','Accept':'application/json'}});
   if(!response.ok)throw new Error('submission failed');form.reset();formStatus.textContent='Message sent. Thank you for reaching out to 18AI.';
  }catch(err){formStatus.textContent='Unable to send automatically. Please email hi@18ai.in or use WhatsApp.';}finally{btn.disabled=false;}
 }else{const subject=`18AI idea / message — ${fields.interest}`;const message=`Hello 18AI,\n\n${fields.message}\n\nName: ${fields.name}\nEmail: ${fields.email}\nTopic: ${fields.interest}`;
  formStatus.textContent='Your email application should open now. Please press Send there to deliver the message.';
  location.href=`mailto:${config.email||'hi@18ai.in'}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;}
 });
 // Account-controlled Cloudflare Web Analytics requires your real site token.
 if(config.cloudflareAnalyticsToken&&/^[A-Za-z0-9-]{20,}$/.test(config.cloudflareAnalyticsToken)){
 const s=document.createElement('script');s.defer=true;s.src='https://static.cloudflareinsights.com/beacon.min.js';s.setAttribute('data-cf-beacon',JSON.stringify({token:config.cloudflareAnalyticsToken}));document.head.append(s);
 }
})();
