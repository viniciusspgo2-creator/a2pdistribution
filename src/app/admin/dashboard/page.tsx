import {redirect} from 'next/navigation';
import {adminAuthenticated} from '@/lib/auth';
import {AdminDashboard} from '@/components/AdminDashboard';
export const dynamic='force-dynamic';
export default async function Dashboard(){if(!await adminAuthenticated())redirect('/admin/login');return <AdminDashboard/>;}
