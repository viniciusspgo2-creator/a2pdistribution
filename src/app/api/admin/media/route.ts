import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminAuthenticated,badAuth,validOrigin } from '@/lib/auth';
import { db,ensureSchema } from '@/lib/db';
export async function GET(){if(!await adminAuthenticated())return badAuth();const sql=db();if(!sql)return NextResponse.json([]);try{await ensureSchema();const rows=await sql`SELECT id,url,filename,content_type,created_at FROM media ORDER BY created_at DESC LIMIT 200`;return NextResponse.json(rows);}catch{return NextResponse.json({error:'Banco indisponível'},{status:503});}}
const schema=z.object({url:z.url().max(1200),filename:z.string().max(160),contentType:z.enum(['image/png','image/jpeg','image/webp','image/avif','application/pdf'])});
export async function POST(request:Request){if(!await adminAuthenticated())return badAuth();if(!validOrigin(request))return NextResponse.json({error:'Origem inválida'},{status:403});const parsed=schema.safeParse(await request.json().catch(()=>null));if(!parsed.success)return NextResponse.json({error:'Dados inválidos'},{status:400});
 const {url,filename,contentType}=parsed.data;const host=new URL(url).hostname;
 if(!host.endsWith('.public.blob.vercel-storage.com'))return NextResponse.json({error:'A URL deve pertencer ao Vercel Blob público.'},{status:400});
 const sql=db();if(!sql)return NextResponse.json({error:'Banco não configurado.'},{status:503});try{await ensureSchema();await sql`INSERT INTO media(url,filename,content_type) VALUES(${url},${filename},${contentType}) ON CONFLICT(url) DO NOTHING`;return NextResponse.json({ok:true});}
 catch{return NextResponse.json({error:'Falha no registo da media.'},{status:500});}}
