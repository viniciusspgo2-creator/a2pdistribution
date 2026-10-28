import { NextResponse } from 'next/server';
import { adminAuthenticated,badAuth,validOrigin } from '@/lib/auth';
import { db,ensureSchema } from '@/lib/db';
import { starterPosts } from '@/lib/posts';
export async function DELETE(req:Request,{params}:{params:Promise<{slug:string}>}){
 if(!await adminAuthenticated())return badAuth();if(!validOrigin(req))return NextResponse.json({error:'Origem inválida'},{status:403});const {slug}=await params;
 const sql=db();if(!sql)return NextResponse.json({error:'Configure DATABASE_URL'},{status:503});
 try{await ensureSchema();const initial=starterPosts.find(p=>p.slug===slug);
 if(initial)await sql`INSERT INTO blog_articles(slug,data,published) VALUES(${slug},${JSON.stringify(initial)}::jsonb,FALSE) ON CONFLICT(slug) DO UPDATE SET published=FALSE,updated_at=NOW()`;
 else await sql`DELETE FROM blog_articles WHERE slug=${slug}`;return NextResponse.json({ok:true});}
 catch{return NextResponse.json({error:'Falha ao remover artigo'},{status:500});}
}
