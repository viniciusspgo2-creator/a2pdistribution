'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowUpRight,ChevronDown,Menu,X,Phone,MapPin,Mail,Instagram,Facebook,ArrowUp,Truck } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { locales,localeLabels,t,type Locale } from '@/lib/i18n';
import type { Settings } from '@/lib/db';

export function track(event:'pageview'|'contact_click'|'catalog_click'|'social_click',path?:string){if(typeof window==='undefined')return;void fetch('/api/track',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({event,path:path??window.location.pathname}),keepalive:true}).catch(()=>{});}
export function SiteFrame({locale,config,children}:{locale:Locale;config:Settings;children:React.ReactNode}){
 const d={...t(locale),...(config.locales?.[locale]??{})};const [menu,setMenu]=useState(false);const [cookie,setCookie]=useState(false);const pathname=usePathname();
 useEffect(()=>{track('pageview',pathname);setCookie(sessionStorage.getItem('a2p_notice')!=='ok');},[pathname]);
 const navRoutes=[`/${locale}`,`/${locale}/#empresa`,`/${locale}/#produtos`,`/${locale}/#setores`,`/${locale}/blog`,`/${locale}/#contactos`];
 const changed=(lang:Locale)=>pathname.replace(/^\/(pt|es|de|fr|en)(?=\/|$)/,`/${lang}`);
 return <>
 <div className="topline"><div className="container topinner"><span><MapPin size={12}/> Route de Lausanne 4, 1432 Gressy · Suisse</span><div><a href="tel:+41762081220"><Phone size={12}/> +41 76 208 12 20</a><a href="mailto:contact@a2pdistribution.com"><Mail size={12}/> contact@a2pdistribution.com</a></div></div></div>
 <header className="header"><div className="container header-inner"><Link className="brand" href={`/${locale}`} aria-label="A2P Food Distribution — home"><img src="/assets/logo-header.png" width="211" height="76" alt="A2P Food Distribution"/></Link>
 <nav className={'navlinks '+(menu?'nav-open':'')} aria-label="Principal">{d.navigation.map((name,i)=><Link onClick={()=>setMenu(false)} key={name} href={navRoutes[i]} className={i===0&&pathname===`/${locale}`?'is-current':''}>{name}</Link>)}<div className="mobile-actions"><a className="btn btn-orange" href={`/${locale}/#contactos`}>{d.contact} <ArrowUpRight size={17}/></a></div></nav>
 <div className="header-actions"><div className="language"><span className="language-current">{locale.toUpperCase()} <ChevronDown size={13}/></span><div className="language-items">{locales.map(l=><Link key={l} href={changed(l)||`/${l}`}>{localeLabels[l]} <span>{({pt:'Português',es:'Español',de:'Deutsch',fr:'Français',en:'English'})[l]}</span></Link>)}</div></div><Link className="btn btn-orange small desktop-only" href={`/${locale}/#contactos`}>{d.contact} <ArrowUpRight size={16}/></Link><button onClick={()=>setMenu(!menu)} className="menu-button" aria-label={menu?'Fechar menu':'Abrir menu'}>{menu?<X/>:<Menu/>}</button></div>
 </div></header><main id="main-content">{children}</main>
 <footer className="footer"><div className="container"><div className="footer-grid"><div className="footer-main"><img src="/assets/logo-footer.png" alt="A2P Food Distribution" width="205" height="72"/><p>{d.hello}</p><div className="socials"><a onClick={()=>track('social_click')} aria-label="Instagram" href="https://www.instagram.com/a2pfooddistribution/" target="_blank" rel="noopener noreferrer"><Instagram size={19}/></a><a onClick={()=>track('social_click')} aria-label="Facebook" href="https://www.facebook.com/a2pfooddistribution" target="_blank" rel="noopener noreferrer"><Facebook size={19}/></a></div></div><div><h4>{d.quick}</h4>{d.navigation.map((n,i)=><Link key={n} href={navRoutes[i]}>{n}</Link>)}</div><div><h4>{d.address}</h4><p>Route de Lausanne, 4<br/>1432 Gressy (VD)<br/>Suisse</p><a href="https://www.google.com/maps/search/?api=1&query=Route+de+Lausanne+4+1432+Gressy" target="_blank" rel="noopener noreferrer">Google Maps <ArrowUpRight size={13}/></a></div><div><h4>{d.phones}</h4><a href="tel:+41787580023">+41 78 758 00 23</a><a href="tel:+41762081220">+41 76 208 12 20</a><a href="mailto:contact@a2pdistribution.com">contact@a2pdistribution.com</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} A2P Food Distribution. {d.rights}</span><div><Link href={`/${locale}/privacidade`}>{d.privacy}</Link><Link href="/admin/login">Admin</Link></div></div></div></footer>
 <a className="floating-contact" href={`/${locale}/#contactos`} onClick={()=>track('contact_click')} aria-label={d.contact}><Phone size={23}/></a>
 <button className="back-top" aria-label="Voltar ao topo" onClick={()=>window.scrollTo({top:0,behavior:'smooth'})}><ArrowUp size={17}/></button>
 {cookie&&<div className="privacy-banner"><span>{d.cookie} <Link href={`/${locale}/privacidade`}>{d.learnMore}</Link></span><button onClick={()=>{sessionStorage.setItem('a2p_notice','ok');setCookie(false);}}>{d.cookieOk}</button></div>}
 </>;
}
