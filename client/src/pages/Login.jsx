import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scissors } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  bookingId: z.string().optional(),
}).refine(data => (data.email && data.password) || data.bookingId, {
  message: "Either email/password or Booking ID is required",
  path: ["email"]
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState('');
  const [isBookingLogin, setIsBookingLogin] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await login(data.email, data.password, data.bookingId);
      const role = res.user.role;
      if (role === 'super_admin') navigate('/admin');
      else if (role === 'salon_owner') navigate('/owner');
      else if (role === 'staff') navigate('/staff');
      else navigate('/customer');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black relative overflow-hidden">
      {/* Abstract luxury backgrounds */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -ml-48 -mb-48"></div>

      <div className="w-full max-w-md p-8 space-y-8 glass rounded-2xl border border-primary/20 shadow-2xl relative z-10">
        <div className="text-center">
          <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4 neon-gold">
            <Scissors className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight">MADHAV <span className="text-primary">SALON</span></h2>
          <p className="mt-2 text-gray-400">Premium Management Suite</p>
        </div>

        <div className="flex p-1 bg-white/5 rounded-lg mb-6">
          <button 
            onClick={() => setIsBookingLogin(false)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isBookingLogin ? 'bg-primary text-black' : 'text-gray-400'}`}
          >
            Staff / Owner
          </button>
          <button 
            onClick={() => setIsBookingLogin(true)}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isBookingLogin ? 'bg-primary text-black' : 'text-gray-400'}`}
          >
            Customer ID
          </button>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg text-center">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {!isBookingLogin ? (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-white transition-all"
                  placeholder="name@example.com"
                />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                <input
                  {...register('password')}
                  type="password"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-white transition-all"
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
              </div>
            </>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Booking ID / Token</label>
              <input
                {...register('bookingId')}
                type="text"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-white transition-all text-center tracking-widest uppercase font-bold"
                placeholder="EX: A1B2C3"
              />
              {errors.bookingId && <p className="text-xs text-red-400 mt-1">{errors.bookingId.message}</p>}
            </div>
          )}

          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full py-4 gold-gradient text-black rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all transform active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Interested in joining? <Link to="/register" className="text-primary hover:text-accent font-semibold transition-colors">Apply Now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
