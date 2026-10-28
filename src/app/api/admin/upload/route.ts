import { NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { adminAuthenticated,validOrigin } from '@/lib/auth';
import { db,ensureSchema } from '@/lib/db';
const types=['image/png','image/jpeg','image/webp','image/avif','application/pdf'];
export async function POST(request:Request){
 if(!process.env.BLOB_READ_WRITE_TOKEN)return NextResponse.json({error:'Configure BLOB_READ_WRITE_TOKEN.'},{status:503});
 const body=await request.json().catch(()=>null) as HandleUploadBody|null;
 if(!body)return NextResponse.json({error:'Pedido inválido.'},{status:400});
 try{const response=await handleUpload({body,request,
   onBeforeGenerateToken:async pathname=>{
     if(!await adminAuthenticated()||!validOrigin(request))throw new Error('Não autorizado a enviar ficheiros.');
     if(!pathname.startsWith('a2p/')||pathname.length>160)throw new Error('Nome de ficheiro inválido.');
     return {allowedContentTypes:types,maximumSizeInBytes:12*1024*1024,addRandomSuffix:true,tokenPayload:JSON.stringify({purpose:'a2p-admin-upload'})};
   },
   onUploadCompleted:async ({blob,tokenPayload})=>{
     const data=JSON.parse(tokenPayload||'{}');if(data.purpose!=='a2p-admin-upload')throw new Error('Upload inválido.');
     const sql=db();if(!sql)throw new Error('Banco de dados não configurado.');
     await ensureSchema();const filename=blob.pathname.split('/').pop()||'ficheiro';
     await sql`INSERT INTO media(url,filename,content_type) VALUES(${blob.url},${filename},${blob.contentType}) ON CONFLICT(url) DO NOTHING`;
   }
 });return NextResponse.json(response);}
 catch(e){console.error('[blob]',e);return NextResponse.json({error:e instanceof Error?e.message:'Upload falhou.'},{status:400});}
}
