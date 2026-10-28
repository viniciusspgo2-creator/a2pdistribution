import { settings } from '@/lib/db';
import { posts } from '@/lib/posts';
import { t,validLocale } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import { Home } from '@/components/Home';
export default async function Page({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(!validLocale(locale))notFound(); const [config,articleList]=await Promise.all([settings(),posts()]);
 const faq=t(locale).faq.map(([question,answer])=>({'@type':'Question',name:question,acceptedAnswer:{'@type':'Answer',text:answer}}));
 return <><script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'FAQPage',mainEntity:faq}).replace(/</g,'\\u003c')}}/><Home locale={locale} config={config} posts={articleList.slice(0,3)}/></>;
}
