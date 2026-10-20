/**
 * OPTIONAL Cloudflare Worker example for public, publisher-linked AI updates.
 * Setup: deploy this Worker and paste its endpoint in config.js newsFeedEndpoint.
 * The site functions without it; publisher resource cards are shown instead.
 * Security note: restrict Access-Control-Allow-Origin to your published 18ai origin.
 */
const sources=[
 {name:'Google News · AI Research',url:'https://news.google.com/rss/search?q=artificial%20intelligence%20research&hl=en-US&gl=US&ceid=US:en',topic:'research'},
 {name:'Google News · Enterprise AI',url:'https://news.google.com/rss/search?q=enterprise%20AI%20technology&hl=en-US&gl=US&ceid=US:en',topic:'industry'},
 {name:'Google News · Agentic AI',url:'https://news.google.com/rss/search?q=agentic%20AI%20agents&hl=en-US&gl=US&ceid=US:en',topic:'agents'}
];
const unescapeXML=s=>s.replace(/<!\[CDATA\[|\]\]>/g,'').replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>');
const capture=(xml,tag)=>{const r=new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`,'i');return unescapeXML((xml.match(r)||[])[1]||'').trim()};
export default {
 async fetch(request,env,ctx){
  if(new URL(request.url).pathname!=='/updates')return new Response('Not Found',{status:404});
  const origin=env.ALLOWED_ORIGIN||'https://18ai.in';
  const h={'Access-Control-Allow-Origin':origin,'Content-Type':'application/json; charset=utf-8','Cache-Control':'public, max-age=900','Vary':'Origin'};
  try{
   const results=await Promise.all(sources.map(async source=>{
    const resp=await fetch(source.url,{headers:{'User-Agent':'18ai-public-news-aggregator/1.0'}});if(!resp.ok)return [];
    const xml=await resp.text();return (xml.match(/<item>[\s\S]*?<\/item>/gi)||[]).slice(0,8).map(item=>{
      const title=capture(item,'title').replace(/<[^>]*>/g,'').slice(0,180);
      const link=capture(item,'link');const date=capture(item,'pubDate');
      try{if(!['https:','http:'].includes(new URL(link).protocol))return null}catch{return null}
      return {source:source.name,topic:source.topic,title,copy:'Read the original report for context and verification.',url:link,date:date?new Date(date).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}):''};
    }).filter(Boolean);
   }));
   const items=results.flat().slice(0,24);
   return new Response(JSON.stringify({items,updatedAt:new Date().toISOString()}),{headers:h});
  }catch{ return new Response(JSON.stringify({items:[]}),{status:503,headers:h})}
 }
};
