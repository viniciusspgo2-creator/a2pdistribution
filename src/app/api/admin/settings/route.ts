import { NextResponse } from 'next/server';
import { z } from 'zod';
import { adminAuthenticated,badAuth,validOrigin } from '@/lib/auth';
import { saveSettings,settings } from '@/lib/db';
const override=z.record(z.string().max(60),z.union([z.string().max(4000),z.array(z.string().max(1000)).max(40),z.array(z.tuple([z.string().max(400),z.string().max(2000)])).max(20)]));
const schema=z.object({ locales:z.record(z.string().regex(/^(pt|es|de|fr|en)$/),override).optional(), catalogUrl:z.union([z.url().max(1000),z.literal('')]).optional(),heroImage:z.union([z.string().url().max(1000),z.string().regex(/^\/assets\/[\w.-]+$/),z.literal('')]).optional(), whatsappNumber:z.string().regex(/^\+?[0-9 ]{0,22}$/).optional(),googleVerification:z.string().max(300).regex(/^[a-zA-Z0-9_-]*$/).optional(),seoTitle:z.string().max(180).optional(),seoDescription:z.string().max(360).optional() });
export async function GET() {if(!await adminAuthenticated())return badAuth();return NextResponse.json(await settings());}
export async function PUT(request:Request) {if(!await adminAuthenticated())return badAuth();if(!validOrigin(request))return NextResponse.json({error:'Origem inválida'},{status:403});
 const json=await request.json().catch(()=>null);const parsed=schema.safeParse(json);
 if(!parsed.success)return NextResponse.json({error:'Dados inválidos.',details:parsed.error.flatten()},{status:400});
 try{await saveSettings(parsed.data as import('@/lib/db').Settings);return NextResponse.json({ok:true});}catch(e){return NextResponse.json({error:e instanceof Error?e.message:'Erro no banco'},{status:500});}}
