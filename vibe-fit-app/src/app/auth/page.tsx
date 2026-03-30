'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/actions/auth';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const action = isLogin ? signIn : signUp;
    
    const result = await action(null, formData);
    
    if (result && 'error' in result && result.error) {
      setError(result.error);
    } else if (result && 'success' in result && result.success) {
      router.push('/');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center justify-center fade-in bg-background">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-heading font-bold text-foreground tracking-tight">VibeFit</h1>
          <p className="text-gray-500 font-sans mt-2">Your AI-Powered Fitness Companion</p>
        </div>

        <div className="bg-card p-8 rounded-[32px] shadow-sm border border-gray-100">
          <h2 className="text-xl font-heading font-semibold mb-6 text-center">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4 font-sans">
            {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
            
            {!isLogin && (
              <>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1 block">Full Name</label>
                  <input name="name" type="text" required placeholder="Mikki" className="w-full bg-gray-50/50 p-4 rounded-xl outline-none focus:bg-gray-100 transition-colors font-medium text-base border-2 border-transparent focus:border-gray-200" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1 block">Profile Picture</label>
                  <input name="picture" type="file" accept="image/*" className="w-full bg-gray-50/50 p-3 rounded-xl outline-none focus:bg-gray-100 transition-colors font-medium text-sm border-2 border-transparent focus:border-gray-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-gray-200 file:text-gray-700 hover:file:bg-gray-300" />
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1 block">Email</label>
              <input name="email" type="email" required placeholder="mikki@example.com" className="w-full bg-gray-50/50 p-4 rounded-xl outline-none focus:bg-gray-100 transition-colors font-medium text-base border-2 border-transparent focus:border-gray-200" />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1 block">Password</label>
              <input name="password" type="password" required placeholder="••••••••" minLength={6} className="w-full bg-gray-50/50 p-4 rounded-xl outline-none focus:bg-gray-100 transition-colors font-medium text-base border-2 border-transparent focus:border-gray-200" />
            </div>
            
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-6 bg-foreground text-background rounded-[20px] font-semibold tracking-widest uppercase hover:bg-gray-800 transition-colors hover:-translate-y-0.5 active:translate-y-0 shadow-lg text-sm disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="w-full mt-4 text-center text-sm font-sans text-gray-500 hover:text-gray-800 transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm font-sans text-gray-500">
          <span className="w-full h-px bg-gray-100"></span>
          <span className="shrink-0 uppercase tracking-widest text-xs font-semibold">Or</span>
          <span className="w-full h-px bg-gray-100"></span>
        </div>

        <button className="w-full py-4 mt-6 bg-white border border-gray-200 text-foreground rounded-[20px] font-semibold tracking-widest uppercase hover:bg-gray-50 transition-colors shadow-sm text-sm">
          {isLogin ? 'Sign In with Google' : 'Sign Up with Google'}
        </button>
      </div>
    </div>
  );
}
