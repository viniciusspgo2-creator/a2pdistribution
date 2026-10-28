import type {MetadataRoute} from 'next';
export default function robots():MetadataRoute.Robots{const host=process.env.SITE_URL?.replace(/\/$/,'')||'https://a2pdistribution.com';return {rules:{userAgent:'*',allow:'/',disallow:['/admin','/api/']},sitemap:`${host}/sitemap.xml`};}
