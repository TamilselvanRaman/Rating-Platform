import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Star, MapPin, Store, Calendar, MessageSquare } from 'lucide-react';

const StoreOwnerDashboard = () => {
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyStore = async () => {
      try {
        const res = await api.get('/stores/my/store'); 
        setStore(res.data.data);
      } catch (err) {
        console.error("Failed to fetch my store", err);
        setError('Could not load store details. Please ensure you have a store assigned.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyStore();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>
  );

  if (error || !store) return (
    <div className="p-12 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <Store className="h-12 w-12 mx-auto text-slate-300 mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-2">No Store Found</h3>
        <p className="text-slate-500">{error || "You don't have a store assigned yet."}</p>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <Store className="h-64 w-64 text-primary-900" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-8">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-xs font-bold uppercase tracking-wide">
                        My Store
                    </span>
                </div>
                <h1 className="text-4xl font-bold text-slate-900 font-serif mb-4">{store.name}</h1>
                
                {store.address && (
                    <div className="flex items-center gap-2 text-slate-500 mb-6">
                        <MapPin className="h-5 w-5" />
                        <span className="text-lg">{store.address}</span>
                    </div>
                )}
                
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-secondary-50 rounded-lg">
                            <Star className="h-6 w-6 text-secondary-500 fill-secondary-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 leading-none">
                                {store.averageRating?.toFixed(1) || '0.0'}
                            </p>
                            <p className="text-sm font-medium text-slate-500 mt-1">Average Rating</p>
                        </div>
                    </div>
                    
                    <div className="w-px h-12 bg-slate-100"></div>
                    
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-blue-50 rounded-lg">
                            <MessageSquare className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-900 leading-none">
                                {store.ratings?.length || 0}
                            </p>
                            <p className="text-sm font-medium text-slate-500 mt-1">Total Reviews</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 font-serif mb-6 flex items-center gap-2">
            Recent Reviews
            <span className="text-sm font-sans font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                {store.ratings?.length || 0}
            </span>
        </h2>
        
        <div className="grid grid-cols-1 gap-4">
            {store.ratings?.length > 0 ? (
                store.ratings.slice().reverse().map(review => (
                    <div key={review.id} className="card p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                        <div className="flex-shrink-0 flex md:flex-col items-center md:items-start gap-2 min-w-[120px]">
                            <div className="flex items-center gap-1 text-secondary-500 font-bold text-lg">
                                {review.rating} <Star className="h-4 w-4 fill-current" />
                            </div>
                            <span className="text-sm text-slate-400">
                                {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-bold text-slate-900">{review.user?.name || 'Anonymous User'}</span>
                                {review.user?.email && (
                                    <span className="text-sm text-slate-400">({review.user.email})</span>
                                )}
                            </div>
                            <p className="text-slate-600 leading-relaxed italic">
                                "Verified customer rating submitted on our platform."
                            </p>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-100">
                    <MessageSquare className="h-12 w-12 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-500">No reviews received yet.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
