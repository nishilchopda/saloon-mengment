import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['customer', 'salon_owner', 'staff']),
});

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = React.useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'customer'
    }
  });

  const onSubmit = async (data) => {
    try {
      const res = await registerUser(data);
      const role = res.user.role;
      if (role === 'super_admin') navigate('/admin');
      else if (role === 'salon_owner') navigate('/owner');
      else if (role === 'staff') navigate('/staff');
      else navigate('/customer');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -ml-48 -mb-48"></div>

      <div className="w-full max-w-md p-8 space-y-8 glass rounded-2xl border border-primary/20 shadow-2xl relative z-10">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-white">Join MADHAV SALON</h2>
          <p className="mt-2 text-sm text-gray-400">
            Premium Salon Experience
          </p>
        </div>
        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg text-center">
            {error}
          </div>
        )}
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-gray-300 ml-1">
              Full Name
            </label>
            <input
              {...register('name')}
              type="text"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-white transition-all"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 ml-1">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-white transition-all"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 ml-1">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-white transition-all"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 ml-1">
              I am a...
            </label>
            <select
              {...register('role')}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-white transition-all"
            >
              <option value="customer" className="bg-black">Customer</option>
              <option value="salon_owner" className="bg-black">Salon Owner</option>
              <option value="staff" className="bg-black">Staff</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-xs text-red-400">{errors.role.message}</p>
            )}
          </div>
          <button
            disabled={isSubmitting}
            type="submit"
            className="w-full py-4 gold-gradient text-black rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all transform active:scale-[0.98] disabled:opacity-50"
          >
            {isSubmitting ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <div className="text-center text-sm">
          <span className="text-gray-500">Already have an account? </span>
          <Link to="/login" className="text-primary hover:underline font-medium">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
