import type {MetadataRoute} from 'next';
import {locales,hreflang} from '@/lib/i18n';
import {posts} from '@/lib/posts';
export const dynamic='force-dynamic';
export default async function sitemap():Promise<MetadataRoute.Sitemap>{const host=process.env.SITE_URL?.replace(/\/$/,'')||'https://a2pdistribution.com';const articleList=await posts();
 const paths=['','/blog','/privacidade',...articleList.map(x=>`/blog/${x.slug}`)];
 return paths.flatMap(path=>locales.map(lang=>({url:`${host}/${lang}${path}`,lastModified:new Date(articleList.find(p=>`/blog/${p.slug}`===path)?.date||'2026-10-28'),changeFrequency:(path.includes('/blog/')?'monthly':'weekly') as const,priority:path===''?1:path==='/blog'?.8:.55,alternates:{languages:Object.fromEntries(locales.map(l=>[hreflang[l],`${host}/${l}${path}`]))}}))); 
}
