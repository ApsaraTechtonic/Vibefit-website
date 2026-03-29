'use client';

import { useRef, useState } from 'react';
import { updateProfilePicture } from '@/actions/profile';
import { Upload } from 'lucide-react';
import Image from 'next/image';

export function ProfileAvatarUpload({ currentAvatar }: { currentAvatar?: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('picture', file);

    const res = await updateProfilePicture(formData);
    if (res && 'error' in res && res.error) {
       alert(res.error);
    }
    setIsUploading(false);
  };

  return (
    <div className="relative group flex flex-col items-center">
      <div 
        className="w-24 h-24 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-full shadow-inner flex items-center justify-center text-indigo-400 overflow-hidden relative cursor-pointer" 
        onClick={() => fileRef.current?.click()}
      >
         {currentAvatar ? (
             <Image src={currentAvatar} alt="Profile" width={96} height={96} className="w-full h-full object-cover" />
         ) : (
           <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
         )}
         <div className={`absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${isUploading ? 'opacity-100' : ''}`}>
           <Upload size={20} className={`text-white ${isUploading ? 'animate-bounce' : ''}`} strokeWidth={2.5} />
         </div>
      </div>
      <input type="file" ref={fileRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400 mt-4">{isUploading ? 'Uploading...' : 'Tap to Change'}</span>
    </div>
  );
}
