import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    try {
      const user = await login(data.email, data.password);
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'STORE_OWNER') navigate('/store-owner');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
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
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80" 
                alt="Corporate Background" 
                className="w-full h-full object-cover opacity-60 mix-blend-overlay animate-ken-burns"
            />
            {/* Gradient Overlay for Text Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/60 to-primary-900/30"></div>
        </div>

        <div className="relative z-10 p-16 max-w-xl text-white">
            <div className="mb-10 p-3 bg-white/10 backdrop-blur-md w-fit rounded-2xl border border-white/10 shadow-xl animate-fade-in-up">
                <CheckCircle2 className="h-8 w-8 text-secondary-400" />
            </div>
            <h2 className="text-5xl font-serif font-bold leading-tight mb-8 tracking-tight drop-shadow-sm animate-fade-in-up animate-delay-100">
                Trustworthy ratings for <span className="text-secondary-400">verified</span> stores.
            </h2>
            <p className="text-primary-100/90 text-xl leading-relaxed font-light animate-fade-in-up animate-delay-200">
                Join thousands of users making informed decisions. We verify every review to ensure transparency and quality you can rely on.
            </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full p-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center justify-center p-3 bg-primary-50 rounded-xl mb-6 shadow-sm">
                <Lock className="h-6 w-6 text-primary-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 font-serif mb-3">Welcome Back</h1>
            <p className="text-slate-500 text-lg">Sign in to access your professional dashboard</p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm animate-fade-in-up">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2 animate-fade-in-up animate-delay-100">
              <label className="text-sm font-bold text-slate-700 ml-1">Work Email</label>
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
                  className="pl-12 input h-14 bg-slate-50 border-transparent hover:bg-slate-100 focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10 transition-all rounded-xl text-base"
                  placeholder="name@company.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2 animate-fade-in-up animate-delay-200">
              <div className="flex justify-between items-center px-1">
                  <label className="text-sm font-bold text-slate-700">Password</label>
                  <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-semibold">Forgot password?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                <input
                  {...register('password', { required: 'Password is required' })}
                  type="password"
                  className="pl-12 input h-14 bg-slate-50 border-transparent hover:bg-slate-100 focus:bg-white focus:border-primary-600 focus:ring-4 focus:ring-primary-600/10 transition-all rounded-xl text-base"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1 ml-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary h-14 text-lg font-bold rounded-xl shadow-lg shadow-primary-900/20 hover:shadow-primary-900/30 hover:-translate-y-1 hover:scale-[1.01] transition-all mt-4 group animate-fade-in-up animate-delay-300"
            >
              {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : (
                  <>
                    Sign In to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-700 font-semibold hover:text-primary-800 transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
