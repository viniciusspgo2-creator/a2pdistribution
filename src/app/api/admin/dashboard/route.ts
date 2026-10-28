import { NextResponse } from 'next/server';
import { adminAuthenticated,badAuth } from '@/lib/auth';
import { db,ensureSchema } from '@/lib/db';
export async function GET(){if(!await adminAuthenticated())return badAuth();const sql=db();if(!sql)return NextResponse.json({error:'DATABASE_URL não configurada.'},{status:503});
 try{await ensureSchema();const [totals,daily,events,leads]=await Promise.all([
  sql`SELECT COALESCE(SUM(total) FILTER(WHERE event='pageview'),0)::text AS pageviews, COALESCE(SUM(total) FILTER(WHERE event='contact_click'),0)::text AS contacts, COALESCE(SUM(total) FILTER(WHERE event='catalog_click'),0)::text AS catalog FROM metrics WHERE day >= CURRENT_DATE - 29`,
  sql`SELECT day::text,SUM(total)::text AS views FROM metrics WHERE event='pageview' AND day >= CURRENT_DATE - 29 GROUP BY day ORDER BY day`,
  sql`SELECT pathname,event,SUM(total)::text AS total FROM metrics WHERE day >= CURRENT_DATE - 29 GROUP BY pathname,event ORDER BY SUM(total) DESC LIMIT 12`,
  sql`SELECT COUNT(*)::text AS total FROM leads`]);
  return NextResponse.json({totals:totals[0],daily,events,leadCount:leads[0]?.total??'0'});
 }catch(e){console.error(e);return NextResponse.json({error:'Falha ao obter métricas'},{status:500});}}
