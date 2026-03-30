import { signOut } from '@/actions/auth';
import { getSession } from '@/lib/session';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { ProfileAvatarUpload } from '@/components/ProfileAvatarUpload';
import { ChangePasswordForm } from '@/components/ChangePasswordForm';

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) return null;

  const client = await clientPromise;
  const db = client.db('vibefit');
  
  const user = await db.collection('users').findOne({ _id: new ObjectId(session.userId) });

  return (
    <div className="min-h-screen p-6 pb-24 max-w-md mx-auto fade-in">
      <h1 className="text-3xl font-heading font-semibold text-foreground mb-6 mt-4">Profile</h1>
      <div className="bg-card p-8 rounded-[32px] shadow-sm flex flex-col items-center justify-center gap-4 border border-gray-100">
        
        <ProfileAvatarUpload currentAvatar={user?.avatar} />

        <div className="text-center mt-2">
            <h2 className="text-2xl font-heading font-semibold">{user?.name || 'New User'}</h2>
            <p className="text-gray-500 text-sm font-sans mt-0.5 tracking-wide">{user?.email}</p>
        </div>

        <ChangePasswordForm />

        <form action={signOut} className="w-full mt-4">
          <button 
            type="submit"
            className="w-full py-4 border-2 border-red-50 bg-red-50 text-red-500 rounded-[20px] font-semibold font-sans tracking-widest uppercase hover:bg-red-100 hover:border-red-100 transition-colors text-sm cursor-pointer shadow-sm"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  );
}
