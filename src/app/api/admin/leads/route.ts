import { NextResponse } from 'next/server';
import { adminAuthenticated,badAuth } from '@/lib/auth';
import { db,ensureSchema } from '@/lib/db';
export async function GET(){if(!await adminAuthenticated())return badAuth();const sql=db();if(!sql)return NextResponse.json({error:'Configure DATABASE_URL'},{status:503});try{await ensureSchema();return NextResponse.json(await sql`SELECT id,name,business,email,phone,message,locale,created_at FROM leads ORDER BY created_at DESC LIMIT 200`);}catch{return NextResponse.json({error:'Banco indisponível'},{status:503});}}
