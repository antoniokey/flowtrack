import dynamic from 'next/dynamic';

const Dashboard = dynamic(() => import('dashboard/DashboardPage'), { ssr: false });

export default function DashboardPage() {
  return (
    <Dashboard />
  );
}
