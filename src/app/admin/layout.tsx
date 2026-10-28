import '../globals.css';
import type {Metadata} from 'next';
export const metadata:Metadata={title:'A2P · Administração',robots:{index:false,follow:false}};
export default function AdminLayout({children}:{children:React.ReactNode}){return <html lang="pt-PT"><body>{children}</body></html>;}
