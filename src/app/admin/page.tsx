import {redirect} from 'next/navigation';
import {adminAuthenticated} from '@/lib/auth';
export default async function Admin(){redirect((await adminAuthenticated())?'/admin/dashboard':'/admin/login');}
