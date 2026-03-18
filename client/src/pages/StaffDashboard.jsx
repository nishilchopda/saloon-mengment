import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, CheckCircle, XCircle, LogOut, Clock, User } from 'lucide-react';

const StaffDashboard = () => {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api/staff';
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${API_URL}/appointments`, { headers });
      setAppointments(res.data);
    } catch (err) {
      console.error('Error fetching appointments', err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`${API_URL}/appointments/${id}`, { status }, { headers });
      setAppointments(appointments.map(a => a.id === id ? { ...a, status } : a));
    } catch (err) {
      alert('Error updating status');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading Appointments...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Calendar className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold dark:text-white">MADHAV SALON</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium dark:text-gray-300">Staff: {user.name}</span>
          <button onClick={logout} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto p-8">
        <h2 className="text-2xl font-bold mb-8 dark:text-white">Your Today's Schedule</h2>
        
        <div className="space-y-4">
          {appointments.length === 0 ? (
            <div className="text-center p-12 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No appointments assigned to you yet.</p>
            </div>
          ) : (
            appointments.map(a => (
              <div key={a.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                    {a.customer_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold dark:text-white">{a.customer_name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{a.service_name}</p>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(a.booking_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    a.status === 'Confirmed' ? 'bg-green-100 text-green-600' :
                    a.status === 'Completed' ? 'bg-blue-100 text-blue-600' :
                    a.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {a.status}
                  </div>
                </div>

                <div className="flex space-x-2">
                  {a.status === 'Confirmed' && (
                    <button 
                      onClick={() => updateStatus(a.id, 'Completed')}
                      className="flex items-center space-x-1 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Complete</span>
                    </button>
                  )}
                  {a.status === 'Pending' && (
                    <button 
                      onClick={() => updateStatus(a.id, 'Confirmed')}
                      className="px-3 py-1 bg-primary text-white rounded-lg hover:bg-primary/90 text-sm transition-colors"
                    >
                      Confirm
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default StaffDashboard;
