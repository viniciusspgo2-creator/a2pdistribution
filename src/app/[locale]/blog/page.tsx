import Link from 'next/link';
import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {t,validLocale} from '@/lib/i18n';
import {posts} from '@/lib/posts';
export async function generateMetadata({params}:{params:Promise<{locale:string}>}):Promise<Metadata>{const {locale}=await params;if(!validLocale(locale))return {};const d=t(locale);return {title:d.blogAll,description:d.blogDesc,alternates:{canonical:`/${locale}/blog`}};}
export default async function Blog({params}:{params:Promise<{locale:string}>}){const {locale}=await params;if(!validLocale(locale))notFound();const d=t(locale),list=await posts();return <><section className="page-hero"><div className="container"><span className="eyebrow light"><span/>{d.blogEyebrow}</span><h1>{d.blogTitle}</h1><p>{d.blogDesc}</p></div></section><section className="all-articles"><div className="container articles-grid">{list.map(post=><Link className="article-card" key={post.slug} href={`/${locale}/blog/${post.slug}`}><div className="article-cover"><img src={post.cover} alt={post.translations[locale].title} loading="lazy"/><span>{post.category}</span></div><div className="article-body"><small>{post.date.split('-').reverse().join('.')}</small><h3>{post.translations[locale].title}</h3><p>{post.translations[locale].excerpt}</p><span className="article-more">{d.read} ↗</span></div></Link>)}</div></section></>}
