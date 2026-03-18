import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Store, Scissors, Users, Calendar, Plus, Edit2, Trash2, Check, X, LogOut } from 'lucide-react';

const OwnerDashboard = () => {
  const { user, logout } = useAuth();
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api/salons';
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [salonRes, servicesRes, staffRes, bookingsRes] = await Promise.all([
        axios.get(`${API_URL}/my-salon`, { headers }),
        axios.get(`${API_URL}/services`, { headers }),
        axios.get(`${API_URL}/staff`, { headers }),
        axios.get(`${API_URL}/bookings`, { headers })
      ]);
      setSalon(salonRes.data);
      setServices(servicesRes.data);
      setStaff(staffRes.data);
      setBookings(bookingsRes.data);
    } catch (err) {
      console.error('Error fetching salon data', err);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/bookings/${id}`, { status }, { headers });
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    } catch (err) {
      alert('Error updating status');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Owner Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-6 flex flex-col">
        <div className="flex items-center space-x-2 mb-10">
          <Scissors className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold dark:text-white">MADHAV SALON</span>
        </div>
        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center space-x-3 px-4 py-2 text-primary bg-primary/10 rounded-lg">
            <Store className="w-5 h-5" />
            <span>Salon Info</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <Scissors className="w-5 h-5" />
            <span>Services</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <Users className="w-5 h-5" />
            <span>Staff</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <Calendar className="w-5 h-5" />
            <span>Appointments</span>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {salon ? salon.name : 'Setup Your Salon'}
          </h1>
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Add Service</span>
            </button>
          </div>
        </header>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard title="Total Services" value={services.length} icon={<Scissors className="w-6 h-6 text-blue-500" />} />
          <StatCard title="Staff Members" value={staff.length} icon={<Users className="w-6 h-6 text-green-500" />} />
          <StatCard title="Active Bookings" value={bookings.filter(b => b.status === 'Confirmed').length} icon={<Calendar className="w-6 h-6 text-purple-500" />} />
        </div>

        {/* Recent Bookings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-bold dark:text-white">Recent Appointments</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Staff</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <td className="px-6 py-4 font-medium dark:text-white">{b.customer_name}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{b.service_name}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{b.staff_name || 'Unassigned'}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(b.booking_date).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        b.status === 'Confirmed' ? 'bg-green-100 text-green-600' :
                        b.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                        b.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 flex space-x-2">
                      {b.status === 'Pending' && (
                        <>
                          <button onClick={() => updateBookingStatus(b.id, 'Confirmed')} className="p-1 text-green-500 hover:bg-green-50 rounded"><Check className="w-4 h-4" /></button>
                          <button onClick={() => updateBookingStatus(b.id, 'Cancelled')} className="p-1 text-red-500 hover:bg-red-50 rounded"><X className="w-4 h-4" /></button>
                        </>
                      )}
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

export default OwnerDashboard;
