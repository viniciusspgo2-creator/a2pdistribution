import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import {createHmac} from 'node:crypto';
import {db,ensureSchema} from '@/lib/db';
import { createSession,sessionCookie,validOrigin } from '@/lib/auth';
export async function POST(request:Request) {
 if(!validOrigin(request)) return NextResponse.json({error:'Origem inválida.'},{status:403});
 const { email='',password='' }=await request.json().catch(()=>({}));
 const hash=process.env.ADMIN_PASSWORD_HASH; const expected=process.env.ADMIN_EMAIL;
 if(!hash||!expected||!process.env.SESSION_SECRET||process.env.SESSION_SECRET.length<32) return NextResponse.json({error:'Admin não configurado. Configure ADMIN_EMAIL, ADMIN_PASSWORD_HASH e SESSION_SECRET.'},{status:503});
 if(typeof email!=='string'||typeof password!=='string'||email.length>255||password.length>1024) return NextResponse.json({error:'Credenciais inválidas.'},{status:400});
 // Limite por email + IP resumido em HMAC: não guardamos o endereço IP bruto.
 const sql=db();if(!sql)return NextResponse.json({error:'Configure DATABASE_URL para autenticação.'},{status:503});
 try {await ensureSchema();const ip=request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';
 const key=createHmac('sha256',process.env.SESSION_SECRET!).update(`${email.toLowerCase()}|${ip}`).digest('hex');
 const r=await sql`INSERT INTO login_limits(key,attempts,updated_at) VALUES(${key},1,NOW()) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN login_limits.updated_at<NOW()-INTERVAL '15 minutes' THEN 1 ELSE login_limits.attempts+1 END,updated_at=NOW() RETURNING attempts`;
 if(Number(r[0]?.attempts)>12)return NextResponse.json({error:'Demasiadas tentativas. Aguarde 15 minutos.'},{status:429});
 }catch{return NextResponse.json({error:'Serviço de autenticação temporariamente indisponível.'},{status:503});}
 // A comparação é feita mesmo quando o email não corresponde, para reduzir diferença de tempo.
 const match=await bcrypt.compare(password,hash).catch(()=>false);
 if(!match||email.trim().toLowerCase()!==expected.toLowerCase()) return NextResponse.json({error:'Credenciais incorretas.'},{status:401});
 const response=NextResponse.json({ok:true}); response.cookies.set(sessionCookie(await createSession(expected)));return response;
}
