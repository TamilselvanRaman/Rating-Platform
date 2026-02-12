import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import Table from '../../components/Table';
import { Plus, X } from 'lucide-react';
import { useForm } from 'react-hook-form';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users'); // Ensure backend route is /api/users
      setUsers(response.data.data.users);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onSubmit = async (data) => {
    try {
      await api.post('/users', data);
      setIsModalOpen(false);
      reset();
      fetchUsers();
    } catch (error) {
      console.error("Failed to create user", error);
      alert(error.response?.data?.message || "Failed to create user");
    }
  };

  const columns = [
    { header: "Name", accessorKey: "name" },
    { header: "Email", accessorKey: "email" },
    { header: "Role", accessorKey: "role", render: (row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            row.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
            row.role === 'STORE_OWNER' ? 'bg-blue-100 text-blue-700' :
            'bg-slate-100 text-slate-600'
        }`}>
            {row.role.replace('_', ' ')}
        </span>
    )},
    { header: "Stores", render: (row) => row._count?.stores || 0 },
  ];

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-900 font-serif">User Management</h1>
           <p className="text-slate-500 mt-1">Manage system access and user roles.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary px-4 py-2.5 rounded-lg flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      <Table 
        data={users} 
        columns={columns} 
        filterField="name" 
        searchPlaceholder="Search users..." 
      />

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Create New User</h2>
              <button onClick={() => setIsModalOpen(false)}><X className="h-5 w-5 text-slate-500" /></button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Name</label>
                <input {...register('name', { required: true, minLength: 20 })} className="input mt-1" placeholder="Full Name" />
                {errors.name && <span className="text-red-500 text-xs">Min 20 chars required</span>}
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <input {...register('email', { required: true })} type="email" className="input mt-1" placeholder="Email" />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <input {...register('password', { 
                    required: true, 
                    pattern: /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).*$/ 
                })} type="password" className="input mt-1" placeholder="Password" />
                {errors.password && <span className="text-red-500 text-xs">UpperCase + Special Char required</span>}
              </div>
              <div>
                <label className="text-sm font-medium">Role</label>
                <select {...register('role')} className="input mt-1">
                  <option value="USER">User</option>
                  <option value="STORE_OWNER">Store Owner</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <button type="submit" className="btn-primary w-full py-2 text-white">Create User</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
