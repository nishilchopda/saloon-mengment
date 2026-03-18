import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Scissors, Star, Shield, Users, ArrowRight } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen bg-black overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -ml-64 -mb-64"></div>

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 glass sticky top-0 z-50 border-b border-white/5">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg neon-gold">
            <Scissors className="w-6 h-6 text-primary" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">MADHAV <span className="text-primary">SALON</span></span>
        </div>
        <div className="flex items-center space-x-8">
          {user ? (
            <Link
              to={user.role === 'super_admin' ? '/admin' : user.role === 'salon_owner' ? '/owner' : user.role === 'staff' ? '/staff' : '/customer'}
              className="px-6 py-2.5 gold-gradient text-black font-bold rounded-full hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all"
            >
              DASHBOARD
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-primary transition-colors">LOG IN</Link>
              <Link
                to="/register"
                className="px-6 py-2.5 gold-gradient text-black font-bold rounded-full hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all"
              >
                JOIN NOW
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-32 relative z-10">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 mb-8">
          <Star className="w-4 h-4 text-primary fill-primary" />
          <span className="text-xs font-bold tracking-widest text-primary">ELITE MANAGEMENT SYSTEM</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-none">
          DEFINE YOUR <br />
          <span className="text-transparent bg-clip-text gold-gradient">LEGACY</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mb-12 font-medium leading-relaxed">
          The ultimate multi-role management suite for luxury salon chains. 
          Precision control, high-end analytics, and seamless booking.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
          <Link
            to="/register"
            className="px-10 py-4 text-lg font-bold text-black gold-gradient rounded-full hover:scale-105 transition-all shadow-xl flex items-center group"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="px-10 py-4 text-lg font-bold text-white glass rounded-full hover:bg-white/10 transition-all border border-white/10">
            View Demo
          </button>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-20 border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
          <div className="flex justify-center font-black text-2xl italic">VOGUE</div>
          <div className="flex justify-center font-black text-2xl italic">GLAMOUR</div>
          <div className="flex justify-center font-black text-2xl italic">ELLE</div>
          <div className="flex justify-center font-black text-2xl italic">BAZAAR</div>
        </div>
      </section>

      {/* Role Features */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Shield className="text-primary" />}
            title="Super Admin"
            desc="Centralized control over salon chains, revenue tracking, and global settings."
          />
          <FeatureCard 
            icon={<Star className="text-primary" />}
            title="Salon Owner"
            desc="Manage your unique salon identity, staff performance, and custom services."
          />
          <FeatureCard 
            icon={<Users className="text-primary" />}
            title="Staff & Client"
            desc="Sleek interface for daily appointments and premium customer booking experience."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-white/5 text-center bg-black">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Scissors className="w-5 h-5 text-primary" />
          <span className="font-bold tracking-widest text-white text-sm">LUXE SALON SYSTEM</span>
        </div>
        <p className="text-gray-600 text-xs tracking-widest uppercase">
          © 2026 LUXE INTERNATIONAL. ALL RIGHTS RESERVED.
        </p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-10 glass rounded-3xl border border-white/5 hover:border-primary/20 transition-all group">
    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-8 group-hover:neon-gold transition-all">
      {React.cloneElement(icon, { size: 28 })}
    </div>
    <h3 className="text-2xl font-bold mb-4 text-white tracking-tight">{title}</h3>
    <p className="text-gray-400 leading-relaxed font-medium">
      {desc}
    </p>
  </div>
);

export default Home;
