import { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UploadCloud, Plus, Search, Trash2, Edit } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // Reusing the standard GET /products endpoint, which lists all products
      const res = await apiClient.get('/products');
      setProducts(res.data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    try {
      await apiClient.delete(`/products/${id}`);
      toast.success('Product deleted');
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
        <div className="mt-4 sm:mt-0 sm:flex space-x-3">
          <Link
            to="/products/bulk-sync"
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-red-500 transition-colors"
          >
            <UploadCloud className="mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            Bulk Sync (CSV)
          </Link>
          <button
            onClick={() => toast('New Product Form Coming Soon!')}
            style={{ backgroundColor: 'var(--color-brand)' }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-red-500 transition-all"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
          <div className="relative rounded-md shadow-sm max-w-sm w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 sm:text-sm rounded-md py-2 px-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-colors"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading products...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{p.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{p.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{p.category?.name || p.categoryId}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">EGP {p.retailPrice.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${p.stockQuantity > 10 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                        {p.stockQuantity}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => toast('Edit Form Coming Soon')} className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 mr-4 transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id, p.name)} className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No products found.</td>
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
