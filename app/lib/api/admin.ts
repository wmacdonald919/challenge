import type { AdminDashboard } from '@/app/lib/types/admin';

export interface AdminApi {
  getDashboard(): Promise<AdminDashboard>;
}
