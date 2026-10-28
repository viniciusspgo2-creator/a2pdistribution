import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db,ensureSchema } from '@/lib/db';
const schema=z.object({name:z.string().trim().min(2).max(140),business:z.string().max(160).optional().default(''),email:z.email().max(240),phone:z.string().max(60).optional().default(''),message:z.string().trim().min(10).max(4000),locale:z.enum(['pt','es','de','fr','en']),consent:z.literal(true), website:z.string().max(200).optional()});
export async function POST(req:Request){const parsed=schema.safeParse(await req.json().catch(()=>null));if(!parsed.success)return NextResponse.json({error:'Verifique os campos e a autorização de contacto.'},{status:400});
 if(parsed.data.website)return NextResponse.json({ok:true});
 const sql=db();if(!sql)return NextResponse.json({error:'Formulário temporariamente indisponível. Contacte a equipa por telefone.'},{status:503});
 try{await ensureSchema();const p=parsed.data;const last=await sql`SELECT COUNT(*)::int AS n FROM leads WHERE email=${p.email} AND created_at >= NOW()-INTERVAL '24 hours'`;
 if(Number(last[0]?.n)>4)return NextResponse.json({error:'Limite de pedidos atingido. Contacte por telefone.'},{status:429});
 await sql`INSERT INTO leads(name,business,email,phone,message,locale) VALUES(${p.name},${p.business},${p.email},${p.phone},${p.message},${p.locale})`;
 return NextResponse.json({ok:true});}catch{return NextResponse.json({error:'Falha no envio. Contacte a equipa por telefone.'},{status:500});}}
