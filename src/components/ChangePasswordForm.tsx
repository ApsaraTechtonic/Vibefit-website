'use client';

import { useState } from 'react';
import { updatePassword } from '@/actions/profile';
import { Lock, Check, AlertCircle } from 'lucide-react';

export function ChangePasswordForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('currentPassword', currentPassword);
    formData.append('newPassword', newPassword);

    const res = await updatePassword(formData);
    setLoading(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setIsOpen(false), 2000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Update failed.' });
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="mt-6 w-full py-3 px-4 bg-gray-50 text-gray-600 rounded-xl font-medium text-sm border border-gray-100 hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
      >
        <Lock size={16} /> 
        Change Account Password
      </button>
    );
  }

  return (
    <div className="mt-6 bg-white p-5 rounded-3xl border border-gray-100 shadow-sm animate-in slide-in-from-top-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-heading font-semibold text-lg text-gray-800">Change Password</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-400 text-sm hover:text-gray-600">Cancel</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 block">Current Password</label>
          <input 
            type="password" 
            required 
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-gray-100 transition-all text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 block">New Password</label>
          <input 
            type="password" 
            required 
            minLength={6}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-gray-100 transition-all text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1 block">Confirm New Password</label>
          <input 
            type="password" 
            required 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-gray-50 p-3 rounded-xl outline-none focus:ring-2 focus:ring-gray-100 transition-all text-sm"
          />
        </div>

        {message && (
          <div className={`p-3 rounded-xl text-xs font-medium flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
            {message.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
            {message.text}
          </div>
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold tracking-wide uppercase text-xs hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </button>
      </form>
    </div>
  );
}
