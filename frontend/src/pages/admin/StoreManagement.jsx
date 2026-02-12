import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Table from '../../components/Table';
import { Plus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';

const StoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchStores = async () => {
    try {
      setLoading(true);
      const response = await api.get('/stores');
      setStores(response.data.data.stores);
    } catch (error) {
      console.error("Failed to fetch stores", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const onSubmit = async (data) => {
    try {
      await api.post('/stores', data);
      setIsModalOpen(false);
      reset();
      fetchStores();
    } catch (error) {
      console.error("Failed to create store", error);
      alert(error.response?.data?.message || "Failed to create store");
    }
  };

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Address", accessorKey: "address" },
    { header: "Owner", render: (row) => row.owner?.name || 'N/A' },
    { header: "Avg Rating", render: (row) => row.averageRating?.toFixed(1) || '0.0' },
  ];

  if (loading) return <div>Loading stores...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 font-serif">Store Management</h1>
           <p className="text-slate-500 mt-1">Create and manage store profiles.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary px-4 py-2.5 rounded-lg flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Store
        </button>
      </div>

      <Table 
        data={stores} 
        columns={columns} 
        filterField="name" 
        searchPlaceholder="Search stores..." 
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Create New Store</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="h-5 w-5 text-slate-500" /></button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Store Name</label>
                <input {...register('name', { required: true })} className="input mt-1" placeholder="Store Name" />
              </div>
              <div>
                <label className="text-sm font-medium">Email (Optional)</label>
                <input {...register('email')} type="email" className="input mt-1" placeholder="Store Email" />
              </div>
              <div>
                <label className="text-sm font-medium">Address</label>
                <textarea {...register('address')} className="input mt-1 min-h-[60px]" placeholder="Address" />
              </div>
              <div>
                <label className="text-sm font-medium">Owner ID (UUID)</label>
                <input 
                    {...register('ownerId', { required: true })} 
                    className="input mt-1" 
                    placeholder="User ID of Store Owner" 
                />
                <p className="text-xs text-slate-500 mt-1">Copy User ID from User Management</p>
              </div>
              <button type="submit" className="btn-primary w-full py-2 text-white">Create Store</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreManagement;
