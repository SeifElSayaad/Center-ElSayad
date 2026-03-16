import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import toast from 'react-hot-toast';
import { Eye, Clock, Package, CheckCircle, Truck } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get('/admin/orders', {
        params: { status: statusFilter || undefined }
      });
      setOrders(res.data.orders);
    } catch (error) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await apiClient.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'PROCESSING': return <Package className="h-4 w-4 text-blue-600" />;
      case 'SHIPPED': return <Truck className="h-4 w-4 text-purple-600" />;
      case 'DELIVERED': return <CheckCircle className="h-4 w-4 text-green-600" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-900/50';
      case 'PROCESSING': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900/50';
      case 'SHIPPED': return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-900/50';
      case 'DELIVERED': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-900/50';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Orders Management</h1>
        <div className="mt-4 sm:mt-0">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md border bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading orders...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      #{order.id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{order.user?.firstName} {order.user?.lastName}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{order.user?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        <span className="mr-1">{getStatusIcon(order.status)}</span>
                        {order.status}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      EGP {order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="text-sm border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:border-red-500 focus:ring-red-500 border p-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                      <button className="ml-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
                        <Eye className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
