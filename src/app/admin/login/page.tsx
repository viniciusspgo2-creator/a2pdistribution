import {redirect} from 'next/navigation';
import {adminAuthenticated} from '@/lib/auth';
import {AdminLogin} from '@/components/AdminLogin';
export default async function Login(){if(await adminAuthenticated())redirect('/admin/dashboard');return <AdminLogin/>;}
