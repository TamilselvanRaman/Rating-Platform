import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, MapPin, Loader2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { register: registerUser, login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    try {
      await registerUser(data);
      await login(data.email, data.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
       {/* Left Side - Brand/Testimonial */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
         {/* Corporate Image Background with Ken Burns Effect */}
         <div className="absolute inset-0 overflow-hidden">
            <img 
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80" 
                alt="Corporate Meeting" 
                className="w-full h-full object-cover opacity-60 mix-blend-overlay animate-ken-burns"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/60 to-primary-900/30"></div>
        </div>
        
        <div className="relative z-10 p-16 max-w-xl text-white text-left">
            <div className="mb-10 p-3 bg-white/10 backdrop-blur-md w-fit rounded-2xl border border-white/10 shadow-xl animate-fade-in-up">
                <ShieldCheck className="h-8 w-8 text-secondary-400" />
            </div>
            <h2 className="text-5xl font-serif font-bold leading-tight mb-8 tracking-tight drop-shadow-sm animate-fade-in-up animate-delay-100">
                Start your journey with confidence.
            </h2>
            <p className="text-primary-100/90 text-xl leading-relaxed font-light animate-fade-in-up animate-delay-200">
                Create an account to access verified reviews and make smarter decisions. Your voice helps build a transparent community.
            </p>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full p-8">
          <div className="text-center mb-10 animate-fade-in-up">
            <div className="inline-flex items-center justify-center p-3 bg-secondary-50 rounded-xl mb-6 shadow-sm">
                <User className="h-6 w-6 text-secondary-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 font-serif mb-3">Create Account</h1>
            <p className="text-slate-500 text-lg">Join us in just a few steps</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm animate-fade-in-up">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2 animate-fade-in-up animate-delay-100">
              <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                <input
                  {...register('name', { 
                    required: 'Name is required',
                    minLength: { value: 20, message: 'Must be at least 20 characters' },
                    maxLength: { value: 60, message: 'Must be less than 60 characters' }
                  })}
                  type="text"
                  className="pl-12 input h-14 bg-slate-50 border-transparent hover:bg-slate-100 focus:bg-white focus:border-secondary-500 focus:ring-4 focus:ring-secondary-500/10 transition-all rounded-xl text-base"
                  placeholder="John Doe"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name.message}</p>}
            </div>

            <div className="space-y-2 animate-fade-in-up animate-delay-100">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                <input
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                  type="email"
                  className="pl-12 input h-14 bg-slate-50 border-transparent hover:bg-slate-100 focus:bg-white focus:border-secondary-500 focus:ring-4 focus:ring-secondary-500/10 transition-all rounded-xl text-base"
                  placeholder="name@company.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2 animate-fade-in-up animate-delay-200">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                <input
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 8, message: 'Min 8 chars' },
                    maxLength: { value: 16, message: 'Max 16 chars' },
                    pattern: {
                      value: /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).*$/,
                      message: '1 Uppercase + 1 Special Char required'
                    }
                  })}
                  type="password"
                  className="pl-12 input h-14 bg-slate-50 border-transparent hover:bg-slate-100 focus:bg-white focus:border-secondary-500 focus:ring-4 focus:ring-secondary-500/10 transition-all rounded-xl text-base"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
            </div>

            <div className="space-y-2 animate-fade-in-up animate-delay-200">
              <label className="text-sm font-bold text-slate-700 ml-1">Address (Optional)</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-4 h-5 w-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                <textarea
                  {...register('address', {
                    maxLength: { value: 400, message: 'Max 400 characters' }
                  })}
                  className="pl-12 input min-h-[100px] py-3 bg-slate-50 border-transparent hover:bg-slate-100 focus:bg-white focus:border-secondary-500 focus:ring-4 focus:ring-secondary-500/10 transition-all rounded-xl text-base resize-none"
                  placeholder="123 Corporate Blvd, Business City..."
                />
              </div>
              {errors.address && <p className="text-red-500 text-xs mt-1 ml-1">{errors.address.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary-900/20 hover:shadow-primary-900/30 hover:-translate-y-1 hover:scale-[1.01] transition-all mt-6 group bg-secondary-600 hover:bg-secondary-700 text-white animate-fade-in-up animate-delay-300"
            >
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-700 font-semibold hover:text-primary-800 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
