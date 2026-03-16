import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import toast from 'react-hot-toast';
import { Users, Package, ShoppingCart, DollarSign, AlertCircle } from 'lucide-react';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  pendingOrders: number;
  lowStockProducts: number;
  totalRevenue: number;
  newUsersThisWeek: number;
  recentOrders: any[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await apiClient.get('/admin/stats');
      setStats(res.data);
    } catch (error) {
      toast.error('Failed to load dashboard statistics');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-gray-500 dark:text-gray-400">Loading dashboard...</div>;
  }

  if (!stats) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Revenue" value={`EGP ${stats.totalRevenue.toFixed(2)}`} icon={DollarSign} color="bg-green-100 text-green-600" />
        <StatCard title="Total Orders" value={stats.totalOrders} subtitle={`${stats.pendingOrders} pending`} icon={ShoppingCart} color="bg-blue-100 text-blue-600" />
        <StatCard title="Products" value={stats.totalProducts} subtitle={`${stats.lowStockProducts} low stock`} icon={Package} color="bg-purple-100 text-purple-600" />
        <StatCard title="Customers" value={stats.totalUsers} subtitle={`+${stats.newUsersThisWeek} this week`} icon={Users} color="bg-orange-100 text-orange-600" />
      </div>

      {stats.lowStockProducts > 0 && (
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mb-8 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-3" />
          <div>
            <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Inventory Warning</h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-400">
              You have {stats.lowStockProducts} products with less than 10 units in stock.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-hidden transition-colors">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Recent Orders</h2>
        </div>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {stats.recentOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500 dark:text-gray-400">#{order.id.slice(-8)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {order.user?.firstName} {order.user?.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">EGP {order.totalAmount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color }: any) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-100 dark:border-gray-700 transition-colors">
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${color.replace('bg-', 'bg-opacity-20 dark:bg-opacity-20 bg-')}`}>
          <Icon className={`h-6 w-6 ${color.split(' ')[1]}`} />
        </div>
        <div className="ml-5">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{title}</p>
          <div className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
          {subtitle && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
