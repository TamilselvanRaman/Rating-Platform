import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, Store, Star, LogOut, User, Menu } from 'lucide-react';

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavLink = ({ to, icon: Icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
          isActive 
            ? 'bg-primary-800 text-white shadow-lg shadow-primary-900/20' 
            : 'text-primary-100 hover:bg-primary-800/50 hover:text-white'
        }`}
      >
        <Icon className={`h-4 w-4 ${isActive ? 'text-secondary-400' : 'text-primary-400 group-hover:text-secondary-400'}`} />
        {label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-72 bg-primary-900 text-white hidden md:flex flex-col border-r border-primary-800 z-30 shadow-xl">
        <div className="p-6 border-b border-primary-800">
          <div className="flex items-center gap-3 font-serif font-bold text-2xl tracking-tight text-white">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-secondary-400 to-secondary-600 flex items-center justify-center shadow-lg">
                <Star className="h-5 w-5 text-white fill-white" />
            </div>
            <span>RateIt</span>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          {user?.role === 'ADMIN' && (
            <>
              <div className="px-3 mt-4 mb-2 text-xs font-bold text-primary-400 uppercase tracking-wider">Administration</div>
              <NavLink to="/admin" icon={LayoutDashboard} label="Dashboard" />
              <NavLink to="/admin/users" icon={Users} label="User Management" />
              <NavLink to="/admin/stores" icon={Store} label="Store Management" />
            </>
          )}

          {user?.role === 'STORE_OWNER' && (
            <>
               <div className="px-3 mt-4 mb-2 text-xs font-bold text-primary-400 uppercase tracking-wider">Store Management</div>
               <NavLink to="/store-owner" icon={Store} label="My Store" />
            </>
          )}

          {user?.role === 'USER' && (
            <>
              <div className="px-3 mt-4 mb-2 text-xs font-bold text-primary-400 uppercase tracking-wider">Platform</div>
              <NavLink to="/dashboard" icon={LayoutDashboard} label="Browse Stores" />
              <NavLink to="/my-ratings" icon={Star} label="My Ratings" />
            </>
          )}
        </nav>

        <div className="p-4 border-t border-primary-800 bg-primary-950/30">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary-800/50 transition-colors">
            <div className="h-10 w-10 rounded-full bg-primary-700 border border-primary-600 flex items-center justify-center shrink-0">
              <span className="font-bold text-primary-100">{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-primary-400 truncate capitalize">{user?.role?.replace('_', ' ').toLowerCase()}</p>
            </div>
            <button 
                onClick={handleLogout}
                className="text-primary-400 hover:text-red-400 transition-colors p-1.5 rounded-md hover:bg-primary-800"
                title="Logout"
            >
                <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-72 flex flex-col min-h-screen">
        {/* Mobile Header (Placeholder for verify, can expand later) */}
        <header className="md:hidden h-16 bg-primary-900 text-white flex items-center px-4 justify-between sticky top-0 z-20">
             <div className="font-serif font-bold text-xl">RateIt</div>
             <button className="p-2"><Menu className="h-6 w-6" /></button>
        </header>

        <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
            <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
