import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../api/apiClient';
import toast from 'react-hot-toast';
import { Package } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use standard auth controller endpoint (same one the mobile app uses)
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      const { token, user } = res.data;

      // Ensure the user is actually an ADMIN
      if (user.userType !== 'ADMIN') {
        toast.error('Unauthorized: Admin access required');
        return;
      }

      localStorage.setItem('adminToken', token);
      toast.success('Login successful');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to login. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center flex-col items-center">
          <div className="bg-red-100 dark:bg-red-900/40 p-3 rounded-full">
            <Package className="h-8 w-8" style={{ color: 'var(--color-brand)' }} />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Center ElSayad Admin
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Sign in to access the control panel
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 transition-colors">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
              <div className="mt-1">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="mt-1">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                style={{ backgroundColor: 'var(--color-brand)' }}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:brightness-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-red-500 disabled:opacity-50 transition-all"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
