import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import StarRating from '../../components/StarRating';
import { Search, MapPin, Store } from 'lucide-react';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [myRatings, setMyRatings] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const [storesRes, ratingsRes] = await Promise.all([
        api.get('/stores'),
        api.get('/ratings/my')
      ]);
      
      setStores(storesRes.data.data.stores);
      
      const ratingsMap = {};
      ratingsRes.data.data.ratings.forEach(r => {
        ratingsMap[r.storeId] = r.rating;
      });
      setMyRatings(ratingsMap);

    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRating = async (storeId, rating) => {
    try {
        setMyRatings(prev => ({ ...prev, [storeId]: rating }));
        await api.post('/ratings', { storeId, rating });
        const storesRes = await api.get('/stores');
        setStores(storesRes.data.data.stores);
    } catch (error) {
        console.error("Failed to submit rating", error);
        alert(error.response?.data?.message || "Rating failed");
    }
  };

  const filteredStores = stores.filter(store => 
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (store.address && store.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 font-serif">Browse Stores</h1>
            <p className="text-slate-500 mt-2">Discover and rate local businesses.</p>
        </div>
        <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
            <input 
                type="text" 
                placeholder="Search stores..." 
                className="pl-10 input h-12 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStores.map(store => (
                <div key={store.id} className="card group hover:-translate-y-1 transition-all duration-300">
                    <div className="h-32 bg-gradient-to-br from-primary-50 to-slate-100 relative overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 group-hover:opacity-20 transition-opacity">
                            <Store className="h-16 w-16 text-primary-900" />
                        </div>
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-sm font-bold text-secondary-600 shadow-sm border border-secondary-100 flex items-center gap-1">
                             {store.averageRating?.toFixed(1) || '0.0'} <span className="text-xs">★</span>
                        </div>
                    </div>
                    
                    <div className="p-6">
                        <h3 className="text-xl font-bold text-slate-900 font-serif mb-1 group-hover:text-primary-700 transition-colors">{store.name}</h3>
                        {store.address && (
                            <div className="flex items-start gap-2 text-sm text-slate-500 mb-6">
                                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                                <span>{store.address}</span>
                            </div>
                        )}
                        
                        <div className="border-t border-slate-100 pt-4">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Rating</span>
                                <StarRating 
                                    rating={myRatings[store.id] || 0} 
                                    onChange={(val) => handleRating(store.id, val)} 
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            
            {filteredStores.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                    <Store className="h-12 w-12 mx-auto mb-3 opacity-20" />
                    <p>No stores found matching your search.</p>
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
