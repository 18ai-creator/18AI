const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const cfg=window.AI18_CONFIG||{};
[['youtube-link','youtube'],['footer-youtube','youtube'],['instagram-link','instagram'],['footer-instagram','instagram'],['linkedin-link','linkedin'],['footer-linkedin','linkedin']].forEach(([id,k])=>{let e=document.getElementById(id);if(e)e.href=cfg[k]||'#media'});
$('#year').textContent=new Date().getFullYear();
const hamburger=$('.hamburger'), mobile=$('#mobile-nav');
hamburger.addEventListener('click',()=>{let open=mobile.classList.toggle('open');hamburger.setAttribute('aria-expanded',String(open));hamburger.setAttribute('aria-label',open?'Close menu':'Open menu')});
$$('.mobile-nav a').forEach(a=>a.addEventListener('click',()=>{mobile.classList.remove('open');hamburger.setAttribute('aria-expanded','false')}));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.11});$$('.reveal').forEach(el=>observer.observe(el));
const descriptions=[
'Explore what artificial intelligence is, where it appears in everyday life, and why it matters — through stories and simple demonstrations.',
'Build a confident foundation in AI concepts, responsible use and the ideas behind intelligent technology.',
'Try guided challenges and hands-on tools. Make mistakes, investigate and discover what actually works.',
'Turn understanding into tangible projects, applications and practical solutions to real problems.',
'Apply your skills to learning, work and society, and keep growing as technology evolves.'
];
$$('.step').forEach((b,i)=>b.addEventListener('click',()=>{$$('.step').forEach((x,j)=>{x.classList.toggle('active',i===j);x.setAttribute('aria-selected',String(i===j))});$('#step-description').textContent=descriptions[i];$('.journey-detail .number').textContent=String(i+1).padStart(2,'0')+' / 05'}));
const modal=$('#film-modal'), close=$('#film-close');let priorFocus=null;
function openFilm(){priorFocus=document.activeElement;modal.hidden=false;document.body.classList.add('modal-open');close.focus()}
function closeFilm(){modal.hidden=true;document.body.classList.remove('modal-open');if(priorFocus)priorFocus.focus()}
$('#show-film').addEventListener('click',openFilm);$('#show-film2').addEventListener('click',openFilm);close.addEventListener('click',closeFilm);modal.addEventListener('click',e=>{if(e.target===modal)closeFilm()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeFilm()});
$('#contact-form').addEventListener('submit',e=>{e.preventDefault();let f=e.currentTarget;if(!f.reportValidity())return;let v=Object.fromEntries(new FormData(f));let subject=`18ai enquiry — ${v.interest}`;let body=`Hello 18ai,\n\n${v.message}\n\nName: ${v.name}\nEmail: ${v.email}\nInterest: ${v.interest}`;location.href=`mailto:${cfg.email||'hi@18ai.in'}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`});
