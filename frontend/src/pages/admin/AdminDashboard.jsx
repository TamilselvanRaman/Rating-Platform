import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Users, Store, Star, Award } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setStats(response.data.data);
      } catch (err) {
        setError('Failed to load dashboard stats.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="card p-6 flex items-center gap-5 hover:shadow-lg transition-shadow duration-200">
      <div className={`p-4 rounded-xl ${color} bg-opacity-10`}>
        <Icon className={`h-8 w-8 ${color.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-serif">Dashboard Overview</h1>
        <p className="text-slate-500 mt-2">Welcome back to the administration panel.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value={stats.totalUsers} 
          icon={Users} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Total Stores" 
          value={stats.totalStores} 
          icon={Store} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Total Ratings" 
          value={stats.totalRatings} 
          icon={Star} 
          color="bg-amber-500" 
        />
        <StatCard 
          title="Avg. Rating" 
          value={(stats.totalRatings / Math.max(stats.totalStores, 1)).toFixed(1)} 
          icon={Award} 
          color="bg-purple-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="card p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-6 font-serif">User Distribution</h2>
          <div className="space-y-5">
            {Object.entries(stats.userRoleDistribution).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between group">
                <span className="text-sm font-medium text-slate-600 uppercase tracking-wide group-hover:text-primary-700 transition-colors">
                    {role.replace('_', ' ')}
                </span>
                <div className="flex items-center gap-4 flex-1 justify-end">
                    <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary-600 rounded-full" 
                            style={{ width: `${(count / stats.totalUsers) * 100}%` }}
                        />
                    </div>
                    <span className="text-sm font-bold text-slate-900 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Placeholder for Activity or other stats */}
        <div className="card p-6 flex flex-col justify-center items-center text-slate-400 bg-slate-50/50 border-dashed">
             <p className="font-semibold">Activity Analytics</p>
             <p className="text-sm">Coming Soon</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
