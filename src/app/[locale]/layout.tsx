import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { locales,validLocale,hreflang,t } from '@/lib/i18n';
import { settings } from '@/lib/db';
import '../globals.css';
import { SiteFrame } from '@/components/SiteFrame';
export const dynamic='force-dynamic';
const base=()=>process.env.SITE_URL?.replace(/\/$/,'')||'https://a2pdistribution.com';
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{const {locale}=await params;if(!validLocale(locale))return {};
 const data=await settings();const dict=t(locale);const title=data.seoTitle||`A2P Food Distribution | ${dict.heroLine1} ${dict.heroLine2}`;
 const description=data.seoDescription||dict.heroDescription;
 return {metadataBase:new URL(base()),title:{default:title,template:'%s | A2P Food Distribution'},description,alternates:{canonical:`/${locale}`,languages:Object.fromEntries([...locales.map(l=>[hreflang[l],`/${l}`]),['x-default','/pt']])},openGraph:{type:'website',locale:hreflang[locale],siteName:'A2P Food Distribution',title,description,url:`${base()}/${locale}`,images:[{url:'/assets/hero.webp',width:1672,height:941}]},twitter:{card:'summary_large_image'},robots:{index:true,follow:true},verification:data.googleVerification?{google:data.googleVerification}:undefined}; }
export default async function LocaleLayout({children,params}:{children:React.ReactNode;params:Promise<{locale:string}>}){
 const {locale}=await params;if(!validLocale(locale))notFound(); const config=await settings();
 const organization={'@context':'https://schema.org','@type':'Organization',name:'A2P Food Distribution',url:base(),logo:base()+'/assets/logo-header.png',description:'Importação e distribuição de produtos alimentares portugueses para profissionais na Suíça.',telephone:'+41 76 208 12 20',address:{'@type':'PostalAddress',streetAddress:'Route de Lausanne 4',postalCode:'1432',addressLocality:'Gressy',addressCountry:'CH'},sameAs:['https://www.instagram.com/a2pfooddistribution/','https://www.facebook.com/a2pfooddistribution']};
 return <html lang={hreflang[locale]}><body><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(organization).replace(/</g,'\\u003c')}}/><SiteFrame locale={locale} config={config}>{children}</SiteFrame></body></html>;
}
