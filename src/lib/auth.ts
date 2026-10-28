import { cookies } from 'next/headers';
import { jwtVerify, SignJWT } from 'jose';
const COOKIE='a2p_admin';
function secret(){ const s=process.env.SESSION_SECRET; if(!s || s.length<32) throw new Error('SESSION_SECRET deve ter 32 caracteres ou mais.'); return new TextEncoder().encode(s); }
export async function createSession(email:string) { return new SignJWT({role:'admin',email}).setProtectedHeader({alg:'HS256'}).setIssuedAt().setExpirationTime('8h').sign(secret()); }
export async function adminAuthenticated():Promise<boolean> {
  try { const token=(await cookies()).get(COOKIE)?.value; if(!token) return false; const v=await jwtVerify(token,secret(),{algorithms:['HS256']});
   return v.payload.role==='admin' && v.payload.email===process.env.ADMIN_EMAIL;
  } catch {return false;}
}
export function sessionCookie(value:string){return {name:COOKIE,value,httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'strict' as const,path:'/',maxAge:8*60*60};}
export function validOrigin(request:Request) {const origin=request.headers.get('origin'); if(!origin) return false; try {return new URL(origin).host===new URL(request.url).host;}catch{return false;} }
export function badAuth(){ return Response.json({error:'Não autorizado.'},{status:401}); }
