import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users, Calendar, DollarSign, Store, Trash2, Edit2, LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api/admin';
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes, bookingsRes] = await Promise.all([
        axios.get(`${API_URL}/stats`, { headers }),
        axios.get(`${API_URL}/users`, { headers }),
        axios.get(`${API_URL}/bookings`, { headers })
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
      setBookings(bookingsRes.data);
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`${API_URL}/users/${id}`, { headers });
        setUsers(users.filter(u => u.id !== id));
      } catch (err) {
        alert('Error deleting user');
      }
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Admin Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col">
        <div className="flex items-center space-x-2 mb-10">
          <Store className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold dark:text-white">Admin Panel</span>
        </div>
        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center space-x-3 px-4 py-2 text-primary bg-primary/10 rounded-lg">
            <BarChart3 className="w-5 h-5" />
            <span>Overview</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <Users className="w-5 h-5" />
            <span>Users</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <Calendar className="w-5 h-5" />
            <span>Bookings</span>
          </button>
        </nav>
        <button
          onClick={logout}
          className="mt-auto flex items-center space-x-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {user.name}</h1>
          <div className="text-sm text-gray-500">{new Date().toDateString()}</div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard title="Total Users" value={stats?.users} icon={<Users className="w-6 h-6 text-blue-500" />} />
          <StatCard title="Active Salons" value={stats?.salons} icon={<Store className="w-6 h-6 text-green-500" />} />
          <StatCard title="Total Bookings" value={stats?.bookings} icon={<Calendar className="w-6 h-6 text-purple-500" />} />
          <StatCard title="Revenue" value={`$${stats?.revenue}`} icon={<DollarSign className="w-6 h-6 text-yellow-500" />} />
        </div>

        {/* User Management */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-10">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-bold dark:text-white">User Management</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <td className="px-6 py-4 font-medium dark:text-white">{u.name}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        u.role === 'Admin' ? 'bg-red-100 text-red-600' :
                        u.role === 'Salon Owner' ? 'bg-blue-100 text-blue-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 flex space-x-3">
                      <button className="p-1 text-blue-500 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => deleteUser(u.id)} className="p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold dark:text-white">Recent Bookings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Salon</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <td className="px-6 py-4 font-medium dark:text-white">{b.customer_name}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{b.salon_name}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{b.service_name}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(b.booking_date).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        b.status === 'Confirmed' ? 'bg-green-100 text-green-600' :
                        b.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold dark:text-white">{value}</h3>
    </div>
    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">{icon}</div>
  </div>
);

const BarChart3 = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>
);

export default AdminDashboard;
