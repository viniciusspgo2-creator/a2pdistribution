import { NextResponse } from 'next/server';
import { sessionCookie,validOrigin } from '@/lib/auth';
export async function POST(req:Request) { if(!validOrigin(req))return NextResponse.json({error:'Origem inválida.'},{status:403}); const res=NextResponse.json({ok:true});res.cookies.set(sessionCookie(''));res.cookies.delete('a2p_admin');return res; }
