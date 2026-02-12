import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, MapPin, Loader2, AlertCircle, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

const AuthPage = () => {
    // -------------------------------------------------------------------------
    // STATE & HOOKS
    // -------------------------------------------------------------------------
    const location = useLocation();
    const navigate = useNavigate();
    const { login, register: registerUser } = useAuth();
    
    // Determine initial mode based on URL. Default to Login if /login or root.
    const [isLoginMode, setIsLoginMode] = useState(true);

    useEffect(() => {
        if (location.pathname === '/register') {
            setIsLoginMode(false);
        } else {
            setIsLoginMode(true);
        }
    }, [location.pathname]);

    // Separate forms to avoid collision
    const { 
        register: registerLogin, 
        handleSubmit: handleSubmitLogin, 
        formState: { errors: errorsLogin } 
    } = useForm();

    const { 
        register: registerReg, 
        handleSubmit: handleSubmitReg, 
        formState: { errors: errorsReg } 
    } = useForm();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // -------------------------------------------------------------------------
    // HANDLERS
    // -------------------------------------------------------------------------
    const handleLoginSubmit = async (data) => {
        setIsLoading(true); setError('');
        try {
            const user = await login(data.email, data.password);
            if (user.role === 'ADMIN') navigate('/admin');
            else if (user.role === 'STORE_OWNER') navigate('/store-owner');
            else navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid credentials. Please try again.');
        } finally { setIsLoading(false); }
    };

    const handleRegisterSubmit = async (data) => {
        setIsLoading(true); setError('');
        try {
            await registerUser(data);
            await login(data.email, data.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally { setIsLoading(false); }
    };

    const toggleMode = () => {
        const newMode = !isLoginMode;
        setIsLoginMode(newMode);
        // Update URL strictly for history/bookmarking, without reloading page
        window.history.pushState({}, '', newMode ? '/login' : '/register');
    };

    // -------------------------------------------------------------------------
    // RENDER
    // -------------------------------------------------------------------------
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 overflow-hidden">
            
            {/* 
                MAIN CONTAINER 
            */}
            <div className="bg-white rounded-[2rem] shadow-2xl relative overflow-hidden w-full max-w-[1000px] min-h-[600px] flex items-stretch">

                {/* 
                    LEFT SIDE PANEL
                    - Login Mode: Shows IMAGE/OVERLAY
                    - Register Mode: Shows FORM
                */}
                <div className="w-1/2 relative flex flex-col">
                    {isLoginMode ? (
                        // LOGIN MODE LEFT SIDE: TRUST IMAGE PANEL
                        <div className="flex-1 relative gradient-bg text-white flex flex-col items-center justify-center p-12 text-center h-full w-full">
                             <div className="absolute inset-0 z-0">
                                 <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80" alt="Corporate" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
                                 <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/60 to-primary-900/30"></div>
                             </div>
                             <div className="relative z-10">
                                 <CheckCircle2 className="h-12 w-12 text-secondary-400 mb-6 mx-auto" />
                                 <h2 className="text-4xl font-serif font-bold mb-4">Trustworthy Ratings</h2>
                                 <p className="text-primary-100 text-lg">Detailed reviews you can rely on.</p>
                             </div>
                        </div>
                    ) : (
                        // REGISTER MODE LEFT SIDE: REGISTER FORM
                        <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-white h-full w-full">
                             <div className="w-full max-w-sm">
                                <div className="text-center mb-6">
                                     <div className="inline-flex items-center justify-center p-3 bg-secondary-50 rounded-2xl mb-4 shadow-sm">
                                        <User className="h-6 w-6 text-secondary-600" />
                                    </div>
                                     <h1 className="text-3xl font-bold font-serif text-slate-900 mb-2 tracking-tight">Create Account</h1>
                                     <p className="text-slate-500 text-base">Join us in just a few steps</p>
                                </div>

                                {error && (
                                    <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-sm">
                                        <AlertCircle className="h-4 w-4" /> {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmitReg(handleRegisterSubmit)} className="space-y-3">
                                     <div className="space-y-1">
                                        <div className="relative group">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-secondary-600 transition-colors" />
                                            <input {...registerReg('name', { required: 'Name is required' })} type="text" className="pl-10 input h-11 bg-slate-50 border-transparent hover:bg-slate-100 focus:bg-white focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/10 transition-all rounded-xl text-sm w-full" placeholder="Full Name" />
                                        </div>
                                        {errorsReg.name && <p className="text-red-500 text-xs ml-1">{errorsReg.name.message}</p>}
                                    </div>

                                    <div className="space-y-1">
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-secondary-600 transition-colors" />
                                            <input {...registerReg('email', { required: 'Email required' })} type="email" className="pl-10 input h-11 bg-slate-50 border-transparent hover:bg-slate-100 focus:bg-white focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/10 transition-all rounded-xl text-sm w-full" placeholder="Email Address" />
                                        </div>
                                        {errorsReg.email && <p className="text-red-500 text-xs ml-1">{errorsReg.email.message}</p>}
                                    </div>

                                     <div className="space-y-1">
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-secondary-600 transition-colors" />
                                            <input {...registerReg('password', { required: 'Password required' })} type="password" className="pl-10 input h-11 bg-slate-50 border-transparent hover:bg-slate-100 focus:bg-white focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/10 transition-all rounded-xl text-sm w-full" placeholder="Password" />
                                        </div>
                                        {errorsReg.password && <p className="text-red-500 text-xs ml-1">{errorsReg.password.message}</p>}
                                    </div>

                                    <button type="submit" disabled={isLoading} className="w-full btn-primary h-12 text-base font-bold rounded-xl shadow-lg shadow-secondary-900/20 hover:shadow-secondary-900/30 hover:-translate-y-0.5 transition-all mt-4 group bg-secondary-600 hover:bg-secondary-700 text-white">
                                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Create Account'}
                                    </button>
                                </form>

                                <div className="mt-6 text-center">
                                    <button onClick={toggleMode} className="text-secondary-700 font-bold hover:underline text-sm">Sign In instead</button>
                                </div>
                             </div>
                        </div>
                    )}
                </div>


                {/* 
                    RIGHT SIDE PANEL
                    - Login Mode: Shows LOGIN FORM
                    - Register Mode: Shows IMAGE/OVERLAY
                */}
                <div className="w-1/2 relative flex flex-col">
                    {isLoginMode ? (
                        // LOGIN MODE RIGHT SIDE: LOGIN FORM
                        <div className="flex-1 flex items-center justify-center p-8 lg:p-12 bg-white h-full w-full">
                             <div className="w-full max-w-sm">
                                <div className="text-center mb-10">
                                     <div className="inline-flex items-center justify-center p-3 bg-primary-50 rounded-2xl mb-4 shadow-sm">
                                        <Lock className="h-6 w-6 text-primary-600" />
                                    </div>
                                     <h1 className="text-3xl font-bold font-serif text-slate-900 mb-2 tracking-tight">Welcome Back</h1>
                                     <p className="text-slate-500 text-base">Sign in to your dashboard</p>
                                </div>

                                {error && (
                                    <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm shadow-sm">
                                        <AlertCircle className="h-5 w-5 flex-shrink-0" /> {error}
                                    </div>
                                )}

                                <form onSubmit={handleSubmitLogin(handleLoginSubmit)} className="space-y-5">
                                     <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700 ml-1">Work Email</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                                            <input {...registerLogin('email', { required: 'Email required' })} type="email" className="pl-12 input h-12 bg-slate-50 border-transparent hover:bg-slate-100 focus:bg-white focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 transition-all rounded-xl text-base w-full" placeholder="name@company.com" />
                                        </div>
                                    </div>

                                     <div className="space-y-2">
                                        <div className="flex justify-between items-center px-1">
                                            <label className="text-sm font-bold text-slate-700">Password</label>
                                            <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-semibold">Forgot password?</a>
                                        </div>
                                        <div className="relative group">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-primary-600 transition-colors" />
                                            <input {...registerLogin('password', { required: 'Password required' })} type="password" className="pl-12 input h-12 bg-slate-50 border-transparent hover:bg-slate-100 focus:bg-white focus:border-primary-600 focus:ring-2 focus:ring-primary-600/10 transition-all rounded-xl text-base w-full" placeholder="••••••••" />
                                        </div>
                                    </div>

                                    <button type="submit" disabled={isLoading} className="w-full btn-primary h-12 text-lg font-bold rounded-xl shadow-lg shadow-primary-900/20 hover:shadow-primary-900/30 hover:-translate-y-0.5 transition-all mt-4 group">
                                        {isLoading ? <Loader2 className="h-6 w-6 animate-spin" /> : 'Sign In'}
                                    </button>
                                </form>

                                <div className="mt-8 text-center">
                                    <button onClick={toggleMode} className="text-primary-700 font-bold hover:underline text-sm">Create Account</button>
                                </div>
                             </div>
                        </div>
                    ) : (
                        // REGISTER MODE RIGHT SIDE: START JOURNEY IMAGE PANEL
                         <div className="flex-1 relative gradient-bg text-white flex flex-col items-center justify-center p-12 text-center h-full w-full">
                             <div className="absolute inset-0 z-0">
                                 <img src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80" alt="Meeting" className="w-full h-full object-cover opacity-60 mix-blend-overlay" />
                                 <div className="absolute inset-0 bg-gradient-to-t from-primary-900/90 via-primary-900/60 to-primary-900/30"></div>
                             </div>
                             <div className="relative z-10">
                                 <ShieldCheck className="h-12 w-12 text-secondary-400 mb-6 mx-auto" />
                                 <h2 className="text-4xl font-serif font-bold mb-4">Start Journey</h2>
                                 <p className="text-primary-100 text-lg">Join our verified community.</p>
                             </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default AuthPage;
