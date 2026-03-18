import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, Scissors, Store, CheckCircle, XCircle, LogOut, Search } from 'lucide-react';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const [salons, setSalons] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedSalon, setSelectedSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [bookingForm, setBookingForm] = useState({
    serviceId: '',
    staffId: '',
    date: '',
    time: ''
  });
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:5000/api/bookings';
  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [salonsRes, bookingsRes] = await Promise.all([
        axios.get(`${API_URL}/salons`),
        axios.get(`${API_URL}/my-bookings`, { headers })
      ]);
      setSalons(salonsRes.data);
      setBookings(bookingsRes.data);
    } catch (err) {
      console.error('Error fetching data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSalonSelect = async (salon) => {
    setSelectedSalon(salon);
    try {
      const [servicesRes, staffRes] = await Promise.all([
        axios.get(`${API_URL}/salons/${salon.id}/services`),
        axios.get(`${API_URL}/salons/${salon.id}/staff`)
      ]);
      setServices(servicesRes.data);
      setStaff(staffRes.data);
    } catch (err) {
      console.error('Error fetching salon details', err);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    try {
      const bookingDate = new Date(`${bookingForm.date}T${bookingForm.time}`);
      await axios.post(API_URL, {
        salonId: selectedSalon.id,
        serviceId: bookingForm.serviceId,
        staffId: bookingForm.staffId,
        bookingDate
      }, { headers });
      alert('Booking successful!');
      setBookingForm({ serviceId: '', staffId: '', date: '', time: '' });
      setSelectedSalon(null);
      fetchData();
    } catch (err) {
      alert('Error creating booking');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Scissors className="w-6 h-6 text-primary" />
          <span className="text-xl font-bold dark:text-white">MADHAV SALON</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium dark:text-gray-300">Hello, {user.name}</span>
          <button onClick={logout} className="p-2 text-gray-500 hover:text-red-500 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Section */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-6 dark:text-white">Book an Appointment</h2>
              {!selectedSalon ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {salons.map(salon => (
                    <div
                      key={salon.id}
                      onClick={() => handleSalonSelect(salon)}
                      className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary cursor-pointer transition-all shadow-sm"
                    >
                      <Store className="w-8 h-8 text-primary mb-4" />
                      <h3 className="text-lg font-bold dark:text-white">{salon.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{salon.location}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold dark:text-white">Booking at {selectedSalon.name}</h3>
                    <button onClick={() => setSelectedSalon(null)} className="text-sm text-primary hover:underline">Change Salon</button>
                  </div>
                  <form onSubmit={handleBooking} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Service</label>
                      <select
                        required
                        value={bookingForm.serviceId}
                        onChange={e => setBookingForm({...bookingForm, serviceId: e.target.value})}
                        className="w-full mt-1 px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="">Select a service</option>
                        {services.map(s => <option key={s.id} value={s.id}>{s.name} - ${s.price}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Staff (Optional)</label>
                      <select
                        value={bookingForm.staffId}
                        onChange={e => setBookingForm({...bookingForm, staffId: e.target.value})}
                        className="w-full mt-1 px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      >
                        <option value="">Any Staff</option>
                        {staff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                        <input
                          type="date"
                          required
                          value={bookingForm.date}
                          onChange={e => setBookingForm({...bookingForm, date: e.target.value})}
                          className="w-full mt-1 px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
                        <input
                          type="time"
                          required
                          value={bookingForm.time}
                          onChange={e => setBookingForm({...bookingForm, time: e.target.value})}
                          className="w-full mt-1 px-4 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                      </div>
                    </div>
                    <button type="submit" className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary/90 transition-colors">Confirm Booking</button>
                  </form>
                </div>
              )}
            </section>
          </div>

          {/* Booking History */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold dark:text-white">Your History</h2>
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <p className="text-gray-500 italic">No bookings yet.</p>
              ) : (
                bookings.map(b => (
                  <div key={b.id} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold dark:text-white">{b.service_name}</h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        b.status === 'Confirmed' ? 'bg-green-100 text-green-600' :
                        b.status === 'Pending' ? 'bg-yellow-100 text-yellow-600' :
                        b.status === 'Cancelled' ? 'bg-red-100 text-red-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-2"><Store className="w-3 h-3" /> <span>{b.salon_name}</span></div>
                      <div className="flex items-center space-x-2"><Calendar className="w-3 h-3" /> <span>{new Date(b.booking_date).toLocaleDateString()}</span></div>
                      <div className="flex items-center space-x-2"><Clock className="w-3 h-3" /> <span>{new Date(b.booking_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;
