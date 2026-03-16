import { BrowserRouter, Routes, Route, Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { Package, ShoppingCart, LayoutDashboard, LogOut, Sun, Moon } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

// ─── Dummy / Placeholder Pages (to be implemented) ────────────────────────────
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import BulkSync from './pages/BulkSync';
import Orders from './pages/Orders';
import { useTheme } from './providers/ThemeProvider';

// ─── Auth Guard ───────────────────────────────────────────────────────────────
function ProtectedRoute() {
  const token = localStorage.getItem('adminToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

// ─── Layout ───────────────────────────────────────────────────────────────────
function AdminLayout() {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/login';
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Orders', path: '/orders', icon: ShoppingCart },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-brand)' }}>Center El Sayad</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <ThemeToggleButton />
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto text-gray-900 dark:text-white transition-colors">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

// ─── Theme Toggle Button ──────────────────────────────────────────────────────
function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white transition-colors"
    >
      {theme === 'light' ? (
        <>
          <Moon className="mr-3 h-5 w-5" />
          Dark Mode
        </>
      ) : (
        <>
          <Sun className="mr-3 h-5 w-5" />
          Light Mode
        </>
      )}
    </button>
  );
}

// ─── App Component ────────────────────────────────────────────────────────────
function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/bulk-sync" element={<BulkSync />} />
            <Route path="/orders" element={<Orders />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
