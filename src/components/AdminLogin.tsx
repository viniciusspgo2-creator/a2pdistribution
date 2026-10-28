'use client';
import {useState,type FormEvent} from 'react';
import {useRouter} from 'next/navigation';
import {LockKeyhole} from 'lucide-react';
export function AdminLogin(){const router=useRouter();const [error,setError]=useState('');const [loading,setLoading]=useState(false);
 async function login(e:FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);setError('');const form=e.currentTarget;const data=Object.fromEntries(new FormData(form).entries());
 try{const response=await fetch('/api/admin/login',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(data)});const json=await response.json();if(!response.ok)throw new Error(json.error);router.push('/admin/dashboard');router.refresh();}
 catch(err){setError(err instanceof Error?err.message:'Falha de autenticação');}finally{setLoading(false);}}
 return <div className="admin-wrap" style={{padding:20}}><form className="admin-login" onSubmit={login}><img src="/assets/logo-header.png" alt="A2P"/><h1>Gestão A2P</h1><p>Área reservada à administração do website.</p><label>Email administrativo<input type="email" name="email" autoComplete="username" required/></label><label>Palavra-passe<input type="password" name="password" autoComplete="current-password" required/></label><button disabled={loading} className="btn btn-orange" type="submit"><LockKeyhole size={17}/>{loading?'A validar...':'Entrar no painel'}</button>{error&&<p role="alert" className="admin-error">{error}</p>}</form></div>;
}
