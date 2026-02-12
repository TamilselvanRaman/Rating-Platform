import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="bg-white p-12 rounded-2xl shadow-soft border border-slate-100 max-w-lg w-full">
        <h1 className="text-8xl font-bold text-primary-200 font-serif">404</h1>
        <h2 className="text-2xl font-bold text-slate-900 mt-6 font-serif">Page Not Found</h2>
        <p className="text-slate-500 mt-3 mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link 
            to="/" 
            className="btn-primary px-8 py-3 rounded-lg inline-flex items-center gap-2"
        >
            <Home className="h-4 w-4" />
            Return Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
