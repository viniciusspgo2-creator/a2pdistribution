import { NextResponse } from 'next/server';
import { db,ensureSchema } from '@/lib/db';
const events=new Set(['pageview','contact_click','catalog_click','social_click']);
export async function POST(req:Request){const data=await req.json().catch(()=>null);if(!data||!events.has(data.event)||typeof data.path!=='string'||!/^(\/pt|\/es|\/de|\/fr|\/en)(\/|$)/.test(data.path)||data.path.length>250)return NextResponse.json({error:'Inválido'},{status:400});
 const sql=db();if(!sql)return new Response(null,{status:204});
 const ua=req.headers.get('user-agent')??'';if(/bot|crawl|spider|preview/i.test(ua))return new Response(null,{status:204});
 try{await ensureSchema();await sql`INSERT INTO metrics(day,pathname,event,total) VALUES(CURRENT_DATE,${data.path},${data.event},1) ON CONFLICT(day,pathname,event) DO UPDATE SET total=metrics.total+1`;
 return new Response(null,{status:204});}catch{return new Response(null,{status:204});}}
