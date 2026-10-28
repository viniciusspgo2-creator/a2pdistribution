import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminAuthenticated,badAuth,validOrigin } from '@/lib/auth';
import { allPostsAdmin } from '@/lib/posts';
import { db,ensureSchema } from '@/lib/db';
export const postSchema=z.object({slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(120), date:z.string().regex(/^\d{4}-\d{2}-\d{2}$/),category:z.string().max(80),cover:z.string().max(1200),published:z.boolean().optional(),translations:z.record(z.enum(['pt','es','de','fr','en']),z.object({title:z.string().min(6).max(240),excerpt:z.string().min(20).max(450),body:z.array(z.string().min(20).max(2500)).min(2).max(24)}))});
export async function GET(){if(!await adminAuthenticated())return badAuth();try{return NextResponse.json(await allPostsAdmin());}catch{return NextResponse.json({error:'Banco indisponível'},{status:503});}}
export async function POST(req:Request){if(!await adminAuthenticated())return badAuth();if(!validOrigin(req))return NextResponse.json({error:'Origem inválida'},{status:403});const parsed=postSchema.safeParse(await req.json().catch(()=>null));if(!parsed.success)return NextResponse.json({error:'Artigo inválido. Preencha as traduções completas.',details:parsed.error.flatten()},{status:400});
 const sql=db();if(!sql)return NextResponse.json({error:'Configure DATABASE_URL.'},{status:503});
 try {await ensureSchema();const {slug,published,...rest}=parsed.data;const data={slug,...rest,published:published??true};await sql`INSERT INTO blog_articles(slug,data,published) VALUES(${slug},${JSON.stringify(data)}::jsonb,${published??true}) ON CONFLICT (slug) DO UPDATE SET data=EXCLUDED.data,published=EXCLUDED.published,updated_at=NOW()`;return NextResponse.json({ok:true});}
 catch{return NextResponse.json({error:'Erro ao guardar artigo.'},{status:500});}}
